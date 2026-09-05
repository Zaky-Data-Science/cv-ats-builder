import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { isAdminEmail } from "@/lib/admin";
import { checkRateLimit, LIMITS, resetRateLimit } from "@/lib/rate-limit";

/**
 * Konfigurasi autentikasi (Auth.js v5).
 *
 * Strategi sesi: JWT.
 * Alasan: provider Credentials tidak mendukung sesi berbasis database di
 * Auth.js, sehingga memakai JWT membuat login email+password dan login Google
 * berjalan lewat satu mekanisme sesi yang sama. Baris User dan Account tetap
 * disimpan di Postgres, hanya penanda sesinya saja yang berupa cookie
 * bertanda tangan.
 */

/**
 * Tombol "Masuk dengan Google" hanya ditampilkan bila kredensialnya sudah
 * diisi, sehingga aplikasi tetap berjalan penuh sebelum Google OAuth disiapkan.
 */
export const googleEnabled = Boolean(
  process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET,
);

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const config: NextAuthConfig = {
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 30 },
  pages: { signIn: "/login", error: "/login" },
  trustHost: true,
  providers: [
    Credentials({
      name: "Email dan Kata Sandi",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Kata Sandi", type: "password" },
      },
      async authorize(raw) {
        const parsed = credentialsSchema.safeParse(raw);
        if (!parsed.success) return null;

        const email = parsed.data.email.trim().toLowerCase();

        // Pembatasan laju berdasarkan alamat email, bukan alamat IP.
        // Penebakan kata sandi menyasar satu akun tertentu, sementara alamat
        // IP mudah diganti-ganti oleh penyerang.
        const limitKey = `login:${email}`;
        const limit = await checkRateLimit({ key: limitKey, ...LIMITS.login });
        if (!limit.allowed) return null;

        const user = await prisma.user.findUnique({ where: { email } });

        // Akun yang dibuat lewat Google tidak punya passwordHash.
        if (!user?.passwordHash) return null;

        const valid = await bcrypt.compare(
          parsed.data.password,
          user.passwordHash,
        );
        if (!valid) return null;

        // Percobaan yang berhasil mengosongkan penghitung, agar pengguna sah
        // yang sempat salah ketik beberapa kali tidak terkunci setelahnya.
        await resetRateLimit(limitKey);

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image || null,
        };
      },
    }),
    ...(googleEnabled
      ? [
          Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
            allowDangerousEmailAccountLinking: false,
          }),
        ]
      : []),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider !== "google") return true;

      // Penautan otomatis ke akun beremail sama hanya boleh dilakukan jika
      // Google sudah memverifikasi kepemilikan email tersebut. Tanpa
      // pemeriksaan ini, siapa pun yang membuat akun Google dengan alamat
      // email korban berpotensi mengambil alih akun.
      if (profile && profile.email_verified === false) return false;

      const email = user.email?.trim().toLowerCase();
      if (!email) return false;

      const dbUser = await prisma.user.upsert({
        where: { email },
        update: {
          image: user.image ?? undefined,
          emailVerified: new Date(),
        },
        create: {
          email,
          name: user.name ?? "",
          image: user.image ?? "",
          emailVerified: new Date(),
        },
      });

      await prisma.account.upsert({
        where: {
          provider_providerAccountId: {
            provider: "google",
            providerAccountId: account.providerAccountId,
          },
        },
        update: { userId: dbUser.id },
        create: {
          provider: "google",
          providerAccountId: account.providerAccountId,
          userId: dbUser.id,
        },
      });

      // Diteruskan ke callback jwt agar token memakai id User lokal,
      // bukan id milik Google.
      user.id = dbUser.id;
      return true;
    },

    async jwt({ token, user }) {
      if (user?.id) {
        token.uid = user.id;
      } else if (!token.uid && token.email) {
        const found = await prisma.user.findUnique({
          where: { email: token.email },
          select: { id: true },
        });
        if (found) token.uid = found.id;
      }

      /*
        Peran pengelola dihitung di sini, dari alamat surel yang sudah ada di
        token, dan disimpan sebagai penanda biasa.

        Alamatnya tidak pernah ditulis di dalam kode - ia dibaca dari
        `ADMIN_EMAIL`. Menulisnya di kode berarti alamat pribadi ikut ke
        repositori publik, dan menggantinya menuntut deploy ulang.

        Dihitung ulang setiap token disegarkan, bukan sekali saat masuk:
        mencabut peran cukup dengan mengubah variabelnya, tanpa perlu memaksa
        siapa pun keluar dan masuk lagi.

        Penanda ini kemudahan tampilan, BUKAN pengamanan. Setiap halaman dan
        setiap aksi memeriksa ulang perannya sendiri di server - lihat
        `requireAdmin` di lib/guard.ts.
      */
      token.admin = isAdminEmail(token.email);
      return token;
    },

    async session({ session, token }) {
      if (token.uid && session.user) {
        session.user.id = token.uid as string;
        session.user.admin = token.admin === true;
      }
      return session;
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(config);

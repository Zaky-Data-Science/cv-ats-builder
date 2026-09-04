import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { errorResponse, HttpError } from "@/lib/guard";
import { isMailConfigured, passwordResetEmail, sendMail } from "@/lib/mail";
import {
  createResetToken,
  hashResetToken,
  RESET_TTL_MINUTES,
} from "@/lib/password-reset";
import { revokeUserTokens } from "@/lib/password-reset-store";
import { checkRateLimit, LIMITS } from "@/lib/rate-limit";
import { forgotPasswordSchema } from "@/lib/resume/schema";

/**
 * Meminta tautan pemulihan kata sandi.
 *
 * ## Jawabannya selalu sama
 *
 * Berhasil atau tidak, yang dikembalikan `{ sent: true }`. Membedakan
 * "terkirim" dari "email tidak terdaftar" akan mengubah titik akhir ini
 * menjadi alat pemeriksa keanggotaan: siapa pun dapat mencoba ribuan alamat
 * dan mengetahui persis siapa saja yang punya akun di sini. Itu data pribadi,
 * dan bukan milik siapa pun yang kebetulan menebak.
 *
 * Konsekuensinya diterima dengan sadar: seseorang yang salah mengetik
 * alamatnya sendiri akan menunggu surel yang tidak pernah datang. Halaman
 * yang memanggil titik akhir ini karena itu menyebutkan kemungkinan itu
 * secara eksplisit, alih-alih sekadar berkata "sudah dikirim".
 *
 * ## Akun Google tetap dilayani diam-diam
 *
 * Akun yang dibuat lewat Google belum punya kata sandi. Permintaannya tidak
 * ditolak dengan pesan khusus - itu akan membocorkan cara masuk seseorang -
 * melainkan tetap dikirimi tautan. Menyetel kata sandi lewat tautan itu
 * menambahkan cara masuk kedua, persis seperti membuatnya di halaman
 * Pengaturan.
 */
export async function POST(request: Request) {
  try {
    if (!isMailConfigured()) {
      throw new HttpError(
        503,
        "Pengiriman surel belum aktif pada pemasangan ini.",
      );
    }

    const body = await request.json().catch(() => ({}));
    const { email, locale } = forgotPasswordSchema.parse(body);
    const normalizedEmail = email.trim().toLowerCase();

    /*
      Dibatasi per alamat email, bukan per IP. Yang dijaga di sini bukan
      penebakan kata sandi melainkan pengiriman surel: tanpa batas per alamat,
      kotak masuk orang lain dapat dibanjiri dari banyak IP sekaligus, dan
      yang menanggung akibatnya adalah reputasi alamat pengirim aplikasi ini.
    */
    const limit = await checkRateLimit({
      key: `forgot:${normalizedEmail}`,
      ...LIMITS.forgot,
    });
    if (!limit.allowed) {
      throw new HttpError(
        429,
        `Terlalu banyak permintaan untuk alamat ini. Coba lagi dalam ${Math.ceil(
          limit.retryAfterSeconds / 60,
        )} menit.`,
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: { id: true },
    });

    if (user) {
      // Tiket lama dibatalkan lebih dulu: begitu tautan baru diminta, yang
      // lama harus berhenti berlaku - kalau tidak, setiap permintaan
      // menambah satu lagi tautan hidup ke kotak masuk yang sama.
      await revokeUserTokens(user.id);

      const token = createResetToken();
      await prisma.passwordResetToken.create({
        data: {
          tokenHash: hashResetToken(token),
          userId: user.id,
          expiresAt: new Date(Date.now() + RESET_TTL_MINUTES * 60 * 1000),
        },
      });

      const url = `${baseUrl(request)}/atur-sandi?token=${token}`;
      const surel = passwordResetEmail(locale, url, RESET_TTL_MINUTES);
      await sendMail({ to: normalizedEmail, ...surel });
    }

    return NextResponse.json({ sent: true });
  } catch (error) {
    return errorResponse(error);
  }
}

/**
 * Alamat dasar untuk menyusun tautan di dalam surel.
 *
 * `NEXTAUTH_URL` didahulukan karena itulah alamat yang memang disetel untuk
 * pemasangan ini. Header `origin` dipakai sebagai cadangan saat menjalankan
 * secara lokal, tempat variabel itu kerap belum diisi.
 *
 * Yang sengaja **tidak** dipakai: header `host` dari permintaan begitu saja.
 * Header itu dikirim peramban dan dapat dipalsukan, dan tautan pemulihan yang
 * menunjuk ke alamat pilihan penyerang adalah tepat cara mencuri akun.
 */
function baseUrl(request: Request): string {
  const configured = process.env.NEXTAUTH_URL?.replace(/\/+$/, "");
  if (configured) return configured;

  const origin = new URL(request.url).origin;
  return origin.replace(/\/+$/, "");
}

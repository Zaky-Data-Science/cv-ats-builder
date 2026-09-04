import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { errorResponse, HttpError } from "@/lib/guard";
import { findResetToken } from "@/lib/password-reset-store";
import { checkRateLimit, clientIp, LIMITS } from "@/lib/rate-limit";
import { resetPasswordSchema } from "@/lib/resume/schema";

/** Sama dengan pendaftaran - lihat alasannya di api/auth/register/route.ts. */
const BCRYPT_ROUNDS = 12;

/**
 * Menyetel kata sandi baru memakai tautan pemulihan.
 *
 * Kata sandi baru dan penandaan tiket "sudah dipakai" ditulis dalam satu
 * transaksi. Bila keduanya terpisah dan yang kedua gagal, tautan yang sama
 * tetap dapat dipakai lagi - dan tautan pemulihan yang berlaku berkali-kali
 * persis yang hendak dicegah oleh keberadaan kolom `usedAt`.
 */
export async function POST(request: Request) {
  try {
    // Dibatasi per IP: token-nya sendiri tidak mungkin ditebak, tetapi
    // pembatasan ini menutup percobaan menembaki titik akhir dengan token
    // acak dalam jumlah besar.
    const limit = await checkRateLimit({
      key: `reset:${clientIp(request)}`,
      ...LIMITS.reset,
    });
    if (!limit.allowed) {
      throw new HttpError(
        429,
        `Terlalu banyak percobaan. Coba lagi dalam ${Math.ceil(
          limit.retryAfterSeconds / 60,
        )} menit.`,
      );
    }

    const body = await request.json().catch(() => ({}));
    const { token, password } = resetPasswordSchema.parse(body);

    const found = await findResetToken(token);
    if (!found.ok) {
      throw new HttpError(400, alasan(found.reason));
    }

    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: found.userId },
        data: { passwordHash },
      }),
      prisma.passwordResetToken.update({
        where: { id: found.tokenId },
        data: { usedAt: new Date() },
      }),
      // Tiket lain milik pengguna yang sama ikut ditutup. Bila seseorang
      // sempat meminta tautan berkali-kali, hanya yang barusan dipakai yang
      // boleh pernah berlaku.
      prisma.passwordResetToken.updateMany({
        where: { userId: found.userId, usedAt: null },
        data: { usedAt: new Date() },
      }),
    ]);

    return NextResponse.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}

/**
 * Pesan untuk tiap sebab penolakan.
 *
 * Ketiganya dibedakan karena jalan keluarnya berbeda - yang kedaluwarsa cukup
 * meminta tautan baru, sedangkan yang sudah terpakai berarti kata sandinya
 * mungkin sudah berhasil diganti sebelumnya. Tidak satu pun di antaranya
 * membocorkan sesuatu: seseorang yang memegang tautan itu sudah tahu tautan
 * itu pernah ada.
 */
function alasan(reason: "unknown" | "expired" | "used"): string {
  if (reason === "expired") {
    return "Tautan ini sudah lewat masa berlakunya. Minta tautan baru dari halaman masuk.";
  }
  if (reason === "used") {
    return "Tautan ini sudah pernah dipakai. Kalau kata sandi Anda belum sempat berganti, minta tautan baru.";
  }
  return "Tautan ini tidak berlaku. Pastikan alamatnya tersalin utuh, atau minta tautan baru.";
}

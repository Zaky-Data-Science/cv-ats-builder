import { prisma } from "@/lib/db";
import { hashResetToken, sameHash } from "@/lib/password-reset";

/**
 * Kueri basis data untuk tiket pemulihan kata sandi.
 *
 * Terpisah dari `password-reset.ts` yang memuat kriptografinya - lihat alasan
 * lengkapnya di kepala berkas itu. Ringkasnya: berkas ini mengimpor klien
 * Prisma, dan apa pun yang mengimpornya menjadi tidak dapat dijalankan tanpa
 * basis data.
 */

export type ResetLookup =
  | { ok: true; userId: string; tokenId: string }
  | { ok: false; reason: "unknown" | "expired" | "used" };

/**
 * Mencari tiket yang cocok dan memutuskan apakah ia masih sah.
 *
 * Alasan penolakan dibedakan - tidak dikenal, kedaluwarsa, sudah dipakai -
 * karena ketiganya menuntut jalan keluar yang berbeda bagi pengguna, dan
 * ketiganya sama-sama tidak membocorkan apa pun: seseorang yang memegang
 * tautannya sudah tahu tautan itu ada.
 */
export async function findResetToken(token: string): Promise<ResetLookup> {
  const tokenHash = hashResetToken(token);

  const row = await prisma.passwordResetToken.findUnique({
    where: { tokenHash },
    select: {
      id: true,
      userId: true,
      tokenHash: true,
      expiresAt: true,
      usedAt: true,
    },
  });

  if (!row || !sameHash(row.tokenHash, tokenHash)) {
    return { ok: false, reason: "unknown" };
  }
  if (row.usedAt) return { ok: false, reason: "used" };
  if (row.expiresAt <= new Date()) return { ok: false, reason: "expired" };

  return { ok: true, userId: row.userId, tokenId: row.id };
}

/**
 * Membatalkan seluruh tiket milik satu pengguna yang belum terpakai.
 *
 * Dipanggil sebelum menerbitkan tiket baru, dan sesudah kata sandi berhasil
 * diganti. Yang pertama membuat surel lama berhenti berlaku begitu yang baru
 * diminta; yang kedua menutup tautan yang mungkin sudah terlanjur dikirim ke
 * kotak masuk yang tidak lagi dipegang pemiliknya.
 */
export async function revokeUserTokens(userId: string): Promise<void> {
  await prisma.passwordResetToken.updateMany({
    where: { userId, usedAt: null },
    data: { usedAt: new Date() },
  });
}

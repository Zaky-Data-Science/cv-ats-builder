import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

/**
 * Tiket sekali pakai untuk menyetel ulang kata sandi.
 *
 * Berkas ini memuat satu-satunya tempat token dibuat dan diperiksa, sehingga
 * kedua sisinya tidak mungkin memakai aturan yang berbeda - dan aturannya
 * memang beberapa: cukup panjang, disimpan sebagai hash, berumur pendek, dan
 * hanya sah sekali.
 *
 * Isinya sengaja **tidak menyentuh basis data sama sekali**. Kueri yang
 * mencari dan membatalkan tiket ada di `password-reset-store.ts`, dan
 * pemisahan itu bukan sekadar kerapian: mengimpor klien Prisma akan membuat
 * berkas ini menuntut koneksi basis data begitu dimuat, sehingga seluruh
 * pemeriksaan di sini - panjang token, hash-nya, keacakannya - tidak lagi
 * dapat dijalankan tanpa server. Bagian yang paling pantas diuji justru
 * bagian ini.
 */

/**
 * Umur tautan.
 *
 * Tiga puluh menit: cukup untuk membuka kotak masuk di ponsel dan mengetik
 * kata sandi baru dengan tenang, tetapi tidak cukup lama untuk membuat surel
 * lama yang tertinggal di kotak masuk bersama tetap dapat dipakai berhari-hari
 * kemudian.
 */
export const RESET_TTL_MINUTES = 30;

/**
 * 32 byte acak, ditulis sebagai 64 karakter heksadesimal.
 *
 * Diambil dari `randomBytes`, bukan `Math.random()`: yang terakhir dapat
 * diperkirakan bila cukup banyak keluarannya terlihat, dan seluruh keamanan
 * tautan ini bersandar pada tidak dapat ditebaknya nilai ini.
 */
export function createResetToken(): string {
  return randomBytes(32).toString("hex");
}

/** SHA-256 dari token, dalam heksadesimal. Inilah yang masuk basis data. */
export function hashResetToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/**
 * Membandingkan dua hash tanpa membocorkan lewat lamanya perbandingan.
 *
 * Perbandingan untaian biasa berhenti pada karakter pertama yang berbeda,
 * sehingga lamanya menjawab menyingkap berapa karakter awal yang sudah benar.
 * Di sini nilainya memang dicari lewat indeks basis data - tetapi fungsi ini
 * dipakai pada langkah terakhir, dan langkah terakhir tidak pantas menjadi
 * satu-satunya yang lengah.
 */
export function sameHash(a: string, b: string): boolean {
  const bufA = Buffer.from(a, "utf8");
  const bufB = Buffer.from(b, "utf8");
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

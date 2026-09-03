/**
 * Mengenali galat yang berasal dari sesi yang menunjuk pengguna yang sudah
 * tidak ada lagi di basis data.
 *
 * Sesi disimpan sebagai JWT, bukan sebagai baris di basis data - alasannya ada
 * di `src/auth.ts`. Konsekuensinya, token tetap sah dan tetap memuat id
 * pengguna meskipun baris penggunanya sudah lenyap. Itu bukan keadaan
 * mengada-ada:
 *
 *  - Aplikasi ini menyediakan penghapusan akun. Tab lain yang masih terbuka
 *    akan terus mengirim token lama sampai masa berlakunya habis - 30 hari.
 *  - Pada pengembangan lokal, basis data yang dibuat ulang menimbulkan keadaan
 *    yang sama persis.
 *
 * Tanpa pengenalan ini, setiap tindakan berujung pada pelanggaran kunci asing
 * yang sampai ke layar sebagai "Terjadi kesalahan pada server" - pesan yang
 * tidak memberi tahu apa pun, dan menyesatkan, sebab servernya justru bekerja
 * dengan benar. Yang keliru adalah sesinya, dan satu-satunya jalan keluar
 * adalah masuk kembali.
 *
 * Berkas ini sengaja berdiri sendiri tanpa mengimpor apa pun, sehingga dapat
 * diuji tanpa menyalakan Auth.js maupun basis data.
 */

/** Kode galat Prisma yang dapat berarti pengguna pada sesi sudah tidak ada. */
const FOREIGN_KEY_VIOLATION = "P2003";
const RECORD_NOT_FOUND = "P2025";

export function isStaleSessionError(error: unknown): boolean {
  if (typeof error !== "object" || error === null) return false;

  const code = (error as { code?: unknown }).code;
  if (typeof code !== "string") return false;

  const message = String((error as { message?: unknown }).message ?? "");

  // Kunci asing dilanggar saat menulis baris baru milik pengguna yang barisnya
  // sudah tidak ada. Nama kolomnya ikut diperiksa supaya pelanggaran kunci
  // asing yang lain - misalnya entri yang menunjuk CV yang sudah terhapus -
  // tidak ikut disalahartikan sebagai sesi kedaluwarsa.
  if (code === FOREIGN_KEY_VIOLATION) return /userid/i.test(message);

  if (code === RECORD_NOT_FOUND) return /\buser\b/i.test(message);

  return false;
}

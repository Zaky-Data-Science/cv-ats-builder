/**
 * ============================================================================
 *  PENANDA PENGELOLA
 * ============================================================================
 *
 * Berdiri sebagai berkas tersendiri, bukan di dalam `auth.ts`, dengan satu
 * alasan yang jelas: berkas ini tidak mengimpor apa pun.
 *
 * `auth.ts` menarik klien basis data, dan klien itu menolak dimuat tanpa
 * `DATABASE_URL`. Selama keputusan "siapa pengelola" tinggal di sana, ia tidak
 * dapat diuji tanpa menyalakan basis data lebih dulu - padahal seluruh berkas
 * uji di proyek ini sengaja berjalan tanpa server maupun basis data.
 *
 * Aturan yang dijaga di sini kecil tetapi menentukan: keliru menerima berarti
 * membuka daftar alamat surel seluruh pengguna kepada orang yang salah.
 */

/**
 * Apakah sebuah alamat surel adalah pengelola.
 *
 * Dibandingkan setelah dirapikan huruf besar-kecil dan spasi tepinya. Bagian
 * domain sebuah alamat surel memang tidak peka huruf, dan hampir seluruh
 * penyedia memperlakukan bagian namanya begitu juga; tanpa perataan ini, satu
 * huruf kapital di `.env` membuat panelnya tidak pernah terbuka dan sebabnya
 * nyaris mustahil ditebak dari layar.
 *
 * Bila `ADMIN_EMAIL` kosong atau berisi spasi saja, **tidak ada seorang pun**
 * yang menjadi pengelola. Bawaan itu dipilih dengan sadar: pemasangan yang
 * lupa mengisinya, atau variabel yang gagal termuat, tidak boleh diam-diam
 * memberi akses kepada siapa pun.
 */
export function isAdminEmail(email?: string | null): boolean {
  const admin = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (!admin) return false;
  return email?.trim().toLowerCase() === admin;
}

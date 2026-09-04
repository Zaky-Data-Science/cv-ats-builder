import { NextResponse, type NextRequest } from "next/server";

/**
 * Pengalihan awal untuk halaman yang memerlukan login.
 *
 * PENTING - ini bukan lapisan keamanan.
 *
 * Yang diperiksa di sini hanya *keberadaan* cookie sesi, bukan keabsahannya.
 * Cookie palsu akan lolos dari pemeriksaan ini. Keamanan sesungguhnya tetap
 * berada di dua tempat lain yang memverifikasi tanda tangan sesi dan
 * kepemilikan data pada setiap permintaan:
 *
 *   - `src/app/(app)/layout.tsx` beserta tiap halaman, lewat `auth()`
 *   - `src/lib/guard.ts` pada seluruh handler API
 *
 * Lalu untuk apa berkas ini? Tanpa pengalihan awal, permintaan ke halaman
 * terlindungi akan sempat mengalirkan kerangka pemuatan lebih dulu dan
 * membalas dengan status 200, baru kemudian dialihkan lewat aliran data.
 * Isinya memang tidak pernah bocor, tetapi status 200 pada halaman yang
 * seharusnya tertutup menyesatkan saat ditinjau. Dengan berkas ini,
 * pengunjung yang belum masuk memperoleh 307 yang tegas ke halaman masuk -
 * lebih cepat bagi pengguna sekaligus lebih jujur saat diperiksa.
 *
 * Pemeriksaannya sengaja dibuat sesederhana ini - satu keberadaan cookie,
 * tanpa satu pun kueri - supaya ia tetap murah di mana pun ia berjalan.
 * Next 16 menjalankan berkas ini di runtime Node, bukan lagi edge seperti
 * dulu, tetapi alasan aslinya tidak berubah: berkas ini berjalan di depan
 * *setiap* permintaan ke halaman terlindungi, dan yang berjalan sesering itu
 * tidak boleh menyentuh basis data.
 *
 * Namanya `proxy`, bukan `middleware`. Next 16 mengganti nama konvensi
 * berkasnya - isinya sama persis, hanya nama berkas dan nama fungsinya yang
 * berubah. Yang lama masih bekerja tetapi sudah usang, dan memperingatkan
 * setiap kali server dinyalakan.
 */

/** Nama cookie sesi Auth.js: tanpa awalan di HTTP, berawalan di HTTPS. */
const SESSION_COOKIES = [
  "authjs.session-token",
  "__Secure-authjs.session-token",
];

export function proxy(request: NextRequest) {
  const hasSessionCookie = SESSION_COOKIES.some((name) =>
    request.cookies.has(name),
  );

  if (hasSessionCookie) return NextResponse.next();

  const target = request.nextUrl.clone();
  target.pathname = "/login";
  target.search = "";
  return NextResponse.redirect(target);
}

export const config = {
  matcher: ["/dashboard/:path*", "/settings/:path*", "/resume/:path*"],
};

import type { NextConfig } from "next";

const isProduction = process.env.NODE_ENV === "production";

/**
 * Header keamanan.
 *
 * Dipasang di lapisan kerangka kerja, bukan di tiap halaman, agar tidak ada
 * rute yang terlewat saat halaman baru ditambahkan kemudian.
 */
const securityHeaders = [
  {
    // Membatasi penyematan halaman ini di dalam bingkai milik situs lain,
    // sehingga tidak dapat dipakai untuk clickjacking. Memakai SAMEORIGIN
    // dan bukan DENY karena tombol Unduh PDF memuat halaman cetak di dalam
    // iframe pada domain yang sama.
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    // Melarang peramban menebak-nebak jenis berkas dari isinya. Penting
    // karena aplikasi ini menyajikan unduhan .docx dan .json.
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    // Alamat halaman tidak dikirim utuh ke situs lain. Alamat editor memuat
    // id CV, yang tidak perlu bocor ke pihak ketiga.
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    // Aplikasi ini tidak membutuhkan satu pun perangkat keras peramban.
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
];

if (isProduction) {
  securityHeaders.push({
    // Memaksa seluruh kunjungan berikutnya memakai HTTPS.
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  });
}

/**
 * Kebijakan sumber konten.
 *
 * 'unsafe-inline' pada script-src masih diperlukan karena Next.js menyisipkan
 * skrip bootstrap sebaris untuk proses hidrasi. Menghapusnya menuntut
 * penerapan nonce di seluruh berkas, yang berada di luar cakupan versi ini -
 * keterbatasan ini dicatat terbuka pada dokumentasi teknis.
 *
 * img-src mengizinkan sumber HTTPS mana pun karena pas foto pada CV
 * ditambahkan pengguna berupa tautan gambar.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isProduction ? "" : " 'unsafe-eval'"}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self'",
  // pdf.js menjalankan penguraian PDF di dalam Web Worker. Berkas worker-nya
  // dilayani dari domain sendiri; blob: disertakan karena sebagian jalur
  // fallback pdf.js membungkus worker-nya sebagai blob.
  "worker-src 'self' blob:",
  "frame-src 'self'",
  "frame-ancestors 'self'",
  "form-action 'self'",
  "base-uri 'self'",
  "object-src 'none'",
]
  .filter(Boolean)
  .join("; ");

const nextConfig: NextConfig = {
  // Saat pengembangan, aplikasi kerap dibuka lewat 127.0.0.1 atau alamat LAN
  // (misalnya untuk mencobanya dari ponsel). Tanpa daftar ini Next memblokir
  // permintaan ke sumber daya dev-nya sendiri dari host tersebut, sehingga
  // JavaScript sisi klien gagal terhidrasi dan form tampak tidak berfungsi.
  // Daftar ini hanya berlaku pada mode pengembangan.
  allowedDevOrigins: ["127.0.0.1", "localhost", "192.168.56.1"],

  // Menyembunyikan header X-Powered-By yang membocorkan kerangka kerja
  // beserta versinya.
  poweredByHeader: false,

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          ...securityHeaders,
          { key: "Content-Security-Policy", value: contentSecurityPolicy },
        ],
      },
    ];
  },
};

export default nextConfig;

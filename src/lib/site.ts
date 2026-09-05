/**
 * Identitas aplikasi dan pembuatnya.
 *
 * Dikumpulkan di satu berkas agar nama, institusi, dan deskripsi cukup
 * diubah di satu tempat - dipakai oleh footer, halaman Tentang, metadata
 * halaman, dan properti dokumen berkas yang diunduh.
 */

import type { Locale } from "@/lib/i18n/config";

export const SITE = {
  name: "CV ATS Builder",
  tagline: "Susun CV yang terbaca mesin perekrut",
  description:
    "Aplikasi web untuk menyusun CV ramah ATS lewat field terstruktur, dengan pratinjau langsung, penilaian otomatis beserta saran perbaikan, dan penyimpanan permanen sehingga dapat diedit kapan saja.",
} as const;

/** Judul dan deskripsi situs untuk metadata, mengikuti bahasa antarmuka. */
export const SITE_META: Record<
  Locale,
  { tagline: string; description: string; keywords: string[] }
> = {
  id: {
    tagline: SITE.tagline,
    description: SITE.description,
    keywords: [
      "CV ATS",
      "pembuat CV",
      "CV ATS friendly",
      "resume builder Indonesia",
      "contoh CV",
      "template CV ATS",
      "skor ATS",
      "bandingkan CV",
    ],
  },
  en: {
    tagline: "Build a CV that recruiting software can actually read",
    description:
      "A web app for building ATS-friendly CVs from structured fields, with a live preview, automatic scoring and improvement suggestions, and permanent storage so you can edit it any time.",
    keywords: [
      "ATS CV",
      "ATS resume checker",
      "resume builder",
      "ATS friendly CV template",
      "CV score",
      "compare resumes",
    ],
  },
};

/**
 * Identitas pembuat.
 *
 * Sengaja hanya identitas - tanpa keterangan "tugas akhir" atau nama mata
 * kuliah. Aplikasinya dipakai orang sungguhan untuk melamar kerja, dan
 * keterangan bahwa ini pekerjaan kampus membuatnya terbaca sebagai purwarupa
 * yang belum tentu bertahan, padahal datanya tersimpan permanen.
 */
export const AUTHOR = {
  name: "Muhammad Agus Riyadh Zaky",
  role: "Prodi D3 Teknik Komputer",
  department: "Jurusan Teknologi Informasi",
  institution: "Politeknik Negeri Samarinda",

  /**
   * Rantai lengkap: nama, prodi, jurusan, kampus.
   *
   * Dipakai di tempat yang memang menyatakan kepengarangan secara formal -
   * halaman Tentang, kaki halaman, Ketentuan, dan Privasi.
   */
  full:
    "Muhammad Agus Riyadh Zaky, Prodi D3 Teknik Komputer, Jurusan Teknologi Informasi, Politeknik Negeri Samarinda",

  /**
   * Bentuk pendek untuk kredit yang lewat sambil lalu, mis. di panel samping
   * penyunting. Rantai lengkap di sana lebarnya cuma 11px dan patah jadi tiga
   * baris di tengah alat kerja - terbaca seperti tanda tangan yang nyasar,
   * bukan keterangan pembuat.
   *
   * Baik `full` maupun `credit` **tidak pernah** ikut ke berkas CV yang
   * diunduh. Itu bukan kelalaian melainkan janji yang tertulis di FAQ dan di
   * salinan halaman depan: dokumen yang diunduh isinya murni data penggunanya.
   */
  credit: "Muhammad Agus Riyadh Zaky",

  /**
   * Kontak pengelola.
   *
   * Dikumpulkan di sini, bukan ditulis ulang di tiap halaman - sebelumnya
   * alamat surelnya tertanam sebagai tetapan lokal di halaman Privasi saja,
   * sehingga halaman lain tidak punya cara menyebutkannya tanpa menyalin.
   *
   * Nomor WhatsApp disimpan dua bentuk: `whatsapp` untuk dibaca manusia, dan
   * `whatsappUrl` dalam format internasional tanpa nol depan, karena wa.me
   * hanya menerima bentuk itu.
   */
  email: "riyadhzaky05@gmail.com",
  whatsapp: "0852-5726-9750",
  whatsappUrl: "https://wa.me/6285257269750",
} as const;

/**
 * Tahun pembuatan. Ditulis tetap, bukan `new Date().getFullYear()`, supaya
 * teks yang dirender di server dan di peramban selalu sama - perbedaan tahun
 * di antara keduanya dapat memicu galat hidrasi React.
 */
export const YEAR = 2026;

/**
 * Alamat dasar aplikasi.
 *
 * Dipakai peta situs, aturan perayap, dan alamat gambar pratinjau tautan -
 * ketiganya menuntut alamat mutlak, bukan relatif. Vercel menyediakan
 * VERCEL_PROJECT_PRODUCTION_URL secara otomatis, sehingga alamat production
 * tidak perlu ditulis manual dan tidak ikut salah saat domain berubah.
 */
export function baseUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/+$/, "");

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;

  return "http://localhost:3000";
}

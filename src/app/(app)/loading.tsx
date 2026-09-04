"use client";

import { useI18n } from "@/components/i18n";

/**
 * Tampilan sementara saat halaman sedang disiapkan server.
 *
 * Memakai kerangka bentuk (skeleton), bukan pemutar berputar, karena bentuk
 * yang menyerupai isi halaman membuat perpindahan terasa lebih singkat dan
 * tidak menimbulkan lompatan tata letak saat isinya muncul.
 *
 * ## Kenapa berkas ini pindah ke sini pada sesi 10
 *
 * Sebelumnya ia berada di `src/app/`, dan di sana ia berlaku bagi **seluruh**
 * halaman - termasuk halaman depan, panduan, dan tentang.
 *
 * Sebuah `loading.tsx` membuat Next.js membungkus halamannya dalam batas
 * Suspense, dan halaman yang dibungkus dikirim dalam dua bagian: kerangka ini
 * lebih dulu, lalu isi sesungguhnya menyusul di dalam `<div hidden>` yang
 * ditukar oleh sepotong skrip. Tanpa JavaScript, penukaran itu tidak pernah
 * terjadi - dan yang tersisa di layar selamanya adalah kerangka ini.
 *
 * Dilaporkan dari sebuah ponsel sebagai "halamannya hitam, tidak ada isinya".
 * Terjadi di production juga, bukan hanya di server lokal.
 *
 * Di dalam kelompok `(app)` konsekuensi itu dapat diterima: dashboard, editor,
 * dan pengaturan memang menuntut JavaScript untuk berfungsi sama sekali.
 * Halaman publik tidak, dan justru merekalah yang dibuka orang di jaringan
 * seluler yang lambat - pengguna yang persis dituju aplikasi ini.
 */
export default function Loading() {
  const { t } = useI18n();

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-8" aria-busy="true">
      <span className="sr-only">{t.errors.loading}</span>

      <div className="h-8 w-48 animate-pulse rounded-lg bg-ink-200" />
      <div className="mt-3 h-4 w-72 animate-pulse rounded bg-ink-200" />

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }, (_, index) => (
          <div
            key={index}
            className="rounded-xl border border-ink-200 bg-white p-5"
          >
            <div className="h-4 w-32 animate-pulse rounded bg-ink-200" />
            <div className="mt-2 h-3 w-44 animate-pulse rounded bg-ink-100" />
            <div className="mt-6 h-9 w-full animate-pulse rounded-lg bg-ink-100" />
          </div>
        ))}
      </div>
    </div>
  );
}

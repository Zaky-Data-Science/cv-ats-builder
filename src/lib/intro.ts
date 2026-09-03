/**
 * Apakah intro pembuka perlu diputar.
 *
 * Ditulis sebagai store kecil di luar React, bukan dibaca lewat useEffect,
 * karena alasan yang sama dengan store tema di `theme.ts`: nilainya hanya ada
 * di peramban, dan membacanya lewat effect lalu menyimpannya dengan setState
 * adalah pola yang memicu peringatan lint sekaligus satu render tambahan.
 * `useSyncExternalStore` memang dirancang untuk keadaan ini - nilai server
 * dan nilai peramban memang berbeda, dan perbedaan itu disengaja.
 */

export const INTRO_STORAGE_KEY = "atscv-intro-dilihat";

/** Berapa lama seluruh adegan berlangsung, dari kertas muncul sampai memudar. */
export const INTRO_DURASI_MS = 2100;

let snapshot: boolean | null = null;

function hitung(): boolean {
  // Pengguna yang meminta pengurangan gerak tidak menerima adegan ini sama
  // sekali. Bukan versi yang lebih singkat - permintaannya adalah gerak yang
  // berkurang, dan sebuah adegan sinematik selama dua detik tetaplah gerak.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return false;
  }

  try {
    return localStorage.getItem(INTRO_STORAGE_KEY) === null;
  } catch {
    // Penyimpanan diblokir. Intro tetap diputar sekali per pemuatan; itu
    // lebih baik daripada tidak pernah muncul, dan pengguna yang memblokir
    // penyimpanan memang sudah menerima keadaan yang tidak diingat.
    return true;
  }
}

/**
 * Nilainya tidak pernah berubah setelah halaman dimuat, jadi tidak ada yang
 * perlu diberi tahu. Fungsi ini tetap ada karena useSyncExternalStore
 * mensyaratkannya - dan yang dikembalikannya pembatalan yang tidak melakukan
 * apa-apa, bukan sesuatu yang lupa dibersihkan.
 */
export function subscribeIntro(): () => void {
  return () => {};
}

export function getIntroSnapshot(): boolean {
  if (snapshot === null) snapshot = hitung();
  return snapshot;
}

/**
 * Di server tidak diketahui apakah pengunjung pernah melihat intronya, dan
 * menebak "belum" akan membuat setiap halaman terkirim bersama lapisan intro
 * yang lalu dibuang saat hidrasi - kedipan yang justru merusak kesan pertama
 * yang ingin dibangun. Karena itu jawabannya selalu "tidak perlu", dan
 * lapisannya baru muncul setelah peramban memutuskannya sendiri.
 */
export function getIntroServerSnapshot(): boolean {
  return false;
}

/** Menandai bahwa intro sudah pernah dilihat di perangkat ini. */
export function tandaiIntroDilihat(): void {
  snapshot = false;
  try {
    localStorage.setItem(INTRO_STORAGE_KEY, "1");
  } catch {
    // Tidak apa-apa; intro hanya akan muncul lagi pada pemuatan berikutnya.
  }
}

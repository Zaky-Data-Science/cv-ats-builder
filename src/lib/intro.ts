/**
 * Apakah intro pembuka perlu diputar.
 *
 * Ditulis sebagai store kecil di luar React, bukan dibaca lewat useEffect,
 * karena alasan yang sama dengan store tema di `theme.ts`: nilainya hanya ada
 * di peramban, dan membacanya lewat effect lalu menyimpannya dengan setState
 * adalah pola yang memicu peringatan lint sekaligus satu render tambahan.
 * `useSyncExternalStore` memang dirancang untuk keadaan ini - nilai server
 * dan nilai peramban memang berbeda, dan perbedaan itu disengaja.
 *
 * ## Sekali per pemuatan halaman, bukan sekali per perangkat
 *
 * Sampai sesi 10 ini ditandai di localStorage, sehingga intronya hanya pernah
 * terlihat satu kali seumur perangkat. Alasannya waktu itu: adegan pembuka
 * yang diputar setiap kali halaman dimuat berubah dari kesan pertama menjadi
 * penghalang.
 *
 * Diubah atas permintaan pemilik aplikasi - dan keberatan itu tidak dibuang,
 * melainkan dijawab dari sisi lain: adegannya kini **dapat dilewati kapan
 * saja** dengan satu ketukan, satu klik, atau tombol apa pun. Yang membuat
 * sebuah pembuka menjadi penghalang bukan kemunculannya, melainkan
 * ketidakmampuan melewatinya.
 *
 * Penandanya kini variabel di dalam modul ini, bukan localStorage. Bedanya
 * persis yang dibutuhkan:
 *
 *  - **Muat ulang halaman** memuat ulang modul ini juga, penandanya kembali
 *    ke nilai awal, dan intronya diputar lagi.
 *  - **Berpindah halaman di dalam aplikasi** lalu kembali ke beranda tidak
 *    memuat ulang modul apa pun, sehingga intronya tidak ikut terputar setiap
 *    kali seseorang menekan tombol kembali.
 */

/** Berapa lama seluruh adegan berlangsung, dari kertas muncul sampai memudar. */
export const INTRO_DURASI_MS = 2200;

/**
 * Berapa lama adegan yang dilewati memudar.
 *
 * Bukan nol. Lapisan yang lenyap seketika terbaca sebagai kedipan yang salah,
 * sedangkan yang barusan diminta penggunanya adalah "lanjutkan" - bukan
 * "hilangkan".
 */
export const INTRO_LEWAT_MS = 260;

let sudahDiputar = false;
let snapshot: boolean | null = null;

/**
 * Kunci yang dipakai versi sebelumnya untuk menandai "sudah pernah melihat".
 *
 * Tidak lagi dibaca, tetapi baris yang sudah terlanjur tertulis akan tetap
 * duduk di localStorage setiap pengunjung lama selamanya. Menghapusnya sekali
 * saat modul ini dimuat jauh lebih murah daripada meninggalkan sampah di
 * perangkat orang - dan penyimpanan peramban punya batas yang, pada mode
 * tanpa akun, justru dipakai untuk menyimpan CV pengguna.
 */
const KUNCI_LAMA = "atscv-intro-dilihat";

function hitung(): boolean {
  try {
    localStorage.removeItem(KUNCI_LAMA);
  } catch {
    // Penyimpanan diblokir. Tidak ada yang perlu dibersihkan kalau begitu.
  }

  // Pengguna yang meminta pengurangan gerak tidak menerima adegan ini sama
  // sekali. Bukan versi yang lebih singkat - permintaannya adalah gerak yang
  // berkurang, dan sebuah adegan sinematik selama dua detik tetaplah gerak.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return false;
  }

  return !sudahDiputar;
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
 * Di server tidak diketahui apakah pengunjung meminta pengurangan gerak, dan
 * menebak "perlu" akan membuat setiap halaman terkirim bersama lapisan intro
 * yang lalu dibuang saat hidrasi - kedipan yang justru merusak kesan pertama
 * yang ingin dibangun. Karena itu jawabannya selalu "tidak perlu", dan
 * lapisannya baru muncul setelah peramban memutuskannya sendiri.
 */
export function getIntroServerSnapshot(): boolean {
  return false;
}

/**
 * Menandai bahwa intronya sudah diputar pada pemuatan halaman ini.
 *
 * Snapshot-nya ikut disetel supaya komponen yang dipasang sesudah ini -
 * misalnya saat pengguna kembali ke beranda dari halaman lain - membaca
 * "tidak perlu" tanpa menghitung ulang.
 */
export function tandaiIntroDilihat(): void {
  sudahDiputar = true;
  snapshot = false;
}

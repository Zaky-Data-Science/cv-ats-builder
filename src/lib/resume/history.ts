import * as React from "react";
import type { ResumeData } from "./types";

/**
 * Riwayat perubahan CV: kembali dan maju lagi.
 *
 * ## Kenapa perubahan digabungkan, bukan dicatat satu per satu
 *
 * Mengetik satu kata menghasilkan belasan pembaruan state. Mencatat
 * seluruhnya berarti satu kali "kembali" hanya menghapus satu huruf, dan
 * pengguna harus menekannya berpuluh kali untuk membatalkan satu kalimat -
 * kebalikan dari yang diharapkan orang dari Ctrl+Z.
 *
 * Karena itu perubahan yang datang berdekatan digabung menjadi satu langkah.
 * Ambangnya waktu, bukan jumlah karakter: jeda mengetik adalah tanda paling
 * jujur bahwa seseorang sudah selesai dengan satu pikiran dan mulai memikirkan
 * hal lain.
 *
 * ## Kenapa seluruh CV disimpan, bukan selisihnya
 *
 * Satu CV yang lengkap berukuran beberapa puluh kilobyte sebagai objek di
 * memori, dan riwayatnya dibatasi lima puluh langkah - beberapa megabyte pada
 * kasus terburuk, yang tidak berarti apa-apa bagi sebuah tab peramban.
 *
 * Menyimpan selisih akan menuntut penerapan mundur yang benar untuk setiap
 * bentuk perubahan yang mungkin - termasuk penambahan dan penghapusan entri,
 * penukaran urutan bagian, dan penyuntingan di atas kertas. Kesalahan sekecil
 * apa pun di sana menghasilkan CV yang rusak setelah beberapa kali "kembali",
 * dan kerusakan seperti itu justru muncul pada pengguna yang sedang panik
 * membatalkan sesuatu.
 *
 * ## Pas foto tidak ikut digandakan
 *
 * Data URI foto bisa mencapai 1 MB, dan menyalinnya lima puluh kali akan
 * benar-benar terasa. Yang disimpan di riwayat karena itu untaian yang sama -
 * JavaScript berbagi untaian antar-salinan objek, jadi lima puluh langkah yang
 * fotonya tidak berubah hanya menyimpan satu foto.
 */

/** Paling banyak langkah yang diingat. */
const MAKS_LANGKAH = 50;

/**
 * Jeda yang memisahkan dua langkah, dalam milidetik.
 *
 * Sedikit lebih pendek daripada jeda simpan otomatis, supaya sebuah langkah
 * selalu selesai terbentuk sebelum perubahannya dikirim ke server - dengan
 * begitu apa yang dapat dikembalikan dan apa yang sudah tersimpan bergerak
 * seiring.
 */
const JEDA_LANGKAH_MS = 600;

export interface Riwayat {
  /** Mencatat keadaan baru; digabung bila datang berdekatan. */
  catat: (next: ResumeData) => void;
  /** Kembali satu langkah, atau null bila tidak ada lagi. */
  kembali: () => ResumeData | null;
  /** Maju satu langkah, atau null bila tidak ada lagi. */
  maju: () => ResumeData | null;
  /** Menyetel ulang riwayat, mis. setelah memuat CV dari berkas. */
  ulang: (awal: ResumeData) => void;
  dapatKembali: boolean;
  dapatMaju: boolean;
}

export function useRiwayat(awal: ResumeData): Riwayat {
  const tumpukan = React.useRef<ResumeData[]>([awal]);
  const posisi = React.useRef(0);
  const terakhirPada = React.useRef(0);

  /*
    State ini ada semata-mata supaya tombolnya dapat menyala dan meredup.
    Nilai yang sebenarnya dipakai selalu dibaca dari ref - satu-satunya
    sumber yang pasti mutakhir, sebab riwayatnya berubah di dalam penangan
    peristiwa yang tidak menunggu render.
  */
  const [dapatKembali, setDapatKembali] = React.useState(false);
  const [dapatMaju, setDapatMaju] = React.useState(false);

  const segarkan = React.useCallback(() => {
    setDapatKembali(posisi.current > 0);
    setDapatMaju(posisi.current < tumpukan.current.length - 1);
  }, []);

  const catat = React.useCallback(
    (next: ResumeData) => {
      const sekarang = Date.now();
      const berdekatan = sekarang - terakhirPada.current < JEDA_LANGKAH_MS;
      terakhirPada.current = sekarang;

      /*
        Mencatat sesuatu setelah "kembali" membuang langkah-langkah di
        depannya. Itu perilaku yang sama dengan pengolah kata mana pun, dan
        alasannya: begitu pengguna menyunting dari titik lama, cabang yang
        dulu ada bukan lagi kelanjutan dari apa yang ada di layar.
      */
      tumpukan.current = tumpukan.current.slice(0, posisi.current + 1);

      if (berdekatan && tumpukan.current.length > 1) {
        // Digabung: langkah terakhir diganti, bukan ditambah.
        tumpukan.current[tumpukan.current.length - 1] = next;
        return;
      }

      tumpukan.current.push(next);
      if (tumpukan.current.length > MAKS_LANGKAH) tumpukan.current.shift();
      posisi.current = tumpukan.current.length - 1;
      segarkan();
    },
    [segarkan],
  );

  const kembali = React.useCallback(() => {
    if (posisi.current <= 0) return null;
    posisi.current -= 1;
    // Jam disetel mundur supaya keadaan yang barusan dikembalikan tidak
    // langsung tergabung dengan ketikan berikutnya - kalau tidak, satu huruf
    // yang diketik sesudah "kembali" akan menelan langkah itu kembali.
    terakhirPada.current = 0;
    segarkan();
    return tumpukan.current[posisi.current];
  }, [segarkan]);

  const maju = React.useCallback(() => {
    if (posisi.current >= tumpukan.current.length - 1) return null;
    posisi.current += 1;
    terakhirPada.current = 0;
    segarkan();
    return tumpukan.current[posisi.current];
  }, [segarkan]);

  const ulang = React.useCallback(
    (baru: ResumeData) => {
      tumpukan.current = [baru];
      posisi.current = 0;
      terakhirPada.current = 0;
      segarkan();
    },
    [segarkan],
  );

  return { catat, kembali, maju, ulang, dapatKembali, dapatMaju };
}

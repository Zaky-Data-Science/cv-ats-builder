"use client";

import * as React from "react";

/**
 * ============================================================================
 *  UKURAN LACI "TAMPILAN CV" YANG DAPAT DITARIK
 * ============================================================================
 *
 * Laci pengaturan tampilan dulu berukuran tetap: 55% tinggi layar sebagai
 * lembar bawah di ponsel, dan 22rem sebagai laci kiri di layar lebar. Angka
 * itu kompromi yang tidak pernah pas untuk semua orang - terlalu pendek saat
 * mengatur jarak tepi (daftarnya harus digulir terus), terlalu tinggi saat
 * hanya ingin mengintip kertas yang berubah di belakangnya.
 *
 * Yang tepat karena itu bukan angka yang lebih baik, melainkan angka yang
 * dapat diubah penggunanya sendiri.
 *
 * TIGA HAL YANG MENENTUKAN BENTUKNYA
 *
 * 1. **Tersimpan di peramban.** Ukuran yang harus disetel ulang setiap kali
 *    laci dibuka sama merepotkannya dengan ukuran tetap. Disimpan per
 *    perangkat, bukan per akun: yang menentukan senyaman apa memandangnya
 *    adalah layarnya, bukan orangnya.
 *
 * 2. **Batasnya menahan dua kegagalan yang berbeda.** Batas bawah menahan
 *    laci menyusut sampai kepalanya sendiri tidak muat; batas atas menahan ia
 *    menutupi seluruh kertas - padahal melihat kertas berubah sambil diatur
 *    adalah seluruh alasan ia berbentuk laci, bukan jendela timbul.
 *
 * 3. **Dapat ditarik DAN ditekan panah.** Menarik menuntut tangan yang mantap;
 *    papan ketik tidak punya cara lain sama sekali kalau tidak disediakan.
 */

const KUNCI_TINGGI = "atscv-laci-tinggi";
const KUNCI_LEBAR = "atscv-laci-lebar";

/*
  SETELAN ukuran laci "Atur tampilan CV". DUA satuan, sebab dua bentuk.

  LEMBAR BAWAH DI LAYAR SEMPIT - persen tinggi layar

  | Setelan         | Nilai | Artinya                                         |
  |-----------------|------:|-------------------------------------------------|
  | `TINGGI_BAWAAN` |  55%  | Setengah layar lebih sedikit                     |
  | `TINGGI_MIN`    |  28%  | Cukup untuk satu baris setelan, kertas terlihat  |
  | `TINGGI_MAKS`   |  92%  | Menyisakan sedikit kertas - JANGAN dibuat 100%   |

  `TINGGI_MAKS` sengaja tidak 100%: kalau lacinya menutupi seluruh layar,
  hilang alasan lacinya dibuat dapat ditarik - yaitu melihat kertas berubah
  sementara diatur.

  LACI KIRI DI LAYAR LEBAR - rem, bukan persen

  | Setelan        | Nilai | Artinya                                          |
  |----------------|------:|--------------------------------------------------|
  | `LEBAR_BAWAAN` | 22rem | Sekitar 352 piksel                                |
  | `LEBAR_MIN`    | 18rem | Label setelan masih muat satu baris               |
  | `LEBAR_MAKS`   | 34rem | Lebih dari ini kertas terdesak tanpa guna         |

  Rem, bukan persen, karena isinya tulisan berukuran tetap - laci yang ikut
  melebar bersama layar 2560 akan penuh ruang kosong.
*/
export const TINGGI_BAWAAN = 55;
export const TINGGI_MIN = 28;
export const TINGGI_MAKS = 92;

export const LEBAR_BAWAAN = 22;
export const LEBAR_MIN = 18;
export const LEBAR_MAKS = 34;

const jepit = (nilai: number, min: number, maks: number) =>
  Math.min(maks, Math.max(min, nilai));

function baca(kunci: string, bawaan: number, min: number, maks: number): number {
  // Dibungkus try/catch: di server `window` memang tidak ada, dan di peramban
  // mode penyamaran maupun setelan yang memblokir penyimpanan situs membuat
  // pembacaan ini MELEMPAR - bukan mengembalikan null. Yang gagal, apa pun
  // sebabnya, cukup memakai ukuran bawaannya.
  try {
    const tersimpan = window.localStorage.getItem(kunci);
    if (!tersimpan) return bawaan;
    const angka = Number.parseFloat(tersimpan);
    return Number.isFinite(angka) ? jepit(angka, min, maks) : bawaan;
  } catch {
    return bawaan;
  }
}

function tulis(kunci: string, nilai: number): void {
  try {
    window.localStorage.setItem(kunci, String(nilai));
  } catch {
    // Ukuran laci bukan data pengguna. Gagal menyimpannya tidak boleh
    // menghentikan apa pun.
  }
}

export interface UkuranLaci {
  tinggiVh: number;
  lebarRem: number;
  /** Dipasang pada pegangan lembar bawah. */
  tarikTinggi: (event: React.PointerEvent) => void;
  /** Dipasang pada pegangan tepi laci kiri. */
  tarikLebar: (event: React.PointerEvent) => void;
  /** Panah atas/bawah pada pegangan lembar bawah. */
  tombolTinggi: (event: React.KeyboardEvent) => void;
  /** Panah kiri/kanan pada pegangan laci kiri. */
  tombolLebar: (event: React.KeyboardEvent) => void;
}

export function useUkuranLaci(): UkuranLaci {
  /*
    Dibaca sekali sebagai nilai awal, bukan lewat effect.

    Effect yang memanggil setState segera setelah render memicu render
    berantai - dan `react-hooks` memang melarangnya. Di sini tidak ada
    alasan untuk itu: `baca()` sudah menjaga dirinya sendiri terhadap
    ketiadaan `window`, sehingga nilai awal di server jatuh ke bawaannya.

    Tidak ada risiko galat hidrasi meskipun nilai tersimpannya berbeda dari
    bawaan: laci ini mengembalikan `null` selama tertutup, dan ia selalu
    tertutup pada render pertama. Ukurannya baru menyentuh DOM setelah
    pengguna membukanya sendiri.
  */
  const [tinggiVh, setTinggi] = React.useState(() =>
    baca(KUNCI_TINGGI, TINGGI_BAWAAN, TINGGI_MIN, TINGGI_MAKS),
  );
  const [lebarRem, setLebar] = React.useState(() =>
    baca(KUNCI_LEBAR, LEBAR_BAWAAN, LEBAR_MIN, LEBAR_MAKS),
  );

  const tarikTinggi = React.useCallback((event: React.PointerEvent) => {
    // Tinggi dihitung dari jarak jari ke DASAR LAYAR, bukan dari selisih
    // geserannya. Dengan begitu tepi atas laci selalu tepat berada di bawah
    // jari, dan satu-dua kejadian gerak yang terlewat - lazim di layar sentuh
    // yang sibuk - tidak membuat lacinya perlahan meleset dari jarinya.
    const pegangan = event.currentTarget as HTMLElement;
    pegangan.setPointerCapture(event.pointerId);

    const gerak = (e: PointerEvent) => {
      const persen = ((window.innerHeight - e.clientY) / window.innerHeight) * 100;
      setTinggi(jepit(Math.round(persen), TINGGI_MIN, TINGGI_MAKS));
    };
    const lepas = () => {
      pegangan.removeEventListener("pointermove", gerak);
      pegangan.removeEventListener("pointerup", lepas);
      pegangan.removeEventListener("pointercancel", lepas);
      setTinggi((n) => {
        tulis(KUNCI_TINGGI, n);
        return n;
      });
    };

    pegangan.addEventListener("pointermove", gerak);
    pegangan.addEventListener("pointerup", lepas);
    pegangan.addEventListener("pointercancel", lepas);
  }, []);

  const tarikLebar = React.useCallback((event: React.PointerEvent) => {
    const pegangan = event.currentTarget as HTMLElement;
    pegangan.setPointerCapture(event.pointerId);

    const gerak = (e: PointerEvent) => {
      const rem = e.clientX / 16;
      setLebar(jepit(Math.round(rem * 2) / 2, LEBAR_MIN, LEBAR_MAKS));
    };
    const lepas = () => {
      pegangan.removeEventListener("pointermove", gerak);
      pegangan.removeEventListener("pointerup", lepas);
      pegangan.removeEventListener("pointercancel", lepas);
      setLebar((n) => {
        tulis(KUNCI_LEBAR, n);
        return n;
      });
    };

    pegangan.addEventListener("pointermove", gerak);
    pegangan.addEventListener("pointerup", lepas);
    pegangan.addEventListener("pointercancel", lepas);
  }, []);

  const tombolTinggi = React.useCallback((event: React.KeyboardEvent) => {
    const langkah =
      event.key === "ArrowUp" ? 5 : event.key === "ArrowDown" ? -5 : 0;
    if (!langkah) return;
    event.preventDefault();
    setTinggi((n) => {
      const baru = jepit(n + langkah, TINGGI_MIN, TINGGI_MAKS);
      tulis(KUNCI_TINGGI, baru);
      return baru;
    });
  }, []);

  const tombolLebar = React.useCallback((event: React.KeyboardEvent) => {
    const langkah =
      event.key === "ArrowRight" ? 2 : event.key === "ArrowLeft" ? -2 : 0;
    if (!langkah) return;
    event.preventDefault();
    setLebar((n) => {
      const baru = jepit(n + langkah, LEBAR_MIN, LEBAR_MAKS);
      tulis(KUNCI_LEBAR, baru);
      return baru;
    });
  }, []);

  return { tinggiVh, lebarRem, tarikTinggi, tarikLebar, tombolTinggi, tombolLebar };
}

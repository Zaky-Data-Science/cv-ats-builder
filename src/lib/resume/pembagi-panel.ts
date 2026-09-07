"use client";

import * as React from "react";

/**
 * ============================================================================
 *  PEMBAGI DUA PANEL PENYUNTING
 * ============================================================================
 *
 * Di layar lebar, penyunting membagi layarnya menjadi formulir di kiri dan
 * kertas di kanan. Pembagiannya dulu tetap - `minmax(360px, 42%)` - dan itu
 * menimbulkan dua persoalan yang berbeda.
 *
 * PERSOALAN PERTAMA: PEMBAGIAN TETAP TIDAK PERNAH PAS UNTUK SEMUA ORANG
 *
 * Yang sedang mengetik ingin formulirnya lebar; yang sedang memeriksa hasil
 * ingin kertasnya lebar; dan sebagian orang cuma ingin salah satunya saja di
 * layar. Diminta begini: *"terserah orang mau pake field aja fokusnya atau
 * 2 2 nya atau langsung di kertas"*.
 *
 * PERSOALAN KEDUA: KOLOM `1fr` MENDESAK TETANGGANYA
 *
 * `minmax(360px, 42%)` berpasangan dengan `1fr`, dan `1fr` bukan berarti "sisa
 * ruang" melainkan "sisa ruang, tetapi tidak lebih kecil daripada isinya".
 * Begitu kertas di kanan diperbesar - 140% misalnya - lebar terkecilnya
 * tumbuh, dan kolom kiri terdesak sampai batas 360 pikselnya. Akibatnya nyata
 * dan dilaporkan: kotak isian menyempit sampai teksnya terpotong,
 * "Frontend Develo|", "budi.santoso@er".
 *
 * Lebar yang ditulis tegas dalam persen menyelesaikan keduanya sekaligus:
 * kolom kanan tidak lagi punya suara dalam menentukan lebar kolom kiri, dan
 * angkanya dapat ditarik penggunanya sendiri.
 */

const KUNCI_LEBAR = "atscv-panel-lebar";
const KUNCI_MODE = "atscv-panel-mode";

/*
  SETELAN lebar panel formulir, dalam PERSEN terhadap lebar penyunting.

  | Setelan        | Nilai | Artinya                                        |
  |----------------|------:|------------------------------------------------|
  | `LEBAR_BAWAAN` |  42%  | Yang dilihat orang sebelum ia menarik apa pun   |
  | `LEBAR_MIN`    |  22%  | Sekecil-kecilnya - formulir masih terbaca       |
  | `LEBAR_MAKS`   |  78%  | Sebesar-besarnya - kertas tinggal sepotong      |

  Persen, bukan piksel, supaya pembagiannya tetap sama saat jendela diubah
  ukurannya - 42% pada layar 1920 dan pada layar 1280 sama-sama terbaca
  sebagai "sedikit kurang dari separuh".

  Angka ini menentukan lebar kertas yang tersisa di sebelahnya. Menaikkannya
  berarti kertas menyempit, dan perbesaran otomatis kertas ikut turun sampai
  menyentuh `MIN_ZOOM` di `PreviewPane.tsx`.
*/
export const LEBAR_BAWAAN = 42;
export const LEBAR_MIN = 22;
export const LEBAR_MAKS = 78;

/**
 * Panel mana yang sedang terlihat di layar lebar.
 *
 * - `dua`      - formulir dan kertas berdampingan (bawaan)
 * - `formulir` - kertasnya diciutkan; formulir memakai seluruh lebar
 * - `kertas`   - formulirnya diciutkan; kertas memakai seluruh lebar
 */
export type ModePanel = "dua" | "formulir" | "kertas";

const jepit = (n: number) => Math.min(LEBAR_MAKS, Math.max(LEBAR_MIN, n));

function bacaLebar(): number {
  try {
    const t = window.localStorage.getItem(KUNCI_LEBAR);
    const n = t === null ? NaN : Number.parseFloat(t);
    return Number.isFinite(n) ? jepit(n) : LEBAR_BAWAAN;
  } catch {
    return LEBAR_BAWAAN;
  }
}

function bacaMode(): ModePanel {
  try {
    const t = window.localStorage.getItem(KUNCI_MODE);
    return t === "formulir" || t === "kertas" ? t : "dua";
  } catch {
    return "dua";
  }
}

function tulis(kunci: string, nilai: string): void {
  try {
    window.localStorage.setItem(kunci, nilai);
  } catch {
    // Setelan tampilan, bukan data pengguna. Gagal menyimpannya tidak boleh
    // menghentikan apa pun.
  }
}

export interface Pembagi {
  lebarPersen: number;
  mode: ModePanel;
  setMode: (m: ModePanel) => void;
  tarik: (event: React.PointerEvent) => void;
  tombol: (event: React.KeyboardEvent) => void;
  /** Mengembalikan pembagiannya ke bawaan - dipakai ketukan ganda. */
  setelUlang: () => void;
}

export function usePembagiPanel(): Pembagi {
  /*
    Dibaca sebagai nilai awal, bukan lewat effect: effect yang memanggil
    setState segera setelah render memicu render berantai. `bacaLebar()`
    menjaga dirinya sendiri terhadap ketiadaan `window`, jadi di server ia
    jatuh ke bawaannya.

    Perbedaan nilai antara server dan peramban tidak menimbulkan galat
    hidrasi di sini karena lebarnya hanya dipakai mulai titik henti `lg`,
    lewat custom property - bukan menjadi markup yang berbeda.
  */
  const [lebarPersen, setLebar] = React.useState(bacaLebar);
  const [mode, setModeState] = React.useState<ModePanel>(bacaMode);

  const setMode = React.useCallback((m: ModePanel) => {
    setModeState(m);
    tulis(KUNCI_MODE, m);
  }, []);

  const setelUlang = React.useCallback(() => {
    setLebar(LEBAR_BAWAAN);
    tulis(KUNCI_LEBAR, String(LEBAR_BAWAAN));
  }, []);

  const tarik = React.useCallback((event: React.PointerEvent) => {
    /*
      Persennya dihitung terhadap kotak WADAH kedua panel, bukan terhadap
      lebar jendela. Penyunting tidak selalu memakai seluruh lebar layar -
      laci "Tampilan CV" di layar lebar menempel di tepi kiri dan menutupi
      sebagiannya - dan menghitung dari jendela membuat pembagi meleset
      sejauh lebar laci itu.

      Wadah itu dicari lewat penanda, BUKAN `parentElement`.

      Pegangan ini duduk di dalam pembungkus kecil setinggi panel dan selebar
      sepuluh piksel - tempat kedua tombol ciut menempel. `parentElement`
      karena itu menunjuk pembungkus itu, bukan wadah dua panelnya, dan
      persennya dihitung terhadap sepuluh piksel. Gejalanya terbalik dan
      membingungkan: menyeret ke kanan justru menyempitkan formulir, sebab
      angkanya selalu meleset jauh lalu terjepit ke salah satu batas.
    */
    const pegangan = event.currentTarget as HTMLElement;
    const wadah = pegangan.closest("[data-panel-wadah]") as HTMLElement | null;
    if (!wadah) return;
    pegangan.setPointerCapture(event.pointerId);

    const gerak = (e: PointerEvent) => {
      const kotak = wadah.getBoundingClientRect();
      if (kotak.width <= 0) return;
      setLebar(jepit(((e.clientX - kotak.left) / kotak.width) * 100));
    };
    const lepas = () => {
      pegangan.removeEventListener("pointermove", gerak);
      pegangan.removeEventListener("pointerup", lepas);
      pegangan.removeEventListener("pointercancel", lepas);
      setLebar((n) => {
        tulis(KUNCI_LEBAR, n.toFixed(1));
        return n;
      });
    };

    pegangan.addEventListener("pointermove", gerak);
    pegangan.addEventListener("pointerup", lepas);
    pegangan.addEventListener("pointercancel", lepas);
  }, []);

  const tombol = React.useCallback((event: React.KeyboardEvent) => {
    const langkah =
      event.key === "ArrowRight" ? 2 : event.key === "ArrowLeft" ? -2 : 0;
    if (!langkah) return;
    event.preventDefault();
    setLebar((n) => {
      const baru = jepit(n + langkah);
      tulis(KUNCI_LEBAR, baru.toFixed(1));
      return baru;
    });
  }, []);

  return { lebarPersen, mode, setMode, tarik, tombol, setelUlang };
}

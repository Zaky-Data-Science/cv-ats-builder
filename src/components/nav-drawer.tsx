"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

/**
 * ============================================================================
 *  POLA LACI NAVIGASI - satu-satunya di proyek ini
 * ============================================================================
 *
 * Berkas ini bukan komponen baru melainkan pola lama yang dipindahkan keluar.
 * Ia semula tinggal di dalam `PublicHeader.tsx`, sudah teruji di sana, dan
 * dipindahkan ke sini ketika bilah atas halaman aplikasi membutuhkan pola yang
 * sama. Alasan memindahkannya alih-alih menyalinnya ada di
 * `docs/panduan-responsif.md` aturan 6: dua laci dengan dua perilaku lebih
 * membingungkan bagi penggunanya daripada satu bilah yang penuh.
 *
 * Yang dibawa serta beserta alasannya - semuanya ditemukan lewat kejadian
 * nyata, bukan diperkirakan:
 *
 * 1. **Digambar lewat portal ke <body>.** Bilah atas memakai `backdrop-blur`,
 *    dan penyaring latar menjadikan elemennya blok penampung bagi keturunan
 *    `position: fixed`. Laci yang bersarang di dalamnya karena itu terpotong
 *    setinggi bilahnya sendiri, bukan setinggi layar. Gejalanya menipu:
 *    `inset-0` terlihat benar di kode, tetapi "nol" yang dimaksud peramban
 *    adalah nol terhadap bilah.
 *
 * 2. **Menutupi layar, bukan mendorong isi halaman.** Panel yang menggeser
 *    halaman ke samping menambah lebar dokumen - persoalan yang sama dengan
 *    yang justru hendak diperbaiki. Laci ini `fixed`, sehingga tidak pernah
 *    ikut menghitung lebar dokumen.
 *
 * 3. **Penguncian gulir memakai `overflow` pada <html>**, bukan
 *    `position: fixed` pada <body>. Cara kedua itu memang lazim, tetapi ia
 *    membuang posisi gulir pengguna - laci ditutup dan halaman melompat
 *    kembali ke atas.
 *
 * 4. **Yang disimpan bukan "laci terbuka" melainkan "laci dibuka di halaman
 *    mana".** Dengan begitu berpindah halaman otomatis menutup laci tanpa
 *    memerlukan effect yang memanggil setState - pola yang memicu render
 *    berantai dan mudah terlewat saat halaman baru ditambahkan.
 */

/* -------------------------------------------------------------------------- */
/* Keadaan laci                                                               */
/* -------------------------------------------------------------------------- */

export interface KeadaanLaci {
  terbuka: boolean;
  alih: () => void;
  tutup: () => void;
  /**
   * Dipasang pada tombol pembuka, supaya fokus tahu harus pulang ke mana.
   *
   * Berupa fungsi, bukan objek ref. Objek ref yang ikut menumpang di dalam
   * nilai kembalian membuat seluruh objek itu terbaca sebagai ref oleh
   * `react-hooks/refs`, sehingga membaca `terbuka` pun dituduh membaca ref
   * saat render. Callback ref tidak punya persoalan itu.
   */
  pasangPembuka: (el: HTMLButtonElement | null) => void;
}

export function useLaci(): KeadaanLaci {
  const pathname = usePathname();
  const [dibukaDi, setDibukaDi] = React.useState<string | null>(null);
  const pembuka = React.useRef<HTMLButtonElement | null>(null);
  const pasangPembuka = React.useCallback((el: HTMLButtonElement | null) => {
    pembuka.current = el;
  }, []);

  const terbuka = dibukaDi === pathname;

  /*
    Menutup, lalu MEMULANGKAN FOKUS ke tombol pembukanya.

    Tanpa ini, pengguna papan ketik yang menutup laci dengan Escape kehilangan
    tempatnya sama sekali: fokus kembali ke <body>, dan Tab berikutnya memulai
    lagi dari awal halaman. Yang paling merugikan justru yang paling sering -
    membuka laci untuk melihat isinya, lalu membatalkan.

    Pemulangan fokus sengaja hanya terjadi di sini, bukan pada setiap
    penutupan. Laci juga menutup dirinya saat pengguna berpindah halaman
    (lihat catatan 4 di atas), dan di sana tombolnya sudah tidak ada lagi -
    memulangkan fokus ke elemen yang sudah lepas dari dokumen akan membuang
    fokus ke <body>, persis yang hendak dihindari.
  */
  const tutup = React.useCallback(() => {
    setDibukaDi(null);
    pembuka.current?.focus();
  }, []);

  const alih = React.useCallback(() => {
    setDibukaDi((sebelumnya) => (sebelumnya === pathname ? null : pathname));
  }, [pathname]);

  return { terbuka, alih, tutup, pasangPembuka };
}

/* -------------------------------------------------------------------------- */
/* Menu lipat                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Menu kecil yang menggantung di bawah tombolnya - bukan laci.
 *
 * Dibedakan dengan sadar dari `Laci` di bawah, dan bukan berarti ada dua pola
 * yang bersaing: laci menutupi layar dan dipakai ketika ruangnya memang habis,
 * menu lipat menggantung di sebelah tombolnya dan dipakai ketika ruangnya ada.
 * Yang disatukan justru perilakunya - Escape menutup, menekan di luar menutup,
 * dan fokus pulang ke tombol pembukanya - sebab ketiganya adalah hal yang
 * paling sering lupa ditulis ketika sebuah menu baru dibuat.
 */
export interface KeadaanMenu {
  terbuka: boolean;
  alih: () => void;
  tutup: () => void;
  /** Dipasang pada tombol pembuka - lihat catatan di `KeadaanLaci`. */
  pasangPembuka: (el: HTMLButtonElement | null) => void;
  /** Dipasang pada pembungkus tombol + menunya. */
  pasangWadah: (el: HTMLDivElement | null) => void;
}

export function useMenuLipat(): KeadaanMenu {
  const [terbuka, setTerbuka] = React.useState(false);
  const pembuka = React.useRef<HTMLButtonElement | null>(null);
  const wadah = React.useRef<HTMLDivElement | null>(null);

  const pasangPembuka = React.useCallback((el: HTMLButtonElement | null) => {
    pembuka.current = el;
  }, []);
  const pasangWadah = React.useCallback((el: HTMLDivElement | null) => {
    wadah.current = el;
  }, []);

  const tutup = React.useCallback(() => {
    setTerbuka(false);
    pembuka.current?.focus();
  }, []);

  const alih = React.useCallback(() => setTerbuka((v) => !v), []);

  React.useEffect(() => {
    if (!terbuka) return;

    /*
      Menekan di luar memakai `pointerdown`, bukan `blur`.

      Menebak lewat blur gagal justru pada kejadian yang paling wajar: menekan
      salah satu butir di dalam menu memicu blur lebih dulu, menutup menunya,
      dan tombol yang sedang ditekan lenyap sebelum kliknya sempat mendarat.
    */
    const diLuar = (event: PointerEvent) => {
      if (!wadah.current?.contains(event.target as Node)) setTerbuka(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") tutup();
    };

    document.addEventListener("pointerdown", diLuar);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", diLuar);
      document.removeEventListener("keydown", onKey);
    };
  }, [terbuka, tutup]);

  return { terbuka, alih, tutup, pasangPembuka, pasangWadah };
}

/* -------------------------------------------------------------------------- */
/* Tombol pembuka                                                             */
/* -------------------------------------------------------------------------- */

/**
 * Tombol menu. Sasaran sentuhnya 44 piksel, bukan sebesar ikonnya.
 *
 * `id` laci dan `aria-controls` sengaja dijadikan satu parameter supaya
 * keduanya tidak dapat berselisih: tombol yang menunjuk ke id yang tidak ada
 * adalah cacat yang tak terlihat sama sekali di layar.
 */
export function TombolLaci({
  laci,
  idLaci,
  labelBuka,
  labelTutup,
  className,
}: {
  laci: KeadaanLaci;
  idLaci: string;
  labelBuka: string;
  labelTutup: string;
  className?: string;
}) {
  // Dibongkar lebih dulu, bukan dibaca sebagai `laci.x` di dalam JSX. Aturan
  // `react-hooks/refs` menganggap seluruh objek yang salah satu anggotanya
  // dipasang pada `ref=` sebagai ref, sehingga membaca anggota lainnya pun
  // dituduh membaca ref saat render.
  const { terbuka, alih, pasangPembuka } = laci;

  return (
    <button
      ref={pasangPembuka}
      type="button"
      onClick={alih}
      aria-expanded={terbuka}
      aria-controls={idLaci}
      aria-label={terbuka ? labelTutup : labelBuka}
      className={
        "-mr-2 grid h-11 w-11 shrink-0 place-items-center rounded-lg text-ink-700 transition-colors hover:bg-ink-100 " +
        (className ?? "")
      }
    >
      <Menu size={20} aria-hidden />
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/* Laci                                                                       */
/* -------------------------------------------------------------------------- */

export function Laci({
  id,
  judul,
  labelTutup,
  laci,
  className,
  children,
  kaki,
}: {
  id: string;
  /** Tampil di kepala laci - biasanya nama aplikasi. */
  judul: React.ReactNode;
  labelTutup: string;
  laci: KeadaanLaci;
  /** Kelas tambahan bagi pembungkus terluar - dipakai menyetel titik hentinya. */
  className?: string;
  children: React.ReactNode;
  /** Blok yang menempel di dasar laci, di luar daerah yang menggulir. */
  kaki?: React.ReactNode;
}) {
  const { terbuka, tutup } = laci;
  const refPanel = React.useRef<HTMLDivElement>(null);

  /*
    Selama laci terbuka: Escape menutupnya, dan halaman di belakangnya tidak
    ikut tergulir.
  */
  React.useEffect(() => {
    if (!terbuka) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") tutup();
    };
    document.addEventListener("keydown", onKey);

    const akar = document.documentElement;
    const sebelumnya = akar.style.overflow;
    akar.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      akar.style.overflow = sebelumnya;
    };
  }, [terbuka, tutup]);

  // Fokus dipindahkan ke dalam laci saat dibuka. Tanpa ini, menekan Enter di
  // tombol menu memang membuka laci tetapi fokusnya tertinggal di luar,
  // sehingga Tab berikutnya menyusuri halaman di belakang laci - halaman yang
  // sedang tertutup lapisan gelap dan tidak dapat dilihat penggunanya.
  React.useEffect(() => {
    if (terbuka) refPanel.current?.focus();
  }, [terbuka]);

  /*
    Tidak ada penjaga "sudah terpasang di peramban" seperti yang biasa
    menyertai portal. Nilai awal `dibukaDi` selalu null, jadi cabang ini sudah
    keluar lebih dulu pada render di server - `document` tidak pernah
    tersentuh di sana.
  */
  if (!terbuka) return null;

  return createPortal(
    <div className={"fixed inset-0 z-50 " + (className ?? "")}>
      {/* Lapisan gelap: menutup laci saat disentuh, dan meredam isi di
          belakangnya supaya jelas mana yang sedang aktif. */}
      <button
        type="button"
        aria-label={labelTutup}
        onClick={tutup}
        className="drawer-overlay absolute inset-0 bg-ink-900/50 backdrop-blur-[2px]"
      />

      <div
        id={id}
        ref={refPanel}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={typeof judul === "string" ? judul : undefined}
        className="drawer-panel absolute inset-y-0 right-0 flex w-[min(21rem,86vw)] flex-col border-l border-ink-200 bg-white shadow-2xl outline-none"
      >
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-ink-200 pr-2 pl-5">
          <span className="min-w-0 truncate text-sm font-semibold text-ink-900">
            {judul}
          </span>
          <button
            type="button"
            onClick={tutup}
            aria-label={labelTutup}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-lg text-ink-600 transition-colors hover:bg-ink-100"
          >
            <X size={20} aria-hidden />
          </button>
        </div>

        <div className="thin-scrollbar min-h-0 flex-1 overflow-y-auto p-3">
          {children}
        </div>

        {kaki && (
          <div className="shrink-0 space-y-2 border-t border-ink-200 p-4">
            {kaki}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}

"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TemplatePreview } from "@/components/home/TemplatePreview";
import type { Locale } from "@/lib/i18n/config";
import { TEMPLATE_INFO, TEMPLATE_ORDER } from "@/lib/resume/templates";
import { cn } from "@/lib/utils";

/**
 * ============================================================================
 *  KARTU CV DI HALAMAN DEPAN - TIGA SEKALIGUS, YANG TENGAH TAJAM
 * ============================================================================
 *
 * Hero halaman depan dulu memajang satu contoh saja, desain Klasik, sementara
 * kesepuluh desainnya baru terlihat di galeri jauh di bawah - padahal jumlah
 * pilihan desain termasuk hal yang paling menentukan orang mau mencoba atau
 * tidak, jadi ia tidak boleh menunggu digulir.
 *
 * ---------------------------------------------------------------------------
 * Tiga kartu, bukan satu: yang tepi buram sebagai bocoran
 * ---------------------------------------------------------------------------
 *
 * Yang tampil bukan satu kartu melainkan tiga: desain sebelumnya di kiri dan
 * berikutnya di kanan - lebih kecil, buram, separuh terpotong tepi bingkai -
 * dan desain yang sedang dipilih di tengah, penuh dan tajam.
 *
 * Bentuk ini menjawab dua hal sekaligus. Ruang kosong di kiri-kanan kartu tidak
 * lagi kosong, dan yang mengisinya bukan hiasan melainkan keterangan: bahwa
 * masih ada desain lain di kedua arah.
 *
 * Bocorannya baru muncul mulai `lg`. Di bawah itu ruangnya memang tidak ada -
 * kartu tunggalnya sendiri sudah hampir selebar layar - jadi kedua tetangganya
 * disembunyikan lewat `--peek-op: 0`, bukan diperkecil sampai tidak terbaca.
 *
 * ---------------------------------------------------------------------------
 * Mengapa transform, bukan jalur yang digulir
 * ---------------------------------------------------------------------------
 *
 * Versi pertama memakai `overflow-x: auto` + `scroll-snap`, dan itu memang
 * memberi sapuan jari beserta momentumnya secara cuma-cuma. Tetapi ia punya
 * satu batas yang tidak dapat ditawar: jalur gulir punya UJUNG. Di kartu
 * terakhir tidak ada lagi yang bisa dituju, dan satu-satunya cara kembali ke
 * awal adalah melompat melintasi kesembilan kartu di antaranya - yang terbaca
 * bukan "kembali ke awal" melainkan seluruh isinya diseruduk sekali jalan.
 *
 * Diminta agar tidak ada ujungnya sama sekali: sudah mentok di awal atau di
 * akhir pun tetap dapat dilanjutkan, saling terhubung.
 *
 * Dengan transform, letak tiap kartu dihitung dari **jarak melingkar**-nya
 * terhadap kartu yang sedang aktif. Tidak ada ujung karena tidak ada jalur:
 * dari desain kesepuluh, desain pertama memang sudah berdiri di sebelah kanan
 * sebagai bocoran, dan "berikutnya" cukup menggesernya satu langkah ke tengah.
 * Perputarannya karena itu tidak pernah terlihat sebagai lompatan.
 *
 * Yang hilang bersama jalur gulirnya - sapuan jari - ditulis ulang di sini
 * sebagai satu ambang seret sederhana.
 *
 * ---------------------------------------------------------------------------
 * Berjalan sendiri, berhenti saat sedang diperhatikan
 * ---------------------------------------------------------------------------
 *
 * Berpindah tiap lima detik, dan berhenti - bukan selamanya, melainkan selama
 * ada tanda seseorang sedang memperhatikannya: selama penunjuk ada di atasnya,
 * selama fokus papan ketik ada di dalamnya, dan selama sepuluh detik sesudah
 * pengunjung menggeser atau memilih sendiri. Sesudah itu ia melanjutkan, sebab
 * yang diminta memang perpindahan otomatis - bukan sekali jalan lalu diam.
 *
 * Tidak pernah menyala sama sekali bila `prefers-reduced-motion` menyala, atau
 * bila tabnya sedang tidak terlihat.
 */
export function HeroTemplateCarousel({
  locale,
  teks,
  lencana,
}: {
  locale: Locale;
  teks: {
    /** Keterangan di bawah kartu, mis. "Contoh hasil jadi". */
    caption: string;
    prev: string;
    next: string;
    /** Label bagi seluruh carousel-nya. */
    label: string;
  };
  /**
   * Lencana melayang yang menempel pada KARTU TENGAH.
   *
   * Diterima sebagai prop, bukan diletakkan pemanggilnya sendiri di sebelah
   * komponen ini, karena letaknya harus dihitung terhadap kartu tengah -
   * sementara panggungnya 1,35 kali lebih lebar daripada kartu itu. Ditaruh
   * di luar, lencananya menempel ke tepi panggung dan terlihat terlepas dari
   * kartunya.
   */
  lencana?: React.ReactNode;
}) {
  const total = TEMPLATE_ORDER.length;
  const info = TEMPLATE_INFO[locale];

  const [aktif, setAktif] = React.useState(0);
  /** Waktu paling awal perpindahan otomatis boleh berjalan lagi. */
  const jedaSampaiRef = React.useRef(0);
  /** Penunjuk sedang di atasnya, atau fokus ada di dalamnya. */
  const diperhatikanRef = React.useRef(false);
  const seretRef = React.useRef<number | null>(null);

  /**
   * Menunda perpindahan otomatis - sepuluh detik, bukan selamanya.
   *
   * Yang baru saja menggeser sendiri sedang memilih, dan carousel yang
   * berjalan di bawah jarinya adalah gangguan. Tetapi menghentikannya
   * selamanya juga keliru: yang diminta perpindahan otomatis, dan sekali
   * sentuh tidak berarti pengunjung ingin ia diam untuk seterusnya.
   */
  const tunda = React.useCallback(() => {
    jedaSampaiRef.current = Date.now() + 10_000;
  }, []);

  /** Berpindah `langkah` kartu, melingkar - tidak pernah mentok. */
  const geser = React.useCallback(
    (langkah: number) => {
      setAktif((n) => (((n + langkah) % total) + total) % total);
    },
    [total],
  );

  React.useEffect(() => {
    const kurangiGerak = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (kurangiGerak) return;

    const jam = window.setInterval(() => {
      // Tab yang tidak terlihat tidak digeser. Selain membuang daya, ia
      // membuat pengunjung kembali ke desain yang tidak pernah ia tinggalkan.
      if (document.visibilityState !== "visible") return;
      if (diperhatikanRef.current) return;
      if (Date.now() < jedaSampaiRef.current) return;
      geser(1);
    }, 5000);

    return () => window.clearInterval(jam);
  }, [geser]);

  return (
    <div
      role="group"
      aria-roledescription="carousel"
      aria-label={teks.label}
      className={cn(
        "relative",
        "[--doc-scale:0.36] xs:[--doc-scale:0.42] sm:[--doc-scale:0.5] 2xl:[--doc-scale:0.58]",
      )}
      onPointerEnter={() => {
        diperhatikanRef.current = true;
      }}
      onPointerLeave={() => {
        diperhatikanRef.current = false;
      }}
      onFocusCapture={() => {
        diperhatikanRef.current = true;
      }}
      onBlurCapture={() => {
        diperhatikanRef.current = false;
      }}
      onKeyDown={(e) => {
        if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
        e.preventDefault();
        tunda();
        geser(e.key === "ArrowRight" ? 1 : -1);
      }}
    >
      {/*
        Bingkai panggung.

        Lebarnya kelipatan lebar kartu (`--peek-w`), bukan angka tetap:
        kartunya berukuran fisik - 210mm dikali skala - dan panggung yang
        lebarnya ditulis terpisah akan meleset setiap kali skalanya berubah di
        titik henti berikutnya.

        `overflow-hidden` memang memotong kedua kartu tepi, dan itu disengaja:
        bocoran yang terpotong tepi bingkai justru yang membuatnya terbaca
        sebagai "masih ada lagi di sebelah sana". Kartu tengah tetap aman -
        setengah lebarnya 0,5 kali lebar kartu sementara setengah panggung
        0,675 kali, jadi bayangannya pun tidak tersentuh.

        `touch-action: pan-y` membiarkan gulir tegak halaman tetap jalan
        sementara sapuan mendatar ditangani sendiri.
      */}
      <div
        className={cn(
          "relative mx-auto overflow-hidden",
          "[--peek-w:1] [--peek-op:0] [--peek-blur:0px]",
          "lg:[--peek-w:1.35] lg:[--peek-op:0.45] lg:[--peek-blur:3px]",
        )}
        style={{
          width: "calc(210mm * var(--doc-scale) * var(--peek-w))",
          height: "calc(210mm * var(--doc-scale) * 297 / 210)",
          touchAction: "pan-y",
        }}
        onPointerDown={(e) => {
          seretRef.current = e.clientX;
          tunda();
        }}
        onPointerUp={(e) => {
          const awal = seretRef.current;
          seretRef.current = null;
          if (awal === null) return;
          const dx = e.clientX - awal;
          // 40 piksel: cukup jauh untuk membedakan sapuan dari ketukan yang
          // jarinya sedikit bergeser, cukup dekat untuk terasa ringan.
          if (Math.abs(dx) < 40) return;
          geser(dx < 0 ? 1 : -1);
        }}
        onPointerCancel={() => {
          seretRef.current = null;
        }}
      >
        {TEMPLATE_ORDER.map((id, i) => {
          /*
            Jarak MELINGKAR yang terpendek dari kartu aktif: -1 berarti satu
            langkah di kiri, +1 satu langkah di kanan. Inilah yang membuat
            desain pertama berdiri di sebelah kanan desain terakhir tanpa
            perlu menyalin elemennya, dan membuat perputarannya tidak pernah
            terlihat sebagai lompatan.
          */
          let d = i - aktif;
          if (d > total / 2) d -= total;
          if (d < -total / 2) d += total;

          const tengah = d === 0;
          const tetangga = Math.abs(d) === 1;
          // Yang lebih jauh diparkir tepat di belakang tetangganya lalu
          // disembunyikan, supaya kedatangannya nanti tidak melintasi
          // panggung.
          const dJepit = Math.max(-1, Math.min(1, d));

          return (
            <div
              key={id}
              aria-hidden={!tengah}
              className={cn(
                "absolute top-0 left-1/2 h-full transition-[transform,opacity,filter] duration-500 ease-out motion-reduce:transition-none",
                tengah ? "z-20" : "z-10",
              )}
              style={{
                width: "calc(210mm * var(--doc-scale))",
                transform: `translateX(-50%) translateX(${dJepit * 52}%) scale(${
                  tengah ? 1 : 0.72
                })`,
                filter: tengah ? "none" : "blur(var(--peek-blur))",
                opacity: tengah ? 1 : tetangga ? "var(--peek-op)" : 0,
                // Kartunya pajangan, bukan kendali. Yang dapat ditekan
                // hanyalah panah dan titik penanda - dan panggungnya sendiri,
                // yang menangani sapuan.
                pointerEvents: "none",
              }}
            >
              <div className="h-full overflow-hidden rounded-xl border border-ink-200 bg-white shadow-2xl">
                <div
                  style={{
                    width: "210mm",
                    transformOrigin: "top left",
                    transform: "scale(var(--doc-scale))",
                  }}
                >
                  <TemplatePreview template={id} locale={locale} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/*
        Kotak sebesar KARTU TENGAH, dipakai menggantung lencana.

        Ia tidak menggambar apa pun sendiri dan tidak menerima tekanan -
        gunanya cuma memberi lencana di dalamnya kerangka acuan yang benar,
        yaitu kartu tengah, bukan panggung yang lebih lebar.
      */}
      {lencana && (
        <div
          aria-hidden
          /*
            `z-30` bukan hiasan: kartu tengah memakai `z-20`, dan elemen
            ber-z-index selalu menang atas tetangganya yang `auto` - berapa
            pun urutannya di dalam DOM. Tanpa ini lencananya tenggelam di
            belakang kertas.
          */
          className="pointer-events-none absolute top-0 left-1/2 z-30 -translate-x-1/2"
          style={{
            width: "calc(210mm * var(--doc-scale))",
            height: "calc(210mm * var(--doc-scale) * 297 / 210)",
          }}
        >
          {lencana}
        </div>
      )}

      {/*
        Tombol panah menempel di tepi panggung.

        Diletakkan di luar panggung supaya tidak ikut terpotong
        `overflow-hidden`, dan supaya tetap dapat ditekan sementara kartunya
        sedang bergerak.
      */}
      <button
        type="button"
        onClick={() => {
          tunda();
          geser(-1);
        }}
        aria-label={teks.prev}
        title={teks.prev}
        className="tap-target absolute top-[35%] left-0 z-30 grid h-9 w-9 -translate-x-1/2 place-items-center rounded-full border border-ink-200 bg-white text-ink-700 shadow-lg transition-colors hover:bg-ink-100"
      >
        <ChevronLeft size={18} aria-hidden />
      </button>
      <button
        type="button"
        onClick={() => {
          tunda();
          geser(1);
        }}
        aria-label={teks.next}
        title={teks.next}
        className="tap-target absolute top-[35%] right-0 z-30 grid h-9 w-9 translate-x-1/2 place-items-center rounded-full border border-ink-200 bg-white text-ink-700 shadow-lg transition-colors hover:bg-ink-100"
      >
        <ChevronRight size={18} aria-hidden />
      </button>

      {/* ------------------------------------------------------------- */}
      {/* Keterangan dan titik penanda                                   */}
      {/* ------------------------------------------------------------- */}
      <p
        className="mt-5 text-center text-[11px] text-ink-500"
        aria-live="polite"
      >
        {teks.caption}
        {" — "}
        <span className="font-semibold text-ink-700">
          {info[TEMPLATE_ORDER[aktif]].name}
        </span>
      </p>

      {/*
        Titiknya tombol sungguhan, bukan hiasan: sepuluh desain terlalu banyak
        untuk dilewati satu per satu dengan panah, dan yang sudah melihat
        semuanya sekali biasanya ingin kembali ke satu yang tadi disukainya.
      */}
      <div className="mt-2.5 flex items-center justify-center gap-1.5">
        {TEMPLATE_ORDER.map((id, i) => (
          <button
            key={id}
            type="button"
            onClick={() => {
              tunda();
              setAktif(i);
            }}
            aria-label={info[id].name}
            aria-current={i === aktif ? "true" : undefined}
            className={cn(
              "tap-target h-1.5 rounded-full transition-all",
              i === aktif
                ? "w-5 bg-ink-800"
                : "w-1.5 bg-ink-300 hover:bg-ink-500",
            )}
          />
        ))}
      </div>
    </div>
  );
}

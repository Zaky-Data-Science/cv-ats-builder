"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TemplatePreview } from "@/components/home/TemplatePreview";
import type { Locale } from "@/lib/i18n/config";
import { TEMPLATE_INFO, TEMPLATE_ORDER } from "@/lib/resume/templates";
import { cn } from "@/lib/utils";

/**
 * ============================================================================
 *  KARTU CV DI HALAMAN DEPAN - KESEPULUH DESAIN, BUKAN SATU
 * ============================================================================
 *
 * Hero halaman depan dulu memajang satu contoh saja, desain Klasik, sementara
 * kesepuluh desainnya baru terlihat di galeri jauh di bawah. Diminta begini:
 * *"gk semua mau baca sampe bawah dan liat templatenya"* - dan itu benar,
 * jumlah pilihan desain adalah salah satu hal yang paling menentukan orang mau
 * mencoba atau tidak, jadi ia tidak boleh menunggu digulir.
 *
 * ---------------------------------------------------------------------------
 * Menggulir sungguhan, bukan menggeser buatan sendiri
 * ---------------------------------------------------------------------------
 *
 * Slide-nya berpindah lewat `overflow-x: auto` + `scroll-snap`, bukan lewat
 * `transform` yang dihitung sendiri. Yang didapat gratis karenanya banyak dan
 * semuanya sulit ditiru dengan benar: sapuan jari di ponsel beserta
 * momentumnya, gulir mendatar dengan roda dan trackpad, seret dengan tombol
 * tengah, papan ketik, dan pembaca layar yang tetap dapat menyusuri seluruh
 * isinya. Yang ditulis sendiri di sini hanya penanda posisinya.
 *
 * ---------------------------------------------------------------------------
 * Bolak-balik, bukan meloncat kembali ke awal
 * ---------------------------------------------------------------------------
 *
 * Sesampainya di desain terakhir, arahnya BERBALIK - satu per satu kembali ke
 * awal, lalu maju lagi. Bukan meloncat langsung ke slide pertama.
 *
 * Bedanya terlihat jelas. Melompat dari slide kesepuluh ke pertama berarti
 * melintasi kesembilan slide di antaranya dalam satu gerakan, dan yang
 * terbaca bukan "kembali ke awal" melainkan seluruh isinya diseruduk sekali
 * jalan. Diminta begitu: jangan tiba-tiba langsung kembali ke awal, biarkan
 * satu per satu tanpa ada yang dilewati.
 *
 * ---------------------------------------------------------------------------
 * Berjalan sendiri, berhenti saat sedang diperhatikan
 * ---------------------------------------------------------------------------
 *
 * Perpindahan otomatis ada supaya pengunjung yang diam pun melihat bahwa
 * desainnya lebih dari satu - itulah seluruh alasan bagian ini diubah. Ia
 * berpindah tiap lima detik, dan berhenti - bukan selamanya, melainkan selama
 * ada tanda seseorang sedang memperhatikannya:
 *
 * - selama penunjuk berada di atasnya, atau fokus papan ketik ada di dalamnya;
 * - sepuluh detik sesudah pengunjung menggeser atau memilih sendiri. Ia sedang
 *   memilih, dan carousel yang berjalan di bawah jarinya adalah gangguan.
 *   Sesudah itu ia melanjutkan, sebab yang diminta memang perpindahan
 *   otomatis - bukan sekali jalan lalu diam selamanya.
 *
 * Ia tidak pernah menyala sama sekali bila:
 *
 * - `prefers-reduced-motion` menyala - gerak berulang yang tidak diminta
 *   adalah persis yang dihindari setelan itu;
 * - tabnya sedang tidak terlihat - menggeser di latar belakang membuang daya
 *   dan pengunjung kembali ke posisi yang tidak pernah ia tinggalkan.
 *
 * ---------------------------------------------------------------------------
 * Gulirnya dianimasikan sendiri, bukan `behavior: "smooth"`
 * ---------------------------------------------------------------------------
 *
 * Bawaan peramban memakai durasi dan kurva yang tidak dapat diatur, dan untuk
 * jarak sependek satu slide ia terasa menyentak. Yang dipakai di sini kurva
 * easeInOutCubic selama 700 milidetik: berangkat pelan, cepat di tengah, lalu
 * mendarat pelan.
 *
 * Yang dianimasikan hanya perpindahan yang DIMINTA program - otomatis, panah,
 * dan titik penanda. Sapuan jari tetap gulir asli peramban beserta
 * momentumnya; menimpanya justru membuat sapuan terasa lengket.
 */
export function HeroTemplateCarousel({
  locale,
  teks,
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
}) {
  const trackRef = React.useRef<HTMLDivElement>(null);
  const animRef = React.useRef<number | null>(null);
  /** +1 maju, -1 mundur. Berbalik di kedua ujungnya. */
  const arahRef = React.useRef(1);
  /** Waktu paling awal perpindahan otomatis boleh berjalan lagi. */
  const jedaSampaiRef = React.useRef(0);
  /** Penunjuk sedang di atasnya, atau fokus ada di dalamnya. */
  const diperhatikanRef = React.useRef(false);
  const [aktif, setAktif] = React.useState(0);

  const total = TEMPLATE_ORDER.length;
  const info = TEMPLATE_INFO[locale];

  /** Menggeser ke slide ke-`i` dengan kurva sendiri. */
  const keSlide = React.useCallback((i: number, halus = true) => {
    const track = trackRef.current;
    if (!track || track.clientWidth === 0) return;

    if (animRef.current !== null) cancelAnimationFrame(animRef.current);
    const tujuan = i * track.clientWidth;

    if (!halus) {
      track.scrollLeft = tujuan;
      return;
    }

    const awal = track.scrollLeft;
    const jarak = tujuan - awal;
    if (Math.abs(jarak) < 1) return;

    const mulai = performance.now();
    const DURASI = 700;

    const langkah = (sekarang: number) => {
      const p = Math.min(1, (sekarang - mulai) / DURASI);
      // easeInOutCubic - berangkat pelan, cepat di tengah, mendarat pelan.
      const e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
      track.scrollLeft = awal + jarak * e;
      animRef.current = p < 1 ? requestAnimationFrame(langkah) : null;
    };

    animRef.current = requestAnimationFrame(langkah);
  }, []);

  // Membatalkan animasi yang masih berjalan saat komponennya dilepas.
  React.useEffect(
    () => () => {
      if (animRef.current !== null) cancelAnimationFrame(animRef.current);
    },
    [],
  );

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

  /*
    Posisi aktif dibaca DARI gulirnya, bukan disimpan terpisah lalu dipaksakan
    kepadanya. Dengan begitu sapuan jari, roda, papan ketik, dan tombol panah
    di bawah ini semuanya bermuara pada satu sumber kebenaran yang sama - dan
    tidak mungkin ada keadaan di mana titik penanda menunjuk slide yang
    berbeda dari yang sedang terlihat.
  */
  const bacaPosisi = React.useCallback(() => {
    const track = trackRef.current;
    if (!track || track.clientWidth === 0) return;
    setAktif(Math.round(track.scrollLeft / track.clientWidth));
  }, []);

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

      const track = trackRef.current;
      if (!track || track.clientWidth === 0) return;

      const i = Math.round(track.scrollLeft / track.clientWidth);
      // Berbalik di ujung, bukan meloncat ke awal.
      if (i >= total - 1) arahRef.current = -1;
      else if (i <= 0) arahRef.current = 1;

      keSlide(i + arahRef.current);
    }, 5000);

    return () => window.clearInterval(jam);
  }, [keSlide, total]);

  return (
    <div
      role="group"
      aria-roledescription="carousel"
      aria-label={teks.label}
      className="relative"
      onPointerDown={tunda}
      onKeyDown={tunda}
      onWheel={tunda}
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
    >
      {/*
        Lebar bingkainya dihitung dari skalanya (210mm x skala) - sama seperti
        kartu tunggal sebelumnya - sehingga halaman A4 yang diperkecil selalu
        mengisi bingkainya dengan pas tanpa menyisakan celah.
      */}
      <div
        className="relative mx-auto [--doc-scale:0.36] xs:[--doc-scale:0.42] sm:[--doc-scale:0.5] 2xl:[--doc-scale:0.58]"
        style={{ width: "calc(210mm * var(--doc-scale))" }}
      >
        <div className="relative overflow-hidden rounded-xl border border-ink-200 bg-white shadow-2xl">
          {/*
            `overscroll-x-contain` menahan sapuan mendatar di ujung slide
            supaya tidak diteruskan ke halaman - di peramban yang memetakan
            sapuan mendatar ke "kembali", tanpa ini menggeser melewati desain
            terakhir justru meninggalkan halamannya.
          */}
          <div
            ref={trackRef}
            onScroll={bacaPosisi}
            className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain"
          >
            {TEMPLATE_ORDER.map((id, i) => (
              <div
                key={id}
                role="group"
                aria-roledescription="slide"
                aria-label={`${info[id].name} (${i + 1}/${total})`}
                className="w-full shrink-0 snap-center"
                style={{ aspectRatio: "210 / 297", overflow: "hidden" }}
              >
                {/*
                  Slide yang bukan giliran menyusut dan memudar sedikit.

                  Transformnya dipasang pada pembungkus DI DALAM slide, bukan
                  pada slide-nya sendiri: kotak slide adalah yang dipakai
                  scroll-snap untuk menghitung titik berhentinya, dan
                  menskalakannya akan menggeser titik itu sehingga kertas
                  berhenti tidak di tengah.

                  `motion-reduce:transition-none` menghormati setelan yang
                  sama dengan yang mematikan perpindahan otomatis - yang
                  meminta gerak dikurangi tidak sedang meminta gerak yang
                  lebih halus.
                */}
                <div
                  className={cn(
                    "h-full origin-center transition-[transform,opacity] duration-500 ease-out motion-reduce:transition-none",
                    i === aktif
                      ? "scale-100 opacity-100"
                      : "scale-[0.965] opacity-70",
                  )}
                >
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
            ))}
          </div>
          <span className="tilt-sheen" aria-hidden />
        </div>

        {/*
          Tombol panah menempel di tepi kartu, setengah keluar.

          Diletakkan DI LUAR jalur gulirnya supaya tidak ikut bergeser bersama
          slide - dan karena itu pula ia tetap dapat ditekan sementara jalurnya
          sedang bergerak.
        */}
        <button
          type="button"
          onClick={() => {
            tunda();
            keSlide(aktif - 1);
          }}
          aria-label={teks.prev}
          title={teks.prev}
          className="tap-target absolute top-1/2 -left-3 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-ink-200 bg-white text-ink-700 shadow-lg transition-colors hover:bg-ink-100 sm:-left-4"
        >
          <ChevronLeft size={18} aria-hidden />
        </button>
        <button
          type="button"
          onClick={() => {
            tunda();
            keSlide(aktif + 1);
          }}
          aria-label={teks.next}
          title={teks.next}
          className="tap-target absolute top-1/2 -right-3 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-ink-200 bg-white text-ink-700 shadow-lg transition-colors hover:bg-ink-100 sm:-right-4"
        >
          <ChevronRight size={18} aria-hidden />
        </button>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* Keterangan dan titik penanda                                   */}
      {/* ------------------------------------------------------------- */}
      <p className="mt-5 text-center text-[11px] text-ink-500">
        {teks.caption}
        {" — "}
        <span className="font-semibold text-ink-700">
          {info[TEMPLATE_ORDER[aktif] ?? TEMPLATE_ORDER[0]].name}
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
              keSlide(i);
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

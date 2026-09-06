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
 * Berjalan sendiri, tetapi berhenti begitu disentuh
 * ---------------------------------------------------------------------------
 *
 * Perpindahan otomatis ada supaya pengunjung yang diam pun melihat bahwa
 * desainnya lebih dari satu - itulah seluruh alasan bagian ini diubah. Tetapi
 * ia berhenti PERMANEN pada sentuhan pertama: begitu pengunjung menggeser
 * sendiri, ia sedang memilih, dan carousel yang tetap berjalan di bawah
 * jarinya adalah gangguan, bukan bantuan.
 *
 * Ia juga tidak pernah menyala sama sekali bila:
 *
 * - `prefers-reduced-motion` menyala - gerak berulang yang tidak diminta
 *   adalah persis yang dihindari setelan itu;
 * - tabnya sedang tidak terlihat - menggeser di latar belakang membuang daya
 *   dan pengunjung kembali ke posisi yang tidak pernah ia tinggalkan.
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
  const [aktif, setAktif] = React.useState(0);
  const [otomatis, setOtomatis] = React.useState(true);

  const total = TEMPLATE_ORDER.length;
  const info = TEMPLATE_INFO[locale];

  /** Menggeser ke slide ke-`i`, memutar bila melewati ujungnya. */
  const keSlide = React.useCallback(
    (i: number, halus = true) => {
      const track = trackRef.current;
      if (!track) return;
      const indeks = ((i % total) + total) % total;
      track.scrollTo({
        left: indeks * track.clientWidth,
        behavior: halus ? "smooth" : "auto",
      });
    },
    [total],
  );

  /** Menghentikan perpindahan otomatis - sekali berhenti, tidak menyala lagi. */
  const hentikanOtomatis = React.useCallback(() => setOtomatis(false), []);

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
    if (!otomatis) return;

    const kurangiGerak = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (kurangiGerak) return;

    const jam = window.setInterval(() => {
      // Tab yang tidak terlihat tidak digeser. Selain membuang daya, ia
      // membuat pengunjung kembali ke desain yang tidak pernah ia tinggalkan.
      if (document.visibilityState !== "visible") return;
      const track = trackRef.current;
      if (!track || track.clientWidth === 0) return;
      keSlide(Math.round(track.scrollLeft / track.clientWidth) + 1);
    }, 4200);

    return () => window.clearInterval(jam);
  }, [otomatis, keSlide]);

  return (
    <div
      role="group"
      aria-roledescription="carousel"
      aria-label={teks.label}
      className="relative"
      onPointerDown={hentikanOtomatis}
      onKeyDown={hentikanOtomatis}
      onWheel={hentikanOtomatis}
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
            hentikanOtomatis();
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
            hentikanOtomatis();
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
              hentikanOtomatis();
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

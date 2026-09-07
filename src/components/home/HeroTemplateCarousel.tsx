"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TemplatePreview } from "@/components/home/TemplatePreview";
import type { Locale } from "@/lib/i18n/config";
import { TEMPLATE_INFO, TEMPLATE_ORDER } from "@/lib/resume/templates";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { useMulaiDesain } from "./PilihDesain";

/**
 * ============================================================================
 *  KARTU CV DI HALAMAN DEPAN - KESEPULUH DESAIN, SATU PER SATU
 * ============================================================================
 *
 * Hero halaman depan dulu memajang satu contoh saja, desain Klasik, sementara
 * kesepuluh desainnya baru terlihat di galeri jauh di bawah - padahal jumlah
 * pilihan desain termasuk hal yang paling menentukan orang mau mencoba atau
 * tidak, jadi ia tidak boleh menunggu digulir.
 *
 * ---------------------------------------------------------------------------
 * Satu kartu pada satu waktu - dan bentuk yang PERNAH DICOBA lalu dibatalkan
 * ---------------------------------------------------------------------------
 *
 * Yang tampil satu kartu, bergeser mendatar seperti biasa.
 *
 * Sempat dicoba bentuk lain: tiga kartu sekaligus, dengan tetangga kiri-kanan
 * diperkecil dan diburamkan sebagai bocoran. Dibatalkan setelah dilihat -
 * hasilnya dinilai jelek. Jangan mencobanya lagi tanpa diminta; ruang kosong
 * di sekitar kartu diselesaikan dengan merapatkan hero-nya, bukan dengan
 * mengisinya memakai kartu yang tidak dapat dibaca.
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
  signedIn,
}: {
  locale: Locale;
  teks: {
    /** Keterangan di bawah kartu, mis. "Contoh hasil jadi". */
    caption: string;
    prev: string;
    next: string;
    /** Label bagi seluruh carousel-nya. */
    label: string;
    /** Pola label bagi tindakan "pakai desain ini", memuat `{desain}`. */
    pakai: string;
    /** Label pendek pada ajakan yang menempel di kartu. */
    pakaiSingkat: string;
  };
  /** Menentukan ke mana ketukan membawa - lihat `useMulaiDesain`. */
  signedIn: boolean;
  /**
   * Lencana melayang yang menempel pada KARTU TENGAH.
   *
   * Diterima sebagai prop, bukan diletakkan pemanggilnya sendiri di sebelah
   * komponen ini, supaya letaknya dihitung terhadap bingkai kartu - bukan
   * terhadap pembungkus luar yang juga memuat keterangan dan titik penanda di
   * bawahnya.
   */
  lencana?: React.ReactNode;
}) {
  const total = TEMPLATE_ORDER.length;
  const { mulai, sibuk } = useMulaiDesain(signedIn);
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
      /*
        Skala kertasnya tidak lagi ditulis di sini sebagai tangga LEBAR layar.
        Ia pindah ke `.kertas-hero` di globals.css, dan di sana tangganya
        mengikuti TINGGI layar mulai `lg` - sebab yang menentukan kertas ini
        muat atau tidak memang tingginya, bukan lebarnya. Alasan lengkapnya
        ada di komentar kelas itu.
      */
      className={cn("kertas-hero relative")}
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
        Bingkai kartu.

        Lebarnya persis selebar satu kartu - 210mm dikali skalanya - dan
        `overflow-hidden` memotong tetangga kiri-kanan yang sedang menunggu
        gilirannya tepat di luar bingkai. Yang terlihat karena itu selalu satu
        kartu; yang lain masuk dan keluar lewat tepi.

        Bayangannya dipasang di sini, pada bingkainya, bukan pada tiap kartu.
        Bayangan yang ikut menempel di kartu akan terpotong bersamanya, dan
        yang tersisa cuma garis gelap di tepi.

        `touch-action: pan-y` membiarkan gulir tegak halaman tetap jalan
        sementara sapuan mendatar ditangani sendiri.
      */}
      <div
        className={cn(
          "group relative mx-auto overflow-hidden rounded-xl shadow-2xl",
          sibuk ? "cursor-progress" : "cursor-pointer",
        )}
        style={{
          width: "calc(210mm * var(--doc-scale))",
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
          //
          // Ambang yang sama kini memutuskan DUA hal, bukan satu: di atasnya
          // sebuah sapuan yang menggeser kartu, di bawahnya sebuah ketukan
          // yang membuka penyusun dengan desain yang sedang tampil. Keduanya
          // memakai satu angka dengan sengaja - kalau ketukan dan sapuan
          // dibedakan oleh dua ambang berbeda, akan ada gerakan di antaranya
          // yang tidak melakukan apa-apa, dan itu terbaca sebagai kerusakan.
          if (Math.abs(dx) < 40) {
            void mulai(TEMPLATE_ORDER[aktif]);
            return;
          }
          geser(dx < 0 ? 1 : -1);
        }}
        onPointerCancel={() => {
          seretRef.current = null;
        }}
      >
        {/*
          Ajakan "pakai desain ini", menempel pada kartu yang sedang tampil.

          Kartunya sendiri sudah dapat ditekan, tetapi tanpa tanda apa pun itu
          hanya diketahui orang yang kebetulan mencoba. Ia tersembunyi sampai
          kursor datang, dan SELALU terlihat di layar sentuh - lihat
          `.ajakan-desain` di globals.css.

          `z-30` supaya ia berdiri di atas kartu tengah yang `z-20`, dan
          `pointer-events-none` supaya ketukannya tetap sampai ke panggung
          yang menanganinya.

          DI TENGAH, BUKAN DI TEPI BAWAH

          Percobaan pertama menaruhnya di tepi bawah beserta gradasi gelap.
          Terlihat di layar sentuh dan langsung ketahuan salah: ia bertabrakan
          dengan lencana "Tersimpan otomatis" yang memang duduk di kanan bawah,
          dan tulisannya terpotong separuh. Tengah kartu satu-satunya tempat
          yang tidak diperebutkan - lencana skor di kiri atas, lencana simpan
          di kanan bawah. Gradasinya ikut dibuang: kertas CV itu yang justru
          ingin dilihat, dan menggelapkannya demi sebuah ajakan menukar hal
          yang penting dengan hal yang mendukungnya.
        */}
        <span className="ajakan-desain pointer-events-none absolute inset-0 z-30 grid place-items-center px-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-ink-900 px-4 py-2.5 text-[12px] font-semibold text-white shadow-2xl ring-1 ring-white/25">
            {teks.pakaiSingkat}
            <ArrowRight size={14} />
          </span>
        </span>

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
          // Yang lebih jauh diparkir tepat di belakang tetangganya, supaya
          // kedatangannya nanti tidak melintasi panggung - itulah yang dulu
          // terbaca sebagai "diseruduk sekali jalan".
          const dJepit = Math.max(-1, Math.min(1, d));

          return (
            <div
              key={id}
              aria-hidden={!tengah}
              className={cn(
                "absolute top-0 left-1/2 h-full transition-[transform,opacity] duration-500 ease-out motion-reduce:transition-none",
                tengah ? "z-20" : "z-10",
              )}
              style={{
                width: "calc(210mm * var(--doc-scale))",
                // Sepenuh lebar panggung, bukan sebagian: yang di sebelah
                // duduk tepat di luar bingkai, lalu masuk utuh menggantikan
                // yang tengah. Itulah geseran biasa yang dikenali orang.
                transform: `translateX(-50%) translateX(${dJepit * 100}%)`,
                opacity: tengah || tetangga ? 1 : 0,
                // Kartunya pajangan, bukan kendali. Yang dapat ditekan
                // hanyalah panah dan titik penanda - dan panggungnya sendiri,
                // yang menangani sapuan.
                pointerEvents: "none",
              }}
            >
              <div className="h-full overflow-hidden border border-ink-200 bg-white">
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
        Tombol panah, pada kotak SEBESAR KARTU yang tidak ikut terpotong.

        Letaknya menunggangi tepi kartu - setengah di luar, setengah di dalam.
        Sempat sepenuhnya di dalam kartu, dan itu keliru: di ponsel keduanya
        mendarat tepat di atas tulisan CV-nya dan menutupi bagian PENDIDIKAN.
        Menunggangi tepi membuat bagian yang menimpa kertas jatuh di jarak
        tepinya, tempat memang tidak ada tulisan.

        Kotaknya sendiri terpisah dari bingkai kartu, sebab bingkai itu
        memotong apa pun yang keluar (`overflow-hidden`) - yang memang perlu
        bagi kartu yang sedang bergeser, tetapi akan memangkas separuh
        tombolnya.

        Kotaknya `pointer-events-none` supaya tidak menghalangi sapuan jari di
        atas kertas; hanya kedua tombolnya yang menerima tekanan kembali.

        Letak dipasang pada `<span>` pembungkus, bukan pada tombolnya, dan itu
        keharusan - lihat jebakan `tap-target` di globals.css.
      */}
      <div
        className="pointer-events-none absolute top-0 left-1/2 z-40 -translate-x-1/2"
        style={{
          width: "calc(210mm * var(--doc-scale))",
          height: "calc(210mm * var(--doc-scale) * 297 / 210)",
        }}
      >
        <span className="pointer-events-auto absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2">
          <button
            type="button"
            onClick={() => {
              tunda();
              geser(-1);
            }}
            aria-label={teks.prev}
            title={teks.prev}
            className="tap-target grid h-9 w-9 place-items-center rounded-full border border-ink-200 bg-white text-ink-700 shadow-lg transition-colors hover:bg-ink-100"
          >
            <ChevronLeft size={18} aria-hidden />
          </button>
        </span>
        <span className="pointer-events-auto absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2">
          <button
            type="button"
            onClick={() => {
              tunda();
              geser(1);
            }}
            aria-label={teks.next}
            title={teks.next}
            className="tap-target grid h-9 w-9 place-items-center rounded-full border border-ink-200 bg-white text-ink-700 shadow-lg transition-colors hover:bg-ink-100"
          >
            <ChevronRight size={18} aria-hidden />
          </button>
        </span>
      </div>

      {/*
        Kotak sebesar kartunya, dipakai menggantung lencana.

        Ia tidak menggambar apa pun sendiri dan tidak menerima tekanan -
        gunanya cuma memberi lencana di dalamnya kerangka acuan yang benar,
        yaitu kartunya, bukan pembungkus luar yang juga memuat keterangan dan
        titik penanda di bawahnya.
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

      {/* ------------------------------------------------------------- */}
      {/* Keterangan dan titik penanda                                   */}
      {/* ------------------------------------------------------------- */}
      {/*
        Keterangannya sebuah TOMBOL, bukan sekadar tulisan.

        Ketukan pada kartunya sendiri sudah membuka penyusun, tetapi ketukan
        itu hidup pada sebuah `<div>` panggung - tidak dapat dijangkau papan
        ketik dan tidak disebutkan pembaca layar sebagai sesuatu yang dapat
        dilakukan. Menjadikan keterangan ini tombol menutup keduanya tanpa
        menambah satu piksel pun tinggi hero, yang di sini memang dijatah
        ketat: barisnya sudah ada, hanya sifatnya yang berubah.
      */}
      <button
        type="button"
        onClick={() => void mulai(TEMPLATE_ORDER[aktif])}
        disabled={sibuk}
        aria-label={teks.pakai.replace(
          "{desain}",
          info[TEMPLATE_ORDER[aktif]].name,
        )}
        className="tap-target mt-3 block w-full text-center text-[11px] text-ink-500 transition-colors hover:text-ink-800 disabled:cursor-progress"
      >
        <span aria-live="polite">
          {teks.caption}
          {" — "}
          <span className="font-semibold text-ink-700">
            {info[TEMPLATE_ORDER[aktif]].name}
          </span>
        </span>
      </button>

      {/*
        Titiknya tombol sungguhan, bukan hiasan: sepuluh desain terlalu banyak
        untuk dilewati satu per satu dengan panah, dan yang sudah melihat
        semuanya sekali biasanya ingin kembali ke satu yang tadi disukainya.
      */}
      <div className="mt-2 flex items-center justify-center gap-1.5">
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

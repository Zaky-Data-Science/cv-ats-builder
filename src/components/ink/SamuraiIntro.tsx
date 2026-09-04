"use client";

import * as React from "react";
import {
  getIntroServerSnapshot,
  getIntroSnapshot,
  INTRO_DURASI_MS,
  INTRO_LEWAT_MS,
  subscribeIntro,
  tandaiIntroDilihat,
} from "@/lib/intro";

/**
 * ============================================================================
 *  INTRO PEMBUKA - SATU TEBASAN
 * ============================================================================
 *
 * Selembar CV muncul, sebuah siluet melintas, satu tebasan membelahnya, dan
 * tintanya menyebar menjadi halaman depan. Seluruhnya 2,1 detik.
 *
 * ---------------------------------------------------------------------------
 * Yang menentukan bentuk kode ini
 * ---------------------------------------------------------------------------
 *
 * 1. **Halaman tidak boleh menunggu animasinya.** Intro digambar sebagai
 *    lapisan di atas halaman yang sudah utuh di belakangnya - bukan sebagai
 *    gerbang yang menahan isinya. Bila JavaScript gagal, animasinya tidak
 *    pernah muncul dan pengunjung langsung melihat halaman depan; tidak ada
 *    keadaan "layar tersangkut di pembuka".
 *
 * 2. **Tidak ada gambar, tidak ada pustaka.** Siluetnya SVG sebaris yang
 *    mewarisi `currentColor`, sehingga ia otomatis berlawanan dengan tema
 *    tanpa satu pun cabang kode. Menambah berkas gambar akan mengembalikan
 *    beban yang baru saja dipangkas dari halaman depan - dan halaman depan
 *    itulah yang paling menentukan kesan pertama di jaringan seluler.
 *
 * 3. **Hanya transform dan opacity yang dianimasikan**, sehingga seluruh
 *    kerjanya jatuh ke compositor dan tidak memicu perhitungan tata letak.
 *
 * 4. **Sekali per pemuatan halaman, dan selalu dapat dilewati.** Sesi 10
 *    mengubahnya dari sekali-per-perangkat menjadi setiap kali halaman
 *    dimuat ulang - lihat `src/lib/intro.ts` untuk alasannya. Keberatan
 *    lamanya, bahwa pembuka yang berulang berubah menjadi penghalang,
 *    dijawab di sini: satu ketukan, satu klik, atau tombol apa pun
 *    melewatinya. Bukan tombol "lewati" yang harus dicari - seluruh layar
 *    adalah tombolnya.
 */

export function SamuraiIntro() {
  /*
    Keputusan diambil store di luar React - lihat src/lib/intro.ts untuk
    alasannya. Di server jawabannya selalu "tidak perlu", sehingga HTML yang
    dikirim tidak pernah memuat lapisan ini dan tidak ada ketidakcocokan
    hidrasi yang harus dibungkam.
  */
  const perlu = React.useSyncExternalStore(
    subscribeIntro,
    getIntroSnapshot,
    getIntroServerSnapshot,
  );

  const [selesai, setSelesai] = React.useState(false);
  /* Adegannya sedang dipercepat karena penggunanya meminta lanjut. */
  const [dilewati, setDilewati] = React.useState(false);

  React.useEffect(() => {
    if (!perlu || selesai) return;

    // Ditandai saat adegannya dimulai, bukan saat berakhir. Pengunjung yang
    // berpindah halaman di tengah adegan sudah melihat pembukanya; memutarnya
    // lagi saat ia kembali akan terasa seperti aplikasi yang tidak ingat.
    tandaiIntroDilihat();

    const timer = setTimeout(() => setSelesai(true), INTRO_DURASI_MS);

    /*
      Melewati adegannya.

      Peristiwanya didengarkan di `window`, bukan pada lapisan intronya
      sendiri: lapisan itu ber-`pointer-events: none` - dan memang harus,
      supaya halaman di belakangnya tetap dapat disentuh selama adegan
      berjalan. Menyalakan pointer-events demi menangkap ketukan justru akan
      menghalangi hal yang sengaja dibiarkan tembus.

      `pointerdown`, bukan `click`: ketukan yang berakhir menjadi gulir tidak
      pernah menjadi klik, sementara maksud "lanjutkan" sudah jelas sejak
      jarinya menyentuh layar.
    */
    const lewati = () => {
      setDilewati(true);
      clearTimeout(timer);
      setTimeout(() => setSelesai(true), INTRO_LEWAT_MS);
    };

    window.addEventListener("pointerdown", lewati, { once: true, passive: true });
    window.addEventListener("keydown", lewati, { once: true });
    window.addEventListener("wheel", lewati, { once: true, passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener("pointerdown", lewati);
      window.removeEventListener("keydown", lewati);
      window.removeEventListener("wheel", lewati);
    };
  }, [perlu, selesai]);

  if (!perlu || selesai) return null;

  return (
    <div
      className="intro-akar"
      aria-hidden
      data-intro
      data-lewat={dilewati ? "" : undefined}
      style={{ "--intro-lewat": `${INTRO_LEWAT_MS}ms` } as React.CSSProperties}
    >
      {/* Latar yang memudar di akhir, memperlihatkan halaman di belakangnya. */}
      <div className="intro-tirai" />

      <div className="intro-panggung">
        {/*
          Kertas dibelah menjadi dua bagian yang saling menjauh. Keduanya
          memakai clip-path miring yang sama tetapi berlawanan, sehingga
          garis belahnya tepat berimpit - bukan dua bentuk terpisah yang
          kebetulan berdekatan.
        */}
        <div className="intro-kertas intro-kertas-kiri">
          <BarisKertas />
        </div>
        <div className="intro-kertas intro-kertas-kanan">
          <BarisKertas />
        </div>

        <Siluet />

        {/* Sapuan kuas yang melintas mengikuti arah tebasan. */}
        <div className="intro-tebasan" />

        {/* Tinta yang menyebar dari titik belah, lalu menutup adegannya. */}
        <div className="intro-tinta" />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

/**
 * Garis-garis abu yang mewakili teks CV.
 *
 * Sengaja bukan teks sungguhan: yang dibutuhkan hanya kesan "selembar CV",
 * dan teks sungguhan di dalam lapisan berhias justru akan dibacakan pembaca
 * layar sebagai isi halaman.
 */
function BarisKertas() {
  const baris = [92, 64, 0, 88, 80, 86, 0, 70, 84, 76, 82, 0, 60, 88, 74];

  return (
    <div className="intro-kertas-isi">
      <span className="intro-baris intro-baris-judul" />
      <span className="intro-baris intro-baris-sub" />
      {baris.map((lebar, i) =>
        lebar === 0 ? (
          <span key={i} className="intro-jeda" />
        ) : (
          <span key={i} className="intro-baris" style={{ width: `${lebar}%` }} />
        ),
      )}
    </div>
  );
}

/**
 * Siluet samurai beserta katananya.
 *
 * Digambar sebagai satu bentuk gelap tanpa raut wajah maupun rincian
 * busana - yang perlu terbaca hanyalah sikap tubuh seseorang yang baru saja
 * menebas. Rincian lebih jauh akan menggeser kesannya dari "sinematik"
 * menjadi "ilustrasi karakter", dan itu bukan yang dicari halaman ini.
 */
function Siluet() {
  return (
    <svg
      className="intro-siluet"
      viewBox="0 0 200 260"
      fill="currentColor"
      aria-hidden
    >
      {/*
        Katana - digambar lebih dulu supaya tubuh menutupi pangkalnya dan
        keduanya terbaca menyatu, bukan sebagai dua benda yang bertumpuk.
        Bilahnya meruncing: lebar di pangkal, hampir nol di ujung.
      */}
      <path d="M148 92 C164 70 182 42 197 16 C192 46 178 76 159 100 C155 100 151 97 148 92 Z" />
      {/* Tsuba - sekat kecil antara bilah dan genggaman. */}
      <path d="M138 100 L153 89 L157 95 L142 106 Z" />

      {/*
        Kasa - topi jerami berbentuk kerucut lebar.

        Bentuk inilah yang paling menentukan apakah siluetnya terbaca sebagai
        samurai atau tidak; tanpa kerucutnya, apa pun di bawahnya hanya
        terbaca sebagai sosok bertudung.
      */}
      <path d="M50 64 L100 18 L150 64 C124 72 76 72 50 64 Z" />

      {/* Bahu dan badan - menyempit di bahu lalu melebar seperti hakama. */}
      <path d="M82 66 C74 82 69 104 66 130 C63 156 61 180 59 200 L141 200 C139 180 137 156 134 130 C131 104 126 82 118 66 Z" />

      {/* Lengan pemegang katana, terangkat ke kanan atas. */}
      <path d="M116 74 C130 76 143 84 150 94 L140 108 C132 98 122 92 112 90 Z" />

      {/* Kaki dalam kuda-kuda - satu maju, satu menahan di belakang. */}
      <path d="M68 200 L92 200 L88 246 L66 244 Z" />
      <path d="M110 200 L134 200 L136 244 L114 246 Z" />
    </svg>
  );
}

"use client";

import * as React from "react";

/**
 * Membuat kertas muat di layar sempit - dan HANYA di layar.
 *
 * ---------------------------------------------------------------------------
 * Persoalannya
 * ---------------------------------------------------------------------------
 *
 * Halaman cetak merender kertas pada ukuran fisiknya, 210mm untuk A4, yang di
 * layar berarti sekitar 794 piksel. Di ponsel 390 piksel itu hampir dua kali
 * lebar layarnya. Yang terjadi bukan potongan kertas yang dapat digeser,
 * melainkan peramban ponsel melebarkan viewport-nya sendiri lalu mengecilkan
 * seluruh halaman - termasuk bilah alatnya, yang jadi ikut mengecil dan
 * tulisannya pecah dua baris. Dilaporkan begitu: halaman cetak di HP
 * berantakan.
 *
 * ---------------------------------------------------------------------------
 * Mengapa `zoom`, bukan `transform: scale()`
 * ---------------------------------------------------------------------------
 *
 * `transform` hanya menggambar ulang; kotak tata letaknya tetap selebar dan
 * setinggi aslinya. Akibatnya luberan mendatarnya tidak hilang, dan di bawah
 * kertas tersisa ruang kosong setinggi selisih penyusutannya - yang harus
 * ditambal dengan mengukur tinggi elemennya terus-menerus.
 *
 * `zoom` mengubah tata letaknya sendiri, jadi lebar dokumen ikut menyusut dan
 * tidak ada yang perlu ditambal. Ia dulu tidak baku; sekarang ada di standar
 * dan didukung Chrome, Safari, maupun Firefox. Bila suatu saat tidak
 * didukung, nilainya diabaikan dan halamannya kembali seperti sebelum
 * perubahan ini - bukan rusak.
 *
 * ---------------------------------------------------------------------------
 * Yang tidak boleh tersentuh
 * ---------------------------------------------------------------------------
 *
 * Hasil cetaknya. Penyusutan ini dipasang lewat gaya sebaris pada pembungkus,
 * dan dilepas kembali menjadi 1 di dalam `@media print` (lihat `.cetak-muat`
 * di globals.css). Jadi PDF yang keluar tetap 210mm - satu-satunya hal yang
 * benar-benar penting dari halaman ini.
 */
export function PrintPaper({
  /** Lebar kertas dalam milimeter - 210 untuk A4, 216 untuk Letter. */
  lebarMm,
  children,
}: {
  lebarMm: number;
  children: React.ReactNode;
}) {
  const [skala, setSkala] = React.useState(1);

  React.useEffect(() => {
    // 96 piksel CSS per inci adalah tetapan, bukan hasil pengukuran layar.
    const lebarPx = (lebarMm / 25.4) * 96;

    const hitung = () => {
      /*
        Lebarnya diambil dari yang TERKECIL antara jendela dan layar - dan
        `screen.width` di sini bukan hiasan.

        Percobaan pertama memakai `innerWidth` saja, dan hasilnya berputar:
        kertas 794 piksel membuat peramban ponsel melebarkan viewport-nya
        sendiri menjadi 476, `innerWidth` karena itu terbaca 476, penyusutan
        dihitung dari angka yang sudah terlanjur salah, dan kertasnya tetap
        tidak muat. Diukur: skala 0,71 pada layar 390 - masih 560 piksel.

        `screen.width` tidak ikut melar bersama viewport, jadi ia memutus
        putaran itu. Di komputer ia lebih besar daripada jendelanya, dan di
        sanalah `innerWidth` yang menang.
      */
      const lebarLayar = Math.min(
        window.innerWidth,
        window.screen?.width || window.innerWidth,
      );
      // Jarak tepi 16 piksel di tiap sisi supaya kertasnya tidak menempel
      // dinding, dan tidak pernah diperbesar melebihi ukuran sebenarnya:
      // kertas 210mm yang dibesar-besarkan di layar lebar hanya membuat
      // pratinjaunya berbohong tentang hasil cetaknya.
      setSkala(Math.min(1, (lebarLayar - 32) / lebarPx));
    };

    hitung();
    window.addEventListener("resize", hitung);
    return () => window.removeEventListener("resize", hitung);
  }, [lebarMm]);

  return (
    <div className="cetak-muat" style={{ zoom: skala }}>
      {children}
    </div>
  );
}

"use client";

import * as React from "react";
import { ResumeDocument } from "@/components/preview/ResumeDocument";
import type { Locale } from "@/lib/i18n/config";
import { portofolioPreviewResume } from "@/lib/resume/sample";

/**
 * Wujud bagian portofolio di halaman depan.
 *
 * Yang dirender di sini **`ResumeDocument`** - pencetak yang sama persis
 * dengan yang menghasilkan PDF, Word, dan pratinjau di editor. Itu bukan
 * kebetulan melainkan syaratnya: halaman depan menjanjikan portofolio, dan
 * satu-satunya cara menjanjikannya dengan jujur adalah memperlihatkan barang
 * yang memang keluar hari ini - bukan tampilan yang dikarang untuk gambar
 * promosi lalu tidak pernah ada wujudnya.
 *
 * Kalau suatu hari bentuk cetak bagian portofolio berubah, gambar di halaman
 * depan ikut berubah sendiri. Tidak ada yang perlu diingat, dan tidak ada
 * yang bisa basi diam-diam.
 *
 * Komponen klien, dengan alasan yang sama seperti `TemplatePreview`: sebagai
 * komponen server, seluruh pohon elemen dokumennya ikut tertulis dua kali ke
 * dalam halaman - sekali sebagai HTML, sekali lagi sebagai muatan React.
 * Sebagai komponen klien yang ikut hanya `locale`-nya.
 */
export function PortfolioPreview({ locale }: { locale: Locale }) {
  const data = React.useMemo(() => portofolioPreviewResume(locale), [locale]);

  return (
    /*
      Kertasnya dipotong, bukan diperkecil sampai tidak terbaca. Yang ingin
      diperlihatkan bentuk satu entri - baris kepala, ringkasan, poin, dan
      baris "Detail" yang memuat field khas polanya - dan semuanya sudah
      selesai jauh sebelum halaman A4 habis. Sisanya ruang kosong, jadi
      tingginya dibatasi dan luberannya dipotong.
    */
    <div
      className="relative overflow-hidden rounded-xl border border-ink-200 bg-white"
      style={{ maxHeight: 300 }}
      aria-hidden="true"
    >
      <div
        className="mx-auto [--doc-scale:0.44] sm:[--doc-scale:0.56]"
        style={{ width: "calc(210mm * var(--doc-scale))", overflow: "hidden" }}
      >
        <div
          style={{
            width: "210mm",
            transformOrigin: "top left",
            transform: "scale(var(--doc-scale))",
          }}
        >
          <ResumeDocument data={data} printMode />
        </div>
      </div>

      {/* Peredup di kaki, supaya potongannya terbaca sengaja - bukan gagal muat. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white to-transparent" />
    </div>
  );
}

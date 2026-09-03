"use client";

import * as React from "react";
import { ResumeDocument } from "@/components/preview/ResumeDocument";
import type { Locale } from "@/lib/i18n/config";
import { previewResume } from "@/lib/resume/sample";
import { templateStyle } from "@/lib/resume/templates";
import type { TemplateId } from "@/lib/resume/types";

/**
 * Pratinjau satu template di halaman depan.
 *
 * Sengaja komponen klien, dan itu keputusan tentang berat halaman - bukan
 * tentang interaktivitas (komponen ini tidak punya satu pun).
 *
 * Sebagai komponen server, seluruh pohon elemen dokumen CV ikut ditulis dua
 * kali ke dalam halaman: sekali sebagai HTML, dan sekali lagi sebagai muatan
 * React yang dipakai menyambung render di peramban. Untuk sebelas dokumen,
 * salinan kedua itu saja lebih dari 200 KB - dua pertiga isi halaman depan.
 *
 * Sebagai komponen klien, yang ikut ke muatan React hanyalah propertinya:
 * nama template dan bahasa. Dokumennya tetap dirender di server sehingga
 * pengunjung tetap melihatnya seketika tanpa menunggu JavaScript, dan tetap
 * terbaca mesin pencari.
 *
 * Data contohnya dibangun di sini, bukan diterima sebagai properti, justru
 * karena itulah inti penghematannya - properti berupa objek CV utuh akan
 * mengembalikan seluruh byte yang hendak dihindari.
 */
export function TemplatePreview({
  template,
  locale,
}: {
  template: TemplateId;
  locale: Locale;
}) {
  const data = React.useMemo(() => {
    const base = previewResume(locale);
    const style = templateStyle(template);
    return {
      ...base,
      template,
      personalInfo: {
        ...base.personalInfo,
        // Template berfoto perlu memperlihatkan tempat fotonya. Yang dipakai
        // gambar kosong bertanda abu, bukan wajah seseorang - memasang wajah
        // asing di halaman depan tidak pada tempatnya.
        showPhoto: style.photo !== "none",
        photoUrl: style.photo !== "none" ? PHOTO_PLACEHOLDER : "",
      },
    };
  }, [template, locale]);

  return <ResumeDocument data={data} printMode />;
}

const PHOTO_PLACEHOLDER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="120" height="160">' +
      '<rect width="120" height="160" fill="#e6e6e8"/>' +
      '<circle cx="60" cy="60" r="26" fill="#c9c9cd"/>' +
      '<path d="M14 160c0-28 21-46 46-46s46 18 46 46z" fill="#c9c9cd"/>' +
      "</svg>",
  );

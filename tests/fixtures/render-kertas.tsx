import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ResumeDocument } from "../../src/components/preview/ResumeDocument";
import { sampleResume } from "../../src/lib/resume/sample";
import { TEMPLATE_ORDER } from "../../src/lib/resume/templates";
import type { ResumeData } from "../../src/lib/resume/types";

/**
 * Merender dokumen CV persis seperti jalur cetak: `editable` mati.
 *
 * Dipakai berkas uji untuk mengunci keluarannya. Yang dirender bukan satu
 * template melainkan seluruhnya, sebab perbedaan antar-template murni
 * tipografi - dan gaya sebaris itulah yang paling mudah berubah tanpa
 * disadari saat struktur elemennya disentuh.
 */

/**
 * Menomori ulang seluruh id entri secara berurutan.
 *
 * `sampleResume()` membangkitkan id acak, dan id itu ikut tertulis ke atribut
 * `data-field` pada setiap blok. Tanpa penomoran ulang, dua render dari data
 * yang sama akan selalu berbeda dan perbandingan markup menjadi mustahil.
 * Yang diganti hanya nilainya, bukan bentuk datanya - jumlah dan urutan entri
 * tetap apa adanya.
 */
function idBerurutan<T>(nilai: T, penghitung: { n: number }): T {
  if (Array.isArray(nilai)) {
    return nilai.map((item) => idBerurutan(item, penghitung)) as T;
  }
  if (nilai && typeof nilai === "object") {
    const salinan: Record<string, unknown> = {
      ...(nilai as Record<string, unknown>),
    };
    for (const kunci of Object.keys(salinan)) {
      if (kunci === "id" && typeof salinan[kunci] === "string") {
        penghitung.n += 1;
        salinan[kunci] = `e${penghitung.n}`;
        continue;
      }
      salinan[kunci] = idBerurutan(salinan[kunci], penghitung);
    }
    return salinan as T;
  }
  return nilai;
}

export function contohTetap(locale: "id" | "en"): ResumeData {
  const cv = idBerurutan(sampleResume("acuan", locale), { n: 0 });
  return { ...cv, id: "acuan" };
}

/** Markup saat mode ketik menyala - dipakai memeriksa jalur yang ditandai. */
export function renderDapatDiketik(locale: "id" | "en" = "id"): string {
  return renderToStaticMarkup(
    <ResumeDocument data={contohTetap(locale)} editable />,
  );
}

export function renderSemuaTemplate(): string {
  const bagian: string[] = [];

  for (const locale of ["id", "en"] as const) {
    const dasar = contohTetap(locale);
    for (const template of TEMPLATE_ORDER) {
      bagian.push(`<!-- ${locale} ${template} -->`);
      bagian.push(
        renderToStaticMarkup(<ResumeDocument data={{ ...dasar, template }} />),
      );
    }
  }

  return bagian.join("\n");
}

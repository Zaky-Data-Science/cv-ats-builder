import { renderToStaticMarkup } from "react-dom/server";
import * as React from "react";
import { ResumeDocument } from "../src/components/preview/ResumeDocument";
import { analyzeResume } from "../src/lib/ats/engine";
import { PAPER_ORDER, PAPER_SIZES } from "../src/lib/resume/paper";
import { resumeToPlainText } from "../src/lib/resume/plaintext";
import { sampleResume } from "../src/lib/resume/sample";
import {
  TEMPLATE_INFO,
  TEMPLATE_ORDER,
  templateStyle,
} from "../src/lib/resume/templates";
import { check, equal, section } from "./harness";

/**
 * Menguji kesepuluh template.
 *
 * Yang paling penting bukan bahwa masing-masing berhasil dirender, melainkan
 * bahwa **teks yang dihasilkannya identik**. Itulah klaim yang dipegang
 * aplikasi ini: berganti template mengubah rupanya, bukan isinya - sehingga
 * tidak ada template yang lebih berisiko terbaca kacau dibanding yang lain.
 * Bila suatu saat ada template yang menyusun ulang urutan isinya, uji ini
 * yang akan menangkapnya.
 */
export function runTemplateTests(): void {
  section("Template CV");

  const base = sampleResume("uji");
  const baselineText = resumeToPlainText(base);
  const baselineScore = analyzeResume(base, "", 1).score;

  for (const template of TEMPLATE_ORDER) {
    const style = templateStyle(template);
    const withPhoto = style.photo !== "none";
    const data = {
      ...base,
      template,
      personalInfo: {
        ...base.personalInfo,
        showPhoto: withPhoto,
        photoUrl: withPhoto ? "https://example.com/foto.jpg" : "",
      },
    };

    let html = "";
    let error = "";
    try {
      html = renderToStaticMarkup(
        React.createElement(ResumeDocument, { data, printMode: true }),
      );
    } catch (thrown) {
      error = thrown instanceof Error ? thrown.message : String(thrown);
    }

    const name = TEMPLATE_INFO.id[template].name;
    check(`${template} (${name}) berhasil dirender`, error === "", error);
    if (error) continue;

    check(
      `${template} menampilkan nama pelamar`,
      html.includes(base.personalInfo.fullName),
    );
    equal(
      `${template} menampilkan seluruh judul bagian`,
      (html.match(/<h2/g) ?? []).length,
      10,
    );
    check(
      `${template} menampilkan foto sesuai jenisnya`,
      html.includes("<img") === withPhoto,
      withPhoto ? "berfoto" : "tanpa foto",
    );

    // Teks alir tidak boleh berbeda satu karakter pun antar-template.
    equal(
      `${template} menghasilkan teks yang identik`,
      resumeToPlainText({ ...data, template }) === baselineText,
      true,
    );
  }

  // Template berfoto memang memperoleh skor sedikit lebih rendah - foto
  // adalah risiko bagi pengurai, dan mesin penilaian harus mengatakannya.
  const photoScore = analyzeResume(
    {
      ...base,
      template: "PORTRAIT",
      personalInfo: {
        ...base.personalInfo,
        showPhoto: true,
        photoUrl: "https://example.com/foto.jpg",
      },
    },
    "",
    1,
  ).score;
  check(
    "template berfoto memperoleh skor lebih rendah",
    photoScore < baselineScore,
    `${photoScore} vs ${baselineScore}`,
  );

  section("Ukuran kertas");

  for (const size of PAPER_ORDER) {
    const html = renderToStaticMarkup(
      React.createElement(ResumeDocument, {
        data: { ...base, pageSize: size },
        printMode: true,
      }),
    );
    const width = html.match(/--paper-width:\s*([^;"]+)/)?.[1]?.trim();
    equal(
      `${size} memakai lebar kertas yang benar`,
      width,
      `${PAPER_SIZES[size].widthMm}mm`,
    );
  }
}

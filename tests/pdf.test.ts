import { readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { analyzeDocument } from "../src/lib/ats/document";
import {
  detectColumnLayout,
  itemsToText,
  type ExtractedDocument,
  type PdfTextItem,
} from "../src/lib/intake/extract";
import { writeFixtures } from "./fixtures/make-pdf";
import { check, equal, section } from "./harness";

/**
 * Menguji pembacaan PDF.
 *
 * pdf.js di lingkungan Node menuntut build "legacy" dan tidak memakai Web
 * Worker, sehingga pemuatannya di sini berbeda dari yang di peramban. Yang
 * diuji tetap fungsi yang persis sama: penyusunan potongan teks menjadi
 * baris, dan penaksiran jumlah kolom - keduanya fungsi murni, dan keduanya
 * adalah bagian yang paling mungkin salah.
 */

/**
 * Membaca sebuah PDF persis seperti jalur di peramban.
 *
 * Letak celah kolom halaman pertama ikut dikembalikan supaya berkas uji dapat
 * memeriksa bukan hanya "berapa kolomnya" melainkan juga "di mana kolomnya
 * terbelah" - angka itulah yang menentukan benar-tidaknya teks hasil bacaan.
 */
async function readPdf(
  path: string,
): Promise<{ doc: ExtractedDocument; boundaries: number[] }> {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const bytes = new Uint8Array(readFileSync(path));

  const task = pdfjs.getDocument({ data: bytes });
  const document = await task.promise;

  const pages: string[] = [];
  let columns = 1;
  let boundaries: number[] = [];

  for (let index = 1; index <= document.numPages; index++) {
    const page = await document.getPage(index);
    const content = await page.getTextContent();
    const items = content.items as unknown as PdfTextItem[];
    // Urutannya sengaja sama persis dengan jalur di peramban: tata letak
    // dihitung sekali, lalu dipakai untuk membaca teksnya.
    const layout = detectColumnLayout(items);
    pages.push(itemsToText(items, layout.boundaries));
    columns = Math.max(columns, layout.columns);
    if (index === 1) boundaries = layout.boundaries;
  }
  await task.destroy();

  const text = pages.join("\n\n").trim();
  return {
    doc: {
      fileName: path.split(/[\\/]/).pop() ?? path,
      kind: "pdf",
      text,
      pageCount: document.numPages,
      columnHint: columns,
      charsPerPage: text.length / document.numPages,
      size: bytes.length,
    },
    boundaries,
  };
}

export async function runPdfTests(): Promise<void> {
  section("Pembacaan PDF");

  const { oneColumn, twoColumn } = writeFixtures(join(tmpdir(), "atscv-uji"));

  const { doc: single } = await readPdf(oneColumn);
  const { doc: double, boundaries: doubleLayout } = await readPdf(twoColumn);

  equal("PDF satu kolom terbaca satu halaman", single.pageCount, 1);
  equal("PDF satu kolom terdeteksi satu kolom", single.columnHint, 1);
  check(
    "nama pelamar terbaca pada baris pertama",
    single.text.split("\n")[0] === "Budi Santoso",
    single.text.split("\n")[0],
  );
  check(
    "poin pencapaian tetap terpisah per baris",
    single.text.split("\n").filter((line) => line.startsWith("- ")).length === 3,
  );
  check(
    "email terbaca utuh",
    single.text.includes("budi.santoso@email.com"),
  );

  equal("PDF dua kolom terdeteksi dua kolom", double.columnHint, 2);
  equal("letak celah pemisah kolom ikut dikenali", doubleLayout.length, 1);

  const doubleLines = double.text.split("\n");
  check(
    "kolom kiri dan kanan tidak lagi menyatu dalam satu baris",
    // Inilah kerusakan yang dulu terjadi: nama dari kolom kiri menempel pada
    // judul bagian dari kolom kanan, sehingga judulnya tidak lagi berdiri
    // sendiri dan tidak pernah terdeteksi.
    !double.text.includes("Andi Pratama PENGALAMAN KERJA"),
  );
  check(
    "kolom kiri terbaca utuh lebih dulu",
    doubleLines.indexOf("KEAHLIAN") < doubleLines.indexOf("PENGALAMAN KERJA"),
    `KEAHLIAN baris ${doubleLines.indexOf("KEAHLIAN")}, PENGALAMAN KERJA baris ${doubleLines.indexOf("PENGALAMAN KERJA")}`,
  );
  check(
    "judul bagian kini berdiri sendiri sebagai satu baris",
    doubleLines.includes("PENGALAMAN KERJA") && doubleLines.includes("PENDIDIKAN"),
  );

  section("Penilaian berkas PDF");

  const singleScore = analyzeDocument(single, "", "id");
  const doubleScore = analyzeDocument(double, "", "id");

  check(
    "CV satu kolom tetap bernilai lebih tinggi",
    singleScore.score > doubleScore.score,
    `${singleScore.score} vs ${doubleScore.score}`,
  );
  check(
    "CV dua kolom tetap memperoleh peringatan tata letak",
    doubleScore.weaknesses.some((w) => /kolom/i.test(w.message)),
  );
  check(
    "bagian CV dua kolom kini terdeteksi, bukan hilang bersama teks yang rusak",
    doubleScore.stats.headingsFound >= 3,
    `${doubleScore.stats.headingsFound} judul bagian`,
  );
}

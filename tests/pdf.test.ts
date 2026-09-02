import { readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { analyzeDocument } from "../src/lib/ats/document";
import {
  detectColumns,
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

async function readPdf(path: string): Promise<ExtractedDocument> {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const bytes = new Uint8Array(readFileSync(path));

  const task = pdfjs.getDocument({ data: bytes });
  const document = await task.promise;

  const pages: string[] = [];
  let columns = 1;

  for (let index = 1; index <= document.numPages; index++) {
    const page = await document.getPage(index);
    const content = await page.getTextContent();
    const items = content.items as unknown as PdfTextItem[];
    pages.push(itemsToText(items));
    columns = Math.max(columns, detectColumns(items));
  }
  await task.destroy();

  const text = pages.join("\n\n").trim();
  return {
    fileName: path.split(/[\\/]/).pop() ?? path,
    kind: "pdf",
    text,
    pageCount: document.numPages,
    columnHint: columns,
    charsPerPage: text.length / document.numPages,
    size: bytes.length,
  };
}

export async function runPdfTests(): Promise<void> {
  section("Pembacaan PDF");

  const { oneColumn, twoColumn } = writeFixtures(join(tmpdir(), "atscv-uji"));

  const single = await readPdf(oneColumn);
  const double = await readPdf(twoColumn);

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
  check(
    "teks dua kolom memang terbaca berselang-seling",
    // Inilah kerusakan yang hendak diperlihatkan kepada pengguna: nama dari
    // kolom kiri menempel pada judul bagian dari kolom kanan.
    double.text.includes("Andi Pratama PENGALAMAN KERJA"),
  );

  section("Penilaian berkas PDF");

  const singleScore = analyzeDocument(single, "", "id");
  const doubleScore = analyzeDocument(double, "", "id");

  check(
    "CV satu kolom bernilai jauh lebih tinggi",
    singleScore.score > doubleScore.score + 20,
    `${singleScore.score} vs ${doubleScore.score}`,
  );
  check(
    "CV dua kolom memperoleh peringatan tata letak",
    doubleScore.weaknesses.some((w) => /kolom/i.test(w.message)),
  );
}

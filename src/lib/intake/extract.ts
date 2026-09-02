"use client";

import { unzipSync } from "fflate";

/**
 * ============================================================================
 *  PEMBACAAN BERKAS CV
 * ============================================================================
 *
 * Seluruh pembacaan berjalan **di dalam peramban pengguna**. Berkas CV tidak
 * pernah dikirim ke server mana pun, termasuk server aplikasi ini.
 *
 * Keputusan itu diambil karena isi CV adalah data pribadi yang lengkap -
 * nama, alamat, nomor telepon, riwayat pekerjaan - dan fitur pembanding ini
 * justru mengundang orang mengunggah CV yang bukan miliknya sendiri untuk
 * dibandingkan. Menyimpannya di server akan menimbulkan kewajiban perlindungan
 * data yang tidak sepadan dengan manfaatnya, sementara seluruh analisisnya
 * memang dapat dikerjakan peramban tanpa satu pun permintaan jaringan.
 *
 * Tiga format yang didukung mencerminkan apa yang benar-benar dipakai pelamar:
 * PDF (hasil unduhan dari pembuat CV mana pun), DOCX (berkas kerja di Word),
 * dan teks polos.
 */

export type IntakeKind = "pdf" | "docx" | "txt";

export interface ExtractedDocument {
  fileName: string;
  kind: IntakeKind;
  /** Teks lengkap, sudah dirapikan barisnya. */
  text: string;
  /** Jumlah halaman. Hanya PDF yang mengetahuinya secara pasti. */
  pageCount: number | null;
  /**
   * Kolom terdeteksi pada tata letak PDF. Nilai lebih dari 1 berarti ada
   * halaman yang isinya tersusun berdampingan - penyebab paling umum CV
   * terbaca kacau oleh ATS.
   */
  columnHint: number;
  /**
   * Rasio kasar jumlah karakter terhadap jumlah halaman. Nilai sangat rendah
   * pada PDF menandakan dokumennya berupa gambar hasil pindai, bukan teks.
   */
  charsPerPage: number;
  /** Ukuran berkas dalam bita, untuk ditampilkan di antarmuka. */
  size: number;
}

export class IntakeError extends Error {
  constructor(
    readonly code:
      | "unsupported"
      | "too-large"
      | "empty"
      | "encrypted"
      | "broken",
    message: string,
  ) {
    super(message);
    this.name = "IntakeError";
  }
}

/** Batas ukuran berkas. CV yang sehat tidak pernah sebesar ini. */
export const MAX_FILE_BYTES = 8 * 1024 * 1024;

export function detectKind(file: File): IntakeKind | null {
  const name = file.name.toLowerCase();
  if (name.endsWith(".pdf")) return "pdf";
  if (name.endsWith(".docx")) return "docx";
  if (name.endsWith(".txt") || name.endsWith(".md")) return "txt";
  // Sebagian peramban tidak mengisi ekstensi pada berkas hasil bagikan;
  // jenis MIME dipakai sebagai cadangan.
  if (file.type === "application/pdf") return "pdf";
  if (
    file.type ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    return "docx";
  }
  if (file.type.startsWith("text/")) return "txt";
  return null;
}

export async function extractDocument(file: File): Promise<ExtractedDocument> {
  const kind = detectKind(file);
  if (!kind) {
    throw new IntakeError(
      "unsupported",
      `Format berkas "${file.name}" tidak didukung.`,
    );
  }
  if (file.size > MAX_FILE_BYTES) {
    throw new IntakeError("too-large", `Berkas "${file.name}" terlalu besar.`);
  }

  const base = { fileName: file.name, kind, size: file.size };

  if (kind === "txt") {
    const text = normalizeText(await file.text());
    ensureNotEmpty(text, file.name);
    return {
      ...base,
      text,
      pageCount: null,
      columnHint: 1,
      charsPerPage: text.length,
    };
  }

  if (kind === "docx") {
    const text = normalizeText(await extractDocx(await file.arrayBuffer()));
    ensureNotEmpty(text, file.name);
    return {
      ...base,
      text,
      pageCount: null,
      columnHint: 1,
      charsPerPage: text.length,
    };
  }

  return { ...base, ...(await extractPdf(await file.arrayBuffer(), file.name)) };
}

/* -------------------------------------------------------------------------- */
/* DOCX                                                                       */
/* -------------------------------------------------------------------------- */

/**
 * Membaca teks dari berkas .docx.
 *
 * Sebuah .docx sebenarnya adalah arsip zip berisi XML. Yang dibutuhkan di
 * sini hanya teksnya, jadi arsipnya dibuka lalu `word/document.xml` diambil
 * dan penandanya dibuang - tanpa memuat pustaka konversi dokumen yang
 * berukuran ratusan kilobyte demi hasil yang sama.
 *
 * Penanda akhir paragraf dan akhir baris diubah menjadi baris baru lebih dulu,
 * supaya struktur poin-poin CV tidak lumer menjadi satu paragraf panjang -
 * padahal justru struktur itulah yang hendak dinilai.
 */
async function extractDocx(buffer: ArrayBuffer): Promise<string> {
  let files: Record<string, Uint8Array>;
  try {
    files = unzipSync(new Uint8Array(buffer));
  } catch {
    throw new IntakeError(
      "broken",
      "Berkas .docx tidak dapat dibuka. Kemungkinan rusak atau terproteksi.",
    );
  }

  const entry = files["word/document.xml"];
  if (!entry) {
    throw new IntakeError("broken", "Isi berkas .docx tidak ditemukan.");
  }

  const xml = new TextDecoder("utf-8").decode(entry);

  return (
    xml
      // Akhir paragraf dan pemisah baris menjadi baris baru sungguhan.
      .replace(/<\/w:p>/g, "\n")
      .replace(/<w:br\b[^>]*\/?>/g, "\n")
      .replace(/<w:tab\b[^>]*\/?>/g, "\t")
      // Sisa penanda XML dibuang.
      .replace(/<[^>]+>/g, "")
      // Entitas XML yang lazim muncul pada teks.
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'")
      .replace(/&amp;/g, "&")
  );
}

/* -------------------------------------------------------------------------- */
/* PDF                                                                        */
/* -------------------------------------------------------------------------- */

let pdfjsPromise: Promise<typeof import("pdfjs-dist")> | null = null;

/**
 * Memuat pdf.js hanya ketika benar-benar dipakai.
 *
 * Pustakanya berukuran besar. Memuatnya lewat impor dinamis membuat pengunjung
 * yang hanya membaca halaman tidak ikut mengunduhnya - baru saat berkas
 * pertama dijatuhkan, unduhannya dimulai.
 */
async function loadPdfjs() {
  if (!pdfjsPromise) {
    pdfjsPromise = import("pdfjs-dist").then((pdfjs) => {
      pdfjs.GlobalWorkerOptions.workerSrc = "/pdfjs/pdf.worker.min.mjs";
      return pdfjs;
    });
  }
  return pdfjsPromise;
}

export interface PdfTextItem {
  str: string;
  transform: number[];
  width: number;
}

async function extractPdf(
  buffer: ArrayBuffer,
  fileName: string,
): Promise<Omit<ExtractedDocument, "fileName" | "kind" | "size">> {
  const pdfjs = await loadPdfjs();

  // Tugas pemuatan disimpan terpisah dari dokumennya: yang memiliki metode
  // pembebasan worker adalah tugasnya, bukan dokumennya. Tanpa memanggilnya,
  // setiap PDF yang dibuka meninggalkan satu worker yang terus hidup.
  const task = pdfjs.getDocument({ data: new Uint8Array(buffer) });

  let document;
  try {
    document = await task.promise;
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (/password/i.test(message)) {
      throw new IntakeError(
        "encrypted",
        `Berkas "${fileName}" terkunci kata sandi.`,
      );
    }
    throw new IntakeError(
      "broken",
      `Berkas "${fileName}" tidak dapat dibaca sebagai PDF.`,
    );
  }

  const pageCount = document.numPages;
  const pageTexts: string[] = [];
  let maxColumns = 1;

  for (let index = 1; index <= pageCount; index++) {
    const page = await document.getPage(index);
    const content = await page.getTextContent();
    const items = content.items as unknown as PdfTextItem[];

    pageTexts.push(itemsToText(items));
    maxColumns = Math.max(maxColumns, detectColumns(items));

    // Melepas sumber daya halaman satu per satu. Tanpa ini, membandingkan
    // lima CV sekaligus dapat menahan puluhan megabyte di memori peramban.
    page.cleanup();
  }

  await task.destroy();

  const text = normalizeText(pageTexts.join("\n\n"));
  const charsPerPage = pageCount > 0 ? text.length / pageCount : text.length;

  // PDF hasil pindai atau CV yang diekspor sebagai gambar tetap "terbaca"
  // oleh pdf.js, hanya saja isinya nyaris kosong. Itu justru temuan penting
  // bagi penggunanya - jadi tidak dilemparkan sebagai galat, melainkan
  // diteruskan agar penilai dapat menjelaskannya.
  ensureNotEmpty(text, fileName, 20);

  return { text, pageCount, columnHint: maxColumns, charsPerPage };
}

/**
 * Menyusun ulang potongan teks PDF menjadi baris.
 *
 * Diekspor supaya dapat diuji tanpa peramban: pdf.js hanya berjalan dengan
 * build khusus di lingkungan Node, sementara fungsi ini murni dan dapat
 * diberi masukan berupa potongan teks apa pun.
 *
 * pdf.js mengembalikan teks sebagai kepingan-kepingan beserta posisinya, bukan
 * sebagai baris. Kepingan dikelompokkan berdasarkan koordinat vertikalnya
 * (indeks ke-5 pada matriks transform), sehingga poin-poin CV tetap terbaca
 * sebagai baris terpisah - persis seperti yang dilakukan pengurai ATS.
 */
export function itemsToText(items: PdfTextItem[]): string {
  const rows = new Map<number, PdfTextItem[]>();

  for (const item of items) {
    if (!item.str) continue;
    // Dibulatkan ke kelipatan 2 titik: teks pada satu baris kerap berbeda
    // sepersekian titik karena perbedaan tinggi huruf.
    const y = Math.round(item.transform[5] / 2) * 2;
    const row = rows.get(y);
    if (row) row.push(item);
    else rows.set(y, [item]);
  }

  return [...rows.entries()]
    // Koordinat PDF dihitung dari bawah halaman, jadi urutan bacaannya
    // adalah dari y terbesar ke terkecil.
    .sort((a, b) => b[0] - a[0])
    .map(([, row]) =>
      row
        .sort((a, b) => a.transform[4] - b.transform[4])
        .map((item) => item.str)
        .join(" ")
        .replace(/\s+/g, " ")
        .trim(),
    )
    .filter((line) => line.length > 0)
    .join("\n");
}

/**
 * Menaksir jumlah kolom pada sebuah halaman.
 *
 * Caranya: seluruh potongan teks dipetakan ke posisi horizontalnya, lalu
 * dicari apakah ada celah lebar yang membelah halaman - celah yang tidak
 * pernah dilewati satu pun potongan teks. CV satu kolom tidak punya celah
 * seperti itu; CV dua kolom selalu punya.
 *
 * Deteksi ini penting karena tata letak dua kolom adalah penyebab paling
 * sering CV terbaca berselang-seling oleh ATS, dan itu tidak terlihat sama
 * sekali dari teks hasil ekstraksi.
 */
export function detectColumns(items: PdfTextItem[]): number {
  const spans = items
    .filter((item) => item.str.trim().length > 0)
    .map((item) => ({
      left: item.transform[4],
      right: item.transform[4] + (item.width || 0),
    }));

  // Halaman dengan potongan teks terlalu sedikit tidak dinilai: halaman
  // sampul atau halaman berisi satu paragraf tidak punya cukup bahan untuk
  // membedakan "dua kolom" dari "kebetulan ada ruang kosong".
  if (spans.length < 12) return 1;

  const pageLeft = Math.min(...spans.map((s) => s.left));
  const pageRight = Math.max(...spans.map((s) => s.right));
  const width = pageRight - pageLeft;
  if (width <= 0) return 1;

  // Halaman dibagi menjadi 60 pita. Sebuah pita dianggap kosong bila tidak
  // ada satu pun potongan teks yang melintasinya.
  const BANDS = 60;
  const occupied = new Array<boolean>(BANDS).fill(false);
  for (const span of spans) {
    const from = Math.max(
      0,
      Math.floor(((span.left - pageLeft) / width) * BANDS),
    );
    const to = Math.min(
      BANDS - 1,
      Math.floor(((span.right - pageLeft) / width) * BANDS),
    );
    for (let i = from; i <= to; i++) occupied[i] = true;
  }

  // Celah dihitung hanya di bagian tengah halaman (20%-80%), karena margin
  // kiri dan kanan memang selalu kosong dan bukan pemisah kolom.
  let columns = 1;
  let gap = 0;
  for (let i = Math.floor(BANDS * 0.2); i < Math.floor(BANDS * 0.8); i++) {
    if (occupied[i]) {
      // Celah selebar 5 pita (sekitar 8% lebar halaman) sudah terlalu lebar
      // untuk sekadar jarak antar-kata.
      if (gap >= 5) columns += 1;
      gap = 0;
    } else {
      gap += 1;
    }
  }
  if (gap >= 5) columns += 1;

  return Math.min(columns, 3);
}

/* -------------------------------------------------------------------------- */
/* Utilitas                                                                   */
/* -------------------------------------------------------------------------- */

function normalizeText(raw: string): string {
  return raw
    .replace(/\r\n?/g, "\n")
    // Karakter kendali yang kerap terbawa dari PDF.
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "")
    .split("\n")
    .map((line) => line.replace(/[ \t ]+/g, " ").trim())
    .join("\n")
    // Lebih dari dua baris kosong berturut-turut tidak menambah makna.
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function ensureNotEmpty(text: string, fileName: string, minimum = 1): void {
  if (text.length < minimum) {
    throw new IntakeError(
      "empty",
      `Tidak ada teks yang dapat dibaca dari "${fileName}".`,
    );
  }
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

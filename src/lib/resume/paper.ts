import type { Locale } from "@/lib/i18n/config";

/**
 * Ukuran kertas CV.
 *
 * Angka milimeternya ditulis apa adanya sesuai standar, bukan dibulatkan,
 * karena nilai yang sama dipakai dua kali: untuk menggambar pratinjau di
 * layar dan untuk aturan @page saat mencetak. Perbedaan sepersekian
 * milimeter di antara keduanya akan membuat pratinjau berbohong tentang
 * berapa halaman hasil cetaknya.
 */

export type PaperSize = "A4" | "LETTER" | "LEGAL" | "F4";

export interface PaperSpec {
  id: PaperSize;
  /** Nama yang ditampilkan di pemilih. */
  label: string;
  widthMm: number;
  heightMm: number;
  /** Nilai untuk aturan CSS @page. */
  cssSize: string;
}

export const PAPER_SIZES: Record<PaperSize, PaperSpec> = {
  A4: { id: "A4", label: "A4", widthMm: 210, heightMm: 297, cssSize: "A4" },
  LETTER: {
    id: "LETTER",
    label: "Letter",
    // 8,5 x 11 inci. Ditulis dalam milimeter agar satu satuan saja yang
    // dipakai di seluruh berkas ini.
    widthMm: 215.9,
    heightMm: 279.4,
    cssSize: "letter",
  },
  LEGAL: {
    id: "LEGAL",
    label: "Legal",
    widthMm: 215.9,
    heightMm: 355.6,
    cssSize: "legal",
  },
  F4: {
    id: "F4",
    label: "F4 (Folio)",
    widthMm: 210,
    heightMm: 330,
    // F4 bukan ukuran baku CSS, jadi dimensinya ditulis eksplisit.
    cssSize: "210mm 330mm",
  },
};

export const PAPER_ORDER: PaperSize[] = ["A4", "LETTER", "LEGAL", "F4"];

/** Ukuran bawaan sekaligus yang disarankan aplikasi. */
export const RECOMMENDED_PAPER: PaperSize = "A4";

/**
 * Keterangan singkat untuk tiap ukuran, dipakai di pemilih ukuran kertas.
 * Isinya menjawab satu pertanyaan pengguna: "saya harus pilih yang mana".
 */
export const PAPER_NOTE: Record<Locale, Record<PaperSize, string>> = {
  id: {
    A4: "Pilih ini kalau ragu. Ukuran standar di Indonesia dan hampir seluruh dunia.",
    LETTER: "Pakai hanya kalau melamar ke perusahaan di Amerika Serikat atau Kanada.",
    LEGAL: "Lebih panjang dari A4. Pakai hanya kalau instansinya memang meminta.",
    F4: "Ukuran folio, masih dipakai sebagian kantor di Indonesia.",
  },
  en: {
    A4: "Pick this if unsure. The standard almost everywhere outside North America.",
    LETTER: "Only when applying to companies in the US or Canada.",
    LEGAL: "Longer than A4. Only when an institution specifically asks for it.",
    F4: "Folio size, still used by some Indonesian offices.",
  },
};

const MM_PER_INCH = 25.4;
/** Piksel CSS per inci - tetap 96 menurut spesifikasi CSS. */
const CSS_DPI = 96;

export function mmToPx(mm: number): number {
  return (mm * CSS_DPI) / MM_PER_INCH;
}

export function paperSpec(size: PaperSize | undefined): PaperSpec {
  return PAPER_SIZES[size ?? RECOMMENDED_PAPER] ?? PAPER_SIZES.A4;
}

/** Ukuran satu halaman dalam piksel CSS, untuk pratinjau di layar. */
export function paperPx(size: PaperSize | undefined): {
  width: number;
  height: number;
} {
  const spec = paperSpec(size);
  return { width: mmToPx(spec.widthMm), height: mmToPx(spec.heightMm) };
}

export function isPaperSize(value: unknown): value is PaperSize {
  return (
    typeof value === "string" && Object.prototype.hasOwnProperty.call(PAPER_SIZES, value)
  );
}

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Menggabungkan class Tailwind dengan aman (kelas belakangan menang). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** ID unik sisi klien, dipakai sebagai primary key item CV. */
export function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `id_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

const BULAN_ID = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nov",
  "Des",
];

const BULAN_EN = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/**
 * Mengubah "2023-07" menjadi "Jul 2023".
 * Format tanggal yang konsisten adalah salah satu syarat CV terbaca ATS,
 * karena itu formatting dipusatkan di sini dan dipakai oleh preview,
 * generator DOCX, maupun mesin penilaian ATS.
 */
export function formatMonth(value: string, lang: "ID" | "EN" = "ID"): string {
  if (!value) return "";
  const match = /^(\d{4})-(\d{2})$/.exec(value.trim());
  if (!match) return value;
  const year = match[1];
  const monthIndex = Number(match[2]) - 1;
  if (monthIndex < 0 || monthIndex > 11) return value;
  const names = lang === "EN" ? BULAN_EN : BULAN_ID;
  return `${names[monthIndex]} ${year}`;
}

/** Rentang tanggal siap tampil, mis. "Jul 2023 - Sekarang". */
export function formatDateRange(
  start: string,
  end: string,
  isCurrent: boolean,
  lang: "ID" | "EN" = "ID",
): string {
  const from = formatMonth(start, lang);
  const to = isCurrent
    ? lang === "EN"
      ? "Present"
      : "Sekarang"
    : formatMonth(end, lang);
  if (!from && !to) return "";
  if (!from) return to;
  if (!to) return from;
  return `${from} - ${to}`;
}

/** Menggabungkan potongan teks yang mungkin kosong, mis. kota dan negara. */
export function joinNonEmpty(parts: (string | undefined)[], sep = ", "): string {
  return parts.filter((p) => p && p.trim().length > 0).join(sep);
}

/** Membuang skema dan trailing slash agar URL enak dibaca di CV cetak. */
export function prettyUrl(url: string): string {
  if (!url) return "";
  return url
    .trim()
    .replace(/^https?:\/\//i, "")
    .replace(/^www\./i, "")
    .replace(/\/+$/, "");
}

/** Memastikan URL punya skema sebelum dijadikan href. */
export function ensureHttp(url: string): string {
  if (!url) return "";
  const trimmed = url.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

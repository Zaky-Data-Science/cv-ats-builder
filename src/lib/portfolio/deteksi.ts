import { containsKeyword } from "@/lib/ats/keywords";
import { KAMUS_BIDANG } from "./kamus-bidang";
import { polaSchema } from "./pola-schemas";
import type { EntriKamus, PolaSlug } from "./types";

/**
 * ============================================================================
 *  MENEBAK BENTUK PORTOFOLIO DARI TEKS CV
 * ============================================================================
 *
 * Dipakai pada CV yang diunggah orang - berkas PDF atau Word yang tidak punya
 * satu pun field terstruktur, sehingga satu-satunya yang dapat dibaca adalah
 * kata-katanya sendiri.
 *
 * Hasilnya **tawaran, bukan keputusan.** Tebakan yang dipaksakan pada CV orang
 * lain lebih buruk daripada tidak menebak sama sekali: seorang arsitek yang
 * CV-nya kebetulan menyebut banyak standar teknis akan tiba-tiba dinilai
 * dengan bentuk yang bukan miliknya, tanpa tahu mengapa. Karena itu ambangnya
 * dibuat tinggi dan tebakan yang seri dikembalikan sebagai "tidak tahu".
 */

export interface TebakanPola {
  entri: EntriKamus;
  pola: PolaSlug;
  /** Berapa kata kunci khas bidang itu yang benar-benar ditemukan. */
  cocok: string[];
  skor: number;
}

/**
 * Jumlah kata kunci minimum sebelum sebuah tebakan layak ditawarkan.
 *
 * Angka ini pilihan, bukan temuan - sumber fitur ini tidak menyebutnya. Tiga
 * dipilih karena satu atau dua istilah teknis mudah muncul di CV bidang mana
 * pun ("analisis", "laporan"), sementara tiga istilah khas sekaligus jarang
 * kebetulan.
 */
const AMBANG_COCOK = 3;

/**
 * Menebak bidang - dan lewat bidangnya, bentuk portofolio - dari teks CV.
 *
 * Mengembalikan null bila tidak ada yang cukup meyakinkan, atau bila dua
 * bidang teratas sama kuatnya. Yang kedua penting: "seri" berarti tebakannya
 * ditentukan urutan entri di kamus, dan urutan itu tidak berarti apa-apa.
 */
export function deteksiPola(teks: string): TebakanPola | null {
  if (!teks.trim()) return null;

  const hasil: TebakanPola[] = [];
  for (const entri of KAMUS_BIDANG) {
    if (entri.slug === "umum" || entri.kataKunciATS.length === 0) continue;
    const cocok = entri.kataKunciATS.filter((kata) =>
      containsKeyword(teks, kata),
    );
    if (cocok.length === 0) continue;
    hasil.push({
      entri,
      pola: entri.polaDisarankan,
      cocok,
      skor: cocok.length,
    });
  }

  hasil.sort((a, b) => b.skor - a.skor);
  const teratas = hasil[0];
  if (!teratas || teratas.skor < AMBANG_COCOK) return null;
  if (hasil[1] && hasil[1].skor === teratas.skor) return null;
  return teratas;
}

/** Kalimat tawaran, bukan pernyataan. */
export function kalimatTawaran(tebakan: TebakanPola, locale: "id" | "en"): string {
  const nama = polaSchema(tebakan.pola).nama;
  return locale === "en"
    ? `This CV looks like it follows the "${nama}" shape. Use that shape for scoring?`
    : `Sepertinya CV ini berbentuk ${nama}. Pakai penilaian bentuk ini?`;
}

/* -------------------------------------------------------------------------- */
/* Bahasa                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Kata fungsi yang paling sering muncul di kedua bahasa.
 *
 * Sengaja kata fungsi, bukan istilah teknis: nama perkakas, framework, dan
 * sertifikasi selalu ditulis dalam bahasa Inggris di CV berbahasa apa pun,
 * sehingga menghitungnya hanya akan membuat setiap CV terbaca berbahasa
 * Inggris.
 */
const KATA_ID = [
  "yang",
  "dan",
  "untuk",
  "dengan",
  "dari",
  "pada",
  "atau",
  "akan",
  "dalam",
  "tidak",
  "sebagai",
  "adalah",
  "serta",
  "dapat",
  "kami",
  "pengalaman",
  "pekerjaan",
  "perusahaan",
  "tanggung",
  "kemampuan",
];

const KATA_EN = [
  "the",
  "and",
  "for",
  "with",
  "from",
  "this",
  "will",
  "are",
  "you",
  "our",
  "have",
  "experience",
  "requirements",
  "responsibilities",
  "ability",
  "team",
  "role",
  "skills",
];

function hitungKata(teks: string, daftar: string[]): number {
  const token = teks.toLowerCase().split(/[^a-z]+/);
  const set = new Set(daftar);
  return token.filter((t) => set.has(t)).length;
}

/**
 * Menebak bahasa sebuah teks: "ID", "EN", atau null bila terlalu sedikit
 * penanda untuk memutuskan.
 *
 * Ambang selisihnya sengaja tidak ketat. Iklan lowongan Indonesia lazim
 * menyelipkan kalimat Inggris, dan sebaliknya - yang dicari di sini bukan
 * kemurnian bahasanya melainkan bahasa mana yang dipakai menulis kalimatnya.
 */
export function tebakBahasa(teks: string): "ID" | "EN" | null {
  const id = hitungKata(teks, KATA_ID);
  const en = hitungKata(teks, KATA_EN);
  if (id + en < 5) return null;
  if (id === en) return null;
  return id > en ? "ID" : "EN";
}

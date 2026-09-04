import type { SectionKey } from "@/lib/resume/types";
import type { KeywordAnalysis } from "./keywords";

/**
 * Bentuk hasil penilaian ATS.
 *
 * Dipisahkan dari engine.ts supaya berkas teks (messages.ts) dapat mengacu
 * ke tipe yang sama tanpa membentuk impor melingkar - engine memerlukan
 * teksnya, dan teksnya memerlukan bentuk tipenya.
 */

export type DimensionKey =
  | "completeness"
  | "parseability"
  | "contentQuality"
  | "keywordMatch"
  | "structure"
  /** Kekuatan bukti karya. Bobotnya 0 selama bagian portofolio belum menyala. */
  | "buktiKarya";

export type Severity = "error" | "warning" | "info";

export interface AtsFinding {
  dimension: DimensionKey;
  severity: Severity;
  /** Masalah yang ditemukan. */
  message: string;
  /** Langkah konkret untuk memperbaikinya. */
  fix: string;
  /** Section tujuan saat saran diklik di antarmuka. */
  section?: SectionKey | "personal";
}

export interface DimensionResult {
  key: DimensionKey;
  label: string;
  /** Nilai akhir dimensi ini pada skala bobotnya. */
  score: number;
  weight: number;
  /** Persentase pencapaian dimensi (0-100). */
  percent: number;
  applicable: boolean;
  findings: AtsFinding[];
}

export interface AtsStats {
  wordCount: number;
  bulletCount: number;
  estimatedPages: number;
  actionVerbRatio: number;
  quantifiedRatio: number;
  skillCount: number;
  experienceCount: number;
}

/**
 * Hasil penilaian: dua angka, bukan satu.
 *
 * Tidak ada "skor ATS" universal yang bisa direplikasi - filter penyaringan
 * dikonfigurasi tiap pemberi kerja, dan hanya sebagian sistem yang memberi
 * peringkat otomatis sama sekali. Yang dapat dipertanggungjawabkan hanya dua
 * hal, dan keduanya dipisah supaya masing-masing dapat dibaca apa adanya:
 *
 *  - `match`    Kecocokan Lowongan - berapa persen kata penting iklan lowongan
 *               yang ada di CV. Persis yang dilakukan pencarian kata kunci.
 *               null selama iklan lowongannya belum ditempel.
 *  - `strength` Kekuatan & Keterbacaan - kelengkapan struktur, keterbacaan
 *               mesin, mutu isi, dan kekuatan bukti karya. Bisa diuji langsung,
 *               tanpa mengklaim memprediksi keputusan sistem mana pun.
 */
export interface AtsResult {
  /**
   * Sama dengan `strength`.
   *
   * Dipertahankan karena riwayat penilaian yang sudah tersimpan di basis data
   * memakai nama kolom ini, dan angka lama harus tetap sebanding dengan angka
   * baru agar grafik kemajuan pengguna tidak patah di tengah.
   */
  score: number;
  strength: number;
  match: number | null;
  /**
   * Kekuatan & Keterbacaan seandainya bagian portofolio belum dinyalakan.
   *
   * null selama memang belum dinyalakan. Ada gunanya justru pada saat
   * pengguna baru saja menyalakannya: bobot penilaian berubah saat itu juga,
   * dan angka yang bergeser tanpa penjelasan terbaca sebagai kesalahan
   * aplikasi - bukan sebagai akibat pilihan yang baru saja ia buat.
   */
  strengthTanpaPortofolio: number | null;
  grade: "A" | "B" | "C" | "D";
  verdict: string;
  dimensions: DimensionResult[];
  suggestions: AtsFinding[];
  keywords: KeywordAnalysis | null;
  stats: AtsStats;
  /** Rincian P × Q × R per item, untuk ditelusuri pengguna. */
  buktiKarya: BuktiKaryaRingkas | null;
}

/** Ringkasan penilaian kekuatan bukti, sudah dalam bentuk siap tampil. */
export interface BuktiKaryaRingkas {
  skor: number;
  p: number;
  n: number;
  rentang: [number, number | null];
  item: {
    id: string;
    judul: string;
    q: number;
    r: number;
    skor: number;
  }[];
}

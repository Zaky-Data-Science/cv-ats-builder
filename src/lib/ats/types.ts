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
  | "structure";

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

export interface AtsResult {
  score: number;
  grade: "A" | "B" | "C" | "D";
  verdict: string;
  dimensions: DimensionResult[];
  suggestions: AtsFinding[];
  keywords: KeywordAnalysis | null;
  stats: AtsStats;
}

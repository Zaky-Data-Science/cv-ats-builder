import type { Locale } from "@/lib/i18n/config";
import type { ExtractedDocument } from "@/lib/intake/extract";
import { analyzeKeywords, tokenize, type KeywordAnalysis } from "./keywords";
import { docMessages } from "./document-messages";
import { atsMessages } from "./messages";
import type { DimensionKey, Severity } from "./types";
import { ACTION_VERBS, CLICHE_PHRASES } from "./vocabulary";

/**
 * ============================================================================
 *  PENILAI BERKAS CV YANG DIUNGGAH
 * ============================================================================
 *
 * Berbeda dari mesin di engine.ts, yang menilai CV **terstruktur** hasil
 * susunan pengguna di aplikasi ini, modul ini menilai CV **apa adanya** dari
 * berkas PDF atau Word - tanpa mengetahui mana bagian pengalaman dan mana
 * bagian pendidikan. Semua harus ditebak dari teksnya.
 *
 * Karena itu keduanya tidak digabung. Menyatukannya akan memaksa salah satu
 * berpura-pura: entah penilai berkas berpura-pura punya data terstruktur,
 * atau penilai CV sendiri kehilangan ketelitiannya. Yang dibagi bersama
 * hanyalah yang memang sama - bobot kelima dimensi, daftar kata kerja aksi,
 * daftar frasa klise, dan mesin pencocokan kata kunci - sehingga skor dari
 * kedua jalur tetap dapat dibandingkan satu sama lain.
 *
 * Seluruh penilaian berjalan di peramban, deterministik, dan tanpa model
 * bahasa: masukan yang sama selalu menghasilkan angka dan saran yang sama.
 */

export const DOC_WEIGHTS: Record<DimensionKey, number> = {
  completeness: 25,
  parseability: 25,
  contentQuality: 20,
  keywordMatch: 20,
  structure: 10,
};

export interface DocFinding {
  dimension: DimensionKey;
  severity: Severity;
  message: string;
  fix: string;
}

export interface DocDimension {
  key: DimensionKey;
  label: string;
  percent: number;
  weight: number;
  applicable: boolean;
}

export interface DocumentAnalysis {
  fileName: string;
  score: number;
  grade: "A" | "B" | "C" | "D";
  dimensions: DocDimension[];
  /** Hal yang sudah benar - jangan diubah. */
  strengths: string[];
  /** Hal yang perlu diperbaiki, sudah terurut dari yang paling mendesak. */
  weaknesses: DocFinding[];
  keywords: KeywordAnalysis | null;
  stats: {
    pageCount: number;
    wordCount: number;
    bulletCount: number;
    actionVerbRatio: number;
    quantifiedRatio: number;
    columns: number;
    headingsFound: number;
  };
}

/* -------------------------------------------------------------------------- */
/* Alat bantu                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Pencatat nilai satu dimensi.
 *
 * Setiap aturan menyerahkan dua kalimat sekaligus - satu untuk keadaan
 * terpenuhi, satu untuk keadaan tidak. Dengan begitu daftar kelebihan dan
 * daftar kekurangan tumbuh dari sumber yang sama dan tidak mungkin
 * bertentangan satu sama lain.
 */
class DocScorer {
  private earned = 0;
  private max = 0;
  readonly findings: DocFinding[] = [];
  readonly strengths: string[] = [];

  constructor(
    private readonly key: DimensionKey,
    private readonly label: string,
  ) {}

  rule(
    points: number,
    ok: boolean,
    options: {
      severity: Severity;
      ok: string;
      bad: string;
      fix: string;
      /** Kelebihan yang terlalu remeh untuk disebut tidak perlu ditampilkan. */
      notable?: boolean;
    },
  ): void {
    this.max += points;
    if (ok) {
      this.earned += points;
      if (options.notable !== false) this.strengths.push(options.ok);
    } else {
      this.findings.push({
        dimension: this.key,
        severity: options.severity,
        message: options.bad,
        fix: options.fix,
      });
    }
  }

  /** Aturan berbobot proporsi, untuk hal yang berlaku atas banyak baris. */
  ratioRule(
    points: number,
    ratio: number,
    threshold: number,
    options: {
      severity: Severity;
      ok: string;
      bad: string;
      fix: string;
      notable?: boolean;
    },
  ): void {
    const safe = Number.isFinite(ratio) ? Math.min(Math.max(ratio, 0), 1) : 0;
    this.max += points;
    this.earned += points * safe;
    if (safe < threshold) {
      this.findings.push({
        dimension: this.key,
        severity: options.severity,
        message: options.bad,
        fix: options.fix,
      });
    } else if (options.notable !== false) {
      this.strengths.push(options.ok);
    }
  }

  result(applicable = true): DocDimension {
    return {
      key: this.key,
      label: this.label,
      weight: DOC_WEIGHTS[this.key],
      percent: this.max === 0 ? 0 : Math.round((this.earned / this.max) * 100),
      applicable,
    };
  }
}

/* -------------------------------------------------------------------------- */
/* Pengenal bagian dan pola                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Kata kunci judul bagian, dua bahasa sekaligus.
 *
 * Dipakai untuk menebak struktur CV dari teks polos. Daftar ini sengaja
 * memuat variasi yang benar-benar dipakai orang Indonesia ("Riwayat
 * Pekerjaan", "Data Diri"), bukan hanya istilah bakunya - sebab CV yang
 * dinilai di sini datang dari mana saja, bukan dari aplikasi ini.
 */
const SECTION_PATTERNS: Record<string, RegExp> = {
  summary:
    /^\s*(ringkasan(\s+profil)?|profil(\s+singkat)?|tentang\s+saya|deskripsi\s+diri|professional\s+summary|summary|profile|about\s+me|career\s+objective|objective)\s*:?\s*$/i,
  experience:
    /^\s*(pengalaman(\s+(kerja|profesional|magang))?|riwayat\s+pekerjaan|riwayat\s+kerja|work\s+experience|professional\s+experience|employment(\s+history)?|experience)\s*:?\s*$/i,
  education:
    /^\s*(pendidikan(\s+(terakhir|formal))?|riwayat\s+pendidikan|latar\s+belakang\s+pendidikan|education(al\s+background)?|academic\s+background)\s*:?\s*$/i,
  skill:
    /^\s*(keahlian|kemampuan|keterampilan|kompetensi|skills?|technical\s+skills|core\s+competenc(y|ies)|expertise)\s*:?\s*$/i,
  project: /^\s*(proyek|portofolio|projects?|portfolio)\s*:?\s*$/i,
  certification:
    /^\s*(sertifikasi|sertifikat|pelatihan|certifications?|licenses?|training)\s*:?\s*$/i,
  organization:
    /^\s*(organisasi|pengalaman\s+organisasi|kegiatan|organizations?|activities|volunteering)\s*:?\s*$/i,
  award: /^\s*(penghargaan|prestasi|awards?|achievements?|honors?)\s*:?\s*$/i,
  language: /^\s*(bahasa|kemampuan\s+bahasa|languages?)\s*:?\s*$/i,
};

const EMAIL_RE = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/;
const PHONE_RE = /(?:\+?\d[\d\s().-]{7,}\d)/;
const PROFILE_RE =
  /(linkedin\.com|github\.com|behance\.net|dribbble\.com|gitlab\.com|medium\.com|notion\.site|\b[a-z0-9-]+\.(dev|me|io|design|site|my\.id)\b)/i;
const EMOJI_RE = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/u;
const TABLE_CHAR_RE = /[\t│┃|]/;

/**
 * Nama tempat yang lazim muncul sebagai domisili pada CV Indonesia.
 *
 * Daftarnya sengaja pendek dan hanya memuat yang paling sering dipakai,
 * ditambah beberapa penanda generik. Tujuannya bukan mengenali seluruh kota
 * di Indonesia - itu mustahil dan tidak perlu - melainkan cukup untuk
 * menjawab satu pertanyaan: apakah pelamar mencantumkan domisilinya sama
 * sekali.
 */
const PLACE_HINTS = [
  "indonesia", "jakarta", "bandung", "surabaya", "medan", "semarang",
  "yogyakarta", "jogja", "makassar", "palembang", "denpasar", "bali",
  "balikpapan", "samarinda", "bontang", "pontianak", "banjarmasin",
  "pekanbaru", "batam", "malang", "solo", "bogor", "depok", "tangerang",
  "bekasi", "cirebon", "manado", "padang", "jayapura", "kupang", "ambon",
  "mataram", "kendari", "palu", "jambi", "lampung", "aceh", "kalimantan",
  "sulawesi", "sumatera", "sumatra", "papua", "jawa", "domisili",
  "singapore", "kuala lumpur", "remote",
];

const MONTH_NAME =
  "jan|feb|mar|apr|mei|may|jun|jul|agu|aug|sep|okt|oct|nov|des|dec";
const DATE_PATTERNS = [
  new RegExp(`\\b(${MONTH_NAME})[a-z]*\\.?\\s*\\d{4}\\b`, "i"),
  /\b\d{4}\s*[-–—]\s*(\d{4}|sekarang|saat ini|present|now|current)\b/i,
  /\b(0?[1-9]|1[0-2])[/-]\d{4}\b/,
];

const BULLET_PREFIX_RE = /^[•·‣▪◦▸►\-–—*]\s+/;

/* -------------------------------------------------------------------------- */
/* Penilaian satu dokumen                                                     */
/* -------------------------------------------------------------------------- */

export function analyzeDocument(
  doc: ExtractedDocument,
  jobDescription: string,
  locale: Locale = "id",
): DocumentAnalysis {
  const m = docMessages(locale);
  const labels = atsMessages(locale).dimensionLabel;

  const lines = doc.text.split("\n").map((l) => l.trim()).filter(Boolean);
  const lower = doc.text.toLowerCase();
  const words = doc.text.trim() ? doc.text.trim().split(/\s+/).length : 0;

  const sections = detectSections(lines);
  const bullets = detectBullets(lines);

  const withVerb = bullets.filter(startsWithActionVerb).length;
  const quantified = bullets.filter((b) => /\d/.test(b)).length;
  const verbRatio = bullets.length ? withVerb / bullets.length : 0;
  const numberRatio = bullets.length ? quantified / bullets.length : 0;

  // Jumlah halaman: PDF tahu persis, format lain diperkirakan dari jumlah
  // kata. 450 kata per halaman adalah angka yang mendekati CV padat berukuran
  // 10-11pt, dan itulah bentuk yang dituju aplikasi ini.
  const pageCount = doc.pageCount ?? Math.max(1, Math.ceil(words / 450));

  const keywords = jobDescription.trim()
    ? analyzeKeywords(doc.text, jobDescription)
    : null;

  const dimensions: DocDimension[] = [];
  const findings: DocFinding[] = [];
  const strengths: string[] = [];

  const collect = (scorer: DocScorer, dimension: DocDimension) => {
    dimensions.push(dimension);
    findings.push(...scorer.findings);
    strengths.push(...scorer.strengths);
  };

  /* ------------------------------------------------------- kelengkapan -- */
  {
    const s = new DocScorer("completeness", labels.completeness);

    s.rule(4, looksLikeName(lines), {
      severity: "error",
      ok: m.nameOk,
      bad: m.nameBad,
      fix: m.nameFix,
    });
    s.rule(4, EMAIL_RE.test(doc.text), {
      severity: "error",
      ok: m.emailOk,
      bad: m.emailBad,
      fix: m.emailFix,
    });
    s.rule(3, PHONE_RE.test(doc.text), {
      severity: "error",
      ok: m.phoneOk,
      bad: m.phoneBad,
      fix: m.phoneFix,
    });
    s.rule(2, PLACE_HINTS.some((place) => lower.includes(place)), {
      severity: "warning",
      ok: m.locationOk,
      bad: m.locationBad,
      fix: m.locationFix,
      notable: false,
    });
    s.rule(4, sections.has("summary"), {
      severity: "warning",
      ok: m.summaryOk,
      bad: m.summaryBad,
      fix: m.summaryFix,
    });
    s.rule(4, sections.has("experience"), {
      severity: "error",
      ok: m.experienceOk,
      bad: m.experienceBad,
      fix: m.experienceFix,
      notable: false,
    });
    s.rule(2, sections.has("education"), {
      severity: "warning",
      ok: m.educationOk,
      bad: m.educationBad,
      fix: m.educationFix,
      notable: false,
    });
    s.rule(3, sections.has("skill"), {
      severity: "warning",
      ok: m.skillsOk,
      bad: m.skillsBad,
      fix: m.skillsFix,
    });
    s.rule(2, PROFILE_RE.test(doc.text), {
      severity: "info",
      ok: m.linkOk,
      bad: m.linkBad,
      fix: m.linkFix,
      notable: false,
    });

    collect(s, s.result());
  }

  /* ---------------------------------------------------- keterbacaan ----- */
  {
    const s = new DocScorer("parseability", labels.parseability);

    // Ambang 250 karakter per halaman: satu halaman CV berisi teks selalu
    // jauh melewatinya, sedangkan halaman berupa gambar hasil pindai hanya
    // menyisakan beberapa karakter metadata.
    s.rule(6, doc.charsPerPage >= 250, {
      severity: "error",
      ok: m.textLayerOk,
      bad: m.textLayerBad,
      fix: m.textLayerFix,
    });
    s.rule(6, doc.columnHint <= 1, {
      severity: "error",
      ok: m.singleColumnOk,
      bad: m.singleColumnBad(doc.columnHint),
      fix: m.singleColumnFix,
    });
    s.rule(3, !TABLE_CHAR_RE.test(doc.text), {
      severity: "warning",
      ok: m.noTableCharsOk,
      bad: m.noTableCharsBad,
      fix: m.noTableCharsFix,
      notable: false,
    });
    s.rule(2, !EMOJI_RE.test(doc.text), {
      severity: "warning",
      ok: m.noEmojiOk,
      bad: m.noEmojiBad,
      fix: m.noEmojiFix,
      notable: false,
    });
    s.rule(4, sections.size >= 3, {
      severity: "warning",
      ok: m.headingsOk(sections.size),
      bad: m.headingsBad(sections.size),
      fix: m.headingsFix,
    });

    const datedLines = lines.filter((line) =>
      DATE_PATTERNS.some((pattern) => pattern.test(line)),
    ).length;
    s.rule(4, datedLines >= 2, {
      severity: "warning",
      ok: m.datesOk,
      bad: m.datesBad,
      fix: m.datesFix,
      notable: false,
    });

    const longLines = lines.filter((line) => line.length > 400).length;
    s.rule(2, longLines === 0, {
      severity: "info",
      ok: m.paragraphsOk,
      bad: m.paragraphsBad,
      fix: m.paragraphsFix,
      notable: false,
    });

    collect(s, s.result());
  }

  /* ------------------------------------------------- kualitas konten ---- */
  {
    const s = new DocScorer("contentQuality", labels.contentQuality);

    s.rule(5, bullets.length >= 3, {
      severity: "error",
      ok: m.bulletsOk(bullets.length),
      bad: m.bulletsBad(bullets.length),
      fix: m.bulletsFix,
    });

    if (bullets.length > 0) {
      s.ratioRule(6, verbRatio, 0.7, {
        severity: "warning",
        ok: m.actionVerbOk(Math.round(verbRatio * 100)),
        bad: m.actionVerbBad(Math.round(verbRatio * 100)),
        fix: m.actionVerbFix,
      });
      s.ratioRule(5, numberRatio, 0.5, {
        severity: "warning",
        ok: m.quantifiedOk(Math.round(numberRatio * 100)),
        bad: m.quantifiedBad(Math.round(numberRatio * 100)),
        fix: m.quantifiedFix,
      });
    }

    const cliches = CLICHE_PHRASES.filter((phrase) => lower.includes(phrase));
    s.rule(2, cliches.length === 0, {
      severity: "info",
      ok: m.clicheOk,
      bad: m.clicheBad(cliches.slice(0, 3).map((c) => `"${c}"`).join(", ")),
      fix: m.clicheFix,
      notable: false,
    });

    // Kata ganti orang pertama hanya diperiksa pada bagian pembuka. Di bagian
    // lain, kata "saya" bisa saja bagian dari kutipan atau nama, dan
    // menghukumnya akan menghasilkan temuan palsu.
    const opening = doc.text.slice(0, 700).toLowerCase();
    const firstPerson = /\b(saya|aku)\b/.test(opening) || /\bi\s+(am|have|was)\b/.test(opening);
    s.rule(2, !firstPerson, {
      severity: "info",
      ok: m.firstPersonOk,
      bad: m.firstPersonBad,
      fix: m.firstPersonFix,
      notable: false,
    });

    collect(s, s.result());
  }

  /* ---------------------------------------------------- kata kunci ------ */
  {
    const s = new DocScorer("keywordMatch", labels.keywordMatch);

    if (!keywords || keywords.keywords.length === 0) {
      const dimension = s.result(false);
      collect(s, dimension);
    } else {
      const percent = Math.round(keywords.coverage * 100);
      const missing = keywords.missing
        .slice(0, 5)
        .map((k) => `"${k.keyword}"`)
        .join(", ");
      s.ratioRule(20, keywords.coverage, 0.6, {
        severity: keywords.coverage < 0.35 ? "error" : "warning",
        ok: m.keywordOk(percent),
        bad: m.keywordBad(percent, missing),
        fix: m.keywordFix,
      });
      collect(s, s.result());
    }
  }

  /* ------------------------------------------------ panjang & struktur -- */
  {
    const s = new DocScorer("structure", labels.structure);

    const lengthRatio = pageCount === 1 ? 1 : pageCount === 2 ? 0.75 : 0.25;
    s.ratioRule(5, lengthRatio, 1, {
      severity: pageCount > 2 ? "warning" : "info",
      ok: m.lengthOk,
      bad: pageCount === 2 ? m.lengthTwo : m.lengthBad(pageCount),
      fix: pageCount === 2 ? m.lengthFixTwo : m.lengthFixLong,
    });

    const summaryAt = sections.get("summary");
    const experienceAt = sections.get("experience");
    const orderOk =
      summaryAt === undefined ||
      experienceAt === undefined ||
      summaryAt < experienceAt;
    s.rule(3, orderOk, {
      severity: "info",
      ok: m.orderOk,
      bad: m.orderBad,
      fix: m.orderFix,
      notable: false,
    });

    const sizeOk = words >= 250 && words <= 800;
    s.rule(2, sizeOk, {
      severity: "info",
      ok: m.wordCountOk(words),
      bad: words < 250 ? m.wordCountThin(words) : m.wordCountFat(words),
      fix: m.wordCountFix,
      notable: false,
    });

    collect(s, s.result());
  }

  /* ----------------------------------------------------------- skor ---- */
  const applicable = dimensions.filter((d) => d.applicable);
  const totalWeight = applicable.reduce((sum, d) => sum + d.weight, 0);
  const earned = applicable.reduce(
    (sum, d) => sum + (d.percent / 100) * d.weight,
    0,
  );
  const score = totalWeight === 0 ? 0 : Math.round((earned / totalWeight) * 100);

  const rank: Record<Severity, number> = { error: 0, warning: 1, info: 2 };
  findings.sort((a, b) => rank[a.severity] - rank[b.severity]);

  return {
    fileName: doc.fileName,
    score,
    grade: score >= 85 ? "A" : score >= 70 ? "B" : score >= 55 ? "C" : "D",
    dimensions,
    strengths,
    weaknesses: findings,
    keywords,
    stats: {
      pageCount,
      wordCount: words,
      bulletCount: bullets.length,
      actionVerbRatio: verbRatio,
      quantifiedRatio: numberRatio,
      columns: doc.columnHint,
      headingsFound: sections.size,
    },
  };
}

/* -------------------------------------------------------------------------- */
/* Perbandingan antar-dokumen                                                 */
/* -------------------------------------------------------------------------- */

export interface DimensionComparison {
  key: DimensionKey;
  label: string;
  best: string;
  bestPercent: number;
  worst: string;
  worstPercent: number;
  spread: number;
}

export interface ComparisonResult {
  ranked: DocumentAnalysis[];
  winner: DocumentAnalysis;
  verdict: string;
  reasons: string[];
  perDimension: DimensionComparison[];
  advice: string;
}

/**
 * Membandingkan beberapa CV.
 *
 * Yang dikembalikan bukan sekadar peringkat. Selisih tiap dimensi ikut
 * dihitung supaya alasan kemenangannya dapat disebutkan - "unggul karena
 * keterbacaan mesinnya 30 poin lebih tinggi" jauh lebih berguna daripada
 * "skornya 82 berbanding 74".
 *
 * Selisih di bawah 5 poin sengaja disebut sebagai seri. Mesin penilaian ini
 * berbasis kaidah, dan selisih sekecil itu bisa berasal dari satu aturan
 * kecil saja - menyatakannya sebagai kemenangan akan memberi kesan ketelitian
 * yang tidak dimiliki mesinnya.
 */
export function compareDocuments(
  analyses: DocumentAnalysis[],
  locale: Locale = "id",
): ComparisonResult | null {
  if (analyses.length < 2) return null;

  const m = docMessages(locale);
  const ranked = [...analyses].sort((a, b) => b.score - a.score);
  const winner = ranked[0];
  const runnerUp = ranked[1];
  const margin = winner.score - runnerUp.score;

  const perDimension: DimensionComparison[] = [];
  for (const dimension of winner.dimensions) {
    const entries = analyses
      .map((analysis) => ({
        name: analysis.fileName,
        dimension: analysis.dimensions.find((d) => d.key === dimension.key),
      }))
      .filter(
        (entry): entry is { name: string; dimension: DocDimension } =>
          entry.dimension !== undefined && entry.dimension.applicable,
      );

    if (entries.length < 2) continue;

    const sorted = [...entries].sort(
      (a, b) => b.dimension.percent - a.dimension.percent,
    );
    const top = sorted[0];
    const bottom = sorted[sorted.length - 1];

    perDimension.push({
      key: dimension.key,
      label: dimension.label,
      best: top.name,
      bestPercent: top.dimension.percent,
      worst: bottom.name,
      worstPercent: bottom.dimension.percent,
      spread: top.dimension.percent - bottom.dimension.percent,
    });
  }

  const reasons: string[] = [];
  for (const comparison of [...perDimension].sort(
    (a, b) => b.spread - a.spread,
  )) {
    // Selisih di bawah 10 poin pada satu dimensi tidak cukup berarti untuk
    // disebut sebagai alasan kemenangan.
    if (comparison.spread < 10) continue;
    if (reasons.length >= 3) break;
    reasons.push(
      m.reasonDimension(comparison.label, comparison.best, comparison.spread),
    );
  }

  const shortest = [...analyses].sort(
    (a, b) => a.stats.pageCount - b.stats.pageCount,
  )[0];
  const longest = [...analyses].sort(
    (a, b) => b.stats.pageCount - a.stats.pageCount,
  )[0];
  if (shortest.stats.pageCount < longest.stats.pageCount) {
    reasons.push(m.reasonPages(shortest.fileName, shortest.stats.pageCount));
  }

  if (winner.keywords) {
    reasons.push(
      m.reasonKeyword(
        winner.fileName,
        Math.round(winner.keywords.coverage * 100),
      ),
    );
  }

  const verdict =
    margin === 0
      ? m.verdictTie
      : margin < 5
        ? m.verdictNarrow(winner.fileName, margin)
        : m.verdictClear(winner.fileName, margin);

  return {
    ranked,
    winner,
    verdict,
    reasons,
    perDimension,
    advice: m.adviceMerge,
  };
}

export function singleAdvice(locale: Locale = "id"): string {
  return docMessages(locale).adviceSingle;
}

export function keywordSkippedNote(locale: Locale = "id"): string {
  return docMessages(locale).keywordSkipped;
}

/* -------------------------------------------------------------------------- */
/* Pengenal isi                                                               */
/* -------------------------------------------------------------------------- */

/**
 * Mencari judul bagian beserta urutan kemunculannya.
 *
 * Nilai yang disimpan adalah nomor barisnya, bukan sekadar "ada" - urutan itu
 * dipakai untuk memeriksa apakah ringkasan profil benar-benar berada sebelum
 * pengalaman kerja.
 */
function detectSections(lines: string[]): Map<string, number> {
  const found = new Map<string, number>();

  lines.forEach((line, index) => {
    // Judul bagian selalu pendek. Batas ini menahan kalimat panjang yang
    // kebetulan memuat kata "pengalaman" agar tidak disangka judul bagian.
    if (line.length > 45) return;
    for (const [key, pattern] of Object.entries(SECTION_PATTERNS)) {
      if (!found.has(key) && pattern.test(line)) found.set(key, index);
    }
  });

  return found;
}

/**
 * Mengumpulkan poin pencapaian.
 *
 * Poin dikenali dari penanda di awal baris. Bila CV sama sekali tidak memakai
 * penanda - beberapa memang menulisnya sebagai baris biasa - baris berukuran
 * kalimat penuh dipakai sebagai penggantinya, supaya CV semacam itu tetap
 * dinilai isinya dan tidak langsung dianggap kosong.
 */
function detectBullets(lines: string[]): string[] {
  const marked = lines
    .filter((line) => BULLET_PREFIX_RE.test(line))
    .map((line) => line.replace(BULLET_PREFIX_RE, "").trim())
    .filter((line) => line.length >= 20);

  if (marked.length >= 3) return marked;

  return lines.filter(
    (line) =>
      line.length >= 60 &&
      line.length <= 400 &&
      // Baris yang isinya seluruhnya huruf kapital hampir pasti judul bagian.
      line !== line.toUpperCase(),
  );
}

function startsWithActionVerb(bullet: string): boolean {
  const first = tokenize(bullet)[0];
  return first ? ACTION_VERBS.has(first) : false;
}

/**
 * Menebak apakah nama pelamar tercantum di bagian atas.
 *
 * Yang diperiksa adalah lima baris pertama: sebuah nama berupa 2-5 kata,
 * tanpa angka, tanpa tanda @, dan tidak terlalu panjang. Heuristik ini tidak
 * sempurna, tetapi kesalahannya berpihak ke sisi yang aman - CV yang namanya
 * ditulis dengan cara tidak lazim akan memperoleh saran untuk menegaskannya,
 * dan saran itu memang benar.
 */
function looksLikeName(lines: string[]): boolean {
  return lines.slice(0, 5).some((line) => {
    if (line.length < 4 || line.length > 60) return false;
    if (/[@\d]/.test(line)) return false;
    if (/^(curriculum\s+vitae|cv|resume|daftar\s+riwayat\s+hidup)$/i.test(line))
      return false;
    const parts = line.split(/\s+/);
    return parts.length >= 2 && parts.length <= 5;
  });
}

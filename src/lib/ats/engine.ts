/*
  ============================================================================
   MESIN PENILAIAN ATS - INTI KEBARUAN PROJECT INI
  ============================================================================

  Menghasilkan satu skor 0-100 dari lima dimensi berbobot, beserta daftar saran
  perbaikan yang dapat langsung ditindaklanjuti.

  Seluruh aturannya DETERMINISTIK dan berbasis kaidah, bukan model bahasa.
  Tiga akibat yang ketiganya disengaja:

    - hasilnya dapat direproduksi dan dibandingkan antar-percobaan,
    - setiap angka dapat ditelusuri ke aturan yang jelas, dan
    - penilaian berjalan tanpa biaya maupun koneksi ke layanan pihak ketiga.

  Skornya TIDAK bergantung bahasa: masukan yang sama selalu menghasilkan angka
  yang sama. Kalimat sarannya tinggal di `messages.ts`, sehingga berkas ini
  murni berisi angka dan syarat - dan bahasa antarmuka dapat berganti tanpa
  satu pun aturan penilaian ikut tersentuh.

  ----------------------------------------------------------------------------
   PETA SETELAN
  ----------------------------------------------------------------------------

  | Yang ingin diubah          | Ubah di mana                    | Nilai sekarang       |
  |----------------------------|---------------------------------|----------------------|
  | Bobot tiap dimensi         | `DIMENSION_WEIGHTS` di bawah    | 25/25/20/20/10       |
  | Batas nilai huruf A-D      | `gradeOf()` di berkas ini       | 85 / 70 / 55         |
  | Kalimat vonis A-D          | `verdictOf()` + `messages.ts`   | ambang yang sama     |
  | Panjang ringkasan ideal    | dimensi `completeness`          | 30-120 kata          |
  | Ukuran huruf yang dianggap aman | dimensi `parseability`     | 9-12 pt              |
  | Panjang poin ideal         | dimensi `contentQuality`        | 40-220 karakter      |
  | Kata kerja aksi dan klise  | `vocabulary.ts`                 | murni data           |
  | Padanan singkatan          | `aliases.ts`                    | murni data           |

  ----------------------------------------------------------------------------
   YANG WAJIB DIKETAHUI SEBELUM MENGUBAH BOBOT
  ----------------------------------------------------------------------------

  1. **Jumlahnya harus 100.** Tidak ada yang menormalkannya - kalau totalnya
     90, skor tertinggi yang mungkin diperoleh siapa pun ikut menjadi 90.

  2. **`keywordMatch` sering tidak berlaku.** Tanpa deskripsi lowongan, dimensi
     itu tidak dinilai dan bobotnya DIALIHKAN ke dimensi lain. Jadi bobot yang
     tertulis di sini adalah bobot saat lowongan diisi; tanpa lowongan,
     perbandingan keempat dimensi sisanya yang menentukan.

  3. **Mengubah bobot mengubah skor SELURUH CV yang sudah ada**, termasuk yang
     tersimpan di dasbor pengguna. Skor lama tidak dihitung ulang, sehingga
     angka lama dan baru akan berdampingan tanpa keterangan apa pun.

  4. `tests/ats-engine.test.ts` mengunci sebagian angkanya. Kalau uji itu gagal
     sesudah perubahan yang memang disengaja, perbarui angkanya di sana -
     jangan melonggarkan ujinya.
*/

import type { Locale } from "@/lib/i18n/config";
import { allBullets, groupSkills, resumeToPlainText } from "@/lib/resume/plaintext";
import { paperSpec } from "@/lib/resume/paper";
import { isSectionVisible } from "@/lib/resume/sections";
import { resumeMargins } from "@/lib/resume/templates";
import type { ResumeData } from "@/lib/resume/types";
import { analyzeKeywords, type KeywordAnalysis, tokenize } from "./keywords";
import { atsMessages, type AtsMessages } from "./messages";
import type {
  AtsFinding,
  AtsResult,
  AtsStats,
  DimensionKey,
  DimensionResult,
  Severity,
} from "./types";
import {
  ACTION_VERBS,
  ATS_SAFE_FONTS,
  CLICHE_PHRASES,
  SKILL_LEVEL_NOISE,
} from "./vocabulary";


export type {
  AtsFinding,
  AtsResult,
  AtsStats,
  DimensionKey,
  DimensionResult,
  Severity,
};

/*
  SETELAN bobot tiap dimensi. WAJIB berjumlah 100.

  | Dimensi          | Bobot | Menilai apa                                    |
  |------------------|------:|------------------------------------------------|
  | `completeness`   |    25 | Kelengkapan isi - bagian yang wajib ada terisi  |
  | `parseability`   |    25 | Kemudahan dibaca mesin - huruf, margin, struktur|
  | `contentQuality` |    20 | Mutu tulisan - kata kerja aksi, angka, panjang  |
  | `keywordMatch`   |    20 | Kecocokan dengan iklan lowongan                 |
  | `structure`      |    10 | Urutan dan penamaan bagian                      |

  Dua yang teratas sengaja sama besar: CV yang lengkap tetapi tidak terbaca
  mesin sama tidak bergunanya dengan CV yang terbaca sempurna tetapi kosong.

  `keywordMatch` bernilai 0 bobot efektif bila pengguna tidak menempelkan iklan
  lowongan - bobotnya dialihkan ke dimensi lain. Lihat catatan lengkapnya di
  kepala berkas sebelum mengubah angka mana pun di sini.
*/
export const DIMENSION_WEIGHTS: Record<DimensionKey, number> = {
  completeness: 25,
  parseability: 25,
  contentQuality: 20,
  keywordMatch: 20,
  structure: 10,
};

/** Label dimensi mengikuti bahasa antarmuka. */
export function dimensionLabels(locale: Locale): Record<DimensionKey, string> {
  return atsMessages(locale).dimensionLabel;
}

/** Penjelasan singkat tiap dimensi, untuk panel penilaian. */
export function dimensionDescriptions(
  locale: Locale,
): Record<DimensionKey, string> {
  return atsMessages(locale).dimensionDescription;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
const MONTH_PATTERN = /^\d{4}-\d{2}$/;

// ---------------------------------------------------------------------------
// Alat bantu penilaian
// ---------------------------------------------------------------------------

class DimensionScorer {
  private earned = 0;
  private max = 0;
  readonly findings: AtsFinding[] = [];

  constructor(
    private readonly key: DimensionKey,
    private readonly label: string,
  ) {}

  /** Aturan lolos/gagal. */
  rule(
    points: number,
    ok: boolean,
    finding: Omit<AtsFinding, "dimension">,
  ): void {
    this.max += points;
    if (ok) {
      this.earned += points;
    } else {
      this.findings.push({ ...finding, dimension: this.key });
    }
  }

  /**
   * Aturan berbobot proporsi: nilai diberikan sebanding dengan rasio bagian
   * yang sudah benar. Dipakai untuk aturan yang berlaku atas banyak entri,
   * mis. "berapa persen poin diawali kata kerja aksi".
   */
  ratioRule(
    points: number,
    ratio: number,
    threshold: number,
    finding: Omit<AtsFinding, "dimension">,
  ): void {
    const safe = Number.isFinite(ratio) ? Math.min(Math.max(ratio, 0), 1) : 1;
    this.max += points;
    this.earned += points * safe;
    if (safe < threshold) {
      this.findings.push({ ...finding, dimension: this.key });
    }
  }

  /** Aturan yang tidak berlaku (mis. tak ada entri untuk diperiksa) diabaikan. */
  skip(): void {}

  result(applicable = true): DimensionResult {
    const weight = DIMENSION_WEIGHTS[this.key];
    const percent = this.max === 0 ? 100 : (this.earned / this.max) * 100;
    return {
      key: this.key,
      label: this.label,
      weight,
      score: Math.round(((percent / 100) * weight + Number.EPSILON) * 10) / 10,
      percent: Math.round(percent),
      applicable,
      findings: this.findings,
    };
  }
}

// ---------------------------------------------------------------------------
// Perkiraan jumlah halaman
// ---------------------------------------------------------------------------

/**
 * Memperkirakan jumlah halaman tanpa perlu me-render dokumen.
 *
 * Perhitungan memakai geometri kertas yang sama dengan template cetak:
 * tinggi kertas yang dipilih dikurangi margin atas-bawah, dibagi tinggi baris
 * (ukuran huruf dalam pt dikali line-height, dikonversi ke mm).
 * Nilai ini adalah perkiraan; antarmuka editor menampilkan jumlah halaman
 * sebenarnya dari hasil pengukuran DOM.
 */
export function estimatePages(data: ResumeData): number {
  const paper = paperSpec(data.pageSize);
  const margins = resumeMargins(data);
  const PAGE_HEIGHT_MM = paper.heightMm;
  const MARGIN_MM = margins.y * 2;
  const PT_TO_MM = 0.3528;
  const lineHeightMm = data.fontSize * data.lineHeight * PT_TO_MM;
  const linesPerPage = Math.max(
    20,
    Math.floor((PAGE_HEIGHT_MM - MARGIN_MM) / lineHeightMm),
  );

  // Perkiraan lebar teks: 180 mm area cetak dibagi lebar rata-rata karakter.
  const printWidthMm = paper.widthMm - margins.x * 2;
  const charsPerLine = Math.max(
    40,
    Math.floor(printWidthMm / (data.fontSize * PT_TO_MM * 0.5)),
  );
  const wrap = (text: string) =>
    Math.max(1, Math.ceil(text.length / charsPerLine));

  let lines = 5; // blok nama, jabatan, kontak, tautan

  for (const key of data.sectionOrder) {
    if (!isSectionVisible(data, key)) continue;
    lines += 2; // judul section beserta jarak

    switch (key) {
      case "summary":
        lines += wrap(data.personalInfo.summary);
        break;
      case "experience":
        for (const e of data.experiences) {
          lines += 2;
          e.bullets.filter(Boolean).forEach((b) => (lines += wrap(b)));
        }
        break;
      case "education":
        for (const e of data.educations) {
          lines += e.gpa ? 3 : 2;
          e.bullets.filter(Boolean).forEach((b) => (lines += wrap(b)));
        }
        break;
      case "skill":
        for (const [, names] of groupSkills(data)) {
          lines += wrap(names.join(", "));
        }
        break;
      case "project":
        for (const p of data.projects) {
          lines += 2;
          p.bullets.filter(Boolean).forEach((b) => (lines += wrap(b)));
        }
        break;
      case "organization":
        for (const o of data.organizations) {
          lines += 2;
          o.bullets.filter(Boolean).forEach((b) => (lines += wrap(b)));
        }
        break;
      case "certification":
        lines += data.certifications.length * 2;
        break;
      case "award":
        for (const a of data.awards) lines += a.description ? 2 : 1;
        break;
      case "language":
        lines += Math.ceil(data.languages.length / 3);
        break;
      case "publication":
        for (const p of data.publications) {
          lines += wrap(`${p.title} ${p.publisher}`) + 1;
        }
        break;
      case "custom":
        for (const s of data.customSections) {
          lines += 2;
          for (const item of s.items) {
            lines += 2;
            item.bullets.filter(Boolean).forEach((b) => (lines += wrap(b)));
          }
        }
        break;
    }
  }

  return Math.max(1, Math.ceil(lines / linesPerPage));
}

// ---------------------------------------------------------------------------
// Dimensi 1: kelengkapan data
// ---------------------------------------------------------------------------

function scoreCompleteness(data: ResumeData, m: AtsMessages): DimensionResult {
  const s = new DimensionScorer("completeness", m.dimensionLabel.completeness);
  const info = data.personalInfo;

  s.rule(4, info.fullName.trim().length > 0, {
    severity: "error",
    message: m.nameMissing,
    fix: m.nameMissingFix,
    section: "personal",
  });

  s.rule(4, EMAIL_PATTERN.test(info.email.trim()), {
    severity: "error",
    message: info.email.trim() ? m.emailInvalid : m.emailMissing,
    fix: m.emailFix,
    section: "personal",
  });

  s.rule(3, info.phone.replace(/\D/g, "").length >= 8, {
    severity: "error",
    message: m.phoneMissing,
    fix: m.phoneFix,
    section: "personal",
  });

  s.rule(2, info.headline.trim().length > 0, {
    severity: "warning",
    message: m.headlineMissing,
    fix: m.headlineFix,
    section: "personal",
  });

  s.rule(
    2,
    [info.city, info.province, info.country].some((v) => v.trim().length > 0),
    {
      severity: "warning",
      message: m.locationMissing,
      fix: m.locationFix,
      section: "personal",
    },
  );

  const summaryWords = countWords(info.summary);
  s.rule(4, summaryWords >= 30 && summaryWords <= 120, {
    severity: summaryWords === 0 ? "error" : "warning",
    message:
      summaryWords === 0
        ? m.summaryMissing
        : summaryWords < 30
          ? m.summaryTooShort(summaryWords)
          : m.summaryTooLong(summaryWords),
    fix: m.summaryFix,
    section: "summary",
  });

  s.rule(4, data.experiences.length >= 1 || data.projects.length >= 2, {
    severity: "error",
    message: m.experienceMissing,
    fix: m.experienceMissingFix,
    section: "experience",
  });

  s.rule(2, data.educations.length >= 1, {
    severity: "warning",
    message: m.educationMissing,
    fix: m.educationMissingFix,
    section: "education",
  });

  const skillCount = data.skills.filter((sk) => sk.name.trim()).length;
  s.ratioRule(3, Math.min(skillCount / 5, 1), 1, {
    severity: "warning",
    message: m.skillsFew(skillCount),
    fix: m.skillsFewFix,
    section: "skill",
  });

  s.rule(
    2,
    [info.linkedinUrl, info.portfolioUrl, info.githubUrl].some(
      (v) => v.trim().length > 0,
    ),
    {
      severity: "info",
      message: m.linksMissing,
      fix: m.linksMissingFix,
      section: "personal",
    },
  );

  return s.result();
}

// ---------------------------------------------------------------------------
// Dimensi 2: keterbacaan mesin
// ---------------------------------------------------------------------------

function scoreParseability(data: ResumeData, m: AtsMessages): DimensionResult {
  const s = new DimensionScorer("parseability", m.dimensionLabel.parseability);

  s.rule(3, !data.personalInfo.showPhoto, {
    severity: "warning",
    message: m.photoUsed,
    fix: m.photoUsedFix,
    section: "personal",
  });

  s.rule(3, ATS_SAFE_FONTS.includes(data.fontFamily), {
    severity: "warning",
    message: m.fontUnsafe(data.fontFamily),
    fix: m.fontUnsafeFix(ATS_SAFE_FONTS.slice(0, 4).join(", ")),
  });

  s.rule(2, data.fontSize >= 9 && data.fontSize <= 12, {
    severity: "warning",
    message: m.fontSizeOutOfRange(data.fontSize),
    fix: m.fontSizeFix,
  });

  // Konsistensi format tanggal
  const dates: string[] = [];
  data.experiences.forEach((e) => dates.push(e.startDate, e.endDate));
  data.educations.forEach((e) => dates.push(e.startDate, e.endDate));
  data.projects.forEach((p) => dates.push(p.startDate, p.endDate));
  data.certifications.forEach((c) => dates.push(c.issueDate));
  const filledDates = dates.filter((d) => d.trim().length > 0);
  const validDates = filledDates.filter((d) => MONTH_PATTERN.test(d));
  s.ratioRule(
    5,
    filledDates.length ? validDates.length / filledDates.length : 1,
    1,
    {
      severity: "error",
      message: m.dateFormatMixed,
      fix: m.dateFormatFix,
      section: "experience",
    },
  );

  // Pasangan jabatan-perusahaan
  if (data.experiences.length > 0) {
    const complete = data.experiences.filter(
      (e) => e.jobTitle.trim() && e.company.trim(),
    ).length;
    s.ratioRule(5, complete / data.experiences.length, 1, {
      severity: "error",
      message: m.experienceIncomplete,
      fix: m.experienceIncompleteFix,
      section: "experience",
    });

    const dated = data.experiences.filter((e) => e.startDate.trim()).length;
    s.ratioRule(4, dated / data.experiences.length, 1, {
      severity: "error",
      message: m.experienceNoStart,
      fix: m.experienceNoStartFix,
      section: "experience",
    });
  } else {
    s.skip();
  }

  if (data.educations.length > 0) {
    const complete = data.educations.filter(
      (e) => e.institution.trim() && e.degree.trim(),
    ).length;
    s.ratioRule(3, complete / data.educations.length, 1, {
      severity: "warning",
      message: m.educationIncomplete,
      fix: m.educationIncompleteFix,
      section: "education",
    });
  }

  // Nama keahlian harus bersih dari embel-embel tingkat penguasaan
  const skills = data.skills.filter((sk) => sk.name.trim());
  if (skills.length > 0) {
    const clean = skills.filter((sk) => {
      const lower = sk.name.toLowerCase();
      if (/[()[\]]/.test(sk.name)) return false;
      return !SKILL_LEVEL_NOISE.some((n) => lower.includes(n));
    }).length;
    s.ratioRule(3, clean / skills.length, 1, {
      severity: "warning",
      message: m.skillNoisy,
      fix: m.skillNoisyFix,
      section: "skill",
    });
  }

  // Karakter yang mengindikasikan tabel atau tata letak berkolom
  const bullets = allBullets(data);
  const risky = bullets.filter((b) => /[\t│┃|]{1}/.test(b)).length;
  s.rule(2, risky === 0, {
    severity: "warning",
    message: m.tableChars,
    fix: m.tableCharsFix,
  });

  const badTitles = data.customSections.filter((c) =>
    /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(c.title),
  ).length;
  s.rule(2, badTitles === 0, {
    severity: "warning",
    message: m.emojiHeading,
    fix: m.emojiHeadingFix,
    section: "custom",
  });

  return s.result();
}

// ---------------------------------------------------------------------------
// Dimensi 3: kualitas konten
// ---------------------------------------------------------------------------

function scoreContentQuality(data: ResumeData, m: AtsMessages): DimensionResult {
  const s = new DimensionScorer("contentQuality", m.dimensionLabel.contentQuality);
  const bullets = allBullets(data);

  if (bullets.length === 0) {
    s.rule(6, false, {
      severity: "error",
      message: m.noBullets,
      fix: m.noBulletsFix,
      section: "experience",
    });
    return s.result();
  }

  const withVerb = bullets.filter((b) => startsWithActionVerb(b)).length;
  s.ratioRule(6, withVerb / bullets.length, 0.7, {
    severity: "warning",
    message: m.actionVerbLow(Math.round((withVerb / bullets.length) * 100)),
    fix: m.actionVerbFix,
    section: "experience",
  });

  const quantified = bullets.filter((b) => hasMetric(b)).length;
  s.ratioRule(5, quantified / bullets.length, 0.5, {
    severity: "warning",
    message: m.quantifiedLow(Math.round((quantified / bullets.length) * 100)),
    fix: m.quantifiedFix,
    section: "experience",
  });

  const notTooLong = bullets.filter((b) => b.length <= 220).length;
  s.ratioRule(3, notTooLong / bullets.length, 0.9, {
    severity: "info",
    message: m.bulletTooLong,
    fix: m.bulletTooLongFix,
    section: "experience",
  });

  const notTooShort = bullets.filter((b) => b.length >= 40).length;
  s.ratioRule(2, notTooShort / bullets.length, 0.8, {
    severity: "info",
    message: m.bulletTooShort,
    fix: m.bulletTooShortFix,
    section: "experience",
  });

  const haystack = `${data.personalInfo.summary} ${bullets.join(" ")}`.toLowerCase();
  const found = CLICHE_PHRASES.filter((p) => haystack.includes(p));
  s.rule(3, found.length === 0, {
    severity: "info",
    message: m.clichesFound(
      found
        .slice(0, 3)
        .map((f) => `"${f}"`)
        .join(", "),
    ),
    fix: m.clichesFix,
    section: "summary",
  });

  const summaryLower = ` ${data.personalInfo.summary.toLowerCase()} `;
  const usesFirstPerson = /\b(saya|aku)\b/.test(summaryLower);
  s.rule(2, !usesFirstPerson, {
    severity: "info",
    message: m.firstPerson,
    fix: m.firstPersonFix,
    section: "summary",
  });

  if (data.experiences.length > 0) {
    const enough = data.experiences.filter(
      (e) => e.bullets.filter(Boolean).length >= 2,
    ).length;
    s.ratioRule(3, enough / data.experiences.length, 1, {
      severity: "warning",
      message: m.tooFewBullets,
      fix: m.tooFewBulletsFix,
      section: "experience",
    });
  }

  return s.result();
}

// ---------------------------------------------------------------------------
// Dimensi 4: kecocokan kata kunci
// ---------------------------------------------------------------------------

function scoreKeywordMatch(
  analysis: KeywordAnalysis | null,
  m: AtsMessages,
): DimensionResult {
  const s = new DimensionScorer("keywordMatch", m.dimensionLabel.keywordMatch);

  if (!analysis || analysis.keywords.length === 0) {
    // Tanpa deskripsi lowongan, dimensi ini tidak dinilai dan bobotnya
    // dialihkan ke dimensi lain saat penghitungan skor akhir.
    const result = s.result(false);
    result.findings.push({
      dimension: "keywordMatch",
      severity: "info",
      message: m.noJobDescription,
      fix: m.noJobDescriptionFix,
    });
    return result;
  }

  const missingTop = analysis.missing
    .slice(0, 5)
    .map((k) => `"${k.keyword}"`)
    .join(", ");

  s.ratioRule(20, analysis.coverage, 0.6, {
    severity: analysis.coverage < 0.35 ? "error" : "warning",
    message: m.keywordCoverage(
      Math.round(analysis.coverage * 100),
      missingTop,
    ),
    fix: m.keywordCoverageFix,
    section: "skill",
  });

  return s.result(true);
}

// ---------------------------------------------------------------------------
// Dimensi 5: panjang dan struktur
// ---------------------------------------------------------------------------

function scoreStructure(
  data: ResumeData,
  pages: number,
  m: AtsMessages,
): DimensionResult {
  const s = new DimensionScorer("structure", m.dimensionLabel.structure);

  /*
    Panjang CV dinilai bertingkat, bukan lolos-atau-gagal.

    Satu halaman memperoleh nilai penuh karena itulah panjang yang benar
    untuk hampir semua pelamar: perekrut memindai CV dalam hitungan detik,
    dan apa pun yang jatuh ke halaman kedua besar kemungkinan tidak pernah
    dibaca. Dua halaman tetap memperoleh sebagian besar nilainya - bagi
    pelamar dengan pengalaman panjang yang seluruhnya relevan, memaksakan
    satu halaman justru membuang bukti. Yang benar-benar dihukum adalah
    tiga halaman ke atas.

    Meski nilainya bertingkat, sarannya tetap muncul pada CV dua halaman:
    pengguna berhak tahu bahwa satu halaman lebih baik, lalu memutuskan
    sendiri.
  */
  const lengthRatio = pages === 1 ? 1 : pages === 2 ? 0.75 : 0.25;
  s.ratioRule(4, lengthRatio, 1, {
    severity: pages > 2 ? "warning" : "info",
    message:
      pages === 1
        ? m.lengthOnePage
        : pages === 2
          ? m.lengthTwoPages
          : m.lengthTooLong(pages),
    fix:
      pages === 1
        ? m.lengthOnePageFix
        : pages === 2
          ? m.lengthTwoPagesFix
          : m.lengthTooLongFix,
  });

  const order = data.sectionOrder;
  const summaryIndex = order.indexOf("summary");
  const experienceIndex = order.indexOf("experience");
  s.rule(
    2,
    summaryIndex === -1 || experienceIndex === -1 || summaryIndex < experienceIndex,
    {
      severity: "info",
      message: m.summaryAfterExperience,
      fix: m.summaryAfterExperienceFix,
    },
  );

  const dated = data.experiences.filter((e) => MONTH_PATTERN.test(e.startDate));
  let sorted = true;
  for (let i = 1; i < dated.length; i++) {
    if (dated[i - 1].startDate < dated[i].startDate) {
      sorted = false;
      break;
    }
  }
  s.rule(2, sorted, {
    severity: "warning",
    message: m.experienceUnsorted,
    fix: m.experienceUnsortedFix,
    section: "experience",
  });

  const gap = findEmploymentGap(data);
  s.rule(2, gap === null, {
    severity: "info",
    message: gap ? m.employmentGap(gap) : m.employmentGapUnknown,
    fix: m.employmentGapFix,
    section: "experience",
  });

  return s.result();
}

// ---------------------------------------------------------------------------
// Fungsi utama
// ---------------------------------------------------------------------------

/**
 * Apakah CV sudah punya isi yang layak dinilai keterbacaan dan strukturnya.
 *
 * Tanpa pemeriksaan ini, CV yang benar-benar kosong justru memperoleh nilai
 * penuh pada kedua dimensi tersebut - sebab seluruh aturannya berbentuk
 * "tidak boleh ada X", dan pada dokumen kosong memang tidak ada X apa pun.
 * Dokumen kosong lolos secara hampa, bukan karena benar.
 */
function hasSubstance(data: ResumeData): boolean {
  return (
    data.personalInfo.summary.trim().length > 0 ||
    data.experiences.length > 0 ||
    data.educations.length > 0 ||
    data.projects.length > 0 ||
    data.organizations.length > 0
  );
}

export function analyzeResume(
  data: ResumeData,
  jobDescription = "",
  measuredPages?: number,
  locale: Locale = "id",
): AtsResult {
  const m = atsMessages(locale);
  const plainText = resumeToPlainText(data);
  const keywords = jobDescription.trim()
    ? analyzeKeywords(plainText, jobDescription)
    : null;

  const pages = measuredPages ?? estimatePages(data);
  const substantial = hasSubstance(data);

  const parseability = scoreParseability(data, m);
  const structure = scoreStructure(data, pages, m);

  if (!substantial) {
    for (const dimension of [parseability, structure]) {
      dimension.applicable = false;
      dimension.findings = [
        {
          dimension: dimension.key,
          severity: "info",
          message: m.notScorable(dimension.label),
          fix: m.notScorableFix,
          section: "experience",
        },
      ];
    }
  }

  const dimensions: DimensionResult[] = [
    scoreCompleteness(data, m),
    parseability,
    scoreContentQuality(data, m),
    scoreKeywordMatch(keywords, m),
    structure,
  ];

  // Dimensi yang tidak berlaku dikeluarkan dari pembagi, sehingga skor tetap
  // pada skala 0-100 meski deskripsi lowongan belum ditempelkan.
  const applicable = dimensions.filter((d) => d.applicable);
  const totalWeight = applicable.reduce((sum, d) => sum + d.weight, 0);
  const totalScore = applicable.reduce((sum, d) => sum + d.score, 0);
  const score = totalWeight === 0 ? 0 : Math.round((totalScore / totalWeight) * 100);

  const severityRank: Record<Severity, number> = {
    error: 0,
    warning: 1,
    info: 2,
  };
  const suggestions = dimensions
    .flatMap((d) => d.findings)
    .sort((a, b) => severityRank[a.severity] - severityRank[b.severity]);

  const bullets = allBullets(data);
  const stats: AtsStats = {
    wordCount: countWords(plainText),
    bulletCount: bullets.length,
    estimatedPages: pages,
    actionVerbRatio: bullets.length
      ? bullets.filter(startsWithActionVerb).length / bullets.length
      : 0,
    quantifiedRatio: bullets.length
      ? bullets.filter(hasMetric).length / bullets.length
      : 0,
    skillCount: data.skills.filter((s) => s.name.trim()).length,
    experienceCount: data.experiences.length,
  };

  return {
    score,
    grade: gradeOf(score),
    verdict: verdictOf(score, keywords !== null, m),
    dimensions,
    suggestions,
    keywords,
    stats,
  };
}

// ---------------------------------------------------------------------------
// Utilitas
// ---------------------------------------------------------------------------

function countWords(text: string): number {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

export function startsWithActionVerb(bullet: string): boolean {
  const first = tokenize(bullet)[0];
  return first ? ACTION_VERBS.has(first) : false;
}

export function hasMetric(bullet: string): boolean {
  // Angka, persentase, nominal rupiah, atau satuan waktu terukur.
  return /\d/.test(bullet);
}

function findEmploymentGap(data: ResumeData): number | null {
  const periods = data.experiences
    .filter((e) => MONTH_PATTERN.test(e.startDate))
    .map((e) => ({
      start: monthIndex(e.startDate),
      end: e.isCurrent
        ? Number.POSITIVE_INFINITY
        : MONTH_PATTERN.test(e.endDate)
          ? monthIndex(e.endDate)
          : null,
    }))
    .filter((p): p is { start: number; end: number } => p.end !== null)
    .sort((a, b) => a.start - b.start);

  for (let i = 1; i < periods.length; i++) {
    const gap = periods[i].start - periods[i - 1].end;
    if (Number.isFinite(gap) && gap > 12) return gap;
  }
  return null;
}

function monthIndex(value: string): number {
  const [year, month] = value.split("-").map(Number);
  return year * 12 + month;
}

/*
  SETELAN ambang nilai huruf.

  A >= 85, B >= 70, C >= 55, sisanya D. Jaraknya sengaja tidak rata: naik dari
  D ke C jauh lebih mudah daripada naik dari B ke A, dan itu memang
  mencerminkan kenyataannya - kesalahan besar cepat hilang, sedangkan
  kesempurnaan menuntut memperbaiki banyak hal kecil sekaligus.

  Kalau ambang ini diubah, `verdictOf()` tepat di bawahnya memakai ambang yang
  SAMA dan harus ikut diubah - kalau tidak, akan ada CV bernilai B yang
  kalimat vonisnya berkata "cukup".
*/
function gradeOf(score: number): "A" | "B" | "C" | "D" {
  if (score >= 85) return "A";
  if (score >= 70) return "B";
  if (score >= 55) return "C";
  return "D";
}

function verdictOf(
  score: number,
  withJob: boolean,
  m: AtsMessages,
): string {
  const suffix = withJob ? "" : m.verdictNoJobSuffix;
  if (score >= 85) return `${m.verdictExcellent}${suffix}`;
  if (score >= 70) return `${m.verdictGood}${suffix}`;
  if (score >= 55) return `${m.verdictFair}${suffix}`;
  return `${m.verdictPoor}${suffix}`;
}

import type { Locale } from "@/lib/i18n/config";
import { nilaiBuktiKarya, type NilaiItem } from "./bukti-karya";
import { EFEK_JENJANG } from "@/lib/portfolio/pola-schemas";
import { skemaProfil } from "@/lib/portfolio/profil";
import { portofolioAktif } from "@/lib/portfolio/render";
import { tebakBahasa } from "@/lib/portfolio/deteksi";
import { kamusProfil } from "@/lib/portfolio/profil";
import {
  allBullets,
  groupSkills,
  resumeToPlainText,
  teksPencocokan,
} from "@/lib/resume/plaintext";
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
  BuktiKaryaRingkas,
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

/**
 * ============================================================================
 *  MESIN PENILAIAN ATS
 * ============================================================================
 *
 * Skor 0-100 disusun dari lima dimensi berbobot. Seluruh aturan bersifat
 * deterministik dan berbasis kaidah, bukan model bahasa, sehingga:
 *  - hasil pengujian dapat direproduksi dan dibandingkan antar-percobaan,
 *  - setiap angka dapat ditelusuri ke aturan yang jelas, dan
 *  - penilaian berjalan tanpa biaya maupun koneksi ke layanan pihak ketiga.
 *
 * Setiap aturan mengembalikan bukan hanya nilai, tetapi juga saran perbaikan
 * yang dapat langsung ditindaklanjuti pengguna. Inilah pembeda utamanya dari
 * pembuat CV yang hanya menyimpan data.
 *
 * Kalimat sarannya sendiri tidak ditulis di sini melainkan di messages.ts,
 * sehingga berkas ini murni berisi angka dan syarat - dan bahasa antarmuka
 * dapat berganti tanpa satu pun aturan penilaian ikut tersentuh. Perhatikan
 * bahwa skornya sendiri tidak bergantung bahasa: masukan yang sama selalu
 * menghasilkan angka yang sama.
 */

export type {
  AtsFinding,
  AtsResult,
  AtsStats,
  BuktiKaryaRingkas,
  DimensionKey,
  DimensionResult,
  Severity,
};

/**
 * Bobot lima dimensi asli. Totalnya 100 selama bagian portofolio belum menyala.
 */
export const DIMENSION_WEIGHTS: Record<DimensionKey, number> = {
  completeness: 25,
  parseability: 25,
  contentQuality: 20,
  keywordMatch: 20,
  structure: 10,
  buktiKarya: 0,
};

/**
 * Bobot yang berlaku untuk sebuah CV.
 *
 * Aturannya ditulis eksplisit karena dua kalimat yang mudah bertabrakan harus
 * keduanya benar: bobot dimensi lain turun secara proporsional ketika bukti
 * karya ikut dinilai, **dan** skor CV lama tidak boleh bergeser sebelum
 * penggunanya sendiri menyalakan bagian portofolio.
 *
 *   portofolio mati  -> bobot Bukti Karya 0; lima dimensi lama memakai bobot
 *                       aslinya, total tetap 100
 *   portofolio nyala -> bobot Bukti Karya = bobotBuktiKarya polanya; lima
 *                       dimensi lama dikali (100 - bobot) / 100
 *
 * Perkalian proporsional itu yang menjaga totalnya tetap 100 tanpa satu pun
 * dimensi berubah kedudukannya terhadap dimensi lain.
 */
export function dimensionWeights(data: ResumeData): Record<DimensionKey, number> {
  if (!portofolioAktif(data)) return { ...DIMENSION_WEIGHTS };

  const bobot = skemaProfil(data.profilPortofolio).bobotBuktiKarya;
  const sisa = (100 - bobot) / 100;
  return {
    completeness: DIMENSION_WEIGHTS.completeness * sisa,
    parseability: DIMENSION_WEIGHTS.parseability * sisa,
    contentQuality: DIMENSION_WEIGHTS.contentQuality * sisa,
    keywordMatch: DIMENSION_WEIGHTS.keywordMatch * sisa,
    structure: DIMENSION_WEIGHTS.structure * sisa,
    buktiKarya: bobot,
  };
}

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

  /**
   * Keterangan yang tidak memengaruhi nilai sama sekali.
   *
   * Dipakai untuk hal yang pengguna berhak tahu tetapi tidak berhak dihukum
   * karenanya - panjang halaman, misalnya. Sengaja dibedakan dari `rule`:
   * begitu sebuah keterangan menumpang pada aturan berpoin, cepat atau lambat
   * ia ikut menggerakkan angka tanpa ada yang menyadarinya.
   */
  note(finding: Omit<AtsFinding, "dimension">): void {
    this.findings.push({ ...finding, dimension: this.key });
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
    Panjang halaman tidak lagi menurunkan nilai. Sama sekali.

    Tidak ada satu pun dokumentasi vendor pengurai yang menyebut batas
    halaman - pengurai bekerja atas teks hasil konversi, tempat "halaman"
    sudah tidak ada lagi. Dan satu-satunya eksperimen terkontrol yang tersedia
    (482 profesional rekrutmen, 7.712 CV, tiap CV satu halaman dipasangkan
    dengan versi dua halaman berisi kredensial identik) justru menemukan versi
    dua halaman 2,3 kali lebih disukai.

    Catatan kejujuran yang harus ikut disebut: studi itu diterbitkan penjual
    jasa penulisan CV, jadi ada konflik kepentingan. Tapi desainnya terkontrol
    dan sampelnya besar - jauh di atas mutu bukti lain yang ada di ruang ini,
    termasuk mutu bukti yang mendasari aturan satu halaman yang digantikannya.

    Yang tersisa adalah keterangan netral: berapa halaman CV-nya, tanpa satu
    pun angka yang bergerak karenanya. Untuk pola Publikasi & Kredit, bahkan
    keterangan itu tidak ditampilkan - daftar karya terbit memang tidak
    dipangkas.
  */
  // Poinnya diberikan penuh tanpa syarat: panjang halaman tidak lagi menjadi
  // salah satu hal yang dinilai.
  s.rule(4, true, {
    severity: "info",
    message: m.lengthOnePage,
    fix: m.lengthOnePageFix,
  });

  // Untuk pola Publikasi & Kredit, bahkan keterangannya tidak ditampilkan -
  // daftar karya terbit memang tidak pernah dipangkas.
  if (!skemaProfil(data.profilPortofolio).tanpaIndikatorPanjang) {
    s.note({
      severity: "info",
      message: pages === 1 ? m.lengthOnePage : m.lengthMultiPage(pages),
      fix: pages === 1 ? m.lengthOnePageFix : m.lengthMultiPageFix,
    });
  }

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

/**
 * Dimensi Kekuatan Bukti.
 *
 * Nilainya datang dari model P × Q × R di bukti-karya.ts, bukan dihitung di
 * sini - berkas itu yang memegang rubriknya, lengkap dengan rincian per item
 * yang dapat ditelusuri pengguna. Yang dikerjakan di sini hanya mengubahnya
 * menjadi temuan yang dapat diklik.
 */
function scoreBuktiKarya(data: ResumeData, m: AtsMessages): DimensionResult {
  const s = new DimensionScorer("buktiKarya", m.dimensionLabel.buktiKarya);
  const schema = skemaProfil(data.profilPortofolio);
  const nilai = nilaiBuktiKarya(data);

  if (!portofolioAktif(data)) {
    const result = s.result(false);
    result.findings.push({
      dimension: "buktiKarya",
      severity: "info",
      message: m.buktiKaryaOff,
      fix: m.buktiKaryaOffFix,
      section: "project",
    });
    return result;
  }

  s.ratioRule(100, nilai.skor / 100, 1, {
    severity: "info",
    message: m.buktiKaryaScore(Math.round(nilai.skor)),
    fix: m.buktiKaryaScoreFix,
    section: "project",
  });

  const result = s.result(true);
  // Temuan diambil dari item terlemah lebih dulu: itulah yang paling banyak
  // menaikkan angka bila diperbaiki.
  result.findings = [];
  const pemula = EFEK_JENJANG[data.profilPortofolio.jenjang].nadaSaran === "pemula";
  const terlemah = [...nilai.item].sort((a, b) => a.skor - b.skor).slice(0, 3);

  for (const item of terlemah) {
    if (item.skor >= 100) continue;
    const judul = item.judul.trim() || schema.labelItem;
    for (const [peran, kalimat] of Object.entries(schema.saranSkor)) {
      if (!kalimat) continue;
      if (!syaratBelumTerpenuhi(peran, item)) continue;
      result.findings.push({
        dimension: "buktiKarya",
        severity: "info",
        message: `${judul}: ${kalimat}`,
        fix: pemula ? m.buktiKaryaFixPemula : m.buktiKaryaScoreFix,
        section: "project",
      });
      break;
    }
  }

  if (nilai.n > 0 && nilai.p < 1) {
    result.findings.push({
      dimension: "buktiKarya",
      severity: "info",
      message: m.buktiKaryaFewItems(nilai.n, nilai.rentang[0]),
      fix: m.buktiKaryaFewItemsFix,
      section: "project",
    });
  }

  return result;
}

/**
 * Syarat rubrik mana yang belum terpenuhi pada sebuah item.
 *
 * Dibaca dari hasil penilaiannya, bukan dari isiannya lagi - supaya saran yang
 * muncul dan angka yang ditampilkan tidak mungkin berasal dari dua pembacaan
 * yang berbeda.
 */
function syaratBelumTerpenuhi(peran: string, item: NilaiItem): boolean {
  if (peran === "peran") return item.q < 2;
  if (peran === "verifikator") {
    return !item.penyesuaian.some((p) => p.jenis === "verifikator-lengkap");
  }
  if (peran === "tautan") {
    return item.penyesuaian.some((p) => p.jenis === "tanpa-tautan-valid");
  }
  // R menghitung tiga syarat sekaligus; belum penuh berarti ada yang kurang.
  return item.r < 3;
}

export function analyzeResume(
  data: ResumeData,
  jobDescription = "",
  measuredPages?: number,
  locale: Locale = "id",
): AtsResult {
  const m = atsMessages(locale);
  const plainText = resumeToPlainText(data);

  /*
    Pencocokan lowongan memakai teks yang sedikit lebih luas daripada yang
    tercetak: slot detail tambahan hanya mencetak empat baris teratas, tetapi
    seluruhnya tetap keahlian penggunanya. Dimensi lain tetap membaca teks
    cetaknya - yang dinilai di sana memang CV yang akan dibaca orang.

    Kata kunci khas bidangnya sendiri diberi bobot lebih tinggi, karena
    frekuensi kemunculan di iklan lowongan tidak dapat membedakan istilah yang
    menentukan dari kata yang sekadar sering diulang.
  */
  const kamus = kamusProfil(data.profilPortofolio);
  const keywords = jobDescription.trim()
    ? analyzeKeywords(teksPencocokan(data), jobDescription, 25, {
        utama: kamus?.kataKunciATS ?? [],
        sekunder: data.profilPortofolio.industriKBLI
          ? [data.profilPortofolio.industriKBLI]
          : [],
      })
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

  const bobot = dimensionWeights(data);
  const dimensions: DimensionResult[] = [
    scoreCompleteness(data, m),
    parseability,
    scoreContentQuality(data, m),
    scoreKeywordMatch(keywords, m),
    structure,
    scoreBuktiKarya(data, m),
  ].map((d) => ({
    ...d,
    weight: bobot[d.key],
    score: Math.round(((d.percent / 100) * bobot[d.key] + Number.EPSILON) * 10) / 10,
  }));

  /*
    Dua angka, dihitung terpisah.

    Kecocokan Lowongan berdiri sendiri karena ia mengukur hal yang berbeda dari
    yang lain: bukan mutu CV-nya, melainkan kecocokannya dengan satu iklan
    tertentu. Mencampur keduanya menjadi satu angka membuat CV yang bagus
    terlihat buruk hanya karena iklan yang ditempel kebetulan meminta hal lain -
    dan itu justru menyesatkan orang yang sedang memperbaiki CV-nya.
  */
  const kekuatanDimensi = dimensions.filter(
    (d) => d.applicable && d.key !== "keywordMatch",
  );
  const bobotKekuatan = kekuatanDimensi.reduce((sum, d) => sum + d.weight, 0);
  const nilaiKekuatan = kekuatanDimensi.reduce((sum, d) => sum + d.score, 0);
  const strength =
    bobotKekuatan === 0 ? 0 : Math.round((nilaiKekuatan / bobotKekuatan) * 100);

  /*
    Bahasa CV melawan bahasa iklan lowongannya.

    Alasannya mekanis, bukan selera: penemuan kandidat berjalan lewat
    pencocokan kata kunci, sehingga CV berbahasa Inggris yang dilamarkan ke
    iklan berbahasa Indonesia gagal pada pencarian "pengalaman", "keuangan",
    "penjualan" - tiga kata yang tidak akan pernah ada di dalamnya. Istilah
    teknis tidak termasuk; nama perkakas dan sertifikasi memang selalu Inggris
    di kedua bahasa.
  */
  if (jobDescription.trim()) {
    const bahasaIklan = tebakBahasa(jobDescription);
    if (bahasaIklan && bahasaIklan !== data.language) {
      const dimensi = dimensions.find((d) => d.key === "keywordMatch");
      dimensi?.findings.push({
        dimension: "keywordMatch",
        severity: "warning",
        message: m.bahasaBerbeda(
          data.language === "ID" ? "Indonesia" : "Inggris",
          bahasaIklan === "ID" ? "Indonesia" : "Inggris",
        ),
        fix: m.bahasaBerbedaFix,
      });
    }
  }

  const dimensiKeyword = dimensions.find((d) => d.key === "keywordMatch");
  const match =
    dimensiKeyword && dimensiKeyword.applicable ? dimensiKeyword.percent : null;

  /*
    Angka pembanding: nilai yang sama, dihitung dengan bobot lama.

    Dihitung dari persentase dimensi yang sudah ada, bukan dengan menjalankan
    penilaian dua kali - hasilnya persis sama dan biayanya nol, sementara
    penilaian ini berjalan setiap kali penggunanya mengetik satu huruf.
  */
  const strengthTanpaPortofolio = portofolioAktif(data)
    ? (() => {
        const lama = dimensions.filter(
          (d) => d.applicable && d.key !== "keywordMatch" && d.key !== "buktiKarya",
        );
        const bobotLama = lama.reduce(
          (sum, d) => sum + DIMENSION_WEIGHTS[d.key],
          0,
        );
        const nilaiLama = lama.reduce(
          (sum, d) => sum + (d.percent / 100) * DIMENSION_WEIGHTS[d.key],
          0,
        );
        return bobotLama === 0 ? 0 : Math.round((nilaiLama / bobotLama) * 100);
      })()
    : null;

  const score = strength;

  const severityRank: Record<Severity, number> = {
    error: 0,
    warning: 1,
    info: 2,
  };
  // Dirakit setelah seluruh temuan terkumpul - termasuk temuan bahasa yang
  // ditambahkan di atas.
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

  const rincianBukti = nilaiBuktiKarya(data);
  const buktiKarya: BuktiKaryaRingkas | null = portofolioAktif(data)
    ? {
        skor: Math.round(rincianBukti.skor),
        p: rincianBukti.p,
        n: rincianBukti.n,
        rentang: rincianBukti.rentang,
        item: rincianBukti.item.map((i) => ({
          id: i.id,
          judul: i.judul,
          q: i.q,
          r: i.r,
          skor: Math.round(i.skor),
        })),
      }
    : null;

  return {
    score,
    strength,
    match,
    strengthTanpaPortofolio,
    grade: gradeOf(strength),
    verdict: verdictOf(strength, keywords !== null, m),
    dimensions,
    suggestions,
    keywords,
    stats,
    buktiKarya,
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

import { allBullets, groupSkills, resumeToPlainText } from "@/lib/resume/plaintext";
import { isSectionVisible } from "@/lib/resume/sections";
import type { ResumeData, SectionKey } from "@/lib/resume/types";
import { analyzeKeywords, type KeywordAnalysis, tokenize } from "./keywords";
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
 * yang dapat langsung ditindaklanjuti pengguna. Inilah pembeda utamanya
 * dari pembuat CV yang hanya menyimpan data.
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

export const DIMENSION_WEIGHTS: Record<DimensionKey, number> = {
  completeness: 25,
  parseability: 25,
  contentQuality: 20,
  keywordMatch: 20,
  structure: 10,
};

export const DIMENSION_LABELS: Record<DimensionKey, string> = {
  completeness: "Kelengkapan Data",
  parseability: "Keterbacaan Mesin",
  contentQuality: "Kualitas Konten",
  keywordMatch: "Kecocokan Kata Kunci",
  structure: "Panjang & Struktur",
};

export const DIMENSION_DESCRIPTIONS: Record<DimensionKey, string> = {
  completeness:
    "Apakah semua informasi yang dicari perekrut sudah ada di CV Anda.",
  parseability:
    "Apakah CV Anda dapat diurai mesin dengan benar: format tanggal, kelengkapan pasangan jabatan-perusahaan, jenis huruf, dan tanpa elemen yang menyulitkan parser.",
  contentQuality:
    "Apakah poin pencapaian ditulis dengan kata kerja aksi dan didukung angka, bukan sekadar daftar tugas.",
  keywordMatch:
    "Seberapa banyak kata kunci penting dari iklan lowongan yang benar-benar muncul di CV Anda.",
  structure:
    "Apakah panjang dan urutan CV wajar, serta tidak ada jeda waktu yang tidak dijelaskan.",
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
const MONTH_PATTERN = /^\d{4}-\d{2}$/;

// ---------------------------------------------------------------------------
// Alat bantu penilaian
// ---------------------------------------------------------------------------

class DimensionScorer {
  private earned = 0;
  private max = 0;
  readonly findings: AtsFinding[] = [];

  constructor(private readonly key: DimensionKey) {}

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
      label: DIMENSION_LABELS[this.key],
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
 * Memperkirakan jumlah halaman A4 tanpa perlu me-render dokumen.
 *
 * Perhitungan memakai geometri kertas yang sama dengan template cetak:
 * tinggi A4 297 mm dikurangi margin atas-bawah, dibagi tinggi baris
 * (ukuran huruf dalam pt dikali line-height, dikonversi ke mm).
 * Nilai ini adalah perkiraan; antarmuka editor menampilkan jumlah halaman
 * sebenarnya dari hasil pengukuran DOM.
 */
export function estimatePages(data: ResumeData): number {
  const PAGE_HEIGHT_MM = 297;
  const MARGIN_MM = 15 * 2;
  const PT_TO_MM = 0.3528;
  const lineHeightMm = data.fontSize * data.lineHeight * PT_TO_MM;
  const linesPerPage = Math.max(
    20,
    Math.floor((PAGE_HEIGHT_MM - MARGIN_MM) / lineHeightMm),
  );

  // Perkiraan lebar teks: 180 mm area cetak dibagi lebar rata-rata karakter.
  const charsPerLine = Math.max(
    40,
    Math.floor(180 / (data.fontSize * PT_TO_MM * 0.5)),
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

function scoreCompleteness(data: ResumeData): DimensionResult {
  const s = new DimensionScorer("completeness");
  const info = data.personalInfo;

  s.rule(4, info.fullName.trim().length > 0, {
    severity: "error",
    message: "Nama lengkap belum diisi.",
    fix: "Isi field Nama Lengkap di section Data Pribadi. Ini field pertama yang dibaca setiap parser ATS.",
    section: "personal",
  });

  s.rule(4, EMAIL_PATTERN.test(info.email.trim()), {
    severity: "error",
    message: info.email.trim()
      ? "Format email tidak valid."
      : "Alamat email belum diisi.",
    fix: "Gunakan email aktif berformat nama@domain.com. Tanpa email yang terbaca, sistem rekrutmen tidak dapat menghubungi Anda meski CV lolos seleksi.",
    section: "personal",
  });

  s.rule(3, info.phone.replace(/\D/g, "").length >= 8, {
    severity: "error",
    message: "Nomor telepon belum diisi atau terlalu pendek.",
    fix: "Isi nomor telepon lengkap dengan kode negara, contoh: +62 812-3456-7890.",
    section: "personal",
  });

  s.rule(2, info.headline.trim().length > 0, {
    severity: "warning",
    message: "Jabatan/posisi yang dituju belum diisi.",
    fix: "Isi field Jabatan dengan posisi yang Anda lamar, mis. \"Frontend Developer\". Sesuaikan dengan judul lowongan agar cocok saat pencocokan kata kunci.",
    section: "personal",
  });

  s.rule(
    2,
    [info.city, info.province, info.country].some((v) => v.trim().length > 0),
    {
      severity: "warning",
      message: "Domisili belum diisi.",
      fix: "Isi minimal kota tempat tinggal. Banyak perusahaan memfilter kandidat berdasarkan lokasi.",
      section: "personal",
    },
  );

  const summaryWords = countWords(info.summary);
  s.rule(4, summaryWords >= 30 && summaryWords <= 120, {
    severity: summaryWords === 0 ? "error" : "warning",
    message:
      summaryWords === 0
        ? "Ringkasan profil belum diisi."
        : summaryWords < 30
          ? `Ringkasan profil terlalu singkat (${summaryWords} kata).`
          : `Ringkasan profil terlalu panjang (${summaryWords} kata).`,
    fix: "Tulis 30-120 kata yang memuat: peran Anda, lama pengalaman, keahlian utama, dan satu pencapaian berangka.",
    section: "summary",
  });

  s.rule(4, data.experiences.length >= 1 || data.projects.length >= 2, {
    severity: "error",
    message: "Belum ada pengalaman kerja maupun proyek yang cukup.",
    fix: "Isi minimal satu Pengalaman Kerja. Jika Anda fresh graduate, isi minimal dua Proyek sebagai penggantinya.",
    section: "experience",
  });

  s.rule(2, data.educations.length >= 1, {
    severity: "warning",
    message: "Riwayat pendidikan belum diisi.",
    fix: "Isi minimal jenjang pendidikan terakhir beserta tahunnya.",
    section: "education",
  });

  const skillCount = data.skills.filter((sk) => sk.name.trim()).length;
  s.ratioRule(3, Math.min(skillCount / 5, 1), 1, {
    severity: "warning",
    message: `Jumlah keahlian masih sedikit (${skillCount} dari minimal 5).`,
    fix: "Tambahkan keahlian teknis maupun perangkat yang Anda kuasai. Section Keahlian adalah tempat utama ATS mencari kecocokan kata kunci.",
    section: "skill",
  });

  s.rule(
    2,
    [info.linkedinUrl, info.portfolioUrl, info.githubUrl].some(
      (v) => v.trim().length > 0,
    ),
    {
      severity: "info",
      message: "Belum ada tautan profil profesional.",
      fix: "Tambahkan minimal satu tautan: LinkedIn, portofolio, atau GitHub.",
      section: "personal",
    },
  );

  return s.result();
}

// ---------------------------------------------------------------------------
// Dimensi 2: keterbacaan mesin
// ---------------------------------------------------------------------------

function scoreParseability(data: ResumeData): DimensionResult {
  const s = new DimensionScorer("parseability");

  s.rule(3, !data.personalInfo.showPhoto, {
    severity: "warning",
    message: "CV menampilkan pas foto.",
    fix: "Matikan opsi Tampilkan Foto. Sebagian besar parser ATS tidak dapat membaca gambar, dan tata letak di sekitar foto sering membuat teks terbaca berantakan. Aktifkan hanya bila lowongan secara eksplisit memintanya.",
    section: "personal",
  });

  s.rule(3, ATS_SAFE_FONTS.includes(data.fontFamily), {
    severity: "warning",
    message: `Jenis huruf "${data.fontFamily}" bukan huruf yang aman untuk ATS.`,
    fix: `Gunakan salah satu dari: ${ATS_SAFE_FONTS.slice(0, 4).join(", ")}. Huruf yang tidak tersedia di sistem penerima akan disubstitusi dan dapat merusak tata letak.`,
  });

  s.rule(2, data.fontSize >= 9 && data.fontSize <= 12, {
    severity: "warning",
    message: `Ukuran huruf ${data.fontSize}pt berada di luar rentang aman.`,
    fix: "Gunakan 10-11pt. Huruf di bawah 9pt sulit dibaca manusia maupun mesin OCR.",
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
      message: "Ada tanggal dengan format tidak baku.",
      fix: "Isi seluruh tanggal lewat pemilih bulan yang tersedia agar formatnya seragam. Format tanggal yang campur aduk membuat parser gagal menghitung lama pengalaman kerja.",
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
      message: "Ada pengalaman kerja tanpa jabatan atau tanpa nama perusahaan.",
      fix: "Lengkapi kedua field tersebut pada setiap entri. Parser ATS memetakan pengalaman kerja berdasarkan pasangan jabatan-perusahaan; salah satu kosong membuat entri itu terbuang.",
      section: "experience",
    });

    const dated = data.experiences.filter((e) => e.startDate.trim()).length;
    s.ratioRule(4, dated / data.experiences.length, 1, {
      severity: "error",
      message: "Ada pengalaman kerja tanpa tanggal mulai.",
      fix: "Isi bulan dan tahun mulai pada setiap pengalaman. Tanpa itu, sistem tidak dapat menghitung total lama pengalaman Anda.",
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
      message: "Ada riwayat pendidikan tanpa nama institusi atau jenjang.",
      fix: "Lengkapi nama institusi dan jenjang (mis. \"S1\", \"SMA\") pada setiap entri pendidikan.",
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
      message: "Ada nama keahlian yang disertai keterangan tingkat penguasaan.",
      fix: "Tulis nama keahlian apa adanya, mis. \"JavaScript\" bukan \"JavaScript (mahir)\". ATS mencocokkan kata kunci secara harfiah, sehingga tambahan dalam kurung justru menurunkan kecocokan.",
      section: "skill",
    });
  }

  // Karakter yang mengindikasikan tabel atau tata letak berkolom
  const bullets = allBullets(data);
  const risky = bullets.filter((b) => /[\t│┃|]{1}/.test(b)).length;
  s.rule(2, risky === 0, {
    severity: "warning",
    message: "Ada poin yang memuat karakter tabel atau pemisah kolom.",
    fix: "Hapus karakter seperti | atau tab dari isi poin. Karakter tersebut membuat parser mengira ada struktur tabel dan memecah kalimat Anda.",
  });

  const badTitles = data.customSections.filter((c) =>
    /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(c.title),
  ).length;
  s.rule(2, badTitles === 0, {
    severity: "warning",
    message: "Ada judul section tambahan yang memuat emoji.",
    fix: "Gunakan judul berupa teks biasa. Emoji tidak dikenali parser dan dapat membuat seluruh isi section tersebut gagal dipetakan.",
    section: "custom",
  });

  return s.result();
}

// ---------------------------------------------------------------------------
// Dimensi 3: kualitas konten
// ---------------------------------------------------------------------------

function scoreContentQuality(data: ResumeData): DimensionResult {
  const s = new DimensionScorer("contentQuality");
  const bullets = allBullets(data);

  if (bullets.length === 0) {
    s.rule(6, false, {
      severity: "error",
      message: "Belum ada poin pencapaian sama sekali.",
      fix: "Tambahkan minimal 2-3 poin pada setiap pengalaman kerja atau proyek. Bagian inilah yang membedakan Anda dari pelamar lain.",
      section: "experience",
    });
    return s.result();
  }

  const withVerb = bullets.filter((b) => startsWithActionVerb(b)).length;
  s.ratioRule(6, withVerb / bullets.length, 0.7, {
    severity: "warning",
    message: `Baru ${Math.round((withVerb / bullets.length) * 100)}% poin yang diawali kata kerja aksi.`,
    fix: "Mulai setiap poin dengan kata kerja aksi seperti Mengembangkan, Meningkatkan, Memimpin, atau Mengoptimasi. Hindari pembuka pasif seperti \"Bertanggung jawab atas\".",
    section: "experience",
  });

  const quantified = bullets.filter((b) => hasMetric(b)).length;
  s.ratioRule(5, quantified / bullets.length, 0.5, {
    severity: "warning",
    message: `Baru ${Math.round((quantified / bullets.length) * 100)}% poin yang memuat angka terukur.`,
    fix: "Sertakan angka pada minimal separuh poin: persentase, jumlah pengguna, nominal, atau durasi. Contoh: \"Menurunkan waktu muat 45% (3,2 detik menjadi 1,8 detik)\".",
    section: "experience",
  });

  const notTooLong = bullets.filter((b) => b.length <= 220).length;
  s.ratioRule(3, notTooLong / bullets.length, 0.9, {
    severity: "info",
    message: "Ada poin yang terlalu panjang.",
    fix: "Pertahankan tiap poin dalam 1-2 baris (maksimal sekitar 220 karakter). Poin yang panjang cenderung dilewati saat perekrut memindai CV.",
    section: "experience",
  });

  const notTooShort = bullets.filter((b) => b.length >= 40).length;
  s.ratioRule(2, notTooShort / bullets.length, 0.8, {
    severity: "info",
    message: "Ada poin yang terlalu singkat sehingga kurang informatif.",
    fix: "Kembangkan poin singkat dengan menambahkan konteks dan hasil, bukan sekadar nama tugas.",
    section: "experience",
  });

  const haystack = `${data.personalInfo.summary} ${bullets.join(" ")}`.toLowerCase();
  const found = CLICHE_PHRASES.filter((p) => haystack.includes(p));
  s.rule(3, found.length === 0, {
    severity: "info",
    message: `Terdapat frasa klise: ${found.slice(0, 3).map((f) => `"${f}"`).join(", ")}.`,
    fix: "Ganti klaim umum dengan bukti. Alih-alih \"pekerja keras\", tulis pencapaian nyata yang menunjukkannya.",
    section: "summary",
  });

  const summaryLower = ` ${data.personalInfo.summary.toLowerCase()} `;
  const usesFirstPerson = /\b(saya|aku)\b/.test(summaryLower);
  s.rule(2, !usesFirstPerson, {
    severity: "info",
    message: "Ringkasan profil memakai kata ganti orang pertama.",
    fix: "Hilangkan kata \"saya\". Tulis \"Frontend Developer dengan pengalaman 4 tahun...\" alih-alih \"Saya adalah seorang...\". Ini konvensi baku penulisan CV.",
    section: "summary",
  });

  if (data.experiences.length > 0) {
    const enough = data.experiences.filter(
      (e) => e.bullets.filter(Boolean).length >= 2,
    ).length;
    s.ratioRule(3, enough / data.experiences.length, 1, {
      severity: "warning",
      message: "Ada pengalaman kerja dengan kurang dari 2 poin pencapaian.",
      fix: "Isi minimal 2 poin per pengalaman, idealnya 3-4 pada posisi terbaru.",
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
): DimensionResult {
  const s = new DimensionScorer("keywordMatch");

  if (!analysis || analysis.keywords.length === 0) {
    // Tanpa deskripsi lowongan, dimensi ini tidak dinilai dan bobotnya
    // dialihkan ke dimensi lain saat penghitungan skor akhir.
    const result = s.result(false);
    result.findings.push({
      dimension: "keywordMatch",
      severity: "info",
      message: "Deskripsi lowongan belum ditempelkan.",
      fix: "Tempelkan teks lowongan yang Anda incar untuk mengetahui kata kunci apa saja yang belum muncul di CV. Dimensi ini belum dihitung ke dalam skor.",
    });
    return result;
  }

  const missingTop = analysis.missing
    .slice(0, 5)
    .map((k) => `"${k.keyword}"`)
    .join(", ");

  s.ratioRule(20, analysis.coverage, 0.6, {
    severity: analysis.coverage < 0.35 ? "error" : "warning",
    message: `Kecocokan kata kunci baru ${Math.round(analysis.coverage * 100)}%. Belum muncul di CV: ${missingTop}.`,
    fix: "Masukkan kata kunci yang relevan dan benar-benar Anda kuasai ke section Keahlian atau ke poin pencapaian. Jangan menempelkan kata kunci yang tidak Anda kuasai - itu akan terbongkar saat wawancara.",
    section: "skill",
  });

  return s.result(true);
}

// ---------------------------------------------------------------------------
// Dimensi 5: panjang dan struktur
// ---------------------------------------------------------------------------

function scoreStructure(data: ResumeData, pages: number): DimensionResult {
  const s = new DimensionScorer("structure");

  s.rule(4, pages >= 1 && pages <= 2, {
    severity: pages > 2 ? "warning" : "info",
    message: `Perkiraan panjang CV ${pages} halaman.`,
    fix:
      pages > 2
        ? "Pangkas menjadi maksimal 2 halaman: buang pengalaman yang tidak relevan dan gabungkan poin yang mirip."
        : "Tambahkan isi sampai CV memenuhi minimal satu halaman penuh.",
  });

  const order = data.sectionOrder;
  const summaryIndex = order.indexOf("summary");
  const experienceIndex = order.indexOf("experience");
  s.rule(
    2,
    summaryIndex === -1 || experienceIndex === -1 || summaryIndex < experienceIndex,
    {
      severity: "info",
      message: "Ringkasan profil berada setelah pengalaman kerja.",
      fix: "Letakkan Ringkasan Profil di urutan teratas. Bagian ini berfungsi sebagai pembuka yang dibaca lebih dulu.",
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
    message: "Pengalaman kerja belum urut dari yang paling baru.",
    fix: "Susun pengalaman secara kronologis terbalik - posisi terbaru di urutan pertama. Ini format yang diharapkan hampir semua perekrut dan ATS.",
    section: "experience",
  });

  const gap = findEmploymentGap(data);
  s.rule(2, gap === null, {
    severity: "info",
    message: gap
      ? `Terdapat jeda ${gap} bulan antar-pengalaman kerja.`
      : "Terdapat jeda antar-pengalaman kerja.",
    fix: "Jeda lebih dari 12 bulan sebaiknya dijelaskan - isi dengan proyek, kursus, atau kegiatan organisasi pada periode tersebut.",
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
): AtsResult {
  const plainText = resumeToPlainText(data);
  const keywords = jobDescription.trim()
    ? analyzeKeywords(plainText, jobDescription)
    : null;

  const pages = measuredPages ?? estimatePages(data);
  const substantial = hasSubstance(data);

  const parseability = scoreParseability(data);
  const structure = scoreStructure(data, pages);

  if (!substantial) {
    for (const dimension of [parseability, structure]) {
      dimension.applicable = false;
      dimension.findings = [
        {
          dimension: dimension.key,
          severity: "info",
          message: `${dimension.label} belum dapat dinilai.`,
          fix: "Isi dulu ringkasan profil dan minimal satu pengalaman kerja atau proyek, lalu dimensi ini akan ikut dihitung.",
          section: "experience",
        },
      ];
    }
  }

  const dimensions: DimensionResult[] = [
    scoreCompleteness(data),
    parseability,
    scoreContentQuality(data),
    scoreKeywordMatch(keywords),
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
    verdict: verdictOf(score, keywords !== null),
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

function gradeOf(score: number): "A" | "B" | "C" | "D" {
  if (score >= 85) return "A";
  if (score >= 70) return "B";
  if (score >= 55) return "C";
  return "D";
}

function verdictOf(score: number, withJob: boolean): string {
  const suffix = withJob
    ? ""
    : " Skor ini belum memperhitungkan kecocokan dengan lowongan tertentu.";
  if (score >= 85)
    return `CV Anda sudah sangat siap dikirim.${suffix}`;
  if (score >= 70)
    return `CV Anda sudah baik, tinggal beberapa perbaikan kecil.${suffix}`;
  if (score >= 55)
    return `CV Anda cukup, namun ada beberapa hal penting yang perlu diperbaiki.${suffix}`;
  return `CV Anda berisiko tersaring sistem sebelum dibaca manusia.${suffix}`;
}

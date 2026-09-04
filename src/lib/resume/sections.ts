import {
  itemBagianPortofolio,
  judulPortofolio,
  portofolioAktif,
} from "@/lib/portfolio/render";
import type { ResumeData, ResumeLanguage, SectionKey } from "./types";

/**
 * Metadata setiap section CV.
 *
 * `heading` sengaja memakai judul baku yang dikenali mesin ATS
 * ("Pengalaman Kerja" / "Work Experience"), bukan judul kreatif seperti
 * "Jejak Karier Saya". Parser ATS mencocokkan judul section terhadap
 * daftar kata baku; judul non-standar membuat seluruh isi section tersebut
 * gagal dipetakan ke field yang benar.
 */
export interface SectionMeta {
  key: SectionKey;
  /** Label yang dipakai di panel form editor. */
  label: string;
  /** Judul yang dicetak di CV, per bahasa. */
  heading: Record<ResumeLanguage, string>;
  /** Penjelasan singkat di editor: section ini untuk apa. */
  hint: string;
  /** Section berisi banyak entri (bisa ditambah/hapus) atau tunggal. */
  repeatable: boolean;
}

export const SECTION_META: Record<SectionKey, SectionMeta> = {
  summary: {
    key: "summary",
    label: "Ringkasan Profil",
    heading: { ID: "RINGKASAN PROFIL", EN: "PROFESSIONAL SUMMARY" },
    hint: "2-4 kalimat: siapa Anda, keahlian utama, dan pencapaian terbesar. Ditempatkan paling atas karena bagian ini yang pertama dibaca perekrut.",
    repeatable: false,
  },
  experience: {
    key: "experience",
    label: "Pengalaman Kerja",
    heading: { ID: "PENGALAMAN KERJA", EN: "WORK EXPERIENCE" },
    hint: "Urutkan dari yang paling baru. Isi poin pencapaian, bukan daftar tugas rutin.",
    repeatable: true,
  },
  education: {
    key: "education",
    label: "Pendidikan",
    heading: { ID: "PENDIDIKAN", EN: "EDUCATION" },
    hint: "Jenjang terakhir di urutan pertama. IPK sebaiknya dicantumkan bila 3.00 ke atas.",
    repeatable: true,
  },
  skill: {
    key: "skill",
    label: "Keahlian",
    heading: { ID: "KEAHLIAN", EN: "SKILLS" },
    hint: "Tulis nama teknologi/keahlian apa adanya (mis. \"JavaScript\", bukan \"JS mahir\"). ATS mencocokkan kata kunci secara harfiah.",
    repeatable: true,
  },
  project: {
    key: "project",
    label: "Proyek",
    heading: { ID: "PROYEK", EN: "PROJECTS" },
    hint: "Bagus untuk fresh graduate: menutup minimnya pengalaman kerja dengan bukti karya.",
    repeatable: true,
  },
  certification: {
    key: "certification",
    label: "Sertifikasi",
    heading: { ID: "SERTIFIKASI", EN: "CERTIFICATIONS" },
    hint: "Cantumkan penerbit dan tahun. ID kredensial memudahkan verifikasi perekrut.",
    repeatable: true,
  },
  organization: {
    key: "organization",
    label: "Organisasi",
    heading: { ID: "PENGALAMAN ORGANISASI", EN: "ORGANIZATIONAL EXPERIENCE" },
    hint: "Tunjukkan peran dan dampak, bukan sekadar keanggotaan.",
    repeatable: true,
  },
  award: {
    key: "award",
    label: "Penghargaan",
    heading: { ID: "PENGHARGAAN", EN: "AWARDS" },
    hint: "Sebutkan tingkat kompetisi dan peringkat agar bobotnya terbaca.",
    repeatable: true,
  },
  language: {
    key: "language",
    label: "Bahasa",
    heading: { ID: "BAHASA", EN: "LANGUAGES" },
    hint: "Gunakan tingkat yang lazim (Native, Fluent, Intermediate), hindari diagram bintang.",
    repeatable: true,
  },
  publication: {
    key: "publication",
    label: "Publikasi",
    heading: { ID: "PUBLIKASI", EN: "PUBLICATIONS" },
    hint: "Relevan untuk jalur akademik atau riset. Sertakan penerbit dan DOI bila ada.",
    repeatable: true,
  },
  custom: {
    key: "custom",
    label: "Section Tambahan",
    heading: { ID: "TAMBAHAN", EN: "ADDITIONAL" },
    hint: "Untuk kebutuhan khusus yang belum tercakup section lain.",
    repeatable: true,
  },
};

/** Urutan bawaan; urutan ini adalah susunan CV kronologis-terbalik yang lazim. */
export const DEFAULT_SECTION_ORDER: SectionKey[] = [
  "summary",
  "experience",
  "education",
  "skill",
  "project",
  "organization",
  "certification",
  "award",
  "language",
  "publication",
  "custom",
];

export const ALL_SECTION_KEYS = DEFAULT_SECTION_ORDER;

/** Membersihkan sectionOrder dari database: buang yang tak dikenal, tambah yang hilang. */
export function normalizeSectionOrder(value: unknown): SectionKey[] {
  const incoming = Array.isArray(value) ? value : [];
  const seen = new Set<SectionKey>();
  const result: SectionKey[] = [];
  for (const item of incoming) {
    if (
      typeof item === "string" &&
      (ALL_SECTION_KEYS as string[]).includes(item) &&
      !seen.has(item as SectionKey)
    ) {
      seen.add(item as SectionKey);
      result.push(item as SectionKey);
    }
  }
  for (const key of DEFAULT_SECTION_ORDER) {
    if (!seen.has(key)) result.push(key);
  }
  return result;
}

/** Berapa entri terisi pada sebuah section - dipakai untuk badge jumlah di editor. */
export function sectionCount(data: ResumeData, key: SectionKey): number {
  switch (key) {
    case "summary":
      return data.personalInfo.summary.trim() ? 1 : 0;
    case "experience":
      return data.experiences.length;
    case "education":
      return data.educations.length;
    case "skill":
      return data.skills.length;
    case "project":
      return data.projects.length;
    case "certification":
      return data.certifications.length;
    case "organization":
      return data.organizations.length;
    case "award":
      return data.awards.length;
    case "language":
      return data.languages.length;
    case "publication":
      return data.publications.length;
    case "custom":
      return data.customSections.length;
  }
}

/**
 * Section kosong tidak dicetak di CV agar tidak muncul judul menggantung.
 *
 * Bagian portofolio punya satu keadaan tambahan yang mudah terlewat: ia boleh
 * menyala sementara **seluruh** itemnya sedang menempel pada entri pengalaman
 * kerja. Yang tersisa di bawah judulnya kalau begitu adalah ruang kosong, dan
 * judul yang menggantung di atas ruang kosong terbaca sebagai bagian yang
 * gagal dimuat - bukan sebagai bagian yang memang tidak ada isinya.
 */
export function isSectionVisible(data: ResumeData, key: SectionKey): boolean {
  if (key === "project" && portofolioAktif(data)) {
    return itemBagianPortofolio(data).length > 0;
  }
  return sectionCount(data, key) > 0;
}

export function sectionHeading(key: SectionKey, lang: ResumeLanguage): string {
  return SECTION_META[key].heading[lang];
}

/**
 * Judul section untuk sebuah CV tertentu.
 *
 * Berbeda dari `sectionHeading` yang hanya tahu kunci dan bahasa, yang ini
 * tahu CV-nya - dan itu diperlukan karena judul bagian portofolio ditentukan
 * pola pembuktian penggunanya: "PORTOFOLIO KARYA" untuk perancang,
 * "PENGALAMAN PRAKTIK & PENGAJARAN" untuk tenaga kesehatan dan pengajar.
 *
 * Selama bagian portofolio belum dinyalakan, yang dikembalikan tetap judul
 * lama - sehingga CV yang sudah tersimpan tidak berganti judul sendiri.
 */
export function sectionHeadingFor(
  data: ResumeData,
  key: SectionKey,
): string {
  if (key === "project" && portofolioAktif(data)) return judulPortofolio(data);
  return SECTION_META[key].heading[data.language];
}

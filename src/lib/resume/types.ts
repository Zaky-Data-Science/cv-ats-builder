/**
 * Bentuk data CV yang dipakai bersama oleh seluruh bagian aplikasi:
 * form editor, preview langsung, generator PDF/DOCX, mesin penilaian ATS,
 * serta berkas ekspor/impor JSON.
 *
 * Satu sumber kebenaran seperti ini penting agar apa yang diketik pengguna
 * di form persis sama dengan yang muncul di CV dan yang dinilai oleh ATS.
 */

export type TemplateId =
  | "CLASSIC"
  | "MODERN"
  | "COMPACT"
  | "EXECUTIVE"
  | "MINIMAL"
  | "TIMELINE"
  | "ACADEMIC"
  | "GOVERNMENT"
  | "PORTRAIT"
  | "PROFILE";
export type ResumeLanguage = "ID" | "EN";

/* Ukuran kertas didefinisikan di paper.ts bersama dimensi milimeternya, lalu
   diteruskan dari sini supaya berkas lain cukup mengimpor satu tempat untuk
   memperoleh seluruh bentuk data CV. */
import type { PaperSize } from "./paper";
export type { PaperSize };

/* Bentuk data portofolio berbasis pola tinggal di lib/portfolio, karena
   registry pola dan kamus bidang tidak boleh bergantung pada bentuk CV -
   arah ketergantungannya satu arah saja. Yang dipakai di sini diteruskan
   kembali supaya berkas lain cukup mengimpor satu tempat. */
import type {
  BagianPortofolio,
  DetailTambahan,
  IntiValue,
  KategoriKredensial,
  PolaSlug,
  ProfilPortofolio,
  TautanPortofolio,
  Verifikator,
} from "@/lib/portfolio/types";
import type { MasaBerlakuJenis } from "@/lib/portfolio/ambang-profesi";
export type {
  BagianPortofolio,
  DetailTambahan,
  IntiValue,
  KategoriKredensial,
  MasaBerlakuJenis,
  PolaSlug,
  ProfilPortofolio,
  TautanPortofolio,
  Verifikator,
};

export type EmploymentType =
  | "FULL_TIME"
  | "PART_TIME"
  | "CONTRACT"
  | "INTERNSHIP"
  | "FREELANCE"
  | "VOLUNTEER";

export type LanguageProficiency =
  | "NATIVE"
  | "FLUENT"
  | "ADVANCED"
  | "INTERMEDIATE"
  | "BASIC";

/** Kunci section yang boleh muncul di `sectionOrder`. */
export type SectionKey =
  | "summary"
  | "experience"
  | "education"
  | "skill"
  | "project"
  | "certification"
  | "organization"
  | "award"
  | "language"
  | "publication"
  | "custom";

export interface PersonalInfoData {
  fullName: string;
  headline: string;
  email: string;
  phone: string;
  city: string;
  province: string;
  country: string;
  linkedinUrl: string;
  portfolioUrl: string;
  githubUrl: string;
  photoUrl: string;
  showPhoto: boolean;
  /**
   * Perbesaran pas foto di dalam bingkainya, 1 sampai 3.
   *
   * Yang disimpan **parameternya**, bukan gambar hasil potongan. Bedanya
   * terasa saat pengguna mengubah pilihannya lagi: memotong gambar lalu
   * menyimpan hasilnya berarti setiap penyuntingan berikutnya bekerja di atas
   * gambar yang sudah kehilangan piksel, dan mutunya turun bertingkat tanpa
   * pernah bisa dikembalikan. Dengan parameter, gambar sumbernya tetap utuh
   * selamanya dan potongannya dihitung ulang setiap kali.
   */
  photoZoom: number;
  /** Geseran mendatar pas foto, -100 sampai 100 persen. */
  photoOffsetX: number;
  /** Geseran tegak pas foto, -100 sampai 100 persen. */
  photoOffsetY: number;
  /**
   * Lebar pas foto dalam milimeter, bila pengguna menyetelnya sendiri.
   *
   * null berarti mengikuti bawaan template - pola yang sama dengan margin
   * halaman, dan karena alasan yang sama: menyalin angka template ke kolomnya
   * akan mengunci CV pada ukuran template lama tanpa pengguna pernah
   * memintanya, dan foto tidak akan ikut menyesuaikan saat templatenya
   * diganti.
   *
   * Tingginya tidak disimpan. Ia dihitung dari perbandingan milik template -
   * 3:4 pada template berfoto formal, 1:1 pada yang berfoto bulat - sehingga
   * pas foto tidak pernah dapat menjadi lonjong.
   */
  photoWidthMm: number | null;
  summary: string;
}

export interface ExperienceItem {
  id: string;
  jobTitle: string;
  company: string;
  employmentType: EmploymentType | null;
  city: string;
  country: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  bullets: string[];
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  city: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  gpa: string;
  maxGpa: string;
  bullets: string[];
}

export interface SkillItem {
  id: string;
  name: string;
  category: string;
}

/**
 * Satu item portofolio.
 *
 * Namanya masih `ProjectItem` karena memang bagian inilah yang diperluas -
 * bukan bagian baru di sebelahnya. Bagian `project` sudah ada sejak versi
 * pertama aplikasi ini dan bentuknya nyaris sama dengan "field umum"
 * portofolio, jadi menambah bagian kedua hanya akan membingungkan pengguna dan
 * memecah data yang seharusnya satu.
 *
 * Enam field pertama adalah bentuk lamanya dan tidak berubah artinya:
 *
 *   name       -> judul karya
 *   role       -> peran spesifik saya, bukan peran tim
 *   url        -> tautan utama (kini pintu masuk ke daftar `tautan`)
 *   startDate  -> mulai
 *   endDate    -> selesai
 *   bullets    -> poin
 *
 * Sisanya tambahan, dan bentuknya sengaja meniru entri pengalaman kerja -
 * lengkap dengan `konteks` dan rentang tanggal. Sebagian pengurai hanya
 * mengenali proyek bila ia menempel pada pengalaman kerja, dan bentuk yang
 * seragam itulah yang membuat penggabungan (lihat `parentPengalamanId`)
 * mungkin dilakukan tanpa mengarang ulang datanya.
 */
export interface ProjectItem {
  id: string;
  name: string;
  role: string;
  url: string;
  startDate: string;
  endDate: string;
  bullets: string[];

  /** Klien, institusi, kampus, "Proyek Mandiri", atau "Freelance". */
  konteks: string;
  lokasi: string;
  /** Satu kalimat, maksimal 160 karakter. */
  ringkasan: string;
  /** Maksimal dua. Teksnya untuk manusia, URL penuhnya tetap disimpan utuh. */
  tautan: TautanPortofolio[];
  kataKunci: string[];
  /** Field inti pola, dikunci nama field dari `PolaSchema.fieldInti`. */
  inti: Record<string, IntiValue>;
  /** Slot fleksibel. Maksimal enam; hanya empat teratas yang dicetak. */
  detailTambahan: DetailTambahan[];
  /**
   * Tidak pernah dicetak di CV maupun ikut ke berkas ekspor mana pun.
   * Lihat Verifikator di lib/portfolio/types.ts untuk kewajiban yang menyertainya.
   */
  verifikator: Verifikator;
  /** Tidak dicetak di CV; hanya menambah nilai kekuatan bukti. */
  refleksi: string;
  /** "" berarti item ini mengikuti pola CV-nya. */
  polaOverride: PolaSlug | "";
  /** Id entri pengalaman kerja yang menjadi induk. "" berarti berdiri sendiri. */
  parentPengalamanId: string;
  /** Isian dari pola sebelumnya, disimpan supaya dapat dipulihkan. */
  arsip: Record<string, IntiValue>;
}

/** Nama yang dipakai dokumen rancangan fitur untuk bentuk data yang sama. */
export type ItemPortofolio = ProjectItem;

/**
 * Satu kredensial.
 *
 * Empat kategori dengan perlakuan berbeda - lihat KategoriKredensial di
 * lib/portfolio/types.ts. Yang membuat bagian ini tidak sekadar "sertifikasi"
 * adalah kolom masa berlakunya: sejak UU 17/2023, STR Definitif berlaku
 * **seumur hidup**, dan formulir yang memaksa pengisian tanggal kedaluwarsa
 * menuntut ratusan ribu tenaga kesehatan mengarang tanggal yang tidak ada.
 */
export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate: string;
  credentialId: string;
  url: string;

  /** "" berarti belum dikategorikan - bentuk kredensial sebelum fitur ini. */
  kategori: KategoriKredensial | "";
  /**
   * Bentuk masa berlakunya, bukan tanggalnya.
   *
   * "" pada kredensial lama berarti mengikuti isian `expiryDate` apa adanya.
   */
  masaBerlaku: MasaBerlakuJenis | "";
  /** Jenjang untuk kredensial berjenjang, mis. "Jenjang 7 - Ahli Muda". */
  jenjang: string;
  /** Klasifikasi bidangnya, mis. "Arsitektur" pada SKK Konstruksi. */
  klasifikasi: string;
  /** Untuk sertifikasi kompetensi: vendor global, BNSP, atau bootcamp. */
  subTipe: string;
}

export interface OrganizationItem {
  id: string;
  name: string;
  role: string;
  city: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  bullets: string[];
}

export interface AwardItem {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description: string;
}

export interface LanguageItem {
  id: string;
  name: string;
  proficiency: LanguageProficiency;
}

/**
 * Satu karya terbit.
 *
 * Bagian ini juga sudah ada sejak awal, dan bentuknya memang persis pola
 * "Publikasi & Kredit" dalam wujud sederhana. Karena itu ia diperluas, bukan
 * diduplikasi: `title` menjadi tempat sitasi lengkap, `publisher` menjadi
 * venue, dan `url`/`doi` menjadi pengenal persisten. Tiga field di bawahnya
 * yang benar-benar baru.
 */
export interface PublicationItem {
  id: string;
  title: string;
  publisher: string;
  date: string;
  url: string;
  doi: string;

  /** Artikel jurnal, prosiding, paten, pertunjukan, pameran, dan seterusnya. */
  tipeLuaran: string;
  /** Penulis pertama, korespondensi, anggota, pemain, sutradara, kurator. */
  peranSaya: string;
  /** Scopus Q1-Q4, SINTA 1-6, WoS, Garuda, festival internasional, lokal. */
  indeksasiTier: string;
}

export interface CustomEntry {
  id: string;
  title: string;
  subtitle: string;
  startDate: string;
  endDate: string;
  bullets: string[];
}

export interface CustomSectionItem {
  id: string;
  title: string;
  items: CustomEntry[];
}

export interface ResumeData {
  id: string;
  /**
   * Versi bentuk data dokumen ini.
   *
   * Dokumen yang ditulis sebelum kolom ini ada bernilai 1, dan dinaikkan saat
   * dibaca - lihat lib/portfolio/migrasi.ts. Yang penting dijaga: menaikkan
   * versi tidak boleh mengubah satu pun nilai yang sudah diketik pengguna,
   * hanya menambahkan yang belum ada.
   */
  schemaVersion: number;
  title: string;
  template: TemplateId;
  accentColor: string;
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  language: ResumeLanguage;
  /** Ukuran kertas. Menentukan lebar pratinjau sekaligus aturan @page cetak. */
  pageSize: PaperSize;
  /**
   * Margin halaman dalam milimeter, bila pengguna menyetelnya sendiri.
   * null berarti mengikuti bawaan template - lihat resumeMargins().
   */
  marginYMm: number | null;
  marginXMm: number | null;
  sectionOrder: SectionKey[];
  /** Pola pembuktian, tujuan CV, dan jenjang pengalaman pemiliknya. */
  profilPortofolio: ProfilPortofolio;
  /**
   * Pengaturan bagian portofolio. Daftar itemnya sendiri ada di `projects`
   * (atau `publications` untuk pola Publikasi & Kredit) - lihat
   * BagianPortofolio di lib/portfolio/types.ts.
   */
  portofolio: BagianPortofolio;
  personalInfo: PersonalInfoData;
  experiences: ExperienceItem[];
  educations: EducationItem[];
  skills: SkillItem[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
  organizations: OrganizationItem[];
  awards: AwardItem[];
  languages: LanguageItem[];
  publications: PublicationItem[];
  customSections: CustomSectionItem[];
}

/** Ringkasan CV untuk daftar di dashboard (tanpa memuat seluruh isi). */
export interface ResumeSummary {
  id: string;
  title: string;
  template: TemplateId;
  fullName: string;
  headline: string;
  updatedAt: string;
  latestScore: number | null;
}

import { z } from "zod";
import { ALL_SECTION_KEYS } from "./sections";

/**
 * Validasi payload yang masuk ke API.
 *
 * Prinsip: server tidak pernah mempercayai bentuk data dari browser.
 * Semua field diberi nilai default sehingga payload yang tidak lengkap
 * (mis. dari berkas JSON versi lama) tetap dapat diproses tanpa error.
 */

const str = (max = 500) => z.string().max(max).default("");
const monthStr = z
  .string()
  .max(7)
  .regex(/^$|^\d{4}-\d{2}$/, "Format tanggal harus YYYY-MM")
  .default("");
const bullets = z.array(z.string().max(2000)).max(30).default([]);
const id = z.string().min(1).max(64);

export const templateIdSchema = z.enum([
  "CLASSIC",
  "MODERN",
  "COMPACT",
  "EXECUTIVE",
  "MINIMAL",
  "TIMELINE",
  "ACADEMIC",
  "GOVERNMENT",
  "PORTRAIT",
  "PROFILE",
]);
export const paperSizeSchema = z.enum(["A4", "LETTER", "LEGAL", "F4"]);
export const resumeLanguageSchema = z.enum(["ID", "EN"]);
export const employmentTypeSchema = z.enum([
  "FULL_TIME",
  "PART_TIME",
  "CONTRACT",
  "INTERNSHIP",
  "FREELANCE",
  "VOLUNTEER",
]);
export const proficiencySchema = z.enum([
  "NATIVE",
  "FLUENT",
  "ADVANCED",
  "INTERMEDIATE",
  "BASIC",
]);
export const sectionKeySchema = z.enum(
  ALL_SECTION_KEYS as [string, ...string[]],
);

export const personalInfoSchema = z.object({
  fullName: str(120),
  headline: str(160),
  email: str(160),
  phone: str(40),
  city: str(80),
  province: str(80),
  country: str(80),
  linkedinUrl: str(300),
  portfolioUrl: str(300),
  githubUrl: str(300),
  photoUrl: str(2000),
  showPhoto: z.boolean().default(false),
  summary: z.string().max(3000).default(""),
});

export const experienceSchema = z.object({
  id,
  jobTitle: str(160),
  company: str(160),
  employmentType: employmentTypeSchema.nullable().default(null),
  city: str(80),
  country: str(80),
  startDate: monthStr,
  endDate: monthStr,
  isCurrent: z.boolean().default(false),
  bullets,
});

export const educationSchema = z.object({
  id,
  institution: str(200),
  degree: str(160),
  fieldOfStudy: str(160),
  city: str(80),
  startDate: monthStr,
  endDate: monthStr,
  isCurrent: z.boolean().default(false),
  gpa: str(10),
  maxGpa: str(10),
  bullets,
});

export const skillSchema = z.object({
  id,
  name: str(120),
  category: str(80),
});

export const projectSchema = z.object({
  id,
  name: str(200),
  role: str(160),
  url: str(300),
  startDate: monthStr,
  endDate: monthStr,
  bullets,
});

export const certificationSchema = z.object({
  id,
  name: str(250),
  issuer: str(200),
  issueDate: monthStr,
  expiryDate: monthStr,
  credentialId: str(120),
  url: str(300),
});

export const organizationSchema = z.object({
  id,
  name: str(200),
  role: str(160),
  city: str(80),
  startDate: monthStr,
  endDate: monthStr,
  isCurrent: z.boolean().default(false),
  bullets,
});

export const awardSchema = z.object({
  id,
  title: str(250),
  issuer: str(200),
  date: monthStr,
  description: z.string().max(1000).default(""),
});

export const languageSchema = z.object({
  id,
  name: str(80),
  proficiency: proficiencySchema.default("INTERMEDIATE"),
});

export const publicationSchema = z.object({
  id,
  title: str(400),
  publisher: str(250),
  date: monthStr,
  url: str(300),
  doi: str(120),
});

export const customEntrySchema = z.object({
  id,
  title: str(250),
  subtitle: str(250),
  startDate: monthStr,
  endDate: monthStr,
  bullets,
});

export const customSectionSchema = z.object({
  id,
  title: str(120),
  items: z.array(customEntrySchema).max(50).default([]),
});

/** Payload lengkap sebuah CV (dipakai autosave dan impor JSON). */
export const resumeDataSchema = z.object({
  title: z.string().min(1).max(160).default("CV Saya"),
  template: templateIdSchema.default("CLASSIC"),
  accentColor: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, "Warna harus format heksadesimal #rrggbb")
    .default("#111827"),
  fontFamily: str(60),
  fontSize: z.number().int().min(8).max(14).default(10),
  lineHeight: z.number().min(1).max(2).default(1.35),
  language: resumeLanguageSchema.default("ID"),
  // Berkas JSON hasil ekspor versi lama belum memuat pageSize. Nilai bawaan
  // A4 membuatnya tetap dapat diimpor dan menghasilkan CV yang identik.
  pageSize: paperSizeSchema.default("A4"),
  // Batasnya ditegakkan di sisi server, bukan hanya oleh penggeser di
  // antarmuka: margin 0 mm menghasilkan CV yang tercetak sampai ke tepi
  // kertas dan terpotong hampir semua pencetak, sedangkan margin sangat
  // besar menyisakan ruang tulis yang tidak masuk akal.
  marginYMm: z.number().int().min(8).max(30).nullable().default(null),
  marginXMm: z.number().int().min(8).max(30).nullable().default(null),
  sectionOrder: z.array(sectionKeySchema).max(20).default([]),
  personalInfo: personalInfoSchema,
  experiences: z.array(experienceSchema).max(40).default([]),
  educations: z.array(educationSchema).max(20).default([]),
  skills: z.array(skillSchema).max(120).default([]),
  projects: z.array(projectSchema).max(40).default([]),
  certifications: z.array(certificationSchema).max(40).default([]),
  organizations: z.array(organizationSchema).max(30).default([]),
  awards: z.array(awardSchema).max(30).default([]),
  languages: z.array(languageSchema).max(15).default([]),
  publications: z.array(publicationSchema).max(40).default([]),
  customSections: z.array(customSectionSchema).max(10).default([]),
});

export type ResumeDataInput = z.infer<typeof resumeDataSchema>;

/** Berkas ekspor JSON. schemaVersion menjaga kompatibilitas berkas lama. */
export const resumeFileSchema = z.object({
  schemaVersion: z.number().int().min(1).default(1),
  exportedAt: z.string().optional(),
  app: z.string().optional(),
  resume: resumeDataSchema,
});

export const createResumeSchema = z.object({
  title: z.string().min(1).max(160).optional(),
  /** "blank" = CV kosong, "sample" = langsung terisi contoh lengkap. */
  preset: z.enum(["blank", "sample"]).default("blank"),
});

export const renameResumeSchema = z.object({
  title: z.string().min(1).max(160),
});

export const registerSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi").max(120),
  email: z.string().email("Format email tidak valid").max(160),
  password: z
    .string()
    .min(8, "Kata sandi minimal 8 karakter")
    .max(128, "Kata sandi terlalu panjang"),
});

export const atsRequestSchema = z.object({
  jobDescription: z.string().max(20000).default(""),
  /** Simpan hasil ke riwayat AtsAnalysis (dimatikan saat pratinjau cepat). */
  persist: z.boolean().default(false),
});

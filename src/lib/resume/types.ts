/**
 * Bentuk data CV yang dipakai bersama oleh seluruh bagian aplikasi:
 * form editor, preview langsung, generator PDF/DOCX, mesin penilaian ATS,
 * serta berkas ekspor/impor JSON.
 *
 * Satu sumber kebenaran seperti ini penting agar apa yang diketik pengguna
 * di form persis sama dengan yang muncul di CV dan yang dinilai oleh ATS.
 */

export type TemplateId = "CLASSIC" | "MODERN" | "COMPACT";
export type ResumeLanguage = "ID" | "EN";

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

export interface ProjectItem {
  id: string;
  name: string;
  role: string;
  url: string;
  startDate: string;
  endDate: string;
  bullets: string[];
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate: string;
  credentialId: string;
  url: string;
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

export interface PublicationItem {
  id: string;
  title: string;
  publisher: string;
  date: string;
  url: string;
  doi: string;
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
  title: string;
  template: TemplateId;
  accentColor: string;
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  language: ResumeLanguage;
  sectionOrder: SectionKey[];
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

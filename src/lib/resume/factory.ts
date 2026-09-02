import { newId } from "@/lib/utils";
import { DEFAULT_SECTION_ORDER } from "./sections";
import type {
  AwardItem,
  CertificationItem,
  CustomEntry,
  CustomSectionItem,
  EducationItem,
  ExperienceItem,
  LanguageItem,
  PersonalInfoData,
  ProjectItem,
  PublicationItem,
  ResumeData,
  SkillItem,
} from "./types";

/**
 * Pembuat entri kosong. Semua field diisi string kosong (bukan undefined)
 * supaya input di form selalu terkendali (controlled) dan React tidak
 * memunculkan peringatan uncontrolled-to-controlled.
 */

export function emptyPersonalInfo(): PersonalInfoData {
  return {
    fullName: "",
    headline: "",
    email: "",
    phone: "",
    city: "",
    province: "",
    country: "Indonesia",
    linkedinUrl: "",
    portfolioUrl: "",
    githubUrl: "",
    photoUrl: "",
    showPhoto: false,
    summary: "",
  };
}

export function emptyExperience(): ExperienceItem {
  return {
    id: newId(),
    jobTitle: "",
    company: "",
    employmentType: "FULL_TIME",
    city: "",
    country: "",
    startDate: "",
    endDate: "",
    isCurrent: false,
    bullets: [""],
  };
}

export function emptyEducation(): EducationItem {
  return {
    id: newId(),
    institution: "",
    degree: "",
    fieldOfStudy: "",
    city: "",
    startDate: "",
    endDate: "",
    isCurrent: false,
    gpa: "",
    maxGpa: "4.00",
    bullets: [],
  };
}

export function emptySkill(category = "Umum"): SkillItem {
  return { id: newId(), name: "", category };
}

export function emptyProject(): ProjectItem {
  return {
    id: newId(),
    name: "",
    role: "",
    url: "",
    startDate: "",
    endDate: "",
    bullets: [""],
  };
}

export function emptyCertification(): CertificationItem {
  return {
    id: newId(),
    name: "",
    issuer: "",
    issueDate: "",
    expiryDate: "",
    credentialId: "",
    url: "",
  };
}

export function emptyOrganization() {
  return {
    id: newId(),
    name: "",
    role: "",
    city: "",
    startDate: "",
    endDate: "",
    isCurrent: false,
    bullets: [""],
  };
}

export function emptyAward(): AwardItem {
  return { id: newId(), title: "", issuer: "", date: "", description: "" };
}

export function emptyLanguage(): LanguageItem {
  return { id: newId(), name: "", proficiency: "INTERMEDIATE" };
}

export function emptyPublication(): PublicationItem {
  return { id: newId(), title: "", publisher: "", date: "", url: "", doi: "" };
}

export function emptyCustomEntry(): CustomEntry {
  return {
    id: newId(),
    title: "",
    subtitle: "",
    startDate: "",
    endDate: "",
    bullets: [""],
  };
}

export function emptyCustomSection(): CustomSectionItem {
  return { id: newId(), title: "", items: [emptyCustomEntry()] };
}

/** CV kosong baru. Dipakai saat pengguna menekan "Buat CV Baru". */
export function emptyResume(id = ""): ResumeData {
  return {
    id,
    title: "CV Saya",
    template: "CLASSIC",
    accentColor: "#111827",
    fontFamily: "Arial",
    fontSize: 10,
    lineHeight: 1.35,
    language: "ID",
    pageSize: "A4",
    sectionOrder: [...DEFAULT_SECTION_ORDER],
    personalInfo: emptyPersonalInfo(),
    experiences: [],
    educations: [],
    skills: [],
    projects: [],
    certifications: [],
    organizations: [],
    awards: [],
    languages: [],
    publications: [],
    customSections: [],
  };
}

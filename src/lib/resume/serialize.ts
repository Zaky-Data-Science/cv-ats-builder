import { newId } from "@/lib/utils";
import { emptyPersonalInfo } from "./factory";
import { normalizeSectionOrder } from "./sections";
import type { ResumeDataInput } from "./schema";
import type { CustomEntry, ResumeData } from "./types";

/**
 * Jembatan antara baris database (Prisma) dan bentuk ResumeData yang dipakai
 * UI. Semua konversi dipusatkan di sini agar editor, preview, DOCX, dan
 * penilaian ATS selalu melihat bentuk data yang persis sama.
 */

/** Relasi yang harus ikut dimuat saat mengambil satu CV utuh. */
export const resumeInclude = {
  personalInfo: true,
  experiences: { orderBy: { order: "asc" } },
  educations: { orderBy: { order: "asc" } },
  skills: { orderBy: { order: "asc" } },
  projects: { orderBy: { order: "asc" } },
  certifications: { orderBy: { order: "asc" } },
  organizations: { orderBy: { order: "asc" } },
  awards: { orderBy: { order: "asc" } },
  languages: { orderBy: { order: "asc" } },
  publications: { orderBy: { order: "asc" } },
  customSections: { orderBy: { order: "asc" } },
} as const;

/* eslint-disable @typescript-eslint/no-explicit-any */

/** Baris database -> ResumeData. */
export function toResumeData(row: any): ResumeData {
  const info = row.personalInfo;
  return {
    id: row.id,
    title: row.title,
    template: row.template,
    accentColor: row.accentColor,
    fontFamily: row.fontFamily,
    fontSize: row.fontSize,
    lineHeight: row.lineHeight,
    language: row.language,
    pageSize: row.pageSize,
    sectionOrder: normalizeSectionOrder(row.sectionOrder),
    personalInfo: info
      ? {
          fullName: info.fullName,
          headline: info.headline,
          email: info.email,
          phone: info.phone,
          city: info.city,
          province: info.province,
          country: info.country,
          linkedinUrl: info.linkedinUrl,
          portfolioUrl: info.portfolioUrl,
          githubUrl: info.githubUrl,
          photoUrl: info.photoUrl,
          showPhoto: info.showPhoto,
          summary: info.summary,
        }
      : emptyPersonalInfo(),
    experiences: (row.experiences ?? []).map((e: any) => ({
      id: e.id,
      jobTitle: e.jobTitle,
      company: e.company,
      employmentType: e.employmentType,
      city: e.city,
      country: e.country,
      startDate: e.startDate,
      endDate: e.endDate,
      isCurrent: e.isCurrent,
      bullets: e.bullets,
    })),
    educations: (row.educations ?? []).map((e: any) => ({
      id: e.id,
      institution: e.institution,
      degree: e.degree,
      fieldOfStudy: e.fieldOfStudy,
      city: e.city,
      startDate: e.startDate,
      endDate: e.endDate,
      isCurrent: e.isCurrent,
      gpa: e.gpa,
      maxGpa: e.maxGpa,
      bullets: e.bullets,
    })),
    skills: (row.skills ?? []).map((s: any) => ({
      id: s.id,
      name: s.name,
      category: s.category,
    })),
    projects: (row.projects ?? []).map((p: any) => ({
      id: p.id,
      name: p.name,
      role: p.role,
      url: p.url,
      startDate: p.startDate,
      endDate: p.endDate,
      bullets: p.bullets,
    })),
    certifications: (row.certifications ?? []).map((c: any) => ({
      id: c.id,
      name: c.name,
      issuer: c.issuer,
      issueDate: c.issueDate,
      expiryDate: c.expiryDate,
      credentialId: c.credentialId,
      url: c.url,
    })),
    organizations: (row.organizations ?? []).map((o: any) => ({
      id: o.id,
      name: o.name,
      role: o.role,
      city: o.city,
      startDate: o.startDate,
      endDate: o.endDate,
      isCurrent: o.isCurrent,
      bullets: o.bullets,
    })),
    awards: (row.awards ?? []).map((a: any) => ({
      id: a.id,
      title: a.title,
      issuer: a.issuer,
      date: a.date,
      description: a.description,
    })),
    languages: (row.languages ?? []).map((l: any) => ({
      id: l.id,
      name: l.name,
      proficiency: l.proficiency,
    })),
    publications: (row.publications ?? []).map((p: any) => ({
      id: p.id,
      title: p.title,
      publisher: p.publisher,
      date: p.date,
      url: p.url,
      doi: p.doi,
    })),
    customSections: (row.customSections ?? []).map((c: any) => ({
      id: c.id,
      title: c.title,
      items: Array.isArray(c.items) ? (c.items as CustomEntry[]) : [],
    })),
  };
}

/**
 * ResumeData -> daftar operasi tulis Prisma.
 *
 * Strategi: hapus seluruh baris anak lalu buat ulang dengan id yang dikirim
 * klien. Primary key tetap stabil karena id dibuat di sisi klien
 * (lihat `newId()`), sementara jumlah query tetap kecil - hanya dua per tabel,
 * berapa pun jumlah entri. Untuk dokumen sekecil CV ini jauh lebih sederhana
 * dan lebih aman daripada mendiff baris satu per satu.
 */
export function buildChildWrites(resumeId: string, data: ResumeDataInput) {
  return {
    experiences: data.experiences.map((e, order) => ({
      ...e,
      resumeId,
      order,
    })),
    educations: data.educations.map((e, order) => ({ ...e, resumeId, order })),
    skills: data.skills.map((s, order) => ({ ...s, resumeId, order })),
    projects: data.projects.map((p, order) => ({ ...p, resumeId, order })),
    certifications: data.certifications.map((c, order) => ({
      ...c,
      resumeId,
      order,
    })),
    organizations: data.organizations.map((o, order) => ({
      ...o,
      resumeId,
      order,
    })),
    awards: data.awards.map((a, order) => ({ ...a, resumeId, order })),
    languages: data.languages.map((l, order) => ({ ...l, resumeId, order })),
    publications: data.publications.map((p, order) => ({
      ...p,
      resumeId,
      order,
    })),
    customSections: data.customSections.map((c, order) => ({
      id: c.id,
      title: c.title,
      items: c.items,
      resumeId,
      order,
    })),
  };
}

/**
 * Memberi id baru pada seluruh entri.
 *
 * Wajib dipakai saat menduplikasi CV atau mengimpor berkas JSON, karena id
 * entri adalah kunci primer global - memakai ulang id lama akan bentrok
 * dengan CV asalnya.
 */
export function regenerateIds(data: ResumeData): ResumeData {
  const remap = <T extends { id: string }>(items: T[]): T[] =>
    items.map((item) => ({ ...item, id: newId() }));

  return {
    ...data,
    id: "",
    experiences: remap(data.experiences),
    educations: remap(data.educations),
    skills: remap(data.skills),
    projects: remap(data.projects),
    certifications: remap(data.certifications),
    organizations: remap(data.organizations),
    awards: remap(data.awards),
    languages: remap(data.languages),
    publications: remap(data.publications),
    customSections: data.customSections.map((section) => ({
      ...section,
      id: newId(),
      items: remap(section.items),
    })),
  };
}

/** Berkas ekspor JSON, lengkap dengan metadata versi skema. */
export function toExportFile(data: ResumeData) {
  const { id: _ignored, ...rest } = data;
  void _ignored;
  return {
    schemaVersion: 1,
    app: "ATS-Friendly CV Builder",
    exportedAt: new Date().toISOString(),
    resume: rest,
  };
}

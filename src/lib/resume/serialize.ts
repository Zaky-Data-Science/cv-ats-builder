import { newId } from "@/lib/utils";
import {
  bagianPortofolioBawaan,
  profilPortofolioBawaan,
  verifikatorKosong,
  VERSI_SKEMA_CV,
} from "@/lib/portfolio/migrasi";
import { emptyPersonalInfo } from "./factory";
import { normalizeSectionOrder } from "./sections";
import { bagianPortofolioSchema, profilPortofolioSchema } from "./schema";
import type { ResumeDataInput } from "./schema";
import type {
  BagianPortofolio,
  CustomEntry,
  DetailTambahan,
  IntiValue,
  PolaSlug,
  ProfilPortofolio,
  ResumeData,
  TautanPortofolio,
  Verifikator,
} from "./types";

/**
 * Pembaca kolom JSON.
 *
 * Kolom bertipe Json dapat berisi apa saja - termasuk isi yang ditulis versi
 * aplikasi sebelumnya, atau NULL pada baris yang sudah ada sebelum kolomnya
 * ditambahkan. Karena itu tiap pembacaan diberi bentuk bawaan, bukan
 * dipercaya begitu saja.
 */
function daftar<T>(nilai: unknown): T[] {
  return Array.isArray(nilai) ? (nilai as T[]) : [];
}

function petaInti(nilai: unknown): Record<string, IntiValue> {
  return nilai !== null && typeof nilai === "object" && !Array.isArray(nilai)
    ? (nilai as Record<string, IntiValue>)
    : {};
}

function bacaVerifikator(nilai: unknown): Verifikator {
  if (nilai === null || typeof nilai !== "object" || Array.isArray(nilai)) {
    return verifikatorKosong();
  }
  const v = nilai as Partial<Verifikator>;
  return {
    nama: v.nama ?? "",
    jabatan: v.jabatan ?? "",
    hubungan: v.hubungan ?? "",
  };
}

/**
 * Membaca profil dan pengaturan portofolio dari kolom JSON.
 *
 * Dipulangkan lewat skemanya sendiri supaya baris yang ditulis versi lama -
 * atau yang isinya sudah tidak dikenal lagi - jatuh ke nilai bawaan alih-alih
 * menggagalkan pemuatan seluruh CV.
 */
function bacaProfil(nilai: unknown): ProfilPortofolio {
  const hasil = profilPortofolioSchema.safeParse(nilai ?? {});
  return hasil.success
    ? (hasil.data as ProfilPortofolio)
    : profilPortofolioBawaan();
}

function bacaBagian(nilai: unknown): BagianPortofolio {
  const hasil = bagianPortofolioSchema.safeParse(nilai ?? {});
  return hasil.success
    ? (hasil.data as BagianPortofolio)
    : bagianPortofolioBawaan();
}

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
    marginYMm: row.marginYMm,
    marginXMm: row.marginXMm,
    sectionOrder: normalizeSectionOrder(row.sectionOrder),
    schemaVersion: row.schemaVersion ?? 1,
    profilPortofolio: bacaProfil(row.profilPortofolio),
    portofolio: bacaBagian(row.portofolio),
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
          // Nilai bawaan dipakai untuk baris yang ditulis sebelum kolomnya
          // ada. Basis data memang memberinya default, tetapi CV yang datang
          // dari berkas cadangan lama tidak lewat basis data sama sekali.
          photoZoom: info.photoZoom ?? 1,
          photoOffsetX: info.photoOffsetX ?? 0,
          photoOffsetY: info.photoOffsetY ?? 0,
          photoWidthMm: info.photoWidthMm ?? null,
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
      konteks: p.konteks ?? "",
      lokasi: p.lokasi ?? "",
      ringkasan: p.ringkasan ?? "",
      tautan: daftar<TautanPortofolio>(p.tautan),
      kataKunci: p.kataKunci ?? [],
      inti: petaInti(p.inti),
      detailTambahan: daftar<DetailTambahan>(p.detailTambahan),
      verifikator: bacaVerifikator(p.verifikator),
      refleksi: p.refleksi ?? "",
      polaOverride: (p.polaOverride ?? "") as PolaSlug | "",
      parentPengalamanId: p.parentPengalamanId ?? "",
      arsip: petaInti(p.arsip),
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
      tipeLuaran: p.tipeLuaran ?? "",
      peranSaya: p.peranSaya ?? "",
      indeksasiTier: p.indeksasiTier ?? "",
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

  /*
    Pengalaman kerja diberi id baru lebih dulu, dan pemetaannya disimpan.

    Item portofolio boleh menempel pada satu entri pengalaman kerja lewat
    `parentPengalamanId`. Kalau id induknya diganti tanpa penunjuknya ikut
    diperbarui, item itu berubah jadi yatim: sakelar "gabung ke pengalaman
    kerja" masih menyala, tetapi tidak ada entri yang cocok - dan hasilnya CV
    yang kehilangan sebagian isinya tepat setelah diduplikasi atau diimpor.
  */
  const experiences = data.experiences.map((item) => ({
    ...item,
    id: newId(),
  }));
  const idBaru = new Map<string, string>();
  data.experiences.forEach((lama, index) => {
    idBaru.set(lama.id, experiences[index].id);
  });

  return {
    ...data,
    id: "",
    experiences,
    educations: remap(data.educations),
    skills: remap(data.skills),
    projects: data.projects.map((item) => ({
      ...item,
      id: newId(),
      parentPengalamanId: item.parentPengalamanId
        ? (idBaru.get(item.parentPengalamanId) ?? "")
        : "",
    })),
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

/**
 * Berkas ekspor JSON, lengkap dengan metadata versi skema.
 *
 * Data `verifikator` sengaja tidak ikut. Isinya nama, jabatan, dan hubungan
 * seorang **pihak ketiga** yang tidak pernah menyetujui datanya berpindah ke
 * mana-mana; berkas ekspor adalah berkas yang dikirim, disalin, dan diunggah
 * pengguna ke tempat-tempat yang tidak dapat kita ketahui. Menyimpannya di
 * basis data pengguna sendiri adalah satu hal, ikut mengirimkannya adalah hal
 * lain.
 *
 * Akibatnya memang ada dan disengaja: mengimpor kembali berkas ini tidak
 * memulihkan isian verifikator. Itu harga yang lebih murah daripada
 * menyebarkan data pribadi orang lain tanpa sepengetahuannya.
 */
export function toExportFile(data: ResumeData) {
  const { id: _ignored, ...rest } = data;
  void _ignored;
  return {
    schemaVersion: VERSI_SKEMA_CV,
    app: "ATS-Friendly CV Builder",
    exportedAt: new Date().toISOString(),
    resume: {
      ...rest,
      schemaVersion: VERSI_SKEMA_CV,
      projects: rest.projects.map((item) => ({
        ...item,
        verifikator: verifikatorKosong(),
      })),
    },
  };
}

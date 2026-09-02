import { prisma } from "@/lib/db";
import type { ResumeDataInput } from "./schema";
import { buildChildWrites, resumeInclude, toResumeData } from "./serialize";
import { normalizeSectionOrder } from "./sections";
import type { ResumeData } from "./types";

/**
 * Operasi baca-tulis dokumen CV.
 *
 * Menyimpan CV berarti menulis ke sebelas tabel sekaligus. Seluruhnya
 * dibungkus dalam satu transaksi agar tidak pernah ada keadaan setengah
 * tersimpan - misalnya pengalaman kerja lama sudah terhapus sementara yang
 * baru gagal ditulis.
 */

const CHILD_TABLES = [
  "experience",
  "education",
  "skill",
  "project",
  "certification",
  "organization",
  "award",
  "languageSkill",
  "publication",
  "customSection",
] as const;

/* eslint-disable @typescript-eslint/no-explicit-any */

/** Mengambil satu CV lengkap milik pengguna tertentu. */
export async function getResume(
  resumeId: string,
  userId: string,
): Promise<ResumeData | null> {
  const row = await prisma.resume.findFirst({
    where: { id: resumeId, userId },
    include: resumeInclude,
  });
  return row ? toResumeData(row) : null;
}

/** Membuat CV baru beserta seluruh isinya. */
export async function createResume(
  userId: string,
  data: ResumeDataInput,
): Promise<ResumeData> {
  const created = await prisma.resume.create({
    data: {
      userId,
      title: data.title,
      template: data.template,
      accentColor: data.accentColor,
      fontFamily: data.fontFamily || "Arial",
      fontSize: data.fontSize,
      lineHeight: data.lineHeight,
      language: data.language,
      sectionOrder: normalizeSectionOrder(data.sectionOrder),
      personalInfo: { create: { ...data.personalInfo } },
    },
    select: { id: true },
  });

  await writeChildren(created.id, data);

  const row = await prisma.resume.findUniqueOrThrow({
    where: { id: created.id },
    include: resumeInclude,
  });
  return toResumeData(row);
}

/**
 * Menyimpan perubahan CV (dipanggil oleh autosave editor).
 *
 * Baris anak ditulis ulang seluruhnya, bukan didiff satu per satu. Karena id
 * setiap entri dibuat di sisi klien dan ikut dikirim, kunci primer tetap
 * stabil antar-penyimpanan sementara jumlah query tetap dua per tabel.
 */
export async function saveResume(
  resumeId: string,
  data: ResumeDataInput,
): Promise<Date> {
  const children = buildChildWrites(resumeId, data);

  await prisma.$transaction(async (tx: any) => {
    await tx.resume.update({
      where: { id: resumeId },
      data: {
        title: data.title,
        template: data.template,
        accentColor: data.accentColor,
        fontFamily: data.fontFamily || "Arial",
        fontSize: data.fontSize,
        lineHeight: data.lineHeight,
        language: data.language,
        sectionOrder: normalizeSectionOrder(data.sectionOrder),
      },
    });

    await tx.personalInfo.upsert({
      where: { resumeId },
      update: { ...data.personalInfo },
      create: { resumeId, ...data.personalInfo },
    });

    for (const table of CHILD_TABLES) {
      await (tx as any)[table].deleteMany({ where: { resumeId } });
    }

    await createChildren(tx, children);
  });

  const updated = await prisma.resume.findUniqueOrThrow({
    where: { id: resumeId },
    select: { updatedAt: true },
  });
  return updated.updatedAt;
}

async function writeChildren(resumeId: string, data: ResumeDataInput) {
  const children = buildChildWrites(resumeId, data);
  await prisma.$transaction(async (tx: any) => {
    await createChildren(tx, children);
  });
}

async function createChildren(
  tx: any,
  children: ReturnType<typeof buildChildWrites>,
) {
  const jobs: Promise<unknown>[] = [];
  const add = (model: string, rows: unknown[]) => {
    if (rows.length > 0) jobs.push(tx[model].createMany({ data: rows }));
  };

  add("experience", children.experiences);
  add("education", children.educations);
  add("skill", children.skills);
  add("project", children.projects);
  add("certification", children.certifications);
  add("organization", children.organizations);
  add("award", children.awards);
  add("languageSkill", children.languages);
  add("publication", children.publications);
  add("customSection", children.customSections);

  await Promise.all(jobs);
}

/** Menghapus seluruh CV. Baris anak ikut terhapus lewat ON DELETE CASCADE. */
export async function deleteResume(resumeId: string) {
  await prisma.resume.delete({ where: { id: resumeId } });
}

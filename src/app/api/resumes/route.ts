import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { errorResponse, requireUser } from "@/lib/guard";
import { emptyResume } from "@/lib/resume/factory";
import { createResume } from "@/lib/resume/persist";
import { getLocale } from "@/lib/i18n/server";
import { sampleResume } from "@/lib/resume/sample";
import { createResumeSchema, resumeDataSchema } from "@/lib/resume/schema";
import type { ResumeSummary } from "@/lib/resume/types";

/** Daftar CV milik pengguna yang sedang masuk. */
export async function GET() {
  try {
    const user = await requireUser();

    const rows = await prisma.resume.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        title: true,
        template: true,
        updatedAt: true,
        personalInfo: { select: { fullName: true, headline: true } },
        // Hanya skor terakhir yang dibutuhkan kartu dashboard.
        atsAnalyses: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: { score: true },
        },
      },
    });

    const resumes: ResumeSummary[] = rows.map((row) => ({
      id: row.id,
      title: row.title,
      template: row.template,
      fullName: row.personalInfo?.fullName ?? "",
      headline: row.personalInfo?.headline ?? "",
      updatedAt: row.updatedAt.toISOString(),
      latestScore: row.atsAnalyses[0]?.score ?? null,
    }));

    return NextResponse.json({ resumes });
  } catch (error) {
    return errorResponse(error);
  }
}

/**
 * Membuat CV baru.
 *
 * preset "sample" mengisi CV dengan contoh lengkap, sehingga pengguna baru
 * langsung melihat bentuk CV jadi dan tahu setiap field akan muncul di mana.
 */
export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const body = await request.json().catch(() => ({}));
    const { title, preset } = createResumeSchema.parse(body);

    const base =
      preset === "sample" ? sampleResume("", await getLocale()) : emptyResume();
    if (title) base.title = title;

    const parsed = resumeDataSchema.parse(base);
    const resume = await createResume(user.id, parsed);

    return NextResponse.json({ resume }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}

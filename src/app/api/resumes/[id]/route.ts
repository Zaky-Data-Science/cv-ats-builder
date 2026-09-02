import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { errorResponse, HttpError, requireOwnedResume } from "@/lib/guard";
import { deleteResume, getResume, saveResume } from "@/lib/resume/persist";
import { renameResumeSchema, resumeDataSchema } from "@/lib/resume/schema";

type Params = { params: Promise<{ id: string }> };

/** Mengambil satu CV utuh untuk dibuka di editor. */
export async function GET(_request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const { user } = await requireOwnedResume(id);

    const resume = await getResume(id, user.id);
    if (!resume) throw new HttpError(404, "CV tidak ditemukan.");

    return NextResponse.json({ resume });
  } catch (error) {
    return errorResponse(error);
  }
}

/**
 * Menyimpan perubahan CV.
 *
 * Dipanggil oleh autosave editor. Menerima dua bentuk payload:
 *  - { resume: {...} } untuk menyimpan seluruh isi CV.
 *  - { title: "..." } untuk sekadar mengganti nama dari dashboard.
 */
export async function PATCH(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    await requireOwnedResume(id);

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      throw new HttpError(400, "Body permintaan tidak valid.");
    }

    if ("resume" in body) {
      const data = resumeDataSchema.parse(body.resume);
      const updatedAt = await saveResume(id, data);
      return NextResponse.json({ savedAt: updatedAt.toISOString() });
    }

    const { title } = renameResumeSchema.parse(body);
    const updatedAt = await saveTitleOnly(id, title);
    return NextResponse.json({ savedAt: updatedAt });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    const { id } = await params;
    await requireOwnedResume(id);
    await deleteResume(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}

async function saveTitleOnly(resumeId: string, title: string) {
  const row = await prisma.resume.update({
    where: { id: resumeId },
    data: { title },
    select: { updatedAt: true },
  });
  return row.updatedAt.toISOString();
}

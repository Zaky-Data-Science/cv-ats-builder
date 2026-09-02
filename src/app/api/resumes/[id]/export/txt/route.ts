import { NextResponse } from "next/server";
import { downloadName } from "@/lib/filename";
import { errorResponse, HttpError, requireOwnedResume } from "@/lib/guard";
import { getResume } from "@/lib/resume/persist";
import { resumeToPlainText } from "@/lib/resume/plaintext";

type Params = { params: Promise<{ id: string }> };

/**
 * Mengunduh CV sebagai teks polos.
 *
 * Dua kegunaannya: bahan tempel untuk formulir lamaran daring yang hanya
 * menerima teks, sekaligus gambaran kasar hasil ekstraksi yang dilihat
 * mesin perekrut dari CV Anda.
 */
export async function GET(_request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const { user } = await requireOwnedResume(id);

    const resume = await getResume(id, user.id);
    if (!resume) throw new HttpError(404, "CV tidak ditemukan.");

    const filename = downloadName(
      resume.personalInfo.fullName,
      resume.title,
      "txt",
    );

    return new NextResponse(resumeToPlainText(resume), {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    return errorResponse(error);
  }
}

import { NextResponse } from "next/server";
import { buildDocx } from "@/lib/docx/build";
import { downloadName } from "@/lib/filename";
import { errorResponse, HttpError, requireOwnedResume } from "@/lib/guard";
import { getResume } from "@/lib/resume/persist";

type Params = { params: Promise<{ id: string }> };

/**
 * Mengunduh CV sebagai berkas Word.
 *
 * Dibangun di sisi server agar tidak ada pustaka pembuat dokumen yang perlu
 * diunduh browser, sekaligus memastikan berkas yang diterima setiap pengguna
 * identik apa pun peramban yang dipakainya.
 */
export async function GET(_request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const { user } = await requireOwnedResume(id);

    const resume = await getResume(id, user.id);
    if (!resume) throw new HttpError(404, "CV tidak ditemukan.");

    const buffer = await buildDocx(resume);
    const filename = downloadName(
      resume.personalInfo.fullName,
      resume.title,
      "docx",
    );

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": String(buffer.length),
      },
    });
  } catch (error) {
    return errorResponse(error);
  }
}

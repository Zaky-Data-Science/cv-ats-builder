import { NextResponse } from "next/server";
import { errorResponse, HttpError, requireOwnedResume } from "@/lib/guard";
import { getResume } from "@/lib/resume/persist";
import { toExportFile } from "@/lib/resume/serialize";
import { slugify } from "@/lib/filename";

type Params = { params: Promise<{ id: string }> };

/**
 * Mengunduh seluruh isi CV sebagai berkas JSON.
 *
 * Berkas ini adalah bentuk portabel dari data pengguna: dapat disimpan
 * sebagai cadangan, dipindahkan ke pemasangan lain, atau diimpor kembali
 * bila CV terlanjur terhapus. Kolom schemaVersion menjaga agar berkas lama
 * tetap dapat dibaca versi aplikasi berikutnya.
 */
export async function GET(_request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const { user } = await requireOwnedResume(id);

    const resume = await getResume(id, user.id);
    if (!resume) throw new HttpError(404, "CV tidak ditemukan.");

    const filename = `${slugify(resume.title || "cv")}.json`;

    return new NextResponse(JSON.stringify(toExportFile(resume), null, 2), {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    return errorResponse(error);
  }
}

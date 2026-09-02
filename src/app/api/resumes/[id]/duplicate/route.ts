import { NextResponse } from "next/server";
import { errorResponse, HttpError, requireOwnedResume } from "@/lib/guard";
import { createResume, getResume } from "@/lib/resume/persist";
import { resumeDataSchema } from "@/lib/resume/schema";
import { regenerateIds } from "@/lib/resume/serialize";

type Params = { params: Promise<{ id: string }> };

/**
 * Menduplikasi CV menjadi versi baru.
 *
 * Inilah cara pengguna membuat CV yang disesuaikan per lowongan tanpa
 * mengetik ulang dari nol: duplikat, lalu ubah ringkasan dan urutan
 * keahliannya agar cocok dengan lowongan yang dituju.
 */
export async function POST(_request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const { user } = await requireOwnedResume(id);

    const source = await getResume(id, user.id);
    if (!source) throw new HttpError(404, "CV tidak ditemukan.");

    const copy = regenerateIds(source);
    copy.title = `${source.title} (Salinan)`.slice(0, 160);

    const resume = await createResume(user.id, resumeDataSchema.parse(copy));
    return NextResponse.json({ resume }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}

import { NextResponse } from "next/server";
import { analyzeResume } from "@/lib/ats/engine";
import { prisma } from "@/lib/db";
import { errorResponse, HttpError, requireOwnedResume } from "@/lib/guard";
import { getLocale } from "@/lib/i18n/server";
import { getResume } from "@/lib/resume/persist";
import { atsRequestSchema } from "@/lib/resume/schema";

type Params = { params: Promise<{ id: string }> };

/**
 * Menghitung skor ATS sebuah CV.
 *
 * Hasil disimpan ke tabel ats_analyses hanya bila diminta secara eksplisit
 * (persist = true). Pemanggilan cepat dari editor tidak menyimpan apa-apa,
 * sehingga riwayat skor tetap bersih dan bermakna sebagai data pengamatan:
 * satu baris mewakili satu kali pengguna sengaja mengevaluasi CV-nya.
 */
export async function POST(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const { user } = await requireOwnedResume(id);

    const body = await request.json().catch(() => ({}));
    const { jobDescription, persist } = atsRequestSchema.parse(body);

    const resume = await getResume(id, user.id);
    if (!resume) throw new HttpError(404, "CV tidak ditemukan.");

    // Saran yang disimpan ke riwayat ikut bahasa antarmuka saat penilaian
    // dilakukan. Skornya sendiri tidak terpengaruh - hanya kalimat sarannya.
    const result = analyzeResume(
      resume,
      jobDescription,
      undefined,
      await getLocale(),
    );

    if (persist) {
      await prisma.atsAnalysis.create({
        data: {
          resumeId: id,
          score: result.score,
          breakdown: JSON.parse(JSON.stringify(result.dimensions)),
          suggestions: JSON.parse(JSON.stringify(result.suggestions)),
          jobDescription: jobDescription.slice(0, 20000),
        },
      });
    }

    return NextResponse.json({ result });
  } catch (error) {
    return errorResponse(error);
  }
}

/** Riwayat penilaian, dipakai grafik perkembangan skor. */
export async function GET(_request: Request, { params }: Params) {
  try {
    const { id } = await params;
    await requireOwnedResume(id);

    const rows = await prisma.atsAnalysis.findMany({
      where: { resumeId: id },
      orderBy: { createdAt: "desc" },
      take: 20,
      select: { id: true, score: true, createdAt: true },
    });

    return NextResponse.json({
      history: rows.map((r) => ({
        id: r.id,
        score: r.score,
        createdAt: r.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    return errorResponse(error);
  }
}

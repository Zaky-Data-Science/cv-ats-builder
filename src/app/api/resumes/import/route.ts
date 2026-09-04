import { NextResponse } from "next/server";
import { errorResponse, HttpError, requireUser } from "@/lib/guard";
import { migrasiDokumenCV, VERSI_SKEMA_CV } from "@/lib/portfolio/migrasi";
import { createResume } from "@/lib/resume/persist";
import { resumeDataSchema, resumeFileSchema } from "@/lib/resume/schema";
import { regenerateIds } from "@/lib/resume/serialize";
import type { ResumeData } from "@/lib/resume/types";

/** Batas ukuran berkas impor - CV terbesar sekalipun jauh di bawah angka ini. */
const MAX_BYTES = 1_000_000;

/**
 * Mengimpor CV dari berkas JSON hasil ekspor.
 *
 * Berpasangan dengan fitur ekspor JSON: pengguna dapat memindahkan datanya
 * antar-akun atau memulihkan CV yang telanjur terhapus. Seluruh id entri
 * dibuat ulang agar tidak bentrok dengan CV yang sudah ada.
 */
export async function POST(request: Request) {
  try {
    const user = await requireUser();

    const raw = await request.text();
    if (raw.length > MAX_BYTES) {
      throw new HttpError(413, "Berkas terlalu besar untuk sebuah CV.");
    }

    let parsedJson: unknown;
    try {
      parsedJson = JSON.parse(raw);
    } catch {
      throw new HttpError(
        400,
        "Berkas bukan JSON yang valid. Pastikan Anda memilih berkas hasil Ekspor JSON.",
      );
    }

    const file = resumeFileSchema.parse(parsedJson);
    if (file.schemaVersion > VERSI_SKEMA_CV) {
      throw new HttpError(
        422,
        "Berkas ini dibuat oleh versi aplikasi yang lebih baru. Perbarui aplikasi terlebih dahulu.",
      );
    }

    // Berkas versi lama dinaikkan bentuknya lebih dulu. Yang belum ada diisi
    // bawaannya, yang sudah ada tidak disentuh - termasuk field khusus dari
    // katalog bidang versi sebelumnya, yang pindah ke slot fleksibel alih-alih
    // dibuang.
    const naik = migrasiDokumenCV(file.resume);
    const withNewIds = regenerateIds({
      ...(resumeDataSchema.parse(naik) as unknown as ResumeData),
      id: "",
    });
    withNewIds.title = `${withNewIds.title} (Impor)`.slice(0, 160);

    const resume = await createResume(
      user.id,
      resumeDataSchema.parse(withNewIds),
    );

    return NextResponse.json({ resume }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}

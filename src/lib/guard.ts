import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

/** Galat yang membawa kode status HTTP agar handler API tetap ringkas. */
export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "HttpError";
  }
}

/** Memastikan permintaan datang dari pengguna yang sudah masuk. */
export async function requireUser() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new HttpError(401, "Anda belum masuk.");
  }
  return session.user;
}

/**
 * Memastikan CV yang diminta benar-benar milik pengguna yang sedang masuk.
 *
 * Kepemilikan diikutkan langsung pada klausa WHERE, bukan diperiksa setelah
 * data terambil. Dengan begitu CV milik orang lain menghasilkan 404 - bukan
 * 403 - sehingga keberadaan sebuah id pun tidak bocor ke pengguna lain.
 */
export async function requireOwnedResume<T extends object | undefined>(
  resumeId: string,
  include?: T,
) {
  const user = await requireUser();
  const resume = await prisma.resume.findFirst({
    where: { id: resumeId, userId: user.id },
    ...(include ? { include } : {}),
  });
  if (!resume) {
    throw new HttpError(404, "CV tidak ditemukan.");
  }
  return { user, resume };
}

/** Mengubah galat apa pun menjadi respons JSON yang konsisten. */
export function errorResponse(error: unknown) {
  if (error instanceof HttpError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: "Data yang dikirim tidak valid.",
        issues: error.issues.map((i) => ({
          path: i.path.join("."),
          message: i.message,
        })),
      },
      { status: 422 },
    );
  }
  console.error("[api] galat tak tertangani:", error);
  return NextResponse.json(
    { error: "Terjadi kesalahan pada server." },
    { status: 500 },
  );
}

import { NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { ZodError } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { isStaleSessionError } from "@/lib/stale-session";

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
  if (isStaleSessionError(error)) {
    return NextResponse.json(
      {
        error: "Sesi Anda sudah tidak berlaku. Silakan masuk lagi.",
        code: "SESSION_STALE",
      },
      { status: 401 },
    );
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

/**
 * Padanan `errorResponse()` untuk halaman, bukan untuk titik akhir API.
 *
 * Halaman tidak mengembalikan JSON - yang benar baginya adalah mengantar
 * pengguna ke halaman masuk beserta penjelasan mengapa. Tanpa ini, sesi yang
 * menunjuk pengguna terhapus berakhir sebagai "Ada yang tidak beres", pesan
 * yang tidak memberi tahu apa pun dan menyesatkan: servernya bekerja dengan
 * benar, sesinyalah yang sudah tidak berlaku.
 *
 * Galat lain dilempar ulang apa adanya, supaya batas galat Next.js tetap
 * menanganinya seperti biasa. Menelan semuanya di sini akan menyembunyikan
 * kerusakan sungguhan di balik halaman masuk.
 */
export function redirectIfStaleSession(error: unknown): never {
  if (isStaleSessionError(error)) redirect("/login?sesi=habis");
  throw error;
}

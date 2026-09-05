import { NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { ZodError } from "zod";
import { auth } from "@/auth";
import { isAdminEmail } from "@/lib/admin";
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
 * Memastikan permintaan datang dari pengelola.
 *
 * Diperiksa **di server, pada setiap halaman dan setiap aksi**, bukan sekali
 * di tempat masuknya. Menyembunyikan menu bukan pengamanan: alamat rutenya
 * dapat diketik langsung, dan aksinya dapat dipanggil langsung tanpa membuka
 * halamannya sama sekali.
 *
 * Perannya dibaca ulang dari basis data lewat `ADMIN_EMAIL`, bukan dipercaya
 * dari penanda di dalam token. Token ditandatangani server sehingga tidak
 * dapat dipalsukan, tetapi ia dapat **basi**: token yang diterbitkan saat
 * seseorang masih pengelola tetap membawa penandanya sampai kedaluwarsa,
 * padahal `ADMIN_EMAIL` mungkin sudah diganti sejak lama. Membaca ulang
 * membuat pencabutan peran berlaku seketika.
 *
 * Yang bukan pengelola memperoleh 404, bukan 403. Pesan penolakan justru
 * memberi tahu ada sesuatu di alamat itu; halaman yang seolah tidak ada tidak
 * mengungkapkan apa pun.
 */
export async function requireAdmin() {
  const session = await auth();
  const email = session?.user?.email;
  if (!session?.user?.id || !isAdminEmail(email)) {
    throw new HttpError(404, "Halaman tidak ditemukan.");
  }
  return session.user;
}

/** Bentuk yang tidak melempar, untuk halaman yang perlu memanggil notFound(). */
export async function isAdminRequest(): Promise<boolean> {
  const session = await auth();
  return Boolean(session?.user?.id && isAdminEmail(session.user.email));
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

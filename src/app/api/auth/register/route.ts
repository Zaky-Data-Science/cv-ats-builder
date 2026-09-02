import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { errorResponse, HttpError } from "@/lib/guard";
import { checkRateLimit, clientIp, LIMITS } from "@/lib/rate-limit";
import { registerSchema } from "@/lib/resume/schema";

/** Jumlah putaran bcrypt. 12 adalah kompromi lazim antara keamanan dan waktu proses. */
const BCRYPT_ROUNDS = 12;

/**
 * Pendaftaran akun dengan email dan kata sandi.
 *
 * Kata sandi tidak pernah disimpan apa adanya - yang masuk ke basis data
 * hanya hasil hash bcrypt beserta salt-nya.
 */
export async function POST(request: Request) {
  try {
    // Pembatasan laju agar satu sumber tidak dapat membuat akun secara massal.
    const limit = await checkRateLimit({
      key: `register:${clientIp(request)}`,
      ...LIMITS.register,
    });
    if (!limit.allowed) {
      throw new HttpError(
        429,
        `Terlalu banyak percobaan pendaftaran. Coba lagi dalam ${Math.ceil(
          limit.retryAfterSeconds / 60,
        )} menit.`,
      );
    }

    const body = await request.json().catch(() => ({}));
    const { name, email, password } = registerSchema.parse(body);
    const normalizedEmail = email.trim().toLowerCase();

    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: { id: true, passwordHash: true },
    });

    if (existing) {
      // Akun hasil pendaftaran lewat Google belum punya kata sandi. Alih-alih
      // menolak mentah-mentah, pengguna diarahkan memakai tombol Google.
      throw new HttpError(
        409,
        existing.passwordHash
          ? "Email ini sudah terdaftar. Silakan masuk."
          : "Email ini terdaftar lewat Google. Gunakan tombol Masuk dengan Google.",
      );
    }

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        passwordHash: await bcrypt.hash(password, BCRYPT_ROUNDS),
      },
      select: { id: true, email: true, name: true },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}

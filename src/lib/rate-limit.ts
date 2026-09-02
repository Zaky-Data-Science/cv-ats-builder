import { prisma } from "@/lib/db";

/**
 * Pembatasan laju permintaan untuk titik masuk yang sensitif.
 *
 * Tanpa pembatasan ini, halaman masuk dapat dicoba ribuan kali per menit
 * untuk menebak kata sandi, dan halaman pendaftaran dapat dipakai membuat
 * akun secara massal.
 *
 * Penghitung disimpan di basis data, bukan di memori proses. Alasannya
 * penting untuk lingkungan penyebaran aplikasi ini: pada platform
 * serverless, tiap permintaan dapat dilayani instans yang berbeda dan
 * instans dapat dimatikan kapan saja - penghitung di memori akan mudah
 * dilewati begitu saja, sehingga memberi rasa aman yang keliru.
 */

export interface RateLimitResult {
  allowed: boolean;
  /** Sisa percobaan pada jendela waktu berjalan. */
  remaining: number;
  /** Detik yang harus ditunggu sebelum mencoba lagi. */
  retryAfterSeconds: number;
}

export interface RateLimitOptions {
  /** Pengenal unik, mis. "login:budi@email.com". */
  key: string;
  /** Jumlah percobaan yang diizinkan dalam satu jendela waktu. */
  limit: number;
  /** Panjang jendela waktu dalam detik. */
  windowSeconds: number;
}

/**
 * Menaikkan penghitung dan memutuskan apakah permintaan boleh diteruskan.
 *
 * Memakai jendela tetap (fixed window): sederhana, hanya perlu satu baris
 * per kunci, dan sudah memadai untuk tujuan di sini. Kelemahannya, dua kali
 * lipat batas dapat lolos tepat di pergantian jendela - risiko yang dapat
 * diterima untuk perlindungan terhadap penebakan kata sandi.
 */
export async function checkRateLimit({
  key,
  limit,
  windowSeconds,
}: RateLimitOptions): Promise<RateLimitResult> {
  const now = new Date();
  const windowEnd = new Date(now.getTime() + windowSeconds * 1000);

  try {
    const existing = await prisma.rateLimit.findUnique({ where: { key } });

    // Belum ada, atau jendela sebelumnya sudah lewat: mulai hitungan baru.
    if (!existing || existing.windowEnd <= now) {
      await prisma.rateLimit.upsert({
        where: { key },
        update: { count: 1, windowEnd },
        create: { key, count: 1, windowEnd },
      });
      return { allowed: true, remaining: limit - 1, retryAfterSeconds: 0 };
    }

    if (existing.count >= limit) {
      return {
        allowed: false,
        remaining: 0,
        retryAfterSeconds: Math.max(
          1,
          Math.ceil((existing.windowEnd.getTime() - now.getTime()) / 1000),
        ),
      };
    }

    const updated = await prisma.rateLimit.update({
      where: { key },
      data: { count: { increment: 1 } },
    });

    return {
      allowed: true,
      remaining: Math.max(0, limit - updated.count),
      retryAfterSeconds: 0,
    };
  } catch (error) {
    // Basis data bermasalah tidak boleh membuat seluruh aplikasi tidak dapat
    // dipakai. Permintaan diteruskan, tetapi kegagalannya dicatat.
    console.error("[rate-limit] gagal memeriksa batas:", error);
    return { allowed: true, remaining: limit, retryAfterSeconds: 0 };
  }
}

/** Menghapus penghitung, dipakai setelah percobaan yang berhasil. */
export async function resetRateLimit(key: string): Promise<void> {
  try {
    await prisma.rateLimit.deleteMany({ where: { key } });
  } catch {
    // Tidak perlu ditangani: baris kedaluwarsa akan tergantikan sendiri.
  }
}

/**
 * Mengambil alamat IP pemanggil dari header proksi.
 *
 * Nilainya berasal dari header yang dapat dipalsukan, sehingga hanya dipakai
 * sebagai pembatas kasar - bukan sebagai identitas. Pembatas yang benar-benar
 * penting (percobaan masuk) memakai alamat email sebagai kunci.
 */
export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "tanpa-ip";
}

/** Batas yang dipakai aplikasi, dikumpulkan agar mudah ditinjau. */
export const LIMITS = {
  /** Pendaftaran: mencegah pembuatan akun massal dari satu sumber. */
  register: { limit: 5, windowSeconds: 60 * 60 },
  /** Percobaan masuk per alamat email. */
  login: { limit: 8, windowSeconds: 15 * 60 },
} as const;

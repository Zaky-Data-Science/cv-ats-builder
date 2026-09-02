import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

/**
 * Prisma 7 memakai driver adapter. PrismaPg dipakai untuk Postgres, baik
 * database lokal maupun Neon di production - keduanya bicara protokol
 * Postgres yang sama, sehingga tidak ada perbedaan kode di antara keduanya.
 */
function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL belum diisi. Salin .env.example menjadi .env lalu isi nilainya.",
    );
  }

  return new PrismaClient({
    adapter: new PrismaPg({
      connectionString,

      /*
       * Pengaturan lumbung koneksi (connection pool).
       *
       * Di production aplikasi berjalan pada platform serverless: tiap
       * instans fungsi memegang lumbungnya sendiri, dan puluhan instans
       * dapat hidup bersamaan saat lalu lintas naik. Karena itu lumbung
       * dibuat kecil dan koneksi menganggur ditutup cepat - kalau tidak,
       * batas koneksi basis data habis bukan karena bebannya berat,
       * melainkan karena koneksi menumpuk tanpa dipakai.
       *
       * idleTimeoutMillis juga sengaja lebih pendek daripada batas
       * penutupan koneksi di sisi server. Tanpa itu, permintaan berikutnya
       * berpeluang memungut koneksi yang sebenarnya sudah ditutup server
       * dan gagal dengan galat "ConnectionClosed".
       */
      max: 5,
      idleTimeoutMillis: 10_000,
      connectionTimeoutMillis: 15_000,
      // Menjaga koneksi tetap hidup melewati perantara jaringan yang
      // memutus sambungan diam.
      keepAlive: true,
    }),
  });
}

// Next.js melakukan hot-reload di mode dev; tanpa singleton ini setiap reload
// akan membuat lumbung koneksi baru sampai batas koneksi basis data habis.
const globalForPrisma = globalThis as unknown as {
  prisma?: ReturnType<typeof createPrismaClient>;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

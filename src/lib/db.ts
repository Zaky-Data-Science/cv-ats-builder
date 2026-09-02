import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

/**
 * Prisma 7 memakai driver adapter. PrismaPg dipakai untuk Postgres, baik
 * database lokal (`npx prisma dev`) maupun Neon di production - keduanya
 * bicara protokol Postgres yang sama, sehingga tidak ada perbedaan kode.
 */
function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL belum diisi. Salin .env.example menjadi .env lalu isi nilainya.",
    );
  }
  return new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
  });
}

// Next.js melakukan hot-reload di mode dev; tanpa singleton ini setiap reload
// akan membuat koneksi baru sampai pool database habis.
const globalForPrisma = globalThis as unknown as {
  prisma?: ReturnType<typeof createPrismaClient>;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

-- Menambah pilihan template dan ukuran kertas.
--
-- Ditulis manual, bukan lewat `prisma migrate dev`, karena perintah itu
-- terbukti mengosongkan basis data pengembangan lokal `prisma dev`.
--
-- Catatan PostgreSQL: menambah nilai enum dan memakainya di dalam satu
-- transaksi yang sama tidak diizinkan. Di sini hal itu tidak terjadi -
-- nilai baru "TemplateId" tidak dipakai oleh pernyataan mana pun di berkas
-- ini - sehingga migrasi ini aman dijalankan dalam satu transaksi.

-- AlterEnum
ALTER TYPE "TemplateId" ADD VALUE 'EXECUTIVE';
ALTER TYPE "TemplateId" ADD VALUE 'MINIMAL';
ALTER TYPE "TemplateId" ADD VALUE 'TIMELINE';
ALTER TYPE "TemplateId" ADD VALUE 'ACADEMIC';
ALTER TYPE "TemplateId" ADD VALUE 'GOVERNMENT';
ALTER TYPE "TemplateId" ADD VALUE 'PORTRAIT';
ALTER TYPE "TemplateId" ADD VALUE 'PROFILE';

-- CreateEnum
CREATE TYPE "PaperSize" AS ENUM ('A4', 'LETTER', 'LEGAL', 'F4');

-- AlterTable
-- Bawaan A4: seluruh CV yang sudah ada memang disusun pada ukuran itu,
-- sehingga tampilannya tidak berubah sedikit pun setelah migrasi.
ALTER TABLE "resumes" ADD COLUMN "pageSize" "PaperSize" NOT NULL DEFAULT 'A4';

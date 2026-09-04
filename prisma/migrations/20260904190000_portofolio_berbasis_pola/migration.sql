-- Portofolio berbasis pola.
--
-- Ditulis manual, bukan lewat `prisma migrate dev`, mengikuti migrasi-migrasi
-- sebelumnya di berkas ini: perintah itu terbukti mengosongkan basis data
-- pengembangan lokal `prisma dev`.
--
-- Seluruhnya penambahan kolom dengan nilai bawaan. Tidak ada kolom yang
-- dihapus, diganti nama, atau berubah artinya - CV yang sudah tersimpan
-- dibuat orang yang tidak pernah meminta fitur ini, dan membukanya kembali
-- harus terasa persis seperti sebelumnya.
--
-- Perhatikan `schemaVersion` bernilai bawaan 1, bukan 2. Baris lama memang
-- versi 1, dan menaikkannya adalah pekerjaan pembaca dokumen - bukan
-- pekerjaan migrasi ini, yang tidak tahu apa-apa tentang isi CV-nya.

-- Tingkat dokumen
ALTER TABLE "resumes" ADD COLUMN "schemaVersion" INTEGER NOT NULL DEFAULT 1;
ALTER TABLE "resumes" ADD COLUMN "profilPortofolio" JSONB;
ALTER TABLE "resumes" ADD COLUMN "portofolio" JSONB;

-- Item portofolio. Bagian `project` diperluas, bukan diduplikasi ke tabel baru.
ALTER TABLE "projects" ADD COLUMN "konteks" TEXT NOT NULL DEFAULT '';
ALTER TABLE "projects" ADD COLUMN "lokasi" TEXT NOT NULL DEFAULT '';
ALTER TABLE "projects" ADD COLUMN "ringkasan" TEXT NOT NULL DEFAULT '';
ALTER TABLE "projects" ADD COLUMN "refleksi" TEXT NOT NULL DEFAULT '';
ALTER TABLE "projects" ADD COLUMN "polaOverride" TEXT NOT NULL DEFAULT '';
ALTER TABLE "projects" ADD COLUMN "parentPengalamanId" TEXT NOT NULL DEFAULT '';
ALTER TABLE "projects" ADD COLUMN "kataKunci" TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "projects" ADD COLUMN "tautan" JSONB NOT NULL DEFAULT '[]';
ALTER TABLE "projects" ADD COLUMN "inti" JSONB NOT NULL DEFAULT '{}';
ALTER TABLE "projects" ADD COLUMN "detailTambahan" JSONB NOT NULL DEFAULT '[]';
ALTER TABLE "projects" ADD COLUMN "verifikator" JSONB NOT NULL DEFAULT '{}';
ALTER TABLE "projects" ADD COLUMN "arsip" JSONB NOT NULL DEFAULT '{}';

-- Karya terbit. Tiga field yang benar-benar baru; sisanya sudah punya rumah.
ALTER TABLE "publications" ADD COLUMN "tipeLuaran" TEXT NOT NULL DEFAULT '';
ALTER TABLE "publications" ADD COLUMN "peranSaya" TEXT NOT NULL DEFAULT '';
ALTER TABLE "publications" ADD COLUMN "indeksasiTier" TEXT NOT NULL DEFAULT '';

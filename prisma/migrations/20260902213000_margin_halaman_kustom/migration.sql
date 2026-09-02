-- Margin halaman yang dapat disetel sendiri oleh pengguna.
--
-- Ditulis manual, bukan lewat `prisma migrate dev`, karena perintah itu
-- terbukti mengosongkan basis data pengembangan lokal `prisma dev`.
--
-- Kedua kolom boleh NULL, dan NULL berarti "ikut margin bawaan template".
-- Nilai bawaan template sengaja tidak disalin ke sini: CV yang belum pernah
-- disetel manual harus ikut menyesuaikan sendiri ketika templatenya diganti.
ALTER TABLE "resumes" ADD COLUMN "marginYMm" INTEGER;
ALTER TABLE "resumes" ADD COLUMN "marginXMm" INTEGER;

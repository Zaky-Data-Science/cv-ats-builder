-- Kredensial empat kategori.
--
-- Ditulis manual, mengikuti migrasi sebelumnya di folder ini.
--
-- Seluruhnya penambahan kolom bernilai bawaan "". Kredensial yang sudah
-- tersimpan tetap sah apa adanya: kategori kosong berarti "belum
-- dikategorikan", dan masaBerlaku kosong berarti mengikuti kolom expiryDate
-- seperti sebelumnya.
ALTER TABLE "certifications" ADD COLUMN "kategori" TEXT NOT NULL DEFAULT '';
ALTER TABLE "certifications" ADD COLUMN "masaBerlaku" TEXT NOT NULL DEFAULT '';
ALTER TABLE "certifications" ADD COLUMN "jenjang" TEXT NOT NULL DEFAULT '';
ALTER TABLE "certifications" ADD COLUMN "klasifikasi" TEXT NOT NULL DEFAULT '';
ALTER TABLE "certifications" ADD COLUMN "subTipe" TEXT NOT NULL DEFAULT '';

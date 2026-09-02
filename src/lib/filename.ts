/** Rentang tanda diakritik gabungan Unicode (U+0300 - U+036F). */
const COMBINING_MARKS = /[̀-ͯ]/g;

/**
 * Mengubah judul CV menjadi nama berkas yang aman di semua sistem operasi.
 * Huruf beraksen diuraikan lebih dulu lalu tanda diakritiknya dibuang,
 * sehingga "José" menjadi "jose" dan bukan hilang seluruhnya.
 */
export function slugify(text: string): string {
  const slug = text
    .normalize("NFD")
    .replace(COMBINING_MARKS, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return slug || "cv";
}

/** Nama berkas unduhan, mis. "cv-budi-santoso-frontend-developer.pdf". */
export function downloadName(
  fullName: string,
  title: string,
  extension: string,
): string {
  const parts = [fullName, title].filter((p) => p && p.trim());
  const base = slugify(parts.join(" ") || "cv");
  return `${base.startsWith("cv") ? base : `cv-${base}`}.${extension}`;
}

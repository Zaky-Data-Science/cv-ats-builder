import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Menyalin worker pdf.js ke folder public.
 *
 * pdf.js menjalankan penguraian PDF di dalam Web Worker, dan berkas
 * worker-nya harus dilayani sebagai berkas statis - ia tidak bisa ikut
 * dibundel bersama kode aplikasi. Penyalinan dijalankan otomatis setelah
 * `npm install`, bukan disalin sekali secara manual, supaya versinya tidak
 * pernah tertinggal dari versi pustaka yang sedang terpasang. Worker versi
 * lama yang dipasangkan dengan pustaka versi baru gagal dengan pesan yang
 * membingungkan.
 */
const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");

const source = join(root, "node_modules", "pdfjs-dist", "build", "pdf.worker.min.mjs");
const targetDir = join(root, "public", "pdfjs");
const target = join(targetDir, "pdf.worker.min.mjs");

try {
  mkdirSync(targetDir, { recursive: true });
  copyFileSync(source, target);
  console.log("[pdfjs] worker disalin ke public/pdfjs/pdf.worker.min.mjs");
} catch (error) {
  // Bukan galat fatal saat pemasangan: build tetap berjalan, dan kegagalan
  // ini akan terlihat jelas saat fitur unggah CV dicoba.
  console.warn("[pdfjs] gagal menyalin worker:", error.message);
}

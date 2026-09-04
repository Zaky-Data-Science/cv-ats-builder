import type { ProjectItem } from "@/lib/resume/types";
import { polaSchema } from "./pola-schemas";
import type { IntiValue, PolaSlug } from "./types";

/**
 * ============================================================================
 *  MENGGANTI BENTUK PORTOFOLIO TANPA KEHILANGAN ISIAN
 * ============================================================================
 *
 * Mengganti bentuk portofolio berarti mengganti daftar field intinya. Yang
 * tidak boleh terjadi: isian yang sudah diketik pengguna lenyap begitu ia
 * mencoba bentuk lain.
 *
 * Karena itu field inti yang tidak dikenal bentuk baru **tidak dihapus**,
 * melainkan pindah ke `arsip` - dan kembali sendiri begitu bentuk lamanya
 * dipilih lagi. Field umum (judul, peran, konteks, tanggal, poin, tautan) dan
 * `detailTambahan` tidak pernah tersentuh sama sekali: keduanya berlaku di
 * semua bentuk, dan slot fleksibel memang dibuat supaya isian khas bidang
 * punya tempat yang tidak ikut berganti.
 */

/** Label field inti yang akan disembunyikan bila bentuknya diganti. */
export function fieldTersembunyi(
  item: ProjectItem,
  polaBaru: PolaSlug,
  polaLama: PolaSlug,
): string[] {
  const kunciBaru = new Set(
    polaSchema(polaBaru).fieldInti.map((field) => field.key),
  );
  const skemaLama = polaSchema(polaLama);
  return skemaLama.fieldInti
    .filter((field) => !kunciBaru.has(field.key))
    .filter((field) => terisi(item.inti[field.key]))
    .map((field) => field.label);
}

/**
 * Memindahkan isian yang tidak dikenal bentuk baru ke arsip, lalu memulihkan
 * kembali isian arsip yang justru dikenal bentuk baru itu.
 *
 * Dua arah sekaligus, dan itu memang perlu: pengguna yang mencoba bentuk lain
 * lalu berubah pikiran harus menemukan isiannya utuh seperti ia
 * meninggalkannya - bukan menemukan tombol pulihkan yang harus ia tekan satu
 * per satu.
 */
export function gantiPolaItem(
  item: ProjectItem,
  polaBaru: PolaSlug,
): ProjectItem {
  const kunciBaru = new Set(
    polaSchema(polaBaru).fieldInti.map((field) => field.key),
  );

  const inti: Record<string, IntiValue> = {};
  const arsip: Record<string, IntiValue> = { ...item.arsip };

  for (const [kunci, nilai] of Object.entries(item.inti)) {
    if (kunciBaru.has(kunci)) inti[kunci] = nilai;
    else if (terisi(nilai)) arsip[kunci] = nilai;
  }

  for (const [kunci, nilai] of Object.entries(arsip)) {
    if (!kunciBaru.has(kunci)) continue;
    // Isian yang sedang aktif menang atas isian arsip: yang di layar barusan
    // adalah yang terakhir disunting penggunanya.
    if (inti[kunci] === undefined) inti[kunci] = nilai;
    delete arsip[kunci];
  }

  return { ...item, inti, arsip };
}

/** Isian arsip yang masih tersimpan, untuk ditampilkan beserta tombol pulihkan. */
export function isiArsip(item: ProjectItem): { kunci: string; teks: string }[] {
  return Object.entries(item.arsip)
    .filter(([, nilai]) => terisi(nilai))
    .map(([kunci, nilai]) => ({ kunci, teks: sebagaiTeks(nilai) }));
}

/** Mengembalikan satu isian arsip ke slot detail tambahan. */
export function pulihkanKeDetail(
  item: ProjectItem,
  kunci: string,
  label: string,
): ProjectItem {
  const nilai = item.arsip[kunci];
  if (nilai === undefined) return item;
  const arsip = { ...item.arsip };
  delete arsip[kunci];
  return {
    ...item,
    arsip,
    detailTambahan: [
      ...item.detailTambahan,
      {
        label,
        nilai: sebagaiTeks(nilai),
        satuan: "",
        prioritas: item.detailTambahan.length + 1,
      },
    ].slice(0, 6),
  };
}

function terisi(nilai: IntiValue | undefined): boolean {
  if (nilai === undefined || nilai === null) return false;
  if (Array.isArray(nilai)) return nilai.some((v) => v.trim());
  return String(nilai).trim().length > 0;
}

function sebagaiTeks(nilai: IntiValue): string {
  if (Array.isArray(nilai)) return nilai.filter((v) => v.trim()).join(", ");
  return String(nilai);
}

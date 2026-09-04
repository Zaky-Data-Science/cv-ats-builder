import { KAMUS_BIDANG } from "./kamus-bidang";
import type { EntriKamus } from "./types";

/**
 * ============================================================================
 *  PENCARIAN BIDANG
 * ============================================================================
 *
 * Pengguna tidak mengetik nama kategori. Ia mengetik nama jurusannya - dan
 * yang ada di kepalanya adalah "Ahwal Syakhshiyyah", "PWK", "Mekatronika",
 * "Tata Boga", bukan "Keagamaan, Dakwah & Kerohanian" atau "Hardware, Elektro
 * & Embedded".
 *
 * Karena itu pencarian membaca `jurusanTermasuk` lebih dulu dan memberinya
 * nilai lebih tinggi daripada `nama`. Kolom itu memang ada untuk ini.
 */

export interface HasilCari {
  entri: EntriKamus;
  skor: number;
  /** Teks yang membuatnya cocok - ditampilkan sebagai keterangan di daftar. */
  cocokPada: string;
}

/**
 * Menyeragamkan teks sebelum dibandingkan.
 *
 * Huruf beraksen ikut diratakan supaya "Syakhshiyyah" dan "Syakhsiyyah" tidak
 * jatuh ke dua dunia yang berbeda hanya karena cara seseorang mengejanya.
 */
export function normalkan(teks: string): string {
  return teks
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function skorKecocokan(kandidat: string, kueri: string): number {
  const a = normalkan(kandidat);
  const b = normalkan(kueri);
  if (!a || !b) return 0;
  if (a === b) return 100;
  if (a.startsWith(b)) return 80;
  if (a.includes(b)) return 60;
  if (b.includes(a)) return 55;

  // Kueri yang lebih panjang daripada entrinya - "teknik informatika unmul",
  // misalnya. Yang dinilai berapa banyak katanya yang benar-benar bertemu.
  const kataA = a.split(" ");
  const kataB = new Set(b.split(" "));
  const bertemu = kataA.filter((kata) => kata.length > 2 && kataB.has(kata));
  if (bertemu.length === 0) return 0;
  return Math.round((bertemu.length / kataA.length) * 45);
}

/**
 * Mencari entri kamus yang cocok dengan apa yang diketik pengguna.
 *
 * Fallback `umum` tidak pernah ikut hasil pencarian: ia dipilih lewat tombol
 * "bidang saya tidak ada di daftar", bukan lewat kebetulan cocoknya kata.
 */
export function cariBidang(kueri: string, batas = 8): HasilCari[] {
  const bersih = kueri.trim();
  if (bersih.length < 2) return [];

  const hasil: HasilCari[] = [];
  for (const entri of KAMUS_BIDANG) {
    if (entri.slug === "umum") continue;

    let terbaik = 0;
    let cocokPada = "";

    for (const jurusan of entri.jurusanTermasuk) {
      const skor = skorKecocokan(jurusan, bersih);
      if (skor > terbaik) {
        terbaik = skor;
        cocokPada = jurusan;
      }
    }

    // Nama kategori dinilai sedikit di bawah nama jurusan yang sama persis,
    // supaya ketikan "Kedokteran Gigi" mendarat di entri yang memuat jurusan
    // itu, bukan di entri yang kebetulan namanya mengandung kata serupa.
    const skorNama = Math.round(skorKecocokan(entri.nama, bersih) * 0.9);
    if (skorNama > terbaik) {
      terbaik = skorNama;
      cocokPada = entri.nama;
    }

    if (terbaik > 0) hasil.push({ entri, skor: terbaik, cocokPada });
  }

  hasil.sort((a, b) => b.skor - a.skor || a.entri.nama.localeCompare(b.entri.nama));
  return hasil.slice(0, batas);
}

/** Entri terbaik untuk sebuah ketikan, atau null bila tidak ada yang meyakinkan. */
export function tebakBidang(kueri: string): EntriKamus | null {
  const hasil = cariBidang(kueri, 1);
  if (hasil.length === 0) return null;
  // Ambang ini menyaring kecocokan sepotong kata yang kebetulan. Di bawahnya,
  // menebak bidang seseorang berarti mengubah bentuk formulirnya berdasarkan
  // dugaan - dan itu lebih merugikan daripada tidak menebak sama sekali.
  return hasil[0].skor >= 45 ? hasil[0].entri : null;
}

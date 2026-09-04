import type { KategoriKredensial } from "./types";

/**
 * ============================================================================
 *  AMBANG RESMI PER PROFESI
 * ============================================================================
 *
 * Angka-angka di berkas ini ditulis sebagai **data**, bukan konstanta di dalam
 * kode, dan alasannya bukan kerapian.
 *
 * Begitu aplikasi menampilkan "180 dari 250 SKP", pengguna akan memakainya
 * untuk memutuskan kapan mengurus perpanjangan izin praktiknya. Kalau angkanya
 * usang, kerugiannya nyata dan menimpa orang yang tidak punya cara mengeceknya
 * dari dalam aplikasi. Karena itu tiap entri wajib membawa `sumber` dan
 * `diperbarui`, dan keduanya **ditampilkan di antarmuka** - pengguna berhak
 * tahu angka yang ia percayai itu dibaca dari mana dan kapan.
 *
 * Satu catatan yang harus benar: sejak UU 17/2023, portofolio SKP **bukan
 * lagi** syarat memperpanjang STR - STR Definitif kini berlaku seumur hidup -
 * melainkan syarat memperpanjang SIP. Skema lama "5 ranah untuk perpanjangan
 * STR" sudah usang dan tidak boleh ditulis di mana pun.
 */

export interface RanahAmbang {
  nama: string;
  /** Persentase minimum dari total, bila aturannya menyebut angka. */
  minPersen?: number;
  /** Bobot poin, untuk rubrik yang memakai poin alih-alih persentase. */
  poin?: number;
}

export interface AmbangProfesi {
  slug: string;
  nama: string;
  /** Total yang harus dikumpulkan. null bila aturannya tidak menyebut angka. */
  total: number | null;
  satuan: string;
  /** Panjang satu siklus penilaian, dalam tahun. */
  siklusTahun: number | null;
  ranah: RanahAmbang[];
  /** Untuk apa perolehan ini dipakai - ditulis apa adanya, tanpa disingkat. */
  keperluan: string;
  /** Nama peraturan atau rubriknya. Ditampilkan di antarmuka. */
  sumber: string;
  /** Kapan angka ini terakhir kali diperiksa. Ditampilkan di antarmuka. */
  diperbarui: string;
  catatan?: string;
}

export const AMBANG_PROFESI: AmbangProfesi[] = [
  {
    slug: "dokter",
    nama: "Dokter & dokter spesialis",
    total: 250,
    satuan: "SKP",
    siklusTahun: 5,
    ranah: [
      { nama: "Pembelajaran", minPersen: 45 },
      { nama: "Pelayanan", minPersen: 35 },
      { nama: "Pengabdian", minPersen: 5 },
    ],
    keperluan: "Perpanjangan SIP (Surat Izin Praktik)",
    sumber: "KMK HK.01.07/1561/2024",
    diperbarui: "2026-09-04",
  },
  {
    slug: "dokter-gigi",
    nama: "Dokter gigi",
    total: 100,
    satuan: "SKP",
    siklusTahun: 5,
    ranah: [
      { nama: "Pembelajaran", minPersen: 45 },
      { nama: "Pelayanan", minPersen: 35 },
      { nama: "Pengabdian", minPersen: 5 },
    ],
    keperluan: "Perpanjangan SIP (Surat Izin Praktik)",
    sumber: "KMK HK.01.07/1561/2024",
    diperbarui: "2026-09-04",
  },
  {
    slug: "nakes-lain",
    nama: "Perawat, bidan, fisioterapis, dan mayoritas tenaga kesehatan lain",
    total: 50,
    satuan: "SKP",
    siklusTahun: 5,
    ranah: [
      { nama: "Pembelajaran", minPersen: 45 },
      { nama: "Pelayanan", minPersen: 35 },
      { nama: "Pengabdian", minPersen: 5 },
    ],
    keperluan: "Perpanjangan SIP (Surat Izin Praktik)",
    sumber: "KMK HK.01.07/1561/2024",
    diperbarui: "2026-09-04",
  },
  {
    slug: "guru-ppg",
    nama: "Guru (portofolio PPG)",
    total: 10,
    satuan: "poin",
    siklusTahun: null,
    ranah: [
      { nama: "Penelitian & publikasi", poin: 4 },
      { nama: "Karya inovasi", poin: 4 },
      { nama: "Refleksi diri", poin: 3 },
      { nama: "Diklat & seminar", poin: 3 },
      { nama: "Prestasi", poin: 1.5 },
      { nama: "Pengabdian", poin: 1.5 },
    ],
    keperluan: "Penilaian portofolio UKMPPG (10 poin dikonversi ke skala 100)",
    sumber: "Rubrik UKMPPG",
    diperbarui: "2026-09-04",
    catatan:
      "Satu bukti hanya boleh dipakai untuk satu komponen. Bukti yang sama tidak boleh dihitung dua kali.",
  },
  {
    slug: "konstruksi-pkb",
    nama: "Tenaga kerja konstruksi",
    total: null,
    satuan: "kegiatan PKB",
    siklusTahun: 5,
    ranah: [],
    keperluan: "Perpanjangan SKK Konstruksi melalui Pengembangan Keprofesian Berkelanjutan",
    sumber: "LSP bidang konstruksi terlisensi BNSP",
    diperbarui: "2026-09-04",
    catatan:
      "Jumlah kegiatannya ditetapkan per skema oleh masing-masing lembaga sertifikasi, jadi tidak dituliskan sebagai angka di sini.",
  },
];

export function ambangProfesi(slug: string): AmbangProfesi | undefined {
  return AMBANG_PROFESI.find((entri) => entri.slug === slug);
}

/**
 * Sanggahan yang tampil di bawah progress bar dan tidak dapat ditutup.
 *
 * Bukan basa-basi hukum: perhitungan di aplikasi ini dibangun dari apa yang
 * diketik pengguna sendiri, sedangkan yang berlaku saat mengurus perizinan
 * adalah catatan resmi. Keduanya bisa berbeda, dan pengguna harus tahu itu
 * sebelum ia memakai angka di layar untuk mengambil keputusan.
 */
export const SANGGAHAN_AGREGAT =
  "Perhitungan mandiri, bukan pengganti catatan resmi di Plataran Sehat / SATUSEHAT SDMK. " +
  "Ambang mengacu KMK 1561/2024 - periksa aturan terbaru sebelum mengurus perizinan.";

/**
 * Pilihan masa berlaku sebuah kredensial.
 *
 * "Seumur hidup" berdiri sejajar dengan tanggal tertentu, bukan sebagai kasus
 * khusus. Sejak UU 17/2023 dan PP 28/2024, STR Definitif memang berlaku seumur
 * hidup, sehingga formulir yang memaksa pengisian tanggal kedaluwarsa menuntut
 * pengguna mengarang tanggal yang tidak ada - kesalahan yang paling sering
 * ditemui di aplikasi CV Indonesia pasca-undang-undang itu.
 */
export type MasaBerlakuJenis = "seumur-hidup" | "tanggal" | "tidak-berlaku";

export const MASA_BERLAKU_LABEL: Record<MasaBerlakuJenis, string> = {
  "seumur-hidup": "Seumur hidup",
  tanggal: "Berlaku sampai tanggal tertentu",
  "tidak-berlaku": "Tidak punya masa berlaku",
};

export const LABEL_KATEGORI_KREDENSIAL: Record<KategoriKredensial, string> = {
  "lisensi-praktik": "Lisensi praktik",
  berjenjang: "Kredensial berjenjang",
  sektoral: "Sertifikasi sektoral",
  kompetensi: "Sertifikasi kompetensi & vendor",
};

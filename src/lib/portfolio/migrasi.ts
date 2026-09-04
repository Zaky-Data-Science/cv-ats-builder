import { entriKamus } from "./kamus-bidang";
import { POLA_SCHEMAS } from "./pola-schemas";
import type {
  BagianPortofolio,
  DetailTambahan,
  IntiValue,
  PolaSlug,
  ProfilPortofolio,
  TautanPortofolio,
  Verifikator,
} from "./types";
import { SEMUA_POLA } from "./types";

/**
 * ============================================================================
 *  MIGRASI & KOMPATIBILITAS MUNDUR
 * ============================================================================
 *
 * Aturan yang tidak boleh dilanggar berkas ini: **tidak ada data yang dibuang,
 * dan tidak ada skor yang bergeser sebelum penggunanya sendiri menyalakan
 * bagian portofolio.**
 *
 * CV yang sudah tersimpan dibuat orang yang tidak pernah meminta fitur ini.
 * Membukanya kembali harus terasa persis seperti sebelumnya - judulnya sama,
 * isinya sama, angkanya sama - dan yang berubah hanya tersedianya pilihan baru
 * yang boleh ia abaikan seumur hidup CV itu.
 */

/**
 * Versi bentuk dokumen CV saat ini.
 *
 * 1 = sebelum portofolio berbasis pola.
 * 2 = dengan `profilPortofolio`, `portofolio`, dan field portofolio pada
 *     `projects` serta `publications`.
 */
export const VERSI_SKEMA_CV = 2;

/* -------------------------------------------------------------------------- */
/* Nilai bawaan                                                               */
/* -------------------------------------------------------------------------- */

/**
 * Profil bawaan untuk CV yang belum pernah menjawab pertanyaan pembuka.
 *
 * `pola: "umum"` dan `sudahDitanya: false` - keduanya penting. Yang pertama
 * memastikan formulir tidak berubah bentuk tanpa diminta, yang kedua
 * membedakan "belum ditanya" dari "sudah ditanya dan memang memilih umum".
 */
export function profilPortofolioBawaan(): ProfilPortofolio {
  return {
    pola: "umum",
    tujuan: "melamar-kerja",
    jenjang: "1-3-tahun",
    jurusan: "",
    bidangKamus: "",
    rumpunIlmu: "",
    industriKBLI: "",
    jenjangKKNI: 0,
    sudahDitanya: false,
  };
}

/**
 * Bagian portofolio bawaan: mati.
 *
 * Selama `aktif` bernilai false, bobot dimensi Bukti Karya adalah 0 dan lima
 * dimensi lama memakai bobot aslinya - sehingga skor CV lama benar-benar tidak
 * bergerak satu angka pun sampai penggunanya memutuskan sendiri.
 */
export function bagianPortofolioBawaan(): BagianPortofolio {
  return {
    aktif: false,
    judulPilihan: "",
    gabungKePengalaman: false,
    maksItem: 6,
    modeRedaksi: false,
  };
}

export function verifikatorKosong(): Verifikator {
  return { nama: "", jabatan: "", hubungan: "" };
}

/* -------------------------------------------------------------------------- */
/* Pembacaan berkas versi lama                                                */
/* -------------------------------------------------------------------------- */

type Rekaman = Record<string, unknown>;

function rekaman(value: unknown): Rekaman | null {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as Rekaman)
    : null;
}

function teks(value: unknown): string {
  return typeof value === "string" ? value : "";
}

/**
 * Mengubah kunci field menjadi label yang terbaca manusia.
 *
 * Dipakai saat memindahkan field khusus versi lama ke slot fleksibel: labelnya
 * tidak diketahui kode ini, jadi yang tersisa hanyalah nama kuncinya sendiri.
 * "hasilJadwalBiaya" -> "Hasil jadwal biaya". Jelek, tapi jujur - dan pengguna
 * dapat menyuntingnya.
 */
export function labelDariKunci(kunci: string): string {
  const dipisah = kunci
    .replace(/[_-]+/g, " ")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .trim()
    .toLowerCase();
  return dipisah ? dipisah.charAt(0).toUpperCase() + dipisah.slice(1) : kunci;
}

function nilaiInti(value: unknown): IntiValue | null {
  if (typeof value === "string" || typeof value === "number") return value;
  if (Array.isArray(value)) {
    const daftar = value.filter((v): v is string => typeof v === "string");
    return daftar.length > 0 ? daftar : null;
  }
  return null;
}

/** Menyatakan sebuah nilai inti sebagai satu baris teks untuk slot fleksibel. */
function nilaiSebagaiTeks(value: IntiValue): string {
  if (Array.isArray(value)) return value.join(", ");
  return String(value);
}

/**
 * Memetakan bidang dari katalog versi lama ke pola.
 *
 * Katalog itu memakai slug yang sama dengan kamus bidang sekarang, jadi
 * pemetaannya adalah pencarian biasa. Bidang yang tidak dikenali jatuh ke
 * `umum` - bukan ditebak, karena menebak polanya berarti mengubah bentuk
 * formulir seseorang berdasarkan dugaan.
 */
export function polaDariBidangLama(bidang: string): {
  pola: PolaSlug;
  bidangKamus: string;
  rumpunIlmu: string;
} {
  const entri = entriKamus(bidang);
  if (!entri) return { pola: "umum", bidangKamus: "", rumpunIlmu: "" };
  return {
    pola: entri.polaDisarankan,
    bidangKamus: entri.slug,
    rumpunIlmu: entri.rumpunIlmu,
  };
}

/**
 * Menormalkan satu dokumen CV mentah sebelum divalidasi skema.
 *
 * Dipanggil untuk berkas JSON hasil ekspor - baik dari versi ini, dari versi
 * yang sudah memakai katalog bidang, maupun dari versi paling awal yang belum
 * mengenal portofolio sama sekali. Yang belum ada diisi bawaannya; yang sudah
 * ada tidak pernah disentuh.
 */
export function migrasiDokumenCV(masuk: unknown): unknown {
  const dokumen = rekaman(masuk);
  if (!dokumen) return masuk;

  const hasil: Rekaman = { ...dokumen };

  /* --- Profil portofolio ------------------------------------------------ */

  const profilAda = rekaman(dokumen["profilPortofolio"]);
  if (!profilAda) {
    const profil = profilPortofolioBawaan();

    // Bentuk versi katalog bidang: { fieldProfile: { bidang, jenjang, ... } }.
    const fieldProfile = rekaman(dokumen["fieldProfile"]);
    const bidangLama = teks(fieldProfile?.["bidang"]);
    if (bidangLama) {
      const petakan = polaDariBidangLama(bidangLama);
      profil.pola = petakan.pola;
      profil.bidangKamus = petakan.bidangKamus;
      profil.rumpunIlmu = petakan.rumpunIlmu;
      profil.jurusan = teks(fieldProfile?.["jurusan"]) || bidangLama;
      // Bidangnya memang sudah dipilih pengguna, tetapi tujuan dan jenjang
      // belum pernah ditanyakan kepadanya - jadi ia tetap perlu ditanya.
      profil.sudahDitanya = false;
    }

    hasil["profilPortofolio"] = profil;
  }

  if (!rekaman(dokumen["portofolio"])) {
    hasil["portofolio"] = bagianPortofolioBawaan();
  }

  /* --- Item ------------------------------------------------------------- */

  if (Array.isArray(dokumen["projects"])) {
    const pola = (rekaman(hasil["profilPortofolio"])?.["pola"] ??
      "umum") as PolaSlug;
    hasil["projects"] = dokumen["projects"].map((item) =>
      migrasiItemPortofolio(item, pola),
    );
  }

  hasil["schemaVersion"] = VERSI_SKEMA_CV;
  return hasil;
}

/**
 * Memindahkan field khusus versi lama ke rumah barunya.
 *
 * Aturannya satu kalimat: apa pun yang tidak dikenali skema pola tidak dibuang,
 * melainkan masuk ke slot fleksibel dengan labelnya sendiri. Slot itu memang
 * dibuat untuk ini - dan karena isinya tidak pernah menentukan bentuk formulir,
 * ia tidak dapat merusak apa pun.
 */
export function migrasiItemPortofolio(masuk: unknown, pola: PolaSlug): unknown {
  const item = rekaman(masuk);
  if (!item) return masuk;

  const hasil: Rekaman = { ...item };
  const khusus = rekaman(item["khusus"]);
  if (!khusus) return hasil;

  const kunciPola = new Set(kunciFieldInti(pola));
  const inti: Record<string, IntiValue> = {
    ...(rekaman(item["inti"]) as Record<string, IntiValue> | null),
  };
  const detail: DetailTambahan[] = Array.isArray(item["detailTambahan"])
    ? (item["detailTambahan"] as DetailTambahan[])
    : [];

  let prioritas = detail.length + 1;
  for (const [kunci, mentah] of Object.entries(khusus)) {
    const nilai = nilaiInti(mentah);
    if (nilai === null || nilai === "") continue;

    if (kunciPola.has(kunci)) {
      if (inti[kunci] === undefined) inti[kunci] = nilai;
      continue;
    }
    detail.push({
      label: labelDariKunci(kunci),
      nilai: nilaiSebagaiTeks(nilai),
      satuan: "",
      prioritas: prioritas++,
    });
  }

  hasil["inti"] = inti;
  hasil["detailTambahan"] = detail;
  delete hasil["khusus"];
  return hasil;
}

/** Kunci field inti sebuah pola. Slug tak dikenal tidak punya satu pun. */
function kunciFieldInti(pola: PolaSlug): string[] {
  if (!SEMUA_POLA.includes(pola)) return [];
  return POLA_SCHEMAS[pola].fieldInti.map((field) => field.key);
}

/* -------------------------------------------------------------------------- */
/* Pembacaan tautan                                                           */
/* -------------------------------------------------------------------------- */

/**
 * Daftar tautan sebuah item, termasuk yang tersimpan di kolom `url` lama.
 *
 * Diturunkan, bukan disalin. Menyalin `url` ke dalam `tautan` saat migrasi akan
 * membuat satu tautan tersimpan di dua tempat, dan dua tempat itu pasti
 * berbeda begitu penggunanya menyunting salah satunya.
 */
export function tautanItem(item: {
  url?: string;
  tautan?: TautanPortofolio[];
}): TautanPortofolio[] {
  if (item.tautan && item.tautan.length > 0) return item.tautan;
  const url = (item.url ?? "").trim();
  return url ? [{ label: "", url }] : [];
}

/** Verifikator dianggap terisi hanya bila namanya ada. */
export function verifikatorTerisi(v: Verifikator | null | undefined): boolean {
  return Boolean(v && v.nama.trim());
}

import { EFEK_JENJANG, TAHAP_EKSEKUSI } from "@/lib/portfolio/pola-schemas";
import { kamusProfil, skemaProfil } from "@/lib/portfolio/profil";
import { portofolioAktif, tautanTercetak } from "@/lib/portfolio/render";
import type { FieldDef, IntiValue, PolaSchema } from "@/lib/portfolio/types";
import type { ProjectItem, ResumeData } from "@/lib/resume/types";
import { ACTION_VERBS } from "./vocabulary";
import { tokenize } from "./keywords";

/**
 * ============================================================================
 *  KEKUATAN BUKTI - MODEL P × Q × R
 * ============================================================================
 *
 * Rubriknya diambil dari model yang dipakai PII untuk menilai kompetensi
 * insinyur Indonesia (FAIP), dan dipilih karena satu alasan teknis: ia bekerja
 * pada level **item**, bukan level dokumen, sehingga tiap angka dapat
 * ditelusuri ke isian yang menyebabkannya.
 *
 *   Q - peranan          0-3
 *   R - tingkat kesulitan 0-3
 *   skor item = (Q × R) / 9 × 100, lalu disesuaikan, dijepit 0-100
 *   P - banyaknya pengalaman, dipakai sebagai pengali agregat
 *
 * Dua hal yang sengaja **tidak** diambil dari FAIP:
 *
 *  1. **Ambang 600 / 3.000 / 6.000 tidak dipakai sebagai skala.** Angka itu
 *     untuk akumulasi karier 3, 8, dan 16 tahun - meminjam strukturnya benar,
 *     meminjam angkanya salah kategori. Penyesuaian senioritas masuk lewat
 *     jenjang (batas bawah jumlah item), bukan lewat ambang itu.
 *  2. **Penilaian manusia.** FAIP dinilai asesor yang membaca narasi; di sini
 *     seluruhnya deterministik, sehingga data yang sama selalu menghasilkan
 *     angka yang sama dan dapat diuji.
 *
 * Pemetaan field ke ketiga syarat R tidak ditulis di berkas ini, melainkan
 * dibaca dari penanda `rubrik` pada tiap FieldDef di pola-schemas.ts - aturan
 * yang sama dengan seluruh bagian lain fitur ini: percabangan per pola tinggal
 * di registry, bukan di kode yang memakainya.
 */

/** Kata peran yang tidak memberi tahu apa pun tentang siapa yang mengerjakan. */
const PERAN_GENERIK = [
  "anggota",
  "anggota tim",
  "peserta",
  "kontributor",
  "tim",
  "member",
  "participant",
  "contributor",
];

export interface PenyesuaianItem {
  jenis: "verifikator-lengkap" | "refleksi-terisi" | "tanpa-tautan-valid";
  nilai: number;
}

export interface NilaiItem {
  id: string;
  judul: string;
  q: number;
  r: number;
  /** (Q × R) / 9 × 100, sebelum penyesuaian. */
  dasar: number;
  penyesuaian: PenyesuaianItem[];
  /** Setelah penyesuaian, dijepit 0-100. */
  skor: number;
}

export interface NilaiBuktiKarya {
  /** Skor bagian 0-100: rata-rata item terbaik dikali pengali P. */
  skor: number;
  /** Pengali banyaknya pengalaman. */
  p: number;
  /** Jumlah item yang dinilai. */
  n: number;
  /** Rentang jumlah item yang berlaku; batas atas null berarti tanpa batas. */
  rentang: [number, number | null];
  item: NilaiItem[];
}

/* -------------------------------------------------------------------------- */
/* Pembacaan isian                                                            */
/* -------------------------------------------------------------------------- */

function teksNilai(nilai: IntiValue | undefined): string {
  if (nilai === undefined || nilai === null) return "";
  if (Array.isArray(nilai)) return nilai.join(" ");
  return String(nilai);
}

function daftarNilai(nilai: IntiValue | undefined): string[] {
  if (Array.isArray(nilai)) return nilai.filter((v) => v.trim());
  const teks = teksNilai(nilai).trim();
  return teks ? [teks] : [];
}

/** Field pola yang mengemban peran tertentu di dalam rubrik. */
function fieldRubrik(schema: PolaSchema, peran: FieldDef["rubrik"]): FieldDef[] {
  return schema.fieldInti.filter((field) => field.rubrik === peran);
}

function adaAngka(teks: string): boolean {
  return /\d/.test(teks);
}

/**
 * Apakah teks memuat kata kerja orang pertama.
 *
 * Dua bentuk diterima, dan keduanya memang bentuk orang pertama dalam bahasa
 * Indonesia: "saya merancang" yang menyebut pelakunya, dan "Merancang ..." di
 * awal poin - bentuk baku poin CV, yang subjeknya memang dirinya sendiri.
 *
 * Yang **tidak** lolos justru itulah gunanya: poin yang dibuka dengan "Kami"
 * atau "Tim kami" tidak berawalan kata kerja, sehingga tidak dihitung. Itu
 * sesuai maksud rubriknya - perekrut tidak dapat tahu bagian mana yang
 * dikerjakan orang ini dari kalimat yang subjeknya satu tim.
 */
export function adaKataKerjaOrangPertama(teks: string): boolean {
  const bersih = teks.trim();
  if (!bersih) return false;
  if (/\bsaya\s+[a-z]/i.test(bersih)) return true;
  const pertama = tokenize(bersih)[0];
  return pertama ? ACTION_VERBS.has(pertama) : false;
}

/* -------------------------------------------------------------------------- */
/* Q - peranan                                                                */
/* -------------------------------------------------------------------------- */

/**
 * Q, nilai 0-3, dibaca dari peran, poin, dan tahap keterlibatan.
 *
 *   0  peran kosong, atau hanya kata generik
 *   1  peran spesifik disebut, tapi tanpa kata kerja apa pun
 *   2  peran spesifik dan minimal satu kata kerja orang pertama
 *   3  nilai 2, dan tahap keterlibatannya mencapai tahap eksekusi
 */
export function nilaiQ(item: ProjectItem, schema: PolaSchema): number {
  const peran = item.role.trim().toLowerCase();
  if (!peran) return 0;
  if (PERAN_GENERIK.includes(peran)) return 0;

  const kalimat = [
    ...item.bullets,
    item.ringkasan,
    ...Object.values(item.inti).map(teksNilai),
  ];
  if (!kalimat.some(adaKataKerjaOrangPertama)) return 1;

  // Tahap eksekusi: dibaca dari field yang ditandai berperan "tahap" pada pola
  // ini. Pola yang tidak punya padanannya berhenti di nilai 2 - dan itu memang
  // arti rubriknya, bukan kelalaian pemetaan.
  const tahap = fieldRubrik(schema, "tahap").flatMap((field) =>
    daftarNilai(item.inti[field.key]),
  );
  const sampaiEksekusi = tahap.some((nilai) =>
    TAHAP_EKSEKUSI.some((eksekusi) =>
      nilai.toLowerCase().includes(eksekusi.toLowerCase()),
    ),
  );
  return sampaiEksekusi ? 3 : 2;
}

/* -------------------------------------------------------------------------- */
/* R - tingkat kesulitan                                                      */
/* -------------------------------------------------------------------------- */

/**
 * R, nilai 0-3 - jumlah syarat yang terpenuhi:
 *
 *   (a) skala terisi dengan angka dan satuan
 *   (b) standar atau metode memuat minimal satu entri
 *   (c) hasil memuat angka
 *
 * `detailTambahan` sengaja tidak ikut. Isinya memang milik penggunanya dan
 * tetap dihitung di Kecocokan Lowongan, tetapi membiarkannya menaikkan R akan
 * membuat siapa pun dapat menaikkan tingkat kesulitan proyeknya hanya dengan
 * menambah baris di slot fleksibel.
 */
export function nilaiR(item: ProjectItem, schema: PolaSchema): number {
  let r = 0;

  const skala = fieldRubrik(schema, "skala").map((field) =>
    teksNilai(item.inti[field.key]),
  );
  // "Angka dan satuan": ada digitnya, dan ada sesuatu selain digit -
  // "8.400 m2" lolos, "8400" saja tidak.
  if (skala.some((nilai) => adaAngka(nilai) && /[a-z%]/i.test(nilai))) r += 1;

  const standar = fieldRubrik(schema, "standar").flatMap((field) =>
    daftarNilai(item.inti[field.key]),
  );
  if (standar.length > 0) r += 1;

  const hasil = fieldRubrik(schema, "hasil").map((field) =>
    teksNilai(item.inti[field.key]),
  );
  if (hasil.some(adaAngka)) r += 1;

  return r;
}

/* -------------------------------------------------------------------------- */
/* Skor satu item                                                             */
/* -------------------------------------------------------------------------- */

export function nilaiItem(
  item: ProjectItem,
  schema: PolaSchema,
): NilaiItem {
  const q = nilaiQ(item, schema);
  const r = nilaiR(item, schema);
  const dasar = ((q * r) / 9) * 100;

  const penyesuaian: PenyesuaianItem[] = [];
  for (const aturan of schema.aturanSkor) {
    switch (aturan.jenis) {
      case "verifikator-lengkap":
        if (item.verifikator.nama.trim()) {
          penyesuaian.push({ jenis: aturan.jenis, nilai: aturan.nilai });
        }
        break;
      case "refleksi-terisi":
        // Sekali per item, tidak akumulatif - dan tidak ada jalur lain yang
        // menambah nilai dari field ini.
        if (item.refleksi.trim().length >= aturan.minKarakter) {
          penyesuaian.push({ jenis: aturan.jenis, nilai: aturan.nilai });
        }
        break;
      case "tanpa-tautan-valid":
        if (tautanTercetak(item).length === 0) {
          penyesuaian.push({ jenis: aturan.jenis, nilai: aturan.nilai });
        }
        break;
    }
  }

  const jumlah = penyesuaian.reduce((total, p) => total + p.nilai, dasar);
  return {
    id: item.id,
    judul: item.name,
    q,
    r,
    dasar,
    penyesuaian,
    skor: Math.min(100, Math.max(0, jumlah)),
  };
}

/* -------------------------------------------------------------------------- */
/* P dan skor bagian                                                          */
/* -------------------------------------------------------------------------- */

/**
 * Pengali banyaknya pengalaman.
 *
 * Batas atas `null` ditangani lebih dulu dan secara eksplisit. Tanpa itu,
 * `n > b` pada pola Publikasi & Kredit membandingkan angka dengan null,
 * memberi hasil yang benar secara kebetulan pada sebagian nilai dan salah pada
 * sisanya - dan pola itu justru satu-satunya yang makin banyak makin baik.
 *
 * Kelebihan item **tidak** dihukum. Yang lebih dari batas atas hanya tidak
 * ikut dirata-ratakan; hanya item terkuat sebanyak batas atas yang dihitung.
 */
export function pengaliP(n: number, rentang: [number, number | null]): number {
  const [bawah] = rentang;
  if (n <= 0) return 0;
  if (bawah <= 0) return 1;
  return n < bawah ? n / bawah : 1;
}

/**
 * Rentang jumlah item yang berlaku: pola, ditimpa kamus bila bidangnya memang
 * lazim berbeda, lalu batas bawahnya diturunkan untuk jenjang pemula.
 */
export function rentangBerlaku(data: ResumeData): [number, number | null] {
  const schema = skemaProfil(data.profilPortofolio);
  const kamus = kamusProfil(data.profilPortofolio);
  const dasar =
    kamus?.rentangItemIdeal && kamus.polaDisarankan === data.profilPortofolio.pola
      ? kamus.rentangItemIdeal
      : schema.rentangItemIdeal;
  const efek = EFEK_JENJANG[data.profilPortofolio.jenjang];
  return [efek.batasBawahItem ?? dasar[0], dasar[1]];
}

/**
 * Item yang dinilai.
 *
 * Pola menentukan bagian mana yang aktif: lima pola bekerja pada bagian
 * `project`, Publikasi & Kredit pada bagian `publication`. Karya terbit
 * dipetakan ke bentuk item agar rubrik yang sama dapat membacanya tanpa
 * ditulis dua kali.
 */
export function itemDinilai(data: ResumeData): ProjectItem[] {
  const schema = skemaProfil(data.profilPortofolio);
  if (schema.bagian === "project") return data.projects;

  return data.publications.map((p) => ({
    id: p.id,
    name: p.title,
    role: p.peranSaya,
    url: p.url,
    startDate: p.date,
    endDate: p.date,
    bullets: [],
    konteks: p.publisher,
    lokasi: "",
    ringkasan: "",
    tautan: [],
    kataKunci: [],
    inti: {
      tipeLuaran: p.tipeLuaran,
      sitasiLengkap: p.title,
      venue: p.publisher,
      peranSaya: p.peranSaya,
      indeksasiTier: p.indeksasiTier,
      pengenalPersisten: p.url || p.doi,
    },
    detailTambahan: [],
    verifikator: { nama: "", jabatan: "", hubungan: "" },
    refleksi: "",
    polaOverride: "",
    parentPengalamanId: "",
    arsip: {},
  }));
}

/**
 * Nilai bagian Bukti Karya, 0-100.
 *
 * Skor bagian = rata-rata skor `b` item terbaik (atau seluruhnya bila `b`
 * null), dikali pengali P.
 */
export function nilaiBuktiKarya(data: ResumeData): NilaiBuktiKarya {
  const schema = skemaProfil(data.profilPortofolio);
  const rentang = rentangBerlaku(data);
  const items = portofolioAktif(data) ? itemDinilai(data) : [];

  const dinilai = items.map((item) => nilaiItem(item, schema));
  const n = dinilai.length;
  const p = pengaliP(n, rentang);

  if (n === 0) {
    return { skor: 0, p, n, rentang, item: dinilai };
  }

  const [, atas] = rentang;
  const terbaik = [...dinilai].sort((a, b) => b.skor - a.skor);
  const dihitung = atas === null ? terbaik : terbaik.slice(0, atas);
  const rata =
    dihitung.reduce((total, item) => total + item.skor, 0) / dihitung.length;

  return {
    skor: Math.min(100, Math.max(0, rata * p)),
    p,
    n,
    rentang,
    item: dinilai,
  };
}

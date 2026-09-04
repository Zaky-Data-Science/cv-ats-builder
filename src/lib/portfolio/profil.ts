import { entriKamus } from "./kamus-bidang";
import { EFEK_TUJUAN, polaSchema } from "./pola-schemas";
import type {
  EntriKamus,
  JenjangPengalaman,
  PolaSchema,
  PolaSlug,
  ProfilPortofolio,
  TujuanCV,
} from "./types";

/**
 * ============================================================================
 *  MENYUSUN PROFIL PORTOFOLIO
 * ============================================================================
 *
 * Seluruh percabangan "bidang ini polanya apa" tinggal di berkas ini, bukan di
 * komponen. Aturannya keras dan sengaja: tidak boleh ada `if (pola === ...)`
 * atau `if (bidang === ...)` di dalam komponen mana pun. Begitu ada satu saja,
 * menambah profesi baru berhenti menjadi "tambah satu entri kamus".
 */

/**
 * Pola yang berlaku untuk sebuah bidang, setelah tujuan CV diperhitungkan.
 *
 * Tujuan dapat memaksakan pola tertentu - arsitek yang mengurus lisensi butuh
 * rekaman kompetensi, bukan booklet karya, meskipun bidangnya sama. Bila tujuan
 * memaksa lebih dari satu kemungkinan, yang dipakai adalah yang paling dekat
 * dengan bidangnya sendiri.
 */
export function polaUntuk(
  entri: EntriKamus | null | undefined,
  tujuan: TujuanCV,
): PolaSlug {
  const paksa = EFEK_TUJUAN[tujuan]?.polaPaksa;
  if (!paksa || paksa.length === 0) return entri?.polaDisarankan ?? "umum";

  const dekat: PolaSlug[] = entri
    ? [entri.polaDisarankan, ...(entri.polaAlternatif ?? [])]
    : [];
  return paksa.find((pola) => dekat.includes(pola)) ?? paksa[0];
}

/** Menerapkan pilihan bidang. Jurusan yang diketik pengguna ikut disimpan. */
export function terapkanBidang(
  profil: ProfilPortofolio,
  entri: EntriKamus,
  jurusanDiketik: string,
): ProfilPortofolio {
  return {
    ...profil,
    jurusan: jurusanDiketik.trim() || entri.nama,
    bidangKamus: entri.slug,
    rumpunIlmu: entri.rumpunIlmu,
    pola: polaUntuk(entri, profil.tujuan),
  };
}

/**
 * Menerapkan pilihan tujuan.
 *
 * Polanya ikut dihitung ulang dari bidang yang sudah dipilih - itu memang
 * gunanya sumbu ini. Bila penggunanya sudah pernah mengganti pola sendiri,
 * pilihan itu dipertahankan: sumbu tujuan mengusulkan, bukan memaksa apa yang
 * sudah diputuskan orangnya.
 */
export function terapkanTujuan(
  profil: ProfilPortofolio,
  tujuan: TujuanCV,
  polaDipilihManual = false,
): ProfilPortofolio {
  if (polaDipilihManual) return { ...profil, tujuan };
  const entri = profil.bidangKamus ? entriKamus(profil.bidangKamus) : null;
  return { ...profil, tujuan, pola: polaUntuk(entri, tujuan) };
}

export function terapkanJenjang(
  profil: ProfilPortofolio,
  jenjang: JenjangPengalaman,
): ProfilPortofolio {
  return { ...profil, jenjang };
}

/** Bidang tidak ada di kamus: fallback, tanpa menebak. */
export function terapkanBidangTakDikenal(
  profil: ProfilPortofolio,
  jurusanDiketik: string,
): ProfilPortofolio {
  return {
    ...profil,
    jurusan: jurusanDiketik.trim(),
    bidangKamus: "",
    rumpunIlmu: "",
    pola: "umum",
  };
}

/** Skema pola yang berlaku untuk sebuah profil. */
export function skemaProfil(profil: ProfilPortofolio): PolaSchema {
  return polaSchema(profil.pola);
}

/**
 * Skema yang mengendalikan sebuah bagian CV.
 *
 * Pola menentukan bagian mana yang aktif: Publikasi & Kredit bekerja pada
 * bagian `publication`, lima pola lainnya pada bagian `project`. Bagian yang
 * bukan miliknya tetap ada dan tetap dapat diisi - tetapi memakai bentuk
 * umum, bukan bentuk pola yang tidak berlaku baginya. Tanpa aturan ini,
 * seorang dosen akan menemukan bagian Proyek yang meminta sitasi lengkap dan
 * indeksasi Scopus.
 */
export function skemaBagian(
  profil: ProfilPortofolio,
  bagian: "project" | "publication",
): PolaSchema {
  const schema = polaSchema(profil.pola);
  return schema.bagian === bagian ? schema : polaSchema("umum");
}

/** Entri kamus yang sedang dipakai, bila ada. */
export function kamusProfil(profil: ProfilPortofolio): EntriKamus | null {
  return (profil.bidangKamus && entriKamus(profil.bidangKamus)) || null;
}

/**
 * Rentang jumlah item yang berlaku, setelah kamus dan jenjang dipertimbangkan.
 *
 * Urutannya penting: kamus boleh menaikkan batasnya (booklet arsitektur memang
 * lebih tebal), jenjang hanya boleh menurunkan batas bawahnya. Yang dilindungi
 * di sini adalah pengguna pemula - bukan kerapian angkanya.
 */
export function rentangItem(
  profil: ProfilPortofolio,
  efekJenjangBatasBawah?: number,
): [number, number | null] {
  const schema = skemaProfil(profil);
  const entri = kamusProfil(profil);
  const dasar =
    entri?.rentangItemIdeal && entri.polaDisarankan === profil.pola
      ? entri.rentangItemIdeal
      : schema.rentangItemIdeal;
  return [efekJenjangBatasBawah ?? dasar[0], dasar[1]];
}

import { formatDateRange, joinNonEmpty, prettyUrl, ensureHttp } from "@/lib/utils";
import type { ProjectItem, ResumeData, ResumeLanguage } from "@/lib/resume/types";
import { judulBagian, polaSchema } from "./pola-schemas";
import {
  deskriptorGenerik,
  konteksAdalahNamaKlien,
  samarkanAngka,
  samarkanKonteks,
  sapuNama,
} from "./redaksi";
import type { FieldDef, IntiValue, PolaSchema, TautanPortofolio } from "./types";

/**
 * ============================================================================
 *  BENTUK ITEM PORTOFOLIO SAAT DICETAK
 * ============================================================================
 *
 * Satu berkas ini dipakai tiga penghasil keluaran sekaligus - pratinjau (yang
 * sekaligus menjadi PDF lewat dialog cetak), teks polos, dan Word. Bukan demi
 * ringkas: kalau ketiganya menyusun kalimatnya sendiri-sendiri, cepat atau
 * lambat salah satunya berbeda, dan yang menemukan perbedaannya adalah
 * perekrut yang sedang membaca berkas kiriman pelamar.
 *
 * Dua aturan yang paling mudah dilanggar dan karena itu ditegakkan di sini:
 *
 *  1. **Tautan disandingkan, bukan dipilih salah satu.** Yang tercetak adalah
 *     teks polos yang terbaca manusia maupun pengekstrak teks, dan pranala
 *     dipasang pada teks polos itu sendiri. Alasannya sederhana: di PDF,
 *     alamat tujuan tersimpan sebagai anotasi terpisah dari aliran teks, dan
 *     di DOCX sebagai relationship terpisah dari run teksnya - keduanya tidak
 *     tersentuh ekstraksi teks biasa. Tapi rekruter membuka berkas aslinya, di
 *     mana pranala tetap berfungsi. Membuang salah satunya merugikan tanpa
 *     alasan.
 *
 *  2. **Bagian kosong tidak mencetak judul.** Bagian portofolio boleh menyala
 *     tanpa satu pun item - misalnya karena seluruh itemnya sedang menempel
 *     pada pengalaman kerja - dan dalam keadaan itu judulnya tidak boleh
 *     muncul menggantung di atas ruang kosong.
 */

/** Maksimal tautan yang dicetak per item. */
export const MAKS_TAUTAN = 2;

/** Hanya empat detail tambahan prioritas tertinggi yang ikut tercetak. */
export const MAKS_DETAIL_DICETAK = 4;

/** Pemisah antar-detail pada baris "Detail". Titik tengah, bukan tabel. */
export const PEMISAH_DETAIL = " · ";

/* -------------------------------------------------------------------------- */
/* Keadaan bagian                                                             */
/* -------------------------------------------------------------------------- */

/**
 * Apakah CV ini memakai portofolio berbasis pola.
 *
 * Selama bernilai false, seluruh render berjalan persis seperti sebelum fitur
 * ini ada - judul bagiannya "PROYEK", isinya nama, peran, tautan, poin. Itulah
 * yang membuat CV lama tidak berubah sedikit pun sampai penggunanya sendiri
 * menyalakannya.
 */
export function portofolioAktif(data: ResumeData): boolean {
  return data.portofolio.aktif;
}

/**
 * Skema pola yang berlaku untuk sebuah item portofolio.
 *
 * Item boleh menyimpang dari pola CV-nya. Yang tidak boleh: memakai pola yang
 * bekerja pada bagian lain. Pola Publikasi & Kredit mengendalikan bagian
 * `publication`; kalau ia dipaksakan ke bagian `project`, isian item akan
 * diminta dalam bentuk sitasi dan indeksasi jurnal. Dalam keadaan itu yang
 * dipakai adalah bentuk umum.
 */
export function skemaItem(data: ResumeData, item: ProjectItem): PolaSchema {
  const schema = polaSchema(item.polaOverride || data.profilPortofolio.pola);
  return schema.bagian === "project" ? schema : polaSchema("umum");
}

/** Judul bagian portofolio, dari pola dan pilihan judul penggunanya. */
export function judulPortofolio(data: ResumeData): string {
  const schema = polaSchema(data.profilPortofolio.pola);
  const berlaku = schema.bagian === "project" ? schema : polaSchema("umum");
  return judulBagian(berlaku, data.portofolio.judulPilihan);
}

/**
 * Membagi item menjadi yang berdiri sendiri dan yang menempel pada pengalaman.
 *
 * Sebagian pengurai hanya mengenali proyek bila ia bersarang di dalam satu blok
 * pengalaman kerja. Sakelar penggabungan menyediakan bentuk itu - tapi hanya
 * untuk item yang memang punya induk. Proyek lepas (freelance, tugas kuliah,
 * sumber terbuka) tetap tinggal di bagiannya sendiri meski sakelarnya menyala,
 * karena memaksanya masuk ke pengalaman kerja berarti mengarang pemberi kerja
 * yang tidak pernah ada.
 */
export function bagiItemPortofolio(data: ResumeData): {
  mandiri: ProjectItem[];
  perInduk: Map<string, ProjectItem[]>;
} {
  const perInduk = new Map<string, ProjectItem[]>();
  if (!portofolioAktif(data) || !data.portofolio.gabungKePengalaman) {
    return { mandiri: data.projects, perInduk };
  }

  const idPengalaman = new Set(data.experiences.map((e) => e.id));
  const mandiri: ProjectItem[] = [];
  for (const item of data.projects) {
    const induk = item.parentPengalamanId;
    if (induk && idPengalaman.has(induk)) {
      const daftar = perInduk.get(induk) ?? [];
      daftar.push(item);
      perInduk.set(induk, daftar);
    } else {
      mandiri.push(item);
    }
  }
  return { mandiri, perInduk };
}

/**
 * Item yang benar-benar tercetak di bawah judul bagian portofolio.
 *
 * Dipakai juga untuk memutuskan apakah judulnya dicetak sama sekali - lihat
 * isSectionVisible di lib/resume/sections.ts.
 */
export function itemBagianPortofolio(data: ResumeData): ProjectItem[] {
  return bagiItemPortofolio(data).mandiri;
}

/* -------------------------------------------------------------------------- */
/* Tautan                                                                     */
/* -------------------------------------------------------------------------- */

export interface TautanTercetak {
  /** Teks yang terbaca manusia maupun pengekstrak teks. */
  teks: string;
  /** Alamat penuh untuk pranala. Tidak pernah dipangkas. */
  href: string;
}

/**
 * Parameter pelacakan yang dibuang dari tampilan maupun pranala.
 *
 * Yang dibuang hanya parameter pelacakan yang memang tidak membawa arti apa
 * pun. Parameter lain dipertahankan: `youtube.com/watch?v=...` kehilangan
 * seluruh gunanya bila kuerinya dipangkas, dan itu justru salah satu bentuk
 * tautan yang disarankan untuk karya rekaman.
 */
const PARAM_PELACAK = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "utm_id",
  "gclid",
  "fbclid",
  "igshid",
  "mc_cid",
  "mc_eid",
  "ref_src",
];

export function bersihkanUrl(url: string): string {
  const bersih = url.trim();
  if (!bersih) return "";
  try {
    const alamat = new URL(ensureHttp(bersih));
    for (const kunci of PARAM_PELACAK) alamat.searchParams.delete(kunci);
    const kueri = alamat.searchParams.toString();
    // Garis miring penutup dibuang: "simak.example.com/" dan
    // "simak.example.com" adalah alamat yang sama, dan yang pertama terbaca
    // seperti alamat yang terpotong saat tercetak di atas kertas.
    const jalur = alamat.pathname === "/" ? "" : alamat.pathname.replace(/\/+$/, "");
    return `${alamat.origin}${jalur}${kueri ? `?${kueri}` : ""}${alamat.hash}`;
  } catch {
    // Alamat yang tidak dapat diurai dibiarkan apa adanya. Pengguna berhak
    // menulis sesuatu yang belum lengkap tanpa isinya hilang saat dicetak.
    return bersih;
  }
}

/**
 * Daftar tautan sebuah item, siap cetak.
 *
 * `teks` sudah dibuang skema dan `www.`-nya supaya enak dibaca; `href` tetap
 * alamat penuh. Keduanya, bukan salah satunya.
 */
export function tautanTercetak(item: {
  url?: string;
  tautan?: TautanPortofolio[];
}): TautanTercetak[] {
  const sumber: TautanPortofolio[] =
    item.tautan && item.tautan.length > 0
      ? item.tautan
      : (item.url ?? "").trim()
        ? [{ label: "", url: (item.url ?? "").trim() }]
        : [];

  return sumber
    .filter((t) => t.url.trim())
    .slice(0, MAKS_TAUTAN)
    .map((t) => {
      const bersih = bersihkanUrl(t.url);
      const polos = prettyUrl(bersih);
      return {
        teks: t.label.trim() ? `${t.label.trim()} - ${polos}` : polos,
        href: ensureHttp(bersih),
      };
    });
}

/* -------------------------------------------------------------------------- */
/* Baris "Detail"                                                             */
/* -------------------------------------------------------------------------- */

export interface DetailTercetak {
  label: string;
  nilai: string;
}

/** Nilai field inti sebagai satu untai teks. */
export function nilaiIntiTeks(field: FieldDef, nilai: IntiValue): DetailTercetak | null {
  if (nilai === undefined || nilai === null) return null;

  if (Array.isArray(nilai)) {
    const isi = nilai.map((v) => v.trim()).filter(Boolean);
    if (isi.length === 0) return null;

    /*
      Bentuk terstruktur "sebelum -> sesudah" dicetak sebagai perubahan, bukan
      sebagai daftar. Perekrut membaca "41 -> 24 hari" berbeda dari "lebih
      cepat", dan itulah seluruh alasan field ini dibuat berkomponen.
    */
    if (field.tipe === "delta" && field.komponen && isi.length >= 2) {
      const [metrik = "", sebelum = "", sesudah = "", waktu = ""] = nilai;
      const perubahan = joinNonEmpty([sebelum, sesudah], " → ");
      const teks = joinNonEmpty([perubahan, waktu], ", ");
      if (!teks) return null;
      return { label: metrik.trim() || field.label, nilai: teks };
    }

    return { label: field.label, nilai: isi.join(", ") };
  }

  const teks = String(nilai).trim();
  if (!teks) return null;
  return { label: field.label, nilai: teks };
}

/**
 * Isi baris "Detail": field inti yang terisi, lalu empat detail tambahan
 * berprioritas tertinggi.
 *
 * Field yang punya rumah sendiri di CV - judul, peran, venue, tautan - tidak
 * ikut, karena ia sudah tercetak di tempatnya. `simpanDi` yang menandainya.
 *
 * **Mode Redaksi dikenakan di sini, per field, bukan pada baris yang sudah
 * tergabung.** Dulu sebaliknya, dan itu akar bug yang cukup lama: begitu nilai
 * seluruh field disatukan jadi satu untai, tidak ada lagi yang tahu angka itu
 * datang dari mana, sehingga `SNI 2847` tidak dapat dibedakan dari `8.400 m²`
 * dan ikut jadi `SNI 2000-3000`. Tidak ada regex yang bisa memisahkan keduanya
 * dari untai gabungan - menumpuk heuristik di sana justru yang melahirkan bug
 * ini sejak awal. Skema field-nya yang tahu, jadi skema itu yang ditanya.
 *
 * `deskriptorRedaksi` terisi hanya saat Mode Redaksi menyala; keberadaannya
 * itu sendiri yang menyalakan penyamaran angka di fungsi ini.
 */
export function detailTercetak(
  item: ProjectItem,
  schema: PolaSchema,
  deskriptorRedaksi?: string,
  namaRahasia: string[] = [],
): DetailTercetak[] {
  const hasil: DetailTercetak[] = [];

  /*
    Dua perlakuan yang berdiri sendiri, dan memisahkannya penting.

    `sapu` mengganti nama yang sudah diketahui aplikasi. Ia dikenakan pada
    SELURUH field inti, termasuk yang bertanda `"apaadanya"` - penanda itu
    soal angka, bukan nama, jadi keduanya tidak bertabrakan. Alasannya
    konsistensi yang dilihat penggunanya: tanpa ini, nama klien hilang dari
    ringkasan lalu muncul lagi satu baris di bawahnya, di baris Detail
    ("Jenis proyek: Inspeksi pipa di PT Nusantara Energi Jaya"). Yang begitu
    lebih buruk daripada tidak menyamarkan sama sekali, karena penggunanya
    sudah melihat buktinya bekerja.

    Nama disapu lebih dulu, angkanya belakangan: nama klien boleh memuat
    angka, dan kalau angkanya disamarkan duluan namanya tidak lagi dikenali.
  */
  const sapu = (teks: string) =>
    deskriptorRedaksi ? sapuNama(teks, namaRahasia, deskriptorRedaksi) : teks;
  const sapuLaluSamarkan = (teks: string) =>
    deskriptorRedaksi ? samarkanAngka(sapu(teks)) : teks;

  const urut = [...schema.fieldInti].sort(
    (a, b) => (a.prioritas ?? 99) - (b.prioritas ?? 99),
  );
  for (const field of urut) {
    if (field.simpanDi) continue;
    const nilai = item.inti[field.key];
    if (nilai === undefined) continue;

    // Field yang isinya nama ikut disamarkan. Nama rumah sakit yang tersimpan
    // di field inti sama rahasianya dengan nama klien di kolom konteks -
    // menyamarkan satu dan membiarkan yang lain justru lebih berbahaya
    // daripada tidak menyamarkan sama sekali, karena penggunanya mengira
    // sudah aman.
    if (deskriptorRedaksi && field.redaksi === "nama") {
      hasil.push({ label: field.label, nilai: deskriptorRedaksi });
      continue;
    }

    const baris = nilaiIntiTeks(field, nilai);
    if (!baris) continue;

    // Field yang angkanya bukan besaran keluar tanpa penyamaran angka - tetapi
    // namanya tetap disapu. Sisanya kena keduanya, termasuk pada labelnya,
    // karena label field berbentuk `delta` diambil dari nama metrik yang
    // diketik sendiri oleh penggunanya.
    if (field.redaksi === "apaadanya") {
      hasil.push({ label: sapu(baris.label), nilai: sapu(baris.nilai) });
      continue;
    }
    hasil.push({
      label: sapuLaluSamarkan(baris.label),
      nilai: sapuLaluSamarkan(baris.nilai),
    });
  }

  // Detail tambahan tetap disamarkan: labelnya maupun isinya diketik bebas,
  // jadi tidak ada skema yang bisa menjamin angkanya bukan besaran. Bawaan
  // yang aman lebih tepat di sini.
  const tambahan = [...item.detailTambahan]
    .filter((d) => d.label.trim() && d.nilai.trim())
    .sort((a, b) => a.prioritas - b.prioritas)
    .slice(0, MAKS_DETAIL_DICETAK);
  for (const d of tambahan) {
    hasil.push({
      label: sapuLaluSamarkan(d.label.trim()),
      nilai: sapuLaluSamarkan(
        joinNonEmpty([d.nilai.trim(), d.satuan.trim()], " "),
      ),
    });
  }

  return hasil;
}

/** Detail tambahan yang tersimpan tetapi tidak ikut tercetak. */
export function detailTidakDicetak(item: ProjectItem): number {
  const terisi = item.detailTambahan.filter(
    (d) => d.label.trim() && d.nilai.trim(),
  ).length;
  return Math.max(0, terisi - MAKS_DETAIL_DICETAK);
}

export function barisDetail(
  item: ProjectItem,
  schema: PolaSchema,
  deskriptorRedaksi?: string,
  namaRahasia: string[] = [],
): string {
  return detailTercetak(item, schema, deskriptorRedaksi, namaRahasia)
    .map((d) => `${d.label}: ${d.nilai}`)
    .join(PEMISAH_DETAIL);
}

/* -------------------------------------------------------------------------- */
/* Satu item, siap cetak                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Nama yang sudah diketahui aplikasi dari item ini, untuk disapu dari kalimat
 * yang diketik penggunanya sendiri.
 *
 * Sumbernya hanya dua, dan keduanya field: kolom Klien/institusi, dan field
 * inti yang skemanya menandai isinya sebagai nama. Tidak ada penebakan dari
 * bentuk tulisan - lihat `sapuNama` di `redaksi.ts` untuk alasannya.
 *
 * Konteks yang memang bukan nama klien ("Freelance", "Proyek Mandiri") tidak
 * ikut: menyapunya menghapus keterangan yang justru jujur.
 */
export function namaRahasiaItem(
  item: ProjectItem,
  schema: PolaSchema,
): string[] {
  const nama: string[] = [];
  if (konteksAdalahNamaKlien(item.konteks)) nama.push(item.konteks.trim());

  for (const field of schema.fieldInti) {
    if (field.redaksi !== "nama") continue;
    const nilai = item.inti[field.key];
    if (typeof nilai === "string") {
      if (nilai.trim()) nama.push(nilai.trim());
    } else if (Array.isArray(nilai)) {
      for (const v of nilai) if (v.trim()) nama.push(v.trim());
    }
  }
  return nama;
}

export interface ItemTercetak {
  id: string;
  /** "Judul Karya - Peran" */
  judul: string;
  peran: string;
  /** Klien, institusi, atau "Proyek Mandiri". */
  konteks: string;
  lokasi: string;
  periode: string;
  ringkasan: string;
  /** Poin yang siap dicetak: sudah disamarkan, poin kosong sudah dibuang. */
  poin: string[];
  /**
   * Poin yang sudah disamarkan tetapi **posisinya utuh** - panjang dan
   * urutannya sama persis dengan `item.bullets`, poin kosong ikut tinggal.
   *
   * Dipakai pratinjau, dan bedanya bukan gaya. Pratinjau menulis suntingan
   * balik ke `projects.N.bullets.M` memakai nomor urut yang ia terima; kalau
   * yang diterimanya sudah disaring, satu poin kosong di atas sudah cukup
   * untuk membuat suntingan mendarat di poin yang salah. Ia juga perlu poin
   * kosong itu sendiri: poin yang baru ditambahkan selalu lahir kosong, dan
   * tanpa elemennya tidak ada yang bisa diketik.
   */
  poinSemua: string[];
  detail: string;
  tautan: TautanTercetak[];
}

/**
 * Menyusun satu item menjadi bentuk siap cetak.
 *
 * `verifikator` dan `refleksi` sengaja tidak punya tempat di sini, dan itu
 * bukan kelalaian. Yang pertama adalah data pribadi milik orang lain yang
 * tidak pernah menyetujui namanya ikut ke berkas lamaran; yang kedua adalah
 * catatan untuk diri sendiri yang hanya menambah nilai kekuatan bukti. Karena
 * keduanya tidak pernah masuk ke bentuk ini, tidak ada satu pun penghasil
 * keluaran yang dapat mencetaknya - bahkan bila suatu hari ada yang lupa.
 */
export function itemTercetak(
  data: ResumeData,
  item: ProjectItem,
  lang: ResumeLanguage,
): ItemTercetak {
  const schema = skemaItem(data, item);
  const aktif = portofolioAktif(data);

  /*
    Mode Redaksi bekerja di sini, satu tempat untuk ketiga keluaran.

    Menaruhnya di masing-masing penghasil keluaran berarti tiga tempat yang
    harus benar - dan satu saja yang terlewat sudah cukup untuk membuat nama
    klien yang dirahasiakan tercetak di berkas yang dikirim pelamar.
  */
  const redaksi = aktif && data.portofolio.modeRedaksi;
  const deskriptor = redaksi ? deskriptorGenerik(data.profilPortofolio) : "";
  const nama = redaksi ? namaRahasiaItem(item, schema) : [];

  /*
    Urutannya nama dulu, angka belakangan - dan itu bukan selera. Nama klien
    boleh memuat angka ("PT Tiga Pilar 88"); kalau angkanya disamarkan lebih
    dulu, namanya berubah bentuk dan tidak lagi cocok dengan yang tersimpan di
    kolom Klien, sehingga justru lolos.
  */
  const samarkan = (teks: string) =>
    redaksi ? samarkanAngka(sapuNama(teks, nama, deskriptor)) : teks;

  return {
    id: item.id,
    judul: samarkan(item.name),
    peran: item.role,
    konteks: aktif
      ? redaksi
        ? samarkanKonteks(item.konteks, data.profilPortofolio)
        : item.konteks
      : "",
    lokasi: aktif ? item.lokasi : "",
    periode: formatDateRange(item.startDate, item.endDate, false, lang),
    ringkasan: aktif ? samarkan(item.ringkasan) : "",
    poin: item.bullets.filter((b) => b.trim()).map(samarkan),
    poinSemua: item.bullets.map(samarkan),
    // Tidak dibungkus `samarkan`: penyamarannya sudah dikenakan per field di
    // dalam `detailTercetak`, yang tahu field mana memuat besaran dan mana
    // yang tidak. Membungkusnya lagi di sini akan mengembalikan bug itu.
    detail: aktif
      ? barisDetail(item, schema, redaksi ? deskriptor : undefined, nama)
      : "",
    tautan: aktif
      ? tautanTercetak(item)
      : (item.url ?? "").trim()
        ? [{ teks: prettyUrl(item.url), href: ensureHttp(item.url) }]
        : [],
  };
}

/**
 * Baris kepala satu item: "Judul - Peran | Konteks | Kota".
 *
 * Periodenya tidak ikut; ia dicetak rata kanan pada baris yang sama oleh
 * masing-masing penghasil keluaran.
 */
export function barisKepala(cetak: ItemTercetak): {
  utama: string;
  kedua: string;
} {
  return {
    utama: joinNonEmpty([cetak.judul, cetak.peran], " - "),
    kedua: joinNonEmpty([cetak.konteks, cetak.lokasi], " | "),
  };
}

/* -------------------------------------------------------------------------- */
/* Validasi tanggal terhadap entri induk                                      */
/* -------------------------------------------------------------------------- */

/**
 * Apakah rentang tanggal item berada di dalam rentang entri induknya.
 *
 * Pengurai yang mengharapkan proyek bersarang pada pengalaman kerja juga
 * mengharapkan tanggalnya masuk akal terhadap masa kerja itu. Yang di luar
 * rentang bukan kesalahan fatal - orang memang kadang meneruskan proyek
 * setelah keluar - tapi pengguna berhak diberi tahu sebelum ia mengirimkannya.
 */
export function tanggalDiLuarInduk(
  item: { startDate: string; endDate: string },
  induk: { startDate: string; endDate: string; isCurrent: boolean },
): boolean {
  if (!item.startDate && !item.endDate) return false;
  if (!induk.startDate) return false;

  const awalInduk = induk.startDate;
  const akhirInduk = induk.isCurrent ? "9999-12" : induk.endDate || "9999-12";

  const awalItem = item.startDate || item.endDate;
  const akhirItem = item.endDate || item.startDate;
  if (!awalItem) return false;

  return awalItem < awalInduk || akhirItem > akhirInduk;
}

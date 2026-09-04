/**
 * ============================================================================
 *  PORTOFOLIO BERBASIS POLA - BENTUK DATA
 * ============================================================================
 *
 * Bukti karya tiap profesi bentuknya berbeda total, tetapi bentuk itu hanya
 * jatuh ke sedikit **pola struktural**. Arsitek dengan booklet PDF, desainer
 * dengan studi kasus di Notion, dan pengembang dengan README di GitHub
 * memakai tiga *medium* berbeda untuk satu *struktur* yang sama:
 * konteks -> peran saya -> keputusan -> hasil -> refleksi.
 *
 * Karena itu yang menentukan bentuk formulir di aplikasi ini adalah polanya,
 * bukan jurusan penggunanya. Jurusan hanya dipakai untuk menebak polanya dan
 * memberi saran isian (lihat kamus-bidang.ts) - menambah profesi baru berarti
 * menambah satu entri kamus, bukan menulis skema baru.
 *
 * Dua berkas registry, dan pemisahannya wajib dijaga:
 *
 *   pola-schemas.ts  -> menentukan BENTUK formulir. Kode perlu tahu isinya.
 *   kamus-bidang.ts  -> menentukan ISI saran. Kode tidak perlu tahu isinya.
 *
 * Konsekuensinya satu aturan keras: tidak boleh ada `if (pola === ...)` di
 * dalam komponen. Semua percabangan dibaca dari skema pola.
 */

/* -------------------------------------------------------------------------- */
/* Sumbu-sumbu tingkat CV                                                     */
/* -------------------------------------------------------------------------- */

/** Lima pola pembuktian, ditambah satu fallback yang wajib selalu ada. */
export type PolaSlug =
  | "karya-visual"
  | "proyek-teknis"
  | "praktik-jam"
  | "karya-terkredit"
  | "dampak-program"
  | "umum";

export const SEMUA_POLA: PolaSlug[] = [
  "karya-visual",
  "proyek-teknis",
  "praktik-jam",
  "karya-terkredit",
  "dampak-program",
  "umum",
];

/**
 * CV ini untuk apa.
 *
 * Satu profesi bisa memakai pola berbeda tergantung keperluan: arsitek yang
 * melamar kerja butuh booklet karya, arsitek yang mengurus STRA butuh rekaman
 * kompetensi. Sama orangnya, sama datanya, beda rendernya - dan sumbu inilah
 * yang membedakannya.
 */
export type TujuanCV =
  | "melamar-kerja"
  | "sertifikasi-lisensi"
  | "beasiswa-akademik"
  | "tender-proyek";

export const SEMUA_TUJUAN: TujuanCV[] = [
  "melamar-kerja",
  "sertifikasi-lisensi",
  "beasiswa-akademik",
  "tender-proyek",
];

/**
 * Sejauh mana pengalaman pengguna.
 *
 * Menentukan field mana yang wajib. Tanpa sumbu ini, mahasiswa - sebagian
 * besar pengguna aplikasi ini - menghadapi formulir yang mensyaratkan
 * verifikator, hasil terukur berangka, dan standar/kode yang memang belum
 * mereka punya, lalu memperoleh skor rendah tanpa jalan keluar.
 */
export type JenjangPengalaman =
  | "mahasiswa"
  | "baru-lulus"
  | "1-3-tahun"
  | "4-8-tahun"
  | "di-atas-8-tahun";

export const SEMUA_JENJANG: JenjangPengalaman[] = [
  "mahasiswa",
  "baru-lulus",
  "1-3-tahun",
  "4-8-tahun",
  "di-atas-8-tahun",
];

/** Jenjang KKNI 1-9. 0 berarti belum ditentukan. */
export type JenjangKKNI = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

/**
 * Profil portofolio sebuah CV.
 *
 * Perhatikan bahwa `jurusan`, `bidangKamus`, `rumpunIlmu`, dan `industriKBLI`
 * adalah **metadata**: keempatnya tidak menentukan bentuk formulir, hanya
 * dipakai untuk saran isian, pencarian, dan bobot kata kunci. Keempatnya juga
 * sengaja disimpan terpisah dan tidak dilebur menjadi satu field "bidang",
 * karena keempatnya mengukur hal yang berbeda: KKNI mengukur senioritas,
 * rumpun ilmu mengukur disiplin, KBLI mengukur industri. Tidak ada satu pun
 * taksonomi resmi Indonesia yang merupakan taksonomi bidang pekerjaan.
 */
export interface ProfilPortofolio {
  pola: PolaSlug;
  tujuan: TujuanCV;
  jenjang: JenjangPengalaman;

  /** Teks bebas yang diketik pengguna, mis. "Ahwal Syakhshiyyah". */
  jurusan: string;
  /** Slug entri kamus yang cocok, mis. "sipil-konstruksi". "" bila tidak ada. */
  bidangKamus: string;
  /** Salah satu dari enam rumpun UU 12/2012. Turunan dari jurusan. */
  rumpunIlmu: string;
  /** Kategori KBLI - hanya untuk bobot kata kunci sekunder. */
  industriKBLI: string;
  jenjangKKNI: JenjangKKNI;

  /**
   * Apakah pengguna sudah menjawab pertanyaan pembuka.
   *
   * Dibutuhkan karena jawaban bawaan ("umum", "melamar-kerja") tidak dapat
   * dibedakan dari jawaban yang memang dipilih pengguna. Tanpa penanda ini,
   * seseorang yang sadar memilih "Umum" akan ditanya lagi setiap kali ia
   * membuka CV-nya.
   */
  sudahDitanya: boolean;
}

/**
 * Pengaturan bagian portofolio.
 *
 * Isinya **tidak** memuat daftar item. Itu bukan kelalaian: bagian `project`
 * sudah ada di aplikasi ini sejak awal dan bentuknya nyaris sama dengan
 * "field umum" portofolio, jadi yang dikerjakan adalah memperluas bagian itu -
 * bukan menambah bagian kedua yang tumpang tindih dengannya. Daftar itemnya
 * karena itu tetap tinggal di `ResumeData.projects`.
 *
 * Untuk pola `karya-terkredit` yang berlaku adalah bagian `publication`, yang
 * juga sudah ada dan memang persis pola itu dalam bentuk sederhana. Pola yang
 * menentukan bagian mana yang aktif - lihat `PolaSchema.bagian`.
 */
export interface BagianPortofolio {
  aktif: boolean;
  /** Hanya boleh diisi dari `headingAlternatif` pola. "" = pakai headingCV. */
  judulPilihan: string;
  /**
   * Merender item portofolio sebagai sub-entri di dalam PENGALAMAN KERJA.
   *
   * Sebagian pengurai memperlakukan proyek sebagai anak dari pengalaman
   * kerja, bukan bagian setara. Sakelar ini menawarkan bentuk itu - sebagai
   * pilihan, tidak pernah dinyalakan sendiri, karena mengubah struktur CV
   * seseorang tanpa ia sadari adalah kejutan yang buruk.
   */
  gabungKePengalaman: boolean;
  maksItem: number;
  /** Mengganti nama klien dengan deskriptor generik dan angka pasti dengan rentang. */
  modeRedaksi: boolean;
}

/* -------------------------------------------------------------------------- */
/* Bagian-bagian sebuah item                                                  */
/* -------------------------------------------------------------------------- */

/** Nilai satu field inti. Bentuk terstruktur disimpan sebagai array terurut. */
export type IntiValue = string | number | string[];

export interface TautanPortofolio {
  /** Teks yang dibaca manusia, mis. "Repositori". */
  label: string;
  /** URL penuh. Yang dipangkas hanya tampilannya, bukan yang disimpan. */
  url: string;
}

/**
 * Slot fleksibel: rumah bagi detail khas bidang yang tidak masuk field inti.
 *
 * Inilah yang menggantikan ratusan definisi field khusus per profesi. Luas
 * bangunan, jumlah lapisan PCB, capaian hafalan dalam juz, dan lead time
 * gudang semuanya berbentuk sama - label, nilai, satuan - sehingga tidak ada
 * satu pun alasan menuliskannya sebagai field terpisah di dalam kode.
 */
export interface DetailTambahan {
  label: string;
  nilai: string;
  satuan: string;
  /** 1 = paling penting. Hanya empat teratas yang dicetak di CV. */
  prioritas: number;
}

/**
 * Orang yang dapat memastikan kebenaran sebuah item.
 *
 * WAJIB DIPERLAKUKAN SEBAGAI DATA PRIBADI MILIK ORANG LAIN. Yang tersimpan di
 * sini adalah nama seseorang yang tidak pernah menyetujui penyimpanannya oleh
 * aplikasi ini, sehingga UU 27/2022 berlaku - bukan sekadar etika. Tiga
 * kewajiban yang mengikutinya: ada penjelasan di bawah fieldnya, ikut terhapus
 * saat akun dihapus (dijamin ON DELETE CASCADE dari tabel resumes), dan tidak
 * pernah ikut ke berkas ekspor mana pun.
 *
 * Dianggap kosong bila `nama` kosong.
 */
export interface Verifikator {
  nama: string;
  jabatan: string;
  hubungan: string;
}

/* -------------------------------------------------------------------------- */
/* Skema pola - menentukan bentuk formulir                                    */
/* -------------------------------------------------------------------------- */

export type FieldTipe =
  | "teks"
  | "angka"
  | "pilihan"
  | "multi"
  | "tanggal"
  | "teks_panjang"
  | "url"
  | "angka_satuan"
  | "delta";

export interface FieldDef {
  key: string;
  label: string;
  tipe: FieldTipe;
  /** Pilihan tetap untuk tipe `pilihan`, atau saran awal untuk tipe `multi`. */
  opsi?: string[];
  satuan?: string;
  /** Contoh nyata. Tidak pernah berbunyi "isi di sini". */
  placeholder: string;
  /** Satu kalimat: kenapa perekrut bidang ini mencarinya. */
  bantuan: string;
  wajib?: boolean;
  prioritas?: number;
  /**
   * Untuk tipe terstruktur (`delta`, dan `multi` berpasangan): nama tiap
   * komponen, sesuai urutan penyimpanannya di dalam `IntiValue` berbentuk
   * array. Membuat urutannya terbaca kode maupun manusia.
   */
  komponen?: string[];
  /**
   * Kolom bawaan tempat nilainya disimpan, bila field ini memang sudah punya
   * rumah sendiri di model data lama (mis. `publisher` pada publikasi).
   * Kosong berarti nilainya tinggal di `inti`.
   *
   * Adanya pemetaan ini yang membuat perluasan `project` dan `publication`
   * tidak menduplikasi data yang sudah tersimpan sejak versi pertama.
   */
  simpanDi?: string;
}

/** Penyesuaian skor tingkat item. Angkanya dari rubrik, bukan dikarang. */
export type SkorRule =
  | { jenis: "verifikator-lengkap"; nilai: 8 }
  | { jenis: "refleksi-terisi"; minKarakter: 80; nilai: 4 }
  | { jenis: "tanpa-tautan-valid"; nilai: -15 };

/** Blok ringkasan yang meniru cara regulator menilai (hanya `praktik-jam`). */
export interface AgregatDef {
  /** Entri di ambang-profesi.ts yang boleh dipilih pengguna. */
  ambangSlugs: string[];
  /** Sanggahan yang tidak dapat ditutup, tampil di bawah progress bar. */
  sanggahan: string;
}

/**
 * Satu pola pembuktian.
 *
 * `rentangItemIdeal` boleh berbatas atas `null`, dan itu bukan kelalaian:
 * `karya-terkredit` adalah satu-satunya pola yang makin banyak makin baik.
 * Setiap perhitungan yang memakai batas atas ini wajib menangani `null` secara
 * eksplisit.
 */
export interface PolaSchema {
  slug: PolaSlug;
  nama: string;
  /** Kalimat yang ditampilkan di pemilih, ditulis dari sudut pandang pengguna. */
  kalimatPenjelas: string;
  /** Bagian CV yang dikendalikan pola ini. */
  bagian: "project" | "publication";
  headingCV: string;
  headingAlternatif: string[];
  labelItem: string;
  rentangItemIdeal: [number, number | null];
  /** Batas keras jumlah item, bila polanya punya. */
  maksItem: number | null;
  fieldInti: FieldDef[];
  /** Kunci field yang membuat sebuah item disebut kuat. */
  wajib: string[];
  butuhVerifikator: boolean;
  butuhKredensial: boolean;
  blokAgregat?: AgregatDef;
  aturanBahasa?: "orang-pertama-wajib";
  /** Persen bobot dimensi Bukti Karya saat bagian portofolio aktif. */
  bobotBuktiKarya: number;
  aturanSkor: SkorRule[];
  /** Catatan tetap di antarmuka. Angkanya dari riset, jangan diubah sembarangan. */
  catatanUI: string[];
  peringatan: string[];
  /** Pola ini tidak memakai indikator panjang halaman sama sekali. */
  tanpaIndikatorPanjang?: boolean;
}

/* -------------------------------------------------------------------------- */
/* Kamus bidang - menentukan isi saran                                        */
/* -------------------------------------------------------------------------- */

export interface SaranDetail {
  label: string;
  satuan?: string;
  prioritas: number;
}

/** Kredensial khas sebuah bidang. Empat kategori, perlakuannya berbeda. */
export type KategoriKredensial =
  /** A. Lisensi praktik - tanpa ini tidak boleh bekerja. */
  | "lisensi-praktik"
  /** B. Kredensial berjenjang - jenjangnya menentukan kelayakan proyek. */
  | "berjenjang"
  /** C. Sertifikasi sektoral - wajib untuk jabatan tertentu. */
  | "sektoral"
  /** D. Sertifikasi kompetensi & vendor - pelengkap, bukan gerbang. */
  | "kompetensi";

export interface KredensialDef {
  nama: string;
  kategori: KategoriKredensial;
  penerbit: string;
  /**
   * Keterangan masa berlaku sebagai **teks**, bukan angka.
   *
   * Sengaja tidak disimpan sebagai jumlah tahun. Sebagian kredensial kini
   * berlaku seumur hidup, sebagian ditetapkan per skema oleh masing-masing
   * lembaga sertifikasi, dan sebagian lagi sumbernya masih bertentangan.
   * Menuliskannya sebagai angka berarti berbohong pada tiga kasus itu.
   */
  masaBerlaku: string;
  catatan?: string;
}

export interface EntriKamus {
  slug: string;
  nama: string;
  polaDisarankan: PolaSlug;
  polaAlternatif?: PolaSlug[];
  /** Nama-nama jurusan untuk pencarian. Inilah yang diketik pengguna. */
  jurusanTermasuk: string[];
  rumpunIlmu: string;
  /**
   * Menimpa `rentangItemIdeal` polanya, untuk bidang yang lazimnya berbeda.
   *
   * Hanya dipakai bila memang ada angka yang diketahui - arsitektur, misalnya,
   * lazim membawa 5-7 proyek sementara pola Karya & Desain secara umum cukup
   * 3-5. Selebihnya dibiarkan kosong, bukan ditebak.
   */
  rentangItemIdeal?: [number, number | null];
  saranDetailTambahan: SaranDetail[];
  /** Opsi tambahan untuk field inti bertipe `multi`, per kunci field. */
  saranIsiFieldInti?: Record<string, string[]>;
  kataKunciATS: string[];
  kredensial: KredensialDef[];
  peringatanTambahan?: string[];
}

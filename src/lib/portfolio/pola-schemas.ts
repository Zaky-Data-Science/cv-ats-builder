import { SANGGAHAN_AGREGAT } from "./ambang-profesi";
import type {
  JenjangPengalaman,
  PolaSchema,
  PolaSlug,
  TujuanCV,
} from "./types";

/**
 * ============================================================================
 *  LIMA POLA PEMBUKTIAN (+ SATU FALLBACK)
 * ============================================================================
 *
 * Berkas ini menentukan **bentuk formulir**. Kode memang perlu tahu isinya -
 * berbeda dari kamus-bidang.ts yang isinya tidak perlu diketahui kode sama
 * sekali. Karena itu berkas ini statis, pendek, dan jarang berubah: enam
 * objek, tidak lebih.
 *
 * Kalau suatu hari ada profesi yang belum tertampung, jawabannya hampir selalu
 * "tambah satu entri kamus", bukan "tambah satu pola". Pola bertambah hanya
 * bila ada *struktur pembuktian* yang benar-benar baru - dan sepanjang riset
 * yang mendasari berkas ini, hanya ada lima.
 */

/** Dinaikkan setiap kali bentuk salah satu skema berubah. */
export const VERSI_POLA_SCHEMAS = 1;

/**
 * Tahap yang dihitung sebagai keterlibatan eksekusi.
 *
 * Dipakai rubrik penilaian untuk membedakan orang yang ikut merancang dari
 * orang yang ikut sampai barangnya berjalan. Ditaruh di sini, bukan di mesin
 * skor, supaya daftarnya tetap satu tempat dengan daftar tahap yang ditawarkan
 * formulir.
 */
export const TAHAP_EKSEKUSI = [
  "pelaksanaan",
  "pengujian",
  "bring-up",
  "commissioning",
  "rilis",
  "serah terima",
];

/* -------------------------------------------------------------------------- */
/* 1. Karya & Desain                                                          */
/* -------------------------------------------------------------------------- */

const KARYA_VISUAL: PolaSchema = {
  slug: "karya-visual",
  nama: "Karya & Desain",
  kalimatPenjelas:
    "Bukti saya adalah karyanya sendiri - bisa dilihat, dibuka, atau diunduh.",
  bagian: "project",
  headingCV: "PORTOFOLIO KARYA",
  headingAlternatif: ["STUDI KASUS", "PROYEK & PORTOFOLIO"],
  labelItem: "Karya",
  rentangItemIdeal: [3, 5],
  maksItem: null,
  butuhVerifikator: false,
  butuhKredensial: false,
  bobotBuktiKarya: 20,
  fieldInti: [
    {
      key: "masalah",
      label: "Masalah yang dipecahkan",
      tipe: "teks_panjang",
      placeholder:
        "Pengguna gagal menyelesaikan checkout karena form 4 langkah tanpa indikator progres",
      bantuan:
        "Ini pembeda studi kasus dari galeri. Perekrut menilai cara berpikir, bukan tumpukan visual.",
      wajib: true,
      prioritas: 1,
    },
    {
      key: "prosesKeputusan",
      label: "Proses & keputusan",
      tipe: "multi",
      komponen: ["Masalah", "Solusi"],
      placeholder:
        "Riset: 8 wawancara -> temuan drop di langkah 3 -> satukan jadi 2 langkah",
      bantuan: "Struktur baku studi kasus: 2-5 pasangan masalah-solusi.",
      wajib: true,
      prioritas: 2,
    },
    {
      key: "bentukKarya",
      label: "Bentuk karya",
      tipe: "multi",
      opsi: [
        "denah",
        "potongan",
        "tampak",
        "detail",
        "aksonometri",
        "site plan",
        "render 3D",
        "maket",
        "sketsa tangan",
        "wireframe",
        "prototipe",
        "design system",
        "user flow",
        "repo",
        "demo",
        "logo",
        "brand guideline",
        "key visual",
        "dieline kemasan",
        "storyboard",
        "foto",
        "video",
      ],
      placeholder: "denah, potongan, render 3D",
      bantuan:
        "Untuk arsitektur, minimal satu gambar teknis (denah/potongan/detail) - bukan hanya render.",
      prioritas: 3,
    },
    {
      key: "perkakas",
      label: "Perkakas",
      tipe: "multi",
      opsi: [
        "AutoCAD",
        "SketchUp",
        "Revit",
        "Rhino",
        "Lumion",
        "Figma",
        "Adobe XD",
        "Illustrator",
        "After Effects",
        "Blender",
        "React",
        "Next.js",
        "Python",
      ],
      placeholder: "Figma, Illustrator, Blender",
      bantuan: "Perkakas yang benar-benar Anda pakai sendiri di karya ini.",
      prioritas: 4,
    },
    {
      key: "hasil",
      label: "Hasil",
      tipe: "teks",
      rubrik: "hasil",
      placeholder: "Konversi naik 2,1% -> 3,4% dalam 6 minggu",
      bantuan: "Satu angka mengubah galeri jadi studi kasus.",
      wajib: true,
      prioritas: 5,
    },
    {
      key: "statusKarya",
      label: "Status",
      tipe: "pilihan",
      // Padanan "tahap keterlibatan" untuk pola ini: pilihannya memuat
      // "dirilis ke publik", dan rilis memang salah satu tahap eksekusi yang
      // disebut rubrik.
      rubrik: "tahap",
      opsi: [
        "terbangun",
        "dalam konstruksi",
        "dirilis ke publik",
        "internal",
        "sayembara",
        "tugas studio/kuliah",
        "latihan pribadi",
      ],
      placeholder: "dirilis ke publik",
      bantuan:
        "Perekrut membedakan karya nyata dari latihan. Beri label jujur.",
      prioritas: 6,
    },
    {
      key: "tautanKarya",
      label: "Tautan karya",
      tipe: "url",
      simpanDi: "tautan",
      placeholder: "behance.net/nama/proyek",
      bantuan: "Wajib minimal satu yang benar-benar bisa dibuka. Maksimal dua.",
      wajib: true,
      prioritas: 7,
    },
  ],
  wajib: ["masalah", "prosesKeputusan", "hasil", "tautanKarya"],
  aturanSkor: [
    { jenis: "refleksi-terisi", minKarakter: 80, nilai: 4 },
    { jenis: "tanpa-tautan-valid", nilai: -15 },
  ],
  catatanUI: [
    "Arsitektur. Booklet lengkap 30-35 halaman berisi 7-10 proyek. Tapi yang dikirim bersama CV cukup 3-5 halaman - booklet penuh menyusul atau dibawa saat wawancara. A4/US Letter paling praktis (A3 lebih profesional tapi berat). Jaga ukuran berkas 5-10 MB untuk email (batas aman 15 MB); portal karier firma umumnya membatasi 15-25 MB. Tampilkan proses: sketsa - diagram - hasil akhir, bukan render saja. Letakkan pengalaman kantor sebelum tugas kuliah.",
    "Desain & UI/UX. Junior 2-3 studi kasus, senior 4-5. Lebih dari itu tidak dibaca. Taruh yang terbaik paling depan. Satu proyek = satu masalah inti.",
    "Software. 3-5 repo terdokumentasi baik mengalahkan puluhan repo setengah jadi. README harus terbaca non-engineer. Muat: masalah, pengguna sasaran, keputusan teknis kunci, screenshot/demo, keterbatasan yang diketahui, pelajaran.",
    "Semua bidang visual. Berkas portofolio dikirim terpisah; di CV cukup tautan + ringkasan.",
  ],
  contoh: {
    judul: "Redesain Alur Checkout Aplikasi Belanja",
    peran: "Perancang UX",
    konteks: "PT Ritel Nusantara",
    ringkasan:
      "Menyusun ulang checkout empat langkah menjadi dua langkah setelah menemukan titik henti pengguna.",
    poin: [
      "Menjalankan 8 wawancara pengguna dan menemukan 62% berhenti di langkah ketiga.",
      "Konversi checkout naik dari 2,1% menjadi 3,4% dalam 6 minggu setelah rilis.",
    ],
  },
  saranSkor: {
    hasil:
      "Karya ini belum menyebut hasil. Tambahkan satu angka: konversi, waktu penyelesaian tugas, atau kepuasan pengguna.",
    peran:
      "Portofolio hanya berisi hasil akhir. Tambahkan 2-3 langkah keputusan - inilah yang dinilai perekrut, bukan visualnya.",
    tautan:
      "Belum ada tautan yang bisa dibuka. Untuk bentuk ini, karyanya sendiri yang jadi buktinya.",
  },
  peringatan: [
    "Karya kantor atau klien perlu izin tayang, dan wajib menyebut peran pribadi Anda di dalamnya.",
    "Karya spekulatif atau latihan wajib diberi label agar tidak menyesatkan.",
    "Repo privat atau kode milik perusahaan tidak boleh ditempel.",
  ],
};

/* -------------------------------------------------------------------------- */
/* 2. Proyek Teknis                                                           */
/* -------------------------------------------------------------------------- */

const PROYEK_TEKNIS: PolaSchema = {
  slug: "proyek-teknis",
  nama: "Proyek Teknis",
  kalimatPenjelas:
    "Bukti saya adalah proyek dengan spesifikasi, standar, dan hasil terukur.",
  bagian: "project",
  headingCV: "PORTOFOLIO PROYEK",
  headingAlternatif: [
    "PENGALAMAN PROYEK",
    "PROYEK REKAYASA",
    "PORTOFOLIO PROYEK TEKNIS",
  ],
  labelItem: "Proyek",
  rentangItemIdeal: [3, 6],
  maksItem: 10,
  butuhVerifikator: true,
  butuhKredensial: false,
  aturanBahasa: "orang-pertama-wajib",
  bobotBuktiKarya: 15,
  fieldInti: [
    {
      key: "jenisProyek",
      label: "Jenis proyek",
      tipe: "teks",
      placeholder: "Gedung perkantoran 12 lantai",
      bantuan: "Sebutkan bendanya, bukan hanya nama paket pekerjaannya.",
      prioritas: 1,
    },
    {
      key: "skalaProyek",
      label: "Skala",
      tipe: "angka_satuan",
      rubrik: "skala",
      placeholder: "8.400 m2",
      bantuan:
        "Skala adalah proksi kompleksitas. Boleh rentang jika angka pastinya rahasia.",
      prioritas: 2,
    },
    {
      key: "tahapKeterlibatan",
      label: "Tahap keterlibatan",
      tipe: "multi",
      rubrik: "tahap",
      opsi: [
        "studi kelayakan",
        "DED/desain",
        "simulasi",
        "tender",
        "fabrikasi",
        "pelaksanaan",
        "bring-up",
        "commissioning",
        "pengujian",
        "pengawasan",
        "serah terima",
      ],
      placeholder: "DED/desain, pelaksanaan, pengujian",
      bantuan:
        "Perekrut ingin tahu sejauh mana Anda ikut, bukan hanya proyek apa.",
      wajib: true,
      prioritas: 3,
    },
    {
      key: "standarKode",
      label: "Standar & kode",
      tipe: "multi",
      rubrik: "standar",
      opsi: [
        "SNI 2847",
        "SNI 1726",
        "SNI 1727",
        "ACI",
        "AISC",
        "Bina Marga",
        "IEC",
        "IEEE",
        "PUIL",
        "ISO 9001",
        "ISO 45001",
        "ISO 14001",
        "ASME",
        "API",
        "SMK3 PP 50/2012",
        "AMDAL",
        "PROPER",
      ],
      placeholder: "SNI 2847, SNI 1726",
      bantuan:
        "Menyebut standar menunjukkan Anda bekerja dalam kerangka, bukan improvisasi.",
      wajib: true,
      prioritas: 4,
    },
    {
      key: "perkakas",
      label: "Perkakas",
      tipe: "multi",
      opsi: [
        "AutoCAD",
        "SAP2000",
        "ETABS",
        "Revit/BIM",
        "Civil 3D",
        "Tekla",
        "Primavera",
        "MS Project",
        "HEC-RAS",
        "Altium",
        "KiCad",
        "Eagle",
        "Proteus",
        "LTspice",
        "MATLAB/Simulink",
        "SolidWorks",
        "CATIA",
        "Inventor",
        "ANSYS",
        "Minitab",
        "HYSYS",
        "Aspen Plus",
        "Petrel",
        "Surpac",
        "Minescape",
        "ArcGIS",
        "PI System",
        "DCS/SCADA",
      ],
      placeholder: "ETABS, AutoCAD, Primavera",
      bantuan: "Perkakas yang Anda operasikan sendiri, bukan yang dipakai tim.",
      prioritas: 5,
    },
    {
      key: "hasilTerukur",
      label: "Hasil terukur",
      tipe: "delta",
      rubrik: "hasil",
      komponen: ["Yang diukur", "Sebelum", "Sesudah", "Rentang waktu"],
      placeholder: "Efisiensi 92% pada beban 3 A; ripple 40 mV",
      bantuan:
        "Field pembeda pola ini. Perekrut ingin bukti Anda mengukur, bukan sekadar merakit.",
      wajib: true,
      prioritas: 6,
    },
  ],
  wajib: ["hasilTerukur", "standarKode", "tahapKeterlibatan", "verifikator"],
  aturanSkor: [
    { jenis: "verifikator-lengkap", nilai: 8 },
    { jenis: "refleksi-terisi", minKarakter: 80, nilai: 4 },
  ],
  catatanUI: [
    "Untuk keperluan sertifikasi (STRI/SKK/IPP), badan penilai memakai tiga faktor: banyaknya pengalaman, peranan Anda, dan tingkat kesulitan. Isi ketiganya - bukan hanya nama proyek.",
    "Tulis apa yang Anda kerjakan sendiri: \"saya merancang\", \"saya menghitung\", \"saya menguji\". \"Kami membangun sistem\" tidak memberi tahu perekrut bagian mana yang Anda kerjakan.",
  ],
  contoh: {
    judul: "Panel Kendali Instrumentasi Lapangan",
    peran: "Perancang Elektronik",
    konteks: "PT Energi Kaltim",
    ringkasan:
      "Merancang catu daya 3 A untuk instrumentasi lapangan beserta pengujian pembebanannya.",
    poin: [
      "Saya menghitung disipasi daya dan memilih topologi buck sinkron untuk menekan panas.",
      "Saya menguji efisiensi 92% pada beban 3 A dengan ripple 40 mV.",
    ],
  },
  saranSkor: {
    skala:
      "Proyek ini belum menyebut skala. Tambahkan bentang, luas, atau rentang nilai proyek.",
    standar:
      "Belum ada standar atau kode yang disebut. Menyebutnya menunjukkan Anda bekerja dalam kerangka, bukan improvisasi.",
    hasil:
      "Belum ada hasil pengukuran. Tambahkan angka hasil uji (efisiensi, ripple, konsumsi arus) - inilah yang membedakan perancang dari perakit.",
    peran:
      "Tulis apa yang Anda kerjakan sendiri: \"saya menghitung...\", \"saya menguji...\". \"Kami membangun sistem\" tidak memberi tahu perekrut bagian mana yang Anda kerjakan.",
    verifikator:
      "Verifikator belum diisi. Badan sertifikasi dan perekrut teknis sama-sama menanyakannya.",
  },
  peringatan: [
    "Nilai kontrak, skematik, BOM, nomor part, nama vendor, dan data produksi atau cadangan sering terikat NDA. Aktifkan Mode Redaksi dan pakai rentang (\"Rp 10-25 M\") atau persentase relatif.",
    "Gambar kerja milik pemberi kerja tidak boleh diunggah.",
  ],
};

/* -------------------------------------------------------------------------- */
/* 3. Praktik & Pengajaran                                                    */
/* -------------------------------------------------------------------------- */

const PRAKTIK_JAM: PolaSchema = {
  slug: "praktik-jam",
  nama: "Praktik & Pengajaran",
  kalimatPenjelas:
    "Bukti saya adalah jam praktik, jumlah orang yang saya layani, dan lisensi.",
  bagian: "project",
  headingCV: "PENGALAMAN PRAKTIK & PENGAJARAN",
  headingAlternatif: [
    "PENGALAMAN KLINIS & PROSEDUR",
    "PORTOFOLIO MENGAJAR",
    "PENGALAMAN DAKWAH & PENGAJARAN",
    "PORTOFOLIO KEILMUAN & PENGABDIAN",
  ],
  labelItem: "Kegiatan",
  // Tanpa batas atas. Pada pola ini kualitas tiap item hampir tidak dinilai -
  // yang dinilai agregatnya.
  rentangItemIdeal: [3, null],
  maksItem: null,
  butuhVerifikator: false,
  butuhKredensial: true,
  bobotBuktiKarya: 12,
  blokAgregat: {
    ambangSlugs: ["dokter", "dokter-gigi", "nakes-lain", "guru-ppg", "konstruksi-pkb"],
    sanggahan: SANGGAHAN_AGREGAT,
  },
  fieldInti: [
    {
      key: "jenisKegiatan",
      label: "Jenis kegiatan",
      tipe: "teks",
      placeholder: "Rotasi klinis penyakit dalam",
      bantuan: "Sebutkan bentuk kegiatannya, bukan nama programnya saja.",
      prioritas: 1,
    },
    {
      key: "institusi",
      label: "Institusi / fasilitas",
      tipe: "teks",
      placeholder: "RSUD Taman Husada Bontang (tipe B)",
      bantuan: "Institusi membuat pengalaman bisa diverifikasi.",
      wajib: true,
      prioritas: 2,
    },
    {
      key: "volume",
      label: "Volume",
      tipe: "angka_satuan",
      rubrik: "skala",
      placeholder: "±120 pasien/bulan",
      bantuan:
        "Angka membuat pengabdian jadi terukur. Ini field pembeda pola ini.",
      wajib: true,
      prioritas: 3,
    },
    {
      key: "periodeAktif",
      label: "Periode & intensitas",
      tipe: "teks",
      placeholder: "Jan 2024 - kini, 3 hari/pekan",
      bantuan: "Intensitas sama pentingnya dengan durasi.",
      prioritas: 4,
    },
    {
      key: "luaran",
      label: "Hasil / luaran",
      tipe: "teks",
      rubrik: "hasil",
      placeholder: "Angka infeksi luka operasi turun 4,1% -> 1,8%",
      bantuan: "Satu angka membedakan laporan kegiatan dari daftar hadir.",
      prioritas: 5,
    },
    {
      key: "kredensialTerkait",
      label: "Kredensial terkait",
      tipe: "multi",
      placeholder: "STR, SIP",
      bantuan:
        "Gerbang wajib untuk pola ini. Perekrut mengecek lisensi sebelum mengecek pengalaman.",
      wajib: true,
      prioritas: 6,
    },
    {
      key: "penyelia",
      label: "Penyelia / atasan",
      tipe: "teks",
      placeholder: "dr. Sari Handayani, Sp.PD - DPJP",
      bantuan: "Orang yang dapat memastikan kegiatan ini benar terjadi.",
      prioritas: 7,
    },
  ],
  wajib: ["volume", "institusi", "kredensialTerkait"],
  aturanSkor: [{ jenis: "refleksi-terisi", minKarakter: 80, nilai: 4 }],
  catatanUI: [
    "CV bidang ini wajar lebih dari 2 halaman - daftar pelatihan, rotasi, dan publikasi tidak dipangkas.",
    "Sebutkan lembaga dan periode agar bisa diverifikasi; hindari klaim otoritas keilmuan tanpa sanad atau institusi.",
    "Sejak UU 17/2023, portofolio SKP bukan lagi syarat memperpanjang STR (STR Definitif berlaku seumur hidup), melainkan syarat memperpanjang SIP.",
  ],
  contoh: {
    judul: "Rotasi Klinis Penyakit Dalam",
    peran: "Dokter Internsip",
    konteks: "RSUD Taman Husada Bontang",
    ringkasan:
      "Menangani rata-rata 120 pasien per bulan di bangsal penyakit dalam selama enam bulan.",
    poin: [
      "Melakukan anamnesis dan pemeriksaan fisik rata-rata 20 pasien per hari jaga.",
      "Menyusun materi edukasi pasien yang kemudian dipakai rutin di bangsal.",
    ],
  },
  saranSkor: {
    skala:
      "Kegiatan ini belum menyebut jumlah orang yang dilayani atau jam per pekan. Angka membuat pengabdian jadi terukur.",
    hasil:
      "Luaran kegiatan belum berisi angka. Tulis jenis tindakan dan volumenya, tanpa identitas siapa pun.",
    peran:
      "Sebutkan peran Anda sendiri di kegiatan ini, bukan peran timnya.",
  },
  peringatan: [
    "Dilarang menulis identitas pasien, nomor rekam medis, foto luka atau pasien, atau data apa pun yang bisa mengidentifikasi orang. Tulis jumlah dan jenis kasus, bukan kasusnya.",
    "Hasil asesmen psikologis dan data responden juga bersifat rahasia.",
    "Satu bukti hanya boleh dipakai untuk satu komponen. Bukti yang sama tidak boleh dihitung dua kali.",
  ],
};

/* -------------------------------------------------------------------------- */
/* 4. Publikasi & Kredit                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Satu-satunya pola yang tidak memakai bagian `project`.
 *
 * Bagian `publication` sudah ada di aplikasi ini sejak awal dan bentuknya
 * memang persis pola ini dalam wujud sederhana - judul, penerbit, tanggal,
 * DOI. Membuat struktur baru di sebelahnya hanya akan menduplikasi data yang
 * sudah dimiliki pengguna, jadi yang dikerjakan adalah memperluasnya.
 */
const KARYA_TERKREDIT: PolaSchema = {
  slug: "karya-terkredit",
  nama: "Publikasi & Kredit",
  kalimatPenjelas:
    "Bukti saya adalah daftar karya yang divalidasi pihak lain - jurnal, penerbit, panggung.",
  bagian: "publication",
  headingCV: "PUBLIKASI & PENELITIAN",
  headingAlternatif: [
    "KARYA ILMIAH",
    "PENELITIAN & HIBAH",
    "PORTOFOLIO PERTUNJUKAN & KARYA",
    "KARYA TERBIT",
  ],
  labelItem: "Karya",
  // Satu-satunya pola yang makin banyak makin baik. Batas atas null, dan
  // setiap perhitungan yang membacanya wajib menangani null secara eksplisit.
  rentangItemIdeal: [1, null],
  maksItem: null,
  butuhVerifikator: false,
  butuhKredensial: false,
  bobotBuktiKarya: 20,
  tanpaIndikatorPanjang: true,
  fieldInti: [
    {
      key: "tipeLuaran",
      label: "Tipe luaran",
      tipe: "pilihan",
      simpanDi: "tipeLuaran",
      opsi: [
        "artikel jurnal",
        "prosiding",
        "bab buku",
        "buku",
        "paten/HKI",
        "manuskrip dalam review",
        "pertunjukan",
        "rekaman",
        "pameran",
        "film/produksi",
      ],
      placeholder: "artikel jurnal",
      bantuan: "Menentukan pengelompokan daftar karya Anda di CV.",
      prioritas: 1,
    },
    {
      key: "sitasiLengkap",
      label: "Sitasi / kredit lengkap",
      tipe: "teks_panjang",
      simpanDi: "title",
      placeholder:
        "Santoso, B., & Wijaya, R. (2025). Optimasi jadwal produksi dengan algoritma genetika. Jurnal Teknik Industri, 26(1), 44-58.",
      bantuan:
        "Gaya APA atau IEEE dengan nama Anda sendiri di tempatnya. Untuk seni: Produksi - Peran - Venue - Sutradara - Tahun.",
      wajib: true,
      prioritas: 2,
    },
    {
      key: "venue",
      label: "Venue / penerbit / panggung",
      tipe: "teks",
      simpanDi: "publisher",
      placeholder: "Jurnal Teknik Industri, Vol 26(1)",
      bantuan: "Tempat terbit inilah yang memvalidasi karya Anda.",
      wajib: true,
      prioritas: 3,
    },
    {
      key: "peranSaya",
      label: "Peran",
      tipe: "pilihan",
      simpanDi: "peranSaya",
      opsi: [
        "penulis pertama",
        "korespondensi",
        "anggota",
        "pemain",
        "komposer",
        "koreografer",
        "sutradara",
        "kurator",
      ],
      placeholder: "penulis pertama",
      bantuan: "Penulis pertama dan anggota dinilai berbeda.",
      prioritas: 4,
    },
    {
      key: "indeksasiTier",
      label: "Indeksasi / tingkat",
      tipe: "pilihan",
      simpanDi: "indeksasiTier",
      opsi: [
        "Scopus Q1",
        "Scopus Q2",
        "Scopus Q3",
        "Scopus Q4",
        "SINTA 1",
        "SINTA 2",
        "SINTA 3",
        "SINTA 4",
        "SINTA 5",
        "SINTA 6",
        "WoS",
        "Garuda",
        "tidak terindeks",
        "festival internasional",
        "nasional",
        "lokal",
      ],
      placeholder: "Scopus Q2",
      bantuan: "Tingkat venue menentukan bobot karya di mata penilai akademik.",
      prioritas: 5,
    },
    {
      key: "pengenalPersisten",
      label: "DOI / ISBN / tautan rekaman",
      tipe: "url",
      simpanDi: "url",
      placeholder: "doi.org/10.xxxx/yyyy",
      bantuan:
        "Pengenal yang tidak berubah membuat karya Anda dapat ditemukan bertahun-tahun kemudian.",
      wajib: true,
      prioritas: 6,
    },
  ],
  wajib: ["sitasiLengkap", "venue", "pengenalPersisten"],
  aturanSkor: [
    { jenis: "refleksi-terisi", minKarakter: 80, nilai: 4 },
    { jenis: "tanpa-tautan-valid", nilai: -15 },
  ],
  catatanUI: [
    "Urutkan menurun berdasarkan tahun, dikelompokkan menurut tipe luaran.",
    "Cantumkan profil peneliti Anda sekali saja di bagian identitas: ORCID, Google Scholar, SINTA, Scopus ID. Perekrut akademik hampir selalu membukanya.",
  ],
  contoh: {
    judul:
      "Santoso, B., & Wijaya, R. (2025). Optimasi jadwal produksi dengan algoritma genetika. Jurnal Teknik Industri, 26(1), 44-58.",
    peran: "Penulis pertama",
    konteks: "Jurnal Teknik Industri, Vol 26(1)",
    ringkasan: "Artikel jurnal terindeks SINTA 2 dengan DOI aktif.",
    poin: [],
  },
  saranSkor: {
    peran:
      "Peran penulis belum diisi. Penulis pertama dan anggota dinilai berbeda.",
    tautan:
      "Belum ada DOI atau tautan rekaman. Tambahkan pengenal yang tidak berubah agar karya Anda dapat ditemukan bertahun-tahun kemudian.",
  },
  peringatan: [
    "Manuskrip yang masih dalam review wajib diberi label apa adanya, jangan ditulis seolah sudah terbit.",
  ],
};

/* -------------------------------------------------------------------------- */
/* 5. Program & Dampak                                                        */
/* -------------------------------------------------------------------------- */

const DAMPAK_PROGRAM: PolaSchema = {
  slug: "dampak-program",
  nama: "Program & Dampak",
  kalimatPenjelas:
    "Karya saya milik perusahaan. Yang bisa saya bawa adalah angka hasilnya.",
  bagian: "project",
  headingCV: "PORTOFOLIO PROGRAM & DAMPAK",
  headingAlternatif: [
    "PROYEK & ANALISIS",
    "PENGALAMAN PROGRAM",
    "PORTOFOLIO PENANGANAN PERKARA",
    "PORTOFOLIO KAMPANYE",
  ],
  labelItem: "Program",
  rentangItemIdeal: [3, 6],
  maksItem: null,
  butuhVerifikator: false,
  butuhKredensial: false,
  // Sengaja lebih rendah: butir dampak sudah tersebar di Pengalaman Kerja,
  // dan menghitungnya dua kali akan menggelembungkan skor tanpa menambah
  // satu pun bukti baru.
  bobotBuktiKarya: 12,
  fieldInti: [
    {
      key: "lingkupProgram",
      label: "Lingkup",
      tipe: "teks",
      placeholder: "Analisis kredit segmen UKM",
      bantuan: "Sebutkan pekerjaan intinya, bukan nama divisinya.",
      prioritas: 1,
    },
    {
      key: "skalaDikelola",
      label: "Skala yang dikelola",
      tipe: "teks",
      rubrik: "skala",
      placeholder: "Portofolio kredit Rp 42 M",
      bantuan: "Skala adalah proksi tanggung jawab.",
      wajib: true,
      prioritas: 2,
    },
    {
      key: "metrikDampak",
      label: "Metrik dampak",
      tipe: "delta",
      rubrik: "hasil",
      komponen: ["Metrik", "Sebelum", "Sesudah", "Rentang waktu"],
      placeholder: "Time-to-hire | 41 hari | 24 hari | 6 bulan",
      bantuan:
        "Perekrut membaca \"41 -> 24 hari\" berbeda dari \"lebih cepat\". Isi keempat komponennya.",
      wajib: true,
      prioritas: 3,
    },
    {
      key: "metodeStandar",
      label: "Metode & standar",
      tipe: "multi",
      rubrik: "standar",
      opsi: [
        "Lean",
        "Six Sigma DMAIC",
        "Kaizen",
        "5S",
        "FMEA",
        "PSAK",
        "IFRS",
        "SAK EMKM",
        "SPAP",
        "COSO",
        "Perpres 16/2018",
        "Incoterms",
        "ISO 28000",
        "UU Ketenagakerjaan",
        "PP 35/2021",
      ],
      placeholder: "Six Sigma DMAIC, FMEA",
      bantuan: "Metode menunjukkan hasilnya berulang, bukan kebetulan.",
      wajib: true,
      prioritas: 4,
    },
    {
      key: "sistemPerkakas",
      label: "Sistem & perkakas",
      tipe: "multi",
      opsi: [
        "Excel lanjutan",
        "Accurate",
        "SAP",
        "Oracle ERP",
        "MYOB",
        "Power BI",
        "Tableau",
        "e-Faktur",
        "Coretax",
        "SPSE/LKPP",
        "SAP MM",
        "Odoo",
        "WMS",
        "Talenta",
        "Gadjian",
        "SuccessFactors",
        "Google Analytics",
        "Meta Business Suite",
        "Ahrefs/SEMrush",
        "Looker Studio",
        "SPSS",
        "NVivo",
        "Kobo Toolbox",
      ],
      placeholder: "SAP, Power BI",
      bantuan: "Sistem yang Anda operasikan sendiri sehari-hari.",
      prioritas: 5,
    },
    {
      key: "penerimaManfaat",
      label: "Penerima manfaat",
      tipe: "teks",
      placeholder: "Tim penjualan 40 orang",
      bantuan: "Hasil tanpa penerima manfaat terdengar abstrak.",
      prioritas: 6,
    },
  ],
  wajib: ["metrikDampak", "skalaDikelola", "metodeStandar"],
  aturanSkor: [{ jenis: "refleksi-terisi", minKarakter: 80, nilai: 4 }],
  catatanUI: [
    "Situation pada struktur STAR sudah diserap ke header (perusahaan, jabatan, periode) - jangan ditulis ulang. Isi Task (tanggung jawab inti), Action (kata kerja spesifik: bagaimana), Result (angka + penerima manfaat).",
    "Jangan menulis STAR berurutan. Pola yang lebih baik: Task+Result, lalu Action+Action+Result.",
  ],
  contoh: {
    judul: "Percepatan Rekrutmen Divisi Penjualan",
    peran: "Analis SDM",
    konteks: "PT Solusi Talenta",
    ringkasan:
      "Merancang ulang alur seleksi sehingga waktu pengisian posisi turun dari 41 menjadi 24 hari.",
    poin: [
      "Memetakan 6 tahap seleksi dan memangkas dua tahap yang tidak menambah informasi.",
      "Time-to-hire turun dari 41 hari menjadi 24 hari dalam 6 bulan.",
    ],
  },
  saranSkor: {
    skala:
      "Program ini belum menyebut skala yang dikelola. Tambahkan nilai portofolio, ukuran tim, atau populasi yang dilayani.",
    standar:
      "Belum ada metode atau standar yang disebut. Metode menunjukkan hasilnya berulang, bukan kebetulan.",
    hasil:
      "Metrik dampaknya belum punya nilai sebelum dan sesudah. Perekrut membaca \"12% -> 8%\" berbeda dari \"lebih efisien\".",
    peran:
      "Sebutkan tindakan Anda sendiri, bukan tanggung jawab divisinya.",
  },
  peringatan: [
    "Hukum: hormati kerahasiaan klien. Nama pihak dan nomor perkara diganti deskriptor generik (\"perusahaan energi nasional\", \"sengketa ketenagakerjaan di PN Jakarta Pusat\"). Contoh tulisan yang ditautkan wajib sudah dianonimkan.",
    "Keuangan: angka perusahaan sering rahasia - pakai rentang atau persentase relatif.",
    "Sosial dan psikologi: data responden dan hasil asesmen bersifat rahasia.",
  ],
};

/* -------------------------------------------------------------------------- */
/* 6. Umum - fallback yang wajib ada                                          */
/* -------------------------------------------------------------------------- */

const UMUM: PolaSchema = {
  slug: "umum",
  nama: "Umum / Belum Menentukan",
  kalimatPenjelas:
    "Saya lintas bidang, baru lulus, atau sedang pindah karier - bentuknya belum pasti.",
  bagian: "project",
  headingCV: "PROYEK & PORTOFOLIO",
  headingAlternatif: ["PROYEK", "PORTOFOLIO"],
  labelItem: "Karya",
  rentangItemIdeal: [2, 5],
  maksItem: null,
  butuhVerifikator: false,
  butuhKredensial: false,
  bobotBuktiKarya: 12,
  fieldInti: [
    {
      key: "jenisKarya",
      label: "Jenis karya",
      tipe: "teks",
      placeholder: "Aplikasi pencatat keuangan pribadi",
      bantuan: "Sebutkan bendanya dengan bahasa yang dimengerti orang luar bidang.",
      prioritas: 1,
    },
    {
      key: "hasil",
      label: "Hasil",
      tipe: "teks",
      rubrik: "hasil",
      placeholder: "Dipakai 120 pengguna dalam 3 bulan pertama",
      bantuan: "Satu angka mengubah daftar karya jadi bukti.",
      prioritas: 2,
    },
    {
      key: "alatMetode",
      label: "Alat & metode",
      tipe: "multi",
      placeholder: "React, Figma, wawancara pengguna",
      bantuan: "Alat dan cara kerja yang Anda pakai sendiri.",
      prioritas: 3,
    },
    {
      key: "tautanKarya",
      label: "Tautan karya",
      tipe: "url",
      simpanDi: "tautan",
      placeholder: "github.com/nama/repo",
      bantuan: "Maksimal dua, dan pastikan benar-benar bisa dibuka.",
      prioritas: 4,
    },
  ],
  // Syarat item kuat sengaja dikosongkan: sumber fitur ini tidak menyebutkan
  // syarat apa pun untuk pola fallback, dan mengarangnya sendiri akan membuat
  // pengguna yang belum menentukan bidangnya dinilai dengan aturan yang tidak
  // pernah ada dasarnya.
  wajib: [],
  aturanSkor: [{ jenis: "refleksi-terisi", minKarakter: 80, nilai: 4 }],
  catatanUI: [
    "Belum menemukan bidang Anda di daftar? Pakai bentuk ini dulu - seluruh isian tetap tersimpan dan dapat dipindahkan begitu bentuk yang lebih pas tersedia.",
  ],
  contoh: {
    judul: "Aplikasi Pencatat Keuangan Pribadi",
    peran: "Pengembang",
    konteks: "Proyek Mandiri",
    ringkasan:
      "Membangun aplikasi pencatat pengeluaran harian yang dipakai 120 pengguna dalam tiga bulan pertama.",
    poin: [
      "Merancang basis data dan antarmuka pencatatan cepat berbasis kategori.",
      "Dipakai 120 pengguna dalam 3 bulan pertama tanpa biaya promosi.",
    ],
  },
  saranSkor: {
    hasil:
      "Karya ini belum menyebut hasil. Satu angka - berapa orang memakainya, berapa lama selesai - sudah cukup mengubahnya jadi bukti.",
    peran:
      "Sebutkan peran Anda sendiri di karya ini, dan mulai poinnya dengan kata kerja.",
  },
  peringatan: [],
};

/* -------------------------------------------------------------------------- */
/* Registry                                                                   */
/* -------------------------------------------------------------------------- */

export const POLA_SCHEMAS: Record<PolaSlug, PolaSchema> = {
  "karya-visual": KARYA_VISUAL,
  "proyek-teknis": PROYEK_TEKNIS,
  "praktik-jam": PRAKTIK_JAM,
  "karya-terkredit": KARYA_TERKREDIT,
  "dampak-program": DAMPAK_PROGRAM,
  umum: UMUM,
};

/** Urutan tampil di pemilih. Fallback selalu paling bawah. */
export const URUTAN_POLA: PolaSlug[] = [
  "karya-visual",
  "proyek-teknis",
  "praktik-jam",
  "karya-terkredit",
  "dampak-program",
  "umum",
];

/** Selalu mengembalikan sebuah skema - slug tak dikenal jatuh ke `umum`. */
export function polaSchema(slug: string | null | undefined): PolaSchema {
  return POLA_SCHEMAS[slug as PolaSlug] ?? POLA_SCHEMAS.umum;
}

/**
 * Judul bagian yang dipakai di CV.
 *
 * Judul baku lebih mungkin dikenali pembaca otomatis, tetapi judul lain tetap
 * terbaca - yang berisiko hilang adalah pemetaannya ke kolom yang benar, bukan
 * isinya. Karena itu daftar ini berlaku sebagai batas pilihan, bukan sebagai
 * ancaman yang perlu ditakuti pengguna.
 */
export function judulBagian(schema: PolaSchema, pilihan: string): string {
  if (!pilihan) return schema.headingCV;
  return schema.headingAlternatif.includes(pilihan) ? pilihan : schema.headingCV;
}

/* -------------------------------------------------------------------------- */
/* Efek sumbu Tujuan                                                          */
/* -------------------------------------------------------------------------- */

/**
 * Apa yang berubah ketika pengguna menyatakan CV ini untuk apa.
 *
 * Ditulis sebagai data, bukan sebagai percabangan di komponen, karena alasan
 * yang sama dengan skema pola: satu tempat untuk dibaca, satu tempat untuk
 * diperbaiki.
 */
export interface EfekTujuan {
  /** Pola yang dipaksakan tujuan ini; yang pertama cocok dengan bidang dipakai. */
  polaPaksa?: PolaSlug[];
  verifikatorWajib?: boolean;
  bahasaOrangPertama?: boolean;
  /** Blok Kredensial dinaikkan ke atas daftar item. */
  kredensialDiAtas?: boolean;
  tanpaIndikatorPanjang?: boolean;
  urutPerTipeLuaran?: boolean;
  /** Field inti yang ditonjolkan di formulir. */
  tonjolkanField?: string[];
  /** Mode rentang (angka pasti diganti rentang) menyala sendiri. */
  modeRentangOtomatis?: boolean;
}

export const EFEK_TUJUAN: Record<TujuanCV, EfekTujuan> = {
  "melamar-kerja": {},
  "sertifikasi-lisensi": {
    polaPaksa: ["proyek-teknis", "praktik-jam"],
    verifikatorWajib: true,
    bahasaOrangPertama: true,
    kredensialDiAtas: true,
  },
  "beasiswa-akademik": {
    polaPaksa: ["karya-terkredit"],
    tanpaIndikatorPanjang: true,
    urutPerTipeLuaran: true,
  },
  "tender-proyek": {
    polaPaksa: ["proyek-teknis"],
    tonjolkanField: ["skalaProyek", "standarKode"],
    modeRentangOtomatis: true,
  },
};

export const LABEL_TUJUAN: Record<TujuanCV, string> = {
  "melamar-kerja": "Melamar kerja",
  "sertifikasi-lisensi": "Sertifikasi atau lisensi profesi",
  "beasiswa-akademik": "Beasiswa atau jalur akademik",
  "tender-proyek": "Tender atau prakualifikasi proyek",
};

export const PENJELAS_TUJUAN: Record<TujuanCV, string> = {
  "melamar-kerja": "Bentuk portofolio mengikuti bidang yang Anda sebutkan.",
  "sertifikasi-lisensi":
    "Penilai kompetensi menanyakan peran pribadi dan orang yang dapat memastikannya.",
  "beasiswa-akademik":
    "Daftar karya terbit yang lengkap lebih penting daripada CV yang pendek.",
  "tender-proyek": "Skala proyek dan standar yang dipakai ditaruh paling depan.",
};

/* -------------------------------------------------------------------------- */
/* Penyesuaian jenjang                                                        */
/* -------------------------------------------------------------------------- */

/**
 * Daftar field wajib tidak boleh sama untuk mahasiswa dan orang dengan
 * pengalaman sepuluh tahun.
 *
 * Tanpa penyesuaian ini, mahasiswa dan lulusan baru - sebagian besar pengguna
 * aplikasi ini - menghadapi formulir yang mensyaratkan verifikator, hasil
 * terukur berangka, dan standar yang memang belum mereka punya, lalu memperoleh
 * skor rendah tanpa satu pun jalan keluar. Itulah bentuk kegagalan yang membuat
 * orang berhenti memakai sebuah aplikasi, dan penyebabnya bukan datanya
 * melainkan ambangnya.
 */
export interface EfekJenjang {
  /** Verifikator ditegakkan sebagai syarat (hanya pada pola yang memakainya). */
  verifikatorWajib: boolean;
  /** Menimpa batas bawah `rentangItemIdeal` pola. */
  batasBawahItem?: number;
  /** Status "tugas kuliah" / "latihan pribadi" tidak menurunkan skor. */
  statusLatihanNetral: boolean;
  /** Nada saran perbaikan - yang pemula tidak mengandaikan pengalaman kerja. */
  nadaSaran: "pemula" | "default";
}

export const EFEK_JENJANG: Record<JenjangPengalaman, EfekJenjang> = {
  mahasiswa: {
    verifikatorWajib: false,
    batasBawahItem: 2,
    statusLatihanNetral: true,
    nadaSaran: "pemula",
  },
  "baru-lulus": {
    verifikatorWajib: false,
    batasBawahItem: 2,
    statusLatihanNetral: true,
    nadaSaran: "pemula",
  },
  "1-3-tahun": {
    verifikatorWajib: false,
    statusLatihanNetral: false,
    nadaSaran: "default",
  },
  "4-8-tahun": {
    verifikatorWajib: true,
    statusLatihanNetral: false,
    nadaSaran: "default",
  },
  "di-atas-8-tahun": {
    verifikatorWajib: true,
    statusLatihanNetral: false,
    nadaSaran: "default",
  },
};

export const LABEL_JENJANG: Record<JenjangPengalaman, string> = {
  mahasiswa: "Mahasiswa",
  "baru-lulus": "Baru lulus",
  "1-3-tahun": "1-3 tahun",
  "4-8-tahun": "4-8 tahun",
  "di-atas-8-tahun": "Di atas 8 tahun",
};

/** Saran verifikator untuk jenjang pemula - berbeda nada, bukan berbeda field. */
export const BANTUAN_VERIFIKATOR_PEMULA =
  "Dosen pembimbing atau ketua tim juga sah.";

/**
 * Rentang jumlah item yang berlaku setelah jenjang diperhitungkan.
 *
 * Batas atas tidak pernah diturunkan oleh jenjang: yang menjadi penghalang
 * bagi pemula adalah batas bawahnya.
 */
export function rentangItemBerlaku(
  schema: PolaSchema,
  jenjang: JenjangPengalaman,
): [number, number | null] {
  const efek = EFEK_JENJANG[jenjang];
  const [bawah, atas] = schema.rentangItemIdeal;
  return [efek.batasBawahItem ?? bawah, atas];
}

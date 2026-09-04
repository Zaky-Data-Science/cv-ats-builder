import type { EntriKamus } from "./types";

/**
 * ============================================================================
 *  KAMUS BIDANG
 * ============================================================================
 *
 * Berkas ini menentukan **isi saran**, bukan bentuk formulir. Kode tidak perlu
 * tahu satu pun isinya - tidak ada `if (bidang === ...)` di mana pun, dan tidak
 * boleh ada.
 *
 * Konsekuensinya yang paling berguna: menambah profesi baru berarti menambah
 * satu entri di sini. Tidak ada komponen yang berubah, tidak ada skema yang
 * ditulis, tidak ada migrasi basis data. Penerbangan, pelaut, atlet, auditor
 * internal, penerjemah, ASN - semuanya masuk lewat pintu yang sama.
 *
 * `jurusanTermasuk` bukan sinonim `nama`. Isinya nama-nama jurusan seperti yang
 * diketik penggunanya sendiri, termasuk singkatan yang lazim dipakai: "PWK",
 * "Ahwal Syakhshiyyah", "Mekatronika", "Tata Boga". Pencarian membaca kolom itu
 * lebih dulu, karena itulah yang ada di kepala orang yang sedang menyusun CV.
 */

/** Dinaikkan setiap kali ada entri ditambah atau diubah. */
export const VERSI_KAMUS = 1;

export const KAMUS_BIDANG: EntriKamus[] = [
  /* ---------------------------------------------------------------------- */
  {
    slug: "software-ti",
    nama: "Teknologi Informasi & Perangkat Lunak",
    polaDisarankan: "karya-visual",
    polaAlternatif: ["proyek-teknis"],
    jurusanTermasuk: [
      "Teknik Informatika",
      "Sistem Informasi",
      "Ilmu Komputer",
      "Rekayasa Perangkat Lunak",
      "RPL",
      "Teknologi Rekayasa Perangkat Lunak",
      "PTIK",
      "Pendidikan Teknik Informatika dan Komputer",
      "Teknik Komputer dan Jaringan",
      "TKJ",
      "Teknologi Informasi",
    ],
    rumpunIlmu: "Ilmu Terapan",
    saranDetailTambahan: [
      { label: "Skala pengguna", satuan: "pengguna/bulan", prioritas: 1 },
      { label: "Transaksi", satuan: "transaksi/bulan", prioritas: 2 },
      { label: "Ukuran tim", satuan: "orang", prioritas: 3 },
      { label: "Kontribusi pribadi", prioritas: 4 },
      { label: "Uptime", satuan: "%", prioritas: 5 },
    ],
    saranIsiFieldInti: {
      perkakas: [
        "React",
        "Next.js",
        "Node.js",
        "Laravel",
        "Python",
        "PostgreSQL",
        "Docker",
        "Git",
      ],
      bentukKarya: ["repo", "demo", "design system", "user flow"],
    },
    kataKunciATS: [
      "React",
      "Next.js",
      "Node",
      "Laravel",
      "Python",
      "REST API",
      "PostgreSQL",
      "Docker",
      "CI/CD",
      "unit test",
      "Agile/Scrum",
      "Git",
    ],
    kredensial: [
      {
        nama: "Sertifikasi BNSP skema digital (Junior Web Programmer, Junior Web Developer, Pengembang Web, Pemrogram Senior, Data Scientist, IT Auditor, Junior Cyber Security)",
        kategori: "kompetensi",
        penerbit: "LSP terlisensi BNSP",
        masaBerlaku:
          "Ditetapkan per skema oleh masing-masing LSP - isikan sesuai sertifikat Anda.",
      },
      {
        nama: "Sertifikasi vendor global (AWS, Google Cloud, Azure, Cisco CCNA, CompTIA, Oracle)",
        kategori: "kompetensi",
        penerbit: "Vendor masing-masing",
        masaBerlaku: "Umumnya berbatas waktu - lihat sertifikat.",
      },
      {
        nama: "Sertifikat pelatihan platform (Dicoding, Bangkit, MSIB/Kampus Merdeka, Digital Talent Scholarship)",
        kategori: "kompetensi",
        penerbit: "Penyelenggara program",
        masaBerlaku: "Umumnya tanpa masa berlaku.",
        catatan:
          "Sertifikat pelatihan platform, bukan sertifikat kompetensi BNSP. Jangan disetarakan.",
      },
    ],
  },

  /* ---------------------------------------------------------------------- */
  {
    slug: "hardware-elektro",
    nama: "Hardware, Elektro & Embedded",
    polaDisarankan: "proyek-teknis",
    polaAlternatif: ["karya-visual"],
    jurusanTermasuk: [
      "Teknik Elektro",
      "Teknik Elektronika",
      "Teknik Telekomunikasi",
      "Mekatronika",
      "Teknik Instrumentasi",
      "Teknik Komputer",
      "Robotika",
      "Teknik Listrik",
    ],
    rumpunIlmu: "Ilmu Terapan",
    saranDetailTambahan: [
      { label: "Komponen inti (MCU/sensor/driver)", prioritas: 1 },
      { label: "Lapisan PCB", satuan: "layer", prioritas: 2 },
      { label: "Jumlah komponen BOM", satuan: "komponen", prioritas: 3 },
      { label: "Biaya per unit", satuan: "rupiah", prioritas: 4 },
      { label: "Konsumsi arus", satuan: "mA", prioritas: 5 },
    ],
    saranIsiFieldInti: {
      perkakas: ["Altium", "KiCad", "Eagle", "Proteus", "LTspice", "MATLAB/Simulink"],
      standarKode: ["IEC", "IEEE", "PUIL", "ISO 9001"],
    },
    kataKunciATS: [
      "PCB",
      "schematic",
      "firmware",
      "mikrokontroler",
      "embedded",
      "sensor",
      "aktuator",
      "PLC",
      "SCADA",
      "kalibrasi",
      "osiloskop",
      "IoT",
    ],
    kredensial: [
      {
        nama: "STRI (Surat Tanda Registrasi Insinyur)",
        kategori: "berjenjang",
        penerbit: "Persatuan Insinyur Indonesia (UU 11/2014)",
        masaBerlaku: "5 tahun",
      },
      {
        nama: "SKK Konstruksi klasifikasi mekanikal atau sains & rekayasa teknik",
        kategori: "berjenjang",
        penerbit: "LSP bidang konstruksi terlisensi BNSP",
        masaBerlaku: "5 tahun, perpanjangan lewat PKB",
      },
      {
        nama: "Ahli K3 Umum",
        kategori: "berjenjang",
        penerbit: "Kemnaker (SKP + Lisensi K3) atau BNSP",
        masaBerlaku: "Lisensi K3 Kemnaker: 3 tahun",
        catatan:
          "Jalur Kemnaker (regulatori) dan jalur BNSP (kompetensi) berbeda fungsi. Keduanya sah - jangan dicampur.",
      },
    ],
  },

  /* ---------------------------------------------------------------------- */
  {
    slug: "sipil-konstruksi",
    nama: "Teknik Sipil & Konstruksi",
    polaDisarankan: "proyek-teknis",
    jurusanTermasuk: [
      "Teknik Sipil",
      "Teknik Struktur",
      "Teknik Transportasi",
      "Geoteknik",
      "Teknik Sumber Daya Air",
      "Teknik Pengairan",
      "Manajemen Konstruksi",
      "MEP",
      "Quantity Surveying",
      "Teknik Bangunan",
    ],
    rumpunIlmu: "Ilmu Terapan",
    saranDetailTambahan: [
      { label: "Sistem struktur", prioritas: 1 },
      { label: "Nilai kontrak", satuan: "miliar rupiah", prioritas: 2 },
      { label: "Luas", satuan: "m2", prioritas: 3 },
      { label: "Bentang", satuan: "m", prioritas: 4 },
      { label: "Jumlah lantai", satuan: "lantai", prioritas: 5 },
      { label: "Jam kerja aman", satuan: "jam", prioritas: 6 },
    ],
    saranIsiFieldInti: {
      standarKode: ["SNI 2847", "SNI 1726", "SNI 1727", "Bina Marga", "SMK3 PP 50/2012"],
      perkakas: ["SAP2000", "ETABS", "Revit/BIM", "Civil 3D", "Tekla", "Primavera"],
    },
    kataKunciATS: [
      "DED",
      "RAB",
      "BoQ",
      "shop drawing",
      "as-built drawing",
      "pengawasan lapangan",
      "MK",
      "kurva S",
      "uji slump",
      "soil test",
      "CPI/SPI",
      "HSE",
    ],
    kredensial: [
      {
        nama: "SKK Konstruksi",
        kategori: "berjenjang",
        penerbit:
          "LSP bidang konstruksi terlisensi BNSP, dicatat Menteri PU lewat SIJKI",
        masaBerlaku: "5 tahun, perpanjangan lewat PKB",
        catatan:
          "Sembilan jenjang (Operator 1-3, Teknisi/Analis 4-6, Ahli 7-9) dan delapan klasifikasi. Isikan jenjang dan klasifikasinya, bukan hanya namanya.",
      },
      {
        nama: "STRI (Surat Tanda Registrasi Insinyur)",
        kategori: "berjenjang",
        penerbit: "Persatuan Insinyur Indonesia",
        masaBerlaku: "5 tahun",
      },
      {
        nama: "Ahli K3 Konstruksi",
        kategori: "sektoral",
        penerbit: "Kemnaker atau LSP terlisensi BNSP",
        masaBerlaku: "Lihat sertifikat.",
      },
    ],
  },

  /* ---------------------------------------------------------------------- */
  {
    slug: "arsitektur-perencanaan",
    nama: "Arsitektur, Interior & Perencanaan",
    polaDisarankan: "karya-visual",
    polaAlternatif: ["proyek-teknis"],
    jurusanTermasuk: [
      "Arsitektur",
      "Desain Interior",
      "Arsitektur Lanskap",
      "Perencanaan Wilayah dan Kota",
      "PWK",
      "Planologi",
      "Teknik Arsitektur",
    ],
    rumpunIlmu: "Ilmu Terapan",
    // Booklet arsitektur lazim memuat lebih banyak proyek daripada studi kasus
    // desain pada umumnya.
    rentangItemIdeal: [5, 7],
    saranDetailTambahan: [
      { label: "Tipologi", prioritas: 1 },
      { label: "Luas bangunan", satuan: "m2", prioritas: 2 },
      { label: "Tahap proyek", prioritas: 3 },
      { label: "Penghargaan / sayembara", prioritas: 4 },
      { label: "Tautan booklet", prioritas: 5 },
    ],
    saranIsiFieldInti: {
      bentukKarya: [
        "denah",
        "potongan",
        "tampak",
        "detail",
        "aksonometri",
        "site plan",
        "render 3D",
        "maket",
        "sketsa tangan",
      ],
      perkakas: ["AutoCAD", "SketchUp", "Revit", "Rhino", "Lumion"],
    },
    kataKunciATS: [
      "denah",
      "potongan",
      "tampak",
      "detail arsitektur",
      "gambar kerja",
      "IMB/PBG",
      "site plan",
      "RTRW",
      "RDTR",
      "BIM",
      "desain skematik",
      "pengembangan desain",
    ],
    kredensial: [
      {
        nama: "STRA (Surat Tanda Registrasi Arsitek)",
        kategori: "berjenjang",
        penerbit: "Dewan Arsitek Indonesia",
        masaBerlaku: "5 tahun, registrasi ulang wajib mengikuti PKB",
      },
      {
        nama: "SKK Konstruksi klasifikasi arsitektural",
        kategori: "berjenjang",
        penerbit: "LSP bidang konstruksi terlisensi BNSP",
        masaBerlaku: "5 tahun, perpanjangan lewat PKB",
      },
      {
        nama: "Lisensi Arsitek",
        kategori: "berjenjang",
        penerbit: "Pemerintah provinsi",
        masaBerlaku: "Lihat lisensi yang diterbitkan.",
      },
      {
        nama: "Sertifikat Green Building (GBCI, EDGE)",
        kategori: "kompetensi",
        penerbit: "GBCI / IFC",
        masaBerlaku: "Lihat sertifikat.",
      },
    ],
    peringatanTambahan: [
      "Arsitek yang berpraktik di Indonesia lazimnya memerlukan tiga dokumen sekaligus: STRA, SKK Konstruksi klasifikasi arsitektural, dan Lisensi Arsitek. Menyebut satu saja sering dianggap belum lengkap.",
    ],
  },

  /* ---------------------------------------------------------------------- */
  {
    slug: "desain-kreatif",
    nama: "Desain Grafis, UI/UX & Industri Kreatif",
    polaDisarankan: "karya-visual",
    polaAlternatif: ["dampak-program"],
    jurusanTermasuk: [
      "Desain Komunikasi Visual",
      "DKV",
      "Desain Produk",
      "Animasi",
      "Multimedia",
      "Fotografi",
      "Film dan Televisi",
      "Tata Busana",
      "Fashion",
      "Kriya",
      "Desain Grafis",
    ],
    rumpunIlmu: "Humaniora",
    saranDetailTambahan: [
      { label: "Tipe proyek", prioritas: 1 },
      { label: "Proses riset", prioritas: 2 },
      { label: "Artefak", prioritas: 3 },
      { label: "Ukuran tim", satuan: "orang", prioritas: 4 },
      { label: "Durasi", satuan: "minggu", prioritas: 5 },
      { label: "Jangkauan", satuan: "tayangan", prioritas: 6 },
    ],
    saranIsiFieldInti: {
      bentukKarya: [
        "wireframe",
        "prototipe",
        "design system",
        "user flow",
        "logo",
        "brand guideline",
        "key visual",
        "dieline kemasan",
        "storyboard",
      ],
      perkakas: ["Figma", "Adobe XD", "Illustrator", "After Effects", "Blender"],
    },
    kataKunciATS: [
      "wireframe",
      "prototype",
      "design system",
      "user research",
      "usability test",
      "A/B test",
      "brand identity",
      "layout",
      "tipografi",
      "motion graphic",
      "packaging",
      "art direction",
    ],
    kredensial: [
      {
        nama: "Sertifikasi BNSP Desainer Grafis Muda",
        kategori: "kompetensi",
        penerbit: "LSP terlisensi BNSP",
        masaBerlaku: "Ditetapkan per skema oleh LSP penerbit.",
      },
      {
        nama: "Adobe Certified Professional",
        kategori: "kompetensi",
        penerbit: "Adobe",
        masaBerlaku: "Lihat sertifikat.",
      },
      {
        nama: "Sertifikasi NN/g (UX)",
        kategori: "kompetensi",
        penerbit: "Nielsen Norman Group",
        masaBerlaku: "Lihat sertifikat.",
      },
    ],
    peringatanTambahan: [
      "Karya untuk klien perlu izin tayang. Karya spekulatif wajib diberi label agar tidak dikira pekerjaan berbayar.",
    ],
  },

  /* ---------------------------------------------------------------------- */
  {
    slug: "kedokteran-kesehatan",
    nama: "Kedokteran & Tenaga Kesehatan",
    polaDisarankan: "praktik-jam",
    polaAlternatif: ["karya-terkredit"],
    jurusanTermasuk: [
      "Kedokteran",
      "Kedokteran Gigi",
      "Keperawatan",
      "Kebidanan",
      "Farmasi",
      "Gizi",
      "Fisioterapi",
      "Analis Kesehatan",
      "ATLM",
      "Teknologi Laboratorium Medik",
      "Kesehatan Masyarakat",
      "Radiologi",
      "Anestesi",
      "Rekam Medis",
    ],
    rumpunIlmu: "Ilmu Terapan",
    saranDetailTambahan: [
      { label: "Departemen", prioritas: 1 },
      { label: "Log prosedur", satuan: "tindakan", prioritas: 2 },
      { label: "Kompetensi (SKDI)", prioritas: 3 },
      { label: "Pelatihan (ACLS/ATLS/BTCLS/PPGD/APN/Hiperkes)", prioritas: 4 },
      { label: "SKP terkumpul", satuan: "SKP", prioritas: 5 },
    ],
    saranIsiFieldInti: {
      kredensialTerkait: ["STR", "SIP", "Sertifikat pelatihan"],
    },
    kataKunciATS: [
      "anamnesis",
      "pemeriksaan fisik",
      "diagnosis banding",
      "tata laksana",
      "rekam medis elektronik",
      "patient safety",
      "akreditasi KARS/SNARS",
      "PPI",
      "triase",
      "edukasi pasien",
      "BPJS",
    ],
    kredensial: [
      {
        nama: "STR (Surat Tanda Registrasi)",
        kategori: "lisensi-praktik",
        penerbit: "Konsil Kesehatan Indonesia",
        masaBerlaku:
          "STR Definitif berlaku seumur hidup (UU 17/2023, PP 28/2024). STR Internsip, Pendidikan, Adaptasi, Penambahan Kompetensi, Sementara, dan Bersyarat tetap berbatas waktu.",
      },
      {
        nama: "SIP (Surat Izin Praktik)",
        kategori: "lisensi-praktik",
        penerbit: "Dinas Kesehatan Kabupaten/Kota atau DPMPTSP",
        masaBerlaku: "5 tahun",
      },
      {
        nama: "Pelatihan kegawatdaruratan (ACLS, ATLS, BTCLS, PPGD, APN)",
        kategori: "sektoral",
        penerbit: "Organisasi profesi atau lembaga pelatihan terakreditasi",
        masaBerlaku: "Umumnya berbatas waktu - lihat sertifikat.",
      },
    ],
    peringatanTambahan: [
      "Jangan pernah menulis identitas pasien, nomor rekam medis, atau foto yang dapat mengidentifikasi orang. Tulis jumlah dan jenis kasus, bukan kasusnya.",
    ],
  },

  /* ---------------------------------------------------------------------- */
  {
    slug: "keagamaan",
    nama: "Keagamaan, Dakwah & Kerohanian",
    polaDisarankan: "praktik-jam",
    polaAlternatif: ["karya-terkredit"],
    jurusanTermasuk: [
      "Pendidikan Agama Islam",
      "PAI",
      "Ilmu Al-Quran dan Tafsir",
      "Ilmu Hadis",
      "Hukum Keluarga Islam",
      "Ahwal Syakhshiyyah",
      "Perbandingan Mazhab",
      "Ekonomi Syariah",
      "Manajemen Dakwah",
      "Bimbingan Penyuluhan Islam",
      "Teologi",
      "Kateketik",
      "Pastoral",
    ],
    rumpunIlmu: "Agama",
    saranDetailTambahan: [
      { label: "Capaian hafalan", satuan: "juz", prioritas: 1 },
      { label: "Sanad / ijazah", prioritas: 2 },
      { label: "Kitab dikuasai", prioritas: 3 },
      { label: "Bahasa Arab (aktif/pasif)", prioritas: 4 },
      { label: "Media dakwah", satuan: "pengikut", prioritas: 5 },
      { label: "Program sosial", satuan: "penerima manfaat", prioritas: 6 },
    ],
    kataKunciATS: [
      "tahfidz",
      "tahsin",
      "kajian tafsir",
      "fiqih",
      "khutbah",
      "penyuluhan agama",
      "bimbingan pranikah",
      "manasik haji",
      "zakat",
      "wakaf",
      "pesantren",
      "madrasah",
    ],
    kredensial: [
      {
        nama: "Sertifikasi Da'i / Penyuluh Agama",
        kategori: "sektoral",
        penerbit: "Kementerian Agama",
        masaBerlaku: "Lihat sertifikat.",
      },
      {
        nama: "Sertifikat pembimbing manasik haji",
        kategori: "sektoral",
        penerbit: "Kementerian Agama",
        masaBerlaku: "Lihat sertifikat.",
      },
      {
        nama: "Sertifikat BP4 / bimbingan pranikah",
        kategori: "sektoral",
        penerbit: "BP4 atau Kementerian Agama",
        masaBerlaku: "Lihat sertifikat.",
      },
      {
        nama: "Sertifikasi Amil Zakat",
        kategori: "sektoral",
        penerbit: "BAZNAS atau LAZ",
        masaBerlaku: "Lihat sertifikat.",
      },
      {
        nama: "Sertifikat DSN-MUI (ekonomi syariah)",
        kategori: "sektoral",
        penerbit: "Dewan Syariah Nasional MUI",
        masaBerlaku: "Lihat sertifikat.",
      },
    ],
    peringatanTambahan: [
      "Sebutkan lembaga dan periodenya agar dapat diverifikasi. Hindari klaim otoritas keilmuan tanpa sanad atau institusi.",
    ],
  },

  /* ---------------------------------------------------------------------- */
  {
    slug: "pendidikan-keguruan",
    nama: "Pendidikan & Keguruan",
    polaDisarankan: "praktik-jam",
    jurusanTermasuk: [
      "PGSD",
      "Pendidikan Guru Sekolah Dasar",
      "PAUD",
      "Pendidikan Guru PAUD",
      "PJKR",
      "Pendidikan Bahasa Indonesia",
      "Pendidikan Bahasa Inggris",
      "Pendidikan Matematika",
      "Pendidikan Fisika",
      "Pendidikan Kimia",
      "Pendidikan Biologi",
      "Bimbingan dan Konseling",
      "BK",
      "Teknologi Pendidikan",
    ],
    rumpunIlmu: "Ilmu Terapan",
    saranDetailTambahan: [
      { label: "Jenjang ajar", prioritas: 1 },
      { label: "Mata pelajaran", prioritas: 2 },
      { label: "Kurikulum", prioritas: 3 },
      { label: "Perangkat ajar buatan sendiri", prioritas: 4 },
      { label: "Pembimbingan lomba", prioritas: 5 },
      { label: "Platform", prioritas: 6 },
    ],
    saranIsiFieldInti: {
      kredensialTerkait: ["Sertifikat Pendidik", "NUPTK"],
    },
    kataKunciATS: [
      "modul ajar",
      "RPP",
      "Kurikulum Merdeka",
      "asesmen diagnostik",
      "pembelajaran diferensiasi",
      "PTK",
      "penilaian formatif",
      "Google Classroom",
      "LMS",
      "pembelajaran berbasis proyek",
    ],
    kredensial: [
      {
        nama: "Sertifikat Pendidik (lewat PPG)",
        kategori: "sektoral",
        penerbit: "LPTK penyelenggara",
        masaBerlaku: "Tanpa masa berlaku",
        catatan:
          "Dua jalur: PPG bagi Calon Guru dan PPG bagi Guru Tertentu (Permendikbudristek 19/2024).",
      },
      {
        nama: "NUPTK",
        kategori: "sektoral",
        penerbit: "Kementerian Pendidikan",
        masaBerlaku: "Tidak punya masa berlaku",
        catatan:
          "Nomor identitas administratif, bukan lisensi mengajar. Jangan disamakan dengan Sertifikat Pendidik.",
      },
    ],
  },

  /* ---------------------------------------------------------------------- */
  {
    slug: "akademik-riset",
    nama: "Akademik & Penelitian",
    polaDisarankan: "karya-terkredit",
    jurusanTermasuk: [
      "Pelamar dosen",
      "Peneliti",
      "Asisten riset",
      "Beasiswa S2",
      "Beasiswa S3",
      "LPDP",
      "Magister",
      "Doktor",
    ],
    rumpunIlmu: "Lintas rumpun",
    saranDetailTambahan: [
      { label: "Hibah (pemberi dana / nilai / peran)", prioritas: 1 },
      { label: "Konferensi", prioritas: 2 },
      { label: "Sitasi", satuan: "sitasi", prioritas: 3 },
      { label: "h-index", prioritas: 4 },
      { label: "Profil peneliti (ORCID/Scholar/SINTA)", prioritas: 5 },
    ],
    saranIsiFieldInti: {
      tipeLuaran: ["artikel jurnal", "prosiding", "bab buku", "buku", "paten/HKI"],
    },
    kataKunciATS: [
      "penelitian",
      "publikasi",
      "Scopus",
      "SINTA",
      "DOI",
      "hibah",
      "korespondensi",
      "peer review",
      "metodologi",
      "analisis data",
      "luaran penelitian",
    ],
    kredensial: [
      {
        nama: "NIDN / NIDK",
        kategori: "sektoral",
        penerbit: "Kementerian yang membidangi pendidikan tinggi",
        masaBerlaku: "Tidak punya masa berlaku",
      },
      {
        nama: "Jabatan fungsional (Asisten Ahli, Lektor, Lektor Kepala, Guru Besar)",
        kategori: "berjenjang",
        penerbit: "Kementerian yang membidangi pendidikan tinggi",
        masaBerlaku: "Tidak punya masa berlaku",
      },
      {
        nama: "Sertifikasi Dosen (Serdos)",
        kategori: "sektoral",
        penerbit: "Perguruan tinggi penyelenggara",
        masaBerlaku: "Tanpa masa berlaku",
      },
    ],
  },

  /* ---------------------------------------------------------------------- */
  {
    slug: "hukum",
    nama: "Hukum",
    polaDisarankan: "dampak-program",
    polaAlternatif: ["karya-terkredit"],
    jurusanTermasuk: [
      "Ilmu Hukum",
      "Hukum Bisnis",
      "Hukum Internasional",
      "Hukum Tata Negara",
      "Hukum Pidana",
      "Hukum Perdata",
      "Syariah",
    ],
    rumpunIlmu: "Ilmu Sosial",
    saranDetailTambahan: [
      { label: "Bidang hukum", prioritas: 1 },
      { label: "Peran perkara", prioritas: 2 },
      { label: "Forum", prioritas: 3 },
      { label: "Jumlah dokumen", satuan: "dokumen", prioritas: 4 },
      { label: "Contoh tulisan (dianonimkan)", prioritas: 5 },
    ],
    kataKunciATS: [
      "legal drafting",
      "legal opinion",
      "due diligence",
      "kontrak",
      "gugatan",
      "somasi",
      "litigasi",
      "nonlitigasi",
      "arbitrase",
      "kepatuhan",
      "perizinan",
      "korporasi",
    ],
    kredensial: [
      {
        nama: "Berita acara sumpah advokat",
        kategori: "lisensi-praktik",
        penerbit: "Pengadilan Tinggi",
        masaBerlaku: "Seumur hidup (KTA organisasi diperpanjang berkala)",
        catatan: "Ditempuh setelah PKPA, Ujian Profesi Advokat, dan magang dua tahun.",
      },
      {
        nama: "Kartu Tanda Anggota organisasi advokat",
        kategori: "sektoral",
        penerbit: "PERADI / KAI",
        masaBerlaku: "Diperpanjang berkala",
      },
    ],
    peringatanTambahan: [
      "Hormati kerahasiaan klien. Ganti nama pihak dan nomor perkara dengan deskriptor generik, dan pastikan contoh tulisan yang ditautkan sudah dianonimkan.",
    ],
  },

  /* ---------------------------------------------------------------------- */
  {
    slug: "bisnis-keuangan",
    nama: "Bisnis, Keuangan & Akuntansi",
    polaDisarankan: "dampak-program",
    jurusanTermasuk: [
      "Akuntansi",
      "Manajemen",
      "Ekonomi",
      "Ekonomi Pembangunan",
      "Perbankan",
      "Keuangan",
      "Perpajakan",
      "Bisnis Digital",
      "Administrasi Bisnis",
    ],
    rumpunIlmu: "Ilmu Sosial",
    saranDetailTambahan: [
      { label: "Sektor klien", prioritas: 1 },
      { label: "Jenis laporan", prioritas: 2 },
      { label: "Periode audit", prioritas: 3 },
      { label: "Nilai portofolio dikelola", satuan: "rupiah", prioritas: 4 },
    ],
    saranIsiFieldInti: {
      metodeStandar: ["PSAK", "IFRS", "SAK EMKM", "SPAP", "COSO"],
      sistemPerkakas: ["Excel lanjutan", "Accurate", "SAP", "MYOB", "e-Faktur", "Coretax"],
    },
    kataKunciATS: [
      "laporan keuangan",
      "jurnal umum",
      "rekonsiliasi",
      "audit internal",
      "SPT",
      "PPh",
      "PPN",
      "analisis kredit",
      "arus kas",
      "budgeting",
      "valuasi",
      "PSAK",
    ],
    kredensial: [
      {
        nama: "Izin Akuntan Publik",
        kategori: "lisensi-praktik",
        penerbit: "Menteri Keuangan (ujian oleh IAPI)",
        masaBerlaku: "Diperpanjang berkala",
      },
      {
        nama: "Chartered Accountant (CA) dan Register Negara Akuntan",
        kategori: "sektoral",
        penerbit: "IAI dan Kementerian Keuangan",
        masaBerlaku: "Lihat kredensial masing-masing",
        catatan: "Berbeda dari izin Akuntan Publik - keduanya tidak saling menggantikan.",
      },
      {
        nama: "Brevet Pajak A/B/C",
        kategori: "kompetensi",
        penerbit: "Lembaga pelatihan perpajakan",
        masaBerlaku: "Tanpa masa berlaku",
      },
      {
        nama: "CFA / CFP / AAJI / WPPE",
        kategori: "kompetensi",
        penerbit: "Asosiasi atau otoritas terkait",
        masaBerlaku: "Lihat sertifikat.",
      },
    ],
    peringatanTambahan: [
      "Angka keuangan perusahaan sering rahasia. Pakai rentang atau persentase relatif, bukan angka pastinya.",
    ],
  },

  /* ---------------------------------------------------------------------- */
  {
    slug: "pemasaran-media",
    nama: "Pemasaran, Komunikasi & Media",
    polaDisarankan: "dampak-program",
    polaAlternatif: ["karya-visual", "karya-terkredit"],
    jurusanTermasuk: [
      "Ilmu Komunikasi",
      "Jurnalistik",
      "Public Relations",
      "Hubungan Masyarakat",
      "Periklanan",
      "Broadcasting",
      "Penyiaran",
      "Bisnis Digital",
      "Sastra",
    ],
    rumpunIlmu: "Ilmu Sosial",
    saranDetailTambahan: [
      { label: "Kanal", prioritas: 1 },
      { label: "Engagement rate", satuan: "%", prioritas: 2 },
      { label: "CTR", satuan: "%", prioritas: 3 },
      { label: "ROAS", prioritas: 4 },
      { label: "Pertumbuhan pengikut", satuan: "pengikut", prioritas: 5 },
      { label: "Anggaran iklan", satuan: "rupiah/bulan", prioritas: 6 },
    ],
    saranIsiFieldInti: {
      sistemPerkakas: [
        "Google Analytics",
        "Meta Business Suite",
        "Ahrefs/SEMrush",
        "Looker Studio",
      ],
    },
    kataKunciATS: [
      "content marketing",
      "SEO",
      "SEM",
      "copywriting",
      "media sosial",
      "siaran pers",
      "kampanye",
      "brand awareness",
      "Google Ads",
      "Meta Ads",
      "engagement",
      "media relations",
    ],
    kredensial: [
      {
        nama: "Uji Kompetensi Wartawan (Muda/Madya/Utama)",
        kategori: "sektoral",
        penerbit: "Lembaga uji terverifikasi Dewan Pers",
        masaBerlaku: "Lihat sertifikat.",
        catatan:
          "Diatur Peraturan Dewan Pers, bukan undang-undang. Sinyal profesi de-facto, bukan lisensi hukum.",
      },
      {
        nama: "Sertifikasi BNSP Digital Marketing",
        kategori: "kompetensi",
        penerbit: "LSP terlisensi BNSP",
        masaBerlaku: "Ditetapkan per skema oleh LSP penerbit.",
      },
      {
        nama: "Google Ads / Google Analytics / Meta Blueprint / HubSpot",
        kategori: "kompetensi",
        penerbit: "Vendor masing-masing",
        masaBerlaku: "Umumnya berbatas waktu - lihat sertifikat.",
      },
    ],
  },

  /* ---------------------------------------------------------------------- */
  {
    slug: "industri-manufaktur",
    nama: "Teknik Industri, Mesin & Manufaktur",
    polaDisarankan: "proyek-teknis",
    polaAlternatif: ["dampak-program"],
    jurusanTermasuk: [
      "Teknik Industri",
      "Teknik Mesin",
      "Teknik Otomotif",
      "Teknik Manufaktur",
      "Teknik Perkapalan",
      "Teknik Penerbangan",
      "Teknik Metalurgi",
      "Teknik Material",
    ],
    rumpunIlmu: "Ilmu Terapan",
    saranDetailTambahan: [
      { label: "Metode", prioritas: 1 },
      { label: "Skala produksi", satuan: "unit/bulan", prioritas: 2 },
      { label: "OEE", satuan: "%", prioritas: 3 },
      { label: "Takt time", satuan: "detik", prioritas: 4 },
      { label: "Downtime", satuan: "jam/tahun", prioritas: 5 },
      { label: "Scrap", satuan: "%", prioritas: 6 },
    ],
    saranIsiFieldInti: {
      perkakas: ["SolidWorks", "CATIA", "Inventor", "ANSYS", "Minitab"],
      standarKode: ["ISO 9001", "ISO 45001", "ASME", "SMK3 PP 50/2012"],
    },
    kataKunciATS: [
      "Lean manufacturing",
      "Six Sigma",
      "Kaizen",
      "5S",
      "TPM",
      "FMEA",
      "root cause analysis",
      "value stream mapping",
      "OEE",
      "preventive maintenance",
      "quality control",
      "SOP",
    ],
    kredensial: [
      {
        nama: "Six Sigma Green Belt / Black Belt",
        kategori: "kompetensi",
        penerbit: "Lembaga pelatihan atau asosiasi",
        masaBerlaku: "Lihat sertifikat.",
      },
      {
        nama: "Welding inspector (AWS / CSWIP)",
        kategori: "kompetensi",
        penerbit: "AWS / TWI",
        masaBerlaku: "Berbatas waktu - lihat sertifikat.",
      },
      {
        nama: "Auditor ISO",
        kategori: "kompetensi",
        penerbit: "Lembaga sertifikasi auditor",
        masaBerlaku: "Lihat sertifikat.",
      },
    ],
  },

  /* ---------------------------------------------------------------------- */
  {
    slug: "energi-tambang-hse",
    nama: "Migas, Pertambangan, Energi & K3/HSE",
    polaDisarankan: "proyek-teknis",
    jurusanTermasuk: [
      "Teknik Kimia",
      "Teknik Perminyakan",
      "Teknik Pertambangan",
      "Teknik Geologi",
      "Teknik Geofisika",
      "Teknik Lingkungan",
      "Keselamatan dan Kesehatan Kerja",
      "K3",
      "Teknik Energi",
    ],
    rumpunIlmu: "Ilmu Terapan",
    saranDetailTambahan: [
      { label: "Jenis operasi", prioritas: 1 },
      { label: "Fasilitas", prioritas: 2 },
      { label: "Kapasitas", prioritas: 3 },
      { label: "Tekanan", satuan: "bar", prioritas: 4 },
      { label: "Suhu", satuan: "C", prioritas: 5 },
      { label: "Jam kerja tanpa kecelakaan", satuan: "jam", prioritas: 6 },
    ],
    saranIsiFieldInti: {
      perkakas: ["HYSYS", "Aspen Plus", "Petrel", "Surpac", "Minescape", "PI System"],
      standarKode: ["API", "ASME", "ISO 14001", "ISO 45001", "SMK3 PP 50/2012", "AMDAL", "PROPER"],
    },
    kataKunciATS: [
      "HSE",
      "JSA",
      "HAZOP",
      "permit to work",
      "P&ID",
      "commissioning",
      "turnaround",
      "produksi",
      "reservoir",
      "eksplorasi",
      "AMDAL",
      "PROPER",
    ],
    kredensial: [
      {
        nama: "Ahli K3 Umum",
        kategori: "berjenjang",
        penerbit: "Kemnaker (SKP + Lisensi K3) atau BNSP",
        masaBerlaku: "Lisensi K3 Kemnaker: 3 tahun",
        catatan:
          "Sertifikat Kemnaker bersifat regulatori, sertifikat BNSP bersifat kompetensi. Keduanya sah dan berbeda fungsi.",
      },
      {
        nama: "POP / POM / POU (pengawas operasional pertambangan)",
        kategori: "berjenjang",
        penerbit: "LSP terlisensi BNSP",
        masaBerlaku: "Ditetapkan per skema.",
      },
      {
        nama: "HSE Passport, Basic Sea Survival / HUET",
        kategori: "kompetensi",
        penerbit: "Lembaga pelatihan terakreditasi",
        masaBerlaku: "Berbatas waktu - lihat sertifikat.",
      },
    ],
    peringatanTambahan: [
      "Data produksi, cadangan, dan nilai kontrak umumnya terikat NDA. Aktifkan Mode Redaksi dan pakai rentang.",
    ],
  },

  /* ---------------------------------------------------------------------- */
  {
    slug: "agro-hayati",
    nama: "Pertanian, Perikanan, Peternakan, Kehutanan & Veteriner",
    polaDisarankan: "proyek-teknis",
    polaAlternatif: ["praktik-jam"],
    jurusanTermasuk: [
      "Agroteknologi",
      "Agribisnis",
      "Budidaya Perairan",
      "Akuakultur",
      "Peternakan",
      "Kehutanan",
      "Kedokteran Hewan",
      "Teknologi Pangan",
      "Biologi",
      "Ilmu Tanah",
      "Perikanan",
    ],
    rumpunIlmu: "Ilmu Terapan",
    saranDetailTambahan: [
      { label: "Komoditas", prioritas: 1 },
      { label: "Skala lahan", satuan: "ha", prioritas: 2 },
      { label: "Metode budidaya", prioritas: 3 },
      { label: "Produktivitas", satuan: "ton/ha", prioritas: 4 },
      { label: "Survival rate", satuan: "%", prioritas: 5 },
      { label: "FCR", prioritas: 6 },
    ],
    kataKunciATS: [
      "budidaya",
      "pemuliaan",
      "pascapanen",
      "hama dan penyakit",
      "pupuk",
      "pakan",
      "biosekuriti",
      "penyuluhan",
      "GAP",
      "rantai dingin",
      "sertifikasi organik",
    ],
    kredensial: [
      {
        nama: "Izin Praktik Dokter Hewan",
        kategori: "lisensi-praktik",
        penerbit: "Diurus lewat OSS/NIB",
        masaBerlaku: "Lihat izin yang diterbitkan.",
      },
      {
        nama: "Sertifikat penyuluh pertanian",
        kategori: "sektoral",
        penerbit: "Kementerian Pertanian atau LSP terkait",
        masaBerlaku: "Lihat sertifikat.",
      },
      {
        nama: "JULEHA (juru sembelih halal), PPNS karantina",
        kategori: "sektoral",
        penerbit: "Lembaga sertifikasi terkait",
        masaBerlaku: "Lihat sertifikat.",
      },
    ],
  },

  /* ---------------------------------------------------------------------- */
  {
    slug: "pariwisata-kuliner",
    nama: "Pariwisata, Perhotelan & Kuliner",
    polaDisarankan: "praktik-jam",
    polaAlternatif: ["karya-visual"],
    jurusanTermasuk: [
      "Perhotelan",
      "Tata Boga",
      "Pariwisata",
      "Usaha Perjalanan Wisata",
      "Manajemen Event",
      "Kuliner",
      "Seni Kuliner",
      "Manajemen Perhotelan",
    ],
    rumpunIlmu: "Ilmu Terapan",
    saranDetailTambahan: [
      { label: "Spesialisasi", prioritas: 1 },
      { label: "Porsi per hari", satuan: "porsi/hari", prioritas: 2 },
      { label: "Occupancy rate", satuan: "%", prioritas: 3 },
      { label: "Food cost", satuan: "%", prioritas: 4 },
      { label: "Standar higiene", prioritas: 5 },
      { label: "Penghargaan", prioritas: 6 },
    ],
    kataKunciATS: [
      "front office",
      "housekeeping",
      "banquet",
      "hot kitchen",
      "pastry",
      "barista",
      "food cost",
      "HACCP",
      "guest satisfaction",
      "reservasi",
      "tour leader",
      "event organizer",
    ],
    kredensial: [
      {
        nama: "Sertifikasi BNSP bidang pariwisata dan perhotelan",
        kategori: "kompetensi",
        penerbit: "LSP terlisensi BNSP",
        masaBerlaku: "Ditetapkan per skema oleh LSP penerbit.",
      },
      {
        nama: "HACCP / food handler / sertifikat laik higiene",
        kategori: "sektoral",
        penerbit: "Dinas Kesehatan atau lembaga sertifikasi",
        masaBerlaku: "Lihat sertifikat.",
      },
    ],
  },

  /* ---------------------------------------------------------------------- */
  {
    slug: "sosial-humaniora",
    nama: "Sosial, Psikologi, Pemerintahan & Kemanusiaan",
    polaDisarankan: "dampak-program",
    polaAlternatif: ["karya-terkredit"],
    jurusanTermasuk: [
      "Psikologi",
      "Sosiologi",
      "Antropologi",
      "Ilmu Politik",
      "Hubungan Internasional",
      "Administrasi Publik",
      "Administrasi Negara",
      "Kesejahteraan Sosial",
      "Sastra",
      "Ilmu Perpustakaan",
    ],
    rumpunIlmu: "Ilmu Sosial",
    saranDetailTambahan: [
      { label: "Metode", prioritas: 1 },
      { label: "Jumlah responden", satuan: "responden", prioritas: 2 },
      { label: "Mitra", prioritas: 3 },
      { label: "Luaran", prioritas: 4 },
    ],
    saranIsiFieldInti: {
      sistemPerkakas: ["SPSS", "NVivo", "Kobo Toolbox"],
    },
    kataKunciATS: [
      "asesmen",
      "FGD",
      "wawancara mendalam",
      "survei",
      "analisis kebijakan",
      "pemberdayaan masyarakat",
      "monitoring dan evaluasi",
      "advokasi",
      "penjangkauan",
      "laporan kebijakan",
    ],
    kredensial: [
      {
        nama: "Izin Praktik Psikologi",
        kategori: "lisensi-praktik",
        penerbit: "HIMPSI (SIPP), Kemenkes (SIPPK), atau Kemdiktisaintek (SILP)",
        masaBerlaku: "Lihat dokumen yang Anda miliki.",
        catatan:
          "Tiga dokumen berbeda dengan penerbit berbeda. Pilih yang benar-benar Anda pegang; kewenangannya sedang jadi pokok sengketa antarlembaga.",
      },
    ],
    peringatanTambahan: [
      "Hasil asesmen psikologis dan data responden bersifat rahasia. Tulis metode dan jumlahnya, bukan isinya.",
    ],
  },

  /* ---------------------------------------------------------------------- */
  {
    slug: "logistik-procurement",
    nama: "Logistik, Rantai Pasok & Pengadaan",
    polaDisarankan: "dampak-program",
    polaAlternatif: ["proyek-teknis"],
    jurusanTermasuk: [
      "Manajemen Logistik",
      "Manajemen Transportasi",
      "Teknik Industri",
      "Manajemen Rantai Pasok",
      "Bisnis",
      "Manajemen Pengadaan",
    ],
    rumpunIlmu: "Ilmu Sosial",
    saranDetailTambahan: [
      { label: "Lingkup", prioritas: 1 },
      { label: "Nilai pengadaan dikelola", satuan: "rupiah", prioritas: 2 },
      { label: "Jumlah vendor", satuan: "vendor", prioritas: 3 },
      { label: "Lead time", satuan: "hari", prioritas: 4 },
      { label: "Safety stock", prioritas: 5 },
      { label: "Penghematan", satuan: "rupiah", prioritas: 6 },
    ],
    saranIsiFieldInti: {
      metodeStandar: ["Perpres 16/2018", "Incoterms", "ISO 28000"],
      sistemPerkakas: ["SPSE/LKPP", "SAP MM", "Odoo", "WMS"],
    },
    kataKunciATS: [
      "procurement",
      "sourcing",
      "negosiasi vendor",
      "kontrak pengadaan",
      "inventory",
      "pergudangan",
      "distribusi",
      "ekspor impor",
      "customs",
      "lead time",
      "demand planning",
    ],
    kredensial: [
      {
        nama: "Sertifikasi Kompetensi Level-1 pengadaan barang/jasa",
        kategori: "sektoral",
        penerbit: "LKPP",
        masaBerlaku: "Lihat sertifikat.",
        catatan:
          "Perlem LKPP 7/2021 mengenal Sertifikasi Kompetensi Level-1, Sertifikasi Kompetensi Pengelola PBJ, dan Sertifikasi Kompetensi Personel Lainnya. Istilah \"level 2/3\" bukan istilah regulasi.",
      },
      {
        nama: "Sertifikasi Kompetensi Personel Lainnya (PPK Tipe A/B, Pejabat Pengadaan, Pokja Pemilihan)",
        kategori: "sektoral",
        penerbit: "LKPP",
        masaBerlaku: "Lihat sertifikat.",
      },
      {
        nama: "CIPS / CSCP / CPIM / Ahli Kepabeanan (PPJK)",
        kategori: "kompetensi",
        penerbit: "Asosiasi atau otoritas terkait",
        masaBerlaku: "Lihat sertifikat.",
      },
    ],
  },

  /* ---------------------------------------------------------------------- */
  {
    slug: "sdm-administrasi",
    nama: "SDM & Administrasi Perkantoran",
    polaDisarankan: "dampak-program",
    jurusanTermasuk: [
      "Manajemen Sumber Daya Manusia",
      "Psikologi Industri",
      "Administrasi Bisnis",
      "Administrasi Perkantoran",
      "Sekretaris",
      "Manajemen SDM",
    ],
    rumpunIlmu: "Ilmu Sosial",
    saranDetailTambahan: [
      { label: "Populasi karyawan dilayani", satuan: "karyawan", prioritas: 1 },
      { label: "Time-to-hire", satuan: "hari", prioritas: 2 },
      { label: "Turnover", satuan: "%", prioritas: 3 },
      { label: "Sistem", prioritas: 4 },
      { label: "Regulasi", prioritas: 5 },
    ],
    saranIsiFieldInti: {
      sistemPerkakas: ["Talenta", "Gadjian", "SuccessFactors"],
      metodeStandar: ["UU Ketenagakerjaan", "PP 35/2021"],
    },
    kataKunciATS: [
      "rekrutmen",
      "seleksi",
      "onboarding",
      "payroll",
      "BPJS",
      "PKWT",
      "manajemen kinerja",
      "KPI",
      "pelatihan dan pengembangan",
      "hubungan industrial",
      "employee engagement",
    ],
    kredensial: [
      {
        nama: "Sertifikasi BNSP bidang manajemen SDM",
        kategori: "kompetensi",
        penerbit: "LSP terlisensi BNSP",
        masaBerlaku: "Ditetapkan per skema oleh LSP penerbit.",
      },
    ],
  },

  /* ---------------------------------------------------------------------- */
  {
    slug: "seni-pertunjukan",
    nama: "Seni Pertunjukan, Musik & Budaya",
    polaDisarankan: "karya-terkredit",
    polaAlternatif: ["karya-visual"],
    jurusanTermasuk: [
      "Seni Musik",
      "Seni Tari",
      "Teater",
      "Karawitan",
      "Seni Rupa Murni",
      "Etnomusikologi",
      "Seni Pertunjukan",
      "Pedalangan",
    ],
    rumpunIlmu: "Humaniora",
    saranDetailTambahan: [
      { label: "Repertoar", prioritas: 1 },
      { label: "Skala penonton", satuan: "penonton", prioritas: 2 },
      { label: "Grade ujian", prioritas: 3 },
      { label: "Penghargaan", prioritas: 4 },
      { label: "Durasi showreel", satuan: "menit", prioritas: 5 },
    ],
    saranIsiFieldInti: {
      tipeLuaran: ["pertunjukan", "rekaman", "pameran", "film/produksi"],
    },
    kataKunciATS: [
      "pertunjukan",
      "repertoar",
      "komposisi",
      "koreografi",
      "sutradara",
      "produksi",
      "festival",
      "residensi",
      "kurasi",
      "showreel",
    ],
    kredensial: [
      {
        nama: "Grade ujian musik (ABRSM / Trinity)",
        kategori: "berjenjang",
        penerbit: "ABRSM / Trinity College London",
        masaBerlaku: "Tidak punya masa berlaku",
      },
    ],
  },

  /* ---------------------------------------------------------------------- */
  {
    slug: "umum",
    nama: "Umum / Belum Menentukan",
    polaDisarankan: "umum",
    jurusanTermasuk: ["Belum menentukan", "Lintas bidang", "Pindah karier"],
    rumpunIlmu: "",
    saranDetailTambahan: [],
    kataKunciATS: [],
    kredensial: [],
  },
];

/* -------------------------------------------------------------------------- */
/* Pembacaan                                                                  */
/* -------------------------------------------------------------------------- */

export function entriKamus(slug: string): EntriKamus | undefined {
  return KAMUS_BIDANG.find((entri) => entri.slug === slug);
}

/** Semua entri kecuali fallback, untuk daftar pilihan. */
export function entriBidangSaja(): EntriKamus[] {
  return KAMUS_BIDANG.filter((entri) => entri.slug !== "umum");
}

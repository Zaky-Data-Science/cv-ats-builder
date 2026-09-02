import type { Locale } from "@/lib/i18n/config";

/**
 * Isi halaman Tentang, dipisahkan dari tata letaknya.
 *
 * Halaman ini berisi prosa panjang, dan prosa panjang tidak nyaman disimpan
 * di dalam kamus antarmuka bersama label tombol. Yang disimpan di sini adalah
 * isinya; page.tsx hanya mengurus bagaimana isi itu ditampilkan.
 */

export interface AboutContent {
  badge: string;
  title: string;
  intro: string;

  problemTitle: string;
  problemParagraphs: string[];

  goalsTitle: string;
  goals: { title: string; body: string }[];

  stackTitle: string;
  stackIntro: string;
  stack: { title: string; body: string }[];

  comparisonTitle: string;
  comparisonIntro: string;
  comparisonHeadAspect: string;
  comparisonHeadOthers: string;
  comparisonHeadOurs: string;
  comparison: { aspect: string; others: string; ours: string }[];

  limitsTitle: string;
  limitsIntro: string;
  limits: string[];

  authorTitle: string;
  authorRole: string;

  ctaTitle: string;
  ctaBody: string;
  ctaButton: string;
}

const id: AboutContent = {
  badge: "Tentang",
  title: "Kenapa aplikasi ini dibuat",
  intro:
    "Sebuah pembuat CV yang menjaga hasilnya tetap terbaca mesin perekrut, menilainya secara terbuka, dan tidak mengunci datanya.",

  problemTitle: "Masalah yang ingin diselesaikan",
  problemParagraphs: [
    "Banyak perusahaan menerima lamaran melalui sistem yang lebih dulu mengurai berkas CV secara otomatis untuk mengambil datanya: nama, kontak, riwayat pekerjaan, dan keahlian. Proses ini berjalan sebelum berkas sampai ke tangan manusia.",
    "Persoalannya, cara sebagian besar orang membuat CV justru menyulitkan proses tersebut. Templat yang beredar luas kerap memakai dua kolom, tabel, ikon sebagai pengganti teks, atau bahkan menyimpan seluruh isi CV sebagai gambar. Bentuk seperti itu terlihat rapi di layar, tetapi ketika teksnya diekstraksi mesin, urutan kalimatnya bisa tertukar dan sebagian isinya hilang sama sekali. Akibatnya, kualifikasi yang sebenarnya dimiliki pelamar tidak terbaca sistem.",
    "Pembuat CV daring yang sudah ada umumnya menyerahkan sepenuhnya urusan tata letak kepada pengguna - termasuk kebebasan membuat susunan yang justru gagal diurai - dan menempatkan fitur evaluasi di balik langganan berbayar. Sebagian besar juga berbahasa Inggris dan memakai konvensi CV luar negeri.",
    "Yang juga jarang tersedia: cara memeriksa CV yang sudah terlanjur dibuat di tempat lain. Orang biasanya memiliki dua atau tiga versi CV dan tidak punya dasar apa pun untuk memilih mana yang sebaiknya dikirim.",
  ],

  goalsTitle: "Yang dilakukan aplikasi ini",
  goals: [
    {
      title: "Menutup kemungkinan salah susun sejak awal",
      body: "Pengguna mengisi field, bukan mengatur tata letak. Kesepuluh template dikunci pada satu kolom tanpa tabel maupun kotak teks, dan judul bagiannya memakai istilah baku yang dikenali pengurai.",
    },
    {
      title: "Mengubah penilaian menjadi tindakan",
      body: "Skor tidak berhenti sebagai angka. Setiap kekurangan disertai penjelasan cara memperbaikinya dan tautan yang melompat langsung ke field bersangkutan.",
    },
    {
      title: "Menilai CV yang sudah ada, bukan hanya yang dibuat di sini",
      body: "Berkas PDF atau Word dari mana pun dapat dipindai dan dibandingkan. Pembacaannya berjalan di dalam peramban pengguna, sehingga tidak ada berkas yang dikirim maupun disimpan di server.",
    },
    {
      title: "Membuat data dapat dipakai berulang",
      body: "CV tersimpan permanen dan dapat diduplikasi untuk disesuaikan per lowongan - kebiasaan yang disarankan perekrut, tetapi jarang dilakukan karena merepotkan bila harus menyusun ulang dari awal.",
    },
    {
      title: "Menjaga data tetap milik penggunanya",
      body: "Seluruh isi CV dapat diunduh sebagai berkas JSON dan diimpor kembali, sehingga pengguna tidak terkunci pada aplikasi ini.",
    },
  ],

  stackTitle: "Rancangan teknis",
  stackIntro:
    "Setiap pilihan di bawah ini diambil karena alasan tertentu, bukan karena sedang populer.",
  stack: [
    {
      title: "Antarmuka dan server",
      body: "Next.js 16 dengan TypeScript. Frontend dan backend berada dalam satu project, sehingga pemeriksaan sesi dapat dilakukan di sisi server sebelum halaman dikirim ke peramban.",
    },
    {
      title: "Basis data",
      body: "PostgreSQL dengan ORM Prisma. Enam belas tabel, seluruh tabel anak memakai ON DELETE CASCADE, dan setiap perubahan skema tercatat sebagai berkas migrasi yang dapat ditelusuri.",
    },
    {
      title: "Autentikasi",
      body: "Auth.js dengan dua jalur masuk: email dan kata sandi (hash bcrypt 12 putaran) serta Google OAuth. Kepemilikan data diperiksa langsung pada kueri, bukan hanya disembunyikan di antarmuka.",
    },
    {
      title: "Penilaian ATS",
      body: "Mesin berbasis kaidah yang deterministik - tanpa model bahasa. Masukan yang sama selalu menghasilkan skor yang sama, sehingga hasil pengujian dapat direproduksi dan setiap angka dapat ditelusuri ke aturannya.",
    },
    {
      title: "Pembacaan berkas CV",
      body: "PDF diurai dengan pdf.js, DOCX dibuka sebagai arsip zip lalu XML-nya dibaca. Keduanya berjalan di peramban, sehingga isi CV tidak pernah melintasi jaringan.",
    },
    {
      title: "Efek kedalaman",
      body: "Seluruhnya CSS - transform dan opacity - tanpa satu pun pustaka 3D. Penggunanya sedang melamar kerja, kerap dari ponsel kelas menengah; menambah ratusan kilobyte demi hiasan berlawanan dengan tujuannya.",
    },
  ],

  comparisonTitle: "Dibandingkan pembuat CV lain",
  comparisonIntro:
    "Perbandingan ini menyangkut pendekatan, bukan mutu. Beberapa aplikasi lain unggul pada hal yang memang bukan tujuan aplikasi ini.",
  comparisonHeadAspect: "Aspek",
  comparisonHeadOthers: "Umumnya",
  comparisonHeadOurs: "Aplikasi ini",
  comparison: [
    {
      aspect: "Struktur keluaran",
      others:
        "Bebas diatur pengguna. Tata letak dua kolom dan kotak teks lazim dipakai karena terlihat menarik.",
      ours: "Dikunci pada satu kolom tanpa tabel dan kotak teks, dengan judul bagian baku.",
    },
    {
      aspect: "Umpan balik",
      others: "Umumnya hanya menyediakan templat; penilaian kerap fitur berbayar.",
      ours: "Penilaian lima dimensi beserta saran perbaikan yang menunjuk ke field tertentu, tersedia tanpa biaya.",
    },
    {
      aspect: "CV dari tempat lain",
      others: "Jarang dapat diperiksa; kalaupun bisa, berkasnya harus diunggah ke server.",
      ours: "Dapat dipindai dan dibandingkan sampai lima berkas sekaligus, seluruhnya di dalam peramban.",
    },
    {
      aspect: "Kepemilikan data",
      others: "Data tersimpan di layanan penyedia; ekspor mentah tidak selalu tersedia.",
      ours: "Seluruh isi CV dapat diunduh sebagai berkas JSON dan diimpor kembali kapan saja.",
    },
    {
      aspect: "Keluaran akhir",
      others: "Sebagian menambahkan watermark pada versi gratis.",
      ours: "Tanpa watermark, tanpa batas jumlah CV.",
    },
    {
      aspect: "Bahasa dan konteks",
      others: "Mayoritas berbahasa Inggris dengan konvensi CV luar negeri.",
      ours: "Dwibahasa Indonesia-Inggris, mengenali kata kerja aksi bahasa Indonesia, format IPK, dan istilah lowongan lokal.",
    },
  ],

  limitsTitle: "Batasan yang diakui",
  limitsIntro:
    "Bagian ini sengaja ada. Aplikasi yang hanya menyebutkan kelebihannya membuat penggunanya salah menaksir seberapa jauh ia boleh bersandar padanya.",
  limits: [
    "Penilaian mensimulasikan kaidah umum ATS, bukan satu produk ATS tertentu. Tiap vendor memiliki pengurai sendiri yang tidak dipublikasikan, sehingga skor tinggi berarti memenuhi kaidah yang diperiksa - bukan jaminan lolos seleksi.",
    "Penilaian membaca teks, bukan memahami maknanya. Ia dapat memastikan CV Anda terbaca mesin, tetapi tidak dapat menilai apakah pengalaman Anda cocok untuk sebuah jabatan.",
    'Pencocokan kata kunci bersifat leksikal. Kata "frontend" dan "front-end" dikenali berbeda, dan sinonim belum dikenali. Pencocokan semantik menjadi arah pengembangan lanjutan.',
    "Pada berkas yang dipindai, struktur CV ditebak dari teksnya. CV dengan judul bagian yang tidak lazim dapat dinilai lebih rendah daripada seharusnya - meski itu sendiri pertanda yang benar, karena pengurai ATS pun akan kesulitan yang sama.",
    "Foto ditambahkan melalui tautan gambar, belum melalui unggahan berkas, karena aplikasi belum menyediakan penyimpanan berkas.",
    "Pemulihan kata sandi lewat email belum tersedia, sebab memerlukan layanan pengirim surel. Pengguna yang lupa kata sandi dapat masuk lewat Google bila emailnya sama.",
  ],

  authorTitle: "Pembuat",
  authorRole: "Perancangan, pemrograman, dan pengujian",

  ctaTitle: "Coba sendiri",
  ctaBody:
    "Gratis, tanpa batas jumlah CV, dan tanpa watermark pada berkas yang Anda unduh.",
  ctaButton: "Mulai buat CV",
};

const en: AboutContent = {
  badge: "About",
  title: "Why this app exists",
  intro:
    "A CV builder that keeps its output readable by recruiting software, scores it openly, and does not lock your data in.",

  problemTitle: "The problem it addresses",
  problemParagraphs: [
    "Many employers receive applications through systems that first parse the CV file automatically to pull out its data: name, contact details, employment history, and skills. This happens before the file ever reaches a person.",
    "The trouble is that the way most people build a CV actively works against that process. Widely circulated templates use two columns, tables, icons in place of text, or store the entire CV as an image. That looks tidy on screen, but when the text is extracted by a machine, sentences can be interleaved and parts of the content disappear entirely. The qualifications the applicant genuinely has never register.",
    "Existing online CV builders generally hand layout entirely to the user - including the freedom to build something that fails to parse - and put evaluation behind a subscription. Most are also English-only and follow non-Indonesian CV conventions.",
    "Something else is rarely offered at all: a way to check a CV that was already made somewhere else. People typically keep two or three versions and have no basis whatsoever for choosing which one to send.",
  ],

  goalsTitle: "What this app does",
  goals: [
    {
      title: "Rules out bad structure from the start",
      body: "Users fill fields rather than arrange layouts. All ten templates are locked to a single column with no tables or text boxes, and their section headings use the standard terms parsers recognise.",
    },
    {
      title: "Turns a score into an action",
      body: "The score does not stop at a number. Every shortcoming comes with how to fix it and a link that jumps straight to the field at fault.",
    },
    {
      title: "Scores CVs made elsewhere, not only ones built here",
      body: "PDF or Word files from anywhere can be scanned and compared. The reading happens inside the user's browser, so no file is sent to, or stored on, a server.",
    },
    {
      title: "Makes the data reusable",
      body: "CVs are stored permanently and can be duplicated and tailored per job ad - the habit recruiters recommend, but which people rarely follow because rebuilding from scratch is tedious.",
    },
    {
      title: "Keeps the data with its owner",
      body: "The whole CV downloads as a JSON file and imports back again, so nobody is locked into this app.",
    },
  ],

  stackTitle: "Technical design",
  stackIntro:
    "Each choice below was made for a reason, not because it was fashionable.",
  stack: [
    {
      title: "Interface and server",
      body: "Next.js 16 with TypeScript. Frontend and backend live in one project, so the session can be checked on the server before a page is sent to the browser.",
    },
    {
      title: "Database",
      body: "PostgreSQL with the Prisma ORM. Sixteen tables, every child table using ON DELETE CASCADE, and every schema change recorded as a migration file you can trace.",
    },
    {
      title: "Authentication",
      body: "Auth.js with two sign-in paths: email and password (bcrypt, 12 rounds) and Google OAuth. Ownership is checked in the query itself, not merely hidden in the interface.",
    },
    {
      title: "ATS scoring",
      body: "A deterministic rule-based engine - no language model. The same input always yields the same score, so test results reproduce and every number traces back to its rule.",
    },
    {
      title: "Reading CV files",
      body: "PDFs are parsed with pdf.js; DOCX files are opened as zip archives and their XML read. Both run in the browser, so CV contents never cross the network.",
    },
    {
      title: "Depth effects",
      body: "All CSS - transform and opacity - with no 3D library at all. The people using this are applying for jobs, often from a mid-range phone; adding hundreds of kilobytes for decoration works against the point.",
    },
  ],

  comparisonTitle: "Compared with other CV builders",
  comparisonIntro:
    "This compares approach, not quality. Some of the others are better at things that are deliberately not this app's aim.",
  comparisonHeadAspect: "Aspect",
  comparisonHeadOthers: "Typically",
  comparisonHeadOurs: "This app",
  comparison: [
    {
      aspect: "Output structure",
      others:
        "Entirely up to the user. Two-column layouts and text boxes are common because they look appealing.",
      ours: "Locked to one column with no tables or text boxes, using standard section headings.",
    },
    {
      aspect: "Feedback",
      others: "Usually just templates; evaluation is often a paid feature.",
      ours: "Five-dimension scoring with fixes that point at specific fields, free of charge.",
    },
    {
      aspect: "CVs from elsewhere",
      others: "Rarely checkable; where it is offered, the file must be uploaded to a server.",
      ours: "Up to five files scanned and compared at once, entirely inside the browser.",
    },
    {
      aspect: "Data ownership",
      others: "Data lives with the provider; raw export is not always offered.",
      ours: "The whole CV downloads as JSON and imports back at any time.",
    },
    {
      aspect: "Final output",
      others: "Some add a watermark on the free tier.",
      ours: "No watermark, and no limit on how many CVs you keep.",
    },
    {
      aspect: "Language and context",
      others: "Mostly English-only, following non-Indonesian CV conventions.",
      ours: "Bilingual Indonesian-English, recognising Indonesian action verbs, GPA formats, and local job-ad wording.",
    },
  ],

  limitsTitle: "Acknowledged limits",
  limitsIntro:
    "This section is here on purpose. An app that lists only its strengths leaves people misjudging how far they can lean on it.",
  limits: [
    "The scoring simulates general ATS conventions, not one specific ATS product. Each vendor has its own unpublished parser, so a high score means the checked rules are satisfied - not that you will pass screening.",
    "The scoring reads text; it does not understand meaning. It can tell you whether machines can read your CV, but not whether your experience fits a particular role.",
    'Keyword matching is lexical. "frontend" and "front-end" count as different words, and synonyms are not recognised yet. Semantic matching is the obvious next step.',
    "For uploaded files, the CV structure is inferred from the text. A CV with unusual section headings may score lower than it deserves - though that is itself a true signal, because an ATS parser would struggle in exactly the same way.",
    "Photos are added by image link rather than file upload, because the app has no file storage yet.",
    "Password recovery by email is not available, as it needs an email delivery service. Anyone who forgets their password can sign in with Google if the address matches.",
  ],

  authorTitle: "Built by",
  authorRole: "Design, programming, and testing",

  ctaTitle: "Try it yourself",
  ctaBody:
    "Free, no limit on how many CVs you keep, and no watermark on what you download.",
  ctaButton: "Start building",
};

export const ABOUT: Record<Locale, AboutContent> = { id, en };

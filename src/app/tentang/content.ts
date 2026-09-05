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
    "Penyusun CV sekaligus portofolio: yang satu dijaga tetap terbaca mesin penyaring lamaran, yang lain memberi bukti dalam bentuk yang memang dipakai bidang Anda. Keduanya dari data yang sama, dinilai secara terbuka, dan tidak mengunci data Anda di dalamnya.",

  problemTitle: "Masalah yang ingin diselesaikan",
  problemParagraphs: [
    "Banyak perusahaan menampung lamaran lewat aplikasi yang membaca berkas CV lebih dulu dan mencomot datanya sendiri: nama, kontak, riwayat kerja, keahlian. Semua itu terjadi sebelum berkasnya sampai ke tangan manusia.",
    "Masalahnya, cara kebanyakan orang membuat CV justru menyulitkan pembacaan itu. Template yang beredar luas sering memakai dua kolom, tabel, ikon sebagai pengganti tulisan, atau bahkan menyimpan seluruh isi CV sebagai gambar. Bentuk begitu memang rapi dilihat mata, tapi ketika mesin membacanya, urutan kalimatnya bisa tertukar dan sebagian isinya hilang sama sekali. Akibatnya pengalaman yang sungguh-sungguh dimiliki pelamar tidak pernah terbaca - bukan karena ia kurang layak, tapi karena berkasnya tidak terbaca.",
    "Pembuat CV daring yang sudah ada umumnya menyerahkan urusan susunan sepenuhnya kepada pengguna - termasuk kebebasan membuat bentuk yang justru gagal dibaca mesin - dan menaruh fitur penilaiannya di balik langganan berbayar. Kebanyakan juga berbahasa Inggris dan mengikuti kebiasaan CV luar negeri.",
    "Yang juga jarang ada: cara memeriksa CV yang sudah terlanjur dibuat di tempat lain. Orang biasanya punya dua atau tiga versi CV, dan tidak punya dasar apa pun untuk memilih mana yang sebaiknya dikirim.",
  ],

  goalsTitle: "Yang dilakukan aplikasi ini",
  goals: [
    {
      title: "Menutup kemungkinan salah susun sejak awal",
      body: "Pengguna mengisi kotak isian, bukan mengatur susunan halaman. Kesepuluh desain dikunci pada satu kolom tanpa tabel maupun kotak teks, dan judul bagiannya memakai istilah baku yang dikenali mesin penyaring.",
    },
    {
      title: "Mengubah penilaian menjadi tindakan",
      body: "Nilainya tidak berhenti sebagai angka. Tiap kekurangan datang bersama cara membetulkannya, dan tautan yang melompat langsung ke kotak isian yang bermasalah.",
    },
    {
      title: "Memberi portofolio bentuk yang diharapkan bidangnya",
      body: "CV menjawab \"pantas diwawancara?\"; portofolio menjawab \"benar-benar bisa?\". Keduanya butuh bukti yang berbeda, dan bidang yang berbeda membuktikan dengan cara yang berbeda pula - arsitek lewat gambar teknis, dosen lewat sitasi dan indeksasi, tenaga kesehatan lewat volume dan lisensi. Isian portofolionya mengikuti salah satu dari lima pola pembuktian itu, bukan satu formulir yang sama untuk semua orang. Hari ini portofolionya menyatu di dalam CV sebagai bagian tersendiri; berkas yang berdiri sendiri belum ada.",
    },
    {
      title: "Menilai CV yang sudah ada, bukan hanya yang dibuat di sini",
      body: "Berkas PDF atau Word dari mana pun bisa diperiksa dan diadu. Pembacaannya terjadi di dalam perangkat penggunanya sendiri, jadi tidak ada berkas yang dikirim maupun disimpan di server.",
    },
    {
      title: "Membuat data dapat dipakai berulang",
      body: "CV tersimpan selamanya dan bisa digandakan untuk disesuaikan tiap lowongan - kebiasaan yang disarankan perekrut, tapi jarang dilakukan karena merepotkan kalau harus menyusun ulang dari awal.",
    },
    {
      title: "Menjaga data tetap milik penggunanya",
      body: "Seluruh isi CV bisa diunduh sebagai berkas cadangan dan dibuka lagi kapan saja, jadi penggunanya tidak terkunci di dalam aplikasi ini.",
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
      body: "PostgreSQL dengan ORM Prisma. Tujuh belas tabel, seluruh tabel anak memakai ON DELETE CASCADE, dan setiap perubahan skema tercatat sebagai berkas migrasi yang dapat ditelusuri.",
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
      body: "PDF dibaca dengan pdf.js, DOCX dibuka sebagai arsip zip lalu XML-nya dibaca. Keduanya berjalan di dalam peramban, sehingga isi CV tidak pernah melintasi jaringan.",
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
      others: "Umumnya hanya menyediakan template; penilaiannya kerap fitur berbayar.",
      ours: "Dinilai dari lima sisi, lengkap dengan saran perbaikan yang menunjuk kotak isian tertentu - tanpa biaya.",
    },
    {
      aspect: "CV dari tempat lain",
      others: "Jarang dapat diperiksa; kalaupun bisa, berkasnya harus diunggah ke server.",
      ours: "Bisa diperiksa dan diadu sampai lima berkas sekaligus, seluruhnya di dalam perangkat penggunanya.",
    },
    {
      aspect: "Kepemilikan data",
      others: "Data tersimpan di layanan penyedianya; salinan mentahnya tidak selalu bisa diambil.",
      ours: "Seluruh isi CV bisa diunduh sebagai berkas cadangan dan dibuka lagi kapan saja.",
    },
    {
      aspect: "Keluaran akhir",
      others: "Sebagian menempelkan tulisan promosi pada versi gratisnya.",
      ours: "Tanpa tulisan tempelan apa pun, tanpa batas jumlah CV.",
    },
    {
      aspect: "Bahasa dan konteks",
      others: "Mayoritas berbahasa Inggris dengan konvensi CV luar negeri.",
      ours: "Dwibahasa Indonesia-Inggris, mengenali kata kerja bahasa Indonesia, penulisan IPK, dan istilah lowongan lokal.",
    },
  ],

  limitsTitle: "Batasan yang diakui",
  limitsIntro:
    "Bagian ini sengaja ada. Aplikasi yang cuma menyebutkan kelebihannya membuat penggunanya salah menaksir seberapa jauh ia boleh bersandar padanya.",
  limits: [
    "Penilaiannya menirukan aturan umum mesin penyaring lamaran, bukan satu produk tertentu. Tiap perusahaan memakai yang berbeda, dan tidak satu pun membuka cara kerjanya - jadi nilai tinggi berarti memenuhi yang kami periksa, bukan jaminan lolos seleksi.",
    "Penilaiannya membaca tulisan, bukan memahami maksudnya. Ia bisa memastikan CV Anda terbaca mesin, tapi tidak bisa menilai apakah pengalaman Anda cocok untuk suatu jabatan.",
    'Kata dicocokkan apa adanya. "frontend" dan "front-end" sudah dianggap sama sejak sesi 6, tetapi kata berimbuhan belum - "mengembangkan" dan "pengembangan" masih dihitung berbeda. Menanganinya menuntut pemenggalan kata, dan itu akan mengorbankan sifat deterministik yang justru menjadi alasan mesin ini dibuat berbasis aturan.',
    "Pada berkas yang diperiksa, susunan CV ditebak dari tulisannya. CV dengan judul bagian yang tidak lazim bisa dinilai lebih rendah daripada seharusnya - meski itu sendiri pertanda yang benar, sebab mesin penyaring pun akan tersandung hal yang sama.",
    "Pas foto disimpan menyatu di dalam data CV, bukan di penyimpanan berkas tersendiri. Konsekuensinya, foto beresolusi sangat besar dikecilkan cukup agresif sebelum disimpan.",
    "Pemulihan kata sandi lewat email sudah terpasang, tetapi baru menyala setelah kunci layanan pengirim surel diisi. Selama belum, halaman Lupa Kata Sandi mengarahkan pengguna masuk lewat Google dengan alamat yang sama, lalu membuat kata sandi baru di Pengaturan.",
  ],

  authorTitle: "Pembuat",
  authorRole: "Perancangan, pemrograman, dan pengujian",

  ctaTitle: "Coba sendiri",
  ctaBody:
    "Gratis, tanpa batas jumlah CV, dan tidak ada satu pun tulisan tempelan di berkas yang Anda unduh.",
  ctaButton: "Mulai buat CV",
};

const en: AboutContent = {
  badge: "About",
  title: "Why this app exists",
  intro:
    "A builder for both a CV and a portfolio: the first stays readable by recruiting software, the second gives evidence in the form your own field actually uses. Both come from the same data, are scored openly, and never lock your data in.",

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
      body: "Users fill in boxes rather than arrange a page. All ten designs are locked to a single column with no tables or text boxes, and their section headings use the standard terms screening software recognises.",
    },
    {
      title: "Turns a score into an action",
      body: "The score does not stop at a number. Every shortcoming comes with how to fix it, and a link that jumps straight to the box at fault.",
    },
    {
      title: "Giving the portfolio the shape its field expects",
      body: "A CV answers \"worth interviewing?\"; a portfolio answers \"can they actually do it?\". Those need different evidence, and different fields prove things differently - architects through technical drawings, academics through citations and indexing, health workers through volume and licences. The portfolio fields follow one of five evidence patterns rather than a single form for everyone. For now the portfolio lives inside the CV as its own section; a standalone file does not exist yet.",
    },
    {
      title: "Scores CVs made elsewhere, not only ones built here",
      body: "PDF or Word files from anywhere can be checked and pitted against each other. The reading happens on the user's own device, so no file is sent to, or stored on, a server.",
    },
    {
      title: "Makes the data reusable",
      body: "CVs are kept for good and can be duplicated and tailored per job ad - the habit recruiters recommend, but which people rarely follow because rebuilding from scratch is tedious.",
    },
    {
      title: "Keeps the data with its owner",
      body: "The whole CV downloads as a backup file and opens again any time, so nobody is locked inside this app.",
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
      body: "PostgreSQL with the Prisma ORM. Seventeen tables, every child table using ON DELETE CASCADE, and every schema change recorded as a migration file you can trace.",
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
      others: "Some stamp their own name onto the free tier's output.",
      ours: "Nothing stamped on at all, and no limit on how many CVs you keep.",
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
    'Words are matched as written. "frontend" and "front-end" have counted as the same since session 6, but inflected forms have not - "develop" and "development" are still counted separately. Handling those needs word stemming, and that would cost the determinism which is the whole reason this engine is rule-based.',
    "For uploaded files, the CV structure is inferred from the text. A CV with unusual section headings may score lower than it deserves - though that is itself a true signal, because screening software would trip on exactly the same thing.",
    "Photos are stored inside the CV data itself rather than in separate file storage. The consequence: very large photos are compressed fairly aggressively before being saved.",
    "Password recovery by email is built, but only comes alive once the mail service key is filled in. Until then, the Forgotten Password page points people to signing in with Google on the same address, then setting a new password in Settings.",
  ],

  authorTitle: "Built by",
  authorRole: "Design, programming, and testing",

  ctaTitle: "Try it yourself",
  ctaBody:
    "Free, no limit on how many CVs you keep, and nothing stamped onto what you download.",
  ctaButton: "Start building",
};

export const ABOUT: Record<Locale, AboutContent> = { id, en };

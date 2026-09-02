import type { Locale } from "@/lib/i18n/config";

/**
 * Teks untuk penilai berkas CV yang diunggah.
 *
 * Setiap aturan memiliki dua sisi: kalimat **kelebihan** yang dipakai bila
 * aturannya terpenuhi, dan kalimat **kekurangan** beserta cara memperbaikinya
 * bila tidak. Bentuk berpasangan ini disengaja - permintaan penggunanya
 * memang "sebutkan kekurangan dan kelebihan setiap CV", dan menilai sesuatu
 * hanya dari kekurangannya membuat pemakainya kehilangan gambaran apa yang
 * sudah ia lakukan dengan benar dan tidak boleh diubah.
 */

export interface DocMessages {
  /* ------------------------------------------------------ kelengkapan --- */
  nameOk: string;
  nameBad: string;
  nameFix: string;
  emailOk: string;
  emailBad: string;
  emailFix: string;
  phoneOk: string;
  phoneBad: string;
  phoneFix: string;
  locationOk: string;
  locationBad: string;
  locationFix: string;
  summaryOk: string;
  summaryBad: string;
  summaryFix: string;
  experienceOk: string;
  experienceBad: string;
  experienceFix: string;
  educationOk: string;
  educationBad: string;
  educationFix: string;
  skillsOk: string;
  skillsBad: string;
  skillsFix: string;
  linkOk: string;
  linkBad: string;
  linkFix: string;

  /* --------------------------------------------------- keterbacaan ----- */
  textLayerOk: string;
  textLayerBad: string;
  textLayerFix: string;
  singleColumnOk: string;
  singleColumnBad: (columns: number) => string;
  singleColumnFix: string;
  noTableCharsOk: string;
  noTableCharsBad: string;
  noTableCharsFix: string;
  noEmojiOk: string;
  noEmojiBad: string;
  noEmojiFix: string;
  headingsOk: (found: number) => string;
  headingsBad: (found: number) => string;
  headingsFix: string;
  datesOk: string;
  datesBad: string;
  datesFix: string;
  paragraphsOk: string;
  paragraphsBad: string;
  paragraphsFix: string;

  /* ------------------------------------------------ kualitas konten ---- */
  bulletsOk: (count: number) => string;
  bulletsBad: (count: number) => string;
  bulletsFix: string;
  actionVerbOk: (percent: number) => string;
  actionVerbBad: (percent: number) => string;
  actionVerbFix: string;
  quantifiedOk: (percent: number) => string;
  quantifiedBad: (percent: number) => string;
  quantifiedFix: string;
  clicheOk: string;
  clicheBad: (phrases: string) => string;
  clicheFix: string;
  firstPersonOk: string;
  firstPersonBad: string;
  firstPersonFix: string;

  /* ------------------------------------------------ panjang & struktur - */
  lengthOk: string;
  lengthTwo: string;
  lengthBad: (pages: number) => string;
  lengthFixTwo: string;
  lengthFixLong: string;
  orderOk: string;
  orderBad: string;
  orderFix: string;
  wordCountOk: (words: number) => string;
  wordCountThin: (words: number) => string;
  wordCountFat: (words: number) => string;
  wordCountFix: string;

  /* --------------------------------------------------- kata kunci ------ */
  keywordOk: (percent: number) => string;
  keywordBad: (percent: number, missing: string) => string;
  keywordFix: string;
  keywordSkipped: string;

  /* ----------------------------------------------------- perbandingan -- */
  verdictClear: (winner: string, margin: number) => string;
  verdictNarrow: (winner: string, margin: number) => string;
  verdictTie: string;
  reasonDimension: (dimension: string, winner: string, delta: number) => string;
  reasonPages: (winner: string, pages: number) => string;
  reasonKeyword: (winner: string, percent: number) => string;
  adviceMerge: string;
  adviceSingle: string;
}

const id: DocMessages = {
  nameOk: "Nama pelamar terbaca jelas di bagian paling atas.",
  nameBad: "Nama pelamar tidak terbaca di bagian atas dokumen.",
  nameFix:
    "Letakkan nama lengkap sebagai baris pertama, berdiri sendiri, tanpa label seperti \"Nama:\". Baris pertama itulah yang dianggap pengurai sebagai nama pelamar.",
  emailOk: "Alamat email tercantum dan berformat sah.",
  emailBad: "Tidak ditemukan alamat email yang sah.",
  emailFix:
    "Cantumkan email di blok kontak paling atas, ditulis sebagai teks biasa - bukan di dalam gambar atau ikon.",
  phoneOk: "Nomor telepon tercantum.",
  phoneBad: "Tidak ditemukan nomor telepon.",
  phoneFix:
    "Tambahkan nomor telepon lengkap dengan kode negara di blok kontak, mis. +62 812-3456-7890.",
  locationOk: "Domisili tercantum.",
  locationBad: "Domisili tidak tercantum.",
  locationFix:
    "Tambahkan kota tempat tinggal. Banyak perusahaan menyaring kandidat berdasarkan lokasi sebelum membaca isinya.",
  summaryOk: "Ada bagian ringkasan profil di bagian awal.",
  summaryBad: "Tidak ada bagian ringkasan profil.",
  summaryFix:
    "Tambahkan bagian berjudul \"Ringkasan Profil\" berisi 30-120 kata: peran, lama pengalaman, keahlian utama, dan satu pencapaian berangka.",
  experienceOk: "Bagian pengalaman kerja ditemukan.",
  experienceBad: "Bagian pengalaman kerja tidak ditemukan.",
  experienceFix:
    "Gunakan judul baku \"Pengalaman Kerja\" atau \"Work Experience\". Judul kreatif membuat seluruh isi bagian ini gagal dipetakan pengurai.",
  educationOk: "Bagian pendidikan ditemukan.",
  educationBad: "Bagian pendidikan tidak ditemukan.",
  educationFix:
    "Tambahkan bagian \"Pendidikan\" berisi jenjang terakhir, institusi, dan tahunnya.",
  skillsOk: "Bagian keahlian ditemukan.",
  skillsBad: "Bagian keahlian tidak ditemukan.",
  skillsFix:
    "Tambahkan bagian \"Keahlian\" berisi daftar keahlian yang ditulis apa adanya. Di bagian inilah ATS paling banyak mencari kecocokan kata kunci.",
  linkOk: "Ada tautan profil profesional (LinkedIn, portofolio, atau GitHub).",
  linkBad: "Tidak ada tautan profil profesional.",
  linkFix:
    "Tambahkan minimal satu tautan - LinkedIn paling lazim diminta perekrut di Indonesia.",

  textLayerOk: "Teksnya dapat diseleksi dan diurai mesin.",
  textLayerBad:
    "Dokumen ini nyaris tidak memuat teks yang dapat dibaca mesin - kemungkinan besar berisi gambar hasil pindai atau ekspor gambar.",
  textLayerFix:
    "Ekspor ulang CV sebagai PDF teks, bukan gambar. CV berupa gambar akan dibaca ATS sebagai dokumen kosong, berapa pun bagus isinya.",
  singleColumnOk: "Tata letaknya satu kolom - urutan bacanya aman bagi mesin.",
  singleColumnBad: (columns) =>
    `Tata letaknya terdeteksi ${columns} kolom.`,
  singleColumnFix:
    "Ubah menjadi satu kolom. Pengurai membaca halaman dari kiri ke kanan lalu turun, sehingga tata letak dua kolom membuat kalimat dari kolom kiri dan kanan terbaca berselang-seling.",
  noTableCharsOk: "Tidak ada karakter tabel atau pemisah kolom di dalam teks.",
  noTableCharsBad: "Ada karakter tabel atau pemisah kolom di dalam teks.",
  noTableCharsFix:
    "Hapus karakter seperti | dan tab. Karakter itu membuat pengurai mengira ada struktur tabel lalu memecah kalimat di tempat yang salah.",
  noEmojiOk: "Tidak ada emoji atau ikon di dalam teks.",
  noEmojiBad: "Ada emoji atau simbol khusus di dalam teks.",
  noEmojiFix:
    "Ganti emoji dengan teks biasa. Simbol yang tidak dikenali dapat membuat seluruh baris tempatnya berada ikut terbuang.",
  headingsOk: (found) => `${found} judul bagian baku dikenali.`,
  headingsBad: (found) =>
    `Hanya ${found} judul bagian baku yang dikenali.`,
  headingsFix:
    "Pakai judul bagian yang baku: Ringkasan Profil, Pengalaman Kerja, Pendidikan, Keahlian. Pengurai mencocokkan judul terhadap daftar istilah baku sebelum memetakan isinya.",
  datesOk: "Format tanggal seragam dan dapat dikenali.",
  datesBad: "Format tanggal tidak seragam atau sulit dikenali.",
  datesFix:
    "Seragamkan format tanggal menjadi \"Bulan Tahun\" (mis. Feb 2023 - Mei 2025). Format campur aduk membuat sistem gagal menghitung total lama pengalaman kerja.",
  paragraphsOk: "Isinya tersusun sebagai baris pendek, bukan paragraf panjang.",
  paragraphsBad: "Ada blok teks yang sangat panjang tanpa pemenggalan.",
  paragraphsFix:
    "Pecah paragraf panjang menjadi poin-poin. Selain lebih mudah diurai, perekrut memindai CV - bukan membacanya kalimat per kalimat.",

  bulletsOk: (count) => `Ada ${count} poin pencapaian.`,
  bulletsBad: (count) =>
    count === 0
      ? "Tidak ditemukan poin pencapaian sama sekali."
      : `Hanya ditemukan ${count} poin pencapaian.`,
  bulletsFix:
    "Tulis 2-4 poin pada setiap pengalaman. Poin pencapaian adalah bagian yang paling membedakan satu pelamar dari pelamar lain.",
  actionVerbOk: (percent) =>
    `${percent}% poin diawali kata kerja aksi.`,
  actionVerbBad: (percent) =>
    `Baru ${percent}% poin yang diawali kata kerja aksi.`,
  actionVerbFix:
    "Awali setiap poin dengan kata kerja aksi - Mengembangkan, Meningkatkan, Memimpin - dan hindari pembuka pasif seperti \"Bertanggung jawab atas\".",
  quantifiedOk: (percent) => `${percent}% poin memuat angka terukur.`,
  quantifiedBad: (percent) =>
    `Baru ${percent}% poin yang memuat angka terukur.`,
  quantifiedFix:
    "Sertakan angka pada minimal separuh poin: persentase, jumlah, nominal, atau durasi. Angka mengubah klaim menjadi bukti.",
  clicheOk: "Tidak ada frasa klise.",
  clicheBad: (phrases) => `Terdapat frasa klise: ${phrases}.`,
  clicheFix:
    "Ganti klaim umum dengan bukti. Alih-alih \"pekerja keras\", tuliskan pencapaian yang menunjukkannya.",
  firstPersonOk: "Tidak memakai kata ganti orang pertama.",
  firstPersonBad: "Memakai kata ganti orang pertama (\"saya\").",
  firstPersonFix:
    "Hilangkan kata \"saya\". Konvensi baku penulisan CV menghilangkan subjek karena seluruh isinya memang tentang pelamar.",

  lengthOk: "Panjangnya satu halaman - ideal.",
  lengthTwo: "Panjangnya dua halaman.",
  lengthBad: (pages) => `Panjangnya ${pages} halaman.`,
  lengthFixTwo:
    "Satu halaman sudah cukup untuk hampir semua pelamar. Pangkas pengalaman yang tidak relevan dengan lowongan yang dituju, bukan mengecilkan hurufnya.",
  lengthFixLong:
    "Pangkas menjadi satu halaman. Buang pengalaman lama yang tidak lagi relevan dan gabungkan poin yang mirip - perekrut umumnya hanya memindai halaman pertama.",
  orderOk: "Ringkasan profil diletakkan sebelum pengalaman kerja.",
  orderBad: "Ringkasan profil berada setelah pengalaman kerja.",
  orderFix:
    "Pindahkan ringkasan profil ke urutan teratas. Bagian itu berfungsi sebagai pembuka yang dibaca lebih dulu.",
  wordCountOk: (words) => `Jumlah kata ${words} - proporsional.`,
  wordCountThin: (words) => `Jumlah kata hanya ${words}.`,
  wordCountFat: (words) => `Jumlah kata mencapai ${words}.`,
  wordCountFix:
    "CV yang proporsional berisi sekitar 250-800 kata. Terlalu sedikit terbaca kosong; terlalu banyak membuat pencapaian penting tenggelam.",

  keywordOk: (percent) =>
    `Kecocokan kata kunci lowongan ${percent}%.`,
  keywordBad: (percent, missing) =>
    `Kecocokan kata kunci lowongan baru ${percent}%. Belum muncul: ${missing}.`,
  keywordFix:
    "Masukkan kata kunci yang relevan dan benar-benar dikuasai ke bagian Keahlian atau ke poin pencapaian.",
  keywordSkipped:
    "Deskripsi lowongan belum ditempelkan, sehingga dimensi kecocokan kata kunci tidak ikut dihitung.",

  verdictClear: (winner, margin) =>
    `${winner} unggul cukup jelas - selisihnya ${margin} poin.`,
  verdictNarrow: (winner, margin) =>
    `${winner} unggul tipis - selisihnya hanya ${margin} poin, jadi keduanya sebenarnya setara. Pilih berdasarkan relevansi isinya terhadap lowongan yang dituju.`,
  verdictTie:
    "Skor keduanya sama. Pilih yang isinya paling relevan dengan lowongan yang dituju.",
  reasonDimension: (dimension, winner, delta) =>
    `${dimension}: ${winner} unggul ${delta} poin.`,
  reasonPages: (winner, pages) =>
    `${winner} lebih ringkas (${pages} halaman).`,
  reasonKeyword: (winner, percent) =>
    `${winner} mencakup lebih banyak kata kunci lowongan (${percent}%).`,
  adviceMerge:
    "Cara tercepat memperbaiki: ambil CV dengan skor tertinggi sebagai dasar, lalu pindahkan pencapaian terbaik dari CV lainnya ke dalamnya.",
  adviceSingle:
    "Perbaiki kekurangan di bawah ini secara berurutan - yang bertanda merah lebih dulu, karena yang itulah yang paling mungkin membuat CV tersaring sebelum dibaca manusia.",
};

const en: DocMessages = {
  nameOk: "The applicant's name reads clearly at the very top.",
  nameBad: "No applicant name is readable at the top of the document.",
  nameFix:
    'Put the full name on the first line, on its own, with no "Name:" label. Parsers treat that first line as the applicant name.',
  emailOk: "A valid email address is present.",
  emailBad: "No valid email address was found.",
  emailFix:
    "Put the email in the contact block at the top, written as plain text - not inside an image or an icon.",
  phoneOk: "A phone number is present.",
  phoneBad: "No phone number was found.",
  phoneFix:
    "Add a full phone number with country code to the contact block, e.g. +62 812-3456-7890.",
  locationOk: "A location is stated.",
  locationBad: "No location is stated.",
  locationFix:
    "Add the city you live in. Many employers filter by location before reading anything else.",
  summaryOk: "There is a professional summary near the top.",
  summaryBad: "There is no professional summary.",
  summaryFix:
    'Add a section headed "Professional Summary" of 30-120 words: role, years of experience, core skills, and one achievement with a number.',
  experienceOk: "A work experience section was found.",
  experienceBad: "No work experience section was found.",
  experienceFix:
    'Use the standard heading "Work Experience". A creative heading stops the whole section from being mapped.',
  educationOk: "An education section was found.",
  educationBad: "No education section was found.",
  educationFix:
    'Add an "Education" section with your most recent qualification, the institution, and the year.',
  skillsOk: "A skills section was found.",
  skillsBad: "No skills section was found.",
  skillsFix:
    'Add a "Skills" section listing skills by their exact names. This is where an ATS looks hardest for keyword matches.',
  linkOk: "A professional profile link is present (LinkedIn, portfolio, or GitHub).",
  linkBad: "There is no professional profile link.",
  linkFix: "Add at least one - LinkedIn is the one recruiters ask for most.",

  textLayerOk: "The text is selectable and machine-readable.",
  textLayerBad:
    "This document contains almost no machine-readable text - it is most likely a scan or an image export.",
  textLayerFix:
    "Export the CV again as a text PDF rather than an image. An image CV reads to an ATS as an empty document, however good its content is.",
  singleColumnOk: "The layout is a single column - safe reading order for machines.",
  singleColumnBad: (columns) => `The layout appears to have ${columns} columns.`,
  singleColumnFix:
    "Switch to a single column. Parsers read left to right and then down, so a two-column layout interleaves sentences from both columns.",
  noTableCharsOk: "No table or column separator characters in the text.",
  noTableCharsBad: "The text contains table or column separator characters.",
  noTableCharsFix:
    "Remove characters such as | and tabs. They make a parser assume a table and break sentences in the wrong places.",
  noEmojiOk: "No emoji or icon characters in the text.",
  noEmojiBad: "The text contains emoji or special symbols.",
  noEmojiFix:
    "Replace emoji with plain text. Unrecognised symbols can cause the whole line they sit on to be dropped.",
  headingsOk: (found) => `${found} standard section headings recognised.`,
  headingsBad: (found) => `Only ${found} standard section headings recognised.`,
  headingsFix:
    "Use standard section headings: Professional Summary, Work Experience, Education, Skills. Parsers match headings against a list of standard terms before mapping what is underneath.",
  datesOk: "Date formats are consistent and recognisable.",
  datesBad: "Date formats are inconsistent or hard to recognise.",
  datesFix:
    'Standardise dates to "Month Year" (e.g. Feb 2023 - May 2025). Mixed formats stop the system from totalling your years of experience.',
  paragraphsOk: "The content is broken into short lines rather than long paragraphs.",
  paragraphsBad: "There are very long unbroken blocks of text.",
  paragraphsFix:
    "Break long paragraphs into bullets. They parse better, and recruiters scan a CV rather than reading it sentence by sentence.",

  bulletsOk: (count) => `There are ${count} achievement bullets.`,
  bulletsBad: (count) =>
    count === 0
      ? "No achievement bullets were found at all."
      : `Only ${count} achievement bullet${count === 1 ? "" : "s"} found.`,
  bulletsFix:
    "Write 2-4 bullets per role. Achievement bullets are what separates one applicant from another more than anything else.",
  actionVerbOk: (percent) => `${percent}% of bullets start with an action verb.`,
  actionVerbBad: (percent) =>
    `Only ${percent}% of bullets start with an action verb.`,
  actionVerbFix:
    'Start every bullet with an action verb - Built, Increased, Led - and avoid passive openings such as "Responsible for".',
  quantifiedOk: (percent) => `${percent}% of bullets contain a number.`,
  quantifiedBad: (percent) => `Only ${percent}% of bullets contain a number.`,
  quantifiedFix:
    "Put a number in at least half the bullets: a percentage, a count, an amount, or a duration. Numbers turn a claim into evidence.",
  clicheOk: "No cliché phrases.",
  clicheBad: (phrases) => `Cliché phrases found: ${phrases}.`,
  clicheFix:
    'Replace generic claims with evidence. Instead of "hard worker", write the achievement that shows it.',
  firstPersonOk: "No first-person pronouns.",
  firstPersonBad: 'The text uses first-person pronouns ("I", "my").',
  firstPersonFix:
    "Drop the pronouns. The standard CV convention omits the subject, because the whole document is about the applicant.",

  lengthOk: "One page long - ideal.",
  lengthTwo: "Two pages long.",
  lengthBad: (pages) => `${pages} pages long.`,
  lengthFixTwo:
    "One page is enough for almost every applicant. Cut experience that is not relevant to the target role rather than shrinking the type.",
  lengthFixLong:
    "Cut it to one page. Drop older experience that is no longer relevant and merge similar bullets - recruiters usually only scan the first page.",
  orderOk: "The summary comes before the work experience.",
  orderBad: "The summary sits after the work experience.",
  orderFix:
    "Move the summary to the top. It is meant to be the opening paragraph a recruiter reads first.",
  wordCountOk: (words) => `${words} words - a sensible length.`,
  wordCountThin: (words) => `Only ${words} words.`,
  wordCountFat: (words) => `${words} words.`,
  wordCountFix:
    "A well-proportioned CV runs to roughly 250-800 words. Too few reads as empty; too many buries the achievements that matter.",

  keywordOk: (percent) => `${percent}% of the job ad's keywords are covered.`,
  keywordBad: (percent, missing) =>
    `Only ${percent}% of the job ad's keywords are covered. Missing: ${missing}.`,
  keywordFix:
    "Work the relevant keywords you genuinely have into the Skills section or into your bullets.",
  keywordSkipped:
    "No job description was pasted, so the keyword-match dimension is not counted.",

  verdictClear: (winner, margin) =>
    `${winner} wins clearly - ${margin} points ahead.`,
  verdictNarrow: (winner, margin) =>
    `${winner} wins by just ${margin} points, so the two are effectively level. Choose whichever content is more relevant to the role you are targeting.`,
  verdictTie:
    "The scores are identical. Choose whichever content is more relevant to the role you are targeting.",
  reasonDimension: (dimension, winner, delta) =>
    `${dimension}: ${winner} leads by ${delta} points.`,
  reasonPages: (winner, pages) => `${winner} is tighter (${pages} pages).`,
  reasonKeyword: (winner, percent) =>
    `${winner} covers more of the job ad's keywords (${percent}%).`,
  adviceMerge:
    "The fastest fix: take the highest-scoring CV as your base, then move the best achievements from the others into it.",
  adviceSingle:
    "Work through the weaknesses below in order - the red ones first, because those are the ones most likely to get the CV filtered out before a person reads it.",
};

const MESSAGES: Record<Locale, DocMessages> = { id, en };

export function docMessages(locale: Locale = "id"): DocMessages {
  return MESSAGES[locale] ?? id;
}

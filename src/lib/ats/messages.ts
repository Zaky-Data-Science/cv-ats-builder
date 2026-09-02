import type { Locale } from "@/lib/i18n/config";
import type { DimensionKey } from "./types";

/**
 * ============================================================================
 *  TEKS MESIN PENILAIAN
 * ============================================================================
 *
 * Seluruh kalimat yang dihasilkan mesin penilaian dikumpulkan di sini, bukan
 * ditulis di dalam berkas aturannya.
 *
 * Alasannya bukan sekadar dwibahasa. Dengan cara ini, `engine.ts` berisi
 * murni logika penilaian - berapa poin, syarat apa yang harus dipenuhi - dan
 * dapat dibaca ulang tanpa terganggu paragraf saran. Sebaliknya, kalimat
 * sarannya dapat diperbaiki susunannya tanpa risiko menyenggol angka.
 *
 * Kalimat yang menyisipkan nilai ditulis sebagai fungsi, sehingga tidak ada
 * penggabungan string setengah jadi yang berantakan saat urutan katanya
 * berbeda antar-bahasa.
 */

export interface AtsMessages {
  dimensionLabel: Record<DimensionKey, string>;
  dimensionDescription: Record<DimensionKey, string>;

  /* ---------------------------------------------------- kelengkapan data */
  nameMissing: string;
  nameMissingFix: string;
  emailInvalid: string;
  emailMissing: string;
  emailFix: string;
  phoneMissing: string;
  phoneFix: string;
  headlineMissing: string;
  headlineFix: string;
  locationMissing: string;
  locationFix: string;
  summaryMissing: string;
  summaryTooShort: (words: number) => string;
  summaryTooLong: (words: number) => string;
  summaryFix: string;
  experienceMissing: string;
  experienceMissingFix: string;
  educationMissing: string;
  educationMissingFix: string;
  skillsFew: (count: number) => string;
  skillsFewFix: string;
  linksMissing: string;
  linksMissingFix: string;

  /* --------------------------------------------------- keterbacaan mesin */
  photoUsed: string;
  photoUsedFix: string;
  fontUnsafe: (font: string) => string;
  fontUnsafeFix: (safe: string) => string;
  fontSizeOutOfRange: (size: number) => string;
  fontSizeFix: string;
  dateFormatMixed: string;
  dateFormatFix: string;
  experienceIncomplete: string;
  experienceIncompleteFix: string;
  experienceNoStart: string;
  experienceNoStartFix: string;
  educationIncomplete: string;
  educationIncompleteFix: string;
  skillNoisy: string;
  skillNoisyFix: string;
  tableChars: string;
  tableCharsFix: string;
  emojiHeading: string;
  emojiHeadingFix: string;

  /* ----------------------------------------------------- kualitas konten */
  noBullets: string;
  noBulletsFix: string;
  actionVerbLow: (percent: number) => string;
  actionVerbFix: string;
  quantifiedLow: (percent: number) => string;
  quantifiedFix: string;
  bulletTooLong: string;
  bulletTooLongFix: string;
  bulletTooShort: string;
  bulletTooShortFix: string;
  clichesFound: (phrases: string) => string;
  clichesFix: string;
  firstPerson: string;
  firstPersonFix: string;
  tooFewBullets: string;
  tooFewBulletsFix: string;

  /* --------------------------------------------------- kecocokan kunci --*/
  noJobDescription: string;
  noJobDescriptionFix: string;
  keywordCoverage: (percent: number, missing: string) => string;
  keywordCoverageFix: string;

  /* ------------------------------------------------- panjang & struktur --*/
  lengthOnePage: string;
  lengthTwoPages: string;
  lengthTooLong: (pages: number) => string;
  lengthOnePageFix: string;
  lengthTwoPagesFix: string;
  lengthTooLongFix: string;
  summaryAfterExperience: string;
  summaryAfterExperienceFix: string;
  experienceUnsorted: string;
  experienceUnsortedFix: string;
  employmentGap: (months: number) => string;
  employmentGapUnknown: string;
  employmentGapFix: string;

  /* ------------------------------------------------------ umum & vonis --*/
  notScorable: (dimension: string) => string;
  notScorableFix: string;
  verdictExcellent: string;
  verdictGood: string;
  verdictFair: string;
  verdictPoor: string;
  verdictNoJobSuffix: string;
}

const id: AtsMessages = {
  dimensionLabel: {
    completeness: "Kelengkapan Data",
    parseability: "Keterbacaan Mesin",
    contentQuality: "Kualitas Konten",
    keywordMatch: "Kecocokan Kata Kunci",
    structure: "Panjang & Struktur",
  },
  dimensionDescription: {
    completeness:
      "Apakah semua informasi yang dicari perekrut sudah ada di CV Anda.",
    parseability:
      "Apakah CV Anda dapat diurai mesin dengan benar: format tanggal, kelengkapan pasangan jabatan-perusahaan, jenis huruf, dan tanpa elemen yang menyulitkan parser.",
    contentQuality:
      "Apakah poin pencapaian ditulis dengan kata kerja aksi dan didukung angka, bukan sekadar daftar tugas.",
    keywordMatch:
      "Seberapa banyak kata kunci penting dari iklan lowongan yang benar-benar muncul di CV Anda.",
    structure:
      "Apakah panjang dan urutan CV wajar, serta tidak ada jeda waktu yang tidak dijelaskan.",
  },

  nameMissing: "Nama lengkap belum diisi.",
  nameMissingFix:
    "Isi field Nama Lengkap di section Data Pribadi. Ini field pertama yang dibaca setiap parser ATS.",
  emailInvalid: "Format email tidak valid.",
  emailMissing: "Alamat email belum diisi.",
  emailFix:
    "Gunakan email aktif berformat nama@domain.com. Tanpa email yang terbaca, sistem rekrutmen tidak dapat menghubungi Anda meski CV lolos seleksi.",
  phoneMissing: "Nomor telepon belum diisi atau terlalu pendek.",
  phoneFix:
    "Isi nomor telepon lengkap dengan kode negara, contoh: +62 812-3456-7890.",
  headlineMissing: "Jabatan/posisi yang dituju belum diisi.",
  headlineFix:
    'Isi field Jabatan dengan posisi yang Anda lamar, mis. "Frontend Developer". Sesuaikan dengan judul lowongan agar cocok saat pencocokan kata kunci.',
  locationMissing: "Domisili belum diisi.",
  locationFix:
    "Isi minimal kota tempat tinggal. Banyak perusahaan memfilter kandidat berdasarkan lokasi.",
  summaryMissing: "Ringkasan profil belum diisi.",
  summaryTooShort: (w) => `Ringkasan profil terlalu singkat (${w} kata).`,
  summaryTooLong: (w) => `Ringkasan profil terlalu panjang (${w} kata).`,
  summaryFix:
    "Tulis 30-120 kata yang memuat: peran Anda, lama pengalaman, keahlian utama, dan satu pencapaian berangka.",
  experienceMissing: "Belum ada pengalaman kerja maupun proyek yang cukup.",
  experienceMissingFix:
    "Isi minimal satu Pengalaman Kerja. Jika Anda fresh graduate, isi minimal dua Proyek sebagai penggantinya.",
  educationMissing: "Riwayat pendidikan belum diisi.",
  educationMissingFix:
    "Isi minimal jenjang pendidikan terakhir beserta tahunnya.",
  skillsFew: (c) => `Jumlah keahlian masih sedikit (${c} dari minimal 5).`,
  skillsFewFix:
    "Tambahkan keahlian teknis maupun perangkat yang Anda kuasai. Section Keahlian adalah tempat utama ATS mencari kecocokan kata kunci.",
  linksMissing: "Belum ada tautan profil profesional.",
  linksMissingFix:
    "Tambahkan minimal satu tautan: LinkedIn, portofolio, atau GitHub.",

  photoUsed: "CV menampilkan pas foto.",
  photoUsedFix:
    "Matikan opsi Tampilkan Foto. Sebagian besar parser ATS tidak dapat membaca gambar, dan tata letak di sekitar foto sering membuat teks terbaca berantakan. Aktifkan hanya bila lowongan secara eksplisit memintanya.",
  fontUnsafe: (f) => `Jenis huruf "${f}" bukan huruf yang aman untuk ATS.`,
  fontUnsafeFix: (safe) =>
    `Gunakan salah satu dari: ${safe}. Huruf yang tidak tersedia di sistem penerima akan disubstitusi dan dapat merusak tata letak.`,
  fontSizeOutOfRange: (s) =>
    `Ukuran huruf ${s}pt berada di luar rentang aman.`,
  fontSizeFix:
    "Gunakan 10-11pt. Huruf di bawah 9pt sulit dibaca manusia maupun mesin OCR.",
  dateFormatMixed: "Ada tanggal dengan format tidak baku.",
  dateFormatFix:
    "Isi seluruh tanggal lewat pemilih bulan yang tersedia agar formatnya seragam. Format tanggal yang campur aduk membuat parser gagal menghitung lama pengalaman kerja.",
  experienceIncomplete:
    "Ada pengalaman kerja tanpa jabatan atau tanpa nama perusahaan.",
  experienceIncompleteFix:
    "Lengkapi kedua field tersebut pada setiap entri. Parser ATS memetakan pengalaman kerja berdasarkan pasangan jabatan-perusahaan; salah satu kosong membuat entri itu terbuang.",
  experienceNoStart: "Ada pengalaman kerja tanpa tanggal mulai.",
  experienceNoStartFix:
    "Isi bulan dan tahun mulai pada setiap pengalaman. Tanpa itu, sistem tidak dapat menghitung total lama pengalaman Anda.",
  educationIncomplete:
    "Ada riwayat pendidikan tanpa nama institusi atau jenjang.",
  educationIncompleteFix:
    'Lengkapi nama institusi dan jenjang (mis. "S1", "SMA") pada setiap entri pendidikan.',
  skillNoisy: "Ada nama keahlian yang disertai keterangan tingkat penguasaan.",
  skillNoisyFix:
    'Tulis nama keahlian apa adanya, mis. "JavaScript" bukan "JavaScript (mahir)". ATS mencocokkan kata kunci secara harfiah, sehingga tambahan dalam kurung justru menurunkan kecocokan.',
  tableChars: "Ada poin yang memuat karakter tabel atau pemisah kolom.",
  tableCharsFix:
    "Hapus karakter seperti | atau tab dari isi poin. Karakter tersebut membuat parser mengira ada struktur tabel dan memecah kalimat Anda.",
  emojiHeading: "Ada judul section tambahan yang memuat emoji.",
  emojiHeadingFix:
    "Gunakan judul berupa teks biasa. Emoji tidak dikenali parser dan dapat membuat seluruh isi section tersebut gagal dipetakan.",

  noBullets: "Belum ada poin pencapaian sama sekali.",
  noBulletsFix:
    "Tambahkan minimal 2-3 poin pada setiap pengalaman kerja atau proyek. Bagian inilah yang membedakan Anda dari pelamar lain.",
  actionVerbLow: (p) => `Baru ${p}% poin yang diawali kata kerja aksi.`,
  actionVerbFix:
    'Mulai setiap poin dengan kata kerja aksi seperti Mengembangkan, Meningkatkan, Memimpin, atau Mengoptimasi. Hindari pembuka pasif seperti "Bertanggung jawab atas".',
  quantifiedLow: (p) => `Baru ${p}% poin yang memuat angka terukur.`,
  quantifiedFix:
    'Sertakan angka pada minimal separuh poin: persentase, jumlah pengguna, nominal, atau durasi. Contoh: "Menurunkan waktu muat 45% (3,2 detik menjadi 1,8 detik)".',
  bulletTooLong: "Ada poin yang terlalu panjang.",
  bulletTooLongFix:
    "Pertahankan tiap poin dalam 1-2 baris (maksimal sekitar 220 karakter). Poin yang panjang cenderung dilewati saat perekrut memindai CV.",
  bulletTooShort: "Ada poin yang terlalu singkat sehingga kurang informatif.",
  bulletTooShortFix:
    "Kembangkan poin singkat dengan menambahkan konteks dan hasil, bukan sekadar nama tugas.",
  clichesFound: (phrases) => `Terdapat frasa klise: ${phrases}.`,
  clichesFix:
    'Ganti klaim umum dengan bukti. Alih-alih "pekerja keras", tulis pencapaian nyata yang menunjukkannya.',
  firstPerson: "Ringkasan profil memakai kata ganti orang pertama.",
  firstPersonFix:
    'Hilangkan kata "saya". Tulis "Frontend Developer dengan pengalaman 4 tahun..." alih-alih "Saya adalah seorang...". Ini konvensi baku penulisan CV.',
  tooFewBullets: "Ada pengalaman kerja dengan kurang dari 2 poin pencapaian.",
  tooFewBulletsFix:
    "Isi minimal 2 poin per pengalaman, idealnya 3-4 pada posisi terbaru.",

  noJobDescription: "Deskripsi lowongan belum ditempelkan.",
  noJobDescriptionFix:
    "Tempelkan teks lowongan yang Anda incar untuk mengetahui kata kunci apa saja yang belum muncul di CV. Dimensi ini belum dihitung ke dalam skor.",
  keywordCoverage: (percent, missing) =>
    `Kecocokan kata kunci baru ${percent}%. Belum muncul di CV: ${missing}.`,
  keywordCoverageFix:
    "Masukkan kata kunci yang relevan dan benar-benar Anda kuasai ke section Keahlian atau ke poin pencapaian. Jangan menempelkan kata kunci yang tidak Anda kuasai - itu akan terbongkar saat wawancara.",

  lengthOnePage: "Panjang CV 1 halaman.",
  lengthTwoPages: "Panjang CV 2 halaman.",
  lengthTooLong: (p) => `Panjang CV ${p} halaman.`,
  lengthOnePageFix:
    "Panjang yang ideal. Perekrut umumnya memindai satu CV dalam hitungan detik, dan satu halaman memastikan seluruh isinya benar-benar terlihat.",
  lengthTwoPagesFix:
    "Satu halaman sudah cukup untuk hampir semua pelamar - termasuk yang berpengalaman. Coba pangkas pengalaman yang tidak relevan dengan lowongan yang dituju dan gabungkan poin yang mirip. Dua halaman baru sepadan bila Anda punya lebih dari lima tahun pengalaman yang seluruhnya relevan.",
  lengthTooLongFix:
    "Pangkas menjadi satu halaman. Buang pengalaman lama yang tidak lagi relevan, gabungkan poin yang mirip, dan sisakan hanya pencapaian yang mendukung lowongan yang Anda tuju. Mengecilkan ukuran huruf bukan jalan keluar - yang perlu dikurangi isinya, bukan hurufnya.",
  summaryAfterExperience: "Ringkasan profil berada setelah pengalaman kerja.",
  summaryAfterExperienceFix:
    "Letakkan Ringkasan Profil di urutan teratas. Bagian ini berfungsi sebagai pembuka yang dibaca lebih dulu.",
  experienceUnsorted: "Pengalaman kerja belum urut dari yang paling baru.",
  experienceUnsortedFix:
    "Susun pengalaman secara kronologis terbalik - posisi terbaru di urutan pertama. Ini format yang diharapkan hampir semua perekrut dan ATS.",
  employmentGap: (m) => `Terdapat jeda ${m} bulan antar-pengalaman kerja.`,
  employmentGapUnknown: "Terdapat jeda antar-pengalaman kerja.",
  employmentGapFix:
    "Jeda lebih dari 12 bulan sebaiknya dijelaskan - isi dengan proyek, kursus, atau kegiatan organisasi pada periode tersebut.",

  notScorable: (dimension) => `${dimension} belum dapat dinilai.`,
  notScorableFix:
    "Isi dulu ringkasan profil dan minimal satu pengalaman kerja atau proyek, lalu dimensi ini akan ikut dihitung.",
  verdictExcellent: "CV Anda sudah sangat siap dikirim.",
  verdictGood: "CV Anda sudah baik, tinggal beberapa perbaikan kecil.",
  verdictFair:
    "CV Anda cukup, namun ada beberapa hal penting yang perlu diperbaiki.",
  verdictPoor: "CV Anda berisiko tersaring sistem sebelum dibaca manusia.",
  verdictNoJobSuffix:
    " Skor ini belum memperhitungkan kecocokan dengan lowongan tertentu.",
};

const en: AtsMessages = {
  dimensionLabel: {
    completeness: "Completeness",
    parseability: "Machine readability",
    contentQuality: "Content quality",
    keywordMatch: "Keyword match",
    structure: "Length & structure",
  },
  dimensionDescription: {
    completeness:
      "Whether everything a recruiter looks for is actually present in your CV.",
    parseability:
      "Whether software can parse your CV correctly: date formats, complete job-title and employer pairs, the typeface, and the absence of anything that trips a parser up.",
    contentQuality:
      "Whether your bullets are written as achievements with action verbs and numbers, rather than a list of duties.",
    keywordMatch:
      "How many of the important keywords from the job ad genuinely appear in your CV.",
    structure:
      "Whether the length and ordering are sensible, and whether there are unexplained gaps.",
  },

  nameMissing: "Your full name is missing.",
  nameMissingFix:
    "Fill in the Full Name field under Personal Details. It is the first field every ATS parser reads.",
  emailInvalid: "The email address is not a valid address.",
  emailMissing: "Your email address is missing.",
  emailFix:
    "Use an address you actually check, in the form name@domain.com. Without a readable email, a recruiting system cannot contact you even when your CV passes screening.",
  phoneMissing: "Your phone number is missing or too short.",
  phoneFix:
    "Enter the full number including the country code, for example +62 812-3456-7890.",
  headlineMissing: "The job title you are targeting is missing.",
  headlineFix:
    'Fill in the job title you are applying for, e.g. "Frontend Developer". Match the wording of the job ad so it lines up during keyword matching.',
  locationMissing: "Your location is missing.",
  locationFix:
    "Enter at least the city you live in. Many employers filter candidates by location.",
  summaryMissing: "Your professional summary is empty.",
  summaryTooShort: (w) => `The professional summary is too short (${w} words).`,
  summaryTooLong: (w) => `The professional summary is too long (${w} words).`,
  summaryFix:
    "Write 30-120 words covering your role, years of experience, core skills, and one achievement with a number in it.",
  experienceMissing: "There is not enough work experience or project work yet.",
  experienceMissingFix:
    "Add at least one work experience entry. If you are a fresh graduate, add at least two projects instead.",
  educationMissing: "Your education history is empty.",
  educationMissingFix:
    "Add at least your most recent qualification and the year you finished it.",
  skillsFew: (c) => `Only ${c} skills listed - aim for at least 5.`,
  skillsFewFix:
    "Add the technical skills and tools you actually use. The Skills section is the first place an ATS looks for keyword matches.",
  linksMissing: "No professional profile link yet.",
  linksMissingFix: "Add at least one: LinkedIn, a portfolio, or GitHub.",

  photoUsed: "The CV includes a photo.",
  photoUsedFix:
    "Turn the photo off. Most ATS parsers cannot read images, and the layout around a photo often scrambles the surrounding text. Only switch it on when the job ad explicitly asks for one.",
  fontUnsafe: (f) => `The typeface "${f}" is not a safe choice for ATS.`,
  fontUnsafeFix: (safe) =>
    `Use one of: ${safe}. A typeface the receiving system does not have will be substituted, which can break the layout.`,
  fontSizeOutOfRange: (s) => `A ${s}pt font size is outside the safe range.`,
  fontSizeFix:
    "Use 10-11pt. Anything below 9pt is hard to read for humans and for OCR alike.",
  dateFormatMixed: "Some dates are not in a standard format.",
  dateFormatFix:
    "Enter every date through the month picker so the format is consistent. Mixed date formats stop a parser from calculating how long you have worked.",
  experienceIncomplete:
    "Some work experience entries are missing a job title or an employer.",
  experienceIncompleteFix:
    "Fill in both fields on every entry. An ATS maps work history by the job-title and employer pair; if either is blank the entry is discarded.",
  experienceNoStart: "Some work experience entries have no start date.",
  experienceNoStartFix:
    "Add the starting month and year to every entry. Without it, the system cannot total up your years of experience.",
  educationIncomplete:
    "Some education entries are missing the institution or the qualification.",
  educationIncompleteFix:
    'Fill in both the institution and the qualification (e.g. "Bachelor", "High School") on every entry.',
  skillNoisy: "Some skills carry a proficiency label.",
  skillNoisyFix:
    'Write the skill exactly as it is named: "JavaScript", not "JavaScript (advanced)". ATS software matches keywords literally, so anything in brackets only lowers the match.',
  tableChars: "Some bullets contain table or column separator characters.",
  tableCharsFix:
    "Remove characters such as | or tabs from your bullets. They make a parser think there is a table and split your sentences apart.",
  emojiHeading: "An additional section heading contains an emoji.",
  emojiHeadingFix:
    "Use plain text headings. Emoji are not recognised by parsers and can cause the whole section to go unmapped.",

  noBullets: "There are no achievement bullets at all yet.",
  noBulletsFix:
    "Add at least 2-3 bullets to every job or project. This is the part that separates you from every other applicant.",
  actionVerbLow: (p) => `Only ${p}% of your bullets start with an action verb.`,
  actionVerbFix:
    'Start every bullet with an action verb such as Built, Increased, Led, or Optimised. Avoid passive openings such as "Responsible for".',
  quantifiedLow: (p) => `Only ${p}% of your bullets contain a number.`,
  quantifiedFix:
    'Put a number in at least half your bullets: a percentage, a user count, an amount, or a duration. For example: "Cut load time by 45% (3.2s to 1.8s)".',
  bulletTooLong: "Some bullets are too long.",
  bulletTooLongFix:
    "Keep each bullet to 1-2 lines (about 220 characters). Long bullets tend to be skipped when a recruiter scans a CV.",
  bulletTooShort: "Some bullets are too short to say anything useful.",
  bulletTooShortFix:
    "Expand short bullets with context and the result, rather than just naming the task.",
  clichesFound: (phrases) => `Cliché phrases found: ${phrases}.`,
  clichesFix:
    'Replace generic claims with evidence. Instead of "hard worker", write the achievement that proves it.',
  firstPerson: "The professional summary uses first-person pronouns.",
  firstPersonFix:
    'Drop the "I". Write "Frontend Developer with 4 years of experience..." rather than "I am a...". This is the standard convention for CVs.',
  tooFewBullets: "Some work experience entries have fewer than 2 bullets.",
  tooFewBulletsFix:
    "Write at least 2 bullets per role, ideally 3-4 for your most recent one.",

  noJobDescription: "No job description pasted yet.",
  noJobDescriptionFix:
    "Paste the text of the job you are targeting to find out which keywords are missing from your CV. This dimension is not counted in the score yet.",
  keywordCoverage: (percent, missing) =>
    `Keyword match is only ${percent}%. Not yet in your CV: ${missing}.`,
  keywordCoverageFix:
    "Work the relevant keywords you genuinely have into your Skills section or your bullets. Do not paste in keywords you cannot back up - it will surface in the interview.",

  lengthOnePage: "The CV is 1 page long.",
  lengthTwoPages: "The CV is 2 pages long.",
  lengthTooLong: (p) => `The CV is ${p} pages long.`,
  lengthOnePageFix:
    "That is the ideal length. Recruiters scan a CV in seconds, and one page guarantees all of it is actually seen.",
  lengthTwoPagesFix:
    "One page is enough for almost every applicant, experienced ones included. Try cutting experience that is not relevant to the role you are targeting and merging similar bullets. Two pages only earn their keep when you have more than five years of directly relevant experience.",
  lengthTooLongFix:
    "Cut it down to one page. Drop older experience that is no longer relevant, merge similar bullets, and keep only the achievements that support the role you are applying for. Shrinking the font is not the answer - it is the content that needs cutting, not the type.",
  summaryAfterExperience:
    "The professional summary sits after your work experience.",
  summaryAfterExperienceFix:
    "Move the Professional Summary to the top. It is meant to be the opening paragraph a recruiter reads first.",
  experienceUnsorted: "Work experience is not in reverse-chronological order.",
  experienceUnsortedFix:
    "Put the most recent role first. This is the order almost every recruiter and ATS expects.",
  employmentGap: (m) => `There is a ${m}-month gap between roles.`,
  employmentGapUnknown: "There is a gap between roles.",
  employmentGapFix:
    "Gaps longer than 12 months are worth explaining - fill the period with a project, a course, or organisational work.",

  notScorable: (dimension) => `${dimension} cannot be scored yet.`,
  notScorableFix:
    "Fill in your professional summary and at least one job or project first, and this dimension will start counting.",
  verdictExcellent: "Your CV is ready to send.",
  verdictGood: "Your CV is in good shape - only small fixes left.",
  verdictFair: "Your CV is passable, but several important things need fixing.",
  verdictPoor:
    "Your CV risks being filtered out by software before a person ever reads it.",
  verdictNoJobSuffix:
    " This score does not yet account for how well you match a specific job ad.",
};

const MESSAGES: Record<Locale, AtsMessages> = { id, en };

export function atsMessages(locale: Locale = "id"): AtsMessages {
  return MESSAGES[locale] ?? id;
}

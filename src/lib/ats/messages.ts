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
    completeness: "Kelengkapan isi",
    parseability: "Bisa dibaca mesin",
    contentQuality: "Mutu kalimatnya",
    keywordMatch: "Kecocokan dengan lowongan",
    structure: "Panjang dan urutan",
  },
  dimensionDescription: {
    completeness:
      "Apakah semua yang dicari perekrut sudah ada di CV-mu, nama, kontak, pengalaman, pendidikan, keahlian.",
    parseability:
      "Apakah mesin penyaring bisa membaca CV-mu tanpa tersandung: penulisan tanggal, kelengkapan pasangan jabatan-perusahaan, jenis huruf, dan tidak adanya hal yang membuatnya salah baca.",
    contentQuality:
      "Apakah poin-poinmu ditulis sebagai pencapaian, diawali kata kerja dan menyebut angka, atau cuma daftar tugas harian.",
    keywordMatch:
      "Berapa banyak kata penting dari iklan lowongan yang benar-benar muncul di CV-mu.",
    structure:
      "Apakah panjang dan urutannya wajar, dan apakah ada jeda waktu yang belum dijelaskan.",
  },

  nameMissing: "Nama lengkap belum diisi.",
  nameMissingFix:
    "Isi Nama Lengkap di bagian Data Pribadi. Ini yang pertama dicari setiap mesin penyaring.",
  emailInvalid: "Penulisan emailnya belum benar.",
  emailMissing: "Alamat email belum diisi.",
  emailFix:
    "Pakai email aktif berbentuk nama@domain.com. Tanpa email yang terbaca, perusahaan tidak bisa menghubungi kamu, bahkan kalau CV-nya lolos.",
  phoneMissing: "Nomor telepon belum diisi atau terlalu pendek.",
  phoneFix:
    "Isi nomor telepon lengkap dengan kode negara, contoh: +62 812-3456-7890.",
  headlineMissing: "Jabatan/posisi yang dituju belum diisi.",
  headlineFix:
    'Isi Jabatan dengan posisi yang kamu lamar, misalnya "Frontend Developer". Samakan dengan judul lowongannya - itu salah satu yang paling cepat menaikkan kecocokan.',
  locationMissing: "Domisili belum diisi.",
  locationFix:
    "Isi kota tempat tinggal kamu, minimal itu. Banyak perusahaan menyaring pelamar berdasarkan lokasi lebih dulu.",
  summaryMissing: "Ringkasan profil belum diisi.",
  summaryTooShort: (w) => `Ringkasan profil terlalu singkat (${w} kata).`,
  summaryTooLong: (w) => `Ringkasan profil terlalu panjang (${w} kata).`,
  summaryFix:
    "Tulis 30-120 kata yang memuat empat hal: peran kamu, sudah berapa lama, keahlian utama, dan satu pencapaian yang ada angkanya.",
  experienceMissing: "Belum ada pengalaman kerja maupun proyek yang cukup.",
  experienceMissingFix:
    "Isi minimal satu Pengalaman Kerja. Kalau kamu baru lulus, isi minimal dua Proyek sebagai gantinya, itu dihitung setara.",
  educationMissing: "Riwayat pendidikan belum diisi.",
  educationMissingFix:
    "Isi minimal pendidikan terakhir kamu beserta tahunnya.",
  skillsFew: (c) => `Keahliannya masih sedikit - baru ${c}, sebaiknya minimal 5.`,
  skillsFewFix:
    "Tambahkan keahlian dan perangkat yang kamu kuasai. Bagian Keahlian adalah tempat pertama mesin penyaring mencari kecocokan.",
  linksMissing: "Belum ada tautan profil apa pun.",
  linksMissingFix:
    "Tambahkan minimal satu: LinkedIn, portofolio, atau GitHub.",

  photoUsed: "CV menampilkan pas foto.",
  photoUsedFix:
    "Matikan pilihan Tampilkan Pas Foto. Mesin penyaring tidak bisa melihat gambar, dan susunan di sekitar foto sering membuat tulisannya terbaca acak-acakan. Nyalakan hanya kalau lowongannya memang minta.",
  fontUnsafe: (f) => `Huruf "${f}" berisiko - belum tentu ada di komputer penerima.`,
  fontUnsafeFix: (safe) =>
    `Pakai salah satu dari: ${safe}. Huruf yang tidak ada di komputer penerima akan diganti sendiri oleh komputernya, dan susunan CV-mu bisa berantakan.`,
  fontSizeOutOfRange: (s) =>
    `Huruf ${s}pt terlalu kecil atau terlalu besar.`,
  fontSizeFix:
    "Pakai 10-11pt. Di bawah 9pt sulit dibaca, baik oleh manusia maupun oleh mesin.",
  dateFormatMixed: "Ada tanggal yang penulisannya berbeda sendiri.",
  dateFormatFix:
    "Isi semua tanggal lewat pemilih bulan yang tersedia, supaya penulisannya seragam. Tanggal yang campur aduk membuat mesin gagal menghitung berapa lama kamu bekerja.",
  experienceIncomplete:
    "Ada pengalaman kerja tanpa jabatan atau tanpa nama perusahaan.",
  experienceIncompleteFix:
    "Lengkapi keduanya di setiap isian. Mesin penyaring mengenali pengalaman kerja dari pasangan jabatan-perusahaan; kalau salah satunya kosong, pengalaman itu ikut terbuang.",
  experienceNoStart: "Ada pengalaman kerja yang belum ada tanggal mulainya.",
  experienceNoStartFix:
    "Isi bulan dan tahun mulai di setiap pengalaman. Tanpa itu, tidak ada yang bisa menghitung total lama pengalamanmu.",
  educationIncomplete:
    "Ada riwayat pendidikan tanpa nama institusi atau jenjang.",
  educationIncompleteFix:
    'Lengkapi nama sekolah/kampus dan jenjangnya (misalnya "S1", "SMA") di setiap isian pendidikan.',
  skillNoisy: "Ada keahlian yang ditulis bersama tingkat penguasaannya.",
  skillNoisyFix:
    'Tulis namanya apa adanya - "JavaScript", bukan "JavaScript (mahir)". Mesin penyaring mencocokkan kata demi kata, jadi tambahan di dalam kurung justru bikin tidak cocok.',
  tableChars: "Ada poin yang memuat tanda pemisah kolom.",
  tableCharsFix:
    "Hapus tanda seperti | atau tab dari isi poin. Tanda itu membuat mesin mengira ada tabel, lalu memotong kalimat kamu di tengah.",
  emojiHeading: "Ada judul bagian tambahan yang memakai emoji.",
  emojiHeadingFix:
    "Pakai tulisan biasa untuk judulnya. Emoji tidak dikenali mesin penyaring, dan bisa membuat seluruh isi bagian itu ikut tidak terbaca.",

  noBullets: "Belum ada satu pun poin pencapaian.",
  noBulletsFix:
    "Tambahkan 2-3 poin di setiap pengalaman kerja atau proyek. Justru bagian inilah yang membedakan kamu dari pelamar lain, sisanya hampir sama di semua CV.",
  actionVerbLow: (p) => `Baru ${p}% poin yang diawali kata kerja.`,
  actionVerbFix:
    'Mulai tiap poin dengan kata kerja: Mengembangkan, Meningkatkan, Memimpin, Merapikan. Hindari pembuka pasif seperti "Bertanggung jawab atas".',
  quantifiedLow: (p) => `Baru ${p}% poin yang menyebut angka.`,
  quantifiedFix:
    'Sebutkan angka di minimal separuh poin - persen, jumlah orang, nominal, atau lamanya. Contoh: "Menurunkan waktu muat 45%, dari 3,2 detik jadi 1,8 detik".',
  bulletTooLong: "Ada poin yang kepanjangan.",
  bulletTooLongFix:
    "Jaga tiap poin tetap 1-2 baris, sekitar 220 huruf. Poin yang panjang biasanya dilewati begitu saja saat perekrut melirik CV.",
  bulletTooShort: "Ada poin yang terlalu singkat, jadi kurang bercerita.",
  bulletTooShortFix:
    "Kembangkan poin pendek itu: sebutkan keadaannya dan hasilnya, bukan cuma nama tugasnya.",
  clichesFound: (phrases) => `Ada kalimat yang terlalu umum: ${phrases}.`,
  clichesFix:
    'Ganti klaim umum dengan bukti. Daripada menulis "pekerja keras", tulis pencapaian nyata yang membuktikannya - perekrut lebih percaya bukti.',
  firstPerson: "Ringkasan profilnya memakai kata \"saya\".",
  firstPersonFix:
    'Hilangkan kata "saya". Tulis "Frontend Developer dengan pengalaman 4 tahun..." bukan "Saya adalah seorang...". Begitulah kebiasaan penulisan CV di mana-mana.',
  tooFewBullets: "Ada pengalaman kerja yang poinnya kurang dari 2.",
  tooFewBulletsFix:
    "Isi minimal 2 poin per pengalaman, idealnya 3-4 untuk posisi terbaru kamu.",

  noJobDescription: "Iklan lowongannya belum ditempel.",
  noJobDescriptionFix:
    "Tempel isi iklan lowongan yang kamu incar, lalu kamu bisa lihat kata penting mana yang belum ada di CV. Selama belum ditempel, bagian ini tidak ikut dihitung ke nilai akhir.",
  keywordCoverage: (percent, missing) =>
    `Baru ${percent}% yang cocok. Belum ada di CV-mu: ${missing}.`,
  keywordCoverageFix:
    "Masukkan kata-kata itu ke bagian Keahlian atau ke poin pencapaian, tapi hanya yang benar-benar kamu kuasai. Menempel yang tidak kamu kuasai memang menaikkan angka di sini, dan akan ketahuan saat wawancara.",

  lengthOnePage: "CV-mu 1 halaman.",
  lengthTwoPages: "CV-mu 2 halaman.",
  lengthTooLong: (p) => `CV-mu ${p} halaman.`,
  lengthOnePageFix:
    "Panjangnya sudah pas. Perekrut melirik satu CV dalam hitungan detik, dan satu halaman memastikan semua isinya benar-benar sempat terlihat.",
  lengthTwoPagesFix:
    "Satu halaman sudah cukup untuk hampir semua pelamar, yang sudah lama bekerja sekalipun. Coba buang pengalaman yang tidak nyambung dengan lowongan yang dituju, dan gabungkan poin yang mirip. Dua halaman baru sepadan kalau pengalamanmu lebih dari lima tahun dan semuanya nyambung.",
  lengthTooLongFix:
    "Pangkas jadi satu halaman. Buang pengalaman lama yang sudah tidak nyambung, gabungkan poin yang mirip, dan sisakan yang benar-benar mendukung lowongan ini. Mengecilkan huruf bukan jalan keluar, yang dikurangi isinya, bukan hurufnya.",
  summaryAfterExperience: "Ringkasan profil kamu ada di bawah pengalaman kerja.",
  summaryAfterExperienceFix:
    "Naikkan Ringkasan Profil ke urutan paling atas. Bagian itu pembuka, kadang satu-satunya yang sempat dibaca.",
  experienceUnsorted: "Pengalaman kerja belum urut dari yang paling baru.",
  experienceUnsortedFix:
    "Susun terbalik: yang paling baru di urutan pertama. Hampir semua perekrut dan mesin penyaring mengharapkan urutan itu.",
  employmentGap: (m) => `Ada jeda ${m} bulan di antara dua pengalaman kerja.`,
  employmentGapUnknown: "Ada jeda di antara dua pengalaman kerja.",
  employmentGapFix:
    "Jeda lebih dari 12 bulan sebaiknya dijelaskan, isi periode itu dengan proyek, kursus, atau kegiatan organisasi yang kamu jalani.",

  notScorable: (dimension) => `${dimension} belum bisa dinilai.`,
  notScorableFix:
    "Isi dulu ringkasan profil dan minimal satu pengalaman kerja atau proyek, setelah itu bagian ini ikut dihitung.",
  verdictExcellent: "CV-mu sudah sangat siap dikirim.",
  verdictGood: "CV-mu sudah bagus, tinggal beberapa perbaikan kecil.",
  verdictFair:
    "CV-mu lumayan, tapi ada beberapa hal penting yang perlu dibetulkan dulu.",
  verdictPoor:
    "CV-mu berisiko tersaring mesin sebelum sempat dibaca manusia.",
  verdictNoJobSuffix:
    " Nilai ini belum menghitung kecocokan dengan lowongan tertentu, tempel iklan lowongannya untuk melengkapi.",
};

const en: AtsMessages = {
  dimensionLabel: {
    completeness: "How complete it is",
    parseability: "Whether machines can read it",
    contentQuality: "How well it is written",
    keywordMatch: "How well it matches the job",
    structure: "Length and ordering",
  },
  dimensionDescription: {
    completeness:
      "Whether everything a recruiter looks for is actually in your CV, name, contact, experience, education, skills.",
    parseability:
      "Whether screening software can read your CV without tripping: how dates are written, whether every job has both a title and an employer, the lettering, and the absence of anything that throws it off.",
    contentQuality:
      "Whether your bullets read as achievements, starting with a verb, naming a number, or as a list of daily duties.",
    keywordMatch:
      "How many of the words that matter in the job ad genuinely appear in your CV.",
    structure:
      "Whether the length and ordering make sense, and whether any gap in time is left unexplained.",
  },

  nameMissing: "Your full name is missing.",
  nameMissingFix:
    "Fill in Full Name under Personal Details. It is the first thing every screening system looks for.",
  emailInvalid: "That email address is not written correctly.",
  emailMissing: "Your email address is missing.",
  emailFix:
    "Use an address you actually check, in the form name@domain.com. Without a readable email, an employer cannot reach you, even when your CV gets through.",
  phoneMissing: "Your phone number is missing or too short.",
  phoneFix:
    "Enter the full number including the country code, for example +62 812-3456-7890.",
  headlineMissing: "The job title you are targeting is missing.",
  headlineFix:
    'Fill in the job title you are applying for, such as "Frontend Developer". Match the wording of the job ad - it is one of the quickest ways to lift your match.',
  locationMissing: "Your location is missing.",
  locationFix:
    "Enter at least the city you live in. Many employers filter applicants by location before anything else.",
  summaryMissing: "Your professional summary is empty.",
  summaryTooShort: (w) => `The professional summary is too short (${w} words).`,
  summaryTooLong: (w) => `The professional summary is too long (${w} words).`,
  summaryFix:
    "Write 30-120 words covering four things: your role, how long you have done it, your core skills, and one achievement with a number in it.",
  experienceMissing: "There is not enough work experience or project work yet.",
  experienceMissingFix:
    "Add at least one work experience entry. If you have just graduated, add at least two projects instead, they count the same.",
  educationMissing: "Your education history is empty.",
  educationMissingFix:
    "Add at least your most recent qualification and the year you finished it.",
  skillsFew: (c) => `Only ${c} skills listed - aim for at least 5.`,
  skillsFewFix:
    "Add the skills and tools you actually use. The Skills section is the first place screening software goes looking for a match.",
  linksMissing: "No profile link yet.",
  linksMissingFix: "Add at least one: LinkedIn, a portfolio, or GitHub.",

  photoUsed: "The CV includes a photo.",
  photoUsedFix:
    "Turn the photo off. Screening software cannot see images, and the layout around a photo often scrambles the text beside it. Only switch it on when the job ad actually asks for one.",
  fontUnsafe: (f) => `The lettering "${f}" is risky - the receiving computer may not have it.`,
  fontUnsafeFix: (safe) =>
    `Use one of: ${safe}. Lettering the receiving computer does not have gets swapped for something else, and your layout can fall apart.`,
  fontSizeOutOfRange: (s) => `${s}pt is either too small or too large.`,
  fontSizeFix:
    "Use 10-11pt. Below 9pt is hard to read, for people and machines alike.",
  dateFormatMixed: "Some dates are written differently from the rest.",
  dateFormatFix:
    "Enter every date through the month picker so they all match. Mixed date formats stop software from working out how long you have worked.",
  experienceIncomplete:
    "Some work experience entries are missing a job title or an employer.",
  experienceIncompleteFix:
    "Fill in both on every entry. Screening software recognises a job by the title-and-employer pair; if either is blank, that job is thrown away.",
  experienceNoStart: "Some work experience entries have no start date.",
  experienceNoStartFix:
    "Add the starting month and year to every entry. Without it, nothing can total up your years of experience.",
  educationIncomplete:
    "Some education entries are missing the institution or the qualification.",
  educationIncompleteFix:
    'Fill in both the school or university and the qualification (such as "Bachelor" or "High School") on every entry.',
  skillNoisy: "Some skills are written with a proficiency label attached.",
  skillNoisyFix:
    'Write the skill exactly as it is named: "JavaScript", not "JavaScript (advanced)". Screening software matches word for word, so anything in brackets simply stops it matching.',
  tableChars: "Some bullets contain column separator characters.",
  tableCharsFix:
    "Remove characters such as | or tabs from your bullets. They make software think there is a table, and it cuts your sentences in half.",
  emojiHeading: "One of your extra section headings contains an emoji.",
  emojiHeadingFix:
    "Use plain words for headings. Emoji are not recognised, and can take the whole section down with them.",

  noBullets: "There is not a single achievement bullet yet.",
  noBulletsFix:
    "Add 2-3 bullets to every job or project. This is the part that sets you apart from every other applicant, the rest looks much the same on every CV.",
  actionVerbLow: (p) => `Only ${p}% of your bullets start with a verb.`,
  actionVerbFix:
    'Start each bullet with a verb: Built, Increased, Led, Streamlined. Avoid passive openings such as "Responsible for".',
  quantifiedLow: (p) => `Only ${p}% of your bullets name a number.`,
  quantifiedFix:
    'Name a number in at least half your bullets - a percentage, a headcount, an amount, a duration. For example: "Cut load time by 45%, from 3.2s to 1.8s".',
  bulletTooLong: "Some bullets run too long.",
  bulletTooLongFix:
    "Keep each bullet to 1-2 lines, around 220 characters. Long bullets tend to get skipped entirely when a recruiter glances at a CV.",
  bulletTooShort: "Some bullets are too short to tell anyone much.",
  bulletTooShortFix:
    "Expand those short bullets: give the situation and the result, not just the name of the task.",
  clichesFound: (phrases) => `Some phrasing is too generic: ${phrases}.`,
  clichesFix:
    'Replace generic claims with evidence. Rather than "hard worker", write the achievement that proves it - recruiters believe evidence.',
  firstPerson: "Your professional summary uses \"I\".",
  firstPersonFix:
    'Drop the "I". Write "Frontend Developer with 4 years of experience..." rather than "I am a...". That is how CVs are written everywhere.',
  tooFewBullets: "Some work experience entries have fewer than 2 bullets.",
  tooFewBulletsFix:
    "Write at least 2 bullets per role, ideally 3-4 for your most recent one.",

  noJobDescription: "The job ad has not been pasted in yet.",
  noJobDescriptionFix:
    "Paste in the job ad you are targeting and you will see which of its words are missing from your CV. Until then, this part is left out of your final score.",
  keywordCoverage: (percent, missing) =>
    `Only ${percent}% matches so far. Not yet in your CV: ${missing}.`,
  keywordCoverageFix:
    "Work those words into your Skills section or your bullets, but only the ones you genuinely have. Pasting in what you cannot back up does lift the number here, and it comes apart in the interview.",

  lengthOnePage: "Your CV is 1 page long.",
  lengthTwoPages: "Your CV is 2 pages long.",
  lengthTooLong: (p) => `Your CV is ${p} pages long.`,
  lengthOnePageFix:
    "That is exactly right. Recruiters glance at a CV in seconds, and one page makes sure all of it is actually seen.",
  lengthTwoPagesFix:
    "One page is enough for almost every applicant, long-serving ones included. Try cutting the experience that does not speak to the role, and merging similar bullets. Two pages only earn their keep when you have more than five years and all of it is relevant.",
  lengthTooLongFix:
    "Cut it to one page. Drop older experience that no longer speaks to the role, merge similar bullets, and keep only what supports this application. Shrinking the lettering is not the answer, it is the content that needs cutting, not the type.",
  summaryAfterExperience:
    "Your professional summary sits below your work experience.",
  summaryAfterExperienceFix:
    "Move the Professional Summary to the very top. It is the opening, sometimes the only part anyone gets to.",
  experienceUnsorted: "Work experience is not ordered newest first.",
  experienceUnsortedFix:
    "Put the most recent role first. Almost every recruiter and every screening system expects that order.",
  employmentGap: (m) => `There is a ${m}-month gap between two roles.`,
  employmentGapUnknown: "There is a gap between two roles.",
  employmentGapFix:
    "Gaps longer than 12 months are worth explaining, fill the period with a project, a course, or organisational work you did.",

  notScorable: (dimension) => `${dimension} cannot be judged yet.`,
  notScorableFix:
    "Fill in your professional summary and at least one job or project first, after that, this part starts counting.",
  verdictExcellent: "Your CV is ready to send.",
  verdictGood: "Your CV is in good shape, only small fixes left.",
  verdictFair:
    "Your CV is decent, but a few important things need fixing first.",
  verdictPoor:
    "Your CV risks being filtered out by software before a person ever reads it.",
  verdictNoJobSuffix:
    " This score does not yet count how well you match a particular job ad, paste one in to complete it.",
};

const MESSAGES: Record<Locale, AtsMessages> = { id, en };

export function atsMessages(locale: Locale = "id"): AtsMessages {
  return MESSAGES[locale] ?? id;
}

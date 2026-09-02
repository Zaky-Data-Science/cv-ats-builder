import type { Locale } from "@/lib/i18n/config";

/**
 * Isi halaman Panduan.
 *
 * Sama seperti halaman Tentang, prosanya disimpan terpisah dari tata
 * letaknya. Diagram alurnya sendiri tidak diulang di sini - halaman ini
 * memakai data diagram di lib/diagrams.ts, sehingga panduan dan gambar
 * diagram tidak mungkin menjelaskan urutan langkah yang berbeda.
 */

export interface GuideContent {
  badge: string;
  title: string;
  intro: string;

  flowTitle: string;
  flowIntro: string;
  flowMoreLink: string;

  sectionsTitle: string;
  sectionsIntro: string;
  sectionsHeadName: string;
  sectionsHeadHeading: string;
  sectionsHeadWhat: string;
  personalName: string;
  personalHeading: string;
  personalWhat: string;

  scoreTitle: string;
  scoreIntro: string;
  weightLabel: string;
  grades: { grade: string; range: string; note: string }[];
  scoreWarningTitle: string;
  scoreWarningBody: string;

  bulletTitle: string;
  bulletIntroLead: string;
  bulletFormula: string;
  bulletExamples: { bad: string; good: string; why: string }[];
  bulletNoNumbersTitle: string;
  bulletNoNumbersBody: string;

  lengthTitle: string;
  lengthIntro: string;
  lengthPoints: string[];

  compareTitle: string;
  compareIntro: string;
  compareSteps: string[];
  compareNote: string;

  troubleTitle: string;
  trouble: { q: string; a: string }[];

  ctaTitle: string;
  ctaBody: string;
  ctaButton: string;
  ctaButtonSignedIn: string;
}

const id: GuideContent = {
  badge: "Panduan",
  title: "Cara memakai aplikasi ini",
  intro:
    "Ditulis untuk yang baru pertama kali membuat CV sekalipun. Anda tidak perlu tahu apa pun soal desain dokumen - cukup isi field-nya, sisanya diurus aplikasi.",

  flowTitle: "1. Alur penggunaan dari awal sampai akhir",
  flowIntro:
    "Berikut keseluruhan prosesnya. Perhatikan bahwa langkah mengisi, melihat pratinjau, dan memperbaiki lewat skor merupakan putaran - boleh diulang sebanyak yang Anda mau, dan justru itulah yang membuat CV Anda membaik.",
  flowMoreLink: "Lihat seluruh diagram alur dan arsitektur",

  sectionsTitle: "2. Apa yang diisi di setiap bagian",
  sectionsIntro:
    "Bagian ditampilkan di CV mengikuti urutan di bawah ini, dan bisa Anda ubah kapan saja lewat tombol panah di sisi kanan judulnya. Bagian yang kosong tidak akan dicetak.",
  sectionsHeadName: "Bagian",
  sectionsHeadHeading: "Judul di CV",
  sectionsHeadWhat: "Diisi apa",
  personalName: "Data Pribadi",
  personalHeading: "(kepala CV)",
  personalWhat:
    "Nama, jabatan yang dituju, email, telepon, domisili, dan tautan profil. Inilah data yang pertama dicari mesin pengurai.",

  scoreTitle: "3. Membaca skor ATS",
  scoreIntro:
    "Skor berada pada rentang 0 sampai 100, dihitung sebagai rata-rata berbobot dari lima dimensi berikut.",
  weightLabel: "bobot",
  grades: [
    { grade: "A", range: "85 - 100", note: "Siap dikirim" },
    { grade: "B", range: "70 - 84", note: "Tinggal poles" },
    { grade: "C", range: "55 - 69", note: "Ada yang penting terlewat" },
    { grade: "D", range: "0 - 54", note: "Berisiko tersaring" },
  ],
  scoreWarningTitle: "Skor tinggi bukan jaminan diterima",
  scoreWarningBody:
    "Penilaian ini memeriksa apakah CV Anda memenuhi kaidah yang berlaku umum pada sistem pembaca CV - bukan mensimulasikan satu produk ATS tertentu, karena tiap perusahaan memakai pengurai berbeda yang tidak dipublikasikan. Anggap skor ini sebagai daftar periksa, bukan ramalan hasil seleksi.",

  bulletTitle: "4. Menulis poin pencapaian yang kuat",
  bulletIntroLead:
    "Bagian ini yang paling menentukan skor Kualitas Konten, dan paling menentukan kesan perekrut. Rumusnya sederhana: ",
  bulletFormula: "kata kerja aksi + apa yang dikerjakan + hasil berangka",
  bulletExamples: [
    {
      bad: "Bertanggung jawab atas pengembangan website perusahaan.",
      good: "Mengembangkan ulang halaman checkout sehingga tingkat konversi naik dari 2,1% menjadi 3,4% dalam 6 bulan.",
      why: "Kalimat pertama menyebut tugas; kalimat kedua menyebut hasil yang bisa diukur.",
    },
    {
      bad: "Membantu tim dalam berbagai proyek.",
      good: "Memimpin tim beranggotakan 4 orang dalam migrasi 60 komponen antarmuka, memangkas waktu pengembangan fitur sekitar 30%.",
      why: "Sebutkan peran Anda secara spesifik, jumlah orang, dan dampaknya.",
    },
    {
      bad: "Menguasai React dan menguasai berbagai tools modern.",
      good: "Menyusun 120 unit test dengan Jest dan React Testing Library, meningkatkan cakupan pengujian dari 38% menjadi 82%.",
      why: "Daftar keahlian tempatnya di bagian Keahlian. Poin pencapaian seharusnya menunjukkan apa yang Anda hasilkan dengan keahlian itu.",
    },
  ],
  bulletNoNumbersTitle: "Tidak punya angka?",
  bulletNoNumbersBody:
    "Angka tidak selalu berarti persentase. Jumlah orang yang Anda latih, banyaknya dokumen yang Anda proses per minggu, jumlah peserta acara yang Anda selenggarakan - semuanya angka yang sah dan membuat poin Anda jauh lebih meyakinkan.",

  lengthTitle: "5. Panjang dan ukuran kertas",
  lengthIntro:
    "Dua hal ini paling sering ditanyakan, dan jawabannya lebih tegas daripada yang diduga banyak orang.",
  lengthPoints: [
    "Satu halaman. Itu panjang yang tepat untuk hampir semua pelamar, termasuk yang sudah berpengalaman. Perekrut memindai satu CV dalam hitungan detik; apa pun yang jatuh ke halaman kedua besar kemungkinan tidak pernah terbaca.",
    "Dua halaman baru sepadan bila Anda punya lebih dari lima tahun pengalaman yang seluruhnya relevan dengan lowongan yang dituju. Tiga halaman hampir tidak pernah dapat dibenarkan.",
    "Bila CV Anda terlanjur panjang, yang perlu dipangkas isinya - bukan ukuran hurufnya. Mengecilkan huruf sampai 8pt memang membuatnya muat, tetapi sekaligus membuatnya tidak terbaca manusia maupun mesin OCR.",
    "Ukuran kertas: pakai A4. Itu standar di Indonesia dan hampir seluruh dunia, dan itulah bawaan aplikasi ini. Letter hanya perlu dipakai untuk lamaran ke perusahaan di Amerika Serikat atau Kanada; Legal dan F4 hanya bila instansi yang dituju memintanya secara khusus.",
    "Pratinjau dapat ditampilkan terpotong per halaman seperti di pengolah kata, sehingga Anda melihat persis kalimat mana yang jatuh ke halaman berikutnya sebelum mengunduhnya.",
  ],

  compareTitle: "6. Membandingkan CV yang sudah Anda punya",
  compareIntro:
    "Halaman Bandingkan CV menerima berkas PDF, DOCX, atau TXT dari mana pun - termasuk CV lama yang dibuat di aplikasi lain. Tidak perlu punya akun untuk memakainya.",
  compareSteps: [
    "Jatuhkan satu berkas untuk memindainya, atau dua sampai lima berkas untuk membandingkannya.",
    "Bila mau, tempel juga iklan lowongan yang Anda incar - kecocokan kata kuncinya ikut dinilai, dan justru dimensi itulah yang paling menentukan CV mana yang sebaiknya Anda kirim untuk lowongan tersebut.",
    "Tekan Analisis. Setiap CV memperoleh skor, daftar kelebihan, dan daftar kekurangan beserta cara memperbaikinya.",
    "Bila berkasnya lebih dari satu, di bagian atas disebutkan mana yang paling siap dikirim beserta alasannya - dimensi mana yang membuatnya unggul, dan seberapa besar selisihnya.",
  ],
  compareNote:
    "Seluruh pembacaan berjalan di dalam peramban Anda. Berkasnya tidak pernah dikirim ke server aplikasi ini maupun ke layanan lain, dan tidak ada yang disimpan - menutup halaman itu menghapus semuanya.",

  troubleTitle: "7. Kalau ada yang tidak beres",
  trouble: [
    {
      q: 'Tulisan "Gagal menyimpan" muncul di bilah atas',
      a: "Koneksi internet Anda terputus. Jangan tutup halaman - data yang sudah Anda ketik masih ada di layar. Begitu koneksi pulih, ketik satu huruf apa saja untuk memicu penyimpanan ulang.",
    },
    {
      q: "CV saya jadi tiga halaman",
      a: "Indikator jumlah halaman di atas pratinjau akan berwarna kuning. Pangkas pengalaman yang tidak relevan dengan lowongan yang dituju dan gabungkan poin yang mirip. Mengecilkan ukuran huruf memang membuatnya muat, tetapi tidak membuat isinya lebih layak dibaca.",
    },
    {
      q: "Saya menekan tombol PDF tapi tidak terjadi apa-apa",
      a: "Kotak dialog cetak dari peramban mungkin terblokir. Coba lagi, dan pastikan pemblokir pop-up tidak aktif untuk situs ini. Alternatifnya, unduh format Word yang tidak memerlukan dialog cetak.",
    },
    {
      q: "Bagian yang saya isi tidak muncul di CV",
      a: "Bagian yang seluruh entrinya kosong memang sengaja tidak dicetak, agar tidak muncul judul bagian yang menggantung tanpa isi. Pastikan minimal satu field pada entri tersebut sudah diisi.",
    },
    {
      q: "Foto saya tidak muncul padahal sudah diaktifkan",
      a: "Delapan dari sepuluh template memang tidak menyediakan tempat foto. Buka menu Tampilan, lalu pilih salah satu template pada kelompok Dengan foto - Berfoto Formal atau Berfoto Bulat.",
    },
    {
      q: "Berkas CV saya gagal dibaca saat dibandingkan",
      a: "Bila pesannya menyebut dokumen nyaris tidak memuat teks, CV Anda kemungkinan berupa gambar hasil pindai atau ekspor gambar. Itu sendiri temuan penting: ATS akan membacanya sebagai dokumen kosong. Ekspor ulang sebagai PDF teks, bukan gambar.",
    },
    {
      q: "Saya ingin mengubah urutan bagian CV",
      a: "Gunakan tombol panah atas dan bawah di sisi kanan judul setiap bagian pada panel formulir. Urutannya langsung berubah di pratinjau.",
    },
  ],

  ctaTitle: "Cara tercepat memahaminya: langsung coba",
  ctaBody:
    'Buat akun, pilih "Mulai dari Contoh", lalu ganti isinya dengan data Anda satu per satu.',
  ctaButton: "Mulai Sekarang",
  ctaButtonSignedIn: "Buka Dashboard",
};

const en: GuideContent = {
  badge: "Guide",
  title: "How to use this app",
  intro:
    "Written for someone building a CV for the very first time. You need to know nothing about document design - fill in the fields and the app handles the rest.",

  flowTitle: "1. The flow from start to finish",
  flowIntro:
    "Here is the whole process. Note that filling in, previewing, and fixing what the score flags form a loop - repeat it as often as you like, and that repetition is exactly what makes the CV better.",
  flowMoreLink: "See all the flow and architecture diagrams",

  sectionsTitle: "2. What goes in each section",
  sectionsIntro:
    "Sections appear on the CV in the order below, and you can change that at any time with the arrows beside each heading. Empty sections are never printed.",
  sectionsHeadName: "Section",
  sectionsHeadHeading: "Heading on the CV",
  sectionsHeadWhat: "What goes in it",
  personalName: "Personal details",
  personalHeading: "(CV header)",
  personalWhat:
    "Name, target job title, email, phone, location, and profile links. This is the data a parser looks for first.",

  scoreTitle: "3. Reading the ATS score",
  scoreIntro:
    "The score runs from 0 to 100 and is the weighted average of the five dimensions below.",
  weightLabel: "weight",
  grades: [
    { grade: "A", range: "85 - 100", note: "Ready to send" },
    { grade: "B", range: "70 - 84", note: "Just needs polish" },
    { grade: "C", range: "55 - 69", note: "Something important is missing" },
    { grade: "D", range: "0 - 54", note: "At risk of being filtered out" },
  ],
  scoreWarningTitle: "A high score is not a guarantee",
  scoreWarningBody:
    "This scoring checks whether your CV follows the conventions that hold generally across CV-reading systems - it does not simulate one specific ATS product, because every employer uses a different, unpublished parser. Treat the score as a checklist, not a prediction of the outcome.",

  bulletTitle: "4. Writing strong achievement bullets",
  bulletIntroLead:
    "This is what moves the Content Quality score more than anything else, and what shapes a recruiter's impression most. The formula is simple: ",
  bulletFormula: "action verb + what you did + a result with a number",
  bulletExamples: [
    {
      bad: "Responsible for the development of the company website.",
      good: "Rebuilt the checkout flow, lifting conversion from 2.1% to 3.4% within 6 months.",
      why: "The first sentence names a duty; the second names a measurable result.",
    },
    {
      bad: "Helped the team on various projects.",
      good: "Led a team of 4 through a migration of 60 interface components, cutting feature delivery time by around 30%.",
      why: "Name your specific role, how many people, and the impact.",
    },
    {
      bad: "Skilled in React and various modern tools.",
      good: "Wrote 120 unit tests with Jest and React Testing Library, raising test coverage from 38% to 82%.",
      why: "A list of skills belongs in the Skills section. A bullet should show what you produced with those skills.",
    },
  ],
  bulletNoNumbersTitle: "No numbers to point at?",
  bulletNoNumbersBody:
    "A number does not have to be a percentage. How many people you trained, how many documents you process per week, how many attendees came to the event you ran - all of these are legitimate numbers, and all of them make a bullet far more convincing.",

  lengthTitle: "5. Length and paper size",
  lengthIntro:
    "These two questions come up most often, and the answers are firmer than most people expect.",
  lengthPoints: [
    "One page. That is the right length for almost every applicant, experienced ones included. Recruiters scan a CV in seconds; anything on a second page is likely never read.",
    "Two pages only earn their keep when you have more than five years of experience that is all relevant to the role you are targeting. Three pages is almost never justifiable.",
    "If your CV has grown long, it is the content that needs cutting, not the font size. Shrinking the type to 8pt does make it fit, and simultaneously makes it unreadable to both humans and OCR.",
    "Paper size: use A4. It is the standard in Indonesia and nearly everywhere else, and it is this app's default. Letter is only needed for applications to companies in the US or Canada; Legal and F4 only when an institution specifically asks.",
    "The preview can be shown cut into separate pages like a word processor, so you see exactly which sentence falls onto the next page before you download anything.",
  ],

  compareTitle: "6. Comparing CVs you already have",
  compareIntro:
    "The Compare CVs page accepts PDF, DOCX or TXT files from anywhere - including an old CV built in another app. No account is needed.",
  compareSteps: [
    "Drop one file to scan it, or two to five files to compare them.",
    "If you like, paste the job ad you are targeting as well - keyword match is then scored too, and that is the dimension that most determines which CV you should actually send for that role.",
    "Press Analyse. Every CV gets a score, a list of strengths, and a list of weaknesses with how to fix them.",
    "With more than one file, the top of the results names which CV is most ready to send and why - which dimensions put it ahead, and by how much.",
  ],
  compareNote:
    "All the reading happens inside your browser. Files are never sent to this app's server or to any other service, and nothing is stored - closing the page discards everything.",

  troubleTitle: "7. When something goes wrong",
  trouble: [
    {
      q: 'The toolbar shows "Could not save"',
      a: "Your internet connection dropped. Do not close the page - everything you typed is still on screen. Once the connection returns, type any character to trigger another save.",
    },
    {
      q: "My CV has grown to three pages",
      a: "The page counter above the preview turns amber. Cut experience that is not relevant to the role you are targeting and merge similar bullets. Shrinking the font does make it fit, but it does not make the content more worth reading.",
    },
    {
      q: "I pressed the PDF button and nothing happened",
      a: "Your browser's print dialog may have been blocked. Try again and make sure the pop-up blocker is off for this site. Alternatively, download the Word format, which needs no print dialog.",
    },
    {
      q: "A section I filled in does not appear on the CV",
      a: "Sections whose entries are all empty are deliberately not printed, so no heading is left dangling without content. Make sure at least one field in that entry is filled.",
    },
    {
      q: "My photo does not show even though I turned it on",
      a: "Eight of the ten templates deliberately have no place for a photo. Open the Appearance menu and pick one from the With photo group - Formal or Round.",
    },
    {
      q: "My CV file failed to read when comparing",
      a: "If the message says the document contains almost no text, your CV is probably a scan or an image export. That is itself an important finding: an ATS would read it as an empty document. Export it again as a text PDF rather than an image.",
    },
    {
      q: "I want to change the order of the CV sections",
      a: "Use the up and down arrows beside each section heading in the form panel. The order changes in the preview immediately.",
    },
  ],

  ctaTitle: "The fastest way to understand it: try it",
  ctaBody:
    'Create an account, choose "Start from sample", and replace its content with your own, field by field.',
  ctaButton: "Get started",
  ctaButtonSignedIn: "Open dashboard",
};

export const GUIDE: Record<Locale, GuideContent> = { id, en };

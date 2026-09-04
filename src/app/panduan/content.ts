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
    "Ditulis untuk Anda yang baru pertama kali membuat CV. Tidak perlu tahu apa-apa soal desain dokumen - cukup isi kotak-kotaknya, sisanya kami yang urus.",

  flowTitle: "1. Alur penggunaan dari awal sampai akhir",
  flowIntro:
    "Ini seluruh prosesnya. Perhatikan bahwa mengisi, melihat hasilnya, dan memperbaiki mengikuti nilai itu berputar - boleh diulang sesering yang Anda mau, dan justru pengulangan itulah yang membuat CV Anda makin bagus.",
  flowMoreLink: "Lihat seluruh diagram alur dan arsitektur",

  sectionsTitle: "2. Apa yang diisi di setiap bagian",
  sectionsIntro:
    "Bagian-bagian ini muncul di CV mengikuti urutan di bawah, dan boleh Anda tukar kapan saja lewat tombol panah di kanan judulnya. Bagian yang Anda lewati tidak akan ikut tercetak.",
  sectionsHeadName: "Bagian",
  sectionsHeadHeading: "Judul di CV",
  sectionsHeadWhat: "Isinya apa",
  personalName: "Data Pribadi",
  personalHeading: "(kepala CV)",
  personalWhat:
    "Nama, jabatan yang dituju, email, nomor telepon, kota tempat tinggal, dan tautan profil. Inilah yang pertama dicari mesin penyaring.",

  scoreTitle: "3. Cara membaca nilai CV Anda",
  scoreIntro:
    "Nilainya 0 sampai 100, dihitung dari lima hal berikut. Kelimanya tidak berpengaruh sama besar - persentase di sampingnya menunjukkan seberapa besar pengaruhnya.",
  weightLabel: "pengaruh",
  grades: [
    { grade: "A", range: "85 - 100", note: "Siap dikirim" },
    { grade: "B", range: "70 - 84", note: "Tinggal dipoles sedikit" },
    { grade: "C", range: "55 - 69", note: "Ada hal penting yang terlewat" },
    { grade: "D", range: "0 - 54", note: "Berisiko tersaring mesin" },
  ],
  scoreWarningTitle: "Nilai tinggi bukan jaminan diterima",
  scoreWarningBody:
    "Yang kami periksa adalah apakah CV Anda memenuhi aturan yang berlaku umum pada mesin pembaca CV. Kami tidak menirukan satu produk penyaring tertentu - tiap perusahaan memakai yang berbeda, dan tidak satu pun membuka cara kerjanya. Anggap nilai ini daftar periksa, bukan ramalan hasil seleksi.",

  bulletTitle: "4. Menulis poin pencapaian yang kuat",
  bulletIntroLead:
    "Inilah bagian yang paling menaikkan nilai CV Anda, sekaligus yang paling menentukan kesan perekrut. Rumusnya sederhana: ",
  bulletFormula: "kata kerja + apa yang dikerjakan + hasilnya, pakai angka",
  bulletExamples: [
    {
      bad: "Bertanggung jawab atas pengembangan website perusahaan.",
      good: "Mengembangkan ulang halaman checkout sehingga tingkat konversi naik dari 2,1% menjadi 3,4% dalam 6 bulan.",
      why: "Yang pertama menyebut tugas - dan semua orang di posisi itu punya tugas yang sama. Yang kedua menyebut hasil yang bisa diukur, dan itu milik Anda sendiri.",
    },
    {
      bad: "Membantu tim dalam berbagai proyek.",
      good: "Memimpin tim beranggotakan 4 orang dalam migrasi 60 komponen antarmuka, memangkas waktu pengembangan fitur sekitar 30%.",
      why: "Sebutkan peran Anda yang sebenarnya, berapa orang yang terlibat, dan apa akibatnya.",
    },
    {
      bad: "Menguasai React dan menguasai berbagai tools modern.",
      good: "Menyusun 120 unit test dengan Jest dan React Testing Library, meningkatkan cakupan pengujian dari 38% menjadi 82%.",
      why: "Daftar keahlian tempatnya di bagian Keahlian. Poin pencapaian gunanya menunjukkan apa yang Anda hasilkan dengan keahlian itu.",
    },
  ],
  bulletNoNumbersTitle: "Tidak punya angka?",
  bulletNoNumbersBody:
    "Angka tidak harus berupa persen. Berapa orang yang Anda latih, berapa dokumen yang Anda urus tiap minggu, berapa peserta acara yang Anda selenggarakan - semuanya angka yang sah, dan semuanya membuat poin Anda jauh lebih meyakinkan.",

  lengthTitle: "5. Panjang dan ukuran kertas",
  lengthIntro:
    "Dua hal ini yang paling sering ditanyakan - dan jawabannya jauh lebih tegas daripada yang diduga kebanyakan orang.",
  lengthPoints: [
    "Satu halaman. Itu panjang yang tepat untuk hampir semua pelamar, termasuk yang sudah lama bekerja. Perekrut melirik satu CV dalam hitungan detik; apa pun yang jatuh ke halaman kedua besar kemungkinan tidak pernah dibaca.",
    "Dua halaman baru sepadan kalau pengalaman Anda lebih dari lima tahun dan semuanya nyambung dengan lowongan yang dituju. Tiga halaman hampir tidak pernah bisa dibenarkan.",
    "Kalau CV Anda terlanjur panjang, yang dipangkas isinya - bukan ukuran hurufnya. Mengecilkan huruf sampai 8pt memang bikin muat, tapi sekaligus bikin tidak terbaca, baik oleh manusia maupun oleh mesin.",
    "Ukuran kertas: pakai A4, dan itu sudah jadi pilihan bawaan di sini. A4 standar di Indonesia dan hampir seluruh dunia. Letter cuma perlu untuk lamaran ke perusahaan di Amerika Serikat atau Kanada; Legal dan F4 cuma kalau instansinya secara khusus meminta.",
    "Kertas di layar bisa ditampilkan terpotong per halaman seperti di Word, jadi Anda tahu persis kalimat mana yang jatuh ke halaman berikutnya - sebelum CV-nya diunduh.",
  ],

  compareTitle: "6. Membandingkan CV yang sudah Anda punya",
  compareIntro:
    "Halaman Cek CV Saya menerima berkas PDF, Word, atau teks dari mana pun - termasuk CV lama yang dulu Anda buat di aplikasi lain. Tidak perlu punya akun.",
  compareSteps: [
    "Seret satu berkas untuk diperiksa, atau dua sampai lima berkas untuk diadu.",
    "Kalau mau, tempel juga iklan lowongan yang Anda incar - kecocokannya ikut dinilai, dan justru itulah yang paling menentukan CV mana yang sebaiknya Anda kirim.",
    "Tekan Periksa Sekarang. Tiap CV dapat nilai, daftar kelebihan, dan daftar kekurangan lengkap dengan cara membetulkannya.",
    "Kalau berkasnya lebih dari satu, di bagian atas kami sebutkan mana yang paling siap dikirim beserta alasannya - unggul di sisi mana, dan seberapa jauh selisihnya.",
  ],
  compareNote:
    "Semua pembacaan terjadi di dalam HP atau komputer Anda sendiri. Berkasnya tidak pernah dikirim ke server kami maupun ke layanan lain, dan tidak ada yang disimpan - tutup halamannya, semuanya hilang.",

  troubleTitle: "7. Kalau ada yang tidak beres",
  trouble: [
    {
      q: 'Tulisan "Gagal menyimpan" muncul di bilah atas',
      a: "Internet Anda sedang terputus. Jangan tutup halamannya - yang sudah Anda ketik masih utuh di layar. Begitu internetnya kembali, ketik satu huruf apa saja untuk memancing penyimpanan ulang.",
    },
    {
      q: "CV saya jadi tiga halaman",
      a: "Penanda jumlah halaman di atas kertas akan berubah kuning. Buang pengalaman yang tidak nyambung dengan lowongan yang dituju, lalu gabungkan poin yang mirip. Mengecilkan huruf memang bikin muat, tapi tidak bikin isinya lebih layak dibaca.",
    },
    {
      q: "Saya menekan tombol PDF tapi tidak terjadi apa-apa",
      a: "Jendela cetak dari browser mungkin sedang diblokir. Coba lagi, dan pastikan pemblokir pop-up tidak aktif untuk situs ini. Kalau masih juga, unduh saja versi Word - itu tidak butuh jendela cetak sama sekali.",
    },
    {
      q: "Bagian yang saya isi tidak muncul di CV",
      a: "Bagian yang seluruh isiannya kosong memang sengaja tidak dicetak - supaya tidak ada judul bagian yang menggantung tanpa isi. Pastikan minimal satu kotak di isian itu sudah terisi.",
    },
    {
      q: "Foto saya tidak muncul padahal sudah diaktifkan",
      a: "Delapan dari sepuluh desain memang tidak punya tempat untuk foto. Buka Atur Tampilan, lalu pilih salah satu desain di kelompok Pakai pas foto - Berfoto Formal atau Berfoto Bulat.",
    },
    {
      q: "Berkas CV saya gagal dibaca saat dibandingkan",
      a: "Kalau pesannya menyebut dokumennya nyaris tidak berisi tulisan, CV Anda kemungkinan berupa gambar hasil pindai atau hasil simpan sebagai gambar. Itu sendiri temuan penting: mesin penyaring akan membacanya sebagai dokumen kosong. Simpan ulang sebagai PDF berisi tulisan, bukan gambar.",
    },
    {
      q: "Saya ingin menukar urutan bagian CV",
      a: "Pakai tombol panah atas dan bawah di kanan judul tiap bagian, di panel isian sebelah kiri. Urutannya langsung berubah di kertas sebelah kanan.",
    },
  ],

  ctaTitle: "Cara tercepat memahaminya: langsung dicoba",
  ctaBody:
    'Buat akun, pilih "Mulai dari Contoh", lalu timpa isinya dengan data Anda satu per satu. Lima menit sudah kelihatan bentuknya.',
  ctaButton: "Mulai Sekarang",
  ctaButtonSignedIn: "Buka CV Saya",
};

const en: GuideContent = {
  badge: "Guide",
  title: "How to use this app",
  intro:
    "Written for someone building a CV for the very first time. You need to know nothing about document design - fill in the boxes and we handle the rest.",

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
    "Name, target job title, email, phone, the city you live in, and profile links. This is what screening software goes looking for first.",

  scoreTitle: "3. How to read your CV score",
  scoreIntro:
    "The score runs from 0 to 100 and comes from the five things below. They do not all count equally - the percentage beside each shows how much it weighs.",
  weightLabel: "counts for",
  grades: [
    { grade: "A", range: "85 - 100", note: "Ready to send" },
    { grade: "B", range: "70 - 84", note: "Just needs a little polish" },
    { grade: "C", range: "55 - 69", note: "Something important is missing" },
    { grade: "D", range: "0 - 54", note: "At risk of being filtered out" },
  ],
  scoreWarningTitle: "A high score is not a guarantee of anything",
  scoreWarningBody:
    "What we check is whether your CV follows the rules that hold generally across CV-reading systems. We do not imitate one particular product - every employer uses a different one, and none of them publish how it works. Treat this score as a checklist, not a prediction of the outcome.",

  bulletTitle: "4. Writing strong achievement bullets",
  bulletIntroLead:
    "This is what lifts your score more than anything else, and what shapes a recruiter's impression most. The formula is simple: ",
  bulletFormula: "a verb + what you did + the result, with a number in it",
  bulletExamples: [
    {
      bad: "Responsible for the development of the company website.",
      good: "Rebuilt the checkout flow, lifting conversion from 2.1% to 3.4% within 6 months.",
      why: "The first names a duty - and everyone in that role shares the same duties. The second names a measurable result, and that one is yours alone.",
    },
    {
      bad: "Helped the team on various projects.",
      good: "Led a team of 4 through a migration of 60 interface components, cutting feature delivery time by around 30%.",
      why: "Name the role you actually played, how many people were involved, and what came of it.",
    },
    {
      bad: "Skilled in React and various modern tools.",
      good: "Wrote 120 unit tests with Jest and React Testing Library, raising test coverage from 38% to 82%.",
      why: "A list of skills belongs in the Skills section. A bullet is where you show what you produced with them.",
    },
  ],
  bulletNoNumbersTitle: "No numbers to point at?",
  bulletNoNumbersBody:
    "A number does not have to be a percentage. How many people you trained, how many documents you handle each week, how many turned up to the event you ran - all of these count, and all of them make a bullet far more convincing.",

  lengthTitle: "5. Length and paper size",
  lengthIntro:
    "These two questions come up most often, and the answers are far firmer than most people expect.",
  lengthPoints: [
    "One page. That is the right length for almost every applicant, long-serving ones included. Recruiters glance at a CV in seconds; anything on a second page is likely never read.",
    "Two pages only earn their keep when you have more than five years of experience and all of it speaks to the role. Three pages is almost never justifiable.",
    "If your CV has grown long, cut the content - not the font size. Shrinking the type to 8pt does make it fit, and at the same time makes it unreadable to people and machines alike.",
    "Paper size: use A4, and it is already selected for you. A4 is the standard in Indonesia and nearly everywhere else. Letter is only needed for applications to companies in the US or Canada; Legal and F4 only when an institution specifically asks.",
    "The paper on screen can be shown cut into separate pages like Word, so you see exactly which sentence falls onto the next page - before you download anything.",
  ],

  compareTitle: "6. Comparing CVs you already have",
  compareIntro:
    "The Check My CV page accepts PDF, Word or text files from anywhere - including an old CV you once built in another app. No account needed.",
  compareSteps: [
    "Drag in one file to have it checked, or two to five files to pit them against each other.",
    "If you like, paste the job ad you are targeting as well - the match is then scored too, and that is usually what decides which CV you should actually send.",
    "Press Check them now. Each CV gets a score, a list of strengths, and a list of weaknesses with how to fix them.",
    "With more than one file, the top of the results names the CV most ready to send and why - where it comes out ahead, and by how much.",
  ],
  compareNote:
    "All the reading happens inside your own phone or computer. Files never go to our server or to any other service, and nothing is stored - close the page and it is all gone.",

  troubleTitle: "7. When something goes wrong",
  trouble: [
    {
      q: 'The toolbar shows "Could not save"',
      a: "Your internet connection has dropped. Do not close the page - everything you typed is still safe on screen. Once it comes back, type any character to prompt another save.",
    },
    {
      q: "My CV has grown to three pages",
      a: "The page counter above the paper turns amber. Cut the experience that does not speak to the role you are targeting, then merge similar bullets. Shrinking the font does make it fit, but it does not make the content more worth reading.",
    },
    {
      q: "I pressed the PDF button and nothing happened",
      a: "Your browser's print window may have been blocked. Try again and make sure the pop-up blocker is off for this site. If it still will not appear, download the Word version instead - that needs no print window at all.",
    },
    {
      q: "A section I filled in does not appear on the CV",
      a: "Sections whose entries are all empty are deliberately not printed, so no heading is left dangling with nothing under it. Make sure at least one box in that entry is filled in.",
    },
    {
      q: "My photo does not show even though I turned it on",
      a: "Eight of the ten designs deliberately have no place for a photo. Open Adjust the look and pick one from the With a photo group - Formal or Round.",
    },
    {
      q: "My CV file failed to read when comparing",
      a: "If the message says the document contains almost no text, your CV is probably a scan or an image export. That is itself an important finding: screening software would read it as an empty document. Save it again as a text PDF rather than an image.",
    },
    {
      q: "I want to change the order of the CV sections",
      a: "Use the up and down arrows beside each section heading in the panel on the left. The order changes on the paper straight away.",
    },
  ],

  ctaTitle: "The fastest way to understand it: just try it",
  ctaBody:
    'Create an account, choose "Start from an example", and type over its content with your own, box by box. Five minutes and you will see the shape of it.',
  ctaButton: "Get started",
  ctaButtonSignedIn: "Open my CVs",
};

export const GUIDE: Record<Locale, GuideContent> = { id, en };

/**
 * Kosakata pendukung mesin penilaian ATS.
 *
 * Semua daftar dipisahkan ke berkas tersendiri agar mudah ditinjau,
 * dikutip, dan diubah tanpa menyentuh logika penilaian - penting karena
 * daftar inilah yang perlu dipertanggungjawabkan pada bab metodologi.
 */

/**
 * Kata henti (stopword) bahasa Indonesia dan Inggris, ditambah kosakata
 * boilerplate yang lazim muncul di iklan lowongan ("kualifikasi",
 * "tanggung jawab", "requirements") namun bukan merupakan kata kunci
 * keahlian, sehingga tidak layak dijadikan target pencocokan.
 */
export const STOPWORDS = new Set<string>([
  // --- Bahasa Indonesia: kata fungsi ---
  "yang", "dan", "atau", "di", "ke", "dari", "untuk", "dengan", "pada",
  "adalah", "ini", "itu", "tidak", "akan", "telah", "dalam", "sebagai",
  "oleh", "juga", "bisa", "dapat", "ada", "karena", "agar", "serta", "bagi",
  "para", "kami", "kita", "saya", "anda", "mereka", "lebih", "sudah",
  "harus", "saat", "jika", "maka", "secara", "antara", "hingga", "sampai",
  "seperti", "yaitu", "yakni", "tersebut", "setiap", "semua", "banyak",
  "guna", "atas", "bawah", "kepada", "terhadap", "melalui", "tentang",
  "namun", "tetapi", "sehingga", "bahwa", "adanya", "apabila", "bila",
  "belum", "masih", "sangat", "paling", "cukup", "hanya", "saja", "pun",
  "per", "tiap", "maupun", "baik", "bukan", "nya", "kah", "lah",
  // --- Bahasa Indonesia: boilerplate iklan lowongan ---
  "kualifikasi", "persyaratan", "syarat", "deskripsi", "pekerjaan",
  "tanggung", "jawab", "tugas", "lowongan", "posisi", "jabatan", "kandidat",
  "pelamar", "perusahaan", "kerja", "bekerja", "memiliki", "mempunyai",
  "wajib", "diutamakan", "minimal", "maksimal", "usia", "tahun", "bulan",
  "lulusan", "jurusan", "pendidikan", "pengalaman", "berpengalaman",
  "mampu", "kemampuan", "bersedia", "penempatan", "gaji", "benefit",
  "fasilitas", "melamar", "lamaran", "berkas", "dokumen", "segera",
  "dibutuhkan", "mencari", "membuka", "kesempatan", "karir", "karier",
  "pria", "wanita", "laki", "perempuan", "domisili", "bidang", "terkait",
  // Kata kerja penghubung yang lazim mengawali butir kualifikasi. Kata-kata
  // ini muncul sangat sering di iklan lowongan sehingga tanpa disaring akan
  // menduduki peringkat teratas dan menggeser kata kunci keahlian yang
  // sesungguhnya, mis. "menguasai React" - yang dicari adalah "react".
  "menguasai", "dikuasai", "penguasaan", "memahami", "dipahami", "pemahaman",
  "terbiasa", "menjadi", "mencari", "nilai", "tambah", "diharapkan",
  "disukai", "familiar", "menyukai", "meliputi", "termasuk", "berikut",
  "antara", "lain", "lainnya", "dsb", "dll", "seperti", "misalnya",
  "melakukan", "membantu", "bertanggung", "melaksanakan", "menjalankan",
  "proses", "seleksi", "tahap", "hanya", "yang", "sesuai", "sesuaikan",
  "utama", "penting", "khusus", "umum", "dasar", "lanjut",
  // --- Bahasa Inggris: kata fungsi ---
  "the", "and", "or", "of", "to", "in", "for", "with", "on", "at", "by",
  "from", "as", "is", "are", "was", "were", "be", "been", "being", "this",
  "that", "these", "those", "it", "its", "we", "you", "your", "our", "their",
  "they", "he", "she", "his", "her", "will", "would", "can", "could",
  "should", "may", "might", "must", "have", "has", "had", "do", "does",
  "did", "not", "no", "but", "if", "then", "than", "so", "such", "into",
  "over", "under", "between", "within", "about", "across", "per", "each",
  "all", "any", "more", "most", "other", "some", "very", "also", "well",
  "least", "least", "up", "out", "who", "which", "what", "when", "where",
  "while", "during", "both", "either", "neither", "an", "a",
  // --- Bahasa Inggris: boilerplate iklan lowongan ---
  "job", "role", "position", "candidate", "applicant", "company", "team",
  "work", "working", "experience", "experienced", "years", "year",
  "requirement", "requirements", "required", "qualification",
  "qualifications", "responsibility", "responsibilities", "description",
  "ability", "able", "strong", "good", "excellent", "knowledge", "skills",
  "skill", "plus", "preferred", "must", "salary", "benefits", "apply",
  "opportunity", "looking", "join", "us", "you", "please", "send", "resume",
  "cv", "degree", "bachelor", "master", "minimum", "maximum", "field",
  "related", "etc",
]);

/**
 * Kata kerja aksi. Poin pencapaian yang diawali kata kerja aksi terbukti
 * lebih mudah dipindai perekrut dan menghindari kalimat pasif yang
 * mengaburkan kontribusi ("Bertanggung jawab atas ..." vs "Menurunkan ...").
 *
 * Disimpan dalam huruf kecil; pencocokan dilakukan pada kata pertama.
 */
export const ACTION_VERBS_ID = new Set<string>([
  "mengembangkan", "membangun", "merancang", "mendesain", "mengelola",
  "memimpin", "meningkatkan", "menurunkan", "mengoptimasi", "mengoptimalkan",
  "menganalisis", "menganalisa", "menyusun", "membuat", "menciptakan",
  "mengimplementasikan", "menerapkan", "mengintegrasikan", "mengotomasi",
  "mengotomatisasi", "menguji", "memperbaiki", "menyelesaikan",
  "mempercepat", "memangkas", "menghemat", "mencapai", "meraih",
  "menginisiasi", "merintis", "mengoordinasikan", "mengkoordinasikan",
  "melatih", "membimbing", "mendampingi", "menyelenggarakan", "mengadakan",
  "memfasilitasi", "menerbitkan", "mempresentasikan", "merilis",
  "memigrasikan", "memvalidasi", "memantau", "mengawasi", "menyederhanakan",
  "mendokumentasikan", "merestrukturisasi", "meluncurkan", "menaikkan",
  "memperluas", "mengurangi", "menambah", "menstandardisasi", "mengukur",
  "merumuskan", "mengusulkan", "menegosiasikan", "memasarkan", "menjual",
  "melayani", "mengarsipkan", "menyalurkan", "mendistribusikan",
  "memproduksi", "merakit", "memasang", "mengoperasikan", "memelihara",
  "merawat", "menyupervisi", "mendigitalisasi", "mereplikasi", "menskalakan",
]);

export const ACTION_VERBS_EN = new Set<string>([
  "developed", "built", "designed", "managed", "led", "increased", "reduced",
  "optimized", "optimised", "analyzed", "analysed", "created",
  "implemented", "integrated", "automated", "tested", "fixed", "achieved",
  "delivered", "launched", "migrated", "improved", "streamlined",
  "coordinated", "trained", "mentored", "established", "initiated",
  "spearheaded", "negotiated", "presented", "published", "maintained",
  "refactored", "scaled", "standardized", "documented", "supervised",
  "executed", "generated", "drove", "owned", "accelerated", "cut",
  "saved", "grew", "expanded", "simplified", "resolved", "shipped",
  "architected", "authored", "consolidated", "engineered", "facilitated",
  "forecasted", "modernized", "orchestrated", "prototyped", "restructured",
  "revamped", "secured", "transformed", "validated",
  // Kata kerja lampau tak beraturan dan bentuk sehari-hari yang sama-sama
  // sah membuka sebuah poin pencapaian. Sebelumnya terlewat, sehingga poin
  // yang diawali "Rebuilt" atau "Wrote" dihitung sebagai poin pasif -
  // padahal keduanya justru bentuk yang dianjurkan.
  "rebuilt", "wrote", "ran", "used", "made", "set", "won", "taught",
  "rewrote", "redesigned", "reengineered", "reorganized", "reorganised",
  "oversaw", "handled", "planned", "researched", "reviewed", "selected",
  "supported", "translated", "upgraded", "verified", "wrangled", "boosted",
  "converted", "deployed", "eliminated", "enabled", "enhanced", "ensured",
  "identified", "introduced", "monitored", "produced", "programmed",
  "reconciled", "recruited", "reported", "restored", "revised", "unified",
]);

export const ACTION_VERBS = new Set<string>([
  ...ACTION_VERBS_ID,
  ...ACTION_VERBS_EN,
]);

/**
 * Frasa klise. Bukan salah secara tata bahasa, tetapi tidak memberi
 * informasi pembeda: hampir semua pelamar menuliskannya, sehingga tidak
 * membantu perekrut maupun pencocokan kata kunci.
 */
export const CLICHE_PHRASES: string[] = [
  "pekerja keras",
  "kerja keras",
  "jujur dan disiplin",
  "bertanggung jawab atas",
  "dapat bekerja dalam tim",
  "mampu bekerja dalam tim",
  "bisa bekerja dalam tim",
  "mampu bekerja di bawah tekanan",
  "dapat bekerja di bawah tekanan",
  "cepat belajar",
  "pembelajar cepat",
  "komunikatif",
  "loyal",
  "ulet",
  "rajin",
  "team player",
  "hard worker",
  "hardworking",
  "self motivated",
  "self-motivated",
  "detail oriented",
  "detail-oriented",
  "think outside the box",
  "go-getter",
  "results-driven",
  "results driven",
  "proven track record",
  "responsible for",
];

/**
 * Font yang aman untuk ATS: tersedia di hampir semua sistem sehingga tidak
 * disubstitusi saat PDF dibuka, dan glifnya dikenali mesin OCR bila CV
 * sempat melewati proses pemindaian.
 */
export const ATS_SAFE_FONTS = [
  "Arial",
  "Helvetica",
  "Calibri",
  "Times New Roman",
  "Georgia",
  "Garamond",
  "Verdana",
  "Tahoma",
];

/** Kata penanda tingkat keahlian yang sebaiknya tidak ditempel pada nama skill. */
export const SKILL_LEVEL_NOISE = [
  "mahir",
  "menengah",
  "pemula",
  "dasar",
  "ahli",
  "expert",
  "advanced",
  "intermediate",
  "beginner",
  "basic",
  "novice",
  "proficient",
];

/** Kata ganti orang pertama; pada CV formal umumnya dihilangkan. */
export const FIRST_PERSON = ["saya", "aku", "kami", " i ", "my ", "me "];

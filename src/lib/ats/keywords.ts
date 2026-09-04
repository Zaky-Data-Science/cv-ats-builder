import { ALIAS_GROUPS } from "./aliases";
import { STOPWORDS } from "./vocabulary";

/**
 * Ekstraksi dan pencocokan kata kunci antara deskripsi lowongan dan isi CV.
 *
 * Pendekatan yang dipakai adalah berbasis aturan dan frekuensi (bukan model
 * bahasa), dengan tiga alasan yang relevan untuk konteks penelitian:
 *  - Deterministik: masukan sama selalu menghasilkan keluaran sama,
 *    sehingga hasil pengujian dapat direproduksi.
 *  - Transparan: setiap skor dapat ditelusuri ke aturan tertentu.
 *  - Tanpa biaya dan tanpa ketergantungan layanan luar.
 */

export interface KeywordMatch {
  keyword: string;
  /** Frekuensi kemunculan pada deskripsi lowongan - proksi tingkat kepentingan. */
  weight: number;
  found: boolean;
}

export interface KeywordAnalysis {
  keywords: KeywordMatch[];
  matched: KeywordMatch[];
  missing: KeywordMatch[];
  /** Rasio bobot kata kunci yang ditemukan terhadap total bobot (0-1). */
  coverage: number;
}

/** Memecah teks menjadi token huruf kecil, mempertahankan karakter khas teknologi. */
export function tokenize(text: string): string[] {
  return (
    text
      .toLowerCase()
      .replace(/[‘’“”]/g, " ")
      // Titik, plus, dan tagar dipertahankan agar "node.js", "c++", dan "c#"
      // tidak terpecah menjadi token yang kehilangan makna.
      .split(/[^a-z0-9+#.à-ÿ-]+/)
      .map((t) => t.replace(/^[.\-]+|[.\-]+$/g, ""))
      .filter((t) => t.length > 0)
  );
}

/**
 * Bentuk kanonik sebuah istilah - dipakai HANYA untuk membandingkan, tidak
 * pernah untuk ditampilkan.
 *
 * Tanda hubung, titik, garis miring, garis bawah, dan spasi dibuang, sehingga
 * "front-end", "front end", dan "frontend" menjadi satu bentuk yang sama.
 * Ketiganya keahlian yang sama, dan iklan lowongan menuliskannya bergantian
 * tanpa pola - sebelum ini, CV yang menulis "frontend" dinilai tidak memuat
 * kata kunci "front-end" sama sekali.
 *
 * Plus dan tagar sengaja TIDAK dibuang: membuangnya akan menyamakan "c++",
 * "c#", dan "c" menjadi satu istilah, padahal ketiganya bahasa berbeda.
 */
export function canonical(text: string): string {
  return text
    .toLowerCase()
    .replace(/[‘’“”]/g, "")
    .replace(/[\s._\-/\\]+/g, "");
}

/**
 * Peta bentuk kanonik ke seluruh padanannya, dibangun sekali saat modul
 * dimuat dari `ALIAS_GROUPS`.
 *
 * Sebuah istilah boleh muncul di lebih dari satu kelompok; kelompoknya
 * digabung, bukan saling menimpa, agar urutan penulisan di berkas alias tidak
 * diam-diam menentukan hasilnya.
 */
const ALIAS_INDEX: Map<string, Set<string>> = (() => {
  const index = new Map<string, Set<string>>();
  for (const group of ALIAS_GROUPS) {
    const forms = group.map(canonical).filter((f) => f.length > 0);
    for (const form of forms) {
      const bucket = index.get(form) ?? new Set<string>();
      for (const other of forms) bucket.add(other);
      index.set(form, bucket);
    }
  }
  return index;
})();

/**
 * Frasa terpanjang yang perlu dikenali sebagai satu istilah.
 *
 * Ditentukan oleh anggota terpanjang di `ALIAS_GROUPS` - "software as a
 * service", empat kata. Menaikkan angka ini tanpa alasan hanya memperbesar
 * himpunannya tanpa menambah satu pun kecocokan.
 */
const MAX_PHRASE_WORDS = 4;

/**
 * Himpunan seluruh bentuk kanonik yang muncul pada sebuah teks, mencakup kata
 * tunggal sampai frasa empat kata.
 *
 * Frasa hanya dibentuk dari kata-kata pada baris yang sama. Tanpa batas itu,
 * kata terakhir sebuah baris dan kata pertama baris berikutnya akan menyatu
 * menjadi frasa yang tidak pernah ditulis siapa pun - dan pada CV, dua baris
 * berurutan kerap berasal dari bagian yang sama sekali berbeda.
 */
function canonicalIndex(text: string): Set<string> {
  const index = new Set<string>();
  for (const line of text.split(/\r?\n/)) {
    const tokens = tokenize(line);
    for (let i = 0; i < tokens.length; i++) {
      for (let n = 1; n <= MAX_PHRASE_WORDS && i + n <= tokens.length; n++) {
        const form = canonical(tokens.slice(i, i + n).join(" "));
        if (form.length > 0) index.add(form);
      }
    }
  }
  return index;
}

/**
 * Singkatan dan nama teknologi sepanjang satu atau dua huruf.
 *
 * Diperlukan karena aturan umumnya membuang token pendek: tanpa daftar ini,
 * "UI", "QA", "JS", dan "K3" akan hilang bersama kata sambung. Isinya sengaja
 * ditahan pada istilah yang maknanya tunggal di konteks lowongan kerja.
 */
const SHORT_KEYWORDS = [
  "c#",
  "c++",
  "go",
  "r",
  "ai",
  "ux",
  "ui",
  "qa",
  "hr",
  "js",
  "ts",
  "ci",
  "cd",
  "db",
  "bi",
  "k3",
  "s1",
];

function isUsefulToken(token: string): boolean {
  if (token.length < 3) {
    return SHORT_KEYWORDS.includes(token);
  }
  if (STOPWORDS.has(token)) return false;
  // Angka murni (mis. "2024", "3") bukan kata kunci keahlian.
  if (/^[0-9.]+$/.test(token)) return false;
  return true;
}

/**
 * Penguat bobot dari bidang yang dipilih pengguna.
 *
 * Kata kunci khas sebuah bidang bukan sembarang kata yang kebetulan sering
 * muncul di iklan lowongan: "kurva S" muncul dua kali di iklan konstruksi dan
 * menentukan segalanya, sementara "bertanggung jawab" muncul lima kali dan
 * tidak menentukan apa pun. Bobot mentah berbasis frekuensi tidak dapat
 * membedakan keduanya - kamus bidangnya yang bisa.
 */
export interface PenguatKataKunci {
  /** Kata kunci entri kamus yang sedang dipakai pengguna. */
  utama: string[];
  /** Penguat sekunder, mis. dari kategori industri yang ia sebutkan. */
  sekunder?: string[];
}

/*
  Besar penguatnya dipilih, bukan ditemukan - sumber fitur ini hanya menyebut
  "bobot lebih tinggi" tanpa angka.

  Dua dipilih karena itu pengali yang sudah dipakai berkas ini untuk frasa dua
  kata, dan alasannya sama persis: keduanya penanda bahwa istilahnya utuh dan
  memang istilah bidang itu, bukan kata yang kebetulan berulang. Penguat
  sekunder dibuat lebih kecil supaya kategori industri tidak pernah mengalahkan
  bidang yang dipilih penggunanya sendiri.
*/
const PENGUAT_UTAMA = 2;
const PENGUAT_SEKUNDER = 1.5;

function himpunanKanonik(daftar: string[] | undefined): Set<string> {
  const set = new Set<string>();
  for (const item of daftar ?? []) {
    const form = canonical(item);
    if (form) set.add(form);
  }
  return set;
}

/**
 * Mengambil kata kunci terpenting dari deskripsi lowongan.
 *
 * Frasa dua kata yang muncul berulang (mis. "machine learning",
 * "react native") diberi bobot lebih tinggi daripada kata tunggal, karena
 * frasa demikian biasanya merupakan nama keahlian yang utuh.
 *
 * Kata kunci yang juga tercantum di kamus bidang pengguna diberi bobot lebih
 * tinggi lagi, **dan** dijamin tidak terpotong batas jumlah: istilah yang
 * menentukan di sebuah bidang kerap muncul hanya sekali atau dua kali di
 * iklannya, sehingga justru istilah itulah yang paling mudah hilang.
 */
export function extractKeywords(
  jobDescription: string,
  limit = 25,
  penguat?: PenguatKataKunci,
): { keyword: string; weight: number }[] {
  const tokens = tokenize(jobDescription);
  const useful = tokens.filter(isUsefulToken);

  const unigram = new Map<string, number>();
  for (const token of useful) {
    unigram.set(token, (unigram.get(token) ?? 0) + 1);
  }

  // Bigram dibentuk dari token yang bersebelahan pada teks asli, sehingga
  // frasa tidak terbentuk melintasi kata henti yang sudah dibuang.
  const bigram = new Map<string, number>();
  for (let i = 0; i < tokens.length - 1; i++) {
    const a = tokens[i];
    const b = tokens[i + 1];
    if (!isUsefulToken(a) || !isUsefulToken(b)) continue;
    const phrase = `${a} ${b}`;
    bigram.set(phrase, (bigram.get(phrase) ?? 0) + 1);
  }

  const scored: { keyword: string; weight: number }[] = [];
  const claimed = new Set<string>();

  for (const [phrase, count] of bigram) {
    if (count < 2) continue;
    scored.push({ keyword: phrase, weight: count * 2 });
    phrase.split(" ").forEach((w) => claimed.add(w));
  }

  for (const [word, count] of unigram) {
    // Kata yang sudah terwakili oleh sebuah frasa tidak dihitung dua kali.
    if (claimed.has(word)) continue;
    scored.push({ keyword: word, weight: count });
  }

  /*
    Kamus bidang tidak hanya menguatkan bobot - ia juga menyumbang istilahnya.

    Frasa yang hanya muncul sekali di iklan lowongan tidak pernah lolos
    penyaring frekuensi di atas, padahal justru istilah semacam itu yang
    menentukan: "soil test" disebut sekali dan menentukan segalanya bagi
    seorang site engineer, sementara "bertanggung jawab" disebut lima kali dan
    tidak menentukan apa pun. Yang tahu bedanya hanya kamus bidangnya.
  */
  const indeksIklan = canonicalIndex(jobDescription);
  for (const istilah of penguat?.utama ?? []) {
    const form = canonical(istilah);
    if (!form || !indeksIklan.has(form)) continue;
    if (scored.some((k) => canonical(k.keyword) === form)) continue;
    scored.push({ keyword: istilah, weight: 1 });
    // Kata penyusunnya tidak dihitung lagi sendiri-sendiri, sama seperti
    // perlakuan frasa yang sudah ada di atas.
    for (const kata of tokenize(istilah)) claimed.add(kata);
  }
  const tersisa = scored.filter(
    (k) => k.keyword.includes(" ") || !claimed.has(k.keyword),
  );
  scored.length = 0;
  scored.push(...tersisa);

  const utama = himpunanKanonik(penguat?.utama);
  const sekunder = himpunanKanonik(penguat?.sekunder);
  const dikuatkan = scored.map((item) => {
    const form = canonical(item.keyword);
    if (utama.has(form)) return { ...item, weight: item.weight * PENGUAT_UTAMA };
    if (sekunder.has(form)) {
      return { ...item, weight: item.weight * PENGUAT_SEKUNDER };
    }
    return item;
  });

  const urut = dikuatkan.sort(
    (a, b) => b.weight - a.weight || a.keyword.localeCompare(b.keyword),
  );
  const hasil = urut.slice(0, limit);

  // Istilah bidang yang memang ada di iklannya tidak boleh hilang hanya karena
  // jumlahnya melewati batas tampil.
  const sudah = new Set(hasil.map((k) => canonical(k.keyword)));
  for (const item of urut.slice(limit)) {
    if (utama.has(canonical(item.keyword)) && !sudah.has(canonical(item.keyword))) {
      hasil.push(item);
      sudah.add(canonical(item.keyword));
    }
  }
  return hasil;
}

/** Mencari sebuah kata kunci di dalam himpunan bentuk kanonik sebuah teks. */
function foundInIndex(index: Set<string>, keyword: string): boolean {
  const form = canonical(keyword);
  if (form.length === 0) return false;
  if (index.has(form)) return true;

  const aliases = ALIAS_INDEX.get(form);
  if (!aliases) return false;
  for (const alias of aliases) {
    if (index.has(alias)) return true;
  }
  return false;
}

/**
 * Mencocokkan sebuah kata kunci ke teks CV.
 *
 * Pencocokan dilakukan terhadap himpunan bentuk kanonik teks, bukan dengan
 * mencari pola di dalam untaian teksnya. Bedanya bukan sekadar kecepatan:
 * pencarian pola menuntut istilah tertulis persis sama huruf demi huruf,
 * sehingga "front-end" tidak pernah cocok dengan "frontend". Membandingkan
 * himpunan juga menutup arah sebaliknya - kecocokan sebagian, seperti "java"
 * yang dianggap ada di dalam "javascript", mustahil terjadi karena yang
 * dibandingkan adalah token utuh.
 */
export function containsKeyword(haystack: string, keyword: string): boolean {
  return foundInIndex(canonicalIndex(haystack), keyword);
}

/** Membandingkan kata kunci lowongan terhadap teks CV. */
export function analyzeKeywords(
  resumeText: string,
  jobDescription: string,
  limit = 25,
  penguat?: PenguatKataKunci,
): KeywordAnalysis {
  const extracted = extractKeywords(jobDescription, limit, penguat);
  // Himpunannya dibangun sekali, lalu dipakai untuk seluruh kata kunci.
  const index = canonicalIndex(resumeText);

  const keywords: KeywordMatch[] = extracted.map((k) => ({
    ...k,
    found: foundInIndex(index, k.keyword),
  }));

  const totalWeight = keywords.reduce((sum, k) => sum + k.weight, 0);
  const foundWeight = keywords
    .filter((k) => k.found)
    .reduce((sum, k) => sum + k.weight, 0);

  return {
    keywords,
    matched: keywords.filter((k) => k.found),
    missing: keywords.filter((k) => !k.found),
    coverage: totalWeight === 0 ? 0 : foundWeight / totalWeight,
  };
}

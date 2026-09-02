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
  return text
    .toLowerCase()
    .replace(/[‘’“”]/g, " ")
    // Titik, plus, dan tagar dipertahankan agar "node.js", "c++", dan "c#"
    // tidak terpecah menjadi token yang kehilangan makna.
    .split(/[^a-z0-9+#.à-ÿ-]+/)
    .map((t) => t.replace(/^[.\-]+|[.\-]+$/g, ""))
    .filter((t) => t.length > 0);
}

function isUsefulToken(token: string): boolean {
  if (token.length < 3) {
    // Token pendek hanya diterima bila merupakan nama teknologi yang lazim.
    return ["c#", "c++", "go", "r", "ai", "ux", "ui", "qa", "hr"].includes(
      token,
    );
  }
  if (STOPWORDS.has(token)) return false;
  // Angka murni (mis. "2024", "3") bukan kata kunci keahlian.
  if (/^[0-9.]+$/.test(token)) return false;
  return true;
}

/**
 * Mengambil kata kunci terpenting dari deskripsi lowongan.
 *
 * Frasa dua kata yang muncul berulang (mis. "machine learning",
 * "react native") diberi bobot lebih tinggi daripada kata tunggal, karena
 * frasa demikian biasanya merupakan nama keahlian yang utuh.
 */
export function extractKeywords(
  jobDescription: string,
  limit = 25,
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

  return scored
    .sort((a, b) => b.weight - a.weight || a.keyword.localeCompare(b.keyword))
    .slice(0, limit);
}

/** Mencocokkan sebuah kata kunci ke teks CV dengan batas kata. */
export function containsKeyword(haystack: string, keyword: string): boolean {
  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  // (?![\w-]) mencegah "java" dianggap cocok pada "javascript".
  const pattern = new RegExp(`(?<![\\w-])${escaped}(?![\\w-])`, "i");
  return pattern.test(haystack);
}

/** Membandingkan kata kunci lowongan terhadap teks CV. */
export function analyzeKeywords(
  resumeText: string,
  jobDescription: string,
  limit = 25,
): KeywordAnalysis {
  const extracted = extractKeywords(jobDescription, limit);
  const haystack = resumeText.toLowerCase();

  const keywords: KeywordMatch[] = extracted.map((k) => ({
    ...k,
    found: containsKeyword(haystack, k.keyword),
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

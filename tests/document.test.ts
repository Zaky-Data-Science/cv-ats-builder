import { analyzeDocument, compareDocuments } from "../src/lib/ats/document";
import type { ExtractedDocument } from "../src/lib/intake/extract";
import { between, check, equal, section } from "./harness";

/**
 * Menguji penilai berkas CV yang diunggah.
 *
 * Masukannya berupa teks, bukan berkas - lapisan pembaca PDF diuji terpisah
 * di pdf.test.ts. Pemisahan ini membuat kegagalan langsung menunjuk ke satu
 * tempat: kalau uji di sini yang gagal, aturannya yang berubah; kalau uji
 * PDF yang gagal, pembacaannya.
 */

const GOOD_CV = `Budi Santoso
Frontend Developer
budi.santoso@email.com  -  +62 812-3456-7890  -  Bontang, Kalimantan Timur
linkedin.com/in/budisantoso

RINGKASAN PROFIL
Frontend Developer dengan pengalaman 4 tahun membangun aplikasi web berskala produksi menggunakan React dan TypeScript. Menurunkan waktu muat halaman utama 45% dan memimpin tim 4 orang dalam migrasi ke arsitektur komponen bersama.

PENGALAMAN KERJA
Frontend Developer - PT Digital Nusantara, Jakarta
Feb 2023 - Sekarang
- Mengembangkan ulang halaman checkout sehingga konversi naik dari 2,1% ke 3,4% dalam 6 bulan.
- Memimpin tim 4 orang dalam migrasi 60 komponen, memangkas waktu pengembangan fitur 30%.
- Mengotomasi proses deployment sehingga waktu rilis turun dari 40 menit menjadi 6 menit.

Junior Developer - CV Sinar Teknologi, Samarinda
Jan 2021 - Jan 2023
- Membangun 12 halaman pemasaran yang menghasilkan 1.800 prospek baru per bulan.
- Meningkatkan skor Lighthouse dari 62 menjadi 94 pada seluruh halaman publik.

PENDIDIKAN
Sarjana Komputer - Teknik Informatika
Universitas Mulawarman, Samarinda
Agu 2017 - Jul 2021
IPK 3.62 / 4.00

KEAHLIAN
JavaScript, TypeScript, React, Next.js, Tailwind CSS, Git, REST API, PostgreSQL
`;

const WEAK_CV = `CURRICULUM VITAE

Nama: Andi Pratama
saya adalah seorang pekerja keras dan bertanggung jawab yang siap bekerja dalam tim maupun individu

Pengalaman
PT Maju Jaya | Staff | 2020-2023
Bertanggung jawab atas laporan harian
Membantu tim

Pendidikan
SMA Negeri 1
`;

function doc(
  fileName: string,
  text: string,
  overrides: Partial<ExtractedDocument> = {},
): ExtractedDocument {
  const pageCount = overrides.pageCount ?? 1;
  return {
    fileName,
    kind: "pdf",
    text,
    pageCount,
    columnHint: 1,
    charsPerPage: text.length / Math.max(1, pageCount),
    size: text.length,
    ...overrides,
  };
}

export function runDocumentTests(): void {
  section("Penilai berkas CV");

  const good = analyzeDocument(doc("cv-baik.pdf", GOOD_CV), "", "id");
  const weak = analyzeDocument(doc("cv-lemah.pdf", WEAK_CV), "", "id");

  between("CV yang tersusun baik memperoleh skor tinggi", good.score, 85, 100);
  between("CV yang lemah memperoleh skor rendah", weak.score, 0, 60);
  check(
    "kelebihan CV baik jauh lebih banyak daripada CV lemah",
    good.strengths.length > weak.strengths.length,
    `${good.strengths.length} vs ${weak.strengths.length}`,
  );
  check(
    "kekurangan CV lemah jauh lebih banyak daripada CV baik",
    weak.weaknesses.length > good.weaknesses.length,
    `${weak.weaknesses.length} vs ${good.weaknesses.length}`,
  );
  check(
    "email yang hilang terdeteksi sebagai galat",
    weak.weaknesses.some((w) => w.severity === "error" && /email/i.test(w.message)),
  );
  check(
    "frasa klise terdeteksi",
    weak.weaknesses.some((w) => /klise/i.test(w.message)),
  );

  /* ------------------------------------------------------------------ */
  /* Tanda bahaya keterbacaan                                            */
  /* ------------------------------------------------------------------ */
  const scanned = analyzeDocument(
    doc("cv-pindaian.pdf", "Budi Santoso", { charsPerPage: 13 }),
    "",
    "id",
  );
  check(
    "dokumen tanpa lapisan teks terdeteksi",
    scanned.weaknesses.some((w) => /gambar hasil pindai/i.test(w.message)),
  );

  const twoColumn = analyzeDocument(
    doc("cv-dua-kolom.pdf", GOOD_CV, { columnHint: 2 }),
    "",
    "id",
  );
  check(
    "tata letak dua kolom terdeteksi sebagai galat",
    twoColumn.weaknesses.some(
      (w) => w.severity === "error" && /2 kolom/i.test(w.message),
    ),
  );
  check(
    "tata letak dua kolom menurunkan skor",
    twoColumn.score < good.score,
    `${twoColumn.score} vs ${good.score}`,
  );

  /* ------------------------------------------------------------------ */
  /* Panjang halaman                                                     */
  /* ------------------------------------------------------------------ */
  const threePages = analyzeDocument(
    doc("cv-panjang.pdf", GOOD_CV, { pageCount: 3 }),
    "",
    "id",
  );
  /*
    Panjang halaman tidak lagi menghukum apa pun - di sini maupun di penilai
    CV yang disusun di aplikasi ini. Kalau salah satunya masih menghukum, satu
    orang memperoleh dua nilai berbeda untuk CV yang sama, tergantung ia
    mengetiknya atau mengunggahnya.
  */
  check(
    "CV tiga halaman tidak lagi ditegur soal panjangnya",
    !threePages.weaknesses.some((w) => /satu halaman/i.test(w.fix)),
  );
  check(
    "panjangnya tetap diberi keterangan netral",
    [...threePages.strengths, ...threePages.weaknesses.map((w) => w.message)].some(
      (teks) => /3 halaman/i.test(teks),
    ),
  );
  equal(
    "nilai tidak bergerak karena jumlah halaman",
    analyzeDocument(doc("satu.pdf", GOOD_CV, { pageCount: 1 }), "", "id").score,
    threePages.score,
  );

  /* ------------------------------------------------------------------ */
  /* Kecocokan dengan iklan lowongan                                     */
  /* ------------------------------------------------------------------ */
  const ad = `Dibutuhkan Frontend Developer.
Kualifikasi:
- Menguasai React dan TypeScript
- Terbiasa dengan REST API dan Git
- Memahami PostgreSQL dan Tailwind CSS`;

  const goodMatch = analyzeDocument(doc("cv-baik.pdf", GOOD_CV), ad, "id");
  const weakMatch = analyzeDocument(doc("cv-lemah.pdf", WEAK_CV), ad, "id");

  check(
    "kecocokan kata kunci CV baik jauh lebih tinggi",
    (goodMatch.keywords?.coverage ?? 0) > (weakMatch.keywords?.coverage ?? 0),
    `${Math.round((goodMatch.keywords?.coverage ?? 0) * 100)}% vs ${Math.round(
      (weakMatch.keywords?.coverage ?? 0) * 100,
    )}%`,
  );

  /* ------------------------------------------------------------------ */
  /* Perbandingan                                                        */
  /* ------------------------------------------------------------------ */
  const comparison = compareDocuments([weak, good], "id");
  check("perbandingan menghasilkan hasil", comparison !== null);
  equal(
    "CV terbaik dipilih dengan benar",
    comparison?.winner.fileName,
    "cv-baik.pdf",
  );
  check(
    "urutan peringkat menurun",
    (comparison?.ranked ?? []).every(
      (item, index, all) => index === 0 || all[index - 1].score >= item.score,
    ),
  );
  check(
    "alasan kemenangan disebutkan",
    (comparison?.reasons.length ?? 0) > 0,
    `${comparison?.reasons.length} alasan`,
  );
  check(
    "satu berkas saja tidak menghasilkan perbandingan",
    compareDocuments([good], "id") === null,
  );

  /* ------------------------------------------------------------------ */
  /* Bahasa tidak mengubah angka                                         */
  /* ------------------------------------------------------------------ */
  const english = analyzeDocument(doc("cv-baik.pdf", GOOD_CV), "", "en");
  equal("skor sama di kedua bahasa", english.score, good.score);
  check(
    "kalimat temuan ikut berganti bahasa",
    english.strengths[0] !== good.strengths[0],
  );
}

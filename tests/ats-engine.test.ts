import { analyzeResume } from "../src/lib/ats/engine";
import { emptyResume } from "../src/lib/resume/factory";
import { sampleResume } from "../src/lib/resume/sample";
import { between, check, equal, section } from "./harness";

/**
 * Kalibrasi mesin penilaian CV terstruktur.
 *
 * Angka pada berkas ini bukan sekadar penjaga regresi; angka-angka inilah yang
 * dikutip pada bab pengujian. Bila salah satunya berubah, itu berarti aturan
 * penilaiannya ikut berubah - dan perubahan itu harus disengaja.
 */
export function runAtsEngineTests(): void {
  section("Mesin penilaian CV terstruktur");

  /* ------------------------------------------------------------------ */
  /* CV kosong                                                           */
  /* ------------------------------------------------------------------ */
  const empty = analyzeResume(emptyResume(), "", 1);

  // CV kosong pernah memperoleh skor 46 karena dimensi keterbacaan dan
  // struktur lolos secara hampa - seluruh aturannya berbentuk "tidak boleh
  // ada X", dan pada dokumen kosong memang tidak ada X apa pun. Uji ini
  // menahan cacat itu agar tidak kembali.
  between("CV kosong memperoleh skor sangat rendah", empty.score, 0, 10);
  equal("CV kosong bernilai D", empty.grade, "D");
  check(
    "dimensi keterbacaan tidak dinilai pada CV kosong",
    empty.dimensions.find((d) => d.key === "parseability")?.applicable === false,
  );
  check(
    "dimensi struktur tidak dinilai pada CV kosong",
    empty.dimensions.find((d) => d.key === "structure")?.applicable === false,
  );

  /* ------------------------------------------------------------------ */
  /* CV contoh                                                           */
  /* ------------------------------------------------------------------ */
  const sample = sampleResume();
  const good = analyzeResume(sample, "", 1);

  between("CV contoh memperoleh skor tinggi", good.score, 90, 100);
  equal("CV contoh bernilai A", good.grade, "A");
  check(
    "dimensi kecocokan kata kunci tidak dihitung tanpa iklan lowongan",
    good.dimensions.find((d) => d.key === "keywordMatch")?.applicable === false,
  );

  /* ------------------------------------------------------------------ */
  /* Saran satu halaman                                                  */
  /* ------------------------------------------------------------------ */
  const onePage = analyzeResume(sample, "", 1);
  const twoPages = analyzeResume(sample, "", 2);
  const fourPages = analyzeResume(sample, "", 4);

  check(
    "CV satu halaman tidak memperoleh temuan panjang",
    !onePage.suggestions.some((s) => s.dimension === "structure" && /halaman/i.test(s.message)),
  );
  check(
    "CV dua halaman tetap disarankan dipadatkan jadi satu",
    twoPages.suggestions.some(
      (s) => s.dimension === "structure" && /satu halaman/i.test(s.fix),
    ),
  );
  check(
    "skor menurun seiring bertambahnya halaman",
    onePage.score > twoPages.score && twoPages.score > fourPages.score,
    `${onePage.score} > ${twoPages.score} > ${fourPages.score}`,
  );

  /* ------------------------------------------------------------------ */
  /* Kecocokan dengan iklan lowongan                                     */
  /* ------------------------------------------------------------------ */
  const frontendAd = `Dibutuhkan Frontend Developer berpengalaman.
Kualifikasi:
- Menguasai React, TypeScript, dan Next.js
- Terbiasa dengan Git dan REST API
- Memahami Tailwind CSS dan optimasi performa web`;

  const backendAd = `Dibutuhkan Backend Engineer.
Kualifikasi:
- Menguasai Golang dan gRPC
- Terbiasa dengan Kubernetes dan Kafka
- Memahami arsitektur microservice dan message queue`;

  const matched = analyzeResume(sample, frontendAd, 1);
  const mismatched = analyzeResume(sample, backendAd, 1);

  check(
    "kecocokan kata kunci dihitung saat iklan lowongan ditempelkan",
    matched.dimensions.find((d) => d.key === "keywordMatch")?.applicable === true,
  );
  check(
    "CV frontend lebih cocok ke lowongan frontend daripada backend",
    matched.score > mismatched.score,
    `${matched.score} vs ${mismatched.score}`,
  );

  /* ------------------------------------------------------------------ */
  /* Bahasa antarmuka tidak mengubah angka                               */
  /* ------------------------------------------------------------------ */
  // Dibandingkan tanpa iklan lowongan. Dengan iklan lowongan berbahasa
  // Indonesia, CV berbahasa Inggris memang wajar memperoleh kecocokan kata
  // kunci yang berbeda - dan itu bukan cacat, melainkan justru cara kerja
  // dimensi tersebut. Yang harus identik adalah penilaian strukturalnya.
  const indonesian = analyzeResume(sample, "", 1, "id");
  const english = analyzeResume(sampleResume("", "en"), "", 1, "en");

  equal(
    "skor struktural CV contoh sama di kedua bahasa",
    english.score,
    indonesian.score,
  );
  check(
    "kalimat saran ikut berganti bahasa",
    analyzeResume(emptyResume(), "", 1, "en").suggestions[0]?.message !==
      analyzeResume(emptyResume(), "", 1, "id").suggestions[0]?.message,
  );
}

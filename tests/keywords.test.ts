import {
  analyzeKeywords,
  canonical,
  containsKeyword,
  extractKeywords,
} from "../src/lib/ats/keywords";
import { ALIAS_GROUPS } from "../src/lib/ats/aliases";
import { check, equal, section } from "./harness";

/**
 * Pencocokan kata kunci antara iklan lowongan dan isi CV.
 *
 * Dua hal yang diuji di sini saling menahan, dan keduanya perlu:
 *
 *  - **Yang harus cocok.** Istilah yang sama boleh ditulis berbeda -
 *    "front-end", "front end", "frontend" - dan singkatannya boleh dipakai
 *    bergantian dengan kepanjangannya. Tanpa ini, skor menghukum pilihan
 *    ejaan, bukan isi CV-nya.
 *  - **Yang tidak boleh cocok.** Melonggarkan pencocokan selalu berisiko
 *    membuat "java" dianggap ada di dalam "javascript". Kecocokan palsu lebih
 *    merugikan daripada kecocokan yang terlewat, sebab pengguna memercayai
 *    skornya dan berhenti memperbaiki CV-nya.
 *
 * Karena itu setiap kelompok pemeriksaan di bawah punya pasangan negatifnya.
 */

/** CV pendek untuk pemeriksaan cocok/tidak cocok satu per satu. */
const CV = [
  "Budi Santoso",
  "Frontend Developer",
  "",
  "KEAHLIAN",
  "JavaScript, TypeScript, React, Node.js, PostgreSQL",
  "Machine Learning, Google Cloud Platform, Kubernetes",
  "Keselamatan kerja, sumber daya manusia",
  "",
  "PENGALAMAN",
  "Membangun antarmuka pengguna untuk aplikasi penjualan.",
].join("\n");

export function runKeywordTests(): void {
  section("Bentuk kanonik kata kunci");

  equal("tanda hubung dibuang", canonical("front-end"), "frontend");
  equal("spasi dibuang", canonical("front end"), "frontend");
  equal("titik dibuang", canonical("Node.js"), "nodejs");
  equal("garis miring dibuang", canonical("CI/CD"), "cicd");
  equal("plus dipertahankan", canonical("C++"), "c++");
  equal("tagar dipertahankan", canonical("C#"), "c#");
  check(
    "c++ dan c tetap berbeda",
    canonical("C++") !== canonical("C"),
    `${canonical("C++")} vs ${canonical("C")}`,
  );

  section("Kata kunci yang seharusnya cocok");

  for (const variant of ["front-end", "front end", "Frontend", "FRONT-END"]) {
    check(`"${variant}" cocok dengan CV yang menulis "Frontend"`, containsKeyword(CV, variant));
  }
  check('"nodejs" cocok dengan "Node.js"', containsKeyword(CV, "nodejs"));
  check('"node js" cocok dengan "Node.js"', containsKeyword(CV, "node js"));

  section("Kata kunci yang cocok lewat daftar padanan");

  check('"js" cocok dengan "JavaScript"', containsKeyword(CV, "js"));
  check('"ts" cocok dengan "TypeScript"', containsKeyword(CV, "ts"));
  check('"k8s" cocok dengan "Kubernetes"', containsKeyword(CV, "k8s"));
  check('"ml" cocok dengan "Machine Learning"', containsKeyword(CV, "ml"));
  check('"gcp" cocok dengan "Google Cloud Platform"', containsKeyword(CV, "gcp"));
  check('"ui" cocok dengan "antarmuka pengguna"', containsKeyword(CV, "ui"));
  check('"sdm" cocok dengan "sumber daya manusia"', containsKeyword(CV, "sdm"));
  check('"k3" cocok dengan "keselamatan kerja"', containsKeyword(CV, "k3"));
  check('"sales" cocok dengan "penjualan"', containsKeyword(CV, "sales"));
  check('"react" cocok dengan dirinya sendiri', containsKeyword(CV, "reactjs"));

  section("Kata kunci yang TIDAK boleh cocok");

  check('"java" bukan bagian dari "JavaScript"', !containsKeyword(CV, "java"));
  check('"go" bukan bagian dari "Google"', !containsKeyword(CV, "go"));
  check('"post" bukan bagian dari "PostgreSQL"', !containsKeyword(CV, "post"));
  check('"c" bukan bagian dari "C++" mana pun', !containsKeyword("C++ dan C#", "c"));
  check(
    "istilah yang memang tidak ada tetap tidak ditemukan",
    !containsKeyword(CV, "laravel"),
  );
  check(
    "frasa tidak terbentuk melintasi baris",
    !containsKeyword("frontend\ndeveloper backend", "developer backend developer"),
  );

  section("Pengaruhnya pada skor kecocokan");

  // Iklan lowongan menulis "front-end" dan "node.js"; CV-nya menulis
  // "Frontend" dan "Node.js". Sebelum normalisasi, tak satu pun cocok.
  const lowongan = [
    "Dibutuhkan Front-End Developer.",
    "Menguasai front-end, JS, dan React.",
    "Pengalaman front-end minimal dua tahun.",
    "Nilai tambah: JS modern dan React.",
  ].join("\n");

  const hasil = analyzeKeywords(CV, lowongan);
  check(
    "seluruh kata kunci utama lowongan ditemukan",
    hasil.coverage > 0.5,
    `cakupan ${Math.round(hasil.coverage * 100)}%`,
  );
  check(
    'kata kunci "front-end" tercatat ditemukan',
    hasil.keywords.some((k) => canonical(k.keyword) === "frontend" && k.found),
  );

  // CV yang memang tidak relevan tetap harus memperoleh cakupan rendah -
  // pembuktian bahwa normalisasi tidak sekadar meloloskan semuanya.
  const cvLain = "Ahmad Fauzi\nAkuntan\nAudit, pajak, laporan keuangan";
  const hasilLain = analyzeKeywords(cvLain, lowongan);
  check(
    "CV yang tidak relevan tetap bercakupan rendah",
    hasilLain.coverage < 0.2,
    `cakupan ${Math.round(hasilLain.coverage * 100)}%`,
  );

  section("Singkatan pendek tetap terambil dari iklan lowongan");

  const iklanSingkat = "Butuh QA dan UI. QA wajib, UI wajib. JS dan CI juga.";
  const diambil = extractKeywords(iklanSingkat).map((k) => k.keyword);
  for (const pendek of ["qa", "ui", "js", "ci"]) {
    check(`"${pendek}" ikut terambil sebagai kata kunci`, diambil.includes(pendek));
  }

  section("Kesehatan daftar padanan");

  // Kelompok yang seluruh anggotanya berbentuk kanonik sama tidak menambah
  // satu pun kecocokan - ia hanya baris mati yang menyesatkan pembacanya.
  const mati = ALIAS_GROUPS.filter(
    (group) => new Set(group.map(canonical)).size < 2,
  );
  equal(
    "tidak ada kelompok padanan yang mubazir",
    mati.map((g) => g.join("/")).join(", ") || "tidak ada",
    "tidak ada",
  );

  const terpanjang = Math.max(
    ...ALIAS_GROUPS.flatMap((group) => group.map((t) => t.trim().split(/\s+/).length)),
  );
  check(
    "frasa padanan terpanjang masih terjangkau pengindeks",
    terpanjang <= 4,
    `${terpanjang} kata`,
  );
}

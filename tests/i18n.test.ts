import { en } from "../src/lib/i18n/en";
import { id } from "../src/lib/i18n/id";
import { check, section } from "./harness";

/**
 * Memeriksa kelengkapan kamus dwibahasa.
 *
 * TypeScript sudah menjamin **kunci** kedua kamus identik - kamus Inggris
 * diketik sebagai `Dictionary`, sehingga kunci yang terlewat menggagalkan
 * build. Yang tidak dapat dijamin TypeScript adalah isinya: kunci yang
 * disalin apa adanya tanpa diterjemahkan tetap lolos pemeriksaan tipe.
 *
 * Berkas uji inilah yang menangkap hal itu.
 */

type Value = string | Value[] | { [key: string]: Value };

function walk(
  value: Value,
  other: Value,
  path: string,
  visit: (path: string, a: string, b: string) => void,
): void {
  if (typeof value === "string") {
    if (typeof other === "string") visit(path, value, other);
    return;
  }
  if (Array.isArray(value)) {
    if (!Array.isArray(other)) return;
    value.forEach((item, index) => {
      walk(item, other[index], `${path}[${index}]`, visit);
    });
    return;
  }
  for (const key of Object.keys(value)) {
    const next = (other as { [key: string]: Value })?.[key];
    if (next === undefined) continue;
    walk(value[key], next, path ? `${path}.${key}` : key, visit);
  }
}

/**
 * Kata dan frasa yang memang sama di kedua bahasa.
 *
 * Sebagian besar berupa nama diri (PDF, JSON, LinkedIn), singkatan, contoh
 * pengisian berupa nama orang atau alamat, dan istilah yang memang tidak
 * diterjemahkan. Daftar ini menahan uji di bawah agar tidak berteriak pada
 * hal yang sudah benar.
 */
const SAME_ON_PURPOSE = new Set([
  "common.appName",
  "prefs.language",
  "nav.dashboard",
  "editor.back",
  "editor.btnPdf",
  "editor.btnWord",
  "editor.btnJson",
  "form.email",
  "form.emailPh",
  "form.fullNamePh",
  "form.namePh",
  "form.headline",
  "form.headlinePh",
  "form.jobTitlePh",
  "form.companyPh",
  "form.countryPh",
  "form.linkedin",
  "form.linkedinPh",
  "form.github",
  "form.githubPh",
  "form.portfolioPh",
  "form.phonePh",
  "form.photoUrlPh",
  "form.gpaPh",
  "form.maxGpaPh",
  "form.skillNamePh",
  "form.projectNamePh",
  "form.certNamePh",
  "form.certIssuerPh",
  "form.certCredentialPh",
  "form.certVerifyPh",
  "form.projectUrlPh",
  "form.pubDoiPh",
  "form.pubUrlPh",
  "form.pubPublisherPh",
  "form.eduCityPh",
  "form.cityPh",
  "form.summaryIdeal",
  "form.skillCalloutGood",
  "auth.namePh",
  "auth.google",
  "settings.namePh",
  "compare.metaTitle",
]);

export function runI18nTests(): void {
  section("Kamus dwibahasa");

  const identical: string[] = [];
  const empty: string[] = [];

  walk(id as unknown as Value, en as unknown as Value, "", (path, a, b) => {
    if (a.trim().length === 0 || b.trim().length === 0) empty.push(path);
    // Kalimat pendek boleh saja kebetulan sama; yang mencurigakan adalah
    // kalimat panjang yang identik - itu hampir pasti belum diterjemahkan.
    if (a === b && a.length > 24 && !SAME_ON_PURPOSE.has(path)) {
      identical.push(path);
    }
  });

  check(
    "tidak ada teks kosong di kedua kamus",
    empty.length === 0,
    empty.length === 0 ? "" : empty.slice(0, 5).join(", "),
  );
  check(
    "tidak ada kalimat panjang yang belum diterjemahkan",
    identical.length === 0,
    identical.length === 0 ? "" : identical.slice(0, 5).join(", "),
  );

  // Larik pertanyaan yang sering muncul harus sama panjangnya, kalau tidak
  // salah satu bahasa akan kehilangan sebagian pertanyaannya tanpa peringatan.
  check(
    "jumlah pertanyaan FAQ sama di kedua bahasa",
    id.faq.length === en.faq.length,
    `${id.faq.length} vs ${en.faq.length}`,
  );
}

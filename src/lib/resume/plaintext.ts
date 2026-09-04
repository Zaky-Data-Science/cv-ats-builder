import { formatDateRange, formatMonth, joinNonEmpty, prettyUrl } from "@/lib/utils";
import {
  bagiItemPortofolio,
  barisKepala,
  itemTercetak,
  portofolioAktif,
  skemaItem,
  PEMISAH_DETAIL,
} from "@/lib/portfolio/render";
import { isSectionVisible, sectionHeadingFor } from "./sections";
import type { ProjectItem, ResumeData, SectionKey } from "./types";

/**
 * Mengubah CV menjadi teks polos.
 *
 * Fungsi ini penting untuk tiga hal:
 *  1. Dasar pencocokan kata kunci oleh mesin penilaian ATS.
 *  2. Fitur "Lihat yang dibaca ATS" - memperlihatkan kepada pengguna hasil
 *     ekstraksi teks CV-nya, kira-kira seperti yang dilihat mesin perekrut.
 *  3. Bahan penempelan ke formulir lamaran daring yang meminta teks polos.
 *
 * Urutan teks sengaja dibuat sama persis dengan urutan visual CV, karena
 * parser ATS membaca dokumen dari atas ke bawah.
 */
export function resumeToPlainText(data: ResumeData): string {
  const lang = data.language;
  const out: string[] = [];
  const info = data.personalInfo;

  if (info.fullName) out.push(info.fullName);
  if (info.headline) out.push(info.headline);

  const contact = joinNonEmpty(
    [
      info.email,
      info.phone,
      joinNonEmpty([info.city, info.province, info.country]),
    ],
    " | ",
  );
  if (contact) out.push(contact);

  const links = joinNonEmpty(
    [
      prettyUrl(info.linkedinUrl),
      prettyUrl(info.portfolioUrl),
      prettyUrl(info.githubUrl),
    ],
    " | ",
  );
  if (links) out.push(links);

  const heading = (key: SectionKey) => {
    out.push("");
    out.push(sectionHeadingFor(data, key));
  };

  const { mandiri, perInduk } = bagiItemPortofolio(data);

  /*
    Satu item portofolio, dalam bentuk yang sama persis dengan versi cetak dan
    versi Word-nya. Urutan barisnya bukan selera: kepala - ringkasan - poin -
    detail - tautan adalah urutan yang dibaca pengurai dari atas ke bawah, dan
    yang paling menentukan diletakkan paling dulu.

    `bersarang` menandai item yang sedang menempel pada entri pengalaman kerja.
    Dalam keadaan itu konteksnya tidak ikut dicetak: pemberi kerjanya sudah
    tertulis pada entri induknya, dan mencetaknya dua kali membuat satu
    perusahaan tampak muncul dua kali di CV yang sama.
  */
  const tulisItem = (item: ProjectItem, bersarang: boolean) => {
    const cetak = itemTercetak(data, item, lang);
    const kepala = barisKepala(cetak);
    const label = bersarang ? `${skemaItem(data, item).labelItem}: ` : "";
    const bagianKedua = bersarang ? cetak.lokasi : kepala.kedua;

    out.push(
      label +
        joinNonEmpty([kepala.utama, bagianKedua], " | ") +
        (cetak.periode ? ` (${cetak.periode})` : ""),
    );
    if (cetak.ringkasan) out.push(cetak.ringkasan);
    for (const b of cetak.poin) out.push(`- ${b}`);
    if (cetak.detail) out.push(`Detail: ${cetak.detail}`);
    // Teks polos tidak dapat membawa pranala, jadi yang ditulis alamat
    // penuhnya - inilah satu-satunya keluaran yang memang harus memilih.
    if (cetak.tautan.length > 0) {
      out.push(cetak.tautan.map((t) => t.href).join(PEMISAH_DETAIL));
    }
  };

  for (const key of data.sectionOrder) {
    if (!isSectionVisible(data, key)) continue;

    switch (key) {
      case "summary":
        heading(key);
        out.push(info.summary);
        break;

      case "experience":
        heading(key);
        for (const e of data.experiences) {
          out.push(
            joinNonEmpty([e.jobTitle, e.company], " - ") +
              dateSuffix(e.startDate, e.endDate, e.isCurrent, lang),
          );
          const loc = joinNonEmpty([e.city, e.country]);
          if (loc) out.push(loc);
          for (const b of e.bullets.filter(Boolean)) out.push(`- ${b}`);
          for (const item of perInduk.get(e.id) ?? []) tulisItem(item, true);
        }
        break;

      case "education":
        heading(key);
        for (const e of data.educations) {
          out.push(
            joinNonEmpty([e.degree, e.fieldOfStudy], ", ") +
              dateSuffix(e.startDate, e.endDate, e.isCurrent, lang),
          );
          out.push(joinNonEmpty([e.institution, e.city]));
          if (e.gpa) out.push(`IPK: ${e.gpa}${e.maxGpa ? `/${e.maxGpa}` : ""}`);
          for (const b of e.bullets.filter(Boolean)) out.push(`- ${b}`);
        }
        break;

      case "skill": {
        heading(key);
        for (const [category, names] of groupSkills(data)) {
          out.push(`${category}: ${names.join(", ")}`);
        }
        break;
      }

      case "project":
        if (portofolioAktif(data)) {
          heading(key);
          for (const item of mandiri) tulisItem(item, false);
          break;
        }
        // Bentuk lama, untuk CV yang belum menyalakan bagian portofolio.
        heading(key);
        for (const p of data.projects) {
          out.push(
            joinNonEmpty([p.name, p.role], " - ") +
              dateSuffix(p.startDate, p.endDate, false, lang),
          );
          if (p.url) out.push(prettyUrl(p.url));
          for (const b of p.bullets.filter(Boolean)) out.push(`- ${b}`);
        }
        break;

      case "certification":
        heading(key);
        for (const c of data.certifications) {
          out.push(
            joinNonEmpty([c.name, c.issuer], " - ") +
              (c.issueDate ? ` (${formatMonth(c.issueDate, lang)})` : ""),
          );
          if (c.credentialId) out.push(`ID: ${c.credentialId}`);
        }
        break;

      case "organization":
        heading(key);
        for (const o of data.organizations) {
          out.push(
            joinNonEmpty([o.role, o.name], " - ") +
              dateSuffix(o.startDate, o.endDate, o.isCurrent, lang),
          );
          for (const b of o.bullets.filter(Boolean)) out.push(`- ${b}`);
        }
        break;

      case "award":
        heading(key);
        for (const a of data.awards) {
          out.push(
            joinNonEmpty([a.title, a.issuer], " - ") +
              (a.date ? ` (${formatMonth(a.date, lang)})` : ""),
          );
          if (a.description) out.push(a.description);
        }
        break;

      case "language":
        heading(key);
        for (const l of data.languages) {
          out.push(`${l.name}: ${proficiencyLabel(l.proficiency, lang)}`);
        }
        break;

      case "publication":
        heading(key);
        for (const p of data.publications) {
          out.push(
            joinNonEmpty([p.title, p.publisher], ". ") +
              (p.date ? ` (${formatMonth(p.date, lang)})` : ""),
          );
          const kredit = joinNonEmpty(
            [p.tipeLuaran, p.peranSaya, p.indeksasiTier],
            PEMISAH_DETAIL,
          );
          if (kredit) out.push(kredit);
          if (p.doi) out.push(`DOI: ${p.doi}`);
        }
        break;

      case "custom":
        for (const section of data.customSections) {
          out.push("");
          out.push((section.title || "TAMBAHAN").toUpperCase());
          for (const item of section.items) {
            out.push(
              joinNonEmpty([item.title, item.subtitle], " - ") +
                dateSuffix(item.startDate, item.endDate, false, lang),
            );
            for (const b of item.bullets.filter(Boolean)) out.push(`- ${b}`);
          }
        }
        break;
    }
  }

  return out.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

function dateSuffix(
  start: string,
  end: string,
  isCurrent: boolean,
  lang: "ID" | "EN",
): string {
  const range = formatDateRange(start, end, isCurrent, lang);
  return range ? ` (${range})` : "";
}

export function proficiencyLabel(
  value: string,
  lang: "ID" | "EN" = "ID",
): string {
  const map: Record<string, { ID: string; EN: string }> = {
    NATIVE: { ID: "Bahasa Ibu", EN: "Native" },
    FLUENT: { ID: "Sangat Lancar", EN: "Fluent" },
    ADVANCED: { ID: "Mahir", EN: "Advanced" },
    INTERMEDIATE: { ID: "Menengah", EN: "Intermediate" },
    BASIC: { ID: "Dasar", EN: "Basic" },
  };
  return map[value]?.[lang] ?? value;
}

/** Mengelompokkan keahlian per kategori, mempertahankan urutan kemunculan. */
export function groupSkills(data: ResumeData): [string, string[]][] {
  const groups = new Map<string, string[]>();
  for (const skill of data.skills) {
    if (!skill.name.trim()) continue;
    const category = skill.category.trim() || "Umum";
    if (!groups.has(category)) groups.set(category, []);
    groups.get(category)!.push(skill.name.trim());
  }
  return [...groups.entries()];
}

/** Semua poin pencapaian dari seluruh section, untuk dianalisis ATS. */
export function allBullets(data: ResumeData): string[] {
  const bullets: string[] = [];
  const push = (arr: string[]) => {
    for (const b of arr) if (b.trim()) bullets.push(b.trim());
  };
  data.experiences.forEach((e) => push(e.bullets));
  data.educations.forEach((e) => push(e.bullets));
  data.projects.forEach((p) => push(p.bullets));
  data.organizations.forEach((o) => push(o.bullets));
  data.customSections.forEach((s) => s.items.forEach((i) => push(i.bullets)));
  return bullets;
}

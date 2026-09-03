import type { ResumeData } from "./types";

/**
 * Menerapkan suntingan yang diketik langsung di atas kertas CV.
 *
 * Dokumen CV menandai setiap teks yang boleh disunting dengan atribut
 * `data-edit` berisi jalur datanya, misalnya `personalInfo.fullName` atau
 * `experiences.0.bullets.1`. Berkas ini yang menerjemahkan jalur itu kembali
 * menjadi perubahan pada objek CV.
 *
 * Dua hal yang membuat ini sengaja dibuat ketat, bukan sekadar penyetel jalur
 * yang serba bisa:
 *
 *  - **Hanya jalur yang terdaftar boleh ditulis.** Nilai `data-edit` berasal
 *    dari DOM, dan DOM dapat disunting siapa pun lewat konsol peramban.
 *    Penyetel yang menerima jalur apa pun akan mengizinkan penulisan ke
 *    bagian data yang tidak pernah dimaksudkan dapat diketik - termasuk `id`,
 *    yang bila berubah akan memutus hubungan entri dengan barisnya di basis
 *    data.
 *  - **Hanya teks, tidak pernah struktur.** Mengetik di atas kertas mengubah
 *    kata, bukan menambah atau menghapus entri. Menambah entri tetap lewat
 *    tombol di formulir, tempat tersedia isian tanggal dan pilihan yang
 *    memang tidak bisa diketik sebagai teks bebas.
 */

/**
 * Field bertipe teks yang boleh disunting langsung, per bagian CV.
 *
 * Yang TIDAK ada di sini juga disengaja. Tanggal disimpan sebagai "YYYY-MM"
 * dan diisi lewat pemilih bulan; membiarkannya diketik bebas di atas kertas
 * berarti menerima "Feb 2023" sebagai tanggal, yang bukan tanggal bagi
 * aplikasi ini. Begitu pula baris yang di kertas merupakan gabungan beberapa
 * field - nama perusahaan bersama kota dan negara, misalnya. Membelah kembali
 * satu untaian menjadi tiga field adalah tebakan, dan tebakan yang salah akan
 * memindahkan isi ke field yang keliru tanpa pengguna sadari.
 */
const EDITABLE: Record<string, readonly string[]> = {
  personalInfo: ["fullName", "headline", "summary"],
  experiences: ["jobTitle", "company"],
  educations: ["degree", "fieldOfStudy", "institution"],
  projects: ["name", "role"],
  organizations: ["name", "role"],
  certifications: ["name", "issuer"],
  awards: ["title", "issuer", "description"],
  publications: ["title", "publisher"],
  skills: ["name"],
  languages: ["name"],
};

/** Bagian yang punya daftar poin pencapaian yang boleh disunting. */
const WITH_BULLETS = new Set([
  "experiences",
  "educations",
  "projects",
  "organizations",
]);

/** Judul CV sendiri - satu-satunya field di akar yang boleh disunting. */
const ROOT_EDITABLE = new Set(["title"]);

/**
 * Membentuk jalur `data-edit` untuk sebuah field. Dipakai dokumen CV saat
 * merender, sehingga bentuk jalurnya hanya ditulis di satu tempat.
 */
export function editPath(
  section: string,
  index: number,
  field: string,
): string {
  return `${section}.${index}.${field}`;
}

/** Jalur untuk satu poin pencapaian. */
export function bulletPath(
  section: string,
  index: number,
  bulletIndex: number,
): string {
  return `${section}.${index}.bullets.${bulletIndex}`;
}

/** Apakah sebuah jalur benar-benar boleh ditulis. */
export function isEditablePath(path: string): boolean {
  const parts = path.split(".");

  if (parts.length === 1) return ROOT_EDITABLE.has(parts[0]);

  if (parts.length === 2) {
    const [section, field] = parts;
    return section === "personalInfo" && EDITABLE.personalInfo.includes(field);
  }

  if (parts.length === 3) {
    const [section, index, field] = parts;
    if (!/^\d+$/.test(index)) return false;
    return (EDITABLE[section] ?? []).includes(field);
  }

  if (parts.length === 4) {
    const [section, index, kind, bulletIndex] = parts;
    if (!/^\d+$/.test(index) || !/^\d+$/.test(bulletIndex)) return false;
    return kind === "bullets" && WITH_BULLETS.has(section);
  }

  return false;
}

/**
 * Membersihkan teks hasil ketikan di dalam elemen contentEditable.
 *
 * Peramban menyisipkan pemisah baris sendiri saat pengguna menekan Enter atau
 * menempel teks dari tempat lain. Isi CV di sini berbentuk untaian satu baris,
 * jadi pemisah baris diratakan menjadi spasi ketimbang tersimpan apa adanya
 * dan muncul sebagai teks berantakan pada berkas PDF.
 *
 * Spasi tak-putus (U+00A0) ikut diubah menjadi spasi biasa: peramban
 * menyisipkannya saat mengetik di ujung baris, dan spasi itu akan terbawa ke
 * teks yang dibaca pengurai ATS sebagai karakter yang bukan spasi.
 */
export function cleanEditedText(raw: string): string {
  return raw
    .replace(/ /g, " ")
    .replace(/\s*\n+\s*/g, " ")
    .replace(/[ \t]+/g, " ")
    .trim();
}

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Mengembalikan salinan CV dengan satu nilai teks diganti.
 *
 * CV aslinya tidak diubah - editor menyimpan datanya sebagai state React, dan
 * mengubah objek yang sama di tempat akan membuat React tidak melihat adanya
 * perubahan. Jalur yang tidak terdaftar dikembalikan apa adanya, tanpa
 * melempar galat: yang salah bukan pengguna, dan menggagalkan seluruh
 * suntingan hanya akan membuat ketikannya hilang.
 */
export function applyEdit(
  data: ResumeData,
  path: string,
  value: string,
): ResumeData {
  if (!isEditablePath(path)) return data;

  const text = cleanEditedText(value);
  const parts = path.split(".");
  const next: any = { ...data };

  if (parts.length === 1) {
    next[parts[0]] = text;
    return next as ResumeData;
  }

  if (parts.length === 2) {
    next.personalInfo = { ...next.personalInfo, [parts[1]]: text };
    return next as ResumeData;
  }

  const [section, indexText] = parts;
  const index = Number(indexText);
  const list = next[section];
  if (!Array.isArray(list) || index < 0 || index >= list.length) return data;

  const entry = { ...list[index] };

  if (parts.length === 3) {
    entry[parts[2]] = text;
  } else {
    const bulletIndex = Number(parts[3]);
    if (
      !Array.isArray(entry.bullets) ||
      bulletIndex < 0 ||
      bulletIndex >= entry.bullets.length
    ) {
      return data;
    }
    const bullets = [...entry.bullets];
    bullets[bulletIndex] = text;
    entry.bullets = bullets;
  }

  const nextList = [...list];
  nextList[index] = entry;
  next[section] = nextList;
  return next as ResumeData;
}

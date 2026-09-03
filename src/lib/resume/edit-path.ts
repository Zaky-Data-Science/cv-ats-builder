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
 *  - **Hanya teks, tidak pernah struktur.** Berkas ini mengubah kata, bukan
 *    panjang sebuah larik. Menambah dan menghapus entri punya berkasnya
 *    sendiri, `structure.ts`, dengan daftar terdaftarnya sendiri - sebab
 *    kemampuan mengubah panjang larik jauh lebih berbahaya bila diberi jalur
 *    bebas, dan menyatukan keduanya berarti satu kesalahan menjadi dua.
 *
 * Tanggal pun begitu: jalurnya ada di `applyDateEdit()` di bagian bawah
 * berkas ini, dan tidak pernah menerima teks bebas. Yang dipertahankan bukan
 * "tanggal tidak dapat disunting di kertas", melainkan alasannya - bahwa
 * nilainya harus berasal dari pemilih bulan, bukan dari `innerText`.
 */

/**
 * Field bertipe teks yang boleh disunting langsung, per bagian CV.
 *
 * Kota dan negara ikut di sini sejak sesi 7. Sebelumnya tidak, sebab ketiganya
 * bersama nama perusahaan dirender sebagai satu untaian dan membelah untaian
 * itu kembali menjadi tiga field hanyalah tebakan. Yang berubah bukan
 * penilaian atas tebakan itu - melainkan bahwa tidak ada lagi yang perlu
 * ditebak: dokumen kini merender tiap sub-field sebagai elemennya sendiri,
 * masing-masing membawa jalurnya, jadi tidak ada untaian yang dibelah.
 *
 * Yang TIDAK ada di sini tetap disengaja:
 *
 *  - **Tanggal.** Disimpan sebagai "YYYY-MM" dan diisi lewat pemilih bulan.
 *    Diketik bebas, "Feb 2023" akan diterima sebagai tanggal - dan itu bukan
 *    tanggal bagi aplikasi ini. Jalurnya sendiri ada di `applyDateEdit()` di
 *    bawah, yang tidak pernah menerima teks bebas.
 *  - **Nilai yang ditampilkan sudah berubah bentuk**, seperti alamat proyek
 *    yang dirapikan `prettyUrl()` menjadi tanpa skema. Menulis balik apa yang
 *    terlihat akan menghapus bagian yang sengaja disembunyikan dari tampilan.
 */
const EDITABLE: Record<string, readonly string[]> = {
  personalInfo: ["fullName", "headline", "summary"],
  experiences: ["jobTitle", "company", "city", "country"],
  educations: ["degree", "fieldOfStudy", "institution", "city"],
  projects: ["name", "role"],
  organizations: ["name", "role", "city"],
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

/* -------------------------------------------------------------------------- */
/* Tanggal                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Bentuk tanggal yang dimiliki sebuah bagian CV.
 *
 * "range" punya bulan mulai dan selesai; sebagiannya juga punya penanda
 * "masih berlangsung". "single" hanya punya satu bulan, dan nama kolomnya
 * berbeda-beda - sertifikasi memakai `issueDate`, penghargaan dan publikasi
 * memakai `date`. Perbedaan itu dikumpulkan di sini supaya tidak tersebar
 * sebagai percabangan di dalam komponen.
 */
export type DateShape =
  | { kind: "range"; current: boolean }
  | { kind: "single"; field: "issueDate" | "date" };

const DATE_EDITABLE: Record<string, DateShape> = {
  experiences: { kind: "range", current: true },
  educations: { kind: "range", current: true },
  organizations: { kind: "range", current: true },
  // Proyek tidak punya kolom `isCurrent`; menawarkan centangnya akan
  // menjanjikan sesuatu yang tidak dapat disimpan.
  projects: { kind: "range", current: false },
  certifications: { kind: "single", field: "issueDate" },
  awards: { kind: "single", field: "date" },
  publications: { kind: "single", field: "date" },
};

export function dateShape(section: string): DateShape | null {
  return DATE_EDITABLE[section] ?? null;
}

/** Jalur entri untuk penyunting tanggal, mis. "experiences.0". */
export function datePath(section: string, index: number): string {
  return `${section}.${index}`;
}

export interface DatePatch {
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
  date?: string;
}

/**
 * Hanya "YYYY-MM" dengan bulan 01-12, atau kosong.
 *
 * Kosong berarti belum diisi dan memang sah - pengguna berhak mengosongkan
 * kembali bulan selesai. Yang tidak sah adalah segala bentuk lain, termasuk
 * "2023-13" yang lolos pemeriksaan bentuk yang lebih longgar.
 */
function bulanSah(value: string): boolean {
  return value === "" || /^\d{4}-(0[1-9]|1[0-2])$/.test(value);
}

/**
 * Menulis balik tanggal yang disunting dari atas kertas.
 *
 * Sengaja bukan bagian dari `applyEdit`. Fungsi itu menerima teks bebas hasil
 * ketikan dan menyimpan apa pun yang masuk; menambahkan tanggal ke sana
 * persis melanggar alasan tanggal dulu tidak dapat disunting di kertas -
 * "Feb 2023" akan tersimpan sebagai tanggal. Yang sampai ke sini tidak pernah
 * berasal dari `innerText`, melainkan dari `<input type="month">` dan sebuah
 * centang, dan tetap diperiksa lagi di sini: nilai dari DOM tidak pernah
 * dipercaya begitu saja, sekalipun DOM itu buatan aplikasi sendiri.
 */
export function applyDateEdit(
  data: ResumeData,
  path: string,
  patch: DatePatch,
): ResumeData {
  const parts = path.split(".");
  if (parts.length !== 2) return data;

  const [section, indexText] = parts;
  const shape = dateShape(section);
  if (!shape || !/^\d+$/.test(indexText)) return data;

  const list = (data as any)[section];
  const index = Number(indexText);
  if (!Array.isArray(list) || index < 0 || index >= list.length) return data;

  const entry = { ...list[index] };

  if (shape.kind === "range") {
    if (patch.startDate !== undefined) {
      if (!bulanSah(patch.startDate)) return data;
      entry.startDate = patch.startDate;
    }
    if (patch.endDate !== undefined) {
      if (!bulanSah(patch.endDate)) return data;
      entry.endDate = patch.endDate;
    }
    if (shape.current && patch.isCurrent !== undefined) {
      entry.isCurrent = patch.isCurrent;
      // Sama seperti perilaku formulir: yang masih berlangsung tidak punya
      // bulan selesai, dan meninggalkan bulan lama di sana akan tercetak
      // begitu centangnya dilepas lagi.
      if (patch.isCurrent) entry.endDate = "";
    }
  } else {
    if (patch.date === undefined) return data;
    if (!bulanSah(patch.date)) return data;
    entry[shape.field] = patch.date;
  }

  const nextList = [...list];
  nextList[index] = entry;
  return { ...data, [section]: nextList } as ResumeData;
}

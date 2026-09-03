import {
  emptyAward,
  emptyCertification,
  emptyEducation,
  emptyExperience,
  emptyLanguage,
  emptyOrganization,
  emptyProject,
  emptyPublication,
  emptySkill,
} from "./factory";
import type { ResumeData } from "./types";

/**
 * Menambah dan menghapus entri beserta poin pencapaian dari atas kertas.
 *
 * Terpisah dari `applyEdit` di edit-path.ts, dan pemisahan itu yang penting.
 * Fungsi di sana mengubah **kata**: ia menerima sebuah jalur dan sebuah teks,
 * dan tidak pernah dapat mengubah panjang satu larik pun. Berkas ini mengubah
 * **struktur** - menambah dan membuang seluruh entri - dan kemampuan itu jauh
 * lebih berbahaya bila diberi jalur bebas.
 *
 * Sebabnya sama dengan yang membuat `applyEdit` dibuat ketat: aksi ini dipicu
 * atribut di dalam DOM, dan DOM dapat disunting siapa pun lewat konsol
 * peramban. Union tertutup di bawah membuat setiap akibat yang mungkin terjadi
 * dapat dihitung dengan tangan - "tambah satu entri kosong buatan pabrik pada
 * bagian X" - bukan "timpa larik X dengan apa pun yang dikirim".
 *
 * Yang tetap lewat formulir: memulai bagian yang masih kosong sama sekali.
 * Bagian tanpa satu pun entri tidak dicetak di kertas, sehingga tidak ada
 * tempat untuk meletakkan tombolnya - dan menambahkan daftar bagian kosong ke
 * atas kertas akan menaruh antarmuka aplikasi di dalam dokumen yang justru
 * dirancang hanya berisi isi CV.
 */

/** Bagian berentri beserta pembuat entri kosongnya. */
const ENTRY_FACTORY: Record<string, () => unknown> = {
  experiences: emptyExperience,
  educations: emptyEducation,
  projects: emptyProject,
  organizations: emptyOrganization,
  certifications: emptyCertification,
  awards: emptyAward,
  publications: emptyPublication,
  languages: emptyLanguage,
  skills: () => emptySkill(),
};

/** Bagian yang punya daftar poin - sama dengan WITH_BULLETS di edit-path.ts. */
const WITH_BULLETS = new Set([
  "experiences",
  "educations",
  "projects",
  "organizations",
]);

export type StructureAction =
  | { kind: "pruneBullets" }
  | { kind: "addEntry"; section: string }
  | { kind: "removeEntry"; section: string; index: number }
  | { kind: "addBullet"; section: string; index: number; after: number }
  | { kind: "removeBullet"; section: string; index: number; at: number };

export function canAddEntry(section: string): boolean {
  return section in ENTRY_FACTORY;
}

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Mengembalikan salinan CV dengan satu aksi struktural diterapkan.
 *
 * Aksi yang tidak dikenal, bagian yang tidak terdaftar, dan nomor di luar
 * jangkauan mengembalikan CV yang sama persis - bukan salinan, dan bukan
 * galat. Alasannya sama dengan pada `applyEdit`: yang salah bukan pengguna,
 * dan menggagalkan seluruh penyuntingan hanya akan membuat pekerjaannya
 * hilang.
 */
export function applyStructure(
  data: ResumeData,
  action: StructureAction,
): ResumeData {
  if (action.kind === "pruneBullets") return pruneEmptyBullets(data);

  const factory = ENTRY_FACTORY[action.section];
  if (!factory) return data;

  const list = (data as any)[action.section];
  if (!Array.isArray(list)) return data;

  if (action.kind === "addEntry") {
    return { ...data, [action.section]: [...list, factory()] } as ResumeData;
  }

  if (action.index < 0 || action.index >= list.length) return data;

  if (action.kind === "removeEntry") {
    const nextList = [...list];
    nextList.splice(action.index, 1);
    return { ...data, [action.section]: nextList } as ResumeData;
  }

  if (!WITH_BULLETS.has(action.section)) return data;

  const entry = { ...list[action.index] };
  if (!Array.isArray(entry.bullets)) return data;
  const bullets = [...entry.bullets];

  if (action.kind === "addBullet") {
    // Nomor di luar jangkauan tetap menghasilkan penambahan di ujung, bukan
    // penolakan: yang diminta pengguna adalah poin baru, dan letaknya yang
    // meleset lebih baik daripada tombol yang diam saja.
    const at =
      action.after >= 0 && action.after < bullets.length
        ? action.after + 1
        : bullets.length;
    bullets.splice(at, 0, "");
  } else {
    if (action.at < 0 || action.at >= bullets.length) return data;
    bullets.splice(action.at, 1);
  }

  entry.bullets = bullets;
  const nextList = [...list];
  nextList[action.index] = entry;
  return { ...data, [action.section]: nextList } as ResumeData;
}

/**
 * Membuang poin kosong dari seluruh CV.
 *
 * Dipanggil saat mode ketik dimatikan, bukan saat kursor meninggalkan sebuah
 * poin. Membersihkan pada saat lepas fokus akan menghapus poin yang baru saja
 * dibuat pengguna tepat ketika ia mengkliknya untuk mulai mengetik.
 */
export function pruneEmptyBullets(data: ResumeData): ResumeData {
  let berubah = false;
  const next: any = { ...data };

  for (const section of WITH_BULLETS) {
    const list = (data as any)[section];
    if (!Array.isArray(list)) continue;

    const nextList = list.map((entry: any) => {
      if (!Array.isArray(entry.bullets)) return entry;
      const bullets = entry.bullets.filter((b: string) => b.trim().length > 0);
      if (bullets.length === entry.bullets.length) return entry;
      berubah = true;
      return { ...entry, bullets };
    });

    if (berubah) next[section] = nextList;
  }

  return berubah ? (next as ResumeData) : data;
}

import {
  emptyAward,
  emptyCertification,
  emptyCustomEntry,
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
 * dirancang hanya berisi isi CV. Itu berlaku juga bagi **bagian tambahan yang
 * baru**: yang dapat ditambah dari kertas adalah entri di dalam bagian yang
 * sudah ada, bukan bagiannya sendiri.
 */

/**
 * Bentuk nama bagian bagi entri di dalam sebuah bagian tambahan:
 * `customSections.<nomor>.items`.
 *
 * Ditulis sebagai bentuk tertutup, bukan sebagai jalur bebas. Alasannya sama
 * dengan yang membuat seluruh berkas ini ketat - nama bagian datang dari
 * atribut DOM, dan yang boleh terjadi karenanya harus dapat dihitung dengan
 * tangan.
 */
const CUSTOM_ITEMS = /^customSections\.(\d+)\.items$/;

/** Nama bagian untuk daftar entri sebuah bagian tambahan. */
export function customItemsSection(sectionIndex: number): string {
  return `customSections.${sectionIndex}.items`;
}

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
  return section in ENTRY_FACTORY || CUSTOM_ITEMS.test(section);
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

  const target = bacaBagian(data, action.section);
  if (!target) return data;

  const { list, factory, hasBullets, write } = target;

  if (action.kind === "addEntry") {
    return write(data, [...list, factory()]);
  }

  if (action.index < 0 || action.index >= list.length) return data;

  if (action.kind === "removeEntry") {
    const nextList = [...list];
    nextList.splice(action.index, 1);
    return write(data, nextList);
  }

  if (!hasBullets) return data;

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
  return write(data, nextList);
}

/**
 * Menerjemahkan nama bagian menjadi daftarnya, pembuat entrinya, dan cara
 * menuliskannya kembali.
 *
 * Bagian tambahan bersarang satu tingkat lebih dalam
 * (`customSections.<n>.items`), sehingga menulis balik berarti menyalin dua
 * larik, bukan satu. Perbedaan itu dikumpulkan di sini supaya `applyStructure`
 * tetap berisi satu alur - larik, nomor, sisipkan atau buang - dan tidak
 * bercabang dua kali di setiap aksinya.
 *
 * Nama yang tidak terdaftar mengembalikan null, dan pemanggilnya
 * mengembalikan CV apa adanya.
 */
function bacaBagian(
  data: ResumeData,
  section: string,
): {
  list: any[];
  factory: () => unknown;
  hasBullets: boolean;
  write: (data: ResumeData, list: any[]) => ResumeData;
} | null {
  // `in`, bukan kebenaran nilainya: tipe Record membuat TypeScript menganggap
  // setiap kunci selalu terisi, sehingga `if (factory)` tidak pernah menjadi
  // pemeriksaan yang sebenarnya - dan tidak pernah menolak nama bagian palsu.
  if (section in ENTRY_FACTORY) {
    const factory = ENTRY_FACTORY[section];
    const list = (data as any)[section];
    if (!Array.isArray(list)) return null;
    return {
      list,
      factory,
      hasBullets: WITH_BULLETS.has(section),
      write: (d, next) => ({ ...d, [section]: next }) as ResumeData,
    };
  }

  const cocok = CUSTOM_ITEMS.exec(section);
  if (!cocok) return null;

  const sections = (data as any).customSections;
  if (!Array.isArray(sections)) return null;

  const index = Number(cocok[1]);
  if (index < 0 || index >= sections.length) return null;
  if (!Array.isArray(sections[index].items)) return null;

  return {
    list: sections[index].items,
    factory: emptyCustomEntry,
    hasBullets: true,
    write: (d, next) => {
      const semua = [...(d as any).customSections];
      semua[index] = { ...semua[index], items: next };
      return { ...d, customSections: semua } as ResumeData;
    },
  };
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

  const bersihkan = (list: any[]) =>
    list.map((entry: any) => {
      if (!Array.isArray(entry.bullets)) return entry;
      const bullets = entry.bullets.filter((b: string) => b.trim().length > 0);
      if (bullets.length === entry.bullets.length) return entry;
      berubah = true;
      return { ...entry, bullets };
    });

  for (const section of WITH_BULLETS) {
    const list = (data as any)[section];
    if (!Array.isArray(list)) continue;
    next[section] = bersihkan(list);
  }

  // Entri bagian tambahan juga punya poin, dan poin kosong yang tampil selama
  // mode ketik harus ikut hilang begitu mode itu dimatikan - kalau tidak,
  // jumlah halamannya tetap terbaca lebih banyak daripada yang tercetak.
  const sections = (data as any).customSections;
  if (Array.isArray(sections)) {
    next.customSections = sections.map((section: any) =>
      Array.isArray(section.items)
        ? { ...section, items: bersihkan(section.items) }
        : section,
    );
  }

  // Seluruh larik disalin lebih dulu, lalu hasilnya dibuang bila ternyata
  // tidak ada satu poin pun yang terbuang. Menyalin tanpa perlu jauh lebih
  // murah daripada mengembalikan objek baru setiap kali mode ketik dimatikan:
  // objek baru membuat React menggambar ulang seluruh kertas, dan penyimpan
  // otomatis mengirim CV yang sebenarnya tidak berubah ke server.
  return berubah ? (next as ResumeData) : data;
}

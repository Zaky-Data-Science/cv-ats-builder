import type { Locale } from "@/lib/i18n/config";
import type { ResumeData, TemplateId } from "@/lib/resume/types";

/**
 * ============================================================================
 *  KATALOG TEMPLATE
 * ============================================================================
 *
 * Sepuluh template, seluruhnya **satu kolom**. Ini bukan kemalasan desain,
 * melainkan syarat teknis: pengurai ATS membaca dokumen dari kiri ke kanan
 * lalu turun, sehingga tata letak dua kolom membuatnya menyelang-nyeling
 * kalimat dari kolom kiri dan kanan hingga isinya kacau. Template CV berkolom
 * dua yang banyak beredar memang bagus dipandang manusia, tetapi justru
 * gugur di tahap yang ingin dilewati pengguna aplikasi ini.
 *
 * Yang membedakan template di sini karena itu hanya empat hal: tipografi,
 * jarak, garis, dan penempatan foto. Tidak ada satu pun template yang
 * "lebih tidak terbaca" dibanding lainnya.
 *
 * Soal foto: sebagian besar template sengaja tidak menampilkannya. Foto tidak
 * dapat dibaca pengurai mana pun, memakan ruang yang seharusnya berisi
 * pencapaian, dan di banyak negara justru membuat lamaran disisihkan karena
 * aturan anti-diskriminasi. Tetapi sebagian lowongan di Indonesia - terutama
 * instansi, BUMN, perbankan, dan bidang layanan - masih memintanya secara
 * eksplisit, jadi dua template khusus berfoto tetap disediakan.
 */

export type TemplatePhoto = "none" | "top" | "beside" | "circle";

export type HeadingStyle =
  | "underline"
  | "accent-bar"
  | "plain"
  | "rule-above"
  | "double-rule";

export interface TemplateStyle {
  /**
   * Margin halaman dalam milimeter.
   *
   * Disimpan sebagai angka, bukan sebagai untai CSS, karena nilai yang sama
   * dipakai di dua tempat yang tidak dapat saling membaca: properti padding
   * pada elemen kertas, dan aturan @page saat mencetak. Margin atas dan bawah
   * dibuat sama besar - itulah yang membuat teks tidak terlihat jatuh
   * terlalu ke bawah pada halaman mana pun.
   */
  paddingYMm: number;
  paddingXMm: number;
  nameSize: string;
  nameAlign: "left" | "center";
  nameWeight: number;
  nameTransform: "none" | "uppercase";
  headlineSize: string;
  headingSize: string;
  headingSpacing: string;
  headingStyle: HeadingStyle;
  headingUppercase: boolean;
  /** Garis pemisah di bawah blok kepala (nama + kontak). */
  headerRule: "none" | "thin" | "thick" | "double";
  sectionGap: string;
  entryGap: string;
  useAccent: boolean;
  letterSpacing: string;
  /** Garis tipis vertikal di sisi kiri tiap entri - gaya kronologis. */
  entryMarker: boolean;
  photo: TemplatePhoto;
  photoWidthMm: number;
  photoHeightMm: number;
}

/** Ciri rupa tiap template. Dipakai pratinjau sekaligus halaman cetak. */
export const TEMPLATE_STYLES: Record<TemplateId, TemplateStyle> = {
  // Formal dan konservatif - pilihan teraman untuk instansi, BUMN, dan
  // perusahaan besar yang masih memakai ATS generasi lama.
  CLASSIC: {
    paddingYMm: 15,
    paddingXMm: 16,
    nameSize: "20pt",
    nameAlign: "center",
    nameWeight: 700,
    nameTransform: "none",
    headlineSize: "11pt",
    headingSize: "10.5pt",
    headingSpacing: "0 0 3pt 0",
    headingStyle: "underline",
    headingUppercase: true,
    headerRule: "none",
    sectionGap: "11pt",
    entryGap: "8pt",
    useAccent: false,
    letterSpacing: "0.06em",
    entryMarker: false,
    photo: "none",
    photoWidthMm: 0,
    photoHeightMm: 0,
  },

  // Lebih lapang dengan aksen warna pada judul section. Cocok untuk
  // perusahaan teknologi dan startup.
  MODERN: {
    paddingYMm: 16,
    paddingXMm: 17,
    nameSize: "22pt",
    nameAlign: "left",
    nameWeight: 700,
    nameTransform: "none",
    headlineSize: "11.5pt",
    headingSize: "10pt",
    headingSpacing: "0 0 4pt 0",
    headingStyle: "accent-bar",
    headingUppercase: true,
    headerRule: "none",
    sectionGap: "13pt",
    entryGap: "9pt",
    useAccent: true,
    letterSpacing: "0.09em",
    entryMarker: false,
    photo: "none",
    photoWidthMm: 0,
    photoHeightMm: 0,
  },

  // Paling padat - untuk pelamar dengan pengalaman panjang yang tetap ingin
  // muat dalam satu halaman.
  COMPACT: {
    paddingYMm: 12,
    paddingXMm: 13,
    nameSize: "17pt",
    nameAlign: "left",
    nameWeight: 700,
    nameTransform: "none",
    headlineSize: "10pt",
    headingSize: "9.5pt",
    headingSpacing: "0 0 2pt 0",
    headingStyle: "plain",
    headingUppercase: true,
    headerRule: "none",
    sectionGap: "8pt",
    entryGap: "6pt",
    useAccent: false,
    letterSpacing: "0.05em",
    entryMarker: false,
    photo: "none",
    photoWidthMm: 0,
    photoHeightMm: 0,
  },

  // Nama besar dengan garis tebal di bawahnya. Kesan senior tanpa satu pun
  // elemen grafis - yang membentuk kesan itu hanya ukuran dan bobot huruf.
  EXECUTIVE: {
    paddingYMm: 16,
    paddingXMm: 18,
    nameSize: "25pt",
    nameAlign: "left",
    nameWeight: 700,
    nameTransform: "uppercase",
    headlineSize: "11pt",
    headingSize: "10pt",
    headingSpacing: "0 0 4pt 0",
    headingStyle: "rule-above",
    headingUppercase: true,
    headerRule: "thick",
    sectionGap: "13pt",
    entryGap: "9pt",
    useAccent: false,
    letterSpacing: "0.14em",
    entryMarker: false,
    photo: "none",
    photoWidthMm: 0,
    photoHeightMm: 0,
  },

  // Tanpa satu garis pun. Pemisah antarbagian sepenuhnya dibentuk oleh jarak
  // dan bobot huruf - paling bersih, dan paling tidak mungkin membingungkan
  // pengurai mana pun.
  MINIMAL: {
    paddingYMm: 18,
    paddingXMm: 19,
    nameSize: "21pt",
    nameAlign: "left",
    nameWeight: 600,
    nameTransform: "none",
    headlineSize: "11pt",
    headingSize: "9.5pt",
    headingSpacing: "0 0 3pt 0",
    headingStyle: "plain",
    headingUppercase: true,
    headerRule: "none",
    sectionGap: "15pt",
    entryGap: "10pt",
    useAccent: false,
    letterSpacing: "0.16em",
    entryMarker: false,
    photo: "none",
    photoWidthMm: 0,
    photoHeightMm: 0,
  },

  // Garis tipis di sisi kiri setiap entri, memberi kesan garis waktu.
  // Garisnya murni border CSS, bukan gambar, jadi tidak ikut terbaca sebagai
  // isi oleh pengurai.
  TIMELINE: {
    paddingYMm: 15,
    paddingXMm: 16,
    nameSize: "21pt",
    nameAlign: "left",
    nameWeight: 700,
    nameTransform: "none",
    headlineSize: "11pt",
    headingSize: "10pt",
    headingSpacing: "0 0 5pt 0",
    headingStyle: "plain",
    headingUppercase: true,
    headerRule: "thin",
    sectionGap: "12pt",
    entryGap: "9pt",
    useAccent: false,
    letterSpacing: "0.11em",
    entryMarker: true,
    photo: "none",
    photoWidthMm: 0,
    photoHeightMm: 0,
  },

  // Huruf kecil dan rapat, untuk CV yang panjang karena berisi publikasi,
  // organisasi, dan penghargaan - lazim pada lamaran beasiswa dan akademik.
  ACADEMIC: {
    paddingYMm: 14,
    paddingXMm: 15,
    nameSize: "18pt",
    nameAlign: "center",
    nameWeight: 600,
    nameTransform: "none",
    headlineSize: "10pt",
    headingSize: "9.5pt",
    headingSpacing: "0 0 3pt 0",
    headingStyle: "underline",
    headingUppercase: false,
    headerRule: "thin",
    sectionGap: "10pt",
    entryGap: "7pt",
    useAccent: false,
    letterSpacing: "0.04em",
    entryMarker: false,
    photo: "none",
    photoWidthMm: 0,
    photoHeightMm: 0,
  },

  // Paling formal: nama di tengah, garis ganda, judul bagian huruf besar.
  // Bentuk yang masih diharapkan banyak seleksi instansi dan BUMN.
  GOVERNMENT: {
    paddingYMm: 15,
    paddingXMm: 17,
    nameSize: "19pt",
    nameAlign: "center",
    nameWeight: 700,
    nameTransform: "uppercase",
    headlineSize: "10.5pt",
    headingSize: "10pt",
    headingSpacing: "0 0 3pt 0",
    headingStyle: "double-rule",
    headingUppercase: true,
    headerRule: "double",
    sectionGap: "11pt",
    entryGap: "8pt",
    useAccent: false,
    letterSpacing: "0.1em",
    entryMarker: false,
    photo: "none",
    photoWidthMm: 0,
    photoHeightMm: 0,
  },

  // Berfoto, formal: pasfoto 3x4 di kanan atas, sejajar dengan nama.
  // Teksnya tetap mengalir satu kolom - foto adalah elemen mengambang yang
  // tidak menyela urutan bacaan.
  PORTRAIT: {
    paddingYMm: 14,
    paddingXMm: 16,
    nameSize: "21pt",
    nameAlign: "left",
    nameWeight: 700,
    nameTransform: "none",
    headlineSize: "11pt",
    headingSize: "10pt",
    headingSpacing: "0 0 3pt 0",
    headingStyle: "underline",
    headingUppercase: true,
    headerRule: "thin",
    sectionGap: "11pt",
    entryGap: "8pt",
    useAccent: false,
    letterSpacing: "0.08em",
    entryMarker: false,
    photo: "beside",
    photoWidthMm: 30,
    photoHeightMm: 40,
  },

  // Berfoto, luwes: foto bulat di tengah atas. Untuk bidang yang memang
  // menuntut penampilan - layanan pelanggan, pramugari, perhotelan.
  PROFILE: {
    paddingYMm: 14,
    paddingXMm: 16,
    nameSize: "20pt",
    nameAlign: "center",
    nameWeight: 700,
    nameTransform: "none",
    headlineSize: "11pt",
    headingSize: "10pt",
    headingSpacing: "0 0 3pt 0",
    headingStyle: "plain",
    headingUppercase: true,
    headerRule: "thin",
    sectionGap: "11pt",
    entryGap: "8pt",
    useAccent: true,
    letterSpacing: "0.1em",
    entryMarker: false,
    photo: "circle",
    photoWidthMm: 28,
    photoHeightMm: 28,
  },
};

/** Urutan tampil pada pemilih template. */
export const TEMPLATE_ORDER: TemplateId[] = [
  "CLASSIC",
  "MODERN",
  "COMPACT",
  "EXECUTIVE",
  "MINIMAL",
  "TIMELINE",
  "ACADEMIC",
  "GOVERNMENT",
  "PORTRAIT",
  "PROFILE",
];

export interface TemplateInfo {
  name: string;
  /** Satu kalimat: untuk siapa template ini. */
  description: string;
}

export const TEMPLATE_INFO: Record<Locale, Record<TemplateId, TemplateInfo>> = {
  id: {
    CLASSIC: {
      name: "Klasik",
      description:
        "Nama di tengah, judul bagian bergaris bawah. Paling aman untuk instansi dan perusahaan besar.",
    },
    MODERN: {
      name: "Modern",
      description:
        "Lapang dengan aksen warna tipis pada judul bagian. Cocok untuk perusahaan teknologi dan startup.",
    },
    COMPACT: {
      name: "Padat",
      description:
        "Jarak paling rapat. Untuk pengalaman panjang yang tetap ingin muat satu halaman.",
    },
    EXECUTIVE: {
      name: "Eksekutif",
      description:
        "Nama besar berhuruf kapital dengan garis tebal. Untuk posisi manajerial dan senior.",
    },
    MINIMAL: {
      name: "Minimalis",
      description:
        "Tanpa satu garis pun - pemisahnya hanya jarak. Paling bersih dan paling netral.",
    },
    TIMELINE: {
      name: "Kronologis",
      description:
        "Garis tipis di sisi kiri tiap entri sehingga perjalanan karier terbaca sekilas.",
    },
    ACADEMIC: {
      name: "Akademik",
      description:
        "Huruf kecil dan rapat. Untuk CV panjang berisi publikasi, organisasi, dan penghargaan.",
    },
    GOVERNMENT: {
      name: "Instansi",
      description:
        "Paling formal: nama di tengah, garis ganda. Bentuk yang lazim pada seleksi instansi dan BUMN.",
    },
    PORTRAIT: {
      name: "Berfoto - Formal",
      description:
        "Pasfoto 3x4 di kanan atas sejajar nama. Untuk lowongan yang memang meminta lampiran foto.",
    },
    PROFILE: {
      name: "Berfoto - Bulat",
      description:
        "Foto bulat di tengah atas. Untuk bidang layanan, perhotelan, dan penerbangan.",
    },
  },
  en: {
    CLASSIC: {
      name: "Classic",
      description:
        "Centred name, underlined section headings. The safest choice for government bodies and large firms.",
    },
    MODERN: {
      name: "Modern",
      description:
        "Roomy, with a thin colour accent on section headings. Suits tech companies and startups.",
    },
    COMPACT: {
      name: "Compact",
      description:
        "The tightest spacing. For a long career history that still needs to fit on one page.",
    },
    EXECUTIVE: {
      name: "Executive",
      description:
        "Large uppercase name with a heavy rule. For managerial and senior positions.",
    },
    MINIMAL: {
      name: "Minimal",
      description:
        "Not a single rule - spacing alone separates the sections. The cleanest and most neutral option.",
    },
    TIMELINE: {
      name: "Timeline",
      description:
        "A thin rule down the left of each entry, so the career path reads at a glance.",
    },
    ACADEMIC: {
      name: "Academic",
      description:
        "Small, tight type. For long CVs carrying publications, organisations and awards.",
    },
    GOVERNMENT: {
      name: "Formal",
      description:
        "The most formal: centred name, double rules. The shape expected by public-sector selection panels.",
    },
    PORTRAIT: {
      name: "With photo - Formal",
      description:
        "A passport-style photo top right, level with the name. For roles that explicitly ask for one.",
    },
    PROFILE: {
      name: "With photo - Round",
      description:
        "A round photo centred at the top. For service, hospitality and aviation roles.",
    },
  },
};

/** Apakah template ini menampilkan foto sama sekali. */
/**
 * Ukuran pas foto yang berlaku: pilihan pengguna bila ada, kalau tidak bawaan
 * template.
 *
 * Pola dan alasannya sama persis dengan `resumeMargins()`. Yang berbeda hanya
 * satu hal, dan itu yang menjaga pas foto tetap berbentuk pas foto: hanya
 * lebarnya yang boleh dipilih. Tingginya selalu dihitung dari perbandingan
 * milik template - 3:4 pada yang formal, 1:1 pada yang bulat - sehingga tidak
 * ada kombinasi angka yang dapat membuatnya lonjong.
 */
export function resumePhotoSize(
  template: TemplateId,
  widthMm: number | null,
): { widthMm: number; heightMm: number } {
  const style = templateStyle(template);
  if (style.photoWidthMm === 0) return { widthMm: 0, heightMm: 0 };

  const rasio = style.photoHeightMm / style.photoWidthMm;
  const lebar = widthMm ?? style.photoWidthMm;
  return { widthMm: lebar, heightMm: lebar * rasio };
}

/** Rentang lebar pas foto yang boleh dipilih, dalam milimeter. */
export const PHOTO_WIDTH_MIN_MM = 18;
export const PHOTO_WIDTH_MAX_MM = 45;

export function templateSupportsPhoto(template: TemplateId): boolean {
  return TEMPLATE_STYLES[template].photo !== "none";
}

export function templateStyle(template: TemplateId): TemplateStyle {
  return TEMPLATE_STYLES[template] ?? TEMPLATE_STYLES.CLASSIC;
}

/** Cara mengisi ruang tepi kertas pada sebuah keluaran. */
export type PaddingMode =
  /** Margin penuh - dipakai pratinjau bersambung dan pratinjau template. */
  | "full"
  /**
   * Hanya margin kiri-kanan. Dipakai pratinjau per halaman: margin atas dan
   * bawah di sana disediakan oleh lembarnya, bukan oleh dokumennya, supaya
   * setiap lembar memperolehnya - bukan hanya lembar pertama dan terakhir.
   */
  | "horizontal"
  /** Tanpa margin sama sekali - saat mencetak, @page yang menyediakannya. */
  | "none";

/**
 * Margin halaman yang benar-benar berlaku pada sebuah CV, dalam milimeter.
 *
 * Bawaannya mengikuti template, tetapi pengguna boleh menimpanya lewat panel
 * Tampilan. Nilai null berarti "ikut template" - disimpan begitu, bukan
 * disalin angkanya, supaya CV yang belum pernah disetel manual ikut berubah
 * sendiri ketika templatenya diganti. Menyalin angkanya akan membuat CV
 * terkunci pada margin template lama tanpa pengguna pernah memintanya.
 */
export function resumeMargins(
  data: Pick<ResumeData, "template" | "marginYMm" | "marginXMm">,
): { y: number; x: number } {
  const style = templateStyle(data.template);
  return {
    y: data.marginYMm ?? style.paddingYMm,
    x: data.marginXMm ?? style.paddingXMm,
  };
}

/** Batas yang masuk akal untuk margin CV, dalam milimeter. */
export const MARGIN_MIN_MM = 8;
export const MARGIN_MAX_MM = 30;

/** Nilai properti padding CSS untuk elemen kertas. */
export function paperPadding(
  margins: { y: number; x: number },
  mode: PaddingMode = "full",
): string {
  if (mode === "none") return "0";
  if (mode === "horizontal") return `0 ${margins.x}mm`;
  return `${margins.y}mm ${margins.x}mm`;
}

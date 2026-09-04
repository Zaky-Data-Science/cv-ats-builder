import type { Locale } from "@/lib/i18n/config";

/**
 * ============================================================================
 *  DIAGRAM ALUR DAN WORKFLOW
 * ============================================================================
 *
 * Satu sumber data untuk dua keluaran: halaman /alur yang dirender sebagai
 * HTML biasa, dan berkas gambar SVG/PNG yang dibangkitkan skrip
 * `npm run diagram`.
 *
 * Digabungkan seperti ini karena diagram yang disimpan sebagai gambar hasil
 * gambar tangan selalu berakhir usang: fiturnya berubah, gambarnya tidak.
 * Dengan bentuk ini, memperbarui satu berkas memperbarui keduanya sekaligus,
 * dan diagram di laporan tidak pernah bercerita tentang aplikasi versi lama.
 *
 * Tata letaknya sengaja sederhana - satu kolom utama dengan dua jalur samping.
 * Diagram alur yang bercabang bebas memang lebih luwes, tetapi menuntut mesin
 * penata letak tersendiri, dan alur aplikasi ini memang lurus.
 */

export type NodeKind =
  | "start"
  | "process"
  | "decision"
  | "data"
  | "browser"
  | "end";

export interface DiagramNode {
  id: string;
  kind: NodeKind;
  /** -1 jalur kiri, 0 kolom utama, 1 jalur kanan. */
  lane: -1 | 0 | 1;
  label: Record<Locale, string>;
  note?: Record<Locale, string>;
}

export interface DiagramEdge {
  from: string;
  to: string;
  label?: Record<Locale, string>;
  /** Panah yang kembali ke simpul sebelumnya - digambar melengkung ke kiri. */
  back?: boolean;
}

export interface Diagram {
  id: string;
  title: Record<Locale, string>;
  description: Record<Locale, string>;
  nodes: DiagramNode[];
  edges: DiagramEdge[];
}

export const KIND_LABEL: Record<Locale, Record<NodeKind, string>> = {
  id: {
    start: "Mulai",
    process: "Proses",
    decision: "Keputusan",
    data: "Data",
    browser: "Di peramban",
    end: "Selesai",
  },
  en: {
    start: "Start",
    process: "Process",
    decision: "Decision",
    data: "Data",
    browser: "In the browser",
    end: "End",
  },
};

/* -------------------------------------------------------------------------- */
/* 1. Alur menyusun CV                                                        */
/* -------------------------------------------------------------------------- */

const buildFlow: Diagram = {
  id: "alur-menyusun-cv",
  title: {
    id: "Alur pengguna: menyusun CV",
    en: "User flow: building a CV",
  },
  description: {
    id: "Dari membuka aplikasi sampai berkas CV terunduh. Perhatikan bahwa penyimpanan berjalan sendiri di latar belakang, dan perbaikan berdasarkan skor merupakan putaran - bukan satu langkah sekali jalan.",
    en: "From opening the app to a downloaded file. Note that saving runs by itself in the background, and improving on the score is a loop rather than a one-off step.",
  },
  nodes: [
    {
      id: "buka",
      kind: "start",
      lane: 0,
      label: { id: "Membuka aplikasi", en: "Open the app" },
    },
    {
      id: "akun",
      kind: "decision",
      lane: 0,
      label: { id: "Sudah punya akun?", en: "Have an account?" },
    },
    {
      id: "daftar",
      kind: "process",
      lane: -1,
      label: { id: "Daftar - email atau Google", en: "Sign up - email or Google" },
    },
    {
      id: "masuk",
      kind: "process",
      lane: 0,
      label: { id: "Masuk", en: "Sign in" },
    },
    {
      id: "dashboard",
      kind: "process",
      lane: 0,
      label: { id: "Dashboard - daftar CV", en: "Dashboard - list of CVs" },
    },
    {
      id: "buat",
      kind: "process",
      lane: 0,
      label: { id: "Buat CV baru atau duplikasi", en: "Create or duplicate a CV" },
      note: {
        id: "Bisa dimulai dari kosong atau dari data contoh lengkap.",
        en: "Start blank, or from a complete worked example.",
      },
    },
    {
      id: "isi",
      kind: "process",
      lane: 0,
      label: { id: "Isi field terstruktur", en: "Fill the structured fields" },
      note: {
        id: "11 bagian. Setiap kotak memuat contoh pengisian berwarna abu.",
        en: "11 sections. Every box carries a grey worked example.",
      },
    },
    {
      id: "simpan",
      kind: "data",
      lane: 1,
      label: { id: "Simpan otomatis ke basis data", en: "Auto-save to the database" },
      note: {
        id: "0,8 detik setelah pengguna berhenti mengetik.",
        en: "0.8 seconds after the user stops typing.",
      },
    },
    {
      id: "pratinjau",
      kind: "process",
      lane: 0,
      label: {
        id: "Pratinjau seukuran kertas",
        en: "True-to-size paper preview",
      },
      note: {
        id: "A4, Letter, Legal, atau F4 - tersambung panjang atau terpotong per halaman.",
        en: "A4, Letter, Legal or F4 - continuous, or cut into pages.",
      },
    },
    {
      id: "skor",
      kind: "process",
      lane: 0,
      label: { id: "Hitung nilai CV", en: "Compute the CV score" },
      note: {
        id: "Lima dimensi berbobot, dihitung di peramban tanpa permintaan jaringan.",
        en: "Five weighted dimensions, computed in the browser with no network request.",
      },
    },
    {
      id: "cukup",
      kind: "decision",
      lane: 0,
      label: { id: "Skor sudah memadai?", en: "Score good enough?" },
    },
    {
      id: "unduh",
      kind: "process",
      lane: 0,
      label: { id: "Unduh PDF, Word, teks, atau JSON", en: "Download PDF, Word, text, or JSON" },
    },
    {
      id: "kirim",
      kind: "end",
      lane: 0,
      label: { id: "Kirim lamaran", en: "Send the application" },
    },
  ],
  edges: [
    { from: "buka", to: "akun" },
    { from: "akun", to: "daftar", label: { id: "belum", en: "no" } },
    { from: "daftar", to: "masuk" },
    { from: "akun", to: "masuk", label: { id: "sudah", en: "yes" } },
    { from: "masuk", to: "dashboard" },
    { from: "dashboard", to: "buat" },
    { from: "buat", to: "isi" },
    { from: "isi", to: "simpan" },
    { from: "isi", to: "pratinjau" },
    { from: "pratinjau", to: "skor" },
    { from: "skor", to: "cukup" },
    {
      from: "cukup",
      to: "isi",
      label: { id: "belum - perbaiki", en: "not yet - fix it" },
      back: true,
    },
    { from: "cukup", to: "unduh", label: { id: "sudah", en: "yes" } },
    { from: "unduh", to: "kirim" },
  ],
};

/* -------------------------------------------------------------------------- */
/* 2. Alur membandingkan CV                                                   */
/* -------------------------------------------------------------------------- */

const compareFlow: Diagram = {
  id: "alur-membandingkan-cv",
  title: {
    id: "Alur pengguna: membandingkan dan memindai CV",
    en: "User flow: comparing and scanning CVs",
  },
  description: {
    id: "Seluruh langkah pada alur ini berjalan di dalam peramban pengguna. Tidak ada berkas yang dikirim ke server, sehingga tidak ada pula yang tersimpan.",
    en: "Every step in this flow runs inside the user's browser. No file is sent to a server, so nothing is stored either.",
  },
  nodes: [
    {
      id: "buka",
      kind: "start",
      lane: 0,
      label: { id: "Membuka halaman Bandingkan CV", en: "Open the Compare CVs page" },
      note: {
        id: "Tanpa perlu akun.",
        en: "No account needed.",
      },
    },
    {
      id: "unggah",
      kind: "process",
      lane: 0,
      label: { id: "Pilih 1-5 berkas PDF, DOCX, atau TXT", en: "Choose 1-5 PDF, DOCX or TXT files" },
    },
    {
      id: "lowongan",
      kind: "process",
      lane: 1,
      label: { id: "Tempel iklan lowongan (opsional)", en: "Paste a job ad (optional)" },
    },
    {
      id: "ekstrak",
      kind: "browser",
      lane: 0,
      label: { id: "Ekstraksi teks di peramban", en: "Extract the text in the browser" },
      note: {
        id: "PDF lewat pdf.js; DOCX dibuka sebagai arsip zip lalu XML-nya dibaca.",
        en: "PDF via pdf.js; DOCX opened as a zip archive and its XML read.",
      },
    },
    {
      id: "tataletak",
      kind: "browser",
      lane: 0,
      label: { id: "Deteksi jumlah halaman dan kolom", en: "Detect page count and columns" },
      note: {
        id: "Celah kosong yang membelah halaman menandakan tata letak dua kolom.",
        en: "A gap splitting the page indicates a two-column layout.",
      },
    },
    {
      id: "nilai",
      kind: "browser",
      lane: 0,
      label: { id: "Nilai tiap CV - lima dimensi", en: "Score each CV - five dimensions" },
    },
    {
      id: "jumlah",
      kind: "decision",
      lane: 0,
      label: { id: "Berapa berkas?", en: "How many files?" },
    },
    {
      id: "pindai",
      kind: "process",
      lane: -1,
      label: { id: "Satu: hasil pindaian", en: "One: scan result" },
    },
    {
      id: "banding",
      kind: "process",
      lane: 0,
      label: { id: "Dua atau lebih: peringkat dan pemenang", en: "Two or more: ranking and winner" },
    },
    {
      id: "hasil",
      kind: "end",
      lane: 0,
      label: {
        id: "Kelebihan, kekurangan, dan cara memperbaikinya",
        en: "Strengths, weaknesses, and how to fix them",
      },
    },
  ],
  edges: [
    { from: "buka", to: "unggah" },
    { from: "unggah", to: "lowongan" },
    { from: "unggah", to: "ekstrak" },
    { from: "ekstrak", to: "tataletak" },
    { from: "tataletak", to: "nilai" },
    { from: "lowongan", to: "nilai" },
    { from: "nilai", to: "jumlah" },
    { from: "jumlah", to: "pindai", label: { id: "1 berkas", en: "1 file" } },
    { from: "jumlah", to: "banding", label: { id: "2-5 berkas", en: "2-5 files" } },
    { from: "pindai", to: "hasil" },
    { from: "banding", to: "hasil" },
  ],
};

/* -------------------------------------------------------------------------- */
/* 3. Arsitektur dan alur data                                                */
/* -------------------------------------------------------------------------- */

const architectureFlow: Diagram = {
  id: "arsitektur-dan-alur-data",
  title: {
    id: "Arsitektur dan alur data",
    en: "Architecture and data flow",
  },
  description: {
    id: "Perhatikan dua jalur yang sengaja dipisah: penyusunan CV melewati server dan tersimpan permanen, sedangkan pembandingan berkas berhenti di peramban dan tidak pernah menyentuh basis data.",
    en: "Note the two deliberately separate paths: building a CV goes through the server and is stored permanently, while comparing files stops in the browser and never touches the database.",
  },
  nodes: [
    {
      id: "peramban",
      kind: "browser",
      lane: 0,
      label: { id: "Peramban pengguna", en: "The user's browser" },
      note: {
        id: "Editor, pratinjau, mesin penilaian, dan pembaca berkas CV.",
        en: "Editor, preview, ATS scoring engine, and the CV file reader.",
      },
    },
    {
      id: "banding",
      kind: "browser",
      lane: -1,
      label: { id: "Pembanding CV - berhenti di sini", en: "CV comparison - stops here" },
      note: {
        id: "Berkas tidak pernah meninggalkan perangkat pengguna.",
        en: "Files never leave the user's device.",
      },
    },
    {
      id: "server",
      kind: "process",
      lane: 0,
      label: { id: "Server Next.js", en: "Next.js server" },
      note: {
        id: "Merender halaman dan melayani API. Berjalan di Vercel.",
        en: "Renders pages and serves the API. Runs on Vercel.",
      },
    },
    {
      id: "auth",
      kind: "process",
      lane: 1,
      label: { id: "Auth.js - sesi dan Google OAuth", en: "Auth.js - sessions and Google OAuth" },
    },
    {
      id: "guard",
      kind: "decision",
      lane: 0,
      label: { id: "Data ini milik pengguna tersebut?", en: "Does this data belong to that user?" },
      note: {
        id: "Bukan miliknya menghasilkan 404, bukan 403 - agar keberadaan sebuah id pun tidak bocor.",
        en: "Not theirs returns 404, not 403 - so even the existence of an id stays private.",
      },
    },
    {
      id: "prisma",
      kind: "process",
      lane: 0,
      label: { id: "Prisma ORM", en: "Prisma ORM" },
    },
    {
      id: "db",
      kind: "data",
      lane: 0,
      label: { id: "PostgreSQL (Neon)", en: "PostgreSQL (Neon)" },
      note: {
        id: "16 tabel. Seluruh tabel anak terhapus bersama CV induknya.",
        en: "16 tables. Every child table is deleted along with its parent CV.",
      },
    },
    {
      id: "cetak",
      kind: "process",
      lane: 1,
      label: { id: "Halaman cetak - PDF", en: "Print page - PDF" },
      note: {
        id: "HTML biasa, sehingga teks PDF tetap dapat diseleksi dan diurai.",
        en: "Plain HTML, so the PDF text stays selectable and parseable.",
      },
    },
    {
      id: "unduh",
      kind: "end",
      lane: 0,
      label: { id: "Berkas terunduh", en: "Downloaded file" },
    },
  ],
  edges: [
    { from: "peramban", to: "banding", label: { id: "unggah berkas", en: "file upload" } },
    { from: "peramban", to: "server", label: { id: "HTTPS", en: "HTTPS" } },
    { from: "server", to: "auth" },
    { from: "server", to: "guard" },
    { from: "guard", to: "prisma", label: { id: "ya", en: "yes" } },
    { from: "prisma", to: "db" },
    { from: "server", to: "cetak" },
    { from: "db", to: "unduh" },
    { from: "cetak", to: "unduh" },
  ],
};

/* -------------------------------------------------------------------------- */
/* 4. Workflow pengembangan dan rilis                                         */
/* -------------------------------------------------------------------------- */

const releaseFlow: Diagram = {
  id: "workflow-pengembangan",
  title: {
    id: "Workflow pengembangan dan rilis",
    en: "Development and release workflow",
  },
  description: {
    id: "Gerbang kualitas dijalankan di komputer sendiri sebelum kode dikirim, bukan hanya mengandalkan hasil build di server - kegagalan yang tertangkap lebih awal jauh lebih murah diperbaiki.",
    en: "The quality gate runs locally before anything is pushed rather than relying on the server build alone - a failure caught early is far cheaper to fix.",
  },
  nodes: [
    {
      id: "ubah",
      kind: "start",
      lane: 0,
      label: { id: "Mengubah kode", en: "Change the code" },
    },
    {
      id: "skema",
      kind: "decision",
      lane: 0,
      label: { id: "Skema basis data ikut berubah?", en: "Did the database schema change?" },
    },
    {
      id: "migrasi",
      kind: "process",
      lane: -1,
      label: { id: "Tulis berkas migrasi secara manual", en: "Write the migration file by hand" },
      note: {
        id: "prisma migrate dev tidak dipakai di basis data lokal - perintah itu mengosongkan isinya.",
        en: "prisma migrate dev is never used on the local database - it wipes the contents.",
      },
    },
    {
      id: "gerbang",
      kind: "process",
      lane: 0,
      label: { id: "typecheck, lint, build", en: "typecheck, lint, build" },
    },
    {
      id: "lulus",
      kind: "decision",
      lane: 0,
      label: { id: "Ketiganya lulus?", en: "All three pass?" },
    },
    {
      id: "commit",
      kind: "process",
      lane: 0,
      label: { id: "Commit dan push ke branch main", en: "Commit and push to main" },
    },
    {
      id: "vercel",
      kind: "process",
      lane: 0,
      label: { id: "Vercel membangun ulang", en: "Vercel rebuilds" },
      note: {
        id: "prisma generate, prisma migrate deploy, lalu next build.",
        en: "prisma generate, prisma migrate deploy, then next build.",
      },
    },
    {
      id: "tayang",
      kind: "end",
      lane: 0,
      label: { id: "Tayang di production", en: "Live in production" },
    },
  ],
  edges: [
    { from: "ubah", to: "skema" },
    { from: "skema", to: "migrasi", label: { id: "ya", en: "yes" } },
    { from: "migrasi", to: "gerbang" },
    { from: "skema", to: "gerbang", label: { id: "tidak", en: "no" } },
    { from: "gerbang", to: "lulus" },
    { from: "lulus", to: "ubah", label: { id: "tidak - perbaiki", en: "no - fix it" }, back: true },
    { from: "lulus", to: "commit", label: { id: "ya", en: "yes" } },
    { from: "commit", to: "vercel" },
    { from: "vercel", to: "tayang" },
  ],
};

export const DIAGRAMS: Diagram[] = [
  buildFlow,
  compareFlow,
  architectureFlow,
  releaseFlow,
];

export function diagramById(id: string): Diagram | undefined {
  return DIAGRAMS.find((diagram) => diagram.id === id);
}

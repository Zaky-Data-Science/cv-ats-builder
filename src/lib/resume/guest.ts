"use client";

import { emptyResume } from "./factory";
import { resumeDataSchema } from "./schema";
import type { ResumeData } from "./types";

/**
 * ============================================================================
 *  CV TANPA AKUN
 * ============================================================================
 *
 * Menyimpan satu CV di peramban pengguna, tanpa akun dan tanpa menyentuh
 * server sama sekali.
 *
 * Alasannya sederhana: menuntut pendaftaran sebelum orang sempat melihat
 * apakah aplikasinya berguna adalah penghalang yang paling sering membuat
 * orang pergi. Dengan jalur ini, siapa pun dapat menyusun CV utuh, melihat
 * skornya, dan mengunduh PDF-nya tanpa memberikan alamat surel apa pun.
 *
 * Yang tidak diperolehnya jelas dan disampaikan terbuka di antarmuka: datanya
 * hanya ada di peramban itu. Berpindah perangkat, membersihkan data situs,
 * atau membuka lewat mode penyamaran berarti CV-nya hilang. Karena itu
 * tersedia tombol memindahkannya ke akun kapan saja.
 *
 * Isinya tetap divalidasi dengan skema yang sama seperti data dari server -
 * data di localStorage dapat disunting siapa saja lewat konsol peramban, dan
 * berkas versi lama bisa saja kehilangan field yang kini ada.
 */

const STORAGE_KEY = "atscv-cv-tamu";

/** Kunci titipan saat pengguna memilih memindahkan CV-nya ke akun. */
export const PENDING_IMPORT_KEY = "atscv-cv-tamu-pindah";

/** Id tetap untuk CV tamu. Tidak pernah dikirim ke server. */
export const GUEST_ID = "tamu";

function read(key: string): ResumeData | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;

    // Skema yang sama dengan yang dipakai server. Isian yang hilang diisi
    // nilai bawaannya, sehingga CV yang disimpan versi aplikasi lama tetap
    // terbuka setelah field baru ditambahkan.
    const parsed = resumeDataSchema.safeParse(JSON.parse(raw));
    if (!parsed.success) return null;
    return { ...parsed.data, id: GUEST_ID } as ResumeData;
  } catch {
    // Penyimpanan diblokir, isinya bukan JSON, atau kuota habis. Ketiganya
    // berujung sama: perlakukan seolah belum ada CV tersimpan.
    return null;
  }
}

export function loadGuestResume(): ResumeData {
  return read(STORAGE_KEY) ?? { ...emptyResume(), id: GUEST_ID };
}

export function saveGuestResume(data: ResumeData): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}

export function clearGuestResume(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Tidak ada yang perlu dilakukan bila penyimpanan diblokir.
  }
}

/** Menitipkan CV agar dapat diimpor ke akun setelah pengguna masuk. */
export function stashForImport(data: ResumeData): boolean {
  try {
    localStorage.setItem(PENDING_IMPORT_KEY, JSON.stringify(data));
    stashCache = true;
    stashKnown = true;
    for (const listener of stashListeners) listener();
    return true;
  } catch {
    return false;
  }
}

export function takeStashedImport(): ResumeData | null {
  const data = read(PENDING_IMPORT_KEY);
  return data;
}

export function dropStashedImport(): void {
  try {
    localStorage.removeItem(PENDING_IMPORT_KEY);
  } catch {
    // Sama seperti di atas.
  }
  stashCache = false;
  stashKnown = true;
  for (const listener of stashListeners) listener();
}

/** Apakah ada CV tamu yang menunggu dipindahkan ke akun. */
export function hasStashedImport(): boolean {
  try {
    return localStorage.getItem(PENDING_IMPORT_KEY) !== null;
  } catch {
    return false;
  }
}

/* -------------------------------------------------------------------------- */
/* Pembacaan awal untuk React                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Store kecil di luar React untuk membaca CV tamu.
 *
 * Isinya hanya ada di peramban, sehingga server tidak dapat merendernya. Yang
 * dikembalikan di server adalah null, dan komponen menampilkan kerangka
 * pemuatan sampai nilai sebenarnya tersedia. useSyncExternalStore dipakai agar
 * peralihan itu tidak berupa setState di dalam effect - pola yang memicu
 * render berantai dan ditolak aturan lint di project ini.
 */
let cached: ResumeData | null = null;
const listeners = new Set<() => void>();

export function subscribeGuestResume(callback: () => void): () => void {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

export function getGuestSnapshot(): ResumeData | null {
  if (cached === null) cached = loadGuestResume();
  return cached;
}

export function getGuestServerSnapshot(): ResumeData | null {
  return null;
}

/** Menyimpan sekaligus memperbarui nilai yang dibaca komponen. */
export function commitGuestResume(data: ResumeData): boolean {
  cached = data;
  const ok = saveGuestResume(data);
  for (const listener of listeners) listener();
  return ok;
}


/* -------------------------------------------------------------------------- */
/* Adakah titipan yang menunggu                                               */
/* -------------------------------------------------------------------------- */

/**
 * Store terpisah untuk keberadaan titipan.
 *
 * Yang dibaca hanya "ada atau tidak", bukan isinya - kartu tawaran di
 * dashboard tidak perlu memuat seluruh CV ke memori hanya untuk memutuskan
 * apakah dirinya perlu tampil.
 */
let stashCache = false;
let stashKnown = false;
const stashListeners = new Set<() => void>();

export function subscribeStash(callback: () => void): () => void {
  stashListeners.add(callback);
  return () => {
    stashListeners.delete(callback);
  };
}

export function getStashSnapshot(): boolean {
  if (!stashKnown) {
    stashCache = hasStashedImport();
    stashKnown = true;
  }
  return stashCache;
}

export function getStashServerSnapshot(): boolean {
  return false;
}

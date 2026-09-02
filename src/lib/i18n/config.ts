/**
 * Konfigurasi dwibahasa.
 *
 * Pilihan bahasa disimpan di cookie, bukan di localStorage. Alasannya:
 * sebagian besar halaman aplikasi ini dirender di server, sehingga server
 * harus sudah tahu bahasanya sebelum HTML dikirim. Kalau memakai
 * localStorage, halaman akan selalu terkirim dalam bahasa Indonesia lebih
 * dulu lalu berkedip berganti bahasa di peramban - dan mesin pencari akan
 * selamanya hanya melihat versi Indonesianya.
 *
 * Perhatikan bahwa ini adalah bahasa ANTARMUKA. Bahasa isi CV disimpan
 * terpisah pada setiap CV (kolom `language`), karena orang yang sama bisa
 * saja memakai antarmuka bahasa Indonesia untuk menyusun CV berbahasa
 * Inggris.
 */

export type Locale = "id" | "en";

export const LOCALES: readonly Locale[] = ["id", "en"] as const;

export const DEFAULT_LOCALE: Locale = "id";

export const LOCALE_COOKIE = "atscv-locale";

/** Nama bahasa ditulis dalam bahasanya sendiri - konvensi pemilih bahasa. */
export const LOCALE_LABEL: Record<Locale, string> = {
  id: "Indonesia",
  en: "English",
};

export const LOCALE_SHORT: Record<Locale, string> = {
  id: "ID",
  en: "EN",
};

/** Atribut lang pada <html>, dipakai pembaca layar dan mesin pencari. */
export const LOCALE_HTML_LANG: Record<Locale, string> = {
  id: "id",
  en: "en",
};

export function normalizeLocale(value: string | undefined | null): Locale {
  return value === "en" ? "en" : DEFAULT_LOCALE;
}

/**
 * Menuliskan pilihan bahasa ke cookie.
 *
 * Sengaja berupa fungsi biasa di luar komponen. Penulisan ke `document`
 * dari dalam badan komponen ditolak aturan lint React Compiler - dan
 * memang seharusnya, karena itu efek samping terhadap sesuatu di luar
 * React. Di sini tempatnya yang benar.
 *
 * Setahun cukup lama untuk terasa permanen, dan SameSite=Lax menahan cookie
 * ini ikut terkirim pada permintaan lintas situs.
 */
export function persistLocale(next: Locale): void {
  document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
}

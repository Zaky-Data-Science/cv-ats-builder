import { cookies } from "next/headers";
import { getDictionary, LOCALE_COOKIE, normalizeLocale } from "./index";
import type { Dictionary, Locale } from "./index";

/**
 * Membaca bahasa antarmuka dari cookie permintaan.
 *
 * Konsekuensi yang disadari: memanggil cookies() membuat halaman dirender
 * dinamis, bukan statis. Itu memang harga yang dibayar agar HTML pertama
 * yang diterima pengguna sudah berbahasa yang ia pilih - tanpa kedipan
 * pergantian teks, dan tanpa halaman berbahasa Inggris yang tidak pernah
 * terlihat mesin pencari.
 */
export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  return normalizeLocale(store.get(LOCALE_COOKIE)?.value);
}

export async function getT(): Promise<{ locale: Locale; t: Dictionary }> {
  const locale = await getLocale();
  return { locale, t: getDictionary(locale) };
}

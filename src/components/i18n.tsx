"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Check, Globe } from "lucide-react";
import {
  LOCALES,
  LOCALE_LABEL,
  LOCALE_SHORT,
  persistLocale,
  type Dictionary,
  type Locale,
} from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * Penyalur kamus ke komponen klien.
 *
 * Kamus dikirim sebagai prop dari layout server, bukan diimpor langsung di
 * sisi klien. Bedanya nyata: dengan cara ini hanya satu bahasa yang ikut
 * terkirim ke peramban, sementara mengimpor keduanya akan memaksa setiap
 * pengunjung mengunduh teks bahasa yang tidak ia pakai.
 */

interface I18nValue {
  locale: Locale;
  t: Dictionary;
}

const I18nContext = React.createContext<I18nValue | null>(null);

export function I18nProvider({
  locale,
  dictionary,
  children,
}: {
  locale: Locale;
  dictionary: Dictionary;
  children: React.ReactNode;
}) {
  const value = React.useMemo(
    () => ({ locale, t: dictionary }),
    [locale, dictionary],
  );
  return <I18nContext value={value}>{children}</I18nContext>;
}

export function useI18n(): I18nValue {
  const value = React.useContext(I18nContext);
  if (!value) {
    throw new Error("useI18n harus dipakai di dalam I18nProvider");
  }
  return value;
}

/**
 * Menyimpan pilihan bahasa lalu meminta server merender ulang.
 *
 * router.refresh() dipilih daripada memuat ulang seluruh halaman supaya
 * isian form yang sedang diketik pengguna tidak hilang saat ia berganti
 * bahasa di tengah pengisian CV.
 */
export function LanguageToggle({ className }: { className?: string }) {
  const { locale, t } = useI18n();
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  const choose = (next: Locale) => {
    setOpen(false);
    if (next === locale) return;
    persistLocale(next);
    router.refresh();
  };

  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={t.prefs.languageToggleLabel}
        title={t.prefs.language}
        className="inline-flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-xs font-semibold text-ink-600 transition-colors hover:bg-ink-100 hover:text-ink-900"
      >
        <Globe size={15} aria-hidden />
        {LOCALE_SHORT[locale]}
      </button>

      {open && (
        <>
          {/* Lapisan tak terlihat yang menutup menu saat pengguna menekan di
              luar - lebih andal daripada menebak lewat event blur. */}
          <button
            type="button"
            aria-hidden
            tabIndex={-1}
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setOpen(false)}
          />
          <ul
            role="listbox"
            className="absolute right-0 z-50 mt-1 w-40 overflow-hidden rounded-xl border border-ink-200 bg-white py-1 shadow-lg"
          >
            {LOCALES.map((item) => (
              <li key={item}>
                <button
                  type="button"
                  role="option"
                  aria-selected={item === locale}
                  onClick={() => choose(item)}
                  className="flex w-full items-center justify-between px-3 py-2 text-left text-xs text-ink-700 hover:bg-ink-50"
                >
                  {LOCALE_LABEL[item]}
                  {item === locale && <Check size={13} aria-hidden />}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

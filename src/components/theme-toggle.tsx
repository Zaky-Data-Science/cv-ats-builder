"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useI18n } from "@/components/i18n";
import {
  getThemeServerSnapshot,
  getThemeSnapshot,
  subscribeTheme,
  toggleTheme,
} from "@/lib/theme";
import { cn } from "@/lib/utils";

/**
 * Sakelar mode tampilan - satu tombol, sekali tekan langsung berganti.
 *
 * Sebelumnya berupa menu tiga pilihan (terang, gelap, ikut sistem). Menu itu
 * dihapus karena menuntut dua tindakan untuk sesuatu yang hanya punya dua
 * keadaan: buka menu, lalu pilih. Setelan sistem tetap dihormati sebagai
 * keadaan awal - lihat komentar di lib/theme.ts - tetapi tidak lagi menjadi
 * pilihan ketiga yang harus dipahami pengguna lebih dulu.
 *
 * Kedua ikon dirender bersamaan lalu disilangkan animasinya, bukan
 * ditukar-tukar. Ikon yang muncul-hilang membuat lebar tombol berkedip;
 * ikon yang berputar dan memudar terasa seperti satu benda yang berbalik.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { t } = useI18n();

  const theme = React.useSyncExternalStore(
    subscribeTheme,
    getThemeSnapshot,
    getThemeServerSnapshot,
  );

  const dark = theme === "dark";
  const label = dark ? t.prefs.themeToLight : t.prefs.themeToDark;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={label}
      aria-label={label}
      // Tombolnya adalah sakelar dua keadaan, jadi keadaannya disampaikan
      // sebagai switch - pembaca layar membacakannya "aktif/nonaktif",
      // bukan sekadar sebuah tombol tanpa keterangan.
      role="switch"
      aria-checked={dark}
      className={cn(
        "relative grid h-9 w-9 place-items-center overflow-hidden rounded-lg text-ink-600 transition-colors hover:bg-ink-100 hover:text-ink-900",
        className,
      )}
    >
      <Sun
        size={16}
        aria-hidden
        className={cn(
          "absolute transition-all duration-300",
          dark ? "scale-50 rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100",
        )}
      />
      <Moon
        size={16}
        aria-hidden
        className={cn(
          "absolute transition-all duration-300",
          dark ? "scale-100 rotate-0 opacity-100" : "scale-50 -rotate-90 opacity-0",
        )}
      />
    </button>
  );
}

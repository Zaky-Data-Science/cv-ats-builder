"use client";

import Link from "next/link";
import { LogIn } from "lucide-react";
import { BrandMark } from "@/components/BrandMark";
import { HeaderBack } from "@/components/HeaderBack";
import { LanguageToggle, useI18n } from "@/components/i18n";
import { Laci, TombolLaci, useLaci } from "@/components/nav-drawer";
import { ThemeToggle } from "@/components/theme-toggle";
import { buttonClass } from "@/components/ui";
import { SITE } from "@/lib/site";

/**
 * Bilah atas halaman "Coba tanpa akun".
 *
 * ---------------------------------------------------------------------------
 * Mengapa ia ada, dan mengapa bukan pola ketiga
 * ---------------------------------------------------------------------------
 *
 * Bilah ini semula ditulis langsung di dalam `page.tsx` sebagai barisan datar,
 * dan ia satu-satunya bilah di aplikasi yang tidak memakai laci. Akibatnya di
 * layar sempit nama aplikasi dan seluruh label tombolnya lenyap dengan
 * `hidden sm:inline` tanpa tempat lain untuk dijangkau - pengunjung yang sudah
 * masuk hanya melihat satu ikon panah tanpa keterangan apa pun. Itu melanggar
 * dua aturan sekaligus di `docs/panduan-responsif.md`: aturan 5 (menyembunyikan
 * bukan menyusun ulang) dan aturan 6 (satu pola laci, dipakai ulang).
 *
 * Yang dipakai di sini karena itu `components/nav-drawer.tsx` yang sama dengan
 * bilah publik dan bilah aplikasi - bukan pola baru. Isinya saja yang berbeda,
 * dan memang harus berbeda: halaman ini dibuka orang yang belum tentu punya
 * akun, jadi yang ditawarkan bukan navigasi situs melainkan dua pintu masuk.
 *
 * ---------------------------------------------------------------------------
 * Tingginya tidak boleh berubah
 * ---------------------------------------------------------------------------
 *
 * `h-14` di sini bukan pilihan rupa. Penyunting di bawahnya mengunci tingginya
 * ke `calc(100dvh - 3.5rem)`, dan 3,5rem itu adalah tinggi bilah ini. Menambah
 * `sm:h-16` seperti bilah publik akan menyisakan dua rem penyunting di bawah
 * layar yang tidak pernah dapat dijangkau.
 */
export function GuestHeader({ signedIn }: { signedIn: boolean }) {
  const { t } = useI18n();
  const laci = useLaci();

  /*
    Dua pilihan selalu berdampingan, bukan satu tombol "Masuk".

    Halaman ini justru dibuka orang yang belum tentu punya akun - itulah
    gunanya jalur tanpa akun. Menawarkan "Masuk" saja membuat orang yang belum
    pernah mendaftar merasa jalur itu bukan untuknya, padahal di sanalah
    CV-nya bisa tersimpan permanen.
  */
  const pintuMasuk = signedIn ? (
    <Link
      href="/dashboard"
      onClick={laci.tutup}
      className={buttonClass({
        variant: "outline",
        size: "sm",
        className: "press",
      })}
    >
      <LogIn size={14} />
      {t.nav.dashboard}
    </Link>
  ) : (
    <>
      <Link
        href="/login"
        onClick={laci.tutup}
        className={buttonClass({
          variant: "ghost",
          size: "sm",
          className: "press",
        })}
      >
        <LogIn size={14} />
        {t.nav.login}
      </Link>
      <Link
        href="/register"
        onClick={laci.tutup}
        className={buttonClass({ size: "sm", className: "press" })}
      >
        {t.nav.register}
      </Link>
    </>
  );

  return (
    <header className="sticky top-0 z-30 shrink-0 border-b border-ink-200 bg-white">
      <div className="wadah flex h-14 items-center gap-2">
        <div className="flex min-w-0 flex-1 items-center gap-1.5">
          <HeaderBack href="/" />
          <Link
            href="/"
            className="tap-target flex min-w-0 items-center gap-2"
            aria-label={`${SITE.name} - ${t.nav.homeAria}`}
          >
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-ink-900 text-white">
              <BrandMark className="h-4 w-4" />
            </span>
            <span className="truncate text-sm font-semibold text-ink-900">
              {SITE.name}
            </span>
          </Link>
        </div>

        {/* Kendali layar lebar */}
        <div className="hidden items-center gap-1.5 lg:flex">
          <LanguageToggle />
          <ThemeToggle />
          {pintuMasuk}
        </div>

        {/* Sakelar tema tetap di bilah pada kedua jalur - alasannya sama
            dengan di kedua bilah lain: ia diketuk begitu layarnya terasa
            terlalu terang, dan yang menuntut membuka laci lebih dulu akan
            disimpulkan tidak ada. */}
        <div className="flex items-center gap-1 lg:hidden">
          <ThemeToggle />
          <TombolLaci
            laci={laci}
            idLaci="laci-tamu"
            labelBuka={t.nav.openMenu}
            labelTutup={t.nav.closeMenu}
          />
        </div>
      </div>

      <Laci
        id="laci-tamu"
        judul={SITE.name}
        labelTutup={t.nav.closeMenu}
        laci={laci}
        className="lg:hidden"
        kaki={<div className="flex flex-col gap-2">{pintuMasuk}</div>}
      >
        {/*
          Peringatan "CV ini cuma tersimpan di browser ini" sengaja TIDAK
          diulang di sini. Ia sudah tercetak permanen di spanduk tepat di bawah
          bilah ini - dan memang dibuat tidak dapat ditutup justru supaya
          selalu terlihat. Mengulangnya di dalam laci hanya mendorong
          navigasinya turun, dan paragraf yang sama dua kali dalam satu layar
          membuat yang kedua berhenti dibaca.
        */}
        <nav aria-label={t.nav.mobileNav}>
          <ul className="space-y-1">
            <li>
              <Link
                href="/"
                onClick={laci.tutup}
                className="flex min-h-11 items-center rounded-xl px-4 text-[15px] text-ink-700 transition-colors hover:bg-ink-50"
              >
                {t.nav.home}
              </Link>
            </li>
            <li>
              <Link
                href="/bandingkan"
                onClick={laci.tutup}
                className="flex min-h-11 items-center rounded-xl px-4 text-[15px] text-ink-700 transition-colors hover:bg-ink-50"
              >
                {t.nav.compare}
              </Link>
            </li>
            <li>
              <Link
                href="/panduan"
                onClick={laci.tutup}
                className="flex min-h-11 items-center rounded-xl px-4 text-[15px] text-ink-700 transition-colors hover:bg-ink-50"
              >
                {t.nav.guide}
              </Link>
            </li>
          </ul>
        </nav>

        <div className="mt-4 border-t border-ink-200 pt-4">
          <p className="px-4 pb-2 text-[11px] font-semibold tracking-wide text-ink-500 uppercase">
            {t.nav.settingsGroup}
          </p>
          <div className="flex items-center gap-2 px-2">
            <LanguageToggle />
          </div>
        </div>
      </Laci>
    </header>
  );
}

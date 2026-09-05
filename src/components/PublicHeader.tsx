"use client";

import * as React from "react";
import Link from "next/link";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { HeaderBack } from "@/components/HeaderBack";
import { BrandMark } from "@/components/BrandMark";
import { useI18n, LanguageToggle } from "@/components/i18n";
import { ThemeToggle } from "@/components/theme-toggle";
import { buttonClass } from "@/components/ui";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * Bilah navigasi untuk halaman publik.
 *
 * ---------------------------------------------------------------------------
 * Mengapa bentuknya dibedakan tegas antara layar sempit dan lebar
 * ---------------------------------------------------------------------------
 *
 * Sebelumnya seluruh kendali - bahasa, tema, masuk, daftar, dan tombol menu -
 * berdiri berdampingan di satu baris pada setiap ukuran layar. Barisan itu
 * lebarnya tetap: **224 piksel saat pengguna sudah masuk, lebih dari 300 saat
 * belum**, dan tidak pernah menyusut. Pada layar 360 piksel dokumennya karena
 * itu menjadi lebih lebar daripada layarnya sendiri - dan itulah, bukan
 * "tata letak desktop yang diperkecil", yang membuat halaman tampak hanya
 * memakai sebagian lebar layar dengan pita kosong di sisi kanan.
 *
 * Diukur sebelum perbaikan: pada 320 piksel dokumennya 398 piksel (+80),
 * pada 360 piksel +40, pada 375 piksel +24. Mulai 768 piksel tidak ada
 * kelebihan sama sekali - karena itu yang diubah hanya jalur di bawahnya, dan
 * tampilan lebar dibiarkan persis seperti sebelumnya.
 *
 * Di layar sempit bilahnya karena itu hanya memuat identitas dan satu tombol
 * menu. Seluruh kendali lain pindah ke dalam laci - bukan disembunyikan,
 * melainkan diberi tempat yang cukup untuk disentuh jari.
 *
 * ---------------------------------------------------------------------------
 * Mengapa ambangnya 1024, bukan 768
 * ---------------------------------------------------------------------------
 *
 * Mula-mula ambangnya 768 - angka yang terlihat masuk akal, sebab di situlah
 * luberan mendatar berhenti terjadi. Tetapi "tidak meluber" ternyata bukan
 * "muat": diuji tepat pada 768 piksel, navigasi lengkapnya memang tidak
 * keluar layar, melainkan **memampatkan diri** - nama aplikasi terpangkas
 * menjadi "C...", dan "Bandingkan CV" pecah menjadi dua baris di dalam
 * bilah setinggi 64 piksel.
 *
 * Kedua gejala itu tidak tertangkap pengukuran lebar dokumen, hanya oleh
 * melihat gambarnya. Ambangnya karena itu digeser ke 1024: tablet ikut
 * memakai laci, dan navigasi lengkap baru muncul ketika ruangnya memang ada.
 */
export function PublicHeader({ signedIn }: { signedIn: boolean }) {
  const pathname = usePathname();
  const { t } = useI18n();

  const nav = [
    { href: "/", label: t.nav.home },
    { href: "/bandingkan", label: t.nav.compare },
    { href: "/panduan", label: t.nav.guide },
    { href: "/tentang", label: t.nav.about },
    { href: "/alur", label: t.nav.flowNav },
  ];

  // Yang disimpan bukan "menu terbuka", melainkan "menu dibuka di halaman
  // mana". Dengan begitu berpindah halaman otomatis menutup menu tanpa
  // memerlukan effect yang memanggil setState - pola yang memicu render
  // berantai dan mudah terlewat saat halaman baru ditambahkan.
  const [openedAt, setOpenedAt] = React.useState<string | null>(null);
  const open = openedAt === pathname;

  const tutup = React.useCallback(() => setOpenedAt(null), []);

  /*
    Selama laci terbuka: Escape menutupnya, dan halaman di belakangnya tidak
    ikut tergulir.

    Penguncian gulir memakai `overflow` pada <html>, bukan `position: fixed`
    pada <body>. Cara kedua itu memang lazim, tetapi ia membuang posisi gulir
    pengguna - laci ditutup dan halaman melompat kembali ke atas.
  */
  React.useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") tutup();
    };
    document.addEventListener("keydown", onKey);

    const akar = document.documentElement;
    const sebelumnya = akar.style.overflow;
    akar.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      akar.style.overflow = sebelumnya;
    };
  }, [open, tutup]);

  return (
    <header className="sticky top-0 z-40 border-b border-ink-200 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:h-16 md:px-8 lg:px-5">
        {/* Identitas - satu-satunya yang selalu tampil di kedua jalur. */}
        <div className="flex min-w-0 items-center gap-1.5">
          <HeaderBack href="/" />
          <Link
            href="/"
            className="flex min-w-0 items-center gap-2"
            aria-label={`${SITE.name} - ${t.nav.homeAria}`}
          >
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-ink-900 text-white">
              <BrandMark className="h-[18px] w-[18px]" />
            </span>
            <span className="truncate text-sm font-semibold text-ink-900">
              {SITE.name}
            </span>
          </Link>
        </div>

        {/* Navigasi layar lebar */}
        <nav
          className="hidden items-center gap-1 lg:flex"
          aria-label={t.nav.mainNav}
        >
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-lg px-3 py-2 text-sm transition-colors",
                pathname === item.href
                  ? "font-semibold text-ink-900"
                  : "text-ink-600 hover:bg-ink-50 hover:text-ink-900",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/*
          Kendali layar lebar. Di bawah 768 piksel seluruhnya pindah ke dalam
          laci - memaksakannya tetap di bilah adalah persis yang dulu membuat
          dokumen lebih lebar daripada layarnya.
        */}
        <div className="hidden items-center gap-2 lg:flex">
          <LanguageToggle />
          <ThemeToggle />

          {signedIn ? (
            <Link
              href="/dashboard"
              className={buttonClass({ size: "sm", className: "press" })}
            >
              {t.nav.dashboard}
            </Link>
          ) : (
            <>
              {/*
                Dulu tombol ini disembunyikan di layar sempit dan hanya muncul
                di dalam menu. Akibatnya pengunjung ponsel cuma melihat
                "Daftar Gratis", dan yang sudah punya akun mengira harus
                mendaftar ulang. Kedua pilihan kini selalu berdampingan - di
                bilah pada layar lebar, dan di dalam laci pada layar sempit.
              */}
              <Link
                href="/login"
                className={buttonClass({ variant: "ghost", size: "sm" })}
              >
                {t.nav.login}
              </Link>
              <Link
                href="/register"
                className={buttonClass({ size: "sm", className: "press" })}
              >
                {t.nav.register}
              </Link>
            </>
          )}
        </div>

        {/*
          Sakelar tema tetap di bilah, juga di layar sempit.

          Ia sempat ikut pindah ke dalam laci bersama seluruh kendali lain pada
          sesi 8 - dan itu keliru untuk yang satu ini. Bahasa dan tombol masuk
          adalah hal yang dicari saat dibutuhkan; mode gelap adalah hal yang
          diketuk begitu layarnya terasa terlalu terang, dan yang menuntut dua
          ketukan serta satu gulir untuk sampai ke sana akan disimpulkan tidak
          ada. Dilaporkan begitu: "di alamat ini gk ada temanya".

          Yang dulu membuat dokumen lebih lebar daripada layarnya bukan tombol
          semacam ini melainkan satu barisan kendali berlebar tetap 224 piksel.
          Satu tombol ikon selebar 36 piksel diukur tidak menyentuh masalah itu
          bahkan pada layar 320.
        */}
        <div className="lg:hidden">
          <ThemeToggle />
        </div>

        {/* Tombol menu - sasaran sentuhnya 44 piksel, bukan sebesar ikonnya. */}
        <button
          type="button"
          onClick={() => setOpenedAt(open ? null : pathname)}
          aria-expanded={open}
          aria-controls="menu-ponsel"
          aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
          className="-mr-2 grid h-11 w-11 shrink-0 place-items-center rounded-lg text-ink-700 transition-colors hover:bg-ink-100 lg:hidden"
        >
          <Menu size={20} aria-hidden />
        </button>
      </div>

      {open && <MobileDrawer nav={nav} signedIn={signedIn} onClose={tutup} />}
    </header>
  );
}

/* -------------------------------------------------------------------------- */
/* Laci navigasi layar sempit                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Laci yang menutupi layar, bukan panel yang mendorong isi halaman.
 *
 * Panel yang menggeser halaman ke samping menambah lebar dokumen - persoalan
 * yang sama dengan yang baru saja diperbaiki. Laci ini `fixed`, sehingga tidak
 * pernah ikut menghitung lebar dokumen.
 *
 * Digambar lewat portal ke <body>, bukan sebagai anak <header>. Bilah atas
 * memakai `backdrop-blur`, dan penyaring latar menjadikan elemennya blok
 * penampung bagi keturunan `position: fixed` - laci yang berada di dalamnya
 * karena itu terpotong setinggi bilahnya sendiri, bukan setinggi layar.
 * Gejalanya menipu: `inset-0` terlihat benar di kode, tetapi "nol" yang
 * dimaksud peramban adalah nol terhadap bilah.
 */
function MobileDrawer({
  nav,
  signedIn,
  onClose,
}: {
  nav: { href: string; label: string }[];
  signedIn: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const { t } = useI18n();

  return createPortal(
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Lapisan gelap: menutup laci saat disentuh, dan meredam isi di
          belakangnya supaya jelas mana yang sedang aktif. */}
      <button
        type="button"
        aria-label={t.nav.closeMenu}
        onClick={onClose}
        className="drawer-overlay absolute inset-0 bg-ink-900/50 backdrop-blur-[2px]"
      />

      <div
        id="menu-ponsel"
        role="dialog"
        aria-modal="true"
        aria-label={t.nav.mobileNav}
        className="drawer-panel absolute inset-y-0 right-0 flex w-[min(21rem,86vw)] flex-col border-l border-ink-200 bg-white shadow-2xl"
      >
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-ink-200 pr-2 pl-5">
          <span className="text-sm font-semibold text-ink-900">{SITE.name}</span>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.nav.closeMenu}
            className="grid h-11 w-11 place-items-center rounded-lg text-ink-600 transition-colors hover:bg-ink-100"
          >
            <X size={20} aria-hidden />
          </button>
        </div>

        <nav
          className="min-h-0 flex-1 overflow-y-auto p-3"
          aria-label={t.nav.mobileNav}
        >
          <ul className="space-y-1">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className={cn(
                    "flex min-h-11 items-center rounded-xl px-4 text-[15px] transition-colors",
                    pathname === item.href
                      ? "bg-ink-100 font-semibold text-ink-900"
                      : "text-ink-700 hover:bg-ink-50",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Bahasa: setelan, bukan tujuan. Dipisahkan garis supaya tidak
              terbaca sebagai halaman keenam.

              Sakelar temanya tidak ada di sini lagi - ia pindah ke bilah atas,
              tempat ia dapat dijangkau tanpa membuka laci sama sekali. */}
          <div className="mt-4 border-t border-ink-200 pt-4">
            <p className="px-4 pb-2 text-[11px] font-semibold tracking-wide text-ink-500 uppercase">
              {t.nav.settingsGroup}
            </p>
            <div className="flex items-center gap-2 px-2">
              <LanguageToggle />
            </div>
          </div>
        </nav>

        <div className="shrink-0 space-y-2 border-t border-ink-200 p-4">
          {signedIn ? (
            <Link
              href="/dashboard"
              onClick={onClose}
              className={buttonClass({ className: "press w-full flex" })}
            >
              {t.nav.dashboard}
            </Link>
          ) : (
            <>
              <Link
                href="/register"
                onClick={onClose}
                className={buttonClass({ className: "press w-full flex" })}
              >
                {t.nav.register}
              </Link>
              <Link
                href="/login"
                onClick={onClose}
                className={buttonClass({
                  variant: "outline",
                  className: "w-full flex",
                })}
              >
                {t.nav.login}
              </Link>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}

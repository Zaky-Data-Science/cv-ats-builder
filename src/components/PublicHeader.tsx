"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Laci,
  TombolLaci,
  useLaci,
  type KeadaanLaci,
} from "@/components/nav-drawer";
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
 *
 * ---------------------------------------------------------------------------
 * Lacinya sendiri sekarang tinggal di berkas lain
 * ---------------------------------------------------------------------------
 *
 * Mekanisme lacinya - portal, lapisan gelap, penguncian gulir, Escape, dan
 * pemulangan fokus - pindah ke `components/nav-drawer.tsx` ketika bilah atas
 * halaman aplikasi membutuhkan pola yang sama. Perilakunya tidak berubah;
 * seluruh catatan alasannya ikut pindah ke sana. Lihat aturan 6
 * `docs/panduan-responsif.md`: satu pola, dipakai ulang.
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

  const laci = useLaci();

  return (
    <header className="sticky top-0 z-40 border-b border-ink-200 bg-white/85 backdrop-blur-md">
      <div className="wadah flex h-14 items-center justify-between gap-3 sm:h-16">
        {/* Identitas - satu-satunya yang selalu tampil di kedua jalur. */}
        <div className="flex min-w-0 items-center gap-1.5">
          <HeaderBack href="/" />
          <Link
            href="/"
            className="tap-target flex min-w-0 items-center gap-2"
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

        <TombolLaci
          laci={laci}
          idLaci="menu-ponsel"
          labelBuka={t.nav.openMenu}
          labelTutup={t.nav.closeMenu}
          className="lg:hidden"
        />
      </div>

      <MobileDrawer nav={nav} signedIn={signedIn} laci={laci} />
    </header>
  );
}

/* -------------------------------------------------------------------------- */
/* Laci navigasi layar sempit                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Isi lacinya saja. Kerangkanya - portal, lapisan gelap, penguncian gulir,
 * Escape, dan pemulangan fokus - ada di `components/nav-drawer.tsx`, dipakai
 * bersama dengan bilah atas halaman aplikasi.
 */
function MobileDrawer({
  nav,
  signedIn,
  laci,
}: {
  nav: { href: string; label: string }[];
  signedIn: boolean;
  laci: KeadaanLaci;
}) {
  const pathname = usePathname();
  const { t } = useI18n();

  return (
    <Laci
      id="menu-ponsel"
      judul={SITE.name}
      labelTutup={t.nav.closeMenu}
      laci={laci}
      className="lg:hidden"
      kaki={
        signedIn ? (
          <Link
            href="/dashboard"
            onClick={laci.tutup}
            className={buttonClass({ className: "press w-full flex" })}
          >
            {t.nav.dashboard}
          </Link>
        ) : (
          <>
            {/*
              Dua pilihan selalu berdampingan, bukan hanya "Daftar Gratis".
              Dulu tombol Masuk disembunyikan di layar sempit, dan yang sudah
              punya akun mengira harus mendaftar ulang.
            */}
            <Link
              href="/register"
              onClick={laci.tutup}
              className={buttonClass({ className: "press w-full flex" })}
            >
              {t.nav.register}
            </Link>
            <Link
              href="/login"
              onClick={laci.tutup}
              className={buttonClass({
                variant: "outline",
                className: "w-full flex",
              })}
            >
              {t.nav.login}
            </Link>
          </>
        )
      }
    >
      <nav aria-label={t.nav.mobileNav}>
        <ul className="space-y-1">
          {nav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={laci.tutup}
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

            Sakelar temanya tidak ada di sini - ia tinggal di bilah atas,
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
    </Laci>
  );
}

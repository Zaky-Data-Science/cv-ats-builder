"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, House, LogOut, Settings, UserRoundCog } from "lucide-react";
import { BrandMark } from "@/components/BrandMark";
import { HeaderBack } from "@/components/HeaderBack";
import { LanguageToggle, useI18n } from "@/components/i18n";
import { Laci, TombolLaci, useLaci, useMenuLipat } from "@/components/nav-drawer";
import { ThemeToggle } from "@/components/theme-toggle";
import { buttonClass } from "@/components/ui";
import { gantiAkun, keluar } from "@/app/(app)/actions";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * ============================================================================
 *  BILAH ATAS HALAMAN APLIKASI
 * ============================================================================
 *
 * Dipakai bersama oleh empat halaman: dasbor, penyunting CV, pengaturan, dan
 * panel pengelola.
 *
 * ---------------------------------------------------------------------------
 * Apa yang rusak sebelumnya, dan bagaimana ketahuannya
 * ---------------------------------------------------------------------------
 *
 * Bilah ini semula menjajarkan sepuluh hal dalam satu baris pada setiap ukuran
 * layar - logo, nama aplikasi, alamat surel, lencana pengelola, bahasa, tema,
 * Beranda, Panel pengelola, Pengaturan, Ganti akun, Keluar - dan menyembunyikan
 * sebagian dengan `hidden sm:inline` ketika ruangnya habis.
 *
 * Yang diukur di layar 390 piksel: keempat halaman itu **memaksa lebar tata
 * letak menjadi 455 piksel**. Bukan meluber - peramban ponsel justru
 * melebarkan viewport-nya sendiri ketika isi halaman tidak muat, lalu
 * mengecilkan seluruh halaman supaya tetap terlihat. Karena itu pengukuran
 * "ada luberan mendatar atau tidak" menjawab TIDAK, sementara layarnya jelas
 * berantakan: strip bilahnya berhenti sebelum tepi kanan, tulisannya mengecil,
 * dan "Panel pengelola" pecah menjadi dua baris di dalam bilah setinggi 56
 * piksel.
 *
 * Ini bentuk lain dari aturan 3 `docs/panduan-responsif.md`: "tidak meluber"
 * bukan berarti "muat".
 *
 * ---------------------------------------------------------------------------
 * Siapa yang hilang duluan
 * ---------------------------------------------------------------------------
 *
 * Ditentukan lebih dulu, bukan diputuskan saat kehabisan ruang - aturan 4
 * panduan itu:
 *
 *   Wajib terlihat  : logo, lencana pengelola, sakelar tema, tombol menu
 *   Penting         : nama aplikasi, Beranda, Panel pengelola
 *   Masuk laci      : bahasa, nama, alamat surel, Pengaturan, Ganti akun, Keluar
 *
 * Lencana pengelola ada di lapis pertama, bukan kedua, dan itu bukan selera:
 * penanda yang tersembunyi membuat penggunanya tidak tahu ia sedang masuk
 * sebagai siapa - masalah yang sudah pernah terjadi di proyek ini dan memakan
 * waktu untuk disadari.
 *
 * Alamat surel tetap ditampilkan, hanya pindah ke dalam laci/menu. Dua akun
 * Google bisa bernama sama persis; alamatnya selalu berbeda, dan itulah
 * satu-satunya yang menjawab "saya sedang masuk sebagai siapa". Memindahkannya
 * ke dalam menu bukan menyembunyikannya - aturan 5 panduan itu.
 *
 * ---------------------------------------------------------------------------
 * Mengapa halaman penyunting memakai bentuk ringkas di SEMUA lebar
 * ---------------------------------------------------------------------------
 *
 * Di `/resume/...` penggunanya sedang mengerjakan satu dokumen, bukan
 * menavigasi. Bilah penyuntingnya sendiri sudah memiliki judul CV, kembali,
 * maju, dan seluruh aksi berkas - dan ia menuntut sudut kanan atas yang sama
 * dengan yang diperebutkan bilah ini. Dua barisan kendali penuh yang
 * memperebutkan satu sudut persis itulah yang membuatnya pecah.
 *
 * Maka di sana bilah ini menyusut menjadi identitas + tema + satu tombol menu,
 * pada lebar berapa pun. Tidak ada yang hilang: seluruh isinya ada di dalam
 * laci yang sama. Panah kembali pun dilepas, sebab bilah penyunting di
 * bawahnya sudah punya panah kembali sendiri ke tempat yang sama.
 *
 * ---------------------------------------------------------------------------
 * Mengapa ambangnya 1024, bukan 768
 * ---------------------------------------------------------------------------
 *
 * Sama dengan alasan di `PublicHeader.tsx`, dan diuji ulang untuk bilah ini:
 * pada 768 piksel navigasi lengkapnya tidak keluar layar melainkan memampatkan
 * diri. Tablet karena itu ikut memakai laci.
 */

export function AppHeader({
  nama,
  email,
  pengelola,
}: {
  nama: string;
  email: string;
  /**
   * Sudah diputuskan di server dari `ADMIN_EMAIL`.
   *
   * Sengaja diterima sebagai prop biasa, BUKAN dibaca ulang di sini dari
   * sesi. Nilainya tidak pernah tersimpan di dalam token, sehingga memberi
   * maupun mencabut peran berlaku seketika - dan komponen ini tidak punya
   * cara lain untuk mengetahuinya selain bertanya kepada server yang
   * merendernya. Ini kemudahan tampilan, BUKAN pengamanan: `/admin` dan
   * setiap aksinya memeriksa perannya sendiri di server.
   */
  pengelola: boolean;
}) {
  const pathname = usePathname();
  const { t } = useI18n();
  const laci = useLaci();

  // Halaman yang berpusat pada satu dokumen memakai bentuk ringkas di semua
  // lebar - lihat catatan di kepala berkas.
  const ringkas = pathname.startsWith("/resume/");

  const halaman = [
    { href: "/", label: t.nav.home, icon: House },
    ...(pengelola
      ? [{ href: "/admin", label: t.admin.title, icon: UserRoundCog }]
      : []),
    { href: "/settings", label: t.app.settings, icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-30 shrink-0 border-b border-ink-200 bg-white">
      <div className="wadah flex h-14 items-center gap-2">
        {/* ---------------------------------------------------------------- */}
        {/* Identitas - selalu tampil, di lebar mana pun                      */}
        {/* ---------------------------------------------------------------- */}
        <div className="flex min-w-0 flex-1 items-center gap-1.5">
          {/* Di halaman penyunting panah ini dilepas: bilah penyuntingnya
              sudah punya panah kembali sendiri ke tempat yang sama, dan dua
              panah bertumpuk hanya menambah barang yang harus dibaca. */}
          {!ringkas && <HeaderBack href="/dashboard" />}

          {/* `tap-target`: di layar sempit yang terlihat hanya lambangnya,
              28 piksel - di bawah 44 yang dituntut jari. Kelas itu menambah
              daerah sentuhnya tanpa menggeser apa pun yang terlihat. */}
          <Link
            href="/dashboard"
            className="tap-target flex min-w-0 items-center gap-2"
            aria-label={`${SITE.name} - ${t.nav.backDashboard}`}
          >
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-ink-900 text-white">
              <BrandMark className="h-4 w-4" />
            </span>
            <span className="hidden truncate text-sm font-semibold text-ink-900 sm:inline">
              {SITE.name}
            </span>
          </Link>

          {/*
            Lencana pengelola - lapis "wajib terlihat".

            Tetap di bilah pada kedua ukuran layar, bukan ikut masuk laci.
            Sebelum lencana ini ada, tidak ada cara mengetahui sedang masuk
            sebagai pengelola selain menebak-nebak alamat /admin. Ia membaca
            sumber yang sama dengan tautan panelnya, jadi keduanya tidak
            mungkin bertentangan.
          */}
          {pengelola && (
            <span
              className="shrink-0 rounded-md border border-ink-300 bg-ink-100 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-ink-700 uppercase"
              title={t.app.adminBadgeHint}
            >
              {t.app.adminBadge}
            </span>
          )}
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Kendali layar lebar                                              */}
        {/* ---------------------------------------------------------------- */}
        {!ringkas && (
          <div className="hidden items-center gap-1.5 lg:flex">
            <nav
              className="flex items-center gap-1"
              aria-label={t.nav.mainNav}
            >
              <Link
                href="/"
                className={buttonClass({ variant: "ghost", size: "sm" })}
              >
                <House size={14} />
                {t.nav.home}
              </Link>
              {pengelola && (
                <Link
                  href="/admin"
                  aria-current={pathname === "/admin" ? "page" : undefined}
                  className={buttonClass({ variant: "ghost", size: "sm" })}
                >
                  {t.admin.title}
                </Link>
              )}
            </nav>

            <LanguageToggle />
            <ThemeToggle />
            <MenuAkun nama={nama} email={email} />
          </div>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* Kendali layar sempit - dan seluruh lebar di halaman penyunting    */}
        {/* ---------------------------------------------------------------- */}
        {/*
          Sakelar tema tetap di bilah, tidak ikut masuk laci.

          Alasannya sama dengan di PublicHeader, dan sudah pernah dilaporkan
          sebagai keluhan: bahasa dan pengaturan adalah hal yang dicari saat
          dibutuhkan; mode gelap adalah hal yang diketuk begitu layarnya terasa
          terlalu terang. Yang menuntut dua ketukan untuk sampai ke sana akan
          disimpulkan tidak ada.

          Letaknya sengaja tetap: persis sebelum tombol menu, sehingga di tiap
          lebar ia punya satu tempat yang jelas - bukan menyempil di tengah
          barisan seperti sebelumnya. Lingkaran tinta pergantian temanya pun
          jadi berangkat dari titik yang masuk akal untuk lebar itu, sebab
          titik pusatnya diambil dari tombolnya sendiri.
        */}
        <div className={cn("flex items-center gap-1", !ringkas && "lg:hidden")}>
          <ThemeToggle />
          <TombolLaci
            laci={laci}
            idLaci="laci-aplikasi"
            labelBuka={t.nav.openMenu}
            labelTutup={t.nav.closeMenu}
          />
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Laci                                                               */}
      {/* ------------------------------------------------------------------ */}
      <Laci
        id="laci-aplikasi"
        judul={SITE.name}
        labelTutup={t.nav.closeMenu}
        laci={laci}
        className={cn(!ringkas && "lg:hidden")}
        kaki={
          <>
            {/*
              "Ganti akun" berbeda maksud dari "Keluar", jadi berbeda tombol.
              Keduanya sama-sama mengeluarkan; yang membedakan ke mana orangnya
              dibawa sesudah itu, dan itulah yang dijelaskan namanya.
            */}
            <form action={gantiAkun}>
              <button
                type="submit"
                className={buttonClass({
                  variant: "outline",
                  className: "w-full flex",
                })}
              >
                <UserRoundCog size={15} />
                {t.app.switchAccount}
              </button>
            </form>
            <form action={keluar}>
              <button
                type="submit"
                className={buttonClass({
                  variant: "ghost",
                  className: "w-full flex",
                })}
              >
                <LogOut size={15} />
                {t.app.signOut}
              </button>
            </form>
          </>
        }
      >
        {/* Siapa yang sedang masuk. Alamat surelnya dicetak utuh di sini -
            di bilah tidak ada lagi tempatnya, dan justru inilah satu-satunya
            keterangan yang membedakan dua akun bernama sama. */}
        <div className="mb-3 rounded-xl border border-ink-200 bg-ink-50 px-4 py-3">
          <p className="text-[11px] font-semibold tracking-wide text-ink-500 uppercase">
            {t.app.signedInAs}
          </p>
          <p className="mt-1 truncate text-sm font-medium text-ink-900">
            {nama}
          </p>
          <p className="truncate text-xs text-ink-500">{email}</p>
        </div>

        <ul className="space-y-1">
          {halaman.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={laci.tutup}
                aria-current={pathname === item.href ? "page" : undefined}
                className={cn(
                  "flex min-h-11 items-center gap-3 rounded-xl px-4 text-[15px] transition-colors",
                  pathname === item.href
                    ? "bg-ink-100 font-semibold text-ink-900"
                    : "text-ink-700 hover:bg-ink-50",
                )}
              >
                <item.icon size={16} className="shrink-0 text-ink-500" />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Bahasa: setelan, bukan tujuan. Dipisahkan garis supaya tidak
            terbaca sebagai halaman keempat. */}
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

/* -------------------------------------------------------------------------- */
/* Menu akun - hanya layar lebar                                              */
/* -------------------------------------------------------------------------- */

/**
 * Satu tombol yang menggantikan empat.
 *
 * Sebelumnya nama, alamat surel, Pengaturan, Ganti akun, dan Keluar berdiri
 * sendiri-sendiri di bilah - lima hal yang seluruhnya tentang "akun saya",
 * memakan lebih dari separuh lebar bilah, dan tetap tidak muat. Semuanya kini
 * di balik satu tombol yang menyebutkan siapa pemiliknya.
 */
function MenuAkun({ nama, email }: { nama: string; email: string }) {
  const { t } = useI18n();
  // Dibongkar lebih dulu - lihat catatan yang sama di `TombolLaci`.
  const { terbuka, alih, tutup, pasangPembuka, pasangWadah } = useMenuLipat();

  // Huruf awal nama - dan bila namanya kosong, huruf awal alamat surelnya.
  // Selalu ada sesuatu yang dapat digambar, sehingga tombolnya tidak pernah
  // berubah lebar hanya karena sebuah akun tidak punya nama tampilan.
  const inisial = (nama || email || "?").trim().charAt(0).toUpperCase();

  return (
    <div ref={pasangWadah} className="relative">
      <button
        ref={pasangPembuka}
        type="button"
        onClick={alih}
        aria-expanded={terbuka}
        aria-haspopup="menu"
        aria-label={t.app.accountMenu}
        title={email}
        className="tap-target flex h-9 items-center gap-1.5 rounded-lg border border-ink-300 bg-white py-1 pr-1.5 pl-1.5 text-ink-700 transition-colors hover:bg-ink-50"
      >
        <span
          aria-hidden
          className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-ink-900 text-[11px] font-semibold text-white"
        >
          {inisial}
        </span>
        <span className="hidden max-w-32 truncate text-xs font-medium xl:inline">
          {nama}
        </span>
        <ChevronDown size={14} aria-hidden />
      </button>

      {terbuka && (
        <div
          role="menu"
          aria-label={t.app.accountMenu}
          className="absolute right-0 z-50 mt-1.5 w-72 overflow-hidden rounded-xl border border-ink-200 bg-white shadow-xl"
        >
          <div className="border-b border-ink-200 px-4 py-3">
            <p className="text-[11px] font-semibold tracking-wide text-ink-500 uppercase">
              {t.app.signedInAs}
            </p>
            <p className="mt-1 truncate text-sm font-medium text-ink-900">
              {nama}
            </p>
            {/* Alamat surel tidak dipangkas dengan `truncate` saja - alamat
                panjang dibiarkan patah, sebab bagian belakangnya (nama
                domainnya) justru yang paling sering membedakan dua akun. */}
            <p className="text-xs break-all text-ink-500">{email}</p>
          </div>

          <Link
            href="/settings"
            role="menuitem"
            onClick={tutup}
            className="flex w-full items-center gap-3 px-4 py-3 text-sm text-ink-800 transition-colors hover:bg-ink-50"
          >
            <Settings size={15} className="shrink-0 text-ink-500" />
            {t.app.settings}
          </Link>

          {/* Panel pengelola sengaja TIDAK diulang di sini. Ia sudah berdiri
              sebagai tautan tersendiri di bilah pada lebar yang sama - menu
              ini hanya muncul di sana - dan satu perintah yang sama pada dua
              tempat berdekatan membuat orang mengira keduanya berbeda. */}

          <div className="border-t border-ink-200">
            <form action={gantiAkun}>
              <button
                type="submit"
                role="menuitem"
                title={t.app.switchAccountHint}
                className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-ink-800 transition-colors hover:bg-ink-50"
              >
                <UserRoundCog size={15} className="shrink-0 text-ink-500" />
                {t.app.switchAccount}
              </button>
            </form>
            <form action={keluar}>
              <button
                type="submit"
                role="menuitem"
                className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-ink-800 transition-colors hover:bg-ink-50"
              >
                <LogOut size={15} className="shrink-0 text-ink-500" />
                {t.app.signOut}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

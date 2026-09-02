"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", label: "Beranda" },
  { href: "/panduan", label: "Panduan" },
  { href: "/tentang", label: "Tentang" },
];

/**
 * Bilah navigasi untuk halaman publik.
 *
 * Di layar sempit menu diringkas menjadi tombol - bukan disembunyikan -
 * sehingga seluruh halaman tetap terjangkau dari ponsel.
 */
export function PublicHeader({ signedIn }: { signedIn: boolean }) {
  const pathname = usePathname();

  // Yang disimpan bukan "menu terbuka", melainkan "menu dibuka di halaman
  // mana". Dengan begitu berpindah halaman otomatis menutup menu tanpa
  // memerlukan effect yang memanggil setState - pola yang memicu render
  // berantai dan mudah terlewat saat halaman baru ditambahkan.
  const [openedAt, setOpenedAt] = React.useState<string | null>(null);
  const open = openedAt === pathname;
  const setOpen = (value: boolean) => setOpenedAt(value ? pathname : null);

  return (
    <header className="sticky top-0 z-40 border-b border-ink-200 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-5">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2"
          aria-label={`${SITE.name} - beranda`}
        >
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-ink-900 text-xs font-bold text-white">
            CV
          </span>
          <span className="text-sm font-semibold text-ink-900">
            {SITE.name}
          </span>
        </Link>

        {/* Navigasi layar lebar */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Utama">
          {NAV.map((item) => (
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

        <div className="flex items-center gap-2">
          {signedIn ? (
            <Link href="/dashboard">
              <Button size="sm" className="press">
                Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/login" className="hidden sm:block">
                <Button variant="ghost" size="sm">
                  Masuk
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="press">
                  Daftar Gratis
                </Button>
              </Link>
            </>
          )}

          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls="menu-ponsel"
            aria-label={open ? "Tutup menu" : "Buka menu"}
            className="grid h-9 w-9 place-items-center rounded-lg text-ink-600 hover:bg-ink-100 md:hidden"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Navigasi layar sempit */}
      {open && (
        <nav
          id="menu-ponsel"
          aria-label="Utama (ponsel)"
          className="border-t border-ink-200 bg-white md:hidden"
        >
          <ul className="mx-auto max-w-6xl px-4 py-2">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "block rounded-lg px-3 py-2.5 text-sm",
                    pathname === item.href
                      ? "bg-ink-100 font-semibold text-ink-900"
                      : "text-ink-700",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            {!signedIn && (
              <li className="border-t border-ink-100 pt-2 sm:hidden">
                <Link
                  href="/login"
                  className="block rounded-lg px-3 py-2.5 text-sm text-ink-700"
                >
                  Masuk
                </Link>
              </li>
            )}
          </ul>
        </nav>
      )}
    </header>
  );
}

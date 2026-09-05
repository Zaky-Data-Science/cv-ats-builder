"use client";

import Link from "next/link";
import { useI18n } from "@/components/i18n";
import { BrandMark } from "@/components/BrandMark";
import { AUTHOR, SITE, SITE_META, YEAR } from "@/lib/site";

/**
 * Footer beserta identitas pembuat.
 *
 * Yang dicantumkan hanya identitas - nama, peran, institusi. Keterangan
 * bahwa aplikasi ini pekerjaan kampus sengaja tidak ditulis: pengunjung yang
 * datang untuk menyusun CV lamaran kerjanya perlu tahu siapa yang memegang
 * datanya, bukan untuk keperluan mata kuliah apa aplikasinya dibuat.
 *
 * Kredit ini juga tidak pernah ikut tercetak pada CV yang diunduh pengguna.
 * CV adalah dokumen milik pelamar; membubuhkan nama pihak lain di atasnya
 * akan membingungkan perekrut dan merugikan penggunanya. Yang ditanamkan
 * pada berkas unduhan hanyalah properti dokumen (Author/Creator), yang tidak
 * tampak saat dibaca.
 */
export function SiteFooter({ compact = false }: { compact?: boolean }) {
  const { locale, t } = useI18n();

  if (compact) {
    return (
      <footer className="border-t border-ink-200 px-5 py-6">
        <p className="text-center text-[11px] leading-relaxed text-ink-500">
          {SITE.name} - {t.footer.madeBy}{" "}
          <span className="font-semibold text-ink-700">{AUTHOR.name}</span>
        </p>
        <p className="mt-1.5 text-center text-[11px] text-ink-500">
          <Link href="/privasi" className="hover:text-ink-900">
            {t.footer.privacy}
          </Link>
          <span className="mx-2 text-ink-300">|</span>
          <Link href="/ketentuan" className="hover:text-ink-900">
            {t.footer.terms}
          </Link>
        </p>
      </footer>
    );
  }

  const links = [
    { href: "/", label: t.nav.home },
    { href: "/bandingkan", label: t.nav.compare },
    { href: "/panduan", label: t.nav.guide },
    { href: "/tentang", label: t.nav.about },
    { href: "/alur", label: t.nav.flowNav },
    { href: "/register", label: t.footer.registerFree },
    { href: "/privasi", label: t.footer.privacy },
    { href: "/ketentuan", label: t.footer.terms },
  ];

  return (
    <footer className="border-t border-ink-200 bg-white">
      <div className="mx-auto max-w-6xl px-5 py-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Identitas aplikasi */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-ink-900 text-white">
                <BrandMark className="h-[18px] w-[18px]" />
              </span>
              <span className="text-sm font-semibold text-ink-900">
                {SITE.name}
              </span>
            </div>
            <p className="mt-3 max-w-sm text-xs leading-relaxed text-ink-600">
              {SITE_META[locale].description}
            </p>
          </div>

          {/* Tautan */}
          <nav aria-label={t.footer.pagesHeading}>
            <h2 className="text-xs font-semibold text-ink-900">
              {t.footer.pagesHeading}
            </h2>
            <ul className="mt-3 space-y-2 text-xs text-ink-600">
              {links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-ink-900">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Pembuat */}
          <div>
            <h2 className="text-xs font-semibold text-ink-900">
              {t.footer.authorHeading}
            </h2>
            <address className="mt-3 text-xs leading-relaxed text-ink-600 not-italic">
              <span className="block font-semibold text-ink-900">
                {AUTHOR.name}
              </span>
              {AUTHOR.role}
              <br />
              {AUTHOR.department}
              <br />
              {AUTHOR.institution}
            </address>
          </div>
        </div>

        <div className="mt-8 border-t border-ink-100 pt-6">
          <p className="text-center text-[11px] text-ink-500">
            &copy; {YEAR} {AUTHOR.name}. {t.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}

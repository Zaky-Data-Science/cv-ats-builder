import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { AUTHOR, SITE, YEAR } from "@/lib/site";

/**
 * Footer beserta identitas pembuat.
 *
 * Kredit sengaja hanya muncul di antarmuka aplikasi dan tidak pernah ikut
 * tercetak pada CV yang diunduh pengguna. CV adalah dokumen milik pelamar;
 * membubuhkan nama pihak lain di atasnya akan membingungkan perekrut dan
 * merugikan penggunanya. Yang ditanamkan pada berkas unduhan hanyalah
 * properti dokumen (Author/Creator), yang tidak tampak saat dibaca.
 */
export function SiteFooter({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <footer className="border-t border-ink-200 px-5 py-6">
        <p className="text-center text-[11px] leading-relaxed text-ink-500">
          {SITE.name} - dibuat oleh{" "}
          <span className="font-semibold text-ink-700">{AUTHOR.name}</span>,{" "}
          {AUTHOR.role} {AUTHOR.institution}
        </p>
        <p className="mt-1.5 text-center text-[11px] text-ink-500">
          <Link href="/privasi" className="hover:text-brand-600">
            Kebijakan Privasi
          </Link>
          <span className="mx-2 text-ink-300">|</span>
          <Link href="/ketentuan" className="hover:text-brand-600">
            Ketentuan Layanan
          </Link>
        </p>
      </footer>
    );
  }

  return (
    <footer className="border-t border-ink-200 bg-white">
      <div className="mx-auto max-w-6xl px-5 py-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Identitas aplikasi */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-ink-900 text-xs font-bold text-white">
                CV
              </span>
              <span className="text-sm font-semibold text-ink-900">
                {SITE.name}
              </span>
            </div>
            <p className="mt-3 max-w-sm text-xs leading-relaxed text-ink-600">
              {SITE.description}
            </p>
          </div>

          {/* Tautan */}
          <nav aria-label="Tautan halaman">
            <h2 className="text-xs font-semibold text-ink-900">Halaman</h2>
            <ul className="mt-3 space-y-2 text-xs text-ink-600">
              <li>
                <Link href="/" className="hover:text-brand-600">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/panduan" className="hover:text-brand-600">
                  Panduan Penggunaan
                </Link>
              </li>
              <li>
                <Link href="/tentang" className="hover:text-brand-600">
                  Tentang Aplikasi
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-brand-600">
                  Daftar Gratis
                </Link>
              </li>
              <li>
                <Link href="/privasi" className="hover:text-brand-600">
                  Kebijakan Privasi
                </Link>
              </li>
              <li>
                <Link href="/ketentuan" className="hover:text-brand-600">
                  Ketentuan Layanan
                </Link>
              </li>
            </ul>
          </nav>

          {/* Pembuat */}
          <div>
            <h2 className="text-xs font-semibold text-ink-900">Pembuat</h2>
            <div className="mt-3 flex gap-2.5">
              <GraduationCap
                size={16}
                className="mt-0.5 shrink-0 text-brand-600"
                aria-hidden
              />
              <address className="text-xs leading-relaxed text-ink-600 not-italic">
                <span className="block font-semibold text-ink-900">
                  {AUTHOR.name}
                </span>
                {AUTHOR.role}
                <br />
                {AUTHOR.institution}
              </address>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-ink-100 pt-6">
          <p className="text-center text-[11px] text-ink-500">
            &copy; {YEAR} {AUTHOR.name}. Dibangun sebagai Tugas Akhir Program
            Studi D3 Teknik Komputer, {AUTHOR.institution}.
          </p>
        </div>
      </div>
    </footer>
  );
}

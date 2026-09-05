import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getT } from "@/lib/i18n/server";
import { SITE } from "@/lib/site";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = await getT();

  return (
    <div className="flex min-h-full flex-col bg-ink-100">
      <header className="border-b border-ink-200 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
          <Link href="/" className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-ink-900 text-sm font-bold text-white">
              CV
            </span>
            <span className="text-sm font-semibold text-ink-900">
              {SITE.name}
            </span>
          </Link>

          {/* Halaman masuk kerap dibuka langsung dari tautan yang dibagikan,
              sehingga tombol kembali peramban tidak punya riwayat untuk
              dimundurkan. Tautan ini yang menjadi jalan pulangnya. */}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-600 transition-colors hover:text-ink-900"
          >
            <ArrowLeft size={13} aria-hidden />
            {t.nav.backHome}
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-5 py-12">
        <div className="w-full max-w-sm">{children}</div>
      </main>
    </div>
  );
}

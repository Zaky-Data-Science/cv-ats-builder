import type { ReactNode } from "react";
import { PublicHeader } from "@/components/PublicHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Badge } from "@/components/ui";
import { getT } from "@/lib/i18n/server";

/**
 * Kerangka halaman dokumen hukum (kebijakan privasi dan ketentuan layanan).
 *
 * Keduanya berbagi bentuk yang sama, jadi tata letaknya dikumpulkan di sini
 * agar isinya saja yang perlu ditulis terpisah.
 */
export async function LegalPage({
  badge,
  title,
  intro,
  updatedAt,
  signedIn,
  children,
}: {
  badge: string;
  title: string;
  intro: string;
  updatedAt: string;
  signedIn: boolean;
  children: ReactNode;
}) {
  const { t } = await getT();

  return (
    <div className="flex min-h-full flex-col bg-white">
      <a
        href="#konten"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-lg focus:bg-ink-900 focus:px-4 focus:py-2 focus:text-sm focus:text-white"
      >
        {t.home.skipToContent}
      </a>

      <PublicHeader signedIn={signedIn} />

      <main id="konten" className="flex-1">
        <section className="border-b border-ink-200 bg-ink-50">
          <div className="mx-auto max-w-3xl px-4 py-12 sm:px-5 sm:py-16">
            <Badge>{badge}</Badge>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
              {title}
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-ink-600 sm:text-base">
              {intro}
            </p>
            <p className="mt-4 text-xs text-ink-500">
              {t.legal.updatedAt} {updatedAt}
            </p>
          </div>
        </section>

        {/*
          Gaya tipografi diterapkan lewat pemilih turunan agar isi tiap
          dokumen cukup ditulis sebagai HTML biasa tanpa mengulang kelas.
        */}
        <article
          className="mx-auto max-w-3xl px-4 py-12 text-sm leading-relaxed text-ink-700 sm:px-5 sm:py-16
            [&_a]:font-medium [&_a]:text-ink-900 [&_a]:underline
            [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-ink-900
            [&_h2:first-child]:mt-0
            [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:text-ink-900
            [&_li]:mb-1.5
            [&_p]:mb-3
            [&_strong]:font-semibold [&_strong]:text-ink-900
            [&_table]:my-4 [&_table]:w-full [&_table]:border-collapse [&_table]:text-left
            [&_td]:border-b [&_td]:border-ink-100 [&_td]:py-2.5 [&_td]:pr-4 [&_td]:align-top
            [&_th]:border-b [&_th]:border-ink-200 [&_th]:py-2 [&_th]:pr-4 [&_th]:text-xs [&_th]:font-semibold [&_th]:text-ink-500
            [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-5"
        >
          {children}
        </article>
      </main>

      <SiteFooter />
    </div>
  );
}

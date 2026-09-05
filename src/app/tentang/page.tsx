import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  Code2,
  Database,
  FileSearch,
  Layers,
  Palette,
  ScrollText,
  ShieldCheck,
  TriangleAlert,
} from "lucide-react";
import { auth } from "@/auth";
import { ContactBlock } from "@/components/ContactBlock";
import { Breadcrumb } from "@/components/Breadcrumb";
import { PublicHeader } from "@/components/PublicHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Interactive, Reveal } from "@/components/motion";
import { Button, Card } from "@/components/ui";
import { getT } from "@/lib/i18n/server";
import { RUJUKAN } from "@/lib/rujukan";
import { AUTHOR, SITE } from "@/lib/site";
import { ABOUT } from "./content";

export async function generateMetadata(): Promise<Metadata> {
  const { locale } = await getT();
  const content = ABOUT[locale];
  return { title: content.title, description: content.intro };
}

/** Ikon untuk tiap butir rancangan teknis, mengikuti urutan datanya. */
const STACK_ICONS = [
  Layers,
  Database,
  ShieldCheck,
  ScrollText,
  FileSearch,
  Palette,
];

export default async function TentangPage() {
  const session = await auth();
  const { locale, t } = await getT();
  const content = ABOUT[locale];
  const signedIn = Boolean(session?.user?.id);

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
          <div className="mx-auto max-w-4xl px-4 py-12 sm:px-5 sm:py-16">
            <Breadcrumb
              label={t.nav.breadcrumb}
              items={[
                { href: "/", label: t.nav.home },
                { label: content.badge },
              ]}
            />
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
              {content.title}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-600 sm:text-base">
              {content.intro}
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-5 sm:py-16">
          {/* ============================================================ */}
          {/* Latar belakang                                               */}
          {/* ============================================================ */}
          <Reveal as="section">
            <h2 className="text-xl font-bold text-ink-900 sm:text-2xl">
              {content.problemTitle}
            </h2>
            <div className="mt-4 space-y-4 text-sm leading-relaxed text-ink-600">
              {content.problemParagraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
            </div>
          </Reveal>

          {/* ============================================================ */}
          {/* Tujuan                                                       */}
          {/* ============================================================ */}
          <Reveal as="section" className="mt-14">
            <h2 className="text-xl font-bold text-ink-900 sm:text-2xl">
              {content.goalsTitle}
            </h2>
            <ol className="mt-4 space-y-4">
              {content.goals.map((goal, index) => (
                <li key={goal.title} className="flex gap-4">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-ink-900 text-xs font-bold text-white">
                    {index + 1}
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-ink-900">
                      {goal.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-ink-600">
                      {goal.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>

          {/* ============================================================ */}
          {/* Rancangan teknis                                             */}
          {/* ============================================================ */}
          <Reveal as="section" className="mt-14">
            <h2 className="text-xl font-bold text-ink-900 sm:text-2xl">
              {content.stackTitle}
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-ink-600">
              {content.stackIntro}
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {content.stack.map((item, index) => {
                const Icon = STACK_ICONS[index] ?? Code2;
                return (
                  <Interactive key={item.title}>
                    <Card className="h-full p-5">
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-ink-100 text-ink-800">
                      <Icon size={18} />
                    </span>
                    <h3 className="mt-3.5 text-sm font-semibold text-ink-900">
                      {item.title}
                    </h3>
                      <p className="mt-1.5 text-[13px] leading-relaxed text-ink-600">
                        {item.body}
                      </p>
                    </Card>
                  </Interactive>
                );
              })}
            </div>
          </Reveal>

          {/* ============================================================ */}
          {/* Perbandingan                                                 */}
          {/* ============================================================ */}
          <Reveal as="section" className="mt-14">
            <h2 className="text-xl font-bold text-ink-900 sm:text-2xl">
              {content.comparisonTitle}
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-ink-600">
              {content.comparisonIntro}
            </p>

            {/* Tabel digulirkan sendiri di layar sempit supaya halamannya
                tidak pernah meluber ke samping. */}
            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[42rem] border-collapse text-left text-[13px]">
                <thead>
                  <tr className="border-b border-ink-200 text-xs text-ink-500">
                    <th className="py-2 pr-4 font-semibold">
                      {content.comparisonHeadAspect}
                    </th>
                    <th className="py-2 pr-4 font-semibold">
                      {content.comparisonHeadOthers}
                    </th>
                    <th className="py-2 font-semibold">
                      {content.comparisonHeadOurs}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {content.comparison.map((row) => (
                    <tr key={row.aspect} className="border-b border-ink-100">
                      <td className="py-3 pr-4 align-top font-semibold text-ink-900">
                        {row.aspect}
                      </td>
                      <td className="py-3 pr-4 align-top leading-relaxed text-ink-600">
                        {row.others}
                      </td>
                      <td className="py-3 align-top leading-relaxed text-ink-800">
                        {row.ours}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>

          {/* ============================================================ */}
          {/* Batasan                                                      */}
          {/* ============================================================ */}
          <Reveal as="section" className="mt-14">
            <div className="flex items-center gap-2">
              <TriangleAlert size={18} className="text-warn" aria-hidden />
              <h2 className="text-xl font-bold text-ink-900 sm:text-2xl">
                {content.limitsTitle}
              </h2>
            </div>
            <p className="mt-2 max-w-2xl text-sm text-ink-600">
              {content.limitsIntro}
            </p>
            <ul className="mt-4 space-y-3">
              {content.limits.map((limit) => (
                <li
                  key={limit.slice(0, 40)}
                  className="flex gap-2.5 text-sm leading-relaxed text-ink-600"
                >
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-ink-400" />
                  {limit}
                </li>
              ))}
            </ul>
          </Reveal>

          {/* ============================================================ */}
          {/* Rujukan                                                      */}
          {/* ============================================================ */}
          {/*
            Daftar sumber yang dapat dibuka pembaca.

            Tautannya sudah ada di dalam kalimat masing-masing di halaman
            depan, tetapi orang yang ingin memeriksa tidak seharusnya berburu
            satu per satu. Tiap butir menyebutkan mendukung klaim yang mana -
            daftar sumber tanpa keterangan itu hanya hiasan yang terlihat
            ilmiah.
          */}
          <Reveal as="section" className="mt-14">
            <h2 className="text-xl font-bold text-ink-900 sm:text-2xl">
              {t.rujukan.heading}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-600">
              {t.rujukan.intro}
            </p>

            <ul className="mt-4 space-y-3">
              {[
                {
                  href: RUJUKAN.harvard.pdf,
                  title: t.rujukan.harvardTitle,
                  meta: t.rujukan.harvardMeta,
                  what: t.rujukan.harvardWhat,
                },
                {
                  href: RUJUKAN.usc,
                  title: t.rujukan.uscTitle,
                  meta: t.rujukan.uscMeta,
                  what: t.rujukan.uscWhat,
                },
                {
                  href: RUJUKAN.onu,
                  title: t.rujukan.onuTitle,
                  meta: t.rujukan.onuMeta,
                  what: t.rujukan.onuWhat,
                },
              ].map((r) => (
                <li key={r.href}>
                  <Card className="p-4">
                    <a
                      href={r.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="press text-sm font-semibold text-ink-900 underline underline-offset-2"
                    >
                      {r.title}
                      <span className="sr-only"> ({t.rujukan.openIn})</span>
                    </a>
                    <p className="mt-0.5 text-xs text-ink-500">{r.meta}</p>
                    <p className="mt-2 text-[13px] leading-relaxed text-ink-600">
                      {r.what}
                    </p>
                  </Card>
                </li>
              ))}
            </ul>
          </Reveal>

          {/* ============================================================ */}
          {/* Pembuat                                                      */}
          {/* ============================================================ */}
          <Reveal as="section" className="mt-14">
            <h2 className="text-xl font-bold text-ink-900 sm:text-2xl">
              {content.authorTitle}
            </h2>
            <Card className="mt-4 p-5">
              <p className="text-base font-semibold text-ink-900">
                {AUTHOR.name}
              </p>
              <p className="mt-1 text-sm text-ink-600">{AUTHOR.role}</p>
              <p className="text-sm text-ink-600">{AUTHOR.department}</p>
              <p className="text-sm text-ink-600">{AUTHOR.institution}</p>
              <ContactBlock className="mt-5 border-t border-ink-100 pt-5 text-left" />
              <hr className="hairline my-4" />
              <p className="text-xs text-ink-500">{content.authorRole}</p>
            </Card>
          </Reveal>

          {/* ============================================================ */}
          {/* Ajakan                                                       */}
          {/* ============================================================ */}
          <Reveal as="section" className="mt-14">
            <Card className="p-6">
              <h2 className="text-lg font-bold text-ink-900">
                {content.ctaTitle}
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-600">
                {content.ctaBody}
              </p>
              <Link
                href="/login"
                className="mt-5 inline-block"
              >
                <Button className="press">
                  {content.ctaButton}
                  <ArrowRight size={15} />
                </Button>
              </Link>
              <p className="mt-3 text-[11px] text-ink-400">{SITE.name}</p>
            </Card>
          </Reveal>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

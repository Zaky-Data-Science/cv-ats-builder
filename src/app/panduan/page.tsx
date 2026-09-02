import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  ChevronRight,
  CircleAlert,
  Lightbulb,
  ShieldCheck,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { auth } from "@/auth";
import { DiagramView } from "@/components/Diagram";
import { Breadcrumb } from "@/components/Breadcrumb";
import { PublicHeader } from "@/components/PublicHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Interactive, Reveal } from "@/components/motion";
import { Badge, Button, Callout, Card } from "@/components/ui";
import {
  DIMENSION_WEIGHTS,
  dimensionDescriptions,
  dimensionLabels,
  type DimensionKey,
} from "@/lib/ats/engine";
import { diagramById } from "@/lib/diagrams";
import { getT } from "@/lib/i18n/server";
import { SECTION_UI } from "@/lib/resume/section-ui";
import { DEFAULT_SECTION_ORDER, SECTION_META } from "@/lib/resume/sections";
import { GUIDE } from "./content";

export async function generateMetadata(): Promise<Metadata> {
  const { locale } = await getT();
  const content = GUIDE[locale];
  return { title: content.title, description: content.intro };
}

export default async function PanduanPage() {
  const session = await auth();
  const { locale, t } = await getT();
  const content = GUIDE[locale];
  const signedIn = Boolean(session?.user?.id);

  const labels = dimensionLabels(locale);
  const descriptions = dimensionDescriptions(locale);

  // Diagram yang sama dengan yang ditampilkan di halaman /alur dan yang
  // dibangkitkan sebagai berkas gambar - satu sumber, tiga tempat tampil.
  const flow = diagramById("alur-menyusun-cv");

  // Judul bagian di CV mengikuti bahasa CV, bukan bahasa antarmuka. Tabel di
  // bawah menampilkan judul untuk bahasa yang sama dengan antarmuka yang
  // sedang dipakai, karena itulah yang paling mungkin dipilih pembacanya.
  const headingLang = locale === "en" ? "EN" : "ID";

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
          {/* 1. Alur                                                      */}
          {/* ============================================================ */}
          <Reveal as="section">
            <h2 className="text-xl font-bold text-ink-900 sm:text-2xl">
              {content.flowTitle}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-600">
              {content.flowIntro}
            </p>

            {flow && (
              <div className="mt-8 rounded-2xl border border-ink-200 bg-ink-50 p-4 sm:p-6">
                <DiagramView diagram={flow} locale={locale} />
              </div>
            )}

            <Link
              href="/alur"
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-ink-800 underline"
            >
              {content.flowMoreLink}
              <ArrowRight size={13} />
            </Link>
          </Reveal>

          {/* ============================================================ */}
          {/* 2. Isi tiap bagian                                           */}
          {/* ============================================================ */}
          <Reveal as="section" className="mt-16">
            <h2 className="text-xl font-bold text-ink-900 sm:text-2xl">
              {content.sectionsTitle}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-600">
              {content.sectionsIntro}
            </p>

            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-ink-200">
                    <th className="py-2.5 pr-4 text-xs font-semibold text-ink-500">
                      {content.sectionsHeadName}
                    </th>
                    <th className="py-2.5 pr-4 text-xs font-semibold text-ink-500">
                      {content.sectionsHeadHeading}
                    </th>
                    <th className="py-2.5 text-xs font-semibold text-ink-500">
                      {content.sectionsHeadWhat}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-ink-100 align-top">
                    <td className="py-3 pr-4 font-medium text-ink-900">
                      {content.personalName}
                    </td>
                    <td className="py-3 pr-4 text-xs text-ink-500">
                      {content.personalHeading}
                    </td>
                    <td className="py-3 text-[13px] leading-relaxed text-ink-600">
                      {content.personalWhat}
                    </td>
                  </tr>
                  {DEFAULT_SECTION_ORDER.map((key) => (
                    <tr key={key} className="border-b border-ink-100 align-top">
                      <td className="py-3 pr-4 font-medium text-ink-900">
                        {SECTION_UI[locale][key].label}
                      </td>
                      <td className="py-3 pr-4 text-xs text-ink-500">
                        {SECTION_META[key].heading[headingLang]}
                      </td>
                      <td className="py-3 text-[13px] leading-relaxed text-ink-600">
                        {SECTION_UI[locale][key].hint}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>

          {/* ============================================================ */}
          {/* 3. Skor                                                      */}
          {/* ============================================================ */}
          <Reveal as="section" className="mt-16">
            <h2 className="text-xl font-bold text-ink-900 sm:text-2xl">
              {content.scoreTitle}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-600">
              {content.scoreIntro}
            </p>

            <div className="mt-6 space-y-3">
              {(Object.keys(DIMENSION_WEIGHTS) as DimensionKey[]).map((key) => (
                <Interactive key={key} tilt={3}>
                  <Card className="p-4">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="text-sm font-semibold text-ink-900">
                      {labels[key]}
                    </h3>
                    <Badge>
                      {content.weightLabel} {DIMENSION_WEIGHTS[key]}%
                    </Badge>
                  </div>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-ink-600">
                      {descriptions[key]}
                    </p>
                  </Card>
                </Interactive>
              ))}
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-4">
              {content.grades.map((grade, index) => (
                <Interactive key={grade.grade}>
                  <Card className="h-full p-4 text-center">
                  <p
                    className={
                      index <= 1
                        ? "text-2xl font-bold text-good"
                        : index === 2
                          ? "text-2xl font-bold text-warn"
                          : "text-2xl font-bold text-bad"
                    }
                  >
                    {grade.grade}
                  </p>
                  <p className="mt-0.5 text-xs font-medium text-ink-700">
                    {grade.range}
                  </p>
                    <p className="mt-1 text-[11px] leading-relaxed text-ink-500">
                      {grade.note}
                    </p>
                  </Card>
                </Interactive>
              ))}
            </div>

            <div className="mt-6">
              <Callout tone="warn" title={content.scoreWarningTitle}>
                {content.scoreWarningBody}
              </Callout>
            </div>
          </Reveal>

          {/* ============================================================ */}
          {/* 4. Poin pencapaian                                           */}
          {/* ============================================================ */}
          <Reveal as="section" className="mt-16">
            <h2 className="text-xl font-bold text-ink-900 sm:text-2xl">
              {content.bulletTitle}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-600">
              {content.bulletIntroLead}
              <strong className="text-ink-800">{content.bulletFormula}</strong>.
            </p>

            <div className="mt-6 space-y-4">
              {content.bulletExamples.map((example) => (
                <Interactive key={example.good} tilt={2.5}>
                  <Card className="overflow-hidden">
                  <div className="flex items-start gap-3 border-b border-ink-100 bg-red-50/50 px-4 py-3">
                    <ThumbsDown size={15} className="mt-0.5 shrink-0 text-bad" />
                    <p className="text-[13px] leading-relaxed text-ink-700">
                      {example.bad}
                    </p>
                  </div>
                  <div className="flex items-start gap-3 bg-green-50/50 px-4 py-3">
                    <ThumbsUp size={15} className="mt-0.5 shrink-0 text-good" />
                    <p className="text-[13px] leading-relaxed text-ink-800">
                      {example.good}
                    </p>
                  </div>
                    <p className="border-t border-ink-100 px-4 py-2.5 text-[12px] leading-relaxed text-ink-500">
                      {example.why}
                    </p>
                  </Card>
                </Interactive>
              ))}
            </div>

            <div className="mt-6">
              <Callout tone="info" title={content.bulletNoNumbersTitle}>
                {content.bulletNoNumbersBody}
              </Callout>
            </div>
          </Reveal>

          {/* ============================================================ */}
          {/* 5. Panjang dan ukuran kertas                                 */}
          {/* ============================================================ */}
          <Reveal as="section" className="mt-16">
            <h2 className="text-xl font-bold text-ink-900 sm:text-2xl">
              {content.lengthTitle}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-600">
              {content.lengthIntro}
            </p>
            <ul className="mt-4 space-y-3">
              {content.lengthPoints.map((point) => (
                <li
                  key={point.slice(0, 40)}
                  className="flex gap-2.5 text-sm leading-relaxed text-ink-600"
                >
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-ink-400" />
                  {point}
                </li>
              ))}
            </ul>
          </Reveal>

          {/* ============================================================ */}
          {/* 6. Membandingkan CV                                          */}
          {/* ============================================================ */}
          <Reveal as="section" className="mt-16">
            <h2 className="text-xl font-bold text-ink-900 sm:text-2xl">
              {content.compareTitle}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-600">
              {content.compareIntro}
            </p>

            <ol className="mt-5 space-y-3">
              {content.compareSteps.map((step, index) => (
                <li key={step.slice(0, 30)} className="flex gap-3">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-ink-100 text-[11px] font-bold text-ink-700">
                    {index + 1}
                  </span>
                  <p className="text-sm leading-relaxed text-ink-600">{step}</p>
                </li>
              ))}
            </ol>

            <div className="mt-5 flex gap-3 rounded-xl border border-ink-200 bg-ink-50 p-4">
              <ShieldCheck
                size={17}
                className="mt-0.5 shrink-0 text-ink-700"
                aria-hidden
              />
              <p className="text-xs leading-relaxed text-ink-600">
                {content.compareNote}
              </p>
            </div>

            <Link href="/bandingkan" className="mt-5 inline-block">
              <Button variant="outline" className="press">
                {t.nav.compare}
                <ArrowRight size={15} />
              </Button>
            </Link>
          </Reveal>

          {/* ============================================================ */}
          {/* 7. Penanganan masalah                                        */}
          {/* ============================================================ */}
          <Reveal as="section" className="mt-16">
            <h2 className="text-xl font-bold text-ink-900 sm:text-2xl">
              {content.troubleTitle}
            </h2>

            <div className="mt-6 space-y-3">
              {content.trouble.map((item) => (
                <details
                  key={item.q}
                  className="group rounded-xl border border-ink-200 bg-white"
                >
                  <summary className="flex cursor-pointer list-none items-start gap-3 px-4 py-3.5 text-sm font-semibold text-ink-900">
                    <CircleAlert
                      size={15}
                      className="mt-0.5 shrink-0 text-ink-400"
                    />
                    <span className="flex-1">{item.q}</span>
                    <ChevronRight
                      size={15}
                      aria-hidden
                      className="shrink-0 text-ink-400 transition-transform group-open:rotate-90"
                    />
                  </summary>
                  <p className="border-t border-ink-100 px-4 py-3.5 pl-12 text-[13px] leading-relaxed text-ink-600">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </Reveal>

          {/* ============================================================ */}
          {/* Ajakan                                                        */}
          {/* ============================================================ */}
          <Reveal className="mt-16">
            <Card className="flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <Lightbulb size={20} className="mt-0.5 shrink-0 text-ink-700" />
                <div>
                  <p className="text-sm font-semibold text-ink-900">
                    {content.ctaTitle}
                  </p>
                  <p className="mt-1 text-[13px] leading-relaxed text-ink-600">
                    {content.ctaBody}
                  </p>
                </div>
              </div>
              <Link
                href="/login"
                className="w-full sm:w-auto"
              >
                <Button className="press w-full sm:w-auto">
                  {signedIn ? content.ctaButtonSignedIn : content.ctaButton}
                  <ArrowRight size={16} />
                </Button>
              </Link>
            </Card>
          </Reveal>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

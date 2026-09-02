import type { Metadata } from "next";
import { Download, FileImage, FileType2 } from "lucide-react";
import { auth } from "@/auth";
import { Breadcrumb } from "@/components/Breadcrumb";
import { DiagramView } from "@/components/Diagram";
import { PublicHeader } from "@/components/PublicHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Interactive, Reveal } from "@/components/motion";
import { Card } from "@/components/ui";
import { DIAGRAMS, KIND_LABEL, type NodeKind } from "@/lib/diagrams";
import { getT } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT();
  return { title: t.flow.metaTitle, description: t.flow.metaDescription };
}

/** Penjelasan singkat tiap bentuk simpul, untuk keterangan di bawah diagram. */
const LEGEND: Record<NodeKind, { id: string; en: string }> = {
  start: {
    id: "Titik awal alur.",
    en: "Where the flow begins.",
  },
  process: {
    id: "Langkah yang dikerjakan pengguna atau sistem.",
    en: "A step performed by the user or the system.",
  },
  decision: {
    id: "Percabangan - alur berlanjut sesuai jawabannya.",
    en: "A branch - the flow continues according to the answer.",
  },
  data: {
    id: "Data yang dibaca atau ditulis.",
    en: "Data being read or written.",
  },
  browser: {
    id: "Berjalan sepenuhnya di peramban pengguna.",
    en: "Runs entirely inside the user's browser.",
  },
  end: {
    id: "Titik akhir alur.",
    en: "Where the flow ends.",
  },
};

export default async function FlowPage() {
  const session = await auth();
  const { locale, t } = await getT();

  return (
    <div className="flex min-h-full flex-col bg-white">
      <PublicHeader signedIn={Boolean(session?.user?.id)} />

      <main className="flex-1">
        <div className="mx-auto w-full max-w-4xl px-5 py-12 sm:py-16">
          <Reveal>
            <Breadcrumb
              label={t.nav.breadcrumb}
              items={[
                { href: "/", label: t.nav.home },
                { label: t.flow.title },
              ]}
              className="mb-3"
            />
            <h1 className="text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">
              {t.flow.title}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-600">
              {t.flow.subtitle}
            </p>
          </Reveal>

          {/* Keterangan bentuk ------------------------------------------- */}
          <Reveal delay={80}>
            <Interactive className="mt-8">
              <Card className="p-5">
              <h2 className="text-sm font-semibold text-ink-900">
                {t.flow.legendTitle}
              </h2>
              <p className="mt-1.5 text-xs leading-relaxed text-ink-600">
                {t.flow.legendNote}
              </p>
              <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                {(Object.keys(LEGEND) as NodeKind[]).map((kind) => (
                  <div key={kind} className="flex gap-2.5">
                    <dt className="shrink-0 text-[10px] font-semibold tracking-wide text-ink-500 uppercase">
                      {KIND_LABEL[locale][kind]}
                    </dt>
                    <dd className="text-xs leading-relaxed text-ink-600">
                      {LEGEND[kind][locale]}
                    </dd>
                  </div>
                ))}
              </dl>
              </Card>
            </Interactive>
          </Reveal>

          {/* Diagram ------------------------------------------------------ */}
          {DIAGRAMS.map((diagram, index) => (
            <Reveal
              as="section"
              key={diagram.id}
              delay={index === 0 ? 0 : 60}
              className="mt-14"
            >
              <h2 className="text-lg font-bold text-ink-900">
                {diagram.title[locale]}
              </h2>
              <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-ink-600">
                {diagram.description[locale]}
              </p>

              <div className="mt-6 rounded-2xl border border-ink-200 bg-ink-50 p-4 sm:p-6">
                <DiagramView diagram={diagram} locale={locale} />
              </div>

              {/* Unduhan gambar. Dibangkitkan skrip `npm run diagram` dari
                  data yang sama dengan diagram di atasnya. */}
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="mr-1 inline-flex items-center gap-1.5 text-xs font-semibold text-ink-700">
                  <Download size={13} aria-hidden />
                  {t.flow.downloadTitle}
                </span>
                <a
                  href={`/diagram/${diagram.id}-${locale}.svg`}
                  download
                  className="inline-flex items-center gap-1.5 rounded-lg border border-ink-300 px-2.5 py-1.5 text-xs font-medium text-ink-700 transition-colors hover:bg-ink-100"
                >
                  <FileType2 size={13} aria-hidden />
                  {t.flow.downloadSvg}
                </a>
                <a
                  href={`/diagram/${diagram.id}-${locale}.png`}
                  download
                  className="inline-flex items-center gap-1.5 rounded-lg border border-ink-300 px-2.5 py-1.5 text-xs font-medium text-ink-700 transition-colors hover:bg-ink-100"
                >
                  <FileImage size={13} aria-hidden />
                  {t.flow.downloadPng}
                </a>
              </div>
            </Reveal>
          ))}

          <p className="mt-10 text-[11px] leading-relaxed text-ink-500">
            {t.flow.downloadNote}
          </p>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

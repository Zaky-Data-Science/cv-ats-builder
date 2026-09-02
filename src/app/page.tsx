import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  FileDown,
  FileText,
  Gauge,
  LayoutList,
  MousePointerClick,
  Ruler,
  Save,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  Upload,
} from "lucide-react";
import { ResumeDocument } from "@/components/preview/ResumeDocument";
import { PublicHeader } from "@/components/PublicHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { CountUp, Interactive, Reveal, TiltCard } from "@/components/motion";
import { Badge, Button, Card } from "@/components/ui";
import { auth } from "@/auth";
import { getT } from "@/lib/i18n/server";
import { sampleResume } from "@/lib/resume/sample";
import {
  TEMPLATE_INFO,
  TEMPLATE_ORDER,
  templateStyle,
} from "@/lib/resume/templates";
import { SITE, SITE_META } from "@/lib/site";
import type { TemplateId } from "@/lib/resume/types";

export async function generateMetadata(): Promise<Metadata> {
  const { locale } = await getT();
  return {
    title: `${SITE.name} - ${SITE_META[locale].tagline}`,
    description: SITE_META[locale].description,
  };
}

/* -------------------------------------------------------------------------- */

export default async function LandingPage() {
  const session = await auth();
  const { locale, t } = await getT();
  const signedIn = Boolean(session?.user?.id);
  const example = sampleResume("", locale);

  const steps = [
    { icon: LayoutList, title: t.home.step1Title, body: t.home.step1Body },
    {
      icon: MousePointerClick,
      title: t.home.step2Title,
      body: t.home.step2Body,
    },
    { icon: Gauge, title: t.home.step3Title, body: t.home.step3Body },
    { icon: FileDown, title: t.home.step4Title, body: t.home.step4Body },
  ];

  const features = [
    { icon: LayoutList, title: t.home.feature1Title, body: t.home.feature1Body },
    { icon: Ruler, title: t.home.feature2Title, body: t.home.feature2Body },
    { icon: Save, title: t.home.feature3Title, body: t.home.feature3Body },
    { icon: Gauge, title: t.home.feature4Title, body: t.home.feature4Body },
    { icon: ScanSearch, title: t.home.feature5Title, body: t.home.feature5Body },
    {
      icon: ShieldCheck,
      title: t.home.feature6Title,
      body: t.home.feature6Body,
    },
  ];

  const withoutPhoto = TEMPLATE_ORDER.filter(
    (id) => templateStyle(id).photo === "none",
  );
  const withPhoto = TEMPLATE_ORDER.filter(
    (id) => templateStyle(id).photo !== "none",
  );

  return (
    <div className="flex min-h-full flex-col bg-white">
      {/* Tautan lompat untuk pengguna papan ketik dan pembaca layar. */}
      <a
        href="#konten"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-lg focus:bg-ink-900 focus:px-4 focus:py-2 focus:text-sm focus:text-white"
      >
        {t.home.skipToContent}
      </a>

      <PublicHeader signedIn={signedIn} />

      <main id="konten" className="flex-1">
        {/* ================================================================ */}
        {/* Hero                                                             */}
        {/* ================================================================ */}
        <section className="relative overflow-hidden">
          {/*
            Latar dekoratif. Pada palet monokrom, kabut ini tidak lagi berupa
            warna melainkan perbedaan terang-gelap yang sangat tipis - cukup
            untuk memberi kedalaman tanpa memaksa mata membaca sesuatu di sana.
          */}
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="pulse-glow absolute -top-32 -right-24 h-[28rem] w-[28rem] rounded-full bg-ink-200 blur-3xl" />
            <div className="pulse-glow absolute top-40 -left-32 h-80 w-80 rounded-full bg-ink-100 blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-6xl px-4 pt-12 pb-16 sm:px-5 sm:pt-16 lg:pt-20 lg:pb-24">
            <div className="grid items-center gap-12 lg:grid-cols-[1.02fr_0.98fr] lg:gap-10">
              <Reveal>
                <Badge>
                  <Sparkles size={12} className="mr-1" />
                  {t.home.heroBadge}
                </Badge>

                <h1 className="mt-4 text-[2.1rem] leading-[1.1] font-bold tracking-tight text-ink-900 sm:text-5xl lg:text-[3.4rem]">
                  {t.home.heroTitleLine1}
                  <br />
                  {/*
                    Penekanan dibuat dengan garis bawah tipis, bukan warna.
                    Pada tema hitam-putih, mewarnai satu baris judul akan
                    menjadi satu-satunya warna di seluruh halaman - dan justru
                    terlihat seperti kekeliruan.
                  */}
                  <span className="underline decoration-ink-300 decoration-[3px] underline-offset-[6px]">
                    {t.home.heroTitleLine2}
                  </span>
                  <br />
                  {t.home.heroTitleLine3}
                </h1>

                {/*
                  Tidak mencantumkan statistik "sekian persen CV ditolak ATS"
                  yang beredar luas: angka itu tidak punya sumber primer yang
                  dapat diverifikasi. Yang disampaikan hanya mekanisme yang
                  memang dapat dibuktikan kerjanya oleh aplikasi ini.
                */}
                <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-ink-600 sm:text-base">
                  {t.home.heroBody}
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Link href="/login">
                    <Button size="lg" className="press w-full sm:w-auto">
                      {signedIn ? t.home.heroCtaDashboard : t.home.heroCtaNew}
                      <ArrowRight size={18} />
                    </Button>
                  </Link>
                  <Link href="/bandingkan">
                    <Button
                      variant="outline"
                      size="lg"
                      className="press w-full sm:w-auto"
                    >
                      {t.home.heroCtaCompare}
                    </Button>
                  </Link>
                </div>

                <dl className="mt-10 grid max-w-lg grid-cols-4 gap-3 border-t border-ink-200 pt-6 sm:gap-5">
                  {[
                    { to: 11, label: t.home.statSections },
                    { to: 10, label: t.home.statTemplates },
                    { to: 5, label: t.home.statDimensions },
                    { to: 4, label: t.home.statFormats },
                  ].map((stat) => (
                    <div key={stat.label}>
                      <dt className="text-2xl font-bold text-ink-900 sm:text-3xl">
                        <CountUp to={stat.to} />
                      </dt>
                      <dd className="mt-0.5 text-[11px] leading-tight text-ink-500">
                        {stat.label}
                      </dd>
                    </div>
                  ))}
                </dl>
              </Reveal>

              {/* ---------------------------------------------------------- */}
              {/* Kartu CV 3D                                                 */}
              {/* ---------------------------------------------------------- */}
              <Reveal delay={120} className="scene justify-self-center">
                <TiltCard className="relative">
                  <div className="relative overflow-hidden rounded-xl border border-ink-200 bg-white shadow-2xl">
                    {/*
                      Lebar wadah dihitung dari skalanya (210mm x skala),
                      bukan ditetapkan terpisah. Dengan begitu halaman A4 yang
                      diperkecil selalu mengisi wadahnya dengan pas di setiap
                      ukuran layar, tanpa menyisakan celah kosong.
                    */}
                    <div
                      className="mx-auto [--doc-scale:0.36] xs:[--doc-scale:0.42] sm:[--doc-scale:0.5]"
                      style={{
                        width: "calc(210mm * var(--doc-scale))",
                        aspectRatio: "210 / 297",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: "210mm",
                          transformOrigin: "top left",
                          transform: "scale(var(--doc-scale))",
                        }}
                      >
                        <ResumeDocument data={example} printMode />
                      </div>
                    </div>
                    <span className="tilt-sheen" aria-hidden />
                  </div>

                  {/* Lencana yang melayang di depan kartu. */}
                  <div
                    aria-hidden
                    className="layer-front float-slow absolute -top-4 -left-4 rounded-xl border border-ink-200 bg-white px-3 py-2 shadow-xl sm:-top-5 sm:-left-6"
                  >
                    <div className="flex items-center gap-2">
                      <span className="grid h-8 w-8 place-items-center rounded-full bg-ink-900 text-xs font-bold text-white">
                        98
                      </span>
                      <span className="text-[11px] leading-tight font-semibold text-ink-700">
                        {t.home.heroBadgeScore}
                        <span className="block font-normal text-ink-500">
                          {t.home.heroBadgeGrade}
                        </span>
                      </span>
                    </div>
                  </div>

                  <div
                    aria-hidden
                    className="layer-mid absolute -right-3 -bottom-4 rounded-xl border border-ink-200 bg-white px-3 py-2 shadow-xl sm:-right-6"
                  >
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 size={14} className="text-good" />
                      <span className="text-[11px] font-semibold text-ink-700">
                        {t.home.heroBadgeSaved}
                      </span>
                    </div>
                  </div>
                </TiltCard>

                <p className="mt-5 text-center text-[11px] text-ink-500">
                  {t.home.heroCaption}
                </p>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* Dua cara memakainya                                              */}
        {/* ================================================================ */}
        <section className="border-y border-ink-200 bg-ink-50 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-5">
            <Reveal>
              <h2 className="text-2xl font-bold text-ink-900 sm:text-3xl">
                {t.home.pathsTitle}
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-ink-600">
                {t.home.pathsBody}
              </p>
            </Reveal>

            <div className="mt-10 grid gap-4 md:grid-cols-2">
              <Reveal>
                <Interactive>
                  <Card className="flex h-full flex-col p-6">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-ink-900 text-white">
                    <FileText size={19} />
                  </span>
                  <h3 className="mt-4 text-base font-semibold text-ink-900">
                    {t.home.pathBuildTitle}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-600">
                    {t.home.pathBuildBody}
                  </p>
                    <Link href="/login" className="mt-5">
                      <Button className="press">
                        {t.home.pathBuildCta}
                        <ArrowRight size={15} />
                      </Button>
                    </Link>
                  </Card>
                </Interactive>
              </Reveal>

              <Reveal delay={90}>
                <Interactive>
                  <Card className="flex h-full flex-col p-6">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-ink-900 text-white">
                    <Upload size={19} />
                  </span>
                  <h3 className="mt-4 text-base font-semibold text-ink-900">
                    {t.home.pathCompareTitle}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-600">
                    {t.home.pathCompareBody}
                  </p>
                    <Link href="/bandingkan" className="mt-5">
                      <Button variant="outline" className="press">
                        {t.home.pathCompareCta}
                        <ArrowRight size={15} />
                      </Button>
                    </Link>
                  </Card>
                </Interactive>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* Cara kerja                                                       */}
        {/* ================================================================ */}
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-5">
            <Reveal>
              <h2 className="text-2xl font-bold text-ink-900 sm:text-3xl">
                {t.home.stepsTitle}
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-ink-600">
                {t.home.stepsBody}
              </p>
            </Reveal>

            <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((step, index) => (
                <Reveal as="li" key={step.title} delay={index * 90}>
                  <Interactive>
                    <Card className="h-full p-5 transition-shadow hover:shadow-md">
                    <div className="flex items-center justify-between">
                      <span className="grid h-9 w-9 place-items-center rounded-lg bg-ink-100 text-ink-800">
                        <step.icon size={18} />
                      </span>
                      <span className="text-3xl font-bold text-ink-200">
                        {index + 1}
                      </span>
                    </div>
                    <h3 className="mt-4 text-sm font-semibold text-ink-900">
                      {step.title}
                    </h3>
                      <p className="mt-1.5 text-[13px] leading-relaxed text-ink-600">
                        {step.body}
                      </p>
                    </Card>
                  </Interactive>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        {/* ================================================================ */}
        {/* Fitur                                                            */}
        {/* ================================================================ */}
        <section className="border-y border-ink-200 bg-ink-50 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-5">
            <Reveal>
              <h2 className="text-2xl font-bold text-ink-900 sm:text-3xl">
                {t.home.featuresTitle}
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-ink-600">
                {t.home.featuresBody}
              </p>
            </Reveal>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <Reveal key={feature.title} delay={(index % 3) * 80}>
                  <Interactive>
                    <Card className="h-full p-5 transition-shadow hover:shadow-md">
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-ink-100 text-ink-800">
                      <feature.icon size={18} />
                    </span>
                    <h3 className="mt-4 text-sm font-semibold text-ink-900">
                      {feature.title}
                    </h3>
                      <p className="mt-1.5 text-[13px] leading-relaxed text-ink-600">
                        {feature.body}
                      </p>
                    </Card>
                  </Interactive>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* Template                                                         */}
        {/* ================================================================ */}
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-5">
            <Reveal>
              <h2 className="text-2xl font-bold text-ink-900 sm:text-3xl">
                {t.home.templatesTitle}
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-ink-600">
                {t.home.templatesBody}
              </p>
            </Reveal>

            <TemplateGrid
              ids={withoutPhoto}
              heading={t.home.templatesWithoutPhoto}
              locale={locale}
              example={example}
            />

            <TemplateGrid
              ids={withPhoto}
              heading={t.home.templatesWithPhoto}
              locale={locale}
              example={example}
              note={t.home.templatesPhotoNote}
            />
          </div>
        </section>

        {/* ================================================================ */}
        {/* Pertanyaan yang sering muncul                                    */}
        {/* ================================================================ */}
        <section className="border-t border-ink-200 bg-ink-50 py-16 sm:py-20">
          <div className="mx-auto max-w-3xl px-4 sm:px-5">
            <Reveal>
              <h2 className="text-2xl font-bold text-ink-900 sm:text-3xl">
                {t.home.faqTitle}
              </h2>
              <p className="mt-2 text-sm text-ink-600">{t.home.faqBody}</p>
            </Reveal>

            <div className="mt-8 space-y-3">
              {t.faq.map((item, index) => (
                <Reveal key={item.q} delay={index * 40}>
                  {/*
                    Memakai elemen details bawaan HTML, bukan komponen buatan
                    sendiri: sudah dapat dioperasikan papan ketik, dikenali
                    pembaca layar, dan tetap dapat dibuka meski JavaScript
                    gagal dimuat.
                  */}
                  <details className="group rounded-xl border border-ink-200 bg-white">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-semibold text-ink-900">
                      {item.q}
                      <ChevronRight
                        size={15}
                        aria-hidden
                        className="shrink-0 text-ink-400 transition-transform group-open:rotate-90"
                      />
                    </summary>
                    <p className="border-t border-ink-100 px-5 py-4 text-[13px] leading-relaxed text-ink-600">
                      {item.a}
                    </p>
                  </details>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* Ajakan penutup                                                   */}
        {/* ================================================================ */}
        <section className="border-t border-ink-200 bg-ink-900 py-16 sm:py-20">
          <div className="mx-auto max-w-2xl px-4 text-center sm:px-5">
            <Reveal>
              <h2 className="text-2xl font-bold text-white sm:text-3xl">
                {t.home.ctaTitle}
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-ink-300">
                {t.home.ctaBody}
              </p>
              <Link href="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="press mt-8 border-ink-700 bg-white text-ink-900"
                >
                  {signedIn ? t.home.ctaButtonSignedIn : t.home.ctaButton}
                  <ArrowRight size={18} />
                </Button>
              </Link>
              <p className="mt-4 text-[11px] text-ink-400">{t.home.ctaNote}</p>
            </Reveal>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Petak pratinjau template                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Menampilkan setiap template sebagai halaman CV sungguhan yang diperkecil,
 * bukan sebagai gambar tangkapan layar.
 *
 * Konsekuensinya nyata: pratinjau di sini tidak mungkin ketinggalan zaman.
 * Ia dirender oleh komponen dokumen yang sama dengan yang dipakai editor dan
 * halaman cetak, sehingga perubahan sekecil apa pun pada sebuah template
 * langsung terlihat di sini tanpa ada gambar yang perlu dibuat ulang.
 */
function TemplateGrid({
  ids,
  heading,
  locale,
  example,
  note,
}: {
  ids: TemplateId[];
  heading: string;
  locale: "id" | "en";
  example: ReturnType<typeof sampleResume>;
  note?: string;
}) {
  return (
    <div className="mt-10">
      <div className="flex items-center gap-3">
        <h3 className="text-xs font-semibold tracking-wide text-ink-500 uppercase">
          {heading}
        </h3>
        <hr className="hairline flex-1" />
      </div>

      {note && (
        <p className="mt-3 max-w-3xl text-[13px] leading-relaxed text-ink-600">
          {note}
        </p>
      )}

      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {ids.map((id, index) => {
          const info = TEMPLATE_INFO[locale][id];
          const style = templateStyle(id);
          const data = {
            ...example,
            template: id,
            personalInfo: {
              ...example.personalInfo,
              // Template berfoto perlu memperlihatkan tempat fotonya. Yang
              // dipakai gambar kosong bertanda abu, bukan wajah seseorang -
              // memasang wajah asing di halaman depan tidak pada tempatnya.
              showPhoto: style.photo !== "none",
              photoUrl:
                style.photo !== "none"
                  ? "data:image/svg+xml;utf8," +
                    encodeURIComponent(
                      '<svg xmlns="http://www.w3.org/2000/svg" width="120" height="160"><rect width="120" height="160" fill="#e6e6e8"/><circle cx="60" cy="60" r="26" fill="#c9c9cd"/><path d="M14 160c0-28 21-46 46-46s46 18 46 46z" fill="#c9c9cd"/></svg>',
                    )
                  : "",
            },
          };

          return (
            <Reveal key={id} delay={index * 60} className="scene">
              <TiltCard maxTilt={6}>
                <div className="overflow-hidden rounded-xl border border-ink-200 bg-white shadow-sm">
                  <div
                    className="mx-auto [--tpl-scale:0.36] xs:[--tpl-scale:0.42] sm:[--tpl-scale:0.3] lg:[--tpl-scale:0.31]"
                    style={{
                      width: "calc(210mm * var(--tpl-scale))",
                      maxWidth: "100%",
                      aspectRatio: "210 / 297",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: "210mm",
                        transformOrigin: "top left",
                        transform: "scale(var(--tpl-scale))",
                      }}
                    >
                      <ResumeDocument data={data} printMode />
                    </div>
                  </div>
                </div>
              </TiltCard>
              <h4 className="mt-3 text-sm font-semibold text-ink-900">
                {info.name}
              </h4>
              <p className="mt-1 text-[12px] leading-relaxed text-ink-600">
                {info.description}
              </p>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}

import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  FileDown,
  FileText,
  Gauge,
  Layers,
  LayoutList,
  MousePointerClick,
  Ruler,
  Save,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  Upload,
} from "lucide-react";
import { HeroStats } from "@/components/home/HeroStats";
import { PortfolioPreview } from "@/components/home/PortfolioPreview";
import { TemplatePreview } from "@/components/home/TemplatePreview";
import { InkBackground } from "@/components/ink/InkBackground";
import { InkWash } from "@/components/ink/InkWash";
import { SamuraiIntro } from "@/components/ink/SamuraiIntro";
import { PublicHeader } from "@/components/PublicHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Interactive, Reveal, TiltCard } from "@/components/motion";
import { Badge, Button, Card } from "@/components/ui";
import { auth } from "@/auth";
import { getT } from "@/lib/i18n/server";
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
    <div className="relative flex min-h-full flex-col bg-white">
      {/*
        Intro pembuka - hiasan, dan urutannya di sini mencerminkan itu: ia
        berdiri di luar <main>, tidak membungkus apa pun, dan tidak menahan
        apa pun. Halaman di belakangnya sudah utuh sejak byte pertama; bila
        JavaScript gagal, yang hilang hanya hiasannya.

        Jaring partikel TIDAK dipasang di sini. Ia dipasang di dalam panel
        hero, dan hanya di sana - dua kanvas sekaligus akan membuat salah
        satunya seluas dokumen, digambar ulang setiap bingkai untuk daerah
        yang bahkan tidak terlihat.
      */}
      <SamuraiIntro />

      {/* Tautan lompat untuk pengguna papan ketik dan pembaca layar. */}
      <a
        href="#konten"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-lg focus:bg-ink-900 focus:px-4 focus:py-2 focus:text-sm focus:text-white"
      >
        {t.home.skipToContent}
      </a>

      <PublicHeader signedIn={signedIn} />

      <main id="konten" className="relative z-[1] flex-1">
        {/* ================================================================ */}
        {/* Hero                                                             */}
        {/* ================================================================ */}
        {/*
          Hero berupa panel tersendiri, bukan bagian yang menyatu dengan
          halaman.

          Sapuan tinta dan jaring partikel harus punya batas. Dibiarkan
          mengalir ke seluruh halaman, keduanya akan berada di belakang setiap
          paragraf sampai ke footer - dan tinta di belakang teks yang harus
          dibaca berhenti menjadi rupa, berubah menjadi gangguan. `isolate`
          dan `overflow-hidden` yang memberi keduanya tempat itu; sudut
          membulat tidak pernah menjadi bagian dari alasannya.

          Panelnya karena itu penuh dari tepi ke tepi - tanpa jarak di kiri,
          kanan, maupun atas, dan tanpa sudut membulat. Jarak itu dulu
          memisahkan hero dari bilah atasnya, tetapi yang sebenarnya terjadi
          adalah hero terbaca sebagai kartu yang mengambang di atas halaman
          putih, dan sapuan tintanya terpotong sebelum sampai ke tepi layar.

          Batas bawahnya diserahkan ke bagian berikutnya, yang sudah memakai
          `border-y`. Menambahkan `border-b` di sini akan menghasilkan dua
          garis berdampingan.
        */}
        <section>
          <div className="hero-panel relative isolate overflow-hidden">
            <InkWash />
            <InkBackground />

            <div className="relative z-[1] mx-auto max-w-6xl px-4 pt-12 pb-16 sm:px-6 sm:pt-16 md:px-10 lg:px-12 lg:pt-20 lg:pb-24">
            {/*
              Tiga blok, bukan dua.

              Di ponsel urutannya: teks, pratinjau CV, lalu tombol dan
              statistik - pratinjaunya muncul begitu penjelasannya selesai
              dibaca, bukan setelah seluruh isi hero. Di layar lebar
              susunannya tetap dua kolom seperti sebelumnya: teks dan tombol
              bertumpuk di kolom kiri, pratinjau menempati kolom kanan
              sepanjang keduanya.

              Yang membuatnya bisa keduanya sekaligus: penempatan baris dan
              kolom baru diberikan mulai `lg:`. Di bawah itu ketiganya
              mengalir menurut urutan penulisannya - dan urutan penulisan
              itulah urutan yang benar untuk ponsel.

              Jaraknya juga dibedakan: di ponsel dari `gap`, di layar lebar
              dari `lg:mt-8` pada blok tombol - sebab di sana kedua blok itu
              satu kolom yang tidak boleh terpisah sejauh jarak antar-kolom.
            */}
            <div className="grid gap-9 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:gap-x-10 lg:gap-y-0">
              <Reveal className="lg:col-start-1 lg:row-start-1">
                <Badge>
                  <Sparkles size={12} className="mr-1" />
                  {t.home.heroBadge}
                </Badge>

                {/*
                  Ukuran judul ikut lebar layar, dengan batas atas dan bawah.

                  Nilai tetap 2,1rem terlalu besar untuk layar 320 piksel:
                  judulnya pecah menjadi lima baris dan mendorong tombol utama
                  keluar dari layar pertama. clamp() menahannya di 1,7rem pada
                  layar paling sempit dan mengembalikannya ke 2,1rem begitu ada
                  ruang. Mulai 640 piksel ukurannya diambil alih `sm:` seperti
                  sebelumnya, jadi tampilan lebar tidak bergeser sedikit pun.
                */}
                <h1 className="mt-4 text-[clamp(1.7rem,7.4vw,2.1rem)] leading-[1.12] font-bold tracking-tight text-ink-900 sm:text-5xl lg:text-[3.4rem]">
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
              </Reveal>

              {/* ---------------------------------------------------------- */}
              {/* Kartu CV 3D                                                 */}
              {/* ---------------------------------------------------------- */}
              <Reveal
                delay={120}
                className="scene justify-self-center lg:col-start-2 lg:row-span-2 lg:row-start-1"
              >
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
                        <TemplatePreview template="CLASSIC" locale={locale} />
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

              <Reveal delay={60} className="lg:col-start-1 lg:row-start-2">

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:mt-8">
                  <Link href={signedIn ? "/dashboard" : "/login"}>
                    <Button size="lg" className="press w-full sm:w-auto">
                      {signedIn ? t.home.heroCtaDashboard : t.home.heroCtaNew}
                      <ArrowRight size={18} />
                    </Button>
                  </Link>
                  <Link href="/coba">
                    <Button
                      variant="outline"
                      size="lg"
                      className="press w-full sm:w-auto"
                      title={t.guest.ctaTryHint}
                    >
                      {t.guest.ctaTry}
                    </Button>
                  </Link>
                </div>

                <HeroStats
                  prompt={t.home.statsPrompt}
                  stats={[
                    {
                      to: 11,
                      label: t.home.statSections,
                      explain: t.home.statSectionsWhy,
                    },
                    {
                      to: 5,
                      label: t.home.statPatterns,
                      explain: t.home.statPatternsWhy,
                    },
                    {
                      to: 21,
                      label: t.home.statFields,
                      explain: t.home.statFieldsWhy,
                    },
                    {
                      to: 4,
                      label: t.home.statFormats,
                      explain: t.home.statFormatsWhy,
                    },
                  ]}
                />
              </Reveal>
            </div>
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* Dua pilar: CV dan Portofolio                                     */}
        {/* ================================================================ */}
        {/*
          Dua pintu masuk yang setara, bukan satu pintu CV dengan portofolio
          sebagai anak kalimat. Keduanya kartu seukuran sama, berdampingan,
          dengan tombolnya masing-masing.

          Keduanya menuju penyusun yang sama - dan itu memang keadaannya hari
          ini: portofolio masih berupa bagian di dalam CV, bukan berkas
          tersendiri. Karena itu kartu portofolio membawa keterangannya sendiri
          (`pillarFolioNote`) yang menyebutkan hal itu apa adanya. Menjanjikan
          dua berkas sementara yang keluar satu adalah iklan kosong, dan
          pengunjung baru menyadarinya setelah selesai mengisi.
        */}
        <section className="border-y border-ink-200 bg-ink-50 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-5 md:px-8 lg:px-5">
            <Reveal>
              <h2 className="text-2xl font-bold text-ink-900 sm:text-3xl">
                {t.home.pillarsTitle}
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-ink-600">
                {t.home.pillarsBody}
              </p>
            </Reveal>

            <div className="mt-10 grid gap-4 md:grid-cols-2">
              {/* Pintu 1 - CV */}
              <Reveal>
                <Interactive>
                  <Card className="flex h-full flex-col p-6">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-ink-900 text-white">
                      <FileText size={19} />
                    </span>
                    <h3 className="mt-4 text-base font-semibold text-ink-900">
                      {t.home.pillarCvTitle}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-600">
                      {t.home.pillarCvBody}
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      <Link href={signedIn ? "/dashboard" : "/login"}>
                        <Button className="press">
                          {signedIn ? t.home.heroCtaDashboard : t.home.pillarCvCta}
                          <ArrowRight size={15} />
                        </Button>
                      </Link>
                      <Link href="/coba">
                        <Button variant="outline" className="press">
                          {t.guest.ctaTry}
                        </Button>
                      </Link>
                    </div>
                  </Card>
                </Interactive>
              </Reveal>

              {/* Pintu 2 - Portofolio */}
              <Reveal delay={90}>
                <Interactive>
                  <Card className="flex h-full flex-col p-6">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-ink-900 text-white">
                      <Layers size={19} />
                    </span>
                    <h3 className="mt-4 text-base font-semibold text-ink-900">
                      {t.home.pillarFolioTitle}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-600">
                      {t.home.pillarFolioBody}
                    </p>
                    <p className="mt-3 rounded-lg border border-ink-200 bg-ink-50 px-3 py-2 text-[12px] leading-relaxed text-ink-600">
                      {t.home.pillarFolioNote}
                    </p>
                    {/*
                      Bentuk tombolnya sengaja sama persis dengan kartu CV -
                      tombol utama ke akun, tombol kedua mencoba tanpa akun.
                      Kartu yang tombolnya lebih sedikit terbaca sebagai pilihan
                      yang kurang serius, dan itu membatalkan seluruh kalimat di
                      atasnya yang baru saja menyatakan keduanya setara.
                    */}
                    <div className="mt-5 flex flex-wrap gap-2">
                      <Link href={signedIn ? "/dashboard" : "/login"}>
                        <Button className="press">
                          {signedIn
                            ? t.home.pillarFolioCtaSignedIn
                            : t.home.pillarFolioCta}
                          <ArrowRight size={15} />
                        </Button>
                      </Link>
                      <Link href="/coba">
                        <Button variant="outline" className="press">
                          {t.guest.ctaTry}
                        </Button>
                      </Link>
                    </div>
                  </Card>
                </Interactive>
              </Reveal>
            </div>

            {/* ------------------------------------------------------------ */}
            {/* Wujud bagian portofolionya, apa adanya                        */}
            {/* ------------------------------------------------------------ */}
            {/*
              Dua pilar tidak cukup dijelaskan; yang satu harus kelihatan.
              Sebelum ini pengunjung melihat contoh CV jadi di hero, tetapi
              tidak pernah melihat portofolio - jadi separuh janji halaman ini
              tidak punya bukti apa pun di layar.

              Yang ditampilkan `ResumeDocument` sungguhan, bukan gambar. Lihat
              komentar di PortfolioPreview untuk alasannya.
            */}
            <Reveal delay={120}>
              <div className="mt-10 grid gap-6 md:grid-cols-[0.9fr_1.1fr] md:items-center">
                <div>
                  <h3 className="text-base font-semibold text-ink-900">
                    {t.home.folioPreviewTitle}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-600">
                    {t.home.folioPreviewBody}
                  </p>
                </div>
                <figure>
                  <PortfolioPreview locale={locale} />
                  <figcaption className="mt-2 text-center text-[11px] text-ink-500">
                    {t.home.folioPreviewCaption}
                  </figcaption>
                </figure>
              </div>
            </Reveal>

            {/* ------------------------------------------------------------ */}
            {/* Bedanya, berdampingan                                        */}
            {/* ------------------------------------------------------------ */}
            {/*
              Tabel - dan di sini tabel memang alat yang tepat. Larangan tabel
              berlaku pada CV yang dihasilkan, karena pengurai ATS membacanya
              berselang-seling antar-kolom; halaman promosi ini tidak pernah
              dibaca pengurai mana pun. Jangan bawa aturan yang satu ke tempat
              yang lain.

              Dibungkus wadah yang dapat digulir sendiri supaya di layar sempit
              yang bergeser tabelnya, bukan seluruh halaman.
            */}
            <Reveal delay={150}>
              <div className="mt-8 overflow-x-auto rounded-xl border border-ink-200 bg-white">
                <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-ink-200 bg-ink-50">
                      <th scope="col" className="px-4 py-3 font-medium text-ink-500">
                        <span className="sr-only">{t.home.pillarsTitle}</span>
                      </th>
                      <th scope="col" className="px-4 py-3 font-semibold text-ink-900">
                        {t.home.cmpColCv}
                      </th>
                      <th scope="col" className="px-4 py-3 font-semibold text-ink-900">
                        {t.home.cmpColFolio}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      [t.home.cmpReadLabel, t.home.cmpReadCv, t.home.cmpReadFolio],
                      [t.home.cmpAnswerLabel, t.home.cmpAnswerCv, t.home.cmpAnswerFolio],
                      [t.home.cmpFormLabel, t.home.cmpFormCv, t.home.cmpFormFolio],
                      [t.home.cmpLengthLabel, t.home.cmpLengthCv, t.home.cmpLengthFolio],
                      [t.home.cmpScoreLabel, t.home.cmpScoreCv, t.home.cmpScoreFolio],
                    ].map(([label, cv, folio]) => (
                      <tr key={label} className="border-b border-ink-100 last:border-0">
                        <th
                          scope="row"
                          className="px-4 py-3 align-top text-[13px] font-medium whitespace-nowrap text-ink-500"
                        >
                          {label}
                        </th>
                        <td className="px-4 py-3 align-top text-ink-700">{cv}</td>
                        <td className="px-4 py-3 align-top text-ink-700">{folio}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ================================================================ */}
        {/* Sudah punya CV dari tempat lain                                  */}
        {/* ================================================================ */}
        {/*
          Memindai CV yang sudah jadi bukan pilar ketiga - ia jalan masuk bagi
          orang yang belum tentu mau menyusun apa pun. Karena itu ia berdiri
          sebagai satu jalur mendatar di bawah kedua pilar, bukan kartu ketiga
          yang seukuran keduanya.
        */}
        <section className="py-14 sm:py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-5 md:px-8 lg:px-5">
            <Reveal>
              <Interactive>
                <Card className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-ink-900 text-white">
                    <Upload size={19} />
                  </span>
                  <div className="flex-1">
                    <h2 className="text-base font-semibold text-ink-900">
                      {t.home.haveCvTitle}
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-ink-600">
                      {t.home.pathCompareBody}
                    </p>
                  </div>
                  <Link href="/bandingkan" className="shrink-0">
                    <Button variant="outline" className="press w-full sm:w-auto">
                      {t.home.pathCompareCta}
                      <ArrowRight size={15} />
                    </Button>
                  </Link>
                </Card>
              </Interactive>
            </Reveal>
          </div>
        </section>

        {/* ================================================================ */}
        {/* Cara kerja                                                       */}
        {/* ================================================================ */}
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-5 md:px-8 lg:px-5">
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
          <div className="mx-auto max-w-6xl px-4 sm:px-5 md:px-8 lg:px-5">
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
          <div className="mx-auto max-w-6xl px-4 sm:px-5 md:px-8 lg:px-5">
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
            />

            <TemplateGrid
              ids={withPhoto}
              heading={t.home.templatesWithPhoto}
              locale={locale}
              note={t.home.templatesPhotoNote}
            />
          </div>
        </section>

        {/* ================================================================ */}
        {/* Pertanyaan yang sering muncul                                    */}
        {/* ================================================================ */}
        <section className="border-t border-ink-200 bg-ink-50 py-16 sm:py-20">
          <div className="mx-auto max-w-3xl px-4 sm:px-5 md:px-8 lg:px-5">
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
          <div className="mx-auto max-w-2xl px-4 text-center sm:px-5 md:px-8 lg:px-5">
            <Reveal>
              <h2 className="text-2xl font-bold text-white sm:text-3xl">
                {t.home.ctaTitle}
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-ink-300">
                {t.home.ctaBody}
              </p>
              <Link href={signedIn ? "/dashboard" : "/login"}>
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
  note,
}: {
  ids: TemplateId[];
  heading: string;
  locale: "id" | "en";
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
                      <TemplatePreview template={id} locale={locale} />
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

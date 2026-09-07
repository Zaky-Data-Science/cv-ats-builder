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
import { HeroStats } from "@/components/home/HeroStats";
import { HeroTemplateCarousel } from "@/components/home/HeroTemplateCarousel";
import { PilihDesain } from "@/components/home/PilihDesain";
import { TemplatePreview } from "@/components/home/TemplatePreview";
import { InkBackground } from "@/components/ink/InkBackground";
import { HeroGlow } from "@/components/ink/HeroGlow";
import { SamuraiIntro } from "@/components/ink/SamuraiIntro";
import { PublicHeader } from "@/components/PublicHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Interactive, Reveal, TiltCard } from "@/components/motion";
import { Badge, buttonClass, Card } from "@/components/ui";
import { auth } from "@/auth";
import { getT } from "@/lib/i18n/server";
import {
  TEMPLATE_INFO,
  TEMPLATE_ORDER,
  templateStyle,
} from "@/lib/resume/templates";
import { RUJUKAN } from "@/lib/rujukan";
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
          <div className="hero-panel hero-satu-layar relative isolate overflow-hidden">
            <HeroGlow />
            <InkBackground />

            <div className="wadah relative z-[1] w-full py-10 sm:py-12 lg:py-[clamp(1rem,3vh,2.5rem)]">
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
            {/*
              Hero-nya tidak memakai seluruh lebar wadahnya.

              Diukur pada 1920 sebelum dibatasi: tulisan di kiri berakhir di
              874 piksel sementara kartu CV baru mulai di 1412 - celah kosong
              selebar 538 piksel tepat di tengah, sementara kedua bloknya
              justru menempel ke tepi kiri dan kanan layar. Dilaporkan begitu:
              "terlalu banyak space kosong di tengah".

              Batas 88rem membuat keduanya bergeser masuk dan mendekat satu
              sama lain. Kolom kanan pun berubah dari pecahan menjadi `auto`:
              ia kini selebar kartunya sendiri, bukan separuh layar yang
              sebagian besar isinya kosong.

              Angkanya sempat 94rem, dan itu masih menyisakan 218 piksel
              kosong di tengah - masih terbaca menganga. 88rem menutupnya
              sampai sekitar seratus piksel, yang terbaca sebagai jarak antar
              dua blok, bukan sebagai lubang.

              Bilah atas tidak ikut - ia tetap memakai `.wadah` penuh, dan
              logonya tetap 48 piksel dari tepi seperti yang diminta
              sebelumnya. Yang dibatasi isi hero-nya saja.
            */}
            <div className="mx-auto grid w-full max-w-[92rem] gap-7 sm:gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-x-10 lg:gap-y-0 xl:gap-x-12">
              {/*
                Kolom kiri dibungkus SATU wadah, dan wadah itu `display:contents`
                di bawah `lg`.

                Sebabnya jarak tegak. Sebelum ini ketiga blok kiri menempati tiga
                baris grid tersendiri, sementara kartu CV di kanan membentang
                menutupi ketiganya - sehingga tinggi kartu itulah yang menentukan
                tinggi ketiga baris tadi. Diukur pada 1920: jarak antara tombol
                dan statistik melar sampai sekitar 160 piksel, jauh dari 36-48
                yang dimaksudkan, dan barisan angkanya terbaca terlepas dari
                tombol di atasnya.

                Dengan wadah ini kolom kiri menjadi satu sel yang tingginya
                ditentukan isinya sendiri, jadi jaraknya kembali persis seperti
                yang ditulis. `display:contents` menjaga susunan ponsel tetap
                utuh: di bawah `lg` wadahnya tidak menghasilkan kotak apa pun,
                sehingga ketiga blok tetap menjadi anak langsung grid dan
                `order-*` masih dapat menyelipkan pratinjau CV di antaranya.
              */}
              <div className="contents lg:col-start-1 lg:row-start-1 lg:block">
              <Reveal className="order-1">
                <Badge>
                  <Sparkles size={12} className="mr-1" />
                  {t.home.heroBadge}
                </Badge>

                {/*
                  Ukuran judul ikut lebar layar, dengan batas atas dan bawah -
                  di DUA ujung, dan alasannya berbeda di masing-masing.

                  Di layar sempit: nilai tetap 2,1rem terlalu besar untuk layar
                  320 piksel - judulnya pecah menjadi lima baris dan mendorong
                  tombol utama keluar dari layar pertama. clamp() menahannya di
                  1,7rem pada layar paling sempit dan mengembalikannya ke 2,1rem
                  begitu ada ruang.

                  Di layar lebar: nilai tetapnya dulu 3,4rem, dan pada 1920 itu
                  meleset 18 piksel. Diukur langsung - kolom hero 900 piksel,
                  sementara "Format ATS-nya biar kami yang urus" menuntut 918.
                  Selisih setipis itu membuat satu kata jatuh sendirian ke baris
                  ketiga. Dilaporkan zaky: "yang atas benar tapi 2 dan 3 nya
                  agak numpuk sendiri".

                  Yang dipakai karena itu clamp() lagi, bukan angka tetap yang
                  lebih kecil: kolom hero ikut menyempit bersama layarnya - 900
                  piksel pada 1920, 756 pada 1280 - sehingga satu angka tetap
                  yang muat di salah satunya pasti meleset di yang lain.

                  `text-wrap: balance` sempat dicoba lebih dulu dan TIDAK
                  berpengaruh sama sekali: Chromium mematikannya begitu blok
                  itu memuat `<br>`, dan judul ini memang punya satu.
                */}
                <h1 className="mt-4 text-[clamp(1.7rem,7.4vw,2.1rem)] leading-[1.12] font-bold tracking-tight text-ink-900 sm:text-5xl lg:text-[clamp(2.2rem,3.4vw,3.25rem)]">
                  {t.home.heroTitleLine1}
                  <br />
                  {/*
                    TANPA penekanan apa pun, dan itu keputusan yang disengaja.

                    "Format ATS-nya" dulu digarisbawahi tipis - garis, bukan
                    warna, sebab pada tema hitam-putih mewarnai satu baris judul
                    akan menjadi satu-satunya warna di seluruh halaman.

                    Garis itu dibuang atas permintaan zaky: "aku mau hapus, sama
                    ratakan, gk pake garis di bawah kalimatnya". Judulnya kini
                    satu gaya dari awal sampai akhir.

                    Kedua untaiannya tetap terpisah di kamus bahasa - lihat
                    catatan `<br className="lg:hidden" />` di bawah, yang masih
                    memerlukan batas antara keduanya untuk mematahkan barisnya
                    di layar sempit. Jadi jangan menggabungkan
                    `heroTitleLine2` dan `heroTitleLine3` menjadi satu kunci.
                  */}
                  {t.home.heroTitleLine2}{" "}
                  {/*
                    Baris ketiga tidak dipatahkan sendiri DI LAYAR LEBAR, dan
                    ini sengaja.

                    Sebelumnya ada `<br />` di sini, sehingga judulnya selalu
                    tiga baris: satu baris panjang lalu dua baris pendek yang
                    berhenti jauh sebelum baris pertama. Dilaporkan zaky sambil
                    melihat layarnya - "yang atas benar tapi 2 dan 3 nya agak
                    numpuk sendiri". Ia benar: "Format ATS-nya biar kami yang
                    urus" satu kalimat, dan mematahkannya di tengah membuat
                    baloknya bertangga tanpa alasan.

                    Sekarang patahan yang dipaksakan tinggal satu - sesudah
                    kalimat pertama, tempat kalimatnya memang berakhir. Sisanya
                    mengalir sendiri: di layar lebar ia jatuh menjadi dua baris
                    yang panjangnya berdekatan, dan di layar sempit ia membungkus
                    sendiri sesuai ruang yang ada.

                    Patahannya dipertahankan DI BAWAH `lg` saja. Di sana kolomnya
                    memang tidak cukup lebar untuk memuat kalimat itu utuh, dan
                    tanpa patahan yang ditentukan sendiri ia membelah di tempat
                    yang kebetulan - "Format ATS-nya biar kami / yang urus" -
                    sementara dengan patahan ini ia membelah di sendi
                    kalimatnya. Jumlah barisnya sama saja; yang berbeda tempat
                    belahnya. Tampilan ponsel sudah benar sebelum perubahan ini
                    dan tidak ada alasan mengubahnya.

                    Garis bawahnya tetap hanya pada "Format ATS-nya" - yang
                    ditekankan bagian itu, bukan seluruh kalimatnya.
                  */}
                  <br className="lg:hidden" />
                  {t.home.heroTitleLine3}
                </h1>

                {/*
                  Tidak mencantumkan statistik "sekian persen CV ditolak ATS"
                  yang beredar luas: angka itu tidak punya sumber primer yang
                  dapat diverifikasi. Yang disampaikan hanya mekanisme yang
                  memang dapat dibuktikan kerjanya oleh aplikasi ini.
                */}
                <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-ink-600 sm:text-base lg:max-w-none">
                  {t.home.heroBody}
                </p>
              </Reveal>


              {/*
                Tombol dan statistik DIPISAH menjadi dua blok, padahal dulu satu.

                Sebabnya urutan di ponsel: judul, penjelasan, pratinjau CV,
                tombol, lalu statistik. Selama tombol dan statistik masih satu
                blok, statistik ikut ke mana pun tombolnya pergi - dan
                pratinjau tidak dapat disisipkan di antara keduanya.

                Urutan itu sempat DIBALIK sekali, menaruh tombol sebelum
                pratinjau, atas permintaan tertulis. Zaky lalu melihatnya di
                ponsel sungguhan dan mengembalikannya: "harusnya kertasnya di
                atas, tombolnya di bawah kertas itu". Jangan membaliknya lagi
                tanpa diminta - pratinjau CV yang menjelaskan apa yang
                sebenarnya ditawarkan, dan tombol lebih meyakinkan sesudah
                orangnya melihat hasilnya.

                Urutannya diatur `order-*`, bukan dengan memindahkan JSX-nya.
                Mulai `lg` ketiganya ditempatkan tegas ke baris dan kolomnya
                masing-masing, dan penempatan tegas itu mengabaikan `order`
                sepenuhnya - jadi susunan dua kolom di layar lebar tidak
                tersentuh sama sekali.
              */}
              <Reveal delay={60} className="order-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:mt-7">
                  <Link
                    href={signedIn ? "/dashboard" : "/login"}
                    className={buttonClass({
                      size: "lg",
                      className: "press w-full sm:w-auto",
                    })}
                  >
                    {signedIn ? t.home.heroCtaDashboard : t.home.heroCtaNew}
                    <ArrowRight size={18} />
                  </Link>
                  <Link
                    href="/coba"
                    title={t.guest.ctaTryHint}
                    className={buttonClass({
                      variant: "outline",
                      size: "lg",
                      className: "press w-full sm:w-auto",
                    })}
                  >
                    {t.guest.ctaTry}
                  </Link>
                </div>
              </Reveal>

              <Reveal delay={90} className="order-4 mt-1 lg:mt-9">
                <HeroStats
                  prompt={t.home.statsPrompt}
                  stats={[
                    {
                      to: 11,
                      label: t.home.statSections,
                      explain: t.home.statSectionsWhy,
                    },
                    {
                      to: 10,
                      label: t.home.statTemplates,
                      explain: t.home.statTemplatesWhy,
                    },
                    {
                      to: 5,
                      label: t.home.statDimensions,
                      explain: t.home.statDimensionsWhy,
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
              {/* ---------------------------------------------------------- */}
              {/* Kartu CV 3D                                                 */}
              {/* ---------------------------------------------------------- */}
              <Reveal
                delay={120}
                className="order-2 scene justify-self-center lg:col-start-2 lg:row-start-1 lg:justify-self-end"
              >
                {/*
                  Kesepuluh desainnya, bukan satu - lihat catatan panjang di
                  `HeroTemplateCarousel`.

                  `TiltCard` tidak lagi membungkusnya. Kemiringan yang
                  mengikuti kursor dan jalur yang digeser jari sama-sama
                  bereaksi terhadap gerak penunjuk yang sama, dan keduanya
                  sekaligus membuat kartunya bergoyang justru saat sedang
                  digeser. Yang dipertahankan gerak yang membawa keterangan -
                  perpindahan slide-nya - bukan yang sekadar hiasan.
                */}
                <HeroTemplateCarousel
                  locale={locale}
                  teks={{
                    caption: t.home.heroCaption,
                    prev: t.home.heroPrevTemplate,
                    next: t.home.heroNextTemplate,
                    label: t.home.heroCarousel,
                    pakai: t.home.pilihDesainAria,
                    pakaiSingkat: t.home.pilihDesainPakai,
                  }}
                  signedIn={signedIn}
                  /*
                    Lencana melayang dititipkan ke carousel-nya, bukan
                    diletakkan di sebelahnya. Letaknya harus dihitung terhadap
                    kartu TENGAH, sementara panggungnya lebih lebar daripada
                    kartu itu - ditaruh di luar, keduanya menempel ke tepi
                    panggung dan terlihat terlepas dari kartunya.
                  */
                  lencana={
                    <>
                      <div className="layer-front float-slow absolute -top-3.5 -left-2.5 rounded-lg border border-ink-200 bg-white px-2.5 py-1.5 shadow-lg sm:-top-4 sm:-left-4">
                        <div className="flex items-center gap-1.5">
                          <span className="grid h-7 w-7 place-items-center rounded-full bg-ink-900 text-[11px] font-bold text-white">
                            98
                          </span>
                          <span className="text-[10px] leading-tight font-semibold text-ink-700">
                            {t.home.heroBadgeScore}
                            <span className="block font-normal text-ink-500">
                              {t.home.heroBadgeGrade}
                            </span>
                          </span>
                        </div>
                      </div>

                      <div className="layer-mid absolute -right-2.5 bottom-6 rounded-lg border border-ink-200 bg-white px-2.5 py-1.5 shadow-lg sm:-right-4">
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 size={13} className="text-good" />
                          <span className="text-[10px] font-semibold text-ink-700">
                            {t.home.heroBadgeSaved}
                          </span>
                        </div>
                      </div>
                    </>
                  }
                />
              </Reveal>
            </div>
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* Dua cara memakainya                                              */}
        {/* ================================================================ */}
        <section className="border-y border-ink-200 bg-ink-50 py-16 sm:py-20">
          <div className="wadah">
            <Reveal>
              <h2 className="text-2xl font-bold text-ink-900 sm:text-3xl">
                {t.home.pathsTitle}
              </h2>
              <p className="teks-intro mt-2 text-sm text-ink-600">
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
                    <div className="mt-5 flex flex-wrap gap-2">
                      <Link
                        href={signedIn ? "/dashboard" : "/login"}
                        className={buttonClass({ className: "press" })}
                      >
                        {signedIn ? t.home.heroCtaDashboard : t.home.pathBuildCta}
                        <ArrowRight size={15} />
                      </Link>
                      <Link
                        href="/coba"
                        className={buttonClass({
                          variant: "outline",
                          className: "press",
                        })}
                      >
                        {t.guest.ctaTry}
                      </Link>
                    </div>
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
                    <Link
                      href="/bandingkan"
                      className={buttonClass({
                        variant: "outline",
                        className: "press mt-5",
                      })}
                    >
                      {t.home.pathCompareCta}
                      <ArrowRight size={15} />
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
          <div className="wadah">
            <Reveal>
              <h2 className="text-2xl font-bold text-ink-900 sm:text-3xl">
                {t.home.stepsTitle}
              </h2>
              <p className="teks-intro mt-2 text-sm text-ink-600">
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
          <div className="wadah">
            <Reveal>
              <h2 className="text-2xl font-bold text-ink-900 sm:text-3xl">
                {t.home.featuresTitle}
              </h2>
              <p className="teks-intro mt-2 text-sm text-ink-600">
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

            {/*
              Angka yang membawa sumbernya sendiri.

              Ditaruh di sini, bukan di hero, karena di sinilah ia menjawab
              pertanyaan yang sedang muncul: kenapa aplikasi ini repot-repot
              mencocokkan CV dengan iklan lowongan. Di hero ia hanya akan
              menakut-nakuti orang yang belum tahu apa yang ditawarkan.

              Batas yang dijaga: riset ini soal kecocokan KRITERIA dengan iklan
              lowongan, bukan soal CV yang gagal dibaca karena tata letaknya.
              Kalimatnya menyebut "perusahaan yang disurvei mengakui", karena
              88% itu memang keyakinan perusahaan, bukan hasil pengukuran atas
              CV yang ditolak.
            */}
            <Reveal>
              <p className="teks-intro mt-10 border-t border-ink-200 pt-6 text-[13px] leading-relaxed text-ink-500 lg:text-center">
                {t.rujukan.matchNote}{" "}
                <a
                  href={RUJUKAN.harvard.pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="press text-ink-700 underline underline-offset-2 hover:text-ink-900"
                >
                  {t.rujukan.matchLink}
                </a>
              </p>
            </Reveal>
          </div>
        </section>

        {/* ================================================================ */}
        {/* Template                                                         */}
        {/* ================================================================ */}
        <section className="py-16 sm:py-20">
          <div className="wadah">
            <Reveal>
              <h2 className="text-2xl font-bold text-ink-900 sm:text-3xl">
                {t.home.templatesTitle}
              </h2>
              <p className="teks-intro mt-2 text-sm leading-relaxed text-ink-600">
                {t.home.templatesBody}
              </p>

              {/*
                Aturan bentuknya datang dari pihak lain, dan itu justru
                kekuatannya: dua pusat karier universitas menyimpulkan hal yang
                sama secara terpisah. Tautannya dipasang terlihat, bukan
                disembunyikan di balik ikon - angka atau aturan tanpa sumber
                yang dapat diklik terbaca persis seperti klaim viral yang
                selama ini ditolak halaman ini.
              */}
              <p className="teks-intro mt-3 text-[13px] leading-relaxed text-ink-500">
                {t.rujukan.formatNote}{" "}
                <a
                  href={RUJUKAN.usc}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="press text-ink-700 underline underline-offset-2 hover:text-ink-900"
                >
                  {t.rujukan.formatLinkUsc}
                </a>
                {" · "}
                <a
                  href={RUJUKAN.onu}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="press text-ink-700 underline underline-offset-2 hover:text-ink-900"
                >
                  {t.rujukan.formatLinkOnu}
                </a>
              </p>
            </Reveal>

            <TemplateGrid
              ids={withoutPhoto}
              heading={t.home.templatesWithoutPhoto}
              locale={locale}
              signedIn={signedIn}
              pakai={t.home.pilihDesainPakai}
            />

            <TemplateGrid
              ids={withPhoto}
              heading={t.home.templatesWithPhoto}
              locale={locale}
              note={t.home.templatesPhotoNote}
              signedIn={signedIn}
              pakai={t.home.pilihDesainPakai}
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
              <Link
                href={signedIn ? "/dashboard" : "/login"}
                className={buttonClass({
                  variant: "outline",
                  size: "lg",
                  className: "press mt-8 border-ink-700 bg-white text-ink-900",
                })}
              >
                {signedIn ? t.home.ctaButtonSignedIn : t.home.ctaButton}
                <ArrowRight size={18} />
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
  signedIn,
  pakai,
}: {
  ids: TemplateId[];
  heading: string;
  locale: "id" | "en";
  note?: string;
  /** Menentukan ke mana ketukan pada sebuah desain membawa - lihat PilihDesain. */
  signedIn: boolean;
  /** Label ajakan pada kartunya, mis. "Pakai desain ini". */
  pakai: string;
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
        <p className="teks-intro mt-3 text-[13px] leading-relaxed text-ink-600">
          {note}
        </p>
      )}


      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {ids.map((id, index) => {
          const info = TEMPLATE_INFO[locale][id];

          return (
            <Reveal key={id} delay={index * 60} className="scene">
              <PilihDesain
                template={id}
                signedIn={signedIn}
                label={info.name}
                className="group"
              >
              <TiltCard maxTilt={6}>
                <div className="relative overflow-hidden rounded-xl border border-ink-200 bg-white shadow-sm transition-shadow group-hover:shadow-md">
                  {/*
                    Ajakan yang menempel pada kartunya - lihat `.ajakan-desain`
                    di globals.css. `pointer-events-none` supaya ia tidak
                    pernah menghalangi ketukan yang justru dituju.
                  */}
                  <span className="ajakan-desain pointer-events-none absolute inset-0 z-10 grid place-items-center px-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-ink-900 px-3 py-2 text-[11px] font-semibold text-white shadow-2xl ring-1 ring-white/25">
                      {pakai}
                      <ArrowRight size={12} />
                    </span>
                  </span>
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
              <h4 className="mt-3 text-sm font-semibold text-ink-900 group-hover:underline">
                {info.name}
              </h4>
              <p className="mt-1 text-[12px] leading-relaxed text-ink-600">
                {info.description}
              </p>
              </PilihDesain>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}

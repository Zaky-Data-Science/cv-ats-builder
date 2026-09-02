import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  CheckCircle2,
  FileDown,
  FileText,
  Gauge,
  LayoutList,
  MousePointerClick,
  Save,
  ScanSearch,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { ResumeDocument } from "@/components/preview/ResumeDocument";
import { PublicHeader } from "@/components/PublicHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { CountUp, Reveal, TiltCard } from "@/components/motion";
import { Badge, Button, Card } from "@/components/ui";
import { auth } from "@/auth";
import { sampleResume } from "@/lib/resume/sample";
import { SITE } from "@/lib/site";
import type { TemplateId } from "@/lib/resume/types";

export const metadata: Metadata = {
  title: `${SITE.name} - ${SITE.tagline}`,
  description: SITE.description,
};

/* -------------------------------------------------------------------------- */
/* Data isi halaman                                                           */
/* -------------------------------------------------------------------------- */

const STEPS = [
  {
    icon: LayoutList,
    title: "Isi field satu per satu",
    body: "Tidak ada halaman kosong yang bikin bingung. Setiap data punya kolomnya sendiri - jabatan, perusahaan, periode - lengkap dengan contoh pengisian.",
  },
  {
    icon: MousePointerClick,
    title: "Lihat hasilnya seketika",
    body: "CV di sebelah kanan berubah saat Anda mengetik. Field yang sedang diisi ikut disorot di CV, jadi Anda tahu persis data itu muncul di bagian mana.",
  },
  {
    icon: Gauge,
    title: "Perbaiki lewat skor ATS",
    body: "Aplikasi menilai CV Anda dari lima sisi dan menyebutkan apa yang kurang beserta cara memperbaikinya - bukan sekadar memberi angka.",
  },
  {
    icon: FileDown,
    title: "Unduh dan lamar",
    body: "PDF dan Word untuk dikirim ke perusahaan. Datanya tetap tersimpan, jadi CV berikutnya tinggal menduplikasi dan menyesuaikan.",
  },
];

const FEATURES = [
  {
    icon: LayoutList,
    title: "Field terstruktur, bukan halaman kosong",
    body: "11 bagian CV dengan field, petunjuk pengisian, dan contoh nyata di setiap kolom. Tata letaknya diurus aplikasi.",
  },
  {
    icon: FileText,
    title: "Contoh CV yang sudah terisi",
    body: "Satu klik mengisi seluruh CV dengan contoh lengkap, supaya Anda melihat bentuk jadinya lebih dulu sebelum menimpanya dengan data sendiri.",
  },
  {
    icon: Save,
    title: "Tersimpan otomatis",
    body: "Perubahan masuk ke database kurang dari satu detik setelah Anda berhenti mengetik. Tutup browser, buka lagi bulan depan, lanjutkan dari titik terakhir.",
  },
  {
    icon: Gauge,
    title: "Skor ATS beserta alasannya",
    body: "Lima dimensi berbobot dengan saran perbaikan yang bisa diklik untuk melompat langsung ke field bermasalah.",
  },
  {
    icon: ScanSearch,
    title: "Pencocokan dengan lowongan",
    body: "Tempel iklan lowongan yang Anda incar, lalu lihat kata kunci penting mana yang belum muncul di CV Anda.",
  },
  {
    icon: ShieldCheck,
    title: "Data Anda milik Anda",
    body: "Unduh seluruh isi CV sebagai berkas JSON kapan saja, impor kembali kapan saja, atau hapus akun beserta seluruh datanya.",
  },
];

const TEMPLATES: { id: TemplateId; name: string; description: string }[] = [
  {
    id: "CLASSIC",
    name: "Classic",
    description:
      "Formal dan konservatif. Pilihan teraman untuk instansi pemerintah, BUMN, dan perusahaan besar.",
  },
  {
    id: "MODERN",
    name: "Modern",
    description:
      "Lebih lapang dengan aksen warna pada judul. Cocok untuk perusahaan teknologi dan startup.",
  },
  {
    id: "COMPACT",
    name: "Compact",
    description:
      "Paling padat. Untuk pengalaman panjang yang tetap ingin muat dalam satu sampai dua halaman.",
  },
];

const FAQ = [
  {
    q: "Apa itu ATS, dan kenapa saya perlu peduli?",
    a: "ATS (Applicant Tracking System) adalah perangkat lunak yang dipakai banyak perusahaan untuk menerima dan menyaring lamaran. Sebelum dibaca manusia, berkas CV diurai lebih dulu oleh mesin untuk diambil datanya: nama, kontak, pengalaman, keahlian. CV dengan tata letak rumit - dua kolom, tabel, teks di dalam gambar - sering terurai berantakan, sehingga kualifikasi yang sebenarnya Anda miliki tidak terbaca sistem.",
  },
  {
    q: "Apakah CV dari aplikasi ini dijamin lolos ATS?",
    a: "Tidak ada aplikasi mana pun yang bisa menjanjikan itu, dan aplikasi ini tidak menjanjikannya. Setiap perusahaan memakai produk ATS berbeda dengan pengurai yang tidak dipublikasikan. Yang dilakukan aplikasi ini adalah memastikan CV Anda memenuhi kaidah yang berlaku umum: satu kolom, tanpa tabel, judul bagian baku, format tanggal seragam, dan teks yang benar-benar berupa teks. Skor yang ditampilkan berarti \"memenuhi kaidah yang diperiksa\", bukan jaminan diterima.",
  },
  {
    q: "Apakah gratis? Ada biaya tersembunyi?",
    a: "Gratis sepenuhnya. Tidak ada versi berbayar, tidak ada batas jumlah CV, tidak ada watermark pada CV yang Anda unduh, dan tidak ada permintaan data kartu. Aplikasi ini dibangun sebagai Tugas Akhir, bukan produk komersial.",
  },
  {
    q: "Apakah CV saya akan ada tulisan atau logo aplikasi ini?",
    a: "Tidak. CV yang Anda unduh murni berisi data Anda sendiri - tanpa logo, tanpa watermark, tanpa nama aplikasi maupun pembuatnya. CV adalah dokumen milik Anda.",
  },
  {
    q: "Kalau saya tutup browser, data saya hilang?",
    a: "Tidak. Setiap perubahan tersimpan otomatis ke database kurang dari satu detik setelah Anda berhenti mengetik. Masuk kembali kapan saja dari perangkat mana saja, CV Anda tetap ada. Anda juga bisa mengunduh cadangan dalam bentuk berkas JSON.",
  },
  {
    q: "Kenapa sebaiknya foto tidak dipasang di CV?",
    a: "Sebagian besar pengurai ATS tidak dapat membaca gambar, dan tata letak di sekitar foto kerap membuat urutan teks terbaca kacau. Di banyak negara, foto juga dihindari untuk mengurangi bias dalam seleksi. Aplikasi ini tetap menyediakan opsinya - karena sebagian lowongan di Indonesia masih memintanya - tetapi memberi peringatan saat diaktifkan.",
  },
  {
    q: "Bisakah saya punya lebih dari satu CV?",
    a: "Bisa, dan memang disarankan. CV sebaiknya disesuaikan untuk setiap lowongan. Gunakan tombol duplikat, lalu ubah ringkasan dan urutan keahliannya agar cocok dengan lowongan yang dituju.",
  },
];

/* -------------------------------------------------------------------------- */

export default async function LandingPage() {
  const session = await auth();
  const signedIn = Boolean(session?.user?.id);
  const example = sampleResume();

  return (
    <div className="flex min-h-full flex-col bg-white">
      {/* Tautan lompat untuk pengguna papan ketik dan pembaca layar. */}
      <a
        href="#konten"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-lg focus:bg-ink-900 focus:px-4 focus:py-2 focus:text-sm focus:text-white"
      >
        Lompat ke konten utama
      </a>

      <PublicHeader signedIn={signedIn} />

      <main id="konten" className="flex-1">
        {/* ================================================================ */}
        {/* Hero                                                             */}
        {/* ================================================================ */}
        <section className="relative overflow-hidden">
          {/* Latar dekoratif - murni hiasan, disembunyikan dari pembaca layar. */}
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="pulse-glow absolute -top-32 -right-24 h-[28rem] w-[28rem] rounded-full bg-brand-100 blur-3xl" />
            <div className="pulse-glow absolute top-40 -left-32 h-80 w-80 rounded-full bg-ink-100 blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-6xl px-4 pt-12 pb-16 sm:px-5 sm:pt-16 lg:pt-20 lg:pb-24">
            <div className="grid items-center gap-12 lg:grid-cols-[1.02fr_0.98fr] lg:gap-10">
              <Reveal>
                <Badge tone="brand">
                  <Sparkles size={12} className="mr-1" />
                  Gratis - tanpa watermark - data tersimpan
                </Badge>

                <h1 className="mt-4 text-[2.1rem] leading-[1.1] font-bold tracking-tight text-ink-900 sm:text-5xl lg:text-[3.4rem]">
                  Isi field-nya.
                  <br />
                  <span className="text-brand-600">CV yang terbaca mesin</span>
                  <br />
                  tersusun sendiri.
                </h1>

                {/*
                  Tidak mencantumkan statistik "sekian persen CV ditolak ATS"
                  yang beredar luas: angka itu tidak punya sumber primer yang
                  dapat diverifikasi. Yang disampaikan hanya mekanisme yang
                  memang dapat dibuktikan kerjanya oleh aplikasi ini.
                */}
                <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-ink-600 sm:text-base">
                  Banyak perusahaan menyaring lamaran lewat sistem yang membaca
                  CV secara otomatis. Berkas dengan tata letak rumit - dua
                  kolom, tabel, teks di dalam gambar - kerap terbaca berantakan,
                  sehingga kualifikasi yang sebenarnya Anda miliki tidak
                  terdeteksi. Aplikasi ini menyusun CV Anda ke dalam struktur
                  yang aman dibaca mesin, lalu menilai dan menunjukkan persis
                  apa yang perlu diperbaiki.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Link href={signedIn ? "/dashboard" : "/register"}>
                    <Button size="lg" className="press w-full sm:w-auto">
                      {signedIn ? "Lanjutkan ke Dashboard" : "Mulai Buat CV"}
                      <ArrowRight size={18} />
                    </Button>
                  </Link>
                  <Link href="/panduan">
                    <Button
                      variant="outline"
                      size="lg"
                      className="press w-full sm:w-auto"
                    >
                      Lihat cara pakainya
                    </Button>
                  </Link>
                </div>

                <dl className="mt-10 grid max-w-lg grid-cols-3 gap-4 border-t border-ink-200 pt-6 sm:gap-6">
                  {[
                    { to: 11, suffix: "", label: "bagian CV" },
                    { to: 5, suffix: "", label: "dimensi penilaian" },
                    { to: 4, suffix: "", label: "format unduhan" },
                  ].map((stat) => (
                    <div key={stat.label}>
                      <dt className="text-2xl font-bold text-ink-900 sm:text-3xl">
                        <CountUp to={stat.to} suffix={stat.suffix} />
                      </dt>
                      <dd className="mt-0.5 text-[11px] leading-tight text-ink-500 sm:text-xs">
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
                      <span className="grid h-8 w-8 place-items-center rounded-full bg-green-50 text-xs font-bold text-good">
                        98
                      </span>
                      <span className="text-[11px] leading-tight font-semibold text-ink-700">
                        Skor ATS
                        <span className="block font-normal text-ink-500">
                          Nilai A
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
                        Tersimpan otomatis
                      </span>
                    </div>
                  </div>
                </TiltCard>

                <p className="mt-5 text-center text-[11px] text-ink-500">
                  Contoh hasil - template Classic
                </p>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* Cara kerja                                                       */}
        {/* ================================================================ */}
        <section className="border-y border-ink-200 bg-ink-50 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-5">
            <Reveal>
              <h2 className="text-2xl font-bold text-ink-900 sm:text-3xl">
                Empat langkah, selesai
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-ink-600">
                Anda hanya perlu mengisi. Urusan tata letak, format tanggal, dan
                struktur yang terbaca mesin sudah diurus aplikasi.
              </p>
            </Reveal>

            <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {STEPS.map((step, index) => (
                <Reveal as="li" key={step.title} delay={index * 90}>
                  <Card className="press h-full p-5 transition-shadow hover:shadow-md">
                    <div className="flex items-center justify-between">
                      <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-50 text-brand-600">
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
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        {/* ================================================================ */}
        {/* Fitur                                                            */}
        {/* ================================================================ */}
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-5">
            <Reveal>
              <h2 className="text-2xl font-bold text-ink-900 sm:text-3xl">
                Yang membedakannya dari templat Word
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-ink-600">
                Templat hanya memberi tampilan. Aplikasi ini menjaga strukturnya
                tetap terbaca mesin, menilai hasilnya, dan menyimpan datanya.
              </p>
            </Reveal>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((feature, index) => (
                <Reveal key={feature.title} delay={(index % 3) * 80}>
                  <Card className="h-full p-5 transition-shadow hover:shadow-md">
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-50 text-brand-600">
                      <feature.icon size={18} />
                    </span>
                    <h3 className="mt-4 text-sm font-semibold text-ink-900">
                      {feature.title}
                    </h3>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-ink-600">
                      {feature.body}
                    </p>
                  </Card>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* Template                                                         */}
        {/* ================================================================ */}
        <section className="border-y border-ink-200 bg-ink-50 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-5">
            <Reveal>
              <h2 className="text-2xl font-bold text-ink-900 sm:text-3xl">
                Tiga template, satu struktur
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-ink-600">
                Ketiganya satu kolom, tanpa tabel, dan memakai judul bagian
                baku - jadi tidak ada template yang &quot;lebih tidak
                terbaca&quot; dibanding yang lain. Berganti template tidak
                mengubah data Anda sedikit pun.
              </p>
            </Reveal>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {TEMPLATES.map((template, index) => (
                <Reveal key={template.id} delay={index * 90} className="scene">
                  <TiltCard maxTilt={6}>
                    <div className="overflow-hidden rounded-xl border border-ink-200 bg-white shadow-sm">
                      <div
                        className="mx-auto [--tpl-scale:0.36] xs:[--tpl-scale:0.42] sm:[--tpl-scale:0.38] lg:[--tpl-scale:0.43]"
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
                          <ResumeDocument
                            data={{ ...example, template: template.id }}
                            printMode
                          />
                        </div>
                      </div>
                    </div>
                  </TiltCard>
                  <h3 className="mt-4 text-sm font-semibold text-ink-900">
                    {template.name}
                  </h3>
                  <p className="mt-1 text-[13px] leading-relaxed text-ink-600">
                    {template.description}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* Pertanyaan yang sering muncul                                    */}
        {/* ================================================================ */}
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-3xl px-4 sm:px-5">
            <Reveal>
              <h2 className="text-2xl font-bold text-ink-900 sm:text-3xl">
                Pertanyaan yang sering muncul
              </h2>
              <p className="mt-2 text-sm text-ink-600">
                Termasuk hal-hal yang biasanya tidak diceritakan aplikasi
                sejenis.
              </p>
            </Reveal>

            <div className="mt-8 space-y-3">
              {FAQ.map((item, index) => (
                <Reveal key={item.q} delay={index * 50}>
                  {/*
                    Memakai elemen details bawaan HTML, bukan komponen buatan
                    sendiri: sudah dapat dioperasikan papan ketik, dikenali
                    pembaca layar, dan tetap dapat dibuka meski JavaScript
                    gagal dimuat.
                  */}
                  <details className="group rounded-xl border border-ink-200 bg-white">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-semibold text-ink-900">
                      {item.q}
                      <span
                        aria-hidden
                        className="shrink-0 text-ink-400 transition-transform group-open:rotate-45"
                      >
                        +
                      </span>
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
                Buat satu kali, pakai berkali-kali
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-ink-300">
                Data Anda tersimpan di akun. Untuk lowongan berikutnya,
                duplikasi CV yang sudah ada lalu sesuaikan seperlunya - tidak
                perlu mulai dari halaman kosong lagi.
              </p>
              <Link href={signedIn ? "/dashboard" : "/register"}>
                <Button size="lg" className="press mt-8">
                  {signedIn ? "Buka Dashboard" : "Daftar Gratis Sekarang"}
                  <ArrowRight size={18} />
                </Button>
              </Link>
              <p className="mt-4 text-[11px] text-ink-400">
                Tanpa biaya, tanpa watermark di CV Anda.
              </p>
            </Reveal>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

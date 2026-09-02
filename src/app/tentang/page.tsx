import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  Database,
  GraduationCap,
  Layers,
  ScrollText,
  ShieldCheck,
  TriangleAlert,
} from "lucide-react";
import { auth } from "@/auth";
import { PublicHeader } from "@/components/PublicHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Reveal } from "@/components/motion";
import { Badge, Button, Callout, Card } from "@/components/ui";
import { AUTHOR, SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Tentang Aplikasi",
  description:
    "Latar belakang, tujuan, rancangan teknis, dan batasan aplikasi pembuat CV ATS-friendly - Tugas Akhir D3 Teknik Komputer Politeknik Negeri Samarinda.",
};

const STACK = [
  {
    icon: Layers,
    title: "Antarmuka dan server",
    body: "Next.js 16 dengan TypeScript. Frontend dan backend berada dalam satu project, sehingga pemeriksaan sesi dapat dilakukan di sisi server sebelum halaman dikirim ke peramban.",
  },
  {
    icon: Database,
    title: "Basis data",
    body: "PostgreSQL dengan ORM Prisma. Enam belas tabel, seluruh tabel anak memakai ON DELETE CASCADE, dan setiap perubahan skema tercatat sebagai berkas migrasi yang dapat ditelusuri.",
  },
  {
    icon: ShieldCheck,
    title: "Autentikasi",
    body: "Auth.js dengan dua jalur masuk: email dan kata sandi (hash bcrypt 12 putaran) serta Google OAuth. Kepemilikan data diperiksa langsung pada kueri, bukan hanya disembunyikan di antarmuka.",
  },
  {
    icon: ScrollText,
    title: "Penilaian ATS",
    body: "Mesin berbasis kaidah yang deterministik - tanpa model bahasa. Masukan yang sama selalu menghasilkan skor yang sama, sehingga hasil pengujian dapat direproduksi dan setiap angka dapat ditelusuri ke aturannya.",
  },
];

const COMPARISON = [
  {
    aspect: "Struktur keluaran",
    others:
      "Bebas diatur pengguna. Tata letak dua kolom dan kotak teks lazim dipakai karena terlihat menarik.",
    ours:
      "Dikunci pada satu kolom tanpa tabel dan kotak teks, dengan judul bagian baku.",
  },
  {
    aspect: "Umpan balik",
    others: "Umumnya hanya menyediakan templat; penilaian kerap fitur berbayar.",
    ours:
      "Penilaian lima dimensi beserta saran perbaikan yang menunjuk ke field tertentu, tersedia tanpa biaya.",
  },
  {
    aspect: "Kepemilikan data",
    others:
      "Data tersimpan di layanan penyedia; ekspor mentah tidak selalu tersedia.",
    ours:
      "Seluruh isi CV dapat diunduh sebagai berkas JSON dan diimpor kembali kapan saja.",
  },
  {
    aspect: "Keluaran akhir",
    others: "Sebagian menambahkan watermark pada versi gratis.",
    ours: "Tanpa watermark, tanpa batas jumlah CV.",
  },
  {
    aspect: "Bahasa dan konteks",
    others:
      "Mayoritas berbahasa Inggris dengan konvensi CV luar negeri.",
    ours:
      "Berbahasa Indonesia, mengenali kata kerja aksi bahasa Indonesia, format IPK, dan istilah lowongan lokal.",
  },
];

const LIMITS = [
  "Penilaian mensimulasikan kaidah umum ATS, bukan satu produk ATS tertentu. Tiap vendor memiliki pengurai sendiri yang tidak dipublikasikan, sehingga skor tinggi berarti memenuhi kaidah yang diperiksa - bukan jaminan lolos seleksi.",
  "Pencocokan kata kunci bersifat leksikal. Kata \"frontend\" dan \"front-end\" dikenali berbeda, dan sinonim belum dikenali. Pencocokan semantik menjadi arah pengembangan lanjutan.",
  "Foto ditambahkan melalui tautan gambar, belum melalui unggahan berkas, karena aplikasi belum menyediakan penyimpanan berkas.",
  "Pemulihan kata sandi lewat email belum tersedia, sebab memerlukan layanan pengirim surel. Pengguna yang lupa kata sandi dapat masuk lewat Google bila emailnya sama.",
];

export default async function TentangPage() {
  const session = await auth();
  const signedIn = Boolean(session?.user?.id);

  return (
    <div className="flex min-h-full flex-col bg-white">
      <a
        href="#konten"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-lg focus:bg-ink-900 focus:px-4 focus:py-2 focus:text-sm focus:text-white"
      >
        Lompat ke konten utama
      </a>

      <PublicHeader signedIn={signedIn} />

      <main id="konten" className="flex-1">
        <section className="border-b border-ink-200 bg-ink-50">
          <div className="mx-auto max-w-4xl px-4 py-12 sm:px-5 sm:py-16">
            <Badge tone="brand">Tentang</Badge>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
              Kenapa aplikasi ini dibuat
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-600 sm:text-base">
              {SITE.name} dibangun sebagai Tugas Akhir Program Studi D3 Teknik
              Komputer, {AUTHOR.institution}.
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-5 sm:py-16">
          {/* ============================================================ */}
          {/* Latar belakang                                               */}
          {/* ============================================================ */}
          <Reveal as="section">
            <h2 className="text-xl font-bold text-ink-900 sm:text-2xl">
              Masalah yang ingin diselesaikan
            </h2>
            <div className="mt-4 space-y-4 text-sm leading-relaxed text-ink-600">
              <p>
                Banyak perusahaan menerima lamaran melalui sistem yang lebih
                dulu mengurai berkas CV secara otomatis untuk mengambil datanya:
                nama, kontak, riwayat pekerjaan, dan keahlian. Proses ini
                berjalan sebelum berkas sampai ke tangan manusia.
              </p>
              <p>
                Persoalannya, cara sebagian besar orang membuat CV justru
                menyulitkan proses tersebut. Templat yang beredar luas kerap
                memakai dua kolom, tabel, ikon sebagai pengganti teks, atau
                bahkan menyimpan seluruh isi CV sebagai gambar. Bentuk seperti
                itu terlihat rapi di layar, tetapi ketika teksnya diekstraksi
                mesin, urutan kalimatnya bisa tertukar dan sebagian isinya
                hilang sama sekali. Akibatnya, kualifikasi yang sebenarnya
                dimiliki pelamar tidak terbaca sistem.
              </p>
              <p>
                Pembuat CV daring yang sudah ada umumnya menyerahkan
                sepenuhnya urusan tata letak kepada pengguna - termasuk
                kebebasan membuat susunan yang justru gagal diurai - dan
                menempatkan fitur evaluasi di balik langganan berbayar.
                Sebagian besar juga berbahasa Inggris dan memakai konvensi CV
                luar negeri.
              </p>
            </div>
          </Reveal>

          {/* ============================================================ */}
          {/* Tujuan                                                       */}
          {/* ============================================================ */}
          <Reveal as="section" className="mt-14">
            <h2 className="text-xl font-bold text-ink-900 sm:text-2xl">
              Yang dilakukan aplikasi ini
            </h2>
            <ol className="mt-4 space-y-4">
              {[
                {
                  title: "Menutup kemungkinan salah susun sejak awal",
                  body: "Pengguna mengisi field, bukan mengatur tata letak. Seluruh template dikunci pada satu kolom tanpa tabel maupun kotak teks, dan judul bagiannya memakai istilah baku yang dikenali pengurai.",
                },
                {
                  title: "Mengubah penilaian menjadi tindakan",
                  body: "Skor tidak berhenti sebagai angka. Setiap kekurangan disertai penjelasan cara memperbaikinya dan tautan yang melompat langsung ke field bersangkutan.",
                },
                {
                  title: "Membuat data dapat dipakai berulang",
                  body: "CV tersimpan permanen dan dapat diduplikasi untuk disesuaikan per lowongan - kebiasaan yang disarankan perekrut, tetapi jarang dilakukan karena merepotkan bila harus menyusun ulang dari awal.",
                },
                {
                  title: "Menjaga data tetap milik penggunanya",
                  body: "Seluruh isi CV dapat diunduh sebagai berkas JSON dan diimpor kembali, sehingga pengguna tidak terkunci pada aplikasi ini.",
                },
              ].map((item, index) => (
                <li key={item.title} className="flex gap-4">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-600 text-xs font-bold text-white">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-ink-900">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-[13px] leading-relaxed text-ink-600">
                      {item.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>

          {/* ============================================================ */}
          {/* Perbandingan                                                 */}
          {/* ============================================================ */}
          <Reveal as="section" className="mt-14">
            <h2 className="text-xl font-bold text-ink-900 sm:text-2xl">
              Perbedaan dengan pembuat CV daring pada umumnya
            </h2>
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[38rem] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-ink-200">
                    <th className="py-2.5 pr-4 text-xs font-semibold text-ink-500">
                      Aspek
                    </th>
                    <th className="py-2.5 pr-4 text-xs font-semibold text-ink-500">
                      Umumnya
                    </th>
                    <th className="py-2.5 text-xs font-semibold text-brand-700">
                      Aplikasi ini
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON.map((row) => (
                    <tr
                      key={row.aspect}
                      className="border-b border-ink-100 align-top"
                    >
                      <td className="py-3 pr-4 font-medium text-ink-900">
                        {row.aspect}
                      </td>
                      <td className="py-3 pr-4 text-[13px] leading-relaxed text-ink-500">
                        {row.others}
                      </td>
                      <td className="py-3 text-[13px] leading-relaxed text-ink-800">
                        {row.ours}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>

          {/* ============================================================ */}
          {/* Rancangan teknis                                             */}
          {/* ============================================================ */}
          <Reveal as="section" className="mt-14">
            <h2 className="text-xl font-bold text-ink-900 sm:text-2xl">
              Rancangan teknis
            </h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {STACK.map((item) => (
                <Card key={item.title} className="p-5">
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-50 text-brand-600">
                    <item.icon size={18} />
                  </span>
                  <h3 className="mt-3.5 text-sm font-semibold text-ink-900">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-ink-600">
                    {item.body}
                  </p>
                </Card>
              ))}
            </div>
          </Reveal>

          {/* ============================================================ */}
          {/* Batasan                                                      */}
          {/* ============================================================ */}
          <Reveal as="section" className="mt-14">
            <div className="flex items-center gap-2">
              <TriangleAlert size={18} className="text-warn" />
              <h2 className="text-xl font-bold text-ink-900 sm:text-2xl">
                Batasan yang perlu diketahui
              </h2>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-ink-600">
              Disebutkan terbuka, karena mengetahui batas sebuah alat adalah
              bagian dari memakainya dengan benar.
            </p>
            <ul className="mt-5 space-y-3">
              {LIMITS.map((limit) => (
                <li
                  key={limit}
                  className="flex gap-3 rounded-lg border border-ink-200 bg-ink-50 px-4 py-3"
                >
                  <span
                    aria-hidden
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-warn"
                  />
                  <p className="text-[13px] leading-relaxed text-ink-700">
                    {limit}
                  </p>
                </li>
              ))}
            </ul>
          </Reveal>

          {/* ============================================================ */}
          {/* Pembuat                                                      */}
          {/* ============================================================ */}
          <Reveal as="section" className="mt-14">
            <h2 className="text-xl font-bold text-ink-900 sm:text-2xl">
              Pembuat
            </h2>
            <Card className="mt-5 p-6">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-ink-900 text-white">
                  <GraduationCap size={28} />
                </span>
                <div>
                  <p className="text-lg font-bold text-ink-900">
                    {AUTHOR.name}
                  </p>
                  <p className="mt-1 text-sm text-ink-600">{AUTHOR.role}</p>
                  <p className="text-sm text-ink-600">{AUTHOR.institution}</p>
                </div>
              </div>

              <div className="mt-5 border-t border-ink-100 pt-5">
                <Callout tone="info">
                  Aplikasi ini tidak membubuhkan nama pembuat, logo, maupun
                  watermark apa pun pada CV yang Anda unduh. CV adalah dokumen
                  milik Anda - mencantumkan nama pihak lain di atasnya hanya
                  akan membingungkan perekrut.
                </Callout>
              </div>
            </Card>
          </Reveal>

          <Reveal className="mt-14">
            <Card className="flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm leading-relaxed text-ink-700">
                Aplikasinya gratis dan terbuka untuk siapa pun. Silakan dicoba.
              </p>
              <Link
                href={signedIn ? "/dashboard" : "/register"}
                className="w-full sm:w-auto"
              >
                <Button className="press w-full sm:w-auto">
                  {signedIn ? "Buka Dashboard" : "Mulai Buat CV"}
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

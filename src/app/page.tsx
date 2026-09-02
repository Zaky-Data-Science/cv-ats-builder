import Link from "next/link";
import {
  ArrowRight,
  FileDown,
  FileText,
  Gauge,
  LayoutList,
  Save,
  ScanSearch,
} from "lucide-react";
import { ResumeDocument } from "@/components/preview/ResumeDocument";
import { Badge, Button, Card } from "@/components/ui";
import { auth } from "@/auth";
import { sampleResume } from "@/lib/resume/sample";
import type { TemplateId } from "@/lib/resume/types";

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

const FEATURES = [
  {
    icon: LayoutList,
    title: "Field terstruktur, bukan halaman kosong",
    body: "Setiap data punya kolomnya sendiri: jabatan, perusahaan, periode, sampai poin pencapaian. Anda tidak perlu memikirkan tata letak sama sekali.",
  },
  {
    icon: FileText,
    title: "Contoh CV yang sudah terisi",
    body: "Satu klik untuk mengisi seluruh CV dengan contoh lengkap, supaya Anda langsung melihat field yang Anda isi akan muncul di bagian mana.",
  },
  {
    icon: Save,
    title: "Tersimpan otomatis, bisa diedit kapan saja",
    body: "Data tersimpan di database begitu Anda mengetik. Tutup browser, buka lagi bulan depan, lanjutkan dari titik terakhir.",
  },
  {
    icon: Gauge,
    title: "Skor ATS beserta alasannya",
    body: "Lima dimensi penilaian dengan saran perbaikan yang konkret, bukan sekadar angka. Tempelkan iklan lowongan untuk melihat kata kunci yang belum ada di CV Anda.",
  },
  {
    icon: FileDown,
    title: "Unduh PDF, Word, teks, dan JSON",
    body: "PDF dan DOCX untuk dikirim ke perusahaan, teks polos untuk formulir daring, JSON untuk mencadangkan data Anda sendiri.",
  },
  {
    icon: ScanSearch,
    title: "Semua template lolos kaidah ATS",
    body: "Satu kolom, tanpa tabel, tanpa kotak teks, judul section baku. Perbedaan antar-template murni tipografi.",
  },
];

export default async function LandingPage() {
  const session = await auth();
  const signedIn = Boolean(session?.user?.id);
  const example = sampleResume();

  return (
    <div className="min-h-full bg-white">
      {/* ------------------------------------------------------------------ */}
      {/* Bilah atas                                                          */}
      {/* ------------------------------------------------------------------ */}
      <header className="sticky top-0 z-20 border-b border-ink-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <Link href="/" className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-ink-900 text-sm font-bold text-white">
              CV
            </span>
            <span className="text-sm font-semibold text-ink-900">
              Pembuat CV ATS-Friendly
            </span>
          </Link>

          <div className="flex items-center gap-2">
            {signedIn ? (
              <Link href="/dashboard">
                <Button size="sm">Buka Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Masuk
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">Daftar Gratis</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ------------------------------------------------------------------ */}
      {/* Hero                                                                */}
      {/* ------------------------------------------------------------------ */}
      <section className="mx-auto max-w-6xl px-5 pt-16 pb-12">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <Badge tone="brand">Gratis dan datanya tersimpan</Badge>
            <h1 className="mt-4 text-4xl leading-tight font-bold tracking-tight text-ink-900 sm:text-5xl">
              Isi field-nya.
              <br />
              CV yang terbaca mesin
              <br />
              tersusun sendiri.
            </h1>
            {/*
              Sengaja tidak mencantumkan statistik "sekian persen CV ditolak
              ATS" yang beredar luas di internet: angka tersebut tidak memiliki
              sumber primer yang dapat diverifikasi. Yang disampaikan di sini
              hanya mekanisme yang memang dapat ditunjukkan bukti kerjanya oleh
              aplikasi ini.
            */}
            <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-600">
              Banyak perusahaan menyaring lamaran lewat sistem yang membaca CV
              secara otomatis. Berkas yang tata letaknya rumit - dua kolom,
              tabel, teks di dalam gambar - kerap terbaca berantakan sehingga
              kualifikasi yang sebenarnya dimiliki pelamar tidak terbaca.
              Aplikasi ini menyusun CV Anda ke dalam struktur yang aman dibaca
              mesin, lalu menilai dan memberi tahu persis apa yang perlu
              diperbaiki.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href={signedIn ? "/dashboard" : "/register"}>
                <Button size="lg">
                  {signedIn ? "Lanjutkan ke Dashboard" : "Mulai Buat CV"}
                  <ArrowRight size={18} />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg">
                  Saya sudah punya akun
                </Button>
              </Link>
            </div>

            <dl className="mt-10 grid max-w-lg grid-cols-3 gap-6 border-t border-ink-200 pt-6">
              {[
                ["3", "template ATS"],
                ["5", "dimensi penilaian"],
                ["4", "format unduhan"],
              ].map(([value, label]) => (
                <div key={label}>
                  <dt className="text-2xl font-bold text-ink-900">{value}</dt>
                  <dd className="text-xs text-ink-500">{label}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Pratinjau CV contoh, diperkecil agar utuh satu halaman. */}
          <div className="relative hidden justify-self-center lg:block">
            <div
              className="overflow-hidden rounded-lg border border-ink-200 shadow-xl"
              style={{ width: 420, height: 594 }}
            >
              <div
                style={{
                  transform: "scale(0.529)",
                  transformOrigin: "top left",
                  width: "210mm",
                }}
              >
                <ResumeDocument data={example} printMode />
              </div>
            </div>
            <p className="mt-3 text-center text-xs text-ink-500">
              Contoh hasil - template Classic
            </p>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Fitur                                                               */}
      {/* ------------------------------------------------------------------ */}
      <section className="border-y border-ink-200 bg-ink-50 py-16">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="text-2xl font-bold text-ink-900">
            Yang membedakannya dari templat Word
          </h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, body }) => (
              <Card key={title} className="p-5">
                <Icon size={20} className="text-brand-600" />
                <h3 className="mt-3 text-sm font-semibold text-ink-900">
                  {title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                  {body}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Template                                                            */}
      {/* ------------------------------------------------------------------ */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="text-2xl font-bold text-ink-900">Tiga template</h2>
          <p className="mt-2 max-w-2xl text-sm text-ink-600">
            Ketiganya memakai satu kolom, tanpa tabel, dan memakai judul section
            baku. Anda bisa berganti template kapan saja tanpa mengetik ulang -
            datanya sama, hanya tampilannya yang berubah.
          </p>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {TEMPLATES.map((template) => (
              <div key={template.id}>
                <div className="overflow-hidden rounded-lg border border-ink-200 bg-white shadow-sm">
                  <div
                    className="mx-auto"
                    style={{ width: 320, height: 452, overflow: "hidden" }}
                  >
                    <div
                      style={{
                        transform: "scale(0.403)",
                        transformOrigin: "top left",
                        width: "210mm",
                      }}
                    >
                      <ResumeDocument
                        data={{ ...example, template: template.id }}
                        printMode
                      />
                    </div>
                  </div>
                </div>
                <h3 className="mt-3 text-sm font-semibold text-ink-900">
                  {template.name}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-ink-600">
                  {template.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Penutup                                                             */}
      {/* ------------------------------------------------------------------ */}
      <section className="border-t border-ink-200 bg-ink-900 py-16 text-center">
        <div className="mx-auto max-w-2xl px-5">
          <h2 className="text-2xl font-bold text-white">
            Buat satu kali, pakai berkali-kali
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-300">
            Data Anda tersimpan di akun. Untuk lowongan berikutnya, duplikasi CV
            yang sudah ada lalu sesuaikan seperlunya - tidak perlu mulai dari
            halaman kosong lagi.
          </p>
          <Link href={signedIn ? "/dashboard" : "/register"}>
            <Button size="lg" className="mt-7">
              {signedIn ? "Buka Dashboard" : "Daftar Gratis"}
              <ArrowRight size={18} />
            </Button>
          </Link>
        </div>
      </section>

      <footer className="border-t border-ink-200 py-8">
        <p className="text-center text-xs text-ink-500">
          Pembuat CV ATS-Friendly - dibangun dengan Next.js, PostgreSQL, dan
          Prisma.
        </p>
      </footer>
    </div>
  );
}

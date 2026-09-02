import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, CircleAlert, Lightbulb, ThumbsDown, ThumbsUp } from "lucide-react";
import { auth } from "@/auth";
import { FlowDiagram, type FlowNode } from "@/components/FlowDiagram";
import { PublicHeader } from "@/components/PublicHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Reveal } from "@/components/motion";
import { Badge, Button, Callout, Card } from "@/components/ui";
import { SECTION_META, DEFAULT_SECTION_ORDER } from "@/lib/resume/sections";
import {
  DIMENSION_DESCRIPTIONS,
  DIMENSION_LABELS,
  DIMENSION_WEIGHTS,
  type DimensionKey,
} from "@/lib/ats/engine";

export const metadata: Metadata = {
  title: "Panduan Penggunaan",
  description:
    "Langkah demi langkah memakai aplikasi: dari mendaftar, mengisi field, membaca skor ATS, sampai mengunduh CV dalam bentuk PDF atau Word.",
};

/* -------------------------------------------------------------------------- */

const FLOW: FlowNode[] = [
  {
    kind: "start",
    label: "Daftar atau masuk",
    detail:
      "Cukup nama, email, dan kata sandi minimal 8 karakter. Akun dibutuhkan agar CV Anda dapat disimpan dan dibuka lagi lain waktu.",
  },
  {
    kind: "decision",
    label: "Pilih titik awal CV",
    detail: "Tiga pilihan di dashboard, semuanya menghasilkan CV yang bisa diedit.",
    branches: [
      {
        label: "Mulai dari Contoh",
        detail:
          "Disarankan untuk pemakaian pertama. CV langsung terisi contoh lengkap, sehingga Anda melihat setiap field muncul di bagian mana.",
      },
      {
        label: "Buat CV Baru",
        detail: "Mulai dari kosong, bila Anda sudah paham bentuk CV yang dituju.",
      },
      {
        label: "Impor JSON",
        detail:
          "Bila Anda pernah mengunduh cadangan dari aplikasi ini sebelumnya.",
      },
    ],
  },
  {
    kind: "process",
    label: "Isi field bagian demi bagian",
    detail:
      "Panel kiri berisi formulir, panel kanan menampilkan CV yang langsung berubah saat Anda mengetik. Bagian yang belum diisi tidak akan muncul di CV, jadi aman untuk dilewati.",
  },
  {
    kind: "process",
    label: "Perubahan tersimpan otomatis",
    detail:
      "Kurang dari satu detik setelah berhenti mengetik, tulisan \"Tersimpan\" muncul di bilah atas. Tidak ada tombol simpan yang perlu ditekan.",
  },
  {
    kind: "process",
    label: "Buka tab Skor ATS",
    detail:
      "Aplikasi menilai CV Anda dari lima sisi dan menampilkan daftar hal yang perlu diperbaiki, lengkap dengan cara memperbaikinya.",
  },
  {
    kind: "decision",
    label: "Skor sudah 70 ke atas?",
    detail: "Nilai B atau lebih baik menandakan kaidah utama sudah terpenuhi.",
    branches: [
      {
        label: "Belum",
        detail:
          "Klik \"Buka field terkait\" pada tiap saran untuk melompat langsung ke field yang bermasalah, perbaiki, lalu lihat skornya naik.",
      },
      {
        label: "Sudah",
        detail: "Lanjut ke pencocokan dengan lowongan yang Anda incar.",
      },
    ],
  },
  {
    kind: "loop",
    label: "Cocokkan dengan iklan lowongan",
    detail:
      "Tempel teks lowongan pada halaman Analisis ATS. Aplikasi menandai kata kunci penting yang belum muncul di CV Anda. Masukkan hanya yang benar-benar Anda kuasai.",
  },
  {
    kind: "process",
    label: "Unduh CV",
    detail:
      "PDF untuk pengiriman umum, Word bila sistem lamaran meminta .docx, teks polos untuk formulir daring, dan JSON sebagai cadangan data Anda.",
  },
  {
    kind: "end",
    label: "Lowongan berikutnya: duplikasi, jangan ulang dari nol",
    detail:
      "Di dashboard, tekan tombol duplikat lalu sesuaikan ringkasan dan urutan keahliannya. Data Anda tetap tersimpan selamanya di akun ini.",
  },
];

const BULLET_EXAMPLES = [
  {
    bad: "Bertanggung jawab atas pengembangan website perusahaan.",
    good: "Mengembangkan ulang halaman checkout sehingga tingkat konversi naik dari 2,1% menjadi 3,4% dalam 6 bulan.",
    why: "Kalimat pertama menyebut tugas; kalimat kedua menyebut hasil yang bisa diukur.",
  },
  {
    bad: "Membantu tim dalam berbagai proyek.",
    good: "Memimpin tim beranggotakan 4 orang dalam migrasi 60 komponen antarmuka, memangkas waktu pengembangan fitur sekitar 30%.",
    why: "Sebutkan peran Anda secara spesifik, jumlah orang, dan dampaknya.",
  },
  {
    bad: "Menguasai React dan menguasai berbagai tools modern.",
    good: "Menyusun 120 unit test dengan Jest dan React Testing Library, meningkatkan cakupan pengujian dari 38% menjadi 82%.",
    why: "Daftar keahlian tempatnya di bagian Keahlian. Poin pencapaian seharusnya menunjukkan apa yang Anda hasilkan dengan keahlian itu.",
  },
];

const TROUBLESHOOT = [
  {
    q: "Tulisan \"Gagal menyimpan\" muncul di bilah atas",
    a: "Koneksi internet Anda terputus. Jangan tutup halaman - data yang sudah Anda ketik masih ada di layar. Begitu koneksi pulih, ketik satu huruf apa saja untuk memicu penyimpanan ulang.",
  },
  {
    q: "CV saya jadi tiga halaman",
    a: "Indikator jumlah halaman di atas pratinjau akan berwarna kuning. Pangkas pengalaman yang tidak relevan dengan lowongan yang dituju, gabungkan poin yang mirip, atau kecilkan ukuran huruf lewat menu Tampilan. CV sebaiknya maksimal dua halaman.",
  },
  {
    q: "Saya menekan tombol PDF tapi tidak terjadi apa-apa",
    a: "Kotak dialog cetak dari peramban mungkin terblokir. Coba lagi, dan pastikan pemblokir pop-up tidak aktif untuk situs ini. Alternatifnya, unduh format Word yang tidak memerlukan dialog cetak.",
  },
  {
    q: "Bagian yang saya isi tidak muncul di CV",
    a: "Bagian yang seluruh entrinya kosong memang sengaja tidak dicetak, agar tidak muncul judul bagian yang menggantung tanpa isi. Pastikan minimal satu field pada entri tersebut sudah diisi.",
  },
  {
    q: "Saya ingin mengubah urutan bagian CV",
    a: "Gunakan tombol panah atas dan bawah di sisi kanan judul setiap bagian pada panel formulir. Urutannya langsung berubah di pratinjau.",
  },
];

/* -------------------------------------------------------------------------- */

export default async function PanduanPage() {
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
        {/* Judul halaman */}
        <section className="border-b border-ink-200 bg-ink-50">
          <div className="mx-auto max-w-4xl px-4 py-12 sm:px-5 sm:py-16">
            <Badge tone="brand">Panduan</Badge>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
              Cara memakai aplikasi ini
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-600 sm:text-base">
              Ditulis untuk yang baru pertama kali membuat CV sekalipun. Anda
              tidak perlu tahu apa pun soal desain dokumen - cukup isi
              field-nya, sisanya diurus aplikasi.
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-5 sm:py-16">
          {/* ============================================================ */}
          {/* Alur penggunaan                                              */}
          {/* ============================================================ */}
          <Reveal as="section">
            <h2 className="text-xl font-bold text-ink-900 sm:text-2xl">
              1. Alur penggunaan dari awal sampai akhir
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-600">
              Sembilan langkah berikut adalah keseluruhan proses. Langkah 5
              sampai 7 boleh diulang sebanyak yang Anda mau - itu justru yang
              membuat CV Anda semakin baik.
            </p>
            <div className="mt-8">
              <FlowDiagram nodes={FLOW} />
            </div>
          </Reveal>

          {/* ============================================================ */}
          {/* Isi tiap bagian                                              */}
          {/* ============================================================ */}
          <Reveal as="section" className="mt-16">
            <h2 className="text-xl font-bold text-ink-900 sm:text-2xl">
              2. Apa yang diisi di setiap bagian
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-600">
              Bagian ditampilkan di CV mengikuti urutan di bawah ini, dan bisa
              Anda ubah kapan saja. Bagian yang kosong tidak akan dicetak.
            </p>

            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-ink-200">
                    <th className="py-2.5 pr-4 text-xs font-semibold text-ink-500">
                      Bagian
                    </th>
                    <th className="py-2.5 pr-4 text-xs font-semibold text-ink-500">
                      Judul di CV
                    </th>
                    <th className="py-2.5 text-xs font-semibold text-ink-500">
                      Diisi apa
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-ink-100 align-top">
                    <td className="py-3 pr-4 font-medium text-ink-900">
                      Data Pribadi
                    </td>
                    <td className="py-3 pr-4 text-xs text-ink-500">
                      (kepala CV)
                    </td>
                    <td className="py-3 text-[13px] leading-relaxed text-ink-600">
                      Nama, jabatan yang dituju, email, telepon, domisili, dan
                      tautan profil. Inilah data yang pertama dicari mesin
                      pengurai.
                    </td>
                  </tr>
                  {DEFAULT_SECTION_ORDER.map((key) => {
                    const meta = SECTION_META[key];
                    return (
                      <tr key={key} className="border-b border-ink-100 align-top">
                        <td className="py-3 pr-4 font-medium text-ink-900">
                          {meta.label}
                        </td>
                        <td className="py-3 pr-4 text-xs text-ink-500">
                          {meta.heading.ID}
                        </td>
                        <td className="py-3 text-[13px] leading-relaxed text-ink-600">
                          {meta.hint}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Reveal>

          {/* ============================================================ */}
          {/* Memahami skor                                                */}
          {/* ============================================================ */}
          <Reveal as="section" className="mt-16">
            <h2 className="text-xl font-bold text-ink-900 sm:text-2xl">
              3. Membaca skor ATS
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-600">
              Skor berada pada rentang 0 sampai 100, dihitung sebagai rata-rata
              berbobot dari lima dimensi berikut.
            </p>

            <div className="mt-6 space-y-3">
              {(Object.keys(DIMENSION_WEIGHTS) as DimensionKey[]).map((key) => (
                <Card key={key} className="p-4">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="text-sm font-semibold text-ink-900">
                      {DIMENSION_LABELS[key]}
                    </h3>
                    <Badge tone="brand">bobot {DIMENSION_WEIGHTS[key]}%</Badge>
                  </div>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-ink-600">
                    {DIMENSION_DESCRIPTIONS[key]}
                  </p>
                </Card>
              ))}
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-4">
              {[
                { grade: "A", range: "85 - 100", note: "Siap dikirim", tone: "good" },
                { grade: "B", range: "70 - 84", note: "Tinggal poles", tone: "good" },
                { grade: "C", range: "55 - 69", note: "Ada yang penting terlewat", tone: "warn" },
                { grade: "D", range: "0 - 54", note: "Berisiko tersaring", tone: "bad" },
              ].map((g) => (
                <Card key={g.grade} className="p-4 text-center">
                  <p
                    className={`text-2xl font-bold ${
                      g.tone === "good"
                        ? "text-good"
                        : g.tone === "warn"
                          ? "text-warn"
                          : "text-bad"
                    }`}
                  >
                    {g.grade}
                  </p>
                  <p className="mt-0.5 text-xs font-medium text-ink-700">
                    {g.range}
                  </p>
                  <p className="mt-1 text-[11px] leading-relaxed text-ink-500">
                    {g.note}
                  </p>
                </Card>
              ))}
            </div>

            <div className="mt-6">
              <Callout tone="warn" title="Skor tinggi bukan jaminan diterima">
                Penilaian ini memeriksa apakah CV Anda memenuhi kaidah yang
                berlaku umum pada sistem pembaca CV - bukan mensimulasikan satu
                produk ATS tertentu, karena tiap perusahaan memakai pengurai
                berbeda yang tidak dipublikasikan. Anggap skor ini sebagai
                daftar periksa, bukan ramalan hasil seleksi.
              </Callout>
            </div>
          </Reveal>

          {/* ============================================================ */}
          {/* Menulis poin pencapaian                                      */}
          {/* ============================================================ */}
          <Reveal as="section" className="mt-16">
            <h2 className="text-xl font-bold text-ink-900 sm:text-2xl">
              4. Menulis poin pencapaian yang kuat
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-600">
              Bagian ini yang paling menentukan skor Kualitas Konten, dan paling
              menentukan kesan perekrut. Rumusnya sederhana:{" "}
              <strong className="text-ink-800">
                kata kerja aksi + apa yang dikerjakan + hasil berangka
              </strong>
              .
            </p>

            <div className="mt-6 space-y-4">
              {BULLET_EXAMPLES.map((example) => (
                <Card key={example.good} className="overflow-hidden">
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
              ))}
            </div>

            <div className="mt-6">
              <Callout tone="info" title="Tidak punya angka?">
                Angka tidak selalu berarti persentase. Jumlah orang yang Anda
                latih, banyaknya dokumen yang Anda proses per minggu, jumlah
                peserta acara yang Anda selenggarakan - semuanya angka yang sah
                dan membuat poin Anda jauh lebih meyakinkan.
              </Callout>
            </div>
          </Reveal>

          {/* ============================================================ */}
          {/* Kalau ada masalah                                            */}
          {/* ============================================================ */}
          <Reveal as="section" className="mt-16">
            <h2 className="text-xl font-bold text-ink-900 sm:text-2xl">
              5. Kalau ada yang tidak beres
            </h2>

            <div className="mt-6 space-y-3">
              {TROUBLESHOOT.map((item) => (
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
                    <span
                      aria-hidden
                      className="shrink-0 text-ink-400 transition-transform group-open:rotate-45"
                    >
                      +
                    </span>
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
                <Lightbulb size={20} className="mt-0.5 shrink-0 text-brand-600" />
                <div>
                  <p className="text-sm font-semibold text-ink-900">
                    Cara tercepat memahaminya: langsung coba
                  </p>
                  <p className="mt-1 text-[13px] leading-relaxed text-ink-600">
                    Buat akun, pilih &quot;Mulai dari Contoh&quot;, lalu ganti
                    isinya dengan data Anda satu per satu.
                  </p>
                </div>
              </div>
              <Link
                href={signedIn ? "/dashboard" : "/register"}
                className="w-full sm:w-auto"
              >
                <Button className="press w-full sm:w-auto">
                  {signedIn ? "Buka Dashboard" : "Mulai Sekarang"}
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

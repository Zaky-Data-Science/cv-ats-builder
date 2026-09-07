/*
  ============================================================================
   KERANGKA HALAMAN AUTH - MASUK, DAFTAR, LUPA SANDI, ATUR SANDI
  ============================================================================

  Kerangka yang dipakai bersama keempat halaman itu: bilah atas berisi logo dan
  jalan pulang, lalu satu kartu sempit di tengah layar.

  KENAPA KERANGKANYA SENDIRI, BUKAN `PublicHeader`

  Bilah atas halaman publik memuat navigasi lengkap - Beranda, Cek CV Saya,
  Panduan, Tentang, Alur, pemilih bahasa, sakelar tema. Semuanya adalah
  tawaran untuk PERGI, dan menawarkannya kepada orang yang sedang mengetik
  kata sandi justru mengalihkannya dari satu hal yang sedang ia kerjakan.

  Yang tersisa di sini cuma dua: logo yang membawa pulang, dan satu tautan
  "kembali ke beranda" yang menyebutkan dirinya. Tautan itu ada karena halaman
  masuk kerap dibuka langsung dari tautan yang dibagikan - tombol kembali
  peramban tidak punya riwayat untuk dimundurkan.

  ----------------------------------------------------------------------------
   PETA SETELAN
  ----------------------------------------------------------------------------

  | Yang ingin diubah        | Ubah di mana                  | Nilai sekarang |
  |--------------------------|-------------------------------|----------------|
  | Lebar kartu formulir     | `max-w-sm` pada `<main>`      | 24rem (384px)  |
  | Tinggi bilah atas        | `h-16` pada bilahnya          | 64px           |
  | Jarak tegak kartu        | `py-12` pada `<main>`         | 48px           |

  `max-w-sm` sengaja sempit. Formulir masuk isinya dua kotak isian; kartu yang
  lebih lebar membuat kotak isiannya membentang jauh melebihi panjang teks yang
  diketik ke dalamnya, dan itu terbaca sebagai formulir yang belum selesai
  dirapikan.
*/

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getT } from "@/lib/i18n/server";
import { BrandMark } from "@/components/BrandMark";
import { SITE } from "@/lib/site";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = await getT();

  return (
    <div className="flex min-h-full flex-col bg-ink-100">
      <header className="border-b border-ink-200 bg-white">
        <div className="wadah flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-ink-900 text-white">
              <BrandMark className="h-[18px] w-[18px]" />
            </span>
            <span className="text-sm font-semibold text-ink-900">
              {SITE.name}
            </span>
          </Link>

          {/* Halaman masuk kerap dibuka langsung dari tautan yang dibagikan,
              sehingga tombol kembali peramban tidak punya riwayat untuk
              dimundurkan. Tautan ini yang menjadi jalan pulangnya. */}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-600 transition-colors hover:text-ink-900"
          >
            <ArrowLeft size={13} aria-hidden />
            {t.nav.backHome}
          </Link>
        </div>
      </header>

      {/* SETELAN lebar kartu formulir (24rem) dan jarak tegaknya (48px).
          Lihat alasan lebarnya di kepala berkas. */}
      <main className="flex flex-1 items-center justify-center px-5 py-12">
        <div className="w-full max-w-sm">{children}</div>
      </main>
    </div>
  );
}

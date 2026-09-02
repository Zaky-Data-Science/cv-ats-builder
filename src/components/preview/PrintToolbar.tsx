"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Printer } from "lucide-react";
import { useI18n } from "@/components/i18n";
import { Button } from "@/components/ui";

/**
 * Bilah alat pada halaman cetak.
 *
 * Halaman cetak sebelumnya sepenuhnya pasif - satu-satunya cara memakainya
 * adalah lewat bingkai tersembunyi yang dibuat editor. Bila pemicu itu gagal
 * karena sebab apa pun, pengguna tidak punya jalan lain sama sekali dan hanya
 * melihat CV-nya terpampang tanpa tahu harus berbuat apa.
 *
 * Dengan bilah ini, halaman cetak berdiri sendiri: dapat dibuka langsung,
 * dicetak dengan satu tombol, dan ditinggalkan lewat tautan kembali. Bilahnya
 * sendiri tidak ikut tercetak - lihat kelas `no-print` di globals.css.
 */
export function PrintToolbar({ backHref }: { backHref: string }) {
  const { t } = useI18n();

  // Pencetakan otomatis hanya dijalankan bila alamatnya memintanya, dan hanya
  // sekali. Halaman ini juga dibuka orang untuk sekadar memeriksa hasilnya;
  // memaksakan dialog cetak pada setiap kunjungan akan mengganggu.
  const printed = React.useRef(false);

  React.useEffect(() => {
    if (printed.current) return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("cetak") !== "1") return;
    printed.current = true;

    // Satu bingkai animasi diberikan lebih dulu supaya gaya dan huruf web
    // selesai diterapkan; mencetak terlalu dini menghasilkan PDF berhuruf
    // pengganti.
    const frame = requestAnimationFrame(() => window.print());
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="no-print fixed inset-x-0 top-0 z-50 border-b border-ink-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-3 px-4 py-2.5">
        <Link
          href={backHref}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-600 transition-colors hover:text-ink-900"
        >
          <ArrowLeft size={13} aria-hidden />
          {t.print.backToEditor}
        </Link>

        <Button size="sm" className="press" onClick={() => window.print()}>
          <Printer size={14} />
          {t.print.printNow}
        </Button>
      </div>
    </div>
  );
}

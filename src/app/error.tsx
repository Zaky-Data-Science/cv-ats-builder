"use client";

import * as React from "react";
import Link from "next/link";
import { RotateCcw, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui";

/**
 * Penangkap galat tak terduga.
 *
 * Tanpa berkas ini, satu kesalahan pada satu bagian halaman akan
 * menampilkan layar kosong tanpa penjelasan. Yang ditampilkan kepada
 * pengguna hanyalah pesan yang dapat ditindaklanjuti - rincian teknisnya
 * dikirim ke catatan server, bukan dipajang di layar.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error("[app] galat tidak tertangani:", error);
  }, [error]);

  return (
    <div className="flex min-h-full items-center justify-center bg-ink-100 px-5 py-16">
      <div className="w-full max-w-md rounded-xl border border-ink-200 bg-white p-8 text-center shadow-sm">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-amber-50 text-warn">
          <TriangleAlert size={26} />
        </span>

        <h1 className="mt-5 text-lg font-bold text-ink-900">
          Ada yang tidak beres
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-600">
          Halaman ini gagal ditampilkan. CV yang sudah Anda simpan tetap aman -
          seluruh perubahan disimpan ke database begitu Anda berhenti mengetik.
        </p>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button onClick={reset} className="press w-full sm:w-auto">
            <RotateCcw size={15} />
            Coba lagi
          </Button>
          <Link href="/dashboard">
            <Button variant="outline" className="press w-full sm:w-auto">
              Buka Dashboard
            </Button>
          </Link>
        </div>

        {error.digest && (
          <p className="mt-5 border-t border-ink-100 pt-4 text-[11px] text-ink-400">
            Kode galat: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}

"use client";

import * as React from "react";
import Link from "next/link";
import { RotateCcw, TriangleAlert } from "lucide-react";
import { useI18n } from "@/components/i18n";
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
  const { t } = useI18n();

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
          {t.errors.errorTitle}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-600">
          {t.errors.errorBody}
        </p>

        {/*
          Langkah nyata, bukan hanya kode galat.

          Sebagian besar galat yang sampai ke layar ini berumur pendek -
          sambungan ke basis data yang putus sesaat adalah contoh yang paling
          sering. Halaman yang hanya memajang kode membuat penggunanya mengira
          aplikasinya rusak, padahal memuat ulang sudah cukup. Kodenya tetap
          ditampilkan, tetapi turun ke bawah dan disertai keterangan bahwa itu
          memang bukan untuk dipahami penggunanya.
        */}
        <div className="mt-5 rounded-lg border border-ink-200 bg-ink-50 px-4 py-3 text-left">
          <p className="text-[12px] font-semibold text-ink-700">
            {t.errors.errorSteps}
          </p>
          <ol className="mt-1.5 list-decimal space-y-1 pl-4 text-[12px] leading-relaxed text-ink-600">
            <li>{t.errors.errorStep1}</li>
            <li>{t.errors.errorStep2}</li>
            {/*
              Langkah ketiga hanya di mode pengembangan, dan itu memang
              tempatnya: basis data lokal bisa mati sementara server web tetap
              hidup - keadaan yang tidak pernah terjadi di production, di mana
              basis datanya layanan terkelola yang tidak ikut mati bersama
              terminal. Menampilkannya kepada pengguna sungguhan hanya akan
              menyuruh mereka menjalankan perintah yang tidak mereka punya.
            */}
            {process.env.NODE_ENV !== "production" && (
              <li>{t.errors.errorStepDev}</li>
            )}
          </ol>
        </div>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          {/*
            Memuat ulang sungguhan, bukan `reset()`.

            `reset()` merender ulang batas galatnya di peramban. Untuk galat
            yang lahir saat render di server - dan galat basis data selalu
            begitu - yang sering benar-benar menolong adalah permintaan baru
            ke server. Karena itu tombol utamanya memuat ulang halaman;
            `reset()` tetap disediakan sebagai tombol kedua, dan berguna untuk
            galat yang memang lahir di peramban.
          */}
          <Button
            onClick={() => window.location.reload()}
            className="press w-full sm:w-auto"
          >
            <RotateCcw size={15} />
            {t.errors.errorReload}
          </Button>
          <Button
            variant="outline"
            onClick={reset}
            className="press w-full sm:w-auto"
          >
            {t.errors.retry}
          </Button>
          <Link href="/dashboard">
            <Button variant="outline" className="press w-full sm:w-auto">
              {t.errors.openDashboard}
            </Button>
          </Link>
        </div>

        {error.digest && (
          <div className="mt-5 border-t border-ink-100 pt-4">
            <p className="text-[11px] leading-relaxed text-ink-500">
              {t.errors.errorCodeHint}
            </p>
            <p className="mt-1 text-[11px] text-ink-400">
              {t.errors.errorCode} {error.digest}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

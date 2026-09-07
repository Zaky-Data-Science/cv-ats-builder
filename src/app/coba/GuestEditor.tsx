"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useI18n } from "@/components/i18n";
import { ResumeEditor } from "@/components/editor/ResumeEditor";
import {
  commitGuestResume,
  getGuestServerSnapshot,
  getGuestSnapshot,
  loadGuestResume,
  subscribeGuestResume,
} from "@/lib/resume/guest";
import { templateIdSchema } from "@/lib/resume/schema";

/**
 * Pembungkus editor untuk mode tanpa akun.
 *
 * CV-nya hanya ada di penyimpanan peramban, sehingga server tidak punya apa
 * pun untuk dirender. Pembacaannya lewat useSyncExternalStore: di server
 * nilainya null dan yang tampil kerangka pemuatan, lalu digantikan isi
 * sebenarnya begitu berjalan di peramban - tanpa setState di dalam effect.
 */
export function GuestEditor() {
  const { t } = useI18n();
  const router = useRouter();
  const params = useSearchParams();

  /*
    Desain yang dipilih dari galeri halaman depan, dibawa lewat `?desain=`.

    Diterapkan sekali lalu parameternya DIBUANG dari alamat. Tanpa membuangnya,
    memuat ulang halaman akan memaksakan desain itu lagi - dan orang yang
    sesudah tiba di sini menggantinya sendiri akan mendapati pilihannya
    kembali dibatalkan setiap kali menyegarkan halaman.

    Divalidasi dengan skema yang sama seperti data dari server: isi `?desain=`
    datang dari alamat, dan alamat dapat ditulis siapa saja.
  */
  const desain = params.get("desain");
  React.useEffect(() => {
    if (!desain) return;
    const sah = templateIdSchema.safeParse(desain);
    if (sah.success) {
      const cv = loadGuestResume();
      if (cv.template !== sah.data) {
        commitGuestResume({ ...cv, template: sah.data });
      }
    }
    router.replace("/coba");
  }, [desain, router]);

  const initial = React.useSyncExternalStore(
    subscribeGuestResume,
    getGuestSnapshot,
    getGuestServerSnapshot,
  );

  if (!initial) {
    return (
      <div
        className="flex min-h-0 flex-1 items-center justify-center p-8"
        aria-busy="true"
      >
        <p className="text-sm text-ink-500">{t.guest.loading}</p>
      </div>
    );
  }

  return <ResumeEditor initial={initial} guest />;
}

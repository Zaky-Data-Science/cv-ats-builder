"use client";

import * as React from "react";
import { useI18n } from "@/components/i18n";
import { PrintToolbar } from "@/components/preview/PrintToolbar";
import { ResumeDocument } from "@/components/preview/ResumeDocument";
import {
  getGuestServerSnapshot,
  getGuestSnapshot,
  subscribeGuestResume,
} from "@/lib/resume/guest";
import { paperSpec } from "@/lib/resume/paper";
import { resumeMargins } from "@/lib/resume/templates";

/**
 * Halaman cetak untuk CV tanpa akun.
 *
 * Bersaudara dengan /resume/[id]/print, dan sengaja dipisah bukan disatukan:
 * yang satu membaca CV dari basis data di server, yang satu ini dari
 * penyimpanan peramban. Menyatukannya akan memaksa halaman berakun ikut
 * dirender di sisi klien, dan itu justru mengorbankan hal yang membuatnya
 * andal - HTML-nya sudah lengkap sejak byte pertama.
 *
 * Aturan @page disisipkan dengan cara yang sama, dan karena berasal dari
 * fungsi yang sama, hasil cetak keduanya identik.
 */
export function GuestPrint() {
  const { t } = useI18n();

  const data = React.useSyncExternalStore(
    subscribeGuestResume,
    getGuestSnapshot,
    getGuestServerSnapshot,
  );

  if (!data) {
    return (
      <div className="grid min-h-full place-items-center p-8" aria-busy="true">
        <p className="text-sm text-ink-500">{t.guest.loading}</p>
      </div>
    );
  }

  const paper = paperSpec(data.pageSize);
  const margins = resumeMargins(data);

  return (
    <div className="flex min-h-full justify-center bg-ink-200 pt-14 print:block print:bg-white print:pt-0">
      <PrintToolbar backHref="/coba" />
      <style>{`@page { size: ${paper.cssSize}; margin: ${margins.y}mm ${margins.x}mm; }`}</style>
      <ResumeDocument
        data={data}
        printMode
        padding="none"
        className="shadow-lg print:shadow-none"
      />
    </div>
  );
}

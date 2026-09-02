"use client";

import * as React from "react";
import { useI18n } from "@/components/i18n";
import { ResumeEditor } from "@/components/editor/ResumeEditor";
import {
  getGuestServerSnapshot,
  getGuestSnapshot,
  subscribeGuestResume,
} from "@/lib/resume/guest";

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

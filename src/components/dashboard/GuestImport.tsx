"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2, Upload } from "lucide-react";
import { useI18n } from "@/components/i18n";
import { Button, Callout, Card } from "@/components/ui";
import {
  dropStashedImport,
  getStashServerSnapshot,
  getStashSnapshot,
  subscribeStash,
  takeStashedImport,
} from "@/lib/resume/guest";
import { toExportFile } from "@/lib/resume/serialize";

/**
 * Tawaran memindahkan CV yang disusun tanpa akun ke akun yang baru dimasuki.
 *
 * Sengaja berupa tawaran, bukan impor otomatis. CV itu bisa saja disusun orang
 * lain di komputer bersama - warnet, laboratorium kampus, komputer keluarga -
 * dan menyalinnya diam-diam ke akun siapa pun yang kebetulan masuk berikutnya
 * bukan hal yang pantas dilakukan tanpa ditanya.
 */
export function GuestImport() {
  const { t } = useI18n();
  const router = useRouter();

  const pending = React.useSyncExternalStore(
    subscribeStash,
    getStashSnapshot,
    getStashServerSnapshot,
  );

  const [busy, setBusy] = React.useState(false);
  const [failed, setFailed] = React.useState(false);

  if (!pending) return null;

  async function importNow() {
    const data = takeStashedImport();
    if (!data) return;

    setBusy(true);
    setFailed(false);
    try {
      const response = await fetch("/api/resumes/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toExportFile(data)),
      });
      if (!response.ok) {
        setFailed(true);
        return;
      }
      // Titipannya dibuang hanya setelah server benar-benar menerimanya.
      dropStashedImport();
      router.refresh();
    } catch {
      setFailed(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card className="mt-6 p-5">
      <div className="flex flex-wrap items-start gap-4">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-ink-900 text-white">
          <Upload size={18} aria-hidden />
        </span>

        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-semibold text-ink-900">
            {t.guest.importTitle}
          </h2>
          <p className="mt-1 text-xs leading-relaxed text-ink-600">
            {t.guest.importBody}
          </p>

          {failed && (
            <div className="mt-3">
              <Callout tone="bad">{t.guest.importFailed}</Callout>
            </div>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            <Button size="sm" className="press" onClick={importNow} disabled={busy}>
              {busy && <Loader2 size={14} className="animate-spin" />}
              {t.guest.importButton}
            </Button>
            <Button size="sm" variant="ghost" onClick={dropStashedImport}>
              {t.guest.importDismiss}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

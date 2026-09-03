"use client";

import * as React from "react";
import { useI18n } from "@/components/i18n";
import { Button, Callout } from "@/components/ui";
import {
  PHOTO_ACCEPT,
  PhotoError,
  compressPhoto,
  isEmbeddedPhoto,
} from "@/lib/resume/photo";

/**
 * Pemilih pas foto.
 *
 * Berkas yang dipilih dikecilkan dan dikompresi di peramban sebelum masuk ke
 * data CV - lihat `src/lib/resume/photo.ts` untuk alasan bentuk penyimpanannya.
 *
 * Elemen `<input type="file">` aslinya disembunyikan, bukan digaya ulang.
 * Tampilan bawaannya berbeda-beda di tiap peramban dan tidak dapat diseragamkan
 * dengan CSS, sementara tombol biasa yang meneruskan klik ke elemen itu
 * memberi tampilan yang sama di mana pun tanpa kehilangan satu pun perilaku
 * aslinya - termasuk dapat dicapai lewat papan ketik.
 */
export function PhotoInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (next: string) => void;
}) {
  const { t } = useI18n();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const hasPhoto = value.trim().length > 0;
  const linked = hasPhoto && !isEmbeddedPhoto(value);

  async function choose(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    // Nilai input dikosongkan lebih dulu supaya memilih berkas yang sama dua
    // kali berturut-turut tetap memicu perubahan.
    event.target.value = "";
    if (!file) return;

    setBusy(true);
    setError(null);
    try {
      onChange(await compressPhoto(file));
    } catch (cause) {
      const reason = cause instanceof PhotoError ? cause.reason : "read";
      setError(
        reason === "type"
          ? t.form.photoErrorType
          : reason === "tooBig"
            ? t.form.photoErrorTooBig
            : t.form.photoErrorRead,
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-start gap-3">
        {hasPhoto && (
          // Pratinjau memakai <img> biasa, sama seperti dokumen CV-nya:
          // sumbernya data URI atau tautan pengguna, keduanya di luar jangkauan
          // pengoptimal gambar Next.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={value}
            alt=""
            className="h-20 shrink-0 rounded border border-ink-200 object-cover"
            // Perbandingan 3:4, sama dengan pas foto yang dicetak.
            style={{ width: "3.75rem" }}
          />
        )}

        <div className="space-y-2">
          <input
            ref={inputRef}
            type="file"
            accept={PHOTO_ACCEPT}
            onChange={choose}
            className="sr-only"
            id="photoFile"
          />
          <Button
            variant="outline"
            size="sm"
            disabled={busy}
            onClick={() => inputRef.current?.click()}
          >
            {busy
              ? t.form.photoWorking
              : hasPhoto
                ? t.form.photoReplace
                : t.form.photoChoose}
          </Button>
          {hasPhoto && (
            <Button
              variant="ghost"
              size="sm"
              className="ml-2"
              disabled={busy}
              onClick={() => {
                setError(null);
                onChange("");
              }}
            >
              {t.form.photoRemove}
            </Button>
          )}
          <p className="text-xs text-ink-500">{t.form.photoHint}</p>
        </div>
      </div>

      {linked && <Callout tone="info">{t.form.photoLinked}</Callout>}
      {error && <Callout tone="warn">{error}</Callout>}
    </div>
  );
}

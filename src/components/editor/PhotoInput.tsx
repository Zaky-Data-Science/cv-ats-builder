"use client";

import * as React from "react";
import { useI18n } from "@/components/i18n";
import { Button, Callout } from "@/components/ui";
import { PhotoFrame } from "./PhotoFrame";
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
  zoom,
  offsetX,
  offsetY,
  onChange,
  onCropChange,
}: {
  value: string;
  zoom: number;
  offsetX: number;
  offsetY: number;
  onChange: (next: string) => void;
  onCropChange: (next: {
    photoZoom: number;
    photoOffsetX: number;
    photoOffsetY: number;
  }) => void;
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
          : reason === "sourceTooBig"
            ? t.form.photoErrorSourceTooBig
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
        {/*
          Pratinjaunya sekaligus penyuntingnya. Dulu hanya gambar kecil yang
          tidak dapat disentuh - dan bagian mana dari foto yang tampil di CV
          tidak pernah dapat diatur, hanya diterima apa adanya.
        */}
        {hasPhoto && (
          <PhotoFrame
            src={value}
            zoom={zoom}
            offsetX={offsetX}
            offsetY={offsetY}
            onChange={onCropChange}
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
      {/* Nada "bad", bukan "warn": fotonya benar-benar tidak masuk, dan
          peringatan yang terlihat seperti saran akan dibaca sebagai catatan
          yang boleh diabaikan. */}
      {error && <Callout tone="bad">{error}</Callout>}
    </div>
  );
}

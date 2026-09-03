"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { useI18n } from "@/components/i18n";
import { Button, Input, Switch } from "@/components/ui";
import type { DatePatch, DateShape } from "@/lib/resume/edit-path";

/**
 * Pemilih bulan yang muncul di atas periode yang diklik di kertas.
 *
 * Inilah yang membuat tanggal akhirnya dapat disunting dari kertas tanpa
 * membatalkan alasan ia dulu tidak bisa. Tanggal disimpan sebagai "YYYY-MM";
 * dibiarkan diketik sebagai teks bebas, "Feb 2023" akan diterima sebagai
 * tanggal. Yang berubah bukan penilaian itu - melainkan bahwa nilainya kini
 * tetap datang dari <input type="month">, hanya dipanggil dari tempat lain.
 *
 * Digambar lewat portal ke <body>, bukan sebagai anak kertas. Kertas berada
 * di dalam pembungkus ber-transform: scale(zoom), sehingga popover yang
 * menjadi anaknya akan ikut mengecil - pada perbesaran 40% pemilih bulannya
 * menjadi terlalu kecil untuk dipakai. getBoundingClientRect() sendiri sudah
 * memperhitungkan skala itu, jadi letaknya tetap tepat di dekat periodenya.
 */

export interface DateValue {
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
  date?: string;
}

const LEBAR = 232;

export function DatePopover({
  anchor,
  shape,
  value,
  onSave,
  onClose,
}: {
  anchor: HTMLElement;
  shape: DateShape;
  value: DateValue;
  onSave: (patch: DatePatch) => void;
  onClose: () => void;
}) {
  const { t } = useI18n();
  const [draft, setDraft] = React.useState<DateValue>(value);

  React.useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  /**
   * Menempatkan popover setelah ukurannya diketahui.
   *
   * Letaknya ditulis langsung ke gaya elemennya, bukan lewat state: tingginya
   * baru dapat diukur setelah isinya tergambar, dan mengukur lalu menyetel
   * state akan menggambarnya dua kali - sekali di tempat yang salah.
   *
   * Periode berdiri di tepi kanan kertas dan kerap di dekat dasar layar, jadi
   * kedua sumbunya perlu dijaga: yang tidak muat di bawah jangkarnya
   * dibalikkan ke atasnya, yang tidak muat di kanan digeser ke dalam.
   */
  const tempatkan = React.useCallback(
    (node: HTMLDivElement | null) => {
      if (!node) return;
      const rect = anchor.getBoundingClientRect();
      const tinggi = node.offsetHeight;
      const lebar = node.offsetWidth;

      const muatDiBawah = rect.bottom + 6 + tinggi <= window.innerHeight - 8;
      const atas = muatDiBawah
        ? rect.bottom + 6
        : Math.max(8, rect.top - tinggi - 6);

      node.style.top = `${atas}px`;
      node.style.left = `${Math.max(
        8,
        Math.min(rect.left, window.innerWidth - lebar - 8),
      )}px`;
      node.style.visibility = "visible";
    },
    [anchor],
  );

  const simpan = () => {
    if (shape.kind === "range") {
      onSave({
        startDate: draft.startDate ?? "",
        endDate: draft.endDate ?? "",
        ...(shape.current ? { isCurrent: Boolean(draft.isCurrent) } : {}),
      });
    } else {
      onSave({ date: draft.date ?? "" });
    }
    onClose();
  };

  return createPortal(
    <>
      {/* Lapisan penuh layar: klik di mana pun di luar popover menutupnya. */}
      <div className="fixed inset-0 z-40" onMouseDown={onClose} />
      <div
        ref={tempatkan}
        role="dialog"
        aria-label={t.preview.typeDateTitle}
        className="fixed z-50 rounded-xl border border-ink-200 bg-white p-3 shadow-xl"
        // Disembunyikan sampai letaknya dihitung, supaya tidak sempat terlihat
        // berkedip di pojok kiri atas.
        style={{ top: 0, left: 0, width: LEBAR, visibility: "hidden" }}
        onMouseDown={(event) => event.stopPropagation()}
      >
        {shape.kind === "range" ? (
          <div className="space-y-2">
            <Bulan
              label={t.preview.typeDateStart}
              value={draft.startDate ?? ""}
              onChange={(v) => setDraft((d) => ({ ...d, startDate: v }))}
            />
            <Bulan
              label={t.preview.typeDateEnd}
              value={draft.endDate ?? ""}
              disabled={Boolean(draft.isCurrent)}
              onChange={(v) => setDraft((d) => ({ ...d, endDate: v }))}
            />
            {shape.current && (
              <Switch
                checked={Boolean(draft.isCurrent)}
                label={t.preview.typeDateCurrent}
                onChange={(v) =>
                  setDraft((d) => ({
                    ...d,
                    isCurrent: v,
                    endDate: v ? "" : d.endDate,
                  }))
                }
              />
            )}
          </div>
        ) : (
          <Bulan
            label={t.preview.typeDateSingle}
            value={draft.date ?? ""}
            onChange={(v) => setDraft((d) => ({ ...d, date: v }))}
          />
        )}

        <div className="mt-3 flex justify-end gap-2">
          <Button size="sm" variant="ghost" onClick={onClose}>
            {t.preview.typeDateCancel}
          </Button>
          <Button size="sm" onClick={simpan}>
            {t.preview.typeDateSave}
          </Button>
        </div>
      </div>
    </>,
    document.body,
  );
}

function Bulan({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-semibold text-ink-600">
        {label}
      </span>
      <Input
        type="month"
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

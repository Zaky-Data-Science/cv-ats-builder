"use client";

import * as React from "react";
import {
  ChevronDown,
  ChevronUp,
  GripVertical,
  Plus,
  Trash2,
} from "lucide-react";
import { Badge, Button, Field, Input, Textarea } from "@/components/ui";
import { cn } from "@/lib/utils";

/**
 * Bagian-bagian penyusun form editor.
 *
 * Penyusunan ulang entri memakai tombol naik/turun, bukan seret-dan-lepas.
 * Alasannya: dapat dioperasikan sepenuhnya lewat papan ketik dan pembaca
 * layar, sementara hasil akhirnya identik.
 */

/* -------------------------------------------------------------------------- */
/* Wadah section yang bisa dilipat                                            */
/* -------------------------------------------------------------------------- */

export function SectionCard({
  id,
  title,
  hint,
  count,
  open,
  onToggle,
  onMoveUp,
  onMoveDown,
  children,
}: {
  /** Dipakai saran penilaian ATS untuk melompat langsung ke section ini. */
  id?: string;
  title: string;
  hint?: string;
  count?: number;
  open: boolean;
  onToggle: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-4 overflow-hidden rounded-xl border border-ink-200 bg-white"
    >
      <div className="flex items-center gap-1 pr-2">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          className="flex flex-1 items-center gap-2.5 px-4 py-3 text-left transition-colors hover:bg-ink-50"
        >
          <ChevronDown
            size={15}
            className={cn(
              "shrink-0 text-ink-400 transition-transform",
              !open && "-rotate-90",
            )}
          />
          <span className="text-sm font-semibold text-ink-900">{title}</span>
          {count !== undefined && count > 0 && <Badge>{count}</Badge>}
        </button>

        {(onMoveUp || onMoveDown) && (
          <div className="flex shrink-0 items-center gap-0.5">
            <GripVertical size={13} className="text-ink-300" />
            <Button
              size="icon"
              variant="ghost"
              title="Naikkan urutan section"
              onClick={onMoveUp}
              disabled={!onMoveUp}
            >
              <ChevronUp size={13} />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              title="Turunkan urutan section"
              onClick={onMoveDown}
              disabled={!onMoveDown}
            >
              <ChevronDown size={13} />
            </Button>
          </div>
        )}
      </div>

      {open && (
        <div className="space-y-4 border-t border-ink-100 px-4 pt-4 pb-5">
          {hint && (
            <p className="rounded-lg bg-ink-50 px-3 py-2 text-[11px] leading-relaxed text-ink-600">
              {hint}
            </p>
          )}
          {children}
        </div>
      )}
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Kartu satu entri (satu pengalaman, satu pendidikan, dan seterusnya)        */
/* -------------------------------------------------------------------------- */

export function EntryCard({
  index,
  total,
  label,
  onMoveUp,
  onMoveDown,
  onRemove,
  onFocusCapture,
  children,
}: {
  index: number;
  total: number;
  label: string;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
  onFocusCapture?: () => void;
  children: React.ReactNode;
}) {
  const [confirming, setConfirming] = React.useState(false);

  return (
    <div
      onFocusCapture={onFocusCapture}
      onMouseEnter={onFocusCapture}
      className="rounded-lg border border-ink-200 bg-ink-50/50 p-3.5"
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[11px] font-semibold tracking-wide text-ink-500 uppercase">
          {label} {index + 1}
        </span>
        <div className="flex items-center gap-0.5">
          <Button
            size="icon"
            variant="ghost"
            title="Pindah ke atas"
            onClick={onMoveUp}
            disabled={index === 0}
          >
            <ChevronUp size={13} />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            title="Pindah ke bawah"
            onClick={onMoveDown}
            disabled={index === total - 1}
          >
            <ChevronDown size={13} />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            title="Hapus entri"
            onClick={() => setConfirming(true)}
          >
            <Trash2 size={13} className="text-bad" />
          </Button>
        </div>
      </div>

      {confirming ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3">
          <p className="text-xs text-bad">Hapus entri ini?</p>
          <div className="mt-2 flex gap-2">
            <Button size="sm" variant="danger" onClick={onRemove}>
              Ya, hapus
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setConfirming(false)}
            >
              Batal
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">{children}</div>
      )}
    </div>
  );
}

/** Tombol tambah entri yang seragam di seluruh section. */
export function AddButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <Button variant="outline" className="w-full" onClick={onClick}>
      <Plus size={15} />
      {label}
    </Button>
  );
}

/* -------------------------------------------------------------------------- */
/* Input tanggal bulan                                                        */
/* -------------------------------------------------------------------------- */

/**
 * Memakai input bertipe month sehingga nilainya selalu berformat "YYYY-MM".
 * Ini yang menjamin format tanggal di seluruh CV seragam - salah satu syarat
 * agar pengurai ATS dapat menghitung lama pengalaman kerja.
 */
export function MonthInput({
  label,
  value,
  onChange,
  disabled,
  hint,
  id,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  hint?: string;
  id?: string;
}) {
  return (
    <Field label={label} hint={hint} htmlFor={id}>
      <Input
        id={id}
        type="month"
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
      />
    </Field>
  );
}

/* -------------------------------------------------------------------------- */
/* Penyunting poin pencapaian                                                 */
/* -------------------------------------------------------------------------- */

const BULLET_PLACEHOLDERS = [
  "Contoh: Mengembangkan ulang halaman checkout sehingga konversi naik dari 2,1% ke 3,4% dalam 6 bulan.",
  "Contoh: Memimpin tim 4 orang dalam migrasi 60 komponen, memangkas waktu pengembangan fitur 30%.",
  "Contoh: Mengotomasi proses deployment sehingga waktu rilis turun dari 40 menit menjadi 6 menit.",
];

export function BulletEditor({
  bullets,
  onChange,
}: {
  bullets: string[];
  onChange: (bullets: string[]) => void;
}) {
  return (
    <Field
      label="Poin Pencapaian"
      hint="Awali dengan kata kerja aksi dan sertakan angka. Ini bagian yang paling menentukan skor kualitas konten."
    >
      <div className="space-y-2">
        {bullets.map((bullet, index) => (
          <div key={index} className="flex items-start gap-2">
            <span className="mt-2.5 text-ink-400">•</span>
            <Textarea
              rows={2}
              value={bullet}
              onChange={(e) =>
                onChange(
                  bullets.map((b, i) => (i === index ? e.target.value : b)),
                )
              }
              placeholder={
                BULLET_PLACEHOLDERS[index % BULLET_PLACEHOLDERS.length]
              }
            />
            <Button
              size="icon"
              variant="ghost"
              title="Hapus poin"
              className="mt-1"
              onClick={() => onChange(bullets.filter((_, i) => i !== index))}
            >
              <Trash2 size={13} className="text-bad" />
            </Button>
          </div>
        ))}

        <Button
          size="sm"
          variant="ghost"
          onClick={() => onChange([...bullets, ""])}
        >
          <Plus size={13} />
          Tambah poin
        </Button>
      </div>
    </Field>
  );
}

/** Tata letak dua kolom yang menyusut menjadi satu kolom di layar sempit. */
export function Row({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-3 sm:grid-cols-2">{children}</div>;
}

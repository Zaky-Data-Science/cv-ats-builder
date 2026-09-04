"use client";

import * as React from "react";
import {
  ChevronDown,
  ChevronUp,
  GripVertical,
  Plus,
  Trash2,
} from "lucide-react";
import { useI18n } from "@/components/i18n";
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
  const { t } = useI18n();

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

        {/*
          Kedua tombol ini isinya hanya ikon, sehingga namanya harus datang
          dari atribut - dan `title` saja tidak cukup. Ia tidak pernah muncul
          di layar sentuh (tidak ada kursor yang berhenti di atasnya), dan
          sebagian pembaca layar tidak membacanya bila tidak ada nama lain.
          `aria-label` yang menamainya; `title` dibiarkan tetap ada karena ia
          yang memberi keterangan melayang di komputer bertetikus.
        */}
        {(onMoveUp || onMoveDown) && (
          <div className="flex shrink-0 items-center gap-0.5">
            <GripVertical size={13} className="text-ink-300" />
            <Button
              size="icon"
              variant="ghost"
              title={t.form.sectionMoveUp}
              aria-label={t.form.sectionMoveUp}
              onClick={onMoveUp}
              disabled={!onMoveUp}
            >
              <ChevronUp size={13} />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              title={t.form.sectionMoveDown}
              aria-label={t.form.sectionMoveDown}
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
  const { t } = useI18n();
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
        {/* Ikon tanpa teks - alasan `aria-label`-nya sama dengan tombol
            pengurut bagian di atas. */}
        <div className="flex items-center gap-0.5">
          <Button
            size="icon"
            variant="ghost"
            title={t.form.entryMoveUp}
            aria-label={t.form.entryMoveUp}
            onClick={onMoveUp}
            disabled={index === 0}
          >
            <ChevronUp size={13} />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            title={t.form.entryMoveDown}
            aria-label={t.form.entryMoveDown}
            onClick={onMoveDown}
            disabled={index === total - 1}
          >
            <ChevronDown size={13} />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            title={t.form.entryRemove}
            aria-label={t.form.entryRemove}
            onClick={() => setConfirming(true)}
          >
            <Trash2 size={13} className="text-bad" />
          </Button>
        </div>
      </div>

      {confirming ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3">
          <p className="text-xs text-bad">{t.form.entryRemoveConfirm}</p>
          <div className="mt-2 flex gap-2">
            <Button size="sm" variant="danger" onClick={onRemove}>
              {t.form.entryRemoveYes}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setConfirming(false)}
            >
              {t.common.cancel}
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

export function BulletEditor({
  bullets,
  onChange,
}: {
  bullets: string[];
  onChange: (bullets: string[]) => void;
}) {
  const { t } = useI18n();

  // Contoh pengisian berganti-ganti antar-poin. Menampilkan contoh yang sama
  // tiga kali membuat pengguna menyalinnya mentah-mentah; tiga contoh berbeda
  // justru memperlihatkan bahwa yang dituntut adalah polanya - kata kerja
  // aksi di depan, angka di dalamnya - bukan kalimatnya.
  const placeholders = [t.form.bulletPh1, t.form.bulletPh2, t.form.bulletPh3];

  return (
    <Field label={t.form.bulletsLabel} hint={t.form.bulletsHint}>
      <div className="space-y-2">
        {bullets.map((bullet, index) => (
          <div key={index} className="flex items-start gap-2">
            <span className="mt-2.5 text-ink-400">•</span>
            <Textarea
              rows={2}
              value={bullet}
              aria-label={t.form.bulletsLabel}
              onChange={(e) =>
                onChange(
                  bullets.map((b, i) => (i === index ? e.target.value : b)),
                )
              }
              placeholder={placeholders[index % placeholders.length]}
            />
            <Button
              size="icon"
              variant="ghost"
              title={t.form.bulletsRemove}
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
          {t.form.bulletsAdd}
        </Button>
      </div>
    </Field>
  );
}

/** Tata letak dua kolom yang menyusut menjadi satu kolom di layar sempit. */
export function Row({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-3 sm:grid-cols-2">{children}</div>;
}

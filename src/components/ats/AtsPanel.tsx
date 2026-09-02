"use client";

import * as React from "react";
import { AlertCircle, ArrowRight, CheckCircle2, Info } from "lucide-react";
import { Badge, Card } from "@/components/ui";
import {
  DIMENSION_DESCRIPTIONS,
  type AtsFinding,
  type AtsResult,
  type Severity,
} from "@/lib/ats/engine";
import { cn } from "@/lib/utils";

/**
 * Tampilan hasil penilaian ATS.
 *
 * Prinsip perancangannya: angka saja tidak menolong siapa pun. Setiap
 * kekurangan ditampilkan bersama langkah perbaikannya dan tautan yang
 * melompat langsung ke field yang bersangkutan, sehingga pengguna dapat
 * bergerak dari "skor saya 62" ke "saya tahu persis apa yang harus diubah".
 */

const SEVERITY_META: Record<
  Severity,
  { label: string; tone: "bad" | "warn" | "neutral"; icon: typeof AlertCircle }
> = {
  error: { label: "Harus diperbaiki", tone: "bad", icon: AlertCircle },
  warning: { label: "Sebaiknya diperbaiki", tone: "warn", icon: AlertCircle },
  info: { label: "Saran penyempurnaan", tone: "neutral", icon: Info },
};

export function AtsPanel({
  result,
  onJumpTo,
}: {
  result: AtsResult;
  onJumpTo?: (section: string) => void;
}) {
  const grouped: Record<Severity, AtsFinding[]> = {
    error: [],
    warning: [],
    info: [],
  };
  for (const finding of result.suggestions) grouped[finding.severity].push(finding);

  return (
    <div className="space-y-5">
      {/* ---------------------------------------------------------------- */}
      {/* Skor keseluruhan                                                  */}
      {/* ---------------------------------------------------------------- */}
      <Card className="p-5">
        <div className="flex items-center gap-5">
          <ScoreDial score={result.score} grade={result.grade} />
          <div className="min-w-0">
            <p className="text-sm leading-relaxed font-medium text-ink-800">
              {result.verdict}
            </p>
            <p className="mt-1.5 text-xs text-ink-500">
              {grouped.error.length > 0
                ? `${grouped.error.length} hal wajib diperbaiki`
                : "Tidak ada masalah kritis"}
              {grouped.warning.length > 0 &&
                `, ${grouped.warning.length} saran perbaikan`}
              .
            </p>
          </div>
        </div>

        <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-ink-100 pt-4 sm:grid-cols-4">
          <Stat label="Halaman" value={String(result.stats.estimatedPages)} />
          <Stat label="Jumlah kata" value={String(result.stats.wordCount)} />
          <Stat
            label="Poin berkata kerja"
            value={`${Math.round(result.stats.actionVerbRatio * 100)}%`}
          />
          <Stat
            label="Poin berangka"
            value={`${Math.round(result.stats.quantifiedRatio * 100)}%`}
          />
        </dl>
      </Card>

      {/* ---------------------------------------------------------------- */}
      {/* Rincian per dimensi                                               */}
      {/* ---------------------------------------------------------------- */}
      <Card className="p-5">
        <h3 className="text-sm font-semibold text-ink-900">
          Rincian penilaian
        </h3>
        <p className="mt-1 text-xs text-ink-500">
          Skor akhir adalah rata-rata berbobot dari dimensi berikut.
        </p>

        <div className="mt-4 space-y-4">
          {result.dimensions.map((dimension) => (
            <div key={dimension.key}>
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-xs font-semibold text-ink-800">
                  {dimension.label}
                  <span className="ml-1.5 font-normal text-ink-400">
                    bobot {dimension.weight}%
                  </span>
                </span>
                <span
                  className={cn(
                    "text-xs font-bold tabular-nums",
                    !dimension.applicable
                      ? "text-ink-400"
                      : dimension.percent >= 80
                        ? "text-good"
                        : dimension.percent >= 55
                          ? "text-warn"
                          : "text-bad",
                  )}
                >
                  {dimension.applicable
                    ? `${dimension.percent}%`
                    : "belum dinilai"}
                </span>
              </div>

              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-ink-200">
                <div
                  className={cn(
                    "h-full rounded-full transition-[width] duration-500",
                    !dimension.applicable
                      ? "bg-ink-300"
                      : dimension.percent >= 80
                        ? "bg-good"
                        : dimension.percent >= 55
                          ? "bg-warn"
                          : "bg-bad",
                  )}
                  style={{
                    width: `${dimension.applicable ? dimension.percent : 100}%`,
                  }}
                />
              </div>

              <p className="mt-1.5 text-[11px] leading-relaxed text-ink-500">
                {DIMENSION_DESCRIPTIONS[dimension.key]}
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* ---------------------------------------------------------------- */}
      {/* Kata kunci lowongan                                               */}
      {/* ---------------------------------------------------------------- */}
      {result.keywords && result.keywords.keywords.length > 0 && (
        <Card className="p-5">
          <div className="flex items-baseline justify-between">
            <h3 className="text-sm font-semibold text-ink-900">
              Kata kunci dari lowongan
            </h3>
            <span className="text-xs font-bold text-ink-700">
              {Math.round(result.keywords.coverage * 100)}% cocok
            </span>
          </div>

          {result.keywords.missing.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-medium text-bad">
                Belum ada di CV Anda ({result.keywords.missing.length})
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {result.keywords.missing.map((k) => (
                  <Badge key={k.keyword} tone="bad">
                    {k.keyword}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {result.keywords.matched.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-medium text-good">
                Sudah ada ({result.keywords.matched.length})
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {result.keywords.matched.map((k) => (
                  <Badge key={k.keyword} tone="good">
                    {k.keyword}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-[11px] leading-relaxed text-warn">
            Masukkan hanya kata kunci yang benar-benar Anda kuasai. Menempelkan
            keahlian yang tidak dimiliki memang menaikkan skor di sini, tetapi
            akan terbongkar pada tahap wawancara.
          </p>
        </Card>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* Daftar saran                                                      */}
      {/* ---------------------------------------------------------------- */}
      {result.suggestions.length === 0 ? (
        <Card className="flex items-center gap-3 p-5">
          <CheckCircle2 size={20} className="shrink-0 text-good" />
          <p className="text-sm text-ink-700">
            Tidak ada temuan. CV Anda sudah memenuhi seluruh aturan yang
            diperiksa.
          </p>
        </Card>
      ) : (
        (["error", "warning", "info"] as Severity[]).map((severity) => {
          const findings = grouped[severity];
          if (findings.length === 0) return null;
          const meta = SEVERITY_META[severity];

          return (
            <div key={severity}>
              <div className="mb-2 flex items-center gap-2">
                <meta.icon
                  size={15}
                  className={
                    severity === "error"
                      ? "text-bad"
                      : severity === "warning"
                        ? "text-warn"
                        : "text-ink-400"
                  }
                />
                <h3 className="text-sm font-semibold text-ink-900">
                  {meta.label}
                </h3>
                <Badge tone={meta.tone}>{findings.length}</Badge>
              </div>

              <div className="space-y-2">
                {findings.map((finding, index) => (
                  <Card key={`${finding.dimension}-${index}`} className="p-4">
                    <p className="text-xs font-semibold text-ink-900">
                      {finding.message}
                    </p>
                    <p className="mt-1.5 text-xs leading-relaxed text-ink-600">
                      {finding.fix}
                    </p>
                    {finding.section && onJumpTo && (
                      <button
                        type="button"
                        onClick={() => onJumpTo(finding.section!)}
                        className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-semibold text-brand-600 hover:underline"
                      >
                        Buka field terkait
                        <ArrowRight size={12} />
                      </button>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Bagian kecil                                                               */
/* -------------------------------------------------------------------------- */

function ScoreDial({ score, grade }: { score: number; grade: string }) {
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const color =
    score >= 85
      ? "var(--color-good)"
      : score >= 70
        ? "#65a30d"
        : score >= 55
          ? "var(--color-warn)"
          : "var(--color-bad)";

  return (
    <div className="relative shrink-0" style={{ width: 84, height: 84 }}>
      <svg width="84" height="84" viewBox="0 0 84 84">
        <circle
          cx="42"
          cy="42"
          r={radius}
          fill="none"
          stroke="var(--color-ink-200)"
          strokeWidth="8"
        />
        <circle
          cx="42"
          cy="42"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - score / 100)}
          transform="rotate(-90 42 42)"
          style={{ transition: "stroke-dashoffset 500ms ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl leading-none font-bold text-ink-900">
          {score}
        </span>
        <span className="text-[10px] font-semibold text-ink-500">
          Nilai {grade}
        </span>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] text-ink-500">{label}</dt>
      <dd className="text-sm font-bold text-ink-900">{value}</dd>
    </div>
  );
}

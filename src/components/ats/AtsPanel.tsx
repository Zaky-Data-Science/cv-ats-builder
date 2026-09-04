"use client";

import * as React from "react";
import { AlertCircle, ArrowRight, CheckCircle2, Info } from "lucide-react";
import { useI18n } from "@/components/i18n";
import { Badge, Card } from "@/components/ui";
import {
  dimensionDescriptions,
  type AtsFinding,
  type AtsResult,
  type Severity,
} from "@/lib/ats/engine";
import { cn } from "@/lib/utils";

/**
 * Tampilan hasil penilaian.
 *
 * Prinsip perancangannya: angka saja tidak menolong siapa pun. Setiap
 * kekurangan ditampilkan bersama langkah perbaikannya dan tautan yang
 * melompat langsung ke field yang bersangkutan, sehingga pengguna dapat
 * bergerak dari "nilai saya 62" ke "saya tahu persis apa yang harus diubah".
 *
 * Yang ditampilkan **dua angka, bukan satu**, dan pemisahannya bukan soal
 * tata letak. Tidak ada "skor ATS" universal yang bisa direplikasi: filter
 * penyaringan dikonfigurasi tiap pemberi kerja, dan hanya sebagian sistem yang
 * memberi peringkat otomatis sama sekali. Yang dapat dipertanggungjawabkan
 * hanya dua hal - seberapa cocok CV ini dengan satu iklan lowongan tertentu,
 * dan seberapa kuat serta terbaca isinya - dan keduanya mengukur hal yang
 * berbeda. Sanggahannya ditampilkan permanen di sebelah keduanya, bukan
 * disembunyikan di balik tanda tanya.
 */

const SEVERITY_META: Record<
  Severity,
  { tone: "bad" | "warn" | "neutral"; icon: typeof AlertCircle }
> = {
  error: { tone: "bad", icon: AlertCircle },
  warning: { tone: "warn", icon: AlertCircle },
  info: { tone: "neutral", icon: Info },
};

export function AtsPanel({
  result,
  onJumpTo,
}: {
  result: AtsResult;
  onJumpTo?: (section: string) => void;
}) {
  const { locale, t } = useI18n();
  const descriptions = dimensionDescriptions(locale);
  const severityLabel: Record<Severity, string> = {
    error: t.ats.severityError,
    warning: t.ats.severityWarning,
    info: t.ats.severityInfo,
  };

  const grouped: Record<Severity, AtsFinding[]> = {
    error: [],
    warning: [],
    info: [],
  };
  for (const finding of result.suggestions) grouped[finding.severity].push(finding);

  return (
    <div className="space-y-5">
      {/* ---------------------------------------------------------------- */}
      {/* Dua angka                                                         */}
      {/* ---------------------------------------------------------------- */}
      <Card className="p-5">
        <div className="flex items-center gap-5">
          <ScoreDial
            score={result.strength}
            grade={result.grade}
            gradeLabel={t.ats.gradePrefix}
          />
          <div className="min-w-0">
            <p className="text-[11px] font-semibold tracking-wide text-ink-500 uppercase">
              {t.ats.strengthTitle}
            </p>
            <p className="mt-0.5 text-sm leading-relaxed font-medium text-ink-800">
              {result.verdict}
            </p>
            <p className="mt-1.5 text-xs text-ink-500">
              {grouped.error.length > 0
                ? `${grouped.error.length} ${t.ats.mustFixCount}`
                : t.ats.noCritical}
              {grouped.warning.length > 0 &&
                `, ${grouped.warning.length} ${t.ats.suggestionCount}`}
              .
            </p>
          </div>
        </div>

        <div className="mt-4 grid gap-3 border-t border-ink-100 pt-4 sm:grid-cols-2">
          <div>
            <p className="text-[11px] font-semibold tracking-wide text-ink-500 uppercase">
              {t.ats.strengthTitle}
            </p>
            <p className="mt-0.5 text-lg font-bold tabular-nums text-ink-900">
              {result.strength}
              <span className="ml-0.5 text-xs font-normal text-ink-400">/100</span>
            </p>
            <p className="mt-0.5 text-[11px] leading-relaxed text-ink-500">
              {t.ats.strengthHint}
            </p>
          </div>
          <div>
            <p className="text-[11px] font-semibold tracking-wide text-ink-500 uppercase">
              {t.ats.matchTitle}
            </p>
            <p className="mt-0.5 text-lg font-bold tabular-nums text-ink-900">
              {result.match === null ? (
                <span className="text-sm font-medium text-ink-400">
                  {t.ats.matchEmpty}
                </span>
              ) : (
                <>
                  {result.match}
                  <span className="ml-0.5 text-xs font-normal text-ink-400">
                    /100
                  </span>
                </>
              )}
            </p>
            <p className="mt-0.5 text-[11px] leading-relaxed text-ink-500">
              {t.ats.matchHint}
            </p>
          </div>
        </div>

        {/*
          Sanggahan permanen, tidak dapat ditutup dan tidak disembunyikan di
          balik ikon. Angka apa pun yang ditampilkan aplikasi CV akan dibaca
          sebagai ramalan lolos-tidaknya lamaran seseorang kecuali ada kalimat
          yang mengatakan sebaliknya di tempat yang sama.
        */}
        <p className="mt-3 rounded-md bg-ink-50 px-3 py-2 text-[11px] leading-relaxed text-ink-600">
          {t.ats.scoreDisclaimer}
        </p>

        {result.strengthTanpaPortofolio !== null &&
          result.strengthTanpaPortofolio !== result.strength && (
            <p className="mt-2 rounded-md border border-brand-200 bg-brand-50/50 px-3 py-2 text-[11px] leading-relaxed text-ink-700">
              {t.ats.weightChanged.replace(
                "{n}",
                String(result.strengthTanpaPortofolio),
              )}
            </p>
          )}

        <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-ink-100 pt-4 sm:grid-cols-4">
          <Stat
            label={t.ats.statPages}
            value={String(result.stats.estimatedPages)}
          />
          <Stat
            label={t.ats.statWords}
            value={String(result.stats.wordCount)}
          />
          <Stat
            label={t.ats.statActionVerbs}
            value={`${Math.round(result.stats.actionVerbRatio * 100)}%`}
          />
          <Stat
            label={t.ats.statQuantified}
            value={`${Math.round(result.stats.quantifiedRatio * 100)}%`}
          />
        </dl>
      </Card>

      {/* ---------------------------------------------------------------- */}
      {/* Rincian per dimensi                                               */}
      {/* ---------------------------------------------------------------- */}
      <Card className="p-5">
        <h3 className="text-sm font-semibold text-ink-900">
          {t.ats.breakdownTitle}
        </h3>
        <p className="mt-1 text-xs text-ink-500">{t.ats.breakdownHint}</p>

        <div className="mt-4 space-y-4">
          {result.dimensions.map((dimension) => (
            <div key={dimension.key}>
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-xs font-semibold text-ink-800">
                  {dimension.label}
                  <span className="ml-1.5 font-normal text-ink-400">
                    {t.ats.weight} {dimension.weight}%
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
                    : t.ats.notScored}
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
                {descriptions[dimension.key]}
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* ---------------------------------------------------------------- */}
      {/* Rincian kekuatan bukti, per karya                                 */}
      {/* ---------------------------------------------------------------- */}
      {result.buktiKarya && result.buktiKarya.item.length > 0 && (
        <Card className="p-5">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="text-sm font-semibold text-ink-900">
              {t.ats.buktiTitle}
            </h3>
            <span className="text-xs font-bold tabular-nums text-ink-700">
              {result.buktiKarya.skor}/100
            </span>
          </div>
          <p className="mt-1 text-xs text-ink-500">{t.ats.buktiHint}</p>

          <ul className="mt-3 space-y-2">
            {result.buktiKarya.item.map((karya) => (
              <li
                key={karya.id}
                className="flex items-baseline justify-between gap-3 border-b border-ink-100 pb-2 last:border-0"
              >
                <span className="min-w-0 truncate text-xs text-ink-800">
                  {karya.judul || "-"}
                </span>
                <span className="shrink-0 text-[11px] tabular-nums text-ink-500">
                  {t.ats.buktiQ} {karya.q}/3 · {t.ats.buktiR} {karya.r}/3 ·{" "}
                  <span className="font-semibold text-ink-800">{karya.skor}</span>
                </span>
              </li>
            ))}
          </ul>

          <p className="mt-2 text-[11px] text-ink-500">
            {result.buktiKarya.n} {t.ats.buktiItems}
            {result.buktiKarya.p < 1 && ` - ${t.ats.buktiFew}`}.
          </p>
        </Card>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* Kata kunci lowongan                                               */}
      {/* ---------------------------------------------------------------- */}
      {result.keywords && result.keywords.keywords.length > 0 && (
        <Card className="p-5">
          <div className="flex items-baseline justify-between">
            <h3 className="text-sm font-semibold text-ink-900">
              {t.ats.keywordsTitle}
            </h3>
            <span className="text-xs font-bold text-ink-700">
              {Math.round(result.keywords.coverage * 100)}%{" "}
              {t.ats.keywordsMatchSuffix}
            </span>
          </div>

          {result.keywords.missing.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-medium text-bad">
                {t.ats.keywordsMissing} ({result.keywords.missing.length})
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
                {t.ats.keywordsMatched} ({result.keywords.matched.length})
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
            {t.ats.keywordsWarning}
          </p>
        </Card>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* Daftar saran                                                      */}
      {/* ---------------------------------------------------------------- */}
      {result.suggestions.length === 0 ? (
        <Card className="flex items-center gap-3 p-5">
          <CheckCircle2 size={20} className="shrink-0 text-good" />
          <p className="text-sm text-ink-700">{t.ats.noFindings}</p>
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
                  {severityLabel[severity]}
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
                        className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-semibold text-ink-800 underline"
                      >
                        {t.ats.openField}
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

function ScoreDial({
  score,
  grade,
  gradeLabel,
}: {
  score: number;
  grade: string;
  gradeLabel: string;
}) {
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
          {gradeLabel} {grade}
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

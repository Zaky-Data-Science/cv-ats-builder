"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  CircleAlert,
  FileText,
  Info,
  Loader2,
  ShieldCheck,
  Trophy,
  Upload,
  X,
} from "lucide-react";
import { useI18n } from "@/components/i18n";
import { Interactive } from "@/components/motion";
import { Badge, Button, Callout, Card, Textarea } from "@/components/ui";
import {
  analyzeDocument,
  compareDocuments,
  keywordSkippedNote,
  singleAdvice,
  type ComparisonResult,
  type DocumentAnalysis,
} from "@/lib/ats/document";
import type { Severity } from "@/lib/ats/types";
import {
  extractDocument,
  formatBytes,
  IntakeError,
  type ExtractedDocument,
} from "@/lib/intake/extract";
import { cn } from "@/lib/utils";

const MAX_FILES = 5;

interface Slot {
  id: string;
  file: File;
  state: "idle" | "reading" | "done" | "error";
  error?: string;
  document?: ExtractedDocument;
}

/**
 * ============================================================================
 *  PEMBANDING DAN PEMINDAI CV
 * ============================================================================
 *
 * Satu halaman, dua kegunaan. Satu berkas berarti "pindai CV saya"; dua
 * berkas atau lebih berarti "bandingkan". Keduanya tidak dipisah menjadi dua
 * halaman karena mesin penilaiannya sama persis - yang berbeda hanya ada atau
 * tidaknya pembanding - dan memecahnya akan memaksa pengguna memilih lebih
 * dulu hal yang bisa disimpulkan sendiri dari jumlah berkas yang ia jatuhkan.
 *
 * Seluruh pembacaan berkas berjalan di peramban. Lihat komentar di
 * lib/intake/extract.ts untuk alasan lengkapnya.
 */
export function CompareClient() {
  const { locale, t } = useI18n();

  const [slots, setSlots] = React.useState<Slot[]>([]);
  const [jobDescription, setJobDescription] = React.useState("");
  const [showJob, setShowJob] = React.useState(false);
  const [dragging, setDragging] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [notice, setNotice] = React.useState<string | null>(null);
  const [analyses, setAnalyses] = React.useState<DocumentAnalysis[] | null>(
    null,
  );

  const inputRef = React.useRef<HTMLInputElement>(null);

  /* ------------------------------------------------------------------ */
  /* Penerimaan berkas                                                   */
  /* ------------------------------------------------------------------ */

  const addFiles = React.useCallback(
    (incoming: FileList | File[]) => {
      setNotice(null);
      setAnalyses(null);

      setSlots((previous) => {
        const room = MAX_FILES - previous.length;
        if (room <= 0) {
          setNotice(t.compare.tooMany);
          return previous;
        }
        const accepted = Array.from(incoming).slice(0, room);
        if (Array.from(incoming).length > room) setNotice(t.compare.tooMany);

        return [
          ...previous,
          ...accepted.map((file) => ({
            // crypto.randomUUID tersedia di seluruh peramban yang didukung
            // aplikasi ini, dan id ini hanya dipakai sebagai kunci daftar.
            id: crypto.randomUUID(),
            file,
            state: "idle" as const,
          })),
        ];
      });
    },
    [t],
  );

  const removeSlot = (id: string) => {
    setAnalyses(null);
    setSlots((previous) => previous.filter((slot) => slot.id !== id));
  };

  /* ------------------------------------------------------------------ */
  /* Analisis                                                            */
  /* ------------------------------------------------------------------ */

  async function run() {
    if (slots.length === 0 || busy) return;
    setBusy(true);
    setNotice(null);
    setAnalyses(null);

    const results: DocumentAnalysis[] = [];
    // Berkas diproses satu per satu, bukan serentak. Mengurai lima PDF
    // sekaligus pada ponsel kelas menengah membuat halamannya membeku;
    // berurutan hanya beberapa ratus milidetik lebih lama, dan sepanjang
    // proses itu pengguna melihat berkas mana yang sedang dibaca.
    for (const slot of slots) {
      setSlots((previous) =>
        previous.map((s) =>
          s.id === slot.id ? { ...s, state: "reading", error: undefined } : s,
        ),
      );

      try {
        const document = await extractDocument(slot.file);
        results.push(analyzeDocument(document, jobDescription, locale));
        setSlots((previous) =>
          previous.map((s) =>
            s.id === slot.id ? { ...s, state: "done", document } : s,
          ),
        );
      } catch (error) {
        const message =
          error instanceof IntakeError
            ? error.message
            : error instanceof Error
              ? error.message
              : String(error);
        setSlots((previous) =>
          previous.map((s) =>
            s.id === slot.id ? { ...s, state: "error", error: message } : s,
          ),
        );
      }
    }

    setAnalyses(results);
    setBusy(false);
  }

  function reset() {
    setSlots([]);
    setAnalyses(null);
    setJobDescription("");
    setNotice(null);
  }

  const comparison: ComparisonResult | null = React.useMemo(
    () => (analyses && analyses.length >= 2 ? compareDocuments(analyses, locale) : null),
    [analyses, locale],
  );

  const failed = slots.filter((slot) => slot.state === "error");

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-10 sm:py-14">
      {/* ---------------------------------------------------------------- */}
      {/* Judul                                                             */}
      {/* ---------------------------------------------------------------- */}
      <h1 className="text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">
        {t.compare.title}
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-600">
        {t.compare.subtitle}
      </p>

      <div className="mt-5 flex gap-3 rounded-xl border border-ink-200 bg-white p-4">
        <ShieldCheck size={18} className="mt-0.5 shrink-0 text-ink-700" aria-hidden />
        <p className="text-xs leading-relaxed text-ink-600">
          <strong className="text-ink-900">{t.compare.privacyTitle}</strong>{" "}
          {t.compare.privacyBody}
        </p>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Area jatuhkan berkas                                              */}
      {/* ---------------------------------------------------------------- */}
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          if (event.dataTransfer.files.length > 0) {
            addFiles(event.dataTransfer.files);
          }
        }}
        className={cn(
          "mt-6 rounded-2xl border-2 border-dashed p-8 text-center transition-colors",
          dragging
            ? "border-ink-900 bg-ink-50"
            : "border-ink-300 bg-white hover:border-ink-400",
        )}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".pdf,.docx,.txt,.md,application/pdf,text/plain"
          className="hidden"
          onChange={(event) => {
            if (event.target.files) addFiles(event.target.files);
            event.target.value = "";
          }}
        />

        <Upload size={26} className="mx-auto text-ink-400" aria-hidden />
        <p className="mt-3 text-sm font-semibold text-ink-900">
          {t.compare.dropTitle}
        </p>
        <p className="mt-1 text-xs text-ink-500">{t.compare.dropSubtitle}</p>

        <Button
          variant="outline"
          className="press mt-4"
          onClick={() => inputRef.current?.click()}
        >
          {t.compare.chooseFiles}
        </Button>

        <p className="mt-3 text-[11px] text-ink-400">{t.compare.dropFormats}</p>
      </div>

      {notice && (
        <div className="mt-3">
          <Callout tone="warn">{notice}</Callout>
        </div>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* Daftar berkas                                                     */}
      {/* ---------------------------------------------------------------- */}
      {slots.length > 0 && (
        <ul className="mt-4 space-y-2">
          {slots.map((slot) => (
            <li
              key={slot.id}
              className="flex items-center gap-3 rounded-xl border border-ink-200 bg-white px-4 py-3"
            >
              {slot.state === "reading" ? (
                <Loader2 size={16} className="shrink-0 animate-spin text-ink-500" />
              ) : slot.state === "error" ? (
                <CircleAlert size={16} className="shrink-0 text-bad" />
              ) : slot.state === "done" ? (
                <CheckCircle2 size={16} className="shrink-0 text-good" />
              ) : (
                <FileText size={16} className="shrink-0 text-ink-400" />
              )}

              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-ink-900">
                  {slot.file.name}
                </p>
                <p className="text-[11px] text-ink-500">
                  {slot.state === "reading"
                    ? `${t.compare.readingFile}...`
                    : slot.state === "error"
                      ? slot.error
                      : formatBytes(slot.file.size)}
                </p>
              </div>

              <button
                type="button"
                onClick={() => removeSlot(slot.id)}
                aria-label={t.compare.fileRemove}
                title={t.compare.fileRemove}
                className="shrink-0 rounded-lg p-1.5 text-ink-400 transition-colors hover:bg-ink-100 hover:text-ink-800"
              >
                <X size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* Iklan lowongan (opsional)                                         */}
      {/* ---------------------------------------------------------------- */}
      <div className="mt-4">
        <button
          type="button"
          onClick={() => setShowJob((value) => !value)}
          className="text-xs font-semibold text-ink-700 underline"
        >
          {showJob ? t.compare.jobToggleHide : t.compare.jobToggleShow}
        </button>

        {showJob && (
          <div className="mt-3">
            <Textarea
              rows={8}
              value={jobDescription}
              aria-label={t.ats.jobLabel}
              placeholder={t.ats.jobPlaceholder}
              onChange={(event) => setJobDescription(event.target.value)}
            />
            <p className="mt-2 text-[11px] leading-relaxed text-ink-500">
              {t.compare.jobHint}
            </p>
          </div>
        )}
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Tombol jalan                                                      */}
      {/* ---------------------------------------------------------------- */}
      <div className="mt-5 flex flex-wrap gap-2">
        <Button
          className="press"
          onClick={run}
          disabled={slots.length === 0 || busy}
        >
          {busy ? <Loader2 size={15} className="animate-spin" /> : null}
          {busy ? t.compare.analyzing : t.compare.analyze}
        </Button>
        {slots.length > 0 && (
          <Button variant="ghost" onClick={reset} disabled={busy}>
            {t.compare.reset}
          </Button>
        )}
      </div>

      {failed.length > 0 && !busy && (
        <div className="mt-4">
          <Callout tone="bad" title={t.compare.errorTitle}>
            <ul className="space-y-1">
              {failed.map((slot) => (
                <li key={slot.id}>{slot.error}</li>
              ))}
            </ul>
          </Callout>
        </div>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* Hasil                                                             */}
      {/* ---------------------------------------------------------------- */}
      {analyses && analyses.length > 0 && (
        <section className="mt-10">
          <h2 className="text-lg font-bold text-ink-900">
            {analyses.length >= 2
              ? t.compare.resultCompareTitle
              : t.compare.resultSingleTitle}
          </h2>

          {comparison && <ComparisonSummary comparison={comparison} />}

          {!jobDescription.trim() && (
            <p className="mt-4 rounded-lg bg-ink-100 px-3 py-2 text-[11px] leading-relaxed text-ink-600">
              {keywordSkippedNote(locale)}
            </p>
          )}

          <div className="mt-6 space-y-5">
            {(comparison ? comparison.ranked : analyses).map(
              (analysis, index) => (
                <AnalysisCard
                  key={analysis.fileName + index}
                  analysis={analysis}
                  rank={comparison ? index + 1 : null}
                />
              ),
            )}
          </div>

          {analyses.length === 1 && (
            <p className="mt-5 rounded-lg bg-ink-100 px-3 py-2.5 text-xs leading-relaxed text-ink-600">
              {singleAdvice(locale)}
            </p>
          )}

          <p className="mt-5 text-[11px] leading-relaxed text-ink-500">
            {t.compare.limitsNote}
          </p>

          {/* Ajakan ke editor */}
          <Interactive className="mt-8">
            <Card className="p-6">
            <h3 className="text-sm font-semibold text-ink-900">
              {t.compare.ctaTitle}
            </h3>
            <p className="mt-1.5 max-w-2xl text-xs leading-relaxed text-ink-600">
              {t.compare.ctaBody}
            </p>
              <Link href="/login" className="mt-4 inline-block">
                <Button className="press">
                  {t.compare.ctaButton}
                  <ArrowRight size={15} />
                </Button>
              </Link>
            </Card>
          </Interactive>
        </section>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Ringkasan perbandingan                                                     */
/* -------------------------------------------------------------------------- */

function ComparisonSummary({ comparison }: { comparison: ComparisonResult }) {
  const { t } = useI18n();

  return (
    <div className="mt-4 space-y-5">
      <Card className="p-5">
        <div className="flex items-start gap-4">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-ink-900 text-white">
            <Trophy size={20} aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold tracking-wide text-ink-500 uppercase">
              {t.compare.winnerLabel}
            </p>
            <p className="truncate text-base font-bold text-ink-900">
              {comparison.winner.fileName}
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-ink-600">
              {comparison.verdict}
            </p>
          </div>
        </div>

        {comparison.reasons.length > 0 && (
          <div className="mt-4 border-t border-ink-100 pt-4">
            <p className="text-xs font-semibold text-ink-900">
              {t.compare.reasonsTitle}
            </p>
            <ul className="mt-2 space-y-1">
              {comparison.reasons.map((reason) => (
                <li
                  key={reason}
                  className="flex gap-2 text-xs leading-relaxed text-ink-600"
                >
                  <span className="text-ink-400" aria-hidden>
                    &bull;
                  </span>
                  {reason}
                </li>
              ))}
            </ul>
          </div>
        )}

        <p className="mt-4 rounded-lg bg-ink-100 px-3 py-2 text-[11px] leading-relaxed text-ink-600">
          {comparison.advice}
        </p>
      </Card>

      {/* Tabel per dimensi. Digulirkan sendiri di layar sempit, sehingga
          halamannya tidak pernah meluber ke samping. */}
      <Card className="p-5">
        <h3 className="text-sm font-semibold text-ink-900">
          {t.compare.perDimensionTitle}
        </h3>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[34rem] text-left text-xs">
            <thead>
              <tr className="border-b border-ink-200 text-ink-500">
                <th className="py-2 pr-3 font-medium">
                  {t.compare.dimensionColumn}
                </th>
                <th className="py-2 pr-3 font-medium">{t.compare.bestColumn}</th>
                <th className="py-2 pr-3 font-medium">
                  {t.compare.worstColumn}
                </th>
                <th className="py-2 font-medium">{t.compare.spreadColumn}</th>
              </tr>
            </thead>
            <tbody>
              {comparison.perDimension.map((row) => (
                <tr key={row.key} className="border-b border-ink-100">
                  <td className="py-2.5 pr-3 font-medium text-ink-800">
                    {row.label}
                  </td>
                  <td className="py-2.5 pr-3 text-ink-600">
                    <span className="block max-w-[12rem] truncate">
                      {row.best}
                    </span>
                    <span className="font-semibold text-good">
                      {row.bestPercent}%
                    </span>
                  </td>
                  <td className="py-2.5 pr-3 text-ink-600">
                    <span className="block max-w-[12rem] truncate">
                      {row.worst}
                    </span>
                    <span className="font-semibold text-ink-500">
                      {row.worstPercent}%
                    </span>
                  </td>
                  <td className="py-2.5 font-semibold text-ink-800 tabular-nums">
                    {row.spread}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Kartu satu CV                                                              */
/* -------------------------------------------------------------------------- */

const SEVERITY_ICON: Record<Severity, typeof CircleAlert> = {
  error: CircleAlert,
  warning: CircleAlert,
  info: Info,
};

function AnalysisCard({
  analysis,
  rank,
}: {
  analysis: DocumentAnalysis;
  rank: number | null;
}) {
  const { t } = useI18n();

  return (
    <Card className="overflow-hidden">
      {/* Kepala kartu */}
      <div className="flex flex-wrap items-center gap-3 border-b border-ink-100 px-5 py-4">
        {rank !== null && (
          <span
            className={cn(
              "grid h-8 w-8 shrink-0 place-items-center rounded-lg text-sm font-bold",
              rank === 1 ? "bg-ink-900 text-white" : "bg-ink-100 text-ink-600",
            )}
            aria-label={`${t.compare.rankLabel} ${rank}`}
          >
            {rank}
          </span>
        )}

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-ink-900">
            {analysis.fileName}
          </p>
          <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-ink-500">
            <span>
              {t.compare.statPages}: {analysis.stats.pageCount}
            </span>
            <span>
              {t.compare.statWords}: {analysis.stats.wordCount}
            </span>
            <span>
              {t.compare.statBullets}: {analysis.stats.bulletCount}
            </span>
            <span>
              {t.compare.statColumns}: {analysis.stats.columns}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            tone={
              analysis.score >= 85
                ? "good"
                : analysis.score >= 70
                  ? "neutral"
                  : analysis.score >= 55
                    ? "warn"
                    : "bad"
            }
          >
            {t.ats.gradePrefix} {analysis.grade}
          </Badge>
          <span className="text-2xl leading-none font-bold text-ink-900 tabular-nums">
            {analysis.score}
          </span>
        </div>
      </div>

      {/* Batang dimensi */}
      <div className="grid gap-3 border-b border-ink-100 px-5 py-4 sm:grid-cols-2">
        {analysis.dimensions.map((dimension) => (
          <div key={dimension.key}>
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-[11px] font-medium text-ink-700">
                {dimension.label}
              </span>
              <span
                className={cn(
                  "text-[11px] font-bold tabular-nums",
                  !dimension.applicable
                    ? "text-ink-400"
                    : dimension.percent >= 80
                      ? "text-good"
                      : dimension.percent >= 55
                        ? "text-warn"
                        : "text-bad",
                )}
              >
                {dimension.applicable ? `${dimension.percent}%` : t.ats.notScored}
              </span>
            </div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-ink-200">
              <div
                className={cn(
                  "h-full rounded-full",
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
          </div>
        ))}
      </div>

      {/* Kelebihan dan kekurangan */}
      <div className="grid gap-6 px-5 py-5 lg:grid-cols-2">
        <div>
          <h4 className="flex items-center gap-1.5 text-xs font-semibold text-ink-900">
            <CheckCircle2 size={14} className="text-good" aria-hidden />
            {t.compare.strengthsTitle}
          </h4>
          {analysis.strengths.length === 0 ? (
            <p className="mt-2 text-xs text-ink-500">{t.compare.noStrength}</p>
          ) : (
            <ul className="mt-2 space-y-1.5">
              {analysis.strengths.map((strength) => (
                <li
                  key={strength}
                  className="flex gap-2 text-xs leading-relaxed text-ink-600"
                >
                  <span className="text-good" aria-hidden>
                    &bull;
                  </span>
                  {strength}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <h4 className="flex items-center gap-1.5 text-xs font-semibold text-ink-900">
            <CircleAlert size={14} className="text-warn" aria-hidden />
            {t.compare.weaknessesTitle}
          </h4>
          {analysis.weaknesses.length === 0 ? (
            <p className="mt-2 text-xs text-ink-500">{t.compare.noWeakness}</p>
          ) : (
            <ul className="mt-2 space-y-2.5">
              {analysis.weaknesses.map((finding, index) => {
                const Icon = SEVERITY_ICON[finding.severity];
                return (
                  <li key={`${finding.dimension}-${index}`} className="flex gap-2">
                    <Icon
                      size={13}
                      aria-hidden
                      className={cn(
                        "mt-0.5 shrink-0",
                        finding.severity === "error"
                          ? "text-bad"
                          : finding.severity === "warning"
                            ? "text-warn"
                            : "text-ink-400",
                      )}
                    />
                    <span className="min-w-0">
                      <span className="block text-xs font-medium text-ink-900">
                        {finding.message}
                      </span>
                      <span className="mt-0.5 block text-xs leading-relaxed text-ink-600">
                        {finding.fix}
                      </span>
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </Card>
  );
}

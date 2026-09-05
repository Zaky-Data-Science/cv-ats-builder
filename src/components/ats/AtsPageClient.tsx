"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Gauge, Loader2 } from "lucide-react";
import { AtsPanel } from "@/components/ats/AtsPanel";
import { useI18n } from "@/components/i18n";
import { Button, buttonClass, Callout, Card, Textarea } from "@/components/ui";
import { analyzeResume, type AtsResult } from "@/lib/ats/engine";
import type { ResumeData } from "@/lib/resume/types";

interface HistoryEntry {
  id: string;
  score: number;
  createdAt: string;
}

/**
 * Halaman pencocokan CV dengan sebuah lowongan.
 *
 * Skor dihitung langsung di peramban supaya hasilnya muncul seketika.
 * Tombol simpan mengirim hasil yang sama ke server untuk dicatat sebagai
 * riwayat - yang kemudian menjadi data perkembangan skor dari waktu ke waktu.
 */
export function AtsPageClient({
  resume,
  initialHistory,
}: {
  resume: ResumeData;
  initialHistory: HistoryEntry[];
}) {
  const { locale, t } = useI18n();
  const [jobDescription, setJobDescription] = React.useState("");
  const [history, setHistory] = React.useState(initialHistory);
  const [saving, setSaving] = React.useState(false);
  // Disimpan sebagai pasangan nada + teks, bukan teks saja. Menebak berhasil
  // atau gagal dengan memeriksa isi kalimatnya akan langsung meleset begitu
  // bahasanya berganti.
  const [notice, setNotice] = React.useState<{
    tone: "good" | "bad";
    text: string;
  } | null>(null);

  const result: AtsResult = React.useMemo(
    () => analyzeResume(resume, jobDescription, undefined, locale),
    [resume, jobDescription, locale],
  );

  async function saveToHistory() {
    setSaving(true);
    setNotice(null);
    try {
      const response = await fetch(`/api/resumes/${resume.id}/ats`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription, persist: true }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        setNotice({
          tone: "bad",
          text: payload.error ?? t.ats.historySaveFailed,
        });
        return;
      }
      setHistory((prev) => [
        {
          id: crypto.randomUUID(),
          score: payload.result.score,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);
      setNotice({ tone: "good", text: t.ats.historySaved });
    } catch {
      setNotice({ tone: "bad", text: t.ats.historyOffline });
    } finally {
      setSaving(false);
    }
  }

  const best =
    history.length > 0 ? Math.max(...history.map((h) => h.score)) : null;
  const dateLocale = locale === "en" ? "en-GB" : "id-ID";

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            href={`/resume/${resume.id}/edit`}
            className={buttonClass({ variant: "ghost", size: "sm" })}
          >
            <ArrowLeft size={15} />
            {t.ats.backToEditor}
          </Link>
          <div>
            <h1 className="text-lg font-bold text-ink-900">
              {t.ats.pageTitle} - {resume.title}
            </h1>
            <p className="text-xs text-ink-500">{t.ats.pageSubtitle}</p>
          </div>
        </div>

        <Button onClick={saveToHistory} disabled={saving}>
          {saving ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <Gauge size={15} />
          )}
          {t.ats.saveToHistory}
        </Button>
      </div>

      {notice && (
        <div className="mt-4">
          <Callout tone={notice.tone}>{notice.text}</Callout>
        </div>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,380px)_1fr]">
        {/* ---------------------------------------------------------------- */}
        {/* Kiri: deskripsi lowongan dan riwayat                              */}
        {/* ---------------------------------------------------------------- */}
        <div className="space-y-4">
          <Card className="p-5">
            <h2 className="text-sm font-semibold text-ink-900">
              {t.ats.jobDescTitle}
            </h2>
            <p className="mt-1 mb-3 text-xs leading-relaxed text-ink-500">
              {t.ats.jobDescHint}
            </p>
            <Textarea
              rows={14}
              value={jobDescription}
              aria-label={t.ats.jobLabel}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder={t.ats.jobPlaceholder}
            />
            {jobDescription.trim().length > 0 && (
              <p className="mt-2 text-[11px] text-ink-500">
                {jobDescription.trim().split(/\s+/).length} {t.ats.wordsAnalyzed}
              </p>
            )}
          </Card>

          <Card className="p-5">
            <h2 className="text-sm font-semibold text-ink-900">
              {t.ats.historyTitle}
            </h2>
            {history.length === 0 ? (
              <p className="mt-2 text-xs leading-relaxed text-ink-500">
                {t.ats.historyEmpty}
              </p>
            ) : (
              <>
                {best !== null && (
                  <p className="mt-1 text-xs text-ink-500">
                    {t.ats.historyBest}{" "}
                    <strong className="text-ink-800">{best}</strong>
                  </p>
                )}
                <ul className="mt-3 space-y-1.5">
                  {history.map((entry) => (
                    <li
                      key={entry.id}
                      className="flex items-center justify-between rounded-lg bg-ink-50 px-3 py-2"
                    >
                      <span className="text-xs text-ink-600">
                        {new Date(entry.createdAt).toLocaleString(dateLocale, {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      <span
                        className={`text-sm font-bold ${
                          entry.score >= 70
                            ? "text-good"
                            : entry.score >= 55
                              ? "text-warn"
                              : "text-bad"
                        }`}
                      >
                        {entry.score}
                      </span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </Card>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Kanan: hasil penilaian                                            */}
        {/* ---------------------------------------------------------------- */}
        <div>
          <AtsPanel result={result} />
        </div>
      </div>
    </div>
  );
}

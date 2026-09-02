"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Gauge, Loader2 } from "lucide-react";
import { AtsPanel } from "@/components/ats/AtsPanel";
import { Button, Callout, Card, Textarea } from "@/components/ui";
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
  const [jobDescription, setJobDescription] = React.useState("");
  const [history, setHistory] = React.useState(initialHistory);
  const [saving, setSaving] = React.useState(false);
  const [notice, setNotice] = React.useState<string | null>(null);

  const result: AtsResult = React.useMemo(
    () => analyzeResume(resume, jobDescription),
    [resume, jobDescription],
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
        setNotice(payload.error ?? "Gagal menyimpan hasil penilaian.");
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
      setNotice("Hasil penilaian tersimpan ke riwayat.");
    } catch {
      setNotice("Tidak dapat terhubung ke server.");
    } finally {
      setSaving(false);
    }
  }

  const best = history.length > 0 ? Math.max(...history.map((h) => h.score)) : null;

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link href={`/resume/${resume.id}/edit`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft size={15} />
              Kembali ke editor
            </Button>
          </Link>
          <div>
            <h1 className="text-lg font-bold text-ink-900">
              Analisis ATS - {resume.title}
            </h1>
            <p className="text-xs text-ink-500">
              Tempelkan iklan lowongan untuk melihat kata kunci yang belum ada
              di CV Anda.
            </p>
          </div>
        </div>

        <Button onClick={saveToHistory} disabled={saving}>
          {saving ? <Loader2 size={15} className="animate-spin" /> : <Gauge size={15} />}
          Simpan Hasil ke Riwayat
        </Button>
      </div>

      {notice && (
        <div className="mt-4">
          <Callout tone={notice.includes("tersimpan") ? "good" : "bad"}>
            {notice}
          </Callout>
        </div>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,380px)_1fr]">
        {/* ---------------------------------------------------------------- */}
        {/* Kiri: deskripsi lowongan dan riwayat                              */}
        {/* ---------------------------------------------------------------- */}
        <div className="space-y-4">
          <Card className="p-5">
            <h2 className="text-sm font-semibold text-ink-900">
              Deskripsi Lowongan
            </h2>
            <p className="mt-1 mb-3 text-xs leading-relaxed text-ink-500">
              Salin seluruh teks iklan lowongan - termasuk bagian kualifikasi
              dan tanggung jawab - lalu tempel di bawah ini. Kata kunci akan
              diekstraksi secara otomatis.
            </p>
            <Textarea
              rows={14}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder={
                "Contoh:\n\nKami mencari Frontend Developer dengan pengalaman minimal 3 tahun.\n\nKualifikasi:\n- Menguasai React dan TypeScript\n- Terbiasa dengan REST API dan Git\n- Memahami responsive design dan web performance\n..."
              }
            />
            {jobDescription.trim().length > 0 && (
              <p className="mt-2 text-[11px] text-ink-500">
                {jobDescription.trim().split(/\s+/).length} kata dianalisis.
              </p>
            )}
          </Card>

          <Card className="p-5">
            <h2 className="text-sm font-semibold text-ink-900">
              Riwayat Penilaian
            </h2>
            {history.length === 0 ? (
              <p className="mt-2 text-xs leading-relaxed text-ink-500">
                Belum ada riwayat. Tekan &quot;Simpan Hasil ke Riwayat&quot;
                untuk mencatat skor saat ini, lalu perbaiki CV Anda dan simpan
                lagi untuk melihat perkembangannya.
              </p>
            ) : (
              <>
                {best !== null && (
                  <p className="mt-1 text-xs text-ink-500">
                    Skor tertinggi: <strong className="text-ink-800">{best}</strong>
                  </p>
                )}
                <ul className="mt-3 space-y-1.5">
                  {history.map((entry) => (
                    <li
                      key={entry.id}
                      className="flex items-center justify-between rounded-lg bg-ink-50 px-3 py-2"
                    >
                      <span className="text-xs text-ink-600">
                        {new Date(entry.createdAt).toLocaleString("id-ID", {
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

"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Copy,
  FilePlus2,
  Pencil,
  Sparkles,
  Trash2,
  Upload,
} from "lucide-react";
import { useI18n } from "@/components/i18n";
import { GuestImport } from "@/components/dashboard/GuestImport";
import { Interactive } from "@/components/motion";
import { Badge, Button, Callout, Card, Input, Spinner } from "@/components/ui";
import type { Dictionary, Locale } from "@/lib/i18n";
import { TEMPLATE_INFO } from "@/lib/resume/templates";
import type { ResumeSummary } from "@/lib/resume/types";

/**
 * Isi dashboard: daftar CV milik pengguna beserta aksinya.
 *
 * Seluruh konfirmasi dibuat sebagai elemen di dalam halaman, bukan
 * window.confirm bawaan peramban - selain lebih rapi, dialog modal bawaan
 * membekukan seluruh halaman selama ditampilkan.
 */

export function DashboardClient({
  initialResumes,
}: {
  initialResumes: ResumeSummary[];
}) {
  const { locale, t } = useI18n();
  const router = useRouter();
  const [resumes, setResumes] = React.useState(initialResumes);
  const [busy, setBusy] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = React.useState<string | null>(null);
  const [renaming, setRenaming] = React.useState<string | null>(null);
  const [renameValue, setRenameValue] = React.useState("");
  const fileInput = React.useRef<HTMLInputElement>(null);

  async function refresh() {
    const response = await fetch("/api/resumes");
    if (response.ok) {
      const payload = await response.json();
      setResumes(payload.resumes);
    }
    router.refresh();
  }

  async function call(
    key: string,
    url: string,
    init: RequestInit,
  ): Promise<Record<string, unknown> | null> {
    setBusy(key);
    setError(null);
    try {
      const response = await fetch(url, init);
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        // Sesi yang menunjuk pengguna yang sudah tidak ada tidak dapat
        // diperbaiki dengan mencoba lagi - satu-satunya jalan keluar adalah
        // masuk kembali. Karena itu pengguna tidak sekadar diberi tahu,
        // melainkan langsung dikeluarkan dari sesi yang sudah mati.
        if (response.status === 401) {
          setError(t.auth.sessionStale);
          // Alasannya dititipkan pada alamat, bukan pada state: pengalihan
          // menghapus seluruh state halaman ini, sehingga pesan yang hanya
          // ditampilkan di sini akan lenyap sebelum sempat terbaca.
          void signOut({ redirectTo: "/login?sesi=habis" });
          return null;
        }
        setError(payload.error ?? t.dashboard.errorGeneric);
        return null;
      }
      return payload;
    } catch {
      setError(t.dashboard.errorOffline);
      return null;
    } finally {
      setBusy(null);
    }
  }

  async function createResume(preset: "blank" | "sample") {
    const payload = await call(`create-${preset}`, "/api/resumes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ preset }),
    });
    const resume = payload?.resume as { id: string } | undefined;
    if (resume) router.push(`/resume/${resume.id}/edit`);
  }

  async function duplicate(id: string) {
    const payload = await call(`dup-${id}`, `/api/resumes/${id}/duplicate`, {
      method: "POST",
    });
    if (payload) await refresh();
  }

  async function remove(id: string) {
    const payload = await call(`del-${id}`, `/api/resumes/${id}`, {
      method: "DELETE",
    });
    if (payload) {
      setResumes((prev) => prev.filter((r) => r.id !== id));
      setConfirmDelete(null);
      router.refresh();
    }
  }

  async function rename(id: string) {
    const title = renameValue.trim();
    if (!title) return;
    const payload = await call(`ren-${id}`, `/api/resumes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    if (payload) {
      setResumes((prev) =>
        prev.map((r) => (r.id === id ? { ...r, title } : r)),
      );
      setRenaming(null);
      router.refresh();
    }
  }

  async function importJson(file: File) {
    const text = await file.text();
    const payload = await call("import", "/api/resumes/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: text,
    });
    const resume = payload?.resume as { id: string } | undefined;
    if (resume) router.push(`/resume/${resume.id}/edit`);
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-8">
      {/* ---------------------------------------------------------------- */}
      {/* Judul dan aksi utama                                              */}
      {/* ---------------------------------------------------------------- */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink-900">
            {t.dashboard.title}
          </h1>
          <p className="mt-1 text-sm text-ink-600">
            {resumes.length === 0
              ? t.dashboard.subtitleEmpty
              : `${resumes.length} ${t.dashboard.subtitleCount}`}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <input
            ref={fileInput}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void importJson(file);
              event.target.value = "";
            }}
          />
          <Button
            variant="outline"
            onClick={() => fileInput.current?.click()}
            disabled={busy === "import"}
          >
            {busy === "import" ? <Spinner /> : <Upload size={15} />}
            {t.dashboard.importJson}
          </Button>
          <Button
            variant="outline"
            onClick={() => createResume("sample")}
            disabled={busy === "create-sample"}
          >
            {busy === "create-sample" ? <Spinner /> : <Sparkles size={15} />}
            {t.dashboard.startFromSample}
          </Button>
          <Button
            onClick={() => createResume("blank")}
            disabled={busy === "create-blank"}
          >
            {busy === "create-blank" ? <Spinner /> : <FilePlus2 size={15} />}
            {t.dashboard.createNew}
          </Button>
        </div>
      </div>

      {error && (
        <div className="mt-4">
          <Callout tone="bad">{error}</Callout>
        </div>
      )}

      {/* Tawaran memindahkan CV yang disusun tanpa akun. Tidak menampilkan
          apa pun bila tidak ada titipan. */}
      <GuestImport />

      {/* ---------------------------------------------------------------- */}
      {/* Keadaan kosong                                                    */}
      {/* ---------------------------------------------------------------- */}
      {resumes.length === 0 ? (
        <Card className="mt-8 p-10 text-center">
          <h2 className="text-base font-semibold text-ink-900">
            {t.dashboard.emptyTitle}
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-600">
            {t.dashboard.emptyBodyLead}{" "}
            <strong className="text-ink-800">
              {t.dashboard.startFromSample}
            </strong>
            {t.dashboard.emptyBodyTail}
          </p>
          <div className="mt-6 flex justify-center gap-2">
            <Button onClick={() => createResume("sample")}>
              <Sparkles size={15} />
              {t.dashboard.startFromSample}
            </Button>
            <Button variant="outline" onClick={() => createResume("blank")}>
              {t.dashboard.startBlank}
            </Button>
          </div>
        </Card>
      ) : (
        /* ---------------------------------------------------------------- */
        /* Daftar CV                                                         */
        /* ---------------------------------------------------------------- */
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {resumes.map((resume) => (
            <Interactive key={resume.id} tilt={3}>
              <Card className="flex h-full flex-col p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  {renaming === resume.id ? (
                    <div className="flex gap-2">
                      <Input
                        autoFocus
                        value={renameValue}
                        onChange={(e) => setRenameValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") void rename(resume.id);
                          if (e.key === "Escape") setRenaming(null);
                        }}
                      />
                      <Button size="sm" onClick={() => rename(resume.id)}>
                        {t.common.save}
                      </Button>
                    </div>
                  ) : (
                    <>
                      <h2 className="truncate text-sm font-semibold text-ink-900">
                        {resume.title}
                      </h2>
                      <p className="mt-0.5 truncate text-xs text-ink-500">
                        {resume.fullName || t.dashboard.nameEmpty}
                        {resume.headline ? ` - ${resume.headline}` : ""}
                      </p>
                    </>
                  )}
                </div>

                {resume.latestScore !== null && (
                  <Badge
                    tone={
                      resume.latestScore >= 70
                        ? "good"
                        : resume.latestScore >= 55
                          ? "warn"
                          : "bad"
                    }
                  >
                    ATS {resume.latestScore}
                  </Badge>
                )}
              </div>

              <div className="mt-3 flex items-center gap-2 text-[11px] text-ink-500">
                <Badge>
                  {TEMPLATE_INFO[locale][resume.template]?.name ??
                    resume.template}
                </Badge>
                <span>
                  {t.dashboard.changedAt}{" "}
                  {formatRelative(resume.updatedAt, locale, t)}
                </span>
              </div>

              <div className="mt-4 flex-1" />

              {confirmDelete === resume.id ? (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                  <p className="text-xs leading-relaxed text-bad">
                    {t.dashboard.deleteConfirmLead}{" "}
                    <strong>{resume.title}</strong>
                    {t.dashboard.deleteConfirmTail}
                  </p>
                  <div className="mt-2.5 flex gap-2">
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => remove(resume.id)}
                      disabled={busy === `del-${resume.id}`}
                    >
                      {busy === `del-${resume.id}` && <Spinner />}
                      {t.dashboard.deleteYes}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setConfirmDelete(null)}
                    >
                      {t.common.cancel}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <Link href={`/resume/${resume.id}/edit`} className="flex-1">
                    <Button size="sm" className="w-full">
                      {t.dashboard.edit}
                    </Button>
                  </Link>
                  <Button
                    size="icon"
                    variant="outline"
                    title={t.dashboard.renameTitle}
                    onClick={() => {
                      setRenaming(resume.id);
                      setRenameValue(resume.title);
                    }}
                  >
                    <Pencil size={13} />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    title={t.dashboard.duplicateTitle}
                    onClick={() => duplicate(resume.id)}
                    disabled={busy === `dup-${resume.id}`}
                  >
                    {busy === `dup-${resume.id}` ? (
                      <Spinner />
                    ) : (
                      <Copy size={13} />
                    )}
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    title={t.dashboard.deleteTitle}
                    onClick={() => setConfirmDelete(resume.id)}
                  >
                    <Trash2 size={13} className="text-bad" />
                  </Button>
                  </div>
                )}
              </Card>
            </Interactive>
          ))}
        </div>
      )}

      {resumes.length > 0 && (
        <div className="mt-6">
          <Callout tone="info">
            <strong>{t.dashboard.tipsLabel}</strong> {t.dashboard.tips}
          </Callout>
        </div>
      )}
    </div>
  );
}

/**
 * Waktu relatif sederhana.
 *
 * Lewat 30 hari, waktu relatif berhenti menolong - orang tidak dapat
 * membayangkan "47 hari lalu". Di titik itu yang ditampilkan tanggalnya.
 */
function formatRelative(iso: string, locale: Locale, t: Dictionary): string {
  const then = new Date(iso).getTime();
  const diffMinutes = Math.round((Date.now() - then) / 60000);

  if (diffMinutes < 1) return t.dashboard.justNow;
  if (diffMinutes < 60) return `${diffMinutes} ${t.dashboard.minutesAgo}`;
  const hours = Math.round(diffMinutes / 60);
  if (hours < 24) return `${hours} ${t.dashboard.hoursAgo}`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days} ${t.dashboard.daysAgo}`;
  return new Date(iso).toLocaleDateString(locale === "en" ? "en-GB" : "id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

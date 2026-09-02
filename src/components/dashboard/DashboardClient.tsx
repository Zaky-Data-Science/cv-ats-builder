"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Copy,
  FilePlus2,
  Pencil,
  Sparkles,
  Trash2,
  Upload,
} from "lucide-react";
import { Badge, Button, Callout, Card, Input, Spinner } from "@/components/ui";
import type { ResumeSummary } from "@/lib/resume/types";

/**
 * Isi dashboard: daftar CV milik pengguna beserta aksinya.
 *
 * Seluruh konfirmasi dibuat sebagai elemen di dalam halaman, bukan
 * window.confirm bawaan peramban - selain lebih rapi, dialog modal bawaan
 * membekukan seluruh halaman selama ditampilkan.
 */

const TEMPLATE_LABEL: Record<string, string> = {
  CLASSIC: "Classic",
  MODERN: "Modern",
  COMPACT: "Compact",
};

export function DashboardClient({
  initialResumes,
}: {
  initialResumes: ResumeSummary[];
}) {
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
        setError(payload.error ?? "Terjadi kesalahan. Silakan coba lagi.");
        return null;
      }
      return payload;
    } catch {
      setError("Tidak dapat terhubung ke server.");
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
          <h1 className="text-2xl font-bold text-ink-900">CV Saya</h1>
          <p className="mt-1 text-sm text-ink-600">
            {resumes.length === 0
              ? "Belum ada CV. Mulai dari contoh agar Anda langsung melihat bentuk jadinya."
              : `${resumes.length} CV tersimpan. Semua perubahan tersimpan otomatis.`}
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
            Impor JSON
          </Button>
          <Button
            variant="outline"
            onClick={() => createResume("sample")}
            disabled={busy === "create-sample"}
          >
            {busy === "create-sample" ? <Spinner /> : <Sparkles size={15} />}
            Mulai dari Contoh
          </Button>
          <Button
            onClick={() => createResume("blank")}
            disabled={busy === "create-blank"}
          >
            {busy === "create-blank" ? <Spinner /> : <FilePlus2 size={15} />}
            Buat CV Baru
          </Button>
        </div>
      </div>

      {error && (
        <div className="mt-4">
          <Callout tone="bad">{error}</Callout>
        </div>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* Keadaan kosong                                                    */}
      {/* ---------------------------------------------------------------- */}
      {resumes.length === 0 ? (
        <Card className="mt-8 p-10 text-center">
          <h2 className="text-base font-semibold text-ink-900">
            Belum ada CV di akun ini
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-600">
            Saran: pilih{" "}
            <strong className="text-ink-800">Mulai dari Contoh</strong>. CV akan
            terisi data contoh lengkap sehingga Anda bisa melihat setiap field
            muncul di bagian mana, lalu tinggal menimpanya dengan data Anda
            sendiri.
          </p>
          <div className="mt-6 flex justify-center gap-2">
            <Button onClick={() => createResume("sample")}>
              <Sparkles size={15} />
              Mulai dari Contoh
            </Button>
            <Button variant="outline" onClick={() => createResume("blank")}>
              Mulai dari kosong
            </Button>
          </div>
        </Card>
      ) : (
        /* ---------------------------------------------------------------- */
        /* Daftar CV                                                         */
        /* ---------------------------------------------------------------- */
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {resumes.map((resume) => (
            <Card key={resume.id} className="flex flex-col p-5">
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
                        Simpan
                      </Button>
                    </div>
                  ) : (
                    <>
                      <h2 className="truncate text-sm font-semibold text-ink-900">
                        {resume.title}
                      </h2>
                      <p className="mt-0.5 truncate text-xs text-ink-500">
                        {resume.fullName || "Nama belum diisi"}
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
                <Badge>{TEMPLATE_LABEL[resume.template] ?? resume.template}</Badge>
                <span>Diubah {formatRelative(resume.updatedAt)}</span>
              </div>

              <div className="mt-4 flex-1" />

              {confirmDelete === resume.id ? (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                  <p className="text-xs leading-relaxed text-bad">
                    Hapus <strong>{resume.title}</strong>? Seluruh isinya ikut
                    terhapus dan tidak bisa dikembalikan.
                  </p>
                  <div className="mt-2.5 flex gap-2">
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => remove(resume.id)}
                      disabled={busy === `del-${resume.id}`}
                    >
                      {busy === `del-${resume.id}` && <Spinner />}
                      Ya, hapus
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setConfirmDelete(null)}
                    >
                      Batal
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <Link href={`/resume/${resume.id}/edit`} className="flex-1">
                    <Button size="sm" className="w-full">
                      Edit CV
                    </Button>
                  </Link>
                  <Button
                    size="icon"
                    variant="outline"
                    title="Ganti nama"
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
                    title="Duplikat"
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
                    title="Hapus"
                    onClick={() => setConfirmDelete(resume.id)}
                  >
                    <Trash2 size={13} className="text-bad" />
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {resumes.length > 0 && (
        <div className="mt-6">
          <Callout tone="info">
            <strong>Tips:</strong> untuk melamar posisi berbeda, tekan tombol
            duplikat lalu sesuaikan ringkasan dan urutan keahliannya. CV yang
            disesuaikan per lowongan mendapat skor kecocokan kata kunci yang
            jauh lebih tinggi.
          </Callout>
        </div>
      )}
    </div>
  );
}

/** Format waktu relatif sederhana dalam bahasa Indonesia. */
function formatRelative(iso: string): string {
  const then = new Date(iso).getTime();
  const diffMinutes = Math.round((Date.now() - then) / 60000);

  if (diffMinutes < 1) return "baru saja";
  if (diffMinutes < 60) return `${diffMinutes} menit lalu`;
  const hours = Math.round(diffMinutes / 60);
  if (hours < 24) return `${hours} jam lalu`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days} hari lalu`;
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

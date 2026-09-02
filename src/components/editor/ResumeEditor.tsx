"use client";

import * as React from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  CloudOff,
  FileDown,
  FileJson,
  FileText,
  Gauge,
  LayoutList,
  Loader2,
  MoreHorizontal,
  Printer,
  ScanSearch,
  Settings2,
  Sparkles,
} from "lucide-react";
import { AtsPanel } from "@/components/ats/AtsPanel";
import { Badge, Button, Callout, Field, Input, Select } from "@/components/ui";
import { analyzeResume } from "@/lib/ats/engine";
import { ATS_SAFE_FONTS } from "@/lib/ats/vocabulary";
import { sampleResume } from "@/lib/resume/sample";
import { SECTION_META, sectionCount } from "@/lib/resume/sections";
import type { ResumeData, SectionKey } from "@/lib/resume/types";
import { AUTHOR } from "@/lib/site";
import { cn } from "@/lib/utils";
import { EditorProvider, moveItem } from "./context";
import { PersonalSection, SECTION_FORMS } from "./sections";
import { SectionCard } from "./parts";
import { PreviewPane } from "./PreviewPane";

type SaveState = "idle" | "dirty" | "saving" | "saved" | "error";

/** Panel yang sedang ditampilkan. Di layar lebar, formulir selalu terlihat. */
type Pane = "form" | "preview" | "ats";

/** Jeda sebelum perubahan dikirim ke server. */
const AUTOSAVE_DELAY_MS = 800;

export function ResumeEditor({ initial }: { initial: ResumeData }) {
  const [data, setData] = React.useState<ResumeData>(initial);
  const [highlight, setHighlight] = React.useState<string | null>(null);
  const [saveState, setSaveState] = React.useState<SaveState>("idle");
  const [savedAt, setSavedAt] = React.useState<Date | null>(null);
  const [errorText, setErrorText] = React.useState<string | null>(null);
  const [pages, setPages] = React.useState(1);
  const [pane, setPane] = React.useState<Pane>("form");
  const [showSettings, setShowSettings] = React.useState(false);
  const [confirmSample, setConfirmSample] = React.useState(false);
  const [openSections, setOpenSections] = React.useState<Set<string>>(
    () => new Set(["personal"]),
  );

  // Salinan data terbaru untuk dibaca fungsi penyimpanan. Tanpa ini, `save`
  // akan menutup (closure) nilai data lama saat dipanggil dari timer.
  const dataRef = React.useRef(data);
  React.useEffect(() => {
    dataRef.current = data;
  }, [data]);

  const dirtyRef = React.useRef(false);

  /* ---------------------------------------------------------------- */
  /* Penyimpanan otomatis                                              */
  /* ---------------------------------------------------------------- */

  const save = React.useCallback(async (): Promise<boolean> => {
    setSaveState("saving");
    setErrorText(null);
    try {
      const response = await fetch(`/api/resumes/${initial.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume: dataRef.current }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        setErrorText(payload.error ?? "Perubahan gagal disimpan.");
        setSaveState("error");
        return false;
      }

      dirtyRef.current = false;
      setSavedAt(new Date());
      setSaveState("saved");
      return true;
    } catch {
      setErrorText(
        "Tidak dapat terhubung ke server. Perubahan Anda masih ada di layar - jangan tutup halaman ini sampai koneksi pulih.",
      );
      setSaveState("error");
      return false;
    }
  }, [initial.id]);

  const update = React.useCallback((patch: Partial<ResumeData>) => {
    dirtyRef.current = true;
    setSaveState("dirty");
    setData((prev) => ({ ...prev, ...patch }));
  }, []);

  React.useEffect(() => {
    if (!dirtyRef.current) return;
    const timer = setTimeout(() => void save(), AUTOSAVE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [data, save]);

  // Jaring pengaman bila pengguna menutup tab saat masih ada perubahan
  // yang belum terkirim.
  React.useEffect(() => {
    const handler = (event: BeforeUnloadEvent) => {
      if (dirtyRef.current) event.preventDefault();
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, []);

  /* ---------------------------------------------------------------- */
  /* Penilaian ATS langsung                                            */
  /* ---------------------------------------------------------------- */

  // Mesin penilaian berupa fungsi murni, sehingga dapat dijalankan langsung
  // di peramban. Skor ikut berubah seketika saat pengguna mengetik, tanpa
  // perlu memanggil server sama sekali.
  const analysis = React.useMemo(
    () => analyzeResume(data, "", pages),
    [data, pages],
  );

  /* ---------------------------------------------------------------- */
  /* Unduhan dan cetak                                                 */
  /* ---------------------------------------------------------------- */

  async function download(path: string) {
    const ok = await save();
    if (!ok) return;
    const anchor = document.createElement("a");
    anchor.href = `/api/resumes/${initial.id}/export/${path}`;
    anchor.rel = "noopener";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  }

  /**
   * Mencetak lewat iframe tersembunyi yang memuat halaman /print.
   * Halaman itu hanya berisi dokumen CV, sehingga hasil PDF tidak
   * mengandung sisa antarmuka aplikasi dan teksnya tetap dapat diseleksi.
   */
  async function printPdf() {
    const ok = await save();
    if (!ok) return;

    const frame = document.createElement("iframe");
    frame.style.cssText =
      "position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden";
    frame.src = `/resume/${initial.id}/print`;
    frame.onload = () => {
      frame.contentWindow?.focus();
      frame.contentWindow?.print();
      setTimeout(() => frame.remove(), 60_000);
    };
    document.body.appendChild(frame);
  }

  function toggleSection(key: string) {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function jumpToSection(key: string) {
    setPane("form");
    setOpenSections((prev) => new Set(prev).add(key));
    // Menunggu satu siklus render agar section sempat terbuka sebelum
    // digulirkan ke posisinya.
    requestAnimationFrame(() => {
      document
        .querySelector(`#form-anchor-${key}`)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function applySample() {
    const sample = sampleResume(data.id);
    update({ ...sample, id: data.id, title: data.title });
    setOpenSections(new Set(["personal", "experience"]));
    setConfirmSample(false);
  }

  const actions = (
    <>
      <ActionItem
        icon={Sparkles}
        label="Isi Data Contoh"
        hint="Ganti seluruh isi dengan contoh lengkap"
        onClick={() => setConfirmSample(true)}
      />
      <ActionItem
        icon={Settings2}
        label="Tampilan CV"
        hint="Template, jenis huruf, ukuran, bahasa"
        onClick={() => setShowSettings((v) => !v)}
      />
      <ActionItem
        icon={Printer}
        label="Unduh PDF"
        hint="Untuk dikirim ke perusahaan"
        onClick={printPdf}
      />
      <ActionItem
        icon={FileDown}
        label="Unduh Word"
        hint="Bila sistem lamaran meminta .docx"
        onClick={() => download("docx")}
      />
      <ActionItem
        icon={FileText}
        label="Unduh Teks"
        hint="Untuk ditempel ke formulir daring"
        onClick={() => download("txt")}
      />
      <ActionItem
        icon={FileJson}
        label="Unduh JSON"
        hint="Cadangan data, bisa diimpor lagi"
        onClick={() => download("json")}
      />
    </>
  );

  /* ---------------------------------------------------------------- */
  /* Tampilan                                                          */
  /* ---------------------------------------------------------------- */

  return (
    <EditorProvider value={{ data, update, highlight, setHighlight }}>
      <div className="flex min-h-0 flex-1 flex-col">
        {/* ============================================================ */}
        {/* Bilah alat                                                    */}
        {/* ============================================================ */}
        <div className="shrink-0 border-b border-ink-200 bg-white px-3 py-2 sm:px-4 sm:py-2.5">
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/dashboard" className="shrink-0">
              <Button variant="ghost" size="sm" aria-label="Kembali ke dashboard">
                <ArrowLeft size={16} />
              </Button>
            </Link>

            <Input
              value={data.title}
              onChange={(e) => update({ title: e.target.value })}
              className="h-9 min-w-0 flex-1 text-sm font-semibold lg:max-w-80"
              aria-label="Judul CV"
            />

            <div className="hidden lg:block">
              <SaveIndicator state={saveState} savedAt={savedAt} />
            </div>

            {/* Aksi lengkap di layar lebar */}
            <div className="ml-auto hidden items-center gap-1.5 lg:flex">
              <Button
                size="sm"
                variant="outline"
                className="press"
                onClick={() => setConfirmSample(true)}
              >
                <Sparkles size={14} />
                Isi Data Contoh
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="press"
                onClick={() => setShowSettings((v) => !v)}
                aria-expanded={showSettings}
              >
                <Settings2 size={14} />
                Tampilan
              </Button>

              <span className="mx-1 h-5 w-px bg-ink-200" aria-hidden />

              <Button size="sm" variant="outline" className="press" onClick={printPdf}>
                <Printer size={14} />
                PDF
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="press"
                onClick={() => download("docx")}
              >
                <FileDown size={14} />
                Word
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="press"
                onClick={() => download("txt")}
                title="Teks polos untuk ditempel ke formulir lamaran"
              >
                <FileText size={14} />
                Teks
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="press"
                onClick={() => download("json")}
                title="Cadangan data agar dapat diimpor kembali"
              >
                <FileJson size={14} />
                JSON
              </Button>
            </div>

            {/* Aksi diringkas jadi satu menu di layar sempit */}
            <div className="ml-auto lg:hidden">
              <ActionsMenu>{actions}</ActionsMenu>
            </div>
          </div>

          {/* Status simpan di layar sempit - diberi baris sendiri agar tidak
              menekan lebar kolom judul. */}
          <div className="mt-1.5 flex items-center justify-between gap-3 lg:hidden">
            <SaveIndicator state={saveState} savedAt={savedAt} />
            <Link
              href={`/resume/${initial.id}/ats`}
              className="text-[11px] font-medium text-brand-600"
            >
              Cocokkan dengan lowongan
            </Link>
          </div>

          {/* Panel pengaturan tampilan */}
          {showSettings && (
            <div className="mt-3 grid gap-3 rounded-lg border border-ink-200 bg-ink-50 p-3 sm:grid-cols-2 lg:grid-cols-5">
              <Field label="Template">
                <Select
                  value={data.template}
                  onChange={(e) =>
                    update({ template: e.target.value as ResumeData["template"] })
                  }
                >
                  <option value="CLASSIC">Classic - formal</option>
                  <option value="MODERN">Modern - lapang</option>
                  <option value="COMPACT">Compact - padat</option>
                </Select>
              </Field>

              <Field label="Jenis Huruf" hint="Semua pilihan aman untuk ATS.">
                <Select
                  value={data.fontFamily}
                  onChange={(e) => update({ fontFamily: e.target.value })}
                >
                  {ATS_SAFE_FONTS.map((font) => (
                    <option key={font} value={font}>
                      {font}
                    </option>
                  ))}
                </Select>
              </Field>

              <Field label={`Ukuran Huruf: ${data.fontSize}pt`}>
                <input
                  type="range"
                  min={9}
                  max={12}
                  step={0.5}
                  value={data.fontSize}
                  onChange={(e) => update({ fontSize: Number(e.target.value) })}
                  className="w-full accent-brand-600"
                  aria-label="Ukuran huruf"
                />
              </Field>

              <Field label={`Jarak Baris: ${data.lineHeight.toFixed(2)}`}>
                <input
                  type="range"
                  min={1.1}
                  max={1.6}
                  step={0.05}
                  value={data.lineHeight}
                  onChange={(e) => update({ lineHeight: Number(e.target.value) })}
                  className="w-full accent-brand-600"
                  aria-label="Jarak baris"
                />
              </Field>

              <div className="space-y-3">
                <Field label="Bahasa Judul Bagian">
                  <Select
                    value={data.language}
                    onChange={(e) =>
                      update({ language: e.target.value as ResumeData["language"] })
                    }
                  >
                    <option value="ID">Indonesia</option>
                    <option value="EN">English</option>
                  </Select>
                </Field>
                {data.template === "MODERN" && (
                  <Field label="Warna Aksen">
                    <input
                      type="color"
                      value={data.accentColor}
                      onChange={(e) => update({ accentColor: e.target.value })}
                      className="h-9 w-full cursor-pointer rounded-lg border border-ink-300"
                      aria-label="Warna aksen"
                    />
                  </Field>
                )}
              </div>
            </div>
          )}

          {confirmSample && (
            <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3">
              <p className="text-xs leading-relaxed text-warn">
                Seluruh isi CV ini akan diganti dengan data contoh lengkap.
                Berguna untuk melihat bentuk CV jadi dan tahu setiap field
                muncul di bagian mana - tetapi data yang sudah Anda ketik akan
                hilang.
              </p>
              <div className="mt-2.5 flex gap-2">
                <Button size="sm" onClick={applySample}>
                  Ya, isi dengan contoh
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setConfirmSample(false)}
                >
                  Batal
                </Button>
              </div>
            </div>
          )}

          {errorText && (
            <div className="mt-3">
              <Callout tone="bad" title="Gagal menyimpan">
                {errorText}
              </Callout>
            </div>
          )}
        </div>

        {/* ============================================================ */}
        {/* Dua panel                                                     */}
        {/* ============================================================ */}
        <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[minmax(360px,42%)_1fr]">
          {/* ---------------------------------------------------------- */}
          {/* Kiri: formulir                                              */}
          {/* ---------------------------------------------------------- */}
          <div
            className={cn(
              "thin-scrollbar min-h-0 flex-col overflow-y-auto border-r border-ink-200 bg-ink-100 p-3 sm:p-4",
              pane === "form" ? "flex" : "hidden lg:flex",
            )}
          >
            <div className="space-y-3">
              <SectionCard
                id="form-anchor-personal"
                title="Data Pribadi"
                hint="Bagian paling atas CV. Nama, kontak, dan tautan profil - inilah yang pertama dicari pengurai ATS."
                open={openSections.has("personal")}
                onToggle={() => toggleSection("personal")}
              >
                <PersonalSection />
              </SectionCard>

              {data.sectionOrder.map((key, index) => {
                const meta = SECTION_META[key];
                const Form = SECTION_FORMS[key];
                return (
                  <SectionCard
                    key={key}
                    id={`form-anchor-${key}`}
                    title={meta.label}
                    hint={meta.hint}
                    count={sectionCount(data, key)}
                    open={openSections.has(key)}
                    onToggle={() => toggleSection(key)}
                    onMoveUp={
                      index > 0
                        ? () =>
                            update({
                              sectionOrder: moveItem(
                                data.sectionOrder,
                                index,
                                index - 1,
                              ) as SectionKey[],
                            })
                        : undefined
                    }
                    onMoveDown={
                      index < data.sectionOrder.length - 1
                        ? () =>
                            update({
                              sectionOrder: moveItem(
                                data.sectionOrder,
                                index,
                                index + 1,
                              ) as SectionKey[],
                            })
                        : undefined
                    }
                  >
                    <Form />
                  </SectionCard>
                );
              })}

              <p className="px-1 pt-2 text-[11px] leading-relaxed text-ink-500">
                Bagian yang belum diisi tidak akan muncul di CV, jadi Anda boleh
                melewatinya. Gunakan tombol panah di sisi kanan judul untuk
                mengubah urutan tampilnya.
              </p>

              {/* Kredit pembuat. Hanya muncul di antarmuka aplikasi -
                  tidak pernah ikut tercetak pada CV pengguna. */}
              <p className="border-t border-ink-200 px-1 pt-3 pb-24 text-[11px] leading-relaxed text-ink-400 lg:pb-6">
                {AUTHOR.credit}
              </p>
            </div>
          </div>

          {/* ---------------------------------------------------------- */}
          {/* Kanan: pratinjau atau penilaian                              */}
          {/* ---------------------------------------------------------- */}
          <div
            className={cn(
              "min-h-0 flex-col",
              pane === "form" ? "hidden lg:flex" : "flex",
            )}
          >
            {/* Tab hanya relevan di layar lebar; di layar sempit navigasinya
                ada di bilah bawah. */}
            <div className="hidden shrink-0 items-center gap-1 border-b border-ink-200 bg-white px-3 lg:flex">
              <TabButton
                active={pane !== "ats"}
                onClick={() => setPane("preview")}
              >
                Pratinjau CV
              </TabButton>
              <TabButton active={pane === "ats"} onClick={() => setPane("ats")}>
                <Gauge size={14} />
                Skor ATS
                <ScoreBadge score={analysis.score} />
              </TabButton>

              <Link
                href={`/resume/${initial.id}/ats`}
                className="ml-auto flex items-center gap-1 text-[11px] font-medium text-brand-600 hover:underline"
              >
                <ScanSearch size={13} />
                Cocokkan dengan lowongan
              </Link>
            </div>

            <div className={cn("min-h-0 flex-1", pane === "ats" && "hidden")}>
              <PreviewPane
                data={data}
                highlight={highlight}
                onPageCountChange={setPages}
              />
            </div>

            {pane === "ats" && (
              <div className="thin-scrollbar min-h-0 flex-1 overflow-y-auto bg-ink-50 p-4 pb-24 sm:p-5 lg:pb-5">
                <AtsPanel result={analysis} onJumpTo={jumpToSection} />
              </div>
            )}
          </div>
        </div>

        {/* ============================================================ */}
        {/* Navigasi bawah - hanya layar sempit                           */}
        {/* ============================================================ */}
        <nav
          aria-label="Panel editor"
          className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-3 border-t border-ink-200 bg-white/95 backdrop-blur lg:hidden"
        >
          <PaneButton
            active={pane === "form"}
            onClick={() => setPane("form")}
            icon={LayoutList}
            label="Isi Data"
          />
          <PaneButton
            active={pane === "preview"}
            onClick={() => setPane("preview")}
            icon={FileText}
            label="Pratinjau"
          />
          <PaneButton
            active={pane === "ats"}
            onClick={() => setPane("ats")}
            icon={Gauge}
            label="Skor ATS"
            badge={analysis.score}
          />
        </nav>
      </div>
    </EditorProvider>
  );
}

/* -------------------------------------------------------------------------- */
/* Bagian kecil                                                               */
/* -------------------------------------------------------------------------- */

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "flex items-center gap-1.5 border-b-2 px-3 py-2.5 text-xs font-semibold transition-colors",
        active
          ? "border-brand-600 text-brand-700"
          : "border-transparent text-ink-500 hover:text-ink-800",
      )}
    >
      {children}
    </button>
  );
}

function ScoreBadge({ score }: { score: number }) {
  return (
    <Badge tone={score >= 70 ? "good" : score >= 55 ? "warn" : "bad"}>
      {score}
    </Badge>
  );
}

/** Tombol navigasi panel di bilah bawah (layar sempit). */
function PaneButton({
  active,
  onClick,
  icon: Icon,
  label,
  badge,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ComponentType<{ size?: number }>;
  label: string;
  badge?: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-semibold transition-colors",
        // Tinggi sentuh minimal 44 piksel mengikuti panduan antarmuka sentuh.
        "min-h-[3.25rem]",
        active ? "text-brand-700" : "text-ink-500",
      )}
    >
      <span className="relative">
        <Icon size={18} />
        {badge !== undefined && (
          <span
            className={cn(
              "absolute -top-1.5 -right-3.5 rounded-full px-1 text-[9px] leading-4 font-bold text-white",
              badge >= 70 ? "bg-good" : badge >= 55 ? "bg-warn" : "bg-bad",
            )}
          >
            {badge}
          </span>
        )}
      </span>
      {label}
    </button>
  );
}

/** Menu aksi ringkas untuk layar sempit. */
function ActionsMenu({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <Button
        size="sm"
        variant="outline"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Menu aksi"
      >
        <MoreHorizontal size={16} />
      </Button>

      {open && (
        <div
          role="menu"
          onClick={() => setOpen(false)}
          className="absolute right-0 z-40 mt-1.5 w-64 overflow-hidden rounded-xl border border-ink-200 bg-white shadow-xl"
        >
          {children}
        </div>
      )}
    </div>
  );
}

function ActionItem({
  icon: Icon,
  label,
  hint,
  onClick,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  hint: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-ink-50"
    >
      <Icon size={16} className="mt-0.5 shrink-0 text-ink-500" />
      <span className="min-w-0">
        <span className="block text-sm font-medium text-ink-900">{label}</span>
        <span className="block text-[11px] leading-snug text-ink-500">
          {hint}
        </span>
      </span>
    </button>
  );
}

/** Penunjuk status simpan - inti dari janji "data Anda tidak hilang". */
function SaveIndicator({
  state,
  savedAt,
}: {
  state: SaveState;
  savedAt: Date | null;
}) {
  const base = "flex items-center gap-1.5 text-[11px]";

  if (state === "saving") {
    return (
      <span className={cn(base, "text-ink-500")} role="status">
        <Loader2 size={13} className="animate-spin" />
        Menyimpan...
      </span>
    );
  }

  if (state === "error") {
    return (
      <span className={cn(base, "font-medium text-bad")} role="status">
        <CloudOff size={13} />
        Gagal menyimpan
      </span>
    );
  }

  if (state === "dirty") {
    return (
      <span className={cn(base, "text-ink-500")}>
        <AlertTriangle size={13} />
        Belum tersimpan
      </span>
    );
  }

  if (savedAt) {
    return (
      <span className={cn(base, "text-good")} role="status">
        <Check size={13} />
        Tersimpan{" "}
        {savedAt.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </span>
    );
  }

  return <span className="text-[11px] text-ink-400">Tersimpan otomatis</span>;
}

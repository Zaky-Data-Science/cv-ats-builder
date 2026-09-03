"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
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
  ExternalLink,
  TriangleAlert,
} from "lucide-react";
import { AtsPanel } from "@/components/ats/AtsPanel";
import { useI18n } from "@/components/i18n";
import { Badge, Button, Callout, Field, Input, Select } from "@/components/ui";
import { analyzeResume } from "@/lib/ats/engine";
import { ATS_SAFE_FONTS } from "@/lib/ats/vocabulary";
import type { Dictionary, Locale } from "@/lib/i18n";
import {
  PAPER_NOTE,
  PAPER_ORDER,
  PAPER_SIZES,
  RECOMMENDED_PAPER,
} from "@/lib/resume/paper";
import {
  downloadDocx,
  downloadJson,
  downloadText,
} from "@/lib/resume/download";
import {
  commitGuestResume,
  GUEST_ID,
  stashForImport,
} from "@/lib/resume/guest";
import { sampleResume } from "@/lib/resume/sample";
import {
  applyDateEdit,
  applyEdit,
  type DatePatch,
} from "@/lib/resume/edit-path";
import {
  applyStructure,
  type StructureAction,
} from "@/lib/resume/structure";
import { resumeFileSchema } from "@/lib/resume/schema";
import { regenerateIds } from "@/lib/resume/serialize";
import { SECTION_UI } from "@/lib/resume/section-ui";
import { sectionCount } from "@/lib/resume/sections";
import {
  MARGIN_MAX_MM,
  MARGIN_MIN_MM,
  resumeMargins,
  TEMPLATE_INFO,
  TEMPLATE_ORDER,
  templateStyle,
} from "@/lib/resume/templates";
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

export function ResumeEditor({
  initial,
  guest = false,
}: {
  initial: ResumeData;
  /**
   * Mode tanpa akun.
   *
   * Yang berubah hanya tiga hal - ke mana CV disimpan, dari mana berkas
   * unduhan dibangun, dan ke mana tombol kembali menuju. Seluruh sisanya
   * (form, pratinjau, penilaian ATS) persis sama, karena memang tidak ada
   * alasan membedakannya. Menyalin komponen ini menjadi versi tamu tersendiri
   * akan membuat setiap perbaikan berikutnya harus dikerjakan dua kali.
   */
  guest?: boolean;
}) {
  const { locale, t } = useI18n();
  const router = useRouter();
  const [data, setData] = React.useState<ResumeData>(initial);
  const [highlight, setHighlight] = React.useState<string | null>(null);
  const [saveState, setSaveState] = React.useState<SaveState>("idle");
  const [savedAt, setSavedAt] = React.useState<Date | null>(null);
  const [errorText, setErrorText] = React.useState<string | null>(null);
  const [pages, setPages] = React.useState(1);
  const [pane, setPane] = React.useState<Pane>("form");
  const [showSettings, setShowSettings] = React.useState(false);
  const [confirmSample, setConfirmSample] = React.useState(false);
  // CV yang baru dibaca dari berkas JSON, menunggu dikonfirmasi. Isinya belum
  // diterapkan: memuat berkas berarti mengganti CV yang sedang di layar, dan
  // yang lama tidak dapat dikembalikan.
  const [pendingLoad, setPendingLoad] = React.useState<ResumeData | null>(null);
  const loadInputRef = React.useRef<HTMLInputElement>(null);
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

    // Mode tamu tidak pernah menyentuh jaringan: CV-nya ditulis ke
    // penyimpanan peramban dan selesai di situ.
    if (guest) {
      const stored = commitGuestResume(dataRef.current);
      if (!stored) {
        setErrorText(t.guest.saveFailed);
        setSaveState("error");
        return false;
      }
      dirtyRef.current = false;
      setSavedAt(new Date());
      setSaveState("saved");
      return true;
    }

    try {
      const response = await fetch(`/api/resumes/${initial.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume: dataRef.current }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        // Sesi yang menunjuk pengguna yang sudah tidak ada tidak dapat
        // diperbaiki dengan mencoba lagi. Menyimpan otomatis akan terus
        // mengulang kegagalan yang sama setiap 0,8 detik, jadi pengguna
        // langsung dikeluarkan dan diarahkan untuk masuk kembali.
        if (response.status === 401) {
          setErrorText(t.auth.sessionStale);
          setSaveState("error");
          // Lihat catatan yang sama di DashboardClient: alasannya dititipkan
          // pada alamat supaya bertahan melewati pengalihan.
          void signOut({ redirectTo: "/login?sesi=habis" });
          return false;
        }
        setErrorText(payload.error ?? t.editor.saveFailedGeneric);
        setSaveState("error");
        return false;
      }

      dirtyRef.current = false;
      setSavedAt(new Date());
      setSaveState("saved");
      return true;
    } catch {
      setErrorText(t.editor.saveFailedOffline);
      setSaveState("error");
      return false;
    }
  }, [initial.id, guest, t]);

  /**
   * Menerapkan teks yang diketik langsung di atas kertas.
   *
   * Yang diubah adalah data CV yang sama dengan yang diisi lewat formulir -
   * bukan salinan kedua. Karena itu field di sebelah kiri ikut berubah
   * seketika, skor ATS ikut dihitung ulang, dan simpan otomatis berjalan
   * seperti biasa. Kertas dan formulir adalah dua cara memandang satu benda.
   */
  const editOnPaper = React.useCallback((path: string, value: string) => {
    dirtyRef.current = true;
    setSaveState("dirty");
    setData((prev) => applyEdit(prev, path, value));
  }, []);

  /**
   * Periode yang dipilih lewat pemilih bulan di atas kertas.
   *
   * Jalur tersendiri, bukan menumpang `editOnPaper`: yang satu menerima teks
   * bebas hasil ketikan, yang ini hanya menerima nilai yang memang berasal
   * dari <input type="month">. Menyatukannya akan meloloskan "Feb 2023"
   * sebagai tanggal - persis alasan tanggal dulu tidak dapat disunting di
   * kertas sama sekali.
   */
  const editDateOnPaper = React.useCallback(
    (path: string, patch: DatePatch) => {
      dirtyRef.current = true;
      setSaveState("dirty");
      setData((prev) => applyDateEdit(prev, path, patch));
    },
    [],
  );

  /** Menambah dan menghapus entri maupun poin dari atas kertas. */
  const structureOnPaper = React.useCallback((action: StructureAction) => {
    dirtyRef.current = true;
    setSaveState("dirty");
    setData((prev) => applyStructure(prev, action));
  }, []);

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
    () => analyzeResume(data, "", pages, locale),
    [data, pages, locale],
  );

  // Margin yang benar-benar berlaku: pilihan pengguna bila ada, kalau tidak
  // bawaan templatenya. Dihitung di sini supaya penggeser di panel Tampilan
  // menunjukkan angka yang sama dengan yang dipakai pratinjau.
  const margins = resumeMargins(data);
  const usesTemplateMargin =
    data.marginYMm === null && data.marginXMm === null;

  /* ---------------------------------------------------------------- */
  /* Unduhan dan cetak                                                 */
  /* ---------------------------------------------------------------- */

  async function download(path: string) {
    const ok = await save();
    if (!ok) return;

    // Tanpa akun tidak ada CV di server yang bisa diminta, jadi berkasnya
    // dibangun di peramban dari data yang sudah ada di layar. Ketiganya
    // memakai fungsi yang sama dengan yang dipakai server, sehingga isinya
    // identik dengan unduhan dari akun.
    if (guest) {
      if (path === "json") downloadJson(dataRef.current);
      else if (path === "txt") downloadText(dataRef.current);
      else if (path === "docx") await downloadDocx(dataRef.current);
      return;
    }

    const anchor = document.createElement("a");
    anchor.href = `/api/resumes/${initial.id}/export/${path}`;
    anchor.rel = "noopener";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  }

  /**
   * Membaca kembali CV dari berkas JSON hasil unduhan.
   *
   * Pasangan dari tombol Unduh JSON, dan sengaja hanya ada di mode tanpa akun.
   * Mode itu memang hanya menyimpan satu CV di peramban - batasan yang
   * disengaja, karena menumpuk banyak CV orang di komputer bersama justru
   * berlawanan dengan alasan mode ini dibuat tanpa server. Berkas JSON
   * memberi jalan keluarnya tanpa menambah tumpukan itu: versi yang ingin
   * disimpan pengguna berpindah ke berkas miliknya sendiri.
   *
   * Isinya divalidasi dengan skema yang sama seperti yang dipakai jalur impor
   * di server, sehingga berkas rusak atau berkas dari aplikasi lain ditolak
   * dengan pesan - bukan diterima setengah jadi lalu merusak isian yang ada.
   */
  async function readJsonFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    // Dikosongkan supaya memilih berkas yang sama dua kali tetap terbaca.
    event.target.value = "";
    if (!file) return;

    setErrorText(null);
    try {
      const parsed = resumeFileSchema.parse(JSON.parse(await file.text()));
      if (parsed.schemaVersion > 1) {
        setErrorText(t.guest.loadTooNew);
        return;
      }
      setPendingLoad(
        regenerateIds({
          ...(parsed.resume as unknown as ResumeData),
          id: GUEST_ID,
        }),
      );
    } catch {
      setErrorText(t.guest.loadFailed);
    }
  }

  function applyPendingLoad() {
    if (!pendingLoad) return;
    update({ ...pendingLoad, id: GUEST_ID });
    setPendingLoad(null);
  }

  /**
   * Menuju halaman cetak, yang memanggil dialog cetaknya sendiri.
   *
   * Sebelumnya halaman itu dimuat ke dalam bingkai tersembunyi lalu bingkainya
   * yang disuruh mencetak. Cara itu **tidak dapat diandalkan** dan sudah dua
   * kali gagal dengan gejala berbeda: mula-mula Chrome menolak mencetak
   * bingkai tak berukuran lalu diam-diam mencetak halaman editor, dan setelah
   * bingkainya diberi ukuran sungguhan pun hasilnya berupa satu halaman kosong
   * yang kop dan kakinya justru menunjukkan alamat editor - bukti bahwa yang
   * dicetak tetap dokumen induknya.
   *
   * Akar masalahnya: dokumen mana yang dicetak saat `print()` dipanggil pada
   * bingkai adalah perilaku peramban, bukan sesuatu yang dapat dipastikan dari
   * sisi aplikasi. Karena itu bingkainya dibuang sama sekali.
   *
   * Gantinya memakai mekanisme yang memang sudah ada dan berdiri sendiri:
   * halaman cetak mencetak dirinya sendiri bila alamatnya berakhiran
   * `?cetak=1` - lihat `PrintToolbar`. Tidak ada lagi dua dokumen yang bisa
   * tertukar, sebab hanya ada satu.
   *
   * Tab yang sama, bukan tab baru: pop-up yang dibuka setelah `await` kerap
   * diblokir peramban karena izin dari klik penggunanya sudah kedaluwarsa.
   * Bila dialog cetaknya ditutup, pengguna tetap melihat CV-nya di sana
   * lengkap dengan tombol cetak dan tautan kembali ke editor - tidak pernah
   * kehabisan jalan.
   */
  async function printPdf() {
    const ok = await save();
    if (!ok) return;

    // Halaman cetak tamu membaca CV dari penyimpanan peramban; yang untuk
    // akun membacanya dari basis data.
    router.push(
      guest ? "/cetak?cetak=1" : `/resume/${initial.id}/print?cetak=1`,
    );
  }

  /**
   * Membuka halaman cetak apa adanya, di tab yang sama.
   *
   * Jalan cadangan bila dialog cetak dari bingkai tersembunyi tidak muncul -
   * hal yang bergantung pada perilaku peramban dan tidak dapat dipastikan dari
   * sisi aplikasi. Di sana tersedia tombol cetak dan tautan kembali, sehingga
   * pengguna tidak pernah kehabisan jalan. Tab yang sama, bukan tab baru,
   * karena pop-up sesudah `await` kerap diblokir peramban.
   */
  async function openPrintPage() {
    const ok = await save();
    if (!ok) return;
    router.push(guest ? "/cetak" : `/resume/${initial.id}/print`);
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

  /**
   * Menitipkan CV tamu lalu mengantar pengguna ke halaman masuk.
   *
   * CV-nya sengaja tidak dikirim ke server di sini. Yang terjadi hanyalah
   * menyalinnya ke satu kunci titipan di peramban; dashboard nanti menawarkan
   * mengimpornya setelah pengguna benar-benar masuk. Dengan begitu tidak ada
   * data pribadi yang menyeberang sebelum ada akun yang memilikinya.
   */
  function moveToAccount() {
    commitGuestResume(dataRef.current);
    stashForImport(dataRef.current);
    router.push("/login");
  }

  function applySample() {
    const sample = sampleResume(data.id, locale);
    update({ ...sample, id: data.id, title: data.title });
    setOpenSections(new Set(["personal", "experience"]));
    setConfirmSample(false);
  }

  const actions = (
    <>
      <ActionItem
        icon={Sparkles}
        label={t.editor.actionSampleLabel}
        hint={t.editor.actionSampleHint}
        onClick={() => setConfirmSample(true)}
      />
      <ActionItem
        icon={Settings2}
        label={t.editor.actionAppearanceLabel}
        hint={t.editor.actionAppearanceHint}
        onClick={() => setShowSettings((v) => !v)}
      />
      <ActionItem
        icon={Printer}
        label={t.editor.actionPdfLabel}
        hint={t.editor.actionPdfHint}
        onClick={printPdf}
      />
      <ActionItem
        icon={ExternalLink}
        label={t.print.openPrintPage}
        hint={t.print.openPrintPageHint}
        onClick={() => openPrintPage()}
      />
      <ActionItem
        icon={FileDown}
        label={t.editor.actionWordLabel}
        hint={t.editor.actionWordHint}
        onClick={() => download("docx")}
      />
      <ActionItem
        icon={FileText}
        label={t.editor.actionTxtLabel}
        hint={t.editor.actionTxtHint}
        onClick={() => download("txt")}
      />
      <ActionItem
        icon={FileJson}
        label={t.editor.actionJsonLabel}
        hint={t.editor.actionJsonHint}
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
        {/* Keterangan mode tamu. Ditempatkan paling atas dan tidak dapat
            ditutup: konsekuensi "datanya bisa hilang" harus terlihat selama
            pengguna masih mengetik, bukan sekali lalu lenyap. */}
        {guest && (
          <div className="shrink-0 border-b border-ink-200 bg-ink-100 px-3 py-2.5 sm:px-4">
            <div className="flex flex-wrap items-start gap-x-3 gap-y-2">
              <TriangleAlert
                size={15}
                className="mt-0.5 shrink-0 text-warn"
                aria-hidden
              />
              <p className="min-w-0 flex-1 text-[11px] leading-relaxed text-ink-600">
                <strong className="text-ink-900">{t.guest.bannerTitle}</strong>{" "}
                {t.guest.bannerBody}
              </p>
              <input
                ref={loadInputRef}
                type="file"
                accept="application/json,.json"
                onChange={readJsonFile}
                className="sr-only"
              />
              <Button
                size="sm"
                variant="outline"
                className="press shrink-0"
                onClick={() => loadInputRef.current?.click()}
                title={t.guest.loadHint}
              >
                {t.guest.loadFromJson}
              </Button>
              <Button
                size="sm"
                className="press shrink-0"
                onClick={moveToAccount}
                title={t.guest.moveHint}
              >
                {t.guest.moveToAccount}
              </Button>
            </div>
          </div>
        )}

        <div className="shrink-0 border-b border-ink-200 bg-white px-3 py-2 sm:px-4 sm:py-2.5">
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href={guest ? "/" : "/dashboard"} className="shrink-0">
              <Button
                variant="ghost"
                size="sm"
                aria-label={guest ? t.nav.backHome : t.editor.backAria}
              >
                <ArrowLeft size={16} />
              </Button>
            </Link>

            <Input
              value={data.title}
              onChange={(e) => update({ title: e.target.value })}
              className="h-9 min-w-0 flex-1 text-sm font-semibold lg:max-w-80"
              aria-label={t.editor.titleAria}
            />

            <div className="hidden lg:block">
              <SaveIndicator
                state={saveState}
                savedAt={savedAt}
                t={t}
                locale={locale}
                guest={guest}
              />
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
                {t.editor.btnSample}
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="press"
                onClick={() => setShowSettings((v) => !v)}
                aria-expanded={showSettings}
              >
                <Settings2 size={14} />
                {t.editor.btnAppearance}
              </Button>

              <span className="mx-1 h-5 w-px bg-ink-200" aria-hidden />

              <Button size="sm" variant="outline" className="press" onClick={printPdf}>
                <Printer size={14} />
                {t.editor.btnPdf}
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="press"
                onClick={() => download("docx")}
              >
                <FileDown size={14} />
                {t.editor.btnWord}
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="press"
                onClick={() => download("txt")}
                title={t.editor.btnTextTitle}
              >
                <FileText size={14} />
                {t.editor.btnText}
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="press"
                onClick={() => download("json")}
                title={t.editor.btnJsonTitle}
              >
                <FileJson size={14} />
                {t.editor.btnJson}
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
            <SaveIndicator state={saveState} savedAt={savedAt} t={t} locale={locale} />
            <Link
              href={`/resume/${initial.id}/ats`}
              className="text-[11px] font-medium text-ink-700 underline"
            >
              {t.editor.matchJob}
            </Link>
          </div>

          {/* ------------------------------------------------------------ */}
          {/* Panel pengaturan tampilan CV                                   */}
          {/* ------------------------------------------------------------ */}
          {showSettings && (
            <div className="mt-3 space-y-3 rounded-lg border border-ink-200 bg-ink-50 p-3">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <Field
                  label={t.appearance.template}
                  hint={TEMPLATE_INFO[locale][data.template].description}
                >
                  <Select
                    value={data.template}
                    onChange={(e) =>
                      update({
                        template: e.target.value as ResumeData["template"],
                      })
                    }
                  >
                    {/*
                      Template dikelompokkan berdasarkan ada-tidaknya foto,
                      karena itulah pertanyaan pertama yang muncul di benak
                      pengguna saat memilih - bukan nama templatenya.
                    */}
                    <optgroup label={t.appearance.templateWithoutPhoto}>
                      {TEMPLATE_ORDER.filter(
                        (id) => templateStyle(id).photo === "none",
                      ).map((id) => (
                        <option key={id} value={id}>
                          {TEMPLATE_INFO[locale][id].name}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label={t.appearance.templateWithPhoto}>
                      {TEMPLATE_ORDER.filter(
                        (id) => templateStyle(id).photo !== "none",
                      ).map((id) => (
                        <option key={id} value={id}>
                          {TEMPLATE_INFO[locale][id].name}
                        </option>
                      ))}
                    </optgroup>
                  </Select>
                </Field>

                <Field
                  label={t.appearance.paperSize}
                  hint={PAPER_NOTE[locale][data.pageSize]}
                >
                  <Select
                    value={data.pageSize}
                    onChange={(e) =>
                      update({
                        pageSize: e.target.value as ResumeData["pageSize"],
                      })
                    }
                  >
                    {PAPER_ORDER.map((size) => (
                      <option key={size} value={size}>
                        {PAPER_SIZES[size].label}
                        {size === RECOMMENDED_PAPER
                          ? ` - ${t.preview.paperRecommended}`
                          : ""}
                      </option>
                    ))}
                  </Select>
                </Field>

                <Field label={t.appearance.font} hint={t.appearance.fontHint}>
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

                <Field
                  label={t.appearance.headingLanguage}
                  hint={t.appearance.headingLanguageHint}
                >
                  <Select
                    value={data.language}
                    onChange={(e) =>
                      update({
                        language: e.target.value as ResumeData["language"],
                      })
                    }
                  >
                    <option value="ID">Indonesia</option>
                    <option value="EN">English</option>
                  </Select>
                </Field>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <Field label={`${t.appearance.fontSize}: ${data.fontSize}pt`}>
                  <input
                    type="range"
                    min={9}
                    max={12}
                    step={0.5}
                    value={data.fontSize}
                    onChange={(e) =>
                      update({ fontSize: Number(e.target.value) })
                    }
                    className="w-full accent-ink-900"
                    aria-label={t.appearance.fontSize}
                  />
                </Field>

                <Field
                  label={`${t.appearance.lineHeight}: ${data.lineHeight.toFixed(2)}`}
                >
                  <input
                    type="range"
                    min={1.1}
                    max={1.6}
                    step={0.05}
                    value={data.lineHeight}
                    onChange={(e) =>
                      update({ lineHeight: Number(e.target.value) })
                    }
                    className="w-full accent-ink-900"
                    aria-label={t.appearance.lineHeight}
                  />
                </Field>

                {templateStyle(data.template).useAccent && (
                  <Field label={t.appearance.accentColor}>
                    <input
                      type="color"
                      value={data.accentColor}
                      onChange={(e) => update({ accentColor: e.target.value })}
                      className="h-9 w-full cursor-pointer rounded-lg border border-ink-300"
                      aria-label={t.appearance.accentColor}
                    />
                  </Field>
                )}
              </div>

              {/* ------------------------------------------------------- */}
              {/* Margin halaman                                           */}
              {/* ------------------------------------------------------- */}
              <div className="rounded-lg border border-ink-200 bg-white p-3">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="text-xs font-semibold tracking-wide text-ink-700">
                    {t.appearance.margin}
                  </span>
                  {/*
                    Tombol pengembali hanya muncul saat memang ada yang perlu
                    dikembalikan. Tombol yang selalu tampak tetapi tidak
                    melakukan apa-apa mengajari pengguna untuk mengabaikannya.
                  */}
                  {!usesTemplateMargin && (
                    <button
                      type="button"
                      onClick={() =>
                        update({ marginYMm: null, marginXMm: null })
                      }
                      className="text-[11px] font-medium text-ink-700 underline"
                    >
                      {t.appearance.marginReset}
                    </button>
                  )}
                </div>

                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <Field
                    label={`${t.appearance.marginY}: ${margins.y} mm${
                      data.marginYMm === null
                        ? ` (${t.appearance.marginFollowTemplate})`
                        : ""
                    }`}
                  >
                    <input
                      type="range"
                      min={MARGIN_MIN_MM}
                      max={MARGIN_MAX_MM}
                      step={1}
                      value={margins.y}
                      onChange={(e) =>
                        update({ marginYMm: Number(e.target.value) })
                      }
                      className="w-full accent-ink-900"
                      aria-label={t.appearance.marginY}
                    />
                  </Field>

                  <Field
                    label={`${t.appearance.marginX}: ${margins.x} mm${
                      data.marginXMm === null
                        ? ` (${t.appearance.marginFollowTemplate})`
                        : ""
                    }`}
                  >
                    <input
                      type="range"
                      min={MARGIN_MIN_MM}
                      max={MARGIN_MAX_MM}
                      step={1}
                      value={margins.x}
                      onChange={(e) =>
                        update({ marginXMm: Number(e.target.value) })
                      }
                      className="w-full accent-ink-900"
                      aria-label={t.appearance.marginX}
                    />
                  </Field>
                </div>

                <p className="mt-2 text-[11px] leading-relaxed text-ink-500">
                  {t.appearance.marginHint}
                </p>
              </div>

              {/* Saran panjang CV. Ditempatkan di panel tampilan karena di
                  sinilah pengguna mengubah ukuran huruf dan kertas - dua hal
                  yang paling sering dipakai untuk memaksa CV muat, padahal
                  yang seharusnya dipangkas adalah isinya. */}
              <p className="text-[11px] leading-relaxed text-ink-500">
                {t.preview.onePageAdvice}
              </p>

              {data.personalInfo.showPhoto &&
                templateStyle(data.template).photo === "none" && (
                  <Callout tone="warn">
                    {t.appearance.photoUnsupported}
                  </Callout>
                )}
            </div>
          )}

          {confirmSample && (
            <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3">
              <p className="text-xs leading-relaxed text-warn">
                {t.editor.fillSampleConfirm}
              </p>
              <div className="mt-2.5 flex gap-2">
                <Button size="sm" onClick={applySample}>
                  {t.editor.fillSampleYes}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setConfirmSample(false)}
                >
                  {t.common.cancel}
                </Button>
              </div>
            </div>
          )}

          {pendingLoad && (
            <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3">
              <p className="text-xs leading-relaxed text-warn">
                {t.guest.loadConfirm}
              </p>
              <div className="mt-2.5 flex gap-2">
                <Button size="sm" onClick={applyPendingLoad}>
                  {t.guest.loadYes}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setPendingLoad(null)}
                >
                  {t.common.cancel}
                </Button>
              </div>
            </div>
          )}

          {errorText && (
            <div className="mt-3">
              <Callout tone="bad" title={t.editor.saveFailedTitle}>
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
                title={t.form.personalTitle}
                hint={t.form.personalHint}
                open={openSections.has("personal")}
                onToggle={() => toggleSection("personal")}
              >
                <PersonalSection />
              </SectionCard>

              {data.sectionOrder.map((key, index) => {
                const meta = SECTION_UI[locale][key];
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
                {t.editor.sectionOrderHint}
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
                {t.editor.tabPreview}
              </TabButton>
              <TabButton active={pane === "ats"} onClick={() => setPane("ats")}>
                <Gauge size={14} />
                {t.editor.tabScore}
                <ScoreBadge score={analysis.score} />
              </TabButton>

              <Link
                href={`/resume/${initial.id}/ats`}
                className="ml-auto flex items-center gap-1 text-[11px] font-medium text-brand-600 hover:underline"
              >
                <ScanSearch size={13} />
                {t.editor.matchJob}
              </Link>
            </div>

            <div className={cn("min-h-0 flex-1", pane === "ats" && "hidden")}>
              <PreviewPane
                data={data}
                highlight={highlight}
                onPageCountChange={setPages}
                onEdit={editOnPaper}
              onDateEdit={editDateOnPaper}
              onStructure={structureOnPaper}
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
          aria-label={t.editor.panelNav}
          className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-3 border-t border-ink-200 bg-white/95 backdrop-blur lg:hidden"
        >
          <PaneButton
            active={pane === "form"}
            onClick={() => setPane("form")}
            icon={LayoutList}
            label={t.editor.paneForm}
          />
          <PaneButton
            active={pane === "preview"}
            onClick={() => setPane("preview")}
            icon={FileText}
            label={t.editor.panePreview}
          />
          <PaneButton
            active={pane === "ats"}
            onClick={() => setPane("ats")}
            icon={Gauge}
            label={t.editor.paneScore}
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
  const { t } = useI18n();
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
        aria-label={t.editor.actionsMenu}
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
  t,
  locale,
  guest = false,
}: {
  state: SaveState;
  savedAt: Date | null;
  t: Dictionary;
  locale: Locale;
  guest?: boolean;
}) {
  const base = "flex items-center gap-1.5 text-[11px]";

  if (state === "saving") {
    return (
      <span className={cn(base, "text-ink-500")} role="status">
        <Loader2 size={13} className="animate-spin" />
        {t.editor.saveSaving}
      </span>
    );
  }

  if (state === "error") {
    return (
      <span className={cn(base, "font-medium text-bad")} role="status">
        <CloudOff size={13} />
        {t.editor.saveError}
      </span>
    );
  }

  if (state === "dirty") {
    return (
      <span className={cn(base, "text-ink-500")}>
        <AlertTriangle size={13} />
        {t.editor.saveNotYet}
      </span>
    );
  }

  if (savedAt) {
    return (
      <span className={cn(base, "text-good")} role="status">
        <Check size={13} />
        {guest ? t.guest.savedLocal : t.editor.saveSaved}{" "}
        {savedAt.toLocaleTimeString(locale === "en" ? "en-GB" : "id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </span>
    );
  }

  return <span className="text-[11px] text-ink-400">{t.editor.saveAuto}</span>;
}

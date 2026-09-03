"use client";

import * as React from "react";
import {
  Columns2,
  Maximize2,
  Minus,
  PenLine,
  Plus,
  StretchVertical,
} from "lucide-react";
import { useI18n } from "@/components/i18n";
import { ResumeDocument } from "@/components/preview/ResumeDocument";
import { Badge, Button } from "@/components/ui";
import { mmToPx, paperPx, paperSpec } from "@/lib/resume/paper";
import { resumeMargins } from "@/lib/resume/templates";
import type { ResumeData } from "@/lib/resume/types";
import { cn } from "@/lib/utils";

const MIN_ZOOM = 0.28;
const MAX_ZOOM = 1.4;

/** Jarak antar-lembar pada mode per halaman, dalam piksel sebelum diperbesar. */
const SHEET_GAP = 28;

export type PreviewMode = "paged" | "continuous";

/**
 * Panel pratinjau.
 *
 * Menampilkan CV pada ukuran kertas sebenarnya, dengan jumlah halaman hasil
 * pengukuran DOM - bukan perkiraan.
 *
 * Dua cara melihat disediakan:
 *
 *  - **Per halaman** memotong dokumen menjadi lembaran terpisah seperti di
 *    pengolah kata, sehingga pengguna melihat persis kalimat mana yang jatuh
 *    ke halaman berikutnya. Ini yang paling sering ditanyakan orang saat
 *    menyusun CV.
 *  - **Sambung** menampilkannya sebagai satu gulungan panjang, lebih nyaman
 *    dibaca cepat sambil menyunting.
 *
 * ---------------------------------------------------------------------------
 * Soal margin, karena inilah bagian yang paling mudah salah
 * ---------------------------------------------------------------------------
 *
 * Margin halaman **tidak** boleh berasal dari padding dokumennya. Padding
 * hanya berlaku sekali untuk seluruh dokumen yang mengalir: halaman pertama
 * memperoleh margin atas, halaman terakhir memperoleh margin bawah, dan setiap
 * pergantian halaman di antaranya tidak memperoleh apa pun - teks di dasar
 * halaman menempel ke tepi kertas.
 *
 * Karena itu pada mode per halaman dokumennya dirender **tanpa margin atas dan
 * bawah**, lalu setiap lembar menyediakannya sendiri. Tinggi yang benar-benar
 * dapat diisi menjadi:
 *
 *     tinggi terpakai = tinggi kertas - margin atas - margin bawah
 *
 * dan itulah satuan yang dipakai menghitung jumlah halaman maupun menggeser
 * isi tiap lembar. Angka yang sama dipasang sebagai `@page { margin }` pada
 * halaman cetak, sehingga pratinjau dan hasil PDF memotong di tempat yang
 * persis sama.
 *
 * Cara memotongnya sendiri perlu dijelaskan karena tidak biasa: dokumennya
 * **tidak** dipecah menjadi beberapa dokumen. Setiap lembar berisi dokumen
 * yang sama utuh, digeser ke atas sejauh satu tinggi terpakai dikali nomor
 * lembarnya, lalu dipangkas oleh induknya. Dengan begitu aliran teksnya tetap
 * dihitung peramban persis seperti saat dicetak.
 *
 * Pada layar sempit, tingkat perbesaran awal dihitung agar lebar kertas pas
 * dengan lebar layar. Tanpa itu, pengguna ponsel akan menerima kertas selebar
 * 794 piksel di layar 360 piksel dan harus menggulir ke samping hanya untuk
 * membaca satu baris.
 */
export function PreviewPane({
  data,
  highlight,
  onPageCountChange,
  onEdit,
}: {
  data: ResumeData;
  highlight: string | null;
  onPageCountChange?: (pages: number) => void;
  /**
   * Menerima teks yang diketik langsung di atas kertas.
   *
   * Bila tidak diberikan, kertas hanya dapat dibaca - itulah keadaan pada
   * halaman cetak dan pratinjau template. Editor-lah yang menyediakannya.
   */
  onEdit?: (path: string, value: string) => void;
}) {
  const { t } = useI18n();

  const [zoom, setZoom] = React.useState<number | null>(null);
  const [pages, setPages] = React.useState(1);
  const [mode, setMode] = React.useState<PreviewMode>("paged");
  const [typing, setTyping] = React.useState(false);

  /*
    Mengetik hanya berlaku pada tampilan bersambung.

    Pada tampilan per halaman, dokumen yang sama dirender sekali untuk setiap
    lembar lalu digeser dan dipangkas. Satu paragraf karena itu punya beberapa
    salinan di dalam DOM, dan salinan yang terpotong di batas halaman mustahil
    diketik dengan benar - kursor akan melompat ke bagian yang tidak terlihat.
    Menyalakan mode mengetik memindahkan tampilan ke bersambung, bukan
    mematikan tombolnya diam-diam.
  */
  const editing = Boolean(onEdit) && typing;
  const viewMode: PreviewMode = editing ? "continuous" : mode;

  const scrollRef = React.useRef<HTMLDivElement>(null);
  const documentRef = React.useRef<HTMLDivElement>(null);
  const sheetRefs = React.useRef<(HTMLDivElement | null)[]>([]);

  const paper = paperSpec(data.pageSize);
  const { width: pageWidth, height: pageHeight } = paperPx(data.pageSize);

  const margins = resumeMargins(data);
  const marginTopPx = mmToPx(margins.y);
  // Tinggi yang benar-benar dapat diisi teks pada satu halaman. Dijaga tetap
  // positif: margin yang mustahil besar tidak boleh membuat jumlah halaman
  // menjadi tak hingga.
  const usableHeight = Math.max(120, pageHeight - marginTopPx * 2);

  /* ------------------------------------------------------------------ */
  /* Mengetik langsung di atas kertas                                    */
  /* ------------------------------------------------------------------ */

  /**
   * Menyimpan hasil ketikan saat kursor meninggalkan sebuah teks.
   *
   * Sengaja pada saat lepas fokus, bukan pada setiap ketukan tombol. Elemen
   * contentEditable menyimpan teksnya sendiri di dalam DOM; bila setiap
   * ketukan langsung mengubah state React, React akan menggambar ulang
   * elemennya di tengah pengguna mengetik dan kursor melompat ke awal
   * paragraf pada setiap huruf.
   */
  const cancelledRef = React.useRef(false);

  const commitEdit = React.useCallback(
    (event: React.FocusEvent<HTMLDivElement>) => {
      const target = event.target as HTMLElement;
      const path = target?.dataset?.edit;
      if (!path) return;

      // Escape membatalkan: teks di dalam elemen dikembalikan ke nilai yang
      // tersimpan, dan tidak ada yang ditulis kembali.
      if (cancelledRef.current) {
        cancelledRef.current = false;
        target.textContent = target.dataset.editOriginal ?? target.textContent;
        return;
      }
      if (!onEdit) return;
      onEdit(path, target.innerText ?? "");
    },
    [onEdit],
  );

  /** Menyimpan teks asli begitu sebuah bagian mulai disunting. */
  const rememberOriginal = React.useCallback(
    (event: React.FocusEvent<HTMLDivElement>) => {
      const target = event.target as HTMLElement;
      if (!target?.dataset?.edit) return;
      target.dataset.editOriginal = target.innerText ?? "";
    },
    [],
  );

  /**
   * Enter menyelesaikan suntingan alih-alih menyisipkan baris baru.
   *
   * Setiap teks yang dapat diketik di sini adalah untaian satu baris di dalam
   * data - satu poin pencapaian, satu jabatan. Membiarkan Enter menyisipkan
   * baris berarti membiarkan pengguna membuat sesuatu yang tidak dapat
   * disimpan apa adanya, lalu diam-diam meratakannya kembali saat menyimpan.
   * Escape membatalkan dengan mengembalikan teks aslinya.
   */
  const handleEditKey = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      const target = event.target as HTMLElement;
      if (!target?.dataset?.edit) return;

      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        target.blur();
      }
      if (event.key === "Escape") {
        event.preventDefault();
        cancelledRef.current = true;
        target.blur();
      }
    },
    [],
  );

  /**
   * Tempelan masuk sebagai teks polos.
   *
   * Menempel dari Word atau dari halaman web membawa serta seluruh markup
   * asalnya - huruf, warna, bahkan tabel. Isi CV di sini adalah teks, dan
   * gayanya ditentukan template; markup yang ikut masuk hanya akan merusak
   * tampilan kertas dan tidak pernah tersimpan.
   */
  const handleEditPaste = React.useCallback(
    (event: React.ClipboardEvent<HTMLDivElement>) => {
      const target = event.target as HTMLElement;
      if (!target?.dataset?.edit) return;
      event.preventDefault();
      const text = event.clipboardData.getData("text/plain").replace(/\s+/g, " ");
      document.execCommand("insertText", false, text);
    },
    [],
  );

  /** Perbesaran yang membuat lebar kertas pas dengan lebar area yang tersedia. */
  const fitZoom = React.useCallback(() => {
    const container = scrollRef.current;
    if (!container) return 0.72;
    // 32 piksel disisakan untuk padding kiri-kanan area gulir.
    const available = container.clientWidth - 32;
    return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, available / pageWidth));
  }, [pageWidth]);

  /**
   * Memasang pengamat ukuran pada area gulir.
   *
   * Perbesaran awal baru dapat dihitung setelah lebar area diketahui, dan
   * perlu ikut menyesuaikan saat layar diputar. Keduanya ditangani satu
   * pengamat: perbesaran hanya diturunkan bila kertas menjadi terlalu lebar,
   * sehingga tingkat perbesaran yang sengaja dipilih pengguna tidak ditimpa
   * begitu saja saat ukuran jendela berubah sedikit.
   */
  const attachScrollArea = React.useCallback(
    (node: HTMLDivElement | null) => {
      scrollRef.current = node;
      if (!node) return;

      const apply = () => {
        // Di layar sempit panel ini bisa sedang tersembunyi saat pertama
        // dipasang, sehingga lebarnya nol. Mengukur pada keadaan itu akan
        // mengunci perbesaran di nilai terkecil dan tidak pernah membaik,
        // karena penyesuaian berikutnya hanya menurunkan - tidak menaikkan.
        // Karena itu pengukuran ditunda sampai panelnya benar-benar terlihat.
        const width = node.clientWidth;
        if (width === 0) return;

        const fit = Math.min(
          MAX_ZOOM,
          Math.max(MIN_ZOOM, (width - 32) / pageWidth),
        );
        setZoom((current) => {
          if (current === null) return Math.min(0.75, fit);
          return current > fit ? fit : current;
        });
      };

      apply();

      if (typeof ResizeObserver === "undefined") return;
      const observer = new ResizeObserver(apply);
      observer.observe(node);
      return () => observer.disconnect();
    },
    [pageWidth],
  );

  // Mengukur tinggi dokumen setiap kali isinya berubah.
  React.useEffect(() => {
    const element = documentRef.current?.querySelector("[data-resume-document]");
    if (!element) return;

    const measure = () => {
      const height = (element as HTMLElement).scrollHeight;
      // Saat panel ini disembunyikan (misalnya pengguna berpindah ke tab
      // penilaian), tingginya menjadi nol. Pengukuran itu harus diabaikan,
      // bukan dianggap sebagai "CV menyusut jadi satu halaman".
      if (height === 0) return;

      // Pada mode bersambung, dokumennya membawa margin atas dan bawahnya
      // sendiri; keduanya dikurangi agar yang dibandingkan selalu tinggi isi,
      // bukan tinggi kertas. Tanpa penyeragaman ini, jumlah halaman akan
      // berbeda antara kedua mode - dan salah satunya pasti salah.
      const content =
        mode === "continuous" ? height - marginTopPx * 2 : height;

      const next = Math.max(1, Math.ceil(content / usableHeight - 0.02));
      setPages(next);
      onPageCountChange?.(next);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [data, mode, marginTopPx, usableHeight, onPageCountChange]);

  // Menggulirkan pratinjau ke blok yang sedang disorot.
  React.useEffect(() => {
    if (!highlight) return;
    const root = documentRef.current;
    const target = root?.querySelector(`[data-field="${CSS.escape(highlight)}"]`);
    if (!root || !target) return;

    if (mode === "continuous") {
      target.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    // Pada mode per halaman, blok yang dituju bisa berada di bagian dokumen
    // yang terpangkas oleh lembar pertama. Yang perlu ditemukan karena itu
    // adalah lembar keberapa ia jatuh, lalu lembar itulah yang digulirkan.
    const article = root.querySelector("[data-resume-document]");
    if (!article) return;
    const offset =
      target.getBoundingClientRect().top -
      article.getBoundingClientRect().top;
    const index = Math.max(0, Math.floor(offset / usableHeight));
    sheetRefs.current[index]?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
    // `mode` tidak ikut: yang menentukan bentuk tampilan adalah `viewMode`,
    // dan sepanjang mengetik nilainya tetap "continuous" berapa pun isi `mode`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [highlight, viewMode, usableHeight]);

  const currentZoom = zoom ?? 0.72;

  const lengthNote =
    pages === 1
      ? t.preview.lengthIdeal
      : pages === 2
        ? t.preview.lengthAcceptable
        : t.preview.lengthTooLong;

  return (
    <div className="flex h-full min-h-0 flex-col bg-ink-200">
      {/* Bilah kendali pratinjau */}
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-x-3 gap-y-1.5 border-b border-ink-300 bg-ink-100 px-3 py-2 sm:px-4">
        <div className="flex min-w-0 items-center gap-2">
          <span className="hidden text-[11px] font-semibold text-ink-600 sm:inline">
            {t.preview.label} {paper.label}
          </span>
          <Badge tone={pages === 1 ? "good" : pages === 2 ? "neutral" : "warn"}>
            {pages} {t.common.pages}
          </Badge>
          <span
            className={cn(
              "hidden truncate text-[11px] lg:inline",
              pages > 2 ? "text-warn" : "text-ink-500",
            )}
          >
            {lengthNote}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {/* Pemilih cara melihat */}
          {onEdit && (
            <button
              type="button"
              onClick={() => setTyping((on) => !on)}
              aria-pressed={editing}
              title={t.preview.typeHint}
              className={cn(
                "mr-1 inline-flex h-7 items-center gap-1 rounded-lg border px-2 text-[11px] font-medium transition-colors",
                editing
                  ? "border-ink-900 bg-ink-900 text-white"
                  : "border-ink-300 bg-white text-ink-600 hover:bg-ink-100",
              )}
            >
              <PenLine size={12} aria-hidden />
              <span className="hidden xs:inline">{t.preview.typeHere}</span>
            </button>
          )}

          <div
            role="group"
            aria-label={t.preview.viewLabel}
            className="mr-1 flex items-center rounded-lg border border-ink-300 bg-white p-0.5"
          >
            <button
              type="button"
              onClick={() => setMode("paged")}
              aria-pressed={viewMode === "paged"}
              disabled={editing}
              title={editing ? t.preview.typeForcesContinuous : t.preview.viewPagedHint}
              className={cn(
                "inline-flex h-6 items-center gap-1 rounded-md px-1.5 text-[11px] font-medium transition-colors",
                viewMode === "paged"
                  ? "bg-ink-900 text-white"
                  : "text-ink-600 hover:bg-ink-100",
              )}
            >
              <Columns2 size={12} className="rotate-90" aria-hidden />
              <span className="hidden xs:inline">{t.preview.viewPaged}</span>
            </button>
            <button
              type="button"
              onClick={() => setMode("continuous")}
              aria-pressed={viewMode === "continuous"}
              title={t.preview.viewContinuousHint}
              className={cn(
                "inline-flex h-6 items-center gap-1 rounded-md px-1.5 text-[11px] font-medium transition-colors",
                viewMode === "continuous"
                  ? "bg-ink-900 text-white"
                  : "text-ink-600 hover:bg-ink-100",
              )}
            >
              <StretchVertical size={12} aria-hidden />
              <span className="hidden xs:inline">
                {t.preview.viewContinuous}
              </span>
            </button>
          </div>

          <Button
            size="icon"
            variant="ghost"
            title={t.preview.zoomOut}
            aria-label={t.preview.zoomOut}
            onClick={() =>
              setZoom((z) => Math.max(MIN_ZOOM, (z ?? 0.72) - 0.08))
            }
          >
            <Minus size={13} />
          </Button>
          <span
            className="w-11 text-center text-[11px] font-medium text-ink-600 tabular-nums"
            aria-live="polite"
          >
            {Math.round(currentZoom * 100)}%
          </span>
          <Button
            size="icon"
            variant="ghost"
            title={t.preview.zoomIn}
            aria-label={t.preview.zoomIn}
            onClick={() =>
              setZoom((z) => Math.min(MAX_ZOOM, (z ?? 0.72) + 0.08))
            }
          >
            <Plus size={13} />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            title={t.preview.zoomFit}
            aria-label={t.preview.zoomFit}
            onClick={() => setZoom(fitZoom())}
          >
            <Maximize2 size={13} />
          </Button>
        </div>
      </div>

      {/* Area kertas */}
      <div
        ref={attachScrollArea}
        className="thin-scrollbar min-h-0 flex-1 overflow-auto p-4 pb-24 sm:p-6 lg:pb-6"
        onFocus={rememberOriginal}
        onBlur={commitEdit}
        onKeyDown={handleEditKey}
        onPaste={handleEditPaste}
      >
        <div
          ref={documentRef}
          style={{
            width: pageWidth * currentZoom,
            margin: "0 auto",
          }}
        >
          {viewMode === "continuous" ? (
            <div
              className="relative origin-top shadow-lg"
              style={{
                transform: `scale(${currentZoom})`,
                transformOrigin: "top left",
                width: pageWidth,
              }}
            >
              <ResumeDocument
                data={data}
                highlight={highlight}
                editable={editing}
              />

              {/* Garis batas halaman - hanya penanda di layar. Diletakkan
                  sejauh margin atas ditambah kelipatan tinggi terpakai,
                  sehingga menunjuk tempat yang sama dengan potongan pada
                  mode per halaman maupun pada hasil cetak. */}
              {Array.from({ length: pages - 1 }, (_, index) => (
                <div
                  key={index}
                  className="page-guide"
                  style={{ top: marginTopPx + usableHeight * (index + 1) }}
                >
                  <span>
                    {t.preview.pageLabel} {index + 2}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            Array.from({ length: pages }, (_, index) => (
              <div
                key={index}
                ref={(node) => {
                  sheetRefs.current[index] = node;
                }}
                className="relative"
                style={{
                  width: pageWidth * currentZoom,
                  height: pageHeight * currentZoom,
                  marginBottom:
                    index === pages - 1 ? 0 : SHEET_GAP * currentZoom,
                }}
              >
                <div
                  className="paper-sheet relative overflow-hidden shadow-lg"
                  style={{
                    width: pageWidth,
                    height: pageHeight,
                    transform: `scale(${currentZoom})`,
                    transformOrigin: "top left",
                  }}
                >
                  {/*
                    Jendela isi: dimulai sejauh margin atas dan setinggi ruang
                    yang benar-benar terpakai. Sisa ruang di bawahnya itulah
                    margin bawah - besarnya sama persis dengan margin atas, dan
                    diperoleh setiap lembar, bukan hanya lembar terakhir.
                  */}
                  <div
                    className="absolute inset-x-0 overflow-hidden"
                    style={{ top: marginTopPx, height: usableHeight }}
                  >
                    <div
                      style={{ transform: `translateY(${-index * usableHeight}px)` }}
                    >
                      <ResumeDocument
                        data={data}
                        highlight={highlight}
                        padding="horizontal"
                      />
                    </div>
                  </div>
                </div>

                {/* Nomor halaman di luar lembar, seperti di pengolah kata. */}
                <span className="pointer-events-none absolute -bottom-5 right-0 text-[10px] font-medium text-ink-500 tabular-nums">
                  {t.preview.pageLabel} {index + 1} / {pages}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

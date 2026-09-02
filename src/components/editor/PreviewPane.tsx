"use client";

import * as React from "react";
import { Maximize2, Minus, Plus } from "lucide-react";
import { ResumeDocument } from "@/components/preview/ResumeDocument";
import { Badge, Button } from "@/components/ui";
import type { ResumeData } from "@/lib/resume/types";

/** Ukuran satu halaman A4 dalam piksel CSS (96 dpi). */
const A4_HEIGHT_PX = (297 * 96) / 25.4;
const A4_WIDTH_PX = (210 * 96) / 25.4;

const MIN_ZOOM = 0.28;
const MAX_ZOOM = 1.4;

/**
 * Panel pratinjau.
 *
 * Menampilkan CV pada ukuran A4 sebenarnya, lengkap dengan garis batas
 * halaman dan jumlah halaman hasil pengukuran DOM - bukan perkiraan.
 *
 * Pada layar sempit, tingkat perbesaran awal dihitung agar lebar kertas
 * pas dengan lebar layar. Tanpa itu, pengguna ponsel akan menerima kertas
 * selebar 794 piksel di layar 360 piksel dan harus menggulir ke samping
 * hanya untuk membaca satu baris.
 */
export function PreviewPane({
  data,
  highlight,
  onPageCountChange,
}: {
  data: ResumeData;
  highlight: string | null;
  onPageCountChange?: (pages: number) => void;
}) {
  const [zoom, setZoom] = React.useState<number | null>(null);
  const [pages, setPages] = React.useState(1);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const documentRef = React.useRef<HTMLDivElement>(null);

  /** Perbesaran yang membuat lebar kertas pas dengan lebar area yang tersedia. */
  const fitZoom = React.useCallback(() => {
    const container = scrollRef.current;
    if (!container) return 0.72;
    // 32 piksel disisakan untuk padding kiri-kanan area gulir.
    const available = container.clientWidth - 32;
    return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, available / A4_WIDTH_PX));
  }, []);

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
          Math.max(MIN_ZOOM, (width - 32) / A4_WIDTH_PX),
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
    [],
  );

  // Mengukur tinggi dokumen setiap kali isinya berubah.
  React.useEffect(() => {
    const element = documentRef.current?.firstElementChild;
    if (!element) return;

    const measure = () => {
      const height = (element as HTMLElement).scrollHeight;
      // Saat panel ini disembunyikan (misalnya pengguna berpindah ke tab
      // penilaian), tingginya menjadi nol. Pengukuran itu harus diabaikan,
      // bukan dianggap sebagai "CV menyusut jadi satu halaman".
      if (height === 0) return;
      const next = Math.max(1, Math.ceil(height / A4_HEIGHT_PX - 0.02));
      setPages(next);
      onPageCountChange?.(next);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [data, onPageCountChange]);

  // Menggulirkan pratinjau ke blok yang sedang disorot.
  React.useEffect(() => {
    if (!highlight) return;
    const target = documentRef.current?.querySelector(
      `[data-field="${CSS.escape(highlight)}"]`,
    );
    target?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [highlight]);

  const currentZoom = zoom ?? 0.72;

  return (
    <div className="flex h-full min-h-0 flex-col bg-ink-200">
      {/* Bilah kendali pratinjau */}
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-x-3 gap-y-1.5 border-b border-ink-300 bg-ink-100 px-3 py-2 sm:px-4">
        <div className="flex items-center gap-2">
          <span className="hidden text-[11px] font-semibold text-ink-600 sm:inline">
            Pratinjau A4
          </span>
          <Badge tone={pages <= 2 ? "good" : "warn"}>{pages} halaman</Badge>
          {pages > 2 && (
            <span className="text-[11px] text-warn">maksimal 2 halaman</span>
          )}
        </div>

        <div className="flex items-center gap-0.5">
          <Button
            size="icon"
            variant="ghost"
            title="Perkecil"
            aria-label="Perkecil pratinjau"
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
            title="Perbesar"
            aria-label="Perbesar pratinjau"
            onClick={() =>
              setZoom((z) => Math.min(MAX_ZOOM, (z ?? 0.72) + 0.08))
            }
          >
            <Plus size={13} />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            title="Paskan dengan lebar layar"
            aria-label="Paskan pratinjau dengan lebar layar"
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
      >
        <div
          style={{
            width: `calc(${A4_WIDTH_PX}px * ${currentZoom})`,
            margin: "0 auto",
          }}
        >
          <div
            ref={documentRef}
            className="relative origin-top shadow-lg"
            style={{
              transform: `scale(${currentZoom})`,
              transformOrigin: "top left",
              width: "210mm",
            }}
          >
            <ResumeDocument data={data} highlight={highlight} />

            {/* Garis batas halaman - hanya penanda di layar. */}
            {Array.from({ length: pages - 1 }, (_, index) => (
              <div
                key={index}
                className="page-guide"
                style={{ top: A4_HEIGHT_PX * (index + 1) }}
              >
                <span>Halaman {index + 2}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

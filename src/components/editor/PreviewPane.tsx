"use client";

import * as React from "react";
import { Minus, Plus } from "lucide-react";
import { ResumeDocument } from "@/components/preview/ResumeDocument";
import { Badge, Button } from "@/components/ui";
import type { ResumeData } from "@/lib/resume/types";

/** Tinggi satu halaman A4 dalam piksel CSS (297 mm pada 96 dpi). */
const A4_HEIGHT_PX = (297 * 96) / 25.4;

/**
 * Panel pratinjau.
 *
 * Menampilkan CV pada ukuran A4 sebenarnya, lengkap dengan garis batas
 * halaman dan jumlah halaman hasil pengukuran DOM - bukan perkiraan.
 * Angka inilah yang dipakai antarmuka untuk memperingatkan pengguna saat
 * CV melewati dua halaman.
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
  const [zoom, setZoom] = React.useState(0.72);
  const [pages, setPages] = React.useState(1);
  const documentRef = React.useRef<HTMLDivElement>(null);

  // Mengukur tinggi dokumen setiap kali isinya berubah.
  React.useEffect(() => {
    const element = documentRef.current?.firstElementChild;
    if (!element) return;

    const measure = () => {
      const height = (element as HTMLElement).scrollHeight;
      // Saat tab beralih ke panel penilaian, panel ini disembunyikan dan
      // tingginya menjadi nol. Pengukuran itu harus diabaikan, bukan
      // dianggap sebagai "CV menyusut jadi satu halaman".
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

  return (
    <div className="flex h-full min-h-0 flex-col bg-ink-200">
      {/* Bilah kendali pratinjau */}
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-ink-300 bg-ink-100 px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-ink-600">
            Pratinjau A4
          </span>
          <Badge tone={pages <= 2 ? "good" : "warn"}>
            {pages} halaman
          </Badge>
          {pages > 2 && (
            <span className="text-[11px] text-warn">
              CV sebaiknya maksimal 2 halaman
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          <Button
            size="icon"
            variant="ghost"
            title="Perkecil"
            onClick={() => setZoom((z) => Math.max(0.4, z - 0.08))}
          >
            <Minus size={13} />
          </Button>
          <span className="w-10 text-center text-[11px] font-medium text-ink-600">
            {Math.round(zoom * 100)}%
          </span>
          <Button
            size="icon"
            variant="ghost"
            title="Perbesar"
            onClick={() => setZoom((z) => Math.min(1.4, z + 0.08))}
          >
            <Plus size={13} />
          </Button>
        </div>
      </div>

      {/* Area kertas */}
      <div className="thin-scrollbar min-h-0 flex-1 overflow-auto p-6">
        <div
          style={{
            width: `calc(210mm * ${zoom})`,
            margin: "0 auto",
          }}
        >
          <div
            ref={documentRef}
            className="relative origin-top shadow-lg"
            style={{
              transform: `scale(${zoom})`,
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

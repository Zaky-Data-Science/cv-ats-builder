import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Diagram alur penggunaan.
 *
 * Dibangun dari elemen HTML biasa, bukan gambar maupun SVG bertulisan.
 * Alasannya: teks di dalam gambar tidak dapat dibaca pembaca layar, tidak
 * dapat diperbesar tanpa pecah, dan tidak ikut tercari mesin pencari.
 * Bentuk tiap simpul dibedakan lewat gaya kotaknya, dan urutannya
 * disampaikan sebagai daftar berurutan sehingga tetap masuk akal ketika
 * dibacakan berurutan.
 */

export type FlowNodeKind = "start" | "process" | "decision" | "end" | "loop";

export interface FlowNode {
  kind: FlowNodeKind;
  label: string;
  detail?: string;
  /** Cabang untuk simpul keputusan. */
  branches?: { label: string; detail: string }[];
}

const KIND_STYLE: Record<FlowNodeKind, string> = {
  start: "border-brand-300 bg-brand-50 text-brand-700",
  process: "border-ink-200 bg-white text-ink-900",
  decision: "border-amber-300 bg-amber-50 text-warn",
  loop: "border-ink-300 bg-ink-50 text-ink-700",
  end: "border-green-300 bg-green-50 text-good",
};

const KIND_LABEL: Record<FlowNodeKind, string> = {
  start: "Mulai",
  process: "Proses",
  decision: "Keputusan",
  loop: "Ulangi",
  end: "Selesai",
};

export function FlowDiagram({
  nodes,
  className,
}: {
  nodes: FlowNode[];
  className?: string;
}) {
  return (
    <ol className={cn("relative space-y-0", className)}>
      {nodes.map((node, index) => (
        <li key={node.label} className="relative">
          <div
            className={cn(
              "rounded-xl border-2 px-4 py-3 sm:px-5 sm:py-4",
              KIND_STYLE[node.kind],
              node.kind === "decision" && "rounded-2xl",
            )}
          >
            <div className="flex items-start gap-3">
              <span
                className={cn(
                  "mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] font-bold",
                  node.kind === "start" && "bg-brand-600 text-white",
                  node.kind === "process" && "bg-ink-900 text-white",
                  node.kind === "decision" && "bg-warn text-white",
                  node.kind === "loop" && "bg-ink-500 text-white",
                  node.kind === "end" && "bg-good text-white",
                )}
              >
                {index + 1}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold">{node.label}</p>
                <p className="mt-0.5 text-[11px] font-medium tracking-wide uppercase opacity-60">
                  {KIND_LABEL[node.kind]}
                </p>
                {node.detail && (
                  <p className="mt-1.5 text-[13px] leading-relaxed opacity-90">
                    {node.detail}
                  </p>
                )}

                {node.branches && (
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {node.branches.map((branch) => (
                      <div
                        key={branch.label}
                        className="rounded-lg border border-current/20 bg-white/70 px-3 py-2"
                      >
                        <p className="text-xs font-semibold">{branch.label}</p>
                        <p className="mt-0.5 text-[12px] leading-relaxed opacity-80">
                          {branch.detail}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Penghubung antar-simpul. Murni hiasan; urutannya sendiri sudah
              tersampaikan oleh elemen daftar berurutan. */}
          {index < nodes.length - 1 && (
            <div
              aria-hidden
              className="flex h-8 items-center justify-center sm:h-9"
            >
              <span className="relative block h-full w-px bg-ink-300">
                <span className="absolute -bottom-px left-1/2 h-0 w-0 -translate-x-1/2 border-x-4 border-t-6 border-x-transparent border-t-ink-300" />
              </span>
            </div>
          )}
        </li>
      ))}
    </ol>
  );
}

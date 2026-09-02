import * as React from "react";
import { CornerUpLeft } from "lucide-react";
import {
  KIND_LABEL,
  type Diagram,
  type DiagramNode,
  type NodeKind,
} from "@/lib/diagrams";
import type { Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

/**
 * Diagram alur yang dirender sebagai HTML, bukan gambar.
 *
 * Alasannya sama dengan diagram sebelumnya di aplikasi ini: teks di dalam
 * gambar tidak dapat dibacakan pembaca layar, tidak dapat diperbesar tanpa
 * pecah, tidak ikut terindeks mesin pencari, dan tidak ikut berganti warna
 * saat pengguna memilih mode gelap.
 *
 * Bentuk tiap simpul dibedakan lewat gaya kotaknya sekaligus lewat label
 * jenisnya yang tertulis - warna dan bentuk saja tidak cukup, sebab keduanya
 * hilang bagi pembaca layar dan bagi pembaca yang tidak membedakan warna.
 *
 * Tata letaknya satu kolom lurus di tengah. Jalur kiri dan kanan pada data
 * diagram sengaja diabaikan di sini - lihat alasannya di komentar dekat
 * penempatan kotak.
 *
 * Versi gambarnya dibangkitkan dari data yang sama lewat `npm run diagram`,
 * sehingga keduanya tidak mungkin berbeda isi.
 */

const KIND_STYLE: Record<NodeKind, string> = {
  start: "border-ink-900 bg-ink-900 text-white",
  process: "border-ink-300 bg-white text-ink-900",
  decision: "border-ink-400 bg-ink-100 text-ink-900 rounded-2xl",
  data: "border-ink-400 bg-ink-50 text-ink-900 border-dashed",
  browser: "border-ink-300 bg-ink-50 text-ink-900",
  end: "border-ink-900 bg-white text-ink-900 border-[2.5px]",
};

export function DiagramView({
  diagram,
  locale,
  className,
}: {
  diagram: Diagram;
  locale: Locale;
  className?: string;
}) {
  const kindLabels = KIND_LABEL[locale];

  /** Cabang keluar sebuah simpul, dipakai untuk menampilkan label panahnya. */
  const branchesOf = (node: DiagramNode) =>
    diagram.edges.filter((edge) => edge.from === node.id && edge.label);

  return (
    <ol className={cn("space-y-0", className)}>
      {diagram.nodes.map((node, index) => {
        const branches = branchesOf(node);
        const backEdge = diagram.edges.find(
          (edge) => edge.back && edge.from === node.id,
        );
        const target = backEdge
          ? diagram.nodes.find((n) => n.id === backEdge.to)
          : undefined;

        return (
          <li key={node.id}>
            {/* Penghubung ke simpul sebelumnya. */}
            {index > 0 && (
              <div className="flex justify-center" aria-hidden>
                <span className="block h-6 w-px bg-ink-300" />
              </div>
            )}

            {/*
              Seluruh simpul diletakkan di tengah dengan lebar yang sama.

              Data diagramnya memang menyimpan jalur kiri dan kanan, tetapi
              jalur itu hanya bermakna pada versi gambarnya, di mana panah
              berbelok benar-benar digambar menuju kotak di sampingnya. Di
              sini panahnya berupa satu garis tegak di tengah - kotak yang
              digeser ke samping membuat garis itu menggantung tanpa
              menyambung ke apa pun, dan justru terbaca sebagai cacat tata
              letak.

              Percabangannya tidak hilang: labelnya tetap tampil sebagai
              lencana di bawah simpul keputusan, dan urutan bacaannya memang
              lurus - persis seperti yang dibacakan pembaca layar.
            */}
            <div className="flex justify-center">
              <div
                className={cn(
                  "w-full max-w-xl rounded-xl border-2 px-4 py-3",
                  KIND_STYLE[node.kind],
                )}
              >
                <span
                  className={cn(
                    "text-[10px] font-semibold tracking-wide uppercase",
                    node.kind === "start" ? "text-ink-300" : "text-ink-500",
                  )}
                >
                  {kindLabels[node.kind]}
                </span>
                <p className="mt-0.5 text-sm leading-snug font-semibold">
                  {node.label[locale]}
                </p>
                {node.note && (
                  <p
                    className={cn(
                      "mt-1.5 text-[12px] leading-relaxed",
                      node.kind === "start" ? "text-ink-300" : "text-ink-600",
                    )}
                  >
                    {node.note[locale]}
                  </p>
                )}

                {/* Label cabang keluar. */}
                {branches.length > 0 && (
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {branches.map((edge) => (
                      <span
                        key={`${edge.from}-${edge.to}`}
                        className="rounded-full border border-ink-300 px-2 py-0.5 text-[10px] font-medium text-ink-600"
                      >
                        {edge.label?.[locale]}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Panah balik digambarkan sebagai keterangan, bukan garis
                melengkung - garis melengkung di HTML menuntut posisi mutlak
                yang mudah meleset saat teksnya memanjang di layar sempit. */}
            {backEdge && target && (
              <p className="mt-2 flex items-center justify-center gap-1.5 text-[11px] text-ink-500">
                <CornerUpLeft size={12} aria-hidden />
                {backEdge.label?.[locale]} &rarr; {target.label[locale]}
              </p>
            )}
          </li>
        );
      })}
    </ol>
  );
}

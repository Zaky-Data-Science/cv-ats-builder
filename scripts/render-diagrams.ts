import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";
import { DIAGRAMS, KIND_LABEL } from "../src/lib/diagrams";
import type { Diagram, DiagramNode, NodeKind } from "../src/lib/diagrams";
import { LOCALES, type Locale } from "../src/lib/i18n/config";

/**
 * ============================================================================
 *  PEMBANGKIT GAMBAR DIAGRAM
 * ============================================================================
 *
 * Membaca data diagram yang sama dengan yang dipakai halaman /alur, lalu
 * menuliskannya sebagai SVG dan PNG.
 *
 * SVG dipakai sebagai bentuk utama karena ia tetap tajam pada perbesaran
 * berapa pun dan teksnya tetap berupa teks - dapat diseleksi dan dicari.
 * PNG disertakan karena sebagian pengolah kata dan pencetak dokumen masih
 * menanganinya lebih andal daripada SVG.
 *
 * Jalankan dengan: npm run diagram
 */

/* -------------------------------------------------------------------------- */
/* Ukuran dan gaya                                                            */
/* -------------------------------------------------------------------------- */

const WIDTH = 1000;
const MARGIN = 40;
const LANE_WIDTH = 300;
const NODE_WIDTH = 420;
const NODE_WIDTH_SIDE = 340;
const ROW_GAP = 46;
const PADDING_X = 18;
const PADDING_Y = 14;

const LINE_HEIGHT = 19;
const NOTE_LINE_HEIGHT = 16;

/** Karakter per baris pada lebar tertentu, ditaksir dari lebar rata-rata huruf. */
function wrap(text: string, width: number, fontSize: number): string[] {
  const perLine = Math.max(12, Math.floor(width / (fontSize * 0.53)));
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length > perLine && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);
  return lines;
}

interface Style {
  fill: string;
  stroke: string;
  text: string;
  muted: string;
  dashed: boolean;
  strokeWidth: number;
  radius: number;
}

/**
 * Palet monokrom, sama dengan antarmuka aplikasinya.
 *
 * Warna sengaja tidak dipakai sebagai satu-satunya pembeda jenis simpul:
 * setiap kotak juga memuat label jenisnya secara tertulis, sehingga diagram
 * ini tetap terbaca ketika dicetak hitam-putih - dan laporan tugas akhir
 * memang dicetak hitam-putih.
 */
const STYLES: Record<NodeKind, Style> = {
  start: {
    fill: "#0a0a0b",
    stroke: "#0a0a0b",
    text: "#ffffff",
    muted: "#c9c9cd",
    dashed: false,
    strokeWidth: 2,
    radius: 10,
  },
  process: {
    fill: "#ffffff",
    stroke: "#d2d2d6",
    text: "#0a0a0b",
    muted: "#52525a",
    dashed: false,
    strokeWidth: 2,
    radius: 10,
  },
  decision: {
    fill: "#f4f4f5",
    stroke: "#a1a1a8",
    text: "#0a0a0b",
    muted: "#52525a",
    dashed: false,
    strokeWidth: 2,
    radius: 22,
  },
  data: {
    fill: "#fafafa",
    stroke: "#a1a1a8",
    text: "#0a0a0b",
    muted: "#52525a",
    dashed: true,
    strokeWidth: 2,
    radius: 10,
  },
  browser: {
    fill: "#fafafa",
    stroke: "#d2d2d6",
    text: "#0a0a0b",
    muted: "#52525a",
    dashed: false,
    strokeWidth: 2,
    radius: 10,
  },
  end: {
    fill: "#ffffff",
    stroke: "#0a0a0b",
    text: "#0a0a0b",
    muted: "#52525a",
    dashed: false,
    strokeWidth: 3,
    radius: 10,
  },
};

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/* -------------------------------------------------------------------------- */
/* Penataan letak                                                             */
/* -------------------------------------------------------------------------- */

interface Box {
  node: DiagramNode;
  x: number;
  y: number;
  width: number;
  height: number;
  kindLabel: string;
  titleLines: string[];
  noteLines: string[];
}

const TITLE_HEIGHT = 74;

function layout(diagram: Diagram, locale: Locale): { boxes: Box[]; height: number } {
  const kindLabels = KIND_LABEL[locale];
  const boxes: Box[] = [];
  // Judul dicetak di dalam gambarnya sendiri. Diagram yang disisipkan ke
  // dalam laporan kerap terlepas dari teks di sekitarnya; judul yang menempel
  // membuatnya tetap dapat dikenali berdiri sendiri.
  let y = MARGIN + TITLE_HEIGHT;

  for (const node of diagram.nodes) {
    const width = node.lane === 0 ? NODE_WIDTH : NODE_WIDTH_SIDE;
    const inner = width - PADDING_X * 2;

    const titleLines = wrap(node.label[locale], inner, 15);
    const noteLines = node.note ? wrap(node.note[locale], inner, 12.5) : [];

    const height =
      PADDING_Y * 2 +
      13 + // label jenis
      titleLines.length * LINE_HEIGHT +
      (noteLines.length > 0 ? 6 + noteLines.length * NOTE_LINE_HEIGHT : 0);

    // Jalur samping digeser setengah lebar jalur dari sumbu tengah, sehingga
    // tetap berjarak dari kolom utama tanpa keluar dari kanvas.
    const centre = WIDTH / 2 + node.lane * LANE_WIDTH * 0.72;

    boxes.push({
      node,
      x: centre - width / 2,
      y,
      width,
      height,
      kindLabel: kindLabels[node.kind],
      titleLines,
      noteLines,
    });

    y += height + ROW_GAP;
  }

  return { boxes, height: y - ROW_GAP + MARGIN };
}

/* -------------------------------------------------------------------------- */
/* Penggambaran                                                               */
/* -------------------------------------------------------------------------- */

function renderSvg(diagram: Diagram, locale: Locale): string {
  const { boxes, height } = layout(diagram, locale);
  const byId = new Map(boxes.map((box) => [box.node.id, box]));
  const parts: string[] = [];

  parts.push(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${height}" viewBox="0 0 ${WIDTH} ${height}" font-family="Inter, Segoe UI, Helvetica, Arial, sans-serif">`,
    `<title>${escapeXml(diagram.title[locale])}</title>`,
    `<desc>${escapeXml(diagram.description[locale])}</desc>`,
    `<defs><marker id="panah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#74747a"/></marker></defs>`,
    `<rect width="${WIDTH}" height="${height}" fill="#ffffff"/>`,
  );

  parts.push(
    `<text x="${MARGIN}" y="${MARGIN + 20}" font-size="20" font-weight="700" fill="#0a0a0b">${escapeXml(diagram.title[locale])}</text>`,
    `<line x1="${MARGIN}" y1="${MARGIN + 34}" x2="${WIDTH - MARGIN}" y2="${MARGIN + 34}" stroke="#e6e6e8" stroke-width="1"/>`,
  );

  // Jalur panah balik: di sebelah kiri kotak paling kiri di seluruh diagram,
  // sehingga tidak pernah memotong satu pun kotak - termasuk kotak jalur
  // samping yang menjorok lebih jauh daripada kedua ujung panahnya sendiri.
  const backLane = Math.min(...boxes.map((box) => box.x)) - 26;
  const backLabels: string[] = [];

  /* --- Panah lebih dulu, supaya selalu berada di belakang kotak --------- */
  for (const edge of diagram.edges) {
    const from = byId.get(edge.from);
    const to = byId.get(edge.to);
    if (!from || !to) continue;

    const fromCx = from.x + from.width / 2;
    const toCx = to.x + to.width / 2;
    const dash = edge.back ? ' stroke-dasharray="6 5"' : "";

    if (edge.back) {
      const y1 = from.y + from.height / 2;
      const y2 = to.y + to.height / 2;
      parts.push(
        `<path d="M ${from.x} ${y1} H ${backLane} V ${y2} H ${to.x}" fill="none" stroke="#74747a" stroke-width="1.6"${dash} marker-end="url(#panah)"/>`,
      );
      if (edge.label) {
        // Ditunda sampai seluruh kotak selesai digambar - kalau tidak,
        // labelnya tertutup kotak yang kebetulan berada di jalurnya.
        const text = escapeXml(edge.label[locale]);
        const midY = (y1 + y2) / 2;
        const width = text.length * 6.2 + 12;
        backLabels.push(
          `<rect x="${backLane - width / 2}" y="${midY - 10}" width="${width}" height="20" rx="10" fill="#ffffff" stroke="#e6e6e8"/>`,
          `<text x="${backLane}" y="${midY + 4}" text-anchor="middle" font-size="11.5" fill="#52525a">${text}</text>`,
        );
      }
      continue;
    }

    const y1 = from.y + from.height;
    const y2 = to.y;

    if (Math.abs(fromCx - toCx) < 2) {
      parts.push(
        `<path d="M ${fromCx} ${y1} V ${y2 - 8}" fill="none" stroke="#74747a" stroke-width="1.6" marker-end="url(#panah)"/>`,
      );
      if (edge.label) {
        parts.push(
          `<text x="${fromCx + 8}" y="${(y1 + y2) / 2 + 4}" font-size="11.5" fill="#52525a">${escapeXml(edge.label[locale])}</text>`,
        );
      }
    } else {
      // Panah berbelok: turun setengah jarak, bergeser mendatar, lalu turun.
      const mid = y1 + (y2 - y1) / 2;
      parts.push(
        `<path d="M ${fromCx} ${y1} V ${mid} H ${toCx} V ${y2 - 8}" fill="none" stroke="#74747a" stroke-width="1.6" marker-end="url(#panah)"/>`,
      );
      if (edge.label) {
        const labelX = (fromCx + toCx) / 2;
        parts.push(
          `<rect x="${labelX - 40}" y="${mid - 9}" width="80" height="18" rx="9" fill="#ffffff"/>`,
          `<text x="${labelX}" y="${mid + 4}" text-anchor="middle" font-size="11.5" fill="#52525a">${escapeXml(edge.label[locale])}</text>`,
        );
      }
    }
  }

  /* --- Kotak ------------------------------------------------------------ */
  for (const box of boxes) {
    const style = STYLES[box.node.kind];
    const dash = style.dashed ? ' stroke-dasharray="7 5"' : "";

    parts.push(
      `<rect x="${box.x}" y="${box.y}" width="${box.width}" height="${box.height}" rx="${style.radius}" fill="${style.fill}" stroke="${style.stroke}" stroke-width="${style.strokeWidth}"${dash}/>`,
    );

    let textY = box.y + PADDING_Y + 10;
    parts.push(
      `<text x="${box.x + PADDING_X}" y="${textY}" font-size="10" letter-spacing="0.08em" fill="${style.muted}">${escapeXml(box.kindLabel.toUpperCase())}</text>`,
    );

    textY += 17;
    for (const line of box.titleLines) {
      parts.push(
        `<text x="${box.x + PADDING_X}" y="${textY}" font-size="15" font-weight="600" fill="${style.text}">${escapeXml(line)}</text>`,
      );
      textY += LINE_HEIGHT;
    }

    if (box.noteLines.length > 0) {
      textY += 4;
      for (const line of box.noteLines) {
        parts.push(
          `<text x="${box.x + PADDING_X}" y="${textY}" font-size="12.5" fill="${style.muted}">${escapeXml(line)}</text>`,
        );
        textY += NOTE_LINE_HEIGHT;
      }
    }
  }

  parts.push(...backLabels);
  parts.push("</svg>");
  return parts.join("\n");
}

/* -------------------------------------------------------------------------- */
/* Penulisan berkas                                                           */
/* -------------------------------------------------------------------------- */

async function main() {
  // Dua tujuan: docs/ untuk disisipkan ke laporan, dan public/ agar dapat
  // diunduh langsung dari halaman /alur.
  const docsDir = join(process.cwd(), "docs", "diagram");
  const publicDir = join(process.cwd(), "public", "diagram");
  mkdirSync(docsDir, { recursive: true });
  mkdirSync(publicDir, { recursive: true });

  for (const diagram of DIAGRAMS) {
    for (const locale of LOCALES) {
      const svg = renderSvg(diagram, locale);
      const base = `${diagram.id}-${locale}`;

      for (const dir of [docsDir, publicDir]) {
        writeFileSync(join(dir, `${base}.svg`), svg, "utf-8");
      }

      // Diperbesar dua kali supaya tetap tajam saat dicetak; kepadatan
      // 96 dpi pada layar menjadi sekitar 192 dpi di kertas.
      const png = await sharp(Buffer.from(svg), { density: 192 })
        .png()
        .toBuffer();
      for (const dir of [docsDir, publicDir]) {
        writeFileSync(join(dir, `${base}.png`), png);
      }

      console.log(`  ${base}.svg + .png`);
    }
  }

  console.log(
    `\n${DIAGRAMS.length * LOCALES.length * 2} berkas ditulis ke docs/diagram dan public/diagram.`,
  );
}

void main();

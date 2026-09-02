"use client";

import { downloadName, slugify } from "@/lib/filename";
import { resumeToPlainText } from "./plaintext";
import { toExportFile } from "./serialize";
import type { ResumeData } from "./types";

/**
 * Unduhan yang dibangun di dalam peramban.
 *
 * Dipakai jalur tanpa akun, di mana tidak ada CV tersimpan di server yang
 * dapat diminta lewat API. Ketiga format di bawah ini memang dapat dibangun
 * sepenuhnya dari data yang sudah ada di layar:
 *
 *  - **JSON dan teks** berasal dari fungsi murni yang sama persis dengan yang
 *    dipakai server, jadi hasilnya identik dengan unduhan dari akun.
 *  - **Word** memakai pustaka `docx` yang memang berjalan di peramban maupun
 *    di server. Pustakanya berukuran besar, jadi dimuat lewat impor dinamis -
 *    hanya terunduh ketika tombolnya benar-benar ditekan, bukan saat halaman
 *    editor dibuka.
 *
 * PDF tidak ada di sini: PDF dihasilkan lewat dialog cetak peramban terhadap
 * halaman cetak, bukan dibangun sebagai berkas.
 */

function saveBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  // Alamat objeknya dilepas setelah peramban sempat memulai unduhan.
  // Melepasnya seketika membatalkan unduhan pada sebagian peramban.
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

export function downloadJson(data: ResumeData): void {
  const blob = new Blob([JSON.stringify(toExportFile(data), null, 2)], {
    type: "application/json;charset=utf-8",
  });
  saveBlob(blob, `${slugify(data.title || "cv")}.json`);
}

export function downloadText(data: ResumeData): void {
  const blob = new Blob([resumeToPlainText(data)], {
    type: "text/plain;charset=utf-8",
  });
  saveBlob(blob, downloadName(data.personalInfo.fullName, data.title, "txt"));
}

export async function downloadDocx(data: ResumeData): Promise<void> {
  const { buildDocx } = await import("@/lib/docx/build");
  const buffer = await buildDocx(data);
  const blob = new Blob([new Uint8Array(buffer)], {
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });
  saveBlob(blob, downloadName(data.personalInfo.fullName, data.title, "docx"));
}

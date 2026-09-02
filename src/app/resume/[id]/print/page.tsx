import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { PrintToolbar } from "@/components/preview/PrintToolbar";
import { ResumeDocument } from "@/components/preview/ResumeDocument";
import { paperSpec } from "@/lib/resume/paper";
import { resumeMargins } from "@/lib/resume/templates";
import { getResume } from "@/lib/resume/persist";

export const metadata: Metadata = {
  title: "Cetak CV",
  robots: { index: false, follow: false },
};

/**
 * Halaman khusus cetak.
 *
 * Sengaja berada di luar kerangka aplikasi sehingga tidak ada bilah alat,
 * menu, maupun tombol yang perlu disembunyikan lewat CSS saat mencetak.
 * Yang tercetak hanyalah dokumen CV itu sendiri.
 *
 * Karena isinya adalah HTML biasa yang dirender peramban, teks pada PDF
 * hasil cetak tetap berupa teks - dapat diseleksi, disalin, dan diurai
 * mesin. Inilah pembeda utamanya dari CV yang diekspor sebagai gambar.
 */
export default async function PrintResumePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const resume = await getResume(id, session.user.id);
  if (!resume) notFound();

  const paper = paperSpec(resume.pageSize);
  const margins = resumeMargins(resume);

  return (
    <div className="flex min-h-full justify-center bg-ink-200 pt-14 print:block print:bg-white print:pt-0">
      {/* Bilah alat agar halaman ini dapat dipakai berdiri sendiri - tidak
          ikut tercetak. */}
      <PrintToolbar backHref={`/resume/${id}/edit`} />

      {/*
        Ukuran DAN margin kertas disampaikan lewat aturan @page, karena at-rule
        tidak dapat membaca custom property CSS.

        Margin sengaja ditaruh di sini, bukan sebagai padding pada elemen
        kertas. Padding hanya berlaku sekali untuk seluruh dokumen yang
        mengalir: halaman pertama memperoleh margin atas, halaman terakhir
        memperoleh margin bawah, dan setiap pergantian halaman di antaranya
        tidak memperoleh apa pun - teks di dasar halaman menempel ke tepi
        kertas. Aturan @page berlaku pada **setiap** halaman, dan itulah yang
        benar.
      */}
      <style>{`@page { size: ${paper.cssSize}; margin: ${margins.y}mm ${margins.x}mm; }`}</style>
      <ResumeDocument
        data={resume}
        printMode
        padding="none"
        className="shadow-lg print:shadow-none"
      />
    </div>
  );
}

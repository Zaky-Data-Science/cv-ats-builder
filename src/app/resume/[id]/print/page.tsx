import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { ResumeDocument } from "@/components/preview/ResumeDocument";
import { paperSpec } from "@/lib/resume/paper";
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

  return (
    <div className="flex min-h-full justify-center bg-ink-200 print:block print:bg-white">
      {/*
        Ukuran kertas harus disampaikan lewat aturan @page, dan at-rule tidak
        dapat membaca custom property CSS. Karena itu satu aturan kecil
        disisipkan di sini dengan ukuran yang dipilih pengguna - tanpa ini,
        CV berukuran Letter atau F4 tetap akan dicetak pada bidang A4 dan
        terpotong di tepinya.
      */}
      <style>{`@page { size: ${paper.cssSize}; margin: 0; }`}</style>
      <ResumeDocument
        data={resume}
        printMode
        className="shadow-lg print:shadow-none"
      />
    </div>
  );
}

import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { PrintToolbar } from "@/components/preview/PrintToolbar";
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
    <div className="flex min-h-full justify-center bg-ink-200 pt-14 print:block print:bg-white print:pt-0">
      {/* Bilah alat agar halaman ini dapat dipakai berdiri sendiri - tidak
          ikut tercetak. */}
      <PrintToolbar backHref={`/resume/${id}/edit`} />

      {/*
        Ukuran kertas disampaikan lewat @page, tetapi **marginnya tidak**.

        Margin cetak sengaja nol di keempat sisi, dan itu satu-satunya cara
        menghilangkan kop dan kaki bawaan Chrome - tanggal, judul tab, alamat
        halaman, dan nomor "1/2". Diuji: margin 2mm pun masih memunculkannya,
        bahkan ketika atas dan bawah sudah nol. Kop itu tidak boleh ada pada CV
        yang dikirim ke perusahaan, dan mematikannya lewat centang di dialog
        cetak tidak dapat diandalkan - pengguna tidak selalu tahu, dan
        centangnya menyala secara bawaan.

        Marginnya karena itu dipindahkan menjadi padding elemen kertas,
        ditambah `box-decoration-break: clone` di globals.css. Tanpa properti
        itu, padding pada dokumen yang mengalir hanya berlaku sekali: halaman
        pertama memperoleh margin atas, halaman terakhir memperoleh margin
        bawah, dan pergantian halaman di antaranya tidak memperoleh apa pun.
        Dengan clone, setiap pecahan halaman memperoleh paddingnya sendiri.

        Efek sampingnya menguntungkan: halaman ini kini juga tampak benar di
        layar. Sebelumnya kertasnya dirender tanpa padding sama sekali sehingga
        teksnya menempel ke tepi.
      */}
      <style>{`@page { size: ${paper.cssSize}; margin: 0; }`}</style>
      <ResumeDocument
        data={resume}
        printMode
        padding="full"
        className="shadow-lg print:shadow-none"
      />
    </div>
  );
}

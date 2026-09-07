"use client";

/*
  ============================================================================
   MEMILIH DESAIN DARI HALAMAN DEPAN
  ============================================================================

  Membungkus pratinjau CV di halaman depan - baik kartu di hero maupun
  kesepuluh kartu di galeri - sehingga menekannya langsung membuka penyusun
  dengan desain itu.

  Sebelum ini galerinya hanya gambar: pengunjung melihat sepuluh desain,
  menyukai salah satunya, lalu harus menekan tombol lain, membuat CV yang
  lahir sebagai CLASSIC, dan mencari sendiri desain yang tadi ia lihat.
  Diminta zaky: "jika di pencet langsung ke halaman pembuatan cv sesuai
  template yang di pencet".

  DUA JALUR, MENURUT KEADAAN MASUK

  Sudah masuk  : CV baru dibuat lewat `POST /api/resumes` beserta desainnya,
                 lalu penyuntingnya dibuka. Satu ketukan, tanpa singgah.
  Belum masuk  : ke penyusun tanpa akun `/coba?desain=...`. Tidak ada
                 pendaftaran yang menghalangi orang mencoba - dan di sana
                 sebuah pilihan muncul yang menjelaskan risikonya, lihat
                 `DialogTamu`.

  KENAPA <button>, BUKAN <Link>, BAGI YANG SUDAH MASUK

  Menekannya MENGUBAH data - sebuah CV baru sungguh dibuat. Tautan dituntut
  aman dipanggil berulang: peramban dan pemindai boleh memuatnya lebih dulu,
  dan satu tautan yang membuat CV setiap kali disentuh akan menumpuk CV kosong
  di akun orang. Bagi yang belum masuk tidak ada yang diubah, jadi di sana ia
  memang sebuah tautan biasa - lengkap dengan klik tengah dan "buka di tab
  baru" yang tetap bekerja.
*/

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useI18n } from "@/components/i18n";
import type { TemplateId } from "@/lib/resume/types";
import { cn } from "@/lib/utils";

/**
 * Membuka penyusun dengan sebuah desain, apa pun pemicunya.
 *
 * Dipakai bersama oleh kartu galeri di bawah dan oleh kartu hero di
 * `HeroTemplateCarousel` - keduanya berbeda bentuk tetapi harus berperilaku
 * sama persis, dan satu-satunya cara memastikannya adalah satu jalan.
 */
export function useMulaiDesain(signedIn: boolean) {
  const router = useRouter();
  const [sibuk, setSibuk] = React.useState(false);

  const mulai = React.useCallback(
    async (template: TemplateId) => {
      if (sibuk) return;

      if (!signedIn) {
        router.push(`/coba?desain=${template}`);
        return;
      }

      setSibuk(true);
      try {
        const res = await fetch("/api/resumes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ preset: "blank", template }),
        });
        const data = await res.json().catch(() => null);
        if (res.ok && data?.resume?.id) {
          router.push(`/resume/${data.resume.id}`);
          return;
        }
        // Gagal membuat - jangan menelan diam-diam. Dasbor tempat CV dibuat
        // dengan tangan, jadi ke sanalah pengguna diantar.
        router.push("/dashboard");
      } catch {
        router.push("/dashboard");
      } finally {
        setSibuk(false);
      }
    },
    [router, signedIn, sibuk],
  );

  return { mulai, sibuk };
}

export function PilihDesain({
  template,
  signedIn,
  className,
  label,
  children,
}: {
  template: TemplateId;
  signedIn: boolean;
  className?: string;
  /** Nama desainnya, dipakai sebagai keterangan bagi pembaca layar. */
  label: string;
  children: React.ReactNode;
}) {
  const { t } = useI18n();
  const { mulai, sibuk } = useMulaiDesain(signedIn);

  const nama = t.home.pilihDesainAria.replace("{desain}", label);

  /*
    Kendalinya MENUTUPI kartu, bukan membungkusnya.

    Bentuk pertama membungkus seluruh kartu di dalam `<Link>`, dan itu cacat
    yang mahal: pratinjau CV di dalamnya memuat tautan kontaknya sendiri -
    surel, LinkedIn, situs - sehingga hasilnya `<a>` di dalam `<a>`. HTML
    melarangnya, dan React menolak menghidrasi pohon yang melanggarnya:

      In HTML, <a> cannot be a descendant of <a>. This will cause a hydration
      error. ... As a result this tree will be regenerated on the client.

    Akibatnya jauh melampaui kartu ini. Seluruh pohon halaman dibangun ulang
    di peramban, dan bersamanya atribut `data-intro` yang dipasang skrip di
    `<head>` ikut lenyap - sehingga intro samurai hanya sempat berkedip
    sebelum hilang. Dilaporkan zaky: "di vercel kok gk ada, kayak kedip
    doang". Terukur: atributnya hanya bertahan 206 milidetik dari 2200 yang
    dimaksudkan.

    Bentuk sekarang menempatkan kendalinya sebagai SAUDARA kartu, dibentangkan
    `absolute inset-0` menutupi seluruhnya. Tidak ada yang bersarang, tautan di
    dalam kertas tertutup lapisan ini sehingga ketukan tetap sampai ke tujuan
    yang benar, dan bagi pengunjung yang belum masuk ia tetap `<a>` sungguhan -
    klik tengah dan "buka di tab baru" tetap bekerja.
  */
  const kelasKendali =
    "absolute inset-0 z-20 rounded-xl focus-visible:ring-2 focus-visible:ring-ink-900 focus-visible:ring-offset-2 focus-visible:outline-none";

  return (
    <div className={cn("relative", className)}>
      {children}

      {signedIn ? (
        <button
          type="button"
          onClick={() => void mulai(template)}
          disabled={sibuk}
          aria-label={nama}
          aria-busy={sibuk}
          className={cn(kelasKendali, "disabled:cursor-progress")}
        />
      ) : (
        <Link
          href={`/coba?desain=${template}`}
          aria-label={nama}
          className={kelasKendali}
        />
      )}
    </div>
  );
}

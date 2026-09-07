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

  if (!signedIn) {
    return (
      <Link
        href={`/coba?desain=${template}`}
        aria-label={nama}
        className={cn("block text-left", className)}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={() => void mulai(template)}
      disabled={sibuk}
      aria-label={nama}
      aria-busy={sibuk}
      className={cn(
        "block w-full text-left disabled:cursor-progress",
        className,
      )}
    >
      {children}
    </button>
  );
}

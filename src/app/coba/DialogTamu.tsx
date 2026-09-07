"use client";

/*
  ============================================================================
   PILIHAN SAAT MASUK PENYUSUN TANPA AKUN
  ============================================================================

  Muncul sekali di perangkat, tepat sebelum orang mulai mengetik CV-nya tanpa
  akun. Isinya tiga jalan, dan yang membedakannya satu hal yang menentukan:
  **datanya tersimpan atau tidak.**

  Diminta zaky bersama pemilihan desain dari halaman depan: "pas masuk halaman
  editnya aku mau mereka dikasih pop up pilihan tanpa akun tapi gk nyimpan
  datanya, atau login pake google atau buat akun dan datanya kesimpan jadi
  biar mereka tau resikonya".

  KENAPA SEKALI PER PERANGKAT, BUKAN SETIAP KALI

  Yang disampaikan sebuah risiko, bukan sebuah pertanyaan - dan risiko yang
  sama diulang setiap kali halaman dibuka berhenti dibaca pada kali ketiga.
  Sesudah dijawab sekali, spanduk mode tamu yang sudah ada di dalam penyusun
  tetap menyebutkan hal yang sama, jadi keterangannya tidak hilang.

  KENAPA ADA TOMBOL "LANJUT TANPA AKUN", BUKAN CUMA TANDA SILANG

  Menutup dengan silang berarti pengguna tidak pernah menyatakan pilihannya -
  ia cuma menyingkirkan sesuatu yang menghalangi. Tombol yang menyebutkan
  akibatnya membuat pilihan itu disengaja. Escape dan latar tetap menutupnya,
  sebab dialog yang tidak dapat ditutup adalah jebakan; keduanya diperlakukan
  sama dengan "lanjut tanpa akun".
*/

import * as React from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { CloudOff, LogIn, UserPlus } from "lucide-react";
import { useI18n } from "@/components/i18n";
import { buttonClass } from "@/components/ui";

/*
  `h-auto` MENIMPA tinggi tetap `h-10` milik `buttonClass`, dan itu memang
  disengaja: ketiga tombol di sini bertulisan dua baris - namanya di atas,
  akibatnya di bawah - sementara tombol biasa dirancang untuk satu baris di
  dalam kotak setinggi 40 piksel. Tanpa ini tulisannya meluber keluar
  kotaknya, cacat yang sama seperti yang pernah terjadi pada tombol ajakan
  halaman Panduan.
*/

const KUNCI = "atscv-tamu-sudah-memilih";

/*
  Keadaannya dibaca lewat `useSyncExternalStore`, bukan `setState` di dalam
  effect - pola yang sama dengan `guest.ts` di sebelah, dan karena alasan yang
  sama: jawabannya hidup di `localStorage`, yang tidak ada di server. Di server
  jawabannya "sudah memilih", sehingga tidak ada dialog yang ikut terkirim
  bersama HTML dan tidak ada kedipan saat halaman dihidrasi.
*/
const pendengar = new Set<() => void>();

function langgan(callback: () => void): () => void {
  pendengar.add(callback);
  return () => {
    pendengar.delete(callback);
  };
}

function sudahMemilih(): boolean {
  try {
    return Boolean(localStorage.getItem(KUNCI));
  } catch {
    // Penyimpanan diblokir. Lebih baik dialognya muncul sekali lagi daripada
    // tidak pernah muncul sama sekali.
    return false;
  }
}

function sudahMemilihDiServer(): boolean {
  return true;
}

function tandaiSudahMemilih(): void {
  try {
    localStorage.setItem(KUNCI, "1");
  } catch {}
  pendengar.forEach((f) => f());
}

export function DialogTamu({ googleEnabled }: { googleEnabled: boolean }) {
  const { t } = useI18n();
  const tombolRef = React.useRef<HTMLButtonElement>(null);

  const sudah = React.useSyncExternalStore(
    langgan,
    sudahMemilih,
    sudahMemilihDiServer,
  );
  const tampil = !sudah;

  React.useEffect(() => {
    if (!tampil) return;
    tombolRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") tandaiSudahMemilih();
    };
    document.addEventListener("keydown", onKey);

    // Halaman di belakangnya tidak boleh ikut tergulir selama dialog terbuka.
    const html = document.documentElement;
    const dulu = html.style.overflow;
    html.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      html.style.overflow = dulu;
    };
  }, [tampil]);

  if (!tampil) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink-950/60 p-4 backdrop-blur-sm sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="judul-dialog-tamu"
      onClick={(e) => {
        if (e.target === e.currentTarget) tandaiSudahMemilih();
      }}
    >
      <div className="w-full max-w-md rounded-2xl border border-ink-200 bg-white p-6 shadow-2xl">
        <h2
          id="judul-dialog-tamu"
          className="text-base font-bold text-ink-900"
        >
          {t.guest.dialogTitle}
        </h2>
        <p className="mt-2 text-[13px] leading-relaxed text-ink-600">
          {t.guest.dialogBody}
        </p>

        <div className="mt-5 flex flex-col gap-2">
          <button
            ref={tombolRef}
            type="button"
            onClick={tandaiSudahMemilih}
            className={buttonClass({
              className:
                "press h-auto w-full justify-start py-3 text-left leading-snug",
            })}
          >
            <CloudOff size={16} className="shrink-0" />
            <span className="min-w-0">
              {t.guest.dialogGuest}
              <span className="block text-[11px] font-normal opacity-75">
                {t.guest.dialogGuestNote}
              </span>
            </span>
          </button>

          {googleEnabled && (
            <button
              type="button"
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              className={buttonClass({
                variant: "outline",
                className:
                "press h-auto w-full justify-start py-3 text-left leading-snug",
              })}
            >
              <LogIn size={16} className="shrink-0" />
              <span className="min-w-0">
                {t.guest.dialogGoogle}
                <span className="block text-[11px] font-normal text-ink-500">
                  {t.guest.dialogSavedNote}
                </span>
              </span>
            </button>
          )}

          <Link
            href="/register"
            className={buttonClass({
              variant: "outline",
              className:
                "press h-auto w-full justify-start py-3 text-left leading-snug",
            })}
          >
            <UserPlus size={16} className="shrink-0" />
            <span className="min-w-0">
              {t.guest.dialogRegister}
              <span className="block text-[11px] font-normal text-ink-500">
                {t.guest.dialogSavedNote}
              </span>
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}

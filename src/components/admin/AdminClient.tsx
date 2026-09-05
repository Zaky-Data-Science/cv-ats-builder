"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, Database, Mail, Search, Trash2, TriangleAlert } from "lucide-react";
import { Button, Card } from "@/components/ui";
import { hapusAkun, kirimTautanReset, type HasilAksi } from "@/app/(app)/admin/actions";

/**
 * Tampilan panel pengelola.
 *
 * Komponen ini hanya menggambar. Seluruh pemeriksaan peran ada di server -
 * pada halamannya dan, terpisah lagi, pada tiap aksinya. Menyembunyikan tombol
 * di sini bukan pengamanan: siapa pun dapat memanggil aksinya langsung tanpa
 * pernah memuat berkas ini.
 */

export interface AkunRingkas {
  email: string;
  daftar: string;
  aktif: string;
  punyaSandi: boolean;
  punyaGoogle: boolean;
  jumlahCv: number;
}

export interface TeksAdmin {
  title: string;
  subtitle: string;
  privacyNote: string;
  dbConnected: string;
  dbDown: string;
  statAccounts: string;
  statResumes: string;
  stat7: string;
  stat30: string;
  searchLabel: string;
  searchPlaceholder: string;
  colEmail: string;
  colJoined: string;
  colSignIn: string;
  colResumes: string;
  colActive: string;
  colActions: string;
  signInPassword: string;
  signInGoogle: string;
  empty: string;
  prev: string;
  next: string;
  pageOf: string;
  resend: string;
  deleteAccount: string;
  deleteTitle: string;
  deleteBody: string;
  deleteConfirmLabel: string;
  deleteCancel: string;
  deleteConfirm: string;
  working: string;
  back: string;
}

export function AdminClient({
  teks,
  tersambung,
  ringkasan,
  akun,
  cari,
  halaman,
  perHalaman,
  total,
}: {
  teks: TeksAdmin;
  tersambung: boolean;
  ringkasan: { akun: number; cv: number; baru7: number; baru30: number };
  akun: AkunRingkas[];
  cari: string;
  halaman: number;
  perHalaman: number;
  total: number;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [kueri, setKueri] = React.useState(cari);
  const [hasil, setHasil] = React.useState<HasilAksi | null>(null);
  const [sibuk, setSibuk] = React.useState(false);
  const [hapus, setHapus] = React.useState<string | null>(null);
  const [ketikan, setKetikan] = React.useState("");

  const halamanAkhir = Math.max(1, Math.ceil(total / perHalaman));

  const pindah = (hal: number, q = kueri) => {
    const next = new URLSearchParams(params.toString());
    if (q.trim()) next.set("q", q.trim());
    else next.delete("q");
    next.set("hal", String(hal));
    router.push(`/admin?${next.toString()}`);
  };

  const jalankan = async (aksi: (fd: FormData) => Promise<HasilAksi>, fd: FormData) => {
    setSibuk(true);
    try {
      const r = await aksi(fd);
      setHasil(r);
      if (r.ok) {
        setHapus(null);
        setKetikan("");
        router.refresh();
      }
    } finally {
      setSibuk(false);
    }
  };

  const tanggal = (iso: string) =>
    new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-8">
      <h1 className="text-xl font-bold text-ink-900">{teks.title}</h1>
      <p className="mt-1 text-sm text-ink-600">{teks.subtitle}</p>

      {/*
        Batas panel ini ditulis di panelnya sendiri, bukan hanya di halaman
        Privasi. Yang membaca halaman Privasi pengguna; yang perlu diingatkan
        setiap kali membuka panel ini justru pengelolanya.
      */}
      <p className="mt-3 rounded-lg border border-ink-200 bg-ink-50 px-3 py-2 text-xs leading-relaxed text-ink-600">
        {teks.privacyNote}
      </p>

      {/* Status basis data ------------------------------------------------ */}
      <div
        className={`mt-5 flex items-center gap-2 rounded-lg border px-3 py-2 text-xs ${
          tersambung
            ? "border-ink-200 bg-white text-ink-700"
            : "border-red-200 bg-red-50 text-red-700"
        }`}
      >
        {tersambung ? <Database size={14} /> : <TriangleAlert size={14} />}
        {tersambung ? teks.dbConnected : teks.dbDown}
      </div>

      {/* Ringkasan -------------------------------------------------------- */}
      <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          [teks.statAccounts, ringkasan.akun],
          [teks.statResumes, ringkasan.cv],
          [teks.stat7, ringkasan.baru7],
          [teks.stat30, ringkasan.baru30],
        ].map(([label, nilai]) => (
          <Card key={String(label)} className="p-4">
            <dt className="text-[11px] tracking-wide text-ink-500 uppercase">
              {label}
            </dt>
            <dd className="mt-1 text-2xl font-bold text-ink-900">{nilai}</dd>
          </Card>
        ))}
      </dl>

      {hasil && (
        <p
          role="status"
          className={`mt-5 flex items-start gap-2 rounded-lg border px-3 py-2 text-xs leading-relaxed ${
            hasil.ok
              ? "border-ink-200 bg-ink-50 text-ink-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {hasil.ok ? (
            <CheckCircle2 size={14} className="mt-px shrink-0" />
          ) : (
            <TriangleAlert size={14} className="mt-px shrink-0" />
          )}
          {hasil.pesan}
        </p>
      )}

      {/* Pencarian -------------------------------------------------------- */}
      <form
        className="mt-6 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          pindah(1);
        }}
      >
        <label className="sr-only" htmlFor="cari-akun">
          {teks.searchLabel}
        </label>
        <div className="relative flex-1">
          <Search
            size={14}
            className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-ink-400"
            aria-hidden
          />
          <input
            id="cari-akun"
            value={kueri}
            onChange={(e) => setKueri(e.target.value)}
            placeholder={teks.searchPlaceholder}
            className="w-full rounded-lg border border-ink-200 bg-white py-2 pr-3 pl-9 text-sm text-ink-900 placeholder:text-ink-400"
          />
        </div>
        <Button type="submit" className="press">
          {teks.searchLabel}
        </Button>
      </form>

      {/* Daftar akun ------------------------------------------------------ */}
      <div className="mt-4 overflow-x-auto rounded-xl border border-ink-200 bg-white">
        <table className="w-full min-w-[52rem] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-ink-200 bg-ink-50 text-[11px] tracking-wide text-ink-500 uppercase">
              <th scope="col" className="px-4 py-2.5 font-medium">{teks.colEmail}</th>
              <th scope="col" className="px-4 py-2.5 font-medium">{teks.colJoined}</th>
              <th scope="col" className="px-4 py-2.5 font-medium">{teks.colSignIn}</th>
              <th scope="col" className="px-4 py-2.5 font-medium">{teks.colResumes}</th>
              <th scope="col" className="px-4 py-2.5 font-medium">{teks.colActive}</th>
              <th scope="col" className="px-4 py-2.5 font-medium">{teks.colActions}</th>
            </tr>
          </thead>
          <tbody>
            {akun.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-ink-500">
                  {teks.empty}
                </td>
              </tr>
            )}
            {akun.map((u) => (
              <tr key={u.email} className="border-b border-ink-100 last:border-0">
                <td className="px-4 py-2.5 text-ink-900">{u.email}</td>
                <td className="px-4 py-2.5 whitespace-nowrap text-ink-600">
                  {tanggal(u.daftar)}
                </td>
                <td className="px-4 py-2.5 text-ink-600">
                  {[
                    u.punyaSandi ? teks.signInPassword : null,
                    u.punyaGoogle ? teks.signInGoogle : null,
                  ]
                    .filter(Boolean)
                    .join(" + ")}
                </td>
                <td className="px-4 py-2.5 text-ink-600">{u.jumlahCv}</td>
                <td className="px-4 py-2.5 whitespace-nowrap text-ink-600">
                  {tanggal(u.aktif)}
                </td>
                <td className="px-4 py-2.5">
                  <div className="flex gap-1.5">
                    <Button
                      size="sm"
                      variant="outline"
                      className="press"
                      disabled={sibuk}
                      onClick={() => {
                        const fd = new FormData();
                        fd.set("email", u.email);
                        void jalankan(kirimTautanReset, fd);
                      }}
                    >
                      <Mail size={13} />
                      {teks.resend}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="press"
                      disabled={sibuk}
                      onClick={() => {
                        setHapus(u.email);
                        setKetikan("");
                        setHasil(null);
                      }}
                    >
                      <Trash2 size={13} />
                      {teks.deleteAccount}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Halaman ---------------------------------------------------------- */}
      <div className="mt-3 flex items-center justify-between text-xs text-ink-600">
        <span>
          {teks.pageOf.replace("{n}", String(halaman)).replace("{t}", String(halamanAkhir))}
        </span>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="press"
            disabled={halaman <= 1}
            onClick={() => pindah(halaman - 1)}
          >
            {teks.prev}
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="press"
            disabled={halaman >= halamanAkhir}
            onClick={() => pindah(halaman + 1)}
          >
            {teks.next}
          </Button>
        </div>
      </div>

      {/*
        Konfirmasi hapus menuntut mengetik ulang alamatnya.

        Sekali klik pada baris yang meleset satu adalah cara paling mudah
        menghapus akun yang salah, dan penghapusan di sini tidak dapat
        dibatalkan. Mengetik ulang memaksa mata membaca alamat yang benar-benar
        akan dihapus.
      */}
      {hapus && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-ink-900/40 p-5">
          <Card className="w-full max-w-md p-6">
            <h2 className="text-base font-semibold text-ink-900">{teks.deleteTitle}</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-600">
              {teks.deleteBody.replace("{email}", hapus)}
            </p>
            <label className="mt-4 block text-xs font-medium text-ink-700">
              {teks.deleteConfirmLabel}
            </label>
            <input
              value={ketikan}
              onChange={(e) => setKetikan(e.target.value)}
              autoComplete="off"
              className="mt-1 w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm text-ink-900"
            />
            <div className="mt-5 flex justify-end gap-2">
              <Button
                variant="outline"
                className="press"
                onClick={() => setHapus(null)}
                disabled={sibuk}
              >
                {teks.deleteCancel}
              </Button>
              <Button
                className="press"
                disabled={sibuk || ketikan.trim().toLowerCase() !== hapus}
                onClick={() => {
                  const fd = new FormData();
                  fd.set("email", hapus);
                  fd.set("konfirmasi", ketikan);
                  void jalankan(hapusAkun, fd);
                }}
              >
                {sibuk ? teks.working : teks.deleteConfirm}
              </Button>
            </div>
          </Card>
        </div>
      )}

      <p className="mt-8 text-xs text-ink-500">
        <Link href="/dashboard" className="press underline underline-offset-2">
          &larr; {teks.back}
        </Link>
      </p>
    </div>
  );
}

"use client";

import * as React from "react";
import { Check, ChevronDown, Search, Sparkles } from "lucide-react";
import { useI18n } from "@/components/i18n";
import { Button, Field, Input } from "@/components/ui";
import { cariBidang } from "@/lib/portfolio/pencarian";
import {
  LABEL_JENJANG,
  LABEL_TUJUAN,
  PENJELAS_TUJUAN,
  POLA_SCHEMAS,
  URUTAN_POLA,
} from "@/lib/portfolio/pola-schemas";
import {
  kamusProfil,
  polaUntuk,
  skemaProfil,
  terapkanBidang,
  terapkanBidangTakDikenal,
  terapkanJenjang,
  terapkanTujuan,
} from "@/lib/portfolio/profil";
import {
  SEMUA_JENJANG,
  SEMUA_TUJUAN,
  type JenjangPengalaman,
  type PolaSlug,
  type TujuanCV,
} from "@/lib/portfolio/types";
import { cn } from "@/lib/utils";
import { useEditor } from "./context";

/**
 * ============================================================================
 *  TIGA PERTANYAAN PEMBUKA
 * ============================================================================
 *
 * Pengguna tidak pernah melihat kata "pola" sebagai jargon. Yang ia lihat
 * adalah tiga pertanyaan pendek tentang dirinya - jurusan, keperluan, lama
 * pengalaman - dan sebuah kalimat yang menjelaskan bentuk portofolio apa yang
 * dipilihkan untuknya, beserta tombol untuk menggantinya.
 *
 * Pertanyaan ketiga yang paling sering diremehkan dan paling menentukan. Tanpa
 * jawabannya, mahasiswa dinilai dengan ambang senior: formulir menuntut
 * verifikator, hasil terukur berangka, dan standar yang memang belum ia punya,
 * lalu memberinya skor rendah tanpa jalan keluar. Karena itu ia tidak
 * disediakan tombol lewat.
 *
 * Tidak ada satu pun percabangan bidang atau pola di berkas ini - semuanya
 * dibaca dari registry lewat lib/portfolio/profil.ts.
 */
export function PortofolioOnboarding() {
  const { data, update } = useEditor();
  const { t } = useI18n();
  const teks = t.portofolio;

  const profil = data.profilPortofolio;
  const skema = skemaProfil(profil);
  const entri = kamusProfil(profil);

  const [buka, setBuka] = React.useState(!profil.sudahDitanya);
  const [kueri, setKueri] = React.useState(profil.jurusan);
  const [pilihPolaTerbuka, setPilihPolaTerbuka] = React.useState(false);

  const hasil = React.useMemo(() => cariBidang(kueri), [kueri]);

  // Apakah polanya pernah diganti sendiri oleh pengguna. Diturunkan, bukan
  // disimpan: bila polanya berbeda dari yang akan dipilihkan sistem untuk
  // bidang dan tujuan yang sama, berarti orangnya yang memutuskan - dan
  // keputusan itu tidak boleh ditimpa diam-diam saat ia mengganti tujuan.
  const polaManual = profil.pola !== polaUntuk(entri, profil.tujuan);

  const setProfil = (patch: Partial<typeof profil>) =>
    update({ profilPortofolio: { ...profil, ...patch } });

  const pilihBidang = (slug: string, jurusanDiketik: string) => {
    const cocok = hasil.find((h) => h.entri.slug === slug);
    if (!cocok) return;
    setKueri(jurusanDiketik);
    update({
      profilPortofolio: terapkanBidang(profil, cocok.entri, jurusanDiketik),
    });
  };

  const pilihTujuan = (tujuan: TujuanCV) =>
    update({ profilPortofolio: terapkanTujuan(profil, tujuan, polaManual) });

  const pilihJenjang = (jenjang: JenjangPengalaman) =>
    update({ profilPortofolio: terapkanJenjang(profil, jenjang) });

  const pilihPola = (pola: PolaSlug) => {
    setPilihPolaTerbuka(false);
    setProfil({ pola });
  };

  const selesai = () => {
    setProfil({ sudahDitanya: true });
    setBuka(false);
  };

  /* ---------------------------------------------------------------- */
  /* Ringkasan - bentuk yang terlihat setelah pertanyaan dijawab       */
  /* ---------------------------------------------------------------- */

  if (!buka) {
    return (
      <section className="rounded-xl border border-ink-200 bg-white p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold tracking-wide text-ink-500 uppercase">
              {teks.chosenLabel}
            </p>
            <p className="mt-0.5 text-sm font-semibold text-ink-900">
              {skema.nama}
            </p>
            <p className="mt-1 text-[11px] leading-relaxed text-ink-500">
              {skema.kalimatPenjelas}
            </p>
            {profil.jurusan && (
              <p className="mt-1.5 text-[11px] text-ink-500">
                {teks.fieldLabel}: {profil.jurusan}
                {" · "}
                {LABEL_TUJUAN[profil.tujuan]}
                {" · "}
                {LABEL_JENJANG[profil.jenjang]}
              </p>
            )}
          </div>
          <Button size="sm" variant="outline" onClick={() => setBuka(true)}>
            {teks.change}
          </Button>
        </div>
      </section>
    );
  }

  /* ---------------------------------------------------------------- */
  /* Tiga pertanyaan                                                   */
  /* ---------------------------------------------------------------- */

  return (
    <section className="space-y-4 rounded-xl border border-brand-200 bg-brand-50/40 p-4">
      <div className="flex items-start gap-2">
        <Sparkles size={15} className="mt-0.5 shrink-0 text-brand-600" />
        <div>
          <h2 className="text-sm font-semibold text-ink-900">{teks.title}</h2>
          <p className="mt-0.5 text-[11px] leading-relaxed text-ink-600">
            {teks.intro}
          </p>
        </div>
      </div>

      {/* Pertanyaan 1 - jurusan atau profesi */}
      <Field
        label={teks.q1Label}
        hint={teks.q1Hint}
        htmlFor="portofolio-jurusan"
      >
        <div className="relative">
          <Search
            size={14}
            className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-ink-400"
          />
          <Input
            id="portofolio-jurusan"
            value={kueri}
            onChange={(e) => setKueri(e.target.value)}
            placeholder={teks.q1Ph}
            className="pl-8"
            autoComplete="off"
          />
        </div>
      </Field>

      {kueri.trim().length >= 2 && (
        <div className="space-y-1">
          {hasil.length === 0 && (
            <p className="text-[11px] text-ink-500">{teks.searchEmpty}</p>
          )}
          {hasil.map((item) => {
            const terpilih = profil.bidangKamus === item.entri.slug;
            return (
              <button
                key={item.entri.slug}
                type="button"
                onClick={() => pilihBidang(item.entri.slug, kueri)}
                aria-pressed={terpilih}
                className={cn(
                  "flex w-full items-center justify-between gap-2 rounded-lg border px-3 py-2 text-left transition-colors",
                  terpilih
                    ? "border-brand-500 bg-white"
                    : "border-ink-200 bg-white hover:bg-ink-50",
                )}
              >
                <span className="min-w-0">
                  <span className="block truncate text-xs font-medium text-ink-900">
                    {item.entri.nama}
                  </span>
                  <span className="block truncate text-[11px] text-ink-500">
                    {item.cocokPada}
                    {" · "}
                    {POLA_SCHEMAS[item.entri.polaDisarankan].nama}
                  </span>
                </span>
                {terpilih && (
                  <Check size={14} className="shrink-0 text-brand-600" />
                )}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() =>
              update({
                profilPortofolio: terapkanBidangTakDikenal(profil, kueri),
              })
            }
            className="w-full rounded-lg border border-dashed border-ink-300 px-3 py-2 text-left text-[11px] text-ink-600 transition-colors hover:bg-ink-50"
          >
            {teks.notFound}
          </button>
        </div>
      )}

      {/* Pertanyaan 2 - keperluan */}
      <Field label={teks.q2Label} hint={teks.q2Hint}>
        <div className="grid gap-1.5 sm:grid-cols-2">
          {SEMUA_TUJUAN.map((tujuan) => {
            const terpilih = profil.tujuan === tujuan;
            return (
              <button
                key={tujuan}
                type="button"
                onClick={() => pilihTujuan(tujuan)}
                aria-pressed={terpilih}
                className={cn(
                  "rounded-lg border px-3 py-2 text-left transition-colors",
                  terpilih
                    ? "border-brand-500 bg-white"
                    : "border-ink-200 bg-white hover:bg-ink-50",
                )}
              >
                <span className="block text-xs font-medium text-ink-900">
                  {LABEL_TUJUAN[tujuan]}
                </span>
                <span className="mt-0.5 block text-[11px] leading-relaxed text-ink-500">
                  {PENJELAS_TUJUAN[tujuan]}
                </span>
              </button>
            );
          })}
        </div>
      </Field>

      {/* Pertanyaan 3 - jenjang. Sengaja tanpa tombol lewat. */}
      <Field label={teks.q3Label} hint={teks.q3Hint}>
        <div className="flex flex-wrap gap-1.5">
          {SEMUA_JENJANG.map((jenjang) => {
            const terpilih = profil.jenjang === jenjang;
            return (
              <button
                key={jenjang}
                type="button"
                onClick={() => pilihJenjang(jenjang)}
                aria-pressed={terpilih}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs transition-colors",
                  terpilih
                    ? "border-brand-500 bg-white font-medium text-ink-900"
                    : "border-ink-200 bg-white text-ink-600 hover:bg-ink-50",
                )}
              >
                {LABEL_JENJANG[jenjang]}
              </button>
            );
          })}
        </div>
      </Field>

      {/* Hasilnya, beserta jalan keluar bila tebakannya meleset */}
      <div className="rounded-lg border border-ink-200 bg-white p-3">
        <p className="text-[11px] font-semibold tracking-wide text-ink-500 uppercase">
          {teks.chosenLabel}
        </p>
        <p className="mt-0.5 text-sm font-semibold text-ink-900">
          {skema.nama}
        </p>
        <p className="mt-1 text-[11px] leading-relaxed text-ink-500">
          {skema.kalimatPenjelas}
        </p>

        <button
          type="button"
          onClick={() => setPilihPolaTerbuka((nilai) => !nilai)}
          aria-expanded={pilihPolaTerbuka}
          className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-brand-700 hover:underline"
        >
          <ChevronDown
            size={12}
            className={cn("transition-transform", !pilihPolaTerbuka && "-rotate-90")}
          />
          {teks.changeShape}
        </button>

        {pilihPolaTerbuka && (
          <div className="mt-2 space-y-1">
            {URUTAN_POLA.map((slug) => {
              const kandidat = POLA_SCHEMAS[slug];
              const terpilih = profil.pola === slug;
              return (
                <button
                  key={slug}
                  type="button"
                  onClick={() => pilihPola(slug)}
                  aria-pressed={terpilih}
                  className={cn(
                    "w-full rounded-lg border px-3 py-2 text-left transition-colors",
                    terpilih
                      ? "border-brand-500 bg-brand-50/40"
                      : "border-ink-200 hover:bg-ink-50",
                  )}
                >
                  <span className="block text-xs font-medium text-ink-900">
                    {kandidat.nama}
                  </span>
                  <span className="mt-0.5 block text-[11px] leading-relaxed text-ink-500">
                    {kandidat.kalimatPenjelas}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-3">
        <p className="text-[11px] leading-relaxed text-ink-500">
          {teks.footnote}
        </p>
        <Button size="sm" onClick={selesai}>
          {teks.done}
        </Button>
      </div>
    </section>
  );
}

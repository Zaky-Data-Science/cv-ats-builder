"use client";

/*
  Laci "Tampilan CV".

  Sebelumnya seluruh pengaturan ini menyisip sebagai blok di dalam bilah alat.
  Akibatnya dua hal yang sama-sama merugikan: kertasnya terdorong turun sekitar
  empat ratus piksel sehingga perubahan yang baru saja diatur justru tidak
  terlihat, dan warnanya - abu sangat muda di atas putih - membuatnya terbaca
  sebagai bagian dari bilah, bukan sebagai panel tersendiri.

  Laci ini menjawab keduanya. Ia melayang di atas halaman, jadi tidak ada satu
  piksel pun tata letak yang bergeser saat dibuka, dan **tidak** disertai
  lapisan gelap yang menutupi halaman: kertas di sebelahnya tetap terlihat dan
  tetap dapat digulir selama pengaturannya diubah. Itulah seluruh alasan ia
  berbentuk laci, bukan jendela timbul.

  Letaknya berbeda menurut lebar layar, mengikuti di mana kertas berada:

  - Layar lebar: menempel di tepi kiri. Kertas ada di kolom kanan, jadi laci di
    kiri tidak menutupi apa pun yang sedang diamati.
  - Layar sempit: lembar di tepi bawah setinggi paling banyak 55% layar, dengan
    kertas tetap terlihat di atasnya. Membukanya juga memindahkan panel aktif
    ke pratinjau - percuma mengatur tampilan sambil menatap formulir.

  Digambar lewat portal ke <body> dengan alasan yang sama seperti DatePopover
  dan laci navigasi ponsel: elemen `position: fixed` yang bersarang di dalam
  induk ber-`transform` atau ber-`filter` akan diposisikan relatif terhadap
  induknya, bukan terhadap layar.
*/

import * as React from "react";
import { createPortal } from "react-dom";
import { RotateCcw, X } from "lucide-react";
import { useI18n } from "@/components/i18n";
import { Callout, Field, Select } from "@/components/ui";
import { ATS_SAFE_FONTS } from "@/lib/ats/vocabulary";
import {
  PAPER_NOTE,
  PAPER_ORDER,
  PAPER_SIZES,
  RECOMMENDED_PAPER,
} from "@/lib/resume/paper";
import {
  MARGIN_MAX_MM,
  MARGIN_MIN_MM,
  PHOTO_WIDTH_MAX_MM,
  PHOTO_WIDTH_MIN_MM,
  resumePhotoSize,
  TEMPLATE_INFO,
  TEMPLATE_ORDER,
  templateStyle,
} from "@/lib/resume/templates";
import type { ResumeData } from "@/lib/resume/types";
import {
  LEBAR_MAKS,
  LEBAR_MIN,
  TINGGI_MAKS,
  TINGGI_MIN,
  useUkuranLaci,
} from "@/lib/resume/ukuran-laci";
import { cn } from "@/lib/utils";

export function AppearanceDrawer({
  open,
  onClose,
  data,
  update,
  margins,
  usesTemplateMargin,
}: {
  open: boolean;
  onClose: () => void;
  data: ResumeData;
  update: (patch: Partial<ResumeData>) => void;
  /** Margin yang sedang berlaku - pilihan pengguna, atau bawaan template. */
  margins: { x: number; y: number };
  usesTemplateMargin: boolean;
}) {
  const { t, locale } = useI18n();
  const panelRef = React.useRef<HTMLDivElement>(null);
  const ukuran = useUkuranLaci();

  // Escape menutup laci. Dipasang hanya selagi terbuka supaya Escape tetap
  // bebas dipakai bagian lain aplikasi saat laci tertutup.
  React.useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  // Fokus dipindahkan ke dalam laci saat dibuka supaya pengguna papan ketik
  // tidak harus menyusuri seluruh halaman untuk sampai ke sini.
  React.useEffect(() => {
    if (open) panelRef.current?.focus();
  }, [open]);

  /*
    Tidak ada penjaga "sudah terpasang di peramban" seperti yang biasa
    menyertai portal. Nilai awal `open` selalu false, jadi cabang ini sudah
    keluar lebih dulu pada render di server - `document` tidak pernah
    tersentuh di sana. Pola yang sama dipakai laci navigasi di PublicHeader.
  */
  if (!open) return null;

  const style = templateStyle(data.template);
  const ukuranFoto = resumePhotoSize(data.template, data.personalInfo.photoWidthMm);

  return createPortal(
    <div
      ref={panelRef}
      tabIndex={-1}
      role="dialog"
      aria-modal={false}
      aria-label={t.appearance.drawerTitle}
      /*
        Ukurannya disalurkan lewat custom property, bukan ditulis langsung
        sebagai `height` atau `width`. Sebabnya satu elemen ini berperan
        ganda - lembar bawah di layar sempit, laci kiri di layar lebar - dan
        gaya sebaris tidak mengenal titik henti. Dengan custom property, CSS
        yang memilih mana yang dipakai.
      */
      style={
        {
          "--laci-tinggi": `${ukuran.tinggiVh}vh`,
          "--laci-lebar": `${ukuran.lebarRem}rem`,
        } as React.CSSProperties
      }
      className={cn(
        "fixed z-50 flex flex-col bg-white shadow-2xl outline-none",
        // Layar sempit: lembar bawah setinggi yang diatur penggunanya.
        "inset-x-0 bottom-0 h-[var(--laci-tinggi)] rounded-t-2xl border-t-2 border-ink-300",
        // Layar lebar: laci penuh di tepi kiri, selebar yang diatur.
        "lg:inset-y-0 lg:right-auto lg:left-0 lg:h-auto lg:w-[var(--laci-lebar)] lg:rounded-none lg:border-t-0 lg:border-r-2 lg:border-ink-300",
      )}
    >
      {/*
        Pegangan lembar bawah.

        Bentuknya garis pendek di tengah - isyarat yang sudah dikenal orang
        dari lembar bawah aplikasi ponsel, sehingga tidak perlu diterangkan.
        Daerah tekannya jauh lebih tinggi daripada garisnya (`py-2.5` pada
        pembungkus) supaya jempol tidak perlu tepat mengenai garis setebal
        empat piksel.

        `touch-none` mematikan gulir bawaan selama ditarik; tanpa itu, menarik
        pegangan justru menggulir halaman di belakangnya.
      */}
      <div
        role="separator"
        aria-orientation="horizontal"
        aria-label={t.appearance.resizeHeight}
        aria-valuenow={Math.round(ukuran.tinggiVh)}
        aria-valuemin={TINGGI_MIN}
        aria-valuemax={TINGGI_MAKS}
        tabIndex={0}
        onPointerDown={ukuran.tarikTinggi}
        onKeyDown={ukuran.tombolTinggi}
        className="group shrink-0 cursor-ns-resize touch-none rounded-t-2xl bg-ink-900 py-2.5 outline-none lg:hidden"
      >
        <span
          aria-hidden
          className="mx-auto block h-1 w-10 rounded-full bg-white/30 transition-colors group-hover:bg-white/60 group-focus-visible:bg-white"
        />
      </div>

      {/*
        Pegangan tepi laci kiri - hanya layar lebar. Lebarnya cuma beberapa
        piksel supaya tidak memakan ruang, tetapi daerah tekannya diperlebar
        ke kiri dan kanan lewat `-mr-1 pr-2`.
      */}
      <div
        role="separator"
        aria-orientation="vertical"
        aria-label={t.appearance.resizeWidth}
        aria-valuenow={Math.round(ukuran.lebarRem)}
        aria-valuemin={LEBAR_MIN}
        aria-valuemax={LEBAR_MAKS}
        tabIndex={0}
        onPointerDown={ukuran.tarikLebar}
        onKeyDown={ukuran.tombolLebar}
        className="absolute inset-y-0 right-0 hidden w-2 cursor-ew-resize touch-none outline-none hover:bg-ink-300/60 focus-visible:bg-ink-400 lg:block"
      />
      {/*
        Kepala laci berlatar gelap. Panel ini melayang di atas halaman yang
        juga berlatar terang; tanpa satu bidang pekat yang menandai batasnya,
        ia kembali terbaca menyatu dengan yang di belakangnya - persis keluhan
        yang membuatnya dipindahkan ke sini.
      */}
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-white/15 bg-ink-900 px-4 py-3 lg:rounded-none">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-white">
            {t.appearance.drawerTitle}
          </h2>
          <p className="mt-0.5 truncate text-[11px] text-white/60">
            {t.appearance.drawerHint}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label={t.common.close}
          className="tap-target -mr-1 grid h-8 w-8 shrink-0 place-items-center rounded-lg text-white/70 transition-colors hover:bg-white/10 hover:text-white"
        >
          <X size={18} />
        </button>
      </div>

      <div className="thin-scrollbar min-h-0 flex-1 space-y-5 overflow-y-auto p-4 pb-24 lg:pb-6">
        {/* --------------------------------------------------------- */}
        <Group title={t.appearance.groupLook}>
          <Field
            label={t.appearance.template}
            hint={TEMPLATE_INFO[locale][data.template].description}
          >
            <Select
              value={data.template}
              onChange={(e) =>
                update({ template: e.target.value as ResumeData["template"] })
              }
            >
              {/*
                Template dikelompokkan berdasarkan ada-tidaknya foto, karena
                itulah pertanyaan pertama yang muncul di benak pengguna saat
                memilih - bukan nama templatenya.
              */}
              <optgroup label={t.appearance.templateWithoutPhoto}>
                {TEMPLATE_ORDER.filter(
                  (id) => templateStyle(id).photo === "none",
                ).map((id) => (
                  <option key={id} value={id}>
                    {TEMPLATE_INFO[locale][id].name}
                  </option>
                ))}
              </optgroup>
              <optgroup label={t.appearance.templateWithPhoto}>
                {TEMPLATE_ORDER.filter(
                  (id) => templateStyle(id).photo !== "none",
                ).map((id) => (
                  <option key={id} value={id}>
                    {TEMPLATE_INFO[locale][id].name}
                  </option>
                ))}
              </optgroup>
            </Select>
          </Field>

          {style.useAccent && (
            <Field label={t.appearance.accentColor}>
              <input
                type="color"
                value={data.accentColor}
                onChange={(e) => update({ accentColor: e.target.value })}
                className="h-9 w-full cursor-pointer rounded-lg border border-ink-300"
                aria-label={t.appearance.accentColor}
              />
            </Field>
          )}

          {/*
            Ukuran pas foto ditaruh di sini, bukan di formulir Data Pribadi.
            Yang diatur di sana isinya - siapa Anda; yang diatur di sini
            rupanya - seberapa besar ia tampil di kertas. Menyelipkan
            penggeser ukuran di antara nama dan nomor telepon mencampur
            keduanya.
          */}
          {data.personalInfo.showPhoto && style.photo !== "none" && (
            <Slider
              label={t.appearance.photoWidth}
              value={`${ukuranFoto.widthMm.toFixed(0)} x ${ukuranFoto.heightMm.toFixed(0)} mm${
                data.personalInfo.photoWidthMm === null
                  ? ` (${t.appearance.marginFollowTemplate})`
                  : ""
              }`}
              min={PHOTO_WIDTH_MIN_MM}
              max={PHOTO_WIDTH_MAX_MM}
              step={1}
              current={ukuranFoto.widthMm}
              onChange={(v) =>
                update({
                  personalInfo: { ...data.personalInfo, photoWidthMm: v },
                })
              }
            />
          )}

          {data.personalInfo.showPhoto && style.photo === "none" && (
            <Callout tone="warn">{t.appearance.photoUnsupported}</Callout>
          )}
        </Group>

        {/* --------------------------------------------------------- */}
        <Group title={t.appearance.groupText}>
          <Field label={t.appearance.font} hint={t.appearance.fontHint}>
            <Select
              value={data.fontFamily}
              onChange={(e) => update({ fontFamily: e.target.value })}
            >
              {ATS_SAFE_FONTS.map((font) => (
                <option key={font} value={font}>
                  {font}
                </option>
              ))}
            </Select>
          </Field>

          <Slider
            label={t.appearance.fontSize}
            value={`${data.fontSize} pt`}
            min={9}
            max={12}
            step={0.5}
            current={data.fontSize}
            onChange={(v) => update({ fontSize: v })}
          />

          <Slider
            label={t.appearance.lineHeight}
            value={data.lineHeight.toFixed(2)}
            min={1.1}
            max={1.6}
            step={0.05}
            current={data.lineHeight}
            onChange={(v) => update({ lineHeight: v })}
          />
        </Group>

        {/* --------------------------------------------------------- */}
        <Group title={t.appearance.groupPaper}>
          <Field
            label={t.appearance.paperSize}
            hint={PAPER_NOTE[locale][data.pageSize]}
          >
            <Select
              value={data.pageSize}
              onChange={(e) =>
                update({ pageSize: e.target.value as ResumeData["pageSize"] })
              }
            >
              {PAPER_ORDER.map((size) => (
                <option key={size} value={size}>
                  {PAPER_SIZES[size].label}
                  {size === RECOMMENDED_PAPER
                    ? ` - ${t.preview.paperRecommended}`
                    : ""}
                </option>
              ))}
            </Select>
          </Field>

          <Slider
            label={t.appearance.marginY}
            value={`${margins.y} mm${
              data.marginYMm === null
                ? ` (${t.appearance.marginFollowTemplate})`
                : ""
            }`}
            min={MARGIN_MIN_MM}
            max={MARGIN_MAX_MM}
            step={1}
            current={margins.y}
            onChange={(v) => update({ marginYMm: v })}
          />

          <Slider
            label={t.appearance.marginX}
            value={`${margins.x} mm${
              data.marginXMm === null
                ? ` (${t.appearance.marginFollowTemplate})`
                : ""
            }`}
            min={MARGIN_MIN_MM}
            max={MARGIN_MAX_MM}
            step={1}
            current={margins.x}
            onChange={(v) => update({ marginXMm: v })}
          />

          {/*
            Tombol pengembali hanya muncul saat memang ada yang perlu
            dikembalikan. Tombol yang selalu tampak tetapi tidak melakukan
            apa-apa mengajari pengguna untuk mengabaikannya.
          */}
          {!usesTemplateMargin && (
            <button
              type="button"
              onClick={() => update({ marginYMm: null, marginXMm: null })}
              className="tap-target flex items-center gap-1.5 text-[11px] font-medium text-ink-700 underline"
            >
              <RotateCcw size={12} />
              {t.appearance.marginReset}
            </button>
          )}

          <p className="text-[11px] leading-relaxed text-ink-500">
            {t.appearance.marginHint}
          </p>
        </Group>

        {/* --------------------------------------------------------- */}
        <Group title={t.appearance.groupLanguage}>
          <Field
            label={t.appearance.headingLanguage}
            hint={t.appearance.headingLanguageHint}
          >
            <Select
              value={data.language}
              onChange={(e) =>
                update({ language: e.target.value as ResumeData["language"] })
              }
            >
              <option value="ID">Indonesia</option>
              <option value="EN">English</option>
            </Select>
          </Field>
        </Group>

        {/* Saran panjang CV. Ditempatkan di laci ini karena di sinilah
            pengguna mengubah ukuran huruf dan kertas - dua hal yang paling
            sering dipakai untuk memaksa CV muat, padahal yang seharusnya
            dipangkas adalah isinya. */}
        <p className="border-t border-ink-200 pt-4 text-[11px] leading-relaxed text-ink-500">
          {t.preview.onePageAdvice}
        </p>
      </div>
    </div>,
    document.body,
  );
}

/* -------------------------------------------------------------------------- */
/* Bagian kecil                                                               */
/* -------------------------------------------------------------------------- */

/** Sekelompok pengaturan yang menjawab satu pertanyaan yang sama. */
function Group({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h3 className="text-[11px] font-bold tracking-wider text-ink-400 uppercase">
        {title}
      </h3>
      {children}
    </section>
  );
}

/**
 * Penggeser beserta nilainya yang tertulis di sebelah kanan label.
 *
 * Nilainya sengaja tidak disambung ke dalam label seperti sebelumnya
 * ("Ukuran Huruf: 10pt"): label yang panjangnya berubah-ubah ikut menggeser
 * apa pun di sebelahnya setiap kali penggesernya ditarik.
 */
function Slider({
  label,
  value,
  min,
  max,
  step,
  current,
  onChange,
}: {
  label: string;
  value: string;
  min: number;
  max: number;
  step: number;
  current: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-xs font-semibold tracking-wide text-ink-700">
          {label}
        </span>
        <span className="shrink-0 text-[11px] tabular-nums text-ink-500">
          {value}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={current}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-ink-900"
        aria-label={label}
      />
    </div>
  );
}

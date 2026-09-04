"use client";

import * as React from "react";
import { Maximize2, Minus, Plus, RotateCcw } from "lucide-react";
import { useI18n } from "@/components/i18n";
import { photoTransform } from "@/components/preview/ResumeDocument";
import { PHOTO_ZOOM_MAX, PHOTO_ZOOM_MIN } from "@/lib/resume/photo";

/**
 * Penyunting potongan pas foto: perbesar, geser, dan kembalikan.
 *
 * ## Bingkainya tetap, gambarnya yang bergerak
 *
 * Bingkai di sini berperbandingan 3:4 - sama dengan pas foto yang tercetak -
 * dan tidak pernah berubah ukuran oleh bentuk foto yang dimasukkan. Itulah
 * yang membuat tata letak CV tidak dapat dirusak oleh sebuah foto: apa pun
 * yang diunggah, yang disediakan halaman tetap kotak yang sama.
 *
 * ## Kenapa yang disimpan angka, bukan gambar hasil potongan
 *
 * Memotong gambar lalu menyimpan hasilnya terasa lebih sederhana, dan itu
 * jebakannya: penyuntingan berikutnya bekerja di atas gambar yang sudah
 * kehilangan piksel. Seseorang yang memperbesar, menyimpan, lalu keesokan
 * harinya ingin memperkecil lagi tidak akan pernah memperoleh kembali bagian
 * yang terpotong - dan mutunya menurun bertingkat setiap kali disentuh.
 *
 * Dengan menyimpan perbesaran dan geserannya saja, gambar sumbernya tetap
 * utuh selamanya dan potongannya dihitung ulang setiap kali dipakai. Itu juga
 * yang membuat janji "tidak pecah saat diperbesar" dapat ditepati: yang
 * diperbesar selalu gambar aslinya, bukan hasil potongan sebelumnya.
 *
 * ## Menggeser
 *
 * Diseret dengan jari atau tetikus, bukan lewat dua penggeser terpisah. Arah
 * mendatar dan tegak pada sebuah foto bukan dua pengaturan yang dipikirkan
 * terpisah - yang dicari orang adalah satu tempat, dan tangan tahu ke mana
 * memindahkannya jauh sebelum kepala menghitung berapa persen.
 */
export function PhotoFrame({
  src,
  zoom,
  offsetX,
  offsetY,
  onChange,
}: {
  src: string;
  zoom: number;
  offsetX: number;
  offsetY: number;
  onChange: (next: {
    photoZoom: number;
    photoOffsetX: number;
    photoOffsetY: number;
  }) => void;
}) {
  const { t } = useI18n();
  const bingkaiRef = React.useRef<HTMLDivElement>(null);

  /*
    Nilai yang sedang diseret disimpan di ref, bukan di state.

    Seretan mengirim puluhan peristiwa per detik; menyimpannya sebagai state
    berarti merender ulang seluruh formulir sesering itu. Yang ditulis selama
    jari bergerak hanyalah transform pada elemen gambarnya, dan `onChange`
    baru dipanggil sekali saat jari diangkat - sehingga penyimpan otomatis
    juga hanya berjalan sekali, bukan puluhan kali.
  */
  const seret = React.useRef<{
    aktif: boolean;
    mulaiX: number;
    mulaiY: number;
    awalX: number;
    awalY: number;
    kiniX: number;
    kiniY: number;
  }>({
    aktif: false,
    mulaiX: 0,
    mulaiY: 0,
    awalX: 0,
    awalY: 0,
    kiniX: offsetX,
    kiniY: offsetY,
  });

  const gambarRef = React.useRef<HTMLImageElement>(null);

  const gambarUlang = React.useCallback(
    (x: number, y: number, z: number) => {
      const el = gambarRef.current;
      if (!el) return;
      el.style.transform = photoTransform({
        photoZoom: z,
        photoOffsetX: x,
        photoOffsetY: y,
      });
    },
    [],
  );

  /*
    Batas geseran mengikuti perbesarannya.

    Pada perbesaran 1, tidak ada bagian gambar yang tersembunyi di luar
    bingkai - menggesernya hanya akan memunculkan celah kosong. Setiap
    penambahan perbesaran menyediakan ruang gerak sebesar selisihnya, dan
    itulah yang dihitung di sini. Tanpa batas ini, foto dapat diseret keluar
    bingkai sepenuhnya dan yang tercetak menjadi kotak putih.
  */
  const batas = React.useCallback((z: number) => Math.max(0, (z - 1) * 50), []);

  const jepit = React.useCallback(
    (nilai: number, z: number) => {
      const b = batas(z);
      return Math.min(b, Math.max(-b, nilai));
    },
    [batas],
  );

  function mulaiSeret(event: React.PointerEvent<HTMLDivElement>) {
    if (zoom <= PHOTO_ZOOM_MIN) return;
    const s = seret.current;
    s.aktif = true;
    s.mulaiX = event.clientX;
    s.mulaiY = event.clientY;
    s.awalX = s.kiniX;
    s.awalY = s.kiniY;
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function selamaSeret(event: React.PointerEvent<HTMLDivElement>) {
    const s = seret.current;
    if (!s.aktif) return;
    const kotak = bingkaiRef.current?.getBoundingClientRect();
    if (!kotak) return;

    /*
      Piksel yang ditempuh jari diubah menjadi persen terhadap **bingkainya**,
      lalu dibagi perbesarannya.

      Pembagian itu yang membuat seretan terasa mengikuti jari pada setiap
      tingkat perbesaran. Transform menerapkan `scale` sesudah `translate`,
      jadi satu persen geseran menempuh jarak layar sebesar perbesarannya -
      tanpa dibagi, foto akan meluncur tiga kali lebih cepat daripada jari
      pada perbesaran tiga.
    */
    const dx = ((event.clientX - s.mulaiX) / kotak.width) * 100;
    const dy = ((event.clientY - s.mulaiY) / kotak.height) * 100;

    s.kiniX = jepit(s.awalX + dx / zoom, zoom);
    s.kiniY = jepit(s.awalY + dy / zoom, zoom);
    gambarUlang(s.kiniX, s.kiniY, zoom);
  }

  function selesaiSeret(event: React.PointerEvent<HTMLDivElement>) {
    const s = seret.current;
    if (!s.aktif) return;
    s.aktif = false;
    event.currentTarget.releasePointerCapture?.(event.pointerId);
    onChange({
      photoZoom: zoom,
      photoOffsetX: round(s.kiniX),
      photoOffsetY: round(s.kiniY),
    });
  }

  function setZoom(next: number) {
    const z = Math.min(PHOTO_ZOOM_MAX, Math.max(PHOTO_ZOOM_MIN, next));
    // Geserannya ikut dijepit ulang: memperkecil menyempitkan ruang gerak,
    // dan geseran lama yang melebihi ruang baru akan menyisakan celah kosong
    // di tepi bingkai.
    const x = jepit(seret.current.kiniX, z);
    const y = jepit(seret.current.kiniY, z);
    seret.current.kiniX = x;
    seret.current.kiniY = y;
    onChange({ photoZoom: round(z), photoOffsetX: round(x), photoOffsetY: round(y) });
  }

  // Nilai dari luar - misalnya setelah foto diganti - harus mengembalikan ref
  // ke keadaan yang sama, kalau tidak seretan berikutnya berangkat dari angka
  // yang sudah tidak berlaku.
  React.useEffect(() => {
    seret.current.kiniX = offsetX;
    seret.current.kiniY = offsetY;
    gambarUlang(offsetX, offsetY, zoom);
  }, [offsetX, offsetY, zoom, gambarUlang]);

  const dapatDigeser = zoom > PHOTO_ZOOM_MIN;

  return (
    <div className="space-y-2">
      <div
        ref={bingkaiRef}
        onPointerDown={mulaiSeret}
        onPointerMove={selamaSeret}
        onPointerUp={selesaiSeret}
        onPointerCancel={selesaiSeret}
        className="relative overflow-hidden rounded-lg border border-ink-300 bg-white select-none"
        style={{
          width: "6rem",
          // 3:4, sama dengan pas foto yang tercetak.
          aspectRatio: "3 / 4",
          cursor: dapatDigeser ? "grab" : "default",
          // Seretan tegak di dalam bingkai tidak boleh ikut menggulir halaman.
          touchAction: dapatDigeser ? "none" : undefined,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={gambarRef}
          src={src}
          alt=""
          draggable={false}
          className="h-full w-full object-cover"
          style={{
            transform: photoTransform({
              photoZoom: zoom,
              photoOffsetX: offsetX,
              photoOffsetY: offsetY,
            }),
            transformOrigin: "center",
          }}
        />
      </div>

      <div className="flex items-center gap-1">
        <IkonTombol
          label={t.form.photoZoomOut}
          onClick={() => setZoom(zoom - 0.25)}
          disabled={zoom <= PHOTO_ZOOM_MIN}
        >
          <Minus size={14} />
        </IkonTombol>

        <input
          type="range"
          min={PHOTO_ZOOM_MIN}
          max={PHOTO_ZOOM_MAX}
          step={0.05}
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
          aria-label={t.form.photoZoom}
          className="h-1 w-24 accent-ink-900"
        />

        <IkonTombol
          label={t.form.photoZoomIn}
          onClick={() => setZoom(zoom + 0.25)}
          disabled={zoom >= PHOTO_ZOOM_MAX}
        >
          <Plus size={14} />
        </IkonTombol>

        <IkonTombol
          label={t.form.photoReset}
          onClick={() =>
            onChange({ photoZoom: 1, photoOffsetX: 0, photoOffsetY: 0 })
          }
          disabled={zoom === 1 && offsetX === 0 && offsetY === 0}
        >
          <RotateCcw size={13} />
        </IkonTombol>
      </div>

      <p className="flex items-start gap-1.5 text-[11px] leading-relaxed text-ink-500">
        <Maximize2 size={12} className="mt-0.5 shrink-0" aria-hidden />
        {dapatDigeser ? t.form.photoDragHint : t.form.photoZoomHint}
      </p>
    </div>
  );
}

/** Dibulatkan dua angka di belakang koma - lebih dari itu hanya menambah byte. */
function round(value: number): number {
  return Math.round(value * 100) / 100;
}

function IkonTombol({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      className="tap-target grid h-7 w-7 shrink-0 place-items-center rounded-md border border-ink-300 text-ink-700 transition-colors hover:bg-ink-100 disabled:opacity-40"
    >
      {children}
    </button>
  );
}

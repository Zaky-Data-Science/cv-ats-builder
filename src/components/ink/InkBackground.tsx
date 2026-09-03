"use client";

import * as React from "react";

/**
 * ============================================================================
 *  JARING PARTIKEL
 * ============================================================================
 *
 * Titik-titik yang hanyut perlahan, dan garis tipis yang muncul di antara
 * titik-titik yang berdekatan. Jaring itulah yang membedakannya dari sekadar
 * bintang bertaburan - dan itu yang paling khas dari rupa yang dituju.
 *
 * ---------------------------------------------------------------------------
 * Empat hal yang menahan biayanya
 * ---------------------------------------------------------------------------
 *
 * Jumlah pasangan titik tumbuh kuadratik: 40 titik berarti 780 perbandingan
 * jarak setiap bingkai. Itu masih murah, tetapi 120 titik berarti 7.140 - dan
 * di situlah ponsel kelas menengah mulai tersendat. Karena itu:
 *
 *  1. **Jumlah titik mengikuti luas layar, dengan batas atas 40.** Pada 360
 *     x 640 hasilnya 16; pada 1920 x 1080 hasilnya 40.
 *  2. **Perbandingan jarak memakai kuadrat**, bukan akar. `Math.hypot` di
 *     dalam gelung terdalam adalah biaya yang tidak perlu dibayar - yang
 *     dibandingkan hanya "lebih dekat atau tidak".
 *  3. **Penggambaran berhenti saat tab tidak terlihat.** Menggambar untuk
 *     layar yang tidak dilihat siapa pun adalah baterai yang terbuang.
 *  4. **Kerapatan piksel dibatasi 2.** Layar 3x menuntut sembilan kali luas
 *     gambar demi perbedaan yang tidak terlihat pada garis sepucat ini.
 *
 * Tidak dipasang sama sekali bila pengguna meminta pengurangan gerak.
 */

/** Satu titik: hanyut lambat, dan berdenyut pucat agar tidak seragam. */
interface Titik {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  fase: number;
  alpha: number;
}

const DPR_MAKS = 2;

/** Jarak maksimal dua titik masih dihubungkan garis, dalam piksel CSS. */
const JANGKAUAN = 132;

export function InkBackground() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let lebar = 0;
    let tinggi = 0;
    let titik: Titik[] = [];
    let frame = 0;
    let sebelumnya = performance.now();
    let berjalan = true;

    /** Warna tinta dibaca dari CSS, bukan ditebak dari tema. */
    const bacaTinta = () =>
      getComputedStyle(document.documentElement)
        .getPropertyValue("--ink")
        .trim() || "10 10 11";

    let tinta = bacaTinta();

    const acak = (min: number, max: number) => min + Math.random() * (max - min);

    const susun = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, DPR_MAKS);
      // Kanvas mengisi induknya, bukan layar - jaringnya milik hero, dan
      // membiarkannya menutupi seluruh halaman akan menaruh garis-garis di
      // belakang teks yang justru harus dibaca.
      const kotak = canvas.parentElement?.getBoundingClientRect();
      lebar = Math.max(1, Math.round(kotak?.width ?? window.innerWidth));
      tinggi = Math.max(1, Math.round(kotak?.height ?? window.innerHeight));

      canvas.width = Math.round(lebar * dpr);
      canvas.height = Math.round(tinggi * dpr);
      canvas.style.width = `${lebar}px`;
      canvas.style.height = `${tinggi}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const jumlah = Math.round(
        Math.min(40, Math.max(16, (lebar * tinggi) / 17000)),
      );

      titik = Array.from({ length: jumlah }, () => ({
        x: acak(0, lebar),
        y: acak(0, tinggi),
        r: acak(0.9, 2.2),
        vx: acak(-0.009, 0.009),
        vy: acak(-0.011, -0.003),
        fase: acak(0, Math.PI * 2),
        alpha: acak(0.24, 0.62),
      }));
    };

    const gambar = (sekarang: number) => {
      if (!berjalan) return;

      // Selisih waktu dibatasi: tab yang kembali dari latar belakang
      // menghasilkan lompatan ratusan milidetik, dan seluruh titik akan
      // melompat sekaligus alih-alih melanjutkan hanyutnya.
      const delta = Math.min(sekarang - sebelumnya, 48);
      sebelumnya = sekarang;

      ctx.clearRect(0, 0, lebar, tinggi);

      /* ---------------------------------------------------------------- */
      /* Garis penghubung - digambar lebih dulu supaya titik di atasnya    */
      /* ---------------------------------------------------------------- */

      const jangkauanKuadrat = JANGKAUAN * JANGKAUAN;
      ctx.lineWidth = 0.7;

      for (let i = 0; i < titik.length; i += 1) {
        for (let j = i + 1; j < titik.length; j += 1) {
          const dx = titik[i].x - titik[j].x;
          const dy = titik[i].y - titik[j].y;
          const kuadrat = dx * dx + dy * dy;
          if (kuadrat > jangkauanKuadrat) continue;

          // Garis memudar seiring jarak, sehingga jaringnya terlihat
          // tersambung dan terurai sendiri - bukan menyala dan mati.
          const dekat = 1 - kuadrat / jangkauanKuadrat;
          ctx.strokeStyle = `rgb(${tinta} / ${dekat * 0.2})`;
          ctx.beginPath();
          ctx.moveTo(titik[i].x, titik[i].y);
          ctx.lineTo(titik[j].x, titik[j].y);
          ctx.stroke();
        }
      }

      /* ---------------------------------------------------------------- */
      /* Titik                                                            */
      /* ---------------------------------------------------------------- */

      for (const p of titik) {
        p.x += p.vx * delta;
        p.y += p.vy * delta;
        p.fase += 0.0007 * delta;

        // Membungkus ke sisi seberang, bukan memantul. Pantulan membuat titik
        // berkumpul di tepi, dan kumpulan itu lama-lama terlihat sebagai pola.
        if (p.y < -10) {
          p.y = tinggi + 10;
          p.x = acak(0, lebar);
        }
        if (p.x < -10) p.x = lebar + 10;
        if (p.x > lebar + 10) p.x = -10;

        const denyut = 0.72 + 0.28 * Math.sin(p.fase);
        ctx.fillStyle = `rgb(${tinta} / ${p.alpha * denyut})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      frame = requestAnimationFrame(gambar);
    };

    const mulai = () => {
      if (berjalan) return;
      berjalan = true;
      sebelumnya = performance.now();
      frame = requestAnimationFrame(gambar);
    };

    const berhenti = () => {
      berjalan = false;
      cancelAnimationFrame(frame);
    };

    const onVisibility = () => {
      if (document.hidden) berhenti();
      else mulai();
    };

    // Tema berganti tanpa halaman dimuat ulang, jadi warnanya perlu dibaca
    // ulang. Yang diamati atribut data-theme pada <html> - satu-satunya
    // tempat tema dituliskan.
    const pengamatTema = new MutationObserver(() => {
      tinta = bacaTinta();
    });
    pengamatTema.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    // Ukuran induk berubah bukan hanya saat jendela diubah - teks yang
    // membungkus ulang di antara breakpoint mengubah tinggi hero tanpa satu
    // pun peristiwa resize.
    const pengamatUkuran = new ResizeObserver(() => susun());
    if (canvas.parentElement) pengamatUkuran.observe(canvas.parentElement);

    susun();
    canvas.dataset.siap = "true";
    frame = requestAnimationFrame(gambar);

    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      berhenti();
      pengamatTema.disconnect();
      pengamatUkuran.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} className="ink-latar" aria-hidden />;
}

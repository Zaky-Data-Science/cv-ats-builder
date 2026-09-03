"use client";

import * as React from "react";

/**
 * Latar berpartikel tinta yang nyaris tidak terlihat.
 *
 * Yang dituju: halaman terlihat diam pada pandangan pertama, dan gerakannya
 * baru disadari ketika diperhatikan. Karena itu partikelnya sedikit, kecil,
 * pucat, dan lambat - bukan karena keterbatasan, melainkan karena latar yang
 * meminta perhatian akan bersaing dengan isi halaman yang justru harus dibaca.
 *
 * Dipakai Canvas, bukan puluhan elemen DOM. Alasannya bukan selera: setiap
 * partikel sebagai elemen berarti puluhan elemen berposisi mutlak yang harus
 * ikut dihitung ulang tata letaknya setiap kali halaman berubah, dan halaman
 * ini sudah punya cukup banyak elemen. Satu kanvas hanya satu elemen.
 *
 * Empat hal yang dijaga:
 *
 * 1. **Berhenti saat tab tidak terlihat.** Menggambar untuk layar yang tidak
 *    dilihat siapa pun adalah baterai yang terbuang percuma.
 * 2. **Jumlah partikel mengikuti luas layar, dengan batas atas.** Ponsel tidak
 *    menerima jumlah yang sama dengan monitor lebar.
 * 3. **Kerapatan piksel dibatasi 2.** Layar 3x akan menuntut sembilan kali
 *    luas gambar demi perbedaan yang tidak terlihat pada bentuk sepucat ini.
 * 4. **Tidak dipasang sama sekali** bila pengguna meminta pengurangan gerak.
 */

/** Satu partikel: titik yang hanyut perlahan dan berdenyut pucat. */
interface Partikel {
  x: number;
  y: number;
  r: number;
  /** Kecepatan per milidetik. */
  vx: number;
  vy: number;
  /** Fase denyut, supaya tidak seluruhnya berkedip bersamaan. */
  fase: number;
  alpha: number;
}

/** Satu aliran tinta: elips sangat kabur yang berputar teramat lambat. */
interface Aliran {
  x: number;
  y: number;
  rx: number;
  ry: number;
  sudut: number;
  putar: number;
  alpha: number;
}

const DPR_MAKS = 2;

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
    let partikel: Partikel[] = [];
    let aliran: Aliran[] = [];
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
      lebar = window.innerWidth;
      tinggi = window.innerHeight;

      canvas.width = Math.round(lebar * dpr);
      canvas.height = Math.round(tinggi * dpr);
      canvas.style.width = `${lebar}px`;
      canvas.style.height = `${tinggi}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Satu partikel per 26.000 piksel persegi, ditahan antara 14 dan 46.
      // Pada 360x800 hasilnya 14; pada 1920x1080 hasilnya 46.
      const jumlah = Math.round(
        Math.min(46, Math.max(14, (lebar * tinggi) / 26000)),
      );

      partikel = Array.from({ length: jumlah }, () => ({
        x: acak(0, lebar),
        y: acak(0, tinggi),
        r: acak(0.6, 1.9),
        vx: acak(-0.004, 0.004),
        vy: acak(-0.007, -0.002),
        fase: acak(0, Math.PI * 2),
        alpha: acak(0.05, 0.16),
      }));

      // Aliran tinta: tiga saja, dan hanya pada layar yang cukup lebar.
      // Di ponsel ruang kosongnya memang tidak ada - seluruh layarnya isi.
      aliran =
        lebar < 768
          ? []
          : Array.from({ length: 3 }, () => ({
              x: acak(0.08, 0.92) * lebar,
              y: acak(0.15, 0.85) * tinggi,
              rx: acak(140, 300),
              ry: acak(60, 150),
              sudut: acak(0, Math.PI),
              putar: acak(-0.000012, 0.000012),
              alpha: acak(0.014, 0.03),
            }));
    };

    const gambar = (sekarang: number) => {
      if (!berjalan) return;

      // Selisih waktu dibatasi: tab yang kembali dari latar belakang akan
      // menghasilkan lompatan ratusan milidetik, dan seluruh partikel akan
      // melompat sekaligus alih-alih melanjutkan hanyutnya.
      const delta = Math.min(sekarang - sebelumnya, 48);
      sebelumnya = sekarang;

      ctx.clearRect(0, 0, lebar, tinggi);

      for (const a of aliran) {
        a.sudut += a.putar * delta;
        ctx.save();
        ctx.translate(a.x, a.y);
        ctx.rotate(a.sudut);
        const gradien = ctx.createRadialGradient(0, 0, 0, 0, 0, a.rx);
        gradien.addColorStop(0, `rgb(${tinta} / ${a.alpha})`);
        gradien.addColorStop(0.55, `rgb(${tinta} / ${a.alpha * 0.4})`);
        gradien.addColorStop(1, `rgb(${tinta} / 0)`);
        ctx.fillStyle = gradien;
        ctx.beginPath();
        ctx.ellipse(0, 0, a.rx, a.ry, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      for (const p of partikel) {
        p.x += p.vx * delta;
        p.y += p.vy * delta;
        p.fase += 0.0006 * delta;

        // Membungkus ke sisi seberang, bukan memantul. Pantulan membuat
        // partikel berkumpul di tepi dan pola itu lama-lama terlihat.
        if (p.y < -8) {
          p.y = tinggi + 8;
          p.x = acak(0, lebar);
        }
        if (p.x < -8) p.x = lebar + 8;
        if (p.x > lebar + 8) p.x = -8;

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

    const onResize = () => {
      susun();
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

    susun();
    canvas.dataset.siap = "true";
    frame = requestAnimationFrame(gambar);

    window.addEventListener("resize", onResize, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      berhenti();
      pengamatTema.disconnect();
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} className="ink-latar" aria-hidden />;
}

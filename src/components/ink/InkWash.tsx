"use client";

import * as React from "react";

/**
 * ============================================================================
 *  SAPUAN TINTA (SUMI-E)
 * ============================================================================
 *
 * Aliran tinta yang menjadi latar hero: bentuk organik berpinggiran lembut
 * dengan sulur meruncing, seperti tinta yang meresap di atas kertas.
 *
 * ---------------------------------------------------------------------------
 * Dua cara yang sudah dicoba dan gagal - keduanya karena biaya
 * ---------------------------------------------------------------------------
 *
 * Riwayat ini ditulis karena keduanya terlihat benar di kode, dan keduanya
 * baru terbukti salah setelah biayanya diukur.
 *
 * **1. Penyaring SVG (`feTurbulence` + `feDisplacementMap`).** Bentuknya
 * paling menyerupai tinta sungguhan. Percobaan pertama memasang penyaring dan
 * animasi `transform` pada elemen yang sama: penyaringnya dihitung ulang
 * setiap bingkai atas area seluas panel, dan 100 bingkai tidak selesai dalam
 * 45 detik. Animasinya dihapus dan SVG-nya dipecah menjadi empat gumpalan
 * kecil - masih tidak selesai, sebab kanvas partikel yang beranimasi **di
 * atasnya** memicu penggambaran ulang daerah yang sama, dan setiap
 * penggambaran ulang menjalankan penyaringnya lagi.
 *
 * Pelajarannya: penyaring SVG bukan sesuatu yang "dihitung sekali lalu
 * disimpan". Ia dihitung ulang setiap kali daerahnya digambar ulang, dan apa
 * pun yang beranimasi di atasnya menjamin itu terjadi terus.
 *
 * **2. Kanvas dengan `ctx.filter = "blur(...)"`.** Peredamnya berlaku **per
 * gambar**, bukan sekali untuk seluruh kanvas. Tujuh puluh cakram berarti
 * tujuh puluh peredaman atas permukaan besar; lima belas bingkai tidak
 * selesai dalam 45 detik.
 *
 * ---------------------------------------------------------------------------
 * Yang dipakai sekarang
 * ---------------------------------------------------------------------------
 *
 * Digambar pada sepertiga ukuran, lalu diperbesar satu kali. Kelembutannya
 * datang dari pembesaran itu - dan itu justru tepat: bentuk sepucat ini tidak
 * punya rincian yang bisa hilang. Biayanya satu `drawImage`.
 *
 * Angka pembaginya hasil setelan langsung di peramban, bukan pilihan di atas
 * kertas: seperenam membuat sapuannya berubah menjadi gumpalan susu tanpa
 * arah, sedangkan sepertiga masih menyisakan sulur yang membuatnya terbaca
 * sebagai tinta.
 *
 * Digambar sekali. Hasilnya bitmap; penggambaran ulang berikutnya hanya
 * menyalin bitmap, biaya yang sama dengan gambar biasa. Geraknya diserahkan
 * kepada jaring partikel, yang memang murah.
 *
 * Warnanya dari `--ink`, jadi satu jalur kode melayani kedua tema dan tidak
 * ada satu pun berkas gambar yang perlu diunduh.
 */

/** Satu aliran tinta: tulang lengkung beserta ukuran dan kepekatannya. */
interface Aliran {
  /** Titik awal, kendali, dan akhir tulangnya, dalam pecahan 0-1. */
  x0: number;
  y0: number;
  xk: number;
  yk: number;
  x1: number;
  y1: number;
  /** Jari-jari terbesar, sebagai pecahan sisi terpendek panel. */
  tebal: number;
  alpha: number;
  /** Hanya digambar mulai layar sedang. */
  lebarSaja?: boolean;
}

/*
  Susunannya mengikuti ruang kosong hero: gumpalan besar di tepi kiri sebagai
  jangkar, sulur yang menjalar ke tengah bawah, dan dua aksen di sisi kanan
  yang hanya muncul bila layarnya memang lebar - di ponsel sisi kanan itu
  ditempati pratinjau CV.
*/
const ALIRAN: Aliran[] = [
  { x0: -0.1, y0: 0.95, xk: 0.05, yk: 0.5, x1: 0.22, y1: 0.02, tebal: 0.14, alpha: 0.2 },
  { x0: -0.08, y0: 0.3, xk: 0.14, yk: 0.6, x1: 0.36, y1: 0.98, tebal: 0.1, alpha: 0.14 },
  { x0: 0.26, y0: 1.04, xk: 0.1, yk: 0.8, x1: -0.06, y1: 0.58, tebal: 0.075, alpha: 0.11 },
  { x0: 1.06, y0: -0.06, xk: 0.84, yk: 0.14, x1: 0.62, y1: 0, tebal: 0.085, alpha: 0.09, lebarSaja: true },
  { x0: 1.08, y0: 0.74, xk: 0.88, yk: 1, x1: 0.66, y1: 1.06, tebal: 0.08, alpha: 0.08, lebarSaja: true },
];

const DPR_MAKS = 2;

/** Pembagi ukuran gambar kerja terhadap ukuran tampil. */
const SUSUT = 3;

export function InkWash() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bacaTinta = () =>
      getComputedStyle(document.documentElement)
        .getPropertyValue("--ink")
        .trim() || "10 10 11";

    /**
     * Cakram berpinggiran bergelombang.
     *
     * Tiga harmonik dengan cacah dan fase berbeda. Satu harmonik saja
     * menghasilkan bentuk telur; tiga sudah cukup tidak beraturan untuk
     * terbaca sebagai tetesan tinta, dan masih cukup halus untuk tidak
     * terlihat seperti bintang.
     */
    const cakram = (
      c: CanvasRenderingContext2D,
      x: number,
      y: number,
      r: number,
      benih: number,
      alpha: number,
      tinta: string,
    ) => {
      const gradien = c.createRadialGradient(x, y, 0, x, y, r);
      gradien.addColorStop(0, `rgb(${tinta} / ${alpha})`);
      gradien.addColorStop(0.5, `rgb(${tinta} / ${alpha * 0.5})`);
      gradien.addColorStop(1, `rgb(${tinta} / 0)`);
      c.fillStyle = gradien;

      c.beginPath();
      const langkah = 28;
      for (let i = 0; i <= langkah; i += 1) {
        const sudut = (i / langkah) * Math.PI * 2;
        const goyang =
          1 +
          0.26 * Math.sin(sudut * 3 + benih) +
          0.16 * Math.sin(sudut * 5 - benih * 1.7) +
          0.1 * Math.sin(sudut * 8 + benih * 0.6);
        const rr = r * goyang;
        const px = x + Math.cos(sudut) * rr;
        const py = y + Math.sin(sudut) * rr;
        if (i === 0) c.moveTo(px, py);
        else c.lineTo(px, py);
      }
      c.closePath();
      c.fill();
    };

    const gambar = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, DPR_MAKS);
      const kotak = canvas.parentElement?.getBoundingClientRect();
      const lebar = Math.max(1, Math.round(kotak?.width ?? 0));
      const tinggi = Math.max(1, Math.round(kotak?.height ?? 0));
      if (lebar < 2 || tinggi < 2) return;

      canvas.width = Math.round(lebar * dpr);
      canvas.height = Math.round(tinggi * dpr);
      canvas.style.width = `${lebar}px`;
      canvas.style.height = `${tinggi}px`;

      const kecilL = Math.max(2, Math.ceil(lebar / SUSUT));
      const kecilT = Math.max(2, Math.ceil(tinggi / SUSUT));
      const kecil = document.createElement("canvas");
      kecil.width = kecilL;
      kecil.height = kecilT;
      const kctx = kecil.getContext("2d");
      if (!kctx) return;

      const tinta = bacaTinta();
      const sisiPendek = Math.min(kecilL, kecilT);
      const lebarLayar = window.innerWidth >= 768;

      /** Titik pada tulang lengkung, dalam pecahan 0-1. */
      const tulang = (a: Aliran, t: number): [number, number] => {
        const m = 1 - t;
        return [
          m * m * a.x0 + 2 * m * t * a.xk + t * t * a.x1,
          m * m * a.y0 + 2 * m * t * a.yk + t * t * a.y1,
        ];
      };

      /*
        Lapis pertama: kabut. Cakram ditumpuk sepanjang tulangnya, meruncing
        di kedua ujung - sapuan kuas menebal setelah menyentuh kertas, bukan
        di tengah.
      */
      for (const [n, a] of ALIRAN.entries()) {
        if (a.lebarSaja && !lebarLayar) continue;

        const cacah = 24;
        for (let i = 0; i <= cacah; i += 1) {
          const t = i / cacah;
          const [fx, fy] = tulang(a, t);
          const runcing = Math.sin(Math.PI * Math.pow(t, 0.75));
          const r = a.tebal * sisiPendek * (0.22 + 0.78 * runcing);
          if (r < 0.8) continue;

          cakram(
            kctx,
            fx * kecilL,
            fy * kecilT,
            r,
            n * 2.3 + i * 0.7,
            a.alpha * (0.26 + 0.74 * runcing) * 0.8,
            tinta,
          );
        }
      }

      /*
        Lapis kedua: sulur tipis pekat.

        Inilah yang membuatnya terbaca sebagai sapuan kuas alih-alih kabut.
        Tanpa lapis ini, yang tersisa hanya gumpalan lembut tanpa arah - dan
        arah itulah yang membedakan tinta yang mengalir dari bayangan.
      */
      kctx.lineCap = "round";
      for (const [n, a] of ALIRAN.entries()) {
        if (a.lebarSaja && !lebarLayar) continue;

        for (let s = 0; s < 3; s += 1) {
          const geser = (s - 1) * a.tebal * sisiPendek * 0.5;
          kctx.beginPath();
          for (let i = 0; i <= 40; i += 1) {
            const t = i / 40;
            const [fx, fy] = tulang(a, t);
            const runcing = Math.sin(Math.PI * Math.pow(t, 0.75));
            const goyang =
              Math.sin(t * 11 + n * 3 + s * 2.1) * a.tebal * sisiPendek * 0.22;
            const px = fx * kecilL + (geser + goyang) * runcing;
            const py = fy * kecilT + goyang * 0.4 * runcing;
            if (i === 0) kctx.moveTo(px, py);
            else kctx.lineTo(px, py);
          }
          kctx.lineWidth = Math.max(0.6, a.tebal * sisiPendek * 0.16);
          kctx.strokeStyle = `rgb(${tinta} / ${a.alpha * 0.85})`;
          kctx.stroke();
        }
      }

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(kecil, 0, 0, canvas.width, canvas.height);

      canvas.dataset.siap = "true";
    };

    gambar();

    /*
      Penggambaran ulang ditunda satu bingkai dan digabung.

      ResizeObserver dapat berbunyi beberapa kali dalam satu perubahan tata
      letak - teks yang membungkus ulang, gambar yang selesai dimuat, bilah
      gulir yang muncul. Tanpa penggabungan, satu perubahan ukuran berarti
      beberapa kali menggambar seluruh sapuan.
    */
    let tertunda = 0;
    const jadwalkan = () => {
      if (tertunda) return;
      tertunda = requestAnimationFrame(() => {
        tertunda = 0;
        gambar();
      });
    };

    const pengamatUkuran = new ResizeObserver(jadwalkan);
    if (canvas.parentElement) pengamatUkuran.observe(canvas.parentElement);

    const pengamatTema = new MutationObserver(jadwalkan);
    pengamatTema.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => {
      if (tertunda) cancelAnimationFrame(tertunda);
      pengamatUkuran.disconnect();
      pengamatTema.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="ink-wash" aria-hidden />;
}

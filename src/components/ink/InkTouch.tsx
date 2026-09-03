"use client";

import * as React from "react";

/**
 * Umpan balik tinta: ketukan, sapuan, dan tekanan lama.
 *
 * Menggantikan percikan cahaya yang dulu ada di CursorGlow. Bentuknya
 * mengikuti pola yang sudah terbukti di komponen itu, dan pola itu memang
 * yang menentukan kodenya:
 *
 * 1. **Tidak ada state React sama sekali.** Sentuhan datang puluhan kali per
 *    detik; menyimpannya sebagai state berarti merender ulang pohon komponen
 *    sesering itu. Yang dilakukan hanyalah memasang satu elemen yang membuang
 *    dirinya sendiri saat animasinya usai.
 * 2. **Dua pembatas sekaligus - jarak dan waktu.** Tanpa keduanya, satu
 *    sapuan panjang melahirkan ratusan elemen dan justru membuat geraknya
 *    tersendat; kebalikan dari tujuannya.
 * 3. **Batas jumlah yang hidup bersamaan.** Pembatas di atas menjaga laju
 *    kelahiran, bukan jumlah yang menumpuk. Pada perangkat lambat animasinya
 *    selesai lebih lama daripada laju kelahirannya, dan tanpa batas ini
 *    jumlahnya tetap dapat merayap naik.
 *
 * Bercaknya tidak pernah menghalangi apa pun: `pointer-events: none`, dan
 * dipasang di <body> sehingga tidak pernah ikut menghitung tata letak.
 */

/** Jeda dan jarak minimal antar-titik jejak sapuan. */
const JEDA_JEJAK_MS = 42;
const JARAK_JEJAK_PX = 16;

/** Berapa lama tekanan dianggap "lama". */
const TEKAN_LAMA_MS = 420;

/** Paling banyak bercak yang boleh hidup bersamaan. */
const MAKS_HIDUP = 18;

export function InkTouch() {
  React.useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // Bercak tetap boleh muncul, hanya jauh lebih singkat - lihat blok
      // prefers-reduced-motion di ink.css. Yang dimatikan di sini hanya
      // jejak sapuan, sebab jejak justru gerak yang berkelanjutan.
    }

    const kurangiGerak = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let hidup = 0;
    let jejakTerakhirPada = 0;
    let jejakX = 0;
    let jejakY = 0;
    let timerTekan = 0;
    let menyeret = false;

    /**
     * Memasang satu bercak tinta.
     *
     * Ukurannya diterima sebagai parameter, bukan ditentukan kelas, supaya
     * ketukan, jejak, dan tekanan lama memakai satu jalur kode yang sama -
     * yang membedakan hanya angkanya.
     */
    const bercak = (x: number, y: number, kelas: string, ukuranRem?: number) => {
      if (hidup >= MAKS_HIDUP) return;
      hidup += 1;

      const node = document.createElement("div");
      node.className = `ink-blot ${kelas}`.trim();
      node.setAttribute("aria-hidden", "true");
      node.style.setProperty("--ix", `${x}px`);
      node.style.setProperty("--iy", `${y}px`);
      if (ukuranRem) node.style.setProperty("--ink-size", `${ukuranRem}rem`);

      document.body.appendChild(node);
      node.addEventListener(
        "animationend",
        () => {
          node.remove();
          hidup -= 1;
        },
        { once: true },
      );
    };

    const batalkanTekan = () => {
      if (timerTekan) {
        clearTimeout(timerTekan);
        timerTekan = 0;
      }
    };

    const onDown = (event: PointerEvent) => {
      // Klik kanan dan tombol tengah tidak menghasilkan apa-apa: keduanya
      // membuka menu peramban, dan bercak yang muncul di baliknya hanya akan
      // terlihat seperti gangguan.
      if (event.button !== 0) return;

      jejakX = event.clientX;
      jejakY = event.clientY;
      jejakTerakhirPada = performance.now();
      menyeret = true;

      bercak(event.clientX, event.clientY, "");

      if (kurangiGerak) return;

      // Tekanan lama: bercak kedua yang lebih besar dan lebih lambat, tepat
      // di titik yang sama. Tidak menghalangi apa pun yang sedang ditekan -
      // elemennya tidak menangkap penunjuk sama sekali.
      const { clientX, clientY } = event;
      timerTekan = window.setTimeout(() => {
        bercak(clientX, clientY, "", 12);
        timerTekan = 0;
      }, TEKAN_LAMA_MS);
    };

    const onMove = (event: PointerEvent) => {
      if (!menyeret || kurangiGerak) return;

      const now = performance.now();
      const jarak = Math.hypot(event.clientX - jejakX, event.clientY - jejakY);
      if (now - jejakTerakhirPada < JEDA_JEJAK_MS || jarak < JARAK_JEJAK_PX) {
        return;
      }

      // Begitu jari bergerak, yang dimaksud bukan tekanan lama lagi.
      batalkanTekan();

      jejakTerakhirPada = now;
      jejakX = event.clientX;
      jejakY = event.clientY;
      bercak(event.clientX, event.clientY, "ink-trail");
    };

    const onUp = () => {
      menyeret = false;
      batalkanTekan();
    };

    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    window.addEventListener("pointercancel", onUp, { passive: true });
    window.addEventListener("blur", onUp);

    return () => {
      batalkanTekan();
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      window.removeEventListener("blur", onUp);
    };
  }, []);

  return null;
}

"use client";

import * as React from "react";

/**
 * Cahaya yang mengikuti kursor, dan percikan cahaya di setiap sapuan jari.
 *
 * Tiga hal yang menentukan bentuk kode ini:
 *
 * 1. **Tidak ada state React sama sekali.** Posisi kursor berubah puluhan
 *    kali per detik; menyimpannya sebagai state berarti merender ulang
 *    seluruh pohon komponen sesering itu. Yang dilakukan di sini hanyalah
 *    menulis custom property langsung ke elemen DOM-nya.
 * 2. **Satu tulisan per bingkai.** Event pointermove bisa datang lebih
 *    rapat daripada kemampuan layar menggambar. Nilai terakhir disimpan di
 *    ref, lalu ditulis sekali di dalam requestAnimationFrame.
 * 3. **Hanya transform dan opacity yang dianimasikan**, sehingga seluruh
 *    kerjanya jatuh ke compositor GPU dan tidak memicu perhitungan tata
 *    letak ulang - syarat agar tetap mulus di ponsel kelas menengah, yang
 *    justru mayoritas penggunanya.
 *
 * Yang tampak hanya satu lapisan cahaya. Titik inti kecil yang dulu ada di
 * ujung kursor sudah dihapus: ia bersaing dengan kursor peramban itu sendiri
 * dan justru mengganggu, bukan membantu.
 *
 * Pengguna yang meminta pengurangan gerak tidak akan melihat apa pun: efek
 * ini disembunyikan lewat CSS sekaligus tidak dipasang listener-nya.
 */
export function CursorGlow() {
  const glowRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) return;

    const glow = glowRef.current;
    if (!glow) return;

    let frame = 0;
    let pointerX = 0;
    let pointerY = 0;
    let queued = false;

    const draw = () => {
      queued = false;
      glow.style.setProperty("--gx", `${pointerX}px`);
      glow.style.setProperty("--gy", `${pointerY}px`);
    };

    const schedule = () => {
      if (queued) return;
      queued = true;
      frame = requestAnimationFrame(draw);
    };

    /* ------------------------------------------------------------------ */
    /* Percikan pada layar sentuh                                          */
    /* ------------------------------------------------------------------ */

    let lastSparkAt = 0;
    let lastSparkX = 0;
    let lastSparkY = 0;

    const spark = (x: number, y: number) => {
      const now = performance.now();
      const moved = Math.hypot(x - lastSparkX, y - lastSparkY);
      // Dua pembatas sekaligus: jarak dan waktu. Tanpa keduanya, satu sapuan
      // panjang dapat melahirkan ratusan elemen sekaligus dan justru membuat
      // gerakannya tersendat - kebalikan dari tujuannya.
      if (now - lastSparkAt < 55 || moved < 18) return;
      lastSparkAt = now;
      lastSparkX = x;
      lastSparkY = y;

      const node = document.createElement("div");
      node.className = "touch-spark";
      node.setAttribute("aria-hidden", "true");
      node.style.setProperty("--sx", `${x}px`);
      node.style.setProperty("--sy", `${y}px`);
      document.body.appendChild(node);
      node.addEventListener("animationend", () => node.remove(), {
        once: true,
      });
    };

    /* ------------------------------------------------------------------ */
    /* Pemasangan listener                                                 */
    /* ------------------------------------------------------------------ */

    const onMove = (event: PointerEvent) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      schedule();
      glow.dataset.visible = "true";

      if (event.pointerType === "touch") spark(event.clientX, event.clientY);
    };

    const onDown = (event: PointerEvent) => {
      if (event.pointerType !== "touch") return;
      pointerX = event.clientX;
      pointerY = event.clientY;
      lastSparkX = event.clientX;
      lastSparkY = event.clientY;
      schedule();
      glow.dataset.visible = "true";
      // Percikan pertama dipaksa muncul supaya ketukan tunggal - yang tidak
      // menghasilkan gerakan sama sekali - tetap memberi umpan balik.
      lastSparkAt = 0;
      spark(event.clientX, event.clientY);
    };

    const onUp = (event: PointerEvent) => {
      if (event.pointerType !== "touch") return;
      glow.dataset.visible = "false";
    };

    const onLeave = () => {
      glow.dataset.visible = "false";
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    window.addEventListener("pointercancel", onUp, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("blur", onLeave);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
    };
  }, []);

  return <div ref={glowRef} className="cursor-glow" aria-hidden />;
}

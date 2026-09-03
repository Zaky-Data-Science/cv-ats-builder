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
    /* Pemasangan listener                                                 */
    /* ------------------------------------------------------------------ */

    /*
      Percikan cahaya pada layar sentuh sudah dipindahkan ke InkTouch, yang
      menggantikannya dengan bercak tinta. Keduanya tidak boleh berjalan
      bersamaan: satu sentuhan akan menghasilkan dua bekas berbeda di titik
      yang sama, dan yang terlihat bukan dua efek melainkan satu efek yang
      keliru. Yang tersisa di berkas ini hanya cahaya pengikut kursor.
    */

    const onMove = (event: PointerEvent) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      schedule();
      glow.dataset.visible = "true";
    };

    const onDown = (event: PointerEvent) => {
      if (event.pointerType !== "touch") return;
      pointerX = event.clientX;
      pointerY = event.clientY;
      schedule();
      glow.dataset.visible = "true";
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

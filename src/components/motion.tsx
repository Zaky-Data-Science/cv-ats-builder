"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Komponen gerak dan kedalaman.
 *
 * Seluruhnya memakai transform CSS, bukan pustaka 3D. Alasannya bukan
 * sekadar ukuran berkas: aplikasi ini akan dibuka pengguna yang sedang
 * melamar kerja, kerap dari ponsel kelas menengah ke bawah dan jaringan
 * seluler. Memuat mesin 3D beberapa ratus kilobyte demi hiasan halaman
 * depan akan memperlambat hal yang justru menjadi inti aplikasinya.
 *
 * Semua efek di sini menghormati preferensi "kurangi gerak" pada sistem
 * pengguna, dan tidak satu pun menjadi syarat untuk memahami isi halaman.
 *
 * Catatan penerapan: pemasangan pengamat dilakukan lewat ref callback yang
 * mengembalikan fungsi pembersih, bukan lewat useEffect. Selain lebih
 * ringkas, cara ini menghindari pemanggilan setState langsung di dalam
 * badan effect - pola yang memicu render berantai.
 */

/* -------------------------------------------------------------------------- */
/* Preferensi pengurangan gerak                                               */
/* -------------------------------------------------------------------------- */

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function getReducedMotion() {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

/**
 * Di server preferensi ini tidak dapat diketahui. Nilai awalnya "tidak
 * mengurangi gerak" agar tampilan pertama sama dengan mayoritas pengguna,
 * lalu dikoreksi begitu berjalan di peramban.
 */
function getReducedMotionOnServer() {
  return false;
}

export function useReducedMotion(): boolean {
  return React.useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    getReducedMotionOnServer,
  );
}

/* -------------------------------------------------------------------------- */
/* Kartu miring mengikuti kursor                                              */
/* -------------------------------------------------------------------------- */

/**
 * Kartu yang miring mengikuti posisi kursor, memberi kesan objek nyata di
 * atas bidang. Pada layar sentuh efek ini tidak aktif - tidak ada kursor
 * untuk diikuti, dan memaksakan gerak justru mengganggu saat menggulir.
 */
export function TiltCard({
  children,
  className,
  maxTilt = 9,
}: {
  children: React.ReactNode;
  className?: string;
  /** Sudut kemiringan maksimum dalam derajat. */
  maxTilt?: number;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [active, setActive] = React.useState(false);
  const reduced = useReducedMotion();

  React.useEffect(() => {
    const element = ref.current;
    if (!element || reduced) return;

    // Perangkat tanpa penunjuk presisi (ponsel, tablet) dilewati.
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let frame = 0;

    const onMove = (event: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = element.getBoundingClientRect();
        // Posisi kursor dinormalisasi ke rentang -0,5 sampai 0,5.
        const px = (event.clientX - rect.left) / rect.width - 0.5;
        const py = (event.clientY - rect.top) / rect.height - 0.5;
        element.style.setProperty("--tilt-y", `${px * maxTilt * 2}deg`);
        element.style.setProperty("--tilt-x", `${-py * maxTilt * 2}deg`);
        element.style.setProperty("--sheen-angle", `${120 + px * 90}deg`);
        element.style.setProperty("--sheen-opacity", "1");
      });
    };

    const onLeave = () => {
      cancelAnimationFrame(frame);
      element.style.setProperty("--tilt-x", "0deg");
      element.style.setProperty("--tilt-y", "0deg");
      element.style.setProperty("--sheen-opacity", "0");
      setActive(false);
    };

    const onEnter = () => setActive(true);

    element.addEventListener("pointermove", onMove);
    element.addEventListener("pointerenter", onEnter);
    element.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(frame);
      element.removeEventListener("pointermove", onMove);
      element.removeEventListener("pointerenter", onEnter);
      element.removeEventListener("pointerleave", onLeave);
    };
  }, [maxTilt, reduced]);

  return (
    <div
      ref={ref}
      className={cn("tilt-card", active && "tilt-card--active", className)}
    >
      {children}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Muncul saat tergulir masuk layar                                           */
/* -------------------------------------------------------------------------- */

/**
 * Memunculkan isinya saat tergulir masuk ke layar.
 *
 * Isi tetap ada di DOM sejak awal - hanya opasitasnya yang dianimasikan -
 * sehingga tetap terbaca pembaca layar dan mesin pencari meskipun
 * JavaScript gagal dimuat.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  /** Jeda kemunculan dalam milidetik, untuk efek berurutan. */
  delay?: number;
  as?: "div" | "section" | "li";
}) {
  const [shown, setShown] = React.useState(false);

  const attach = React.useCallback((node: HTMLElement | null) => {
    if (!node) return;

    // Peramban yang tidak mengenal IntersectionObserver langsung menerima
    // isinya tanpa animasi - lebih baik daripada isi yang tidak pernah
    // terlihat sama sekali.
    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={attach as any}
      data-shown={shown ? "true" : "false"}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn("reveal", className)}
    >
      {children}
    </Tag>
  );
}

/* -------------------------------------------------------------------------- */
/* Angka yang menghitung naik                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Angka yang menghitung naik saat terlihat. Dipakai pada statistik ringkas
 * di halaman depan agar terasa hidup tanpa menggeser tata letak - lebar
 * kolomnya sudah ditentukan grid, sehingga angka yang berubah tidak
 * mendorong elemen di sekitarnya.
 */
export function CountUp({
  to,
  suffix = "",
  duration = 900,
  className,
}: {
  to: number;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const [value, setValue] = React.useState(0);
  const reduced = useReducedMotion();

  const attach = React.useCallback(
    (node: HTMLSpanElement | null) => {
      if (!node) return;

      if (reduced || typeof IntersectionObserver === "undefined") {
        setValue(to);
        return;
      }

      let frame = 0;
      const observer = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        const start = performance.now();
        const step = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          // Pelambatan di akhir agar berhentinya terasa halus.
          const eased = 1 - Math.pow(1 - progress, 3);
          setValue(Math.round(to * eased));
          if (progress < 1) frame = requestAnimationFrame(step);
        };
        frame = requestAnimationFrame(step);
      });

      observer.observe(node);
      return () => {
        cancelAnimationFrame(frame);
        observer.disconnect();
      };
    },
    [to, duration, reduced],
  );

  return (
    <span ref={attach} className={className}>
      {value}
      {suffix}
    </span>
  );
}

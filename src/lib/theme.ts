/**
 * Penyimpanan mode terang/gelap.
 *
 * Hanya ada dua keadaan: terang dan gelap. Pilihan "ikut sistem" sengaja
 * ditiadakan sebagai pilihan tersendiri - yang tersisa hanyalah satu tombol
 * yang langsung membalik keadaan. Setelan sistem tetap dihormati, tetapi
 * perannya bergeser: ia menentukan keadaan **awal** bagi pengunjung yang
 * belum pernah memilih, bukan menjadi pilihan ketiga yang harus dipahami
 * lebih dulu.
 *
 * Ditulis sebagai store kecil di luar React, bukan sebagai state di dalam
 * komponen, karena dua alasan.
 *
 * 1. Nilainya berasal dari localStorage yang hanya ada di peramban. Bila
 *    dibaca lewat useEffect lalu disimpan dengan setState, React akan
 *    merender dua kali dan memicu peringatan lint "setState di dalam effect".
 *    useSyncExternalStore memang dirancang untuk kasus ini.
 * 2. Sakelar tema bisa muncul di lebih dari satu tempat (header publik dan
 *    bilah editor). Dengan satu store bersama, keduanya selalu sepakat tanpa
 *    perlu context.
 */

export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "atscv-theme";

/**
 * Skrip yang disisipkan di dalam <head> dan berjalan sebelum halaman
 * digambar.
 *
 * Tanpa ini, pengguna mode gelap akan melihat kilatan putih pada setiap
 * pemuatan halaman, karena HTML dari server tidak tahu pilihannya.
 *
 * Skrip ini **selalu** menuliskan atribut data-theme - entah dari pilihan
 * tersimpan atau dari setelan sistem. Konsekuensinya menyederhanakan CSS:
 * cukup satu aturan `[data-theme="dark"]`, tanpa perlu menduplikasinya di
 * dalam blok prefers-color-scheme.
 *
 * Sengaja ditulis sebagai satu baris tanpa ketergantungan apa pun supaya
 * dapat dijalankan lebih dulu daripada bundel JavaScript aplikasi.
 */
export const THEME_INIT_SCRIPT = `(function(){try{var k=${JSON.stringify(
  THEME_STORAGE_KEY,
)};var t=localStorage.getItem(k);if(t!=="light"&&t!=="dark"){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;

const listeners = new Set<() => void>();

/** Nilai yang di-cache agar getSnapshot mengembalikan referensi stabil. */
let snapshot: Theme | null = null;

function read(): Theme {
  // Atribut pada <html> dibaca lebih dulu: skrip di atas sudah menuliskannya
  // sebelum halaman digambar, jadi nilainya pasti sudah benar - termasuk saat
  // pengguna belum pernah memilih dan yang berlaku adalah setelan sistemnya.
  const attribute = document.documentElement.getAttribute("data-theme");
  if (attribute === "dark" || attribute === "light") return attribute;

  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    // Peramban dengan penyimpanan diblokir tetap harus dapat memakai
    // aplikasinya; ia hanya akan selalu mulai dari mode terang.
  }
  return "light";
}

export function subscribeTheme(callback: () => void): () => void {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

export function getThemeSnapshot(): Theme {
  if (snapshot === null) snapshot = read();
  return snapshot;
}

/**
 * Di server, mode yang sedang berlaku tidak dapat diketahui.
 *
 * Nilai "light" dipakai sebagai nilai sementara selama hidrasi;
 * useSyncExternalStore akan segera merender ulang dengan nilai sebenarnya
 * begitu berjalan di peramban. Yang terlihat pengguna tidak berkedip, sebab
 * warna halaman sudah ditetapkan skrip di <head> - yang berpindah hanyalah
 * ikon pada tombolnya.
 */
export function getThemeServerSnapshot(): Theme {
  return "light";
}

export function setTheme(theme: Theme): void {
  snapshot = theme;

  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Pilihan tetap berlaku untuk sesi ini walau tidak dapat disimpan.
  }

  document.documentElement.setAttribute("data-theme", theme);

  for (const listener of listeners) listener();
}

export function toggleTheme(): void {
  setTheme(getThemeSnapshot() === "dark" ? "light" : "dark");
}

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

/**
 * Lamanya tinta menyebar menutupi layar saat tema berganti.
 *
 * Sedikit lebih panjang daripada transisi antarmuka pada umumnya, dan itu
 * disengaja: yang berubah bukan satu tombol melainkan seluruh permukaan
 * aplikasi, dan perubahan sebesar itu yang berlangsung terlalu cepat terbaca
 * sebagai kedipan - bukan sebagai peralihan.
 */
export const THEME_SEBAR_MS = 720;

/**
 * Jari-jari titik pertama, dalam piksel.
 *
 * Kira-kira seukuran tombolnya sendiri. Ia harus cukup besar untuk terbaca
 * sebagai setetes tinta yang jatuh di ikon itu, dan cukup kecil untuk tidak
 * langsung terbaca sebagai sapuan yang sudah dimulai.
 */
const THEME_TITIK_PX = 22;

/**
 * Berapa bagian dari durasi yang dipakai titik itu untuk muncul.
 *
 * Bagian inilah yang sebelumnya tidak ada, dan ketiadaannya yang membuat
 * peralihannya terasa berangkat entah dari mana. Kurva keluar yang dipakai
 * semula menempuh sekitar delapan puluh persen jaraknya dalam sepertiga waktu
 * pertama - sehingga pada bingkai pertama yang sempat dilihat mata,
 * lingkarannya sudah selebar setengah layar. Titik di ikonnya secara teknis
 * ada, tetapi tidak pernah benar-benar terlihat.
 */
const THEME_TITIK_OFFSET = 0.17;

export function toggleTheme(): void {
  setTheme(getThemeSnapshot() === "dark" ? "light" : "dark");
}

/**
 * Mengganti tema sambil menyebarkan tinta dari titik yang ditekan.
 *
 * ## Kenapa View Transitions, bukan `transition` pada warnanya
 *
 * Menganimasikan warnanya sendiri berarti memasang `transition` pada
 * `background-color`, `color`, dan `border-color` di seluruh aplikasi. Tiga
 * masalah sekaligus: setiap elemen bertransisi menurut jadwalnya masing-
 * masing sehingga halaman terlihat berganti sepotong-sepotong, warna yang
 * bertransisi memaksa pengecatan ulang terus-menerus selama animasinya, dan
 * pemilih yang cukup luas untuk menjangkau semuanya juga akan menjangkau
 * hal-hal yang justru tidak boleh ikut - kertas CV, misalnya.
 *
 * View Transitions memotret halaman sebelum dan sesudah, lalu menyilangkan
 * keduanya sebagai dua gambar. Yang dianimasikan karena itu hanya `clip-path`
 * pada satu lapisan - bukan warna pada ratusan elemen.
 *
 * ## Kenapa lingkaran dari titik yang ditekan
 *
 * Bentuknya sama dengan bercak tinta yang muncul di setiap sentuhan, dan
 * sumbernya tombol yang barusan ditekan. Peralihan yang menyebar dari tempat
 * jari berada terbaca sebagai akibat dari tindakan itu; peredupan yang
 * merata di seluruh layar terbaca sebagai sesuatu yang kebetulan terjadi.
 *
 * ## Bila tidak didukung
 *
 * Peramban tanpa `startViewTransition`, dan pengguna yang meminta pengurangan
 * gerak, memperoleh pergantian seketika. Itu memang keadaan yang benar bagi
 * keduanya - dan tidak ada satu pun cabang tambahan yang perlu dipelihara,
 * sebab jalur cepatnya persis `toggleTheme()` yang sudah ada.
 */
export function toggleThemeDari(x: number, y: number): void {
  const doc = document as Document & {
    startViewTransition?: (callback: () => void) => { ready: Promise<void> };
  };

  const kurangiGerak = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (kurangiGerak || typeof doc.startViewTransition !== "function") {
    toggleTheme();
    return;
  }

  const transisi = doc.startViewTransition(() => toggleTheme());

  /*
    Kegagalan transisinya ditelan, dan itu memang perlakuan yang benar.

    `ready` ditolak setiap kali peramban memutuskan melewati potretnya -
    tab berpindah ke latar di tengah pergantian, transisi lain menyusul
    sebelum yang ini selesai, atau dokumen sedang tidak terlihat. Chrome
    melaporkannya sebagai `InvalidStateError: Transition was aborted`.

    Tak satu pun dari itu merugikan: temanya sudah berganti di dalam callback
    di atas, dan yang hilang hanya geraknya. Tanpa `catch` di sini,
    penolakannya muncul di konsol pengguna sebagai galat yang tampak serius
    padahal aplikasinya bekerja persis sebagaimana mestinya.
  */
  void transisi.ready
    .then(() => {
      /*
        Jari-jari diambil dari sudut terjauh, bukan dari lebar layar. Titik
        tekannya bisa di mana saja - pada tombol di pojok kanan atas, sudut
        terjauhnya adalah kiri bawah - dan lingkaran yang hanya selebar layar
        akan meninggalkan sepotong sudut yang tidak pernah tersapu.
      */
      const jarak = (dx: number, dy: number) => Math.hypot(dx, dy);
      const jariJari = Math.max(
        jarak(x, y),
        jarak(window.innerWidth - x, y),
        jarak(x, window.innerHeight - y),
        jarak(window.innerWidth - x, window.innerHeight - y),
      );

      /*
        Tiga tahap, bukan dua - dan pembagiannya yang menentukan rasanya.

          1. Setetes tinta muncul di ikonnya. Melambat di ujung, seperti
             tetesan yang mendarat lalu berhenti sesaat.
          2. Tetesan itu menyebar menutupi layar. Berangkat pelan dari
             keadaan diam tadi, melesat di tengah, lalu mengendap.

        Satu kurva untuk seluruh perjalanan tidak dapat melakukan keduanya:
        kurva yang cukup tajam untuk terasa bertenaga akan menelan tahap
        pertama, dan kurva yang cukup lembut untuk memperlihatkan tahap
        pertama membuat sisanya terasa lamban.
      */
      document.documentElement.animate(
        [
          {
            clipPath: `circle(0px at ${x}px ${y}px)`,
            offset: 0,
            easing: "cubic-bezier(0.16, 1, 0.3, 1)",
          },
          {
            clipPath: `circle(${THEME_TITIK_PX}px at ${x}px ${y}px)`,
            offset: THEME_TITIK_OFFSET,
            easing: "cubic-bezier(0.5, 0, 0.2, 1)",
          },
          {
            clipPath: `circle(${jariJari}px at ${x}px ${y}px)`,
            offset: 1,
          },
        ],
        {
          duration: THEME_SEBAR_MS,
          // Yang disebar lapisan baru, bukan yang lama. Menyapu lapisan lama
          // ke arah sebaliknya akan membuat tema lama seolah terkelupas -
          // yang dituju adalah tinta baru yang menutupinya.
          pseudoElement: "::view-transition-new(root)",
        },
      );
    })
    .catch(() => {
      // Lihat komentar di atas: peralihannya dilewati, temanya tetap berganti.
    });
}

/**
 * ============================================================================
 *  INTRO PEMBUKA - SATU TEBASAN
 * ============================================================================
 *
 * Selembar CV muncul, sebuah siluet melintas, satu tebasan membelahnya, dan
 * tintanya menyebar menjadi halaman depan. Seluruhnya 2,2 detik.
 *
 * ---------------------------------------------------------------------------
 * Yang menentukan bentuk kode ini
 * ---------------------------------------------------------------------------
 *
 * 1. **Bukan komponen klien, dan tidak menunggu React sama sekali.** Sampai
 *    sesi 10 lapisan ini baru dirender setelah hidrasi selesai, dan di sebuah
 *    ponsel itu berarti adegan pembukanya datang beberapa detik setelah
 *    halamannya sudah terbaca utuh - pembuka yang datang belakangan bukan
 *    lagi pembuka. Sekarang markup-nya ikut terkirim dari server, animasinya
 *    seluruhnya CSS, dan yang memutuskan diputar atau tidak adalah skrip
 *    sinkron di `<head>` lewat atribut `data-intro`. Lihat `src/lib/intro.ts`.
 *
 * 2. **Halaman tidak boleh menunggu animasinya.** Intro digambar sebagai
 *    lapisan di atas halaman yang sudah utuh di belakangnya - bukan sebagai
 *    gerbang yang menahan isinya. Tanpa JavaScript, `data-intro` tidak pernah
 *    ada, CSS menyembunyikan lapisan ini sepenuhnya, dan pengunjung langsung
 *    melihat halaman depan; tidak ada keadaan "layar tersangkut di pembuka".
 *
 * 3. **Tidak ada gambar, tidak ada pustaka.** Siluetnya SVG sebaris yang
 *    mewarisi `currentColor`, sehingga ia otomatis berlawanan dengan tema
 *    tanpa satu pun cabang kode. Menambah berkas gambar akan mengembalikan
 *    beban yang baru saja dipangkas dari halaman depan - dan halaman depan
 *    itulah yang paling menentukan kesan pertama di jaringan seluler.
 *
 * 4. **Hanya transform dan opacity yang dianimasikan**, sehingga seluruh
 *    kerjanya jatuh ke compositor dan tidak memicu perhitungan tata letak.
 *
 * 5. **Sekali per pemuatan halaman, dan selalu dapat dilewati.** Satu
 *    ketukan, klik, tombol, atau gulir melewatinya - bukan tombol "lewati"
 *    yang harus dicari; seluruh layar adalah tombolnya. Sesudah jeda pendek
 *    di awal, supaya sisa sentuhan dari tarik-untuk-muat-ulang tidak langsung
 *    menghabiskan adegannya.
 */

export function SamuraiIntro() {
  /*
    Dirender tanpa syarat, di server maupun di peramban.

    Tidak ada keputusan apa pun di sini - dan justru itu yang membuat markup
    server dan markup klien pasti sama, sehingga tidak ada ketidakcocokan
    hidrasi yang perlu dibungkam. Keputusannya sepenuhnya milik CSS dan
    atribut `data-intro` pada elemen <html>.
  */
  return (
    <div className="intro-akar" aria-hidden>
      {/* Latar yang memudar di akhir, memperlihatkan halaman di belakangnya. */}
      <div className="intro-tirai" />

      <div className="intro-panggung">
        {/*
          Kertas dibelah menjadi dua bagian yang saling menjauh. Keduanya
          memakai clip-path miring yang sama tetapi berlawanan, sehingga
          garis belahnya tepat berimpit - bukan dua bentuk terpisah yang
          kebetulan berdekatan.
        */}
        <div className="intro-kertas intro-kertas-kiri">
          <BarisKertas />
        </div>
        <div className="intro-kertas intro-kertas-kanan">
          <BarisKertas />
        </div>

        <Siluet />

        {/* Sapuan kuas yang melintas mengikuti arah tebasan. */}
        <div className="intro-tebasan" />

        {/* Tinta yang menyebar dari titik belah, lalu menutup adegannya. */}
        <div className="intro-tinta" />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

/**
 * Garis-garis abu yang mewakili teks CV.
 *
 * Sengaja bukan teks sungguhan: yang dibutuhkan hanya kesan "selembar CV",
 * dan teks sungguhan di dalam lapisan berhias justru akan dibacakan pembaca
 * layar sebagai isi halaman.
 */
function BarisKertas() {
  const baris = [92, 64, 0, 88, 80, 86, 0, 70, 84, 76, 82, 0, 60, 88, 74];

  return (
    <div className="intro-kertas-isi">
      <span className="intro-baris intro-baris-judul" />
      <span className="intro-baris intro-baris-sub" />
      {baris.map((lebar, i) =>
        lebar === 0 ? (
          <span key={i} className="intro-jeda" />
        ) : (
          <span key={i} className="intro-baris" style={{ width: `${lebar}%` }} />
        ),
      )}
    </div>
  );
}

/**
 * Siluet samurai beserta katananya.
 *
 * Digambar sebagai satu bentuk gelap tanpa raut wajah maupun rincian
 * busana - yang perlu terbaca hanyalah sikap tubuh seseorang yang baru saja
 * menebas. Rincian lebih jauh akan menggeser kesannya dari "sinematik"
 * menjadi "ilustrasi karakter", dan itu bukan yang dicari halaman ini.
 */
function Siluet() {
  return (
    <svg
      className="intro-siluet"
      viewBox="0 0 200 260"
      fill="currentColor"
      aria-hidden
    >
      {/*
        Katana - digambar lebih dulu supaya tubuh menutupi pangkalnya dan
        keduanya terbaca menyatu, bukan sebagai dua benda yang bertumpuk.
        Bilahnya meruncing: lebar di pangkal, hampir nol di ujung.
      */}
      <path d="M148 92 C164 70 182 42 197 16 C192 46 178 76 159 100 C155 100 151 97 148 92 Z" />
      {/* Tsuba - sekat kecil antara bilah dan genggaman. */}
      <path d="M138 100 L153 89 L157 95 L142 106 Z" />

      {/*
        Kasa - topi jerami berbentuk kerucut lebar.

        Bentuk inilah yang paling menentukan apakah siluetnya terbaca sebagai
        samurai atau tidak; tanpa kerucutnya, apa pun di bawahnya hanya
        terbaca sebagai sosok bertudung.
      */}
      <path d="M50 64 L100 18 L150 64 C124 72 76 72 50 64 Z" />

      {/* Bahu dan badan - menyempit di bahu lalu melebar seperti hakama. */}
      <path d="M82 66 C74 82 69 104 66 130 C63 156 61 180 59 200 L141 200 C139 180 137 156 134 130 C131 104 126 82 118 66 Z" />

      {/* Lengan pemegang katana, terangkat ke kanan atas. */}
      <path d="M116 74 C130 76 143 84 150 94 L140 108 C132 98 122 92 112 90 Z" />

      {/* Kaki dalam kuda-kuda - satu maju, satu menahan di belakang. */}
      <path d="M68 200 L92 200 L88 246 L66 244 Z" />
      <path d="M110 200 L134 200 L136 244 L114 246 Z" />
    </svg>
  );
}

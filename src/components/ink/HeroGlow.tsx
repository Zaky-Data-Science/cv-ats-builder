/**
 * ============================================================================
 *  CAHAYA LATAR HERO
 * ============================================================================
 *
 * Menggantikan sapuan tinta (`InkWash`) yang dulu mengisi latar hero.
 *
 * Sapuan itu digambar sebagai goresan panjang berpinggiran lembut, dan di layar
 * hasilnya terbaca sebagai coretan putih yang melintasi panel - bukan sebagai
 * tinta yang meresap. Yang paling merugikan: goresannya melewati daerah tempat
 * judul berdiri, sehingga huruf putih besar bertemu latar yang juga menyala,
 * dan tepi hurufnya jadi berlomba dengan coretan di belakangnya.
 *
 * Gantinya cahaya, bukan garis. Tiga lingkaran cahaya yang sangat lebar dan
 * sangat lembut, ditaruh di sudut-sudut panel dan **menjauh dari tengah**,
 * tempat judul berada. Hasilnya kedalaman - latar yang tidak rata gelap -
 * tanpa satu pun bentuk yang menarik perhatian untuk dirinya sendiri.
 *
 * Jaring partikel di atasnya justru lebih terbaca sekarang: titik-titik pucat
 * itu dulu bersaing dengan goresan yang jauh lebih terang.
 *
 * Seluruhnya gradien CSS, tanpa kanvas dan tanpa animasi. Biayanya nol setelah
 * halaman selesai digambar - berbeda dengan pendahulunya, yang riwayat
 * biayanya panjang. Karena tidak ada yang beranimasi di lapisan ini, ia juga
 * tidak lagi memicu penggambaran ulang di bawah kanvas partikel.
 */
export function HeroGlow() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{
        background: [
          // Kiri atas, paling kuat: dari sinilah arah cahayanya dibaca.
          "radial-gradient(60% 55% at 8% 0%, rgb(255 255 255 / 0.10), transparent 70%)",
          // Kanan bawah, penyeimbang yang lebih redup.
          "radial-gradient(55% 50% at 100% 100%, rgb(255 255 255 / 0.07), transparent 72%)",
          // Sapuan lebar rendah di kaki panel, supaya batas bawahnya tidak
          // berhenti mendadak saat bertemu bagian berikutnya.
          "radial-gradient(90% 40% at 50% 118%, rgb(255 255 255 / 0.05), transparent 70%)",
        ].join(", "),
      }}
    />
  );
}

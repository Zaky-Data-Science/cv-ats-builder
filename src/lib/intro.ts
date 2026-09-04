/**
 * Intro pembuka: kapan diputar, dan bagaimana ia dilewati.
 *
 * ## Kenapa keputusannya diambil skrip di <head>, bukan React
 *
 * Sampai sesi 10 lapisan intronya baru dirender setelah React selesai
 * hidrasi - `useSyncExternalStore` menjawab "tidak perlu" di server, dan
 * "perlu" baru terbaca di peramban.
 *
 * Akibatnya adegannya menunggu seluruh bundel React dimuat dan dijalankan
 * lebih dulu. Pada koneksi cepat jedanya tidak terasa; pada sebuah ponsel di
 * Wi-Fi, halaman depan sudah terbaca utuh beberapa detik sebelum adegan
 * pembukanya sempat mulai - dan sebuah pembuka yang datang setelah
 * halamannya terbaca bukan lagi pembuka. Dilaporkan pendek: "animasinya pas
 * refresh gk muncul".
 *
 * Yang menentukan sekarang skrip sinkron di dalam `<head>`, pola yang sama
 * dengan skrip tema dan skrip animasi gulir. Lapisannya sendiri ikut
 * terkirim dari server, dan CSS menyembunyikannya kecuali `<html>` membawa
 * `data-intro`. Dua akibat yang keduanya diinginkan:
 *
 *  - **Adegannya mulai pada bingkai pertama**, bersamaan dengan halamannya
 *    digambar, tanpa menunggu satu byte JavaScript pun selain skrip ini.
 *  - **Tanpa JavaScript sama sekali** atributnya tidak pernah ada, lapisannya
 *    tidak pernah terlihat, dan halamannya langsung tampil - bukan tertutup
 *    tirai yang tidak akan pernah terangkat.
 *
 * ## Sekali per pemuatan halaman
 *
 * Atributnya dilepas sendiri begitu adegannya usai. Berpindah halaman di
 * dalam aplikasi lalu kembali ke beranda karena itu tidak memutarnya lagi -
 * atributnya sudah tidak ada - sementara memuat ulang halaman menjalankan
 * skrip ini dari awal dan intronya kembali. Tidak ada satu pun penanda yang
 * perlu disimpan.
 *
 * Sebelum sesi 10 ini ditandai di localStorage sehingga intronya hanya
 * pernah terlihat sekali seumur perangkat. Diubah atas permintaan pemilik
 * aplikasi, dan keberatan lamanya - pembuka yang berulang berubah menjadi
 * penghalang - dijawab dari sisi lain: adegannya selalu dapat dilewati.
 */

/** Berapa lama seluruh adegan berlangsung, dari kertas muncul sampai memudar. */
export const INTRO_DURASI_MS = 2200;

/**
 * Berapa lama adegan yang dilewati memudar.
 *
 * Bukan nol. Lapisan yang lenyap seketika terbaca sebagai kedipan yang salah,
 * sedangkan yang barusan diminta penggunanya adalah "lanjutkan" - bukan
 * "hilangkan".
 */
export const INTRO_LEWAT_MS = 260;

/**
 * Jeda sebelum adegannya boleh dilewati.
 *
 * Tanpa jeda ini, adegannya kerap tidak pernah terlihat sama sekali di
 * ponsel: menarik layar ke bawah untuk memuat ulang meninggalkan jari di
 * atas kaca, dan sentuhan yang sama langsung terbaca sebagai "lewati" pada
 * milidetik pertama halaman berikutnya.
 *
 * Setengah detik cukup untuk melewatkan sisa sentuhan itu, dan masih jauh
 * lebih pendek daripada waktu seseorang memutuskan bahwa ia tidak ingin
 * menonton.
 */
export const INTRO_JEDA_LEWAT_MS = 500;

/**
 * Skrip yang berjalan di dalam `<head>`, sebelum halaman digambar.
 *
 * Ditulis sebagai untaian, bukan modul, karena memang harus sudah selesai
 * sebelum piksel pertama muncul - sama seperti skrip tema. Isinya sengaja
 * sesingkat mungkin: apa pun yang berjalan di sini menunda halamannya
 * digambar.
 */
export const INTRO_INIT_SCRIPT = `(function(){try{
var d=document,e=d.documentElement;
/* Kunci yang dipakai versi sebelumnya untuk menandai "sudah pernah melihat".
   Tidak lagi dibaca, tetapi akan duduk di perangkat setiap pengunjung lama
   selamanya kalau dibiarkan - dan pada mode tanpa akun, penyimpanan yang
   sama itulah yang menampung CV pengguna. */
try{localStorage.removeItem("atscv-intro-dilihat")}catch(x){}
if(window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;
e.setAttribute("data-intro","");
var selesai=function(){e.removeAttribute("data-intro");e.removeAttribute("data-intro-lewat")};
var habis=setTimeout(selesai,${INTRO_DURASI_MS});
setTimeout(function(){
var lewati=function(){
e.setAttribute("data-intro-lewat","");
clearTimeout(habis);
setTimeout(selesai,${INTRO_LEWAT_MS});
w.removeEventListener("pointerdown",lewati);
w.removeEventListener("keydown",lewati);
w.removeEventListener("wheel",lewati)};
var w=window;
w.addEventListener("pointerdown",lewati,{passive:true});
w.addEventListener("keydown",lewati);
w.addEventListener("wheel",lewati,{passive:true});
},${INTRO_JEDA_LEWAT_MS});
}catch(err){}})()`;

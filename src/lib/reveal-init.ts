/**
 * Menyalakan animasi "muncul saat tergulir masuk", dan jaring pengamannya.
 *
 * ## Cacat yang membuat berkas ini ada
 *
 * Sampai sesi 10, `.reveal` bermula pada `opacity: 0` di dalam CSS dan hanya
 * menjadi terlihat setelah IntersectionObserver menyetel `data-shown="true"` -
 * yaitu setelah React selesai hidrasi. HTML dari server memuat seluruh isi
 * halaman dengan benar, tetapi **41 elemen di antaranya dikirim tak terlihat**,
 * dan satu-satunya yang dapat memunculkannya adalah JavaScript.
 *
 * Akibatnya halaman depan tampak hitam kosong pada perangkat yang JavaScript-
 * nya lambat dimuat, gagal dimuat, atau diblokir. Dilaporkan dari sebuah
 * ponsel; sebelumnya sempat dikira artefak lingkungan pengujian.
 *
 * Prinsip yang dilanggarnya sudah tertulis di komponennya sendiri: isi tetap
 * ada di DOM sejak awal "sehingga tetap terbaca pembaca layar dan mesin
 * pencari meskipun JavaScript gagal dimuat". Yang terlewat: terbaca pembaca
 * layar bukan berarti terlihat mata.
 *
 * ## Cara memperbaikinya
 *
 * Arahnya dibalik. `.reveal` kini **terlihat secara bawaan**, dan baru
 * disembunyikan bila `<html>` membawa `data-anim` - atribut yang dituliskan
 * skrip di bawah, sinkron di dalam `<head>`, sebelum halaman digambar
 * pertama kali. Pola yang sama persis dengan skrip tema di `theme.ts`, dan
 * karena alasan yang sama: keputusan yang harus diambil sebelum piksel
 * pertama muncul tidak dapat menunggu React.
 *
 * Tanpa JavaScript sama sekali, atribut itu tidak pernah ada dan seluruh isi
 * halaman terlihat apa adanya - tanpa animasi, yang memang hiasan.
 *
 * ## Jaring pengamannya
 *
 * Skrip di atas berjalan lebih dulu daripada bundel React, jadi ia tetap
 * menyala walau bundel itu kemudian gagal dimuat - dan halamannya akan
 * kembali kosong. Karena itu ada pemeriksaan kedua: bila setelah beberapa
 * detik tidak satu pun elemen sempat ditandai muncul, atributnya dilepas dan
 * isinya ditampilkan.
 *
 * Ambangnya sengaja diperiksa lewat keadaan yang sebenarnya - ada atau
 * tidaknya satu `[data-shown="true"]` - bukan lewat "apakah React sudah
 * hidrasi". Yang perlu dijamin bukan React-nya hidup, melainkan isinya
 * terlihat.
 */

/** Berapa lama menunggu sebelum menganggap animasinya tidak akan berjalan. */
const AMBANG_MS = 2500;

export const REVEAL_INIT_SCRIPT = `(function(){try{
var d=document,e=d.documentElement;
e.setAttribute("data-anim","");
setTimeout(function(){
if(!d.querySelector('.reveal[data-shown="true"]')){e.removeAttribute("data-anim")}
},${AMBANG_MS});
}catch(err){}})()`;

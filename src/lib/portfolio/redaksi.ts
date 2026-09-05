import { entriKamus } from "./kamus-bidang";
import type { ProfilPortofolio } from "./types";

/**
 * ============================================================================
 *  MODE REDAKSI
 * ============================================================================
 *
 * Sebagian besar orang yang punya karya terbaik justru paling sulit
 * menampilkannya: nilai kontrak, nama klien, nomor part, dan angka produksi
 * hampir selalu terikat perjanjian kerahasiaan. Yang lazim terjadi kemudian
 * ada dua, dan keduanya buruk - CV-nya dikosongkan sampai tidak membuktikan
 * apa pun, atau angkanya ditulis apa adanya dan penulisnya melanggar
 * perjanjian yang ia tanda tangani sendiri.
 *
 * Mode Redaksi menyediakan jalan ketiga: bentuk pekerjaannya tetap terbaca,
 * besarannya tetap terasa, tetapi nama dan angka pastinya tidak ikut tercetak.
 *
 * Dua aturan yang dijalankan berkas ini:
 *
 *   1. Nama klien diganti deskriptor bidangnya.
 *   2. Angka pasti diganti rentang yang memuatnya.
 *
 * Keduanya deterministik. Rentangnya dihitung dari angkanya sendiri - dibulatkan
 * ke bawah dan ke atas pada kelipatan sebesar ordenya - bukan dari daftar
 * rentang yang dikarang. "Rp 42 juta" menjadi "Rp 40-50 juta"; "8.400 m2"
 * menjadi "8.000-9.000 m2". Pembacanya tetap tahu ini proyek puluhan juta,
 * bukan miliaran, dan itu memang yang perlu ia tahu.
 */

/**
 * Konteks yang bukan nama klien, jadi tidak perlu disamarkan.
 *
 * Menyamarkan "Freelance" menjadi "Klien bidang X" bukan hanya sia-sia - ia
 * menghapus keterangan yang justru jujur, lalu menggantinya dengan yang
 * mengesankan ada klien yang dirahasiakan.
 */
const KONTEKS_BUKAN_KLIEN = [
  "proyek mandiri",
  "mandiri",
  "freelance",
  "pribadi",
  "open source",
  "sumber terbuka",
  "tugas kuliah",
  "tugas studio",
];

/** Deskriptor pengganti nama klien, diambil dari bidang yang dipilih pengguna. */
export function deskriptorGenerik(profil: ProfilPortofolio): string {
  const entri = profil.bidangKamus ? entriKamus(profil.bidangKamus) : undefined;
  if (!entri) return "Klien (nama dirahasiakan)";
  // Nama kamus kerap panjang - "Migas, Pertambangan, Energi & K3/HSE". Yang
  // dipakai segmen pertamanya saja; sisanya tidak menambah kejelasan di atas
  // kertas dan justru memakan satu baris penuh.
  const segmen = entri.nama.split(/[,&]/)[0].trim();
  return `Klien bidang ${segmen.toLowerCase()}`;
}

/**
 * Apakah isi kolom Klien/institusi ini diperlakukan sebagai nama klien.
 *
 * Dipakai dua tempat - untuk mengganti kolomnya sendiri, dan untuk memutuskan
 * apakah nama itu ikut disapu dari kalimat yang diketik pengguna. Keduanya
 * membaca daftar yang sama supaya tidak mungkin berbeda pendapat: menyapu
 * "Freelance" dari sebuah ringkasan akan menghapus keterangan yang justru
 * jujur, lalu menggantinya dengan kesan ada klien yang dirahasiakan.
 */
export function konteksAdalahNamaKlien(konteks: string): boolean {
  const bersih = konteks.trim();
  if (!bersih) return false;
  const kecil = bersih.toLowerCase();
  return !KONTEKS_BUKAN_KLIEN.some((k) => kecil === k || kecil.includes(k));
}

export function samarkanKonteks(
  konteks: string,
  profil: ProfilPortofolio,
): string {
  const bersih = konteks.trim();
  if (!konteksAdalahNamaKlien(bersih)) return bersih;
  return deskriptorGenerik(profil);
}

/**
 * Mengganti nama yang sudah diketahui aplikasi di dalam kalimat bebas.
 *
 * Mengganti kolom Klien/institusi saja tidak cukup. Orang menulis nama yang
 * sama sekali lagi di dalam ringkasan dan poinnya - "Menangani 137 titik
 * inspeksi bersama PT Nusantara Energi Jaya" - dan sebelum ini kalimat itu
 * keluar utuh sementara angkanya sudah tersamar. Menyamarkan setengah lebih
 * berbahaya daripada tidak menyamarkan sama sekali.
 *
 * Yang disapu **hanya nama yang memang sudah tersimpan di suatu field**:
 * kolom Klien/institusi, dan field inti bertanda `redaksi: "nama"`. Nama
 * perusahaan TIDAK pernah ditebak dari bentuk tulisannya ("PT ...", "CV ...")
 * - tebakan begitu salah di dua arah sekaligus. Ia melewatkan nama yang tidak
 * berpola, dan merusak kalimat yang tidak perlu disentuh: "CV saya" dan
 * "PT tempat saya magang" bukan nama siapa-siapa.
 *
 * Yang panjang disapu lebih dulu, supaya nama yang memuat nama lain tidak
 * tersapu sebagian.
 */
export function sapuNama(
  teks: string,
  nama: string[],
  deskriptor: string,
): string {
  if (!teks || !deskriptor) return teks;
  const urut = nama
    .map((n) => n.trim())
    .filter(Boolean)
    .sort((a, b) => b.length - a.length);

  let hasil = teks;
  for (const n of urut) {
    hasil = hasil.replace(new RegExp(polaHarfiah(n), "gi"), deskriptor);
  }
  return hasil;
}

/** Menjadikan sebuah nama pola regex harfiah - tanda bacanya ikut apa adanya. */
function polaHarfiah(teks: string): string {
  return teks.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Mengganti tiap angka pasti dengan rentang yang memuatnya.
 *
 * Rentangnya sebesar orde angkanya sendiri: 42 menjadi 40-50, 8.400 menjadi
 * 8.000-9.000, 3,4 menjadi 3-4. Angka di bawah satu dan tahun empat digit
 * dibiarkan - yang pertama karena rentangnya akan lebih kabur daripada
 * berguna, yang kedua karena tahun bukan besaran yang dirahasiakan siapa pun.
 *
 * Tidak semua deretan angka adalah besaran. Dua bentuk dilewati di sini karena
 * angkanya menempel pada nilai yang memang sedang diukur: pangkat pada satuan
 * yang diketik datar (`m2`, `m3`) dan pengali (`2x15 MW`). Tanpa itu, `8.400
 * m2` menjadi `8.000-9.000 m2-3`. Yang dilewati sengaja sesempit mungkin:
 * keliru melewatkan berarti angka sungguhan lolos tanpa disamarkan, dan itu
 * jauh lebih berbahaya daripada keluaran yang jelek.
 *
 * Pengecualian yang lebih luas - `SNI 2847`, `Civil 3D`, `26(1)` - tidak
 * ditangani di sini dan memang tidak bisa. Dari untai teksnya saja keduanya
 * tak terbedakan dari besaran; yang tahu adalah skema field-nya. Karena itu
 * fungsi ini dikenakan **per field**, dan field yang bertanda `redaksi:
 * "apaadanya"` tidak pernah sampai ke sini - lihat `detailTercetak` di
 * `render.ts`.
 */
export function samarkanAngka(teks: string): string {
  /*
    Polanya wajib berakhir pada digit. Tanpa itu, `[\d.,]*` ikut menelan koma
    atau titik yang menempel di belakang angka - dan yang ikut tertelan bukan
    hanya tanda bacanya. "Selesai 2021, lalu diserahkan" membuat yang cocok
    menjadi "2021,", yang tidak lagi lolos penjaga tahun di bawah, sehingga
    tahunnya berubah jadi rentang sekaligus kehilangan komanya:
    "Selesai 2000-3000 lalu diserahkan". Titik dan koma di tengah angka tetap
    tertangkap seperti sedia kala - "8.400", "4,2", "1.200".
  */
  return teks.replace(/\d(?:[\d.,]*\d)?/g, (cocok, posisi: number) => {
    // Tahun dibiarkan apa adanya.
    if (/^(19|20)\d{2}$/.test(cocok)) return cocok;

    const sebelum = teks[posisi - 1] ?? "";
    const sesudah = teks.slice(posisi + cocok.length);

    // Pangkat pada satuan yang diketik datar: "m2", "m3", "km2". Cirinya satu
    // digit yang menempel persis di belakang huruf - bukan besaran, melainkan
    // bagian dari nama satuannya. Dibatasi satu digit supaya "Rp42" yang
    // ditulis tanpa spasi tetap disamarkan.
    if (cocok.length === 1 && /\p{L}/u.test(sebelum)) return cocok;

    // Pengali: pada "2x15 MW" yang diukur adalah 15, sedangkan 2 menyatakan
    // ada dua unit. Menyamarkan pengalinya membuat kalimatnya tidak masuk akal.
    if (/^[x\u00d7]\d/.test(sesudah)) return cocok;

    const pemisahRibuan = cocok.includes(".") && /\.\d{3}(\D|$)/.test(`${cocok} `);
    const angka = Number(
      pemisahRibuan
        ? cocok.replace(/\./g, "").replace(",", ".")
        : cocok.replace(",", "."),
    );
    if (!Number.isFinite(angka) || angka < 1) return cocok;

    const orde = 10 ** Math.floor(Math.log10(angka));
    const bawah = Math.floor(angka / orde) * orde;
    const atas = bawah + orde;
    return `${format(bawah, pemisahRibuan)}-${format(atas, pemisahRibuan)}`;
  });
}

function format(nilai: number, pemisahRibuan: boolean): string {
  const bulat = Math.round(nilai);
  if (!pemisahRibuan) return String(bulat);
  return bulat.toLocaleString("id-ID");
}

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

export function samarkanKonteks(
  konteks: string,
  profil: ProfilPortofolio,
): string {
  const bersih = konteks.trim();
  if (!bersih) return bersih;
  const kecil = bersih.toLowerCase();
  if (KONTEKS_BUKAN_KLIEN.some((k) => kecil === k || kecil.includes(k))) {
    return bersih;
  }
  return deskriptorGenerik(profil);
}

/**
 * Mengganti tiap angka pasti dengan rentang yang memuatnya.
 *
 * Rentangnya sebesar orde angkanya sendiri: 42 menjadi 40-50, 8.400 menjadi
 * 8.000-9.000, 3,4 menjadi 3-4. Angka di bawah satu dan tahun empat digit
 * dibiarkan - yang pertama karena rentangnya akan lebih kabur daripada
 * berguna, yang kedua karena tahun bukan besaran yang dirahasiakan siapa pun.
 */
export function samarkanAngka(teks: string): string {
  return teks.replace(/\d[\d.,]*/g, (cocok) => {
    // Tahun dibiarkan apa adanya.
    if (/^(19|20)\d{2}$/.test(cocok)) return cocok;

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

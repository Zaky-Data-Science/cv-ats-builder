/**
 * ============================================================================
 *  VALIDATOR BAHASA ORANG PERTAMA
 * ============================================================================
 *
 * Konvensi ini bukan selera penulisan. Ia muncul independen di dua badan
 * penilai kompetensi keinsinyuran yang tidak saling menyalin - NCEES di
 * Amerika dan Engineers Australia - dan alasannya sama di keduanya: penilai
 * harus dapat memisahkan apa yang dikerjakan pelamar dari apa yang dikerjakan
 * timnya.
 *
 * "Kami membangun sistem pemantauan" tidak memberi tahu satu pun hal tentang
 * orang yang menulisnya. Ia bisa arsiteknya, bisa juga orang yang membuatkan
 * kopi. "Saya menghitung disipasi daya dan memilih topologi buck sinkron"
 * memberi tahu persis.
 *
 * Karena itu ini dibuat sebagai validator, bukan sebagai tips di kotak
 * bantuan: tips dibaca sekali lalu dilupakan, sementara penanda yang muncul
 * tepat di bawah kalimatnya dibaca setiap kali kalimat itu ditulis.
 */

export interface TemuanBahasa {
  /** Kata yang memicu temuan, apa adanya seperti tertulis. */
  kata: string;
  /** Usul penulisan ulangnya. */
  usul: string;
}

/** Kata ganti jamak: menyembunyikan siapa yang sebenarnya mengerjakan. */
const KATA_JAMAK = /\b(kami|tim kami|kita)\b/gi;

/**
 * Kata kerja yang sah, tetapi kosong tanpa objek konkret.
 *
 * "Memimpin tim" tidak memberi tahu apa pun; "Memimpin tim 4 orang dalam
 * migrasi 60 komponen" memberi tahu semuanya. Yang dijadikan penanda adanya
 * objek konkret di sini adalah angka - satu-satunya penanda yang dapat
 * diperiksa tanpa menebak arti kalimatnya.
 */
const KATA_KERJA_KABUR = /\b(memimpin|mengelola|menangani|bertanggung jawab)\b/gi;

export const USUL_JAMAK =
  "Tulis apa yang Anda kerjakan sendiri: \"saya merancang...\", \"saya menguji...\". Kalimat yang subjeknya satu tim tidak memberi tahu perekrut bagian mana yang Anda kerjakan.";

export const USUL_KABUR =
  "Sebutkan objek konkretnya - berapa orang, berapa nilainya, berapa lama. Tanpa itu, kata kerja ini tidak membedakan Anda dari siapa pun.";

/**
 * Memeriksa satu kalimat.
 *
 * Sengaja tidak memeriksa seluruh CV sekaligus: temuannya harus dapat
 * ditampilkan di bawah kalimat yang menyebabkannya, bukan sebagai daftar
 * terpisah yang harus dicocokkan sendiri oleh pembacanya.
 */
export function periksaBahasa(teks: string): TemuanBahasa[] {
  const bersih = teks.trim();
  if (!bersih) return [];

  const temuan: TemuanBahasa[] = [];
  const sudah = new Set<string>();

  for (const cocok of bersih.matchAll(KATA_JAMAK)) {
    const kata = cocok[0].toLowerCase();
    if (sudah.has(kata)) continue;
    sudah.add(kata);
    temuan.push({ kata: cocok[0], usul: USUL_JAMAK });
  }

  // Kata kerja kabur hanya ditandai bila kalimatnya memang tidak menyebut
  // satu pun angka - kalau angkanya ada, objek konkretnya sudah ada.
  if (!/\d/.test(bersih)) {
    for (const cocok of bersih.matchAll(KATA_KERJA_KABUR)) {
      const kata = cocok[0].toLowerCase();
      if (sudah.has(kata)) continue;
      sudah.add(kata);
      temuan.push({ kata: cocok[0], usul: USUL_KABUR });
    }
  }

  return temuan;
}

/** Seluruh temuan pada sekumpulan kalimat, mis. daftar poin satu item. */
export function periksaBahasaBanyak(daftar: string[]): TemuanBahasa[] {
  const hasil: TemuanBahasa[] = [];
  const sudah = new Set<string>();
  for (const teks of daftar) {
    for (const temuan of periksaBahasa(teks)) {
      const kunci = temuan.kata.toLowerCase();
      if (sudah.has(kunci)) continue;
      sudah.add(kunci);
      hasil.push(temuan);
    }
  }
  return hasil;
}

/**
 * Pas foto pada CV.
 *
 * Foto disimpan sebagai **data URI** di dalam kolom `photoUrl` yang sudah ada,
 * bukan sebagai berkas di penyimpanan objek. Alasannya bukan kemalasan:
 *
 *  - Mode tanpa akun menyimpan seluruh CV sebagai satu JSON di `localStorage`
 *    peramban pengguna dan tidak pernah menyentuh server. Penyimpanan berkas
 *    di server akan memaksa mode itu punya id sesi anonim beserta pembersihan
 *    berkas yatim - infrastruktur yang ada semata-mata demi satu gambar kecil.
 *  - Satu jalur kode melayani kedua mode, sehingga tidak ada perilaku yang
 *    hanya diuji di salah satunya.
 *  - Tidak ada berkas yang bisa tertinggal setelah CV-nya dihapus.
 *
 * Yang membuat pilihan ini masuk akal adalah ukurannya: pas foto 3x4 pada
 * ukuran cetak sebenarnya hanya perlu beberapa ratus piksel. Karena itu
 * kompresi di sini **dipaksakan**, bukan disarankan - berkas 5 MB dari kamera
 * ponsel dikecilkan lebih dulu sebelum sempat masuk ke data CV.
 *
 * Kolom `photoUrl` tetap menerima tautan gambar biasa, supaya CV yang dibuat
 * sebelum fitur ini ada tidak berubah maupun putus.
 */

/** Lebar dan tinggi terbesar hasil kompresi, dalam piksel. */
export const PHOTO_MAX_WIDTH_PX = 400;
export const PHOTO_MAX_HEIGHT_PX = 533;

/**
 * Ukuran terbesar yang boleh tersimpan, dalam byte.
 *
 * Angka ini adalah jaring pengaman, bukan sasaran: pada mutu awal, pas foto
 * seukuran di atas biasanya berakhir di 30-50 KB. Batas ini baru tersentuh
 * oleh gambar yang sangat berderau, dan mutunya diturunkan bertahap lebih
 * dulu sebelum berkasnya benar-benar ditolak.
 */
export const PHOTO_MAX_BYTES = 200 * 1024;

/** Jenis berkas yang diterima pemilih berkas. */
export const PHOTO_ACCEPT = "image/jpeg,image/png,image/webp";

/**
 * Mutu JPEG yang dicoba berurutan.
 *
 * Menurunkan mutu jauh lebih baik daripada menolak berkasnya: pada pas foto
 * berlatar polos, selisih 0,82 dan 0,6 nyaris tidak terlihat di ukuran cetak
 * 3x4, sementara ukurannya bisa turun lebih dari separuh.
 */
const QUALITY_STEPS = [0.82, 0.7, 0.6, 0.5];

export type PhotoErrorReason = "type" | "read" | "tooBig";

export class PhotoError extends Error {
  constructor(readonly reason: PhotoErrorReason) {
    super(reason);
    this.name = "PhotoError";
  }
}

const DATA_URI_RE = /^data:(image\/[a-z0-9.+-]+);base64,([A-Za-z0-9+/=]+)$/i;

/** Apakah sebuah nilai `photoUrl` berupa gambar yang tertanam, bukan tautan. */
export function isEmbeddedPhoto(value: string): boolean {
  return DATA_URI_RE.test(value.trim());
}

/**
 * Memisahkan data URI menjadi jenis berkas dan muatan base64-nya.
 *
 * Muatannya dikembalikan sebagai untaian, bukan byte, supaya modul ini tetap
 * dapat dimuat di peramban - penerjemahan base64 menjadi byte berbeda antara
 * peramban dan Node, dan pemanggil di sisi server sajalah yang memerlukannya.
 */
export function parseEmbeddedPhoto(
  value: string,
): { mime: string; base64: string } | null {
  const match = DATA_URI_RE.exec(value.trim());
  if (!match) return null;
  return { mime: match[1].toLowerCase(), base64: match[2] };
}

/** Taksiran ukuran berkas sebuah data URI base64, dalam byte. */
export function embeddedPhotoBytes(value: string): number {
  const parsed = parseEmbeddedPhoto(value);
  if (!parsed) return 0;
  const { base64 } = parsed;
  const padding = base64.endsWith("==") ? 2 : base64.endsWith("=") ? 1 : 0;
  return Math.max(0, Math.floor((base64.length * 3) / 4) - padding);
}

/**
 * Mengecilkan dan mengompresi berkas gambar menjadi data URI JPEG.
 *
 * Hanya dapat dijalankan di peramban - memerlukan `createImageBitmap` dan
 * elemen `canvas`. Gambar tidak pernah diperbesar: berkas yang sudah lebih
 * kecil dari batas dibiarkan pada ukuran aslinya, karena memperbesarnya hanya
 * menambah byte tanpa menambah detail.
 */
export async function compressPhoto(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) throw new PhotoError("type");

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    throw new PhotoError("read");
  }

  try {
    const scale = Math.min(
      1,
      PHOTO_MAX_WIDTH_PX / bitmap.width,
      PHOTO_MAX_HEIGHT_PX / bitmap.height,
    );
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new PhotoError("read");

    // Latar putih digambar lebih dulu. Tanpa ini, PNG berlatar tembus pandang
    // yang diubah menjadi JPEG akan berlatar hitam - dan pas foto berlatar
    // hitam jelas bukan yang diminta pengguna.
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(bitmap, 0, 0, width, height);

    for (const quality of QUALITY_STEPS) {
      const uri = canvas.toDataURL("image/jpeg", quality);
      if (embeddedPhotoBytes(uri) <= PHOTO_MAX_BYTES) return uri;
    }
    throw new PhotoError("tooBig");
  } finally {
    bitmap.close();
  }
}

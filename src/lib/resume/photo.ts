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

/**
 * Lebar dan tinggi terbesar yang disimpan, dalam piksel.
 *
 * Angkanya dinaikkan dari 400x533 pada sesi 10, dan alasannya seluruhnya
 * tentang perbesaran.
 *
 * Pas foto 3x4 cm yang dicetak pada 300 DPI membutuhkan sekitar 354x472
 * piksel. Selama gambarnya hanya ditampilkan apa adanya, 400x533 sudah lebih
 * dari cukup - dan itu memang benar sampai foto boleh diperbesar. Pada
 * perbesaran tiga kali, yang mengisi bingkai tinggal sepertiga sisi
 * gambarnya: dari 400 piksel tersisa 133, dan hasil cetaknya pecah.
 *
 * 1200x1600 membalik hitungan itu. Pada perbesaran tiga kali, yang mengisi
 * bingkai masih 400x533 piksel - tetap di atas kebutuhan cetak 300 DPI.
 */
export const PHOTO_MAX_WIDTH_PX = 1200;
export const PHOTO_MAX_HEIGHT_PX = 1600;

/**
 * Perbesaran terkecil dan terbesar yang boleh dipilih pengguna.
 *
 * Batas atasnya bukan selera melainkan hitungan di atas: melewati tiga kali,
 * gambar yang tersimpan tidak lagi menyediakan piksel yang cukup untuk cetak
 * 300 DPI, dan yang dijanjikan fitur ini justru "tidak pecah saat diperbesar".
 */
export const PHOTO_ZOOM_MIN = 1;
export const PHOTO_ZOOM_MAX = 3;

/**
 * Ukuran terbesar yang boleh tersimpan, dalam byte.
 *
 * Angka ini adalah jaring pengaman, bukan sasaran: pada mutu awal, pas foto
 * seukuran di atas biasanya berakhir di 120-220 KB - jauh di bawah batas ini.
 * Yang dijaga batas ini adalah gambar yang sangat berderau atau berlatar
 * ramai, dan mutunya pun diturunkan bertahap lebih dulu sebelum berkasnya
 * benar-benar ditolak.
 *
 * Naik dari 200 KB ke 1 MB pada sesi 10. Kelonggaran itu berarti hampir tidak
 * ada foto yang perlu turun mutu sama sekali - dan pada fitur yang menjanjikan
 * "tidak pecah saat diperbesar", mutu yang tidak pernah diturunkan lebih
 * berharga daripada byte yang dihemat.
 *
 * Yang menjaganya tetap aman adalah tempat penyimpanannya. Mode tanpa akun
 * menaruh seluruh CV di `localStorage`, yang lazimnya berbatas 5 MB; satu foto
 * 1 MB menjadi sekitar 1,37 MB setelah base64 - masih menyisakan ruang, dan
 * kegagalan menyimpan pun sudah ditangani dengan pesan yang menyebut foto
 * sebagai isi terbesar yang paling layak dihapus lebih dulu.
 */
export const PHOTO_MAX_BYTES = 1024 * 1024;

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

/**
 * Ukuran berkas mentah terbesar yang mau dibaca sama sekali.
 *
 * Berbeda dari PHOTO_MAX_BYTES, yang berlaku pada hasil kompresi. Batas ini
 * berlaku sebelum apa pun dikerjakan, dan gunanya bukan menghemat ruang
 * melainkan menjaga peramban: membaca berkas 60 MB dari kamera lalu
 * menggambarnya ke kanvas dapat membekukan tab pada ponsel kelas menengah -
 * dan yang terlihat pengguna bukan pesan galat melainkan aplikasi yang mati.
 *
 * Dua belas megabyte jauh di atas ukuran foto ponsel mana pun yang wajar,
 * sehingga batas ini praktis hanya tersentuh oleh berkas yang memang keliru
 * dipilih - foto mentah dari kamera profesional, atau berkas yang bukan pas
 * foto sama sekali.
 */
export const PHOTO_MAX_SOURCE_BYTES = 12 * 1024 * 1024;

export type PhotoErrorReason = "type" | "read" | "tooBig" | "sourceTooBig";

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
  if (file.size > PHOTO_MAX_SOURCE_BYTES) throw new PhotoError("sourceTooBig");

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

/* -------------------------------------------------------------------------- */
/* Memanggang potongan menjadi gambar                                         */
/* -------------------------------------------------------------------------- */

/**
 * Menghasilkan gambar yang **sudah** terpotong sesuai perbesaran dan geseran.
 *
 * Dipakai jalur ekspor Word, dan hanya di sana. Halaman cetak - yang menjadi
 * PDF - tidak membutuhkannya sama sekali: ia HTML biasa, sehingga bingkai
 * ber-`overflow: hidden` beserta transform-nya bekerja apa adanya.
 *
 * Word tidak punya padanan itu. Sebuah gambar sebaris di dalam .docx selalu
 * tampil utuh, diregangkan ke ukuran yang diminta - tidak ada bingkai yang
 * memotongnya. Pustaka `docx` juga tidak mengekspos `srcRect`, satu-satunya
 * cara memotong yang dikenal OOXML. Karena itu potongannya harus benar-benar
 * dipanggang menjadi piksel sebelum gambarnya disisipkan.
 *
 * Perhitungan di bawah menirukan CSS langkah demi langkah, dan urutannya
 * penting - salah urutan menghasilkan potongan yang tampak benar pada
 * perbesaran satu lalu meleset makin jauh seiring perbesarannya naik.
 *
 * Hanya berjalan di peramban: memerlukan `createImageBitmap` dan `canvas`.
 */
export async function bakePhotoCrop(
  dataUri: string,
  crop: { zoom: number; offsetX: number; offsetY: number },
  frame: { widthMm: number; heightMm: number },
): Promise<string> {
  const zoom = clampZoom(crop.zoom);
  const offsetX = clampOffset(crop.offsetX);
  const offsetY = clampOffset(crop.offsetY);

  // Potongan netral tidak perlu digambar ulang sama sekali - dan menghindari
  // penggambaran ulang berarti menghindari satu putaran kompresi JPEG
  // tambahan pada CV yang fotonya memang belum pernah diatur.
  if (zoom === 1 && offsetX === 0 && offsetY === 0) return dataUri;

  const bitmap = await createImageBitmap(dataUriToBlob(dataUri));

  try {
    /*
      Ukuran keluaran mengikuti kebutuhan cetak, bukan ukuran sumbernya:
      3x4 cm pada 300 DPI. Menggambar lebih besar dari itu hanya menambah byte
      pada berkas Word tanpa menambah satu pun detail yang dapat dicetak.
    */
    const dpi = 300;
    const outW = Math.max(1, Math.round((frame.widthMm / 25.4) * dpi));
    const outH = Math.max(1, Math.round((frame.heightMm / 25.4) * dpi));

    /*
      Langkah 1 - `object-fit: cover`.

      Gambar diperbesar secukupnya agar menutupi bingkai, lalu dipusatkan.
      Sisi yang berlebih menggantung keluar bingkai dalam jumlah yang sama di
      kedua tepinya.
    */
    const cover = Math.max(outW / bitmap.width, outH / bitmap.height);
    const drawnW = bitmap.width * cover;
    const drawnH = bitmap.height * cover;
    const coverX = (outW - drawnW) / 2;
    const coverY = (outH - drawnH) / 2;

    /*
      Langkah 2 dan 3 - `scale()` dari titik tengah, lalu `translate()` berpersen.

      Persen pada `translate` diukur terhadap ukuran elemennya, yaitu bingkai -
      bukan terhadap gambar yang sudah diperbesar. Itu sebabnya geserannya
      dihitung dari outW dan outH, dan bukan dari drawnW dan drawnH.
    */
    const tx = (offsetX / 100) * outW;
    const ty = (offsetY / 100) * outH;
    const cx = outW / 2;
    const cy = outH / 2;

    const canvas = document.createElement("canvas");
    canvas.width = outW;
    canvas.height = outH;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new PhotoError("read");

    // Latar putih, dengan alasan yang sama seperti pada compressPhoto: apa pun
    // yang tidak tertutup gambar tidak boleh berakhir hitam.
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, outW, outH);
    ctx.imageSmoothingQuality = "high";

    /*
      Transform disusun ke dalam kanvas persis seperti CSS menyusunnya, lalu
      gambarnya digambar pada posisi cover-nya. Menghitung sendiri persegi
      sumber yang terlihat menghasilkan angka yang sama, tetapi menuntut
      pembalikan rumus di atas - dan rumus yang dibalik dengan tangan adalah
      tempat kesalahan tanda paling sering bersembunyi.
    */
    ctx.translate(tx, ty);
    ctx.translate(cx, cy);
    ctx.scale(zoom, zoom);
    ctx.translate(-cx, -cy);
    ctx.drawImage(bitmap, coverX, coverY, drawnW, drawnH);

    for (const quality of QUALITY_STEPS) {
      const uri = canvas.toDataURL("image/jpeg", quality);
      if (embeddedPhotoBytes(uri) <= PHOTO_MAX_BYTES) return uri;
    }
    throw new PhotoError("tooBig");
  } finally {
    bitmap.close();
  }
}

function clampZoom(value: number): number {
  if (!Number.isFinite(value)) return 1;
  return Math.min(PHOTO_ZOOM_MAX, Math.max(PHOTO_ZOOM_MIN, value));
}

function clampOffset(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(100, Math.max(-100, value));
}

/**
 * Mengubah data URI menjadi Blob tanpa jaringan sama sekali.
 *
 * `fetch(dataUri)` jauh lebih pendek dan merupakan cara yang lazim - dan di
 * aplikasi ini ia **tidak bekerja**. Kebijakan keamanan isinya memuat
 * `connect-src 'self'` tanpa `data:`, sehingga permintaan itu diblokir
 * peramban sebelum sempat berjalan. Ditemukan saat menguji, bukan setelah
 * dilaporkan; gejalanya akan berupa ekspor Word yang gagal hanya pada CV
 * yang fotonya diatur, dan hanya di production.
 *
 * Melonggarkan `connect-src` demi satu pemanggilan jelas bukan pertukaran
 * yang sepadan: penguraian di bawah tidak lebih dari sepuluh baris, dan
 * kebijakannya tetap seketat sebelumnya.
 */
function dataUriToBlob(dataUri: string): Blob {
  const parsed = parseEmbeddedPhoto(dataUri);
  if (!parsed) throw new PhotoError("read");

  const biner = atob(parsed.base64);
  const byte = new Uint8Array(biner.length);
  for (let i = 0; i < biner.length; i += 1) byte[i] = biner.charCodeAt(i);
  return new Blob([byte], { type: parsed.mime });
}

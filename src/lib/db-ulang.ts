/**
 * ============================================================================
 *  SATU KALI COBA LAGI UNTUK GALAT KONEKSI
 * ============================================================================
 *
 * Ada satu kelas kegagalan yang menjatuhkan seluruh halaman padahal sekali
 * coba lagi sudah beres: koneksi ke basis data yang **sudah mati sebelum
 * kuerinya sempat berjalan**. Lumbung koneksi menyerahkan koneksi yang
 * sebenarnya sudah ditutup di sisi server, kuerinya gagal seketika dengan
 * P1017, dan koneksi berikutnya - yang sehat - tidak pernah dicoba.
 *
 * Penyebabnya bukan hanya kejadian langka di komputer sendiri. Di production
 * basis datanya serverless: koneksi menganggur ditutup, instans diistirahatkan,
 * dan perantara jaringan memutus sambungan diam. `db.ts` sudah memperkecil
 * peluangnya lewat `idleTimeoutMillis` dan `keepAlive`, tetapi memperkecil
 * bukan meniadakan - selalu ada celah antara "server menutup koneksi" dan
 * "lumbung mengetahuinya".
 *
 * ----------------------------------------------------------------------------
 * EMPAT BATAS, DAN KENAPA MASING-MASING ADA
 * ----------------------------------------------------------------------------
 *
 * 1. **Sekali, bukan berkali-kali.** Yang diperbaiki di sini satu koneksi
 *    basi, dan satu percobaan sudah cukup membuktikannya. Percobaan ketiga
 *    dan seterusnya tidak lagi memperbaiki apa pun - ia hanya menunda
 *    pemberitahuan bahwa basis datanya memang sedang mati, dan menahan
 *    permintaan lain di belakangnya.
 *
 * 2. **Hanya galat tingkat koneksi.** Daftarnya sempit dan disebut satu per
 *    satu di bawah. Galat kueri - baris tidak ditemukan, pelanggaran keunikan,
 *    kunci asing - tidak pernah diulang: mengulangnya menghasilkan kegagalan
 *    yang sama persis, hanya dua kali lebih lambat.
 *
 * 3. **Hanya pembacaan.** Ini batas yang paling penting dan paling mudah
 *    dilanggar tanpa sadar. P1017 dapat terjadi **setelah** server menerima
 *    dan menjalankan pernyataannya, tetapi sebelum jawabannya kembali. Untuk
 *    pembacaan itu tidak berarti apa-apa; untuk penulisan itu berarti
 *    mengulang `create` yang mungkin sudah berhasil - dan menghasilkan baris
 *    kembar yang tidak pernah diminta siapa pun. Jangan pernah membungkus
 *    penulisan dengan fungsi ini.
 *
 * 4. **Selalu dicatat.** Percobaan ulang yang diam adalah menyembunyikan
 *    masalah; percobaan ulang yang mencatat adalah menyelamatkan pengguna
 *    tanpa menghapus buktinya. Kalau suatu hari log ini muncul berkali-kali
 *    sehari, itu bukan lagi koneksi basi melainkan basis data yang perlu
 *    diperiksa - dan yang memberitahunya justru baris log ini.
 *
 * Sengaja **tidak** dipasang sebagai perluasan klien Prisma yang berlaku
 * otomatis pada semua kueri. Perluasan begitu tidak dapat membedakan kueri
 * yang berdiri sendiri dari kueri di dalam transaksi - dan mengulang satu
 * kueri di dalam transaksi yang koneksinya sudah putus berarti menjalankannya
 * di luar transaksi itu, tanpa ada yang tahu. Dipakai di tempat yang memilih
 * memakainya, bukan di mana-mana.
 */

/**
 * ----------------------------------------------------------------------------
 * DUA KEADAAN YANG BUNYINYA MIRIP TETAPI OBATNYA BERLAWANAN
 * ----------------------------------------------------------------------------
 *
 * A. **Sambungannya putus, servernya hidup.** Koneksi ditutup di tengah jalan
 *    atau sudah mati sebelum sempat dipakai - dan koneksi berikutnya akan
 *    berhasil. Ini satu-satunya keadaan yang layak diulang.
 *
 * B. **Servernya sendiri mati atau tidak terjangkau.** Prosesnya berhenti,
 *    tidak ada yang mendengarkan di portnya, atau alamatnya salah. Mengulang
 *    tidak memperbaiki apa pun di sini - ia hanya menunda pesan yang jujur,
 *    dan membuat halaman yang seharusnya gagal cepat jadi gagal dua kali lebih
 *    lama.
 *
 * Keduanya dibedakan karena pernah tertukar. Di komputer sendiri, `prisma dev`
 * yang mati lalu hidup lagi menjadi **proses baru**; server web masih memegang
 * koneksi ke proses lama, dan koneksi ke proses yang sudah tidak ada tidak
 * pernah bisa disambung. Yang menolong menyalakan ulang server webnya, bukan
 * mengulang kuerinya.
 *
 * Keadaan A tetap nyata di production: Neon memutus koneksi yang menganggur
 * tanpa basis datanya ikut mati. Karena itu percobaan ulang ini bukan tambalan
 * untuk laptop - ia justru paling berguna di tempat yang tidak pernah dilihat
 * dari laptop.
 */

/**
 * Keadaan A - sambungan putus, layak diulang sekali.
 *
 *   P1017  server menutup sambungannya
 *   P2024  kehabisan waktu menunggu koneksi dari lumbung
 */
const KODE_KONEKSI = new Set(["P1017", "P2024"]);

/**
 * Keadaan B - basis datanya yang tidak terjangkau, jangan diulang.
 *
 *   P1001  tidak dapat menjangkau server basis data
 *   P1002  server dijangkau tetapi kehabisan waktu
 */
const KODE_MATI = new Set(["P1001", "P1002"]);
const BUNYI_MATI = [
  "econnrefused",
  "can't reach database server",
  "cannot reach database server",
  "enotfound",
];

/** Basis datanya sendiri tidak terjangkau - bukan sekadar satu koneksi. */
export function basisDataMati(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const kode = (error as { code?: unknown }).code;
  if (typeof kode === "string" && KODE_MATI.has(kode)) return true;
  const pesan = `${(error as { message?: unknown }).message ?? ""}`.toLowerCase();
  return BUNYI_MATI.some((b) => pesan.includes(b));
}

/**
 * Sebagian kegagalan datang dari driver adapter dan belum tentu membawa kode
 * Prisma. Yang dikenali di sini bunyi galatnya, dan daftarnya sengaja sesempit
 * mungkin: keliru mengenali berarti mengulang sesuatu yang tidak layak diulang.
 */
const BUNYI_KONEKSI = [
  "connectionclosed",
  "connection closed",
  "connection terminated",
  "server has closed the connection",
  "econnreset",
  "epipe",
];

/** Satu sambungan yang putus, sementara servernya sendiri masih hidup. */
export function galatKoneksi(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  // Keadaan B menang: kalau servernya memang tidak terjangkau, ini bukan
  // sekadar sambungan putus, dan mengulangnya tidak menolong siapa pun.
  if (basisDataMati(error)) return false;

  const kode = (error as { code?: unknown }).code;
  if (typeof kode === "string" && KODE_KONEKSI.has(kode)) return true;

  const pesan = `${(error as { message?: unknown }).message ?? ""}`.toLowerCase();
  return BUNYI_KONEKSI.some((b) => pesan.includes(b));
}

/**
 * Menjalankan satu **pembacaan** basis data, dan mengulanginya tepat sekali
 * bila yang gagal ternyata koneksinya.
 *
 * `konteks` ikut ke catatan server supaya baris lognya menyebutkan jalur mana
 * yang tersandung - "galat koneksi" tanpa keterangan tempat tidak menolong
 * siapa pun saat ditelusuri kemudian.
 */
export async function bacaUlangBilaKoneksiPutus<T>(
  konteks: string,
  baca: () => Promise<T>,
): Promise<T> {
  try {
    return await baca();
  } catch (error) {
    if (basisDataMati(error)) {
      console.error(
        `[db] basis data tidak terjangkau saat ${konteks}. Tidak dicoba ulang - ` +
          "yang perlu dinyalakan basis datanya, bukan permintaannya.",
      );
      throw error;
    }
    if (!galatKoneksi(error)) throw error;

    const kode = (error as { code?: unknown }).code ?? "(tanpa kode)";
    console.warn(
      `[db] koneksi putus saat ${konteks} (${String(kode)}). Mencoba sekali lagi.`,
    );

    // Jeda pendek: lumbung koneksi perlu satu putaran event loop untuk
    // membuang koneksi yang sudah mati sebelum menyerahkan yang berikutnya.
    await new Promise((selesai) => setTimeout(selesai, 120));

    try {
      const hasil = await baca();
      console.warn(`[db] percobaan kedua ${konteks} berhasil.`);
      return hasil;
    } catch (lagi) {
      // Gagal dua kali berarti bukan koneksi basi. Galatnya dilepas apa
      // adanya supaya terlihat seperti sebelum berkas ini ada.
      console.error(`[db] percobaan kedua ${konteks} juga gagal.`);
      throw lagi;
    }
  }
}

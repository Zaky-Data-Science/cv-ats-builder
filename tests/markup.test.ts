import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { check, equal, section } from "./harness";

/**
 * Menjaga agar tombol tidak pernah kembali bersarang di dalam tautan.
 *
 * Bentuk yang dilarang:
 *
 *     <Link href="/login"><Button>Masuk</Button></Link>
 *
 * Markup yang keluar `<a><button>Masuk</button></a>` - dua elemen yang dapat
 * difokuskan untuk satu perintah. Pengguna papan ketik menekan Tab dua kali
 * untuk melewati satu tombol, dan pembaca layar menyebutkannya dua kali,
 * sekali sebagai tautan dan sekali lagi sebagai tombol. HTML pun melarangnya:
 * <a> tidak boleh memuat isi interaktif.
 *
 * Diuji dengan memindai berkas sumber, bukan dengan merender - dan itu
 * disengaja. Gejalanya tidak muncul sebagai galat: halamannya terbentuk
 * normal, tampilannya sama persis, dan satu-satunya cara menemukannya lewat
 * layar adalah menekan Tab berulang kali sambil menghitung. Tidak ada
 * pemeriksaan lain di proyek ini yang akan berteriak bila bentuknya kembali,
 * dan bentuk itu memang mudah kembali: ia yang paling wajar ditulis ketika
 * seseorang menambahkan tombol tautan baru.
 *
 * Penggantinya `buttonClass()` di components/ui.tsx - kelas yang sama, satu
 * elemen saja.
 */

const AKAR = "src";

/** Semua berkas .tsx di bawah src/, tanpa urutan yang bergantung sistem berkas. */
function berkasTsx(dir: string): string[] {
  const hasil: string[] = [];
  for (const nama of readdirSync(dir)) {
    const jalur = join(dir, nama);
    if (statSync(jalur).isDirectory()) hasil.push(...berkasTsx(jalur));
    else if (nama.endsWith(".tsx")) hasil.push(jalur);
  }
  return hasil.sort();
}

/**
 * Membuang komentar sebelum memindai.
 *
 * Tanpa ini pemeriksaannya menuduh dokumentasinya sendiri: penjelasan
 * `buttonClass` di components/ui.tsx memuat contoh bentuk yang dilarang,
 * justru supaya pembacanya mengenali bentuk itu. Contoh di dalam komentar
 * bukan markup, dan tidak menghasilkan satu elemen pun.
 */
function tanpaKomentar(sumber: string): string {
  return sumber
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/^[ \t]*\/\/.*$/gm, "");
}

/**
 * Tautan yang langsung membungkus tombol.
 *
 * Sengaja tidak berusaha mengurai JSX sungguhan. Yang dicari satu bentuk
 * penulisan yang khas dan berulang; celah teoretis - misalnya tombol yang
 * bersarang beberapa lapis di dalam tautan - memang lolos, tetapi bentuk itu
 * tidak pernah ditulis di sini, dan pemeriksaan yang berpura-pura menangkap
 * segalanya lebih menyesatkan daripada yang jelas batasnya.
 */
const BERSARANG = /<Link\b[^>]*>\s*(?:\{\/\*[\s\S]*?\*\/\}\s*)?<Button\b/;

export function runMarkupTests(): void {
  section("Markup: tombol tidak bersarang di dalam tautan");

  const berkas = berkasTsx(AKAR);
  check("ada berkas .tsx yang dipindai", berkas.length > 0, `${berkas.length}`);

  const pelanggar = berkas.filter((f) =>
    BERSARANG.test(tanpaKomentar(readFileSync(f, "utf8"))),
  );

  equal(
    "tidak ada <Link> yang membungkus <Button>",
    pelanggar.join(", "),
    "",
  );

  /*
    Membuktikan pemeriksaannya memang menangkap - kalau tidak, "nol pelanggar"
    di atas sama saja dengan pemeriksaan yang selalu lulus.
  */
  check(
    "bentuk terlarang benar-benar dikenali",
    BERSARANG.test('<Link href="/x">\n  <Button size="sm">Y</Button>\n</Link>'),
  );
  check(
    "bentuk terlarang tetap dikenali walau berkomentar di antaranya",
    BERSARANG.test('<Link href="/x">\n  {/* catatan */}\n  <Button>Y</Button>\n</Link>'),
  );
  check(
    "bentuk yang benar tidak ikut dituduh",
    !BERSARANG.test('<Link href="/x" className={buttonClass()}>Y</Link>'),
  );
  check(
    "tombol biasa di dekat tautan tidak ikut dituduh",
    !BERSARANG.test('<Link href="/x">Y</Link>\n<Button>Z</Button>'),
  );
}

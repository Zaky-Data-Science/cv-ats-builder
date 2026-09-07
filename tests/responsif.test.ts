import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { check, equal, section } from "./harness";

/**
 * Menjaga dua aturan `docs/panduan-responsif.md` yang paling mudah dilanggar
 * tanpa satu pun gejala di layar.
 *
 * Sama seperti `markup.test.ts`, yang diperiksa berkas sumbernya - bukan
 * hasil renderannya - dan itu disengaja. Keduanya tidak pernah muncul sebagai
 * galat: halamannya terbentuk normal, dan satu-satunya cara menemukannya
 * lewat layar adalah membuka empat halaman pada tiga lebar sambil
 * membandingkan perilakunya.
 *
 * Batasnya jelas dan sengaja tidak dilebar-lebarkan: pemeriksaan ini menangkap
 * bentuk penulisan yang khas, bukan segala kemungkinan. Yang berniat membuat
 * laci kedua dengan nama kelas lain tetap lolos - tetapi bentuk itu bukan yang
 * paling wajar ditulis, dan pemeriksaan yang berpura-pura menangkap segalanya
 * lebih menyesatkan daripada yang jelas batasnya.
 */

const AKAR = "src";
const POLA_LACI = join("src", "components", "nav-drawer.tsx");

function berkasTsx(dir: string): string[] {
  const hasil: string[] = [];
  for (const nama of readdirSync(dir)) {
    const jalur = join(dir, nama);
    if (statSync(jalur).isDirectory()) hasil.push(...berkasTsx(jalur));
    else if (nama.endsWith(".tsx")) hasil.push(jalur);
  }
  return hasil.sort();
}

/** Membuang komentar, supaya penjelasan tidak ikut tertuduh. */
function tanpaKomentar(sumber: string): string {
  return sumber
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/^[ \t]*\/\/.*$/gm, "");
}

export function runResponsifTests(): void {
  const berkas = berkasTsx(AKAR);

  /* ---------------------------------------------------------------------- */
  section("Responsif: satu pola laci, bukan dua");

  /*
    Aturan 6 panduan itu. Bilah atas halaman aplikasi dulu tidak memakai pola
    laci sama sekali - ia menjajar sepuluh kendali dan menyembunyikan sebagian
    dengan `hidden sm:inline` - dan hasilnya pecah di ponsel sementara bilah
    atas halaman publik baik-baik saja. Yang dijaga di sini bukan "ada laci",
    melainkan "lacinya cuma satu": dua laci dengan dua perilaku lebih
    membingungkan bagi penggunanya daripada satu bilah yang penuh.

    Penandanya kelas `drawer-panel`, yang memang hanya dipakai oleh panel laci.
  */
  const pemilikPanel = berkas.filter((f) =>
    tanpaKomentar(readFileSync(f, "utf8")).includes("drawer-panel"),
  );

  equal(
    "hanya satu berkas yang menggambar panel laci",
    pemilikPanel.join(", "),
    POLA_LACI,
  );

  // Kedua bilah atas memang memakai pola itu, bukan sekadar tidak membuat
  // pola kedua.
  for (const bilah of [
    join("src", "components", "AppHeader.tsx"),
    join("src", "components", "PublicHeader.tsx"),
  ]) {
    check(
      `${bilah} memakai pola laci bersama`,
      readFileSync(bilah, "utf8").includes('from "@/components/nav-drawer"'),
      bilah,
    );
  }

  /* ---------------------------------------------------------------------- */
  section("Responsif: satu wadah halaman, bukan dua belas");

  /*
    Aturan 8 panduan itu. Lebar cangkang halaman dulu ditulis sebagai
    `max-w-6xl` beserta padding-nya masing-masing di dua belas tempat - dan
    angka yang tersebar begitu tidak pernah dapat diubah sekaligus. Semuanya
    kini memakai satu kelas `.wadah` di globals.css.

    Yang dijaga bentuk lamanya tidak kembali. `max-w-6xl` dipilih sebagai
    penandanya karena ia yang dulu dipakai, dan karena tidak ada satu pun
    alasan sah untuk menuliskannya lagi: yang butuh lebar cangkang memakai
    `.wadah`, tubuh tulisan memakai `max-w-2xl`/`max-w-3xl` atau
    `.teks-baca`, dan pengantar bagian memakai `.teks-intro`.
  */
  const memakaiWadahLama = berkas.filter((f) =>
    tanpaKomentar(readFileSync(f, "utf8")).includes("max-w-6xl"),
  );
  equal(
    "tidak ada lagi wadah `max-w-6xl` yang ditulis sendiri",
    memakaiWadahLama.join(", "),
    "",
  );

  // Dan wadahnya memang terpakai - pemeriksaan di atas juga akan lulus bila
  // seseorang menghapus wadahnya sama sekali.
  const memakaiWadah = berkas.filter((f) =>
    // Ditulis sebagai pencarian teks biasa, bukan regex. Versi regex-nya
    // sempat memuat dua karakter backspace yang terselip saat berkas ini
    // dibangkitkan, dan hasilnya nol berkas tanpa satu pun tanda bahwa
    // polanya sendiri yang rusak.
    readFileSync(f, "utf8").includes('className="wadah'),
  );
  check(
    "kelas `.wadah` dipakai di banyak halaman",
    memakaiWadah.length >= 8,
    `${memakaiWadah.length} berkas`,
  );

  /*
    Pengantar bagian memakai `.teks-intro`, bukan batas bacaan.

    Dilaporkan zaky dengan tujuh tangkapan layar: pada 1920 paragraf pengantar
    berhenti di 672px di dalam wadah 1809px dan pecah menjadi dua sampai lima
    baris, sementara judul di atasnya membentang hampir selebar halaman.

    Ini gejala yang tidak pernah muncul sebagai galat - halamannya terbentuk
    normal - jadi yang menjaganya harus pemindaian sumber, bukan perenderan.
    Dua-duanya diperiksa: kelasnya memang ada di CSS, dan ia memang dipakai.
    Pemeriksaan kedua saja akan lulus juga bila seseorang menghapus definisi
    kelasnya sehingga ia tidak berpengaruh apa-apa.
  */
  const css = readFileSync(join(AKAR, "app/globals.css"), "utf8");
  check(
    "kelas `.teks-intro` ada di globals.css",
    /\.teks-intro\s*\{[^}]*max-width:\s*none/.test(css),
    "melepas batas lebar, dibatasi `.wadah`",
  );

  const memakaiTeksIntro = berkas.filter((f) =>
    readFileSync(f, "utf8").includes("teks-intro"),
  );
  check(
    "`.teks-intro` dipakai pada pengantar bagian",
    memakaiTeksIntro.length >= 2,
    `${memakaiTeksIntro.length} berkas`,
  );

  /* ---------------------------------------------------------------------- */
  section("Markup: kendali desain menutupi kartu, tidak membungkusnya");

  /*
    Kartu desain memuat pratinjau CV, dan pratinjau itu memuat tautan kontaknya
    sendiri - surel, LinkedIn, situs. Membungkus kartu di dalam `<Link>` karena
    itu menghasilkan `<a>` di dalam `<a>`, yang dilarang HTML dan DITOLAK React
    saat menghidrasi:

      In HTML, <a> cannot be a descendant of <a>. This will cause a hydration
      error. ... this tree will be regenerated on the client.

    Akibatnya jauh melampaui kartunya. Seluruh pohon halaman dibangun ulang di
    peramban, dan atribut `data-intro` yang dipasang skrip di `<head>` ikut
    lenyap bersamanya - intro samurai hanya sempat berkedip. Terukur: atributnya
    bertahan 206 milidetik di production, dari 2200 yang dimaksudkan.

    Sudah terjadi sekali. Yang dijaga di sini bentuk yang benar: kendalinya
    saudara kartu yang dibentangkan menutupinya, bukan pembungkusnya.
  */
  const pilih = readFileSync(
    join(AKAR, "components/home/PilihDesain.tsx"),
    "utf8",
  );
  check(
    "kendali desain dibentangkan `absolute inset-0`, bukan membungkus",
    pilih.includes("absolute inset-0") &&
      !/<Link[^>]*>\s*\{children\}/.test(pilih) &&
      !/<button[^>]*>\s*\{children\}/.test(pilih),
    "membungkusnya menghasilkan <a> di dalam <a> dan mematikan hidrasi",
  );

  /* ---------------------------------------------------------------------- */
  section("Responsif: ajakan pakai desain harus terlihat di layar sentuh");

  /*
    Ajakan "Pakai desain ini" menutupi pratinjau CV dan muncul saat kursor
    datang. Di layar sentuh tidak ada kursor sama sekali - tanpa aturan
    `@media (hover: none)` ia TIDAK PERNAH muncul di sana, dan kartunya kembali
    terbaca sebagai gambar biasa yang tidak membawa ke mana-mana.

    Cacat itu mustahil terlihat di komputer mana pun, dan bahkan peramban uji
    pun berbohong: emulasi ukuran layar TIDAK mengubah `hover`/`pointer` -
    keduanya baru berubah setelah emulasi sentuh dinyalakan. Karena itu yang
    menjaganya pemindaian sumber, bukan perenderan.

    Diminta zaky dengan alasan yang tidak dapat dibantah: "orang indonesia itu
    kurang suka membaca ... jadi gimana caranya langsung praktik". Ajakan yang
    tidak pernah muncul di ponsel adalah kebalikan persis dari itu.
  */
  const cssAjakan = readFileSync(join(AKAR, "app/globals.css"), "utf8");
  const blokSentuh = /@media\s*\(hover:\s*none\)\s*\{[^}]*\.ajakan-desain\s*\{[^}]*opacity:\s*1/.test(
    cssAjakan,
  );
  check(
    "`.ajakan-desain` tetap terlihat pada `@media (hover: none)`",
    blokSentuh,
    "tanpa ini, kartunya tidak pernah terlihat dapat ditekan di ponsel",
  );

  const memakaiAjakan = berkas.filter((f) =>
    readFileSync(f, "utf8").includes("ajakan-desain"),
  );
  check(
    "ajakan dipakai pada kartu hero dan galeri desain",
    memakaiAjakan.length >= 2,
    `${memakaiAjakan.length} berkas`,
  );

  /* ---------------------------------------------------------------------- */
  section("Responsif: tombol tidak boleh diperas oleh tetangganya");

  /*
    Tombol yang menjadi flex item boleh MENYUSUT di bawah lebar isinya sendiri -
    itu perilaku bawaan flexbox, `flex-shrink` bernilai 1.

    Terjadi sungguhan di kartu ajakan halaman Panduan. Kartunya
    `sm:flex-row sm:justify-between`, dan pada 1920 tombolnya terukur 141 piksel
    sementara "Buka CV Saya" beserta ikon dan paddingnya menuntut 150. Kurang
    sembilan piksel, dan labelnya pecah dua baris di dalam kotak setinggi 40
    piksel yang tidak ikut memanjang; ikon panahnya terlempar ke tepi kanan,
    terlepas dari tulisannya.

    Yang membuatnya lolos sekian lama: hanya terlihat bagi pengguna yang SUDAH
    MASUK. Label bagi yang belum masuk - "Mulai Sekarang" - memang lebih pendek
    dan muat, jadi memeriksanya tanpa akun tidak menemukan apa pun.

    Pemeriksaannya sengaja sempit dan menyebut satu berkas: ia menjaga satu
    kejadian nyata, bukan mencoba menebak pola. Bila kelak ada kartu lain
    berbentuk sama, tambahkan barisnya di sini.
  */
  const panduan = readFileSync(join(AKAR, "app/panduan/page.tsx"), "utf8");
  const tombolAjakan = panduan.slice(panduan.indexOf('href="/login"'));
  const kelasTombol = tombolAjakan.slice(0, 400);
  check(
    "tombol ajakan Panduan tidak dapat diperas tetangganya",
    kelasTombol.includes("shrink-0") &&
      kelasTombol.includes("whitespace-nowrap"),
    "`shrink-0` menjaga lebarnya, `whitespace-nowrap` menjaga satu barisnya",
  );

  /* ---------------------------------------------------------------------- */
  section("Responsif: lencana peran tidak boleh disembunyikan");

  /*
    Aturan 4 panduan itu menempatkan penanda peran di lapis "wajib terlihat",
    bukan "sisanya", dan alasannya tertulis di sana: penanda yang tersembunyi
    membuat penggunanya tidak tahu ia sedang masuk sebagai siapa - masalah
    yang sudah pernah terjadi di proyek ini.

    Bentuk yang dilarang persis yang dulu ada:

        className="hidden ... sm:inline"   pada elemen yang memuat adminBadge

    Diperiksa dengan melihat atribut `className` yang berada pada elemen yang
    sama dengan `t.app.adminBadge`. Bukan penguraian JSX sungguhan - yang
    dicari satu bentuk penulisan yang khas.
  */
  const appHeader = tanpaKomentar(
    readFileSync(join("src", "components", "AppHeader.tsx"), "utf8"),
  );

  /*
    Yang diambil HANYA tag pembuka elemen lencananya sendiri, bukan sepotong
    berkas di sekitarnya. Percobaan pertama memakai jendela 600 karakter, dan
    itu menjangkau mundur sampai ke tautan logo di atasnya - yang memang
    memakai `hidden ... sm:inline` untuk nama aplikasi, dan sah. Pemeriksaan
    yang menuduh tetangganya lebih buruk daripada tidak ada pemeriksaan.
  */
  const tandaLencana = appHeader.indexOf("t.app.adminBadge}");
  const blokLencana = appHeader.slice(
    appHeader.lastIndexOf("<span", tandaLencana),
    tandaLencana,
  );

  check(
    "lencana pengelola ada di bilah aplikasi",
    appHeader.includes("t.app.adminBadge}"),
  );
  check(
    "yang diperiksa memang tag pembuka lencananya",
    tandaLencana > 0 && !blokLencana.includes("</span>"),
  );
  check(
    "lencana pengelola tidak dibungkus kelas `hidden`",
    !/className="[^"]*\bhidden\b[^"]*"/.test(blokLencana),
    blokLencana.match(/className="[^"]*"/)?.[0]?.slice(0, 60) ?? "tanpa kelas",
  );

  /* ---------------------------------------------------------------------- */
  section("Responsif: alamat surel tetap dapat dijangkau");

  /*
    Aturan 5 panduan itu: yang disembunyikan di layar sempit harus tetap dapat
    dijangkau lewat jalan lain. Alamat surel tidak lagi tercetak di bilah -
    ruangnya memang tidak ada - jadi ia wajib muncul di dalam laci ATAU di
    dalam menu akun. Dua akun Google bisa bernama sama persis; alamatnya
    selalu berbeda.
  */
  const jumlahEmail = (appHeader.match(/\{email\}/g) ?? []).length;
  check(
    "alamat surel dicetak di laci dan di menu akun",
    jumlahEmail >= 2,
    `${jumlahEmail} tempat`,
  );
}

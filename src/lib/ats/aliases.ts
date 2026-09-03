/**
 * Kelompok padanan kata kunci.
 *
 * Daftar ini menjawab satu kelemahan nyata pencocokan leksikal: iklan
 * lowongan dan CV kerap menyebut hal yang sama dengan nama berbeda -
 * singkatan lawan kepanjangannya ("SDM" dan "sumber daya manusia"), atau
 * istilah Indonesia lawan padanan Inggrisnya yang sudah baku sebagai nama
 * keahlian ("penjualan" dan "sales").
 *
 * Bentuk daftarnya sengaja berupa kelompok, bukan pasangan berarah: setiap
 * anggota dianggap setara dengan seluruh anggota lain di kelompoknya,
 * sehingga tidak ada arah yang bisa terlupa ditulis.
 *
 * Yang TIDAK dimasukkan ke sini, dan alasannya:
 *
 *  - **Perbedaan yang hanya soal tanda hubung atau spasi.** "front-end",
 *    "front end", dan "frontend" sudah disamakan oleh `canonical()` di
 *    `keywords.ts`, jadi menuliskannya di sini hanya akan menjadi baris mati.
 *  - **Sinonim umum bahasa.** Daftar ini memuat nama keahlian dan istilah
 *    jabatan, bukan kamus. Menerjemahkan kata biasa akan membuat pencocokan
 *    kehilangan makna: sebuah CV tidak menjadi cocok untuk lowongan hanya
 *    karena memakai kata yang searti.
 *  - **Singkatan yang bermakna ganda.** "PM" (manajer proyek atau produk),
 *    "CS" (layanan pelanggan atau ilmu komputer), dan "MS" sengaja
 *    dihilangkan - kecocokan palsu lebih merugikan daripada kecocokan yang
 *    terlewat, sebab pengguna memercayai skornya.
 *
 * Penambahan di sini murni data: tidak ada logika yang perlu ikut diubah.
 */
export const ALIAS_GROUPS: readonly (readonly string[])[] = [
  // --- Bahasa dan pustaka pemrograman -------------------------------------
  ["js", "javascript"],
  ["ts", "typescript"],
  ["c++", "cpp"],
  ["c#", "csharp"],
  ["go", "golang"],
  [".net", "dotnet"],
  ["node", "nodejs"],
  ["react", "reactjs"],
  ["vue", "vuejs"],
  ["angular", "angularjs"],
  ["express", "expressjs"],
  ["postgres", "postgresql"],
  ["mongo", "mongodb"],
  ["mssql", "sql server", "microsoft sql server"],

  // --- Praktik dan konsep rekayasa perangkat lunak ------------------------
  ["ci", "continuous integration"],
  ["cd", "continuous delivery", "continuous deployment"],
  ["oop", "object oriented programming", "pemrograman berorientasi objek"],
  ["tdd", "test driven development"],
  ["rest", "restful"],
  ["api", "antarmuka pemrograman"],
  ["db", "database", "basis data"],
  ["etl", "extract transform load"],
  ["ui ux", "ux ui"],

  // --- Awan dan infrastruktur ---------------------------------------------
  ["k8s", "kubernetes"],
  ["aws", "amazon web services"],
  ["gcp", "google cloud", "google cloud platform"],
  ["saas", "software as a service"],
  ["wfh", "work from home", "kerja dari rumah"],

  // --- Data dan kecerdasan buatan -----------------------------------------
  ["ml", "machine learning", "pembelajaran mesin"],
  ["ai", "artificial intelligence", "kecerdasan buatan"],
  ["bi", "business intelligence"],
  ["analis data", "data analyst"],

  // --- Rancangan dan pengalaman pengguna ----------------------------------
  ["ui", "user interface", "antarmuka pengguna"],
  ["ux", "user experience", "pengalaman pengguna"],
  ["qa", "quality assurance", "penjaminan mutu"],

  // --- Bisnis, pemasaran, dan operasi -------------------------------------
  ["seo", "search engine optimization", "optimasi mesin pencari"],
  ["crm", "customer relationship management"],
  ["erp", "enterprise resource planning"],
  ["kpi", "key performance indicator", "indikator kinerja utama"],
  ["sop", "standard operating procedure", "prosedur operasional standar"],
  ["b2b", "business to business"],
  ["b2c", "business to consumer"],
  ["hr", "human resources", "sdm", "sumber daya manusia"],
  ["penjualan", "sales"],
  ["pemasaran", "marketing"],
  ["pemasaran digital", "digital marketing"],
  ["akuntansi", "accounting"],
  ["keuangan", "finance"],
  ["layanan pelanggan", "customer service"],
  ["gudang", "warehouse"],
  ["manajemen proyek", "project management"],

  // --- Perkakas perkantoran -----------------------------------------------
  ["excel", "microsoft excel", "ms excel"],
  ["word", "microsoft word", "ms word"],
  ["powerpoint", "microsoft powerpoint", "ppt"],
  ["office", "microsoft office", "ms office"],
  ["photoshop", "adobe photoshop"],

  // --- Teknik dan keselamatan kerja ---------------------------------------
  ["k3", "keselamatan kerja", "hse"],
  ["teknik sipil", "civil engineering"],
  ["teknik mesin", "mechanical engineering"],
  ["teknik elektro", "electrical engineering"],
  ["teknik komputer", "computer engineering"],

  // --- Status dan jenjang --------------------------------------------------
  ["magang", "internship", "intern"],
  ["fresh graduate", "lulusan baru"],
  ["fulltime", "penuh waktu"],
  ["part time", "paruh waktu"],
  ["ipk", "gpa"],
  ["s1", "sarjana"],
];

import {
  bacaUlangBilaKoneksiPutus,
  basisDataMati,
  galatKoneksi,
} from "../src/lib/db-ulang";
import { check, equal, section } from "./harness";

/**
 * Percobaan ulang satu kali untuk galat koneksi.
 *
 * Yang diuji di sini dua arah sekaligus, dan arah keduanya yang paling
 * penting: bukan hanya bahwa galat koneksi diulang, tetapi bahwa galat lain
 * **tidak**. Percobaan ulang yang terlalu murah hati mengubah kegagalan yang
 * seharusnya langsung terlihat menjadi kegagalan yang datang dua kali lebih
 * lambat - dan pada penulisan, menjadi baris kembar.
 */
export async function runDbUlangTests(): Promise<void> {
  section("Galat koneksi dikenali, galat lain tidak");

  const p = (code: string) => Object.assign(new Error("gagal"), { code });

  check("P1017 - server menutup sambungan", galatKoneksi(p("P1017")));
  check("P2024 - kehabisan koneksi di lumbung", galatKoneksi(p("P2024")));
  check(
    "galat adapter tanpa kode Prisma dikenali dari bunyinya",
    galatKoneksi(new Error("DriverAdapterError: ConnectionClosed")),
  );

  check("P2002 - pelanggaran keunikan BUKAN galat koneksi", !galatKoneksi(p("P2002")));
  check("P2025 - baris tidak ditemukan BUKAN galat koneksi", !galatKoneksi(p("P2025")));
  check("P2003 - kunci asing BUKAN galat koneksi", !galatKoneksi(p("P2003")));
  check("galat biasa tanpa kode", !galatKoneksi(new Error("apa saja")));
  check("bukan objek galat sama sekali", !galatKoneksi("P1017"));

  /*
    Basis data yang MATI bukan sambungan yang putus, dan bedanya menentukan
    obatnya. Mengulang permintaan ke server yang prosesnya sudah berhenti
    tidak memperbaiki apa pun - ia hanya menunda pesan yang jujur.
  */
  check("P1001 - server tidak terjangkau = basis data mati", basisDataMati(p("P1001")));
  check("P1002 - kehabisan waktu menjangkau = basis data mati", basisDataMati(p("P1002")));
  check(
    "ECONNREFUSED dikenali sebagai basis data mati",
    basisDataMati(new Error("connect ECONNREFUSED 127.0.0.1:51214")),
  );
  check("dan karena itu TIDAK dihitung sambungan putus", !galatKoneksi(p("P1001")));
  check("P1017 bukan basis data mati", !basisDataMati(p("P1017")));

  /* ---------------------------------------------------------------- */

  section("Perilaku percobaan ulang");

  // console.warn dibungkam selama blok ini: yang diuji perilakunya, bukan
  // keluarannya, dan barisnya akan mengaburkan hasil uji lain.
  const warnAsli = console.warn;
  const errorAsli = console.error;
  console.warn = () => {};
  console.error = () => {};

  try {
    let panggilan = 0;
    const pulih = await bacaUlangBilaKoneksiPutus("uji", async () => {
      panggilan += 1;
      if (panggilan === 1) throw p("P1017");
      return "berhasil";
    });
    equal("koneksi putus sekali lalu pulih", pulih, "berhasil");
    equal("dicoba tepat dua kali, tidak lebih", panggilan, 2);

    let panggilanSukses = 0;
    await bacaUlangBilaKoneksiPutus("uji", async () => {
      panggilanSukses += 1;
      return "langsung";
    });
    equal("yang berhasil sejak awal tidak diulang", panggilanSukses, 1);

    let panggilanLain = 0;
    let pesanLain = "";
    try {
      await bacaUlangBilaKoneksiPutus("uji", async () => {
        panggilanLain += 1;
        throw p("P2002");
      });
    } catch (e) {
      pesanLain = (e as { code?: string }).code ?? "";
    }
    equal("galat bukan koneksi TIDAK diulang", panggilanLain, 1);
    equal("dan galatnya dilepas apa adanya", pesanLain, "P2002");

    let panggilanMati = 0;
    let kodeMati = "";
    try {
      await bacaUlangBilaKoneksiPutus("uji", async () => {
        panggilanMati += 1;
        throw p("P1001");
      });
    } catch (e) {
      kodeMati = (e as { code?: string }).code ?? "";
    }
    equal("basis data mati TIDAK diulang", panggilanMati, 1);
    equal("galatnya langsung dilepas apa adanya", kodeMati, "P1001");

    let panggilanGagal = 0;
    let kodeAkhir = "";
    try {
      await bacaUlangBilaKoneksiPutus("uji", async () => {
        panggilanGagal += 1;
        throw p("P1017");
      });
    } catch (e) {
      kodeAkhir = (e as { code?: string }).code ?? "";
    }
    equal("gagal dua kali berarti berhenti, bukan mencoba ketiga", panggilanGagal, 2);
    equal("galatnya tetap sampai ke pemanggil", kodeAkhir, "P1017");
  } finally {
    console.warn = warnAsli;
    console.error = errorAsli;
  }
}

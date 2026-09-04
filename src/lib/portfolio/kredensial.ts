import { formatMonth } from "@/lib/utils";
import type { CertificationItem, ResumeLanguage } from "@/lib/resume/types";
import { LABEL_KATEGORI_KREDENSIAL, MASA_BERLAKU_LABEL } from "./ambang-profesi";

/**
 * ============================================================================
 *  KREDENSIAL - BENTUK SAAT DICETAK
 * ============================================================================
 *
 * Satu tempat, tiga keluaran - alasan yang sama dengan item portofolio.
 *
 * Yang paling penting benar di sini adalah baris masa berlakunya. Sejak
 * UU 17/2023 beserta aturan pelaksananya, STR Definitif berlaku **seumur
 * hidup**; yang tetap berbatas waktu hanya STR Internsip, Pendidikan,
 * Adaptasi, Penambahan Kompetensi, Sementara, dan Bersyarat. Aplikasi CV yang
 * hanya menerima tanggal kedaluwarsa memaksa ratusan ribu tenaga kesehatan
 * mengarang tanggal yang tidak ada - dan itu kesalahan yang paling lazim
 * ditemui di aplikasi sejenis setelah undang-undang itu berlaku.
 */

/** Keterangan masa berlaku, atau "" bila memang tidak ada yang perlu ditulis. */
export function masaBerlakuTeks(
  kredensial: CertificationItem,
  lang: ResumeLanguage = "ID",
): string {
  const sampai = (tanggal: string) =>
    lang === "EN"
      ? `Valid until ${formatMonth(tanggal, lang)}`
      : `Berlaku sampai ${formatMonth(tanggal, lang)}`;

  switch (kredensial.masaBerlaku) {
    case "seumur-hidup":
      return lang === "EN" ? "Valid for life" : "Berlaku seumur hidup";
    case "tidak-berlaku":
      return "";
    case "tanggal":
      return kredensial.expiryDate ? sampai(kredensial.expiryDate) : "";
    default:
      /*
        Kredensial yang ditulis sebelum kolom ini ada tidak mencetak apa pun.

        Tanggal kedaluwarsanya memang tersimpan, dan memang tidak pernah
        tercetak sebelum ini. Mulai mencetaknya sekarang akan mengubah isi PDF
        yang sudah diperiksa dan dikirim penggunanya - tanpa ia pernah meminta
        apa pun. Begitu ia memilih bentuk masa berlakunya di formulir, barulah
        ia tercetak.
      */
      return "";
  }
}

/**
 * Baris keterangan tambahan: kategori, jenjang, klasifikasi, dan sub-tipenya.
 *
 * Jenjang dan klasifikasi bukan hiasan. SKK Konstruksi punya sembilan jenjang
 * dan delapan klasifikasi, dan yang menentukan kelayakan seseorang mengambil
 * paket pekerjaan adalah kombinasi keduanya - bukan nama sertifikatnya.
 */
export function keteranganKredensial(kredensial: CertificationItem): string {
  const bagian: string[] = [];
  if (kredensial.kategori) {
    bagian.push(LABEL_KATEGORI_KREDENSIAL[kredensial.kategori]);
  }
  if (kredensial.jenjang.trim()) bagian.push(kredensial.jenjang.trim());
  if (kredensial.klasifikasi.trim()) bagian.push(kredensial.klasifikasi.trim());
  if (kredensial.subTipe.trim()) bagian.push(kredensial.subTipe.trim());
  return bagian.join(" · ");
}

/** Label pilihan masa berlaku untuk formulir. */
export { MASA_BERLAKU_LABEL, LABEL_KATEGORI_KREDENSIAL };

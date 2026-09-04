import { newId } from "@/lib/utils";
import type { ProjectItem, ResumeData } from "@/lib/resume/types";
import { entriKamus } from "./kamus-bidang";
import { verifikatorKosong } from "./migrasi";
import type { DetailTambahan, IntiValue, PolaSchema } from "./types";

/**
 * ============================================================================
 *  ITEM CONTOH
 * ============================================================================
 *
 * Tombol "Isi dengan contoh" tidak mengisi teks pengisi. Ia mengisi satu item
 * yang benar-benar layak dikirim, lalu pengguna menyuntingnya menjadi miliknya
 * sendiri.
 *
 * Isinya dirakit dari tiga sumber yang masing-masing memang sudah ada:
 *
 *   - kerangkanya dari `PolaSchema.contoh` - judul, peran, konteks, ringkasan,
 *     poin;
 *   - nilai field intinya dari `placeholder` tiap FieldDef, yang sejak awal
 *     memang ditulis sebagai contoh nyata, bukan sebagai "isi di sini";
 *   - slot detail tambahannya dari `saranDetailTambahan` entri kamus bidangnya.
 *
 * Karena itu contoh untuk mahasiswa teknik sipil berbeda dari contoh untuk
 * dokter tanpa satu pun teks contoh ditulis dua kali.
 */
export function buatContohItem(
  data: ResumeData,
  schema: PolaSchema,
): ProjectItem {
  const kamus = data.profilPortofolio.bidangKamus
    ? entriKamus(data.profilPortofolio.bidangKamus)
    : undefined;

  const inti: Record<string, IntiValue> = {};
  for (const field of schema.fieldInti) {
    // Field yang punya rumah sendiri di CV diisi lewat field umumnya, bukan
    // lewat `inti` - kalau tidak, isinya tercetak dua kali.
    if (field.simpanDi) continue;

    if (field.tipe === "multi") {
      const saran = kamus?.saranIsiFieldInti?.[field.key] ?? field.opsi ?? [];
      inti[field.key] = saran.slice(0, 3);
      if ((inti[field.key] as string[]).length === 0) {
        inti[field.key] = field.placeholder
          .split(",")
          .map((v) => v.trim())
          .filter(Boolean)
          .slice(0, 3);
      }
      continue;
    }

    if (field.tipe === "delta" && field.komponen) {
      // Dibiarkan kosong pada komponen sebelum/sesudah: angka yang dikarang
      // di sini akan tampak seolah hasil pengukuran sungguhan, dan itu hal
      // terakhir yang boleh diajarkan aplikasi ini kepada penggunanya.
      inti[field.key] = [field.label, "", "", ""];
      continue;
    }

    inti[field.key] = field.placeholder;
  }

  const detailTambahan: DetailTambahan[] = (kamus?.saranDetailTambahan ?? [])
    .slice(0, 3)
    .map((saran) => ({
      label: saran.label,
      nilai: "",
      satuan: saran.satuan ?? "",
      prioritas: saran.prioritas,
    }));

  return {
    id: newId(),
    name: schema.contoh.judul,
    role: schema.contoh.peran,
    url: "",
    startDate: "",
    endDate: "",
    bullets: schema.contoh.poin.length > 0 ? [...schema.contoh.poin] : [""],
    konteks: schema.contoh.konteks,
    lokasi: "",
    ringkasan: schema.contoh.ringkasan,
    tautan: [],
    kataKunci: [],
    inti,
    detailTambahan,
    verifikator: verifikatorKosong(),
    refleksi: "",
    polaOverride: "",
    parentPengalamanId: "",
    arsip: {},
  };
}

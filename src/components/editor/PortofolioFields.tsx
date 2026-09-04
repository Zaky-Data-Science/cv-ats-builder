"use client";

import * as React from "react";
import { ChevronDown, Plus, Trash2, X } from "lucide-react";
import { useI18n } from "@/components/i18n";
import { Button, Field, Input, Select, Textarea } from "@/components/ui";
import { entriKamus } from "@/lib/portfolio/kamus-bidang";
import { MAKS_TAUTAN } from "@/lib/portfolio/render";
import type {
  DetailTambahan,
  EntriKamus,
  FieldDef,
  IntiValue,
  TautanPortofolio,
  Verifikator,
} from "@/lib/portfolio/types";
import { cn } from "@/lib/utils";

/**
 * ============================================================================
 *  PENYUNTING FIELD PORTOFOLIO
 * ============================================================================
 *
 * Seluruh bentuk isian di berkas ini dibaca dari `FieldDef` - tipe, label,
 * pilihan, contoh, dan kalimat bantuannya. Tidak ada satu pun `if (pola ===
 * ...)` maupun `if (bidang === ...)`, dan itu memang syaratnya: begitu ada
 * satu saja, menambah profesi baru berhenti menjadi "tambah satu entri kamus"
 * dan kembali menjadi "sunting komponen".
 */

/* -------------------------------------------------------------------------- */
/* Blok yang bisa dilipat                                                     */
/* -------------------------------------------------------------------------- */

export function Lipat({
  judul,
  keterangan,
  jumlah,
  bukaAwal = false,
  children,
}: {
  judul: string;
  keterangan?: string;
  jumlah?: number;
  bukaAwal?: boolean;
  children: React.ReactNode;
}) {
  const [buka, setBuka] = React.useState(bukaAwal);
  return (
    <div className="rounded-lg border border-ink-200 bg-white">
      <button
        type="button"
        onClick={() => setBuka((n) => !n)}
        aria-expanded={buka}
        className="flex w-full items-center gap-2 px-3 py-2 text-left"
      >
        <ChevronDown
          size={13}
          className={cn("shrink-0 text-ink-400 transition-transform", !buka && "-rotate-90")}
        />
        <span className="text-xs font-semibold text-ink-800">{judul}</span>
        {jumlah !== undefined && jumlah > 0 && (
          <span className="rounded-full bg-ink-100 px-1.5 text-[10px] text-ink-600">
            {jumlah}
          </span>
        )}
      </button>
      {buka && (
        <div className="space-y-3 border-t border-ink-100 px-3 pt-3 pb-3.5">
          {keterangan && (
            <p className="text-[11px] leading-relaxed text-ink-500">{keterangan}</p>
          )}
          {children}
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Satu field inti                                                            */
/* -------------------------------------------------------------------------- */

function nilaiTeks(nilai: IntiValue | undefined): string {
  if (nilai === undefined) return "";
  if (Array.isArray(nilai)) return nilai.join(", ");
  return String(nilai);
}

function nilaiDaftar(nilai: IntiValue | undefined): string[] {
  if (Array.isArray(nilai)) return nilai;
  if (typeof nilai === "string" && nilai.trim()) {
    return nilai.split(",").map((v) => v.trim()).filter(Boolean);
  }
  return [];
}

/**
 * Satu field inti, bentuknya ditentukan `tipe` pada definisinya.
 *
 * Tipe `multi` sengaja tidak memakai kotak centang panjang: daftar opsinya bisa
 * memuat dua puluhan entri, dan mencentang satu per satu di layar ponsel bukan
 * pekerjaan yang menyenangkan. Yang dipakai adalah keping - opsi kamus tampil
 * lebih dulu, dan apa pun yang tidak ada di sana tetap bisa diketik sendiri.
 */
export function FieldIntiInput({
  field,
  nilai,
  onChange,
  saranTambahan,
}: {
  field: FieldDef;
  nilai: IntiValue | undefined;
  onChange: (nilai: IntiValue) => void;
  saranTambahan?: string[];
}) {
  const bantuan = field.bantuan;

  if (field.tipe === "pilihan") {
    return (
      <Field label={field.label} hint={bantuan} required={field.wajib}>
        <Select
          value={nilaiTeks(nilai)}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">-</option>
          {(field.opsi ?? []).map((opsi) => (
            <option key={opsi} value={opsi}>
              {opsi}
            </option>
          ))}
        </Select>
      </Field>
    );
  }

  if (field.tipe === "multi") {
    const dipilih = nilaiDaftar(nilai);
    const saran = [...(saranTambahan ?? []), ...(field.opsi ?? [])].filter(
      (opsi, index, semua) => semua.indexOf(opsi) === index,
    );
    return (
      <Field label={field.label} hint={bantuan} required={field.wajib}>
        <KepingPilihan
          dipilih={dipilih}
          saran={saran}
          placeholder={field.placeholder}
          onChange={onChange}
        />
      </Field>
    );
  }

  if (field.tipe === "delta") {
    const bagian = Array.isArray(nilai)
      ? nilai
      : [typeof nilai === "string" ? nilai : "", "", "", ""];
    const komponen = field.komponen ?? ["Metrik", "Sebelum", "Sesudah", "Waktu"];
    return (
      <Field label={field.label} hint={bantuan} required={field.wajib}>
        <div className="grid gap-2 sm:grid-cols-2">
          {komponen.map((nama, index) => (
            <Input
              key={nama}
              value={bagian[index] ?? ""}
              aria-label={`${field.label} - ${nama}`}
              placeholder={nama}
              onChange={(e) => {
                const berikut = [0, 1, 2, 3].map((i) =>
                  i === index ? e.target.value : (bagian[i] ?? ""),
                );
                onChange(berikut);
              }}
            />
          ))}
        </div>
        <p className="mt-1 text-[11px] text-ink-500">{field.placeholder}</p>
      </Field>
    );
  }

  if (field.tipe === "teks_panjang") {
    return (
      <Field label={field.label} hint={bantuan} required={field.wajib}>
        <Textarea
          rows={3}
          value={nilaiTeks(nilai)}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      </Field>
    );
  }

  return (
    <Field label={field.label} hint={bantuan} required={field.wajib}>
      <Input
        value={nilaiTeks(nilai)}
        placeholder={field.placeholder}
        inputMode={field.tipe === "angka" ? "numeric" : undefined}
        onChange={(e) => onChange(e.target.value)}
      />
    </Field>
  );
}

/** Keping pilihan: saran kamus lebih menonjol, ketikan bebas tetap diterima. */
function KepingPilihan({
  dipilih,
  saran,
  placeholder,
  onChange,
}: {
  dipilih: string[];
  saran: string[];
  placeholder: string;
  onChange: (nilai: string[]) => void;
}) {
  const [ketikan, setKetikan] = React.useState("");

  const tambah = (nilai: string) => {
    const bersih = nilai.trim();
    if (!bersih || dipilih.includes(bersih)) return;
    onChange([...dipilih, bersih]);
    setKetikan("");
  };

  return (
    <div className="space-y-2">
      {dipilih.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {dipilih.map((nilai) => (
            <span
              key={nilai}
              className="inline-flex items-center gap-1 rounded-full border border-brand-300 bg-brand-50/60 px-2 py-0.5 text-[11px] text-ink-800"
            >
              {nilai}
              <button
                type="button"
                aria-label={`Hapus ${nilai}`}
                onClick={() => onChange(dipilih.filter((v) => v !== nilai))}
                className="text-ink-500 hover:text-bad"
              >
                <X size={11} />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <Input
          value={ketikan}
          placeholder={placeholder}
          onChange={(e) => setKetikan(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              tambah(ketikan);
            }
          }}
        />
        <Button size="sm" variant="outline" onClick={() => tambah(ketikan)}>
          <Plus size={13} />
        </Button>
      </div>

      {saran.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {saran
            .filter((opsi) => !dipilih.includes(opsi))
            .slice(0, 12)
            .map((opsi) => (
              <button
                key={opsi}
                type="button"
                onClick={() => tambah(opsi)}
                className="rounded-full border border-ink-200 px-2 py-0.5 text-[11px] text-ink-600 transition-colors hover:bg-ink-50"
              >
                + {opsi}
              </button>
            ))}
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Slot fleksibel                                                             */
/* -------------------------------------------------------------------------- */

const MAKS_DETAIL = 6;

/**
 * Detail tambahan - rumah bagi isian khas bidang yang tidak masuk field inti.
 *
 * Tiga penjaga supaya ia tidak berubah menjadi tempat sampah: batas enam
 * entri, saran dari kamus yang ditawarkan lebih dulu daripada ketikan bebas,
 * dan keterangan terus terang bahwa hanya empat prioritas teratas yang
 * benar-benar tercetak.
 */
export function DetailTambahanEditor({
  detail,
  saran,
  onChange,
}: {
  detail: DetailTambahan[];
  saran: EntriKamus["saranDetailTambahan"];
  onChange: (detail: DetailTambahan[]) => void;
}) {
  const { t } = useI18n();
  const teks = t.portofolio;

  const set = (index: number, patch: Partial<DetailTambahan>) =>
    onChange(detail.map((d, i) => (i === index ? { ...d, ...patch } : d)));

  const tidakDicetak = Math.max(
    0,
    detail.filter((d) => d.label.trim() && d.nilai.trim()).length - 4,
  );

  const belumDipakai = saran.filter(
    (s) => !detail.some((d) => d.label.trim() === s.label),
  );

  return (
    <div className="space-y-2">
      {detail.map((d, index) => (
        <div key={index} className="flex items-start gap-2">
          <div className="grid flex-1 gap-2 sm:grid-cols-[1.2fr_1fr_0.6fr]">
            <Input
              value={d.label}
              aria-label={teks.detailLabelPh}
              placeholder={teks.detailLabelPh}
              onChange={(e) => set(index, { label: e.target.value })}
            />
            <Input
              value={d.nilai}
              aria-label={teks.detailValuePh}
              placeholder={teks.detailValuePh}
              onChange={(e) => set(index, { nilai: e.target.value })}
            />
            <Input
              value={d.satuan}
              aria-label={teks.detailUnitPh}
              placeholder={teks.detailUnitPh}
              onChange={(e) => set(index, { satuan: e.target.value })}
            />
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="mt-1"
            aria-label={`${teks.extraBlock} ${index + 1}`}
            onClick={() => onChange(detail.filter((_, i) => i !== index))}
          >
            <Trash2 size={13} className="text-bad" />
          </Button>
        </div>
      ))}

      {tidakDicetak > 0 && (
        <p className="rounded-md bg-ink-50 px-2 py-1 text-[11px] text-ink-600">
          {teks.detailNotPrinted.replace("{n}", String(tidakDicetak))}
        </p>
      )}

      {detail.length < MAKS_DETAIL && belumDipakai.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {belumDipakai.slice(0, 8).map((s) => (
            <button
              key={s.label}
              type="button"
              onClick={() =>
                onChange([
                  ...detail,
                  {
                    label: s.label,
                    nilai: "",
                    satuan: s.satuan ?? "",
                    prioritas: s.prioritas,
                  },
                ])
              }
              className="rounded-full border border-ink-200 px-2 py-0.5 text-[11px] text-ink-600 transition-colors hover:bg-ink-50"
            >
              + {s.label}
            </button>
          ))}
        </div>
      )}

      {detail.length < MAKS_DETAIL ? (
        <Button
          size="sm"
          variant="ghost"
          onClick={() =>
            onChange([
              ...detail,
              { label: "", nilai: "", satuan: "", prioritas: detail.length + 1 },
            ])
          }
        >
          <Plus size={13} />
          {teks.addDetail}
        </Button>
      ) : (
        <p className="text-[11px] text-ink-500">{teks.detailMax}</p>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Tautan                                                                     */
/* -------------------------------------------------------------------------- */

/** Pemendek tautan yang ditolak, beserta alasannya yang jujur. */
const PEMENDEK = [
  "bit.ly",
  "tinyurl.com",
  "goo.gl",
  "t.co",
  "ow.ly",
  "s.id",
  "cutt.ly",
  "rebrand.ly",
  "shorturl.at",
  "linktr.ee",
];

export function adalahPemendek(url: string): boolean {
  const bersih = url
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "");
  return PEMENDEK.some(
    (host) => bersih === host || bersih.startsWith(`${host}/`),
  );
}

export function TautanEditor({
  tautan,
  placeholder,
  onChange,
}: {
  tautan: TautanPortofolio[];
  placeholder: string;
  onChange: (tautan: TautanPortofolio[]) => void;
}) {
  const { t } = useI18n();
  const teks = t.portofolio;

  const set = (index: number, patch: Partial<TautanPortofolio>) =>
    onChange(tautan.map((v, i) => (i === index ? { ...v, ...patch } : v)));

  return (
    <Field label={teks.linksLabel} hint={teks.linksHint}>
      <div className="space-y-2">
        {tautan.map((v, index) => (
          <div key={index} className="space-y-1">
            <div className="flex items-start gap-2">
              <div className="grid flex-1 gap-2 sm:grid-cols-[0.8fr_1.6fr]">
                <Input
                  value={v.label}
                  aria-label={teks.linkLabelPh}
                  placeholder={teks.linkLabelPh}
                  onChange={(e) => set(index, { label: e.target.value })}
                />
                <Input
                  value={v.url}
                  aria-label={teks.linksLabel}
                  placeholder={placeholder}
                  onChange={(e) => set(index, { url: e.target.value })}
                />
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="mt-1"
                aria-label={`${teks.linksLabel} ${index + 1}`}
                onClick={() => onChange(tautan.filter((_, i) => i !== index))}
              >
                <Trash2 size={13} className="text-bad" />
              </Button>
            </div>
            {adalahPemendek(v.url) && (
              <p className="text-[11px] font-medium text-bad">
                {teks.linkShortener}
              </p>
            )}
          </div>
        ))}

        {tautan.length < MAKS_TAUTAN && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onChange([...tautan, { label: "", url: "" }])}
          >
            <Plus size={13} />
            {teks.linkAdd}
          </Button>
        )}
      </div>
    </Field>
  );
}

/* -------------------------------------------------------------------------- */
/* Verifikator dan refleksi                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Dua isian yang tidak pernah dicetak, dikumpulkan dalam satu blok.
 *
 * Verifikator adalah data pribadi milik **orang lain** yang tidak pernah
 * menyetujui penyimpanannya oleh aplikasi ini - UU 27/2022 berlaku, bukan
 * sekadar etika. Refleksi adalah catatan pengguna untuk dirinya sendiri.
 * Keduanya digabungkan di sini justru supaya janjinya terbaca sekali dan
 * berlaku untuk keduanya.
 */
export function BlokPribadi({
  verifikator,
  refleksi,
  onVerifikator,
  onRefleksi,
}: {
  verifikator: Verifikator;
  refleksi: string;
  onVerifikator: (v: Verifikator) => void;
  onRefleksi: (v: string) => void;
}) {
  const { t } = useI18n();
  const teks = t.portofolio;

  return (
    <div className="space-y-3">
      <div className="grid gap-2 sm:grid-cols-3">
        <Field label={teks.verifierName}>
          <Input
            value={verifikator.nama}
            onChange={(e) =>
              onVerifikator({ ...verifikator, nama: e.target.value })
            }
          />
        </Field>
        <Field label={teks.verifierRole}>
          <Input
            value={verifikator.jabatan}
            onChange={(e) =>
              onVerifikator({ ...verifikator, jabatan: e.target.value })
            }
          />
        </Field>
        <Field label={teks.verifierRelation}>
          <Input
            value={verifikator.hubungan}
            onChange={(e) =>
              onVerifikator({ ...verifikator, hubungan: e.target.value })
            }
          />
        </Field>
      </div>
      <p className="rounded-md border border-amber-200 bg-amber-50 px-2.5 py-1.5 text-[11px] leading-relaxed text-ink-700">
        {teks.verifierNotice}
      </p>

      <Field label={teks.reflectionLabel} hint={teks.reflectionHint}>
        <Textarea
          rows={2}
          value={refleksi}
          onChange={(e) => onRefleksi(e.target.value)}
        />
      </Field>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Bantuan kecil                                                              */
/* -------------------------------------------------------------------------- */

/** Apakah sebuah teks memuat angka - dipakai indikator "sudah ada angka". */
export function adaAngka(teks: string): boolean {
  return /\d/.test(teks);
}

export function saranKamus(slug: string): EntriKamus | undefined {
  return slug ? entriKamus(slug) : undefined;
}

"use client";

import * as React from "react";
import { Field, Input, Select, Switch, Textarea, Callout } from "@/components/ui";
import {
  emptyAward,
  emptyCertification,
  emptyCustomEntry,
  emptyCustomSection,
  emptyEducation,
  emptyExperience,
  emptyLanguage,
  emptyOrganization,
  emptyProject,
  emptyPublication,
  emptySkill,
} from "@/lib/resume/factory";
import type { SectionKey } from "@/lib/resume/types";
import { moveItem, removeAt, replaceAt, useEditor } from "./context";
import { AddButton, BulletEditor, EntryCard, MonthInput, Row } from "./parts";

/**
 * Formulir untuk setiap section CV.
 *
 * Tiap field diberi teks petunjuk dan contoh pengisian nyata. Tujuannya
 * bukan sekadar validasi, tetapi mengajarkan cara menulis CV yang baik
 * sambil pengguna mengisinya.
 */

/* ========================================================================== */
/* Data pribadi                                                               */
/* ========================================================================== */

export function PersonalSection() {
  const { data, update, setHighlight } = useEditor();
  const info = data.personalInfo;

  const set = (patch: Partial<typeof info>) =>
    update({ personalInfo: { ...info, ...patch } });

  return (
    <div className="space-y-4" onFocusCapture={() => setHighlight("personal")}>
      <Row>
        <Field
          label="Nama Lengkap"
          required
          hint="Tanpa gelar akademik di depan. Gelar boleh ditulis di belakang."
          htmlFor="fullName"
        >
          <Input
            id="fullName"
            value={info.fullName}
            onChange={(e) => set({ fullName: e.target.value })}
            placeholder="Budi Santoso"
          />
        </Field>

        <Field
          label="Jabatan / Posisi yang Dituju"
          hint="Samakan dengan judul lowongan yang Anda lamar."
          htmlFor="headline"
        >
          <Input
            id="headline"
            value={info.headline}
            onChange={(e) => set({ headline: e.target.value })}
            placeholder="Frontend Developer"
          />
        </Field>
      </Row>

      <Row>
        <Field
          label="Email"
          required
          hint="Gunakan email profesional yang aktif."
          htmlFor="email"
        >
          <Input
            id="email"
            type="email"
            value={info.email}
            onChange={(e) => set({ email: e.target.value })}
            placeholder="budi.santoso@email.com"
          />
        </Field>

        <Field
          label="Nomor Telepon"
          required
          hint="Sertakan kode negara agar terbaca sebagai nomor internasional."
          htmlFor="phone"
        >
          <Input
            id="phone"
            value={info.phone}
            onChange={(e) => set({ phone: e.target.value })}
            placeholder="+62 812-3456-7890"
          />
        </Field>
      </Row>

      <Row>
        <Field label="Kota" htmlFor="city">
          <Input
            id="city"
            value={info.city}
            onChange={(e) => set({ city: e.target.value })}
            placeholder="Bontang"
          />
        </Field>

        <Field label="Provinsi" htmlFor="province">
          <Input
            id="province"
            value={info.province}
            onChange={(e) => set({ province: e.target.value })}
            placeholder="Kalimantan Timur"
          />
        </Field>
      </Row>

      <Field label="Negara" htmlFor="country">
        <Input
          id="country"
          value={info.country}
          onChange={(e) => set({ country: e.target.value })}
          placeholder="Indonesia"
        />
      </Field>

      <Row>
        <Field label="LinkedIn" htmlFor="linkedinUrl">
          <Input
            id="linkedinUrl"
            value={info.linkedinUrl}
            onChange={(e) => set({ linkedinUrl: e.target.value })}
            placeholder="linkedin.com/in/budisantoso"
          />
        </Field>

        <Field label="Portofolio / Website" htmlFor="portfolioUrl">
          <Input
            id="portfolioUrl"
            value={info.portfolioUrl}
            onChange={(e) => set({ portfolioUrl: e.target.value })}
            placeholder="budisantoso.dev"
          />
        </Field>
      </Row>

      <Field label="GitHub" htmlFor="githubUrl">
        <Input
          id="githubUrl"
          value={info.githubUrl}
          onChange={(e) => set({ githubUrl: e.target.value })}
          placeholder="github.com/budisantoso"
        />
      </Field>

      <div className="rounded-lg border border-ink-200 p-3">
        <Switch
          id="showPhoto"
          checked={info.showPhoto}
          onChange={(value) => set({ showPhoto: value })}
          label="Tampilkan pas foto"
          hint="Sebaiknya dimatikan. Sebagian besar pengurai ATS tidak membaca gambar, dan tata letak di sekitar foto sering membuat teks terbaca berantakan. Aktifkan hanya bila lowongan memintanya."
        />

        {info.showPhoto && (
          <div className="mt-3">
            <Field
              label="URL Foto"
              hint="Tempelkan tautan gambar. Ukuran ideal 3x4 dengan latar polos."
              htmlFor="photoUrl"
            >
              <Input
                id="photoUrl"
                value={info.photoUrl}
                onChange={(e) => set({ photoUrl: e.target.value })}
                placeholder="https://..."
              />
            </Field>
          </div>
        )}
      </div>
    </div>
  );
}

/* ========================================================================== */
/* Ringkasan profil                                                           */
/* ========================================================================== */

export function SummarySection() {
  const { data, update, setHighlight } = useEditor();
  const info = data.personalInfo;
  const words = info.summary.trim() ? info.summary.trim().split(/\s+/).length : 0;

  return (
    <div onFocusCapture={() => setHighlight("summary")}>
      <Field
        label="Ringkasan Profil"
        hint="Rumus singkat: peran + lama pengalaman + keahlian utama + satu pencapaian berangka. Hindari kata 'saya'."
        htmlFor="summary"
      >
        <Textarea
          id="summary"
          rows={6}
          value={info.summary}
          onChange={(e) =>
            update({ personalInfo: { ...info, summary: e.target.value } })
          }
          placeholder="Frontend Developer dengan pengalaman 4 tahun membangun aplikasi web berskala produksi menggunakan React dan TypeScript. Berhasil menurunkan waktu muat halaman utama sebesar 45% dan memimpin tim beranggotakan 4 orang dalam migrasi ke arsitektur komponen bersama."
        />
      </Field>

      <p
        className={`mt-1.5 text-[11px] ${
          words === 0
            ? "text-ink-500"
            : words < 30 || words > 120
              ? "text-warn"
              : "text-good"
        }`}
      >
        {words} kata {words >= 30 && words <= 120 ? "(ideal)" : "(ideal: 30-120 kata)"}
      </p>
    </div>
  );
}

/* ========================================================================== */
/* Pengalaman kerja                                                           */
/* ========================================================================== */

const EMPLOYMENT_LABELS: Record<string, string> = {
  FULL_TIME: "Penuh Waktu",
  PART_TIME: "Paruh Waktu",
  CONTRACT: "Kontrak",
  INTERNSHIP: "Magang",
  FREELANCE: "Lepas",
  VOLUNTEER: "Sukarela",
};

export function ExperienceSection() {
  const { data, update, setHighlight } = useEditor();
  const items = data.experiences;

  const set = (index: number, patch: Partial<(typeof items)[number]>) =>
    update({
      experiences: replaceAt(items, index, { ...items[index], ...patch }),
    });

  return (
    <div className="space-y-3">
      {items.length === 0 && (
        <Callout tone="info">
          Belum ada pengalaman kerja. Jika Anda fresh graduate, isi section
          Proyek dan Organisasi sebagai gantinya - keduanya sama-sama dihitung
          sebagai bukti kemampuan.
        </Callout>
      )}

      {items.map((item, index) => (
        <EntryCard
          key={item.id}
          index={index}
          total={items.length}
          label="Pengalaman"
          onFocusCapture={() => setHighlight(`experience:${item.id}`)}
          onMoveUp={() => update({ experiences: moveItem(items, index, index - 1) })}
          onMoveDown={() => update({ experiences: moveItem(items, index, index + 1) })}
          onRemove={() => update({ experiences: removeAt(items, index) })}
        >
          <Row>
            <Field label="Jabatan" required hint="Sesuai surat pengangkatan.">
              <Input
                value={item.jobTitle}
                onChange={(e) => set(index, { jobTitle: e.target.value })}
                placeholder="Frontend Developer"
              />
            </Field>
            <Field label="Nama Perusahaan" required>
              <Input
                value={item.company}
                onChange={(e) => set(index, { company: e.target.value })}
                placeholder="PT Digital Nusantara"
              />
            </Field>
          </Row>

          <Row>
            <Field label="Kota">
              <Input
                value={item.city}
                onChange={(e) => set(index, { city: e.target.value })}
                placeholder="Jakarta Selatan"
              />
            </Field>
            <Field label="Status Kerja">
              <Select
                value={item.employmentType ?? ""}
                onChange={(e) =>
                  set(index, {
                    employmentType: (e.target.value ||
                      null) as (typeof items)[number]["employmentType"],
                  })
                }
              >
                <option value="">Tidak disebutkan</option>
                {Object.entries(EMPLOYMENT_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
            </Field>
          </Row>

          <Row>
            <MonthInput
              label="Mulai"
              value={item.startDate}
              onChange={(value) => set(index, { startDate: value })}
            />
            <MonthInput
              label="Selesai"
              value={item.endDate}
              disabled={item.isCurrent}
              onChange={(value) => set(index, { endDate: value })}
            />
          </Row>

          <Switch
            checked={item.isCurrent}
            onChange={(value) =>
              set(index, { isCurrent: value, endDate: value ? "" : item.endDate })
            }
            label="Masih bekerja di sini"
          />

          <BulletEditor
            bullets={item.bullets}
            onChange={(bullets) => set(index, { bullets })}
          />
        </EntryCard>
      ))}

      <AddButton
        label="Tambah Pengalaman Kerja"
        onClick={() => update({ experiences: [...items, emptyExperience()] })}
      />
    </div>
  );
}

/* ========================================================================== */
/* Pendidikan                                                                 */
/* ========================================================================== */

export function EducationSection() {
  const { data, update, setHighlight } = useEditor();
  const items = data.educations;

  const set = (index: number, patch: Partial<(typeof items)[number]>) =>
    update({
      educations: replaceAt(items, index, { ...items[index], ...patch }),
    });

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <EntryCard
          key={item.id}
          index={index}
          total={items.length}
          label="Pendidikan"
          onFocusCapture={() => setHighlight(`education:${item.id}`)}
          onMoveUp={() => update({ educations: moveItem(items, index, index - 1) })}
          onMoveDown={() => update({ educations: moveItem(items, index, index + 1) })}
          onRemove={() => update({ educations: removeAt(items, index) })}
        >
          <Row>
            <Field label="Jenjang / Gelar" required hint="Contoh: S1, D3, SMA.">
              <Input
                value={item.degree}
                onChange={(e) => set(index, { degree: e.target.value })}
                placeholder="Sarjana Komputer (S.Kom)"
              />
            </Field>
            <Field label="Program Studi">
              <Input
                value={item.fieldOfStudy}
                onChange={(e) => set(index, { fieldOfStudy: e.target.value })}
                placeholder="Teknik Informatika"
              />
            </Field>
          </Row>

          <Row>
            <Field label="Institusi" required>
              <Input
                value={item.institution}
                onChange={(e) => set(index, { institution: e.target.value })}
                placeholder="Universitas Mulawarman"
              />
            </Field>
            <Field label="Kota">
              <Input
                value={item.city}
                onChange={(e) => set(index, { city: e.target.value })}
                placeholder="Samarinda"
              />
            </Field>
          </Row>

          <Row>
            <MonthInput
              label="Mulai"
              value={item.startDate}
              onChange={(value) => set(index, { startDate: value })}
            />
            <MonthInput
              label="Lulus"
              value={item.endDate}
              disabled={item.isCurrent}
              onChange={(value) => set(index, { endDate: value })}
            />
          </Row>

          <Switch
            checked={item.isCurrent}
            onChange={(value) =>
              set(index, { isCurrent: value, endDate: value ? "" : item.endDate })
            }
            label="Masih menempuh pendidikan"
          />

          <Row>
            <Field
              label="IPK"
              hint="Cantumkan bila 3.00 ke atas. Kosongkan bila di bawah itu."
            >
              <Input
                value={item.gpa}
                onChange={(e) => set(index, { gpa: e.target.value })}
                placeholder="3.62"
              />
            </Field>
            <Field label="Skala IPK">
              <Input
                value={item.maxGpa}
                onChange={(e) => set(index, { maxGpa: e.target.value })}
                placeholder="4.00"
              />
            </Field>
          </Row>

          <BulletEditor
            bullets={item.bullets}
            onChange={(bullets) => set(index, { bullets })}
          />
        </EntryCard>
      ))}

      <AddButton
        label="Tambah Pendidikan"
        onClick={() => update({ educations: [...items, emptyEducation()] })}
      />
    </div>
  );
}

/* ========================================================================== */
/* Keahlian                                                                   */
/* ========================================================================== */

const SKILL_CATEGORIES = [
  "Bahasa Pemrograman",
  "Framework & Library",
  "Tools & Platform",
  "Basis Data",
  "Desain",
  "Manajemen",
  "Umum",
];

export function SkillSection() {
  const { data, update, setHighlight } = useEditor();
  const items = data.skills;

  const set = (index: number, patch: Partial<(typeof items)[number]>) =>
    update({ skills: replaceAt(items, index, { ...items[index], ...patch }) });

  return (
    <div className="space-y-3" onFocusCapture={() => setHighlight("skill")}>
      <Callout tone="info">
        Tulis nama keahlian apa adanya - <strong>JavaScript</strong>, bukan
        <strong> JavaScript (mahir)</strong>. Sistem ATS mencocokkan kata kunci
        secara harfiah, sehingga tambahan dalam kurung justru menurunkan
        kecocokan.
      </Callout>

      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={item.id} className="flex gap-2">
            <Input
              className="flex-1"
              value={item.name}
              onChange={(e) => set(index, { name: e.target.value })}
              placeholder="React"
            />
            <Select
              className="w-44"
              value={item.category}
              onChange={(e) => set(index, { category: e.target.value })}
            >
              {SKILL_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
              {!SKILL_CATEGORIES.includes(item.category) && (
                <option value={item.category}>{item.category}</option>
              )}
            </Select>
            <button
              type="button"
              title="Hapus keahlian"
              onClick={() => update({ skills: removeAt(items, index) })}
              className="shrink-0 rounded-lg px-2 text-bad hover:bg-red-50"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <AddButton
        label="Tambah Keahlian"
        onClick={() =>
          update({
            skills: [
              ...items,
              emptySkill(items.at(-1)?.category ?? "Bahasa Pemrograman"),
            ],
          })
        }
      />
    </div>
  );
}

/* ========================================================================== */
/* Proyek                                                                     */
/* ========================================================================== */

export function ProjectSection() {
  const { data, update, setHighlight } = useEditor();
  const items = data.projects;

  const set = (index: number, patch: Partial<(typeof items)[number]>) =>
    update({ projects: replaceAt(items, index, { ...items[index], ...patch }) });

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <EntryCard
          key={item.id}
          index={index}
          total={items.length}
          label="Proyek"
          onFocusCapture={() => setHighlight(`project:${item.id}`)}
          onMoveUp={() => update({ projects: moveItem(items, index, index - 1) })}
          onMoveDown={() => update({ projects: moveItem(items, index, index + 1) })}
          onRemove={() => update({ projects: removeAt(items, index) })}
        >
          <Row>
            <Field label="Nama Proyek" required>
              <Input
                value={item.name}
                onChange={(e) => set(index, { name: e.target.value })}
                placeholder="SIMAK PWA"
              />
            </Field>
            <Field label="Peran Anda">
              <Input
                value={item.role}
                onChange={(e) => set(index, { role: e.target.value })}
                placeholder="Pengembang Utama"
              />
            </Field>
          </Row>

          <Field label="Tautan" hint="Repositori, demo, atau publikasi proyek.">
            <Input
              value={item.url}
              onChange={(e) => set(index, { url: e.target.value })}
              placeholder="github.com/budisantoso/simak-pwa"
            />
          </Field>

          <Row>
            <MonthInput
              label="Mulai"
              value={item.startDate}
              onChange={(value) => set(index, { startDate: value })}
            />
            <MonthInput
              label="Selesai"
              value={item.endDate}
              onChange={(value) => set(index, { endDate: value })}
            />
          </Row>

          <BulletEditor
            bullets={item.bullets}
            onChange={(bullets) => set(index, { bullets })}
          />
        </EntryCard>
      ))}

      <AddButton
        label="Tambah Proyek"
        onClick={() => update({ projects: [...items, emptyProject()] })}
      />
    </div>
  );
}

/* ========================================================================== */
/* Sertifikasi                                                                */
/* ========================================================================== */

export function CertificationSection() {
  const { data, update, setHighlight } = useEditor();
  const items = data.certifications;

  const set = (index: number, patch: Partial<(typeof items)[number]>) =>
    update({
      certifications: replaceAt(items, index, { ...items[index], ...patch }),
    });

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <EntryCard
          key={item.id}
          index={index}
          total={items.length}
          label="Sertifikat"
          onFocusCapture={() => setHighlight(`certification:${item.id}`)}
          onMoveUp={() =>
            update({ certifications: moveItem(items, index, index - 1) })
          }
          onMoveDown={() =>
            update({ certifications: moveItem(items, index, index + 1) })
          }
          onRemove={() => update({ certifications: removeAt(items, index) })}
        >
          <Field label="Nama Sertifikat" required>
            <Input
              value={item.name}
              onChange={(e) => set(index, { name: e.target.value })}
              placeholder="Meta Front-End Developer Professional Certificate"
            />
          </Field>

          <Field label="Penerbit" required>
            <Input
              value={item.issuer}
              onChange={(e) => set(index, { issuer: e.target.value })}
              placeholder="Meta / Coursera"
            />
          </Field>

          <Row>
            <MonthInput
              label="Tanggal Terbit"
              value={item.issueDate}
              onChange={(value) => set(index, { issueDate: value })}
            />
            <MonthInput
              label="Berlaku Sampai"
              value={item.expiryDate}
              hint="Kosongkan bila berlaku selamanya."
              onChange={(value) => set(index, { expiryDate: value })}
            />
          </Row>

          <Row>
            <Field
              label="ID Kredensial"
              hint="Memudahkan perekrut memverifikasi."
            >
              <Input
                value={item.credentialId}
                onChange={(e) => set(index, { credentialId: e.target.value })}
                placeholder="ABCD1234EFGH"
              />
            </Field>
            <Field label="Tautan Verifikasi">
              <Input
                value={item.url}
                onChange={(e) => set(index, { url: e.target.value })}
                placeholder="coursera.org/verify/..."
              />
            </Field>
          </Row>
        </EntryCard>
      ))}

      <AddButton
        label="Tambah Sertifikat"
        onClick={() =>
          update({ certifications: [...items, emptyCertification()] })
        }
      />
    </div>
  );
}

/* ========================================================================== */
/* Organisasi                                                                 */
/* ========================================================================== */

export function OrganizationSection() {
  const { data, update, setHighlight } = useEditor();
  const items = data.organizations;

  const set = (index: number, patch: Partial<(typeof items)[number]>) =>
    update({
      organizations: replaceAt(items, index, { ...items[index], ...patch }),
    });

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <EntryCard
          key={item.id}
          index={index}
          total={items.length}
          label="Organisasi"
          onFocusCapture={() => setHighlight(`organization:${item.id}`)}
          onMoveUp={() =>
            update({ organizations: moveItem(items, index, index - 1) })
          }
          onMoveDown={() =>
            update({ organizations: moveItem(items, index, index + 1) })
          }
          onRemove={() => update({ organizations: removeAt(items, index) })}
        >
          <Row>
            <Field label="Nama Organisasi" required>
              <Input
                value={item.name}
                onChange={(e) => set(index, { name: e.target.value })}
                placeholder="Himpunan Mahasiswa Teknik Informatika"
              />
            </Field>
            <Field label="Jabatan" required>
              <Input
                value={item.role}
                onChange={(e) => set(index, { role: e.target.value })}
                placeholder="Ketua Divisi Riset dan Teknologi"
              />
            </Field>
          </Row>

          <Row>
            <MonthInput
              label="Mulai"
              value={item.startDate}
              onChange={(value) => set(index, { startDate: value })}
            />
            <MonthInput
              label="Selesai"
              value={item.endDate}
              disabled={item.isCurrent}
              onChange={(value) => set(index, { endDate: value })}
            />
          </Row>

          <Switch
            checked={item.isCurrent}
            onChange={(value) =>
              set(index, { isCurrent: value, endDate: value ? "" : item.endDate })
            }
            label="Masih aktif"
          />

          <BulletEditor
            bullets={item.bullets}
            onChange={(bullets) => set(index, { bullets })}
          />
        </EntryCard>
      ))}

      <AddButton
        label="Tambah Organisasi"
        onClick={() => update({ organizations: [...items, emptyOrganization()] })}
      />
    </div>
  );
}

/* ========================================================================== */
/* Penghargaan                                                                */
/* ========================================================================== */

export function AwardSection() {
  const { data, update, setHighlight } = useEditor();
  const items = data.awards;

  const set = (index: number, patch: Partial<(typeof items)[number]>) =>
    update({ awards: replaceAt(items, index, { ...items[index], ...patch }) });

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <EntryCard
          key={item.id}
          index={index}
          total={items.length}
          label="Penghargaan"
          onFocusCapture={() => setHighlight(`award:${item.id}`)}
          onMoveUp={() => update({ awards: moveItem(items, index, index - 1) })}
          onMoveDown={() => update({ awards: moveItem(items, index, index + 1) })}
          onRemove={() => update({ awards: removeAt(items, index) })}
        >
          <Field
            label="Nama Penghargaan"
            required
            hint="Sebutkan peringkat dan tingkat kompetisinya."
          >
            <Input
              value={item.title}
              onChange={(e) => set(index, { title: e.target.value })}
              placeholder="Juara 2 Hackathon Kaltim Digital"
            />
          </Field>

          <Row>
            <Field label="Pemberi Penghargaan">
              <Input
                value={item.issuer}
                onChange={(e) => set(index, { issuer: e.target.value })}
                placeholder="Dinas Kominfo Provinsi Kalimantan Timur"
              />
            </Field>
            <MonthInput
              label="Tanggal"
              value={item.date}
              onChange={(value) => set(index, { date: value })}
            />
          </Row>

          <Field label="Keterangan Singkat">
            <Textarea
              rows={2}
              value={item.description}
              onChange={(e) => set(index, { description: e.target.value })}
              placeholder="Membangun purwarupa aplikasi pelaporan infrastruktur dalam 48 jam bersama tim beranggotakan 3 orang."
            />
          </Field>
        </EntryCard>
      ))}

      <AddButton
        label="Tambah Penghargaan"
        onClick={() => update({ awards: [...items, emptyAward()] })}
      />
    </div>
  );
}

/* ========================================================================== */
/* Bahasa                                                                     */
/* ========================================================================== */

const PROFICIENCY_LABELS: Record<string, string> = {
  NATIVE: "Bahasa Ibu",
  FLUENT: "Sangat Lancar",
  ADVANCED: "Mahir",
  INTERMEDIATE: "Menengah",
  BASIC: "Dasar",
};

export function LanguageSection() {
  const { data, update, setHighlight } = useEditor();
  const items = data.languages;

  const set = (index: number, patch: Partial<(typeof items)[number]>) =>
    update({ languages: replaceAt(items, index, { ...items[index], ...patch }) });

  return (
    <div className="space-y-3" onFocusCapture={() => setHighlight("language")}>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={item.id} className="flex gap-2">
            <Input
              className="flex-1"
              value={item.name}
              onChange={(e) => set(index, { name: e.target.value })}
              placeholder="Bahasa Inggris"
            />
            <Select
              className="w-40"
              value={item.proficiency}
              onChange={(e) =>
                set(index, {
                  proficiency: e.target
                    .value as (typeof items)[number]["proficiency"],
                })
              }
            >
              {Object.entries(PROFICIENCY_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
            <button
              type="button"
              title="Hapus bahasa"
              onClick={() => update({ languages: removeAt(items, index) })}
              className="shrink-0 rounded-lg px-2 text-bad hover:bg-red-50"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <AddButton
        label="Tambah Bahasa"
        onClick={() => update({ languages: [...items, emptyLanguage()] })}
      />
    </div>
  );
}

/* ========================================================================== */
/* Publikasi                                                                  */
/* ========================================================================== */

export function PublicationSection() {
  const { data, update, setHighlight } = useEditor();
  const items = data.publications;

  const set = (index: number, patch: Partial<(typeof items)[number]>) =>
    update({
      publications: replaceAt(items, index, { ...items[index], ...patch }),
    });

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <EntryCard
          key={item.id}
          index={index}
          total={items.length}
          label="Publikasi"
          onFocusCapture={() => setHighlight(`publication:${item.id}`)}
          onMoveUp={() =>
            update({ publications: moveItem(items, index, index - 1) })
          }
          onMoveDown={() =>
            update({ publications: moveItem(items, index, index + 1) })
          }
          onRemove={() => update({ publications: removeAt(items, index) })}
        >
          <Field label="Judul" required>
            <Textarea
              rows={2}
              value={item.title}
              onChange={(e) => set(index, { title: e.target.value })}
              placeholder="Penerapan Progressive Web App pada Sistem Informasi Akademik"
            />
          </Field>

          <Field label="Penerbit / Jurnal">
            <Input
              value={item.publisher}
              onChange={(e) => set(index, { publisher: e.target.value })}
              placeholder="Jurnal Informatika Mulawarman, Vol. 16 No. 2"
            />
          </Field>

          <Row>
            <MonthInput
              label="Tanggal Terbit"
              value={item.date}
              onChange={(value) => set(index, { date: value })}
            />
            <Field label="DOI">
              <Input
                value={item.doi}
                onChange={(e) => set(index, { doi: e.target.value })}
                placeholder="10.30872/jim.v16i2.1234"
              />
            </Field>
          </Row>

          <Field label="Tautan">
            <Input
              value={item.url}
              onChange={(e) => set(index, { url: e.target.value })}
              placeholder="https://..."
            />
          </Field>
        </EntryCard>
      ))}

      <AddButton
        label="Tambah Publikasi"
        onClick={() => update({ publications: [...items, emptyPublication()] })}
      />
    </div>
  );
}

/* ========================================================================== */
/* Section tambahan buatan pengguna                                           */
/* ========================================================================== */

export function CustomSectionForm() {
  const { data, update, setHighlight } = useEditor();
  const sections = data.customSections;

  return (
    <div className="space-y-3">
      {sections.map((section, sectionIndex) => (
        <EntryCard
          key={section.id}
          index={sectionIndex}
          total={sections.length}
          label="Section"
          onFocusCapture={() => setHighlight(`custom:${section.id}`)}
          onMoveUp={() =>
            update({
              customSections: moveItem(sections, sectionIndex, sectionIndex - 1),
            })
          }
          onMoveDown={() =>
            update({
              customSections: moveItem(sections, sectionIndex, sectionIndex + 1),
            })
          }
          onRemove={() =>
            update({ customSections: removeAt(sections, sectionIndex) })
          }
        >
          <Field
            label="Judul Section"
            required
            hint="Gunakan teks biasa tanpa emoji agar tetap terbaca pengurai."
          >
            <Input
              value={section.title}
              onChange={(e) =>
                update({
                  customSections: replaceAt(sections, sectionIndex, {
                    ...section,
                    title: e.target.value,
                  }),
                })
              }
              placeholder="Pelatihan dan Workshop"
            />
          </Field>

          {section.items.map((item, itemIndex) => (
            <div
              key={item.id}
              className="space-y-3 rounded-lg border border-ink-200 bg-white p-3"
            >
              <Row>
                <Field label="Judul">
                  <Input
                    value={item.title}
                    onChange={(e) =>
                      update({
                        customSections: replaceAt(sections, sectionIndex, {
                          ...section,
                          items: replaceAt(section.items, itemIndex, {
                            ...item,
                            title: e.target.value,
                          }),
                        }),
                      })
                    }
                  />
                </Field>
                <Field label="Keterangan">
                  <Input
                    value={item.subtitle}
                    onChange={(e) =>
                      update({
                        customSections: replaceAt(sections, sectionIndex, {
                          ...section,
                          items: replaceAt(section.items, itemIndex, {
                            ...item,
                            subtitle: e.target.value,
                          }),
                        }),
                      })
                    }
                  />
                </Field>
              </Row>

              <BulletEditor
                bullets={item.bullets}
                onChange={(bullets) =>
                  update({
                    customSections: replaceAt(sections, sectionIndex, {
                      ...section,
                      items: replaceAt(section.items, itemIndex, {
                        ...item,
                        bullets,
                      }),
                    }),
                  })
                }
              />

              <button
                type="button"
                onClick={() =>
                  update({
                    customSections: replaceAt(sections, sectionIndex, {
                      ...section,
                      items: removeAt(section.items, itemIndex),
                    }),
                  })
                }
                className="text-xs font-medium text-bad"
              >
                Hapus entri ini
              </button>
            </div>
          ))}

          <AddButton
            label="Tambah Entri"
            onClick={() =>
              update({
                customSections: replaceAt(sections, sectionIndex, {
                  ...section,
                  items: [...section.items, emptyCustomEntry()],
                }),
              })
            }
          />
        </EntryCard>
      ))}

      <AddButton
        label="Tambah Section Baru"
        onClick={() =>
          update({ customSections: [...sections, emptyCustomSection()] })
        }
      />
    </div>
  );
}

/* ========================================================================== */
/* Pemetaan section ke komponennya                                            */
/* ========================================================================== */

export const SECTION_FORMS: Record<SectionKey, React.ComponentType> = {
  summary: SummarySection,
  experience: ExperienceSection,
  education: EducationSection,
  skill: SkillSection,
  project: ProjectSection,
  certification: CertificationSection,
  organization: OrganizationSection,
  award: AwardSection,
  language: LanguageSection,
  publication: PublicationSection,
  custom: CustomSectionForm,
};

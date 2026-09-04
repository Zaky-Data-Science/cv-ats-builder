"use client";

import * as React from "react";
import { Sparkles } from "lucide-react";
import { useI18n } from "@/components/i18n";
import {
  Button,
  Callout,
  Field,
  Input,
  Select,
  Switch,
  Textarea,
} from "@/components/ui";
import { cn } from "@/lib/utils";
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
import { templateStyle } from "@/lib/resume/templates";
import type { ProjectItem, ResumeLanguage, SectionKey } from "@/lib/resume/types";
import { isiArsip, pulihkanKeDetail } from "@/lib/portfolio/arsip";
import { buatContohItem } from "@/lib/portfolio/contoh";
import { EFEK_JENJANG } from "@/lib/portfolio/pola-schemas";
import { skemaBagian } from "@/lib/portfolio/profil";
import { tanggalDiLuarInduk } from "@/lib/portfolio/render";
import { moveItem, removeAt, replaceAt, useEditor } from "./context";
import { AddButton, BulletEditor, EntryCard, MonthInput, Row } from "./parts";
import {
  adaAngka,
  BlokAgregat,
  BlokPribadi,
  DetailTambahanEditor,
  FieldIntiInput,
  Lipat,
  PeriksaBahasa,
  saranKamus,
  TautanEditor,
} from "./PortofolioFields";
import {
  LABEL_KATEGORI_KREDENSIAL,
  MASA_BERLAKU_LABEL,
} from "@/lib/portfolio/kredensial";
import type { KategoriKredensial, MasaBerlakuJenis } from "@/lib/resume/types";
import { PhotoInput } from "./PhotoInput";

/**
 * Formulir untuk setiap section CV.
 *
 * Tiap field diberi teks petunjuk dan contoh pengisian nyata. Tujuannya bukan
 * sekadar validasi, tetapi mengajarkan cara menulis CV yang baik sambil
 * pengguna mengisinya - contoh yang benar lebih cepat dipahami daripada
 * penjelasan panjang, dan teks contoh yang tampil abu-abu itu tidak pernah
 * ikut tersimpan sebagai isi CV.
 *
 * Seluruh teks di berkas ini berasal dari kamus dwibahasa, sehingga tidak ada
 * kalimat yang tertinggal berbahasa Indonesia ketika antarmuka disetel ke
 * bahasa Inggris.
 */

/* -------------------------------------------------------------------------- */
/* Daftar pilihan yang mengikuti bahasa CV, bukan bahasa antarmuka            */
/* -------------------------------------------------------------------------- */

/**
 * Kategori keahlian ikut tercetak di CV ("Bahasa Pemrograman: React, ..."),
 * jadi bahasanya harus mengikuti bahasa CV - bukan bahasa antarmuka. Pengguna
 * berbahasa Indonesia yang sedang menyusun CV berbahasa Inggris tetap
 * memperoleh kategori berbahasa Inggris di dokumennya.
 */
const SKILL_CATEGORIES: Record<ResumeLanguage, string[]> = {
  ID: [
    "Bahasa Pemrograman",
    "Framework & Library",
    "Tools & Platform",
    "Basis Data",
    "Desain",
    "Manajemen",
    "Umum",
  ],
  EN: [
    "Programming Languages",
    "Frameworks & Libraries",
    "Tools & Platforms",
    "Databases",
    "Design",
    "Management",
    "General",
  ],
};

const EMPLOYMENT_LABELS: Record<"id" | "en", Record<string, string>> = {
  id: {
    FULL_TIME: "Penuh Waktu",
    PART_TIME: "Paruh Waktu",
    CONTRACT: "Kontrak",
    INTERNSHIP: "Magang",
    FREELANCE: "Lepas",
    VOLUNTEER: "Sukarela",
  },
  en: {
    FULL_TIME: "Full time",
    PART_TIME: "Part time",
    CONTRACT: "Contract",
    INTERNSHIP: "Internship",
    FREELANCE: "Freelance",
    VOLUNTEER: "Volunteer",
  },
};

const PROFICIENCY_LABELS: Record<"id" | "en", Record<string, string>> = {
  id: {
    NATIVE: "Bahasa Ibu",
    FLUENT: "Sangat Lancar",
    ADVANCED: "Mahir",
    INTERMEDIATE: "Menengah",
    BASIC: "Dasar",
  },
  en: {
    NATIVE: "Native",
    FLUENT: "Fluent",
    ADVANCED: "Advanced",
    INTERMEDIATE: "Intermediate",
    BASIC: "Basic",
  },
};

/* ========================================================================== */
/* Data pribadi                                                               */
/* ========================================================================== */

export function PersonalSection() {
  const { data, update, setHighlight } = useEditor();
  const { t } = useI18n();
  const info = data.personalInfo;

  const set = (patch: Partial<typeof info>) =>
    update({ personalInfo: { ...info, ...patch } });

  // Templat tanpa tempat foto tidak diam-diam mengabaikan sakelar ini -
  // pengguna diberi tahu mengapa fotonya tidak muncul, dan apa yang harus ia
  // lakukan bila memang membutuhkannya.
  const photoSupported = templateStyle(data.template).photo !== "none";

  return (
    <div className="space-y-4" onFocusCapture={() => setHighlight("personal")}>
      <Row>
        <Field
          label={t.form.fullName}
          required
          hint={t.form.fullNameHint}
          htmlFor="fullName"
        >
          <Input
            id="fullName"
            value={info.fullName}
            onChange={(e) => set({ fullName: e.target.value })}
            placeholder={t.form.fullNamePh}
          />
        </Field>

        <Field label={t.form.headline} hint={t.form.headlineHint} htmlFor="headline">
          <Input
            id="headline"
            value={info.headline}
            onChange={(e) => set({ headline: e.target.value })}
            placeholder={t.form.headlinePh}
          />
        </Field>
      </Row>

      <Row>
        <Field label={t.form.email} required hint={t.form.emailHint} htmlFor="email">
          <Input
            id="email"
            type="email"
            value={info.email}
            onChange={(e) => set({ email: e.target.value })}
            placeholder={t.form.emailPh}
          />
        </Field>

        <Field label={t.form.phone} required hint={t.form.phoneHint} htmlFor="phone">
          <Input
            id="phone"
            value={info.phone}
            onChange={(e) => set({ phone: e.target.value })}
            placeholder={t.form.phonePh}
          />
        </Field>
      </Row>

      <Row>
        <Field label={t.form.city} htmlFor="city">
          <Input
            id="city"
            value={info.city}
            onChange={(e) => set({ city: e.target.value })}
            placeholder={t.form.cityPh}
          />
        </Field>

        <Field label={t.form.province} htmlFor="province">
          <Input
            id="province"
            value={info.province}
            onChange={(e) => set({ province: e.target.value })}
            placeholder={t.form.provincePh}
          />
        </Field>
      </Row>

      <Field label={t.form.country} htmlFor="country">
        <Input
          id="country"
          value={info.country}
          onChange={(e) => set({ country: e.target.value })}
          placeholder={t.form.countryPh}
        />
      </Field>

      <Row>
        <Field label={t.form.linkedin} htmlFor="linkedinUrl">
          <Input
            id="linkedinUrl"
            value={info.linkedinUrl}
            onChange={(e) => set({ linkedinUrl: e.target.value })}
            placeholder={t.form.linkedinPh}
          />
        </Field>

        <Field label={t.form.portfolio} htmlFor="portfolioUrl">
          <Input
            id="portfolioUrl"
            value={info.portfolioUrl}
            onChange={(e) => set({ portfolioUrl: e.target.value })}
            placeholder={t.form.portfolioPh}
          />
        </Field>
      </Row>

      <Field label={t.form.github} htmlFor="githubUrl">
        <Input
          id="githubUrl"
          value={info.githubUrl}
          onChange={(e) => set({ githubUrl: e.target.value })}
          placeholder={t.form.githubPh}
        />
      </Field>

      <div className="rounded-lg border border-ink-200 p-3">
        <Switch
          id="showPhoto"
          checked={info.showPhoto}
          onChange={(value) => set({ showPhoto: value })}
          label={t.form.showPhoto}
          hint={t.form.showPhotoHint}
        />

        {info.showPhoto && !photoSupported && (
          <div className="mt-3">
            <Callout tone="warn">{t.appearance.photoUnsupported}</Callout>
          </div>
        )}

        {info.showPhoto && (
          <div className="mt-3">
            <Field label={t.form.photo} htmlFor="photoFile">
              <PhotoInput
                value={info.photoUrl}
                zoom={info.photoZoom}
                offsetX={info.photoOffsetX}
                offsetY={info.photoOffsetY}
                onChange={(photoUrl) =>
                  // Foto baru selalu berangkat dari potongan yang netral.
                  // Mewarisi perbesaran foto sebelumnya berarti gambar yang
                  // baru saja dipilih muncul sudah terpotong, dan sebabnya
                  // tidak terlihat di mana pun.
                  set({
                    photoUrl,
                    photoZoom: 1,
                    photoOffsetX: 0,
                    photoOffsetY: 0,
                  })
                }
                onCropChange={set}
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
  const { t } = useI18n();
  const info = data.personalInfo;
  const words = info.summary.trim() ? info.summary.trim().split(/\s+/).length : 0;

  return (
    <div onFocusCapture={() => setHighlight("summary")}>
      <Field label={t.form.summary} hint={t.form.summaryHint} htmlFor="summary">
        <Textarea
          id="summary"
          rows={6}
          value={info.summary}
          onChange={(e) =>
            update({ personalInfo: { ...info, summary: e.target.value } })
          }
          placeholder={t.form.summaryPh}
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
        {words} {t.form.summaryWords}{" "}
        {words >= 30 && words <= 120
          ? t.form.summaryIdeal
          : t.form.summaryIdealRange}
      </p>
    </div>
  );
}

/* ========================================================================== */
/* Pengalaman kerja                                                           */
/* ========================================================================== */

export function ExperienceSection() {
  const { data, update, setHighlight } = useEditor();
  const { locale, t } = useI18n();
  const items = data.experiences;

  const set = (index: number, patch: Partial<(typeof items)[number]>) =>
    update({
      experiences: replaceAt(items, index, { ...items[index], ...patch }),
    });

  return (
    <div className="space-y-3">
      {items.length === 0 && (
        <Callout tone="info">{t.form.experienceEmpty}</Callout>
      )}

      {items.map((item, index) => (
        <EntryCard
          key={item.id}
          index={index}
          total={items.length}
          label={t.form.experienceLabel}
          onFocusCapture={() => setHighlight(`experience:${item.id}`)}
          onMoveUp={() => update({ experiences: moveItem(items, index, index - 1) })}
          onMoveDown={() => update({ experiences: moveItem(items, index, index + 1) })}
          onRemove={() => update({ experiences: removeAt(items, index) })}
        >
          <Row>
            <Field label={t.form.jobTitle} required hint={t.form.jobTitleHint}>
              <Input
                value={item.jobTitle}
                onChange={(e) => set(index, { jobTitle: e.target.value })}
                placeholder={t.form.jobTitlePh}
              />
            </Field>
            <Field label={t.form.company} required>
              <Input
                value={item.company}
                onChange={(e) => set(index, { company: e.target.value })}
                placeholder={t.form.companyPh}
              />
            </Field>
          </Row>

          <Row>
            <Field label={t.form.city}>
              <Input
                value={item.city}
                onChange={(e) => set(index, { city: e.target.value })}
                placeholder={t.form.workCityPh}
              />
            </Field>
            <Field label={t.form.employmentType}>
              <Select
                value={item.employmentType ?? ""}
                onChange={(e) =>
                  set(index, {
                    employmentType: (e.target.value ||
                      null) as (typeof items)[number]["employmentType"],
                  })
                }
              >
                <option value="">{t.form.employmentUnset}</option>
                {Object.entries(EMPLOYMENT_LABELS[locale]).map(
                  ([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ),
                )}
              </Select>
            </Field>
          </Row>

          <Row>
            <MonthInput
              label={t.form.startDate}
              value={item.startDate}
              onChange={(value) => set(index, { startDate: value })}
            />
            <MonthInput
              label={t.form.endDate}
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
            label={t.form.stillWorking}
          />

          <BulletEditor
            bullets={item.bullets}
            onChange={(bullets) => set(index, { bullets })}
          />
        </EntryCard>
      ))}

      <AddButton
        label={t.form.experienceAdd}
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
  const { t } = useI18n();
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
          label={t.form.educationLabel}
          onFocusCapture={() => setHighlight(`education:${item.id}`)}
          onMoveUp={() => update({ educations: moveItem(items, index, index - 1) })}
          onMoveDown={() => update({ educations: moveItem(items, index, index + 1) })}
          onRemove={() => update({ educations: removeAt(items, index) })}
        >
          <Row>
            <Field label={t.form.degree} required hint={t.form.degreeHint}>
              <Input
                value={item.degree}
                onChange={(e) => set(index, { degree: e.target.value })}
                placeholder={t.form.degreePh}
              />
            </Field>
            <Field label={t.form.fieldOfStudy}>
              <Input
                value={item.fieldOfStudy}
                onChange={(e) => set(index, { fieldOfStudy: e.target.value })}
                placeholder={t.form.fieldOfStudyPh}
              />
            </Field>
          </Row>

          <Row>
            <Field label={t.form.institution} required>
              <Input
                value={item.institution}
                onChange={(e) => set(index, { institution: e.target.value })}
                placeholder={t.form.institutionPh}
              />
            </Field>
            <Field label={t.form.city}>
              <Input
                value={item.city}
                onChange={(e) => set(index, { city: e.target.value })}
                placeholder={t.form.eduCityPh}
              />
            </Field>
          </Row>

          <Row>
            <MonthInput
              label={t.form.startDate}
              value={item.startDate}
              onChange={(value) => set(index, { startDate: value })}
            />
            <MonthInput
              label={t.form.graduated}
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
            label={t.form.stillStudying}
          />

          <Row>
            <Field label={t.form.gpa} hint={t.form.gpaHint}>
              <Input
                value={item.gpa}
                onChange={(e) => set(index, { gpa: e.target.value })}
                placeholder={t.form.gpaPh}
              />
            </Field>
            <Field label={t.form.maxGpa}>
              <Input
                value={item.maxGpa}
                onChange={(e) => set(index, { maxGpa: e.target.value })}
                placeholder={t.form.maxGpaPh}
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
        label={t.form.educationAdd}
        onClick={() => update({ educations: [...items, emptyEducation()] })}
      />
    </div>
  );
}

/* ========================================================================== */
/* Keahlian                                                                   */
/* ========================================================================== */

export function SkillSection() {
  const { data, update, setHighlight } = useEditor();
  const { t } = useI18n();
  const items = data.skills;
  const categories = SKILL_CATEGORIES[data.language];

  const set = (index: number, patch: Partial<(typeof items)[number]>) =>
    update({ skills: replaceAt(items, index, { ...items[index], ...patch }) });

  return (
    <div className="space-y-3" onFocusCapture={() => setHighlight("skill")}>
      <Callout tone="info">
        {t.form.skillCalloutLead} <strong>{t.form.skillCalloutGood}</strong>
        {t.form.skillCalloutMid} <strong>{t.form.skillCalloutBad}</strong>
        {t.form.skillCalloutTail}
      </Callout>

      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={item.id} className="flex gap-2">
            <Input
              className="flex-1"
              value={item.name}
              onChange={(e) => set(index, { name: e.target.value })}
              placeholder={t.form.skillNamePh}
              aria-label={t.form.skillNamePh}
            />
            <Select
              className="w-44"
              value={item.category}
              aria-label={t.form.skillCategory}
              onChange={(e) => set(index, { category: e.target.value })}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
              {!categories.includes(item.category) && (
                <option value={item.category}>{item.category}</option>
              )}
            </Select>
            <button
              type="button"
              title={t.form.skillRemove}
              aria-label={t.form.skillRemove}
              onClick={() => update({ skills: removeAt(items, index) })}
              className="shrink-0 rounded-lg px-2 text-bad hover:bg-red-50"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <AddButton
        label={t.form.skillAdd}
        onClick={() =>
          update({
            skills: [...items, emptySkill(items.at(-1)?.category ?? categories[0])],
          })
        }
      />
    </div>
  );
}

/* ========================================================================== */
/* Proyek                                                                     */
/* ========================================================================== */

/**
 * Bagian Proyek - sekaligus rumah bagi portofolio berbasis pola.
 *
 * Selama bentuk portofolio belum dinyalakan, yang tampil persis formulir lama:
 * nama, peran, alamat, tanggal, poin. Itulah yang membuat CV yang sudah
 * tersimpan tidak berubah bentuk sendiri.
 *
 * Begitu dinyalakan, bentuk isiannya dibaca dari skema pola - bukan ditulis di
 * sini. Tidak ada satu pun percabangan bidang maupun pola di dalam komponen
 * ini; yang ada hanya perulangan atas `fieldInti`.
 */
export function ProjectSection() {
  const { data, update, setHighlight } = useEditor();
  const { t } = useI18n();
  const teks = t.portofolio;
  const items = data.projects;
  const profil = data.profilPortofolio;
  const bagian = data.portofolio;
  const schema = skemaBagian(profil, "project");
  const kamus = saranKamus(profil.bidangKamus);
  const efekJenjang = EFEK_JENJANG[profil.jenjang];

  const set = (index: number, patch: Partial<ProjectItem>) =>
    update({ projects: replaceAt(items, index, { ...items[index], ...patch }) });

  /* ---------------------------------------------------------------- */
  /* Bentuk lama                                                       */
  /* ---------------------------------------------------------------- */

  if (!bagian.aktif) {
    return (
      <div className="space-y-3">
        {items.map((item, index) => (
          <EntryCard
            key={item.id}
            index={index}
            total={items.length}
            label={t.form.projectLabel}
            onFocusCapture={() => setHighlight(`project:${item.id}`)}
            onMoveUp={() => update({ projects: moveItem(items, index, index - 1) })}
            onMoveDown={() => update({ projects: moveItem(items, index, index + 1) })}
            onRemove={() => update({ projects: removeAt(items, index) })}
          >
            <Row>
              <Field label={t.form.projectName} required>
                <Input
                  value={item.name}
                  onChange={(e) => set(index, { name: e.target.value })}
                  placeholder={t.form.projectNamePh}
                />
              </Field>
              <Field label={t.form.projectRole}>
                <Input
                  value={item.role}
                  onChange={(e) => set(index, { role: e.target.value })}
                  placeholder={t.form.projectRolePh}
                />
              </Field>
            </Row>

            <Field label={t.form.projectUrl} hint={t.form.projectUrlHint}>
              <Input
                value={item.url}
                onChange={(e) => set(index, { url: e.target.value })}
                placeholder={t.form.projectUrlPh}
              />
            </Field>

            <Row>
              <MonthInput
                label={t.form.startDate}
                value={item.startDate}
                onChange={(value) => set(index, { startDate: value })}
              />
              <MonthInput
                label={t.form.endDate}
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
          label={t.form.projectAdd}
          onClick={() => update({ projects: [...items, emptyProject()] })}
        />

        <div className="rounded-lg border border-ink-200 bg-ink-50/60 p-3">
          <Switch
            checked={false}
            onChange={() => update({ portofolio: { ...bagian, aktif: true } })}
            label={teks.shapeToggle}
            hint={teks.shapeToggleHint}
          />
        </div>
      </div>
    );
  }

  /* ---------------------------------------------------------------- */
  /* Bentuk portofolio                                                 */
  /* ---------------------------------------------------------------- */

  const bawah = efekJenjang.batasBawahItem ?? schema.rentangItemIdeal[0];
  const atas = kamus?.rentangItemIdeal?.[1] ?? schema.rentangItemIdeal[1];

  /*
    Berapa item yang pemberi kerjanya cocok persis dengan salah satu entri
    pengalaman kerja. Inilah syarat tawaran penggabungan muncul - bukan
    penggabungannya sendiri, yang tetap menunggu keputusan pengguna.
  */
  const cocokInduk = items.filter((item) =>
    data.experiences.some(
      (e) => e.company.trim() && e.company.trim() === item.konteks.trim(),
    ),
  );

  const nyalakanGabung = () => {
    // Pencocokan otomatis hanya untuk yang namanya sama persis. Sisanya
    // dibiarkan tanpa induk supaya penggunanya sendiri yang memilih.
    const projects = items.map((item) => {
      if (item.parentPengalamanId) return item;
      const induk = data.experiences.find(
        (e) => e.company.trim() && e.company.trim() === item.konteks.trim(),
      );
      return induk ? { ...item, parentPengalamanId: induk.id } : item;
    });
    update({ projects, portofolio: { ...bagian, gabungKePengalaman: true } });
  };

  const tambahItem = (item: ProjectItem) =>
    update({ projects: [...items, item] });

  return (
    <div className="space-y-3">
      {/* ---------------- Pengaturan bagian ---------------- */}
      <div className="space-y-3 rounded-lg border border-ink-200 bg-ink-50/60 p-3">
        <Field label={teks.headingLabel} hint={teks.headingHint}>
          <Select
            value={bagian.judulPilihan}
            onChange={(e) =>
              update({ portofolio: { ...bagian, judulPilihan: e.target.value } })
            }
          >
            <option value="">{schema.headingCV}</option>
            {schema.headingAlternatif.map((judul) => (
              <option key={judul} value={judul}>
                {judul}
              </option>
            ))}
          </Select>
        </Field>

        <Switch
          checked={bagian.gabungKePengalaman}
          onChange={(checked) =>
            checked
              ? nyalakanGabung()
              : update({ portofolio: { ...bagian, gabungKePengalaman: false } })
          }
          label={teks.mergeLabel}
          hint={teks.mergeHint}
        />

        {/*
          Tawaran penggabungan. Ditampilkan sebagai tawaran, bukan dikerjakan
          sendiri: yang berubah bukan tampilan melainkan tempat separuh isi CV
          seseorang tercetak, dan perubahan sebesar itu tanpa ia sadari adalah
          kejutan yang buruk.
        */}
        {!bagian.gabungKePengalaman && cocokInduk.length > 0 && (
          <div className="rounded-lg border border-brand-200 bg-white p-3">
            <p className="text-[11px] leading-relaxed text-ink-700">
              {teks.mergeOffer
                .replace("{n}", String(cocokInduk.length))
                .replace("{total}", String(items.length))}
            </p>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              <div className="rounded-md border border-ink-200 p-2">
                <p className="text-[10px] font-semibold tracking-wide text-ink-500 uppercase">
                  {teks.mergeBefore}
                </p>
                <p className="mt-0.5 text-[11px] text-ink-600">
                  {schema.headingCV} - {teks.mergePreviewSeparate}
                </p>
              </div>
              <div className="rounded-md border border-brand-300 p-2">
                <p className="text-[10px] font-semibold tracking-wide text-ink-500 uppercase">
                  {teks.mergeAfter}
                </p>
                <p className="mt-0.5 text-[11px] text-ink-600">
                  {teks.mergePreviewNested}
                </p>
              </div>
            </div>
            <div className="mt-2">
              <Button size="sm" onClick={nyalakanGabung}>
                {teks.mergeAccept}
              </Button>
            </div>
          </div>
        )}

        <Switch
          checked={bagian.modeRedaksi}
          onChange={(checked) =>
            update({ portofolio: { ...bagian, modeRedaksi: checked } })
          }
          label={teks.redactionLabel}
          hint={teks.redactionHint}
        />
        {bagian.modeRedaksi && (
          <p className="rounded-md bg-ink-100 px-2.5 py-1.5 text-[11px] leading-relaxed text-ink-600">
            {teks.redactionNote}
          </p>
        )}

        <Switch
          checked
          onChange={() => update({ portofolio: { ...bagian, aktif: false } })}
          label={teks.shapeToggle}
          hint={teks.shapeToggleHint}
        />

        <p className="text-[11px] text-ink-500">
          {atas === null
            ? teks.itemRangeOpen.replace("{min}", String(bawah))
            : teks.itemRange
                .replace("{min}", String(bawah))
                .replace("{max}", String(atas))}
        </p>
      </div>

      {/* ---------------- Peringatan pola dan bidang ---------------- */}
      {(schema.peringatan.length > 0 ||
        (kamus?.peringatanTambahan ?? []).length > 0) && (
        <Callout tone="warn">
          <ul className="list-disc space-y-1 pl-4">
            {schema.peringatan.map((p) => (
              <li key={p}>{p}</li>
            ))}
            {(kamus?.peringatanTambahan ?? []).map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </Callout>
      )}

      {/* ---------------- Blok agregat ---------------- */}
      {schema.blokAgregat && (
        <BlokAgregat
          def={schema.blokAgregat}
          isi={bagian.agregat}
          onChange={(agregat) => update({ portofolio: { ...bagian, agregat } })}
        />
      )}

      {/* ---------------- Daftar item ---------------- */}
      {items.map((item, index) => {
        const induk = data.experiences.find(
          (e) => e.id === item.parentPengalamanId,
        );
        const tanggalBermasalah = induk ? tanggalDiLuarInduk(item, induk) : false;
        const arsip = isiArsip(item);

        return (
          <EntryCard
            key={item.id}
            index={index}
            total={items.length}
            label={schema.labelItem}
            onFocusCapture={() => setHighlight(`project:${item.id}`)}
            onMoveUp={() => update({ projects: moveItem(items, index, index - 1) })}
            onMoveDown={() => update({ projects: moveItem(items, index, index + 1) })}
            onRemove={() => update({ projects: removeAt(items, index) })}
          >
            <Row>
              <Field label={t.form.projectName} required>
                <Input
                  value={item.name}
                  onChange={(e) => set(index, { name: e.target.value })}
                  placeholder={schema.contoh.judul}
                />
              </Field>
              <Field label={t.form.projectRole}>
                <Input
                  value={item.role}
                  onChange={(e) => set(index, { role: e.target.value })}
                  placeholder={schema.contoh.peran}
                />
              </Field>
            </Row>

            <Row>
              <Field label={teks.contextLabel} hint={teks.contextHint} required>
                <Input
                  value={item.konteks}
                  onChange={(e) => set(index, { konteks: e.target.value })}
                  placeholder={schema.contoh.konteks}
                />
              </Field>
              <Field label={teks.locationLabel}>
                <Input
                  value={item.lokasi}
                  onChange={(e) => set(index, { lokasi: e.target.value })}
                  placeholder={t.form.cityPh}
                />
              </Field>
            </Row>

            <Row>
              <MonthInput
                label={t.form.startDate}
                value={item.startDate}
                onChange={(value) => set(index, { startDate: value })}
              />
              <MonthInput
                label={t.form.endDate}
                value={item.endDate}
                onChange={(value) => set(index, { endDate: value })}
              />
            </Row>

            {bagian.gabungKePengalaman && (
              <Field label={teks.parentLabel}>
                <Select
                  value={item.parentPengalamanId}
                  onChange={(e) =>
                    set(index, { parentPengalamanId: e.target.value })
                  }
                >
                  <option value="">{teks.parentNone}</option>
                  {data.experiences.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.company || e.jobTitle}
                    </option>
                  ))}
                </Select>
                {tanggalBermasalah && (
                  <div className="mt-1.5 rounded-md border border-amber-200 bg-amber-50 px-2 py-1.5">
                    <p className="text-[11px] leading-relaxed text-ink-700">
                      {teks.parentDateWarn}
                    </p>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="mt-1"
                      onClick={() => set(index, { parentPengalamanId: "" })}
                    >
                      {teks.parentDetach}
                    </Button>
                  </div>
                )}
              </Field>
            )}

            <Field
              label={teks.summaryLabel}
              hint={`${teks.summaryHint} (${item.ringkasan.length}/160)`}
            >
              <Input
                value={item.ringkasan}
                maxLength={160}
                onChange={(e) => set(index, { ringkasan: e.target.value })}
                placeholder={schema.contoh.ringkasan}
              />
            </Field>

            <div>
              <BulletEditor
                bullets={item.bullets}
                onChange={(bullets) => set(index, { bullets })}
              />
              <div className="mt-1 flex flex-wrap gap-1.5">
                {item.bullets
                  .filter((b) => b.trim())
                  .map((b, i) => (
                    <span
                      key={i}
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[10px]",
                        adaAngka(b)
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-ink-100 text-ink-600",
                      )}
                    >
                      {i + 1}. {b.length} - {adaAngka(b) ? teks.hasNumber : teks.noNumber}
                    </span>
                  ))}
              </div>
              <div className="mt-2">
                <PeriksaBahasa
                  kalimat={[...item.bullets, item.ringkasan]}
                  wajib={schema.aturanBahasa === "orang-pertama-wajib"}
                />
              </div>
            </div>

            <TautanEditor
              tautan={item.tautan}
              placeholder={t.form.projectUrlPh}
              onChange={(tautan) => set(index, { tautan })}
            />

            <Lipat
              judul={teks.coreBlock}
              jumlah={Object.keys(item.inti).length}
              bukaAwal
            >
              {schema.fieldInti
                .filter((field) => field.simpanDi !== "tautan")
                .map((field) => (
                  <FieldIntiInput
                    key={field.key}
                    field={field}
                    nilai={item.inti[field.key]}
                    saranTambahan={kamus?.saranIsiFieldInti?.[field.key]}
                    onChange={(nilai) =>
                      set(index, { inti: { ...item.inti, [field.key]: nilai } })
                    }
                  />
                ))}
            </Lipat>

            <Lipat judul={teks.extraBlock} jumlah={item.detailTambahan.length}>
              <DetailTambahanEditor
                detail={item.detailTambahan}
                saran={kamus?.saranDetailTambahan ?? []}
                onChange={(detailTambahan) => set(index, { detailTambahan })}
              />
            </Lipat>

            {arsip.length > 0 && (
              <div className="rounded-lg border border-dashed border-ink-300 p-2.5">
                <p className="text-[11px] font-semibold text-ink-700">
                  {teks.archiveTitle}
                </p>
                <ul className="mt-1 space-y-1">
                  {arsip.map((a) => (
                    <li
                      key={a.kunci}
                      className="flex items-center justify-between gap-2 text-[11px] text-ink-600"
                    >
                      <span className="truncate">{a.teks}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          update({
                            projects: replaceAt(
                              items,
                              index,
                              pulihkanKeDetail(item, a.kunci, a.kunci),
                            ),
                          })
                        }
                      >
                        {teks.archiveRestore}
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Lipat judul={teks.privateBlock} keterangan={teks.privateBlockHint}>
              <BlokPribadi
                verifikator={item.verifikator}
                refleksi={item.refleksi}
                onVerifikator={(verifikator) => set(index, { verifikator })}
                onRefleksi={(refleksi) => set(index, { refleksi })}
              />
            </Lipat>
          </EntryCard>
        );
      })}

      <div className="grid gap-2 sm:grid-cols-2">
        <AddButton
          label={`${teks.addItem} ${schema.labelItem}`}
          onClick={() => tambahItem(emptyProject())}
        />
        <Button
          variant="outline"
          className="w-full"
          onClick={() => tambahItem(buatContohItem(data, schema))}
        >
          <Sparkles size={14} />
          {teks.fillExample}
        </Button>
      </div>
    </div>
  );
}

/* ========================================================================== */
/* Sertifikasi                                                                */
/* ========================================================================== */

export function CertificationSection() {
  const { data, update, setHighlight } = useEditor();
  const { t } = useI18n();
  const teks = t.portofolio;
  const items = data.certifications;
  const kamus = saranKamus(data.profilPortofolio.bidangKamus);

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
          label={t.form.certificationLabel}
          onFocusCapture={() => setHighlight(`certification:${item.id}`)}
          onMoveUp={() =>
            update({ certifications: moveItem(items, index, index - 1) })
          }
          onMoveDown={() =>
            update({ certifications: moveItem(items, index, index + 1) })
          }
          onRemove={() => update({ certifications: removeAt(items, index) })}
        >
          <Field label={t.form.certName} required>
            <Input
              value={item.name}
              onChange={(e) => set(index, { name: e.target.value })}
              placeholder={t.form.certNamePh}
            />
          </Field>

          <Field label={t.form.certIssuer} required>
            <Input
              value={item.issuer}
              onChange={(e) => set(index, { issuer: e.target.value })}
              placeholder={t.form.certIssuerPh}
            />
          </Field>

          {/*
            Empat kategori kredensial, dan bentuk masa berlakunya.

            Yang paling menentukan justru pilihan "seumur hidup": sejak
            UU 17/2023, STR Definitif memang tidak lagi punya tanggal
            kedaluwarsa, dan formulir yang hanya menerima tanggal menuntut
            penggunanya mengarang tanggal yang tidak ada.
          */}
          <Row>
            <Field label={teks.credCategory} hint={teks.credCategoryHint}>
              <Select
                value={item.kategori}
                onChange={(e) =>
                  set(index, {
                    kategori: e.target.value as KategoriKredensial | "",
                  })
                }
              >
                <option value="">-</option>
                {(
                  Object.keys(LABEL_KATEGORI_KREDENSIAL) as KategoriKredensial[]
                ).map((kategori) => (
                  <option key={kategori} value={kategori}>
                    {LABEL_KATEGORI_KREDENSIAL[kategori]}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label={teks.credValidity} hint={teks.credValidityHint}>
              <Select
                value={item.masaBerlaku}
                onChange={(e) =>
                  set(index, {
                    masaBerlaku: e.target.value as MasaBerlakuJenis | "",
                  })
                }
              >
                <option value="">-</option>
                {(Object.keys(MASA_BERLAKU_LABEL) as MasaBerlakuJenis[]).map(
                  (jenis) => (
                    <option key={jenis} value={jenis}>
                      {MASA_BERLAKU_LABEL[jenis]}
                    </option>
                  ),
                )}
              </Select>
            </Field>
          </Row>

          {item.kategori === "berjenjang" && (
            <Row>
              <Field label={teks.credLevel}>
                <Input
                  value={item.jenjang}
                  placeholder={teks.credLevelPh}
                  onChange={(e) => set(index, { jenjang: e.target.value })}
                />
              </Field>
              <Field label={teks.credClass}>
                <Input
                  value={item.klasifikasi}
                  placeholder={teks.credClassPh}
                  onChange={(e) => set(index, { klasifikasi: e.target.value })}
                />
              </Field>
            </Row>
          )}

          {item.kategori === "kompetensi" && (
            <Field label={teks.credSubType}>
              <Input
                value={item.subTipe}
                placeholder={teks.credSubTypePh}
                onChange={(e) => set(index, { subTipe: e.target.value })}
              />
            </Field>
          )}

          <Row>
            <MonthInput
              label={t.form.certIssueDate}
              value={item.issueDate}
              onChange={(value) => set(index, { issueDate: value })}
            />
            <MonthInput
              label={t.form.certExpiry}
              value={item.expiryDate}
              hint={t.form.certExpiryHint}
              onChange={(value) => set(index, { expiryDate: value })}
            />
          </Row>

          <Row>
            <Field label={t.form.certCredentialId} hint={t.form.certCredentialHint}>
              <Input
                value={item.credentialId}
                onChange={(e) => set(index, { credentialId: e.target.value })}
                placeholder={t.form.certCredentialPh}
              />
            </Field>
            <Field label={t.form.certVerifyUrl}>
              <Input
                value={item.url}
                onChange={(e) => set(index, { url: e.target.value })}
                placeholder={t.form.certVerifyPh}
              />
            </Field>
          </Row>
        </EntryCard>
      ))}

      <AddButton
        label={t.form.certificationAdd}
        onClick={() =>
          update({ certifications: [...items, emptyCertification()] })
        }
      />

      {/*
        Kredensial yang lazim di bidangnya, langsung dari kamus.

        Keterangan masa berlakunya ikut apa adanya - termasuk yang berbunyi
        "ditetapkan per skema oleh masing-masing LSP", karena itu memang
        jawabannya. Menuliskan "3 tahun" untuk seluruh sertifikat BNSP akan
        salah pada sebagian besar di antaranya.
      */}
      {(kamus?.kredensial ?? []).length > 0 && (
        <div>
          <p className="mb-1.5 text-[11px] font-medium text-ink-700">
            {teks.credSuggest}
          </p>
          <div className="flex flex-wrap gap-1">
            {(kamus?.kredensial ?? []).map((k) => (
              <button
                key={k.nama}
                type="button"
                title={`${k.penerbit} - ${k.masaBerlaku}`}
                onClick={() =>
                  update({
                    certifications: [
                      ...items,
                      {
                        ...emptyCertification(),
                        name: k.nama,
                        issuer: k.penerbit,
                        kategori: k.kategori,
                        masaBerlaku: /seumur hidup/i.test(k.masaBerlaku)
                          ? "seumur-hidup"
                          : /tidak punya masa berlaku|tanpa masa berlaku/i.test(
                                k.masaBerlaku,
                              )
                            ? "tidak-berlaku"
                            : "",
                      },
                    ],
                  })
                }
                className="max-w-full truncate rounded-full border border-ink-200 px-2 py-0.5 text-[11px] text-ink-600 transition-colors hover:bg-ink-50"
              >
                + {k.nama}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ========================================================================== */
/* Organisasi                                                                 */
/* ========================================================================== */

export function OrganizationSection() {
  const { data, update, setHighlight } = useEditor();
  const { t } = useI18n();
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
          label={t.form.organizationLabel}
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
            <Field label={t.form.orgName} required>
              <Input
                value={item.name}
                onChange={(e) => set(index, { name: e.target.value })}
                placeholder={t.form.orgNamePh}
              />
            </Field>
            <Field label={t.form.orgRole} required>
              <Input
                value={item.role}
                onChange={(e) => set(index, { role: e.target.value })}
                placeholder={t.form.orgRolePh}
              />
            </Field>
          </Row>

          <Row>
            <MonthInput
              label={t.form.startDate}
              value={item.startDate}
              onChange={(value) => set(index, { startDate: value })}
            />
            <MonthInput
              label={t.form.endDate}
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
            label={t.form.stillActive}
          />

          <BulletEditor
            bullets={item.bullets}
            onChange={(bullets) => set(index, { bullets })}
          />
        </EntryCard>
      ))}

      <AddButton
        label={t.form.organizationAdd}
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
  const { t } = useI18n();
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
          label={t.form.awardLabel}
          onFocusCapture={() => setHighlight(`award:${item.id}`)}
          onMoveUp={() => update({ awards: moveItem(items, index, index - 1) })}
          onMoveDown={() => update({ awards: moveItem(items, index, index + 1) })}
          onRemove={() => update({ awards: removeAt(items, index) })}
        >
          <Field label={t.form.awardTitle} required hint={t.form.awardTitleHint}>
            <Input
              value={item.title}
              onChange={(e) => set(index, { title: e.target.value })}
              placeholder={t.form.awardTitlePh}
            />
          </Field>

          <Row>
            <Field label={t.form.awardIssuer}>
              <Input
                value={item.issuer}
                onChange={(e) => set(index, { issuer: e.target.value })}
                placeholder={t.form.awardIssuerPh}
              />
            </Field>
            <MonthInput
              label={t.form.awardDate}
              value={item.date}
              onChange={(value) => set(index, { date: value })}
            />
          </Row>

          <Field label={t.form.awardDescription}>
            <Textarea
              rows={2}
              value={item.description}
              onChange={(e) => set(index, { description: e.target.value })}
              placeholder={t.form.awardDescriptionPh}
            />
          </Field>
        </EntryCard>
      ))}

      <AddButton
        label={t.form.awardAdd}
        onClick={() => update({ awards: [...items, emptyAward()] })}
      />
    </div>
  );
}

/* ========================================================================== */
/* Bahasa                                                                     */
/* ========================================================================== */

export function LanguageSection() {
  const { data, update, setHighlight } = useEditor();
  const { locale, t } = useI18n();
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
              placeholder={t.form.languageNamePh}
              aria-label={t.form.languageNamePh}
            />
            <Select
              className="w-40"
              value={item.proficiency}
              aria-label={t.form.languageLevel}
              onChange={(e) =>
                set(index, {
                  proficiency: e.target
                    .value as (typeof items)[number]["proficiency"],
                })
              }
            >
              {Object.entries(PROFICIENCY_LABELS[locale]).map(
                ([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ),
              )}
            </Select>
            <button
              type="button"
              title={t.form.languageRemove}
              aria-label={t.form.languageRemove}
              onClick={() => update({ languages: removeAt(items, index) })}
              className="shrink-0 rounded-lg px-2 text-bad hover:bg-red-50"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <AddButton
        label={t.form.languageAdd}
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
  const { t } = useI18n();
  const items = data.publications;

  const set = (index: number, patch: Partial<(typeof items)[number]>) =>
    update({
      publications: replaceAt(items, index, { ...items[index], ...patch }),
    });

  /*
    Pola Publikasi & Kredit bekerja pada bagian ini, bukan pada bagian Proyek.
    Bagian ini memang sudah berbentuk pola itu sejak semula - judul, penerbit,
    tanggal, DOI - jadi yang ditambahkan hanya tiga hal yang belum punya rumah:
    tipe luaran, peran penulis, dan tingkat indeksasinya.

    Field yang sudah punya kotak isian sendiri di bawah (judul, penerbit,
    alamat) sengaja dilewati, supaya isian yang sama tidak diminta dua kali.
  */
  const skemaPublikasi = skemaBagian(data.profilPortofolio, "publication");
  const sudahAda = ["title", "publisher", "url"];
  const fieldTambahan = data.portofolio.aktif
    ? skemaPublikasi.fieldInti.filter(
        (field) => field.simpanDi && !sudahAda.includes(field.simpanDi),
      )
    : [];

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <EntryCard
          key={item.id}
          index={index}
          total={items.length}
          label={t.form.publicationLabel}
          onFocusCapture={() => setHighlight(`publication:${item.id}`)}
          onMoveUp={() =>
            update({ publications: moveItem(items, index, index - 1) })
          }
          onMoveDown={() =>
            update({ publications: moveItem(items, index, index + 1) })
          }
          onRemove={() => update({ publications: removeAt(items, index) })}
        >
          <Field label={t.form.pubTitle} required>
            <Textarea
              rows={2}
              value={item.title}
              onChange={(e) => set(index, { title: e.target.value })}
              placeholder={t.form.pubTitlePh}
            />
          </Field>

          <Field label={t.form.pubPublisher}>
            <Input
              value={item.publisher}
              onChange={(e) => set(index, { publisher: e.target.value })}
              placeholder={t.form.pubPublisherPh}
            />
          </Field>

          <Row>
            <MonthInput
              label={t.form.pubDate}
              value={item.date}
              onChange={(value) => set(index, { date: value })}
            />
            <Field label="DOI">
              <Input
                value={item.doi}
                onChange={(e) => set(index, { doi: e.target.value })}
                placeholder={t.form.pubDoiPh}
              />
            </Field>
          </Row>

          {fieldTambahan.length > 0 && (
            <Lipat judul={t.portofolio.publicationExtra} bukaAwal>
              {fieldTambahan.map((field) => (
                <FieldIntiInput
                  key={field.key}
                  field={field}
                  nilai={
                    (item[field.simpanDi as "tipeLuaran"] as string) ?? ""
                  }
                  onChange={(nilai) =>
                    set(index, {
                      [field.simpanDi as string]: Array.isArray(nilai)
                        ? nilai.join(", ")
                        : String(nilai),
                    })
                  }
                />
              ))}
            </Lipat>
          )}

          <Field label={t.form.pubUrl}>
            <Input
              value={item.url}
              onChange={(e) => set(index, { url: e.target.value })}
              placeholder={t.form.pubUrlPh}
            />
          </Field>
        </EntryCard>
      ))}

      <AddButton
        label={t.form.publicationAdd}
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
  const { t } = useI18n();
  const sections = data.customSections;

  return (
    <div className="space-y-3">
      {sections.map((section, sectionIndex) => (
        <EntryCard
          key={section.id}
          index={sectionIndex}
          total={sections.length}
          label={t.form.customLabel}
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
            label={t.form.customSectionTitle}
            required
            hint={t.form.customSectionTitleHint}
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
              placeholder={t.form.customSectionTitlePh}
            />
          </Field>

          {section.items.map((item, itemIndex) => (
            <div
              key={item.id}
              className="space-y-3 rounded-lg border border-ink-200 bg-white p-3"
            >
              <Row>
                <Field label={t.form.customEntryTitle}>
                  <Input
                    value={item.title}
                    placeholder={t.form.customEntryTitlePh}
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
                <Field label={t.form.customEntrySubtitle}>
                  <Input
                    value={item.subtitle}
                    placeholder={t.form.customEntrySubtitlePh}
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

              <Row>
                <MonthInput
                  label={t.form.startDate}
                  value={item.startDate}
                  onChange={(value) =>
                    update({
                      customSections: replaceAt(sections, sectionIndex, {
                        ...section,
                        items: replaceAt(section.items, itemIndex, {
                          ...item,
                          startDate: value,
                        }),
                      }),
                    })
                  }
                />
                <MonthInput
                  label={t.form.endDate}
                  value={item.endDate}
                  onChange={(value) =>
                    update({
                      customSections: replaceAt(sections, sectionIndex, {
                        ...section,
                        items: replaceAt(section.items, itemIndex, {
                          ...item,
                          endDate: value,
                        }),
                      }),
                    })
                  }
                />
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
                {t.form.customRemoveEntry}
              </button>
            </div>
          ))}

          <AddButton
            label={t.form.customAddEntry}
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
        label={t.form.customAddSection}
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

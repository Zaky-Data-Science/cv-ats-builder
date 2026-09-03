"use client";

import * as React from "react";
import { useI18n } from "@/components/i18n";
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
import { templateStyle } from "@/lib/resume/templates";
import type { ResumeLanguage, SectionKey } from "@/lib/resume/types";
import { moveItem, removeAt, replaceAt, useEditor } from "./context";
import { AddButton, BulletEditor, EntryCard, MonthInput, Row } from "./parts";
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
                onChange={(photoUrl) => set({ photoUrl })}
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

export function ProjectSection() {
  const { data, update, setHighlight } = useEditor();
  const { t } = useI18n();
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
    </div>
  );
}

/* ========================================================================== */
/* Sertifikasi                                                                */
/* ========================================================================== */

export function CertificationSection() {
  const { data, update, setHighlight } = useEditor();
  const { t } = useI18n();
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

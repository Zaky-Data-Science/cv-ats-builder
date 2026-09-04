import * as React from "react";
import { paperSpec } from "@/lib/resume/paper";
import { groupSkills, proficiencyLabel } from "@/lib/resume/plaintext";
import { isSectionVisible, sectionHeading } from "@/lib/resume/sections";
import { customEntryBase, customEntryPath } from "@/lib/resume/edit-path";
import { customItemsSection } from "@/lib/resume/structure";
import {
  paperPadding,
  resumeMargins,
  templateStyle,
  type PaddingMode,
  type TemplateStyle,
} from "@/lib/resume/templates";
import type {
  ResumeData,
  ResumeLanguage,
  SectionKey,
} from "@/lib/resume/types";
import {
  ensureHttp,
  formatDateRange,
  formatMonth,
  joinNonEmpty,
  prettyUrl,
} from "@/lib/utils";

/**
 * ============================================================================
 *  DOKUMEN CV
 * ============================================================================
 *
 * Satu komponen ini dipakai di dua tempat: pratinjau langsung di editor dan
 * halaman cetak yang menghasilkan PDF. Karena keduanya memakai komponen yang
 * sama, apa yang dilihat pengguna saat mengetik dijamin identik dengan berkas
 * yang ia unduh.
 *
 * Kaidah ATS yang dipegang seluruh template:
 *  - Satu kolom. Tata letak dua kolom membuat parser membaca teks
 *    berselang-seling antar-kolom sehingga kalimat menjadi kacau.
 *  - Tanpa tabel, kotak teks, header/footer halaman, maupun teks di dalam
 *    gambar. Semua isi adalah teks alir biasa.
 *  - Judul section memakai istilah baku, bukan judul kreatif.
 *  - Perbedaan antar-template murni tipografi: ukuran, jarak, dan garis.
 *    Struktur bacaannya tetap sama sehingga tidak ada template yang
 *    "lebih tidak terbaca" dibanding yang lain.
 *
 * Atribut data-field pada setiap blok dipakai fitur sorotan: begitu sebuah
 * field difokuskan di form, blok yang bersangkutan disorot di sini.
 */

export interface ResumeDocumentProps {
  data: ResumeData;
  /** Kunci blok yang sedang disorot, mis. "experience:abc123". */
  highlight?: string | null;
  /** Menonaktifkan sorotan dan efek layar saat dipakai untuk mencetak. */
  printMode?: boolean;
  /**
   * Siapa yang menyediakan margin halaman.
   *
   * "full" berarti dokumen ini yang menyediakannya - benar untuk pratinjau
   * bersambung dan pratinjau template, yang memang menampilkan satu kertas
   * utuh. "horizontal" dan "none" menyerahkannya kepada lembar pratinjau atau
   * kepada aturan @page saat mencetak, sehingga margin atas dan bawah
   * diperoleh **setiap** halaman - bukan hanya halaman pertama dan terakhir.
   */
  padding?: PaddingMode;
  className?: string;
  /**
   * Menjadikan isi kertas dapat disunting langsung.
   *
   * Yang dikerjakan di sini hanya **menandai** elemennya, dengan tiga penanda
   * menurut jenis suntingannya: `data-edit` beserta `contentEditable` untuk
   * teks yang diketik, `data-date` untuk periode yang dipilih lewat pemilih
   * bulan, dan `data-add` untuk tombol tambah entri. Yang menanganinya adalah
   * panel pratinjau di editor. Pembagian itu disengaja - berkas ini juga
   * dirender di server untuk halaman cetak dan halaman depan, tempat tidak
   * ada penangan peristiwa sama sekali.
   *
   * Selama menyala, field yang masih kosong ikut dirender sebagai penampung
   * samar supaya ada yang dapat diklik. Penampung itu tidak pernah ikut ke
   * jalur cetak - lihat `.edit-kosong` di globals.css untuk alasan labelnya
   * digambar lewat ::before, bukan ditulis sebagai isi elemen.
   */
  editable?: boolean;
}

/** Atribut yang menjadikan sebuah teks dapat diketik, atau tidak sama sekali. */
export type EditAttrs = (path: string) => Record<string, unknown>;

export function ResumeDocument({
  data,
  highlight,
  printMode = false,
  padding = "full",
  className,
  editable = false,
}: ResumeDocumentProps) {
  const style = templateStyle(data.template);
  const paper = paperSpec(data.pageSize);
  const margins = resumeMargins(data);
  const lang = data.language;
  const accent = style.useAccent ? data.accentColor : "#000000";

  /*
    Gaya kronologis: garis tipis di sisi kiri setiap entri. Dipakai sebagai
    satu objek bersama, bukan ditulis ulang di tiap section, supaya tidak ada
    entri yang tertinggal saat template ini dipilih.
  */
  const entryStyle: React.CSSProperties = style.entryMarker
    ? {
        marginBottom: style.entryGap,
        borderLeft: "0.75pt solid #000",
        paddingLeft: "7pt",
      }
    : { marginBottom: style.entryGap };

  const isOn = (key: string) => !printMode && highlight === key;
  const blockClass = (key: string) =>
    `avoid-break${isOn(key) ? " preview-highlight" : ""}`;

  /*
    Pemeriksa ejaan sengaja dimatikan. Garis merah bergelombang di bawah nama
    perusahaan dan istilah teknis membuat kertas pratinjau terlihat penuh
    kesalahan padahal tidak ada yang salah - dan pratinjau ini yang dipakai
    pengguna untuk menilai apakah CV-nya sudah rapi.
  */
  /** Label penampung dalam bahasa CV ini. */
  const ph = (kunci: string) => (editable ? labelPenampung(kunci, lang) : "");

  const edit: EditAttrs = (path) =>
    editable
      ? {
          contentEditable: true,
          suppressContentEditableWarning: true,
          spellCheck: false,
          "data-edit": path,
        }
      : {};

  const heading = (key: SectionKey) => (
    <SectionHeading
      title={sectionHeading(key, lang)}
      style={style}
      accent={accent}
    />
  );

  const info = data.personalInfo;
  const contactLine = joinNonEmpty(
    [info.email, info.phone, joinNonEmpty([info.city, info.province, info.country])],
    "  •  ",
  );
  const linkParts = [info.linkedinUrl, info.portfolioUrl, info.githubUrl]
    .filter((v) => v.trim())
    .map((v) => v.trim());

  return (
    <article
      className={`paper ${className ?? ""}`}
      style={
        {
          fontFamily: `${data.fontFamily}, Arial, Helvetica, sans-serif`,
          fontSize: `${data.fontSize}pt`,
          lineHeight: data.lineHeight,
          padding: paperPadding(margins, padding),
          // Ukuran kertas dikirim sebagai custom property, bukan lebar/tinggi
          // langsung, agar aturan cetak di globals.css dapat menimpanya
          // dengan "width: auto" tanpa berbenturan dengan style sebaris.
          "--paper-width": `${paper.widthMm}mm`,
          // Tinggi minimum hanya berlaku saat dokumen ini memang mewakili satu
          // kertas utuh. Pada mode per halaman, lembarnyalah yang menentukan
          // tinggi; memaksakan tinggi kertas di sini akan membuat CV pendek
          // terhitung dua halaman.
          "--paper-height": padding === "full" ? `${paper.heightMm}mm` : "0",
        } as React.CSSProperties
      }
      data-resume-document
      data-paper={paper.id}
    >
      {/* ------------------------------------------------------------------ */}
      {/* Kepala: nama, jabatan, kontak                                       */}
      {/* ------------------------------------------------------------------ */}
      <ResumeHeader
        data={data}
        style={style}
        accent={accent}
        contactLine={contactLine}
        linkParts={linkParts}
        className={blockClass("personal")}
        edit={edit}
      />

      {/* ------------------------------------------------------------------ */}
      {/* Section, mengikuti urutan yang diatur pengguna                      */}
      {/* ------------------------------------------------------------------ */}
      {data.sectionOrder.map((key) => {
        if (!isSectionVisible(data, key)) return null;

        switch (key) {
          case "summary":
            return (
              <section key={key} style={{ marginBottom: style.sectionGap }}>
                {heading(key)}
                <p
                  data-field="summary"
                  className={blockClass("summary")}
                  style={{ textAlign: "justify" }}
                  {...edit("personalInfo.summary")}
                >
                  {info.summary}
                </p>
              </section>
            );

          case "experience":
            return (
              <section key={key} style={{ marginBottom: style.sectionGap }}>
                {heading(key)}
                {data.experiences.map((e, i) => (
                  <div
                    key={e.id}
                    data-field={`experience:${e.id}`}
                    className={blockClass(`experience:${e.id}`)}
                    style={entryStyle}
                  >
                    <EntryHeader
                      primary={[
                        {
                          text: e.jobTitle,
                          attrs: edit(`experiences.${i}.jobTitle`),
                          ph: ph("jobTitle"),
                        },
                      ]}
                      secondary={[
                        {
                          text: e.company,
                          attrs: edit(`experiences.${i}.company`),
                          ph: ph("company"),
                        },
                        {
                          text: e.city,
                          attrs: edit(`experiences.${i}.city`),
                          ph: ph("city"),
                        },
                        {
                          text: e.country,
                          attrs: edit(`experiences.${i}.country`),
                          ph: ph("country"),
                        },
                      ]}
                      meta={formatDateRange(
                        e.startDate,
                        e.endDate,
                        e.isCurrent,
                        lang,
                      )}
                      metaPath={editable ? `experiences.${i}` : undefined}
                      metaPh={ph("period")}
                      fontSize={data.fontSize}
                    />
                    <Bullets
                      items={e.bullets}
                      fontSize={data.fontSize}
                      edit={edit}
                      basePath={`experiences.${i}`}
                      ph={ph("bullet")}
                    />
                  </div>
                ))}
                <TombolTambah section="experiences" label={ph("addEntry")} />
              </section>
            );

          case "education":
            return (
              <section key={key} style={{ marginBottom: style.sectionGap }}>
                {heading(key)}
                {data.educations.map((e, i) => (
                  <div
                    key={e.id}
                    data-field={`education:${e.id}`}
                    className={blockClass(`education:${e.id}`)}
                    style={entryStyle}
                  >
                    <EntryHeader
                      primary={[
                        {
                          text: e.degree,
                          attrs: edit(`educations.${i}.degree`),
                          ph: ph("degree"),
                        },
                        {
                          text: e.fieldOfStudy,
                          attrs: edit(`educations.${i}.fieldOfStudy`),
                          ph: ph("fieldOfStudy"),
                        },
                      ]}
                      secondary={[
                        {
                          text: e.institution,
                          attrs: edit(`educations.${i}.institution`),
                          ph: ph("institution"),
                        },
                        {
                          text: e.city,
                          attrs: edit(`educations.${i}.city`),
                          ph: ph("city"),
                        },
                      ]}
                      meta={formatDateRange(
                        e.startDate,
                        e.endDate,
                        e.isCurrent,
                        lang,
                      )}
                      metaPath={editable ? `educations.${i}` : undefined}
                      metaPh={ph("period")}
                      fontSize={data.fontSize}
                    />
                    {e.gpa && (
                      <p>
                        {lang === "EN" ? "GPA" : "IPK"}: {e.gpa}
                        {e.maxGpa ? ` / ${e.maxGpa}` : ""}
                      </p>
                    )}
                    <Bullets
                      items={e.bullets}
                      fontSize={data.fontSize}
                      edit={edit}
                      basePath={`educations.${i}`}
                      ph={ph("bullet")}
                    />
                  </div>
                ))}
                <TombolTambah section="educations" label={ph("addEntry")} />
              </section>
            );

          case "skill":
            return (
              <section
                key={key}
                data-field="skill"
                className={blockClass("skill")}
                style={{ marginBottom: style.sectionGap }}
              >
                {heading(key)}
                {editable
                  ? kelompokKeahlian(data).map(([category, entri]) => (
                      <p key={category} style={{ marginBottom: "1.5pt" }}>
                        <strong>{category}:</strong>{" "}
                        {entri.map((s, n) => (
                          <React.Fragment key={s.index}>
                            {n > 0 && ", "}
                            <span
                              {...edit(`skills.${s.index}.name`)}
                              {...penampung({ text: s.name, ph: ph("skill") })}
                            >
                              {s.name}
                            </span>
                          </React.Fragment>
                        ))}
                      </p>
                    ))
                  : groupSkills(data).map(([category, names]) => (
                      <p key={category} style={{ marginBottom: "1.5pt" }}>
                        <strong>{category}:</strong> {names.join(", ")}
                      </p>
                    ))}
                <TombolTambah section="skills" label={ph("addEntry")} />
              </section>
            );

          case "project":
            return (
              <section key={key} style={{ marginBottom: style.sectionGap }}>
                {heading(key)}
                {data.projects.map((p, i) => (
                  <div
                    key={p.id}
                    data-field={`project:${p.id}`}
                    className={blockClass(`project:${p.id}`)}
                    style={entryStyle}
                  >
                    <EntryHeader
                      primary={[
                        {
                          text: p.name,
                          attrs: edit(`projects.${i}.name`),
                          ph: ph("name"),
                        },
                      ]}
                      secondary={[
                        {
                          text: p.role,
                          attrs: edit(`projects.${i}.role`),
                          ph: ph("role"),
                        },
                        // Alamat proyek sengaja tanpa jalur sunting: yang
                        // tampil sudah dirapikan prettyUrl() tanpa skema, dan
                        // menulis balik apa yang terlihat akan membuang
                        // bagian yang sengaja disembunyikan itu.
                        { text: prettyUrl(p.url) },
                      ]}
                      secondarySep=" - "
                      meta={formatDateRange(p.startDate, p.endDate, false, lang)}
                      metaPath={editable ? `projects.${i}` : undefined}
                      metaPh={ph("period")}
                      fontSize={data.fontSize}
                    />
                    <Bullets
                      items={p.bullets}
                      fontSize={data.fontSize}
                      edit={edit}
                      basePath={`projects.${i}`}
                      ph={ph("bullet")}
                    />
                  </div>
                ))}
                <TombolTambah section="projects" label={ph("addEntry")} />
              </section>
            );

          case "organization":
            return (
              <section key={key} style={{ marginBottom: style.sectionGap }}>
                {heading(key)}
                {data.organizations.map((o, i) => (
                  <div
                    key={o.id}
                    data-field={`organization:${o.id}`}
                    className={blockClass(`organization:${o.id}`)}
                    style={entryStyle}
                  >
                    <EntryHeader
                      primary={[
                        {
                          text: o.role,
                          attrs: edit(`organizations.${i}.role`),
                          ph: ph("role"),
                        },
                      ]}
                      secondary={[
                        {
                          text: o.name,
                          attrs: edit(`organizations.${i}.name`),
                          ph: ph("name"),
                        },
                        {
                          text: o.city,
                          attrs: edit(`organizations.${i}.city`),
                          ph: ph("city"),
                        },
                      ]}
                      meta={formatDateRange(
                        o.startDate,
                        o.endDate,
                        o.isCurrent,
                        lang,
                      )}
                      metaPath={editable ? `organizations.${i}` : undefined}
                      metaPh={ph("period")}
                      fontSize={data.fontSize}
                    />
                    <Bullets
                      items={o.bullets}
                      fontSize={data.fontSize}
                      edit={edit}
                      basePath={`organizations.${i}`}
                      ph={ph("bullet")}
                    />
                  </div>
                ))}
                <TombolTambah section="organizations" label={ph("addEntry")} />
              </section>
            );

          case "certification":
            return (
              <section key={key} style={{ marginBottom: style.sectionGap }}>
                {heading(key)}
                {data.certifications.map((c, i) => (
                  <div
                    key={c.id}
                    data-field={`certification:${c.id}`}
                    className={blockClass(`certification:${c.id}`)}
                    style={{ marginBottom: "3pt" }}
                  >
                    <p>
                      <strong {...edit(`certifications.${i}.name`)}>
                        {c.name}
                      </strong>
                      {(c.issuer || ph("issuer")) && (
                        <Berimbuhan
                          prefix=" - "
                          text={c.issuer}
                          attrs={edit(`certifications.${i}.issuer`)}
                          ph={ph("issuer")}
                        />
                      )}
                      <TanggalTunggal
                        text={c.issueDate ? formatMonth(c.issueDate, lang) : ""}
                        path={editable ? `certifications.${i}` : undefined}
                        ph={ph("period")}
                      />
                    </p>
                    {(c.credentialId || c.url) && (
                      <p style={{ fontSize: `${data.fontSize - 0.5}pt` }}>
                        {joinNonEmpty(
                          [
                            c.credentialId ? `ID: ${c.credentialId}` : "",
                            prettyUrl(c.url),
                          ],
                          "  •  ",
                        )}
                      </p>
                    )}
                  </div>
                ))}
                <TombolTambah section="certifications" label={ph("addEntry")} />
              </section>
            );

          case "award":
            return (
              <section key={key} style={{ marginBottom: style.sectionGap }}>
                {heading(key)}
                {data.awards.map((a, i) => (
                  <div
                    key={a.id}
                    data-field={`award:${a.id}`}
                    className={blockClass(`award:${a.id}`)}
                    style={{ marginBottom: "3pt" }}
                  >
                    <p>
                      <strong {...edit(`awards.${i}.title`)}>{a.title}</strong>
                      {(a.issuer || ph("issuer")) && (
                        <Berimbuhan
                          prefix=" - "
                          text={a.issuer}
                          attrs={edit(`awards.${i}.issuer`)}
                          ph={ph("issuer")}
                        />
                      )}
                      <TanggalTunggal
                        text={a.date ? formatMonth(a.date, lang) : ""}
                        path={editable ? `awards.${i}` : undefined}
                        ph={ph("period")}
                      />
                    </p>
                    {a.description && (
                      <p {...edit(`awards.${i}.description`)}>{a.description}</p>
                    )}
                  </div>
                ))}
                <TombolTambah section="awards" label={ph("addEntry")} />
              </section>
            );

          case "language":
            return (
              <section
                key={key}
                data-field="language"
                className={blockClass("language")}
                style={{ marginBottom: style.sectionGap }}
              >
                {heading(key)}
                <p>
                  {editable
                    ? data.languages.map((l, i) => (
                        <React.Fragment key={l.id}>
                          {i > 0 && "  •  "}
                          <span
                            {...edit(`languages.${i}.name`)}
                            {...penampung({ text: l.name, ph: ph("language") })}
                          >
                            {l.name}
                          </span>
                          {` (${proficiencyLabel(l.proficiency, lang)})`}
                        </React.Fragment>
                      ))
                    : data.languages
                        .filter((l) => l.name.trim())
                        .map(
                          (l) =>
                            `${l.name} (${proficiencyLabel(l.proficiency, lang)})`,
                        )
                        .join("  •  ")}
                </p>
                <TombolTambah section="languages" label={ph("addEntry")} />
              </section>
            );

          case "publication":
            return (
              <section key={key} style={{ marginBottom: style.sectionGap }}>
                {heading(key)}
                {data.publications.map((p, i) => (
                  <div
                    key={p.id}
                    data-field={`publication:${p.id}`}
                    className={blockClass(`publication:${p.id}`)}
                    style={{ marginBottom: "3pt" }}
                  >
                    <p>
                      <strong {...edit(`publications.${i}.title`)}>
                        {p.title}
                      </strong>
                      {(p.publisher || ph("publisher")) && (
                        <Berimbuhan
                          prefix=". "
                          text={p.publisher}
                          attrs={edit(`publications.${i}.publisher`)}
                          ph={ph("publisher")}
                        />
                      )}
                      <TanggalTunggal
                        text={p.date ? formatMonth(p.date, lang) : ""}
                        path={editable ? `publications.${i}` : undefined}
                        ph={ph("period")}
                      />
                    </p>
                    {(p.doi || p.url) && (
                      <p style={{ fontSize: `${data.fontSize - 0.5}pt` }}>
                        {joinNonEmpty(
                          [p.doi ? `DOI: ${p.doi}` : "", prettyUrl(p.url)],
                          "  •  ",
                        )}
                      </p>
                    )}
                  </div>
                ))}
                <TombolTambah section="publications" label={ph("addEntry")} />
              </section>
            );

          case "custom":
            return (
              <React.Fragment key={key}>
                {data.customSections.map((section, s) => (
                  <section
                    key={section.id}
                    style={{ marginBottom: style.sectionGap }}
                  >
                    {/*
                      Judul bagiannya sendiri tidak dapat diketik di kertas.
                      Yang tercetak sudah diubah bentuknya oleh template -
                      seluruhnya kapital, atau kapital di awal kata - jadi
                      menulis balik apa yang terlihat akan menyimpan versi
                      yang sudah berubah itu sebagai judul aslinya. Alasan
                      yang sama menahan alamat proyek; lihat edit-path.ts.
                    */}
                    <SectionHeading
                      title={(section.title || "TAMBAHAN").toUpperCase()}
                      style={style}
                      accent={accent}
                    />
                    {section.items.map((item, i) => (
                      <div
                        key={item.id}
                        data-field={`custom:${section.id}`}
                        className={blockClass(`custom:${section.id}`)}
                        style={entryStyle}
                      >
                        <EntryHeader
                          primary={[
                            {
                              text: item.title,
                              attrs: edit(customEntryPath(s, i, "title")),
                              ph: ph("title"),
                            },
                          ]}
                          secondary={[
                            {
                              text: item.subtitle,
                              attrs: edit(customEntryPath(s, i, "subtitle")),
                              ph: ph("subtitle"),
                            },
                          ]}
                          meta={formatDateRange(
                            item.startDate,
                            item.endDate,
                            false,
                            lang,
                          )}
                          metaPath={editable ? customEntryBase(s, i) : undefined}
                          metaPh={ph("period")}
                          fontSize={data.fontSize}
                        />
                        <Bullets
                          items={item.bullets}
                          fontSize={data.fontSize}
                          edit={edit}
                          basePath={customEntryBase(s, i)}
                          ph={ph("bullet")}
                        />
                      </div>
                    ))}
                    <TombolTambah
                      section={customItemsSection(s)}
                      label={ph("addEntry")}
                    />
                  </section>
                ))}
              </React.Fragment>
            );

          default:
            return null;
        }
      })}
    </article>
  );
}

/* -------------------------------------------------------------------------- */
/* Bagian penyusun                                                            */
/* -------------------------------------------------------------------------- */

/** Mengubah "PENGALAMAN KERJA" menjadi "Pengalaman Kerja". */
function toTitleCase(value: string): string {
  return value
    .toLocaleLowerCase("id-ID")
    .replace(/(^|[\s(/-])(\p{L})/gu, (_, lead: string, letter: string) =>
      lead + letter.toLocaleUpperCase("id-ID"),
    );
}

/**
 * Blok kepala CV: foto (bila templatenya memang menampilkan), nama, jabatan,
 * kontak, dan tautan.
 *
 * Yang perlu diperhatikan pada varian berfoto berdampingan: gambar ditulis
 * **setelah** blok teks di dalam DOM, lalu digeser ke kanan oleh flexbox.
 * Pengurai ATS membaca urutan dokumen, bukan urutan tampilan, sehingga
 * dengan susunan ini isi pertama yang ia temukan tetap nama pelamar - bukan
 * sebuah gambar tanpa teks alternatif yang membuatnya kehilangan jejak.
 */
function ResumeHeader({
  data,
  style,
  accent,
  contactLine,
  linkParts,
  className,
  edit,
}: {
  data: ResumeData;
  style: TemplateStyle;
  accent: string;
  contactLine: string;
  linkParts: string[];
  className: string;
  edit: EditAttrs;
}) {
  const info = data.personalInfo;
  const small = `${data.fontSize - 0.5}pt`;

  // Foto hanya muncul bila tiga syarat terpenuhi sekaligus: templatenya
  // memang menyediakan tempat, pengguna menyalakannya, dan alamat gambarnya
  // terisi. Template tanpa tempat foto tidak diam-diam menyisipkannya di
  // posisi seadanya - itu akan merusak tata letak yang justru jadi alasan
  // pengguna memilih template tersebut.
  const wantsPhoto =
    style.photo !== "none" && info.showPhoto && info.photoUrl.trim().length > 0;

  const centred = style.photo === "circle" || style.nameAlign === "center";

  const photo = wantsPhoto ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={info.photoUrl}
      alt=""
      style={{
        width: `${style.photoWidthMm}mm`,
        height: `${style.photoHeightMm}mm`,
        objectFit: "cover",
        display: "block",
        flexShrink: 0,
        borderRadius: style.photo === "circle" ? "9999px" : "1pt",
        marginBottom: style.photo === "beside" ? 0 : "5pt",
        marginLeft: style.photo !== "beside" && centred ? "auto" : undefined,
        marginRight: style.photo !== "beside" && centred ? "auto" : undefined,
      }}
    />
  ) : null;

  const identity = (
    <>
      <h1
        style={{
          fontSize: style.nameSize,
          fontWeight: style.nameWeight,
          lineHeight: 1.15,
          textTransform: style.nameTransform,
          letterSpacing: style.nameTransform === "uppercase" ? "0.04em" : undefined,
          color: style.useAccent ? accent : "#000",
        }}
      >
        <span {...edit("personalInfo.fullName")}>
          {info.fullName || "Nama Lengkap Anda"}
        </span>
      </h1>

      {info.headline && (
        <p
          style={{ fontSize: style.headlineSize, marginTop: "1pt" }}
          {...edit("personalInfo.headline")}
        >
          {info.headline}
        </p>
      )}

      {contactLine && (
        <p style={{ marginTop: "3pt", fontSize: small }}>{contactLine}</p>
      )}

      {linkParts.length > 0 && (
        <p style={{ marginTop: "1pt", fontSize: small }}>
          {linkParts.map((link, index) => (
            <React.Fragment key={link}>
              {index > 0 && <span>{"  •  "}</span>}
              <a
                href={ensureHttp(link)}
                style={{ color: "inherit", textDecoration: "none" }}
              >
                {prettyUrl(link)}
              </a>
            </React.Fragment>
          ))}
        </p>
      )}
    </>
  );

  const rule: React.CSSProperties =
    style.headerRule === "thick"
      ? { borderBottom: "2pt solid #000", paddingBottom: "6pt" }
      : style.headerRule === "double"
        ? { borderBottom: "3pt double #000", paddingBottom: "6pt" }
        : style.headerRule === "thin"
          ? { borderBottom: "0.5pt solid #000", paddingBottom: "5pt" }
          : {};

  return (
    <header
      data-field="personal"
      className={className}
      style={{
        textAlign: style.nameAlign,
        marginBottom: style.sectionGap,
        ...rule,
      }}
    >
      {style.photo === "beside" && photo ? (
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "6mm",
            textAlign: "left",
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>{identity}</div>
          {photo}
        </div>
      ) : (
        <>
          {photo}
          {identity}
        </>
      )}
    </header>
  );
}

function SectionHeading({
  title,
  style,
  accent,
}: {
  title: string;
  style: TemplateStyle;
  accent: string;
}) {
  const base: React.CSSProperties = {
    fontSize: style.headingSize,
    fontWeight: 700,
    letterSpacing: style.letterSpacing,
    margin: style.headingSpacing,
    color: style.useAccent ? accent : "#000",
  };

  // Judul disimpan dalam huruf kapital karena itu bentuk yang paling lazim.
  // Template yang menghendaki huruf normal mengubahnya di sini, bukan dengan
  // menyimpan dua versi judul - agar teks yang terekstraksi ke PDF, DOCX, dan
  // berkas teks selalu berasal dari satu sumber yang sama.
  const label = style.headingUppercase ? title : toTitleCase(title);

  if (style.headingStyle === "rule-above") {
    return (
      <h2
        className="section-heading"
        style={{
          ...base,
          borderTop: "1.5pt solid #000",
          paddingTop: "3pt",
          marginTop: "2pt",
        }}
      >
        {label}
      </h2>
    );
  }

  if (style.headingStyle === "double-rule") {
    return (
      <h2
        className="section-heading"
        style={{
          ...base,
          borderBottom: "2.5pt double #000",
          paddingBottom: "1.5pt",
        }}
      >
        {label}
      </h2>
    );
  }

  if (style.headingStyle === "underline") {
    return (
      <h2
        className="section-heading"
        style={{ ...base, borderBottom: "0.75pt solid #000", paddingBottom: "1.5pt" }}
      >
        {label}
      </h2>
    );
  }

  if (style.headingStyle === "accent-bar") {
    return (
      <h2
        className="section-heading"
        style={{
          ...base,
          borderLeft: `2.5pt solid ${accent}`,
          paddingLeft: "5pt",
        }}
      >
        {label}
      </h2>
    );
  }

  return (
    <h2 className="section-heading" style={base}>
      {label}
    </h2>
  );
}

/**
 * Baris judul entri. Jabatan dan periode diletakkan pada satu baris memakai
 * flexbox, bukan tabel - secara visual tampak berkolom namun urutan bacaan
 * mesin tetap linier: jabatan, lalu periode.
 */
/**
 * Satu bagian dari sebuah baris di kepala entri.
 *
 * Baris "perusahaan, kota, negara" dulu sudah digabung pemanggilnya menjadi
 * satu untaian sebelum sampai ke sini, dan bentuk itulah yang membuat setiap
 * sub-fieldnya mustahil diklik: yang ada di DOM cuma satu teks, sedangkan
 * membelahnya kembali menjadi tiga field hanyalah tebakan. Dengan
 * bagian-bagiannya dibawa utuh, tidak ada yang perlu dibelah - masing-masing
 * sudah membawa jalur datanya sendiri sejak dirender.
 */
export type HeaderPart = {
  text: string;
  /** Atribut penyunting; tanpa ini bagiannya tidak dapat diketik. */
  attrs?: Record<string, unknown>;
  /** Label yang tampil samar selama bagiannya masih kosong. */
  ph?: string;
};

/**
 * Pengelompokan keahlian yang membawa serta nomor asli tiap entri.
 *
 * `groupSkills()` membuang keahlian tanpa nama beserta nomornya, dan keduanya
 * justru yang dibutuhkan mode ketik: nomor asli untuk jalur `data-edit`, dan
 * entri kosong supaya ada yang dapat diklik. Kategorinya dibentuk dengan
 * aturan yang sama persis, sehingga susunan yang terlihat saat mengetik tidak
 * berbeda dari yang tercetak.
 */
function kelompokKeahlian(
  data: ResumeData,
): [string, { name: string; index: number }[]][] {
  const groups = new Map<string, { name: string; index: number }[]>();
  data.skills.forEach((skill, index) => {
    const category = skill.category.trim() || "Umum";
    if (!groups.has(category)) groups.set(category, []);
    groups.get(category)!.push({ name: skill.name, index });
  });
  return [...groups.entries()];
}

/**
 * Label penampung untuk field yang masih kosong.
 *
 * Mengikuti bahasa CV, bukan bahasa antarmuka - sama seperti judul bagian.
 * Seluruh yang tampak di atas kertas berbahasa CV; satu kata berbahasa lain
 * di antaranya akan terbaca seperti isi CV yang salah bahasa, bukan seperti
 * petunjuk aplikasi.
 */
const PENAMPUNG: Record<ResumeLanguage, Record<string, string>> = {
  ID: {
    jobTitle: "Jabatan",
    company: "Perusahaan",
    city: "Kota",
    country: "Negara",
    degree: "Jenjang",
    fieldOfStudy: "Bidang studi",
    institution: "Institusi",
    role: "Peran",
    name: "Nama",
    title: "Judul",
    subtitle: "Keterangan",
    issuer: "Penerbit",
    publisher: "Penerbit",
    bullet: "Poin pencapaian",
    skill: "Keahlian",
    language: "Bahasa",
    period: "Periode",
    addEntry: "+ Tambah isian",
  },
  EN: {
    jobTitle: "Job title",
    company: "Company",
    city: "City",
    country: "Country",
    degree: "Degree",
    fieldOfStudy: "Field of study",
    institution: "Institution",
    role: "Role",
    name: "Name",
    title: "Title",
    subtitle: "Description",
    issuer: "Issuer",
    publisher: "Publisher",
    bullet: "Achievement",
    skill: "Skill",
    language: "Language",
    period: "Period",
    addEntry: "+ Add another",
  },
};

export function labelPenampung(kunci: string, lang: ResumeLanguage): string {
  return PENAMPUNG[lang][kunci] ?? "";
}

/** Atribut penampung, hanya untuk bagian yang dapat diketik dan masih kosong. */
function penampung(part: { text: string; ph?: string }): Record<string, string> {
  if (!part.ph || part.text.trim().length > 0) return {};
  return { className: "edit-kosong", "data-ph": part.ph };
}

/**
 * Apakah sebuah bagian benar-benar dapat diketik.
 *
 * `edit()` mengembalikan objek kosong - bukan undefined - ketika mode ketik
 * mati, supaya pemanggilnya dapat menyebarnya tanpa syarat. Objek kosong tetap
 * bernilai benar, jadi keberadaan `attrs` saja bukan jawaban.
 */
function dapatDiketik(part: HeaderPart): boolean {
  return Boolean(part.attrs && Object.keys(part.attrs).length > 0);
}

/** Bagian yang tampil: yang ada isinya, atau yang dapat diketik. */
function bagianTampil(parts: HeaderPart[]): HeaderPart[] {
  return parts.filter((p) => p.text.trim().length > 0 || dapatDiketik(p));
}

function HeaderLine({ parts, sep }: { parts: HeaderPart[]; sep: string }) {
  const bisaDiketik = parts.some(dapatDiketik);

  /*
    Tanpa satu pun bagian yang dapat diketik, seluruhnya kembali menjadi satu
    untaian - sama persis dengan sebelum baris ini dapat diklik.

    Ini bukan sekadar demi keluaran yang identik. Teks yang dipecah menjadi
    beberapa simpul membuat React menyisipkan penanda pemisahnya sendiri di
    antara simpul-simpul itu saat merender di server, dan halaman cetak
    dirender di server. Jalur cetak karena itu tetap menerima satu untaian.
  */
  if (!bisaDiketik) {
    return <>{joinNonEmpty(parts.map((p) => p.text), sep)}</>;
  }

  return (
    <>
      {bagianTampil(parts).map((part, index) => (
        <React.Fragment key={index}>
          {index > 0 && sep}
          {dapatDiketik(part) ? (
            <span {...part.attrs} {...penampung(part)}>
              {part.text}
            </span>
          ) : (
            part.text
          )}
        </React.Fragment>
      ))}
    </>
  );
}

/**
 * Nilai yang didahului pemisah tetap, mis. " - " sebelum nama penerbit.
 *
 * Saat mode ketik mati, pemisah dan nilainya tetap satu simpul teks seperti
 * sebelumnya. Saat menyala, keduanya dipisah supaya yang dapat diketik hanya
 * nilainya - kalau tidak, pemisahnya ikut terbawa masuk ke dalam field.
 */
function Berimbuhan({
  prefix,
  suffix = "",
  text,
  attrs,
  ph,
}: {
  prefix: string;
  suffix?: string;
  text: string;
  attrs: Record<string, unknown>;
  ph?: string;
}) {
  if (!dapatDiketik({ text, attrs })) {
    return (
      <span>
        {prefix}
        {text}
        {suffix}
      </span>
    );
  }
  return (
    <span>
      {prefix}
      <span {...attrs} {...penampung({ text, ph })}>
        {text}
      </span>
      {suffix}
    </span>
  );
}

/**
 * Tombol tambah entri di ujung sebuah bagian, hanya saat mode ketik menyala.
 *
 * Dokumen hanya menandainya dengan `data-add`; yang menambah entrinya adalah
 * panel pratinjau - pembagian yang sama dengan `data-edit` dan `data-date`.
 *
 * Ini satu-satunya elemen antarmuka yang boleh berdiri di atas kertas, dan
 * itu disengaja: menambah entri dari bilah di luar kertas berarti pengguna
 * harus menebak entri barunya muncul di mana, sedangkan tombol yang berdiri
 * tepat di ujung bagiannya sudah menunjukkan jawabannya.
 */
function TombolTambah({ section, label }: { section: string; label: string }) {
  if (!label) return null;
  return (
    <button
      type="button"
      data-add={section}
      className="no-print"
      style={{
        display: "block",
        marginTop: "2pt",
        padding: 0,
        border: 0,
        background: "none",
        font: "inherit",
        fontSize: "0.85em",
        fontStyle: "italic",
        color: "#9ca3af",
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );
}

/**
 * Tanggal tunggal dalam tanda kurung, mis. pada sertifikasi.
 *
 * Tanda kurungnya tetap di luar bagian yang dapat diklik: yang disunting
 * adalah bulannya, bukan tanda bacanya.
 */
function TanggalTunggal({
  text,
  path,
  ph,
}: {
  text: string;
  path?: string;
  ph?: string;
}) {
  if (!path) return text ? <span> ({text})</span> : null;
  return (
    <span>
      {" ("}
      <span
        data-date={path}
        role="button"
        tabIndex={0}
        {...penampung({ text, ph })}
      >
        {text}
      </span>
      {")"}
    </span>
  );
}

function EntryHeader({
  primary,
  primarySep = " - ",
  secondary,
  secondarySep = ", ",
  meta,
  metaPath,
  metaPh,
  fontSize,
}: {
  primary: HeaderPart[];
  /** Pemisah antar-bagian judul, mis. gelar dan bidang studi. */
  primarySep?: string;
  secondary?: HeaderPart[];
  secondarySep?: string;
  meta: string;
  /**
   * Jalur entri pemilik periode ini, mis. "experiences.0".
   *
   * Terisi hanya saat mode ketik menyala. Dokumen cukup menandai; yang
   * membuka pemilih bulannya adalah panel pratinjau - pembagian yang sama
   * dengan `data-edit`, dan karena alasan yang sama: berkas ini juga dirender
   * di server, tempat tidak ada penangan peristiwa sama sekali.
   */
  metaPath?: string;
  /** Label periode yang belum diisi. */
  metaPh?: string;
  fontSize: number;
}) {
  const isiSecondary = secondary ?? [];
  // Baris kedua tetap muncul selama ada bagian yang dapat diketik, walau
  // seluruhnya masih kosong - kalau tidak, kota yang belum diisi tidak punya
  // apa pun untuk diklik, dan justru field kosong itulah yang perlu diisi.
  const adaSecondary =
    isiSecondary.some((p) => p.text.trim().length > 0) ||
    isiSecondary.some(dapatDiketik);

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          gap: "8pt",
        }}
      >
        <strong>
          <HeaderLine parts={primary} sep={primarySep} />
        </strong>
        {(meta || (metaPath && metaPh)) && (
          <span
            style={{ whiteSpace: "nowrap", fontSize: `${fontSize - 0.5}pt` }}
            {...(metaPath
              ? { "data-date": metaPath, role: "button", tabIndex: 0 }
              : {})}
            {...(metaPath ? penampung({ text: meta, ph: metaPh }) : {})}
          >
            {/*
              Spasi tak-putus di depan periode sengaja dipertahankan.
              Jabatan dan periode adalah dua item flex terpisah, sehingga
              tanpa karakter ini keduanya menyatu saat teks diekstraksi
              menjadi "Frontend DeveloperFeb 2023" - dan pengurai ATS akan
              membacanya sebagai satu kata yang tidak dikenal.
              Yang dipakai adalah spasi tak-putus (U+00A0), bukan spasi
              biasa, karena spasi biasa di awal sebuah kotak dipangkas
              peramban dan tidak ikut terekstraksi.
            */}
            {" "}
            {meta}
          </span>
        )}
      </div>
      {adaSecondary && (
        <div style={{ fontStyle: "italic" }}>
          <HeaderLine parts={isiSecondary} sep={secondarySep} />
        </div>
      )}
    </>
  );
}

function Bullets({
  items,
  fontSize,
  edit,
  basePath,
  ph,
}: {
  items: string[];
  fontSize: number;
  edit?: EditAttrs;
  /** Jalur daftar poinnya, mis. "experiences.0". */
  basePath?: string;
  /** Label penampung; terisi hanya saat mode ketik menyala. */
  ph?: string;
}) {
  // Nomor urut aslinya dibawa serta, bukan nomor setelah penyaringan. Poin
  // kosong tidak ditampilkan, sehingga nomor di layar dan nomor di dalam data
  // berbeda - dan menulis balik memakai nomor di layar akan menimpa poin yang
  // salah begitu ada satu saja poin kosong di atasnya.
  const bernomor = items.map((text, index) => ({ text, index }));

  /*
    Selama mode ketik menyala, poin kosong ikut ditampilkan.

    Tanpa itu poin yang baru saja ditambahkan - yang selalu lahir kosong -
    tidak pernah punya elemen untuk diketik, sehingga menambah poin tidak
    menghasilkan apa pun yang terlihat. Poin kosong lama yang selama ini
    tersembunyi ikut muncul, dan itu memang benar di sini: poin itu ada di
    dalam data, dan pengguna berhak melihat serta menghapusnya. Di jalur
    cetak penyaringannya tidak berubah sama sekali.
  */
  const tampil = ph ? bernomor : bernomor.filter((b) => b.text.trim());
  if (tampil.length === 0) return null;

  return (
    <ul
      style={{
        listStyleType: "disc",
        paddingLeft: "14pt",
        marginTop: `${fontSize * 0.15}pt`,
      }}
    >
      {tampil.map((bullet) => (
        <li
          key={bullet.index}
          style={{ marginBottom: "1pt" }}
          {...(ph && !bullet.text.trim()
            ? { className: "edit-kosong", "data-ph": ph }
            : {})}
          {...(edit && basePath
            ? edit(`${basePath}.bullets.${bullet.index}`)
            : {})}
        >
          {bullet.text}
        </li>
      ))}
    </ul>
  );
}

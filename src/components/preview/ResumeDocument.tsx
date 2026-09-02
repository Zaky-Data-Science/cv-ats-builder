import * as React from "react";
import { groupSkills, proficiencyLabel } from "@/lib/resume/plaintext";
import { isSectionVisible, sectionHeading } from "@/lib/resume/sections";
import type { ResumeData, SectionKey } from "@/lib/resume/types";
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
  className?: string;
}

interface TemplateStyle {
  padding: string;
  nameSize: string;
  nameAlign: "left" | "center";
  nameWeight: number;
  headlineSize: string;
  headingSize: string;
  headingSpacing: string;
  headingStyle: "underline" | "accent-bar" | "plain";
  sectionGap: string;
  entryGap: string;
  useAccent: boolean;
  letterSpacing: string;
}

const TEMPLATE_STYLES: Record<ResumeData["template"], TemplateStyle> = {
  // Formal dan konservatif - pilihan teraman untuk instansi, BUMN, dan
  // perusahaan besar yang masih memakai ATS generasi lama.
  CLASSIC: {
    padding: "15mm 16mm",
    nameSize: "20pt",
    nameAlign: "center",
    nameWeight: 700,
    headlineSize: "11pt",
    headingSize: "10.5pt",
    headingSpacing: "0 0 3pt 0",
    headingStyle: "underline",
    sectionGap: "11pt",
    entryGap: "8pt",
    useAccent: false,
    letterSpacing: "0.06em",
  },
  // Lebih lapang dengan aksen warna pada judul section. Cocok untuk
  // perusahaan teknologi dan startup.
  MODERN: {
    padding: "16mm 17mm",
    nameSize: "22pt",
    nameAlign: "left",
    nameWeight: 700,
    headlineSize: "11.5pt",
    headingSize: "10pt",
    headingSpacing: "0 0 4pt 0",
    headingStyle: "accent-bar",
    sectionGap: "13pt",
    entryGap: "9pt",
    useAccent: true,
    letterSpacing: "0.09em",
  },
  // Paling padat - untuk pelamar dengan pengalaman panjang yang tetap ingin
  // muat dalam satu sampai dua halaman.
  COMPACT: {
    padding: "12mm 13mm",
    nameSize: "17pt",
    nameAlign: "left",
    nameWeight: 700,
    headlineSize: "10pt",
    headingSize: "9.5pt",
    headingSpacing: "0 0 2pt 0",
    headingStyle: "plain",
    sectionGap: "8pt",
    entryGap: "6pt",
    useAccent: false,
    letterSpacing: "0.05em",
  },
};

export function ResumeDocument({
  data,
  highlight,
  printMode = false,
  className,
}: ResumeDocumentProps) {
  const style = TEMPLATE_STYLES[data.template] ?? TEMPLATE_STYLES.CLASSIC;
  const lang = data.language;
  const accent = style.useAccent ? data.accentColor : "#000000";

  const isOn = (key: string) => !printMode && highlight === key;
  const blockClass = (key: string) =>
    `avoid-break${isOn(key) ? " preview-highlight" : ""}`;

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
      style={{
        fontFamily: `${data.fontFamily}, Arial, Helvetica, sans-serif`,
        fontSize: `${data.fontSize}pt`,
        lineHeight: data.lineHeight,
        padding: style.padding,
      }}
      data-resume-document
    >
      {/* ------------------------------------------------------------------ */}
      {/* Kepala: nama, jabatan, kontak                                       */}
      {/* ------------------------------------------------------------------ */}
      <header
        data-field="personal"
        className={blockClass("personal")}
        style={{ textAlign: style.nameAlign, marginBottom: style.sectionGap }}
      >
        {info.showPhoto && info.photoUrl && (
          // Foto memang berisiko bagi parser ATS; peringatannya sudah
          // disampaikan pada panel penilaian, keputusan akhir di tangan
          // pengguna karena sebagian lowongan lokal masih memintanya.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={info.photoUrl}
            alt=""
            style={{
              width: "26mm",
              height: "34mm",
              objectFit: "cover",
              marginBottom: "6pt",
              display: "block",
              marginLeft: style.nameAlign === "center" ? "auto" : undefined,
              marginRight: style.nameAlign === "center" ? "auto" : undefined,
            }}
          />
        )}

        <h1
          style={{
            fontSize: style.nameSize,
            fontWeight: style.nameWeight,
            lineHeight: 1.15,
            color: style.useAccent ? accent : "#000",
          }}
        >
          {info.fullName || "Nama Lengkap Anda"}
        </h1>

        {info.headline && (
          <p style={{ fontSize: style.headlineSize, marginTop: "1pt" }}>
            {info.headline}
          </p>
        )}

        {contactLine && (
          <p style={{ marginTop: "3pt", fontSize: `${data.fontSize - 0.5}pt` }}>
            {contactLine}
          </p>
        )}

        {linkParts.length > 0 && (
          <p style={{ marginTop: "1pt", fontSize: `${data.fontSize - 0.5}pt` }}>
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
      </header>

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
                >
                  {info.summary}
                </p>
              </section>
            );

          case "experience":
            return (
              <section key={key} style={{ marginBottom: style.sectionGap }}>
                {heading(key)}
                {data.experiences.map((e) => (
                  <div
                    key={e.id}
                    data-field={`experience:${e.id}`}
                    className={blockClass(`experience:${e.id}`)}
                    style={{ marginBottom: style.entryGap }}
                  >
                    <EntryHeader
                      primary={e.jobTitle}
                      secondary={joinNonEmpty([
                        e.company,
                        joinNonEmpty([e.city, e.country]),
                      ])}
                      meta={formatDateRange(
                        e.startDate,
                        e.endDate,
                        e.isCurrent,
                        lang,
                      )}
                      fontSize={data.fontSize}
                    />
                    <Bullets items={e.bullets} fontSize={data.fontSize} />
                  </div>
                ))}
              </section>
            );

          case "education":
            return (
              <section key={key} style={{ marginBottom: style.sectionGap }}>
                {heading(key)}
                {data.educations.map((e) => (
                  <div
                    key={e.id}
                    data-field={`education:${e.id}`}
                    className={blockClass(`education:${e.id}`)}
                    style={{ marginBottom: style.entryGap }}
                  >
                    <EntryHeader
                      primary={joinNonEmpty([e.degree, e.fieldOfStudy], " - ")}
                      secondary={joinNonEmpty([e.institution, e.city])}
                      meta={formatDateRange(
                        e.startDate,
                        e.endDate,
                        e.isCurrent,
                        lang,
                      )}
                      fontSize={data.fontSize}
                    />
                    {e.gpa && (
                      <p>
                        {lang === "EN" ? "GPA" : "IPK"}: {e.gpa}
                        {e.maxGpa ? ` / ${e.maxGpa}` : ""}
                      </p>
                    )}
                    <Bullets items={e.bullets} fontSize={data.fontSize} />
                  </div>
                ))}
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
                {groupSkills(data).map(([category, names]) => (
                  <p key={category} style={{ marginBottom: "1.5pt" }}>
                    <strong>{category}:</strong> {names.join(", ")}
                  </p>
                ))}
              </section>
            );

          case "project":
            return (
              <section key={key} style={{ marginBottom: style.sectionGap }}>
                {heading(key)}
                {data.projects.map((p) => (
                  <div
                    key={p.id}
                    data-field={`project:${p.id}`}
                    className={blockClass(`project:${p.id}`)}
                    style={{ marginBottom: style.entryGap }}
                  >
                    <EntryHeader
                      primary={p.name}
                      secondary={joinNonEmpty([p.role, prettyUrl(p.url)], " - ")}
                      meta={formatDateRange(p.startDate, p.endDate, false, lang)}
                      fontSize={data.fontSize}
                    />
                    <Bullets items={p.bullets} fontSize={data.fontSize} />
                  </div>
                ))}
              </section>
            );

          case "organization":
            return (
              <section key={key} style={{ marginBottom: style.sectionGap }}>
                {heading(key)}
                {data.organizations.map((o) => (
                  <div
                    key={o.id}
                    data-field={`organization:${o.id}`}
                    className={blockClass(`organization:${o.id}`)}
                    style={{ marginBottom: style.entryGap }}
                  >
                    <EntryHeader
                      primary={o.role}
                      secondary={joinNonEmpty([o.name, o.city])}
                      meta={formatDateRange(
                        o.startDate,
                        o.endDate,
                        o.isCurrent,
                        lang,
                      )}
                      fontSize={data.fontSize}
                    />
                    <Bullets items={o.bullets} fontSize={data.fontSize} />
                  </div>
                ))}
              </section>
            );

          case "certification":
            return (
              <section key={key} style={{ marginBottom: style.sectionGap }}>
                {heading(key)}
                {data.certifications.map((c) => (
                  <div
                    key={c.id}
                    data-field={`certification:${c.id}`}
                    className={blockClass(`certification:${c.id}`)}
                    style={{ marginBottom: "3pt" }}
                  >
                    <p>
                      <strong>{c.name}</strong>
                      {c.issuer && <span> - {c.issuer}</span>}
                      {c.issueDate && (
                        <span> ({formatMonth(c.issueDate, lang)})</span>
                      )}
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
              </section>
            );

          case "award":
            return (
              <section key={key} style={{ marginBottom: style.sectionGap }}>
                {heading(key)}
                {data.awards.map((a) => (
                  <div
                    key={a.id}
                    data-field={`award:${a.id}`}
                    className={blockClass(`award:${a.id}`)}
                    style={{ marginBottom: "3pt" }}
                  >
                    <p>
                      <strong>{a.title}</strong>
                      {a.issuer && <span> - {a.issuer}</span>}
                      {a.date && <span> ({formatMonth(a.date, lang)})</span>}
                    </p>
                    {a.description && <p>{a.description}</p>}
                  </div>
                ))}
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
                  {data.languages
                    .filter((l) => l.name.trim())
                    .map((l) => `${l.name} (${proficiencyLabel(l.proficiency, lang)})`)
                    .join("  •  ")}
                </p>
              </section>
            );

          case "publication":
            return (
              <section key={key} style={{ marginBottom: style.sectionGap }}>
                {heading(key)}
                {data.publications.map((p) => (
                  <div
                    key={p.id}
                    data-field={`publication:${p.id}`}
                    className={blockClass(`publication:${p.id}`)}
                    style={{ marginBottom: "3pt" }}
                  >
                    <p>
                      <strong>{p.title}</strong>
                      {p.publisher && <span>. {p.publisher}</span>}
                      {p.date && <span> ({formatMonth(p.date, lang)})</span>}
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
              </section>
            );

          case "custom":
            return (
              <React.Fragment key={key}>
                {data.customSections.map((section) => (
                  <section
                    key={section.id}
                    style={{ marginBottom: style.sectionGap }}
                  >
                    <SectionHeading
                      title={(section.title || "TAMBAHAN").toUpperCase()}
                      style={style}
                      accent={accent}
                    />
                    {section.items.map((item) => (
                      <div
                        key={item.id}
                        data-field={`custom:${section.id}`}
                        className={blockClass(`custom:${section.id}`)}
                        style={{ marginBottom: style.entryGap }}
                      >
                        <EntryHeader
                          primary={item.title}
                          secondary={item.subtitle}
                          meta={formatDateRange(
                            item.startDate,
                            item.endDate,
                            false,
                            lang,
                          )}
                          fontSize={data.fontSize}
                        />
                        <Bullets items={item.bullets} fontSize={data.fontSize} />
                      </div>
                    ))}
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

  if (style.headingStyle === "underline") {
    return (
      <h2
        className="section-heading"
        style={{ ...base, borderBottom: "0.75pt solid #000", paddingBottom: "1.5pt" }}
      >
        {title}
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
        {title}
      </h2>
    );
  }

  return (
    <h2 className="section-heading" style={base}>
      {title}
    </h2>
  );
}

/**
 * Baris judul entri. Jabatan dan periode diletakkan pada satu baris memakai
 * flexbox, bukan tabel - secara visual tampak berkolom namun urutan bacaan
 * mesin tetap linier: jabatan, lalu periode.
 */
function EntryHeader({
  primary,
  secondary,
  meta,
  fontSize,
}: {
  primary: string;
  secondary: string;
  meta: string;
  fontSize: number;
}) {
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
        <strong>{primary}</strong>
        {meta && (
          <span style={{ whiteSpace: "nowrap", fontSize: `${fontSize - 0.5}pt` }}>
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
      {secondary && <div style={{ fontStyle: "italic" }}>{secondary}</div>}
    </>
  );
}

function Bullets({ items, fontSize }: { items: string[]; fontSize: number }) {
  const filled = items.filter((b) => b.trim());
  if (filled.length === 0) return null;
  return (
    <ul
      style={{
        listStyleType: "disc",
        paddingLeft: "14pt",
        marginTop: `${fontSize * 0.15}pt`,
      }}
    >
      {filled.map((bullet, index) => (
        <li key={index} style={{ marginBottom: "1pt" }}>
          {bullet}
        </li>
      ))}
    </ul>
  );
}

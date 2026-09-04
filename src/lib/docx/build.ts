import {
  AlignmentType,
  BorderStyle,
  Document,
  ExternalHyperlink,
  ImageRun,
  Packer,
  Paragraph,
  TabStopPosition,
  TabStopType,
  TextRun,
} from "docx";
import { groupSkills, proficiencyLabel } from "@/lib/resume/plaintext";
import { parseEmbeddedPhoto } from "@/lib/resume/photo";
import {
  keteranganKredensial,
  masaBerlakuTeks,
} from "@/lib/portfolio/kredensial";
import {
  bagiItemPortofolio,
  barisKepala,
  itemTercetak,
  portofolioAktif,
  skemaItem,
  PEMISAH_DETAIL,
  type TautanTercetak,
} from "@/lib/portfolio/render";
import { isSectionVisible, sectionHeadingFor } from "@/lib/resume/sections";
import type { ProjectItem, ResumeData, SectionKey } from "@/lib/resume/types";
import { paperSpec } from "@/lib/resume/paper";
import {
  resumeMargins,
  resumePhotoSize,
  templateStyle,
  templateSupportsPhoto,
} from "@/lib/resume/templates";
import {
  ensureHttp,
  formatDateRange,
  formatMonth,
  joinNonEmpty,
  prettyUrl,
} from "@/lib/utils";

/**
 * ============================================================================
 *  GENERATOR DOKUMEN WORD (.docx)
 * ============================================================================
 *
 * Mengapa DOCX disediakan di samping PDF: sebagian sistem rekrutmen mengurai
 * berkas Word lebih akurat daripada PDF, karena struktur paragraf dan daftar
 * tersimpan eksplisit di dalam berkas dan tidak perlu direkonstruksi dari
 * posisi teks di atas halaman.
 *
 * Tiga hal sengaja tidak dipakai karena merupakan penyebab tersering
 * kegagalan pengurai ATS:
 *   1. Tabel        - teks di dalam sel sering terbaca melompat-lompat.
 *   2. Kotak teks   - kerap tidak ikut terekstraksi sama sekali.
 *   3. Header/footer - **isinya hilang total**. Diuji langsung: teks di dalam
 *                      `sec.header`/`sec.footer` tidak terbaca python-docx
 *                      maupun konversi LibreOffice ke teks. Ini masalah khas
 *                      DOCX; di PDF, teks pada posisi atas atau bawah halaman
 *                      terbaca normal.
 *
 * Karena itu berkas ini **tidak pernah** membuat `headers` maupun `footers`
 * pada section Word - bukan hanya "menghindari menaruh kontak di sana".
 * Seluruh isi, tanpa kecuali, ditulis sebagai paragraf biasa di dalam body
 * beserta daftar berpoin asli Word.
 */

// docx memakai satuan setengah-poin untuk ukuran huruf dan twip (1/1440 inci)
// untuk jarak serta margin.
const HALF_POINT = 2;
const MM_TO_TWIP = 56.7;
// Ukuran gambar pada docx dinyatakan dalam piksel pada 96 dpi.
const MM_TO_PX = 96 / 25.4;

/** Jenis gambar yang dapat disematkan Word, dipetakan dari tipe MIME-nya. */
const DOCX_IMAGE_TYPES: Record<string, "jpg" | "png" | "gif" | "bmp"> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/gif": "gif",
  "image/bmp": "bmp",
};

/**
 * Paragraf berisi pas foto, atau null bila CV ini memang tidak memakainya.
 *
 * Fotonya diletakkan **setelah** blok identitas, bukan sebelumnya - alasan
 * yang sama dengan versi HTML-nya: hal pertama yang ditemukan pengurai harus
 * nama pelamar, bukan gambar tanpa teks alternatif.
 *
 * Berbeda dari versi HTML, di sini foto berdiri sebagai paragraf tersendiri
 * dan tidak dapat diletakkan berdampingan dengan teks. Satu-satunya cara
 * melakukannya di Word adalah tabel atau kotak teks, dan keduanya justru
 * merupakan dua penyebab tersering kegagalan pengurai ATS yang sejak awal
 * dihindari berkas ini. Tata letaknya karena itu sedikit berbeda dari PDF -
 * yang tidak berbeda adalah isinya.
 *
 * Hanya foto yang tertanam sebagai data URI yang dapat disertakan. CV lama
 * yang fotonya berupa tautan gambar dilewati tanpa galat: mengunduh gambar
 * dari alamat yang ditulis pengguna berarti server ini menembak alamat
 * sembarang atas perintah orang luar.
 */
function photoParagraph(data: ResumeData): Paragraph | null {
  const info = data.personalInfo;
  if (!info.showPhoto || !templateSupportsPhoto(data.template)) return null;

  const embedded = parseEmbeddedPhoto(info.photoUrl);
  if (!embedded) return null;

  // Word hanya menerima empat jenis gambar. Foto yang dipilih lewat aplikasi
  // ini selalu JPEG, tetapi CV yang diimpor dari berkas JSON dapat memuat
  // jenis lain - yang tidak dikenali dilewati, bukan dipaksakan dengan jenis
  // yang salah, sebab Word menolak membuka berkas yang isinya tidak cocok
  // dengan keterangannya.
  const type = DOCX_IMAGE_TYPES[embedded.mime];
  if (!type) return null;

  const style = templateStyle(data.template);
  const ukuran = resumePhotoSize(data.template, info.photoWidthMm);
  return new Paragraph({
    alignment:
      style.photo === "beside" ? AlignmentType.RIGHT : AlignmentType.CENTER,
    spacing: { after: 120 },
    children: [
      new ImageRun({
        type,
        data: Buffer.from(embedded.base64, "base64"),
        transformation: {
          width: Math.round(ukuran.widthMm * MM_TO_PX),
          height: Math.round(ukuran.heightMm * MM_TO_PX),
        },
        altText: {
          name: info.fullName || "Pas foto",
          description: info.fullName || "Pas foto",
          title: info.fullName || "Pas foto",
        },
      }),
    ],
  });
}

export async function buildDocx(data: ResumeData): Promise<Buffer> {
  const lang = data.language;
  const size = data.fontSize * HALF_POINT;
  const smallSize = (data.fontSize - 0.5) * HALF_POINT;
  const info = data.personalInfo;
  const children: Paragraph[] = [];

  /* ---------------------------------------------------------------- */
  /* Kepala dokumen                                                    */
  /* ---------------------------------------------------------------- */

  children.push(
    new Paragraph({
      alignment:
        data.template === "CLASSIC" ? AlignmentType.CENTER : AlignmentType.LEFT,
      spacing: { after: 40 },
      children: [
        new TextRun({
          text: info.fullName || "Nama Lengkap",
          bold: true,
          size: (data.template === "COMPACT" ? 17 : 20) * HALF_POINT,
        }),
      ],
    }),
  );

  if (info.headline) {
    children.push(
      headerLine(info.headline, size, data.template === "CLASSIC"),
    );
  }

  const contact = joinNonEmpty(
    [info.email, info.phone, joinNonEmpty([info.city, info.province, info.country])],
    "  |  ",
  );
  if (contact) {
    children.push(headerLine(contact, smallSize, data.template === "CLASSIC"));
  }

  const links = [info.linkedinUrl, info.portfolioUrl, info.githubUrl].filter(
    (v) => v.trim(),
  );
  if (links.length > 0) {
    children.push(
      new Paragraph({
        alignment:
          data.template === "CLASSIC"
            ? AlignmentType.CENTER
            : AlignmentType.LEFT,
        spacing: { after: 120 },
        children: links.flatMap((link, index) => [
          ...(index > 0
            ? [new TextRun({ text: "  |  ", size: smallSize })]
            : []),
          new ExternalHyperlink({
            link: ensureHttp(link),
            children: [
              new TextRun({
                text: prettyUrl(link),
                size: smallSize,
                style: "Hyperlink",
              }),
            ],
          }),
        ]),
      }),
    );
  }

  const photo = photoParagraph(data);
  if (photo) children.push(photo);

  /* ---------------------------------------------------------------- */
  /* Section                                                           */
  /* ---------------------------------------------------------------- */

  const heading = (key: SectionKey) =>
    children.push(sectionTitle(sectionHeadingFor(data, key), data));

  const { mandiri, perInduk } = bagiItemPortofolio(data);

  /*
    Satu item portofolio. Bentuknya sama persis dengan versi teks polos dan
    versi cetaknya - lihat lib/portfolio/render.ts untuk alasannya.

    `bersarang` menandai item yang menempel pada entri pengalaman kerja;
    konteksnya tidak ikut dicetak karena pemberi kerjanya sudah tertulis di
    entri induknya.
  */
  const tulisItem = (item: ProjectItem, bersarang: boolean) => {
    const cetak = itemTercetak(data, item, lang);
    const kepala = barisKepala(cetak);
    const label = bersarang ? `${skemaItem(data, item).labelItem}: ` : "";

    children.push(
      titleWithDate(label + kepala.utama, cetak.periode, size, smallSize),
    );
    const kedua = bersarang ? cetak.lokasi : kepala.kedua;
    if (kedua) children.push(subtitle(kedua, size));
    if (cetak.ringkasan) children.push(body(cetak.ringkasan, size));
    pushBullets(children, cetak.poin, size);
    if (cetak.detail) children.push(body(`Detail: ${cetak.detail}`, smallSize));
    const tautan = tautanParagraph(cetak.tautan, smallSize);
    if (tautan) children.push(tautan);
  };

  for (const key of data.sectionOrder) {
    if (!isSectionVisible(data, key)) continue;

    switch (key) {
      case "summary":
        heading(key);
        children.push(body(info.summary, size));
        break;

      case "experience":
        heading(key);
        for (const e of data.experiences) {
          children.push(
            titleWithDate(
              e.jobTitle,
              formatDateRange(e.startDate, e.endDate, e.isCurrent, lang),
              size,
              smallSize,
            ),
          );
          const sub = joinNonEmpty([e.company, e.city, e.country]);
          if (sub) children.push(subtitle(sub, size));
          pushBullets(children, e.bullets, size);
          for (const item of perInduk.get(e.id) ?? []) tulisItem(item, true);
        }
        break;

      case "education":
        heading(key);
        for (const e of data.educations) {
          children.push(
            titleWithDate(
              joinNonEmpty([e.degree, e.fieldOfStudy], " - "),
              formatDateRange(e.startDate, e.endDate, e.isCurrent, lang),
              size,
              smallSize,
            ),
          );
          const sub = joinNonEmpty([e.institution, e.city]);
          if (sub) children.push(subtitle(sub, size));
          if (e.gpa) {
            children.push(
              body(
                `${lang === "EN" ? "GPA" : "IPK"}: ${e.gpa}${e.maxGpa ? ` / ${e.maxGpa}` : ""}`,
                size,
              ),
            );
          }
          pushBullets(children, e.bullets, size);
        }
        break;

      case "skill":
        heading(key);
        for (const [category, names] of groupSkills(data)) {
          children.push(
            new Paragraph({
              spacing: { after: 30 },
              children: [
                new TextRun({ text: `${category}: `, bold: true, size }),
                new TextRun({ text: names.join(", "), size }),
              ],
            }),
          );
        }
        break;

      case "project":
        heading(key);
        if (portofolioAktif(data)) {
          for (const item of mandiri) tulisItem(item, false);
          break;
        }
        // Bentuk lama, untuk CV yang belum menyalakan bagian portofolio.
        for (const p of data.projects) {
          children.push(
            titleWithDate(
              p.name,
              formatDateRange(p.startDate, p.endDate, false, lang),
              size,
              smallSize,
            ),
          );
          const sub = joinNonEmpty([p.role, prettyUrl(p.url)], " - ");
          if (sub) children.push(subtitle(sub, size));
          pushBullets(children, p.bullets, size);
        }
        break;

      case "organization":
        heading(key);
        for (const o of data.organizations) {
          children.push(
            titleWithDate(
              o.role,
              formatDateRange(o.startDate, o.endDate, o.isCurrent, lang),
              size,
              smallSize,
            ),
          );
          const sub = joinNonEmpty([o.name, o.city]);
          if (sub) children.push(subtitle(sub, size));
          pushBullets(children, o.bullets, size);
        }
        break;

      case "certification":
        heading(key);
        for (const c of data.certifications) {
          children.push(
            new Paragraph({
              spacing: { after: 20 },
              children: [
                new TextRun({ text: c.name, bold: true, size }),
                ...(c.issuer
                  ? [new TextRun({ text: ` - ${c.issuer}`, size })]
                  : []),
                ...(c.issueDate
                  ? [
                      new TextRun({
                        text: ` (${formatMonth(c.issueDate, lang)})`,
                        size,
                      }),
                    ]
                  : []),
              ],
            }),
          );
          const keterangan = joinNonEmpty(
            [keteranganKredensial(c), masaBerlakuTeks(c, lang)],
            PEMISAH_DETAIL,
          );
          if (keterangan) children.push(body(keterangan, smallSize));
          const detail = joinNonEmpty(
            [c.credentialId ? `ID: ${c.credentialId}` : "", prettyUrl(c.url)],
            "  |  ",
          );
          if (detail) children.push(body(detail, smallSize));
        }
        break;

      case "award":
        heading(key);
        for (const a of data.awards) {
          children.push(
            new Paragraph({
              spacing: { after: 20 },
              children: [
                new TextRun({ text: a.title, bold: true, size }),
                ...(a.issuer
                  ? [new TextRun({ text: ` - ${a.issuer}`, size })]
                  : []),
                ...(a.date
                  ? [
                      new TextRun({
                        text: ` (${formatMonth(a.date, lang)})`,
                        size,
                      }),
                    ]
                  : []),
              ],
            }),
          );
          if (a.description) children.push(body(a.description, size));
        }
        break;

      case "language":
        heading(key);
        children.push(
          body(
            data.languages
              .filter((l) => l.name.trim())
              .map((l) => `${l.name} (${proficiencyLabel(l.proficiency, lang)})`)
              .join("  |  "),
            size,
          ),
        );
        break;

      case "publication":
        heading(key);
        for (const p of data.publications) {
          children.push(
            new Paragraph({
              spacing: { after: 20 },
              children: [
                new TextRun({ text: p.title, bold: true, size }),
                ...(p.publisher
                  ? [new TextRun({ text: `. ${p.publisher}`, size })]
                  : []),
                ...(p.date
                  ? [
                      new TextRun({
                        text: ` (${formatMonth(p.date, lang)})`,
                        size,
                      }),
                    ]
                  : []),
              ],
            }),
          );
          const kredit = joinNonEmpty(
            [p.tipeLuaran, p.peranSaya, p.indeksasiTier],
            PEMISAH_DETAIL,
          );
          if (kredit) children.push(body(kredit, smallSize));
          if (p.doi) children.push(body(`DOI: ${p.doi}`, smallSize));
          const tautanPublikasi = tautanParagraph(
            p.url.trim()
              ? [{ teks: prettyUrl(p.url), href: ensureHttp(p.url) }]
              : [],
            smallSize,
          );
          if (tautanPublikasi) children.push(tautanPublikasi);
        }
        break;

      case "custom":
        for (const section of data.customSections) {
          children.push(
            sectionTitle((section.title || "TAMBAHAN").toUpperCase(), data),
          );
          for (const item of section.items) {
            children.push(
              titleWithDate(
                item.title,
                formatDateRange(item.startDate, item.endDate, false, lang),
                size,
                smallSize,
              ),
            );
            if (item.subtitle) children.push(subtitle(item.subtitle, size));
            pushBullets(children, item.bullets, size);
          }
        }
        break;
    }
  }

  // Margin mengikuti pilihan pengguna - sama persis dengan yang dipakai
  // pratinjau dan hasil PDF. Sebelumnya nilainya dipatok 15 mm, sehingga
  // berkas Word diam-diam berbeda dari PDF yang baru saja dilihat pengguna.
  const paper = paperSpec(data.pageSize);
  const margins = resumeMargins(data);
  const marginY = Math.round(margins.y * MM_TO_TWIP);
  const marginX = Math.round(margins.x * MM_TO_TWIP);

  const doc = new Document({
    // Properti dokumen diisi dengan identitas pemilik CV, bukan nama
    // aplikasi maupun pembuatnya. Berkas ini adalah dokumen milik pengguna;
    // mencantumkan pihak lain di properti Author akan tampak janggal bila
    // perekrut memeriksanya.
    creator: info.fullName || data.title,
    title: data.title,
    description: "Curriculum Vitae",
    styles: {
      default: {
        document: {
          run: {
            font: data.fontFamily || "Arial",
            size,
            color: "000000",
          },
          paragraph: {
            spacing: { line: Math.round(data.lineHeight * 240) },
          },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            // Ukuran kertas ikut disetel; tanpa ini Word memakai bawaannya
            // sendiri - kerap Letter - sehingga berkasnya berbeda ukuran dari
            // PDF yang dihasilkan aplikasi yang sama.
            size: {
              width: Math.round(paper.widthMm * MM_TO_TWIP),
              height: Math.round(paper.heightMm * MM_TO_TWIP),
            },
            margin: {
              top: marginY,
              bottom: marginY,
              left: marginX,
              right: marginX,
            },
          },
        },
        children,
      },
    ],
  });

  return Packer.toBuffer(doc);
}

/* -------------------------------------------------------------------------- */
/* Pembentuk paragraf                                                         */
/* -------------------------------------------------------------------------- */

function headerLine(text: string, size: number, centered: boolean) {
  return new Paragraph({
    alignment: centered ? AlignmentType.CENTER : AlignmentType.LEFT,
    spacing: { after: 40 },
    children: [new TextRun({ text, size })],
  });
}

/**
 * Judul section. Garis bawah dibuat sebagai border paragraf, bukan tabel
 * satu sel maupun karakter garis berulang - keduanya mengganggu pengurai.
 */
function sectionTitle(text: string, data: ResumeData) {
  const underline = data.template === "CLASSIC";
  return new Paragraph({
    spacing: { before: 200, after: 80 },
    border: underline
      ? {
          bottom: { style: BorderStyle.SINGLE, size: 6, color: "000000" },
        }
      : undefined,
    children: [
      new TextRun({
        text,
        bold: true,
        size: (data.fontSize + 0.5) * HALF_POINT,
        color:
          data.template === "MODERN"
            ? data.accentColor.replace("#", "")
            : "000000",
      }),
    ],
  });
}

/**
 * Baris jabatan beserta periode. Periode dirapatkan ke kanan memakai tab stop
 * kanan, sehingga dalam aliran teks hanya ada satu karakter tab di antaranya -
 * jauh lebih aman bagi pengurai dibanding menempatkan keduanya dalam tabel.
 */
function titleWithDate(
  title: string,
  date: string,
  size: number,
  smallSize: number,
) {
  return new Paragraph({
    spacing: { before: 100, after: 0 },
    tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
    children: [
      new TextRun({ text: title, bold: true, size }),
      ...(date
        ? [new TextRun({ text: `\t${date}`, size: smallSize })]
        : []),
    ],
  });
}

function subtitle(text: string, size: number) {
  return new Paragraph({
    spacing: { after: 20 },
    children: [new TextRun({ text, italics: true, size })],
  });
}

function body(text: string, size: number) {
  return new Paragraph({
    spacing: { after: 40 },
    children: [new TextRun({ text, size })],
  });
}

/**
 * Baris tautan: teks polos yang terbaca, dengan pranala terpasang pada teks
 * polos itu sendiri.
 *
 * Bukan salah satunya. Alamat tujuan sebuah pranala DOCX tersimpan sebagai
 * relationship di `document.xml.rels`, terpisah dari run teksnya - sehingga
 * ekstraksi teks biasa hanya menemukan teks tampilannya. Kalau yang tampil
 * cuma kata "Portofolio", alamatnya hilang bagi mesin. Kalau pranalanya
 * dibuang, alamatnya hilang bagi rekruter yang membuka berkas aslinya.
 */
function tautanParagraph(
  tautan: TautanTercetak[],
  size: number,
): Paragraph | null {
  if (tautan.length === 0) return null;
  return new Paragraph({
    spacing: { after: 40 },
    children: tautan.flatMap((t, index) => [
      ...(index > 0
        ? [new TextRun({ text: PEMISAH_DETAIL, size })]
        : []),
      new ExternalHyperlink({
        link: t.href,
        children: [new TextRun({ text: t.teks, size, style: "Hyperlink" })],
      }),
    ]),
  });
}

function pushBullets(target: Paragraph[], items: string[], size: number) {
  for (const item of items) {
    if (!item.trim()) continue;
    target.push(
      new Paragraph({
        bullet: { level: 0 },
        spacing: { after: 20 },
        children: [new TextRun({ text: item.trim(), size })],
      }),
    );
  }
}

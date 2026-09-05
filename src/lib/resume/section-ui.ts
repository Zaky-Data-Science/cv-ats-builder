import type { Locale } from "@/lib/i18n/config";
import type { SectionKey } from "./types";

/**
 * Label dan petunjuk section untuk **antarmuka editor**.
 *
 * Sengaja terpisah dari `SECTION_META` di sections.ts, yang memuat judul yang
 * dicetak di dalam CV. Keduanya memang mirip, tetapi dikendalikan hal yang
 * berbeda: judul di CV mengikuti bahasa CV-nya (kolom `language` pada tiap
 * CV), sedangkan teks di berkas ini mengikuti bahasa antarmuka yang dipilih
 * pengguna. Seseorang bisa saja memakai antarmuka bahasa Indonesia untuk
 * menyusun CV berbahasa Inggris - dan itu memang lazim.
 */
export interface SectionUiText {
  label: string;
  hint: string;
}

export const SECTION_UI: Record<Locale, Record<SectionKey, SectionUiText>> = {
  id: {
    summary: {
      label: "Ringkasan Profil",
      hint: "2-4 kalimat: siapa kamu, keahlian utama, dan pencapaian terbesar. Letaknya paling atas karena inilah yang pertama dibaca perekrut, kadang satu-satunya yang dibaca.",
    },
    experience: {
      label: "Pengalaman Kerja",
      hint: "Yang paling baru ditaruh paling atas. Tulis apa yang kamu capai, bukan daftar tugas harian.",
    },
    education: {
      label: "Pendidikan",
      hint: "Sekolah atau kuliah terakhir ditaruh paling atas. IPK sebaiknya ditulis kalau 3.00 ke atas, kalau di bawah itu, kosongkan saja.",
    },
    skill: {
      label: "Keahlian",
      hint: 'Tulis namanya apa adanya - "JavaScript", bukan "JS mahir". Mesin penyaring mencocokkan kata demi kata, jadi tambahan apa pun justru bikin tidak cocok.',
    },
    project: {
      label: "Proyek",
      hint: "Penolong utama kalau kamu baru lulus: karya nyata bisa menggantikan pengalaman kerja yang belum ada.",
    },
    certification: {
      label: "Sertifikasi",
      hint: "Tulis penerbit dan tahunnya. Nomor sertifikatnya juga, supaya perekrut bisa mengecek sendiri keasliannya.",
    },
    organization: {
      label: "Organisasi",
      hint: "Sebutkan apa yang kamu kerjakan di sana dan hasilnya, bukan cuma bahwa kamu anggotanya.",
    },
    award: {
      label: "Penghargaan",
      hint: "Sebutkan tingkat lombanya dan kamu juara berapa, supaya nilainya terbaca. \"Juara 2 tingkat provinsi\" jauh lebih jelas daripada \"pernah juara\".",
    },
    language: {
      label: "Bahasa",
      hint: "Pakai istilah yang lazim seperti Native, Fluent, atau Intermediate. Jangan pakai bintang atau diagram, mesin penyaring tidak bisa membacanya.",
    },
    publication: {
      label: "Publikasi",
      hint: "Berguna kalau kamu melamar ke jalur akademik atau penelitian. Sertakan penerbit dan nomor DOI-nya kalau ada.",
    },
    custom: {
      label: "Bagian Tambahan",
      hint: "Untuk hal yang belum tercakup bagian mana pun, misalnya pelatihan, kursus, atau kegiatan sukarela.",
    },
  },
  en: {
    summary: {
      label: "Professional summary",
      hint: "2-4 sentences: who you are, your core skills, and your biggest achievement. It sits at the top because it is what a recruiter reads first, sometimes all they read.",
    },
    experience: {
      label: "Work experience",
      hint: "Most recent goes at the top. Write what you achieved, not a list of daily duties.",
    },
    education: {
      label: "Education",
      hint: "Your most recent school or degree goes at the top. Include your GPA when it is 3.00 or above, below that, leave it out.",
    },
    skill: {
      label: "Skills",
      hint: 'Write the name exactly as it is - "JavaScript", not "JS, advanced". Screening software matches word for word, so any extra wording only stops it matching.',
    },
    project: {
      label: "Projects",
      hint: "The great rescue if you have just graduated: real work you have done can stand in for the job history you do not have yet.",
    },
    certification: {
      label: "Certifications",
      hint: "Include who issued it and the year. Add the certificate number too, so a recruiter can check it is genuine.",
    },
    organization: {
      label: "Organisations",
      hint: "Say what you actually did there and what came of it, not merely that you were a member.",
    },
    award: {
      label: "Awards",
      hint: "State how big the competition was and where you placed, so its weight is clear. \"Second, province level\" says far more than \"won an award\".",
    },
    language: {
      label: "Languages",
      hint: "Use conventional levels such as Native, Fluent, or Intermediate. Avoid stars and bar charts, screening software cannot read them.",
    },
    publication: {
      label: "Publications",
      hint: "Useful when applying to academic or research roles. Include the publisher and the DOI number when you have them.",
    },
    custom: {
      label: "Extra section",
      hint: "For anything no other section covers, training, short courses, volunteering.",
    },
  },
};

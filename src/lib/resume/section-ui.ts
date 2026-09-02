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
      hint: "2-4 kalimat: siapa Anda, keahlian utama, dan pencapaian terbesar. Ditempatkan paling atas karena bagian ini yang pertama dibaca perekrut.",
    },
    experience: {
      label: "Pengalaman Kerja",
      hint: "Urutkan dari yang paling baru. Isi poin pencapaian, bukan daftar tugas rutin.",
    },
    education: {
      label: "Pendidikan",
      hint: "Jenjang terakhir di urutan pertama. IPK sebaiknya dicantumkan bila 3.00 ke atas.",
    },
    skill: {
      label: "Keahlian",
      hint: 'Tulis nama teknologi/keahlian apa adanya (mis. "JavaScript", bukan "JS mahir"). ATS mencocokkan kata kunci secara harfiah.',
    },
    project: {
      label: "Proyek",
      hint: "Bagus untuk fresh graduate: menutup minimnya pengalaman kerja dengan bukti karya.",
    },
    certification: {
      label: "Sertifikasi",
      hint: "Cantumkan penerbit dan tahun. ID kredensial memudahkan verifikasi perekrut.",
    },
    organization: {
      label: "Organisasi",
      hint: "Tunjukkan peran dan dampak, bukan sekadar keanggotaan.",
    },
    award: {
      label: "Penghargaan",
      hint: "Sebutkan tingkat kompetisi dan peringkat agar bobotnya terbaca.",
    },
    language: {
      label: "Bahasa",
      hint: "Gunakan tingkat yang lazim (Native, Fluent, Intermediate), hindari diagram bintang.",
    },
    publication: {
      label: "Publikasi",
      hint: "Relevan untuk jalur akademik atau riset. Sertakan penerbit dan DOI bila ada.",
    },
    custom: {
      label: "Section Tambahan",
      hint: "Untuk kebutuhan khusus yang belum tercakup section lain.",
    },
  },
  en: {
    summary: {
      label: "Professional summary",
      hint: "2-4 sentences: who you are, your core skills, and your biggest achievement. It sits at the top because it is what a recruiter reads first.",
    },
    experience: {
      label: "Work experience",
      hint: "Most recent first. Write achievements, not a list of routine duties.",
    },
    education: {
      label: "Education",
      hint: "Highest level first. Include your GPA when it is 3.00 or above.",
    },
    skill: {
      label: "Skills",
      hint: 'Write the technology or skill exactly as it is named ("JavaScript", not "JS - advanced"). ATS software matches keywords literally.',
    },
    project: {
      label: "Projects",
      hint: "Valuable for fresh graduates: it replaces missing work experience with evidence of real work.",
    },
    certification: {
      label: "Certifications",
      hint: "Include the issuer and the year. A credential ID lets a recruiter verify it.",
    },
    organization: {
      label: "Organisations",
      hint: "Show your role and its impact, not just that you were a member.",
    },
    award: {
      label: "Awards",
      hint: "State the level of the competition and your placing so its weight is clear.",
    },
    language: {
      label: "Languages",
      hint: "Use conventional levels (Native, Fluent, Intermediate). Avoid star ratings.",
    },
    publication: {
      label: "Publications",
      hint: "Relevant for academic and research roles. Include the publisher and DOI when you have them.",
    },
    custom: {
      label: "Additional section",
      hint: "For anything the other sections do not already cover.",
    },
  },
};

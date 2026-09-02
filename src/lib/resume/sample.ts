import type { Locale } from "@/lib/i18n/config";
import { newId } from "@/lib/utils";
import { DEFAULT_SECTION_ORDER } from "./sections";
import type { ResumeData } from "./types";

/**
 * ============================================================================
 *  CONTOH CV LENGKAP
 * ============================================================================
 *
 * Dipakai di empat tempat:
 *  1. Tombol "Isi Data Contoh" di editor - agar pengguna langsung melihat
 *     field yang ia isi akan muncul di bagian mana pada CV jadi.
 *  2. Pratinjau kesepuluh template di halaman depan.
 *  3. Seeder basis data (prisma/seed.ts) untuk akun demo.
 *  4. Berkas uji, sebagai masukan tetap bagi mesin penilaian.
 *
 * Isinya sengaja ditulis mengikuti kaidah CV yang baik: setiap poin diawali
 * kata kerja aksi dan memuat angka terukur, sehingga contoh ini sekaligus
 * berfungsi sebagai panduan menulis, bukan sekadar teks pengisi.
 *
 * Bentuknya dipisah menjadi dua: **kerangka** di bagian bawah berkas
 * (tanggal, jenis pekerjaan, IPK, nama teknologi) dan **prosa** yang
 * diterjemahkan. Nama teknologi seperti React dan PostgreSQL sengaja tidak
 * ikut diterjemahkan - itu memang nama diri.
 *
 * Pemisahan ini menjamin kedua bahasa memiliki jumlah entri, rentang tanggal,
 * dan angka yang persis sama, sehingga skor ATS keduanya identik - dan
 * perbedaan skor antar-bahasa tidak mungkin muncul diam-diam sebagai cacat.
 */

interface SampleText {
  title: string;
  headline: string;
  city: string;
  province: string;
  country: string;
  summary: string;

  jobTitles: [string, string, string];
  companies: [string, string, string];
  workCities: [string, string, string];
  expBullets: [string[], string[], string[]];

  institutions: [string, string];
  degrees: [string, string];
  fields: [string, string];
  eduCities: [string, string];
  eduBullets: string[];

  skillCategories: { language: string; framework: string; tools: string };

  projectNames: [string, string];
  projectRoles: [string, string];
  projectBullets: [string[], string[]];

  certNames: [string, string, string];
  certIssuers: [string, string, string];

  orgName: string;
  orgRole: string;
  orgCity: string;
  orgBullets: string[];

  awardTitles: [string, string];
  awardIssuers: [string, string];
  awardDescriptions: [string, string];

  languages: [string, string, string];

  publicationTitle: string;
  publisher: string;
}

const TEXT: Record<Locale, SampleText> = {
  id: {
    title: "Contoh - Frontend Developer",
    headline: "Frontend Developer",
    city: "Bontang",
    province: "Kalimantan Timur",
    country: "Indonesia",
    summary:
      "Frontend Developer dengan pengalaman 4 tahun membangun aplikasi web berskala produksi menggunakan React dan TypeScript. Berhasil menurunkan waktu muat halaman utama sebesar 45% dan memimpin tim beranggotakan 4 orang dalam migrasi ke arsitektur komponen bersama. Terbiasa bekerja lintas fungsi dengan tim desain dan backend dalam siklus Agile.",

    jobTitles: [
      "Frontend Developer",
      "Web Developer",
      "Frontend Developer Intern",
    ],
    companies: [
      "PT Digital Nusantara",
      "CV Karya Teknologi",
      "Startup Inkubator Kaltim",
    ],
    workCities: ["Jakarta Selatan", "Samarinda", "Balikpapan"],
    expBullets: [
      [
        "Mengembangkan ulang halaman checkout menggunakan React dan TypeScript sehingga tingkat konversi naik dari 2,1% menjadi 3,4% dalam 6 bulan.",
        "Mengoptimasi bundle aplikasi dari 1,8 MB menjadi 640 KB melalui code splitting dan lazy loading, menurunkan waktu muat awal sebesar 45%.",
        "Memimpin tim beranggotakan 4 developer dalam migrasi 60+ komponen ke design system internal, memangkas waktu pengembangan fitur baru sekitar 30%.",
        "Menyusun 120 unit test dengan Jest dan React Testing Library, meningkatkan cakupan pengujian dari 38% menjadi 82%.",
      ],
      [
        "Membangun 12 situs klien berbasis Next.js dengan rata-rata skor Google Lighthouse 94 pada aspek performa.",
        "Mengintegrasikan payment gateway Midtrans pada 5 proyek e-commerce, memproses lebih dari 3.000 transaksi per bulan.",
        "Mengotomasi proses deployment menggunakan GitHub Actions sehingga waktu rilis turun dari 40 menit menjadi 6 menit.",
      ],
      [
        "Membuat 25 komponen antarmuka yang dapat digunakan ulang berdasarkan desain Figma tim produk.",
        "Memperbaiki 47 bug antarmuka yang dilaporkan pengguna dalam kurun 3 bulan.",
      ],
    ],

    institutions: ["Universitas Mulawarman", "SMA Negeri 1 Bontang"],
    degrees: ["Sarjana Komputer (S.Kom)", "SMA"],
    fields: ["Teknik Informatika", "IPA"],
    eduCities: ["Samarinda", "Bontang"],
    eduBullets: [
      "Skripsi: Penerapan Progressive Web App untuk Sistem Informasi Akademik.",
      "Asisten Laboratorium Pemrograman Web selama 3 semester.",
    ],

    skillCategories: {
      language: "Bahasa Pemrograman",
      framework: "Framework & Library",
      tools: "Tools & Platform",
    },

    projectNames: ["SIMAK PWA", "Warung Digital"],
    projectRoles: ["Pengembang Utama", "Frontend Developer"],
    projectBullets: [
      [
        "Merancang sistem informasi akademik berbasis Progressive Web App yang tetap berfungsi tanpa koneksi internet.",
        "Digunakan oleh 800+ mahasiswa dengan waktu muat rata-rata 1,2 detik pada jaringan 3G.",
      ],
      [
        "Membangun antarmuka kasir untuk UMKM dengan dukungan pemindai barcode melalui kamera ponsel.",
        "Diadopsi oleh 40 warung di Samarinda dalam 5 bulan pertama.",
      ],
    ],

    certNames: [
      "Meta Front-End Developer Professional Certificate",
      "Menjadi Front-End Web Developer Expert",
      "AWS Certified Cloud Practitioner",
    ],
    certIssuers: ["Meta / Coursera", "Dicoding Indonesia", "Amazon Web Services"],

    orgName: "Himpunan Mahasiswa Teknik Informatika",
    orgRole: "Ketua Divisi Riset dan Teknologi",
    orgCity: "Samarinda",
    orgBullets: [
      "Menyelenggarakan 6 pelatihan pemrograman yang diikuti total 240 peserta.",
      "Mengelola anggaran kegiatan sebesar Rp18 juta dengan laporan pertanggungjawaban tepat waktu.",
    ],

    awardTitles: [
      "Juara 2 Hackathon Kaltim Digital",
      "Mahasiswa Berprestasi Tingkat Fakultas",
    ],
    awardIssuers: [
      "Dinas Kominfo Provinsi Kalimantan Timur",
      "Fakultas Teknik, Universitas Mulawarman",
    ],
    awardDescriptions: [
      "Membangun purwarupa aplikasi pelaporan infrastruktur dalam 48 jam bersama tim beranggotakan 3 orang.",
      "Peringkat 1 dari 210 mahasiswa angkatan.",
    ],

    languages: ["Bahasa Indonesia", "Bahasa Inggris", "Bahasa Jepang"],

    publicationTitle:
      "Penerapan Progressive Web App pada Sistem Informasi Akademik untuk Wilayah dengan Konektivitas Terbatas",
    publisher: "Jurnal Informatika Mulawarman, Vol. 16 No. 2",
  },

  en: {
    title: "Example - Frontend Developer",
    headline: "Frontend Developer",
    city: "Bontang",
    province: "East Kalimantan",
    country: "Indonesia",
    summary:
      "Frontend Developer with 4 years of experience building production web applications in React and TypeScript. Cut homepage load time by 45% and led a team of 4 through a migration to a shared component architecture. Comfortable working cross-functionally with design and backend teams on an Agile cycle.",

    jobTitles: [
      "Frontend Developer",
      "Web Developer",
      "Frontend Developer Intern",
    ],
    companies: [
      "PT Digital Nusantara",
      "CV Karya Teknologi",
      "Kaltim Startup Incubator",
    ],
    workCities: ["South Jakarta", "Samarinda", "Balikpapan"],
    expBullets: [
      [
        "Rebuilt the checkout flow in React and TypeScript, lifting conversion from 2.1% to 3.4% within 6 months.",
        "Reduced the application bundle from 1.8 MB to 640 KB through code splitting and lazy loading, cutting initial load time by 45%.",
        "Led a team of 4 developers migrating 60+ components onto an internal design system, cutting new-feature delivery time by around 30%.",
        "Wrote 120 unit tests with Jest and React Testing Library, raising coverage from 38% to 82%.",
      ],
      [
        "Built 12 client sites on Next.js averaging a Google Lighthouse performance score of 94.",
        "Integrated the Midtrans payment gateway into 5 e-commerce projects, processing over 3,000 transactions a month.",
        "Automated deployment with GitHub Actions, reducing release time from 40 minutes to 6.",
      ],
      [
        "Built 25 reusable interface components from the product team's Figma designs.",
        "Fixed 47 user-reported interface bugs across 3 months.",
      ],
    ],

    institutions: ["Mulawarman University", "SMA Negeri 1 Bontang"],
    degrees: ["Bachelor of Computer Science", "High School"],
    fields: ["Informatics Engineering", "Natural Sciences"],
    eduCities: ["Samarinda", "Bontang"],
    eduBullets: [
      "Thesis: Applying Progressive Web Apps to an Academic Information System.",
      "Web Programming Laboratory assistant for 3 semesters.",
    ],

    skillCategories: {
      language: "Programming Languages",
      framework: "Frameworks & Libraries",
      tools: "Tools & Platforms",
    },

    projectNames: ["SIMAK PWA", "Warung Digital"],
    projectRoles: ["Lead developer", "Frontend Developer"],
    projectBullets: [
      [
        "Designed an academic information system as a Progressive Web App that keeps working without an internet connection.",
        "Used by 800+ students with an average load time of 1.2 seconds on a 3G connection.",
      ],
      [
        "Built a point-of-sale interface for small businesses with barcode scanning through the phone camera.",
        "Adopted by 40 shops in Samarinda within the first 5 months.",
      ],
    ],

    certNames: [
      "Meta Front-End Developer Professional Certificate",
      "Front-End Web Developer Expert",
      "AWS Certified Cloud Practitioner",
    ],
    certIssuers: ["Meta / Coursera", "Dicoding Indonesia", "Amazon Web Services"],

    orgName: "Informatics Engineering Student Association",
    orgRole: "Head of Research and Technology",
    orgCity: "Samarinda",
    orgBullets: [
      "Ran 6 programming workshops attended by 240 people in total.",
      "Managed an activity budget of Rp18 million, reporting on it on time.",
    ],

    awardTitles: [
      "2nd place, Kaltim Digital Hackathon",
      "Faculty Outstanding Student",
    ],
    awardIssuers: [
      "East Kalimantan Communication and Informatics Office",
      "Faculty of Engineering, Mulawarman University",
    ],
    awardDescriptions: [
      "Built a prototype infrastructure-reporting app in 48 hours with a team of 3.",
      "Ranked 1st out of 210 students in the cohort.",
    ],

    languages: ["Indonesian", "English", "Japanese"],

    publicationTitle:
      "Applying Progressive Web Apps to an Academic Information System in Areas with Limited Connectivity",
    publisher: "Jurnal Informatika Mulawarman, Vol. 16 No. 2",
  },
};

/** Nama teknologi tidak diterjemahkan - semuanya nama diri. */
const SKILLS: { name: string; group: "language" | "framework" | "tools" }[] = [
  { name: "JavaScript", group: "language" },
  { name: "TypeScript", group: "language" },
  { name: "HTML5", group: "language" },
  { name: "CSS3", group: "language" },
  { name: "SQL", group: "language" },
  { name: "React", group: "framework" },
  { name: "Next.js", group: "framework" },
  { name: "Tailwind CSS", group: "framework" },
  { name: "Redux", group: "framework" },
  { name: "Node.js", group: "framework" },
  { name: "Git", group: "tools" },
  { name: "Docker", group: "tools" },
  { name: "Figma", group: "tools" },
  { name: "PostgreSQL", group: "tools" },
  { name: "GitHub Actions", group: "tools" },
];

export function sampleResume(id = "", locale: Locale = "id"): ResumeData {
  const text = TEXT[locale] ?? TEXT.id;

  return {
    id,
    title: text.title,
    template: "CLASSIC",
    accentColor: "#111827",
    fontFamily: "Arial",
    fontSize: 10,
    lineHeight: 1.35,
    language: locale === "en" ? "EN" : "ID",
    pageSize: "A4",
    marginYMm: null,
    marginXMm: null,
    sectionOrder: [...DEFAULT_SECTION_ORDER],

    personalInfo: {
      fullName: "Budi Santoso",
      headline: text.headline,
      email: "budi.santoso@email.com",
      phone: "+62 812-3456-7890",
      city: text.city,
      province: text.province,
      country: text.country,
      linkedinUrl: "linkedin.com/in/budisantoso",
      portfolioUrl: "budisantoso.dev",
      githubUrl: "github.com/budisantoso",
      photoUrl: "",
      showPhoto: false,
      summary: text.summary,
    },

    experiences: [
      {
        id: newId(),
        jobTitle: text.jobTitles[0],
        company: text.companies[0],
        employmentType: "FULL_TIME",
        city: text.workCities[0],
        country: "Indonesia",
        startDate: "2023-02",
        endDate: "",
        isCurrent: true,
        bullets: text.expBullets[0],
      },
      {
        id: newId(),
        jobTitle: text.jobTitles[1],
        company: text.companies[1],
        employmentType: "FULL_TIME",
        city: text.workCities[1],
        country: "Indonesia",
        startDate: "2021-07",
        endDate: "2023-01",
        isCurrent: false,
        bullets: text.expBullets[1],
      },
      {
        id: newId(),
        jobTitle: text.jobTitles[2],
        company: text.companies[2],
        employmentType: "INTERNSHIP",
        city: text.workCities[2],
        country: "Indonesia",
        startDate: "2021-01",
        endDate: "2021-06",
        isCurrent: false,
        bullets: text.expBullets[2],
      },
    ],

    educations: [
      {
        id: newId(),
        institution: text.institutions[0],
        degree: text.degrees[0],
        fieldOfStudy: text.fields[0],
        city: text.eduCities[0],
        startDate: "2017-08",
        endDate: "2021-06",
        isCurrent: false,
        gpa: "3.62",
        maxGpa: "4.00",
        bullets: text.eduBullets,
      },
      {
        id: newId(),
        institution: text.institutions[1],
        degree: text.degrees[1],
        fieldOfStudy: text.fields[1],
        city: text.eduCities[1],
        startDate: "2014-07",
        endDate: "2017-05",
        isCurrent: false,
        gpa: "",
        maxGpa: "4.00",
        bullets: [],
      },
    ],

    skills: SKILLS.map((skill) => ({
      id: newId(),
      name: skill.name,
      category: text.skillCategories[skill.group],
    })),

    projects: [
      {
        id: newId(),
        name: text.projectNames[0],
        role: text.projectRoles[0],
        url: "github.com/budisantoso/simak-pwa",
        startDate: "2020-09",
        endDate: "2021-05",
        bullets: text.projectBullets[0],
      },
      {
        id: newId(),
        name: text.projectNames[1],
        role: text.projectRoles[1],
        url: "warungdigital.example.com",
        startDate: "2022-03",
        endDate: "2022-08",
        bullets: text.projectBullets[1],
      },
    ],

    certifications: [
      {
        id: newId(),
        name: text.certNames[0],
        issuer: text.certIssuers[0],
        issueDate: "2023-04",
        expiryDate: "",
        credentialId: "ABCD1234EFGH",
        url: "coursera.org/verify/ABCD1234EFGH",
      },
      {
        id: newId(),
        name: text.certNames[1],
        issuer: text.certIssuers[1],
        issueDate: "2022-11",
        expiryDate: "2025-11",
        credentialId: "DCD-FE-2211",
        url: "dicoding.com/certificates/DCD-FE-2211",
      },
      {
        id: newId(),
        name: text.certNames[2],
        issuer: text.certIssuers[2],
        issueDate: "2024-02",
        expiryDate: "2027-02",
        credentialId: "AWS-CCP-99120",
        url: "",
      },
    ],

    organizations: [
      {
        id: newId(),
        name: text.orgName,
        role: text.orgRole,
        city: text.orgCity,
        startDate: "2019-08",
        endDate: "2020-07",
        isCurrent: false,
        bullets: text.orgBullets,
      },
    ],

    awards: [
      {
        id: newId(),
        title: text.awardTitles[0],
        issuer: text.awardIssuers[0],
        date: "2022-10",
        description: text.awardDescriptions[0],
      },
      {
        id: newId(),
        title: text.awardTitles[1],
        issuer: text.awardIssuers[1],
        date: "2020-05",
        description: text.awardDescriptions[1],
      },
    ],

    languages: [
      { id: newId(), name: text.languages[0], proficiency: "NATIVE" },
      { id: newId(), name: text.languages[1], proficiency: "ADVANCED" },
      { id: newId(), name: text.languages[2], proficiency: "BASIC" },
    ],

    publications: [
      {
        id: newId(),
        title: text.publicationTitle,
        publisher: text.publisher,
        date: "2021-09",
        url: "",
        doi: "10.30872/jim.v16i2.1234",
      },
    ],

    customSections: [],
  };
}

import { newId } from "@/lib/utils";
import { DEFAULT_SECTION_ORDER } from "./sections";
import type { ResumeData } from "./types";

/**
 * CONTOH CV LENGKAP.
 *
 * Dipakai di tiga tempat:
 *  1. Tombol "Isi Data Contoh" di editor - agar pengguna langsung melihat
 *     field yang ia isi akan muncul di bagian mana pada CV jadi.
 *  2. Pratinjau template di halaman depan.
 *  3. Seeder database (prisma/seed.ts) untuk akun demo.
 *
 * Isinya sengaja ditulis mengikuti kaidah CV yang baik: setiap poin diawali
 * kata kerja aksi dan memuat angka terukur, sehingga contoh ini sekaligus
 * berfungsi sebagai panduan menulis, bukan sekadar teks pengisi.
 */
export function sampleResume(id = ""): ResumeData {
  return {
    id,
    title: "Contoh - Frontend Developer",
    template: "CLASSIC",
    accentColor: "#111827",
    fontFamily: "Arial",
    fontSize: 10,
    lineHeight: 1.35,
    language: "ID",
    sectionOrder: [...DEFAULT_SECTION_ORDER],

    personalInfo: {
      fullName: "Budi Santoso",
      headline: "Frontend Developer",
      email: "budi.santoso@email.com",
      phone: "+62 812-3456-7890",
      city: "Bontang",
      province: "Kalimantan Timur",
      country: "Indonesia",
      linkedinUrl: "linkedin.com/in/budisantoso",
      portfolioUrl: "budisantoso.dev",
      githubUrl: "github.com/budisantoso",
      photoUrl: "",
      showPhoto: false,
      summary:
        "Frontend Developer dengan pengalaman 4 tahun membangun aplikasi web berskala produksi menggunakan React dan TypeScript. Berhasil menurunkan waktu muat halaman utama sebesar 45% dan memimpin tim beranggotakan 4 orang dalam migrasi ke arsitektur komponen bersama. Terbiasa bekerja lintas fungsi dengan tim desain dan backend dalam siklus Agile.",
    },

    experiences: [
      {
        id: newId(),
        jobTitle: "Frontend Developer",
        company: "PT Digital Nusantara",
        employmentType: "FULL_TIME",
        city: "Jakarta Selatan",
        country: "Indonesia",
        startDate: "2023-02",
        endDate: "",
        isCurrent: true,
        bullets: [
          "Mengembangkan ulang halaman checkout menggunakan React dan TypeScript sehingga tingkat konversi naik dari 2,1% menjadi 3,4% dalam 6 bulan.",
          "Mengoptimasi bundle aplikasi dari 1,8 MB menjadi 640 KB melalui code splitting dan lazy loading, menurunkan waktu muat awal sebesar 45%.",
          "Memimpin tim beranggotakan 4 developer dalam migrasi 60+ komponen ke design system internal, memangkas waktu pengembangan fitur baru sekitar 30%.",
          "Menyusun 120 unit test dengan Jest dan React Testing Library, meningkatkan cakupan pengujian dari 38% menjadi 82%.",
        ],
      },
      {
        id: newId(),
        jobTitle: "Web Developer",
        company: "CV Karya Teknologi",
        employmentType: "FULL_TIME",
        city: "Samarinda",
        country: "Indonesia",
        startDate: "2021-07",
        endDate: "2023-01",
        isCurrent: false,
        bullets: [
          "Membangun 12 situs klien berbasis Next.js dengan rata-rata skor Google Lighthouse 94 pada aspek performa.",
          "Mengintegrasikan payment gateway Midtrans pada 5 proyek e-commerce, memproses lebih dari 3.000 transaksi per bulan.",
          "Mengotomasi proses deployment menggunakan GitHub Actions sehingga waktu rilis turun dari 40 menit menjadi 6 menit.",
        ],
      },
      {
        id: newId(),
        jobTitle: "Frontend Developer Intern",
        company: "Startup Inkubator Kaltim",
        employmentType: "INTERNSHIP",
        city: "Balikpapan",
        country: "Indonesia",
        startDate: "2021-01",
        endDate: "2021-06",
        isCurrent: false,
        bullets: [
          "Membuat 25 komponen antarmuka yang dapat digunakan ulang berdasarkan desain Figma tim produk.",
          "Memperbaiki 47 bug antarmuka yang dilaporkan pengguna dalam kurun 3 bulan.",
        ],
      },
    ],

    educations: [
      {
        id: newId(),
        institution: "Universitas Mulawarman",
        degree: "Sarjana Komputer (S.Kom)",
        fieldOfStudy: "Teknik Informatika",
        city: "Samarinda",
        startDate: "2017-08",
        endDate: "2021-06",
        isCurrent: false,
        gpa: "3.62",
        maxGpa: "4.00",
        bullets: [
          "Skripsi: Penerapan Progressive Web App untuk Sistem Informasi Akademik.",
          "Asisten Laboratorium Pemrograman Web selama 3 semester.",
        ],
      },
      {
        id: newId(),
        institution: "SMA Negeri 1 Bontang",
        degree: "SMA",
        fieldOfStudy: "IPA",
        city: "Bontang",
        startDate: "2014-07",
        endDate: "2017-05",
        isCurrent: false,
        gpa: "",
        maxGpa: "4.00",
        bullets: [],
      },
    ],

    skills: [
      { id: newId(), name: "JavaScript", category: "Bahasa Pemrograman" },
      { id: newId(), name: "TypeScript", category: "Bahasa Pemrograman" },
      { id: newId(), name: "HTML5", category: "Bahasa Pemrograman" },
      { id: newId(), name: "CSS3", category: "Bahasa Pemrograman" },
      { id: newId(), name: "SQL", category: "Bahasa Pemrograman" },
      { id: newId(), name: "React", category: "Framework & Library" },
      { id: newId(), name: "Next.js", category: "Framework & Library" },
      { id: newId(), name: "Tailwind CSS", category: "Framework & Library" },
      { id: newId(), name: "Redux", category: "Framework & Library" },
      { id: newId(), name: "Node.js", category: "Framework & Library" },
      { id: newId(), name: "Git", category: "Tools & Platform" },
      { id: newId(), name: "Docker", category: "Tools & Platform" },
      { id: newId(), name: "Figma", category: "Tools & Platform" },
      { id: newId(), name: "PostgreSQL", category: "Tools & Platform" },
      { id: newId(), name: "GitHub Actions", category: "Tools & Platform" },
    ],

    projects: [
      {
        id: newId(),
        name: "SIMAK PWA",
        role: "Pengembang Utama",
        url: "github.com/budisantoso/simak-pwa",
        startDate: "2020-09",
        endDate: "2021-05",
        bullets: [
          "Merancang sistem informasi akademik berbasis Progressive Web App yang tetap berfungsi tanpa koneksi internet.",
          "Digunakan oleh 800+ mahasiswa dengan waktu muat rata-rata 1,2 detik pada jaringan 3G.",
        ],
      },
      {
        id: newId(),
        name: "Warung Digital",
        role: "Frontend Developer",
        url: "warungdigital.example.com",
        startDate: "2022-03",
        endDate: "2022-08",
        bullets: [
          "Membangun antarmuka kasir untuk UMKM dengan dukungan pemindai barcode melalui kamera ponsel.",
          "Diadopsi oleh 40 warung di Samarinda dalam 5 bulan pertama.",
        ],
      },
    ],

    certifications: [
      {
        id: newId(),
        name: "Meta Front-End Developer Professional Certificate",
        issuer: "Meta / Coursera",
        issueDate: "2023-04",
        expiryDate: "",
        credentialId: "ABCD1234EFGH",
        url: "coursera.org/verify/ABCD1234EFGH",
      },
      {
        id: newId(),
        name: "Menjadi Front-End Web Developer Expert",
        issuer: "Dicoding Indonesia",
        issueDate: "2022-11",
        expiryDate: "2025-11",
        credentialId: "DCD-FE-2211",
        url: "dicoding.com/certificates/DCD-FE-2211",
      },
      {
        id: newId(),
        name: "AWS Certified Cloud Practitioner",
        issuer: "Amazon Web Services",
        issueDate: "2024-02",
        expiryDate: "2027-02",
        credentialId: "AWS-CCP-99120",
        url: "",
      },
    ],

    organizations: [
      {
        id: newId(),
        name: "Himpunan Mahasiswa Teknik Informatika",
        role: "Ketua Divisi Riset dan Teknologi",
        city: "Samarinda",
        startDate: "2019-08",
        endDate: "2020-07",
        isCurrent: false,
        bullets: [
          "Menyelenggarakan 6 pelatihan pemrograman yang diikuti total 240 peserta.",
          "Mengelola anggaran kegiatan sebesar Rp18 juta dengan laporan pertanggungjawaban tepat waktu.",
        ],
      },
    ],

    awards: [
      {
        id: newId(),
        title: "Juara 2 Hackathon Kaltim Digital",
        issuer: "Dinas Kominfo Provinsi Kalimantan Timur",
        date: "2022-10",
        description:
          "Membangun purwarupa aplikasi pelaporan infrastruktur dalam 48 jam bersama tim beranggotakan 3 orang.",
      },
      {
        id: newId(),
        title: "Mahasiswa Berprestasi Tingkat Fakultas",
        issuer: "Fakultas Teknik, Universitas Mulawarman",
        date: "2020-05",
        description: "Peringkat 1 dari 210 mahasiswa angkatan.",
      },
    ],

    languages: [
      { id: newId(), name: "Bahasa Indonesia", proficiency: "NATIVE" },
      { id: newId(), name: "Bahasa Inggris", proficiency: "ADVANCED" },
      { id: newId(), name: "Bahasa Jepang", proficiency: "BASIC" },
    ],

    publications: [
      {
        id: newId(),
        title:
          "Penerapan Progressive Web App pada Sistem Informasi Akademik untuk Wilayah dengan Konektivitas Terbatas",
        publisher: "Jurnal Informatika Mulawarman, Vol. 16 No. 2",
        date: "2021-09",
        url: "",
        doi: "10.30872/jim.v16i2.1234",
      },
    ],

    customSections: [],
  };
}

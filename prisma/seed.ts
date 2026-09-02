import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { sampleResume } from "../src/lib/resume/sample";
import { DEFAULT_SECTION_ORDER } from "../src/lib/resume/sections";

/**
 * Mengisi database dengan satu akun demo beserta CV contoh lengkap.
 *
 * Berguna untuk dua hal: mencoba aplikasi tanpa perlu mendaftar lebih dulu,
 * dan menyediakan keadaan awal yang seragam saat aplikasi didemonstrasikan
 * kepada penguji.
 *
 * Jalankan dengan: npm run db:seed
 */

const DEMO_EMAIL = "demo@atscv.local";
const DEMO_PASSWORD = "demo12345";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

async function main() {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 12);

  const user = await prisma.user.upsert({
    where: { email: DEMO_EMAIL },
    update: { passwordHash },
    create: {
      email: DEMO_EMAIL,
      name: "Pengguna Demo",
      passwordHash,
    },
  });

  // Seeder dijalankan berulang kali selama pengembangan, jadi CV demo lama
  // dibersihkan lebih dulu agar tidak menumpuk. Baris anaknya ikut terhapus
  // lewat ON DELETE CASCADE.
  await prisma.resume.deleteMany({ where: { userId: user.id } });

  const data = sampleResume();

  await prisma.resume.create({
    data: {
      userId: user.id,
      title: data.title,
      template: data.template,
      accentColor: data.accentColor,
      fontFamily: data.fontFamily,
      fontSize: data.fontSize,
      lineHeight: data.lineHeight,
      language: data.language,
      sectionOrder: DEFAULT_SECTION_ORDER,
      personalInfo: { create: { ...data.personalInfo } },
      experiences: {
        create: data.experiences.map((e, order) => ({ ...e, order })),
      },
      educations: {
        create: data.educations.map((e, order) => ({ ...e, order })),
      },
      skills: { create: data.skills.map((s, order) => ({ ...s, order })) },
      projects: { create: data.projects.map((p, order) => ({ ...p, order })) },
      certifications: {
        create: data.certifications.map((c, order) => ({ ...c, order })),
      },
      organizations: {
        create: data.organizations.map((o, order) => ({ ...o, order })),
      },
      awards: { create: data.awards.map((a, order) => ({ ...a, order })) },
      languages: { create: data.languages.map((l, order) => ({ ...l, order })) },
      publications: {
        create: data.publications.map((p, order) => ({ ...p, order })),
      },
    },
  });

  console.log("Data awal berhasil dibuat.");
  console.log(`  Email    : ${DEMO_EMAIL}`);
  console.log(`  Kata sandi: ${DEMO_PASSWORD}`);
}

main()
  .catch((error) => {
    console.error("Seeder gagal:", error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

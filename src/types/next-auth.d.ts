import type { DefaultSession } from "next-auth";

/**
 * Menambahkan `id` pada objek sesi supaya seluruh handler API dapat
 * memakai `session.user.id` dengan aman tanpa type assertion.
 */
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      /** Benar hanya bila surelnya cocok dengan ADMIN_EMAIL. */
      admin?: boolean;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    uid?: string;
    admin?: boolean;
  }
}

export {};

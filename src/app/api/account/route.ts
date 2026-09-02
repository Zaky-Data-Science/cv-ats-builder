import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { errorResponse, HttpError, requireUser } from "@/lib/guard";

const updateSchema = z.object({
  name: z.string().min(1).max(120).optional(),
  currentPassword: z.string().max(128).optional(),
  newPassword: z.string().min(8).max(128).optional(),
});

/** Mengubah nama tampilan atau kata sandi. */
export async function PATCH(request: Request) {
  try {
    const user = await requireUser();
    const body = await request.json().catch(() => ({}));
    const input = updateSchema.parse(body);

    const account = await prisma.user.findUniqueOrThrow({
      where: { id: user.id },
      select: { passwordHash: true },
    });

    const data: { name?: string; passwordHash?: string } = {};

    if (input.name) data.name = input.name.trim();

    if (input.newPassword) {
      if (account.passwordHash) {
        // Pengguna yang sudah punya kata sandi wajib membuktikan bahwa ia
        // mengetahui yang lama - mencegah pengambilalihan lewat sesi yang
        // terlanjur terbuka di perangkat orang lain.
        const valid =
          input.currentPassword &&
          (await bcrypt.compare(input.currentPassword, account.passwordHash));
        if (!valid) {
          throw new HttpError(403, "Kata sandi saat ini salah.");
        }
      }
      data.passwordHash = await bcrypt.hash(input.newPassword, 12);
    }

    if (Object.keys(data).length === 0) {
      throw new HttpError(400, "Tidak ada perubahan yang dikirim.");
    }

    await prisma.user.update({ where: { id: user.id }, data });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}

/**
 * Menghapus akun beserta seluruh CV di dalamnya.
 * Penghapusan berantai diurus oleh ON DELETE CASCADE pada tingkat basis data,
 * sehingga tidak ada baris yatim yang tertinggal.
 */
export async function DELETE() {
  try {
    const user = await requireUser();
    await prisma.user.delete({ where: { id: user.id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}

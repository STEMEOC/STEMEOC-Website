"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { saveUpload } from "@/lib/uploads";

const AVATAR_EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export async function updateProfile(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) redirect("/admin/login");

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const avatar = formData.get("avatar");

  let avatarUrl: string | undefined;
  if (avatar instanceof File && avatar.size > 0) {
    const ext = AVATAR_EXTENSIONS[avatar.type];
    if (!ext) throw new Error("Unsupported image type. Use JPG, PNG, WebP, or GIF.");

    const filename = `${session.user.id}-${Date.now()}.${ext}`;
    avatarUrl = await saveUpload(avatar, "avatars", filename);
  }

  await prisma.admin.update({
    where: { id: session.user.id },
    data: {
      name,
      email,
      ...(avatarUrl ? { avatarUrl } : {}),
    },
  });

  revalidatePath("/admin", "layout");
  redirect("/admin/profile");
}

export type ChangePasswordState = { error?: string; success?: boolean };

export async function changePassword(
  _prevState: ChangePasswordState,
  formData: FormData,
): Promise<ChangePasswordState> {
  const session = await auth();
  if (!session?.user?.id) redirect("/admin/login");

  const currentPassword = String(formData.get("currentPassword") ?? "");
  const newPassword = String(formData.get("newPassword") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (newPassword.length < 8) {
    return { error: "New password must be at least 8 characters." };
  }
  if (newPassword !== confirmPassword) {
    return { error: "New password and confirmation do not match." };
  }

  const admin = await prisma.admin.findUnique({ where: { id: session.user.id } });
  if (!admin) redirect("/admin/login");

  const valid = await bcrypt.compare(currentPassword, admin.passwordHash);
  if (!valid) {
    return { error: "Current password is incorrect." };
  }

  await prisma.admin.update({
    where: { id: admin.id },
    data: { passwordHash: await bcrypt.hash(newPassword, 10) },
  });

  return { success: true };
}

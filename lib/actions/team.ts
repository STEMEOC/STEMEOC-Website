"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { invalidateTag } from "@/lib/cache";
import { resolveImageField } from "@/lib/uploads";

const TeamSchema = z.object({
  name: z.string().trim().min(1).max(200),
  role: z.string().trim().min(1).max(200),
  bio: z.string().trim().min(1).max(2000),
  photoUrl: z.string().trim().max(500),
  order: z.coerce.number().int(),
  published: z.coerce.boolean(),
});

async function revalidateTeam() {
  await invalidateTag("team");
  revalidatePath("/about");
  revalidatePath("/");
  revalidatePath("/admin/team");
}

export async function createTeamMember(formData: FormData) {
  const data = TeamSchema.parse({
    name: formData.get("name"),
    role: formData.get("role"),
    bio: formData.get("bio"),
    photoUrl: await resolveImageField(formData, "photoUrl", "team"),
    order: formData.get("order") || 0,
    published: formData.get("published") === "on",
  });

  await prisma.teamMember.create({ data: { ...data, photoUrl: data.photoUrl || null } });
  await revalidateTeam();
  redirect("/admin/team");
}

export async function updateTeamMember(id: string, formData: FormData) {
  const data = TeamSchema.parse({
    name: formData.get("name"),
    role: formData.get("role"),
    bio: formData.get("bio"),
    photoUrl: await resolveImageField(formData, "photoUrl", "team"),
    order: formData.get("order") || 0,
    published: formData.get("published") === "on",
  });

  await prisma.teamMember.update({
    where: { id },
    data: { ...data, photoUrl: data.photoUrl || null },
  });
  await revalidateTeam();
  redirect("/admin/team");
}

export async function deleteTeamMember(id: string) {
  await prisma.teamMember.delete({ where: { id } });
  await revalidateTeam();
  revalidatePath("/admin/team");
}

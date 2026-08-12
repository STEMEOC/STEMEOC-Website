"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { invalidateTag } from "@/lib/cache";

const ProgramSchema = z.object({
  title: z.string().trim().min(1).max(300),
  slug: z
    .string()
    .trim()
    .min(1)
    .max(300)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only"),
  description: z.string().trim().min(1).max(2000),
  coverImageUrl: z.string().trim().url().optional().or(z.literal("")),
  category: z.string().trim().min(1).max(100),
  order: z.coerce.number().int(),
  published: z.coerce.boolean(),
});

async function revalidatePrograms() {
  await invalidateTag("programs");
  revalidatePath("/projects");
  revalidatePath("/");
  revalidatePath("/admin/programs");
}

export async function createProgram(formData: FormData) {
  const data = ProgramSchema.parse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    coverImageUrl: formData.get("coverImageUrl") || "",
    category: formData.get("category"),
    order: formData.get("order") || 0,
    published: formData.get("published") === "on",
  });

  await prisma.program.create({ data: { ...data, coverImageUrl: data.coverImageUrl || null } });
  await revalidatePrograms();
  redirect("/admin/programs");
}

export async function updateProgram(id: string, formData: FormData) {
  const data = ProgramSchema.parse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    coverImageUrl: formData.get("coverImageUrl") || "",
    category: formData.get("category"),
    order: formData.get("order") || 0,
    published: formData.get("published") === "on",
  });

  await prisma.program.update({
    where: { id },
    data: { ...data, coverImageUrl: data.coverImageUrl || null },
  });
  await revalidatePrograms();
  redirect("/admin/programs");
}

export async function deleteProgram(id: string) {
  await prisma.program.delete({ where: { id } });
  await revalidatePrograms();
  revalidatePath("/admin/programs");
}

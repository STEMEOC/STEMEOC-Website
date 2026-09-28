"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { invalidateTag } from "@/lib/cache";
import { resolveImageField } from "@/lib/uploads";
import { auth } from "@/auth";

const NewsSchema = z.object({
  title: z.string().trim().min(1).max(300),
  slug: z
    .string()
    .trim()
    .min(1)
    .max(300)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only"),
  excerpt: z.string().trim().min(1).max(500),
  body: z.string().trim().min(1),
  coverImageUrl: z.string().trim().max(500),
  published: z.coerce.boolean(),
});

async function revalidateNews() {
  await invalidateTag("news");
  revalidatePath("/news");
  revalidatePath("/");
  revalidatePath("/admin/news");
}

export async function createNews(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  const data = NewsSchema.parse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    excerpt: formData.get("excerpt"),
    body: formData.get("body"),
    coverImageUrl: await resolveImageField(formData, "coverImageUrl", "news"),
    published: formData.get("published") === "on",
  });

  await prisma.newsPost.create({
    data: {
      ...data,
      coverImageUrl: data.coverImageUrl || null,
      authorId: session.user.id,
      publishedAt: data.published ? new Date() : null,
    },
  });

  await revalidateNews();
  redirect("/admin/news");
}

export async function updateNews(id: string, formData: FormData) {
  const data = NewsSchema.parse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    excerpt: formData.get("excerpt"),
    body: formData.get("body"),
    coverImageUrl: await resolveImageField(formData, "coverImageUrl", "news"),
    published: formData.get("published") === "on",
  });

  const existing = await prisma.newsPost.findUniqueOrThrow({ where: { id } });

  await prisma.newsPost.update({
    where: { id },
    data: {
      ...data,
      coverImageUrl: data.coverImageUrl || null,
      publishedAt: data.published ? (existing.publishedAt ?? new Date()) : null,
    },
  });

  await revalidateNews();
  redirect("/admin/news");
}

export async function deleteNews(id: string) {
  await prisma.newsPost.delete({ where: { id } });
  await revalidateNews();
  revalidatePath("/admin/news");
}

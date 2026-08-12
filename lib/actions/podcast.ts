"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { invalidateTag } from "@/lib/cache";

const PodcastEpisodeSchema = z.object({
  title: z.string().trim().min(1).max(300),
  videoId: z.string().trim().min(1).max(50),
  description: z.string().trim().min(1).max(3000),
  tag: z.string().trim().max(100).optional().or(z.literal("")),
  order: z.coerce.number().int(),
  published: z.coerce.boolean(),
});

async function revalidatePodcast() {
  await invalidateTag("podcast");
  revalidatePath("/podcast");
  revalidatePath("/admin/podcast");
}

export async function createPodcastEpisode(formData: FormData) {
  const data = PodcastEpisodeSchema.parse({
    title: formData.get("title"),
    videoId: formData.get("videoId"),
    description: formData.get("description"),
    tag: formData.get("tag") || "",
    order: formData.get("order") || 0,
    published: formData.get("published") === "on",
  });

  await prisma.podcastEpisode.create({ data: { ...data, tag: data.tag || null } });
  await revalidatePodcast();
  redirect("/admin/podcast");
}

export async function updatePodcastEpisode(id: string, formData: FormData) {
  const data = PodcastEpisodeSchema.parse({
    title: formData.get("title"),
    videoId: formData.get("videoId"),
    description: formData.get("description"),
    tag: formData.get("tag") || "",
    order: formData.get("order") || 0,
    published: formData.get("published") === "on",
  });

  await prisma.podcastEpisode.update({
    where: { id },
    data: { ...data, tag: data.tag || null },
  });
  await revalidatePodcast();
  redirect("/admin/podcast");
}

export async function deletePodcastEpisode(id: string) {
  await prisma.podcastEpisode.delete({ where: { id } });
  await revalidatePodcast();
  revalidatePath("/admin/podcast");
}

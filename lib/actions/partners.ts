"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { invalidateTag } from "@/lib/cache";
import { resolveImageField } from "@/lib/uploads";

const PartnerSchema = z.object({
  name: z.string().trim().min(1).max(200),
  logoUrl: z.string().trim().min(1).max(500),
  websiteUrl: z.string().trim().url().optional().or(z.literal("")),
  order: z.coerce.number().int(),
  published: z.coerce.boolean(),
});

async function revalidatePartners() {
  await invalidateTag("partners");
  revalidatePath("/");
  revalidatePath("/admin/partners");
}

export async function createPartner(formData: FormData) {
  const data = PartnerSchema.parse({
    name: formData.get("name"),
    logoUrl: await resolveImageField(formData, "logoUrl", "partners"),
    websiteUrl: formData.get("websiteUrl") || "",
    order: formData.get("order") || 0,
    published: formData.get("published") === "on",
  });

  await prisma.partner.create({ data: { ...data, websiteUrl: data.websiteUrl || null } });
  await revalidatePartners();
  redirect("/admin/partners");
}

export async function updatePartner(id: string, formData: FormData) {
  const data = PartnerSchema.parse({
    name: formData.get("name"),
    logoUrl: await resolveImageField(formData, "logoUrl", "partners"),
    websiteUrl: formData.get("websiteUrl") || "",
    order: formData.get("order") || 0,
    published: formData.get("published") === "on",
  });

  await prisma.partner.update({
    where: { id },
    data: { ...data, websiteUrl: data.websiteUrl || null },
  });
  await revalidatePartners();
  redirect("/admin/partners");
}

export async function deletePartner(id: string) {
  await prisma.partner.delete({ where: { id } });
  await revalidatePartners();
  revalidatePath("/admin/partners");
}

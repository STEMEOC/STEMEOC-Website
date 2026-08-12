"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { prisma } from "@/lib/prisma";
import { invalidateTag } from "@/lib/cache";

const MAX_COVER_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB

async function saveCoverImage(file: File): Promise<string> {
  if (file.size > MAX_COVER_IMAGE_SIZE) {
    throw new Error("Cover image must be under 10MB.");
  }
  const dir = path.join(process.cwd(), "public", "uploads", "forms", "covers");
  await mkdir(dir, { recursive: true });
  const ext = path.extname(file.name) || "";
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(dir, filename), buffer);
  return `/uploads/forms/covers/${filename}`;
}

const FieldSchema = z.object({
  id: z.string(),
  label: z.string().trim().min(1).max(300),
  type: z.enum([
    "SHORT_TEXT",
    "PARAGRAPH",
    "EMAIL",
    "NUMBER",
    "DATE",
    "DROPDOWN",
    "MULTIPLE_CHOICE",
    "CHECKBOXES",
    "FILE",
  ]),
  options: z.array(z.string().trim().min(1)).default([]),
  required: z.boolean(),
});

const FormSchema = z.object({
  title: z.string().trim().min(1).max(300),
  slug: z
    .string()
    .trim()
    .min(1)
    .max(300)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only"),
  description: z.string().trim().max(2000).optional().or(z.literal("")),
  published: z.coerce.boolean(),
  accentColor: z.string().trim().regex(/^#[0-9a-fA-F]{6}$/, "Must be a hex color"),
  layout: z.enum(["CLASSIC", "MINIMAL", "BOLD", "COVER", "SIDEBAR", "DUOTONE", "FRAMED", "BADGE"]),
  theme: z.enum(["LIGHT", "DARK"]),
  fields: z.array(FieldSchema).min(1, "Add at least one field"),
});

function parseFormData(formData: FormData) {
  let fields: unknown = [];
  try {
    fields = JSON.parse(String(formData.get("fields") ?? "[]"));
  } catch {
    fields = [];
  }

  return FormSchema.parse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    description: formData.get("description") || "",
    published: formData.get("published") === "on",
    accentColor: formData.get("accentColor"),
    layout: formData.get("layout"),
    theme: formData.get("theme"),
    fields,
  });
}

async function resolveCoverImageUrl(formData: FormData): Promise<string | null> {
  const file = formData.get("coverImage");
  if (file instanceof File && file.size > 0) {
    return await saveCoverImage(file);
  }
  const existing = formData.get("existingCoverImageUrl");
  return typeof existing === "string" && existing.trim() ? existing.trim() : null;
}

async function revalidateForms() {
  await invalidateTag("forms");
  revalidatePath("/apply");
  revalidatePath("/admin/forms");
}

export async function createForm(formData: FormData) {
  const data = parseFormData(formData);
  const coverImageUrl = await resolveCoverImageUrl(formData);

  await prisma.form.create({
    data: {
      title: data.title,
      slug: data.slug,
      description: data.description || null,
      published: data.published,
      accentColor: data.accentColor,
      layout: data.layout,
      coverImageUrl,
      theme: data.theme,
      fields: {
        create: data.fields.map((field, order) => ({
          label: field.label,
          type: field.type,
          options: field.options,
          required: field.required,
          order,
        })),
      },
    },
  });

  await revalidateForms();
  redirect("/admin/forms");
}

export async function updateForm(id: string, formData: FormData) {
  const data = parseFormData(formData);
  const coverImageUrl = await resolveCoverImageUrl(formData);

  await prisma.$transaction(async (tx) => {
    const existing = await tx.formField.findMany({ where: { formId: id }, select: { id: true } });
    const existingIds = new Set(existing.map((f) => f.id));
    const incomingExistingIds = new Set(data.fields.filter((f) => existingIds.has(f.id)).map((f) => f.id));

    const toDelete = [...existingIds].filter((fieldId) => !incomingExistingIds.has(fieldId));
    if (toDelete.length > 0) {
      await tx.formField.deleteMany({ where: { id: { in: toDelete } } });
    }

    for (const [order, field] of data.fields.entries()) {
      if (existingIds.has(field.id)) {
        await tx.formField.update({
          where: { id: field.id },
          data: { label: field.label, type: field.type, options: field.options, required: field.required, order },
        });
      } else {
        await tx.formField.create({
          data: {
            formId: id,
            label: field.label,
            type: field.type,
            options: field.options,
            required: field.required,
            order,
          },
        });
      }
    }

    await tx.form.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description || null,
        published: data.published,
        accentColor: data.accentColor,
        layout: data.layout,
        coverImageUrl,
        theme: data.theme,
      },
    });
  });

  await revalidateForms();
  redirect("/admin/forms");
}

export async function deleteForm(id: string) {
  await prisma.form.delete({ where: { id } });
  await revalidateForms();
}

export async function deleteSubmission(formId: string, id: string) {
  await prisma.formSubmission.delete({ where: { id } });
  revalidatePath(`/admin/forms/${formId}/responses`);
}

function csvCell(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

export async function exportSubmissionsCsv(formId: string): Promise<string> {
  const form = await prisma.form.findUniqueOrThrow({
    where: { id: formId },
    include: {
      fields: { orderBy: { order: "asc" } },
      submissions: { orderBy: { createdAt: "desc" } },
    },
  });

  const header = [...form.fields.map((f) => f.label), "Submitted At"].map(csvCell).join(",");

  const rows = form.submissions.map((submission) => {
    const data = submission.data as Record<string, string | string[] | undefined>;
    const cells = form.fields.map((field) => {
      const value = data[field.id];
      if (Array.isArray(value)) return value.join("; ");
      return value ?? "";
    });
    cells.push(submission.createdAt.toISOString());
    return cells.map(csvCell).join(",");
  });

  return [header, ...rows].join("\n");
}

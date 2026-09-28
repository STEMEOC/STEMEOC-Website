"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { Prisma } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { invalidateTag } from "@/lib/cache";

const MAX_COVER_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB

// Chosen by content type, never by the uploaded file's name, so nothing
// executable (HTML, SVG) can be saved under a web-servable extension.
const COVER_EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};

/** Server actions can be called from any page, so each one checks the session itself. */
async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");
}

async function saveCoverImage(file: File): Promise<string> {
  const ext = COVER_EXTENSIONS[file.type];
  if (!ext) throw new FormSaveError("Cover image must be a JPG, PNG, WebP, GIF or AVIF.");
  if (file.size > MAX_COVER_IMAGE_SIZE) throw new FormSaveError("Cover image must be under 10MB.");
  const dir = path.join(process.cwd(), "public", "uploads", "forms", "covers");
  await mkdir(dir, { recursive: true });
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  await writeFile(path.join(dir, filename), Buffer.from(await file.arrayBuffer()));
  return `/uploads/forms/covers/${filename}`;
}

/** An error whose message is safe and useful to show the admin. */
class FormSaveError extends Error {}

export type FormSaveState = { error?: string };

const FieldSchema = z.object({
  id: z.string(),
  label: z.string().trim().min(1, "Every question needs text").max(300),
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
  title: z.string().trim().min(1, "Give the form a title").max(300),
  slug: z
    .string()
    .trim()
    .min(1, "Add a form link")
    .max(300)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "The form link can only use lowercase letters, numbers and hyphens"),
  description: z.string().trim().max(2000).optional().or(z.literal("")),
  published: z.coerce.boolean(),
  accentColor: z.string().trim().regex(/^#[0-9a-fA-F]{6}$/, "Pick a valid color"),
  layout: z.enum(["CLASSIC", "MINIMAL", "BOLD", "COVER", "SIDEBAR", "DUOTONE", "FRAMED", "BADGE"]),
  theme: z.enum(["LIGHT", "DARK"]),
  fields: z
    .array(FieldSchema)
    .min(1, "Add at least one question")
    .refine(
      (fields) => fields.every((f) => !["DROPDOWN", "MULTIPLE_CHOICE", "CHECKBOXES"].includes(f.type) || f.options.length > 0),
      "Every choice question needs at least one option"
    ),
});

type ParsedForm = z.infer<typeof FormSchema>;

function parseFormData(formData: FormData): ParsedForm {
  let fields: unknown = [];
  try {
    fields = JSON.parse(String(formData.get("fields") ?? "[]"));
  } catch {
    fields = [];
  }

  const result = FormSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    description: formData.get("description") || "",
    published: formData.get("published") === "on",
    accentColor: formData.get("accentColor"),
    layout: formData.get("layout"),
    theme: formData.get("theme"),
    fields,
  });
  if (!result.success) throw new FormSaveError(result.error.issues[0]?.message ?? "Please check the form.");
  return result.data;
}

async function assertSlugFree(slug: string, exceptId?: string) {
  const taken = await prisma.form.findFirst({
    where: { slug, ...(exceptId ? { NOT: { id: exceptId } } : {}) },
    select: { title: true },
  });
  if (taken) {
    throw new FormSaveError(`The link /apply/${slug} is already used by “${taken.title}”. Please choose a different one.`);
  }
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

/** Turns expected problems into a message on the page instead of an error screen. */
function toSaveState(error: unknown): FormSaveState {
  if (error instanceof FormSaveError) return { error: error.message };
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
    return { error: "That form link is already used by another form. Please choose a different one." };
  }
  console.error("Saving form failed", error);
  return { error: "Something went wrong while saving. Your changes are still here. Please try again." };
}

export async function createForm(_prev: FormSaveState, formData: FormData): Promise<FormSaveState> {
  await requireAdmin();
  try {
    const data = parseFormData(formData);
    await assertSlugFree(data.slug);
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
  } catch (error) {
    return toSaveState(error);
  }

  await revalidateForms();
  redirect("/admin/forms");
}

export async function updateForm(id: string, _prev: FormSaveState, formData: FormData): Promise<FormSaveState> {
  await requireAdmin();
  try {
    const data = parseFormData(formData);
    await assertSlugFree(data.slug, id);
    const coverImageUrl = await resolveCoverImageUrl(formData);

    await prisma.$transaction(async (tx) => {
      const existing = await tx.formField.findMany({ where: { formId: id, archivedAt: null }, select: { id: true } });
      const existingIds = new Set(existing.map((f) => f.id));
      const incomingIds = new Set(data.fields.map((f) => f.id));

      // Removed questions are archived, not deleted, so their answers stay readable.
      const removed = [...existingIds].filter((fieldId) => !incomingIds.has(fieldId));
      if (removed.length > 0) {
        await tx.formField.updateMany({ where: { id: { in: removed } }, data: { archivedAt: new Date() } });
      }

      for (const [order, field] of data.fields.entries()) {
        const values = { label: field.label, type: field.type, options: field.options, required: field.required, order };
        if (existingIds.has(field.id)) {
          await tx.formField.update({ where: { id: field.id }, data: values });
        } else {
          await tx.formField.create({ data: { formId: id, ...values } });
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
  } catch (error) {
    return toSaveState(error);
  }

  await revalidateForms();
  revalidatePath(`/admin/forms/${id}/responses`);
  redirect("/admin/forms");
}

export async function deleteForm(id: string) {
  await requireAdmin();
  await prisma.form.delete({ where: { id } });
  await revalidateForms();
}

export async function deleteSubmission(formId: string, id: string) {
  await requireAdmin();
  await prisma.formSubmission.delete({ where: { id } });
  revalidatePath(`/admin/forms/${formId}/responses`);
}

/** Google Forms' "Accepting responses" switch: closes the public form when off. */
export async function setAcceptingResponses(id: string, accepting: boolean) {
  await requireAdmin();
  await prisma.form.update({ where: { id }, data: { published: accepting } });
  await revalidateForms();
  revalidatePath(`/admin/forms/${id}/responses`);
}

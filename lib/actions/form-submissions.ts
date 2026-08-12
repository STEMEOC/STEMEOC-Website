"use server";

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export type FormSubmitState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string>;
};

export async function submitFormResponse(
  formId: string,
  _prevState: FormSubmitState,
  formData: FormData
): Promise<FormSubmitState> {
  const headerList = await headers();
  const ip = headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  const { success: withinLimit } = await rateLimit(`form:${formId}:${ip}`, {
    limit: 5,
    windowSeconds: 60,
  });

  if (!withinLimit) {
    return { status: "error", message: "Too many submissions. Please wait a minute and try again." };
  }

  const form = await prisma.form.findUnique({
    where: { id: formId },
    include: { fields: { orderBy: { order: "asc" } } },
  });

  if (!form || !form.published) {
    return { status: "error", message: "This form is no longer accepting responses." };
  }

  const fieldErrors: Record<string, string> = {};
  const data: Record<string, string | string[]> = {};

  for (const field of form.fields) {
    if (field.type === "CHECKBOXES") {
      const raw = formData.getAll(field.id).map((v) => String(v));
      if (field.required && raw.length === 0) {
        fieldErrors[field.id] = "This field is required.";
        continue;
      }
      if (raw.some((v) => !field.options.includes(v))) {
        fieldErrors[field.id] = "Invalid selection.";
        continue;
      }
      if (raw.length > 0) data[field.id] = raw;
      continue;
    }

    if (field.type === "FILE") {
      const file = formData.get(field.id);
      if (!(file instanceof File) || file.size === 0) {
        if (field.required) fieldErrors[field.id] = "This field is required.";
        continue;
      }
      if (file.size > MAX_FILE_SIZE) {
        fieldErrors[field.id] = "File must be under 10MB.";
        continue;
      }

      const dir = path.join(process.cwd(), "public", "uploads", "forms", formId);
      await mkdir(dir, { recursive: true });
      const ext = path.extname(file.name) || "";
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
      const buffer = Buffer.from(await file.arrayBuffer());
      await writeFile(path.join(dir, filename), buffer);
      data[field.id] = `/uploads/forms/${formId}/${filename}`;
      continue;
    }

    const raw = String(formData.get(field.id) ?? "").trim();
    if (!raw) {
      if (field.required) fieldErrors[field.id] = "This field is required.";
      continue;
    }

    if (field.type === "EMAIL" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw)) {
      fieldErrors[field.id] = "Enter a valid email.";
      continue;
    }
    if (field.type === "NUMBER" && Number.isNaN(Number(raw))) {
      fieldErrors[field.id] = "Enter a valid number.";
      continue;
    }
    if ((field.type === "DROPDOWN" || field.type === "MULTIPLE_CHOICE") && !field.options.includes(raw)) {
      fieldErrors[field.id] = "Invalid selection.";
      continue;
    }

    data[field.id] = raw;
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { status: "error", message: "Please fix the errors below.", fieldErrors };
  }

  await prisma.formSubmission.create({ data: { formId, data } });

  return { status: "success", message: "Thanks — your response has been submitted." };
}

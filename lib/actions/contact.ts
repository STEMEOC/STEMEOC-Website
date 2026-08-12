"use server";

import { z } from "zod";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";

const ContactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(200),
  email: z.string().trim().email("Enter a valid email"),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(5000),
});

type ContactField = "name" | "email" | "message";

export type ContactFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<ContactField, string>>;
};

export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const headerList = await headers();
  const ip = headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  const { success: withinLimit } = await rateLimit(`contact:${ip}`, {
    limit: 5,
    windowSeconds: 60,
  });

  if (!withinLimit) {
    return {
      status: "error",
      message: "Too many submissions. Please wait a minute and try again.",
    };
  }

  const parsed = ContactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    const fieldErrors: Partial<Record<ContactField, string>> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as ContactField | undefined;
      if (field) fieldErrors[field] = issue.message;
    }
    return { status: "error", message: "Please fix the errors below.", fieldErrors };
  }

  await prisma.contactSubmission.create({ data: parsed.data });

  return { status: "success", message: "Thanks for reaching out — we'll be in touch soon." };
}

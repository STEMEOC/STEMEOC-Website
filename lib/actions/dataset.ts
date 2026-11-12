"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { PROGRAM_PAGES } from "@/lib/program-pages";
import { parseDatasetCsv } from "@/lib/event-dataset";

export type UploadState = { ok: boolean; message: string } | null;

const MAX_BYTES = 100_000;

export async function uploadDataset(_prev: UploadState, formData: FormData): Promise<UploadState> {
  const session = await auth();
  if (!session?.user) return { ok: false, message: "Please log in again." };

  const key = String(formData.get("event") ?? "");
  const [program, event] = key.split("/");
  if (!PROGRAM_PAGES[program]?.events?.some((e) => e.slug === event)) {
    return { ok: false, message: "Pick an event." };
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return { ok: false, message: "Choose a CSV file." };
  if (!file.name.toLowerCase().endsWith(".csv")) return { ok: false, message: "File must be .csv" };
  if (file.size > MAX_BYTES) return { ok: false, message: "File is too big (max 100 KB)." };

  let rows;
  try {
    rows = parseDatasetCsv(await file.text());
  } catch (err) {
    return { ok: false, message: (err as Error).message };
  }

  const data = { rows, fileName: file.name.slice(0, 200), uploadedBy: session.user.email ?? null };
  await prisma.eventDataset.upsert({ where: { key }, create: { key, ...data }, update: data });
  revalidatePath("/admin/dataset");
  return { ok: true, message: `Saved ${rows.length} rows for ${key}.` };
}

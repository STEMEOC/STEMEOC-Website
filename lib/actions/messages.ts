"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function deleteMessage(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  await prisma.contactSubmission.delete({ where: { id } });
  revalidatePath("/admin/messages");
  revalidatePath("/admin/dashboard");
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { FormBuilder } from "@/components/admin/FormBuilder";
import { PageHeader } from "@/components/admin/PageHeader";
import { updateForm } from "@/lib/actions/forms";

export const metadata: Metadata = { title: "Edit Form" };

export default async function EditFormPage({ params }: PageProps<"/admin/forms/[id]/edit">) {
  const { id } = await params;
  const form = await prisma.form.findUnique({ where: { id }, include: { fields: { orderBy: { order: "asc" } } } });
  if (!form) notFound();

  return (
    <div>
      <PageHeader eyebrow="Content" title="Edit Form" description={form.title} />
      <div className="mt-8">
        <FormBuilder action={updateForm.bind(null, id)} form={form} />
      </div>
    </div>
  );
}

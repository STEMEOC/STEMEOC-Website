import type { Metadata } from "next";
import { FormBuilder } from "@/components/admin/FormBuilder";
import { PageHeader } from "@/components/admin/PageHeader";
import { createForm } from "@/lib/actions/forms";
import { FORM_TEMPLATES } from "@/lib/formTemplates";

export const metadata: Metadata = { title: "New Form" };

export default async function NewFormPage({ searchParams }: PageProps<"/admin/forms/new">) {
  const { template } = await searchParams;
  const initialTemplate = FORM_TEMPLATES.find((t) => t.id === template);

  return (
    <div>
      <PageHeader eyebrow="Content" title="New Form" description="Pick a template or start from a blank form." />
      <div className="mt-8">
        <FormBuilder action={createForm} initialTemplate={initialTemplate} />
      </div>
    </div>
  );
}

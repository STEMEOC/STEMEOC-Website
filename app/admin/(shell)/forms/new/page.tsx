import type { Metadata } from "next";
import { FormBuilder } from "@/components/admin/FormBuilder";
import { PageHeader } from "@/components/admin/PageHeader";
import { createForm } from "@/lib/actions/forms";

export const metadata: Metadata = { title: "New Form" };

export default function NewFormPage() {
  return (
    <div>
      <PageHeader eyebrow="Content" title="New Form" description="Pick a template or start from a blank form." />
      <div className="mt-8">
        <FormBuilder action={createForm} />
      </div>
    </div>
  );
}

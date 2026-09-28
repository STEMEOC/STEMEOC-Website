import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PencilSimple } from "@phosphor-icons/react/dist/ssr";
import { prisma } from "@/lib/prisma";
import { FormResponses, type ResponseField, type ResponseSubmission } from "@/components/admin/FormResponses";

export const metadata: Metadata = { title: "Responses" };

export default async function FormResponsesPage({ params }: PageProps<"/admin/forms/[id]/responses">) {
  const { id } = await params;
  // One parallel round trip instead of Prisma's three sequential `include`
  // queries: the database is far away, so each trip costs ~250ms.
  const [form, fields, rows] = await Promise.all([
    prisma.form.findUnique({
      where: { id },
      select: { id: true, slug: true, title: true, accentColor: true, published: true },
    }),
    prisma.formField.findMany({
      where: { formId: id },
      orderBy: [{ archivedAt: { sort: "asc", nulls: "first" } }, { order: "asc" }],
      select: { id: true, label: true, type: true, options: true, required: true, archivedAt: true },
    }),
    prisma.formSubmission.findMany({
      where: { formId: id },
      orderBy: { createdAt: "desc" },
      select: { id: true, createdAt: true, data: true },
    }),
  ]);
  if (!form) notFound();

  // Removed questions only show when someone answered them before they were removed.
  const answered = (fieldId: string) =>
    rows.some((r) => {
      const v = (r.data as Record<string, unknown> | null)?.[fieldId];
      return Array.isArray(v) ? v.length > 0 : Boolean(v);
    });
  const shownFields: ResponseField[] = fields
    .filter((f) => !f.archivedAt || answered(f.id))
    .map(({ archivedAt, ...f }) => ({ ...f, archived: archivedAt !== null }));

  const submissions: ResponseSubmission[] = rows.map((s) => ({
    id: s.id,
    createdAt: s.createdAt.toISOString(),
    data: s.data as ResponseSubmission["data"],
  }));

  return (
    <div>
      <div className="mx-auto mb-6 flex max-w-3xl flex-wrap items-center justify-between gap-3">
        <Link href="/admin/forms" className="font-mono-label text-xs uppercase text-ink/40 hover:text-ink">
          ← All forms
        </Link>
        <Link
          href={`/admin/forms/${form.id}/edit`}
          className="flex items-center gap-1.5 text-sm font-semibold text-ink/60 hover:text-ink"
        >
          <PencilSimple size={16} />
          Edit questions
        </Link>
      </div>
      <FormResponses
        formId={form.id}
        slug={form.slug}
        title={form.title}
        accentColor={form.accentColor}
        accepting={form.published}
        fields={shownFields}
        submissions={submissions}
      />
    </div>
  );
}

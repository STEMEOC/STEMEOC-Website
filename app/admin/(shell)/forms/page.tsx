import type { Metadata } from "next";
import Link from "next/link";
import { ClipboardText } from "@phosphor-icons/react/dist/ssr";
import { prisma } from "@/lib/prisma";
import { deleteForm } from "@/lib/actions/forms";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusPill } from "@/components/admin/StatusPill";
import { RowActions } from "@/components/admin/RowActions";

export const metadata: Metadata = { title: "Forms" };

export default async function AdminFormsPage() {
  const forms = await prisma.form.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { fields: true, submissions: true } } },
  });

  return (
    <div>
      <PageHeader
        eyebrow="Content"
        title="Forms"
        cta={{ label: "New Form", href: "/admin/forms/new", icon: <ClipboardText size={16} weight="bold" /> }}
      />

      <div className="mt-8 overflow-hidden rounded-[2rem] bg-paper shadow-sm ring-1 ring-black/5">
        <table className="w-full text-left text-sm">
          <thead className="bg-paper-dim text-xs uppercase text-ink/50">
            <tr>
              <th className="px-6 py-4 font-bold">Title</th>
              <th className="px-6 py-4 font-bold">Questions</th>
              <th className="px-6 py-4 font-bold">Responses</th>
              <th className="px-6 py-4 font-bold">Status</th>
              <th className="px-6 py-4" />
            </tr>
          </thead>
          <tbody>
            {forms.map((form) => (
              <tr key={form.id} className="border-t border-ink/5 transition-colors hover:bg-paper-dim">
                <td className="px-6 py-4 font-bold text-ink">
                  <Link href={`/admin/forms/${form.id}/responses`} className="hover:underline">
                    {form.title}
                  </Link>
                </td>
                <td className="px-6 py-4 text-ink/60">{form._count.fields}</td>
                <td className="px-6 py-4">
                  <Link href={`/admin/forms/${form.id}/responses`} className="font-bold text-blue hover:underline">
                    {form._count.submissions}
                  </Link>
                </td>
                <td className="px-6 py-4">
                  <StatusPill active={form.published} onLabel="Published" offLabel="Hidden" />
                </td>
                <td className="px-6 py-4">
                  <RowActions
                    editHref={`/admin/forms/${form.id}/edit`}
                    onDelete={deleteForm.bind(null, form.id)}
                    copyPath={`/apply/${form.slug}`}
                  />
                </td>
              </tr>
            ))}
            {forms.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-ink/50">
                  No forms yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

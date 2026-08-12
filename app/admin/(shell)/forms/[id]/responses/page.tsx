import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Trash } from "@phosphor-icons/react/dist/ssr";
import { prisma } from "@/lib/prisma";
import { deleteSubmission } from "@/lib/actions/forms";
import { ExportCsvButton } from "@/components/admin/ExportCsvButton";

export const metadata: Metadata = { title: "Responses" };

export default async function FormResponsesPage({ params }: PageProps<"/admin/forms/[id]/responses">) {
  const { id } = await params;
  const form = await prisma.form.findUnique({
    where: { id },
    include: {
      fields: { orderBy: { order: "asc" } },
      submissions: { orderBy: { createdAt: "desc" } },
    },
  });
  if (!form) notFound();

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link href="/admin/forms" className="font-mono-label text-xs uppercase text-ink/40 hover:text-ink">
            ← All forms
          </Link>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            {form.title} — Responses
          </h1>
          <p className="mt-2 text-sm text-ink/60">{form.submissions.length} submission{form.submissions.length === 1 ? "" : "s"}</p>
        </div>
        <ExportCsvButton formId={form.id} filename={form.slug} />
      </div>

      <div className="mt-8 overflow-x-auto rounded-[2rem] bg-paper shadow-sm ring-1 ring-black/5">
        <table className="w-full text-left text-sm">
          <thead className="bg-paper-dim text-xs uppercase text-ink/50">
            <tr>
              {form.fields.map((field) => (
                <th key={field.id} className="whitespace-nowrap px-6 py-4 font-bold">{field.label}</th>
              ))}
              <th className="whitespace-nowrap px-6 py-4 font-bold">Submitted</th>
              <th className="px-6 py-4" />
            </tr>
          </thead>
          <tbody>
            {form.submissions.map((submission) => {
              const data = submission.data as Record<string, string | string[] | undefined>;
              return (
                <tr key={submission.id} className="border-t border-ink/5 transition-colors hover:bg-paper-dim">
                  {form.fields.map((field) => {
                    const value = data[field.id];
                    return (
                      <td key={field.id} className="max-w-xs px-6 py-4 text-ink/80">
                        {field.type === "FILE" && typeof value === "string" && value ? (
                          <a href={value} target="_blank" rel="noreferrer" className="font-bold text-blue hover:underline">
                            View file
                          </a>
                        ) : Array.isArray(value) ? (
                          value.join(", ")
                        ) : (
                          value || <span className="text-ink/30">—</span>
                        )}
                      </td>
                    );
                  })}
                  <td className="whitespace-nowrap px-6 py-4 text-ink/50">
                    {submission.createdAt.toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <form action={deleteSubmission.bind(null, form.id, submission.id)}>
                      <button
                        type="submit"
                        aria-label="Delete"
                        className="flex h-9 w-9 items-center justify-center rounded-xl text-ink/40 transition-colors hover:bg-red hover:text-paper"
                      >
                        <Trash size={16} weight="bold" />
                      </button>
                    </form>
                  </td>
                </tr>
              );
            })}
            {form.submissions.length === 0 && (
              <tr>
                <td colSpan={form.fields.length + 2} className="px-6 py-10 text-center text-ink/50">
                  No responses yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

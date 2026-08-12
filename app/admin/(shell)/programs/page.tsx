import type { Metadata } from "next";
import { GraduationCap } from "@phosphor-icons/react/dist/ssr";
import { prisma } from "@/lib/prisma";
import { deleteProgram } from "@/lib/actions/programs";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusPill } from "@/components/admin/StatusPill";
import { RowActions } from "@/components/admin/RowActions";

export const metadata: Metadata = { title: "Programs" };

export default async function AdminProgramsPage() {
  const programs = await prisma.program.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <PageHeader
        eyebrow="Content"
        title="Programs"
        cta={{ label: "New Program", href: "/admin/programs/new", icon: <GraduationCap size={16} weight="bold" /> }}
      />

      <div className="mt-8 overflow-hidden rounded-[2rem] bg-paper shadow-sm ring-1 ring-black/5">
        <table className="w-full text-left text-sm">
          <thead className="bg-paper-dim text-xs uppercase text-ink/50">
            <tr>
              <th className="px-6 py-4 font-bold">Title</th>
              <th className="px-6 py-4 font-bold">Category</th>
              <th className="px-6 py-4 font-bold">Status</th>
              <th className="px-6 py-4" />
            </tr>
          </thead>
          <tbody>
            {programs.map((program) => (
              <tr key={program.id} className="border-t border-ink/5 transition-colors hover:bg-paper-dim">
                <td className="px-6 py-4 font-bold text-ink">{program.title}</td>
                <td className="px-6 py-4 text-ink/60">{program.category}</td>
                <td className="px-6 py-4">
                  <StatusPill active={program.published} onLabel="Published" offLabel="Hidden" />
                </td>
                <td className="px-6 py-4">
                  <RowActions editHref={`/admin/programs/${program.id}/edit`} onDelete={deleteProgram.bind(null, program.id)} />
                </td>
              </tr>
            ))}
            {programs.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-ink/50">
                  No programs yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

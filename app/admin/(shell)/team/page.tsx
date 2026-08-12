import type { Metadata } from "next";
import { UsersThree } from "@phosphor-icons/react/dist/ssr";
import { prisma } from "@/lib/prisma";
import { deleteTeamMember } from "@/lib/actions/team";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusPill } from "@/components/admin/StatusPill";
import { RowActions } from "@/components/admin/RowActions";

export const metadata: Metadata = { title: "Team" };

export default async function AdminTeamPage() {
  const members = await prisma.teamMember.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <PageHeader
        eyebrow="People"
        title="Team"
        cta={{ label: "Add Member", href: "/admin/team/new", icon: <UsersThree size={16} weight="bold" /> }}
      />

      <div className="mt-8 overflow-hidden rounded-[2rem] bg-paper shadow-sm ring-1 ring-black/5">
        <table className="w-full text-left text-sm">
          <thead className="bg-paper-dim text-xs uppercase text-ink/50">
            <tr>
              <th className="px-6 py-4 font-bold">Name</th>
              <th className="px-6 py-4 font-bold">Role</th>
              <th className="px-6 py-4 font-bold">Status</th>
              <th className="px-6 py-4" />
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id} className="border-t border-ink/5 transition-colors hover:bg-paper-dim">
                <td className="px-6 py-4 font-bold text-ink">{member.name}</td>
                <td className="px-6 py-4 text-ink/60">{member.role}</td>
                <td className="px-6 py-4">
                  <StatusPill active={member.published} onLabel="Published" offLabel="Hidden" />
                </td>
                <td className="px-6 py-4">
                  <RowActions editHref={`/admin/team/${member.id}/edit`} onDelete={deleteTeamMember.bind(null, member.id)} />
                </td>
              </tr>
            ))}
            {members.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-ink/50">
                  No team members yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

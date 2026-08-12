import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { TeamForm } from "@/components/admin/TeamForm";
import { updateTeamMember } from "@/lib/actions/team";

export const metadata: Metadata = { title: "Edit Team Member" };

export default async function EditTeamMemberPage({ params }: PageProps<"/admin/team/[id]/edit">) {
  const { id } = await params;
  const member = await prisma.teamMember.findUnique({ where: { id } });
  if (!member) notFound();

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-ink">Edit Team Member</h1>
      <div className="mt-8">
        <TeamForm action={updateTeamMember.bind(null, id)} member={member} />
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import { TeamForm } from "@/components/admin/TeamForm";
import { createTeamMember } from "@/lib/actions/team";

export const metadata: Metadata = { title: "Add Team Member" };

export default function NewTeamMemberPage() {
  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-ink">Add Team Member</h1>
      <div className="mt-8">
        <TeamForm action={createTeamMember} />
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { PageHeader } from "@/components/admin/PageHeader";
import { ProfileForm } from "@/components/admin/ProfileForm";
import { updateProfile } from "@/lib/actions/profile";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Profile" };

export default async function AdminProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/admin/login");

  const admin = await prisma.admin.findUnique({ where: { id: session.user.id } });
  if (!admin) redirect("/admin/login");

  return (
    <div>
      <PageHeader eyebrow="Account" title="Profile" description="Update your name, email, and profile photo." />
      <div className="mt-8">
        <ProfileForm action={updateProfile} name={admin.name} email={admin.email} avatarUrl={admin.avatarUrl} />
      </div>
    </div>
  );
}

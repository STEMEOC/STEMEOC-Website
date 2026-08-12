import { auth } from "@/auth";
import { AdminSidebar } from "@/components/AdminSidebar";
import { prisma } from "@/lib/prisma";

export default async function AdminShellLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const admin = session?.user?.id
    ? await prisma.admin.findUnique({ where: { id: session.user.id }, select: { name: true, avatarUrl: true } })
    : null;

  return (
    <div className="flex min-h-screen bg-paper-dim">
      <AdminSidebar
        userName={admin?.name ?? session?.user?.email ?? "Admin"}
        avatarUrl={admin?.avatarUrl ?? null}
      />
      <main className="flex-1 px-10 py-10 lg:px-14 lg:py-12">{children}</main>
    </div>
  );
}

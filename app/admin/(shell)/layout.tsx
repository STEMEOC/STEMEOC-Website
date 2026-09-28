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
      <main className="min-w-0 flex-1 px-8 py-10 lg:px-14 lg:py-14">{children}</main>
    </div>
  );
}

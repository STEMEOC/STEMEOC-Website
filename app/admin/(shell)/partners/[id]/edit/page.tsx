import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PartnerForm } from "@/components/admin/PartnerForm";
import { updatePartner } from "@/lib/actions/partners";

export const metadata: Metadata = { title: "Edit Partner" };

export default async function EditPartnerPage({ params }: PageProps<"/admin/partners/[id]/edit">) {
  const { id } = await params;
  const partner = await prisma.partner.findUnique({ where: { id } });
  if (!partner) notFound();

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-ink">Edit Partner</h1>
      <div className="mt-8">
        <PartnerForm action={updatePartner.bind(null, id)} partner={partner} />
      </div>
    </div>
  );
}

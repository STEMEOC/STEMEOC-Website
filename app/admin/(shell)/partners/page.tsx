import type { Metadata } from "next";
import { Handshake } from "@phosphor-icons/react/dist/ssr";
import { prisma } from "@/lib/prisma";
import { deletePartner } from "@/lib/actions/partners";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusPill } from "@/components/admin/StatusPill";
import { RowActions } from "@/components/admin/RowActions";

export const metadata: Metadata = { title: "Partners" };

export default async function AdminPartnersPage() {
  const partners = await prisma.partner.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <PageHeader
        eyebrow="Network"
        title="Partners"
        cta={{ label: "Add Partner", href: "/admin/partners/new", icon: <Handshake size={16} weight="bold" /> }}
      />

      <div className="mt-8 overflow-hidden rounded-[2rem] bg-paper shadow-sm ring-1 ring-black/5">
        <table className="w-full text-left text-sm">
          <thead className="bg-paper-dim text-xs uppercase text-ink/50">
            <tr>
              <th className="px-6 py-4 font-bold">Name</th>
              <th className="px-6 py-4 font-bold">Status</th>
              <th className="px-6 py-4" />
            </tr>
          </thead>
          <tbody>
            {partners.map((partner) => (
              <tr key={partner.id} className="border-t border-ink/5 transition-colors hover:bg-paper-dim">
                <td className="px-6 py-4 font-bold text-ink">{partner.name}</td>
                <td className="px-6 py-4">
                  <StatusPill active={partner.published} onLabel="Published" offLabel="Hidden" />
                </td>
                <td className="px-6 py-4">
                  <RowActions editHref={`/admin/partners/${partner.id}/edit`} onDelete={deletePartner.bind(null, partner.id)} />
                </td>
              </tr>
            ))}
            {partners.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-10 text-center text-ink/50">
                  No partners yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

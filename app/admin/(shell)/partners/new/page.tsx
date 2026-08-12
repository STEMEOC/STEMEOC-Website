import type { Metadata } from "next";
import { PartnerForm } from "@/components/admin/PartnerForm";
import { createPartner } from "@/lib/actions/partners";

export const metadata: Metadata = { title: "Add Partner" };

export default function NewPartnerPage() {
  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-ink">Add Partner</h1>
      <div className="mt-8">
        <PartnerForm action={createPartner} />
      </div>
    </div>
  );
}

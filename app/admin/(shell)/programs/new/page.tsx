import type { Metadata } from "next";
import { ProgramForm } from "@/components/admin/ProgramForm";
import { createProgram } from "@/lib/actions/programs";

export const metadata: Metadata = { title: "New Program" };

export default function NewProgramPage() {
  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-ink">New Program</h1>
      <div className="mt-8">
        <ProgramForm action={createProgram} />
      </div>
    </div>
  );
}

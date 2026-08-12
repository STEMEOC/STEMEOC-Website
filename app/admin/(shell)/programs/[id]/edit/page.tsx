import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProgramForm } from "@/components/admin/ProgramForm";
import { updateProgram } from "@/lib/actions/programs";

export const metadata: Metadata = { title: "Edit Program" };

export default async function EditProgramPage({ params }: PageProps<"/admin/programs/[id]/edit">) {
  const { id } = await params;
  const program = await prisma.program.findUnique({ where: { id } });
  if (!program) notFound();

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-ink">Edit Program</h1>
      <div className="mt-8">
        <ProgramForm action={updateProgram.bind(null, id)} program={program} />
      </div>
    </div>
  );
}

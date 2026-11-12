import { ProgramCards } from "@/components/ProgramCards";

type Program = { id: string; slug: string; title: string; coverImageUrl: string | null };

/** "More projects" row, in the same card format as the home page programs. */
export function MoreProjects({
  title,
  detailLabel,
  labels,
  programs,
}: {
  title: string;
  detailLabel: string;
  labels: { prev: string; next: string };
  programs: Program[];
}) {
  if (programs.length === 0) return null;

  return (
    <section className="container-site section-y">
      <h2 className="font-display text-3xl font-bold md:text-5xl">{title}</h2>
      <ProgramCards programs={programs} detailLabel={detailLabel} labels={labels} className="mt-10" />
    </section>
  );
}

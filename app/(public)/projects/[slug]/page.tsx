import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getProgramBySlug } from "@/lib/content";
import { getDictionary } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const [program, { dict }] = await Promise.all([getProgramBySlug(slug), getDictionary()]);
  return { title: program?.title ?? dict.projects.metaTitle };
}

export default async function ProgramPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const [program, { dict }] = await Promise.all([getProgramBySlug(slug), getDictionary()]);
  if (!program) notFound();

  return (
    <article className="mx-auto max-w-3xl px-6 py-20">
      <Link href="/projects" className="text-sm font-bold text-blue hover:underline">
        {dict.projects.backToPrograms}
      </Link>
      {program.coverImageUrl && (
        <div className="relative mt-6 h-64 w-full overflow-hidden rounded-3xl md:h-96">
          <Image src={program.coverImageUrl} alt="" fill className="object-cover" sizes="768px" priority />
        </div>
      )}
      <p className="font-mono-label mt-6 text-xs uppercase text-ink/50">{program.category}</p>
      <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight">
        {program.title}
      </h1>
      <p className="mt-6 text-lg leading-relaxed text-ink/70">{program.description}</p>
    </article>
  );
}

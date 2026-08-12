import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getFormBySlug } from "@/lib/content";
import { DynamicForm } from "@/components/DynamicForm";
import { Reveal } from "@/components/motion/Reveal";
import { getDictionary } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/apply/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const [form, { dict }] = await Promise.all([getFormBySlug(slug), getDictionary()]);
  return { title: form?.title ?? dict.apply.metaTitle };
}

export default async function ApplyFormPage({ params }: PageProps<"/apply/[slug]">) {
  const { slug } = await params;
  const form = await getFormBySlug(slug);
  if (!form) notFound();

  return (
    <section className="bg-paper py-20">
      <div className="mx-auto max-w-2xl px-6">
        <Reveal>
          <DynamicForm form={form} />
        </Reveal>
      </div>
    </section>
  );
}

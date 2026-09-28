import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LockSimple } from "@phosphor-icons/react/dist/ssr";
import { getFormBySlug } from "@/lib/content";
import { DynamicForm } from "@/components/DynamicForm";
import { Reveal } from "@/components/motion/Reveal";
import { getDictionary } from "@/lib/i18n";
import { PageTransition } from "@/components/motion/PageTransition";

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
    <PageTransition>
      <section className="bg-paper py-20">
        <div className="mx-auto max-w-2xl px-6">
          <Reveal>
            {form.published ? (
              <DynamicForm form={form} />
            ) : (
              // Like Google Forms: an old link to a closed form explains itself instead of 404ing.
              <div className="flex flex-col items-center rounded-[2rem] bg-white p-10 text-center shadow-xl ring-1 ring-black/5 md:p-14">
                <span
                  className="flex h-16 w-16 items-center justify-center rounded-full"
                  style={{ backgroundColor: `${form.accentColor}1a`, color: form.accentColor }}
                >
                  <LockSimple size={30} weight="fill" />
                </span>
                <h1 className="mt-6 font-display text-2xl font-bold text-navy md:text-3xl">{form.title}</h1>
                <p className="mt-3 max-w-sm text-base text-navy/65">
                  This form is no longer accepting responses. If you think this is a mistake, please contact us.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <Link href="/apply" className="rounded-full bg-navy px-6 py-3 text-sm font-bold text-white hover:bg-blue-deep">
                    See open applications
                  </Link>
                  <Link href="/contact" className="rounded-full px-6 py-3 text-sm font-bold text-navy ring-1 ring-navy/15 hover:ring-navy/40">
                    Contact us
                  </Link>
                </div>
              </div>
            )}
          </Reveal>
        </div>
      </section>
    </PageTransition>
  );
}

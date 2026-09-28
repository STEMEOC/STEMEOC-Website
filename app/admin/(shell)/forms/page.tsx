import type { Metadata } from "next";
import Link from "next/link";
import { Plus, ClipboardText } from "@phosphor-icons/react/dist/ssr";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/admin/PageHeader";
import { FormCard, type FormCardData } from "@/components/admin/FormCard";
import { FORM_TEMPLATES } from "@/lib/formTemplates";

export const metadata: Metadata = { title: "Forms" };

const relative = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 365 * 24 * 3600],
  ["month", 30 * 24 * 3600],
  ["week", 7 * 24 * 3600],
  ["day", 24 * 3600],
  ["hour", 3600],
  ["minute", 60],
];

function timeAgo(date: Date) {
  const seconds = (date.getTime() - Date.now()) / 1000;
  for (const [unit, size] of UNITS) {
    if (Math.abs(seconds) >= size) return relative.format(Math.round(seconds / size), unit);
  }
  return "just now";
}

export default async function AdminFormsPage() {
  // Both queries in one round trip; the latest-response dates come from one grouped query.
  const [forms, latest] = await Promise.all([
    prisma.form.findMany({
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        slug: true,
        title: true,
        accentColor: true,
        coverImageUrl: true,
        published: true,
        updatedAt: true,
        _count: { select: { fields: true, submissions: true } },
      },
    }),
    prisma.formSubmission.groupBy({ by: ["formId"], _max: { createdAt: true } }),
  ]);
  const latestByForm = new Map(latest.map((l) => [l.formId, l._max.createdAt]));

  const cards: FormCardData[] = forms.map((f) => {
    const latestAt = latestByForm.get(f.id);
    return {
      id: f.id,
      slug: f.slug,
      title: f.title,
      accentColor: f.accentColor,
      coverImageUrl: f.coverImageUrl,
      published: f.published,
      questionCount: f._count.fields,
      responseCount: f._count.submissions,
      updatedLabel: timeAgo(f.updatedAt),
      latestResponseLabel: latestAt ? timeAgo(latestAt) : null,
    };
  });
  const totalResponses = cards.reduce((sum, c) => sum + c.responseCount, 0);

  return (
    <div className="mx-auto max-w-[90rem]">
      <PageHeader
        eyebrow="Content"
        title="Forms"
        description="Make sign-up and application forms, share the link, and see who responded."
        cta={{ label: "Blank form", href: "/admin/forms/new", icon: <Plus size={16} weight="bold" /> }}
      />

      {/* Start a new form: templates, like the Google Forms home page */}
      <section className="mt-10" aria-labelledby="start-new">
        <h2 id="start-new" className="text-base font-semibold text-navy/60">
          Start a new form
        </h2>
        <ul className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
          {FORM_TEMPLATES.map((t) => {
            const blank = t.id === "blank";
            return (
              <li key={t.id}>
                <Link href={blank ? "/admin/forms/new" : `/admin/forms/new?template=${t.id}`} className="group block">
                  <div
                    className={`relative h-32 overflow-hidden rounded-2xl ring-1 transition-shadow group-hover:shadow-lg group-hover:shadow-navy/10 ${
                      blank ? "bg-white ring-navy/10" : "ring-transparent"
                    }`}
                    style={blank ? undefined : { backgroundColor: `${t.accentColor}1f` }}
                  >
                    {blank ? (
                      <span className="absolute inset-0 flex items-center justify-center">
                        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-navy text-white transition-transform group-hover:scale-110">
                          <Plus size={26} weight="bold" />
                        </span>
                      </span>
                    ) : (
                      <div className="absolute inset-x-6 top-5 bottom-0 rounded-t-lg bg-white shadow-sm transition-transform group-hover:-translate-y-1">
                        <div className="h-1.5 rounded-t-lg" style={{ backgroundColor: t.accentColor }} />
                        <div className="space-y-1.5 p-3">
                          <p className="truncate font-display text-xs font-bold text-navy">{t.title}</p>
                          {t.fields.slice(0, 3).map((_, i) => (
                            <div key={i} className="h-3.5 w-full rounded border border-navy/10" />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <p className="mt-3 text-base font-semibold text-navy">{t.label}</p>
                  <p className="text-sm text-navy/50">
                    {blank ? t.description : `${t.fields.length} ready-made questions`}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mt-12" aria-labelledby="your-forms">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="your-forms" className="font-display text-2xl font-bold text-navy">
            Your forms
          </h2>
          {cards.length > 0 && (
            <p className="text-sm text-navy/50">
              {cards.length} form{cards.length === 1 ? "" : "s"} · {totalResponses} response
              {totalResponses === 1 ? "" : "s"} in total
            </p>
          )}
        </div>

        {cards.length > 0 ? (
          <ul className="mt-5 grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
            {cards.map((card) => (
              <li key={card.id} className="flex">
                <FormCard form={card} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-5 rounded-3xl bg-white px-6 py-16 text-center ring-1 ring-navy/10">
            <ClipboardText size={40} className="mx-auto text-navy/25" />
            <p className="mt-4 text-lg font-semibold text-navy">No forms yet</p>
            <p className="mt-1 text-base text-navy/55">Pick a template above to make your first form in a minute.</p>
          </div>
        )}
      </section>
    </div>
  );
}

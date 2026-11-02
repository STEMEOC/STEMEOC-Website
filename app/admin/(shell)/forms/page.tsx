import type { Metadata } from "next";
import Link from "next/link";
import { ClipboardText } from "@phosphor-icons/react/dist/ssr";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/admin/PageHeader";
import { FormCard, type FormCardData } from "@/components/admin/FormCard";
import { FORM_TEMPLATES } from "@/lib/formTemplates";

export const metadata: Metadata = { title: "Opportunities" };

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
        title="Opportunities"
        description="Post events, workshops, volunteer roles and internships. Each one shows on the Current Opportunities page, with an application form if it needs one."
      />

      {/* Start a new opportunity: one card per type */}
      <section className="mt-10" aria-labelledby="start-new">
        <h2 id="start-new" className="text-base font-semibold text-navy/60">
          Start a new opportunity
        </h2>
        <ul className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
          {FORM_TEMPLATES.map((t) => (
            <li key={t.id}>
              <Link href={`/admin/forms/new?template=${t.id}`} className="group block">
                <div
                  className="relative h-32 overflow-hidden rounded-2xl transition-shadow group-hover:shadow-lg group-hover:shadow-navy/10"
                  style={{ backgroundColor: `${t.accentColor}1f` }}
                >
                  <div className="absolute inset-x-6 top-5 bottom-0 rounded-t-lg bg-white shadow-sm transition-transform group-hover:-translate-y-1">
                    <div className="h-1.5 rounded-t-lg" style={{ backgroundColor: t.accentColor }} />
                    <div className="space-y-1.5 p-3">
                      <p className="truncate font-display text-xs font-bold text-navy">{t.label}</p>
                      {t.fields.length > 0 ? (
                        t.fields.slice(0, 3).map((_, i) => <div key={i} className="h-3.5 w-full rounded border border-navy/10" />)
                      ) : (
                        <p className="text-xs text-navy/50">{t.description}</p>
                      )}
                    </div>
                  </div>
                </div>
                <p className="mt-3 text-base font-semibold text-navy">{t.label}</p>
                <p className="text-sm text-navy/50">
                  {t.fields.length > 0 ? `Form with ${t.fields.length} ready-made questions` : "No form, details only"}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12" aria-labelledby="your-forms">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="your-forms" className="font-display text-2xl font-bold text-navy">
            Your opportunities
          </h2>
          {cards.length > 0 && (
            <p className="text-sm text-navy/50">
              {cards.length} opportunit{cards.length === 1 ? "y" : "ies"} · {totalResponses} application
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
            <p className="mt-4 text-lg font-semibold text-navy">No opportunities yet</p>
            <p className="mt-1 text-base text-navy/55">Pick a type above to post your first one. It shows on the Current Opportunities page right away.</p>
          </div>
        )}
      </section>
    </div>
  );
}

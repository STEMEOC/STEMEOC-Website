import type { Metadata } from "next";
import { DownloadSimple } from "@phosphor-icons/react/dist/ssr";
import { getDictionary } from "@/lib/i18n";
import { POLICY_META, POLICY_SECTIONS, type PolicyBlock } from "@/lib/child-policy";
import { PageTransition } from "@/components/motion/PageTransition";
import { Reveal } from "@/components/motion/Reveal";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getDictionary();
  return { title: dict.about.childPolicy };
}

// blocks
function Block({ block }: { block: PolicyBlock }) {
  if ("p" in block) return <p className="mt-4 leading-relaxed text-ink/85 md:text-lg">{block.p}</p>;
  if ("list" in block)
    return (
      <ol className="mt-4 list-[lower-alpha] space-y-2 pl-6 leading-relaxed text-ink/85 marker:font-bold marker:text-navy md:text-lg">
        {block.list.map((item) => (
          <li key={item} className="pl-1">{item}</li>
        ))}
      </ol>
    );
  return (
    <dl className="mt-4 divide-y divide-navy/10 border-y border-navy/10">
      {block.defs.map(([term, def]) => (
        <div key={term} className="grid gap-1 py-4 md:grid-cols-[14rem_1fr] md:gap-6">
          <dt className="font-body font-bold text-navy">{term}</dt>
          <dd className="leading-relaxed text-ink/85">{def}</dd>
        </div>
      ))}
    </dl>
  );
}

export default async function ChildProtectionPolicyPage() {
  const { dict } = await getDictionary();
  const meta = [
    ["Policy code", POLICY_META.code],
    ["Effective", POLICY_META.effective],
    ["Next review", POLICY_META.review],
    ["Approved by", POLICY_META.approvedBy],
    ["Signed by", POLICY_META.signedBy],
  ];

  return (
    <PageTransition>
      {/* Hero */}
      <section className="-mt-(--header-h) bg-navy pt-(--header-h) text-white">
        <div className="container-site py-14 md:py-20">
          <Reveal>
            <h1 className="max-w-3xl font-display text-4xl font-bold md:text-6xl">{dict.about.childPolicy}</h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/80 md:text-lg">
              STEMEOC has zero tolerance for abuse or exploitation of any kind. Every child has the right to be protected, and every adult shares the responsibility.
            </p>
            <a
              href={POLICY_META.pdf}
              download
              className="mt-8 inline-flex items-center gap-3 rounded-full bg-red px-7 py-3 font-display text-base font-bold text-white press hover:-translate-y-0.5"
            >
              <DownloadSimple size={20} weight="bold" />
              Download full policy (PDF)
            </a>
          </Reveal>
          <dl className="mt-12 grid gap-px border border-white/15 bg-white/15 sm:grid-cols-2 lg:grid-cols-5">
            {meta.map(([label, value]) => (
              <div key={label} className="bg-navy p-5">
                <dt className="text-xs font-bold uppercase tracking-wider text-[#f6a623]">{label}</dt>
                <dd className="mt-2 text-sm leading-snug">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Policy */}
      <section className="container-site grid gap-12 py-14 md:py-20 lg:grid-cols-[16rem_1fr] lg:gap-16">
        <nav aria-label="Contents" className="lg:sticky lg:top-32 lg:self-start">
          <p className="font-display text-sm font-bold uppercase tracking-wider text-navy">Contents</p>
          <ul className="mt-4 space-y-1 border-l-2 border-navy/15 text-sm">
            {POLICY_SECTIONS.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className={`-ml-0.5 block border-l-2 border-transparent py-1 hover:border-navy hover:text-navy ${s.sub ? "pl-7 text-ink/70" : "pl-4 font-bold"}`}
                >
                  {s.num} {s.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <article className="max-w-3xl">
          {POLICY_SECTIONS.map((s) => (
            <section key={s.id} id={s.id} className={`scroll-mt-32 ${s.sub ? "mt-10" : "mt-16 first:mt-0"}`}>
              {s.sub ? (
                <h3 className="font-display text-xl font-bold text-navy md:text-2xl">
                  <span className="mr-2 text-red">{s.num}</span>
                  {s.title}
                </h3>
              ) : (
                <h2 className="border-b-2 border-navy pb-3 font-display text-2xl font-bold text-navy md:text-4xl">
                  <span className="mr-3 text-red">{s.num}.</span>
                  {s.title}
                </h2>
              )}
              {s.blocks.map((b, i) => (
                <Block key={i} block={b} />
              ))}
            </section>
          ))}

          <a
            href={POLICY_META.pdf}
            download
            className="mt-14 inline-flex items-center gap-3 rounded-full bg-navy px-7 py-3 font-display text-base font-bold text-white press hover:-translate-y-0.5"
          >
            <DownloadSimple size={20} weight="bold" />
            Download full policy (PDF)
          </a>
        </article>
      </section>
    </PageTransition>
  );
}

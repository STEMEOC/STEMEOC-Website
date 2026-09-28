import Link from "next/link";

/**
 * Navy call-to-action band with rounded top corners. Place it last on a page,
 * directly above the footer, so the two read as one navy block.
 */
export function QuestionsBand({
  title,
  body,
  cta,
  href,
}: {
  title: string;
  body: string;
  cta: string;
  href: string;
}) {
  return (
    <section className="rounded-t-[3rem] bg-navy text-white md:rounded-t-[5rem]">
      <div className="container-site flex flex-col items-center pb-4 pt-16 text-center md:pt-24">
        <h2 className="font-display text-3xl font-bold uppercase md:text-4xl">{title}</h2>
        <p className="mt-3 max-w-xl text-sm md:text-lg">{body}</p>
        <Link
          href={href}
          className="mt-8 bg-white px-8 py-2.5 font-display text-lg font-bold text-navy press hover:-translate-y-1 hover:shadow-[0_16px_32px_-14px_rgb(0_0_0/0.7)] md:text-xl"
        >
          {cta}
        </Link>
      </div>
    </section>
  );
}

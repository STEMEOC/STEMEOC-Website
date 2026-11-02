import Link from "next/link";
import { Magnetic } from "@/components/interactive/Magnetic";

/**
 * White call-to-action card that sits half over the navy footer. Place it
 * last on a page, directly above the footer.
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
    <section className="bg-[linear-gradient(to_bottom,transparent_50%,var(--color-navy)_50%)] pt-16 md:pt-24">
      <div className="container-site">
        <div className="mx-auto flex max-w-5xl flex-col items-center rounded-[2rem] bg-white px-6 py-10 text-center text-navy shadow-[0_0_50px_10px_rgb(0_0_0/0.1)] md:rounded-[3rem] md:px-12 md:py-14">
          <h2 className="font-display text-3xl font-bold uppercase md:text-5xl">{title}</h2>
          <p className="mt-3 max-w-2xl text-sm md:text-lg">{body}</p>
          <Magnetic className="mt-8">
            <Link
              href={href}
              className="inline-block rounded-full bg-navy px-8 py-3 font-body text-sm font-bold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue hover:shadow-lg md:text-base"
            >
              {cta}
            </Link>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}

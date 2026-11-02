import type { Metadata } from "next";
import Image from "next/image";
import {
  Envelope,
  FacebookLogo,
  InstagramLogo,
  LinkedinLogo,
  MapPin,
  Phone,
  TelegramLogo,
  YoutubeLogo,
} from "@phosphor-icons/react/dist/ssr";
import { PageTransition } from "@/components/motion/PageTransition";
import { Reveal } from "@/components/motion/Reveal";
import { getDictionary } from "@/lib/i18n";
import { FaqJumpPills, FaqAccordionList } from "@/components/FaqExplorer";
import { FaqContactForm } from "@/components/FaqContactForm";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getDictionary();
  return {
    title: dict.faq.metaTitle,
    description: dict.faq.hero.body,
  };
}

const FAQ_SOCIAL_LINKS = [
  { label: "Facebook", href: "https://www.facebook.com/STEMCambodia", icon: FacebookLogo },
  { label: "Instagram", href: "https://www.instagram.com/stemcambodia", icon: InstagramLogo },
  { label: "Telegram", href: "https://t.me/stemcambodia", icon: TelegramLogo },
  { label: "YouTube", href: "https://www.youtube.com/@StemCambodia", icon: YoutubeLogo },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/stemcambodia", icon: LinkedinLogo },
];

export default async function FaqPage() {
  const { dict } = await getDictionary();
  const f = dict.faq;

  return (
    <PageTransition>
      {/* Hero Section */}
      <section className="relative -mt-(--header-h) overflow-hidden bg-navy pt-(--header-h) text-white">
        <Image
          src="/uploads/faq-banner.png"
          alt="Students and guests on stage at the Cambodia STEM Festival 2026"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Scrim overlay for crisp readability */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgb(5_19_59/0.88)_0%,rgb(5_19_59/0.72)_50%,rgb(5_19_59/0.88)_100%)]" />

        <div className="container-site relative flex min-h-[min(50vw,36rem)] flex-col justify-center pb-36 pt-16 md:pb-48 md:pt-24">
          <Reveal>
            <span className="inline-block rounded-full bg-red px-4 py-1.5 font-body text-xs font-bold uppercase tracking-wider text-white shadow-md md:text-sm">
              {f.hero.badge}
            </span>
            <h1 className="mt-4 max-w-4xl font-display text-4xl font-bold uppercase leading-tight tracking-tight text-white md:text-6xl lg:text-7xl">
              {f.hero.title}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/90 md:text-xl">
              {f.hero.body}
            </p>
          </Reveal>
        </div>

        {/* Slanted white tab at bottom-left holding the 4 quick jump pills */}
        <div className="absolute -bottom-0.5 left-0 w-fit max-w-[96vw] border-none bg-white tab-slant-top [--slant:3.5rem] sm:[--slant:4.5rem] md:[--slant:5.5rem] lg:[--slant:6.5rem]">
          <div className="pb-4 pl-6 pr-16 pt-4 sm:pl-12 sm:pr-22 sm:pt-5 md:pb-5 md:pl-20 md:pr-26 md:pt-6 lg:pl-28 lg:pr-32 xl:pl-36 xl:pr-36">
            <FaqJumpPills />
          </div>
        </div>
      </section>

      {/* Main FAQ Accordion Lists grouped by category */}
      <section className="container-site pb-16 pt-12 md:pb-24 md:pt-16">
        <FaqAccordionList sections={f.sections} />

        {/* Contact Section: LEAVE US A MESSAGE! */}
        <div className="mt-20 pt-8 md:mt-28 md:pt-12">
          <div className="grid items-start gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14 xl:gap-16">
            {/* Left Card: Office info & social links */}
            <Reveal>
              <div className="rounded-[2.25rem] bg-[#f5f7fa] p-8 text-navy shadow-sm sm:p-10">
                <h3 className="font-display text-2xl font-bold uppercase tracking-tight text-navy md:text-3xl">
                  {f.contact.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-navy/70 md:text-sm">
                  {f.contact.body}
                </p>

                <ul className="mt-8 space-y-6">
                  {/* Head Office */}
                  <li className="flex items-start gap-4">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-navy text-white shadow-xs">
                      <MapPin size={20} weight="fill" />
                    </span>
                    <div>
                      <p className="font-display text-sm font-bold text-navy">{f.contact.office}</p>
                      <p className="mt-1 text-xs leading-relaxed text-navy/70">{f.contact.officeValue}</p>
                    </div>
                  </li>

                  {/* Email Us */}
                  <li className="flex items-start gap-4">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-navy text-white shadow-xs">
                      <Envelope size={20} weight="fill" />
                    </span>
                    <div>
                      <p className="font-display text-sm font-bold text-navy">{f.contact.email}</p>
                      <a
                        href="mailto:info@stemcambodia.ngo"
                        className="link-underline mt-1 inline-block text-xs font-semibold text-navy/80 hover:text-blue"
                      >
                        info@stemcambodia.ngo
                      </a>
                    </div>
                  </li>

                  {/* Call Us */}
                  <li className="flex items-start gap-4">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-navy text-white shadow-xs">
                      <Phone size={20} weight="fill" />
                    </span>
                    <div>
                      <p className="font-display text-sm font-bold text-navy">{f.contact.phone}</p>
                      <a
                        href="tel:+85569626898"
                        className="link-underline mt-1 inline-block text-xs font-semibold text-navy/80 hover:text-blue"
                      >
                        (+855) 69 626 898
                      </a>
                    </div>
                  </li>
                </ul>

                {/* Follow us Online */}
                <div className="mt-8 border-t border-navy/10 pt-6">
                  <p className="font-display text-sm font-bold text-navy">{f.contact.follow}</p>
                  <ul className="mt-3 flex flex-wrap gap-2.5">
                    {FAQ_SOCIAL_LINKS.map(({ label, href, icon: IconComp }) => (
                      <li key={label}>
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={label}
                          className="flex size-9 items-center justify-center rounded-full bg-navy text-white transition-all duration-300 hover:scale-110 hover:bg-blue"
                        >
                          <IconComp size={18} weight="fill" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>

            {/* Right Form: Exact form field grid & send button */}
            <Reveal delay={0.1}>
              <div className="rounded-[2.25rem] bg-white p-2 md:p-4">
                <FaqContactForm labels={f.form} />
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}

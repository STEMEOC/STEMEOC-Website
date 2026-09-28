import type { Metadata } from "next";
import { Envelope, Phone, MapPin, Clock } from "@phosphor-icons/react/dist/ssr";
import { ContactForm } from "@/components/ContactForm";
import { Reveal } from "@/components/motion/Reveal";
import { getDictionary } from "@/lib/i18n";
import { PageTransition } from "@/components/motion/PageTransition";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getDictionary();
  return { title: dict.contact.metaTitle };
}

export default async function ContactPage() {
  const { dict } = await getDictionary();

  const CONTACT_CARDS = [
    {
      label: dict.contact.cards.email,
      value: "info@stemcambodia.ngo",
      href: "mailto:info@stemcambodia.ngo",
      color: "var(--color-blue)",
      icon: Envelope,
    },
    {
      label: dict.contact.cards.phone,
      value: "(+855) 69 626 898",
      href: "tel:+85569626898",
      color: "var(--color-red)",
      icon: Phone,
    },
    {
      label: dict.contact.cards.location,
      value: dict.contact.cards.locationValue,
      href: undefined,
      color: "var(--color-green)",
      icon: MapPin,
    },
    {
      label: dict.contact.cards.officeHours,
      value: dict.contact.cards.officeHoursValue,
      href: undefined,
      color: "var(--color-orange)",
      icon: Clock,
    },
  ];

  return (
    <PageTransition>
      {/* Hero: dark navy backdrop matching the rest of the site */}
      <section className="relative overflow-hidden bg-[#0b1f3d]">
        <div className="pointer-events-none absolute -right-1/4 top-[-45%] h-[140%] w-[150%] rotate-[-6deg] rounded-[45%] bg-[#123162]" />
        <div className="pointer-events-none absolute -right-1/3 top-[-55%] h-[140%] w-[160%] rotate-[-4deg] rounded-[45%] bg-[#0e2750]" />

        <div className="relative mx-auto max-w-6xl px-6 py-20 md:py-28">
          <Reveal>
            <p className="font-mono-label text-xs uppercase text-white/50">{dict.contact.hero.eyebrow}</p>
            <h1 className="mt-4 max-w-2xl font-display text-4xl font-semibold tracking-tight text-white md:text-5xl">
              {dict.contact.hero.title}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/70">
              {dict.contact.hero.body}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Contact cards */}
      <section className="bg-paper">
        <div className="relative z-10 mx-auto -mt-12 max-w-6xl px-6">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {CONTACT_CARDS.map((card, i) => {
              const Icon = card.icon;
              const Wrapper = card.href ? "a" : "div";
              return (
                <Reveal key={card.label} scroll={(i % 3) * 0.16} className="h-full">
                  <Wrapper
                    {...(card.href ? { href: card.href } : {})}
                    className="group flex h-full flex-col rounded-[1.5rem] bg-paper p-6 shadow-lg ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
                  >
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-xl"
                      style={{ backgroundColor: `color-mix(in srgb, ${card.color} 12%, transparent)` }}
                    >
                      <Icon size={22} weight="bold" style={{ color: card.color }} />
                    </div>
                    <p className="font-mono-label mt-5 text-xs uppercase text-ink/40">{card.label}</p>
                    <p className="mt-1 font-semibold text-ink">{card.value}</p>
                  </Wrapper>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Form + reassurance copy */}
      <section className="bg-paper py-20">
        <div className="mx-auto grid max-w-6xl gap-16 px-6 md:grid-cols-[1fr_1.2fr]">
          <Reveal>
            <p className="font-mono-label text-xs uppercase text-ink/40">{dict.contact.form.eyebrow}</p>
            <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight md:text-3xl">
              {dict.contact.form.title}
            </h2>
            <p className="mt-5 leading-relaxed text-ink/70">
              {dict.contact.form.body}
            </p>
            <div className="mt-8 flex gap-3">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: "var(--color-blue)" }} />
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: "var(--color-red)" }} />
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: "var(--color-green)" }} />
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: "var(--color-orange)" }} />
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="rounded-[2rem] bg-paper p-8 shadow-xl ring-1 ring-black/5 md:p-10">
              <ContactForm
                labels={{
                  name: dict.contact.form.name,
                  email: dict.contact.form.email,
                  message: dict.contact.form.message,
                  sending: dict.common.sending,
                  sendMessage: dict.common.sendMessage,
                }}
              />
            </div>
          </Reveal>
        </div>
      </section>
    </PageTransition>
  );
}

import Link from "next/link";
import Image from "next/image";
import { getDictionary } from "@/lib/i18n";

export async function Header() {
  const { dict } = await getDictionary();

  const NAV_LINKS = [
    { href: "/about", label: dict.header.nav.about, color: "var(--color-blue)" },
    { href: "/projects", label: dict.header.nav.projects, color: "var(--color-red)" },
    { href: "/news", label: dict.header.nav.news, color: "var(--color-green)" },
    { href: "/podcast", label: dict.header.nav.podcast, color: "var(--color-orange)" },
    { href: "/apply", label: dict.header.nav.apply, color: "var(--color-red)" },
    {
      href: "https://stemeoc-games.vercel.app/homepage",
      label: dict.header.nav.games,
      color: "var(--color-blue)",
      external: true,
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-paper" style={{ viewTransitionName: "site-header" }}>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center">
          <Image
            src="/STEM-logo-full.png"
            alt="STEM Education Organization for Cambodia"
            width={980}
            height={310}
            className="h-12 w-auto"
            priority
          />
        </Link>

        <div className="flex items-center gap-6">
          <nav className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                {...("external" in link && link.external ? { target: "_blank", rel: "noreferrer" } : {})}
                className="group flex items-center gap-2 text-sm font-bold text-ink transition-colors"
              >
                <span
                  className="h-2 w-2 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
                  style={{ backgroundColor: link.color }}
                />
                {link.label}
              </Link>
            ))}
          </nav>

          <Link
            href="/contact"
            className="rounded-full bg-orange px-5 py-2.5 text-sm font-bold text-paper transition-colors hover:bg-orange/85"
          >
            {dict.header.cta}
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-4">
        {["var(--color-blue)", "var(--color-red)", "var(--color-green)", "var(--color-orange)"].map((c) => (
          <div key={c} className="h-1.5" style={{ backgroundColor: c }} />
        ))}
      </div>
    </header>
  );
}

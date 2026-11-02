import Link from "next/link";
import Image from "next/image";
import { getDictionary } from "@/lib/i18n";
import { HeaderNav } from "@/components/HeaderNav";
import { HeaderPill } from "@/components/HeaderPill";

/**
 * Floating white bar. Pages whose hero should run under it pull the hero up
 * with `-mt-(--header-h)`.
 */
export async function Header() {
  const { dict, locale } = await getDictionary();

  return (
    <header className="sticky top-0 z-40 h-(--header-h) pt-3 md:pt-4" style={{ viewTransitionName: "site-header" }}>
      <div className="container-site relative max-w-[1920px]">
        <HeaderPill className="flex h-16 items-center justify-between gap-6 rounded-full bg-white pl-3 pr-4 text-navy shadow-[0_8px_32px_-8px_rgb(5_19_59/0.25)] md:h-20 md:pl-4 md:pr-6">
          <Link href="/" className="shrink-0" aria-label="STEM Education Organization for Cambodia, home">
            <Image
              src="/brand/logo-mark.png"
              alt=""
              width={400}
              height={395}
              className="h-11 w-auto md:h-14"
              priority
            />
          </Link>

          <HeaderNav
            locale={locale}
            links={[
              { href: "/about", label: dict.header.nav.aboutUs },
              { href: "/projects", label: dict.header.nav.whatWeDo },
              { href: "/get-involved", label: dict.header.nav.getInvolved },
              { href: "/apply", label: dict.header.nav.currentOpportunities },
              { href: "/news", label: dict.header.nav.news },
              { href: "/podcast", label: dict.header.nav.mediaLibrary },
            ]}
            labels={{
              search: dict.header.search,
              searchPlaceholder: dict.header.searchPlaceholder,
              closeSearch: dict.header.closeSearch,
              seeAll: dict.search.seeAll,
              searching: dict.search.searching,
              noSuggestions: dict.search.noSuggestions,
              types: dict.search.types,
              language: dict.header.language,
              openMenu: dict.header.openMenu,
              closeMenu: dict.header.closeMenu,
            }}
          />
        </HeaderPill>
      </div>
    </header>
  );
}

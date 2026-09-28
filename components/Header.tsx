import Link from "next/link";
import Image from "next/image";
import { getDictionary } from "@/lib/i18n";
import { HeaderNav } from "@/components/HeaderNav";

const GAMES_URL = "https://stemeoc-games.vercel.app/homepage";

export async function Header() {
  const { dict, locale } = await getDictionary();

  return (
    <header className="sticky top-0 z-40 bg-navy text-white" style={{ viewTransitionName: "site-header" }}>
      <div className="container-site relative">
        <div className="flex h-20 items-center justify-between gap-6 border-b border-white/80 md:h-24">
          <Link href="/" className="shrink-0" aria-label="STEM Education Organization for Cambodia, home">
            <Image
              src="/brand/logo-mark.png"
              alt=""
              width={400}
              height={395}
              className="h-12 w-auto md:h-15"
              priority
            />
          </Link>

          <HeaderNav
            locale={locale}
            links={[
              { href: "/about", label: dict.header.nav.aboutUs },
              { href: "/projects", label: dict.header.nav.projects },
              { href: "/hall-of-fame", label: dict.header.nav.hallOfFame },
              { href: "/news", label: dict.header.nav.news },
              { href: "/podcast", label: dict.header.nav.podcast },
              { href: GAMES_URL, label: dict.header.nav.games, external: true },
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
        </div>
      </div>
    </header>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { LoginForm } from "@/components/LoginForm";

export const metadata: Metadata = { title: "Admin Login" };

const PROGRAM_LOGOS = [
  { src: "/brand/festival-logo.png", alt: "Cambodia STEM Festival" },
  { src: "/brand/cro-logo.png", alt: "Cambodia Robotics Olympiad" },
  { src: "/brand/eco-stem-logo.png", alt: "Eco STEM" },
  { src: "/brand/icia-logo.png", alt: "ICIA Award" },
  { src: "/brand/wro-logo.png", alt: "World Robot Olympiad" },
];

const LOGO_COLORS = ["bg-green", "bg-orange", "bg-red", "bg-blue"];

/**
 * Split sign-in screen in the public site's language: a navy brand panel
 * with the slanted edge on the left (a band on top on phones), and the form
 * on white. Sizes run a step larger than the public pages, since the root
 * font size drops to 13px on laptops and a lone form looked lost.
 */
export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white lg:flex-row">
      <aside className="relative isolate flex flex-col overflow-hidden bg-navy px-6 pb-12 pt-8 text-white tab-slant-bottom [--slant:2.5rem] sm:px-10 lg:w-[52%] lg:px-20 lg:py-16 lg:[--slant:6rem]">
        <Image
          src="/brand/logo-mark.png"
          alt=""
          width={400}
          height={395}
          className="pointer-events-none absolute -bottom-24 -right-10 -z-10 hidden w-[34rem] opacity-[0.06] lg:block"
        />

        <Link
          href="/"
          className="inline-flex w-fit items-center gap-2 rounded-full border border-white/30 px-5 py-2.5 text-base font-medium text-white/85 transition-colors hover:border-white hover:bg-white hover:text-navy"
        >
          <span aria-hidden>←</span> Back to website
        </Link>

        <div className="mt-10 lg:my-auto lg:py-12">
          <Image
            src="/brand/stem-cambodia-logo.png"
            alt="STEM Education Organization for Cambodia"
            width={1104}
            height={440}
            className="h-20 w-auto lg:h-32"
            priority
          />

          <p className="font-mono-label mt-10 text-sm uppercase tracking-[0.2em] text-orange lg:mt-14 lg:text-base">
            Admin
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold uppercase leading-[1.05] lg:text-7xl">
            Content
            <br />
            dashboard
          </h1>
          <div className="mt-6 flex gap-2" aria-hidden>
            {LOGO_COLORS.map((c) => (
              <span key={c} className={`h-2 w-14 rounded-full ${c}`} />
            ))}
          </div>
          <p className="mt-6 hidden max-w-lg text-lg leading-relaxed text-white/75 lg:block">
            Manage programs, news, team profiles, podcast episodes and forms for the STEMEOC website.
          </p>
        </div>

        <ul className="mt-10 hidden gap-3 lg:flex" aria-label="Programs">
          {PROGRAM_LOGOS.map((logo) => (
            <li key={logo.src} className="relative h-20 w-28 rounded-2xl bg-white">
              <Image src={logo.src} alt={logo.alt} fill sizes="112px" className="object-contain p-3" />
            </li>
          ))}
        </ul>
      </aside>

      <main className="flex flex-1 flex-col px-6 py-12 sm:px-10 lg:px-16 lg:py-16">
        <div className="m-auto w-full max-w-[34rem]">
          <h2 className="font-display text-4xl font-bold text-navy lg:text-6xl">Welcome back</h2>
          <p className="mt-3 text-lg text-navy/65">Sign in with your admin email and password.</p>
          <div className="mt-10 lg:mt-12">
            <LoginForm />
          </div>
          <p className="mt-10 border-t border-navy/10 pt-6 text-base text-navy/60">
            Trouble signing in? Ask a STEMEOC site administrator to reset your access.
          </p>
        </div>
        <p className="mt-12 text-center text-sm text-navy/45">
          © {new Date().getFullYear()} STEM Education Organization for Cambodia
        </p>
      </main>
    </div>
  );
}

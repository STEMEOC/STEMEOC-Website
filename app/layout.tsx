import type { Metadata } from "next";
import { Maven_Pro, Montserrat, JetBrains_Mono, Kantumruy_Pro } from "next/font/google";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { ViewTransitionGuard } from "@/components/motion/ViewTransitionGuard";
import { getLocale } from "@/lib/i18n/locale";
import "./globals.css";

// All four are variable fonts, loaded without a fixed weight list: with one,
// Google Fonts can hand back "/l/font?kit=...&skey=..." URLs, which
// Turbopack's next/font loader can't resolve ("queries have exactly one entry").
const displayFont = Maven_Pro({
  variable: "--font-display",
  subsets: ["latin"],
});

const bodyFont = Montserrat({
  variable: "--font-body",
  subsets: ["latin"],
});

const monoFont = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const khmerFont = Kantumruy_Pro({
  variable: "--font-khmer",
  subsets: ["khmer", "latin"],
});

export const metadata: Metadata = {
  title: {
    default: "STEMEOC, STEM Education Organization of Cambodia",
    template: "%s · STEMEOC",
  },
  description:
    "STEMEOC brings hands-on science, technology, engineering, and math education to students across Cambodia through festivals, robotics competitions, and school partnerships.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const locale = await getLocale();
  return (
    <html
      lang={locale}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${displayFont.variable} ${bodyFont.variable} ${monoFont.variable} ${khmerFont.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-navy">
        <ViewTransitionGuard />
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}

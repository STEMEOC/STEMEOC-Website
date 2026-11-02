import type { Metadata } from "next";
import { PointsWave } from "@/components/interactive/PointsWave";
import { NetworkLines } from "@/components/interactive/NetworkLines";
import { BirdFlock } from "@/components/interactive/BirdFlock";
import { HoverLines } from "@/components/interactive/HoverLines";

// shortcut: temporary page for picking a hero background, delete once one is chosen
export const metadata: Metadata = { title: "Hero lab", robots: { index: false } };

const OPTIONS = [
  { name: "1. Points waves", Background: PointsWave },
  { name: "2. Network", Background: NetworkLines },
  { name: "3. Bird flock", Background: BirdFlock },
  { name: "4. Hover lines", Background: HoverLines },
];

export default function HeroLabPage() {
  return OPTIONS.map(({ name, Background }, i) => (
    <section key={name} className={`relative border-b-4 border-white bg-navy text-white ${i === 0 ? "-mt-(--header-h) pt-(--header-h)" : ""}`}>
      <Background />
      <div className="container-site relative flex min-h-[32rem] flex-col justify-center py-16">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-white/70">{name}</p>
        <h1 className="mt-4 max-w-3xl font-display text-3xl font-bold uppercase leading-tight md:text-5xl xl:text-6xl">
          Shaping Cambodia’s Future Through STEM Education
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-relaxed md:text-lg">
          STEMEOC provides educational programs and opportunities that equip students with the skills needed to make a
          lasting impact in Cambodia’s STEM sectors.
        </p>
      </div>
    </section>
  ));
}

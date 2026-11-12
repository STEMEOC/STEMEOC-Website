import type { Stat } from "@/lib/program-pages";
import { StatCounter } from "@/components/motion/StatCounter";

// Stat label colors, in Figma order.
const STAT_COLORS = ["bg-red", "bg-green", "bg-orange", "bg-blue"];

/** Row of bordered stat boxes, each with a colored label pill. */
export function StatBoxes({ stats, className = "" }: { stats: Stat[]; className?: string }) {
  if (stats.length === 0) return null;
  return (
    <dl className={`grid auto-cols-[minmax(8rem,1fr)] grid-flow-col gap-3 overflow-x-auto md:gap-4 ${className}`}>
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          className="flex flex-col-reverse items-center justify-end rounded-xl border border-navy/15 bg-white px-[25px] pb-5 pt-[30px] text-center text-navy"
        >
          <dt className={`mt-2 rounded-full px-3 py-0.5 text-xs font-semibold text-white ${STAT_COLORS[i % STAT_COLORS.length]}`}>
            {stat.label}
          </dt>
          <dd className="font-body text-3xl font-extrabold md:text-4xl">
            <StatCounter value={stat.value} />
          </dd>
        </div>
      ))}
    </dl>
  );
}

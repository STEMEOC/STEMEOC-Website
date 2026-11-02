"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowUpRight,
  CalendarBlank,
  MapPin,
  MagnifyingGlass,
} from "@phosphor-icons/react";

export type OpportunityCategory = "all" | "event" | "workshop" | "volunteer" | "internship";

export type Opportunity = {
  id: string;
  category: "event" | "workshop" | "volunteer" | "internship";
  categoryLabel: string;
  dotColor: string;
  title: string;
  description: string;
  location: string;
  deadline: string;
  href: string;
  hasForm: boolean;
};

export type DbFormItem = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  category?: string;
  location?: string;
  deadline?: string | null;
  accentColor?: string;
  _count?: { fields: number };
};

const CATEGORIES: { id: OpportunityCategory; label: string }[] = [
  { id: "all", label: "All" },
  { id: "event", label: "Event" },
  { id: "workshop", label: "Workshop" },
  { id: "volunteer", label: "Volunteer" },
  { id: "internship", label: "Internship" },
];

const CATEGORY_MAP: Record<
  string,
  { label: string; dotColor: string; category: "event" | "workshop" | "volunteer" | "internship" }
> = {
  event: { label: "Event", dotColor: "bg-red", category: "event" },
  workshop: { label: "Workshop", dotColor: "bg-green", category: "workshop" },
  volunteer: { label: "Volunteer", dotColor: "bg-orange", category: "volunteer" },
  community: { label: "Volunteer", dotColor: "bg-orange", category: "volunteer" },
  internship: { label: "Internship", dotColor: "bg-blue", category: "internship" },
};

function formatDeadline(raw?: string | null): string {
  if (!raw || !raw.trim()) return "Deadline: Rolling";
  const trimmed = raw.trim();
  if (trimmed.toLowerCase().startsWith("deadline")) return trimmed;
  return `Deadline: ${trimmed}`;
}

export function OpportunityExplorer({
  dbForms = [],
}: {
  dbForms?: DbFormItem[];
}) {
  const [activeCategory, setActiveCategory] = useState<OpportunityCategory>("all");

  const opportunities: Opportunity[] = useMemo(() => {
    return dbForms.map((form) => {
      const catKey = (form.category || "volunteer").toLowerCase();
      const meta = CATEGORY_MAP[catKey] || {
        label: form.category ? form.category.charAt(0).toUpperCase() + form.category.slice(1) : "Volunteer",
        dotColor: "bg-orange",
        category: "volunteer" as const,
      };

      return {
        id: form.id,
        category: meta.category,
        categoryLabel: meta.label,
        dotColor: meta.dotColor,
        title: form.title,
        description:
          form.description ||
          "Join our mission to bring hands-on STEM education and opportunities to students and educators across Cambodia.",
        location: form.location?.trim() ?? "",
        deadline: formatDeadline(form.deadline),
        href: `/apply/${form.slug}`,
        hasForm: (form._count?.fields ?? 1) > 0,
      };
    });
  }, [dbForms]);

  const filtered = useMemo(() => {
    if (activeCategory === "all") return opportunities;
    return opportunities.filter((o) => o.category === activeCategory);
  }, [opportunities, activeCategory]);

  return (
    <div>
      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          const count =
            cat.id === "all"
              ? opportunities.length
              : opportunities.filter((o) => o.category === cat.id).length;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs font-bold transition-all duration-300 sm:px-6 sm:py-2.5 sm:text-sm ${
                isActive
                  ? "bg-navy text-white shadow-md ring-2 ring-navy/20"
                  : "border border-navy/15 bg-white text-navy hover:border-navy hover:shadow-xs"
              }`}
            >
              <span>{cat.label}</span>
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                  isActive ? "bg-white/20 text-white" : "bg-navy/5 text-navy/70"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Grid of Opportunity Cards or Empty State */}
      {filtered.length === 0 ? (
        <div className="mx-auto mt-12 flex max-w-md flex-col items-center justify-center rounded-3xl border border-dashed border-navy/20 bg-white p-10 text-center shadow-xs">
          <span className="flex size-14 items-center justify-center rounded-full bg-navy/5 text-navy">
            <MagnifyingGlass size={26} />
          </span>
          <h3 className="mt-4 font-display text-xl font-bold text-navy">
            {opportunities.length === 0 ? "No open opportunities yet" : "No opportunities found"}
          </h3>
          <p className="mt-2 text-xs leading-relaxed text-navy/65 sm:text-sm">
            {opportunities.length === 0
              ? "We don't have any open applications right now. Check back soon for our next events and programs."
              : "There are currently no open applications in this category. Please check other categories or browse all open opportunities."}
          </p>
          {opportunities.length > 0 && (
            <button
              type="button"
              onClick={() => setActiveCategory("all")}
              className="mt-6 rounded-full bg-navy px-6 py-2.5 text-xs font-bold text-white transition hover:bg-blue-deep"
            >
              Show All Opportunities
            </button>
          )}
        </div>
      ) : (
        <motion.div
          layout
          className="mt-10 grid grid-cols-1 gap-6 sm:mt-12 md:grid-cols-2 md:gap-7 lg:gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((opp, index) => (
              <motion.div
                layout
                key={opp.id}
                initial={{ opacity: 0, scale: 0.96, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 12 }}
                transition={{
                  duration: 0.28,
                  delay: index * 0.03,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="group flex flex-col justify-between rounded-[1.75rem] border border-navy/10 bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-navy/25 hover:shadow-md sm:p-7 md:p-8"
              >
                <div>
                  {/* Category Dot + Name */}
                  <div className="flex items-center gap-2 text-xs font-bold capitalize text-navy/70 sm:text-sm">
                    <span className={`size-2.5 rounded-full ${opp.dotColor}`} />
                    <span>{opp.categoryLabel}</span>
                  </div>

                  {/* Opportunity Title */}
                  <h3 className="mt-3 font-display text-lg font-bold leading-snug text-navy sm:text-xl lg:text-2xl">
                    {opp.title}
                  </h3>

                  {/* Description */}
                  <p className="mt-2 text-xs leading-relaxed text-navy/70 sm:text-sm">
                    {opp.description}
                  </p>
                </div>

                {/* Bottom Meta Row: Location, Deadline, and Apply Button */}
                <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-navy/5 pt-4">
                  <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-navy/70 sm:text-sm">
                    {/* Location */}
                    {opp.location && (
                      <span className="inline-flex items-center gap-1.5 text-navy/80">
                        <MapPin size={16} weight="fill" className="text-green" />
                        <span>{opp.location}</span>
                      </span>
                    )}

                    {/* Deadline */}
                    <span className="inline-flex items-center gap-1.5 text-navy/80">
                      <CalendarBlank size={16} weight="fill" className="text-red" />
                      <span>{opp.deadline}</span>
                    </span>
                  </div>

                  {/* Apply Button */}
                  <Link
                    href={opp.href}
                    className="inline-flex items-center gap-1.5 rounded-full bg-blue px-4 py-1.5 text-xs font-bold text-white shadow-xs transition-all duration-300 hover:bg-blue-deep hover:shadow-md active:scale-95 sm:px-5 sm:py-2 sm:text-sm"
                  >
                    <span>{opp.hasForm ? "Apply" : "Details"}</span>
                    <ArrowUpRight size={14} weight="bold" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}

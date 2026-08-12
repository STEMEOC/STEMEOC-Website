export function StatusPill({ active, onLabel, offLabel }: { active: boolean; onLabel: string; offLabel: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border-2 px-3 py-1 text-xs font-bold ${
        active ? "border-green/25 bg-green/15 text-green" : "border-ink/10 bg-ink/5 text-ink/50"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${active ? "bg-green" : "bg-ink/30"}`} />
      {active ? onLabel : offLabel}
    </span>
  );
}

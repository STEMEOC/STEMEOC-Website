// Shown instantly when switching admin pages while the next page's data loads,
// so clicks never feel frozen (the database round trip is ~250ms each way).
export default function AdminLoading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4" role="status" aria-live="polite">
      <div className="flex gap-2">
        {["bg-blue", "bg-red", "bg-green", "bg-orange"].map((color, i) => (
          <span
            key={color}
            className={`${color} size-3 animate-bounce rounded-full motion-reduce:animate-none`}
            style={{ animationDelay: `${i * 120}ms` }}
          />
        ))}
      </div>
      <span className="text-sm font-medium text-navy/50">Loading…</span>
    </div>
  );
}

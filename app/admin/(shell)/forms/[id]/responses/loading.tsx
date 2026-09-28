// Skeleton in the shape of the responses page, so it appears the moment a
// form is clicked and the real content drops into the same places.
function Bar({ className }: { className: string }) {
  return <div className={`rounded-full bg-ink/10 ${className}`} />;
}

export default function ResponsesLoading() {
  return (
    <div role="status" aria-live="polite" aria-label="Loading responses">
      <div className="mx-auto mb-6 flex max-w-3xl justify-between">
        <Bar className="h-3 w-20" />
        <Bar className="h-3 w-28" />
      </div>

      <div className="mx-auto max-w-3xl space-y-4 animate-pulse motion-reduce:animate-none">
        <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
          <div className="h-2.5 bg-blue/40" />
          <div className="flex items-center justify-between px-6 pt-6">
            <div className="space-y-3">
              <Bar className="h-7 w-44" />
              <Bar className="h-3 w-56" />
            </div>
            <div className="h-11 w-32 rounded-2xl bg-ink/10" />
          </div>
          <div className="mx-6 mt-5 flex justify-end border-t border-ink/10 pt-4">
            <Bar className="h-6 w-44" />
          </div>
          <div className="mt-4 flex justify-center gap-10 border-t border-ink/10 py-4">
            <Bar className="h-3 w-20" />
            <Bar className="h-3 w-20" />
            <Bar className="h-3 w-20" />
          </div>
        </section>

        <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
          <Bar className="h-4 w-48" />
          <Bar className="mt-3 h-3 w-24" />
          <div className="mt-6 flex items-center gap-8">
            <div className="size-44 shrink-0 rounded-full bg-ink/10" />
            <div className="flex-1 space-y-4">
              {[0, 1, 2, 3].map((i) => (
                <Bar key={i} className="h-3 w-full" />
              ))}
            </div>
          </div>
        </section>

        {[0, 1].map((i) => (
          <section key={i} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
            <Bar className="h-4 w-56" />
            <Bar className="mt-3 h-3 w-24" />
            <div className="mt-6 space-y-2">
              <div className="h-10 rounded-lg bg-ink/5" />
              <div className="h-10 rounded-lg bg-ink/5" />
            </div>
          </section>
        ))}
      </div>
      <span className="sr-only">Loading responses…</span>
    </div>
  );
}

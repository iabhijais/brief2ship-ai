"use client";

import type { JudgeLensItem } from "@/lib/types";

export default function JudgeLens({ items }: { items: JudgeLensItem[] }) {
  if (items.length === 0) return null;
  return (
    <section>
      <div className="mb-3 flex items-center gap-2">
        <h3 className="text-lg font-semibold text-white">Judge Lens</h3>
        <span className="chip">What judges actually score</span>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it, i) => (
          <div key={i} className="card">
            <p className="font-semibold text-accent-cyan">{it.criterion}</p>
            <div className="mt-3 space-y-3 text-sm">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Why it matters
                </p>
                <p className="mt-1 text-slate-300">{it.whyItMatters}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  How to satisfy
                </p>
                <p className="mt-1 text-slate-300">{it.howToSatisfy}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

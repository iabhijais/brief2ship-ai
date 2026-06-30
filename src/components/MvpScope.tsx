"use client";

import type { MvpScope as MvpScopeType } from "@/lib/types";

export default function MvpScope({ scope }: { scope: MvpScopeType }) {
  return (
    <section>
      <h3 className="mb-3 text-lg font-semibold text-white">MVP Scope</h3>
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="card border-accent-green/20">
          <div className="mb-3 flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-accent-green" />
            <p className="font-semibold text-white">Must build</p>
          </div>
          <ul className="space-y-2">
            {scope.mustBuild.map((f, i) => (
              <li key={i} className="flex gap-2.5 text-sm text-slate-300">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-green" />
                {f}
              </li>
            ))}
          </ul>
        </div>

        <div className="card">
          <div className="mb-3 flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-accent-cyan" />
            <p className="font-semibold text-white">Nice to have</p>
          </div>
          <ul className="space-y-2">
            {scope.niceToHave.map((f, i) => (
              <li key={i} className="flex gap-2.5 text-sm text-slate-300">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-cyan" />
                {f}
              </li>
            ))}
          </ul>
        </div>

        <div className="card border-red-500/20">
          <div className="mb-3 flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
            <p className="font-semibold text-white">Cut list</p>
          </div>
          <ul className="space-y-3">
            {scope.cutList.map((c, i) => (
              <li key={i} className="text-sm">
                <p className="font-medium text-slate-200 line-through decoration-red-400/50">
                  {c.feature}
                </p>
                <p className="mt-0.5 text-xs text-slate-400">{c.reason}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

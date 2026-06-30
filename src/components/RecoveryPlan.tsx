"use client";

import { useState } from "react";
import type { RecoveryPlans } from "@/lib/types";

const TABS: { key: keyof RecoveryPlans; label: string; sub: string }[] = [
  { key: "twoHour", label: "2-Hour", sub: "Emergency" },
  { key: "sixHour", label: "6-Hour", sub: "Focused" },
  { key: "twelveHour", label: "12-Hour", sub: "Complete" },
];

export default function RecoveryPlan({ plans }: { plans: RecoveryPlans }) {
  const [active, setActive] = useState<keyof RecoveryPlans>("twoHour");
  const steps = plans[active] ?? [];

  return (
    <section>
      <h3 className="mb-3 text-lg font-semibold text-white">Recovery Sprint Plan</h3>
      <div className="card">
        <div className="mb-5 flex flex-wrap gap-2">
          {TABS.map((t) => {
            const isActive = t.key === active;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => setActive(t.key)}
                className={`flex flex-col items-start rounded-xl border px-4 py-2.5 text-left transition ${
                  isActive
                    ? "border-accent-blue/50 bg-accent-blue/10"
                    : "border-white/10 bg-white/[0.02] hover:border-white/20"
                }`}
              >
                <span
                  className={`text-sm font-semibold ${
                    isActive ? "text-white" : "text-slate-300"
                  }`}
                >
                  {t.label}
                </span>
                <span className="text-xs text-slate-500">{t.sub}</span>
              </button>
            );
          })}
        </div>

        <ol className="space-y-3">
          {steps.map((s, i) => (
            <li key={i} className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-blue/15 text-xs font-semibold text-accent-cyan">
                {i + 1}
              </span>
              <span className="pt-0.5 text-sm text-slate-300">{s}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

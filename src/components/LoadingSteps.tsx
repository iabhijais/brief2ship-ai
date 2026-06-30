"use client";

import { useEffect, useState } from "react";

const STEPS = [
  "Reading brief",
  "Extracting deliverables",
  "Finding judging signals",
  "Cutting scope",
  "Building submission kit",
];

export default function LoadingSteps() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((a) => Math.min(a + 1, STEPS.length - 1));
    }, 900);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="mx-auto w-full max-w-3xl animate-fade-up">
      <div className="card">
        <p className="section-title mb-5">Analyzing your brief</p>
        <ul className="space-y-3">
          {STEPS.map((step, i) => {
            const done = i < active;
            const current = i === active;
            return (
              <li key={step} className="flex items-center gap-3">
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs ${
                    done
                      ? "border-accent-green/40 bg-accent-green/15 text-accent-green"
                      : current
                      ? "border-accent-cyan/50 bg-accent-cyan/10 text-accent-cyan"
                      : "border-white/10 bg-white/[0.02] text-slate-600"
                  }`}
                >
                  {done ? (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  ) : current ? (
                    <span className="h-2 w-2 animate-pulse-soft rounded-full bg-accent-cyan" />
                  ) : (
                    i + 1
                  )}
                </span>
                <span
                  className={`text-sm ${
                    done
                      ? "text-slate-400 line-through decoration-slate-600"
                      : current
                      ? "font-medium text-white"
                      : "text-slate-600"
                  }`}
                >
                  {step}
                </span>
              </li>
            );
          })}
        </ul>

        <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-accent-blue via-accent-cyan to-accent-green transition-all duration-700 ease-out"
            style={{ width: `${((active + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>
    </section>
  );
}

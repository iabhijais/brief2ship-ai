"use client";

import type { Readiness } from "@/lib/types";
import ScoreRing from "./ScoreRing";

function verdictStyle(verdict: string) {
  const v = verdict.toLowerCase();
  if (v.includes("ready"))
    return { ring: "border-accent-green/40 bg-accent-green/10 text-accent-green", emoji: "🚀" };
  if (v.includes("risk"))
    return { ring: "border-red-500/40 bg-red-500/10 text-red-300", emoji: "⚠️" };
  return { ring: "border-accent-cyan/40 bg-accent-cyan/10 text-accent-cyan", emoji: "🛠️" };
}

export default function ReadinessScore({
  readiness,
  criticalRisks,
}: {
  readiness: Readiness;
  criticalRisks: string[];
}) {
  const v = verdictStyle(readiness.verdict);

  return (
    <section>
      <h3 className="mb-3 text-lg font-semibold text-white">Readiness Score</h3>
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="card flex flex-col items-center justify-center text-center">
          <ScoreRing value={readiness.score} size={150} />
          <span className={`mt-4 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-semibold ${v.ring}`}>
            <span>{v.emoji}</span>
            {readiness.verdict}
          </span>
        </div>

        <div className="card">
          <p className="section-title mb-3">Fix first</p>
          <ol className="space-y-2.5">
            {readiness.fixFirst.map((f, i) => (
              <li key={i} className="flex gap-2.5 text-sm text-slate-300">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-blue/15 text-xs font-semibold text-accent-cyan">
                  {i + 1}
                </span>
                {f}
              </li>
            ))}
          </ol>
        </div>

        <div className="card">
          <p className="section-title mb-3">Critical missing items</p>
          {criticalRisks.length === 0 ? (
            <p className="text-sm text-slate-500">No critical risks flagged.</p>
          ) : (
            <ul className="space-y-2.5">
              {criticalRisks.map((c, i) => (
                <li key={i} className="flex gap-2.5 text-sm text-slate-300">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" />
                  {c}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

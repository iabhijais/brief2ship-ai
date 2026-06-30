"use client";

import type { AnalysisResult } from "@/lib/types";
import ScoreRing from "./ScoreRing";

function ListBlock({
  title,
  items,
  dot,
}: {
  title: string;
  items: string[];
  dot: string;
}) {
  return (
    <div>
      <p className="section-title mb-3">{title}</p>
      {items.length === 0 ? (
        <p className="text-sm text-slate-600">—</p>
      ) : (
        <ul className="space-y-2">
          {items.map((it, i) => (
            <li key={i} className="flex gap-2.5 text-sm text-slate-300">
              <span
                className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ backgroundColor: dot }}
              />
              <span>{it}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function AnalysisDashboard({ r }: { r: AnalysisResult }) {
  const riskBand =
    r.riskScore <= 33 ? "Low risk" : r.riskScore <= 66 ? "Moderate risk" : "High risk";

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="card lg:col-span-2">
        <p className="section-title mb-2">Project</p>
        <h2 className="text-2xl font-bold tracking-tight text-white">
          {r.projectTitle}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          {r.problemSummary}
        </p>
        <div className="mt-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-accent-cyan">
            Target user
          </p>
          <p className="mt-1 text-sm text-slate-300">{r.targetUser}</p>
        </div>
      </div>

      <div className="card flex flex-col items-center justify-center text-center">
        <p className="section-title mb-3">Submission risk</p>
        <ScoreRing value={r.riskScore} invert size={140} />
        <span
          className={`mt-3 chip ${
            r.riskScore <= 33
              ? "!text-accent-green"
              : r.riskScore <= 66
              ? "!text-accent-cyan"
              : "!text-red-400"
          }`}
        >
          {riskBand}
        </span>
      </div>

      <div className="card">
        <ListBlock title="Key deliverables" items={r.deliverables} dot="#34d399" />
      </div>
      <div className="card">
        <ListBlock title="Constraints" items={r.constraints} dot="#f59e0b" />
      </div>
      <div className="card">
        <ListBlock title="Judging signals" items={r.judgingSignals} dot="#22d3ee" />
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import type { AnalysisResult } from "@/lib/types";
import CopyButton from "./CopyButton";

type TabKey = "readme" | "pitch" | "demo" | "checklist";

export default function SubmissionKit({ r }: { r: AnalysisResult }) {
  const [tab, setTab] = useState<TabKey>("readme");

  const checklistText = r.submissionChecklist.map((c) => `- [ ] ${c}`).join("\n");

  const tabs: { key: TabKey; label: string }[] = [
    { key: "readme", label: "README draft" },
    { key: "pitch", label: "60-sec pitch" },
    { key: "demo", label: "Demo script" },
    { key: "checklist", label: "Checklist" },
  ];

  const copyText =
    tab === "readme"
      ? r.readmeDraft
      : tab === "pitch"
      ? r.pitch
      : tab === "demo"
      ? r.demoScript
      : checklistText;

  return (
    <section>
      <div className="mb-3 flex items-center gap-2">
        <h3 className="text-lg font-semibold text-white">Submission Kit</h3>
        <span className="chip">Copy-paste ready</span>
      </div>

      <div className="card">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {tabs.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                  tab === t.key
                    ? "bg-accent-blue/15 text-accent-cyan"
                    : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <CopyButton text={copyText} label="Copy section" />
        </div>

        {tab === "checklist" ? (
          <ul className="space-y-2">
            {r.submissionChecklist.map((c, i) => (
              <li
                key={i}
                className="flex items-start gap-2.5 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-sm text-slate-300"
              >
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border border-white/20" />
                {c}
              </li>
            ))}
          </ul>
        ) : (
          <pre className="max-h-[28rem] overflow-auto whitespace-pre-wrap rounded-xl border border-white/[0.06] bg-ink-950/60 p-4 font-mono text-[13px] leading-relaxed text-slate-300">
            {copyText}
          </pre>
        )}
      </div>
    </section>
  );
}

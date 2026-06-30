"use client";

import { VIBE2SHIP_SAMPLE_BRIEF } from "@/lib/sampleBrief";

const BADGES = ["Gemini-powered", "Hackathon-ready", "Submission-first"];

export default function HeroInput({
  brief,
  setBrief,
  onAnalyze,
  loading,
}: {
  brief: string;
  setBrief: (v: string) => void;
  onAnalyze: () => void;
  loading: boolean;
}) {
  const chars = brief.trim().length;

  return (
    <section className="mx-auto w-full max-w-3xl animate-fade-up">
      <div className="mb-3 flex flex-wrap gap-2">
        {BADGES.map((b) => (
          <span key={b} className="chip">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-cyan" />
            {b}
          </span>
        ))}
      </div>

      <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
        Stop guessing <span className="text-accent-cyan">what to build.</span>
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg">
        Paste any hackathon or assignment brief and get a clear MVP scope, sprint
        plan, risk score, and submission kit — before your deadline kills the
        project.
      </p>

      <div className="card mt-6">
        <label
          htmlFor="brief"
          className="mb-2 block text-sm font-medium text-slate-300"
        >
          Your brief
        </label>
        <textarea
          id="brief"
          value={brief}
          onChange={(e) => setBrief(e.target.value)}
          placeholder="Paste the hackathon brief, problem statement, or assignment prompt here…"
          rows={7}
          className="w-full resize-y rounded-xl border border-white/10 bg-ink-950/60 p-4 text-sm leading-relaxed text-slate-100 placeholder:text-slate-600 focus:border-accent-blue/50 focus:outline-none focus:ring-2 focus:ring-accent-blue/20"
          onKeyDown={(e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "Enter") onAnalyze();
          }}
        />

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onAnalyze}
              disabled={loading || chars === 0}
              className="btn-primary"
            >
              {loading ? (
                <>
                  <Spinner />
                  Analyzing…
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m5 12 5 5L20 7" opacity="0" />
                    <path d="M12 3v3m0 12v3M3 12h3m12 0h3M5.6 5.6l2.1 2.1m8.6 8.6 2.1 2.1m0-12.8-2.1 2.1m-8.6 8.6-2.1 2.1" />
                  </svg>
                  Analyze Brief
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => setBrief(VIBE2SHIP_SAMPLE_BRIEF)}
              disabled={loading}
              className="btn-ghost"
            >
              Use Vibe2Ship Sample Brief
            </button>
          </div>
          <span className="text-xs text-slate-500">
            {chars > 0 ? `${chars} characters` : "Tip: ⌘/Ctrl + Enter to analyze"}
          </span>
        </div>
      </div>
    </section>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" opacity="0.25" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

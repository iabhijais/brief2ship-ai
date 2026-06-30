"use client";

import { useEffect, useRef, useState } from "react";
import type { AnalysisResult, AnalyzeResponse, TaskStatus } from "@/lib/types";
import { clearState, loadState, saveState } from "@/lib/storage";
import HeroInput from "@/components/HeroInput";
import LoadingSteps from "@/components/LoadingSteps";
import AnalysisDashboard from "@/components/AnalysisDashboard";
import JudgeLens from "@/components/JudgeLens";
import MvpScope from "@/components/MvpScope";
import RecoveryPlan from "@/components/RecoveryPlan";
import TaskBoard from "@/components/TaskBoard";
import SubmissionKit from "@/components/SubmissionKit";
import ReadinessScore from "@/components/ReadinessScore";

type View = "idle" | "loading" | "result" | "error";

export default function Page() {
  const [brief, setBrief] = useState("");
  const [view, setView] = useState<View>("idle");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [source, setSource] = useState<"gemini" | "mock" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  // Restore last analysis on mount.
  useEffect(() => {
    const saved = loadState();
    if (saved) {
      setBrief(saved.brief);
      setResult(saved.result);
      setSource(saved.source);
      setView("result");
    }
  }, []);

  async function handleAnalyze() {
    if (!brief.trim()) return;
    setView("loading");
    setError(null);
    const startedAt = Date.now();

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brief }),
      });
      const data = (await res.json()) as AnalyzeResponse & { error?: string };

      if (!res.ok || !data.result) {
        throw new Error(data.error || "Analysis failed. Please try again.");
      }

      // Keep the staged loading animation visible for a beat.
      const elapsed = Date.now() - startedAt;
      if (elapsed < 2600) {
        await new Promise((r) => setTimeout(r, 2600 - elapsed));
      }

      setResult(data.result);
      setSource(data.source);
      setView("result");
      saveState({ brief, result: data.result, source: data.source });
      requestAnimationFrame(() =>
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setView("error");
    }
  }

  function handleReset() {
    clearState();
    setBrief("");
    setResult(null);
    setSource(null);
    setError(null);
    setView("idle");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleMoveTask(index: number, status: TaskStatus) {
    setResult((prev) => {
      if (!prev) return prev;
      const tasks = prev.tasks.map((t, i) =>
        i === index ? { ...t, status } : t
      );
      const next = { ...prev, tasks };
      saveState({ brief, result: next, source: source ?? "mock" });
      return next;
    });
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      {/* Top bar */}
      <header className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent-blue to-accent-cyan text-sm font-bold text-ink-950">
            B2
          </div>
          <div className="leading-tight">
            <p className="font-semibold text-white">Brief2Ship AI</p>
            <p className="text-xs text-slate-500">AI Brief-to-Submission Copilot</p>
          </div>
        </div>
        {view === "result" && (
          <button type="button" onClick={handleReset} className="btn-ghost !py-2">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
            Reset
          </button>
        )}
      </header>

      {/* Input is always available at the top when idle/loading/error */}
      {view !== "result" && (
        <HeroInput
          brief={brief}
          setBrief={setBrief}
          onAnalyze={handleAnalyze}
          loading={view === "loading"}
        />
      )}

      {view === "loading" && (
        <div className="mt-6">
          <LoadingSteps />
        </div>
      )}

      {view === "error" && (
        <section className="mx-auto mt-6 w-full max-w-3xl animate-fade-up">
          <div className="card border-red-500/30 bg-red-500/[0.04]">
            <div className="flex items-start gap-3">
              <span className="text-xl">⚠️</span>
              <div>
                <p className="font-semibold text-red-300">Analysis failed</p>
                <p className="mt-1 text-sm text-slate-400">{error}</p>
                <button
                  type="button"
                  onClick={handleAnalyze}
                  className="btn-primary mt-4 !py-2"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {view === "result" && result && (
        <div ref={resultRef} className="space-y-8">
          {/* Compact brief recap + source badge */}
          <section className="animate-fade-up">
            <div className="flex flex-col gap-3 rounded-2xl border border-white/[0.06] bg-ink-850/50 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Analyzed brief
                </p>
                <p className="mt-1 line-clamp-2 max-w-3xl text-sm text-slate-400">
                  {brief}
                </p>
              </div>
              <span
                className={`chip shrink-0 ${
                  source === "gemini"
                    ? "!border-accent-green/30 !text-accent-green"
                    : "!border-amber-500/30 !text-amber-300"
                }`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                {source === "gemini" ? "Gemini-powered" : "Mock fallback"}
              </span>
            </div>
          </section>

          <div className="animate-fade-up">
            <AnalysisDashboard r={result} />
          </div>
          <div className="animate-fade-up">
            <JudgeLens items={result.judgeLens} />
          </div>
          <div className="animate-fade-up">
            <MvpScope scope={result.mvpScope} />
          </div>
          <div className="animate-fade-up">
            <RecoveryPlan plans={result.recoveryPlans} />
          </div>
          <div className="animate-fade-up">
            <TaskBoard tasks={result.tasks} onMove={handleMoveTask} />
          </div>
          <div className="animate-fade-up">
            <SubmissionKit r={result} />
          </div>
          <div className="animate-fade-up">
            <ReadinessScore
              readiness={result.readiness}
              criticalRisks={result.criticalRisks}
            />
          </div>

          <footer className="flex justify-center pt-2">
            <button type="button" onClick={handleReset} className="btn-ghost">
              Analyze another brief
            </button>
          </footer>
        </div>
      )}

      <footer className="mt-16 border-t border-white/[0.06] pt-6 text-center text-xs text-slate-600">
        Brief2Ship AI · Built for Vibe2Ship · Powered by Gemini (Google AI Studio)
      </footer>
    </main>
  );
}

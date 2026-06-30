"use client";

import type { Task, TaskStatus } from "@/lib/types";

const COLUMNS: { key: TaskStatus; label: string; accent: string }[] = [
  { key: "todo", label: "Todo", accent: "#64748b" },
  { key: "doing", label: "Doing", accent: "#22d3ee" },
  { key: "done", label: "Done", accent: "#34d399" },
];

const PRIORITY_STYLE: Record<Task["priority"], string> = {
  Critical: "border-red-500/30 bg-red-500/10 text-red-300",
  High: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  Medium: "border-slate-500/30 bg-slate-500/10 text-slate-300",
};

const NEXT: Record<TaskStatus, TaskStatus> = {
  todo: "doing",
  doing: "done",
  done: "todo",
};
const PREV: Record<TaskStatus, TaskStatus> = {
  todo: "done",
  doing: "todo",
  done: "doing",
};

export default function TaskBoard({
  tasks,
  onMove,
}: {
  tasks: Task[];
  onMove: (index: number, status: TaskStatus) => void;
}) {
  return (
    <section>
      <div className="mb-3 flex items-center gap-2">
        <h3 className="text-lg font-semibold text-white">Task Board</h3>
        <span className="chip">Move tasks as you ship</span>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {COLUMNS.map((col) => {
          const colTasks = tasks
            .map((t, i) => ({ t, i }))
            .filter(({ t }) => t.status === col.key);
          return (
            <div key={col.key} className="card !p-4">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: col.accent }}
                  />
                  <p className="text-sm font-semibold text-white">{col.label}</p>
                </div>
                <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-slate-400">
                  {colTasks.length}
                </span>
              </div>

              <div className="space-y-2.5">
                {colTasks.length === 0 ? (
                  <p className="rounded-lg border border-dashed border-white/10 px-3 py-4 text-center text-xs text-slate-600">
                    No tasks
                  </p>
                ) : (
                  colTasks.map(({ t, i }) => (
                    <div
                      key={i}
                      className="rounded-xl border border-white/[0.07] bg-ink-900/60 p-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p
                          className={`text-sm font-medium text-slate-100 ${
                            t.status === "done"
                              ? "line-through decoration-slate-600"
                              : ""
                          }`}
                        >
                          {t.title}
                        </p>
                        <span
                          className={`shrink-0 rounded-md border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${PRIORITY_STYLE[t.priority]}`}
                        >
                          {t.priority}
                        </span>
                      </div>
                      <p className="mt-1.5 text-xs leading-relaxed text-slate-400">
                        {t.reason}
                      </p>
                      <div className="mt-2.5 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => onMove(i, PREV[t.status])}
                          className="rounded-md px-1.5 py-1 text-xs text-slate-500 transition hover:bg-white/5 hover:text-slate-300"
                          aria-label="Move left"
                        >
                          ‹ Back
                        </button>
                        {t.status === "done" ? (
                          <span className="text-xs font-semibold text-accent-green">
                            ✓ Done
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onMove(i, NEXT[t.status])}
                            className="rounded-md px-1.5 py-1 text-xs font-medium text-accent-cyan transition hover:bg-accent-cyan/10"
                          >
                            {t.status === "todo" ? "Start ›" : "Mark done ›"}
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

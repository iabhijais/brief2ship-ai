import type { AnalysisResult, Task, TaskPriority } from "./types";

// Try these in order. Free-tier models frequently return 429 (rate limit) or
// 503 (overloaded), so we fall through the list until one answers. Ordered
// fastest / highest-quota first so a healthy key answers on the first try.
const GEMINI_MODELS = ["gemini-2.5-flash", "gemini-2.5-flash-lite"];
const GEMINI_ENDPOINT = (model: string, key: string) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;

const SYSTEM_PROMPT = `You are a senior hackathon judge and product strategist with a brutal bias toward shipping. You have watched hundreds of solo builders lose because they misread the brief, overbuilt the wrong thing, and ran out of time before submitting.

Your job: read a hackathon / assignment / project brief and return a single, ruthlessly practical execution plan that helps the builder actually ship before the deadline.

Rules:
- Be brutally practical. Reject vague, overbuilt, or "platform" ideas. Push toward one tight, working loop.
- Prioritize shipping and submission completeness over feature breadth.
- Never return generic advice ("work hard", "test your code"). Every line must be specific to THIS brief.
- The cut list must name real features and a sharp reason to cut each.
- Tasks must be concrete and ordered by impact.
- Output STRICT JSON ONLY. No markdown, no code fences, no commentary outside the JSON.
- Do not include markdown inside string fields except inside "readmeDraft" (which may use markdown).
- riskScore is 0-100 (higher = more likely to fail to ship). readiness.score is 0-100 (higher = more ready).
- readiness.verdict must be exactly one of: "Ready to submit", "Needs polish", "High risk".
- Every task.priority must be exactly one of: "Critical", "High", "Medium". Every task.status must be "todo".

Return JSON matching EXACTLY this shape (same keys, same nesting):
{
  "projectTitle": "string",
  "problemSummary": "string",
  "targetUser": "string",
  "deliverables": ["string"],
  "constraints": ["string"],
  "judgingSignals": ["string"],
  "judgeLens": [{ "criterion": "string", "whyItMatters": "string", "howToSatisfy": "string" }],
  "mvpScope": {
    "mustBuild": ["string"],
    "niceToHave": ["string"],
    "cutList": [{ "feature": "string", "reason": "string" }]
  },
  "riskScore": 0,
  "criticalRisks": ["string"],
  "recoveryPlans": { "twoHour": ["string"], "sixHour": ["string"], "twelveHour": ["string"] },
  "tasks": [{ "title": "string", "priority": "Critical | High | Medium", "status": "todo", "reason": "string" }],
  "submissionChecklist": ["string"],
  "readmeDraft": "string",
  "demoScript": "string",
  "pitch": "string",
  "readiness": { "score": 0, "verdict": "string", "fixFirst": ["string"] }
}`;

function extractJson(text: string): unknown {
  // Strip code fences if present, then grab the outermost JSON object.
  const cleaned = text
    .replace(/^```(?:json)?/gim, "")
    .replace(/```$/gim, "")
    .trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("No JSON object found in Gemini response");
  }
  return JSON.parse(cleaned.slice(start, end + 1));
}

function asStringArray(value: unknown, fallback: string[] = []): string[] {
  if (!Array.isArray(value)) return fallback;
  return value
    .map((v) => (typeof v === "string" ? v : String(v)))
    .filter((v) => v.trim().length > 0);
}

function clampScore(value: unknown, fallback: number): number {
  const n = typeof value === "number" ? value : Number(value);
  if (Number.isNaN(n)) return fallback;
  return Math.max(0, Math.min(100, Math.round(n)));
}

function normalizePriority(value: unknown): TaskPriority {
  const v = String(value).toLowerCase();
  if (v.startsWith("crit")) return "Critical";
  if (v.startsWith("high")) return "High";
  return "Medium";
}

function normalizeVerdict(value: unknown): string {
  const v = String(value).toLowerCase();
  if (v.includes("ready")) return "Ready to submit";
  if (v.includes("risk")) return "High risk";
  if (v.includes("polish")) return "Needs polish";
  return typeof value === "string" && value.trim() ? value : "Needs polish";
}

/**
 * Coerce arbitrary parsed JSON into a safe, fully-shaped AnalysisResult.
 * Anything missing is filled so the UI never crashes on a partial model reply.
 */
export function normalizeResult(raw: unknown): AnalysisResult {
  const r = (raw ?? {}) as Record<string, any>;
  const scope = (r.mvpScope ?? {}) as Record<string, any>;
  const plans = (r.recoveryPlans ?? {}) as Record<string, any>;
  const readiness = (r.readiness ?? {}) as Record<string, any>;

  const tasks: Task[] = Array.isArray(r.tasks)
    ? r.tasks
        .filter((t: any) => t && (t.title || t.reason))
        .map((t: any) => ({
          title: String(t.title ?? "Untitled task"),
          priority: normalizePriority(t.priority),
          status: "todo" as const,
          reason: String(t.reason ?? ""),
        }))
    : [];

  const judgeLens = Array.isArray(r.judgeLens)
    ? r.judgeLens
        .filter((j: any) => j && j.criterion)
        .map((j: any) => ({
          criterion: String(j.criterion),
          whyItMatters: String(j.whyItMatters ?? ""),
          howToSatisfy: String(j.howToSatisfy ?? ""),
        }))
    : [];

  const cutList = Array.isArray(scope.cutList)
    ? scope.cutList
        .filter((c: any) => c && c.feature)
        .map((c: any) => ({
          feature: String(c.feature),
          reason: String(c.reason ?? ""),
        }))
    : [];

  return {
    projectTitle: String(r.projectTitle ?? "Untitled Project"),
    problemSummary: String(r.problemSummary ?? ""),
    targetUser: String(r.targetUser ?? ""),
    deliverables: asStringArray(r.deliverables),
    constraints: asStringArray(r.constraints),
    judgingSignals: asStringArray(r.judgingSignals),
    judgeLens,
    mvpScope: {
      mustBuild: asStringArray(scope.mustBuild),
      niceToHave: asStringArray(scope.niceToHave),
      cutList,
    },
    riskScore: clampScore(r.riskScore, 50),
    criticalRisks: asStringArray(r.criticalRisks),
    recoveryPlans: {
      twoHour: asStringArray(plans.twoHour),
      sixHour: asStringArray(plans.sixHour),
      twelveHour: asStringArray(plans.twelveHour),
    },
    tasks,
    submissionChecklist: asStringArray(r.submissionChecklist),
    readmeDraft: String(r.readmeDraft ?? ""),
    demoScript: String(r.demoScript ?? ""),
    pitch: String(r.pitch ?? ""),
    readiness: {
      score: clampScore(readiness.score, 50),
      verdict: normalizeVerdict(readiness.verdict),
      fixFirst: asStringArray(readiness.fixFirst),
    },
  };
}

const REQUEST_BODY = (brief: string) =>
  JSON.stringify({
    systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `Analyze this brief and return the strict JSON plan:\n\n"""\n${brief}\n"""`,
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.7,
      // The full plan JSON is large; keep this high so the response is never
      // truncated mid-string (which would make JSON.parse fail).
      maxOutputTokens: 8192,
      responseMimeType: "application/json",
      // 2.5 "thinking" models spend output tokens on reasoning by default,
      // which both slows generation and eats into the token budget. Disable it.
      thinkingConfig: { thinkingBudget: 0 },
    },
  });

/** Single request to one model. Returns parsed JSON text or throws. */
async function callModel(
  model: string,
  apiKey: string,
  body: string
): Promise<string> {
  // The full JSON plan can take ~15-20s to generate on flash models, so give
  // each attempt enough room before falling through to the next model.
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25000);
  try {
    const res = await fetch(GEMINI_ENDPOINT(model, apiKey), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body,
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      const err = new Error(`Gemini API ${res.status}: ${detail.slice(0, 160)}`);
      // Mark retryable / fall-through-able statuses.
      (err as any).status = res.status;
      throw err;
    }

    const data = await res.json();
    const text: string | undefined =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error("Empty Gemini response");
    return text;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Calls the Gemini API and returns a normalized AnalysisResult.
 * Walks a list of models (with one retry each) so a single overloaded /
 * rate-limited model does not force the mock fallback. Throws only if every
 * model fails, so the caller can then fall back to the mock.
 */
export async function analyzeWithGemini(brief: string): Promise<AnalysisResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set");
  }

  const body = REQUEST_BODY(brief);
  let lastErr: unknown = null;

  // One attempt per model, walking the list. Keeps worst-case latency bounded
  // (~3 × 13s) so a throttled key falls back to the mock quickly instead of
  // hanging the request.
  for (const model of GEMINI_MODELS) {
    try {
      const text = await callModel(model, apiKey, body);
      return normalizeResult(extractJson(text));
    } catch (err) {
      lastErr = err;
      const status = (err as any)?.status as number | undefined;
      // 400/401/403 = bad key or request: no point trying other models.
      if (status === 400 || status === 401 || status === 403) {
        throw err;
      }
      // 429/503/network/timeout: short backoff, then try the next model.
      await new Promise((r) => setTimeout(r, 250));
    }
  }

  throw lastErr instanceof Error
    ? lastErr
    : new Error("All Gemini models failed");
}

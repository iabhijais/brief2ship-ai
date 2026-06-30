import type { AnalysisResult } from "./types";

/**
 * High-quality mock fallback used when the Gemini API key is missing or the
 * API call fails. Tuned to the Vibe2Ship hackathon brief so the demo always
 * looks sharp, even offline.
 */
/** Derive a short, plausible project title from the brief text. */
function deriveTitle(brief: string): string {
  const text = brief.trim();
  if (!text) return "Untitled Project";

  const stop = new Set([
    "the", "a", "an", "and", "or", "for", "to", "of", "in", "on", "with",
    "that", "this", "uses", "use", "using", "app", "application", "build",
    "create", "make", "ai", "based", "their", "your", "from", "into", "is",
    "are", "be", "can", "should", "will", "must", "by", "as", "it",
    "where", "what", "when", "who", "how", "which", "users", "user", "people",
    "mobile", "web", "website", "platform", "tool", "system", "they", "them",
    "helps", "help", "lets", "let", "allows", "allow", "want", "need",
  ]);
  const words = text
    .replace(/[^a-zA-Z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stop.has(w.toLowerCase()));

  const key = words.slice(0, 2).map((w) => w[0].toUpperCase() + w.slice(1));
  if (key.length === 0) return "AI-Powered MVP";
  return `${key.join(" ")} AI`;
}

export function buildMockResult(brief: string): AnalysisResult {
  const trimmed = brief.trim();
  const hasBrief = trimmed.length > 0;
  const snippet =
    trimmed.length > 160 ? `${trimmed.slice(0, 157)}…` : trimmed;

  return {
    projectTitle: deriveTitle(brief),
    problemSummary: hasBrief
      ? `Based on the brief — "${snippet}" — the real challenge is shipping a practical, working, AI-powered product before a hard deadline. The failure mode is rarely coding ability; it is scope confusion, missing submission items, and a weak demo story that hides the AI value from judges.`
      : "Builders must ship a practical, working, AI-powered product before a hard deadline. The real failure mode is not coding ability — it is scope confusion, missing submission items, and a weak demo story that hides the AI value from judges.",
    targetUser:
      "Solo hackathon participants, students, and indie builders racing a deadline who need a working, demo-ready product with visible AI usage.",
    deliverables: [
      "Working deployed web app (public URL)",
      "Clear demonstration of Gemini / Google AI Studio usage",
      "Short demo video or live walkthrough",
      "README with problem, solution, and setup",
      "Submission form completed before deadline",
    ],
    constraints: [
      "Solo builder — limited hands and hours",
      "Must use Google AI Studio / Gemini API",
      "Hard submission deadline",
      "Judged on a working demo, not promises",
    ],
    judgingSignals: [
      "Clear, specific problem statement",
      "Visible, meaningful AI usage (not a bolt-on)",
      "Polished, usable UI",
      "Working end-to-end demo",
      "Real-world usefulness",
      "Complete submission kit (README, links, video)",
    ],
    judgeLens: [
      {
        criterion: "Product clarity",
        whyItMatters:
          "Judges score in minutes. If they cannot state your problem in one line, you lose before the demo starts.",
        howToSatisfy:
          "Lead with one sentence: who it is for and what pain it removes. Put it in the hero and the README.",
      },
      {
        criterion: "Working demo",
        whyItMatters:
          "A live, working flow beats a beautiful idea. Broken demos are an instant trust killer.",
        howToSatisfy:
          "Lock one happy path that works every time and rehearse it. Keep a recorded backup.",
      },
      {
        criterion: "AI relevance",
        whyItMatters:
          "This is an AI hackathon. If the AI could be removed without changing the product, you score low.",
        howToSatisfy:
          "Make Gemini do the core work on screen — visible input in, structured value out.",
      },
      {
        criterion: "Feasibility",
        whyItMatters:
          "Judges reward what actually ships over an ambitious half-built platform.",
        howToSatisfy:
          "Ship a tight MVP with one strong loop instead of five shallow features.",
      },
      {
        criterion: "Uniqueness",
        whyItMatters:
          "Generic chatbots and todo apps blur together. Differentiation earns memory and points.",
        howToSatisfy:
          "Pick a sharp, specific use case and frame it as a tool that does one job exceptionally well.",
      },
      {
        criterion: "UI / UX",
        whyItMatters:
          "A clean interface signals product maturity and makes the demo feel real.",
        howToSatisfy:
          "Use a consistent dark dashboard, strong hierarchy, and zero dead-end empty states.",
      },
      {
        criterion: "Submission completeness",
        whyItMatters:
          "Missing links or an empty README can disqualify an otherwise great build.",
        howToSatisfy:
          "Finish the submission checklist 30 minutes before the deadline, not at it.",
      },
    ],
    mvpScope: {
      mustBuild: [
        "Single core AI flow: clear input → Gemini → structured, useful output",
        "One polished result screen that shows the value instantly",
        "Deployed public URL (Vercel)",
        "Graceful fallback so the demo never hard-crashes",
      ],
      niceToHave: [
        "Save / history of past results",
        "Copy-to-clipboard for generated content",
        "Light/dark theme polish and subtle animations",
      ],
      cutList: [
        {
          feature: "User authentication & accounts",
          reason:
            "Adds hours of plumbing and zero demo value. Judges never log in.",
        },
        {
          feature: "Database / persistent backend",
          reason:
            "LocalStorage covers the demo. A DB is a deadline risk with no payoff.",
        },
        {
          feature: "Team collaboration & sharing",
          reason: "Out of scope for a solo MVP and dilutes the core story.",
        },
        {
          feature: "Payments / billing",
          reason: "Irrelevant to judging and pure time sink.",
        },
      ],
    },
    riskScore: 38,
    criticalRisks: [
      "AI value not visible enough in the 60-second demo",
      "Scope creep eating time meant for polish and submission",
      "No recorded backup if the live demo or API fails",
    ],
    recoveryPlans: {
      twoHour: [
        "Freeze scope to the single core AI flow — stop building features now",
        "Wire one input → Gemini → result path end to end with mock fallback",
        "Write the one-line pitch and paste it into the hero + README",
        "Record a 60-second screen capture of the happy path as a backup",
      ],
      sixHour: [
        "Polish the result screen: hierarchy, spacing, loading and error states",
        "Add copy buttons and localStorage persistence for the last result",
        "Deploy to Vercel and verify the public URL on a fresh browser",
        "Draft README (problem, solution, AI usage, setup) and demo script",
        "Run the full demo twice and fix whatever feels slow or confusing",
      ],
      twelveHour: [
        "Add the highest-value nice-to-have (history or theme polish)",
        "Tighten copy across the app so every label sells the value",
        "Mobile pass: confirm the demo works on a phone-sized screen",
        "Finalize the submission kit and complete the checklist",
        "Sleep-proof it: rehearse the pitch until it is 55 seconds, calm, and clear",
      ],
    },
    tasks: [
      {
        title: "Lock the single core AI flow end to end",
        priority: "Critical",
        status: "todo",
        reason: "Without one working loop, nothing else matters to judges.",
      },
      {
        title: "Add mock fallback so the demo never crashes",
        priority: "Critical",
        status: "todo",
        reason: "A failed live API during judging is the worst-case outcome.",
      },
      {
        title: "Deploy to Vercel and verify public URL",
        priority: "High",
        status: "todo",
        reason: "A working link is a hard submission requirement.",
      },
      {
        title: "Write one-line pitch + README draft",
        priority: "High",
        status: "todo",
        reason: "Clarity and completeness are directly scored.",
      },
      {
        title: "Record 60-second backup demo video",
        priority: "High",
        status: "todo",
        reason: "Insurance against live-demo failure.",
      },
      {
        title: "Polish result screen and empty/loading states",
        priority: "Medium",
        status: "todo",
        reason: "UI polish signals product maturity.",
      },
      {
        title: "Add copy buttons + localStorage persistence",
        priority: "Medium",
        status: "todo",
        reason: "Small touches that make the demo feel finished.",
      },
    ],
    submissionChecklist: [
      "Public deployed URL works in a fresh, logged-out browser",
      "Gemini / AI usage is visible in the live flow",
      "README includes problem, solution, AI usage, and setup",
      "60-second demo video recorded and uploaded",
      "One-line pitch written and consistent across app + README",
      "Submission form fields all completed",
      "Submitted at least 30 minutes before the deadline",
    ],
    readmeDraft: `# AI-Powered Real-World MVP

> Built for Vibe2Ship — a solo AI hackathon by Coding Ninjas 10X Club × Google for Developers.

## Problem
Builders lose hackathons not from weak code, but from scope confusion, weak demos, and incomplete submissions under deadline pressure.

## Solution
A focused AI tool that does one job exceptionally well: take a clear input, use Gemini to produce structured, genuinely useful output, and present it in a clean, demo-ready dashboard.

## Gemini Usage
The core value is generated by the Gemini API via Google AI Studio. User input is sent to a structured prompt; Gemini returns strict JSON that drives the entire result UI. A high-quality mock fallback keeps the app working even without an API key.

## Features
- One-shot AI analysis with a structured, scannable result
- Copyable outputs for fast submission
- LocalStorage persistence so a refresh never loses work
- Graceful loading, error, and fallback states

## Tech Stack
Next.js · TypeScript · Tailwind CSS · Gemini API (Google AI Studio) · LocalStorage · Vercel

## Setup
\`\`\`bash
npm install
# add GEMINI_API_KEY to .env.local (optional — mock fallback works without it)
npm run dev
\`\`\`

## Demo Flow
1. Paste input → 2. Generate → 3. Review structured result → 4. Copy submission assets.

## Future Scope
Multi-language support, export to PDF, and shareable result links.`,
    demoScript: `[0:00–0:08] Hook
"Most builders don't lose hackathons because they can't code. They lose because they run out of time on the wrong things. Here's a tool that fixes that."

[0:08–0:20] Problem + setup
Show the clean input screen. "I paste my brief here and hit analyze."

[0:20–0:35] AI value
Click analyze. As the result appears: "Gemini reads it and instantly returns scope, risks, a sprint plan, and a full submission kit — structured, not a wall of chat."

[0:35–0:50] The payoff
Scroll the risk score, cut list, and sprint plan. "It tells me exactly what to cut and what to build in the next two hours."

[0:50–0:60] Close
Show the README + pitch and the readiness score. "One paste, and I have everything I need to ship. That's Brief2Ship."`,
    pitch: `Most builders don't lose hackathons because they can't code — they lose because they misread the brief, overbuild, and run out of time before they can ship. Brief2Ship AI fixes that: paste any hackathon brief and Gemini instantly returns your MVP scope, what to cut, a risk score, an hour-by-hour recovery plan, and a complete submission kit — README, pitch, and demo script included. It's a meta-hackathon tool that turns a confusing brief into a clear, submit-ready plan, so you spend your last hours shipping instead of guessing.`,
    readiness: {
      score: 62,
      verdict: "Needs polish",
      fixFirst: [
        "Lock and rehearse the 60-second happy-path demo",
        "Make the AI value unmistakable in the first 15 seconds",
        "Finish README and complete the submission checklist",
      ],
    },
  };
}

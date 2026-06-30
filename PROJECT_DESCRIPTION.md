# Brief2Ship AI — Project Description

**AI Brief-to-Submission Copilot**
_Turn any hackathon brief into a submit-ready MVP plan._

> Paste this into a Google Doc and share the link in the submission form.

---

## 1. One-line pitch

Brief2Ship AI reads any hackathon or assignment brief and instantly returns a clear MVP scope, what to cut, a risk score, an hour-by-hour recovery plan, and a complete submission kit (README, pitch, and demo script) — so solo builders spend their last hours shipping instead of guessing.

## 2. The problem

Most builders don't lose hackathons because they can't code. They lose because they:

- misunderstand the brief
- overbuild the wrong features
- miss required submission items (demo link, README, video)
- waste time on low-impact work
- fail to pitch their idea clearly
- submit late or incomplete

By the time they realize what mattered, the deadline has already killed the project.

## 3. The solution

Brief2Ship AI is a **meta-hackathon tool**. You paste a brief; Gemini analyzes it like a senior hackathon judge and returns a single, ruthlessly practical execution plan:

- **Analysis dashboard** — project title, problem summary, target user, deliverables, constraints, judging signals, and a submission **risk score**
- **Judge Lens** — exactly what judges score (clarity, working demo, AI relevance, feasibility, uniqueness, UI/UX, completeness) and how to satisfy each
- **MVP scope** — must-build vs nice-to-have vs a **cut list** with reasons
- **Recovery sprint plans** — concrete 2-hour, 6-hour, and 12-hour action plans
- **Task board** — kanban (Todo / Doing / Done) with priorities you can move
- **Submission kit** — README draft, 60-second pitch, demo script, and checklist, all copy-paste ready
- **Readiness score** out of 100 with a verdict ("Ready to submit" / "Needs polish" / "High risk")

## 4. How Gemini is used

The core intelligence is the **Gemini API via Google AI Studio**.

- `POST /api/analyze` sends the brief to Gemini (`gemini-2.5-flash`) with a senior-hackathon-judge system prompt and `responseMimeType: application/json` for strict, structured output.
- The JSON response drives the entire dashboard — this is not a chat wrapper; the AI produces the whole plan.
- The response is parsed and **normalized** so a partial or malformed reply never crashes the UI.
- If the API key is missing or a model is rate-limited, the app transparently falls back to a **high-quality mock**, and the UI shows whether the result is Gemini-powered or a fallback.

## 5. Why it's different

It is deliberately **not** a generic chatbot, todo app, or study planner. It targets a sharp, real pain — shipping under deadline pressure — and does one job exceptionally well, with a structured output that makes the AI value obvious in seconds.

## 6. Key features

- One-paste analysis with a staged, animated loading experience
- Interactive kanban task board
- Copy buttons for README, pitch, demo script, and checklist
- Risk and readiness score rings with color-coded verdicts
- LocalStorage persistence (refresh never loses your analysis)
- Full empty / loading / error / result / mock-fallback states
- Responsive dark SaaS dashboard (mobile + desktop)

## 7. Tech stack

Next.js 14 (App Router) · TypeScript · Tailwind CSS · Gemini API (Google AI Studio) · LocalStorage · deployed on Vercel.

## 8. Demo flow (60 seconds)

1. Click **Use Vibe2Ship Sample Brief**
2. Click **Analyze Brief**
3. Show the **submission risk score**
4. Show the **MVP scope** and **cut list**
5. Show the **recovery sprint plan**
6. Show the generated **README + pitch**
7. Show the **readiness score** and verdict

## 9. Links

- **Live app:** https://brief2ship-ai.vercel.app
- **GitHub repo:** https://github.com/iabhijais/brief2ship-ai
- **Demo video:** _<add your video link here>_

## 10. Future scope

- Export the full plan to PDF
- Shareable result links
- Multi-language brief support
- Deadline countdown that re-prioritizes the task board automatically

---

_Built for Vibe2Ship — a solo AI hackathon by Coding Ninjas 10X Club × Google for Developers._

import { NextResponse } from "next/server";
import { analyzeWithGemini } from "@/lib/gemini";
import { buildMockResult } from "@/lib/mockData";
import type { AnalyzeResponse } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let brief = "";
  try {
    const body = await req.json();
    brief = typeof body?.brief === "string" ? body.brief : "";
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body. Expected { brief: string }." },
      { status: 400 }
    );
  }

  if (!brief.trim()) {
    return NextResponse.json(
      { error: "Brief is empty. Paste a brief or use the sample." },
      { status: 400 }
    );
  }

  // Try Gemini first; on any failure fall back to a strong mock so the
  // product never hard-fails during a demo.
  try {
    const result = await analyzeWithGemini(brief);
    const payload: AnalyzeResponse = { result, source: "gemini" };
    return NextResponse.json(payload);
  } catch (err) {
    console.error("[analyze] Gemini failed, using mock:", err);
    const payload: AnalyzeResponse = {
      result: buildMockResult(brief),
      source: "mock",
    };
    return NextResponse.json(payload);
  }
}

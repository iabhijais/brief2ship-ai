"use client";

/**
 * Circular score gauge. `invert` flips the color logic so that a HIGH value is
 * "bad" (used for risk score) vs the default where HIGH is "good" (readiness).
 */
export default function ScoreRing({
  value,
  label,
  invert = false,
  size = 132,
}: {
  value: number;
  label?: string;
  invert?: boolean;
  size?: number;
}) {
  const v = Math.max(0, Math.min(100, value));
  const stroke = 10;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (v / 100) * circumference;

  // "goodness" 0..1 used to pick a color.
  const goodness = invert ? (100 - v) / 100 : v / 100;
  const color =
    goodness >= 0.66 ? "#34d399" : goodness >= 0.4 ? "#22d3ee" : "#f87171";

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.07)"
            strokeWidth={stroke}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 1s ease-out" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold tabular-nums text-white">{v}</span>
          <span className="text-[11px] uppercase tracking-wider text-slate-500">
            / 100
          </span>
        </div>
      </div>
      {label ? (
        <span className="mt-2 text-xs font-medium uppercase tracking-wider text-slate-400">
          {label}
        </span>
      ) : null}
    </div>
  );
}

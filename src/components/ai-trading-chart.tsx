"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const POINTS = 56;
const W = 800;
const H = 300;
const PAD_LEFT = 76;
const PAD_RIGHT = 18;
const PAD_TOP = 26;
const PAD_BOTTOM = 40;

function buildSeed(seed = 7) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function buildValues(count: number) {
  const rand = buildSeed();
  let v = 1;
  return Array.from({ length: count }, () => {
    v *= 1 + (rand() - 0.42) * 0.022;
    return v;
  });
}

export function AiTradingChart() {
  const [values, setValues] = useState<number[]>(() => buildValues(POINTS));
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setValues((prev) => {
        const last = prev[prev.length - 1];
        const next = last * (1 + (Math.random() - 0.42) * 0.018);
        return [...prev.slice(1), next];
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const chartW = W - PAD_LEFT - PAD_RIGHT;
  const chartH = H - PAD_TOP - PAD_BOTTOM;

  const { dataMin, dataMax } = useMemo(() => {
    const lo = Math.min(...values);
    const hi = Math.max(...values);
    const pad = (hi - lo || 1) * 0.14;
    return { dataMin: lo - pad, dataMax: hi + pad };
  }, [values]);

  const yOf = (v: number) => PAD_TOP + (1 - (v - dataMin) / (dataMax - dataMin)) * chartH;

  const { path, pts } = useMemo(() => {
    const xs = values.map((_, i) => PAD_LEFT + (i / (values.length - 1)) * chartW);
    const ys = values.map((v) => yOf(v));
    let d = `M ${xs[0]} ${ys[0]}`;
    for (let i = 1; i < xs.length; i++) {
      const cx = (xs[i - 1] + xs[i]) / 2;
      d += ` C ${cx} ${ys[i - 1]}, ${cx} ${ys[i]}, ${xs[i]} ${ys[i]}`;
    }
    return { path: d, pts: xs.map((x, i) => ({ x, y: ys[i] })) };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values, dataMin, dataMax]);

  const last = pts[pts.length - 1];
  const areaPath = `${path} L ${last.x} ${H - PAD_BOTTOM} L ${PAD_LEFT} ${H - PAD_BOTTOM} Z`;

  const start = values[0];
  const current = values[values.length - 1];
  const todayPct = ((current - start) / start) * 100;
  const up = todayPct >= 0;

  const value = 128400 * current;
  const fund = 100000 * current;

  const priceTicks = [0, 0.25, 0.5, 0.75, 1].map((t) => {
    const v = dataMin + (dataMax - dataMin) * t;
    return { y: yOf(v), label: `$${(128400 * v).toLocaleString("en-US", { maximumFractionDigits: 0 })}` };
  });

  const tradeMarks = values
    .map((v, i) => ({ v, i }))
    .filter(({ v, i }) => i > 2 && i < values.length - 1 && v < 0.992)
    .slice(-5);

  return (
    <div className="panel-glass overflow-hidden rounded-3xl">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[rgba(212,175,90,0.14)] px-7 py-5 md:px-8">
        <div className="flex items-center gap-3">
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--emerald-glow)] opacity-70" />
            <span className="relative inline-flex size-2 rounded-full bg-[var(--emerald-glow)]" />
          </span>
          <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[var(--gold-bright)]">
            AI Trading Performance
          </p>
          <span className="rounded-full border border-[var(--line)] bg-[#081912]/80 px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#8fae98]">
            Live
          </span>
        </div>
        <div className="flex items-center gap-6 font-mono">
          <div>
            <p className="text-[9px] uppercase tracking-[0.18em] text-[#7a9484]">Fund Value</p>
            <p className="text-lg font-semibold text-white">
              ${fund.toLocaleString("en-US", { maximumFractionDigits: 0 })}
            </p>
          </div>
          <div>
            <p className="text-[9px] uppercase tracking-[0.18em] text-[#7a9484]">Today P&L</p>
            <p className={`text-sm font-semibold ${up ? "text-[#35d07f]" : "text-[#ff5d5d]"}`}>
              {up ? "+" : ""}
              {todayPct.toFixed(2)}%
            </p>
          </div>
        </div>
      </div>

      <div className="px-2 pb-6 pt-3">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
          <defs>
            <linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1a9d5c" stopOpacity="0.34" />
              <stop offset="100%" stopColor="#1a9d5c" stopOpacity="0.01" />
            </linearGradient>
            <linearGradient id="chart-line" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#d4af5a" />
              <stop offset="100%" stopColor="#f0d48a" />
            </linearGradient>
          </defs>

          {priceTicks.map((t, i) => (
            <g key={i}>
              <line
                x1={PAD_LEFT}
                y1={t.y}
                x2={W - PAD_RIGHT}
                y2={t.y}
                stroke="rgba(212,175,90,0.09)"
                strokeDasharray="3 6"
              />
              <text x={PAD_LEFT - 10} y={t.y + 3} textAnchor="end" fontSize="10" className="fill-[#6f8779] font-mono">
                {t.label}
              </text>
            </g>
          ))}

          {tradeMarks.map((tm, i) => (
            <g key={i}>
              <circle cx={pts[tm.i].x} cy={pts[tm.i].y} r="10" fill="rgba(26,157,92,0.16)" />
              <circle cx={pts[tm.i].x} cy={pts[tm.i].y} r="4" fill="#35d07f" stroke="#081912" strokeWidth="2" />
            </g>
          ))}

          <path d={areaPath} fill="url(#chart-fill)" />
          <path
            d={path}
            fill="none"
            stroke="url(#chart-line)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <line
            x1={PAD_LEFT}
            y1={last.y}
            x2={W - PAD_RIGHT}
            y2={last.y}
            stroke="rgba(240,212,138,0.35)"
            strokeDasharray="2 4"
          />
          <line
            x1={last.x}
            y1={PAD_TOP}
            x2={last.x}
            y2={H - PAD_BOTTOM}
            stroke="rgba(240,212,138,0.22)"
            strokeDasharray="2 4"
          />
          <circle cx={last.x} cy={last.y} r="9" fill="rgba(240,212,138,0.25)" />
          <circle cx={last.x} cy={last.y} r="4.5" fill="#f0d48a" />
          <g>
            <rect x={last.x + 10} y={last.y - 16} rx="6" width="92" height="32" fill="#0e2418" stroke="rgba(240,212,138,0.45)" />
            <text x={last.x + 20} y={last.y + 4} fontSize="13" className="fill-[#f0d48a] font-mono font-semibold">
              ${value.toLocaleString("en-US", { maximumFractionDigits: 0 })} {up ? "↗" : "↘"}
            </text>
          </g>
        </svg>
        <div className="mt-3 flex items-center justify-between border-t border-[rgba(212,175,90,0.12)] px-6 pt-3 font-mono text-[10px] text-[#6f8779]">
          <span className="inline-flex items-center gap-2">
            <span className="size-1.5 animate-pulse rounded-full bg-[var(--emerald-glow)]" />
            AI engine active · auto-refresh 1s
          </span>
          <span>2x100 Global · Automated Trading</span>
        </div>
      </div>
    </div>
  );
}
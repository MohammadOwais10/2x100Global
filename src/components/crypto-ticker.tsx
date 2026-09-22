"use client";

import { useEffect, useRef, useState } from "react";

const pairs = [
  { symbol: "BTC", name: "Bitcoin" },
  { symbol: "ETH", name: "Ethereum" },
  { symbol: "USDT", name: "Tether" },
  { symbol: "BNB", name: "BNB" },
  { symbol: "SOL", name: "Solana" },
  { symbol: "XRP", name: "XRP" },
  { symbol: "ADA", name: "Cardano" },
  { symbol: "AVAX", name: "Avalanche" },
  { symbol: "LINK", name: "Chainlink" },
  { symbol: "DOGE", name: "Dogecoin" },
  { symbol: "TRX", name: "TRON" },
  { symbol: "DOT", name: "Polkadot" },
  { symbol: "MATIC", name: "Polygon" },
  { symbol: "LTC", name: "Litecoin" },
  { symbol: "SHIB", name: "Shiba Inu" },
  { symbol: "UNI", name: "Uniswap" },
];

const initialValues = [
  67000, 3450, 1.0, 585, 172, 0.62, 0.44, 38, 17.5, 0.15, 0.13, 7.2, 0.71, 84,
  0.000025, 9.4,
];
const initialChanges = [
  1.42, 2.18, 0.0, 1.05, -0.86, 0.54, -1.3, 0.22, -0.41, 0.9, 1.7, 0.35, -0.66,
  1.12, 2.4, -0.28,
];

function formatPrice(value: number) {
  if (value >= 1000) {
    return value.toLocaleString("en-US", { maximumFractionDigits: 0 });
  }
  if (value >= 1) {
    return value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
  return value.toLocaleString("en-US", {
    minimumFractionDigits: value < 0.1 ? 4 : 3,
    maximumFractionDigits: value < 0.1 ? 4 : 3,
  });
}

export function CryptoTicker() {
  const [prices, setPrices] = useState(initialValues);
  const [changes, setChanges] = useState(initialChanges);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setPrices((prev) =>
        prev.map((p, i) => {
          const drift = (Math.random() - 0.5) * 0.008;
          return Math.max(0.0001, p * (1 + drift));
        })
      );
      setChanges((prev) =>
        prev.map((c) => {
          const next = c + (Math.random() - 0.5) * 0.3;
          return Math.min(6, Math.max(-6, next));
        })
      );
    }, 1400);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const strip = [...Array(2)].map((_, loop) => (
    <span key={loop} className="flex items-center gap-12">
      {pairs.map((t, i) => {
        const up = changes[i] >= 0;
        return (
          <span key={`${loop}-${t.symbol}`} className="flex items-center gap-2.5">
            <span className="text-[12px] font-bold tracking-[0.12em] text-white">
              {t.symbol}
              <span className="ml-1 text-[#5f7a6a]">/USDT</span>
            </span>
            <span className="font-mono text-[12px] font-semibold text-white">
              ${formatPrice(prices[i])}
            </span>
            <span
              className={`font-mono text-[11px] font-semibold ${
                up ? "text-[#35d07f]" : "text-[#ff5d5d]"
              }`}
            >
              {up ? "▲" : "▼"} {Math.abs(changes[i]).toFixed(2)}%
            </span>
          </span>
        );
      })}
    </span>
  ));

  return (
    <div className="relative w-full overflow-hidden border-y border-[rgba(212,175,90,0.16)] bg-[#050d09]">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#050d09] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#050d09] to-transparent" />
      <div className="marquee-track flex w-max items-center gap-12 whitespace-nowrap py-3.5">
        {strip}
      </div>
    </div>
  );
}
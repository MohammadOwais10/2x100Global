"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { brand, hero } from "@/lib/content";

export function HeroSection() {
  const reduce = useReducedMotion();

  return (
    <section className="hero-glow relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 py-32 lg:px-10 lg:py-40">
      <div className="pointer-events-none absolute -right-24 top-16 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(26,157,92,0.18),transparent_68%)] blur-2xl" />
      <div className="pointer-events-none absolute -left-32 bottom-0 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(212,175,90,0.12),transparent_70%)] blur-2xl" />

      <div className="relative mx-auto flex w-full max-w-4xl flex-col items-center text-center">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative"
        >
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-40 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(26,157,92,0.22),transparent_70%)] blur-2xl" />
          <Image
            src="/logo.png"
            alt={`${brand.name} ${brand.suffix} emblem`}
            width={1200}
            height={480}
            className="relative h-28 w-auto object-contain sm:h-40"
            priority
          />
        </motion.div>

        <motion.h1
          initial={reduce ? false : { opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.05 }}
          className="mt-8 font-display text-[clamp(2.6rem,6vw,5rem)] leading-[0.95] tracking-[-0.03em] text-white"
        >
          <span className="block">{hero.headlineLine1}</span>
          <span className="gold-text block">{hero.headlineLine2}</span>
        </motion.h1>

        <motion.p
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.12 }}
          className="mx-auto mt-7 max-w-2xl text-base leading-relaxed text-[#b8c8bc] md:text-lg"
        >
          {hero.body}
        </motion.p>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.22 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-6"
        >
          <button
            type="button"
            className="group relative inline-flex cursor-pointer items-center gap-3 overflow-hidden rounded-full bg-[linear-gradient(135deg,#f0d48a,#d4af5a)] px-7 py-3.5 text-[12px] font-semibold uppercase tracking-[0.16em] text-[#1a1204] shadow-[0_16px_50px_rgba(212,175,90,0.35)]"
          >
            <span className="relative z-10">{hero.primaryCta}</span>
            <span className="relative z-10 transition group-hover:translate-x-0.5">
              →
            </span>
            <span className="absolute inset-0 translate-x-[-120%] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.35),transparent)] transition group-hover:translate-x-[120%] duration-700" />
          </button>
          <a
            href={hero.businessPlanPdf}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2.5 rounded-full border border-[rgba(240,212,138,0.45)] px-7 py-3.5 text-[12px] font-semibold uppercase tracking-[0.16em] text-[var(--gold-bright)] transition hover:border-[var(--gold-bright)] hover:bg-[rgba(240,212,138,0.1)]"
          >
            <svg
              className="size-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            {hero.secondaryCta}
          </a>
        </motion.div>

       
      </div>

      
    </section>
  );
}
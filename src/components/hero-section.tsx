"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { brand, introduction } from "@/lib/content";

export function HeroSection() {
  const reduce = useReducedMotion();

  return (
    <section className="hero-glow relative min-h-[100svh] overflow-hidden pt-28 pb-20 lg:pt-32">
      <div className="pointer-events-none absolute -right-24 top-16 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(26,157,92,0.18),transparent_68%)] blur-2xl" />
      <div className="pointer-events-none absolute -left-32 bottom-0 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(212,175,90,0.12),transparent_70%)] blur-2xl" />

      <div className="relative mx-auto grid max-w-7xl gap-14 px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-10 lg:px-10">
        <div>
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-5 text-[11px] font-medium uppercase tracking-[0.35em] text-[#8fae98]"
          >
            {brand.visionLine}
          </motion.p>
          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.05 }}
            className="font-display text-[clamp(2.4rem,5.5vw,4.6rem)] leading-[0.95] tracking-[-0.03em] text-white"
          >
            <span className="gold-text block">{brand.tagline}</span>
          </motion.h1>
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.12 }}
            className="mt-5 max-w-xl text-base leading-relaxed text-[#b8c8bc] md:text-lg"
          >
            {introduction.body}
          </motion.p>
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.75, delay: 0.18 }}
            className="mt-3 text-sm tracking-wide text-[#7a9484]"
          >
            {brand.taglineHi}
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.22 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <a
              href="#system"
              className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-[linear-gradient(135deg,#1a9d5c,#0f5c38)] px-7 py-3.5 text-[12px] font-semibold uppercase tracking-[0.16em] text-white shadow-[0_16px_50px_rgba(26,157,92,0.35)]"
            >
              <span className="relative z-10">Explore the Platform</span>
              <span className="relative z-10 transition group-hover:translate-x-0.5">
                →
              </span>
              <span className="absolute inset-0 translate-x-[-120%] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.22),transparent)] transition group-hover:translate-x-[120%] duration-700" />
            </a>
            <a
              href="#corporate"
              className="text-[12px] font-medium uppercase tracking-[0.18em] text-[var(--gold-bright)] underline-offset-4 hover:underline"
            >
              Corporate Profile
            </a>
          </motion.div>

          <div className="mt-14 grid max-w-lg grid-cols-2 gap-px overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--line)] sm:grid-cols-4">
            {brand.pillars.map((pillar) => (
              <div
                key={pillar}
                className="bg-[#06140d]/90 px-4 py-5 text-center backdrop-blur-sm"
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--gold-bright)]">
                  {pillar}
                </p>
              </div>
            ))}
          </div>
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-[560px] lg:max-w-none"
        >
          <div className="panel-glass relative overflow-hidden rounded-[2rem] p-3">
            <div className="absolute inset-x-8 top-0 h-px bg-[linear-gradient(90deg,transparent,var(--gold-bright),transparent)] opacity-70" />
            <Image
              src="/logo-2x100.png"
              alt="2X100 Global emblem"
              width={1200}
              height={480}
              className="float-soft w-full rounded-[1.5rem] object-contain"
              priority
            />
            <div className="mt-4 border-t border-[var(--line)] pt-5 text-center">
              <p className="text-[11px] uppercase tracking-[0.32em] text-[#8fae98]">
                {brand.motto}
              </p>
            </div>
          </div>
          <div className="absolute -bottom-6 -left-6 hidden rounded-2xl border border-[var(--line)] bg-[#06140d]/90 px-5 py-4 backdrop-blur md:block">
            <p className="text-[10px] uppercase tracking-[0.22em] text-[#7a9484]">
              Automated Digital Asset Trading
            </p>
            <p className="mt-1 font-display text-2xl text-white">AI · Code · Execute</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

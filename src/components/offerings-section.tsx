import { offerings } from "@/lib/content";
import { Reveal } from "@/components/reveal";

export function OfferingsSection() {
  return (
    <section id="offerings" className="relative border-y border-[var(--line)] py-24 lg:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_420px_at_50%_0%,rgba(26,157,92,0.12),transparent_60%)]" />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <Reveal>
            <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-[#8fae98]">
              What We Offer
            </p>
            <h2 className="mt-4 max-w-xl font-display text-4xl tracking-tight text-white md:text-5xl">
              One ecosystem. Multiple advantages.
            </h2>
          </Reveal>
          <Reveal delay={0.06}>
            <p className="max-w-md text-sm leading-relaxed text-[#93a89a]">
              Technology, security, and usability engineered together so members
              can focus on participation—not infrastructure.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 overflow-hidden rounded-3xl border border-[var(--line)]">
          <div className="hidden grid-cols-[1.1fr_1.4fr] bg-[#081912] text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--gold-bright)] md:grid">
            <div className="border-b border-[var(--line)] px-6 py-4">Feature</div>
            <div className="border-b border-l border-[var(--line)] px-6 py-4">
              Benefit
            </div>
          </div>
          {offerings.map((row, index) => (
            <Reveal key={row.feature} delay={index * 0.05}>
              <div className="grid border-b border-[var(--line)] bg-[#06140d]/70 last:border-b-0 md:grid-cols-[1.1fr_1.4fr]">
                <div className="px-6 py-5 md:py-6">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-[#6f8779] md:hidden">
                    Feature
                  </p>
                  <p className="mt-1 font-display text-xl text-white md:mt-0 md:text-2xl">
                    {row.feature}
                  </p>
                </div>
                <div className="border-t border-[var(--line)] px-6 py-5 md:border-l md:border-t-0 md:py-6">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-[#6f8779] md:hidden">
                    Benefit
                  </p>
                  <p className="mt-1 text-[#c5d4ca] md:mt-0">{row.benefit}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

import { brand } from "@/lib/content";

const pillarCopy = {
  Invest: "Structured access to modern market participation.",
  Trade: "Scheduled codes and disciplined execution windows.",
  Grow: "Long-term ecosystem design for wealth building.",
  Together: "A global member community moving in sync.",
} as const;

export function PillarBand() {
  return (
    <section id="platform" className="relative py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {brand.pillars.map((pillar, index) => (
            <article
              key={pillar}
              className="panel-glass relative overflow-hidden rounded-3xl p-6"
            >
              <div className="absolute right-4 top-4 font-display text-5xl text-white/5">
                0{index + 1}
              </div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--gold-bright)]">
                {pillar}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-[#b5c7bb]">
                {pillarCopy[pillar]}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

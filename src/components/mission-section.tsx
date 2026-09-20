import { missionVision } from "@/lib/content";
import { Reveal } from "@/components/reveal";

export function MissionSection() {
  return (
    <section id="mission" className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal>
          <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-[#8fae98]">
            Introduction
          </p>
          <h2 className="mt-4 max-w-3xl font-display text-4xl tracking-tight text-white md:text-5xl">
            Built for clarity in a complex market
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {[missionVision.mission, missionVision.vision].map((item, i) => (
            <Reveal key={item.title} delay={i * 0.08}>
              <article className="panel-glass group relative h-full overflow-hidden rounded-3xl p-8 md:p-10">
                <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[radial-gradient(circle,rgba(212,175,90,0.15),transparent_70%)] transition group-hover:scale-110" />
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-full border border-[var(--line)] bg-[#0a2015] text-sm font-semibold text-[var(--gold-bright)]">
                  {i === 0 ? "01" : "02"}
                </div>
                <h3 className="font-display text-2xl text-white md:text-3xl">
                  {item.title}
                </h3>
                <p className="mt-4 text-base leading-relaxed text-[#b5c7bb]">
                  {item.body}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

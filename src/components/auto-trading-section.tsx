import { autoTrading } from "@/lib/content";
import { Reveal } from "@/components/reveal";

export function AutoTradingSection() {
  return (
    <section id="system" className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal>
          <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-[#8fae98]">
            Auto-Trading System
          </p>
          <h2 className="mt-4 max-w-4xl font-display text-4xl leading-[1.02] tracking-tight text-white md:text-[3.25rem]">
            {autoTrading.title}
          </h2>
          <p className="mt-6 max-w-3xl text-base leading-relaxed text-[#b5c7bb] md:text-lg">
            {autoTrading.intro}
          </p>
        </Reveal>

        <div className="mt-14 grid gap-8 xl:grid-cols-[0.95fr_1.05fr_0.9fr]">
          <Reveal delay={0.05}>
            <div className="panel-glass h-full rounded-3xl p-7 md:p-8">
              <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-[var(--gold-bright)]">
                {autoTrading.schedule.label}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-[#a8bdb0]">
                {autoTrading.schedule.note}
              </p>
              <div className="mt-6 grid gap-3">
                {autoTrading.schedule.sessions.map((session) => (
                  <div
                    key={session.label}
                    className="rounded-2xl border border-[var(--line)] bg-[#081912]/80 px-5 py-4"
                  >
                    <p className="text-[10px] uppercase tracking-[0.22em] text-[#7a9484]">
                      {session.label}
                    </p>
                    <p className="mt-1 font-display text-3xl text-white">
                      {session.time}
                    </p>
                    <p className="mt-1 text-xs text-[#8fae98]">Global Standard Time</p>
                  </div>
                ))}
              </div>
              <a
                href="#contact"
                className="mt-8 inline-flex w-full items-center justify-center rounded-full border border-[var(--line)] bg-[#030806] px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--gold-bright)] transition hover:border-[var(--gold-bright)]"
              >
                {autoTrading.cta}
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="panel-glass h-full rounded-3xl p-7 md:p-8">
              <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-[var(--gold-bright)]">
                How It Works
              </p>
              <ol className="mt-6 space-y-4">
                {autoTrading.steps.map((step, index) => (
                  <li
                    key={step.title}
                    className="grid grid-cols-[auto_1fr] gap-4 rounded-2xl border border-[var(--line)] bg-[#081912]/55 px-4 py-4"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0f5c38] text-xs font-semibold text-white">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium text-white">{step.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-[#a8bdb0]">
                        {step.detail}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="panel-glass h-full rounded-3xl p-7 md:p-8">
              <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-[var(--gold-bright)]">
                Key Benefits
              </p>
              <ul className="mt-6 space-y-4">
                {autoTrading.benefits.map((item) => (
                  <li key={item.title} className="border-b border-[var(--line)] pb-4 last:border-0">
                    <p className="font-medium text-white">{item.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-[#a8bdb0]">
                      {item.detail}
                    </p>
                  </li>
                ))}
              </ul>
              <p className="mt-8 border-t border-[var(--line)] pt-6 text-center font-display text-lg italic text-[var(--gold-bright)]">
                {autoTrading.closing}
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

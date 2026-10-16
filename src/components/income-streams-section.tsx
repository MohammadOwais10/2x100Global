import { incomeStreams } from "@/lib/content";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/common/section-heading";

export function IncomeStreamsSection() {
  return (
    <section id="income" className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <SectionHeading
          eyebrow={incomeStreams.eyebrow}
          title={incomeStreams.title}
          intro={incomeStreams.intro}
        />

        <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {incomeStreams.sources.map((item, index) => (
            <Reveal key={item.name} delay={index * 0.04}>
              <article className="panel-glass flex h-full items-start gap-5 rounded-3xl p-6 md:p-7">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-[var(--line)] bg-[#0a2015] font-display text-lg text-[var(--gold-bright)]">
                  {index + 1}
                </span>
                <div>
                  <h3 className="font-display text-lg text-white md:text-xl">
                    {item.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#a8bdb0]">
                    {item.detail}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {incomeStreams.extra.map((item) => (
              <span
                key={item}
                className="rounded-full border border-[var(--line)] bg-[#06140d]/70 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--gold-bright)]"
              >
                {item}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

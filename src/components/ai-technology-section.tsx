import { aiTechnology } from "@/lib/content";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/common/section-heading";

export function AiTechnologySection() {
  return (
    <section
      id="ai"
      className="relative border-y border-[var(--line)] py-24 lg:py-32"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(800px_400px_at_80%_10%,rgba(212,175,90,0.10),transparent_60%)]" />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <SectionHeading
          eyebrow={aiTechnology.eyebrow}
          title={aiTechnology.title}
          intro={aiTechnology.intro}
        />

        <Reveal delay={0.08}>
          <div className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-[var(--line)] bg-[var(--line)] sm:grid-cols-2 lg:grid-cols-5">
            {aiTechnology.specs.map((spec) => (
              <div
                key={spec.label}
                className="bg-[#06140d] px-6 py-7 text-center"
              >
                <p className="gold-text font-display text-2xl md:text-3xl">
                  {spec.value}
                </p>
                <p className="mt-2 text-[10px] uppercase tracking-[0.22em] text-[#8fae98]">
                  {spec.label}
                </p>
              </div>
            ))}
          </div>
        </Reveal>

        <h3 className="mt-14 font-display text-2xl text-white md:text-3xl">
          {aiTechnology.howTitle}
        </h3>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1.3fr_1fr]">
          <Reveal delay={0.1}>
            <div className="grid gap-4">
              {aiTechnology.how.map((step, index) => (
                <div
                  key={step.title}
                  className="rounded-2xl border border-[var(--line)] bg-[#081912]/55 p-5"
                >
                  <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--gold-bright)]">
                    Step {index + 1}
                  </span>
                  <p className="mt-2 font-medium text-white">{step.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-[#a8bdb0]">
                    {step.detail}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="panel-glass h-full rounded-3xl p-7 md:p-8">
              <ul className="space-y-4">
                {aiTechnology.benefits.map((item) => (
                  <li
                    key={item.title}
                    className="border-b border-[var(--line)] pb-4 last:border-0 last:pb-0"
                  >
                    <p className="font-medium text-white">{item.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-[#a8bdb0]">
                      {item.detail}
                    </p>
                  </li>
                ))}
              </ul>
              <p className="mt-8 border-t border-[var(--line)] pt-6 text-center font-display text-lg italic text-[var(--gold-bright)]">
                {aiTechnology.closing}
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

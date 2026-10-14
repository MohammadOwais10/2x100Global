import { closing } from "@/lib/content";
import { Reveal } from "@/components/reveal";

export function ClosingSection() {
  return (
    <section
      id="closing"
      className="relative overflow-hidden border-t border-[var(--line)] py-24 lg:py-32"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_500px_at_50%_0%,rgba(26,157,92,0.16),transparent_65%)]" />
      <div className="relative mx-auto max-w-4xl px-6 text-center lg:px-10">
        <Reveal>
          <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-[var(--gold-bright)]">
            {closing.eyebrow}
          </p>
          <h2 className="mt-4 font-display text-4xl tracking-tight text-white md:text-5xl">
            {closing.title}
          </h2>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {closing.lines.map((line) => (
              <span
                key={line}
                className="rounded-full border border-[var(--line)] bg-[#06140d]/70 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#d8e2d8]"
              >
                {line}
              </span>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <p className="gold-text mt-10 font-display text-2xl md:text-3xl">
            {closing.note}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

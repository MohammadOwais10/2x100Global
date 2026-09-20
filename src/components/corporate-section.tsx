import { corporate, brand } from "@/lib/content";
import { Reveal } from "@/components/reveal";

export function CorporateSection() {
  return (
    <section id="corporate" className="relative py-24 lg:py-32">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-10">
        <Reveal>
          <div className="sticky top-28">
            <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-[#8fae98]">
              Corporate Information
            </p>
            <h2 className="mt-4 font-display text-4xl tracking-tight text-white md:text-5xl">
              {brand.name} {brand.suffix}
            </h2>
            <p className="mt-3 text-sm uppercase tracking-[0.2em] text-[var(--gold-bright)]">
              {corporate.entity}
            </p>
            <p className="mt-8 max-w-sm text-sm leading-relaxed text-[#93a89a]">
              Registered office and governance details for members, partners,
              and regulators.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="panel-glass rounded-[2rem] p-8 md:p-10">
            <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-[var(--gold-bright)]">
              Registered Office Address
            </p>
            <address className="mt-4 not-italic font-display text-2xl leading-snug text-white md:text-3xl">
              {corporate.address.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>
            <p className="mt-8 border-t border-[var(--line)] pt-8 text-base leading-relaxed text-[#b5c7bb]">
              {corporate.statement}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

import { advantages } from "@/lib/content";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/common/section-heading";

export function AdvantagesSection() {
  return (
    <section id="advantages" className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <SectionHeading
          eyebrow={advantages.eyebrow}
          title={advantages.title}
          intro={advantages.intro}
        />

        <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {advantages.items.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.05}>
              <article className="panel-glass group relative h-full overflow-hidden rounded-3xl p-7 md:p-8">
                <div className="absolute -right-2 -top-6 font-display text-7xl text-white/5">
                  0{index + 1}
                </div>
                <h3 className="relative font-display text-xl text-white md:text-2xl">
                  {item.title}
                </h3>
                <p className="relative mt-4 text-sm leading-relaxed text-[#b5c7bb]">
                  {item.detail}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

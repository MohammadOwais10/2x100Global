import { leadership } from "@/lib/content";
import { Reveal } from "@/components/reveal";

function initials(name: string) {
  const parts = name.split(" ").filter((part) => /^[A-Za-z]/.test(part));
  return parts
    .slice(-2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function LeadershipSection() {
  return (
    <section id="leadership" className="relative border-t border-[var(--line)] py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal>
          <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-[#8fae98]">
            Leadership Team
          </p>
          <h2 className="mt-4 max-w-2xl font-display text-4xl tracking-tight text-white md:text-5xl">
            Experience at the helm
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {leadership.map((person, index) => (
            <Reveal key={person.name} delay={index * 0.07}>
              <article className="panel-glass group relative overflow-hidden rounded-3xl p-7">
                <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full border border-[var(--line)] bg-[radial-gradient(circle_at_30%_20%,rgba(240,212,138,0.35),rgba(6,20,13,0.95))] font-display text-3xl text-[var(--gold-bright)] shadow-[0_0_40px_rgba(212,175,90,0.12)]">
                  {initials(person.name)}
                </div>
                <h3 className="mt-6 text-center font-display text-2xl text-white">
                  {person.name}
                </h3>
                <p className="mt-2 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-[#1a9d5c]">
                  {person.role}
                </p>
                <p className="mt-4 text-center text-sm leading-relaxed text-[#a8bdb0]">
                  {person.experience}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

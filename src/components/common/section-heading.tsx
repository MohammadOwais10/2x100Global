import { Reveal } from "@/components/reveal";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  intro?: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  className,
}: SectionHeadingProps) {
  const centered = align === "center";

  return (
    <Reveal className={className}>
      <div className={centered ? "text-center" : undefined}>
        <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-[#8fae98]">
          {eyebrow}
        </p>
        <h2
          className={`mt-4 font-display text-4xl tracking-tight text-white md:text-5xl ${
            centered ? "mx-auto max-w-3xl" : "max-w-3xl"
          }`}
        >
          {title}
        </h2>
        {intro ? (
          <p
            className={`mt-5 text-base leading-relaxed text-[#b5c7bb] md:text-lg ${
              centered ? "mx-auto max-w-2xl" : "max-w-2xl"
            }`}
          >
            {intro}
          </p>
        ) : null}
      </div>
    </Reveal>
  );
}

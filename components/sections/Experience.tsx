import { experience } from "@/lib/content";
import type { CSSProperties } from "react";
import SectionHeading from "@/components/ui/SectionHeading";

export default function Experience() {
  return (
    <section aria-labelledby="experience" className="py-16 lg:py-20">
      <div className="grid gap-10 lg:grid-cols-12">
        <SectionHeading id="experience" label="03 / experience" title="Experience" />

        <ol data-enter className="timeline relative lg:col-span-8">
          {/* timeline rail: draws down once it scrolls into view */}
          <span aria-hidden className="timeline-rail absolute left-[5px] top-8 bottom-8 w-px bg-gradient-to-b from-mint/60 via-blue/40 to-transparent" />
          {experience.map((r, i) => (
            <li key={r.company} className="relative pl-8 pb-5 last:pb-0">
              <span
                aria-hidden
                className="timeline-dot absolute left-0 top-[1.85rem] h-[11px] w-[11px] rounded-full border-2 border-graphite bg-mint"
                style={{ "--i": i } as CSSProperties}
              />
              <div className="glass rounded-2xl p-5 sm:p-6">
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                <h3 className="font-display text-lg font-semibold text-ink">
                  {r.role}
                  <span className="font-normal text-muted">, {r.company}</span>
                </h3>
                <p className="font-mono text-[0.8rem] text-meta">{r.period}</p>
              </div>
              <ul className="mt-4 max-w-[34rem] space-y-2.5">
                {r.points.map((pt) => (
                  <li key={pt} className="text-[0.9375rem] leading-relaxed text-ink/85">
                    {pt}
                  </li>
                ))}
              </ul>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

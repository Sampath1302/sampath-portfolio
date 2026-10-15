import { experience } from "@/lib/content";
import SectionHeading from "@/components/ui/SectionHeading";

export default function Experience() {
  return (
    <section aria-labelledby="experience" className="border-t border-line py-20 lg:py-24">
      <div className="grid gap-10 lg:grid-cols-12">
        <SectionHeading id="experience" title="Experience" />

        <ol className="relative lg:col-span-8">
          {/* timeline rail */}
          <span aria-hidden className="absolute left-[5px] top-2 bottom-2 w-px bg-line" />
          {experience.map((r) => (
            <li key={r.company} className="relative pl-9 pb-12 last:pb-0">
              <span
                aria-hidden
                className="absolute left-0 top-[0.45rem] h-[11px] w-[11px] rounded-full border-2 border-night bg-muted"
              />
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                <h3 className="text-lg font-semibold text-ink">
                  {r.role}
                  <span className="font-normal text-muted">, {r.company}</span>
                </h3>
                <p className="text-sm tabular-nums text-muted">{r.period}</p>
              </div>
              <ul className="mt-4 max-w-[40rem] space-y-2.5">
                {r.points.map((pt) => (
                  <li key={pt} className="text-[0.9375rem] leading-relaxed text-ink/85">
                    {pt}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

import { education } from "@/lib/content";
import SectionHeading from "@/components/ui/SectionHeading";

export default function Education() {
  return (
    <section aria-labelledby="education" className="py-16 lg:py-20">
      <div className="grid gap-10 lg:grid-cols-12">
        <SectionHeading id="education" label="04 / education" title="Education" />

        <ul className="space-y-4 lg:col-span-8">
          {education.map((e) => (
            <li key={e.degree} className="glass flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 rounded-2xl p-5 sm:p-6">
              <div>
                <h3 className="font-display text-lg font-semibold text-ink">{e.degree}</h3>
                <p className="mt-1 text-[0.9375rem] text-muted">{e.school}</p>
              </div>
              <p className="font-mono text-[0.8rem] text-meta">
                {e.year} · {e.detail}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

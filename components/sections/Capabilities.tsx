import { capabilities, currentlyLearning } from "@/lib/content";
import SectionHeading from "@/components/ui/SectionHeading";

export default function Capabilities() {
  return (
    <section aria-labelledby="skills" className="border-t border-line py-20 lg:py-24">
      <div className="grid gap-10 lg:grid-cols-12">
        <SectionHeading id="skills" title="What I work on" />

        <div className="lg:col-span-8">
          <div className="grid gap-10 sm:grid-cols-3 sm:gap-8">
            {capabilities.map((c) => (
              <div key={c.title}>
                <h3 className="text-[1.0625rem] font-semibold leading-snug text-ink">{c.title}</h3>
                <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-muted">{c.description}</p>
                <ul className="mt-4 space-y-1.5 text-sm text-ink/85">
                  {c.tools.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <p className="mt-12 border-l-2 border-signal pl-4 text-[0.9375rem] leading-relaxed text-muted">
            <span className="font-medium text-ink">Currently learning: </span>
            {currentlyLearning}
          </p>
        </div>
      </div>
    </section>
  );
}

import { capabilities, currentlyLearning, securityOperations } from "@/lib/content";
import SectionHeading from "@/components/ui/SectionHeading";

export default function Capabilities() {
  return (
    <section aria-labelledby="skills" className="py-16 lg:py-20">
      <div className="grid gap-10 lg:grid-cols-12">
        <SectionHeading id="skills" label="01 / skills" title="What I work on" />

        <div className="lg:col-span-8">
          <div className="grid gap-4 sm:grid-cols-3">
            {capabilities.map((c) => (
              <div key={c.title} className="glass rounded-2xl p-6">
                <h3 className="font-display text-[1.125rem] font-semibold leading-snug text-ink">{c.title}</h3>
                <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-muted">{c.description}</p>
                <ul className="mt-4 space-y-1.5 border-t border-white/[0.06] pt-4 font-mono text-[0.8125rem] text-ink/85">
                  {c.tools.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="glass mt-4 rounded-2xl p-6">
            <h3 className="font-display text-[1.125rem] font-semibold leading-snug text-ink">Security operations experience</h3>
            <ul className="mt-4 grid gap-x-8 gap-y-2.5 border-t border-white/[0.06] pt-4 sm:grid-cols-2">
              {securityOperations.map((s) => (
                <li key={s} className="flex gap-2.5 text-[0.9375rem] leading-relaxed text-muted">
                  <span aria-hidden className="mt-[0.6rem] h-1 w-1 shrink-0 rounded-full bg-mint/70" />
                  {s}
                </li>
              ))}
            </ul>
          </div>

          <p className="mt-8 max-w-[36rem] border-l-2 border-blue pl-4 text-[0.9375rem] leading-relaxed text-muted">
            <span className="font-medium text-ink">Currently learning: </span>
            {currentlyLearning}
          </p>
        </div>
      </div>
    </section>
  );
}

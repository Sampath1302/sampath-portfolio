import { recognition } from "@/lib/content";
import SectionHeading from "@/components/ui/SectionHeading";

export default function Achievements() {
  return (
    <section aria-labelledby="recognition" className="py-16 lg:py-20">
      <div className="grid gap-10 lg:grid-cols-12">
        <SectionHeading id="recognition" label="06 / recognition" title="Hackathons and CTFs" />

        <ul className="grid gap-4 sm:grid-cols-3 lg:col-span-8">
          {recognition.map((r) => (
            <li key={r.title} className="glass rounded-2xl p-6">
              <p className="font-display text-xl font-semibold leading-tight text-ink">{r.result}</p>
              <h3 className="mt-2 text-[0.9375rem] font-medium text-ink/85">{r.title}</h3>
              <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-muted">{r.detail}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

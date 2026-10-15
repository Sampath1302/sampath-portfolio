import { recognition } from "@/lib/content";
import SectionHeading from "@/components/ui/SectionHeading";

export default function Achievements() {
  return (
    <section aria-labelledby="recognition" className="border-t border-line py-20 lg:py-24">
      <div className="grid gap-10 lg:grid-cols-12">
        <SectionHeading id="recognition" title="Hackathons and CTFs" />

        <ul className="grid gap-8 sm:grid-cols-3 lg:col-span-8">
          {recognition.map((r) => (
            <li key={r.title}>
              <p className="font-display text-xl font-semibold leading-tight text-ink">{r.result}</p>
              <h3 className="mt-2 text-[0.9375rem] font-medium text-ink/85">{r.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{r.detail}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

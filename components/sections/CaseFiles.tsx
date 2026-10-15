import Link from "next/link";
import { projects } from "@/lib/content";
import SectionHeading from "@/components/ui/SectionHeading";
import StatusTag from "@/components/ui/StatusTag";

export default function CaseFiles() {
  return (
    <section aria-labelledby="work" className="border-t border-line py-20 lg:py-24">
      <div className="grid gap-10 lg:grid-cols-12">
        <SectionHeading id="work" title="Projects">
          Each one has a full write-up with an interactive walkthrough.
        </SectionHeading>

        <ol className="lg:col-span-8">
          {projects.map((p) => (
            <li key={p.slug} className="border-t border-line py-9 first:border-t-0 first:pt-0 last:pb-0">
              <article className="grid gap-5 md:grid-cols-[11rem_1fr] md:gap-8">
                <div>
                  <h3 className="font-display text-2xl font-semibold leading-tight text-ink">{p.title}</h3>
                  <p className="mt-1.5 text-sm text-muted">{p.kind}</p>
                  <div className="mt-3">
                    <StatusTag
                      label={p.status === "complete" ? "Complete" : "In progress"}
                      tone={p.status === "complete" ? "resolved" : "signal"}
                    />
                  </div>
                </div>

                <div className="max-w-[38rem]">
                  <p className="text-[1rem] leading-[1.65] text-ink/90">{p.description}</p>

                  <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-muted">
                    {p.highlights.map((h) => (
                      <li key={h} className="flex items-center gap-2">
                        <span aria-hidden className="h-1 w-1 rounded-full bg-faint" />
                        {h}
                      </li>
                    ))}
                  </ul>

                  {p.evaluation && (
                    <p className="mt-4 text-sm leading-relaxed text-muted">{p.evaluation}</p>
                  )}

                  <p className="mt-4 text-sm text-faint">
                    <span className="sr-only">Built with: </span>
                    {p.stack.join(", ")}
                  </p>

                  <Link
                    href={`/projects/${p.slug}`}
                    className="mt-5 inline-block text-[0.9375rem] font-medium text-signal underline decoration-signal/40 underline-offset-4 transition-colors hover:decoration-signal"
                  >
                    Read the {p.title} write-up
                  </Link>
                </div>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

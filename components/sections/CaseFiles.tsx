import Link from "next/link";
import { ViewTransition, type CSSProperties } from "react";
import { projects } from "@/lib/content";
import SectionHeading from "@/components/ui/SectionHeading";
import StatusTag from "@/components/ui/StatusTag";
import CaseFilm from "@/components/ui/CaseFilm";

export default function CaseFiles() {
  return (
    <section aria-labelledby="work" className="py-16 lg:py-20">
      <div className="grid gap-10 lg:grid-cols-12">
        <SectionHeading id="work" label="02 / case files" title="Projects">
          Each one has a short case file film, a full write-up and an interactive walkthrough.
        </SectionHeading>
      </div>

      <ol className="mt-12 space-y-6 lg:mt-16">
        {projects.map((p) => (
          <li key={p.slug}>
            <article
              data-spotlight
              style={{ "--spot-size": "520px" } as CSSProperties}
              className="glass grid gap-x-10 gap-y-6 rounded-[20px] p-5 sm:p-8 lg:grid-cols-12"
            >
              <header className="lg:col-span-8">
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
                  <ViewTransition name={`project-title-${p.slug}`}>
                    <h3 className="font-display text-[1.75rem] font-semibold leading-tight tracking-[-0.01em] text-ink sm:text-[2rem]">
                      {p.title}
                    </h3>
                  </ViewTransition>
                  <span className="font-mono text-[0.75rem] uppercase text-meta">{p.category}</span>
                  <StatusTag
                    label={p.status === "complete" ? "Complete" : "In progress"}
                    tone={p.status === "complete" ? "mint" : "blue"}
                  />
                </div>
                <p className="mt-1.5 text-[0.9375rem] text-muted">
                  {p.summary}.
                </p>
              </header>

              <CaseFilm slug={p.slug} title={p.title} className="self-start lg:col-span-8 lg:row-start-2" />

              <div className="max-w-[34rem] lg:col-span-4 lg:col-start-9 lg:row-start-2">
                <p className="text-[1rem] leading-[1.65] text-ink/90">{p.description}</p>

                <ul className="mt-5 space-y-1.5 text-[0.9375rem] text-muted">
                  {p.highlights.map((h) => (
                    <li key={h} className="flex gap-2.5">
                      <span aria-hidden className="mt-[0.6rem] h-1 w-1 shrink-0 rounded-full bg-mint/70" />
                      {h}
                    </li>
                  ))}
                </ul>

                {p.evaluation && (
                  <p className="mt-5 text-[0.9375rem] leading-relaxed text-muted">{p.evaluation}</p>
                )}

                <p className="mt-5 font-mono text-[0.8125rem] leading-relaxed text-meta">
                  <span className="sr-only">Built with: </span>
                  {p.stack.join(", ")}
                </p>

                <Link
                  href={`/projects/${p.slug}`}
                  className="mt-6 inline-block text-[0.9375rem] font-medium text-mint link-sweep"
                >
                  Read the {p.title} write-up
                </Link>
              </div>
            </article>
          </li>
        ))}
      </ol>
    </section>
  );
}

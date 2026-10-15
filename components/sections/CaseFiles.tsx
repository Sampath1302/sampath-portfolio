import Link from "next/link";
import { ViewTransition, type CSSProperties } from "react";
import { projects } from "@/lib/content";
import SectionHeading from "@/components/ui/SectionHeading";
import StatusTag from "@/components/ui/StatusTag";
import ProjectClip from "@/components/ui/ProjectClip";

export default function CaseFiles() {
  return (
    <section aria-labelledby="work" className="border-t border-line py-24 lg:py-32">
      <div className="grid gap-10 lg:grid-cols-12">
        <SectionHeading id="work" title="Projects">
          Each one has a full write-up with an interactive walkthrough.
        </SectionHeading>
      </div>

      <ol className="mt-14 lg:mt-20">
        {projects.map((p) => (
          <li key={p.slug} className="border-t border-line py-14 first:border-t-0 first:pt-0 last:pb-0 lg:py-20">
            <article
              data-spotlight
              style={{ "--spot-size": "520px", "--spot-color": "var(--color-surface)" } as CSSProperties}
              className="grid gap-x-10 gap-y-6 lg:grid-cols-12"
            >
              <header className="lg:col-span-8">
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
                  <ViewTransition name={`project-title-${p.slug}`}>
                    <h3 className="font-display text-[1.75rem] font-semibold leading-tight tracking-[-0.01em] text-ink sm:text-[2rem]">
                      {p.title}
                    </h3>
                  </ViewTransition>
                  <StatusTag
                    label={p.status === "complete" ? "Complete" : "In progress"}
                    tone={p.status === "complete" ? "resolved" : "signal"}
                  />
                </div>
                <p className="mt-1.5 text-[0.9375rem] text-muted">
                  {p.summary}.
                </p>
              </header>

              <ProjectClip
                slug={p.slug}
                label={`${p.title} walkthrough: ${p.summary}`}
                className="self-start lg:col-span-8 lg:row-start-2"
              />

              <div className="max-w-[34rem] lg:col-span-4 lg:col-start-9 lg:row-start-2">
                <p className="text-[1rem] leading-[1.65] text-ink/90">{p.description}</p>

                <ul className="mt-5 space-y-1.5 text-[0.9375rem] text-muted">
                  {p.highlights.map((h) => (
                    <li key={h} className="flex gap-2.5">
                      <span aria-hidden className="mt-[0.6rem] h-1 w-1 shrink-0 rounded-full bg-muted" />
                      {h}
                    </li>
                  ))}
                </ul>

                {p.evaluation && (
                  <p className="mt-5 text-[0.9375rem] leading-relaxed text-muted">{p.evaluation}</p>
                )}

                <p className="mt-5 text-[0.9375rem] leading-relaxed text-muted">
                  <span className="sr-only">Built with: </span>
                  {p.stack.join(", ")}
                </p>

                <Link
                  href={`/projects/${p.slug}`}
                  className="mt-6 inline-block text-[0.9375rem] font-medium text-signal link-sweep"
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

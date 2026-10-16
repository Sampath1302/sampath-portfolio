import Link from "next/link";
import { ViewTransition, type ReactNode } from "react";
import { projects, type Project } from "@/lib/content";
import StatusTag from "@/components/ui/StatusTag";
import ProjectClip from "@/components/ui/ProjectClip";

export interface PipelineStep {
  label: string;
  detail: string;
}

export interface SampleRun {
  command: string;
  lines: { label: string; value?: string }[];
  note?: string;
}

interface ProjectWriteupProps {
  project: Project;
  /** Longer intro paragraph under the title */
  intro: string;
  pipeline: PipelineStep[];
  capabilities: string[];
  stack: string[];
  sampleRun?: SampleRun;
  lessons: string[];
  /** Project-specific sections, rendered after "What it does" */
  extra?: ReactNode;
  /** Interactive demo, rendered full width */
  demo?: ReactNode;
  /** Button that replays the intro walkthrough */
  onWatchWalkthrough?: () => void;
}

/** A titled row in the write-up: heading on the left, content on the right. */
export function WriteupSection({
  title,
  note,
  children,
}: {
  title: string;
  note?: string;
  children: ReactNode;
}) {
  return (
    <section className="grid gap-6 border-t border-white/[0.06] py-14 lg:grid-cols-12 lg:gap-10">
      <div className="lg:col-span-4">
        <h2 className="font-display text-2xl font-semibold leading-tight text-ink sm:text-[1.875rem]">{title}</h2>
        {note && <p className="mt-2.5 max-w-xs text-[0.9375rem] leading-relaxed text-muted">{note}</p>}
      </div>
      <div className="min-w-0 lg:col-span-8">{children}</div>
    </section>
  );
}

export default function ProjectWriteup({
  project,
  intro,
  pipeline,
  capabilities,
  stack,
  sampleRun,
  lessons,
  extra,
  demo,
  onWatchWalkthrough,
}: ProjectWriteupProps) {
  const index = projects.findIndex((p) => p.slug === project.slug);
  const next = projects[(index + 1) % projects.length];

  return (
    <main id="main" className="mx-auto max-w-[1240px] px-5 pt-28 pb-16 sm:px-8 sm:pt-32">
      <Link href="/#work" className="font-mono text-[0.8125rem] text-meta link-sweep hover:text-ink">
        Back to all projects
      </Link>

      {/* Header */}
      <header className="grid gap-10 pt-10 pb-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-8">
          <p className="flex items-center gap-2.5 font-mono text-[0.8125rem] text-meta">
            <span aria-hidden className="h-px w-5 bg-gradient-to-r from-mint to-blue" />
            {project.kind}
          </p>
          {/* shares its name with the home page row, so the title glides between pages */}
          <ViewTransition name={`project-title-${project.slug}`}>
            <h1 className="metal mt-3 pb-[0.06em] font-display text-[3rem] font-bold leading-[0.95] tracking-[-0.025em] sm:text-[4.5rem]">
              {project.title}
            </h1>
          </ViewTransition>
          <p className="mt-6 max-w-[38rem] text-[1.0625rem] leading-[1.65] text-ink/85">{intro}</p>
        </div>

        <dl className="glass grid h-fit grid-cols-2 gap-x-6 gap-y-5 rounded-[20px] p-6 text-sm lg:col-span-4 lg:grid-cols-1">
          <div>
            <dt className="font-mono text-[0.75rem] text-meta">Status</dt>
            <dd className="mt-1">
              <StatusTag
                label={project.status === "complete" ? "Complete" : "In progress"}
                tone={project.status === "complete" ? "mint" : "blue"}
              />
            </dd>
          </div>
          <div>
            <dt className="font-mono text-[0.75rem] text-meta">Focus</dt>
            <dd className="mt-1 text-ink">{project.category}</dd>
          </div>
          <div className="col-span-2 lg:col-span-1">
            <dt className="font-mono text-[0.75rem] text-meta">Built with</dt>
            <dd className="mt-1 leading-relaxed text-ink">{stack.join(", ")}</dd>
          </div>
        </dl>

        <figure className="lg:col-span-8">
          <ProjectClip
            slug={project.slug}
            label={`${project.title} walkthrough: ${project.summary}`}
          />
          {onWatchWalkthrough && (
            <figcaption className="mt-3 flex flex-wrap items-center justify-between gap-3 text-[0.9375rem] text-muted">
              <span>{project.summary}.</span>
              <button
                type="button"
                onClick={onWatchWalkthrough}
                className="py-2.5 text-mint link-sweep"
              >
                Open the live version
              </button>
            </figcaption>
          )}
        </figure>
      </header>

      <WriteupSection title="How it works" note="The path a request or alert takes through the system.">
        <ol className="relative">
          <span aria-hidden className="absolute left-[0.6875rem] top-3 bottom-3 w-px bg-gradient-to-b from-mint/50 to-blue/30" />
          {pipeline.map((step, i) => (
            <li key={step.label} className="relative flex gap-5 pb-6 last:pb-0">
              <span className="relative z-10 flex h-[1.375rem] w-[1.375rem] shrink-0 items-center justify-center rounded-full border border-mint/40 bg-graphite font-mono text-[0.6875rem] font-medium text-mint">
                {i + 1}
              </span>
              <div className="-mt-0.5">
                <p className="font-medium text-ink">{step.label}</p>
                <p className="mt-0.5 text-[0.9375rem] text-muted">{step.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </WriteupSection>

      <WriteupSection title="What it does">
        <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
          {capabilities.map((c) => (
            <li key={c} className="flex gap-3 text-[0.9375rem] leading-snug text-ink/90">
              <span aria-hidden className="mt-[0.55rem] h-1 w-1 shrink-0 rounded-full bg-mint/70" />
              {c}
            </li>
          ))}
        </ul>
      </WriteupSection>

      {extra}

      {demo && (
        <section className="border-t border-white/[0.06] py-14">
          <h2 className="font-display text-2xl font-semibold leading-tight text-ink sm:text-[1.875rem]">Try it</h2>
          <p className="mt-2.5 max-w-[38rem] text-[0.9375rem] leading-relaxed text-muted">
            A simulated, interactive version of the workflow. The data is made up for the demo.
          </p>
          <div className="mt-8">{demo}</div>
        </section>
      )}

      {sampleRun && (
        <WriteupSection title="Example run" note={sampleRun.note ?? "Illustrative output from a test run."}>
          <div className="glass overflow-x-auto rounded-2xl">
            <pre className="p-5 font-mono text-[0.8125rem] leading-[1.8] text-muted">
              <span className="text-mint">$ </span>
              <span className="text-ink">{sampleRun.command}</span>
              {"\n"}
              {sampleRun.lines.map((l) => (
                <span key={l.label} className="block">
                  <span className="text-mint">[ok]</span> {l.label}
                  {l.value && <span className="text-ink">  {l.value}</span>}
                </span>
              ))}
            </pre>
          </div>
        </WriteupSection>
      )}

      <WriteupSection title="What I learned">
        <div className="max-w-[38rem] space-y-4 text-[1rem] leading-[1.7] text-ink/85">
          {lessons.map((l) => (
            <p key={l}>{l}</p>
          ))}
        </div>
      </WriteupSection>

      <nav aria-label="Next project" className="border-t border-white/[0.06] pt-10">
        <p className="font-mono text-[0.8125rem] text-meta">Next project</p>
        <Link
          href={`/projects/${next.slug}`}
          className="group mt-2 inline-block font-display text-3xl font-semibold text-ink transition-colors hover:text-mint sm:text-4xl"
        >
          {next.title}
          <span className="mt-1 block font-sans text-[0.9375rem] font-normal text-muted">{next.summary}</span>
        </Link>
      </nav>
    </main>
  );
}

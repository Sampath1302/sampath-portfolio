import { siteConfig } from "@/lib/siteConfig";
import CaseQueue from "@/components/ui/CaseQueue";

export default function Hero() {
  return (
    <section aria-labelledby="hero-title" className="pt-32 pb-20 sm:pt-40 lg:pb-28">
      <div className="grid items-end gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-6">
          <p className="mb-8 inline-flex items-center gap-2 text-sm text-muted">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-resolved" />
            Open to SOC analyst roles
          </p>

          <h1
            id="hero-title"
            className="font-display text-[3.5rem] font-semibold leading-[0.92] tracking-[-0.025em] text-ink sm:text-[5rem] lg:text-[6.25rem]"
          >
            Sampath
            <br />
            Kumar MS
          </h1>

          <p className="mt-6 font-display text-xl font-medium text-ink/80 sm:text-2xl">
            {siteConfig.role}
          </p>

          <p className="mt-6 max-w-[34rem] text-[1.0625rem] leading-[1.65] text-muted">
            I&apos;m a 2026 cybersecurity graduate in Bengaluru focused on blue-team work:
            investigating alerts, automating incident response, and testing the systems I
            defend. EC-Council CSA, CND, CEH and CHFI certified.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href={`mailto:${siteConfig.email}`}
              className="rounded-md bg-signal px-5 py-2.5 text-[0.9375rem] font-semibold text-night transition-colors hover:bg-[#f5c562]"
            >
              Email me
            </a>
            <a
              href={siteConfig.github}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border border-line px-5 py-2.5 text-[0.9375rem] font-medium text-ink transition-colors hover:border-muted"
            >
              GitHub
            </a>
            <a
              href={siteConfig.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border border-line px-5 py-2.5 text-[0.9375rem] font-medium text-ink transition-colors hover:border-muted"
            >
              LinkedIn
            </a>
          </div>
        </div>

        <div className="lg:col-span-6 lg:pl-6">
          <CaseQueue />
        </div>
      </div>
    </section>
  );
}

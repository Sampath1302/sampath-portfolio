import { siteConfig } from "@/lib/siteConfig";
import SectionHeading from "@/components/ui/SectionHeading";

export default function Contact() {
  const year = new Date().getFullYear();

  return (
    <section aria-labelledby="contact" className="pt-16 pb-10 lg:pt-20">
      <div className="glass grid gap-10 rounded-[24px] p-6 sm:p-10 lg:grid-cols-12">
        <SectionHeading id="contact" label="06 / contact" title="Let&apos;s talk." />

        <div className="lg:col-span-8">
          <p className="max-w-[34rem] text-[1.0625rem] leading-relaxed text-muted">
            I&apos;m looking for SOC analyst and security operations roles in Bengaluru or remote.
            Email is the fastest way to reach me.
          </p>

          <a
            href={`mailto:${siteConfig.email}`}
            className="mt-6 inline-block break-all font-display text-2xl font-semibold text-mint link-sweep sm:text-3xl"
          >
            {siteConfig.email.toLowerCase()}
          </a>

          <ul className="mt-8 flex flex-wrap items-center gap-3 text-[0.9375rem]">
            <li>
              <a
                href={siteConfig.github}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-glass inline-block rounded-xl px-5 py-2.5 font-medium transition-colors"
              >
                GitHub
              </a>
            </li>
            <li>
              <a
                href={siteConfig.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-glass inline-block rounded-xl px-5 py-2.5 font-medium transition-colors"
              >
                LinkedIn
              </a>
            </li>
            <li className="ml-2 font-mono text-[0.8125rem] text-meta">{siteConfig.location}</li>
          </ul>
        </div>
      </div>

      <footer className="mt-20 flex flex-wrap justify-between gap-4 border-t border-white/[0.06] pt-6 font-mono text-[0.78rem] text-meta">
        <p>© {year} {siteConfig.name}</p>
        <p>Built with Next.js, set in Chakra Petch, IBM Plex Sans and JetBrains Mono</p>
      </footer>
    </section>
  );
}

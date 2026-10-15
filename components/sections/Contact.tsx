import { siteConfig } from "@/lib/siteConfig";

export default function Contact() {
  const year = new Date().getFullYear();

  return (
    <section aria-labelledby="contact" className="border-t border-line pt-20 pb-10 lg:pt-28">
      <h2
        id="contact"
        className="font-display text-[2.5rem] font-semibold leading-[1] tracking-[-0.02em] text-ink sm:text-[3.5rem]"
      >
        Let&apos;s talk.
      </h2>
      <p className="mt-5 max-w-[34rem] text-[1.0625rem] leading-relaxed text-muted">
        I&apos;m looking for SOC analyst and security operations roles in Bengaluru or remote.
        Email is the fastest way to reach me.
      </p>

      <a
        href={`mailto:${siteConfig.email}`}
        className="mt-8 inline-block break-all font-display text-2xl font-medium text-signal underline decoration-signal/40 underline-offset-[6px] transition-colors hover:decoration-signal sm:text-3xl"
      >
        {siteConfig.email.toLowerCase()}
      </a>

      <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-[0.9375rem]">
        <li>
          <a
            href={siteConfig.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-ink underline decoration-line underline-offset-4 transition-colors hover:decoration-ink"
          >
            GitHub
          </a>
        </li>
        <li>
          <a
            href={siteConfig.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-ink underline decoration-line underline-offset-4 transition-colors hover:decoration-ink"
          >
            LinkedIn
          </a>
        </li>
        <li className="text-muted">{siteConfig.location}</li>
      </ul>

      <footer className="mt-20 flex flex-wrap justify-between gap-4 border-t border-line pt-6 text-sm text-muted">
        <p>© {year} {siteConfig.name}</p>
        <p>Built with Next.js and set in IBM Plex</p>
      </footer>
    </section>
  );
}

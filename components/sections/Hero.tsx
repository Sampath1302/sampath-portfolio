import type { CSSProperties } from "react";
import { siteConfig } from "@/lib/siteConfig";
import { heroIntro, heroSpec } from "@/lib/content";
import CommandDeck from "@/components/ui/CommandDeck";
import SocWall from "@/components/ui/SocWall";

const command = "whoami --brief";

export default function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden">
      <SocWall />

      <div className="mx-auto flex max-w-[1240px] flex-wrap items-center gap-14 px-5 pt-32 pb-20 sm:px-8 lg:min-h-[900px] lg:flex-nowrap lg:pt-36 lg:pb-24">
        <div className="min-w-0 flex-[1_1_520px]">
          <p className="rise mb-6 font-mono text-[0.92rem] text-meta" style={{ "--d": "0.1s" } as CSSProperties}>
            <span className="text-mint">sampath@soc</span>:~${" "}
            <span className="relative inline-block text-ink">
              <span className="typ inline-block whitespace-nowrap">{command}</span>
              <span
                aria-hidden
                className="caret absolute top-[0.12em] left-[3px] h-[1.1em] w-[9px] bg-mint"
                style={{ "--chars": `${command.length}ch` } as CSSProperties}
              />
            </span>
          </p>

          <h1
            id="hero-title"
            className="rise metal pb-[0.06em] font-display text-[3.75rem] font-bold leading-[0.92] tracking-[-0.025em] sm:text-[5rem] xl:text-[6.4rem]"
            style={{ "--d": "0.25s" } as CSSProperties}
          >
            Sampath
            <br />
            Kumar MS
          </h1>

          <div className="rise" style={{ "--d": "0.4s" } as CSSProperties}>
            <div className="mt-6 flex items-center gap-3.5">
              <span aria-hidden className="hidden h-0.5 w-9 shrink-0 bg-gradient-to-r from-mint to-blue sm:block" />
              <p className="font-display text-[1.15rem] font-semibold text-ink sm:text-[1.4rem]">
                SOC analyst <span className="text-mint">/</span> Detection &amp; response
              </p>
            </div>

            <p className="mt-5 max-w-[33rem] text-[1.0625rem] leading-[1.7] text-muted sm:text-[1.1rem]">{heroIntro}</p>

            <div className="mt-9 grid grid-cols-2 gap-3 text-center sm:flex sm:flex-wrap">
              <a href="#work" data-magnetic className="btn-mint col-span-2 rounded-xl px-6 py-3.5 sm:px-[1.125rem] font-semibold">
                See my projects
              </a>
              <a
                href={siteConfig.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-glass col-span-2 rounded-xl px-6 py-3.5 sm:px-[1.125rem] font-medium transition-colors"
              >
                Download résumé
              </a>
              <a
                href={siteConfig.github}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-glass rounded-xl px-6 py-3.5 sm:px-[1.125rem] font-medium transition-colors"
              >
                GitHub
              </a>
              <a
                href={siteConfig.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-glass rounded-xl px-6 py-3.5 sm:px-[1.125rem] font-medium transition-colors"
              >
                LinkedIn
              </a>
            </div>

            <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[0.8rem] text-meta">
              {heroSpec.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="min-w-0 flex-[1_1_500px]">
          <CommandDeck />
        </div>
      </div>
    </section>
  );
}

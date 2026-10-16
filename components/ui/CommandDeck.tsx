import Link from "next/link";
import type { CSSProperties } from "react";
import { certifications, experience, projects, statusLog } from "@/lib/content";
import StatusTag from "@/components/ui/StatusTag";

const CIRC = 276.5; // 2πr for r = 44

interface Gauge {
  id: string;
  value: number;
  label: string;
  /** What the filled share of the ring means, read out with the number */
  of: string;
  /** The same share, shown under the label */
  fill: string;
  share: number;
  from: string;
  to: string;
}

/**
 * The hero's signature panel. Every number, row and log line comes from lib/content.ts:
 * each ring fills to a real share (held of all certifications, projects complete, internships finished).
 */
export default function CommandDeck() {
  const held = certifications.filter((c) => c.status === "held").length;
  const complete = projects.filter((p) => p.status === "complete").length;
  const gauges: Gauge[] = [
    { id: "ga", value: held, label: "Certifications held", fill: `${held} of ${certifications.length}`, of: `${held} of ${certifications.length} certifications held`, share: held / certifications.length, from: "var(--color-mint)", to: "var(--color-blue)" },
    { id: "gb", value: projects.length, label: "Security projects", fill: `${complete} complete`, of: `${projects.length} security projects, ${complete} complete`, share: complete / projects.length, from: "var(--color-blue)", to: "var(--color-mint)" },
    { id: "gc", value: experience.length, label: "Internships", fill: "both completed", of: `${experience.length} internships completed`, share: 1, from: "var(--color-mint)", to: "var(--color-blue)" },
  ];

  return (
    <div className="rise relative" style={{ "--d": "0.3s" } as CSSProperties}>
      <div
        aria-hidden
        className="absolute inset-x-[10%] -bottom-[30px] h-20"
        style={{ background: "radial-gradient(closest-side, rgb(152 220 194 / 0.12), rgb(152 220 194 / 0))" }}
      />
      {/* gradient hairline edge */}
      <div
        className="relative rounded-[24px] p-px"
        style={{
          background:
            "linear-gradient(150deg, rgb(152 220 194 / 0.42), rgb(130 166 230 / 0.16) 35%, rgb(255 255 255 / 0.05) 60%, rgb(152 220 194 / 0.16))",
        }}
      >
        <div
          className="relative overflow-hidden rounded-[23px]"
          style={{
            background: "linear-gradient(180deg, rgb(34 36 42 / 0.92), rgb(20 21 25 / 0.95))",
            boxShadow: "inset 0 1px 0 rgb(255 255 255 / 0.08), 0 50px 100px -40px rgb(0 0 0 / 0.85)",
          }}
        >
          <div
            aria-hidden
            className="sheen pointer-events-none absolute inset-y-0 w-[30%]"
            style={{ background: "linear-gradient(90deg, rgb(255 255 255 / 0), rgb(255 255 255 / 0.025), rgb(255 255 255 / 0))" }}
          />

          <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4 sm:px-[1.4rem]">
            <h2 className="inline-flex items-center gap-2.5 font-display text-[0.92rem] font-semibold uppercase tracking-[0.06em]">
              <span aria-hidden className="inline-flex gap-[5px]">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="h-[7px] w-[7px] rounded-full bg-[#3c3f46]" />
                ))}
              </span>
              Command deck
            </h2>
            <span className="inline-flex items-center gap-2 font-mono text-[0.76rem] text-[#949aa6]">
              <span aria-hidden className="led h-[7px] w-[7px] rounded-full bg-mint" />
              online
            </span>
          </div>

          <ul className="grid grid-cols-3 gap-2 px-3 pt-7 pb-5 sm:px-5">
            {gauges.map((g, i) => (
              <li key={g.id} className="flex flex-col items-center gap-2 text-center">
                <svg viewBox="0 0 124 124" className="h-auto w-full max-w-[124px]" role="img" aria-label={g.of}>
                  <defs>
                    <linearGradient id={g.id} x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0" stopColor={g.from} />
                      <stop offset="1" stopColor={g.to} />
                    </linearGradient>
                  </defs>
                  <circle cx="62" cy="62" r="56" fill="none" stroke="rgb(255 255 255 / 0.10)" strokeWidth="2" strokeDasharray="1.5 8.3" />
                  <circle cx="62" cy="62" r="44" fill="none" stroke="rgb(255 255 255 / 0.07)" strokeWidth="7" />
                  <circle
                    className="gauge"
                    cx="62"
                    cy="62"
                    r="44"
                    fill="none"
                    stroke={`url(#${g.id})`}
                    strokeWidth="7"
                    strokeLinecap="round"
                    strokeDasharray={CIRC}
                    strokeDashoffset={(CIRC * (1 - g.share)).toFixed(1)}
                    transform="rotate(-90 62 62)"
                    style={{ "--d": `${0.5 + i * 0.2}s` } as CSSProperties}
                  />
                  <text x="62" y="71" textAnchor="middle" fill="#f4f5f7" className="font-display" fontSize="30" fontWeight="700">
                    {g.value}
                  </text>
                </svg>
                <span aria-hidden className="text-[0.84rem] leading-snug text-muted">
                  {g.label}
                  <span className="mt-0.5 block font-mono text-[0.7rem] text-[#949aa6]">{g.fill}</span>
                </span>
              </li>
            ))}
          </ul>

          <ol aria-label="Projects" className="border-t border-white/[0.06]">
            {projects.map((p) => (
              <li key={p.slug} className="border-b border-white/[0.045] last:border-b-0">
                <Link
                  href={`/projects/${p.slug}`}
                  data-spotlight
                  className="group flex items-center gap-3.5 px-5 py-3 focus-visible:outline-offset-[-2px] sm:px-[1.4rem]"
                >
                  <span className="w-[4.25rem] shrink-0 font-mono text-[0.72rem] uppercase text-meta">{p.category}</span>
                  <span className="flex-1 font-medium text-ink transition-colors group-hover:text-mint">{p.title}</span>
                  <StatusTag
                    label={p.status === "complete" ? "Complete" : "In progress"}
                    tone={p.status === "complete" ? "mint" : "blue"}
                  />
                </Link>
              </li>
            ))}
          </ol>

          <div className="border-t border-white/[0.06] bg-black/[0.22] px-5 py-4 font-mono text-[0.76rem] leading-[1.85] text-[#949aa6] sm:px-[1.4rem]">
            <span className="sr-only">Status log</span>
            {statusLog.map((l, i) => (
              <p key={l.text} className="log-in" style={{ "--d": `${1.6 + i * 0.6}s` } as CSSProperties}>
                <span className={l.tone === "ok" ? "text-mint" : "text-blue-text"}>{l.tone === "ok" ? "[ok]" : "[..]"}</span>{" "}
                {l.text}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

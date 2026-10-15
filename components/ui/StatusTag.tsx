import type { CSSProperties } from "react";

type Tone = "resolved" | "signal";

interface StatusTagProps {
  label: string;
  tone: Tone;
  /** Tick in from unchecked when scrolled into view; the value staggers it */
  enterIndex?: number;
}

const toneClass: Record<Tone, { dot: string; text: string }> = {
  resolved: { dot: "bg-resolved", text: "text-resolved" },
  signal: { dot: "bg-signal", text: "text-signal" },
};

/** Small status marker: teal for done/held, amber for in progress. */
export default function StatusTag({ label, tone, enterIndex }: StatusTagProps) {
  const t = toneClass[tone];
  const enter = enterIndex === undefined ? {} : { "data-enter": "", style: { "--i": enterIndex } as CSSProperties };
  return (
    <span className={`status-tag inline-flex items-center gap-1.5 text-xs font-medium whitespace-nowrap ${t.text}`} {...enter}>
      <span aria-hidden className={`status-dot h-1.5 w-1.5 rounded-full ${t.dot}`} />
      {label}
    </span>
  );
}

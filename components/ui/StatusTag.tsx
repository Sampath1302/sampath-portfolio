import type { CSSProperties } from "react";

type Tone = "mint" | "blue";

interface StatusTagProps {
  label: string;
  tone: Tone;
  /** Tick in from unchecked when scrolled into view; the value staggers it */
  enterIndex?: number;
}

const toneClass: Record<Tone, string> = {
  mint: "text-mint bg-mint/[0.12]",
  blue: "text-blue-text bg-blue/[0.16]",
};

/** Small status pill: mint for complete / held, blue for in progress. */
export default function StatusTag({ label, tone, enterIndex }: StatusTagProps) {
  const enter = enterIndex === undefined ? {} : { "data-enter": "", style: { "--i": enterIndex } as CSSProperties };
  return (
    <span
      className={`status-tag inline-flex items-center rounded-full px-2.5 py-1 text-[0.76rem] font-medium leading-none whitespace-nowrap ${toneClass[tone]}`}
      {...enter}
    >
      {label}
    </span>
  );
}

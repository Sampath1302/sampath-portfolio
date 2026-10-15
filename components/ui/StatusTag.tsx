type Tone = "resolved" | "signal";

interface StatusTagProps {
  label: string;
  tone: Tone;
}

const toneClass: Record<Tone, { dot: string; text: string }> = {
  resolved: { dot: "bg-resolved", text: "text-resolved" },
  signal: { dot: "bg-signal", text: "text-signal" },
};

/** Small status marker: teal for done/held, amber for in progress. */
export default function StatusTag({ label, tone }: StatusTagProps) {
  const t = toneClass[tone];
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium whitespace-nowrap ${t.text}`}>
      <span aria-hidden className={`h-1.5 w-1.5 rounded-full ${t.dot}`} />
      {label}
    </span>
  );
}

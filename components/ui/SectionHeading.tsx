import type { ReactNode } from "react";

interface SectionHeadingProps {
  id?: string;
  /** Small mono label above the heading */
  label: string;
  title: string;
  children?: ReactNode;
}

/**
 * Left column of a section: a mono label, the heading, plus an optional one-line note.
 * Sits beside the content on large screens and above it on small ones.
 */
export default function SectionHeading({ id, label, title, children }: SectionHeadingProps) {
  return (
    <div className="lg:sticky lg:top-28 lg:col-span-4 lg:self-start">
      <p className="flex items-center gap-2.5 font-mono text-[0.78rem] text-meta">
        <span aria-hidden className="h-px w-5 bg-gradient-to-r from-mint to-blue" />
        {label}
      </p>
      <h2
        id={id}
        className="mt-3 font-display text-[1.875rem] font-semibold leading-[1.1] tracking-[-0.01em] text-ink sm:text-[2.25rem]"
      >
        {title}
      </h2>
      {children && <p className="mt-3 max-w-xs text-[0.9375rem] leading-relaxed text-muted">{children}</p>}
    </div>
  );
}

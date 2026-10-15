import type { ReactNode } from "react";

interface SectionHeadingProps {
  id?: string;
  title: string;
  children?: ReactNode;
}

/**
 * Left column of a section: the heading, plus an optional one-line note.
 * Sits beside the content on large screens and above it on small ones.
 */
export default function SectionHeading({ id, title, children }: SectionHeadingProps) {
  return (
    <div className="lg:col-span-4">
      <h2
        id={id}
        className="font-display text-[1.75rem] sm:text-[2.125rem] font-semibold leading-[1.1] tracking-[-0.01em] text-ink"
      >
        {title}
      </h2>
      {children && <p className="mt-3 max-w-xs text-[0.9375rem] leading-relaxed text-muted">{children}</p>}
    </div>
  );
}

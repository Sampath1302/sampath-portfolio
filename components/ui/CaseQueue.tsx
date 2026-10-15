"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { projects } from "@/lib/content";
import StatusTag from "@/components/ui/StatusTag";

/**
 * The hero's signature element: projects presented as a SIEM case queue.
 * Rows fill in once on load; each row opens the project write-up.
 */
export default function CaseQueue() {
  const reduce = useReducedMotion();

  return (
    <div className="overflow-hidden rounded-lg border border-line bg-surface shadow-[0_24px_60px_-30px_rgba(0,0,0,0.6)]">
      <div className="flex items-baseline justify-between gap-4 border-b border-line px-5 py-3.5">
        <p className="text-sm font-semibold text-ink">Case queue</p>
        <p className="text-xs text-muted">
          {projects.length} cases, assigned to Sampath
        </p>
      </div>

      <div
        aria-hidden
        className="hidden sm:grid grid-cols-[4.75rem_1fr_auto] gap-4 border-b border-line px-5 py-2 text-xs text-faint"
      >
        <span>Category</span>
        <span>Case</span>
        <span>Status</span>
      </div>

      <ol aria-label="Projects">
        {projects.map((p, i) => (
          <motion.li
            key={p.slug}
            initial={reduce ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 + i * 0.16, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="border-b border-line last:border-b-0"
          >
            <Link
              href={`/projects/${p.slug}`}
              className="group grid grid-cols-[1fr_auto] sm:grid-cols-[4.75rem_1fr_auto] items-center gap-x-4 gap-y-1 px-5 py-4 transition-colors hover:bg-raised focus-visible:bg-raised focus-visible:outline-offset-[-2px]"
            >
              <span className="order-2 col-span-2 sm:order-none sm:col-span-1 text-xs text-faint">
                {p.category}
              </span>
              <span className="min-w-0">
                <span className="block font-medium text-ink transition-colors group-hover:text-signal">
                  {p.title}
                </span>
                <span className="mt-0.5 block text-sm leading-snug text-muted">{p.summary}</span>
              </span>
              <StatusTag
                label={p.status === "complete" ? "Complete" : "In progress"}
                tone={p.status === "complete" ? "resolved" : "signal"}
              />
            </Link>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}

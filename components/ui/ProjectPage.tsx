"use client";

import { useState } from "react";
import type { ReactNode } from "react";

interface ProjectPageProps {
  /** The intro animation; call `done` when it finishes or is skipped */
  intro: (done: () => void) => ReactNode;
  /** The write-up; call `watch` to replay the intro */
  writeup: (watch: () => void) => ReactNode;
}

/**
 * Opens straight onto the write-up. The intro walkthrough is optional
 * and returns to the write-up when it ends.
 */
export default function ProjectPage({ intro, writeup }: ProjectPageProps) {
  const [watching, setWatching] = useState(false);

  const watch = () => {
    setWatching(true);
    window.scrollTo({ top: 0 });
  };
  const done = () => {
    setWatching(false);
    window.scrollTo({ top: 0 });
  };

  return <div className="min-h-screen text-ink">{watching ? intro(done) : writeup(watch)}</div>;
}

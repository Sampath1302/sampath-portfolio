"use client";

import { useEffect, useRef, useState } from "react";
import { certifications, projects, recognition } from "@/lib/content";

interface TickerEvent {
  text: string;
  tone: "resolved" | "signal";
}

// Built only from lib/content.ts: a log of the portfolio itself, no invented alerts or numbers
const events: TickerEvent[] = [
  ...projects.map((p) => ({
    text: p.status === "complete" ? `Case closed: ${p.title}` : `Case open: ${p.title}, in progress`,
    tone: p.status === "complete" ? ("resolved" as const) : ("signal" as const),
  })),
  ...certifications.map((c) => ({
    text: c.status === "held" ? `Certification held: ${c.short ?? c.title}` : `In progress: ${c.title}`,
    tone: c.status === "held" ? ("resolved" as const) : ("signal" as const),
  })),
  ...recognition.map((r) => ({ text: `${r.title}: ${r.result}`, tone: "resolved" as const })),
];

const toneDot = { resolved: "bg-resolved", signal: "bg-signal" };

/**
 * One-line "last event" log under the case queue. Rotates every 5s while on
 * screen and the tab is visible; still under reduced motion. Hidden from
 * screen readers because every event repeats content listed on the page.
 */
export default function EventTicker() {
  const ref = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timer = 0;
    const io = new IntersectionObserver(([entry]) => {
      window.clearInterval(timer);
      if (entry.isIntersecting)
        timer = window.setInterval(() => {
          if (!document.hidden) setIndex((i) => (i + 1) % events.length);
        }, 5000);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearInterval(timer);
    };
  }, []);

  const event = events[index];

  return (
    <div ref={ref} aria-hidden className="mt-3 flex h-6 items-center gap-3 overflow-hidden px-1 text-[0.8125rem]">
      <span className="shrink-0 text-muted">Last event</span>
      {/* keyed, so each new event replays the slide-in */}
      <span key={index} className={`flex min-w-0 items-center gap-2 font-mono text-ink/85 ${index ? "ticker-in" : ""}`}>
        <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${toneDot[event.tone]}`} />
        <span className="truncate">{event.text}</span>
      </span>
    </div>
  );
}

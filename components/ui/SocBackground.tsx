"use client";

import { useEffect, useRef } from "react";

/**
 * Full-page network behind all content. The canvas is empty in the server
 * HTML; the drawing code is fetched only after load and an idle moment, so
 * it never competes with first paint.
 */
export default function SocBackground() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let stop: (() => void) | undefined;
    let cancelled = false;

    const start = async () => {
      const { startNetwork } = await import("@/lib/socNetwork");
      const canvas = ref.current;
      if (cancelled || !canvas) return;
      const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
      const still =
        window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
        nav.connection?.saveData === true ||
        (navigator.hardwareConcurrency ?? 8) <= 4;
      stop = startNetwork(canvas, { still });
      canvas.dataset.ready = "";
    };

    const idle = () =>
      "requestIdleCallback" in window ? window.requestIdleCallback(() => start(), { timeout: 2000 }) : setTimeout(start, 300); // Safari has no requestIdleCallback
    if (document.readyState === "complete") idle();
    else window.addEventListener("load", idle, { once: true });

    return () => {
      cancelled = true;
      window.removeEventListener("load", idle);
      stop?.();
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="soc-background pointer-events-none fixed inset-0 -z-10 h-full w-full" />;
}

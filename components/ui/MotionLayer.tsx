"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Page-wide motion that server components opt into with data attributes,
 * so no section has to become a client component:
 *
 * - data-enter: plays once when scrolled into view. Elements already on
 *   screen at load keep their final look, and nothing is hidden without JS.
 *   CSS styles [data-enter="pending"] and the transition to "done".
 * - data-count-to="96.8": counts the number up when it enters, keeping the
 *   surrounding text ("%", " ms") as written.
 * - data-magnetic: drifts up to 6px toward a fine pointer.
 * - data-spotlight: exposes the pointer position as --mx / --my.
 */
export default function MotionLayer() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          io.unobserve(el);
          el.dataset.enter = "done";
          const to = el.dataset.countTo;
          if (to !== undefined) countUp(el, Number(to));
        }
      },
      { threshold: 0.25 }
    );

    const scan = () => {
      for (const el of document.querySelectorAll<HTMLElement>("[data-enter]:not([data-enter=done])")) {
        const box = el.getBoundingClientRect();
        if (box.top < window.innerHeight && box.bottom > 0) continue; // already seen: no replay
        el.dataset.enter = "pending";
        if (el.dataset.countTo !== undefined) el.textContent = el.textContent!.replace(/[\d.]+/, "0");
        io.observe(el);
      }
    };
    // after a client navigation the page only scrolls to the top once the view
    // transition has finished; scanning earlier would trigger elements in passing
    let cancelled = false;
    const transition = (document as Document & { activeViewTransition?: { finished: Promise<void> } })
      .activeViewTransition;
    const settled = transition ? transition.finished.catch(() => {}) : Promise.resolve();
    settled.then(() =>
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          if (!cancelled) scan();
        })
      )
    );
    return () => {
      cancelled = true;
      io.disconnect();
    };
  }, [pathname]);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let magnet: HTMLElement | null = null;

    const onMove = (e: PointerEvent) => {
      const target = e.target as Element;
      const spot = target.closest<HTMLElement>("[data-spotlight]");
      if (spot) {
        const box = spot.getBoundingClientRect();
        spot.style.setProperty("--mx", `${e.clientX - box.left}px`);
        spot.style.setProperty("--my", `${e.clientY - box.top}px`);
      }
      if (reduce) return;
      const next = target.closest<HTMLElement>("[data-magnetic]");
      if (magnet && magnet !== next) magnet.style.transform = "";
      magnet = next;
      if (next) {
        const box = next.getBoundingClientRect();
        const x = ((e.clientX - box.left) / box.width - 0.5) * 12;
        const y = ((e.clientY - box.top) / box.height - 0.5) * 12;
        next.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
      }
    };
    const onLeave = () => {
      if (magnet) magnet.style.transform = "";
      magnet = null;
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return null;
}

function countUp(el: HTMLElement, to: number) {
  const template = el.textContent ?? "";
  const decimals = (String(to).split(".")[1] ?? "").length;
  const start = performance.now();
  const step = (now: number) => {
    const t = Math.min(1, (now - start) / 900);
    const eased = 1 - Math.pow(1 - t, 4); // fast start, gentle landing on the real value
    el.textContent = template.replace(/[\d.]+/, (to * eased).toFixed(decimals));
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

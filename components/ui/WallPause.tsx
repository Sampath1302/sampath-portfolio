"use client";

import { useEffect, useRef } from "react";

/** Pauses the SOC wall's animations while it is off-screen or the tab is hidden. */
export default function WallPause() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const wall = ref.current?.closest<HTMLElement>("[data-soc-wall]");
    if (!wall) return;
    let onScreen = true;
    const sync = () => wall.toggleAttribute("data-paused", !onScreen || document.hidden);
    const io = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      sync();
    });
    io.observe(wall);
    document.addEventListener("visibilitychange", sync);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  return <span ref={ref} hidden />;
}

"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

interface ProjectClipProps {
  slug: string;
  /** What the clip shows, for screen readers */
  label: string;
  className?: string;
}

/** Encoded size of each clip in public/media; gives the box the clip's own shape, so nothing is letterboxed */
const clipSize: Record<string, [number, number]> = {
  qurik: [1152, 554],
  "hh8-scanner": [1152, 990],
  "azure-sentinel": [1152, 576],
  "ir-bot": [1152, 900],
};

/**
 * Short, silent, looping clip of a project's walkthrough.
 * Loads and plays only while on screen; shows the still poster
 * when the visitor prefers reduced motion.
 */
export default function ProjectClip({ slug, label, className = "" }: ProjectClipProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();
  const [width, height] = clipSize[slug] ?? [1152, 720];

  useEffect(() => {
    const video = ref.current;
    if (!video || reduce) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.35 }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [reduce]);

  return (
    <div className={`overflow-hidden rounded-lg border border-line bg-surface ${className}`}>
      <video
        ref={ref}
        className="block h-auto w-full"
        width={width}
        height={height}
        poster={`/media/${slug}-poster.jpg`}
        muted
        loop
        playsInline
        preload="none"
        aria-label={label}
      >
        <source src={`/media/${slug}.mp4`} type="video/mp4" />
        <source src={`/media/${slug}.webm`} type="video/webm" />
      </video>
    </div>
  );
}

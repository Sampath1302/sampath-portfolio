"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

interface ProjectClipProps {
  slug: string;
  /** What the clip shows, for screen readers */
  label: string;
  className?: string;
}

/**
 * Short, silent, looping clip of a project's walkthrough.
 * Loads and plays only while on screen; shows the still poster
 * when the visitor prefers reduced motion.
 */
export default function ProjectClip({ slug, label, className = "" }: ProjectClipProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();

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
    <div className={`overflow-hidden rounded-lg border border-line bg-night ${className}`}>
      <video
        ref={ref}
        className="block h-full w-full object-contain"
        poster={`/media/${slug}-poster.jpg`}
        muted
        loop
        playsInline
        preload="none"
        aria-label={label}
      >
        <source src={`/media/${slug}.webm`} type="video/webm" />
        <source src={`/media/${slug}.mp4`} type="video/mp4" />
      </video>
    </div>
  );
}

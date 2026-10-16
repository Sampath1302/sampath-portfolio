"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { CHAPTER_NAMES, FILM_SECONDS, chapterStart, filmFor } from "@/lib/films";

interface CaseFilmProps {
  slug: string;
  title: string;
  className?: string;
}

const src = (slug: string, ext: string) => `/media/films/${slug}${ext}`;
const clock = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

function prefersStill() {
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches || conn?.saveData === true;
}

/**
 * A project's "case file" film. The card plays it muted and looped while on screen
 * (or on hover); reduced motion and Save-Data keep the poster. Clicking opens the
 * full-screen player.
 */
export default function CaseFilm({ slug, title, className = "" }: CaseFilmProps) {
  const preview = useRef<HTMLVideoElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [playing, setPlaying] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const video = preview.current;
    if (!video || prefersStill()) return;
    const observer = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? video.play().catch(() => {}) : video.pause()),
      { threshold: 0.4 }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  const hoverPlay = () => {
    if (preview.current && !prefersStill()) preview.current.play().catch(() => {});
  };

  return (
    <div data-enter className={`enter-clip glass rounded-[18px] p-1.5 ${className}`}>
      <button
        ref={trigger}
        type="button"
        onClick={() => setOpen(true)}
        onPointerEnter={hoverPlay}
        aria-haspopup="dialog"
        aria-label={`Play the ${title} case file film`}
        className="group relative block aspect-video w-full overflow-hidden rounded-xl bg-surface focus-visible:outline-offset-2"
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- a lazy poster under the video, not a content image */}
        <img src={src(slug, "-poster.jpg")} alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
        <video
          ref={preview}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${playing ? "opacity-100" : "opacity-0"}`}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden
          tabIndex={-1}
          onPlaying={() => setPlaying(true)}
        >
          <source src={src(slug, ".mp4")} type="video/mp4" />
          <source src={src(slug, ".webm")} type="video/webm" />
        </video>
        <span className="btn-glass absolute top-3 right-3 inline-flex items-center gap-2 rounded-lg bg-graphite/70 px-3 py-2 font-mono text-[0.78rem] text-ink transition-colors group-hover:bg-graphite/90">
          <svg width="10" height="12" viewBox="0 0 10 12" aria-hidden>
            <path d="M0 0 L10 6 L0 12 Z" fill="var(--color-mint)" />
          </svg>
          Case file · {clock(FILM_SECONDS)}
        </span>
      </button>
      {open && (
        <FilmPlayer
          slug={slug}
          title={title}
          onClose={() => {
            setOpen(false);
            trigger.current?.focus();
          }}
        />
      )}
    </div>
  );
}

/** Full-screen player in a modal <dialog>: Esc closes, the page behind is inert. */
function FilmPlayer({ slug, title, onClose }: { slug: string; title: string; onClose: () => void }) {
  const film = filmFor(slug)!;
  const dialog = useRef<HTMLDialogElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [time, setTime] = useState(0);
  const [paused, setPaused] = useState(true);

  useEffect(() => {
    const d = dialog.current!;
    d.showModal();
    document.documentElement.style.overflow = "hidden";
    if (!prefersStill()) video.current?.play().catch(() => {});
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, []);

  const chapter = CHAPTER_NAMES.findIndex((_, i) => time >= chapterStart(i) && (i === 3 || time < chapterStart(i + 1)));
  const seek = (t: number) => {
    if (video.current) video.current.currentTime = Math.max(0, Math.min(FILM_SECONDS, t));
  };
  const toggle = () => {
    const v = video.current;
    if (v) (v.paused ? v.play() : v.pause())?.catch?.(() => {});
  };

  const onKey = (e: KeyboardEvent) => {
    const onRange = (e.target as HTMLElement).getAttribute("type") === "range";
    if (e.key === " " && (e.target as HTMLElement).tagName === "BUTTON") return; // buttons handle Space themselves
    if (e.key === " " || e.key.toLowerCase() === "k") toggle();
    else if (e.key === "ArrowLeft" && !onRange) seek(time - 5);
    else if (e.key === "ArrowRight" && !onRange) seek(time + 5);
    else if (["1", "2", "3", "4"].includes(e.key)) seek(chapterStart(Number(e.key) - 1));
    else return;
    e.preventDefault();
  };

  return (
    <dialog
      ref={dialog}
      aria-labelledby={`film-${slug}-title`}
      onClose={onClose}
      onKeyDown={onKey}
      onClick={(e) => e.target === dialog.current && dialog.current.close()}
      className="m-auto max-h-none w-[min(1100px,calc(100vw-2rem))] max-w-none overflow-visible bg-transparent p-0 text-ink backdrop:bg-graphite/90"
    >
      <div className="glass rounded-[22px] bg-graphite p-3 sm:p-4">
        <div className="flex items-center justify-between gap-4 px-1 pb-3">
          <h2 id={`film-${slug}-title`} className="font-mono text-[0.8125rem] text-meta">
            <span className="text-mint">Case file {film.number}</span> · {title}
          </h2>
          <button type="button" onClick={() => dialog.current?.close()} className="btn-glass rounded-lg px-3 py-2 text-sm">
            Close
          </button>
        </div>

        <video
          ref={video}
          className="block aspect-video w-full rounded-xl bg-surface"
          muted
          playsInline
          preload="auto"
          poster={src(slug, "-poster.jpg")}
          onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
          onPlay={() => setPaused(false)}
          onPause={() => setPaused(true)}
          onClick={toggle}
          aria-describedby={`film-${slug}-chapters`}
        >
          <source src={src(slug, ".mp4")} type="video/mp4" />
          <source src={src(slug, ".webm")} type="video/webm" />
        </video>

        <div className="mt-3 flex items-center gap-3 px-1">
          <button type="button" onClick={toggle} className="btn-mint w-[5.5rem] rounded-lg py-2 text-sm font-semibold" aria-keyshortcuts="k">
            {paused ? "Play" : "Pause"}
          </button>
          <div className="relative flex-1">
            <input
              type="range"
              min={0}
              max={FILM_SECONDS}
              step={0.1}
              value={time}
              onChange={(e) => seek(Number(e.target.value))}
              aria-label="Seek"
              aria-valuetext={`${clock(time)} of ${clock(FILM_SECONDS)}, ${CHAPTER_NAMES[Math.max(0, chapter)]}`}
              className="block w-full accent-[var(--color-mint)]"
            />
            {/* chapter markers on the track */}
            {CHAPTER_NAMES.map((n, i) => (
              <span
                key={n}
                aria-hidden
                className="pointer-events-none absolute top-1/2 h-3 w-0.5 -translate-y-1/2 rounded bg-blue-text/70"
                style={{ left: `${(chapterStart(i) / FILM_SECONDS) * 100}%` }}
              />
            ))}
          </div>
          <span className="w-[5.5rem] text-right font-mono text-[0.78rem] text-meta tabular-nums">
            {clock(time)} / {clock(FILM_SECONDS)}
          </span>
        </div>

        <ol id={`film-${slug}-chapters`} aria-label="Chapters" className="mt-4 grid gap-2 sm:grid-cols-4">
          {CHAPTER_NAMES.map((n, i) => (
            <li key={n}>
              <button
                type="button"
                onClick={() => seek(chapterStart(i))}
                aria-current={chapter === i ? "step" : undefined}
                aria-keyshortcuts={String(i + 1)}
                className={`h-full w-full rounded-xl border p-3 text-left transition-colors ${
                  chapter === i ? "border-mint/40 bg-mint/[0.06]" : "border-white/[0.07] hover:bg-white/[0.04]"
                }`}
              >
                <span className="font-mono text-[0.75rem] text-mint">
                  0{i + 1} / {n} · {clock(chapterStart(i))}
                </span>
                <span className="mt-1.5 block text-[0.8125rem] leading-snug text-muted">{film.captions[i]}</span>
              </button>
            </li>
          ))}
        </ol>
        <p className="mt-3 px-1 font-mono text-[0.72rem] text-meta">
          Keys: Space or K play · ← → 5 s · 1–4 chapters · Esc close. The film is silent.
        </p>
      </div>
    </dialog>
  );
}

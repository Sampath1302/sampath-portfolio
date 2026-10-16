import type { ComponentType, ReactNode } from "react";
import { AbsoluteFill, interpolate, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { projects } from "../../lib/content";
import { CHAPTER_NAMES, FILM_FPS, FILM_TIMING, chapterStart, filmFor, type Film } from "../../lib/films";
import { scenesFor } from "./scenes";
import { Appear, Tag, displayText, monoText, useProgress } from "./primitives";
import { blueA, c, mintA, sans, whiteA } from "./theme";

export type Format = "wide" | "square";
export type Scenes = [ComponentType, ComponentType, ComponentType, ComponentType];

const STAGE_W = 1280;
const STAGE_H = 720;

/** Graphite with two soft light pools and a faint grid: the SOC wall's quiet cousin */
function Backdrop() {
  const f = useCurrentFrame();
  const drift = Math.sin(f / 90) * 30;
  return (
    <AbsoluteFill style={{ background: c.bg, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(${whiteA(0.025)} 1px, transparent 1px), linear-gradient(90deg, ${whiteA(0.025)} 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse at 50% 45%, black 30%, transparent 75%)",
        }}
      />
      <div style={{ position: "absolute", width: 900, height: 900, left: -300 + drift, bottom: -520, borderRadius: "50%", background: `radial-gradient(closest-side, ${mintA(0.09)}, transparent)` }} />
      <div style={{ position: "absolute", width: 1000, height: 1000, right: -360 - drift, top: -560, borderRadius: "50%", background: `radial-gradient(closest-side, ${blueA(0.1)}, transparent)` }} />
    </AbsoluteFill>
  );
}

/** Fades a chapter's scene in and out at its edges */
function ChapterFrame({ len, children }: { len: number; children: ReactNode }) {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 10, len - 8, len], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
}

function TitleCard({ film }: { film: Film }) {
  const p = projects.find((x) => x.slug === film.slug)!;
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", textAlign: "center" }}>
      <Appear at={2} y={10}>
        <div style={monoText(22, c.mint)}>Case file {film.number}</div>
      </Appear>
      <Appear at={8} y={22}>
        <div
          style={{
            ...displayText(132),
            marginTop: 18,
            background: "linear-gradient(180deg,#ffffff 0%,#e2e4e8 55%,#8f96a3 100%)",
            WebkitBackgroundClip: "text",
            color: "transparent",
            paddingBottom: 8,
          }}
        >
          {p.title}
        </div>
      </Appear>
      <Appear at={14} y={10}>
        <div style={{ fontFamily: sans, fontSize: 26, color: c.muted, marginTop: 6 }}>{p.kind}</div>
      </Appear>
      <Appear at={20} y={8}>
        <div style={{ display: "flex", gap: 26, marginTop: 34, ...monoText(17, c.meta) }}>
          {CHAPTER_NAMES.map((n, i) => (
            <span key={n}>
              <span style={{ color: c.mint }}>0{i + 1}</span> {n}
            </span>
          ))}
        </div>
      </Appear>
    </AbsoluteFill>
  );
}

function EndCard({ film }: { film: Film }) {
  const p = projects.find((x) => x.slug === film.slug)!;
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", textAlign: "center" }}>
      <Appear at={0}>
        <div style={monoText(20, c.meta)}>Case closed</div>
      </Appear>
      <Appear at={4} y={16}>
        <div style={{ ...displayText(96), marginTop: 14 }}>{p.title}</div>
      </Appear>
      <Appear at={10}>
        <div style={{ display: "flex", gap: 14, justifyContent: "center", alignItems: "center", marginTop: 22 }}>
          <Tag tone="mint" size={18}>
            {p.status === "complete" ? "Complete" : "In progress"}
          </Tag>
          <span style={{ fontFamily: sans, fontSize: 22, color: c.muted }}>{p.summary}</span>
        </div>
      </Appear>
      <Appear at={16}>
        <div style={{ ...monoText(18, c.meta), marginTop: 40 }}>
          <span style={{ color: c.mint }}>sampath@soc</span>:~$ Sampath Kumar MS · SOC analyst, detection and response
        </div>
      </Appear>
    </AbsoluteFill>
  );
}

/** The 1280×720 visual: title card, four chapter scenes, end card */
function Stage({ film, scenes }: { film: Film; scenes: Scenes }) {
  const { fps } = useVideoConfig();
  const chapterLen = FILM_TIMING.chapter * fps;
  return (
    <div style={{ position: "absolute", width: STAGE_W, height: STAGE_H, overflow: "hidden" }}>
      <Backdrop />
      <Sequence durationInFrames={FILM_TIMING.title * fps}>
        <ChapterFrame len={FILM_TIMING.title * fps}>
          <TitleCard film={film} />
        </ChapterFrame>
      </Sequence>
      {scenes.map((Scene, i) => (
        <Sequence key={i} from={chapterStart(i) * fps} durationInFrames={chapterLen}>
          <ChapterFrame len={chapterLen}>
            <Scene />
          </ChapterFrame>
        </Sequence>
      ))}
      <Sequence from={chapterStart(4) * fps}>
        <EndCard film={film} />
      </Sequence>
    </div>
  );
}

/** Which chapter is on screen, and how far through it */
function useChapter() {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const i = Math.floor((t - FILM_TIMING.title) / FILM_TIMING.chapter);
  return { i: i >= 0 && i < 4 ? i : -1, t };
}

function Rail({ width }: { width: number }) {
  const { t } = useChapter();
  return (
    <div style={{ display: "flex", gap: 8, width }}>
      {CHAPTER_NAMES.map((n, k) => {
        const fill = Math.min(1, Math.max(0, (t - chapterStart(k)) / FILM_TIMING.chapter));
        return (
          <div key={n} style={{ flex: 1, height: 4, borderRadius: 2, background: whiteA(0.08), overflow: "hidden" }}>
            <div style={{ width: `${fill * 100}%`, height: "100%", background: `linear-gradient(90deg, ${c.mint}, ${c.blue})` }} />
          </div>
        );
      })}
    </div>
  );
}

function Caption({ film, size }: { film: Film; size: number }) {
  const { i } = useChapter();
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = i >= 0 ? f - chapterStart(i) * fps : 0;
  const o = interpolate(local, [0, 10, FILM_TIMING.chapter * fps - 8, FILM_TIMING.chapter * fps], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  if (i < 0) return null;
  return (
    <div style={{ opacity: o }}>
      <div style={monoText(size * 0.72, c.mint)}>
        0{i + 1} / {CHAPTER_NAMES[i]}
      </div>
      <div style={{ fontFamily: sans, fontSize: size, lineHeight: 1.4, color: c.ink, marginTop: 8 }}>{film.captions[i]}</div>
    </div>
  );
}

function Timecode() {
  const { t } = useChapter();
  return <span style={monoText(15, c.meta)}>00:{String(Math.floor(t)).padStart(2, "0")}</span>;
}

// Props stay JSON (Remotion serialises them), so scenes are looked up by slug
export function CaseFile({ slug, format }: { slug: string; format: Format }) {
  const film = filmFor(slug)!;
  const scenes = scenesFor[slug];
  const p = projects.find((x) => x.slug === slug)!;
  const header = (
    <span style={monoText(15, c.meta)}>
      <span style={{ color: c.mint }}>Case file {film.number}</span> · {p.title} · {p.category.toLowerCase()}
    </span>
  );
  const visible = useProgress(FILM_TIMING.title * FILM_FPS - 6, 10) * (1 - useProgress(chapterStart(4) * FILM_FPS - 6, 8));

  if (format === "wide") {
    return (
      <AbsoluteFill style={{ background: c.bg }}>
        <Stage film={film} scenes={scenes} />
        <div style={{ position: "absolute", left: 48, right: 48, top: 28, display: "flex", justifyContent: "space-between", opacity: visible }}>
          {header}
          <Timecode />
        </div>
        <div style={{ position: "absolute", left: 48, right: 48, bottom: 30, opacity: visible }}>
          <div style={{ maxWidth: 980, minHeight: 76 }}>
            <Caption film={film} size={21} />
          </div>
          <div style={{ marginTop: 16 }}>
            <Rail width={1184} />
          </div>
        </div>
      </AbsoluteFill>
    );
  }

  // Square: header above, the 16:9 stage in the middle, caption and rail below
  const scale = 1080 / STAGE_W;
  return (
    <AbsoluteFill style={{ background: c.bg }}>
      <Backdrop />
      <div style={{ position: "absolute", left: 56, right: 56, top: 64 }}>
        {header}
        <div style={{ ...displayText(64), marginTop: 14 }}>{p.title}</div>
        <div style={{ fontFamily: sans, fontSize: 24, color: c.muted, marginTop: 8 }}>{p.summary}</div>
      </div>
      <div
        style={{
          position: "absolute",
          top: 262,
          left: 0,
          width: STAGE_W,
          height: STAGE_H,
          transform: `scale(${scale})`,
          transformOrigin: "0 0",
          borderTop: `1px solid ${c.hair}`,
          borderBottom: `1px solid ${c.hair}`,
        }}
      >
        <Stage film={film} scenes={scenes} />
      </div>
      <div style={{ position: "absolute", left: 56, right: 56, top: 262 + STAGE_H * scale + 34 }}>
        <div style={{ minHeight: 112 }}>
          <Caption film={film} size={25} />
        </div>
        <div style={{ marginTop: 18, opacity: visible }}>
          <Rail width={968} />
        </div>
      </div>
    </AbsoluteFill>
  );
}

import type { CSSProperties, ReactNode } from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { blueA, c, display, mintA, mono, sans, threatA, whiteA } from "./theme";

const ease = Easing.bezier(0.16, 1, 0.3, 1);

/** 0 → 1 over `dur` frames starting at `start`, eased */
export function useProgress(start: number, dur: number) {
  const f = useCurrentFrame();
  return interpolate(f, [start, start + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
}

/** Pure version of useProgress for use inside loops: 0 → 1 over 10 frames from `at` */
export const ramp = (frame: number, at: number, dur = 10) =>
  interpolate(frame, [at, at + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

export function Appear({ at = 0, dur = 14, y = 14, x = 0, children, style }: { at?: number; dur?: number; y?: number; x?: number; children: ReactNode; style?: CSSProperties }) {
  const p = useProgress(at, dur);
  return <div style={{ opacity: p, transform: `translate(${(1 - p) * x}px, ${(1 - p) * y}px)`, ...style }}>{children}</div>;
}

export function Pop({ at = 0, children, style }: { at?: number; children: ReactNode; style?: CSSProperties }) {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f - at, fps, config: { damping: 14, stiffness: 160 } });
  return <div style={{ opacity: Math.min(1, s * 1.4), transform: `scale(${0.85 + 0.15 * s})`, ...style }}>{children}</div>;
}

/** Glass panel with a hairline edge, matching the site's .glass */
export function Panel({ title, side, children, style, edge }: { title?: string; side?: ReactNode; children: ReactNode; style?: CSSProperties; edge?: string }) {
  return (
    <div
      style={{
        position: "absolute",
        borderRadius: 18,
        border: `1px solid ${edge ?? c.hair}`,
        background: `linear-gradient(180deg, ${whiteA(0.045)}, ${whiteA(0.018)})`,
        boxShadow: `inset 0 1px 0 ${whiteA(0.06)}, 0 40px 80px -40px rgba(0,0,0,0.8)`,
        overflow: "hidden",
        ...style,
      }}
    >
      {title && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "14px 20px",
            borderBottom: `1px solid ${whiteA(0.06)}`,
            fontFamily: mono,
            fontSize: 15,
            color: c.meta,
          }}
        >
          <span>{title}</span>
          {side}
        </div>
      )}
      {children}
    </div>
  );
}

type Tone = "mint" | "blue" | "threat" | "meta";
const toneFg: Record<Tone, string> = { mint: c.mint, blue: c.blueText, threat: c.threatText, meta: c.muted };
const toneBg: Record<Tone, string> = { mint: mintA(0.13), blue: blueA(0.17), threat: threatA(0.16), meta: whiteA(0.06) };

export function Tag({ tone, children, size = 15 }: { tone: Tone; children: ReactNode; size?: number }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: `${size * 0.35}px ${size * 0.8}px`,
        borderRadius: 999,
        fontFamily: sans,
        fontWeight: 500,
        fontSize: size,
        lineHeight: 1,
        color: toneFg[tone],
        background: toneBg[tone],
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}

/** Text that types in at `cps` characters per second, with a caret while typing */
export function Typed({ text, at = 0, cps = 40, style, caret = true }: { text: string; at?: number; cps?: number; style?: CSSProperties; caret?: boolean }) {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const n = Math.max(0, Math.min(text.length, Math.floor(((f - at) / fps) * cps)));
  const typing = n < text.length && f >= at;
  return (
    <span style={{ whiteSpace: "pre", ...style }}>
      {text.slice(0, n)}
      {caret && (typing || Math.floor(f / 15) % 2 === 0) && f >= at && (
        <span style={{ display: "inline-block", width: "0.55em", height: "1.05em", marginLeft: 2, verticalAlign: "text-bottom", background: c.mint }} />
      )}
    </span>
  );
}

/** Counts up to `to` with fixed decimals, keeping prefix and suffix */
export function Count({ to, at = 0, dur = 40, decimals = 0, suffix = "", style }: { to: number; at?: number; dur?: number; decimals?: number; suffix?: string; style?: CSSProperties }) {
  const p = useProgress(at, dur);
  return (
    <span style={{ fontVariantNumeric: "tabular-nums", ...style }}>
      {(to * p).toFixed(decimals)}
      {suffix}
    </span>
  );
}

/** A pipeline stage: ring node with a label under it; lit = mint ring, alarm = red ring */
export function StageNode({ x, y, label, sub, lit = 0, alarm = 0, size = 74 }: { x: number; y: number; label: string; sub?: string; lit?: number; alarm?: number; size?: number }) {
  const ring = alarm > 0 ? c.threat : c.mint;
  const glow = Math.max(lit, alarm);
  return (
    <div style={{ position: "absolute", left: x - 110, top: y - size / 2, width: 220, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          border: `2px solid ${glow > 0 ? ring : whiteA(0.16)}`,
          background: glow > 0 ? (alarm > 0 ? threatA(0.12 * alarm) : mintA(0.12 * lit)) : whiteA(0.03),
          boxShadow: `0 0 0 ${8 * glow}px ${alarm > 0 ? threatA(0.08) : mintA(0.07)}`,
        }}
      />
      <div style={{ marginTop: 14, fontFamily: display, fontWeight: 600, fontSize: 19, color: c.ink, textAlign: "center" }}>{label}</div>
      {sub && <div style={{ marginTop: 4, fontFamily: mono, fontSize: 13, color: c.meta, textAlign: "center" }}>{sub}</div>}
    </div>
  );
}

/** A dot travelling from (x1,y) to (x2,y) between frames */
export function Packet({ x1, x2, y, at, dur, color = c.blue }: { x1: number; x2: number; y: number; at: number; dur: number; color?: string }) {
  const f = useCurrentFrame();
  if (f < at || f > at + dur + 4) return null;
  const p = interpolate(f, [at, at + dur], [0, 1], { extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  return <div style={{ position: "absolute", left: x1 + (x2 - x1) * p - 8, top: y - 8, width: 16, height: 16, borderRadius: "50%", background: color }} />;
}

export function Line({ x1, x2, y, color = whiteA(0.12), draw = 1 }: { x1: number; x2: number; y: number; color?: string; draw?: number }) {
  return <div style={{ position: "absolute", left: x1, top: y - 1, width: (x2 - x1) * draw, height: 2, background: color }} />;
}

export const monoText = (size: number, color: string = c.muted): CSSProperties => ({ fontFamily: mono, fontSize: size, color });
export const displayText = (size: number, color: string = c.ink, weight = 700): CSSProperties => ({
  fontFamily: display,
  fontSize: size,
  fontWeight: weight,
  color,
  letterSpacing: "-0.01em",
  lineHeight: 1.05,
});

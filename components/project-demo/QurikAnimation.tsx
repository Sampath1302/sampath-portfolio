"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import AnimationShell from "./AnimationShell";

/* ─── Shared helpers ─── */

interface ConnectorProps {
  x1: number; y1: number; x2: number; y2: number;
  delay: number; color?: string;
}
function Connector({ x1, y1, x2, y2, delay, color = "#7AA7FF" }: ConnectorProps) {
  const len = Math.hypot(x2 - x1, y2 - y1);
  return (
    <motion.line
      x1={x1} y1={y1} x2={x2} y2={y2}
      stroke={color} strokeWidth={1.5} strokeOpacity={0.5}
      strokeDasharray={len}
      initial={{ strokeDashoffset: len }}
      animate={{ strokeDashoffset: 0 }}
      transition={{ delay, duration: 0.55, ease: "easeOut" }}
    />
  );
}

interface PacketProps {
  fromX: number; toX: number; y: number; delay: number; color?: string;
}
function Packet({ fromX, toX, y, delay, color = "#7AA7FF" }: PacketProps) {
  return (
    <motion.circle
      r={4} cy={y}
      fill={color}
      initial={{ cx: fromX, opacity: 0 }}
      animate={{ cx: [fromX, toX, toX], opacity: [0, 1, 0] }}
      transition={{ duration: 1, delay, repeat: Infinity, repeatDelay: 2.2, ease: "easeInOut" }}
    />
  );
}

/* ─── Main visualization ─── */

function QurikSVG({ inView }: { inView: boolean }) {
  // hex at cx=260, cy=104, r=30 (flat-top)
  const hex = "290,104 275,78 245,78 230,104 245,130 275,130";

  return (
    <svg
      viewBox="0 0 740 210"
      className="w-full"
      role="img"
      aria-label="QURIK traffic flow: Requests to Detection Engine to Threat Identified to Blocked"
    >
      {/* Subtle grid */}
      {[52, 104, 156].map((y) => (
        <line key={y} x1={0} y1={y} x2={740} y2={y}
          stroke="#7AA7FF" strokeOpacity={0.03} strokeWidth={1} />
      ))}

      {/* ── Connector lines ── */}
      {inView && (
        <>
          <Connector x1={115} y1={104} x2={230} y2={104} delay={0.6} color="#7AA7FF" />
          <Connector x1={290} y1={104} x2={418} y2={104} delay={1.2} color="#5B8BEB" />
          <Connector x1={476} y1={104} x2={612} y2={104} delay={1.9} color="#E5604F" />
        </>
      )}

      {/* ── Animated packets ── */}
      {inView && (
        <>
          <Packet fromX={117} toX={228} y={104} delay={1.0} color="#7AA7FF" />
          <Packet fromX={292} toX={416} y={104} delay={1.7} color="#5B8BEB" />
          <Packet fromX={478} toX={610} y={104} delay={2.5} color="#E5604F" />
        </>
      )}

      {/* ── Node 1: Requests ── */}
      {inView && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.4 }}>
          {/* Pulse ring */}
          <motion.circle cx={87} cy={104} r={36} fill="none" stroke="#7AA7FF" strokeOpacity={0.15}
            animate={{ r: [34, 42, 34], strokeOpacity: [0.08, 0.2, 0.08] }}
            transition={{ delay: 0.8, duration: 2.2, repeat: Infinity, ease: "easeInOut" }} />
          <circle cx={87} cy={104} r={27} fill="rgba(122,167,255,0.14)" stroke="#7AA7FF" strokeWidth={1.5} />
          <text x={87} y={109} textAnchor="middle" fill="white" fontSize={14} fontFamily="monospace">→</text>
          <text x={87} y={148} textAnchor="middle" fill="#CBD5E1" fontSize={8.5} fontFamily="monospace" fontWeight="bold" letterSpacing="1">REQUESTS</text>
          <text x={87} y={162} textAnchor="middle" fill="#475569" fontSize={7.5} fontFamily="monospace">HTTP/HTTPS</text>
        </motion.g>
      )}

      {/* ── Node 2: Detection Engine (hexagon) ── */}
      {inView && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 0.4 }}>
          {/* Hex outer pulse */}
          <motion.polygon points="300,104 283,74 253,74 236,104 253,134 283,134"
            fill="none" stroke="#5B8BEB" strokeOpacity={0.15}
            animate={{ strokeOpacity: [0.08, 0.25, 0.08] }}
            transition={{ delay: 1.5, duration: 1.8, repeat: Infinity }} />
          <polygon points={hex} fill="rgba(91,139,235,0.14)" stroke="#5B8BEB" strokeWidth={1.5} />
          <text x={260} y={110} textAnchor="middle" fill="white" fontSize={13} fontFamily="monospace">◉</text>
          <text x={260} y={153} textAnchor="middle" fill="#CBD5E1" fontSize={8.5} fontFamily="monospace" fontWeight="bold" letterSpacing="1">DETECTION ENGINE</text>
          <text x={260} y={167} textAnchor="middle" fill="#475569" fontSize={7.5} fontFamily="monospace">ML + Rule-based</text>
        </motion.g>
      )}

      {/* ── Node 3: Threat ID ── */}
      {inView && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 0.4 }}>
          <motion.circle cx={447} cy={104} r={36} fill="none" stroke="#E5604F" strokeOpacity={0.12}
            animate={{ r: [34, 42, 34], strokeOpacity: [0.06, 0.22, 0.06] }}
            transition={{ delay: 2, duration: 1.6, repeat: Infinity }} />
          <circle cx={447} cy={104} r={27} fill="rgba(229,96,79,0.13)" stroke="#E5604F" strokeWidth={1.5} />
          <text x={447} y={110} textAnchor="middle" fill="#F3AFA5" fontSize={14} fontFamily="monospace">⚠</text>
          <text x={447} y={148} textAnchor="middle" fill="#CBD5E1" fontSize={8.5} fontFamily="monospace" fontWeight="bold" letterSpacing="1">THREAT ID</text>
          <text x={447} y={162} textAnchor="middle" fill="#E5604F" fontSize={7.5} fontFamily="monospace">HIGH SEVERITY</text>
        </motion.g>
      )}

      {/* ── Node 4: Blocked ── */}
      {inView && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2, duration: 0.4 }}>
          <circle cx={639} cy={104} r={27} fill="rgba(34,197,94,0.12)" stroke="#4FC3A1" strokeWidth={1.5} />
          <text x={639} y={110} textAnchor="middle" fill="#9BE0CB" fontSize={14} fontFamily="monospace">✓</text>
          <text x={639} y={148} textAnchor="middle" fill="#CBD5E1" fontSize={8.5} fontFamily="monospace" fontWeight="bold" letterSpacing="1">BLOCKED</text>
          <text x={639} y={162} textAnchor="middle" fill="#4FC3A1" fontSize={7.5} fontFamily="monospace">NEUTRALIZED</text>
        </motion.g>
      )}

      {/* Alert flash label near Threat node */}
      {inView && (
        <motion.text
          x={447} y={60}
          textAnchor="middle" fill="#EE8A7C" fontSize={7} fontFamily="monospace"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{ delay: 2.6, duration: 2.4, repeat: Infinity, repeatDelay: 3.5 }}
        >
          SQL INJECTION DETECTED
        </motion.text>
      )}
    </svg>
  );
}

export default function QurikAnimation({ onComplete }: { onComplete: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0 });

  return (
    <AnimationShell
      title="QURIK"
      subtitle="Intelligent Web Security Dashboard"
      classification="Defensive Security Platform — Case File #001"
      duration={8000}
      onComplete={onComplete}
    >
      <div ref={ref} className="px-6 py-7">
        {/* Section label */}
        <div className="flex items-center gap-2 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[#7AA7FF] animate-pulse" />
          <span className="text-[#7AA7FF] font-mono text-[10px] tracking-widest">
            TRAFFIC FLOW VISUALIZATION
          </span>
        </div>

        <QurikSVG inView={inView} />

        {/* Status bar */}
        <div className="flex flex-wrap items-center gap-5 mt-4 pt-3 border-t border-white/5">
          <span className="flex items-center gap-1.5 font-mono text-[10px] text-[#4FC3A1]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4FC3A1]"
              style={{ animation: "ping 1.5s cubic-bezier(0,0,0.2,1) infinite" }} />
            SYSTEM ACTIVE
          </span>
          <span className="text-slate-600 font-mono text-[10px]">96.8% accuracy</span>
          <span className="text-slate-600 font-mono text-[10px]">15K events/sec</span>
          <span className="text-slate-600 font-mono text-[10px]">340ms latency</span>
        </div>
      </div>
    </AnimationShell>
  );
}

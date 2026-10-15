"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import AnimationShell from "./AnimationShell";

/* ─── Bezier path connector ─── */
interface PathConnectorProps {
  d: string;
  delay: number;
  color?: string;
  dashLen?: number;
}
function PathConnector({ d, delay, color = "#7AA7FF", dashLen = 200 }: PathConnectorProps) {
  return (
    <motion.path
      d={d}
      fill="none"
      stroke={color}
      strokeWidth={1.5}
      strokeOpacity={0.45}
      strokeDasharray={dashLen}
      initial={{ strokeDashoffset: dashLen }}
      animate={{ strokeDashoffset: 0 }}
      transition={{ delay, duration: 0.6, ease: "easeOut" }}
    />
  );
}

/* ─── Simple vertical line ─── */
interface VLineProps { x: number; y1: number; y2: number; delay: number; color?: string; }
function VLine({ x, y1, y2, delay, color = "#7AA7FF" }: VLineProps) {
  const len = y2 - y1;
  return (
    <motion.line
      x1={x} y1={y1} x2={x} y2={y2}
      stroke={color} strokeWidth={1.5} strokeOpacity={0.4}
      strokeDasharray={len}
      initial={{ strokeDashoffset: len }}
      animate={{ strokeDashoffset: 0 }}
      transition={{ delay, duration: 0.4 }}
    />
  );
}

/* ─── Circle node ─── */
interface NodeCircleProps {
  cx: number; cy: number; r: number;
  fill: string; stroke: string;
  icon: string; label: string; sublabel?: string;
  delay: number; pulse?: boolean;
}
function NodeCircle({ cx, cy, r, fill, stroke, icon, label, sublabel, delay, pulse }: NodeCircleProps) {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay, duration: 0.4 }}>
      {pulse && (
        <motion.circle cx={cx} cy={cy}
          fill="none" stroke={stroke} strokeOpacity={0.12}
          animate={{ r: [r + 4, r + 12, r + 4], strokeOpacity: [0.06, 0.2, 0.06] }}
          transition={{ delay: delay + 0.5, duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      <circle cx={cx} cy={cy} r={r} fill={fill} stroke={stroke} strokeWidth={1.5} />
      <text x={cx} y={cy + 4} textAnchor="middle" fill="white" fontSize={11} fontFamily="monospace">{icon}</text>
      <text x={cx} y={cy + r + 16} textAnchor="middle" fill="#CBD5E1" fontSize={10.5} fontFamily="monospace" fontWeight="bold" letterSpacing="0.8">{label}</text>
      {sublabel && (
        <text x={cx} y={cy + r + 28} textAnchor="middle" fill="#8B98AA" fontSize={9.5} fontFamily="monospace">{sublabel}</text>
      )}
    </motion.g>
  );
}

/* ─── Small branch node ─── */
interface BranchNodeProps { cx: number; cy: number; label: string; delay: number; }
function BranchNode({ cx, cy, label, delay }: BranchNodeProps) {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay, duration: 0.35 }}>
      <rect x={cx - 30} y={cy - 12} width={60} height={24} rx={4}
        fill="rgba(122,167,255,0.08)" stroke="#7AA7FF" strokeWidth={1} strokeOpacity={0.35} />
      <text x={cx} y={cy + 4} textAnchor="middle" fill="#7AA7FF" fontSize={10.5} fontFamily="monospace">{label}</text>
    </motion.g>
  );
}

function HH8SVG({ inView }: { inView: boolean }) {
  const CX = 370; // center x
  // Y positions
  // Each node's label sits ~52px below its centre, so rows are spaced 90px apart
  const Y_ROOT = 32, Y_CRAWL = 122, Y_BRANCH = 212, Y_ANAL = 302, Y_VULN = 392, Y_REPORT = 478;
  const BELOW = 56; // first y clear of a node's label
  const BX = [200, CX, 540]; // branch x positions

  return (
    <svg viewBox="0 0 740 530" className="w-full" role="img"
      aria-label="HH8 Scanner: crawler discovery tree from target to vulnerability report">

      {/* ── Root → Crawler ── */}
      {inView && <VLine x={CX} y1={Y_ROOT + BELOW} y2={Y_CRAWL - 22} delay={0.5} />}

      {/* ── Crawler → Branches (cubic bezier) ── */}
      {inView && (
        <>
          <PathConnector
            d={`M ${CX} ${Y_CRAWL + BELOW} C ${CX} ${Y_CRAWL + 70} ${BX[0]} ${Y_BRANCH - 45} ${BX[0]} ${Y_BRANCH - 12}`}
            delay={1.0} color="#7AA7FF" dashLen={160}
          />
          <PathConnector
            d={`M ${CX} ${Y_CRAWL + BELOW} L ${CX} ${Y_BRANCH - 12}`}
            delay={1.0} color="#7AA7FF" dashLen={80}
          />
          <PathConnector
            d={`M ${CX} ${Y_CRAWL + BELOW} C ${CX} ${Y_CRAWL + 70} ${BX[2]} ${Y_BRANCH - 45} ${BX[2]} ${Y_BRANCH - 12}`}
            delay={1.0} color="#7AA7FF" dashLen={160}
          />
        </>
      )}

      {/* ── Branches → Header Analysis ── */}
      {inView && (
        <>
          <PathConnector
            d={`M ${BX[0]} ${Y_BRANCH + 12} C ${BX[0]} ${Y_ANAL - 45} ${CX} ${Y_ANAL - 55} ${CX} ${Y_ANAL - 22}`}
            delay={1.6} color="#5B8BEB" dashLen={160}
          />
          <PathConnector
            d={`M ${CX} ${Y_BRANCH + 12} L ${CX} ${Y_ANAL - 22}`}
            delay={1.6} color="#5B8BEB" dashLen={80}
          />
          <PathConnector
            d={`M ${BX[2]} ${Y_BRANCH + 12} C ${BX[2]} ${Y_ANAL - 45} ${CX} ${Y_ANAL - 55} ${CX} ${Y_ANAL - 22}`}
            delay={1.6} color="#5B8BEB" dashLen={160}
          />
        </>
      )}

      {/* ── Analysis → Vuln → Report ── */}
      {inView && (
        <>
          <VLine x={CX} y1={Y_ANAL + BELOW} y2={Y_VULN - 22} delay={2.3} color="#E5604F" />
          <VLine x={CX} y1={Y_VULN + BELOW} y2={Y_REPORT - 18} delay={2.9} color="#4FC3A1" />
        </>
      )}

      {/* ── NODES ── */}
      {inView && (
        <>
          {/* Root */}
          <NodeCircle cx={CX} cy={Y_ROOT} r={22} fill="rgba(71,85,105,0.2)" stroke="#64748B"
            icon="◎" label="TARGET URL" sublabel="https://target.example.com" delay={0.2} />
          {/* Crawler */}
          <NodeCircle cx={CX} cy={Y_CRAWL} r={22} fill="rgba(122,167,255,0.14)" stroke="#7AA7FF"
            icon="⊕" label="CRAWLER ENGINE" sublabel="Recursive discovery" delay={0.6} pulse />
          {/* Branch nodes */}
          <BranchNode cx={BX[0]} cy={Y_BRANCH} label="/login.php" delay={1.2} />
          <BranchNode cx={BX[1]} cy={Y_BRANCH} label="/api/v1" delay={1.35} />
          <BranchNode cx={BX[2]} cy={Y_BRANCH} label="/admin" delay={1.5} />
          {/* Discovery count */}
          <motion.text x={BX[2]} y={Y_BRANCH + 30} textAnchor="middle" fill="#8B98AA" fontSize={10} fontFamily="monospace"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.7 }}>
            47 URLs discovered
          </motion.text>
          {/* Header Analysis */}
          <NodeCircle cx={CX} cy={Y_ANAL} r={22} fill="rgba(91,139,235,0.14)" stroke="#5B8BEB"
            icon="≡" label="HEADER ANALYSIS" sublabel="Security headers audit" delay={2.0} />
          {/* Vuln Found */}
          <NodeCircle cx={CX} cy={Y_VULN} r={22} fill="rgba(229,96,79,0.14)" stroke="#E5604F"
            icon="⚠" label="VULN FOUND" sublabel="3 HIGH · 5 MEDIUM" delay={2.5} pulse />
          {/* Report */}
          <NodeCircle cx={CX} cy={Y_REPORT} r={18} fill="rgba(34,197,94,0.12)" stroke="#4FC3A1"
            icon="✓" label="REPORT GENERATED" delay={3.1} />
        </>
      )}
    </svg>
  );
}

export default function HH8Animation({ onComplete }: { onComplete: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0 });

  return (
    <AnimationShell
      title="HH8 Scanner"
      subtitle="Web Vulnerability Assessment Tool"
      classification="Offensive Security Tool — Case File #002"
      duration={9000}
      onComplete={onComplete}
    >
      <div ref={ref} className="px-6 py-7">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#7AA7FF] animate-pulse" />
          <span className="text-[#7AA7FF] font-mono text-[10px] tracking-widest">CRAWLER DISCOVERY TREE</span>
        </div>
        <HH8SVG inView={inView} />
        <div className="flex flex-wrap gap-4 mt-2 pt-3 border-t border-white/5">
          <span className="flex items-center gap-1.5 font-mono text-[10px] text-[#4FC3A1]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4FC3A1] animate-ping" style={{ animationDuration: "1.5s" }} />
            SCAN ACTIVE
          </span>
          <span className="text-muted font-mono text-[10px]">47 URLs crawled</span>
          <span className="text-red-400 font-mono text-[10px]">3 HIGH severity findings</span>
        </div>
      </div>
    </AnimationShell>
  );
}

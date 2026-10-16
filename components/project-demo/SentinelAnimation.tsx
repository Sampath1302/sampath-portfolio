"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import AnimationShell from "./AnimationShell";

interface ConnectorProps {
  x1: number; y1: number; x2: number; y2: number;
  delay: number; color?: string;
}
function Connector({ x1, y1, x2, y2, delay, color = "#82a6e6" }: ConnectorProps) {
  const len = Math.hypot(x2 - x1, y2 - y1);
  return (
    <motion.line
      x1={x1} y1={y1} x2={x2} y2={y2}
      stroke={color} strokeWidth={1.5} strokeOpacity={0.45}
      strokeDasharray={len}
      initial={{ strokeDashoffset: len }}
      animate={{ strokeDashoffset: 0 }}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
    />
  );
}

interface PacketProps {
  fromX: number; toX: number; y: number; delay: number; color?: string;
}
function Packet({ fromX, toX, y, delay, color = "#82a6e6" }: PacketProps) {
  return (
    <motion.circle r={4} cy={y} fill={color}
      initial={{ cx: fromX, opacity: 0 }}
      animate={{ cx: [fromX, toX, toX], opacity: [0, 1, 0] }}
      transition={{ duration: 1, delay, repeat: Infinity, repeatDelay: 2.4, ease: "easeInOut" }}
    />
  );
}

/* Node definitions */
const NODES = [
  { x: 60,  label: "CLOUD LOGS",  icon: "☁", stroke: "#858c98", fill: "rgba(133,140,152,0.12)", sub: "SigninLogs · AuditLogs" },
  { x: 200, label: "SENTINEL",    icon: "◉", stroke: "#82a6e6", fill: "rgba(130,166,230,0.14)", sub: "SIEM Platform"         },
  { x: 370, label: "KQL RULE",    icon: "{}", stroke: "#6f93d6", fill: "rgba(111,147,214,0.14)", sub: "Threat hunting"        },
  { x: 530, label: "INCIDENT",    icon: "⚡", stroke: "#82a6e6", fill: "rgba(130,166,230,0.13)", sub: "#4821 HIGH"            },
  { x: 680, label: "SOAR",        icon: "⚙", stroke: "#98dcc2", fill: "rgba(152,220,194,0.12)", sub: "Auto-response"          },
] as const;

// connector x edges (r=26)
const EDGES: [number, number, string][] = [
  [86,  174, "#858c98"],
  [226, 344, "#82a6e6"],
  [396, 504, "#6f93d6"],
  [556, 654, "#82a6e6"],
];

function SentinelSVG({ inView }: { inView: boolean }) {
  return (
    <svg viewBox="0 0 740 230" className="w-full" role="img"
      aria-label="Azure Sentinel detection pipeline: Cloud Logs to Sentinel to KQL to Incident to SOAR">

      {/* Subtle grid */}
      {[57, 114, 171].map((y) => (
        <line key={y} x1={0} y1={y} x2={740} y2={y} stroke="#82a6e6" strokeOpacity={0.03} />
      ))}

      {/* ── Connector lines ── */}
      {inView && EDGES.map(([x1, x2, color], i) => (
        <Connector key={i} x1={x1} y1={110} x2={x2} y2={110} delay={0.5 + i * 0.55} color={color} />
      ))}

      {/* ── Packets ── */}
      {inView && EDGES.map(([x1, x2, color], i) => (
        <Packet key={i} fromX={x1 + 2} toX={x2 - 2} y={110} delay={1.0 + i * 0.6} color={color} />
      ))}

      {/* ── Nodes ── */}
      {inView && NODES.map((n, i) => (
        <motion.g key={n.label}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 + i * 0.4, duration: 0.4 }}
        >
          {(i === 1 || i === 4) && (
            <motion.circle cx={n.x} cy={110} fill="none" stroke={n.stroke} strokeOpacity={0.12}
              animate={{ r: [32, 40, 32], strokeOpacity: [0.06, 0.2, 0.06] }}
              transition={{ delay: 0.6 + i * 0.4, duration: 2, repeat: Infinity }}
            />
          )}
          <circle cx={n.x} cy={110} r={26} fill={n.fill} stroke={n.stroke} strokeWidth={1.5} />
          <text x={n.x} y={115} textAnchor="middle" fill="white" fontSize={i === 2 ? 10 : 13} fontFamily="monospace">{n.icon}</text>
          <text x={n.x} y={152} textAnchor="middle" fill="#c6cad2" fontSize={10.5} fontFamily="monospace" fontWeight="bold" letterSpacing="0.8">{n.label}</text>
          <text x={n.x} y={165} textAnchor="middle" fill="#aeb4bf" fontSize={9.5} fontFamily="monospace">{n.sub}</text>
        </motion.g>
      ))}

      {/* KQL query snippet */}
      {inView && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.0, duration: 0.5 }}>
          <rect x={272} y={41} width={196} height={31} rx={3}
            fill="rgba(0,0,0,0.6)" stroke="#6f93d6" strokeWidth={1} strokeOpacity={0.4} />
          <text x={370} y={53} textAnchor="middle" fill="#6f93d6" fontSize={8.5} fontFamily="monospace">SigninLogs | where ResultType != 0</text>
          <text x={370} y={64} textAnchor="middle" fill="#aeb4bf" fontSize={8.5} fontFamily="monospace">| where FailedAttempts {"> threshold"}</text>
        </motion.g>
      )}

      {/* MITRE label near Incident node */}
      {inView && (
        <motion.text x={566} y={62} textAnchor="middle" fill="#82a6e6" fontSize={9.5} fontFamily="monospace"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{ delay: 3.0, duration: 2.5, repeat: Infinity, repeatDelay: 4 }}>
          T1078 — Valid Accounts
        </motion.text>
      )}
    </svg>
  );
}

export default function SentinelAnimation({ onComplete }: { onComplete: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0 });

  return (
    <AnimationShell
      title="Azure Sentinel"
      subtitle="Cloud Threat Hunting Playbook"
      classification="Cloud Security Operations — Case File #003"
      duration={9000}
      onComplete={onComplete}
    >
      <div ref={ref} className="px-6 py-7">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[#82a6e6] animate-pulse" />
          <span className="text-[#82a6e6] font-mono text-[11px] tracking-widest">DETECTION PIPELINE</span>
        </div>
        <SentinelSVG inView={inView} />
        <div className="flex flex-wrap gap-4 mt-3 pt-3 border-t border-white/5">
          <span className="flex items-center gap-1.5 font-mono text-[11px] text-[#98dcc2]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#98dcc2] animate-ping" style={{ animationDuration: "1.5s" }} />
            24 RULES ACTIVE
          </span>
          <span className="text-muted font-mono text-[11px]">Incident #4821 created</span>
          <span className="text-[#98dcc2] font-mono text-[11px]">SOAR response triggered</span>
        </div>
      </div>
    </AnimationShell>
  );
}

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

// ──────────────────────────────────────────────────────────────
// TYPES & DATA
// ──────────────────────────────────────────────────────────────

interface SceneProps {
  onComplete: () => void;
  reduced: boolean;
}

const NORMAL_TRAFFIC = [
  { time: "08:14:32", proto: "HTTPS", src: "192.168.1.45", status: "allow" },
  { time: "08:14:33", proto: "DNS",   src: "192.168.1.12", status: "allow" },
  { time: "08:14:35", proto: "HTTP",  src: "192.168.1.87", status: "allow" },
  { time: "08:14:36", proto: "AUTH",  src: "192.168.1.22", status: "allow" },
  { time: "08:14:38", proto: "TLS",   src: "192.168.1.63", status: "allow" },
  { time: "08:14:39", proto: "DNS",   src: "192.168.1.31", status: "allow" },
] as const;

const TOPOLOGY_NODES = [
  { label: "INTERNET",         sub: "External network",    color: "#858c98" },
  { label: "NETWORK GATEWAY",  sub: "Border router",       color: "#aec5f0" },
  { label: "QURIK IDPS",       sub: "Detection engine",    color: "#82a6e6", highlight: true },
  { label: "PROTECTED HOSTS",  sub: "8 systems monitored", color: "#98dcc2" },
];

const DETECTION_PIPELINE = [
  { label: "TRAFFIC INGESTION",        sub: "Packet capture",   color: "#aec5f0" },
  { label: "FEATURE EXTRACTION",       sub: "Pattern & metadata", color: "#aec5f0" },
  { label: "RULE / ANOMALY ANALYSIS",  sub: "KNN + rule engine", color: "#82a6e6" },
  { label: "THREAT CLASSIFICATION",    sub: "Severity scoring", color: "#82a6e6" },
  { label: "SECURITY DECISION",        sub: "Block or allow",   color: "#E5604F" },
];

const ARCH_NODES = [
  { label: "INTERNET",            color: "#858c98" },
  { label: "NETWORK TRAFFIC",     color: "#aec5f0" },
  { label: "QURIK IDPS ENGINE",   color: "#82a6e6" },
  { label: "THREAT ANALYSIS",     color: "#82a6e6" },
  { label: "SECURITY DECISION",   color: "#E5604F" },
  { label: "PREVENTION / BLOCK",  color: "#98dcc2" },
  { label: "PROTECTED HOSTS",     color: "#98dcc2" },
];

const INCIDENT_TIMELINE = [
  "Detection", "Analysis", "Decision", "Prevention", "Containment",
];

const SCENE_LABELS = [
  "NETWORK ACTIVITY",
  "NORMAL TRAFFIC",
  "SUSPICIOUS ACTIVITY",
  "DETECTION ENGINE",
  "PREVENTION DECISION",
  "SECURITY DASHBOARD",
  "INCIDENT DETAIL",
  "IDPS ARCHITECTURE",
  "DETECT + PREVENT",
  "COMPLETE",
];

// Duration per scene in ms
const SCENE_DURATIONS = [5000, 4000, 3500, 5500, 4000, 4500, 4500, 4000, 4000, 4500];
const TOTAL_SCENES = SCENE_DURATIONS.length;

// ──────────────────────────────────────────────────────────────
// SHARED UI
// ──────────────────────────────────────────────────────────────

function PulseDot({ color = "#98dcc2" }: { color?: string }) {
  return (
    <span className="relative flex h-2 w-2 flex-shrink-0">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60" style={{ backgroundColor: color }} />
      <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: color }} />
    </span>
  );
}

function SLabel({ text, color = "#98dcc2" }: { text: string; color?: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <PulseDot color={color} />
      <span className="font-mono text-[11px] tracking-widest text-muted">{text}</span>
    </div>
  );
}

function Arrow() {
  return (
    <div className="flex flex-col items-center overflow-hidden" style={{ height: 16 }}>
      <div className="flex-1 w-px bg-raised" />
      <div className="w-1 h-1 border-r border-b border-white/10 rotate-45 -mt-0.5" />
    </div>
  );
}

function SimHeader({
  scene,
  progress,
  onJump,
}: {
  scene: number;
  progress: number;
  onJump: (s: number) => void;
}) {
  return (
    <div className="border-b border-white/8 bg-black/30 px-5 pt-4 pb-3 select-none">
      {/* Status row */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <PulseDot color="#98dcc2" />
          <span className="font-mono text-[11px] tracking-[0.2em] text-[#98dcc2] uppercase">
            Protection Active
          </span>
        </div>
        <span className="font-mono text-[11px] text-meta tracking-widest uppercase border border-line px-2 py-0.5 rounded">
          Simulated Security Environment
        </span>
      </div>
      {/* Title row */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="font-mono text-white text-xs font-bold tracking-[0.18em] uppercase">
            Live IDPS Simulation
          </p>
          <p className="font-mono text-meta text-[11px] mt-0.5">
            Intrusion Detection &amp; Prevention System · Simulated demonstration
          </p>
        </div>
        <div className="text-right ml-4 flex-shrink-0">
          <p className="font-mono text-[#98dcc2] text-[11px] tracking-widest">{SCENE_LABELS[scene - 1]}</p>
          <p className="font-mono text-meta text-[11px] mt-0.5">SCENE {scene} / {TOTAL_SCENES}</p>
        </div>
      </div>
      {/* Progress bar */}
      <div className="h-px bg-surface rounded overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-[#98dcc2] to-[#aec5f0] rounded-full"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "linear" }}
        />
      </div>
      {/* Scene dots */}
      <div className="flex items-center gap-1 mt-2.5">
        {Array.from({ length: TOTAL_SCENES }, (_, i) => (
          <button
            key={i}
            onClick={() => onJump(i + 1)}
            aria-label={`Scene ${i + 1}: ${SCENE_LABELS[i]}`}
            className="rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#98dcc2]"
            style={{
              width:  i + 1 === scene ? "16px" : "5px",
              height: "5px",
              backgroundColor:
                i + 1 === scene  ? "#98dcc2"
                : i + 1 < scene  ? "rgba(152,220,194,0.35)"
                : "#262b34",
            }}
          />
        ))}
        <span className="font-mono text-[11px] text-meta ml-auto">{scene}/{TOTAL_SCENES}</span>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// SCENE 1 — NETWORK ACTIVITY
// ──────────────────────────────────────────────────────────────

function Scene1({ onComplete, reduced }: SceneProps) {
  const [packets, setPackets]     = useState(reduced ? 8472 : 0);
  const [conns, setConns]         = useState(reduced ? 527 : 0);
  const [topoStep, setTopoStep]   = useState(reduced ? TOPOLOGY_NODES.length : 0);
  const done = useRef(false);

  const PKT_TARGET  = 8472;
  const CONN_TARGET = 527;

  useEffect(() => {
    if (reduced) {
      const t = setTimeout(() => { if (!done.current) { done.current = true; onComplete(); } }, 800);
      return () => clearTimeout(t);
    }

    const nodeIv = setInterval(() => {
      setTopoStep(s => {
        if (s >= TOPOLOGY_NODES.length) { clearInterval(nodeIv); return s; }
        return s + 1;
      });
    }, 380);

    const start = Date.now();
    const dur   = 4000;
    const ctrIv = setInterval(() => {
      const p = Math.min((Date.now() - start) / dur, 1);
      const e = 1 - Math.pow(1 - p, 2.5);
      setPackets(Math.round(e * PKT_TARGET));
      setConns(Math.round(e * CONN_TARGET));
      if (p >= 1) {
        clearInterval(ctrIv);
        setTimeout(() => { if (!done.current) { done.current = true; onComplete(); } }, 800);
      }
    }, 40);

    return () => { clearInterval(nodeIv); clearInterval(ctrIv); };
  }, [onComplete, reduced]);

  return (
    <div className="p-5">
      <SLabel text="NETWORK ACTIVITY MONITOR" color="#98dcc2" />
      <div className="grid sm:grid-cols-2 gap-4">
        {/* Topology */}
        <div className="rounded-lg border border-white/8 bg-black/50 p-4">
          <p className="font-mono text-[11px] text-meta uppercase tracking-widest mb-4">Network Topology</p>
          <div className="flex flex-col items-center">
            {TOPOLOGY_NODES.map((node, i) => (
              <div key={node.label} className="flex flex-col items-center w-full">
                {i < topoStep && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.28 }}
                    className="w-full px-3 py-2 rounded border text-center"
                    style={{
                      borderColor: `${node.color}30`,
                      backgroundColor: `${node.color}08`,
                      boxShadow: node.highlight ? `0 0 14px ${node.color}14` : undefined,
                    }}
                  >
                    <p className="font-mono text-[11px] font-bold" style={{ color: node.color }}>{node.label}</p>
                    <p className="font-mono text-[11px] text-meta mt-0.5">{node.sub}</p>
                  </motion.div>
                )}
                {i < TOPOLOGY_NODES.length - 1 && i < topoStep && (
                  <div className="relative flex flex-col items-center" style={{ height: 22 }}>
                    <div className="w-px flex-1 bg-raised" />
                    {/* Flowing packet dot */}
                    <motion.div
                      animate={{ y: [-2, 20] }}
                      transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 0.4, ease: "linear" }}
                      className="absolute top-0 w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: node.color }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Counters */}
        <div className="flex flex-col gap-3">
          <div className="rounded-lg border border-[#aec5f0]/15 bg-[#aec5f0]/4 p-4">
            <p className="font-mono text-[11px] text-meta uppercase tracking-widest mb-1">Packets Analyzed</p>
            <p className="font-mono text-3xl font-bold text-[#aec5f0]">{packets.toLocaleString()}</p>
            <p className="font-mono text-[11px] text-meta mt-1">events / session</p>
          </div>
          <div className="rounded-lg border border-[#98dcc2]/15 bg-[#98dcc2]/4 p-4">
            <p className="font-mono text-[11px] text-meta uppercase tracking-widest mb-1">Connections</p>
            <p className="font-mono text-3xl font-bold text-[#98dcc2]">{conns.toLocaleString()}</p>
            <p className="font-mono text-[11px] text-meta mt-1">monitored flows</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#98dcc2]/20 bg-[#98dcc2]/5">
            <PulseDot color="#98dcc2" />
            <span className="font-mono text-xs text-[#98dcc2] font-bold">SYSTEM PROTECTED</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// SCENE 2 — NORMAL TRAFFIC
// ──────────────────────────────────────────────────────────────

function Scene2({ onComplete, reduced }: SceneProps) {
  const [count, setCount] = useState(reduced ? NORMAL_TRAFFIC.length - 1 : -1);
  const done = useRef(false);

  useEffect(() => {
    if (reduced) {
      const t = setTimeout(() => { if (!done.current) { done.current = true; onComplete(); } }, 800);
      return () => clearTimeout(t);
    }
    const iv = setInterval(() => {
      setCount(c => {
        if (c >= NORMAL_TRAFFIC.length - 1) {
          clearInterval(iv);
          setTimeout(() => { if (!done.current) { done.current = true; onComplete(); } }, 1800);
          return c;
        }
        return c + 1;
      });
    }, 480);
    return () => clearInterval(iv);
  }, [onComplete, reduced]);

  return (
    <div className="p-5">
      <SLabel text="TRAFFIC ANALYSIS" color="#98dcc2" />
      <div className="rounded-lg border border-white/8 bg-black/50 overflow-hidden mb-4">
        <div className="grid grid-cols-[3.5rem_3rem_1fr_3.5rem] gap-x-2 px-3 py-1.5 border-b border-white/5 font-mono text-[11px] text-meta uppercase tracking-widest">
          <span>Time</span><span>Proto</span><span>Source</span><span className="text-right">Status</span>
        </div>
        <div className="px-2 py-1 min-h-[160px] space-y-0.5">
          {NORMAL_TRAFFIC.slice(0, count + 1).map((ev, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-[3.5rem_3rem_1fr_3.5rem] gap-x-2 px-1.5 py-1 rounded font-mono text-[11px]"
            >
              <span className="text-meta">{ev.time}</span>
              <span className="text-[#aec5f0]/70">{ev.proto}</span>
              <span className="text-muted truncate">{ev.src}</span>
              <span className="text-mint text-right">ALLOW</span>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="rounded-lg border border-[#98dcc2]/15 bg-[#98dcc2]/4 p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="font-mono text-[11px] text-meta uppercase tracking-widest">Normal Traffic</p>
          <span className="font-mono text-[11px] text-[#98dcc2]">100%</span>
        </div>
        <div className="h-2 rounded-full bg-surface overflow-hidden mb-3">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.5 }}
            className="h-full rounded-full bg-gradient-to-r from-[#98dcc2] to-mint-hi"
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] text-meta">Threat Level</span>
          <span className="font-mono text-xs text-mint font-bold px-2 py-0.5 rounded bg-mint/10 border border-mint/20">LOW</span>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// SCENE 3 — SUSPICIOUS ACTIVITY
// ──────────────────────────────────────────────────────────────

function Scene3({ onComplete, reduced }: SceneProps) {
  const [alert, setAlert] = useState(reduced);
  const done = useRef(false);

  useEffect(() => {
    if (reduced) {
      const t = setTimeout(() => { if (!done.current) { done.current = true; onComplete(); } }, 800);
      return () => clearTimeout(t);
    }
    const t1 = setTimeout(() => setAlert(true), 1100);
    const t2 = setTimeout(() => { if (!done.current) { done.current = true; onComplete(); } }, 3500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onComplete, reduced]);

  return (
    <div className="p-5">
      <div className="flex items-center gap-2 mb-4">
        <PulseDot color={alert ? "#E5604F" : "#98dcc2"} />
        <span className={`font-mono text-[11px] tracking-widest transition-colors duration-500 ${alert ? "text-red-400" : "text-muted"}`}>
          {alert ? "⚠ SUSPICIOUS ACTIVITY DETECTED" : "MONITORING — ANALYSING TRAFFIC"}
        </span>
      </div>

      <div className="rounded-lg border border-white/8 bg-black/50 overflow-hidden mb-4">
        <div className="grid grid-cols-[3.5rem_3rem_1fr_3.5rem] gap-x-2 px-3 py-1.5 border-b border-white/5 font-mono text-[11px] text-meta uppercase tracking-widest">
          <span>Time</span><span>Proto</span><span>Source</span><span className="text-right">Status</span>
        </div>
        <div className="px-2 py-1 space-y-0.5">
          {NORMAL_TRAFFIC.slice(0, 3).map((ev, i) => (
            <div key={i} className="grid grid-cols-[3.5rem_3rem_1fr_3.5rem] gap-x-2 px-1.5 py-1 rounded font-mono text-[11px]">
              <span className="text-meta">{ev.time}</span>
              <span className="text-[#aec5f0]/70">{ev.proto}</span>
              <span className="text-muted truncate">{ev.src}</span>
              <span className="text-mint text-right">ALLOW</span>
            </div>
          ))}
          <AnimatePresence>
            {alert && (
              <motion.div
                initial={{ opacity: 0, x: -6, backgroundColor: "rgba(229,96,79,0.25)" }}
                animate={{ opacity: 1, x: 0, backgroundColor: "rgba(229,96,79,0.08)" }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-[3.5rem_3rem_1fr_3.5rem] gap-x-2 px-1.5 py-1.5 rounded border border-red-500/25 font-mono text-[11px]"
              >
                <span className="text-muted">08:14:41</span>
                <span className="text-red-400">TCP</span>
                <span className="text-red-400 font-bold truncate">10.10.24.17</span>
                <span className="text-red-400 text-right font-bold">ALERT</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {alert && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg border border-red-500/25 bg-red-500/5 p-4"
          >
            <p className="font-mono text-[11px] text-meta uppercase tracking-widest mb-3">Suspicious Event Detail</p>
            <div className="grid sm:grid-cols-3 gap-3">
              <div><p className="font-mono text-[11px] text-meta mb-1">Source</p>
                <p className="font-mono text-sm text-red-400 font-bold">10.10.24.17</p></div>
              <div><p className="font-mono text-[11px] text-meta mb-1">Destination</p>
                <p className="font-mono text-sm text-blue-text">Protected Host</p></div>
              <div><p className="font-mono text-[11px] text-meta mb-1">Behavior</p>
                <p className="font-mono text-sm text-[#c6cad2]">Abnormal pattern</p></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// SCENE 4 — DETECTION ENGINE
// ──────────────────────────────────────────────────────────────

function Scene4({ onComplete, reduced }: SceneProps) {
  const [pStep, setPStep]     = useState(reduced ? DETECTION_PIPELINE.length : 0);
  const [score, setScore]     = useState(reduced ? 94 : 0);
  const [detected, setDetected] = useState(reduced);
  const done = useRef(false);

  useEffect(() => {
    if (reduced) {
      const t = setTimeout(() => { if (!done.current) { done.current = true; onComplete(); } }, 800);
      return () => clearTimeout(t);
    }

    const pipelineIv = setInterval(() => {
      setPStep(s => {
        if (s >= DETECTION_PIPELINE.length) { clearInterval(pipelineIv); return s; }
        return s + 1;
      });
    }, 640);

    let scoreIv: ReturnType<typeof setInterval>;
    const scoreStart = setTimeout(() => {
      const startT = Date.now();
      const dur = 1800;
      scoreIv = setInterval(() => {
        const p = Math.min((Date.now() - startT) / dur, 1);
        setScore(Math.round(p * 94));
        if (p >= 1) {
          clearInterval(scoreIv);
          setDetected(true);
          setTimeout(() => { if (!done.current) { done.current = true; onComplete(); } }, 1500);
        }
      }, 30);
    }, DETECTION_PIPELINE.length * 640 + 200);

    return () => {
      clearInterval(pipelineIv);
      clearTimeout(scoreStart);
      clearInterval(scoreIv);
    };
  }, [onComplete, reduced]);

  const scoreColor = score < 40 ? "#98dcc2" : score < 70 ? "#82a6e6" : "#E5604F";

  return (
    <div className="p-5">
      <SLabel text="QURIK DETECTION ENGINE" color="#82a6e6" />
      <div className="grid sm:grid-cols-2 gap-4">
        {/* Pipeline */}
        <div>
          <p className="font-mono text-[11px] text-meta uppercase tracking-widest mb-3">Analysis Pipeline</p>
          <div className="flex flex-col">
            {DETECTION_PIPELINE.map((stage, i) => (
              <div key={stage.label} className="flex flex-col">
                {i < pStep && (
                  <motion.div
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.26 }}
                    className="px-3 py-2 rounded border"
                    style={{ borderColor: `${stage.color}24`, backgroundColor: `${stage.color}07` }}
                  >
                    <p className="font-mono text-[11px] font-bold" style={{ color: stage.color }}>{stage.label}</p>
                    <p className="font-mono text-[11px] text-meta">{stage.sub}</p>
                  </motion.div>
                )}
                {i < DETECTION_PIPELINE.length - 1 && i < pStep && (
                  <div className="ml-4 w-px h-3 bg-raised" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Threat score */}
        <div>
          <p className="font-mono text-[11px] text-meta uppercase tracking-widest mb-3">Threat Score</p>
          <div
            className="rounded-lg border bg-black/60 p-5 text-center mb-3"
            style={{ borderColor: `${scoreColor}24` }}
          >
            <p className="font-mono text-5xl font-bold tabular-nums transition-colors duration-200" style={{ color: scoreColor }}>
              {score}
            </p>
            <p className="font-mono text-[11px] text-meta mt-1">/ 100</p>
          </div>
          <div className="h-2 rounded-full bg-surface overflow-hidden mb-4">
            <div
              className="h-full rounded-full transition-all duration-100"
              style={{ width: `${score}%`, backgroundColor: scoreColor }}
            />
          </div>
          <AnimatePresence>
            {detected && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-lg border border-red-500/30 bg-red-500/7 p-3 text-center"
              >
                <p className="font-mono text-sm font-bold text-red-400 tracking-widest">THREAT DETECTED</p>
                <p className="font-mono text-[11px] text-meta mt-1">Severity: HIGH · Score: 94</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────


// ──────────────────────────────────────────────────────────────
// SCENE 5 — PREVENTION DECISION
// ──────────────────────────────────────────────────────────────

function Scene5({ onComplete, reduced }: SceneProps) {
  const [step, setStep] = useState(reduced ? 4 : 0);
  const done = useRef(false);

  useEffect(() => {
    if (reduced) {
      const t = setTimeout(() => { if (!done.current) { done.current = true; onComplete(); } }, 800);
      return () => clearTimeout(t);
    }
    const timers = [
      setTimeout(() => setStep(1), 500),
      setTimeout(() => setStep(2), 1100),
      setTimeout(() => setStep(3), 1900),
      setTimeout(() => setStep(4), 2600),
      setTimeout(() => { if (!done.current) { done.current = true; onComplete(); } }, 4000),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete, reduced]);

  return (
    <div className="p-5">
      <SLabel text="PREVENTION DECISION" color="#E5604F" />

      <AnimatePresence>
        {step >= 1 && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between rounded-lg border border-red-500/25 bg-red-500/5 px-4 py-3 mb-3">
            <span className="font-mono text-[11px] text-meta uppercase tracking-widest">Threat Level</span>
            <span className="font-mono text-xs font-bold text-red-400 px-2 py-0.5 rounded bg-red-500/15 border border-red-500/25">HIGH</span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {step >= 2 && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between rounded-lg border border-blue/20 bg-blue/5 px-4 py-3 mb-4">
            <span className="font-mono text-[11px] text-meta uppercase tracking-widest">Action</span>
            <span className="font-mono text-sm font-bold text-blue-text">BLOCK CONNECTION</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Visual block diagram */}
      <AnimatePresence>
        {step >= 3 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="rounded-lg border border-white/8 bg-black/50 p-4 flex flex-col items-center gap-2 mb-3 font-mono text-[11px]">
            <div className="px-6 py-1.5 rounded border border-red-500/30 text-red-400 text-center w-full max-w-[220px]">
              ATTACK TRAFFIC
            </div>
            <div className="w-full max-w-[220px] h-1.5 rounded bg-red-500/35" />
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.15 }}
              className="flex flex-col items-center gap-1.5 py-1"
            >
              <span className="text-red-500 text-xl font-bold leading-none">✕</span>
              <div className="px-5 py-1.5 rounded border border-[#98dcc2]/40 bg-[#98dcc2]/10 text-[#98dcc2] font-bold text-center">
                QURIK IDPS
              </div>
              <div className="w-px h-4 bg-raised" />
              <div className="px-5 py-1.5 rounded border border-white/10 text-muted text-center">
                PROTECTED HOST
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {step >= 4 && (
          <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 px-4 py-3 rounded-lg border border-[#98dcc2]/25 bg-[#98dcc2]/5">
            <PulseDot color="#98dcc2" />
            <span className="font-mono text-sm text-[#98dcc2] font-bold tracking-widest">THREAT BLOCKED</span>
            <span className="font-mono text-[11px] text-meta ml-auto hidden sm:block">Host unreachable</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// SCENE 6 — SECURITY DASHBOARD
// ──────────────────────────────────────────────────────────────

function Scene6({ onComplete, reduced }: SceneProps) {
  const [detected, setDetected] = useState(reduced ? 17 : 0);
  const [blocked, setBlocked]   = useState(reduced ? 15 : 0);
  const [alerts, setAlerts]     = useState(reduced ? 2 : 0);
  const [hosts, setHosts]       = useState(reduced ? 8 : 0);
  const done = useRef(false);

  useEffect(() => {
    if (reduced) {
      const t = setTimeout(() => { if (!done.current) { done.current = true; onComplete(); } }, 800);
      return () => clearTimeout(t);
    }
    const start = Date.now();
    const dur = 2800;
    const iv = setInterval(() => {
      const p = Math.min((Date.now() - start) / dur, 1);
      const e = 1 - Math.pow(1 - p, 2);
      setDetected(Math.round(e * 17));
      setBlocked(Math.round(e * 15));
      setAlerts(Math.round(e * 2));
      setHosts(Math.round(e * 8));
      if (p >= 1) {
        clearInterval(iv);
        setTimeout(() => { if (!done.current) { done.current = true; onComplete(); } }, 1600);
      }
    }, 40);
    return () => clearInterval(iv);
  }, [onComplete, reduced]);

  const metrics = [
    { label: "Threats Detected",  value: detected, color: "text-red-400",    border: "border-red-500/20",    bg: "bg-red-500/5"    },
    { label: "Threats Blocked",   value: blocked,  color: "text-[#98dcc2]",  border: "border-[#98dcc2]/20",  bg: "bg-[#98dcc2]/5"  },
    { label: "Active Alerts",     value: alerts,   color: "text-blue-text",  border: "border-blue/20",  bg: "bg-blue/5"  },
    { label: "Hosts Monitored",   value: hosts,    color: "text-[#aec5f0]",  border: "border-[#aec5f0]/20",  bg: "bg-[#aec5f0]/5"  },
  ];

  const threatLevels = [
    { label: "LOW",      count: 4,  color: "#98dcc2" },
    { label: "MEDIUM",   count: 6,  color: "#82a6e6" },
    { label: "HIGH",     count: 5,  color: "#82a6e6" },
    { label: "CRITICAL", count: 2,  color: "#E5604F" },
  ];

  return (
    <div className="p-5">
      <div className="flex items-center justify-between mb-4">
        <SLabel text="QURIK SECURITY DASHBOARD" color="#98dcc2" />
        <div className="flex items-center gap-1.5 -mt-4">
          <PulseDot color="#98dcc2" />
          <span className="font-mono text-[11px] text-[#98dcc2]">PROTECTED</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        {metrics.map(m => (
          <div key={m.label} className={`rounded-lg border ${m.border} ${m.bg} p-3 text-center`}>
            <p className="font-mono text-[11px] text-meta uppercase tracking-widest mb-1">{m.label}</p>
            <p className={`font-mono text-2xl font-bold tabular-nums ${m.color}`}>{m.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-white/8 bg-black/40 p-4">
        <p className="font-mono text-[11px] text-meta uppercase tracking-widest mb-3">Threat Distribution</p>
        <div className="space-y-2">
          {threatLevels.map(level => (
            <div key={level.label} className="flex items-center gap-3">
              <span className="font-mono text-[11px] w-16 flex-shrink-0" style={{ color: level.color }}>{level.label}</span>
              <div className="flex-1 h-1.5 bg-surface rounded overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(level.count / 17) * 100}%` }}
                  transition={{ duration: 1, delay: 0.4 }}
                  className="h-full rounded"
                  style={{ backgroundColor: level.color }}
                />
              </div>
              <span className="font-mono text-[11px] text-meta w-4 flex-shrink-0">{level.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// SCENE 7 — INCIDENT DETAIL
// ──────────────────────────────────────────────────────────────

function Scene7({ onComplete, reduced }: SceneProps) {
  const [tlStep, setTlStep] = useState(reduced ? INCIDENT_TIMELINE.length : 0);
  const done = useRef(false);

  useEffect(() => {
    if (reduced) {
      const t = setTimeout(() => { if (!done.current) { done.current = true; onComplete(); } }, 800);
      return () => clearTimeout(t);
    }
    const iv = setInterval(() => {
      setTlStep(s => {
        if (s >= INCIDENT_TIMELINE.length) {
          clearInterval(iv);
          setTimeout(() => { if (!done.current) { done.current = true; onComplete(); } }, 1800);
          return s;
        }
        return s + 1;
      });
    }, 420);
    return () => clearInterval(iv);
  }, [onComplete, reduced]);

  const incidentFields = [
    { label: "Threat",     value: "Suspicious Network Activity", span: true,  color: ""                },
    { label: "Source",     value: "10.10.24.17",                 span: false, color: "text-red-400"    },
    { label: "Target",     value: "Protected Host",              span: false, color: "text-[#c6cad2]"   },
    { label: "Severity",   value: "HIGH",                        span: false, color: "text-red-400"    },
    { label: "Confidence", value: "94%",                         span: false, color: "text-blue-text"  },
    { label: "Action",     value: "BLOCKED",                     span: false, color: "text-[#98dcc2]"  },
    { label: "Status",     value: "CONTAINED",                   span: true,  color: "text-[#98dcc2]"  },
  ];

  return (
    <div className="p-5">
      <SLabel text="SECURITY INCIDENT" color="#E5604F" />
      <div className="grid sm:grid-cols-2 gap-4">
        {/* Incident card */}
        <div className="rounded-xl border border-red-500/20 bg-red-500/4 p-4">
          <div className="grid grid-cols-2 gap-3">
            {incidentFields.map((f, i) => (
              <div key={i} className={f.span ? "col-span-2" : ""}>
                <p className="font-mono text-[11px] text-meta uppercase tracking-widest mb-0.5">{f.label}</p>
                <p className={`font-mono text-xs font-semibold ${f.color || "text-[#c6cad2]"}`}>{f.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div>
          <p className="font-mono text-[11px] text-meta uppercase tracking-widest mb-3">Response Timeline</p>
          <div className="flex flex-col">
            {INCIDENT_TIMELINE.map((label, i) => (
              <div key={label} className="flex flex-col">
                {i < tlStep ? (
                  <motion.div
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.24 }}
                    className="flex items-center gap-2"
                  >
                    <span className="w-4 h-4 rounded-full border-2 border-[#98dcc2] flex items-center justify-center flex-shrink-0">
                      <span className="text-[7px] text-[#98dcc2]">✓</span>
                    </span>
                    <span className="font-mono text-xs text-[#c6cad2]">{label}</span>
                  </motion.div>
                ) : (
                  <div className="flex items-center gap-2 opacity-25">
                    <span className="w-4 h-4 rounded-full border border-white/10 flex-shrink-0" />
                    <span className="font-mono text-xs text-meta">{label}</span>
                  </div>
                )}
                {i < INCIDENT_TIMELINE.length - 1 && <div className="ml-2 w-px h-4 bg-raised" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// SCENE 8 — IDPS ARCHITECTURE
// ──────────────────────────────────────────────────────────────

function Scene8({ onComplete, reduced }: SceneProps) {
  const [step, setStep] = useState(reduced ? ARCH_NODES.length : 0);
  const done = useRef(false);

  useEffect(() => {
    if (reduced) {
      const t = setTimeout(() => { if (!done.current) { done.current = true; onComplete(); } }, 800);
      return () => clearTimeout(t);
    }
    const iv = setInterval(() => {
      setStep(s => {
        if (s >= ARCH_NODES.length) {
          clearInterval(iv);
          setTimeout(() => { if (!done.current) { done.current = true; onComplete(); } }, 1800);
          return s;
        }
        return s + 1;
      });
    }, 360);
    return () => clearInterval(iv);
  }, [onComplete, reduced]);

  return (
    <div className="p-5">
      <SLabel text="IDPS ARCHITECTURE" color="#82a6e6" />
      <div className="flex gap-4 justify-center">
        {/* Main flow */}
        <div className="flex flex-col items-center w-full max-w-[230px]">
          {ARCH_NODES.map((node, i) => (
            <div key={node.label} className="flex flex-col items-center w-full">
              {i < step && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.26 }}
                  className="w-full px-3 py-1.5 rounded-lg border text-center"
                  style={{ borderColor: `${node.color}28`, backgroundColor: `${node.color}07` }}
                >
                  <p className="font-mono text-[11px] font-bold tracking-wider" style={{ color: node.color }}>
                    {node.label}
                  </p>
                </motion.div>
              )}
              {i < ARCH_NODES.length - 1 && i < step && <Arrow />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// SCENE 9 — DETECT + PREVENT
// ──────────────────────────────────────────────────────────────

function Scene9({ onComplete, reduced }: SceneProps) {
  const [step, setStep] = useState(reduced ? 3 : 0);
  const done = useRef(false);

  const DETECT  = ["Detect", "Analyze", "Classify", "Alert"];
  const PREVENT = ["Detect", "Analyze", "Classify", "Block", "Contain"];

  useEffect(() => {
    if (reduced) {
      const t = setTimeout(() => { if (!done.current) { done.current = true; onComplete(); } }, 800);
      return () => clearTimeout(t);
    }
    const timers = [
      setTimeout(() => setStep(1), 400),
      setTimeout(() => setStep(2), 900),
      setTimeout(() => setStep(3), 1500),
      setTimeout(() => { if (!done.current) { done.current = true; onComplete(); } }, 4000),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete, reduced]);

  return (
    <div className="p-5">
      <SLabel text="DETECT + PREVENT" color="#82a6e6" />
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Detection */}
        <AnimatePresence>
          {step >= 1 && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-lg border border-[#aec5f0]/20 bg-[#aec5f0]/4 p-4">
              <p className="font-mono text-[11px] font-bold text-[#aec5f0] tracking-widest mb-3 uppercase">
                Intrusion Detection
              </p>
              <div className="space-y-2">
                {DETECT.map((s, i) => (
                  <motion.div key={s} initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#aec5f0]/60 flex-shrink-0" />
                    <span className="font-mono text-xs text-[#c6cad2]">{s}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Prevention */}
        <AnimatePresence>
          {step >= 2 && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-lg border border-[#98dcc2]/20 bg-[#98dcc2]/4 p-4">
              <p className="font-mono text-[11px] font-bold text-[#98dcc2] tracking-widest mb-3 uppercase">
                Intrusion Prevention
              </p>
              <div className="space-y-2">
                {PREVENT.map((s, i) => {
                  const isAction = s === "Block" || s === "Contain";
                  return (
                    <motion.div key={s} initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }} className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isAction ? "bg-[#98dcc2]" : "bg-[#98dcc2]/60"}`} />
                      <span className={`font-mono text-xs ${isAction ? "text-[#98dcc2] font-bold" : "text-[#c6cad2]"}`}>{s}</span>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {step >= 3 && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-lg border border-[#82a6e6]/25 bg-[#82a6e6]/5 p-3 text-center">
            <p className="font-mono text-sm font-bold text-[#82a6e6] tracking-widest">
              QURIK — DETECT + PREVENT
            </p>
            <p className="font-mono text-[11px] text-meta mt-1">
              Software IDPS operating across both detection and prevention layers
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// SCENE 10 — FINAL HERO
// ──────────────────────────────────────────────────────────────

function Scene10({ onComplete, reduced }: SceneProps) {
  const done = useRef(false);

  useEffect(() => {
    const t = setTimeout(
      () => { if (!done.current) { done.current = true; onComplete(); } },
      reduced ? 800 : 4500,
    );
    return () => clearTimeout(t);
  }, [onComplete, reduced]);

  const tags = ["Python", "Network Security", "IDPS", "Real-Time Monitoring", "Threat Detection"];

  return (
    <div className="p-8 flex flex-col items-center justify-center text-center min-h-[340px]">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
        <div className="flex items-center justify-center gap-2 mb-4">
          <PulseDot color="#98dcc2" />
          <span className="font-mono text-[11px] text-[#98dcc2] tracking-[0.25em] uppercase">System Protected</span>
        </div>

        <h2 className="font-bold text-4xl text-white tracking-widest mb-1 font-mono">QURIK</h2>
        <p className="font-mono text-muted text-sm mb-1">
          Intrusion Detection &amp; Prevention System
        </p>
        <p className="font-mono text-meta text-sm italic mb-6">
          &ldquo;Detect. Analyze. Prevent.&rdquo;
        </p>

        {/* Mini dashboard */}
        <div className="flex items-center justify-center gap-8 mb-6">
          {[
            { label: "Detected",   value: "17",  color: "text-red-400"    },
            { label: "Blocked",    value: "15",  color: "text-[#98dcc2]"  },
            { label: "Confidence", value: "94%", color: "text-blue-text"  },
          ].map(m => (
            <div key={m.label}>
              <p className={`font-mono text-2xl font-bold ${m.color}`}>{m.value}</p>
              <p className="font-mono text-[11px] text-meta uppercase tracking-widest mt-0.5">{m.label}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {tags.map((tag, i) => (
            <motion.span
              key={tag}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.06 }}
              className="px-3 py-1 rounded-full border border-[#98dcc2]/20 bg-[#98dcc2]/5 font-mono text-[11px] text-[#98dcc2]/80"
            >
              {tag}
            </motion.span>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="font-mono text-[11px] text-meta tracking-widest uppercase"
        >
          Simulated Security Demonstration · Replaying in 4s...
        </motion.p>
      </motion.div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// MAIN ORCHESTRATOR
// ──────────────────────────────────────────────────────────────

export default function QurikIDPSSim() {
  const [scene, setScene] = useState(1);
  const [simKey, setSimKey] = useState(0);
  const prevScene = useRef(1);
  const shouldReduce = useReducedMotion() ?? false;

  const advance = useCallback(() => {
    setScene(s => (s >= TOTAL_SCENES ? 1 : s + 1));
  }, []);

  useEffect(() => {
    if (scene === 1 && prevScene.current === TOTAL_SCENES) {
      setSimKey(k => k + 1);
    }
    prevScene.current = scene;
  }, [scene]);

  const totalMs = SCENE_DURATIONS.reduce((a, b) => a + b, 0);
  const elapsed  = SCENE_DURATIONS.slice(0, scene - 1).reduce((a, b) => a + b, 0);
  const progress = Math.round((elapsed / totalMs) * 100);

  const sceneKey = `${scene}-${simKey}`;
  const props: SceneProps = { onComplete: advance, reduced: shouldReduce };

  return (
    <div className="rounded-xl border border-white/8 bg-[#101318] overflow-hidden shadow-2xl shadow-black/50">
      <SimHeader scene={scene} progress={progress} onJump={setScene} />

      <AnimatePresence mode="wait">
        <motion.div
          key={sceneKey}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          className="min-h-[380px]"
        >
          {scene === 1  && <Scene1  {...props} />}
          {scene === 2  && <Scene2  {...props} />}
          {scene === 3  && <Scene3  {...props} />}
          {scene === 4  && <Scene4  {...props} />}
          {scene === 5  && <Scene5  {...props} />}
          {scene === 6  && <Scene6  {...props} />}
          {scene === 7  && <Scene7  {...props} />}
          {scene === 8  && <Scene8  {...props} />}
          {scene === 9  && <Scene9  {...props} />}
          {scene === 10 && <Scene10 {...props} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

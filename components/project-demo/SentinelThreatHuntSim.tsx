"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

// ──────────────────────────────────────────────────────────────
// TYPES
// ──────────────────────────────────────────────────────────────

type LogStatus = "pending" | "failed" | "success" | "info" | "alert";

interface LogEntry {
  time: string;
  src: string;
  event: string;
  ip: string;
  status: LogStatus;
}

interface SceneProps {
  onComplete: () => void;
  reduced: boolean;
}

// ──────────────────────────────────────────────────────────────
// DATA
// ──────────────────────────────────────────────────────────────

const LOG_ENTRIES: LogEntry[] = [
  { time: "19:42:09", src: "SigninLogs",    event: "Authentication attempt",       ip: "185.220.101.47", status: "pending" },
  { time: "19:42:11", src: "SigninLogs",    event: "Sign-in failed",               ip: "185.220.101.47", status: "failed"  },
  { time: "19:42:13", src: "SigninLogs",    event: "Sign-in failed",               ip: "185.220.101.47", status: "failed"  },
  { time: "19:42:15", src: "SigninLogs",    event: "Sign-in failed",               ip: "185.220.101.47", status: "failed"  },
  { time: "19:42:17", src: "AuditLogs",     event: "Directory object queried",     ip: "185.220.101.47", status: "info"    },
  { time: "19:42:19", src: "SigninLogs",    event: "Sign-in failed",               ip: "185.220.101.47", status: "failed"  },
  { time: "19:42:21", src: "SigninLogs",    event: "Successful authentication",    ip: "185.220.101.47", status: "success" },
  { time: "19:43:02", src: "DeviceEvents",  event: "Process creation — cmd.exe",   ip: "10.0.0.14",      status: "alert"   },
  { time: "19:43:15", src: "SecurityAlert", event: "Impossible travel alert",      ip: "185.220.101.47", status: "alert"   },
];

const KQL_QUERY = `SigninLogs
| where TimeGenerated > ago(24h)
| where ResultType != "0"
| summarize FailedAttempts = count()
    by UserPrincipalName, IPAddress
| where FailedAttempts > 5
| order by FailedAttempts desc`;

const KQL_RESULTS = [
  { user: "j.martinez@corp.io", ip: "185.220.101.47", failed: 7, loc: "Unknown (TOR)", flag: true  },
  { user: "a.chen@corp.io",     ip: "203.0.113.52",   failed: 3, loc: "Singapore",     flag: false },
  { user: "k.patel@corp.io",    ip: "198.51.100.23",  failed: 2, loc: "US-East",       flag: false },
];

const PIVOT_NODES = [
  { label: "Suspicious IP",           sub: "185.220.101.47",           color: "#E5604F" },
  { label: "User Account",            sub: "j.martinez@corp.io",       color: "#82a6e6" },
  { label: "Authentication Events",   sub: "7 failures + 1 success",   color: "#82a6e6" },
  { label: "Workstation",             sub: "WORKSTATION-14",           color: "#aec5f0" },
  { label: "Related Activity",        sub: "cmd.exe process creation", color: "#82a6e6" },
];

const TIMELINE_EVENTS = [
  { time: "19:42:11", event: "Failed login",        kind: "fail"    },
  { time: "19:42:13", event: "Failed login",        kind: "fail"    },
  { time: "19:42:15", event: "Failed login",        kind: "fail"    },
  { time: "19:42:21", event: "Successful login",    kind: "success" },
  { time: "19:43:02", event: "Suspicious activity", kind: "alert"   },
];

const HUNT_PIPELINE = [
  { label: "KQL HUNT",         color: "#82a6e6" },
  { label: "Detection Logic",  color: "#aec5f0" },
  { label: "Analytics Rule",   color: "#aec5f0" },
  { label: "Alert",            color: "#82a6e6" },
  { label: "Incident",         color: "#E5604F" },
];

const ARCH_STEPS = [
  { label: "AZURE LOG SOURCES",     color: "#82a6e6" },
  { label: "MICROSOFT SENTINEL",    color: "#aec5f0" },
  { label: "KQL THREAT HUNTING",    color: "#82a6e6" },
  { label: "EVENT CORRELATION",     color: "#82a6e6" },
  { label: "MITRE ATT&CK",          color: "#82a6e6" },
  { label: "THREAT FINDING",        color: "#E5604F" },
  { label: "DETECTION ENGINEERING", color: "#aec5f0" },
  { label: "INCIDENT RESPONSE",     color: "#82a6e6" },
];

const SUMMARY_STEPS = [
  "Telemetry Ingestion",
  "KQL Query Executed",
  "Suspicious Pattern Identified",
  "Investigation Pivot",
  "Event Correlation",
  "MITRE ATT&CK Mapping",
  "Detection Rule Created",
];

const SCENE_LABELS = [
  "SECURITY TELEMETRY",
  "KQL THREAT HUNT",
  "INVESTIGATION PIVOT",
  "EVENT CORRELATION",
  "MITRE ATT&CK MAPPING",
  "THREAT HUNT RESULT",
  "DETECTION ENGINEERING",
  "INCIDENT VIEW",
  "FINAL TIMELINE",
  "ARCHITECTURE",
  "COMPLETE",
];

// Duration per scene in ms
const SCENE_DURATIONS = [5500, 6000, 4500, 4000, 3500, 3500, 3500, 3000, 4000, 4000, 4500];

const LOG_STATUS_LABELS: Record<LogStatus, string> = {
  pending: "WAIT", failed: "FAIL", success: "OK", info: "INFO", alert: "ALERT",
};
const LOG_STATUS_COLORS: Record<LogStatus, string> = {
  pending: "text-meta",
  failed:  "text-red-400",
  success: "text-mint",
  info:    "text-blue-text",
  alert:   "text-blue-text",
};
const LOG_SRC_COLORS: Record<string, string> = {
  "SigninLogs":    "text-[#aec5f0]/70",
  "AuditLogs":    "text-blue/70",
  "DeviceEvents": "text-purple-400/70",
  "SecurityAlert":"text-red-400/70",
};

// ──────────────────────────────────────────────────────────────
// SHARED UI
// ──────────────────────────────────────────────────────────────

function PulseDot({ color = "#aec5f0" }: { color?: string }) {
  return (
    <span className="relative flex h-2 w-2 flex-shrink-0">
      <span
        className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60"
        style={{ backgroundColor: color }}
      />
      <span
        className="relative inline-flex rounded-full h-2 w-2"
        style={{ backgroundColor: color }}
      />
    </span>
  );
}

function SectionLabel({ text, color = "#82a6e6" }: { text: string; color?: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <PulseDot color={color} />
      <span className="font-mono text-[11px] tracking-widest text-muted">{text}</span>
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
      {/* Top row */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <PulseDot color="#aec5f0" />
          <span className="font-mono text-[11px] tracking-[0.2em] text-[#aec5f0] uppercase">
            Simulation Active
          </span>
        </div>
        <span className="font-mono text-[11px] text-meta tracking-widest uppercase border border-line px-2 py-0.5 rounded">
          Authorized Lab Environment
        </span>
      </div>
      {/* Title row */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="font-mono text-white text-xs font-bold tracking-[0.18em] uppercase">
            Live Threat Hunt Simulation
          </p>
          <p className="font-mono text-meta text-[11px] mt-0.5">
            Proactive investigation using Microsoft Sentinel + KQL · Simulated demonstration
          </p>
        </div>
        <div className="text-right ml-4 flex-shrink-0">
          <p className="font-mono text-[#82a6e6] text-[11px] tracking-widest">{SCENE_LABELS[scene - 1]}</p>
          <p className="font-mono text-meta text-[11px] mt-0.5">SCENE {scene} / 11</p>
        </div>
      </div>
      {/* Progress bar */}
      <div className="h-px bg-surface rounded overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-[#82a6e6] to-[#aec5f0] rounded-full"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "linear" }}
        />
      </div>
      {/* Scene dots */}
      <div className="flex items-center gap-1 mt-2.5">
        {Array.from({ length: 11 }, (_, i) => (
          <button
            key={i}
            onClick={() => onJump(i + 1)}
            aria-label={`Jump to scene ${i + 1}: ${SCENE_LABELS[i]}`}
            className="rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#82a6e6]"
            style={{
              width:  i + 1 === scene ? "18px" : "6px",
              height: "6px",
              backgroundColor:
                i + 1 === scene ? "#82a6e6"
                : i + 1 < scene  ? "rgba(130,166,230,0.35)"
                : "#262b34",
            }}
          />
        ))}
        <span className="font-mono text-[11px] text-meta ml-auto">{scene}/11</span>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// SCENE 1 — SECURITY TELEMETRY
// ──────────────────────────────────────────────────────────────

function Scene1({ onComplete, reduced }: SceneProps) {
  const [count, setCount] = useState(reduced ? LOG_ENTRIES.length - 1 : -1);
  const [anomaly, setAnomaly] = useState(reduced);
  const done = useRef(false);

  useEffect(() => {
    if (reduced) {
      const t = setTimeout(() => { if (!done.current) { done.current = true; onComplete(); } }, 800);
      return () => clearTimeout(t);
    }
    const iv = setInterval(() => {
      setCount(c => {
        if (c >= LOG_ENTRIES.length - 1) {
          clearInterval(iv);
          setTimeout(() => setAnomaly(true), 400);
          setTimeout(() => { if (!done.current) { done.current = true; onComplete(); } }, 2400);
          return c;
        }
        return c + 1;
      });
    }, 470);
    return () => clearInterval(iv);
  }, [onComplete, reduced]);

  return (
    <div className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <PulseDot color={anomaly ? "#82a6e6" : "#aec5f0"} />
          <span className={`font-mono text-[11px] tracking-widest transition-colors duration-500 ${anomaly ? "text-blue-text" : "text-muted"}`}>
            {anomaly ? "ANOMALOUS ACTIVITY DETECTED" : "INGESTING SECURITY TELEMETRY..."}
          </span>
        </div>
        <span className="font-mono text-[11px] text-meta">{count + 1}&nbsp;/&nbsp;{LOG_ENTRIES.length}</span>
      </div>

      <div className="rounded-lg border border-white/8 bg-black/50 overflow-hidden">
        <div className="grid grid-cols-[3.5rem_6rem_1fr_3rem] gap-x-2 px-3 py-1.5 border-b border-white/5 font-mono text-[11px] text-meta uppercase tracking-widest">
          <span>Time</span><span>Source</span><span>Event</span><span className="text-right">Status</span>
        </div>
        <div className="px-2 py-1.5 space-y-0.5 min-h-[200px]">
          {LOG_ENTRIES.slice(0, count + 1).map((entry, i) => {
            const highlight = anomaly && (entry.status === "success" || entry.status === "alert");
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.22 }}
                className={`grid grid-cols-[3.5rem_6rem_1fr_3rem] gap-x-2 px-1.5 py-1 rounded font-mono text-[11px] ${
                  highlight ? "bg-blue/10 border border-blue/15" : ""
                }`}
              >
                <span className="text-meta">{entry.time}</span>
                <span className={`${LOG_SRC_COLORS[entry.src] ?? "text-meta"} truncate`}>{entry.src}</span>
                <span className="text-muted truncate">{entry.event}</span>
                <span className={`${LOG_STATUS_COLORS[entry.status]} text-right`}>
                  {LOG_STATUS_LABELS[entry.status]}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {anomaly && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 flex items-center gap-3 px-4 py-2.5 rounded-lg border border-blue/25 bg-blue/5"
          >
            <PulseDot color="#82a6e6" />
            <span className="font-mono text-xs text-blue-text font-semibold tracking-widest">
              ANOMALOUS ACTIVITY DETECTED
            </span>
            <span className="font-mono text-[11px] text-meta ml-auto hidden sm:block">5 failures → success · 12s</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// SCENE 2 — KQL THREAT HUNT
// ──────────────────────────────────────────────────────────────

function Scene2({ onComplete, reduced }: SceneProps) {
  const [typed, setTyped]       = useState(reduced ? KQL_QUERY.length : 0);
  const [executing, setExecuting] = useState(false);
  const [showResults, setShowResults] = useState(reduced);
  const done = useRef(false);

  useEffect(() => {
    if (reduced) {
      const t = setTimeout(() => { if (!done.current) { done.current = true; onComplete(); } }, 800);
      return () => clearTimeout(t);
    }
    const iv = setInterval(() => {
      setTyped(c => {
        const next = c + 4;
        if (next >= KQL_QUERY.length) {
          clearInterval(iv);
          setTimeout(() => setExecuting(true), 150);
          setTimeout(() => setShowResults(true), 1100);
          setTimeout(() => { if (!done.current) { done.current = true; onComplete(); } }, 3600);
          return KQL_QUERY.length;
        }
        return next;
      });
    }, 28);
    return () => clearInterval(iv);
  }, [onComplete, reduced]);

  return (
    <div className="p-5">
      <SectionLabel
        text={showResults ? "QUERY RESULTS — 3 MATCHES" : executing ? "EXECUTING QUERY..." : "KQL THREAT HUNT"}
        color="#82a6e6"
      />

      {/* KQL editor */}
      <div className="rounded-lg border border-white/8 bg-black/60 overflow-hidden mb-4">
        <div className="flex items-center gap-2 px-3 py-2 border-b border-white/5 bg-white/[0.02]">
          <span className="font-mono text-[11px] text-[#82a6e6] font-bold">KQL</span>
          <span className="font-mono text-meta text-[11px]">sentinel-workspace · SigninLogs</span>
          {executing && !showResults && (
            <span className="ml-auto flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#aec5f0] animate-pulse" />
              <span className="font-mono text-[11px] text-[#aec5f0]">Executing...</span>
            </span>
          )}
          {showResults && (
            <span className="ml-auto font-mono text-[11px] text-mint">✓ Completed · 3 results</span>
          )}
        </div>
        <pre className="px-4 py-3 font-mono text-[12px] text-[#aec5f0]/80 leading-[1.65] overflow-x-auto">
          {KQL_QUERY.slice(0, typed)}
          {typed < KQL_QUERY.length && (
            <span className="inline-block w-[7px] h-[14px] bg-[#aec5f0] animate-pulse align-middle" />
          )}
        </pre>
      </div>

      {/* Results */}
      <AnimatePresence>
        {showResults && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg border border-white/8 bg-black/40 overflow-hidden"
          >
            <div className="grid grid-cols-[1fr_8rem_4rem_6rem] gap-2 px-3 py-1.5 border-b border-white/5 font-mono text-[11px] text-meta uppercase tracking-widest">
              <span>UserPrincipalName</span>
              <span>IPAddress</span>
              <span>Failures</span>
              <span className="hidden sm:block">Location</span>
            </div>
            {KQL_RESULTS.map((row, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15 }}
                className={`grid grid-cols-[1fr_8rem_4rem_6rem] gap-2 px-3 py-2 font-mono text-xs border-b border-white/5 last:border-0 ${
                  row.flag ? "bg-red-500/6 border-l-2 border-l-red-500/40" : ""
                }`}
              >
                <span className="text-[#c6cad2] truncate">{row.user}</span>
                <span className={row.flag ? "text-red-400 font-bold" : "text-muted"}>{row.ip}</span>
                <span className={row.flag ? "text-blue-text font-bold" : "text-muted"}>{row.failed}</span>
                <span className="text-meta hidden sm:block truncate">{row.loc}</span>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// SCENE 3 — INVESTIGATION PIVOT
// ──────────────────────────────────────────────────────────────

function Scene3({ onComplete, reduced }: SceneProps) {
  const [visible, setVisible] = useState(reduced ? PIVOT_NODES.length : 0);
  const [related, setRelated]  = useState(reduced);
  const done = useRef(false);

  useEffect(() => {
    if (reduced) {
      const t = setTimeout(() => { if (!done.current) { done.current = true; onComplete(); } }, 800);
      return () => clearTimeout(t);
    }
    const iv = setInterval(() => {
      setVisible(v => {
        if (v >= PIVOT_NODES.length) {
          clearInterval(iv);
          setTimeout(() => setRelated(true), 200);
          setTimeout(() => { if (!done.current) { done.current = true; onComplete(); } }, 1600);
          return v;
        }
        return v + 1;
      });
    }, 580);
    return () => clearInterval(iv);
  }, [onComplete, reduced]);

  return (
    <div className="p-5">
      <div className="flex items-center justify-between mb-5">
        <SectionLabel text="INVESTIGATION PIVOT" color="#82a6e6" />
        <AnimatePresence>
          {related && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-mono text-[11px] text-mint -mt-4"
            >
              RELATED EVENTS FOUND
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <div className="flex flex-col items-center">
        {PIVOT_NODES.map((node, i) => (
          <div key={node.label} className="flex flex-col items-center w-full max-w-xs">
            {i < visible && (
              <motion.div
                initial={{ opacity: 0, scale: 0.88 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="w-full px-4 py-2.5 rounded-lg border bg-black/40 text-center"
                style={{ borderColor: `${node.color}30`, backgroundColor: `${node.color}06` }}
              >
                <p className="font-mono text-xs font-bold" style={{ color: node.color }}>{node.label}</p>
                <p className="font-mono text-[11px] text-meta mt-0.5">{node.sub}</p>
              </motion.div>
            )}
            {i < PIVOT_NODES.length - 1 && i < visible && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 20 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col items-center"
              >
                <div className="flex-1 w-px bg-raised" />
                <div className="w-1.5 h-1.5 border-r border-b border-white/10 rotate-45 -mt-1 mb-0.5" />
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// SCENE 4 — EVENT CORRELATION
// ──────────────────────────────────────────────────────────────

const KIND_COLORS: Record<string, string> = { fail: "#E5604F", success: "#98dcc2", alert: "#82a6e6" };

function Scene4({ onComplete, reduced }: SceneProps) {
  const [visible, setVisible] = useState(reduced ? TIMELINE_EVENTS.length : 0);
  const [correlated, setCorrelated] = useState(reduced);
  const done = useRef(false);

  useEffect(() => {
    if (reduced) {
      const t = setTimeout(() => { if (!done.current) { done.current = true; onComplete(); } }, 800);
      return () => clearTimeout(t);
    }
    const iv = setInterval(() => {
      setVisible(v => {
        if (v >= TIMELINE_EVENTS.length) {
          clearInterval(iv);
          setTimeout(() => setCorrelated(true), 350);
          setTimeout(() => { if (!done.current) { done.current = true; onComplete(); } }, 2000);
          return v;
        }
        return v + 1;
      });
    }, 480);
    return () => clearInterval(iv);
  }, [onComplete, reduced]);

  return (
    <div className="p-5">
      <SectionLabel text="EVENT CORRELATION" color="#82a6e6" />

      <div className="relative py-6 px-2">
        {/* Timeline spine */}
        {visible > 1 && (
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            style={{ originX: 0 }}
            transition={{ duration: 1.4, ease: "easeOut" }}
            className="absolute top-[38px] left-8 right-8 h-px bg-gradient-to-r from-red-500/40 via-blue/40 to-mint/40"
          />
        )}

        <div className="flex justify-between items-start gap-2">
          {TIMELINE_EVENTS.map((ev, i) => (
            i < visible ? (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center flex-1"
              >
                {/* Timestamp */}
                <p className="font-mono text-[11px] mb-2" style={{ color: KIND_COLORS[ev.kind] }}>
                  {ev.time}
                </p>
                {/* Node */}
                <div
                  className="w-3 h-3 rounded-full border-2 bg-[#101318] relative z-10"
                  style={{ borderColor: KIND_COLORS[ev.kind] }}
                />
                {/* Label */}
                <p className="font-mono text-[11px] text-center text-meta mt-2 leading-tight max-w-[64px]">
                  {ev.event}
                </p>
              </motion.div>
            ) : <div key={i} className="flex-1" />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {correlated && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg border border-red-500/25 bg-red-500/5"
          >
            <PulseDot color="#E5604F" />
            <span className="font-mono text-xs text-red-400 font-semibold tracking-widest">
              CORRELATED ACTIVITY IDENTIFIED
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// SCENE 5 — MITRE ATT&CK MAPPING
// ──────────────────────────────────────────────────────────────

function Scene5({ onComplete, reduced }: SceneProps) {
  const [step, setStep] = useState(reduced ? 3 : 0);
  const done = useRef(false);

  useEffect(() => {
    if (reduced) {
      const t = setTimeout(() => { if (!done.current) { done.current = true; onComplete(); } }, 800);
      return () => clearTimeout(t);
    }
    const timers = [
      setTimeout(() => setStep(1), 400),
      setTimeout(() => setStep(2), 900),
      setTimeout(() => setStep(3), 1500),
      setTimeout(() => { if (!done.current) { done.current = true; onComplete(); } }, 3500),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete, reduced]);

  return (
    <div className="p-5">
      <SectionLabel text="MITRE ATT&CK MAPPING" color="#82a6e6" />

      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        <AnimatePresence>
          {step >= 1 && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-lg border border-blue/20 bg-blue/5 p-4">
              <p className="font-mono text-[11px] text-meta uppercase tracking-widest mb-2">Tactic</p>
              <p className="font-mono text-blue-text font-bold text-base">Credential Access</p>
              <p className="font-mono text-meta text-[11px] mt-1">TA0006</p>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {step >= 2 && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-lg border border-red-500/20 bg-red-500/5 p-4">
              <p className="font-mono text-[11px] text-meta uppercase tracking-widest mb-2">Technique</p>
              <p className="font-mono text-red-400 font-bold text-sm leading-tight">Suspicious Authentication Activity</p>
              <p className="font-mono text-meta text-[11px] mt-1">Brute Force Pattern</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {step >= 3 && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-lg border border-white/8 bg-black/40 p-4">
            <p className="font-mono text-[11px] text-meta uppercase tracking-widest mb-3">Observed Behavior</p>
            <div className="space-y-1.5">
              {[
                "7 authentication failures from single IP within 12 seconds",
                "Successful authentication following sequential failure pattern",
                "Post-authentication process creation on endpoint",
                "Matches Credential Access › Brute Force (T1110) pattern",
              ].map((b, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-2 font-mono text-xs text-muted"
                >
                  <span className="text-[#82a6e6]/60 flex-shrink-0 mt-0.5">›</span>{b}
                </motion.p>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// SCENE 6 — THREAT HUNT RESULT
// ──────────────────────────────────────────────────────────────

function Scene6({ onComplete, reduced }: SceneProps) {
  const [step, setStep] = useState(reduced ? 4 : 0);
  const done = useRef(false);

  useEffect(() => {
    if (reduced) {
      const t = setTimeout(() => { if (!done.current) { done.current = true; onComplete(); } }, 800);
      return () => clearTimeout(t);
    }
    const timers = [
      setTimeout(() => setStep(1), 300),
      setTimeout(() => setStep(2), 750),
      setTimeout(() => setStep(3), 1200),
      setTimeout(() => setStep(4), 1700),
      setTimeout(() => { if (!done.current) { done.current = true; onComplete(); } }, 3500),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete, reduced]);

  const metrics = [
    { label: "Severity",   value: "HIGH",          color: "text-red-400",     visible: step >= 1 },
    { label: "Status",     value: "INVESTIGATING",  color: "text-blue-text",   visible: step >= 2 },
    { label: "Confidence", value: "HIGH",           color: "text-mint", visible: step >= 3 },
    { label: "Entity",     value: "User + IP",      color: "text-[#aec5f0]",   visible: step >= 4 },
  ];

  return (
    <div className="p-5">
      <SectionLabel text="THREAT HUNT RESULT" color="#E5604F" />

      <div className="rounded-xl border border-red-500/20 bg-red-500/4 p-5">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
          {metrics.map((m) => (
            <div key={m.label} className="min-h-[48px]">
              <AnimatePresence>
                {m.visible && (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                    <p className="font-mono text-[11px] text-meta uppercase tracking-widest mb-1">{m.label}</p>
                    <p className={`font-mono text-sm font-bold ${m.color}`}>{m.value}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <AnimatePresence>
          {step >= 4 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="border-t border-white/5 pt-4">
              <p className="font-mono text-[11px] text-meta uppercase tracking-widest mb-2">Evidence Summary</p>
              <p className="font-mono text-muted text-xs leading-relaxed">
                Repeated authentication failures (7 attempts) from IP 185.220.101.47
                followed by successful authentication — consistent with credential access
                pattern. Post-authentication suspicious process creation observed.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// SCENE 7 — DETECTION ENGINEERING
// ──────────────────────────────────────────────────────────────

function Scene7({ onComplete, reduced }: SceneProps) {
  const [step, setStep] = useState(reduced ? HUNT_PIPELINE.length : 0);
  const done = useRef(false);

  useEffect(() => {
    if (reduced) {
      const t = setTimeout(() => { if (!done.current) { done.current = true; onComplete(); } }, 800);
      return () => clearTimeout(t);
    }
    const iv = setInterval(() => {
      setStep(s => {
        if (s >= HUNT_PIPELINE.length) {
          clearInterval(iv);
          setTimeout(() => { if (!done.current) { done.current = true; onComplete(); } }, 1800);
          return s;
        }
        return s + 1;
      });
    }, 440);
    return () => clearInterval(iv);
  }, [onComplete, reduced]);

  return (
    <div className="p-5">
      <SectionLabel text="HUNT → DETECTION" color="#aec5f0" />
      <p className="font-mono text-[11px] text-meta mb-5">
        Converting a successful threat hunt into a reusable analytics rule
      </p>

      <div className="flex flex-col items-center gap-0">
        {HUNT_PIPELINE.map((node, i) => (
          <div key={node.label} className="flex flex-col items-center">
            {i < step && (
              <motion.div
                initial={{ opacity: 0, scale: 0.88 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.28 }}
                className="px-8 py-2 rounded-lg border text-center w-56"
                style={{ borderColor: `${node.color}30`, backgroundColor: `${node.color}08` }}
              >
                <p className="font-mono text-xs font-bold" style={{ color: node.color }}>
                  {node.label}
                </p>
              </motion.div>
            )}
            {i < HUNT_PIPELINE.length - 1 && i < step && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 18 }}
                className="flex flex-col items-center overflow-hidden"
              >
                <div className="flex-1 w-px bg-raised" />
                <div className="w-1.5 h-1.5 border-r border-b border-white/10 rotate-45 -mt-1" />
              </motion.div>
            )}
          </div>
        ))}
      </div>

      {step >= HUNT_PIPELINE.length && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-mono text-[11px] text-mint text-center mt-5"
        >
          ✓ Analytics rule created — future incidents trigger automatically
        </motion.p>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// SCENE 8 — INCIDENT VIEW
// ──────────────────────────────────────────────────────────────

function Scene8({ onComplete, reduced }: SceneProps) {
  const [step, setStep] = useState(reduced ? 3 : 0);
  const done = useRef(false);

  useEffect(() => {
    if (reduced) {
      const t = setTimeout(() => { if (!done.current) { done.current = true; onComplete(); } }, 800);
      return () => clearTimeout(t);
    }
    const timers = [
      setTimeout(() => setStep(1), 350),
      setTimeout(() => setStep(2), 850),
      setTimeout(() => setStep(3), 1350),
      setTimeout(() => { if (!done.current) { done.current = true; onComplete(); } }, 3000),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete, reduced]);

  return (
    <div className="p-5">
      <SectionLabel text="MICROSOFT SENTINEL — INCIDENT VIEW" color="#82a6e6" />

      <div className="rounded-xl border border-[#82a6e6]/20 bg-[#82a6e6]/4 p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4 pb-4 border-b border-white/5">
          <div>
            <p className="font-mono text-[11px] text-meta tracking-widest mb-1">INCIDENT</p>
            <p className="font-mono text-2xl font-bold text-white">#10482</p>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">
              HIGH
            </span>
            <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-blue/20 text-blue-text border border-blue/30">
              INVESTIGATING
            </span>
          </div>
        </div>

        {/* Entities */}
        <AnimatePresence>
          {step >= 1 && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
              <p className="font-mono text-[11px] text-meta uppercase tracking-widest mb-2">Entities</p>
              <div className="flex flex-wrap gap-2">
                {["1 User Account", "1 IP Address", "1 Device"].map((e) => (
                  <span key={e} className="font-mono text-[11px] px-2 py-1 rounded bg-[#82a6e6]/10 border border-[#82a6e6]/20 text-blue-text">
                    {e}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Evidence */}
        <AnimatePresence>
          {step >= 2 && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
              <p className="font-mono text-[11px] text-meta uppercase tracking-widest mb-2">Evidence</p>
              <div className="space-y-1.5">
                {[
                  "7 failed sign-ins followed by successful authentication",
                  "Process creation post-authentication on endpoint",
                  "IP address matches threat intelligence indicator",
                ].map((e, i) => (
                  <p key={i} className="flex items-start gap-2 font-mono text-xs text-muted">
                    <span className="text-blue/60 flex-shrink-0 mt-0.5">›</span>{e}
                  </p>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions */}
        <AnimatePresence>
          {step >= 3 && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
              <p className="font-mono text-[11px] text-meta uppercase tracking-widest mb-2">Analyst Actions</p>
              <div className="flex flex-wrap gap-2">
                {["Assign Analyst", "Add Comment", "Run Playbook", "Close Incident"].map((a) => (
                  <button key={a} disabled aria-disabled className="font-mono text-[11px] px-3 py-1 rounded border border-line text-meta cursor-default select-none">
                    {a}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// SCENE 9 — FINAL TIMELINE
// ──────────────────────────────────────────────────────────────

function Scene9({ onComplete, reduced }: SceneProps) {
  const [visible, setVisible] = useState(reduced ? SUMMARY_STEPS.length : 0);
  const [complete, setComplete] = useState(reduced);
  const done = useRef(false);

  useEffect(() => {
    if (reduced) {
      const t = setTimeout(() => { if (!done.current) { done.current = true; onComplete(); } }, 800);
      return () => clearTimeout(t);
    }
    const iv = setInterval(() => {
      setVisible(v => {
        if (v >= SUMMARY_STEPS.length) {
          clearInterval(iv);
          setTimeout(() => setComplete(true), 350);
          setTimeout(() => { if (!done.current) { done.current = true; onComplete(); } }, 2200);
          return v;
        }
        return v + 1;
      });
    }, 340);
    return () => clearInterval(iv);
  }, [onComplete, reduced]);

  return (
    <div className="p-5">
      <SectionLabel
        text={complete ? "THREAT HUNT COMPLETE" : "BUILDING INVESTIGATION SUMMARY..."}
        color={complete ? "#98dcc2" : "#aec5f0"}
      />

      <div className="space-y-2">
        {SUMMARY_STEPS.map((label, i) => (
          i < visible ? (
            <motion.div
              key={label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.28 }}
              className="flex items-center gap-3 px-4 py-2 rounded-lg bg-black/40 border border-white/5"
            >
              <span className="w-5 h-5 rounded-full bg-[#82a6e6]/15 border border-[#82a6e6]/35 flex items-center justify-center flex-shrink-0">
                <span className="font-mono text-[11px] text-[#82a6e6]">{i + 1}</span>
              </span>
              <span className="font-mono text-xs text-[#c6cad2] flex-1">{label}</span>
              <span className="font-mono text-[11px] text-mint">✓</span>
            </motion.div>
          ) : (
            <div key={label} className="h-[36px] rounded-lg bg-black/20 border border-white/5 opacity-30" />
          )
        ))}
      </div>

      <AnimatePresence>
        {complete && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 flex items-center gap-3 px-4 py-3 rounded-lg border border-[#98dcc2]/20 bg-[#98dcc2]/5"
          >
            <PulseDot color="#98dcc2" />
            <span className="font-mono text-sm text-[#98dcc2] font-bold tracking-widest">THREAT HUNT COMPLETE</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// SCENE 10 — ARCHITECTURE
// ──────────────────────────────────────────────────────────────

function Scene10({ onComplete, reduced }: SceneProps) {
  const [step, setStep] = useState(reduced ? ARCH_STEPS.length : 0);
  const done = useRef(false);

  useEffect(() => {
    if (reduced) {
      const t = setTimeout(() => { if (!done.current) { done.current = true; onComplete(); } }, 800);
      return () => clearTimeout(t);
    }
    const iv = setInterval(() => {
      setStep(s => {
        if (s >= ARCH_STEPS.length) {
          clearInterval(iv);
          setTimeout(() => { if (!done.current) { done.current = true; onComplete(); } }, 1800);
          return s;
        }
        return s + 1;
      });
    }, 310);
    return () => clearInterval(iv);
  }, [onComplete, reduced]);

  return (
    <div className="p-5">
      <SectionLabel text="SENTINEL ARCHITECTURE" color="#82a6e6" />

      <div className="flex flex-col items-center gap-0">
        {ARCH_STEPS.map((node, i) => (
          <div key={node.label} className="flex flex-col items-center">
            {i < step && (
              <motion.div
                initial={{ opacity: 0, scale: 0.88 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.26 }}
                className="px-6 py-1.5 rounded-lg border text-center w-60"
                style={{ borderColor: `${node.color}28`, backgroundColor: `${node.color}07` }}
              >
                <p className="font-mono text-[11px] font-bold tracking-widest" style={{ color: node.color }}>
                  {node.label}
                </p>
              </motion.div>
            )}
            {i < ARCH_STEPS.length - 1 && i < step && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 16 }}
                className="flex flex-col items-center overflow-hidden"
              >
                <div className="flex-1 w-px bg-raised" />
                <div className="w-1 h-1 border-r border-b border-white/10 rotate-45 -mt-0.5" />
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// SCENE 11 — FINAL HERO STATE
// ──────────────────────────────────────────────────────────────

function Scene11({ onComplete, reduced }: SceneProps) {
  const done = useRef(false);

  useEffect(() => {
    const t = setTimeout(
      () => { if (!done.current) { done.current = true; onComplete(); } },
      reduced ? 800 : 4500,
    );
    return () => clearTimeout(t);
  }, [onComplete, reduced]);

  const tags = ["Microsoft Sentinel", "KQL", "Threat Hunting", "MITRE ATT&CK", "SOC Operations"];

  return (
    <div className="p-8 flex flex-col items-center justify-center text-center min-h-[320px]">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
      >
        <p className="font-mono text-[11px] text-[#aec5f0] tracking-[0.35em] uppercase mb-3">
          Azure Sentinel
        </p>
        <h2 className="font-bold text-xl sm:text-2xl text-white tracking-tight mb-1">
          Threat Hunting Playbook
        </h2>
        <p className="font-mono text-meta text-sm italic mb-6">
          &ldquo;Hunt. Investigate. Detect. Respond.&rdquo;
        </p>

        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {tags.map((tag, i) => (
            <motion.span
              key={tag}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.07 }}
              className="px-3 py-1 rounded-full border border-[#aec5f0]/20 bg-[#aec5f0]/5 font-mono text-[11px] text-[#aec5f0]/80"
            >
              {tag}
            </motion.span>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="font-mono text-[11px] text-meta tracking-widest uppercase"
        >
          Simulated Demonstration · Replaying in 4s...
        </motion.p>
      </motion.div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// MAIN ORCHESTRATOR
// ──────────────────────────────────────────────────────────────

export default function SentinelThreatHuntSim() {
  const [scene, setScene] = useState(1);
  const [simKey, setSimKey] = useState(0);
  const prevScene = useRef(1);
  const shouldReduce = useReducedMotion() ?? false;

  const advance = useCallback(() => {
    setScene(s => (s >= 11 ? 1 : s + 1));
  }, []);

  // Detect reset (11 → 1) and remount scene 1 by bumping simKey
  useEffect(() => {
    if (scene === 1 && prevScene.current === 11) {
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
          {scene === 11 && <Scene11 {...props} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

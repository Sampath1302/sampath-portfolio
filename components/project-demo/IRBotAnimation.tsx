"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import AnimationShell from "./AnimationShell";

interface WorkflowStep {
  id: string;
  label: string;
  sublabel: string;
  icon: string;
  stroke: string;
  bg: string;
  delay: number;
  interactive?: boolean;
}

const STEPS: WorkflowStep[] = [
  {
    id: "alert",
    label: "Security Alert",
    sublabel: "Risk score 91/100 — Account compromise",
    icon: "!",
    stroke: "#E5604F",
    bg: "rgba(229,96,79,0.08)",
    delay: 0.2,
  },
  {
    id: "slack",
    label: "Slack SOC Notification",
    sublabel: "#soc-alerts — @SOC-Team notified",
    icon: "#",
    stroke: "#aec5f0",
    bg: "rgba(174,197,240,0.07)",
    delay: 0.7,
  },
  {
    id: "approval",
    label: "Analyst Approval",
    sublabel: "Human-in-the-loop review (hover me)",
    icon: "?",
    stroke: "#82a6e6",
    bg: "rgba(130,166,230,0.09)",
    delay: 1.2,
    interactive: true,
  },
  {
    id: "confirm",
    label: "Confirmation",
    sublabel: "Confirmed by J.Smith — T+1:47",
    icon: "✓",
    stroke: "#98dcc2",
    bg: "rgba(152,220,194,0.08)",
    delay: 1.7,
  },
  {
    id: "quarantine",
    label: "Host Quarantine",
    sublabel: "192.168.1.127 — network access revoked",
    icon: "■",
    stroke: "#82a6e6",
    bg: "rgba(130,166,230,0.09)",
    delay: 2.2,
  },
  {
    id: "audit",
    label: "Audit Log Generated",
    sublabel: "IR-2847-2026-08-29.json — 4 min 12 sec",
    icon: "≡",
    stroke: "#aec5f0",
    bg: "rgba(174,197,240,0.07)",
    delay: 2.7,
  },
];

function WorkflowNode({ step, isLast, columnEnd }: { step: WorkflowStep; isLast: boolean; columnEnd: boolean }) {
  return (
    <div className="flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: step.delay, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        whileHover={step.interactive ? { scale: 1.03 } : {}}
        className="relative w-64 sm:w-60 rounded-lg border px-4 py-3 cursor-default"
        style={{ borderColor: `${step.stroke}35`, backgroundColor: step.bg }}
      >
        {/* Left accent bar */}
        <span
          className="absolute left-0 top-3 bottom-3 w-0.5 rounded-full"
          style={{ backgroundColor: step.stroke }}
        />

        <div className="flex items-center gap-3 pl-2">
          {/* Icon badge */}
          <span
            className="flex-shrink-0 w-7 h-7 rounded-md flex items-center justify-center font-mono text-xs font-bold"
            style={{ color: step.stroke, border: `1px solid ${step.stroke}40`, background: `${step.stroke}10` }}
          >
            {step.icon}
          </span>

          <div>
            <p className="font-mono text-xs font-semibold" style={{ color: step.stroke }}>
              {step.label}
            </p>
            <p className="font-mono text-[11px] text-muted mt-0.5 leading-snug">
              {step.sublabel}
            </p>
          </div>
        </div>

        {/* Hover glow for interactive node */}
        {step.interactive && (
          <motion.div
            className="absolute inset-0 rounded-lg opacity-0 pointer-events-none"
            style={{ boxShadow: `0 0 16px ${step.stroke}30` }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </motion.div>

      {/* Connector line between nodes */}
      {!isLast && (
        <motion.div
          className={`w-px ${columnEnd ? "sm:invisible" : ""}`}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: step.delay + 0.35, duration: 0.3, ease: "easeOut" }}
          style={{ backgroundColor: `${step.stroke}30`, height: "20px", transformOrigin: "top" }}
        />
      )}
    </div>
  );
}

export default function IRBotAnimation({ onComplete }: { onComplete: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0 });

  return (
    <AnimationShell
      title="IR-Bot"
      subtitle="Incident Response Automation Platform"
      classification="SOAR Automation — Case File #004"
      duration={9000}
      onComplete={onComplete}
    >
      <div ref={ref} className="px-6 py-7">
        <div className="flex items-center gap-2 mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#82a6e6] animate-pulse" />
          <span className="text-[#82a6e6] font-mono text-[11px] tracking-widest">APPROVAL WORKFLOW</span>
        </div>

        {/* Workflow node chain: two columns of three from sm up, so the panel reads landscape */}
        {inView && (
          <div className="flex flex-col items-center sm:grid sm:grid-flow-col sm:grid-rows-3 sm:justify-center sm:gap-x-6">
            {STEPS.map((step, i) => (
              <WorkflowNode key={step.id} step={step} isLast={i === STEPS.length - 1} columnEnd={i === 2} />
            ))}
          </div>
        )}

        {/* Status bar */}
        <div className="flex flex-wrap gap-4 mt-5 pt-3 border-t border-white/5">
          <span className="flex items-center gap-1.5 font-mono text-[11px] text-[#98dcc2]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#98dcc2] animate-ping" style={{ animationDuration: "1.5s" }} />
            SOCKET MODE CONNECTED
          </span>
          <span className="text-muted font-mono text-[11px]">Response time: 4 min 12 sec</span>
          <span className="text-[#98dcc2] font-mono text-[11px]">Host quarantined</span>
        </div>
      </div>
    </AnimationShell>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface AnimationShellProps {
  title: string;
  subtitle: string;
  classification: string;
  duration: number;
  children: ReactNode;
  onComplete: () => void;
}

export default function AnimationShell({
  title,
  subtitle,
  classification,
  duration,
  children,
  onComplete,
}: AnimationShellProps) {
  const [progress, setProgress] = useState(0);
  const doneRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min((elapsed / duration) * 100, 100);
      setProgress(pct);
      if (pct >= 100 && !doneRef.current) {
        doneRef.current = true;
        clearInterval(interval);
        setTimeout(() => onCompleteRef.current(), 600);
      }
    }, 50);
    return () => clearInterval(interval);
  }, [duration]);

  const handleSkip = () => {
    if (!doneRef.current) {
      doneRef.current = true;
      onCompleteRef.current();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-graphite flex flex-col items-center justify-center px-6 py-28"
    >
      <div className="w-full max-w-3xl">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-muted text-sm mb-1.5">
              {classification}
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-semibold text-ink tracking-tight">
              {title}
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">{subtitle}</p>
          </div>
          <button
            onClick={handleSkip}
            className="mt-1 text-ink text-sm btn-glass px-3.5 py-1.5 rounded-lg transition-colors"
            aria-label="Skip the walkthrough and return to the write-up"
          >
            Skip
          </button>
        </div>

        {/* Visualization panel */}
        <div className="glass rounded-2xl p-1.5 shadow-2xl shadow-black/60">
          <div className="rounded-xl bg-surface overflow-hidden">
          {children}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 flex items-center gap-3">
          <div className="flex-1 h-px bg-slate-900 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-mint rounded-full"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
          <span className="text-slate-700 font-mono text-[10px] w-8 text-right">
            {Math.round(progress)}%
          </span>
        </div>
      </div>
    </motion.div>
  );
}

"use client";

import IRBotAnimation from "@/components/project-demo/IRBotAnimation";
import ProjectPage from "@/components/ui/ProjectPage";
import ProjectWriteup, { WriteupSection } from "@/components/ui/ProjectWriteup";
import { projects } from "@/lib/content";

const project = projects.find((p) => p.slug === "ir-bot")!;

const timeline = [
  { time: "0:00", label: "Alert ingested", detail: "Risk score 91 out of 100" },
  { time: "0:12", label: "SOC notified", detail: "Slack message delivered to #soc-alerts" },
  { time: "1:47", label: "Analyst approves", detail: "Containment confirmed in Slack" },
  { time: "2:05", label: "Host quarantined", detail: "Network access revoked via PowerShell" },
  { time: "2:08", label: "Audit logged", detail: "IR-2847.json written" },
];

export default function IRBotPage() {
  return (
    <ProjectPage
      intro={(done) => <IRBotAnimation onComplete={done} />}
      writeup={(watch) => (
        <ProjectWriteup
          project={project}
          onWatchWalkthrough={watch}
          intro="A Slack bot for incident response. When an alert comes in, it can quarantine a host, but only after an analyst approves the action in Slack. Every step is written to a JSON audit trail."
          pipeline={[
            { label: "Security alert", detail: "Triggered by the SIEM or EDR" },
            { label: "Slack notification", detail: "Posted to the #soc-alerts channel" },
            { label: "Analyst command", detail: "!quarantine <host>" },
            { label: "Approval request", detail: "Reviewed by a senior analyst" },
            { label: "Containment", detail: "Host quarantined with PowerShell" },
            { label: "Audit logging", detail: "JSON incident trail" },
          ]}
          capabilities={[
            "Slack Socket Mode integration",
            "Human approval before containment",
            "Host quarantine with PowerShell",
            "Approval timeout enforcement",
            "Full audit trail generation",
            "Support for multiple playbooks",
          ]}
          stack={["Node.js", "Slack API", "Socket Mode", "PowerShell", "JSON logging", "Winston"]}
          extra={
            <WriteupSection title="One incident, start to finish" note="Elapsed time from a test incident.">
              <ol className="border-l border-line">
                {timeline.map((t) => (
                  <li key={t.label} className="relative grid grid-cols-[3.5rem_1fr] gap-4 pb-6 pl-6 last:pb-0">
                    <span aria-hidden className="absolute -left-[4px] top-[0.45rem] h-[7px] w-[7px] rounded-full bg-muted" />
                    <span className="font-mono text-sm tabular-nums text-muted">{t.time}</span>
                    <span>
                      <span className="block font-medium text-ink">{t.label}</span>
                      <span className="mt-0.5 block text-[0.9375rem] text-muted">{t.detail}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </WriteupSection>
          }
          sampleRun={{
            command: "ir-bot --runtime-status --playbook-check",
            lines: [
              { label: "Socket Mode connected", value: "OK" },
              { label: "Quarantine executed", value: "host-127 isolated" },
              { label: "Approval enforced", value: "1 min 47 sec" },
              { label: "Audit log generated", value: "IR-2847-2026-08-29.json" },
              { label: "Total response time", value: "4 min 12 sec" },
            ],
          }}
          lessons={[
            "The human approval step was the most important design decision. Automated containment without analyst confirmation risks disrupting legitimate operations.",
            "Slack Socket Mode gave a reliable two-way channel, but needed careful error handling for connection drops during an active incident.",
            "PowerShell was the right tool for Windows host quarantine because of its integration with Windows Firewall. The challenge was making operations idempotent so a host could never be quarantined twice.",
          ]}
        />
      )}
    />
  );
}

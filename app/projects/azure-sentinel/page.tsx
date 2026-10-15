"use client";

import dynamic from "next/dynamic";
import SentinelAnimation from "@/components/project-demo/SentinelAnimation";
import ProjectPage from "@/components/ui/ProjectPage";
import ProjectWriteup, { WriteupSection } from "@/components/ui/ProjectWriteup";
import { projects } from "@/lib/content";

// Client-only: the simulation uses random values and timers
const SentinelThreatHuntSim = dynamic(() => import("@/components/project-demo/SentinelThreatHuntSim"), {
  ssr: false,
  loading: () => <div className="h-[28rem] rounded-lg border border-line bg-surface" />,
});

const project = projects.find((p) => p.slug === "azure-sentinel")!;

const sampleRule = `let threshold = 5;
SigninLogs
| where TimeGenerated > ago(24h)
| where ResultType != 0
| summarize FailedAttempts = count()
    by UserPrincipalName, IPAddress
| where FailedAttempts > threshold
| project UserPrincipalName, IPAddress,
    FailedAttempts
| order by FailedAttempts desc`;

export default function SentinelPage() {
  return (
    <ProjectPage
      intro={(done) => <SentinelAnimation onComplete={done} />}
      writeup={(watch) => (
        <ProjectWriteup
          project={project}
          onWatchWalkthrough={watch}
          intro="A Microsoft Sentinel lab with analytics rules mapped to MITRE ATT&CK, identity monitoring and Logic App playbooks for automated response. I built it with AI assistance and I'm now learning KQL hands-on, so I can write and tune rules like these myself."
          pipeline={[
            { label: "Azure logs", detail: "SigninLogs, AuditLogs and SecurityEvents" },
            { label: "Log Analytics", detail: "Central log ingestion" },
            { label: "Microsoft Sentinel", detail: "SIEM and SOAR platform" },
            { label: "Analytics rules", detail: "KQL-based detections" },
            { label: "Incident creation", detail: "Alert triage and assignment" },
            { label: "Logic Apps", detail: "Automated response playbooks" },
          ]}
          capabilities={[
            "Threat hunting queries",
            "Identity and access monitoring",
            "Brute force detection",
            "Impossible travel alerts",
            "Privileged access monitoring",
            "MITRE ATT&CK mapping",
            "Automated incident creation",
            "Logic App response playbooks",
            "Incident investigation workflow",
          ]}
          stack={["Microsoft Sentinel", "KQL", "Azure Log Analytics", "Logic Apps", "Azure AD", "MITRE ATT&CK"]}
          extra={
            <WriteupSection
              title="Sample detection"
              note="A brute-force rule from the lab. It was AI-generated; I reviewed it and I'm learning to write rules like it myself."
            >
              <div className="overflow-x-auto rounded-lg border border-line bg-surface">
                <pre className="p-5 font-mono text-[0.8125rem] leading-[1.8] text-ink/85">{sampleRule}</pre>
              </div>
            </WriteupSection>
          }
          demo={<SentinelThreatHuntSim />}
          sampleRun={{
            command: "sentinel --workspace sentinel-prod-001 --hunt brute-force",
            lines: [
              { label: "Workspace connected", value: "sentinel-prod-001" },
              { label: "Analytics rules active", value: "24 rules" },
              { label: "Incident created", value: "#4821 high severity" },
              { label: "SOAR response triggered", value: "account disabled + notified" },
            ],
          }}
          lessons={[
            "Reviewing the AI-generated KQL rules taught me the value of time-based aggregations for spotting anomalies, rather than alerting on every individual failed login.",
            "MITRE ATT&CK mapping made incidents easier to put in context: knowing the technique (T1078) immediately suggested the response playbook.",
            "Logic Apps automated the first three containment steps, which cut the time to respond in the lab.",
          ]}
        />
      )}
    />
  );
}

"use client";

import dynamic from "next/dynamic";
import QurikAnimation from "@/components/project-demo/QurikAnimation";
import ProjectPage from "@/components/ui/ProjectPage";
import ProjectWriteup, { WriteupSection } from "@/components/ui/ProjectWriteup";
import { projects } from "@/lib/content";

// Client-only: the simulation uses random values and timers
const QurikIDPSSim = dynamic(() => import("@/components/project-demo/QurikIDPSSim"), {
  ssr: false,
  loading: () => <div className="h-[28rem] rounded-lg border border-line bg-surface" />,
});

const project = projects.find((p) => p.slug === "qurik")!;

const metrics = [
  { label: "Detection accuracy", value: "96.8%" },
  { label: "False positive rate", value: "2.3%" },
  { label: "Detection latency", value: "340 ms" },
  { label: "Event throughput", value: "15K/s" },
];

export default function QurikPage() {
  return (
    <ProjectPage
      intro={(done) => <QurikAnimation onComplete={done} />}
      writeup={(watch) => (
        <ProjectWriteup
          project={project}
          onWatchWalkthrough={watch}
          intro="An adaptive web security platform that combines a WAF, intrusion detection, behavioural anomaly detection and threat intelligence into one real-time monitoring dashboard."
          pipeline={[
            { label: "Traffic source", detail: "Incoming HTTP and HTTPS requests" },
            { label: "Traffic collector", detail: "Packet capture and routing" },
            { label: "Preprocessor", detail: "Normalisation and parsing" },
            { label: "Detection engine", detail: "Machine learning plus rule-based analysis" },
            { label: "Alert manager", detail: "Triage and classification" },
            { label: "Dashboard", detail: "Real-time visualisation for the analyst" },
          ]}
          capabilities={[
            "SQL injection detection",
            "XSS detection",
            "Path traversal detection",
            "Malicious bot detection",
            "Behavioural anomaly analysis",
            "Threat correlation engine",
            "Automated IP blocking",
            "Real-time alert dashboard",
          ]}
          stack={["Python", "FastAPI", "React", "TensorFlow", "MongoDB", "PostgreSQL", "Docker", "Kubernetes", "Apache Kafka"]}
          extra={
            <WriteupSection
              title="Evaluation"
              note="Figures from project evaluation and testing, not production guarantees."
            >
              <dl className="grid grid-cols-2 gap-x-8 gap-y-8 sm:grid-cols-4">
                {metrics.map((m) => (
                  <div key={m.label}>
                    <dd data-enter data-count-to={parseFloat(m.value)} className="font-display text-[2.25rem] font-semibold leading-none tabular-nums text-ink">
                      {m.value}
                    </dd>
                    <dt className="mt-2 text-[0.9375rem] text-muted">{m.label}</dt>
                  </div>
                ))}
              </dl>
            </WriteupSection>
          }
          demo={<QurikIDPSSim />}
          sampleRun={{
            command: "qurik --system-check --verbose",
            lines: [
              { label: "WAF module loaded", value: "147 rules" },
              { label: "Detection engine active", value: "96.8% accuracy" },
              { label: "Threat blocked this session", value: "path traversal + SQLi" },
              { label: "Dashboard streaming", value: "15K events/sec" },
            ],
          }}
          lessons={[
            "Building a real-time detection engine means constantly balancing false positives against detection sensitivity. TensorFlow behavioural models improved accuracy over a purely rule-based approach.",
            "Kafka as the event streaming backbone was essential for handling 15K+ events per second without dropping packets under peak load.",
            "The hardest part was designing a threat scoring algorithm that accounts for behavioural context across multiple request patterns.",
          ]}
        />
      )}
    />
  );
}

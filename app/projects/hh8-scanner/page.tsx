"use client";

import HH8Animation from "@/components/project-demo/HH8Animation";
import ProjectPage from "@/components/ui/ProjectPage";
import ProjectWriteup from "@/components/ui/ProjectWriteup";
import { projects } from "@/lib/content";

const project = projects.find((p) => p.slug === "hh8-scanner")!;

export default function HH8Page() {
  return (
    <ProjectPage
      intro={(done) => <HH8Animation onComplete={done} />}
      writeup={(watch) => (
        <ProjectWriteup
          project={project}
          onWatchWalkthrough={watch}
          intro="A Python web vulnerability scanner I built during my HackerHub8 internship. It crawls a target, audits its security headers, checks endpoints for common vulnerabilities and writes everything up as a report."
          pipeline={[
            { label: "Web target", detail: "URL or domain input" },
            { label: "Crawler engine", detail: "Breadth-first link discovery" },
            { label: "URL discovery", detail: "Sitemap and robots.txt" },
            { label: "Header analysis", detail: "Security header audit against OWASP guidance" },
            { label: "Security checks", detail: "SQLi, XSS, SSRF and LFI tests" },
            { label: "Report", detail: "PDF and JSON output" },
          ]}
          capabilities={[
            "Recursive URL crawling",
            "Security header analysis",
            "X-Frame-Options detection",
            "CSP policy validation",
            "HSTS enforcement check",
            "SQL injection testing",
            "XSS payload testing",
            "SSRF vector detection",
            "Vulnerability scoring",
          ]}
          stack={["Python", "Requests", "BeautifulSoup4", "urllib3", "FPDF", "argparse"]}
          sampleRun={{
            command: "hh8-scanner --target https://example.com --full-scan",
            lines: [
              { label: "URLs discovered", value: "47 endpoints" },
              { label: "Security headers missing", value: "4 critical" },
              { label: "High vulnerabilities", value: "3 findings" },
              { label: "Report generated", value: "hh8-scan-2026.pdf" },
            ],
          }}
          lessons={[
            "Designing a crawler that respects rate limits while keeping coverage high meant adding an adaptive delay based on server response times.",
            "BeautifulSoup4 was reliable for HTML parsing, but JavaScript-rendered content exposed the limits of static analysis. A future version would add headless browser support.",
            "The most valuable feature was the security header analysis: many real-world targets failed basic header configuration, which made it a high-value check.",
          ]}
        />
      )}
    />
  );
}

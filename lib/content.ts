/**
 * All portfolio content in one place, so sections stay presentational.
 */

export type ProjectStatus = "complete" | "in-progress";

export interface Project {
  slug: string;
  title: string;
  category: "Detect" | "Assess" | "Hunt" | "Respond";
  status: ProjectStatus;
  /** One line, shown in the hero case queue */
  summary: string;
  /** What kind of system it is */
  kind: string;
  description: string;
  stack: string[];
  highlights: string[];
  /** Optional evaluation note, shown as plain text */
  evaluation?: string;
}

export const projects: Project[] = [
  {
    slug: "qurik",
    title: "QURIK",
    category: "Detect",
    status: "complete",
    summary: "WAF, IDS and anomaly detection in one live dashboard",
    kind: "Web application defence platform",
    description:
      "An adaptive web security platform that combines a WAF, intrusion detection, behavioural anomaly detection and threat intelligence into a single real-time dashboard.",
    stack: ["Python", "FastAPI", "React", "TensorFlow", "SQL database", "Docker", "Kubernetes"],
    highlights: ["SQL injection and XSS detection", "Behavioural anomaly analysis", "Automated IP blocking"],
    evaluation:
      "In project testing: 96.8% detection accuracy, 2.3% false positives, 340 ms latency, 15K events per second.",
  },
  {
    slug: "hh8-scanner",
    title: "HH8 Scanner",
    category: "Assess",
    status: "complete",
    summary: "Python web vulnerability scanner with PDF reporting",
    kind: "Web vulnerability assessment tool",
    description:
      "A Python scanner that crawls a site breadth-first, checks security headers against OWASP guidance, flags exposed endpoints and writes the findings up as a PDF report.",
    stack: ["Python", "Requests", "BeautifulSoup4", "FPDF"],
    highlights: ["BFS crawling", "Security header analysis", "Automated PDF reports"],
  },
  {
    slug: "azure-sentinel",
    title: "Azure Sentinel lab",
    category: "Hunt",
    status: "complete",
    summary: "Sentinel detection lab with automated Logic App response",
    kind: "Cloud security operations",
    description:
      "A Microsoft Sentinel lab with analytics rules mapped to MITRE ATT&CK, identity monitoring and Logic App playbooks for automated response. Built with AI assistance while I learn KQL properly.",
    stack: ["Microsoft Sentinel", "Azure Log Analytics", "Logic Apps", "MITRE ATT&CK"],
    highlights: ["Analytics rules with ATT&CK mapping", "Identity monitoring", "SOAR playbooks"],
  },
  {
    slug: "ir-bot",
    title: "IR-Bot",
    category: "Respond",
    status: "complete",
    summary: "Slack bot that quarantines a host only after analyst approval",
    kind: "Incident response automation",
    description:
      "A Slack-based incident response bot. Containment actions wait for an analyst to approve them, and every step is written to a JSON audit trail.",
    stack: ["Node.js", "Slack API", "Socket Mode", "PowerShell"],
    highlights: ["Host quarantine workflow", "Human approval before containment", "Full audit trail"],
  },
];

export interface Capability {
  title: string;
  description: string;
  tools: string[];
}

export const capabilities: Capability[] = [
  {
    title: "Detection and investigation",
    description:
      "Triaging alerts, investigating them end to end and mapping what I find to MITRE ATT&CK.",
    tools: ["Microsoft Sentinel (AI-assisted lab)", "Wireshark", "Microsoft Purview DLP", "MITRE ATT&CK", "NIST CSF", "ISO 27001"],
  },
  {
    title: "Response and automation",
    description:
      "Building SOAR-style workflows that keep a human approval step in front of every containment action.",
    tools: ["Python", "PowerShell", "Node.js", "Slack API", "Logic Apps", "Active Directory", "Windows Server", "Linux"],
  },
  {
    title: "Assessment and testing",
    description:
      "Scanning web apps and networks for exposure, then writing findings up with clear remediation.",
    tools: ["Burp Suite", "Nessus", "OpenVAS", "Nmap", "Metasploit"],
  },
];

/** From the résumé's "Security operations experience" */
export const securityOperations = [
  "Conducted vulnerability assessments with Nessus, OpenVAS and Nmap, and analysed the findings.",
  "Analysed network traffic in Wireshark to identify anomalies and threats.",
  "Configured firewalls and access control policies in Active Directory.",
  "Investigated Microsoft Purview DLP alerts and carried out response actions.",
];

export const availability = "Open to fully remote work, flexible across time zones · English, Kannada, Tamil, Hindi";

export const currentlyLearning =
  "KQL, the Microsoft Cybersecurity Architect Expert path and the Certified Penetration Tester course.";

export interface Role {
  company: string;
  role: string;
  period: string;
  points: string[];
}

export const experience: Role[] = [
  {
    company: "HackerHub8",
    role: "Junior Cybersecurity Intern",
    period: "Jan 2026 – May 2026",
    points: [
      "Built a Python web vulnerability scanner using BFS crawling and OWASP security header analysis.",
      "Detected exposed endpoints and generated structured JSON reports for vulnerability assessment work.",
      "Developed and deployed the G9S Force Security Services company website with HTML, CSS, JavaScript and Bootstrap.",
      "Took part in the pre-launch security assessment, identifying and documenting findings with the team.",
    ],
  },
  {
    company: "Prodigy InfoTech",
    role: "Cyber Security Intern",
    period: "Nov 2025",
    points: [
      "Developed Python security tools for threat detection and network analysis.",
      "Built a packet sniffer with socket and Scapy for traffic monitoring and anomaly identification.",
      "Documented processes, findings and remediation recommendations for stakeholders.",
    ],
  },
];

export interface Education {
  degree: string;
  school: string;
  year: string;
  detail: string;
}

export const education: Education[] = [
  { degree: "B.Tech, Cyber Security", school: "Presidency University, Bengaluru", year: "2026", detail: "CGPA 7.93" },
];

/** Shorter project entries: a card on the home page, no film or write-up page yet */
export interface ProjectNote {
  title: string;
  context: string;
  status: ProjectStatus;
  description: string;
}

export const moreProjects: ProjectNote[] = [
  {
    title: "E-Governance Security Monitoring System",
    context: "AICTE",
    status: "complete",
    description:
      "Real-time security dashboard for monitoring, anomaly detection and alerting, with automated response to SQLi, XSS and bot attacks, and compliance through content-based log classification.",
  },
];

export interface Certification {
  title: string;
  short?: string;
  issuer: string;
  status: "held" | "in-progress";
  /** As on the certificate, e.g. "Oct 2025" */
  date?: string;
  note?: string;
  credentialId?: string;
}

export const certifications: Certification[] = [
  { title: "Certified SOC Analyst", short: "CSA", issuer: "EC-Council", status: "held", date: "Oct 2025", credentialId: "ECC9531026478" },
  { title: "Certified Network Defender", short: "CND", issuer: "EC-Council", status: "held", date: "Jan 2023", credentialId: "ECC2591834067" },
  {
    title: "Graduate Program in Cyber Security",
    issuer: "Ehack Academy",
    status: "held",
    date: "Jun 2025",
    note: "Curriculum covering CEH, CHFI and CCSE",
    credentialId: "115623",
  },
  { title: "Certified Secure Computer User", short: "CSCU", issuer: "EC-Council", status: "held", date: "Sep 2023", credentialId: "ECC4518297630" },
  { title: "Certified Penetration Tester", short: "CPT", issuer: "RedTeam Hacker Academy", status: "in-progress" },
  { title: "Cybersecurity Architect Expert", short: "SC-100 track", issuer: "Microsoft", status: "in-progress", date: "2026" },
];

export interface Recognition {
  title: string;
  result: string;
  detail: string;
}

export const recognition: Recognition[] = [
  {
    title: "Smart India Hackathon 2025",
    result: "Selected with Team Vikasana",
    detail: "Blockchain-based supply chain transparency for agricultural produce.",
  },
  {
    title: "Inventra",
    result: "2nd place",
    detail: "Cybersecurity department competition.",
  },
  {
    title: "SUMERU AI CTF",
    result: "Solved 6 of 7 challenges",
    detail: "Including LLM exploitation, April 2026.",
  },
];

/** Hero copy */
export const heroIntro =
  "I don't just run security tools. I take them apart to understand how they work, then build my own. Curious, persistent, and hands-on when something breaks.";

export const heroSpec = ["Bengaluru, IN", "EC-Council CSA · CND", "Class of 2026"];

/** The command deck's status log: each line restates a fact from this file */
export const statusLog: { tone: "ok" | "progress"; text: string }[] = [
  {
    tone: "ok",
    text: `loaded ${certifications
      .filter((c) => c.status === "held" && c.short)
      .map((c) => c.short)
      .join(", ")} + graduate program`,
  },
  { tone: "ok", text: "IR-Bot: containment waits for approval" },
  { tone: "progress", text: "learning KQL, CPT in progress" },
  { tone: "ok", text: "open to SOC analyst roles" },
];

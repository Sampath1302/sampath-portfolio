/**
 * The four "case file" films (rendered with Remotion in films/, played on the site).
 * Shared by both, so the player's chapter markers always match the video.
 * Every caption restates a fact from lib/content.ts or the project's page;
 * numbers from example runs or testing say so on screen.
 */

export const FILM_FPS = 30;
/** Seconds: title card, each of the four chapters, end card */
export const FILM_TIMING = { title: 2, chapter: 5.5, end: 2 } as const;
export const FILM_SECONDS = FILM_TIMING.title + 4 * FILM_TIMING.chapter + FILM_TIMING.end;

export const CHAPTER_NAMES = ["The threat", "Detection", "Response", "Result"] as const;

/** Start of chapter i, in seconds */
export const chapterStart = (i: number) => FILM_TIMING.title + i * FILM_TIMING.chapter;

export interface Film {
  slug: string;
  /** "01" to "04", shown as "Case file 01" */
  number: string;
  /** One caption per chapter, in CHAPTER_NAMES order; also the player's transcript */
  captions: [string, string, string, string];
}

export const films: Film[] = [
  {
    slug: "qurik",
    number: "01",
    captions: [
      "Requests carrying SQL injection, XSS and path traversal payloads reach a web app.",
      "Each request passes the collector and preprocessor, then a machine learning plus rule-based engine flags it.",
      "The alert manager triages the hit and QURIK blocks the source IP automatically.",
      "In project testing: 96.8% detection accuracy, 2.3% false positives, 340 ms latency, 15K events per second.",
    ],
  },
  {
    slug: "hh8-scanner",
    number: "02",
    captions: [
      "Web apps go live with missing security headers and exposed endpoints.",
      "HH8 crawls the site breadth-first, audits headers against OWASP guidance and runs SQLi, XSS, SSRF and LFI checks.",
      "Every finding is written up as a PDF and JSON report.",
      "Example test run: 47 endpoints discovered, 4 critical headers missing, 3 high findings.",
    ],
  },
  {
    slug: "azure-sentinel",
    number: "03",
    captions: [
      "Failed sign-ins pile up against one account from the same address: a brute-force pattern.",
      "Sign-in logs flow into Log Analytics, a brute-force analytics rule mapped to MITRE ATT&CK fires, and Sentinel opens an incident.",
      "A Logic App playbook disables the account and notifies the team.",
      "Lab complete. Built with AI assistance; I reviewed the rules and I'm learning KQL hands-on.",
    ],
  },
  {
    slug: "ir-bot",
    number: "04",
    captions: [
      "A SIEM alert lands on host-127 with a risk score of 91 out of 100.",
      "IR-Bot posts the alert to the #soc-alerts channel in Slack.",
      "An analyst runs !quarantine, a senior analyst approves, and only then does PowerShell isolate the host.",
      "Every step is written to a JSON audit trail. Example run: alert to audit log in 2 min 8 s.",
    ],
  },
];

export const filmFor = (slug: string) => films.find((f) => f.slug === slug);

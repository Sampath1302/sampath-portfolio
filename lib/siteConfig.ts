/**
 * Central configuration for personal/site-wide data.
 * Import from here rather than scattering URLs across components.
 */

export const siteConfig = {
  /** Live site: the base for canonical URLs, og:url and link-preview images */
  url: "https://sampath-portfolio.vercel.app",
  name: "Sampath Kumar MS",
  role: "SOC analyst, detection and response",
  location: "Bengaluru, India",
  email: "Sampathkumar78295@gmail.com",
  github: "https://github.com/Sampath1302",
  linkedin: "https://www.linkedin.com/in/sampath-kumar-ms-b86306339/",
  /** Approved public résumé in public/ */
  resume: "/Sampath-Kumar-MS-Resume.pdf",
  /** Used in <head> metadata */
  siteTitle: "Sampath Kumar MS | SOC Analyst, Detection & Response",
  siteDescription:
    "Portfolio of Sampath Kumar MS, a 2026 cybersecurity graduate in Bengaluru focused on SOC operations, detection, incident response automation and security assessment.",
} as const;

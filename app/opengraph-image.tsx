import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { projects } from "@/lib/content";
import { siteConfig } from "@/lib/siteConfig";

export const alt = `${siteConfig.name}, ${siteConfig.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Satori needs static TTF files, so Plex is read from assets/ rather than next/font
const font = (file: string) => readFile(join(process.cwd(), "assets/fonts", file));

export default async function Image() {
  const [semibold, regular] = await Promise.all([
    font("IBMPlexSansCondensed-SemiBold.ttf"),
    font("IBMPlexSansCondensed-Regular.ttf"),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          gap: 64,
          padding: "0 80px",
          background: "#0E141C",
          color: "#E4E9F0",
          fontFamily: "Plex",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <div style={{ fontSize: 96, fontWeight: 600, lineHeight: 0.95, letterSpacing: -2 }}>Sampath</div>
          <div style={{ fontSize: 96, fontWeight: 600, lineHeight: 0.95, letterSpacing: -2 }}>Kumar MS</div>
          <div style={{ marginTop: 32, fontSize: 36, color: "#C4CCD8" }}>{siteConfig.role}</div>
          <div style={{ marginTop: 14, fontSize: 26, color: "#8B98AA" }}>{siteConfig.location}</div>
        </div>

        <div
          style={{
            width: 500,
            display: "flex",
            flexDirection: "column",
            background: "#151E29",
            border: "1px solid #263345",
            borderRadius: 12,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "18px 26px",
              borderBottom: "1px solid #263345",
              fontSize: 22,
            }}
          >
            <span style={{ fontWeight: 600 }}>Case queue</span>
            <span style={{ color: "#8B98AA" }}>{projects.length} cases</span>
          </div>
          {projects.map((p, i) => {
            const done = p.status === "complete";
            return (
              <div
                key={p.slug}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "20px 26px",
                  borderTop: i === 0 ? "none" : "1px solid #263345",
                  fontSize: 26,
                }}
              >
                <span style={{ fontWeight: 600 }}>{p.title}</span>
                <span style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 20, color: done ? "#4FC3A1" : "#F0B43C" }}>
                  <span style={{ width: 9, height: 9, borderRadius: 9, background: done ? "#4FC3A1" : "#F0B43C" }} />
                  {done ? "Complete" : "In progress"}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Plex", data: semibold, weight: 600, style: "normal" },
        { name: "Plex", data: regular, weight: 400, style: "normal" },
      ],
    }
  );
}

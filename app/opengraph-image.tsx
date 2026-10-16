import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { projects } from "@/lib/content";
import { siteConfig } from "@/lib/siteConfig";

export const alt = `${siteConfig.name}, ${siteConfig.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Satori needs static TTF files, so Chakra Petch is read from assets/ rather than next/font
const font = (file: string) => readFile(join(process.cwd(), "assets/fonts", file));

const mint = "#98DCC2";
const blueText = "#AEC5F0";
const hair = "rgba(255,255,255,0.07)";

export default async function Image() {
  const [bold, regular] = await Promise.all([font("ChakraPetch-Bold.ttf"), font("ChakraPetch-Regular.ttf")]);

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
          background: "#101318",
          color: "#ECEEF2",
          fontFamily: "Chakra",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <div style={{ display: "flex", fontSize: 24, color: "#858C98" }}>
            <span style={{ color: mint }}>sampath@soc</span>:~$ whoami --brief
          </div>
          <div style={{ marginTop: 22, fontSize: 96, fontWeight: 700, lineHeight: 0.95, letterSpacing: -2 }}>Sampath</div>
          <div style={{ fontSize: 96, fontWeight: 700, lineHeight: 0.95, letterSpacing: -2 }}>Kumar MS</div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 30, fontSize: 34 }}>
            <div style={{ width: 44, height: 3, background: `linear-gradient(90deg, ${mint}, #82A6E6)` }} />
            {siteConfig.role}
          </div>
          <div style={{ marginTop: 14, fontSize: 24, color: "#858C98" }}>{siteConfig.location}</div>
        </div>

        <div
          style={{
            width: 480,
            display: "flex",
            flexDirection: "column",
            background: "#1A1D23",
            border: `1px solid rgba(152,220,194,0.35)`,
            borderRadius: 22,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "18px 26px",
              borderBottom: `1px solid ${hair}`,
              fontSize: 22,
            }}
          >
            <span style={{ fontWeight: 700, letterSpacing: 1.5 }}>COMMAND DECK</span>
            <span style={{ color: "#858C98" }}>{projects.length} projects</span>
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
                  borderTop: i === 0 ? "none" : `1px solid ${hair}`,
                  fontSize: 26,
                }}
              >
                <span style={{ fontWeight: 700 }}>{p.title}</span>
                <span
                  style={{
                    fontSize: 19,
                    padding: "6px 14px",
                    borderRadius: 999,
                    color: done ? mint : blueText,
                    background: done ? "rgba(152,220,194,0.12)" : "rgba(130,166,230,0.16)",
                  }}
                >
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
        { name: "Chakra", data: bold, weight: 700, style: "normal" },
        { name: "Chakra", data: regular, weight: 400, style: "normal" },
      ],
    }
  );
}

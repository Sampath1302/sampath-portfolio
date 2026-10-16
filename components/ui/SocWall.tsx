import type { CSSProperties } from "react";
import WallPause from "@/components/ui/WallPause";

/*
 * Illustrative ambience only: made-up hosts, masked IPs, nothing about Sampath.
 * Fixed values (no randomness), so the server HTML is the final HTML.
 */
const rawLogs = [
  "auth.failure user=svc_backup src=10.4.2.17",
  "[detected] brute-force pattern T1110",
  "dns.query host=cdn-update[.]co",
  "fw.deny 185.220.x.x -> 10.4.0.12:445",
  "web.req POST /login.php 401",
  "[resolved] false positive closed",
  "proc.start powershell.exe -enc ...",
  "auth.success user=j.doe mfa=ok",
  "[detected] impossible travel login",
  "net.flow 10.4.3.8 -> 52.x.x.x:443",
  "edr.alert lsass.exe handle request",
  "[resolved] host quarantined (approved)",
  "dns.query host=updates.example.net",
  "web.req GET /admin 403",
  "auth.failure user=admin src=10.4.2.17",
  "[detected] beaconing every 60s",
  "fw.allow 10.4.1.5 -> 8.8.8.8:53",
  "[resolved] ioc blocked at proxy",
  "proc.start cmd.exe /c whoami",
  "auth.lockout user=svc_backup",
];

const logColor = (t: string) =>
  t.startsWith("[detected]") ? "var(--color-mint)" : t.startsWith("[resolved]") ? "var(--color-blue-text)" : "#5e6673";

const ysA = [150, 140, 146, 120, 132, 108, 128, 92, 118, 102, 124, 74, 110, 104, 130, 84, 120, 114, 138, 96, 128, 120, 142, 150];
const ysB = [190, 184, 188, 176, 180, 168, 178, 160, 174, 166, 176, 150, 170, 166, 180, 156, 174, 170, 184, 162, 178, 174, 186, 190];
/** Two copies side by side, so a -50% scroll loops seamlessly */
const path = (ys: number[]) =>
  ys
    .concat(ys.slice(1))
    .map((y, i) => `${i ? "L" : "M"} ${i * 20} ${y}`)
    .join(" ");

const cells = Array.from({ length: 72 }, (_, i) => {
  const r = (i * 37 + 11) % 100;
  return {
    col: r > 88 ? "var(--color-mint)" : r > 74 ? "rgb(130 166 230 / 0.55)" : "rgb(255 255 255 / 0.06)",
    live: r > 74, // only lit cells pulse
    d: ((i * 13) % 30) / 10,
    dur: 2 + ((i * 7) % 30) / 10,
  };
});

const bars = Array.from({ length: 28 }, (_, j) => {
  const h = 25 + ((j * 53 + 7) % 70);
  return { h, col: h > 82 ? "var(--color-mint)" : "rgb(130 166 230 / 0.45)", d: ((j * 11) % 25) / 10, dur: 2 + ((j * 5) % 20) / 10 };
});

function LogStream({ title, side, lines, dur }: { title: string; side: string; lines: string[]; dur: string }) {
  return (
    <div className="wall-panel wall-mobile-hide">
      <div className="mb-2.5 flex justify-between">
        <span>{title}</span>
        <span>{side}</span>
      </div>
      <div className="w-scroll-y leading-[2]" style={{ "--dur": dur } as CSSProperties}>
        {lines.concat(lines).map((t, i) => (
          <div key={i} className="whitespace-nowrap" style={{ color: logColor(t) }}>
            {t}
          </div>
        ))}
      </div>
    </div>
  );
}

/** The "live SOC wall": six panels in perspective behind the hero. Decorative and hidden from assistive tech. */
export default function SocWall() {
  return (
    <div data-soc-wall aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <WallPause />
      <div
        className="w-drift-a absolute bottom-[-320px] left-[-220px] h-[760px] w-[760px] rounded-full"
        style={{ background: "radial-gradient(closest-side, rgb(152 220 194 / 0.06), rgb(152 220 194 / 0))" }}
      />
      <div
        className="w-drift-b absolute right-[-260px] top-[-380px] h-[900px] w-[900px] rounded-full"
        style={{ background: "radial-gradient(closest-side, rgb(130 166 230 / 0.12), rgb(130 166 230 / 0))" }}
      />

      <div className="absolute inset-0 overflow-hidden [perspective:1700px]">
        <div
          className="wall-stage absolute right-[-300px] top-[30px] grid h-[820px] w-[1560px] grid-cols-3 grid-rows-2 gap-[18px] font-mono text-[11px] text-[#5e6673] opacity-50"
          style={{ transform: "rotateY(-24deg) rotateX(8deg)", transformOrigin: "100% 50%" }}
        >
          <div className="wall-panel">
            <div className="flex justify-between">
              <span>events / min</span>
              <span className="text-mint">live</span>
            </div>
            <div className="absolute inset-x-0 bottom-0 h-[78%] overflow-hidden">
              <svg viewBox="0 0 460 230" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
                {[60, 120, 180].map((y) => (
                  <line key={y} x1="0" y1={y} x2="460" y2={y} stroke="rgb(255 255 255 / 0.05)" />
                ))}
              </svg>
              <div className="w-scroll-x absolute inset-y-0 left-0 w-[200%]">
                <svg viewBox="0 0 920 230" preserveAspectRatio="none" className="h-full w-full">
                  <path d={path(ysB)} fill="none" stroke="var(--color-blue)" strokeWidth="1.5" opacity="0.7" vectorEffect="non-scaling-stroke" />
                  <path d={path(ysA)} fill="none" stroke="var(--color-mint)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                </svg>
              </div>
            </div>
          </div>

          <LogStream title="siem / event stream" side="tail -f" lines={rawLogs} dur="28s" />

          <div className="wall-panel">
            <div className="mb-3">alert heatmap / 24h</div>
            <div className="grid grid-cols-12 gap-1.5">
              {cells.map((c, i) => (
                <span
                  key={i}
                  className={`block aspect-square rounded-[3px] ${c.live ? "w-cell" : ""}`}
                  style={{ background: c.col, "--d": `${c.d}s`, "--dur": `${c.dur}s` } as CSSProperties}
                />
              ))}
            </div>
          </div>

          <div className="wall-panel wall-mobile-hide flex flex-col">
            <div>auth failures / host</div>
            <div className="flex flex-1 items-end gap-1.5 pt-3.5">
              {bars.map((b, i) => (
                <span
                  key={i}
                  className="w-bar flex-1 rounded-t-[3px]"
                  style={{ height: `${b.h}%`, background: b.col, "--d": `${b.d}s`, "--dur": `${b.dur}s` } as CSSProperties}
                />
              ))}
            </div>
          </div>

          <LogStream title="edr / process tree" side="watching" lines={rawLogs.slice(7).concat(rawLogs.slice(0, 7))} dur="36s" />

          <div className="wall-panel wall-mobile-hide flex flex-col">
            <div>triage queue</div>
            <div className="grid flex-1 place-items-center">
              <div className="relative h-[190px] w-[190px]">
                <svg viewBox="0 0 190 190" className="absolute inset-0">
                  <circle cx="95" cy="95" r="80" fill="none" stroke="rgb(255 255 255 / 0.06)" strokeWidth="10" />
                  <circle cx="95" cy="95" r="58" fill="none" stroke="rgb(255 255 255 / 0.05)" strokeWidth="6" />
                </svg>
                <svg viewBox="0 0 190 190" className="w-spin absolute inset-0">
                  <circle cx="95" cy="95" r="80" fill="none" stroke="var(--color-mint)" strokeWidth="10" strokeLinecap="round" strokeDasharray="130 373" />
                </svg>
                <svg
                  viewBox="0 0 190 190"
                  className="w-spin absolute inset-0"
                  style={{ "--dur": "14s", "--dir": "reverse" } as CSSProperties}
                >
                  <circle cx="95" cy="95" r="58" fill="none" stroke="var(--color-blue)" strokeWidth="6" strokeLinecap="round" strokeDasharray="70 295" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* fades keep the text column on near-solid graphite */}
      <div
        className="wall-fade-x absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, #101318 0%, #101318f2 28%, #10131899 52%, #10131833 78%, #10131800 100%)",
        }}
      />
      <div className="absolute inset-x-0 bottom-0 h-[340px] bg-gradient-to-t from-graphite via-graphite/70 to-transparent" />
      <div className="absolute inset-x-0 top-0 h-[140px] bg-gradient-to-b from-graphite to-transparent" />
      <div className="wall-grain absolute inset-0" />
    </div>
  );
}

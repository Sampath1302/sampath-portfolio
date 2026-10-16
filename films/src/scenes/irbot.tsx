import type { ReactNode } from "react";
import { useCurrentFrame } from "remotion";
import type { Scenes } from "../CaseFile";
import { Appear, Count, Panel, Pop, Tag, Typed, displayText, monoText, ramp, useProgress } from "../primitives";
import { c, mintA, sans, whiteA } from "../theme";

function Threat() {
  const p = useProgress(10, 50);
  const R = 120;
  const C = 2 * Math.PI * R;
  return (
    <>
      <Panel title="security alert" side={<span>SIEM / EDR</span>} style={{ left: 64, top: 130, width: 600, height: 250 }}>
        <div style={{ padding: "26px 28px", ...monoText(19), lineHeight: 2.1 }}>
          <Appear at={4}>
            <div>
              host <span style={{ color: c.ink }}>host-127</span>
            </div>
          </Appear>
          <Appear at={10}>
            <div>
              source <span style={{ color: c.ink }}>SIEM</span>
            </div>
          </Appear>
          <Appear at={16}>
            <div>
              status <Tag tone="threat" size={15}>new</Tag>
            </div>
          </Appear>
        </div>
      </Panel>
      <div style={{ position: "absolute", left: 760, top: 100, width: 320, height: 320 }}>
        <svg width="320" height="320" viewBox="0 0 320 320">
          <circle cx="160" cy="160" r={R} fill="none" stroke={whiteA(0.08)} strokeWidth="16" />
          <circle
            cx="160"
            cy="160"
            r={R}
            fill="none"
            stroke={c.threat}
            strokeWidth="16"
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={C * (1 - 0.91 * p)}
            transform="rotate(-90 160 160)"
          />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <Count to={91} at={10} dur={50} style={displayText(96, c.threatText)} />
          <span style={monoText(17, c.meta)}>risk / 100</span>
        </div>
      </div>
    </>
  );
}

function SlackMessage({ who, bot, time, children }: { who: string; bot?: boolean; time?: string; children: ReactNode }) {
  return (
    <div style={{ display: "flex", gap: 16, padding: "16px 0" }}>
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 10,
          flexShrink: 0,
          display: "grid",
          placeItems: "center",
          background: bot ? mintA(0.16) : whiteA(0.08),
          ...monoText(17, bot ? c.mint : c.muted),
        }}
      >
        {bot ? "IR" : who[0]}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <span style={{ fontFamily: sans, fontWeight: 600, fontSize: 20, color: c.ink }}>{who}</span>
          {bot && <Tag tone="meta" size={12}>app</Tag>}
          {time && <span style={monoText(14, c.meta)}>{time}</span>}
        </div>
        <div style={{ fontFamily: sans, fontSize: 20, color: c.muted, marginTop: 6, lineHeight: 1.45 }}>{children}</div>
      </div>
    </div>
  );
}

function Detection() {
  const f = useCurrentFrame();
  return (
    <Panel title="# soc-alerts" side={<span>Slack · Socket Mode</span>} style={{ left: 200, top: 100, width: 880, height: 360 }}>
      <div style={{ padding: "8px 30px" }}>
        {f >= 12 && (
          <Appear at={12}>
            <SlackMessage who="IR-Bot" bot time="0:12">
              Alert on <span style={{ color: c.ink }}>host-127</span>. Risk score <span style={{ color: c.threatText }}>91 / 100</span>, raised by the SIEM.
              <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
                <span style={{ padding: "8px 16px", borderRadius: 8, border: `1px solid ${whiteA(0.14)}`, ...monoText(15, c.ink) }}>Investigate</span>
                <span style={{ padding: "8px 16px", borderRadius: 8, border: `1px solid ${whiteA(0.14)}`, ...monoText(15, c.ink) }}>!quarantine host-127</span>
              </div>
            </SlackMessage>
          </Appear>
        )}
        <Appear at={60} style={{ marginTop: 26 }}>
          <div style={displayText(40)}>The alert reaches the analysts in Slack.</div>
        </Appear>
      </div>
    </Panel>
  );
}

function Response() {
  const f = useCurrentFrame();
  const approved = f >= 92;
  return (
    <Panel title="# soc-alerts" side={<span>human approval required</span>} style={{ left: 200, top: 84, width: 880, height: 480 }}>
      <div style={{ padding: "4px 30px" }}>
        <SlackMessage who="Analyst">
          <span style={monoText(20, c.ink)}>
            <Typed text="!quarantine host-127" at={4} cps={22} />
          </span>
        </SlackMessage>
        {f >= 34 && (
          <Pop at={34}>
            <SlackMessage who="IR-Bot" bot>
              Containment needs approval from a senior analyst.
              <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 12 }}>
                <span
                  style={{
                    padding: "9px 18px",
                    borderRadius: 8,
                    fontFamily: sans,
                    fontWeight: 600,
                    fontSize: 17,
                    color: approved ? c.onMint : c.mint,
                    background: approved ? c.mint : "transparent",
                    border: `1px solid ${c.mint}`,
                    transform: `scale(${f >= 86 && f < 92 ? 0.94 : 1})`,
                  }}
                >
                  {approved ? "Approved" : "Approve"}
                </span>
                {approved && <span style={monoText(15, c.meta)}>senior analyst · 1:47</span>}
              </div>
            </SlackMessage>
          </Pop>
        )}
        {f >= 104 && (
          <Appear at={104}>
            <div style={{ marginTop: 6, padding: "12px 16px", borderRadius: 10, background: mintA(0.1), ...monoText(17, c.mint) }}>
              PS&gt; quarantine host-127 · network access revoked · 2:05
            </div>
          </Appear>
        )}
      </div>
    </Panel>
  );
}

const audit = `{
  "incident": "IR-2847",
  "host": "host-127",
  "risk": 91,
  "approved_by": "senior analyst",
  "action": "quarantine"
}`;

const timeline = [
  ["0:00", "Alert ingested"],
  ["0:12", "SOC notified"],
  ["1:47", "Analyst approves"],
  ["2:05", "Host quarantined"],
  ["2:08", "Audit logged"],
];

function Result() {
  const f = useCurrentFrame();
  return (
    <>
      <Panel title="IR-2847.json" side={<span style={{ color: c.mint }}>audit trail</span>} style={{ left: 64, top: 84, width: 560, height: 330 }}>
        <div style={{ padding: "18px 24px", ...monoText(18, c.ink), lineHeight: 1.75 }}>
          <Typed text={audit} at={6} cps={90} />
        </div>
      </Panel>
      <div style={{ position: "absolute", left: 690, top: 84, width: 520 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={monoText(15, c.meta)}>timeline</span>
          <Tag tone="blue" size={14}>example run</Tag>
        </div>
        {timeline.map(([t, l], i) => (
          <div key={t} style={{ display: "flex", gap: 22, alignItems: "baseline", height: 58, borderBottom: `1px solid ${whiteA(0.06)}`, opacity: ramp(f, 10 + i * 9) }}>
            <span style={monoText(18, i === 2 ? c.mint : c.meta)}>{t}</span>
            <span style={{ fontFamily: sans, fontSize: 22, color: i === 2 ? c.ink : c.muted }}>{l}</span>
          </div>
        ))}
      </div>
      <Appear at={60} style={{ position: "absolute", left: 64, top: 456 }}>
        <div style={displayText(44)}>Human approval before every containment.</div>
      </Appear>
    </>
  );
}

export const irbotScenes: Scenes = [Threat, Detection, Response, Result];

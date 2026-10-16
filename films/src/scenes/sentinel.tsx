import { useCurrentFrame } from "remotion";
import type { Scenes } from "../CaseFile";
import { Appear, Line, Packet, Panel, Pop, StageNode, Tag, Typed, displayText, monoText, ramp, useProgress } from "../primitives";
import { c, sans, threatA, whiteA } from "../theme";

const ROWS = 8;

function Threat() {
  const f = useCurrentFrame();
  const shown = Math.min(ROWS, Math.max(0, Math.floor((f - 6) / 10) + 1));
  return (
    <>
      <Panel title="SigninLogs · ResultType != 0" side={<Tag tone="meta" size={13}>lab data</Tag>} style={{ left: 64, top: 84, width: 760, height: 470 }}>
        <div style={{ padding: "8px 24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "110px 1fr 190px 110px", height: 40, alignItems: "center", ...monoText(14, c.meta) }}>
            <span>time</span>
            <span>user</span>
            <span>ip</span>
            <span>result</span>
          </div>
          {Array.from({ length: shown }, (_, i) => (
            <div
              key={i}
              style={{
                display: "grid",
                gridTemplateColumns: "110px 1fr 190px 110px",
                height: 44,
                alignItems: "center",
                borderTop: `1px solid ${whiteA(0.05)}`,
                opacity: ramp(f, 6 + i * 10, 6),
                ...monoText(16, c.muted),
              }}
            >
              <span>02:14:{String(3 + i * 4).padStart(2, "0")}</span>
              <span style={{ color: c.ink }}>j.doe@contoso.example</span>
              <span>198.51.100.x</span>
              <span style={{ color: c.threatText }}>failure</span>
            </div>
          ))}
        </div>
      </Panel>
      <Panel title="failed attempts" style={{ left: 864, top: 84, width: 352, height: 260 }}>
        <div style={{ padding: "24px 26px" }}>
          <div style={displayText(96, shown > 5 ? c.threatText : c.ink)}>{shown}</div>
          <div style={{ ...monoText(16, c.meta), marginTop: 8 }}>threshold 5</div>
        </div>
      </Panel>
      {shown > 5 && (
        <Pop at={6 + 5 * 10} style={{ position: "absolute", left: 864, top: 380, width: 352 }}>
          <div style={displayText(34)}>Same account. Same address.</div>
        </Pop>
      )}
    </>
  );
}

const flow = [
  { x: 180, label: "Azure logs", sub: "SigninLogs, AuditLogs" },
  { x: 470, label: "Log Analytics", sub: "ingestion" },
  { x: 760, label: "Analytics rule", sub: "mapped to ATT&CK" },
  { x: 1050, label: "Incident", sub: "triage and assign" },
];

const rule = `SigninLogs
| where ResultType != 0
| summarize FailedAttempts = count()
    by UserPrincipalName, IPAddress
| where FailedAttempts > threshold`;

function Detection() {
  const f = useCurrentFrame();
  const y = 150;
  const fired = useProgress(70, 10);
  return (
    <>
      <Line x1={180} x2={1050} y={y} draw={useProgress(0, 20)} />
      {flow.map((s, i) => (
        <StageNode key={s.label} x={s.x} y={y} label={s.label} sub={s.sub} size={60} lit={ramp(f, 8 + i * 16)} alarm={i === 3 ? fired : 0} />
      ))}
      <Packet x1={180} x2={1050} y={y} at={10} dur={58} color={c.blue} />
      <Panel title="brute-force rule" side={<Tag tone="blue" size={13}>AI-generated, reviewed</Tag>} style={{ left: 64, top: 290, width: 660, height: 270 }}>
        <div style={{ padding: "16px 22px", ...monoText(17, c.ink), lineHeight: 1.7 }}>
          <Typed text={rule} at={14} cps={80} caret={false} />
        </div>
      </Panel>
      {f >= 74 && (
        <Pop at={74} style={{ position: "absolute", left: 770, top: 320, width: 446 }}>
          <Panel title="incident" side={<Tag tone="threat" size={13}>High</Tag>} edge={threatA(0.4)} style={{ position: "relative" }}>
            <div style={{ padding: "20px 22px" }}>
              <div style={displayText(30)}>Brute-force sign-ins</div>
              <div style={{ ...monoText(16), marginTop: 10 }}>j.doe@contoso.example</div>
            </div>
          </Panel>
        </Pop>
      )}
    </>
  );
}

const steps = ["When an incident is created", "Disable the account", "Notify the team"];

function Response() {
  const f = useCurrentFrame();
  return (
    <>
      <div style={{ position: "absolute", left: 300, top: 92, ...monoText(15, c.meta) }}>Logic Apps · response playbook</div>
      {steps.map((s, i) => {
        const at = 10 + i * 30;
        const done = f >= at + 18;
        return (
          <div key={s}>
            {i > 0 && <div style={{ position: "absolute", left: 340, top: 112 + i * 140 - 40, width: 2, height: 40 * ramp(f, at - 8), background: whiteA(0.14) }} />}
            <Appear at={at} x={-20} y={0} style={{ position: "absolute", left: 300, top: 128 + i * 140, width: 680 }}>
              <Panel style={{ position: "relative", padding: "22px 26px", display: "flex", justifyContent: "space-between", alignItems: "center" }} edge={done ? "rgba(152,220,194,0.4)" : undefined}>
                <span style={{ display: "flex", alignItems: "baseline", gap: 18 }}>
                  <span style={monoText(16, c.mint)}>0{i + 1}</span>
                  <span style={displayText(30)}>{s}</span>
                </span>
                {done ? <Tag tone="mint">done</Tag> : <Tag tone="blue">running</Tag>}
              </Panel>
            </Appear>
          </div>
        );
      })}
    </>
  );
}

function Result() {
  return (
    <>
      <Appear at={0} style={{ position: "absolute", left: 120, top: 110 }}>
        <Tag tone="mint" size={20}>Lab complete</Tag>
      </Appear>
      <Appear at={6} y={18} style={{ position: "absolute", left: 120, top: 170, width: 1040 }}>
        <div style={displayText(64)}>Built with AI assistance.</div>
        <div style={{ fontFamily: sans, fontSize: 28, color: c.muted, marginTop: 18, lineHeight: 1.45 }}>
          I reviewed every rule, and I&apos;m learning KQL hands-on so I can write them myself.
        </div>
      </Appear>
      <Appear at={24} style={{ position: "absolute", left: 120, top: 360, display: "flex", gap: 12, flexWrap: "wrap", width: 1040 }}>
        <Tag tone="blue" size={17}>Learning KQL</Tag>
        {["Microsoft Sentinel", "Azure Log Analytics", "Logic Apps", "MITRE ATT&CK"].map((t) => (
          <Tag key={t} tone="meta" size={17}>
            {t}
          </Tag>
        ))}
      </Appear>
    </>
  );
}

export const sentinelScenes: Scenes = [Threat, Detection, Response, Result];

import { useCurrentFrame } from "remotion";
import type { Scenes } from "../CaseFile";
import { Appear, Count, Line, ramp, Packet, Panel, Pop, StageNode, Tag, Typed, displayText, monoText, useProgress } from "../primitives";
import { c, sans, threatA } from "../theme";

const requests: { t: string; kind?: string }[] = [
  { t: "GET /products?id=12  200" },
  { t: "GET /products?id=1' OR '1'='1' --", kind: "SQL injection" },
  { t: "POST /login  200" },
  { t: "GET /search?q=<script>alert(1)</script>", kind: "XSS" },
  { t: "GET /static/app.js  200" },
  { t: "GET /files?name=../../etc/passwd", kind: "Path traversal" },
  { t: "GET /api/items?sort=name  200" },
];

function Threat() {
  const f = useCurrentFrame();
  const attacks = requests.filter((r) => r.kind);
  return (
    <>
      <Panel title="web / access log" side={<span style={{ color: c.mint }}>live</span>} style={{ left: 64, top: 84, width: 740, height: 470 }}>
        <div style={{ padding: "16px 22px" }}>
          {requests.map((r, i) => {
            const at = 6 + i * 13;
            if (f < at) return null;
            return (
              <Appear key={r.t} at={at} dur={8} y={8}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    height: 50,
                    padding: "0 12px",
                    margin: "0 -12px",
                    borderRadius: 8,
                    background: r.kind ? threatA(0.08) : "transparent",
                    ...monoText(17, r.kind ? c.threatText : c.muted),
                  }}
                >
                  <span>{r.t}</span>
                  {r.kind && <Tag tone="threat" size={14}>{r.kind}</Tag>}
                </div>
              </Appear>
            );
          })}
        </div>
      </Panel>
      <div style={{ position: "absolute", left: 846, top: 92, ...monoText(15, c.meta) }}>payloads in the stream</div>
      {attacks.map((a, i) => (
        <Pop key={a.kind} at={6 + requests.indexOf(a) * 13 + 4} style={{ position: "absolute", left: 846, top: 130 + i * 140, width: 370 }}>
          <Panel edge={threatA(0.45)} style={{ position: "relative", padding: "22px 24px" }}>
            <div style={monoText(14, c.threatText)}>attack class 0{i + 1}</div>
            <div style={{ ...displayText(34), marginTop: 8 }}>{a.kind}</div>
          </Panel>
        </Pop>
      ))}
    </>
  );
}

const stages = [
  { x: 190, label: "Traffic collector", sub: "capture and route" },
  { x: 480, label: "Preprocessor", sub: "normalise and parse" },
  { x: 770, label: "Detection engine", sub: "ML + rule-based" },
  { x: 1060, label: "Alert manager", sub: "triage and classify" },
];

function Detection() {
  const f = useCurrentFrame();
  const draw = useProgress(0, 24);
  const y = 230;
  const alarm = useProgress(96, 10);
  return (
    <>
      <Line x1={190} x2={1060} y={y} draw={draw} />
      {stages.map((s, i) => (
        <StageNode key={s.label} x={s.x} y={y} label={s.label} sub={s.sub} lit={ramp(f, 10 + i * 14)} alarm={i >= 2 ? alarm : 0} />
      ))}
      {/* a clean request passes, then the injected one is caught at the engine */}
      <Packet x1={190} x2={1060} y={y} at={14} dur={46} color={c.mint} />
      <Packet x1={190} x2={770} y={y} at={64} dur={32} color={c.threat} />
      {f >= 100 && (
        <Pop at={100} style={{ position: "absolute", left: 470, top: 360, width: 600 }}>
          <Panel title="verdict" side={<Tag tone="threat" size={14}>flagged</Tag>} edge={threatA(0.4)} style={{ position: "relative" }}>
            <div style={{ padding: "18px 22px" }}>
              <div style={monoText(17, c.threatText)}>GET /products?id=1&apos; OR &apos;1&apos;=&apos;1&apos; --</div>
              <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
                <Tag tone="threat">SQL injection</Tag>
                <Tag tone="blue">machine learning + rules</Tag>
              </div>
            </div>
          </Panel>
        </Pop>
      )}
    </>
  );
}


function Response() {
  const f = useCurrentFrame();
  const blocked = f >= 70;
  return (
    <>
      <Panel title="alert manager" side={<span>1 open</span>} style={{ left: 64, top: 84, width: 610, height: 280 }}>
        <div style={{ padding: "22px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Tag tone="threat">High</Tag>
            <span style={displayText(28)}>SQL injection</span>
          </div>
          <div style={{ ...monoText(17), marginTop: 18, lineHeight: 1.9 }}>
            <div>source  203.0.113.x</div>
            <div>target  /products</div>
          </div>
          <div style={{ marginTop: 18 }}>{blocked ? <Tag tone="mint">Blocked</Tag> : <Tag tone="blue">Triage</Tag>}</div>
        </div>
      </Panel>
      <Panel title="ip blocklist" side={<span style={{ color: c.mint }}>automated</span>} style={{ left: 714, top: 84, width: 500, height: 280 }}>
        <div style={{ padding: "22px 24px", ...monoText(18, c.ink), lineHeight: 2 }}>
          {f >= 44 && (
            <div>
              <Typed text="203.0.113.x  blocked" at={44} cps={30} style={{ color: c.mint }} />
            </div>
          )}
        </div>
      </Panel>
      <Appear at={78} style={{ position: "absolute", left: 64, top: 410 }}>
        <div style={displayText(52)}>Automated IP blocking</div>
        <div style={{ fontFamily: sans, fontSize: 22, color: c.muted, marginTop: 10 }}>The source is cut off and the alert dashboard records the block.</div>
      </Appear>
    </>
  );
}

const metrics = [
  { to: 96.8, decimals: 1, suffix: "%", label: "Detection accuracy", color: c.mint },
  { to: 2.3, decimals: 1, suffix: "%", label: "False positive rate", color: c.ink },
  { to: 340, decimals: 0, suffix: " ms", label: "Detection latency", color: c.ink },
  { to: 15, decimals: 0, suffix: "K/s", label: "Event throughput", color: c.blueText },
];

function Result() {
  return (
    <>
      <Appear at={0} style={{ position: "absolute", left: 0, right: 0, top: 100, display: "flex", justifyContent: "center" }}>
        <Tag tone="blue" size={18}>in project testing</Tag>
      </Appear>
      <div style={{ position: "absolute", left: 64, right: 64, top: 190, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
        {metrics.map((m, i) => (
          <Appear key={m.label} at={6 + i * 6}>
            <Panel style={{ position: "relative", padding: "30px 26px", height: 200 }}>
              <Count to={m.to} decimals={m.decimals} suffix={m.suffix} at={8 + i * 6} dur={45} style={displayText(62, m.color)} />
              <div style={{ fontFamily: sans, fontSize: 20, color: c.muted, marginTop: 18 }}>{m.label}</div>
            </Panel>
          </Appear>
        ))}
      </div>
      <Appear at={40} style={{ position: "absolute", left: 64, right: 64, top: 440, textAlign: "center", ...monoText(17, c.meta) }}>
        Figures from project evaluation and testing, not production guarantees.
      </Appear>
    </>
  );
}

export const qurikScenes: Scenes = [Threat, Detection, Response, Result];

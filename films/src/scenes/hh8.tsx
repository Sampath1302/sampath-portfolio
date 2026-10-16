import { useCurrentFrame } from "remotion";
import type { Scenes } from "../CaseFile";
import { Appear, Count, Panel, Pop, Tag, Typed, displayText, monoText, ramp } from "../primitives";
import { c, mintA, sans, threatA, whiteA } from "../theme";

const headers = [
  { name: "Content-Security-Policy", ok: false },
  { name: "Strict-Transport-Security", ok: false },
  { name: "X-Frame-Options", ok: false },
  { name: "X-Content-Type-Options", ok: false },
  { name: "Referrer-Policy", ok: true },
];

function Threat() {
  const f = useCurrentFrame();
  return (
    <>
      <Panel title="response headers · example.com" side={<Tag tone="meta" size={13}>example target</Tag>} style={{ left: 64, top: 84, width: 680, height: 420 }}>
        <div style={{ padding: "14px 24px" }}>
          {headers.map((h, i) =>
            f >= 8 + i * 12 ? (
              <Appear key={h.name} at={8 + i * 12} dur={8} y={6}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: 62, borderBottom: `1px solid ${whiteA(0.05)}` }}>
                  <span style={monoText(19, h.ok ? c.muted : c.ink)}>{h.name}</span>
                  {h.ok ? <Tag tone="mint" size={14}>present</Tag> : <Tag tone="threat" size={14}>missing</Tag>}
                </div>
              </Appear>
            ) : null
          )}
        </div>
      </Panel>
      <Panel title="endpoints" style={{ left: 784, top: 84, width: 432, height: 260 }}>
        <div style={{ padding: "14px 24px" }}>
          {["/admin", "/backup"].map((e, i) =>
            f >= 60 + i * 14 ? (
              <Pop key={e} at={60 + i * 14}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: 70 }}>
                  <span style={monoText(22, c.threatText)}>{e}</span>
                  <Tag tone="threat" size={14}>exposed</Tag>
                </div>
              </Pop>
            ) : null
          )}
        </div>
      </Panel>
      <Appear at={92} style={{ position: "absolute", left: 784, top: 380, width: 432 }}>
        <div style={displayText(36)}>Shipped without the basics.</div>
      </Appear>
    </>
  );
}

// Breadth-first: the tree fills in one level at a time
const level1 = ["/", "/about", "/login", "/api"];
const level2 = ["/team", "/careers", "/reset", "/signup", "/api/items", "/api/users", "/sitemap.xml", "/robots.txt"];
const checks = ["Headers vs OWASP", "SQL injection", "XSS", "SSRF", "LFI"];

function Detection() {
  const f = useCurrentFrame();
  const cx = 400;
  const node = (x: number, y: number, label: string, at: number, root = false) => (
    <div
      key={label + y}
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: "translate(-50%, -50%)",
        opacity: ramp(f, at),
        padding: root ? "10px 18px" : "7px 12px",
        borderRadius: 10,
        border: `1px solid ${root ? mintA(0.5) : whiteA(0.12)}`,
        background: root ? mintA(0.1) : whiteA(0.03),
        whiteSpace: "nowrap",
        ...monoText(root ? 18 : 14, root ? c.mint : c.muted),
      }}
    >
      {label}
    </div>
  );
  const edge = (x1: number, y1: number, x2: number, y2: number, at: number, k: string) => {
    const len = Math.hypot(x2 - x1, y2 - y1);
    const ang = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
    return (
      <div key={k} style={{ position: "absolute", left: x1, top: y1, width: len * ramp(f, at, 12), height: 1, background: whiteA(0.16), transform: `rotate(${ang}deg)`, transformOrigin: "0 0" }} />
    );
  };
  const l1x = (i: number) => cx - 270 + i * 180;
  const l2x = (i: number) => cx - 330 + i * 94;
  return (
    <>
      <div style={{ position: "absolute", left: 64, top: 92, ...monoText(15, c.meta) }}>crawl · breadth-first</div>
      {level1.map((_, i) => edge(cx, 150, l1x(i), 270, 8, `e1${i}`))}
      {level2.map((_, i) => edge(l1x(Math.floor(i / 2)), 270, l2x(i), 400, 30, `e2${i}`))}
      {node(cx, 150, "example.com", 0, true)}
      {level1.map((l, i) => node(l1x(i), 270, l, 14 + i * 3))}
      {level2.map((l, i) => node(l2x(i), 400 + (i % 2) * 52, l, 36 + i * 3))}
      <Panel title="checks" side={<span><Count to={47} at={10} dur={70} style={{ color: c.ink }} /> URLs</span>} style={{ left: 820, top: 84, width: 396, height: 420 }}>
        <div style={{ padding: "10px 22px" }}>
          {checks.map((ck, i) => {
            const done = f >= 60 + i * 12;
            return (
              <div key={ck} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: 62, borderBottom: `1px solid ${whiteA(0.05)}` }}>
                <span style={{ fontFamily: sans, fontSize: 20, color: done ? c.ink : c.meta }}>{ck}</span>
                {done ? <Tag tone="mint" size={14}>checked</Tag> : <Tag tone="meta" size={14}>queued</Tag>}
              </div>
            );
          })}
        </div>
      </Panel>
    </>
  );
}

const report = `{
  "target": "example.com",
  "urls_discovered": 47,
  "missing_headers": 4,
  "high": 3,
  "report": "hh8-scan-2026.pdf"
}`;

function Response() {
  const f = useCurrentFrame();
  const bars = [0.9, 0.7, 0.82, 0.55, 0.76, 0.64, 0.88, 0.5];
  return (
    <>
      <Panel style={{ left: 120, top: 84, width: 430, height: 470, background: "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.025))" }}>
        <div style={{ padding: "28px 30px" }}>
          <div style={monoText(15, c.meta)}>hh8-scan-2026.pdf</div>
          <div style={{ ...displayText(32), marginTop: 12 }}>Scan report</div>
          <div style={{ display: "flex", gap: 8, marginTop: 16, opacity: ramp(f, 20) }}>
            <Tag tone="threat" size={14}>High 3</Tag>
            <Tag tone="blue" size={14}>Headers 4</Tag>
          </div>
          <div style={{ marginTop: 26 }}>
            {bars.map((w, i) => (
              <div key={i} style={{ height: 10, borderRadius: 5, marginBottom: 16, width: `${w * 100 * ramp(f, 26 + i * 6, 14)}%`, background: i % 4 === 0 ? threatA(0.35) : whiteA(0.1) }} />
            ))}
          </div>
        </div>
      </Panel>
      <Panel title="report.json" side={<span style={{ color: c.mint }}>written</span>} style={{ left: 600, top: 84, width: 560, height: 330 }}>
        <div style={{ padding: "20px 24px", ...monoText(18, c.ink), lineHeight: 1.75 }}>
          <Typed text={report} at={10} cps={70} />
        </div>
      </Panel>
      <Appear at={84} style={{ position: "absolute", left: 600, top: 448 }}>
        <div style={displayText(40)}>PDF and JSON, every finding.</div>
      </Appear>
    </>
  );
}

const numbers = [
  { to: 47, label: "Endpoints discovered", color: c.blueText },
  { to: 4, label: "Critical headers missing", color: c.threatText },
  { to: 3, label: "High findings", color: c.threatText },
];

function Result() {
  return (
    <>
      <Appear at={0} style={{ position: "absolute", left: 0, right: 0, top: 100, display: "flex", justifyContent: "center" }}>
        <Tag tone="blue" size={18}>example test run</Tag>
      </Appear>
      <div style={{ position: "absolute", left: 120, right: 120, top: 190, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 22 }}>
        {numbers.map((n, i) => (
          <Appear key={n.label} at={6 + i * 6}>
            <Panel style={{ position: "relative", padding: "30px 30px", height: 200 }}>
              <Count to={n.to} at={8 + i * 6} dur={40} style={displayText(84, n.color)} />
              <div style={{ fontFamily: sans, fontSize: 21, color: c.muted, marginTop: 12 }}>{n.label}</div>
            </Panel>
          </Appear>
        ))}
      </div>
      <Appear at={40} style={{ position: "absolute", left: 64, right: 64, top: 440, textAlign: "center", ...monoText(17, c.meta) }}>
        Built during my HackerHub8 internship · Python, Requests, BeautifulSoup4, FPDF
      </Appear>
    </>
  );
}

export const hh8Scenes: Scenes = [Threat, Detection, Response, Result];

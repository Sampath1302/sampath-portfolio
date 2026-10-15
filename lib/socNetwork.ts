/**
 * Background "live SOC" network, drawn on a 2D canvas.
 * Nodes drift and link to near neighbours; every few seconds an amber alert
 * travels a link to a node, which is then resolved (teal) and fades back.
 *
 * Contrast budget: muted text (#8B98AA) must stay at 4.5:1 or better over any
 * pixel this draws. Bright marks never overlap each other (alerts avoid
 * resolved nodes, the ring sits outside the dot), so the worst pixel is one
 * mark over three crossing links; scripts/check-background-contrast.mjs
 * asserts it.
 */

const NIGHT = [14, 20, 28];
const LINE = "139,152,170"; // muted
const AMBER = "240,180,60"; // signal
const TEAL = "79,195,161"; // resolved
const ALERT_ALPHA = 0.1;
const RESOLVED_ALPHA = 0.1;
const NODE_ALPHA = 0.12;
const LINK_ALPHA = 0.03;

const PULSE_MS = 1200; // alert travelling along a link
const RING_MS = 700; // node acknowledges the alert
const HOLD_MS = 4000; // node stays resolved
const FADE_MS = 2000; // resolved node fades back to idle

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  /** ms timestamp the alert reached this node; 0 when idle */
  hit: number;
}

interface Pulse {
  from: Node;
  to: Node;
  start: number;
}

export interface NetworkOptions {
  /** Draw one still frame and stop (reduced motion, low-end devices) */
  still: boolean;
}

export function startNetwork(canvas: HTMLCanvasElement, { still }: NetworkOptions): () => void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return () => {};

  let width = 0;
  let height = 0;
  let linkDist = 170;
  let nodes: Node[] = [];
  let pulse: Pulse | null = null;
  let nextPulse = 0;
  let raf = 0;
  let last = 0;
  const mouse = { x: -1e4, y: -1e4 };

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const prevW = width || window.innerWidth;
    const prevH = height || window.innerHeight;
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    linkDist = width < 768 ? 130 : 170;
    // about 70 nodes on a 1440x900 screen, fewer on phones
    const count = Math.round(Math.min(90, Math.max(24, (width * height) / 18500)));
    if (nodes.length === 0) {
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 12,
        vy: (Math.random() - 0.5) * 12,
        hit: 0,
      }));
    } else {
      for (const n of nodes) {
        n.x *= width / prevW;
        n.y *= height / prevH;
      }
      nodes = nodes.slice(0, count);
    }
  };

  // marks must not stack: the path keeps clear of every other node (more room around resolved ones)
  const clearPath = (a: Node, b: Node) =>
    nodes.every((n) => {
      if (n === a || n === b) return true;
      // distance from n to segment ab, with room for drift during the pulse
      const lx = b.x - a.x;
      const ly = b.y - a.y;
      const t = Math.max(0, Math.min(1, ((n.x - a.x) * lx + (n.y - a.y) * ly) / (lx * lx + ly * ly || 1)));
      return Math.hypot(n.x - (a.x + lx * t), n.y - (a.y + ly * t)) > (n.hit ? 30 : 10);
    });

  const neighbour = (from: Node): Node | null => {
    if (from.hit) return null;
    const near = nodes.filter(
      (n) => n !== from && n.hit === 0 && Math.hypot(n.x - from.x, n.y - from.y) < linkDist && clearPath(from, n)
    );
    return near.length ? near[Math.floor(Math.random() * near.length)] : null;
  };

  const update = (dt: number, now: number) => {
    const s = dt / 1000;
    for (const n of nodes) {
      // ease away from the pointer
      const dx = n.x - mouse.x;
      const dy = n.y - mouse.y;
      const d = Math.hypot(dx, dy);
      if (d < 140 && d > 0.1) {
        const push = (1 - d / 140) * 60 * s;
        n.vx += (dx / d) * push;
        n.vy += (dy / d) * push;
      }
      // drift back to a slow cruising speed
      const speed = Math.hypot(n.vx, n.vy);
      if (speed > 8) {
        n.vx *= 1 - 1.5 * s;
        n.vy *= 1 - 1.5 * s;
      }
      n.x += n.vx * s;
      n.y += n.vy * s;
      if (n.x < -20) n.x = width + 20;
      if (n.x > width + 20) n.x = -20;
      if (n.y < -20) n.y = height + 20;
      if (n.y > height + 20) n.y = -20;
      if (n.hit && now - n.hit > RING_MS + HOLD_MS + FADE_MS) n.hit = 0;
    }

    if (pulse && now - pulse.start >= PULSE_MS) {
      pulse.to.hit = now;
      pulse = null;
    }
    if (!pulse && now >= nextPulse) {
      const from = nodes[Math.floor(Math.random() * nodes.length)];
      const to = neighbour(from);
      if (to) pulse = { from, to, start: now };
      nextPulse = now + 3500 + Math.random() * 1500;
    }
  };

  const draw = (now: number) => {
    ctx.clearRect(0, 0, width, height);
    ctx.lineWidth = 1;
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d >= linkDist) continue;
        ctx.strokeStyle = `rgba(${LINE},${(1 - d / linkDist) * LINK_ALPHA})`;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }

    for (const n of nodes) {
      if (!n.hit) {
        // the alert covers its own endpoints while it travels
        if (pulse && (n === pulse.from || n === pulse.to)) continue;
        ctx.fillStyle = `rgba(${LINE},${NODE_ALPHA})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, 1.6, 0, Math.PI * 2);
        ctx.fill();
        continue;
      }
      const t = now - n.hit;
      if (t < RING_MS) {
        // amber ring widens as the alert lands, then the node turns teal
        const p = t / RING_MS;
        ctx.strokeStyle = `rgba(${AMBER},${ALERT_ALPHA * (1 - p)})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, 5.5 + p * 10, 0, Math.PI * 2);
        ctx.stroke();
      }
      const fade = t < RING_MS ? t / RING_MS : t < RING_MS + HOLD_MS ? 1 : 1 - (t - RING_MS - HOLD_MS) / FADE_MS;
      ctx.fillStyle = `rgba(${TEAL},${RESOLVED_ALPHA * Math.max(0, fade)})`;
      ctx.beginPath();
      ctx.arc(n.x, n.y, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    if (pulse) {
      const p = Math.min(1, (now - pulse.start) / PULSE_MS);
      const e = 1 - Math.pow(1 - p, 3);
      const x = pulse.from.x + (pulse.to.x - pulse.from.x) * e;
      const y = pulse.from.y + (pulse.to.y - pulse.from.y) * e;
      const len = Math.hypot(x - pulse.from.x, y - pulse.from.y);
      if (len > 5) {
        const k = (len - 4) / len;
        ctx.strokeStyle = `rgba(${AMBER},${ALERT_ALPHA * 0.7})`;
        ctx.beginPath();
        ctx.moveTo(pulse.from.x, pulse.from.y);
        ctx.lineTo(pulse.from.x + (x - pulse.from.x) * k, pulse.from.y + (y - pulse.from.y) * k);
        ctx.stroke();
      }
      ctx.fillStyle = `rgba(${AMBER},${ALERT_ALPHA})`;
      ctx.beginPath();
      ctx.arc(x, y, 2.6, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const frame = (now: number) => {
    update(Math.min(50, now - (last || now)), now);
    last = now;
    draw(now);
    raf = requestAnimationFrame(frame);
  };
  const play = () => {
    if (!raf && !document.hidden) {
      last = 0;
      raf = requestAnimationFrame(frame);
    }
  };
  const pause = () => {
    cancelAnimationFrame(raf);
    raf = 0;
  };

  const drawStill = () => {
    // a calm snapshot: two cases already resolved, nothing moving
    const now = performance.now();
    nodes.slice(0, 2).forEach((n) => (n.hit = now - RING_MS - 1));
    draw(now);
  };

  resize();
  const onResize = () => {
    resize();
    if (still) drawStill();
  };
  window.addEventListener("resize", onResize);

  if (still) {
    drawStill();
    return () => window.removeEventListener("resize", onResize);
  }

  const onPointer = (e: PointerEvent) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  };
  const onLeave = () => {
    mouse.x = mouse.y = -1e4;
  };
  const onVisibility = () => (document.hidden ? pause() : play());
  const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? play() : pause()));

  if (window.matchMedia("(pointer: fine)").matches) {
    window.addEventListener("pointermove", onPointer, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
  }
  document.addEventListener("visibilitychange", onVisibility);
  io.observe(canvas);
  nextPulse = performance.now() + 1200;
  play();

  return () => {
    pause();
    io.disconnect();
    window.removeEventListener("resize", onResize);
    window.removeEventListener("pointermove", onPointer);
    document.documentElement.removeEventListener("pointerleave", onLeave);
    document.removeEventListener("visibilitychange", onVisibility);
  };
}

/** WCAG contrast of muted text over the brightest pixel the network draws; used by the self-check. */
export function worstTextContrast(): number {
  const lum = (rgb: number[]) => {
    const [r, g, b] = rgb.map((v) => {
      const c = v / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const over = (under: number[], color: string, alpha: number) =>
    color.split(",").map((v, i) => under[i] + (Number(v) - under[i]) * alpha);
  // worst pixel: three links crossing, with one mark on top
  const links = over(over(over(NIGHT, LINE, LINK_ALPHA), LINE, LINK_ALPHA), LINE, LINK_ALPHA);
  const marks: [string, number][] = [
    [LINE, NODE_ALPHA],
    [TEAL, RESOLVED_ALPHA],
    [AMBER, ALERT_ALPHA],
  ];
  const brightest = Math.max(...marks.map(([color, alpha]) => lum(over(links, color, alpha))));
  return (lum([139, 152, 170]) + 0.05) / (brightest + 0.05);
}

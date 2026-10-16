// Checks that hero text stays readable over the animated SOC wall.
// Usage: npm run build && npx next start -p 3200, then node scripts/check-hero-contrast.mjs [url]
// For each viewport it samples several moments of the wall's loop, hides the text,
// screenshots, and measures every text element against the darkest and lightest pixels behind it.
import puppeteer from "puppeteer";

const url = process.argv[2] ?? "http://localhost:3200/";
const viewports = [
  { width: 1440, height: 900 },
  { width: 390, height: 844 },
];
const FRAMES = 8;

const lin = (c) => ((c /= 255) <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const lum = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const ratio = (a, b) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};
const blend = ([r, g, b, a], bg) => [r * a + bg[0] * (1 - a), g * a + bg[1] * (1 - a), b * a + bg[2] * (1 - a)];

// self-check of the maths: white on black is 21:1, #858c98 on #101318 is about 5.4:1
console.assert(Math.abs(ratio([255, 255, 255], [0, 0, 0]) - 21) < 0.01, "contrast formula");

const browser = await puppeteer.launch();
let failed = false;
for (const vp of viewports) {
  const page = await browser.newPage();
  await page.setViewport(vp);
  await page.goto(url, { waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 4500)); // let the intro finish

  // every element in the hero that directly holds text, with its colour and size
  const targets = await page.evaluate(() => {
    const hero = document.querySelector("section[aria-labelledby=hero-title]");
    const out = [];
    const walker = document.createTreeWalker(hero, NodeFilter.SHOW_TEXT);
    const seen = new Set();
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      const el = n.parentElement;
      if (!n.textContent.trim() || seen.has(el) || el.closest("[aria-hidden=true], .sr-only")) continue;
      seen.add(el);
      // measure the glyphs' own box, not padding, rounded corners or sibling icons
      const range = document.createRange();
      range.selectNodeContents(n);
      const r = range.getBoundingClientRect();
      if (!r.width || r.bottom < 0 || r.top > innerHeight) continue;
      const cs = getComputedStyle(el);
      let color = el instanceof SVGElement ? cs.fill : cs.color;
      const metal = el.closest(".metal");
      if (metal) {
        // gradient text: use the gradient's colour at this line's bottom edge (its darkest point)
        const m = metal.getBoundingClientRect();
        const t = Math.min(1, (r.bottom - m.top) / m.height);
        const mix = (a, b, k) => a.map((v, i) => Math.round(v + (b[i] - v) * k));
        const c = t <= 0.55 ? mix([255, 255, 255], [226, 228, 232], t / 0.55) : mix([226, 228, 232], [143, 150, 163], (t - 0.55) / 0.45);
        color = `rgb(${c.join(", ")})`;
      }
      const size = parseFloat(cs.fontSize);
      const large = size >= 24 || (size >= 18.66 && Number(cs.fontWeight) >= 700);
      out.push({
        text: n.textContent.trim().slice(0, 40),
        color,
        large,
        box: { x: Math.max(0, r.x), y: Math.max(0, r.y), w: Math.min(r.width, innerWidth - r.x), h: Math.min(r.height, innerHeight - r.y) },
      });
    }
    return out;
  });

  await page.addStyleTag({
    content: "section[aria-labelledby=hero-title] *{color:transparent!important;-webkit-text-fill-color:transparent!important;caret-color:transparent!important}section[aria-labelledby=hero-title] text{fill:transparent!important}.metal{background:none!important}.caret{visibility:hidden}",
  });

  const worst = new Map();
  for (let f = 0; f < FRAMES; f++) {
    const shot = await page.screenshot({ encoding: "base64" });
    const samples = await page.evaluate(
      async (src, targets) => {
        const img = new Image();
        img.src = "data:image/png;base64," + src;
        await img.decode();
        const c = new OffscreenCanvas(img.width, img.height);
        const ctx = c.getContext("2d");
        ctx.drawImage(img, 0, 0);
        const dpr = img.width / innerWidth;
        return targets.map(({ box }) => {
          const d = ctx.getImageData(box.x * dpr, box.y * dpr, Math.max(1, box.w * dpr), Math.max(1, box.h * dpr)).data;
          let lo = [255, 255, 255], hi = [0, 0, 0], loS = 1e9, hiS = -1;
          for (let i = 0; i < d.length; i += 4) {
            const s = d[i] * 0.2126 + d[i + 1] * 0.7152 + d[i + 2] * 0.0722;
            if (s < loS) [loS, lo] = [s, [d[i], d[i + 1], d[i + 2]]];
            if (s > hiS) [hiS, hi] = [s, [d[i], d[i + 1], d[i + 2]]];
          }
          return [lo, hi];
        });
      },
      shot,
      targets
    );
    targets.forEach((t, i) => {
      const m = t.color.match(/[\d.]+/g).map(Number);
      const fg = [m[0], m[1], m[2], m[3] ?? 1];
      for (const bg of samples[i]) {
        const r = ratio(blend(fg, bg), bg);
        if (!worst.has(i) || r < worst.get(i).r) worst.set(i, { r, bg });
      }
    });
    await new Promise((r) => setTimeout(r, 1300));
  }

  const rows = targets.map((t, i) => ({ ...t, ratio: worst.get(i).r, bg: worst.get(i).bg, need: t.large ? 3 : 4.5 }));
  const fails = rows.filter((r) => r.ratio < r.need);
  const min = rows.reduce((a, b) => (b.ratio / b.need < a.ratio / a.need ? b : a));
  console.log(`${vp.width}px: ${rows.length} text elements, ${FRAMES} frames. Tightest: "${min.text}" ${min.ratio.toFixed(2)}:1 (needs ${min.need}:1)`);
  for (const f of fails) console.log(`  FAIL "${f.text}" ${f.ratio.toFixed(2)}:1 < ${f.need}:1 (${f.color} over rgb(${f.bg.join(", ")}))`);
  failed ||= fails.length > 0;
  await page.close();
}
await browser.close();
process.exit(failed ? 1 : 0);

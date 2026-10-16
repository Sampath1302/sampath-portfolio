// Renders every case file film. Usage: npm run render [-- <slug>]
// Site files go to public/media/films/, LinkedIn squares to exports/ (gitignored).
import { bundle } from "@remotion/bundler";
import { renderMedia, renderStill, selectComposition } from "@remotion/renderer";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const site = path.join(here, "../public/media/films");
const exportsDir = path.join(here, "../exports");
const only = process.argv[2];
const slugs = ["qurik", "hh8-scanner", "azure-sentinel", "ir-bot"].filter((s) => !only || s === only);

await mkdir(site, { recursive: true });
await mkdir(exportsDir, { recursive: true });
const serveUrl = await bundle({ entryPoint: path.join(here, "src/index.ts") });

const POSTER_FRAME = 54; // the title card, fully in
const jobs = [];
for (const slug of slugs) {
  const wide = await selectComposition({ serveUrl, id: `${slug}-wide` });
  const square = await selectComposition({ serveUrl, id: `${slug}-square` });
  jobs.push(
    ["poster", () => renderStill({ serveUrl, composition: wide, frame: POSTER_FRAME, output: `${site}/${slug}-poster.jpg`, imageFormat: "jpeg", jpegQuality: 82 })],
    ["mp4", () => renderMedia({ serveUrl, composition: wide, codec: "h264", crf: 23, colorSpace: "bt709", x264Preset: "slow", outputLocation: `${site}/${slug}.mp4` })],
    ["webm", () => renderMedia({ serveUrl, composition: wide, codec: "vp9", crf: 34, colorSpace: "bt709", outputLocation: `${site}/${slug}.webm` })],
    ["square", () => renderMedia({ serveUrl, composition: square, codec: "h264", crf: 20, colorSpace: "bt709", outputLocation: `${exportsDir}/${slug}-1080.mp4` })]
  );
  for (const [kind, run] of jobs.splice(0)) {
    const t = Date.now();
    await run();
    console.log(`${slug} ${kind} done in ${((Date.now() - t) / 1000).toFixed(0)}s`);
  }
}

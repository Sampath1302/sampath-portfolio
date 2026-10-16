// Renders review stills (title, late in each chapter, end card) for every film.
// Usage: node stills.mjs <output-dir> [wide|square]
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const [out, format = "wide"] = process.argv.slice(2);
const serveUrl = await bundle({ entryPoint: path.join(here, "src/index.ts") });
const frames = [54, 200, 360, 525, 650, 770];
for (const slug of ["qurik", "hh8-scanner", "azure-sentinel", "ir-bot"]) {
  const composition = await selectComposition({ serveUrl, id: `${slug}-${format}` });
  for (const frame of frames) {
    await renderStill({ serveUrl, composition, frame, output: path.join(out, `${slug}-${format}-${frame}.png`) });
  }
  console.log(slug, "done");
}

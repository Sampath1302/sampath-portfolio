// Self-check: the background network must keep muted text at WCAG AA (4.5:1) over its brightest pixel.
// Run with `node scripts/check-background-contrast.mjs` (Node 22.18+ runs the .ts import directly).
import assert from "node:assert/strict";
import { worstTextContrast } from "../lib/socNetwork.ts";

const ratio = worstTextContrast();
assert.ok(ratio >= 4.5, `muted text over the background drops to ${ratio.toFixed(2)}:1`);
console.log(`background contrast ok: muted text stays at ${ratio.toFixed(2)}:1 or better`);

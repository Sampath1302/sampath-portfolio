import { loadFont as loadChakra } from "@remotion/google-fonts/ChakraPetch";
import { loadFont as loadPlex } from "@remotion/google-fonts/IBMPlexSans";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";

// Same fonts and palette as the site (app/globals.css)
export const display = loadChakra("normal", { weights: ["500", "600", "700"], subsets: ["latin"] }).fontFamily;
export const sans = loadPlex("normal", { weights: ["400", "500", "600"], subsets: ["latin"] }).fontFamily;
export const mono = loadMono("normal", { weights: ["400", "500"], subsets: ["latin"] }).fontFamily;

export const c = {
  bg: "#101318",
  surface: "#161a21",
  ink: "#eceef2",
  muted: "#aeb4bf",
  meta: "#858c98",
  dim: "#5e6673",
  mint: "#98dcc2",
  mintHi: "#c4eedd",
  onMint: "#0e2219",
  blue: "#82a6e6",
  blueText: "#aec5f0",
  threat: "#e5604f",
  threatText: "#f3afa5",
  hair: "rgba(255,255,255,0.07)",
  hairStrong: "rgba(255,255,255,0.12)",
};

export const mintA = (a: number) => `rgba(152,220,194,${a})`;
export const blueA = (a: number) => `rgba(130,166,230,${a})`;
export const threatA = (a: number) => `rgba(229,96,79,${a})`;
export const whiteA = (a: number) => `rgba(255,255,255,${a})`;

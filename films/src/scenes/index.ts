import type { Scenes } from "../CaseFile";
import { qurikScenes } from "./qurik";
import { hh8Scenes } from "./hh8";
import { sentinelScenes } from "./sentinel";
import { irbotScenes } from "./irbot";

export const scenesFor: Record<string, Scenes> = {
  qurik: qurikScenes,
  "hh8-scanner": hh8Scenes,
  "azure-sentinel": sentinelScenes,
  "ir-bot": irbotScenes,
};

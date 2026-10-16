import type { ReactNode } from "react";
import { projectMetadata } from "@/lib/projectMetadata";

export const metadata = projectMetadata("azure-sentinel");

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}

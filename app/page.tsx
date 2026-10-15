import Hero from "@/components/sections/Hero";
import Capabilities from "@/components/sections/Capabilities";
import CaseFiles from "@/components/sections/CaseFiles";
import Experience from "@/components/sections/Experience";
import Certifications from "@/components/sections/Certifications";
import Achievements from "@/components/sections/Achievements";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <main id="main" className="mx-auto max-w-[1120px] px-5 sm:px-8">
      <Hero />
      <Capabilities />
      <CaseFiles />
      <Experience />
      <Certifications />
      <Achievements />
      <Contact />
    </main>
  );
}

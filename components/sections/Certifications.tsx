import { certifications } from "@/lib/content";
import SectionHeading from "@/components/ui/SectionHeading";
import StatusTag from "@/components/ui/StatusTag";

export default function Certifications() {
  const heldCount = certifications.filter((c) => c.status === "held").length;

  return (
    <section aria-labelledby="certifications" className="py-16 lg:py-20">
      <div className="grid gap-10 lg:grid-cols-12">
        <SectionHeading id="certifications" label="05 / certifications" title="Certifications">
          {heldCount} held, {certifications.length - heldCount} in progress.
        </SectionHeading>

        <div className="glass rounded-[20px] px-5 py-2 sm:px-7 sm:py-4 lg:col-span-8">
          <table className="w-full border-collapse text-left">
            <thead className="sr-only sm:not-sr-only">
              <tr className="border-b border-white/[0.06] font-mono text-[0.75rem] text-meta">
                <th scope="col" className="pb-2.5 pr-4 font-normal">Certification</th>
                <th scope="col" className="pb-2.5 pr-4 font-normal">Issuer</th>
                <th scope="col" className="pb-2.5 pr-4 font-normal">Credential ID</th>
                <th scope="col" className="pb-2.5 font-normal">Status</th>
              </tr>
            </thead>
            <tbody>
              {certifications.map((c, i) => (
                <tr
                  key={c.title}
                  className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-0.5 border-b border-white/[0.06] py-3 last:border-b-0 sm:table-row sm:py-0"
                >
                  <th scope="row" className="font-normal sm:py-4 sm:pr-4">
                    <span className="font-medium text-ink">{c.title}</span>
                    {c.short && <span className="ml-2 font-mono text-[0.75rem] text-meta">{c.short}</span>}
                  </th>
                  <td className="order-3 col-span-2 text-[0.9375rem] text-muted sm:order-none sm:py-4 sm:pr-4">
                    {c.issuer}
                    {c.date && <span>, {c.date}</span>}
                    {c.note && <span className="block text-[0.8125rem] text-meta">{c.note}</span>}
                  </td>
                  <td className="order-4 col-span-2 font-mono text-xs text-meta sm:order-none sm:py-4 sm:pr-4">
                    {c.credentialId ?? <span className="hidden sm:inline">–</span>}
                  </td>
                  <td className="row-start-1 col-start-2 sm:py-4">
                    <StatusTag
                      label={c.status === "held" ? "Held" : "In progress"}
                      tone={c.status === "held" ? "mint" : "blue"}
                      enterIndex={i}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

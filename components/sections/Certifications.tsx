import { certifications } from "@/lib/content";
import SectionHeading from "@/components/ui/SectionHeading";
import StatusTag from "@/components/ui/StatusTag";

export default function Certifications() {
  const heldCount = certifications.filter((c) => c.status === "held").length;

  return (
    <section aria-labelledby="certifications" className="border-t border-line py-20 lg:py-28">
      <div className="grid gap-10 lg:grid-cols-12">
        <SectionHeading id="certifications" title="Certifications">
          {heldCount} held, {certifications.length - heldCount} in progress.
        </SectionHeading>

        <div className="lg:col-span-8">
          <table className="w-full border-collapse text-left">
            <thead className="sr-only sm:not-sr-only">
              <tr className="border-b border-line text-[0.8125rem] text-muted">
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
                  className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-0.5 border-b border-line py-3 sm:table-row sm:py-0"
                >
                  <th scope="row" className="font-normal sm:py-4 sm:pr-4">
                    <span className="font-medium text-ink">{c.title}</span>
                    {c.short && <span className="ml-2 text-sm text-muted">{c.short}</span>}
                  </th>
                  <td className="order-3 col-span-2 text-[0.9375rem] text-muted sm:order-none sm:py-4 sm:pr-4">
                    {c.issuer}
                    {c.note && <span>, {c.note}</span>}
                  </td>
                  <td className="order-4 col-span-2 font-mono text-xs text-muted sm:order-none sm:py-4 sm:pr-4">
                    {c.credentialId ?? <span className="text-faint sm:inline hidden">–</span>}
                  </td>
                  <td className="row-start-1 col-start-2 sm:py-4">
                    <StatusTag
                      label={c.status === "held" ? "Held" : "In progress"}
                      tone={c.status === "held" ? "resolved" : "signal"}
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

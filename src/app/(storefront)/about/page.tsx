import Link from "next/link";
import { PageHeading } from "@/components/ui/PageHeading";
import { getPublicSettings } from "@/lib/settings";

const DEFAULT_WHATSAPP_NUMBER = "918856828894";
const DEFAULT_ADDRESS = "Gat No. 714, Opp. Gupta Weigh Bridge, Kudalwadi, Chikhali, Pune, Maharashtra 411062, India";
const GSTIN = "27AAPFC6278B1Z9";

export default async function AboutPage() {
  const settings = await getPublicSettings();
  const WHATSAPP_NUMBER = settings.whatsapp || DEFAULT_WHATSAPP_NUMBER;
  const ADDRESS = settings.company_address || DEFAULT_ADDRESS;
  return (
    <div>
      <section className="bg-navy-900 px-4 py-14 sm:px-12 sm:py-[88px]">
        <PageHeading light eyebrow="About Cutmax" title="Industrial tooling, enquiry made simple." level="h1" className="max-w-2xl" />
        <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-white/68">
          Cutmax Technologies runs a B2B catalogue for CNC machine shops that need precision cutting tools without the back-and-forth of traditional sourcing — live stock, transparent pricing and a direct line to our sales team.
        </p>
      </section>

      <section className="bg-bg-soft px-4 py-14 sm:px-12 sm:py-24">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-14 lg:grid-cols-2">
          <div>
            <h2 className="font-display mb-4.5 text-[1.625rem] font-bold text-heading sm:text-[2rem]">
              Based in Pune, supplying CNC shops nationally.
            </h2>
            <p className="mb-4 text-[15.5px] leading-relaxed text-muted-soft">
              Cutmax operates out of Kudalwadi, Chikhali — in the heart of Pune&apos;s manufacturing belt — stocking end mills, carbide inserts, tool holders, milling cutters and spares for turning and milling operations.
            </p>
            <p className="mb-8 text-[15.5px] leading-relaxed text-muted-soft">
              Every enquiry is handled directly by our sales team, with GST-registered invoicing on every order.
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
              <div className="rounded-[4px] bg-surface p-4.5">
                <div className="mb-1 text-xs text-muted">Location</div>
                <div className="text-[14.5px] font-bold text-heading">Pune, Maharashtra</div>
              </div>
              <div className="rounded-[4px] bg-surface p-4.5">
                <div className="mb-1 text-xs text-muted">GSTIN</div>
                <div className="text-[14.5px] font-bold text-heading">{GSTIN}</div>
              </div>
              <div className="rounded-[4px] bg-surface p-4.5">
                <div className="mb-1 text-xs text-muted">Live SKUs</div>
                <div className="text-[14.5px] font-bold text-heading">193+</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface px-4 py-14 sm:px-12 sm:py-24">
        <PageHeading eyebrow="How We Work" title="Built for industrial procurement." className="mb-12 max-w-xl" />
        <div className="grid grid-cols-1 gap-7 sm:grid-cols-3">
          {[
            { title: "Live inventory", desc: "Stock levels and SKUs are tracked and shown as they are — no guessing on availability." },
            { title: "Direct enquiries", desc: "Every requirement is reviewed by our sales team and answered on WhatsApp or phone — no ticketing queue." },
            { title: "GST-ready billing", desc: `Registered under GSTIN ${GSTIN}, with compliant invoicing on every order.` },
          ].map((f) => (
            <div key={f.title} className="rounded-[4px] border-t-[3px] border-red-600 bg-bg-soft p-8">
              <h3 className="font-display mb-2.5 text-[18px] font-bold text-heading">{f.title}</h3>
              <p className="text-[14.5px] leading-relaxed text-muted-soft">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-bg-soft px-4 py-14 sm:px-12 sm:py-24">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-8 rounded-[4px] bg-navy-900 p-8 sm:grid-cols-2 sm:p-12">
          <div>
            <div className="mb-2.5 text-xs font-bold tracking-[0.1em] text-white/50">YOUR CONTACT AT CUTMAX</div>
            <div className="font-display mb-1.5 text-2xl font-bold text-white">Pratap Narayan Mourya</div>
            <div className="text-[14.5px] text-white/65">{ADDRESS}</div>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="whitespace-nowrap rounded-[3px] bg-red-600 px-6 py-3.5 text-[14.5px] font-bold text-white transition-colors hover:bg-red-700"
            >
              WhatsApp / Call
            </a>
            <Link
              href="/contact"
              className="whitespace-nowrap rounded-[3px] border-[1.5px] border-white/35 px-6 py-3.5 text-[14.5px] font-bold text-white transition-colors hover:bg-white/10"
            >
              Full Contact Details
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

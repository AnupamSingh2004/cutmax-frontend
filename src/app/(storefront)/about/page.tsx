import { PageHeading } from "@/components/ui/PageHeading";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <PageHeading level="h1" eyebrow="Who We Are" title="About CutMax Technologies" />
      <p className="mt-6 leading-relaxed text-muted">
        CutMax Technologies manufactures and supplies precision carbide cutting tools — end mills, inserts, tool
        holders and adapters — engineered for high-performance CNC machining. We work with manufacturers across
        aerospace, automotive, die & mould, and general engineering, delivering consistent tolerances and reliable
        stock availability.
      </p>
      <p className="mt-4 leading-relaxed text-muted">
        Our catalogue is built around the CUT-STOCK product line, backed by volume-based pricing tiers for B2B
        buyers and a responsive quoting process over WhatsApp and email.
      </p>
    </div>
  );
}

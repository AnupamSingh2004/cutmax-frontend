import { Nav } from "@/components/storefront/Nav";
import { Footer } from "@/components/storefront/Footer";
import { SiteBackgroundVideo } from "@/components/storefront/SiteBackgroundVideo";

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteBackgroundVideo />
      <div className="site-watermark" aria-hidden="true">
        CUTMAX <span>TECHNOLOGIES</span>
      </div>
      <Nav />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

import { Nav } from "@/components/storefront/Nav";
import { Footer } from "@/components/storefront/Footer";
import { SiteBackgroundVideo } from "@/components/storefront/SiteBackgroundVideo";
import { getPublicSettings } from "@/lib/settings";

export default async function StorefrontLayout({ children }: { children: React.ReactNode }) {
  const settings = await getPublicSettings();

  return (
    <div className="flex min-h-screen flex-col">
      <SiteBackgroundVideo src={settings.site_background_video_url} />
      <div className="site-watermark" aria-hidden="true">
        CUTMAX <span>TECHNOLOGIES</span>
      </div>
      <Nav />
      <main className="flex-1 bg-bg-soft">{children}</main>
      <Footer />
    </div>
  );
}

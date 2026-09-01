import { Nav } from "@/components/storefront/Nav";
import { Footer } from "@/components/storefront/Footer";
import { SiteBackgroundVideo } from "@/components/storefront/SiteBackgroundVideo";
import { getPublicSettings } from "@/lib/settings";

export default async function StorefrontLayout({ children }: { children: React.ReactNode }) {
  const settings = await getPublicSettings();

  return (
    <div id="storefront-shell" className="flex min-h-screen flex-col bg-bg-soft" suppressHydrationWarning>
      {/* Applies the saved (or system-default) theme before paint, scoped to
          just this subtree — admin is untouched regardless of what a
          storefront visitor has chosen. */}
      <script
        dangerouslySetInnerHTML={{
          __html: `(function(){try{var t=localStorage.getItem("cutmax-theme");var d=t?t==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;if(d)document.getElementById("storefront-shell").setAttribute("data-theme","dark")}catch(e){}})()`,
        }}
      />
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

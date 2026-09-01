import type { NextConfig } from "next";

const backendOrigin = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
const parsed = new URL(backendOrigin);

const remotePatterns: NonNullable<NextConfig["images"]>["remotePatterns"] = [
  {
    protocol: parsed.protocol.replace(":", "") as "http" | "https",
    hostname: parsed.hostname,
    port: parsed.port || undefined,
    pathname: "/api/uploads/**",
  },
];

// When product/media images are served straight from R2 (or another
// S3-compatible bucket) instead of proxied through the backend, next/image
// needs that host allow-listed too.
const r2PublicBaseURL = process.env.NEXT_PUBLIC_R2_PUBLIC_BASE_URL;
if (r2PublicBaseURL) {
  const r2 = new URL(r2PublicBaseURL);
  remotePatterns.push({
    protocol: r2.protocol.replace(":", "") as "http" | "https",
    hostname: r2.hostname,
    port: r2.port || undefined,
    pathname: "/**",
  });
}

const nextConfig: NextConfig = {
  poweredByHeader: false,
  output: "standalone",
  images: { remotePatterns },
};

export default nextConfig;

// Enables `next dev` to pick up Cloudflare bindings/env vars when running
// under the OpenNext Cloudflare adapter; a no-op for plain `next build`.
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();

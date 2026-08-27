import type { Metadata } from "next";
import localFont from "next/font/local";
import "@/styles/globals.css";

const inter = localFont({
  variable: "--font-inter",
  display: "swap",
  src: [
    { path: "../fonts/Inter-Regular.otf", weight: "400", style: "normal" },
    { path: "../fonts/Inter-Medium.otf", weight: "500", style: "normal" },
    { path: "../fonts/Inter-SemiBold.otf", weight: "600", style: "normal" },
    { path: "../fonts/Inter-Bold.otf", weight: "700 900", style: "normal" },
  ],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3001";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "CutMax Technologies — Precision Cutting Tools",
    template: "%s",
  },
  description: "Carbide inserts, end mills, tool holders and more — built for CNC performance.",
  icons: { icon: "/logo.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}

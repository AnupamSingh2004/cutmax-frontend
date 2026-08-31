import type { Metadata } from "next";
import { Manrope, Work_Sans } from "next/font/google";
import "@/styles/globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  display: "swap",
  weight: ["500", "600", "700", "800"],
  subsets: ["latin"],
});

const workSans = Work_Sans({
  variable: "--font-work-sans",
  display: "swap",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
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
    <html lang="en" className={`${manrope.variable} ${workSans.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}

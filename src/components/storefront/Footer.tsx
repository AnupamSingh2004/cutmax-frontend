import Image from "next/image";
import Link from "next/link";
import type { PublicSettings } from "@/lib/types";

const DEFAULT_ADDRESS = "Gat No. 714, Opp. Gupta Weigh Bridge, Kudalwadi, Chikhali, Pune – 411062";
const EMAIL = "officecutmax@gmail.com";
const DEFAULT_PHONE1 = "+91 88568 28894";
const PHONE2 = "+91 96991 92248";
const GSTIN = "27AAPFC6278B1Z9";

export function Footer({ settings }: { settings: PublicSettings }) {
  const ADDRESS = settings.company_address || DEFAULT_ADDRESS;
  const PHONE1 = settings.company_phone || DEFAULT_PHONE1;
  return (
    <footer className="bg-navy-950 text-white/60">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <div className="mb-4 flex items-center gap-2.5">
            <span className="inline-flex rounded-[4px] bg-white px-2 py-1.5">
              <Image src="/logo.png" alt="Cutmax" width={100} height={22} className="h-[22px] w-auto" />
            </span>
            <span className="font-display text-[17px] font-extrabold text-white">CUTMAX TECHNOLOGIES</span>
          </div>
          <p className="max-w-sm text-[14.5px] leading-relaxed">
            Precision tooling. Reliable supply. Professional enquiries — from Pune to CNC shops across India.
          </p>
        </div>

        <div>
          <div className="mb-4 text-xs font-bold tracking-[0.1em] text-white/40">NAVIGATE</div>
          <div className="flex flex-col gap-2.5 text-[14.5px]">
            <Link href="/products" className="text-white/75 hover:text-white">Products</Link>
            <Link href="/about" className="text-white/75 hover:text-white">About Us</Link>
            <Link href="/contact" className="text-white/75 hover:text-white">Contact Us</Link>
            <Link href="/account/my-enquiries" className="text-white/75 hover:text-white">My Enquiries</Link>
          </div>
        </div>

        <div>
          <div className="mb-4 text-xs font-bold tracking-[0.1em] text-white/40">CONTACT</div>
          <div className="flex flex-col gap-2.5 text-[14.5px]">
            <span>{ADDRESS}</span>
            <span>{EMAIL}</span>
            <span>{PHONE1} &nbsp;|&nbsp; {PHONE2}</span>
            <span className="text-white/40">GSTIN {GSTIN}</span>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-6">
        <div className="mx-auto max-w-7xl text-[13px] text-white/35">
          © {new Date().getFullYear()} Cutmax Technologies. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

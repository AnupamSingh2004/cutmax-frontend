import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-navy-950 text-cream-100">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-12 sm:grid-cols-3">
        <div>
          <Image src="/logo.png" alt="CutMax Technologies" width={140} height={60} className="h-10 w-auto" />
          <p className="mt-4 text-sm text-cream-100/70">
            Precision carbide cutting tools engineered for modern CNC manufacturing.
          </p>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-cream-300">Links</h3>
          <ul className="flex flex-col gap-2 text-sm text-cream-100/80">
            <li><Link href="/products" className="hover:text-white">Products</Link></li>
            <li><Link href="/about" className="hover:text-white">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
            <li><Link href="/account/my-enquiries" className="hover:text-white">My Enquiries</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-cream-300">Contact</h3>
          <ul className="flex flex-col gap-2 text-sm text-cream-100/80">
            <li>Plot 12, Industrial Estate, Pune, Maharashtra, India</li>
            <li>+91 99999 99999</li>
            <li>sales@cutmaxtech.com</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-cream-100/50">
        © {new Date().getFullYear()} CutMax Technologies. All rights reserved.
      </div>
    </footer>
  );
}

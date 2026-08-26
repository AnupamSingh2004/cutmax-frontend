import Image from "next/image";
import Link from "next/link";

const WHATSAPP_NUMBER = "918856828894";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-navy-800 bg-navy-950 text-cream-100">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        {/* Column 1 — About */}
        <div>
          <Image src="/logo.png" alt="CutMax Technologies" width={140} height={50} className="h-10 w-auto" />
          <p className="mt-4 text-sm leading-relaxed text-cream-100/70">
            CutMax Technologies is a leading supplier of precision cutting tools, carbide inserts, and CNC accessories
            for industrial manufacturing.
          </p>
          <div className="mt-4 flex gap-3">
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-md bg-green-500 text-white hover:bg-green-600"
              aria-label="WhatsApp"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
            </a>
          </div>
        </div>

        {/* Column 2 — Quick Links */}
        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-cream-300">Quick Links</h3>
          <ul className="flex flex-col gap-2.5 text-sm text-cream-100/70">
            <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
            <li><Link href="/products" className="hover:text-white transition-colors">Products</Link></li>
            <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            <li><Link href="/account/my-enquiries" className="hover:text-white transition-colors">My Enquiries</Link></li>
            <li><Link href="/account/login" className="hover:text-white transition-colors">Sign In / Register</Link></li>
          </ul>
        </div>

        {/* Column 3 — Categories */}
        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-cream-300">Categories</h3>
          <ul className="flex flex-col gap-2.5 text-sm text-cream-100/70">
            <li><Link href="/products?category=Carbide+Inserts" className="hover:text-white transition-colors">Carbide Inserts</Link></li>
            <li><Link href="/products?category=End+Mills" className="hover:text-white transition-colors">End Mills</Link></li>
            <li><Link href="/products?category=Tool+Holders+%26+Adapters" className="hover:text-white transition-colors">Tool Holders &amp; Adapters</Link></li>
            <li><Link href="/products?category=Milling+Cutters+%26+Adapters" className="hover:text-white transition-colors">Milling Cutters &amp; Adapters</Link></li>
            <li><Link href="/products?category=Spares" className="hover:text-white transition-colors">Spares</Link></li>
          </ul>
        </div>

        {/* Column 4 — Contact */}
        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-cream-300">Contact Us</h3>
          <ul className="flex flex-col gap-3 text-sm text-cream-100/70">
            <li className="flex items-start gap-2">
              <svg className="mt-0.5 h-4 w-4 shrink-0 text-cream-100/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              Gat No. 714, Opp. Gupta Weigh Bridge, Kudalwadi, Chikhali, Pune - 411062
            </li>
            <li className="flex items-center gap-2">
              <svg className="h-4 w-4 shrink-0 text-cream-100/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              +91 8856828894
            </li>
            <li className="flex items-center gap-2">
              <svg className="h-4 w-4 shrink-0 text-cream-100/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              +91 9699192248
            </li>
            <li className="flex items-center gap-2">
              <svg className="h-4 w-4 shrink-0 text-cream-100/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              officecutmax@gmail.com
            </li>
          </ul>
          <div className="mt-4 rounded-md bg-navy-900 px-3 py-2 text-xs text-cream-100/60">
            <span className="font-semibold text-cream-100/80">Working Hours:</span><br />
            Mon - Sat: 9:00 AM - 7:00 PM
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 px-4 py-4">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 text-xs text-cream-100/50 sm:flex-row">
          <span>&copy; {new Date().getFullYear()} CutMax Technologies. All rights reserved.</span>
          <span>Precision Cutting Tools for Modern Manufacturing</span>
        </div>
      </div>
    </footer>
  );
}

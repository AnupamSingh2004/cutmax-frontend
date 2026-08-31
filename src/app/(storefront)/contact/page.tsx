"use client";

import { useState } from "react";
import { PageHeading } from "@/components/ui/PageHeading";

const WHATSAPP_NUMBER = "918856828894";
const ADDRESS = "Gat No. 714, Opp. Gupta Weigh Bridge, Kudalwadi, Chikhali, Pune, Maharashtra 411062, India";
const EMAIL = "officecutmax@gmail.com";
const PHONE1 = "+91 88568 28894";
const PHONE2 = "+91 96991 92248";
const GSTIN = "27AAPFC6278B1Z9";

const inputClass = "w-full rounded-[3px] border border-border px-3.5 py-3 text-[14.5px] outline-none focus:border-navy-700";
const labelClass = "mb-1.5 block text-[13px] font-semibold text-navy-900";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [requirement, setRequirement] = useState("");

  const lines = [
    "Hi Cutmax Technologies, I'd like to send a requirement:",
    name && `Name: ${name}`,
    company && `Company: ${company}`,
    phone && `Phone: ${phone}`,
    email && `Email: ${email}`,
    requirement && `Requirement: ${requirement}`,
  ].filter(Boolean);
  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;

  return (
    <div>
      <section className="bg-navy-900 px-4 py-14 sm:px-12 sm:py-[88px]">
        <PageHeading light eyebrow="Get In Touch" title="Talk to Cutmax Technologies." level="h1" className="max-w-xl" />
      </section>

      <section className="bg-bg-soft px-4 py-14 sm:px-12 sm:py-24">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-start gap-14 lg:grid-cols-2">
          <div>
            <div className="mb-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="rounded-[4px] bg-white p-6">
                <div className="mb-2.5 text-xs font-bold tracking-[0.08em] text-muted">PRIMARY CONTACT</div>
                <div className="font-display mb-2 text-[17px] font-bold text-navy-900">Pratap Narayan Mourya</div>
                <div className="text-sm leading-relaxed text-muted-soft">{ADDRESS}</div>
              </div>
              <div className="rounded-[4px] bg-white p-6">
                <div className="mb-2.5 text-xs font-bold tracking-[0.08em] text-muted">WHATSAPP / PHONE</div>
                <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="font-display mb-1.5 block text-[17px] font-bold text-navy-900">
                  {PHONE1}
                </a>
                <div className="text-[13.5px] text-muted-soft">Fastest way to reach our sales team.</div>
              </div>
              <div className="rounded-[4px] bg-white p-6">
                <div className="mb-2.5 text-xs font-bold tracking-[0.08em] text-muted">SECONDARY CONTACT</div>
                <div className="font-display mb-1.5 text-[17px] font-bold text-navy-900">{PHONE2}</div>
                <div className="text-[13.5px] text-muted-soft">Display only.</div>
              </div>
              <div className="rounded-[4px] bg-white p-6">
                <div className="mb-2.5 text-xs font-bold tracking-[0.08em] text-muted">EMAIL &amp; GSTIN</div>
                <div className="font-display mb-1.5 text-[15.5px] font-bold text-navy-900">{EMAIL}</div>
                <div className="text-[13.5px] text-muted-soft">GSTIN {GSTIN}</div>
              </div>
            </div>

            <div className="overflow-hidden rounded-[4px] bg-white">
              <iframe
                title="Cutmax Technologies location"
                src="https://www.google.com/maps?q=18.684178,73.805943&z=16&output=embed"
                width="100%"
                height="300"
                style={{ border: 0, display: "block" }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <a
                href="https://maps.app.goo.gl/qTvWXJBfKddMuemg7?g_st=ac"
                target="_blank"
                rel="noopener noreferrer"
                className="block px-6 py-3.5 text-center text-[13.5px] font-bold text-navy-900 hover:bg-bg-soft"
              >
                Get directions on Google Maps →
              </a>
            </div>
          </div>

          <div className="rounded-[4px] bg-white p-7 sm:p-10">
            <div className="font-display mb-1.5 text-xl font-bold text-navy-900">Send a requirement</div>
            <p className="mb-6 text-sm text-muted-soft">Fill this in and we&apos;ll follow up on WhatsApp or by phone.</p>
            <div className="flex flex-col gap-4">
              <div>
                <label className={labelClass}>Full name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Company name</label>
                <input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Your company" className={inputClass} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Phone</label>
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Email</label>
                  <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" className={inputClass} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Requirement</label>
                <textarea
                  value={requirement}
                  onChange={(e) => setRequirement(e.target.value)}
                  placeholder="Products, sizes and quantities you need"
                  rows={4}
                  className={`${inputClass} resize-y`}
                />
              </div>
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1.5 rounded-[3px] bg-red-600 py-3.5 text-center text-[15px] font-bold text-white transition-colors hover:bg-red-700"
              >
                Send on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

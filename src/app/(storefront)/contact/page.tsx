"use client";

import { useState } from "react";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations/motion";
import { Mail, Phone, MapPin, Clock, Send, Instagram, Facebook, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";

const faqs = [
  {
    q: "What is your shipping policy?",
    a: "We offer free shipping across India on all orders above ₹5,000. International shipping is available at a flat rate of $25. Orders are dispatched within 3–5 business days and typically arrive within 7–10 business days domestically.",
  },
  {
    q: "Can I return or exchange a piece?",
    a: "Yes, you may return or exchange any item within 15 days of delivery, provided it is in its original condition with all tags and certificates. Custom and engraved pieces are not eligible for returns.",
  },
  {
    q: "Do you accept custom orders?",
    a: "Absolutely. We specialize in bespoke jewelry crafted to your vision. Reach out via our contact form or visit our Jaipur studio to discuss design, gemstones, and timelines with our master artisans.",
  },
  {
    q: "How do I care for my jewelry?",
    a: "Store each piece separately in a soft pouch. Avoid contact with perfumes, lotions, and water. Gently clean with a dry cotton cloth. For deep cleaning, we recommend a professional polish at our studio.",
  },
  {
    q: "Do you offer international shipping?",
    a: "Yes, we ship worldwide. International orders are shipped via tracked courier and typically arrive in 10–15 business days. Duties and taxes are calculated at checkout based on the destination country.",
  },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // handle form submission
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      {/* Hero */}
      <section className="relative bg-[#0a0a0a] py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0a0a0a]/30 pointer-events-none" />
        <FadeIn className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-gold tracking-[0.2em]  text-xs font-medium mb-4">
            Get in Touch
          </p>
          <h1 className="text-4xl md:text-6xl font-serif text-cream mb-5 leading-tight">
            Contact Us
          </h1>
          <p className="text-cream-dark/70 text-lg font-light leading-relaxed max-w-2xl mx-auto">
            We&apos;d love to hear from you. Whether you have a question about our
            collections, need help with an order, or want to commission a custom
            piece, our team is here to help.
          </p>
        </FadeIn>
      </section>

      {/* Contact Form + Info */}
      <section className="max-w-7xl mx-auto px-6 py-20 md:py-28">
        <div className="grid md:grid-cols-5 gap-16 md:gap-20">
          {/* Form */}
          <FadeIn direction="left" className="md:col-span-3">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="name"
                  className="block text-gold tracking-[0.2em]  text-xs font-medium mb-2"
                >
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full h-12 px-4 border border-[rgba(201,168,76,0.2)] rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-[#0a0a0a] bg-[#141414] text-cream placeholder:text-cream-dark/40 transition-shadow"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-gold tracking-[0.2em]  text-xs font-medium mb-2"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full h-12 px-4 border border-[rgba(201,168,76,0.2)] rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-[#0a0a0a] bg-[#141414] text-cream placeholder:text-cream-dark/40 transition-shadow"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label
                  htmlFor="subject"
                  className="block text-gold tracking-[0.2em]  text-xs font-medium mb-2"
                >
                  Subject
                </label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  value={form.subject}
                  onChange={handleChange}
                  className="w-full h-12 px-4 border border-[rgba(201,168,76,0.2)] rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-[#0a0a0a] bg-[#141414] text-cream placeholder:text-cream-dark/40 transition-shadow"
                  placeholder="How can we help?"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-gold tracking-[0.2em]  text-xs font-medium mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-[rgba(201,168,76,0.2)] rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-[#0a0a0a] bg-[#141414] text-cream placeholder:text-cream-dark/40 transition-shadow resize-none"
                  placeholder="Tell us more..."
                />
              </div>
              <Button type="submit" size="lg" variant="default" className="w-full">
                <span className="flex items-center justify-center gap-2">
                  Send Message
                  <Send size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </span>
              </Button>
            </form>
          </FadeIn>

          {/* Info */}
          <FadeIn direction="right" className="md:col-span-2 space-y-10">
            <div className="flex items-start gap-4">
              <MapPin size={18} className="text-gold mt-0.5 shrink-0" />
              <div>
                <h3 className="text-sm font-medium tracking-wider  text-cream mb-1.5">
                  Visit Our Studio
                </h3>
                <p className="text-cream-dark/70 text-sm leading-relaxed">
                  Ratnagiri Jewelry Studio
                  <br />
                  Jaipur, Rajasthan
                  <br />
                  India
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Mail size={18} className="text-gold mt-0.5 shrink-0" />
              <div>
                <h3 className="text-sm font-medium tracking-wider  text-cream mb-1.5">
                  Email
                </h3>
                <a
                  href="mailto:hello@ratnagiri.com"
                  className="text-cream-dark/70 text-sm hover:text-gold transition-colors"
                >
                  hello@ratnagiri.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Phone size={18} className="text-gold mt-0.5 shrink-0" />
              <div>
                <h3 className="text-sm font-medium tracking-wider  text-cream mb-1.5">
                  Phone
                </h3>
                <a
                  href="tel:+911412345678"
                  className="text-cream-dark/70 text-sm hover:text-gold transition-colors"
                >
                  +91 141 234 5678
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Clock size={18} className="text-gold mt-0.5 shrink-0" />
              <div>
                <h3 className="text-sm font-medium tracking-wider  text-cream mb-1.5">
                  Business Hours
                </h3>
                <p className="text-cream-dark/70 text-sm leading-relaxed">
                  Monday – Saturday: 10:00 AM – 7:00 PM IST
                  <br />
                  Sunday: Closed
                </p>
              </div>
            </div>

            {/* Social */}
            <div className="pt-4 border-t border-[rgba(201,168,76,0.1)]">
              <h3 className="text-sm font-medium tracking-wider  text-cream mb-4">
                Follow Us
              </h3>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="w-10 h-10 rounded-full border border-[rgba(201,168,76,0.2)] flex items-center justify-center text-gold-muted hover:border-gold hover:text-gold transition-all"
                  aria-label="Instagram"
                >
                  <Instagram size={16} />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full border border-[rgba(201,168,76,0.2)] flex items-center justify-center text-gold-muted hover:border-gold hover:text-gold transition-all"
                  aria-label="Facebook"
                >
                  <Facebook size={16} />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full border border-[rgba(201,168,76,0.2)] flex items-center justify-center text-gold-muted hover:border-gold hover:text-gold transition-all"
                  aria-label="Twitter"
                >
                  <Twitter size={16} />
                </a>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Map Placeholder */}
      <FadeIn direction="up">
        <section className="max-w-7xl mx-auto px-6 pb-20 md:pb-28">
          <div className="relative w-full h-72 md:h-96 bg-[#141414] rounded-sm overflow-hidden flex items-center justify-center border border-[rgba(201,168,76,0.1)]">
            <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent" />
            <div className="text-center z-10">
              <MapPin size={32} className="text-gold mx-auto mb-3" />
              <p className="text-cream-dark/70 text-sm font-light">
                Ratnagiri Jewelry Studio — Jaipur, Rajasthan
              </p>
              <p className="text-gold-muted text-xs mt-1">Map integration coming soon</p>
            </div>
          </div>
        </section>
      </FadeIn>

      {/* FAQ */}
      <section className="bg-[#0a0a0a] py-20 md:py-28">
        <FadeIn className="max-w-3xl mx-auto px-6">
          <p className="text-gold tracking-[0.2em]  text-xs font-medium mb-3 text-center">
            Have Questions?
          </p>
          <h2 className="text-3xl md:text-4xl font-serif text-cream mb-12 text-center">
            Frequently Asked Questions
          </h2>

          <StaggerContainer className="space-y-3">
            {faqs.map((faq, i) => (
              <StaggerItem key={i}>
                <div className="luxe-card rounded-sm overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between px-6 py-4 text-left"
                  >
                    <span className="text-sm font-medium text-cream pr-4">
                      {faq.q}
                    </span>
                    <span
                      className={`text-gold text-lg transition-transform duration-300 shrink-0 ${
                        openFaq === i ? "rotate-45" : ""
                      }`}
                    >
                      +
                    </span>
                  </button>
                  <div
                    className={`grid transition-all duration-300 ease-in-out ${
                      openFaq === i ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-6 pb-4 text-sm text-cream-dark/70 leading-relaxed">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </FadeIn>
      </section>
    </main>
  );
}

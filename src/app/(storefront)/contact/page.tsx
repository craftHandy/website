"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  FadeIn,
  StaggerContainer,
  StaggerItem,
} from "@/components/animations/motion";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  Instagram,
  Facebook,
  Twitter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { sendEnquiry } from "@/lib/api";
import { toast } from "@/store/toast";

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

interface ContactForm {
  email: string;
  subject: string;
  message: string;
}

export default function ContactPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactForm>({
    mode: "onChange",
    defaultValues: { email: "", subject: "", message: "" },
  });

  async function onSubmit(data: ContactForm) {
    try {
      await sendEnquiry({
        email: data.email.trim(),
        subject: data.subject.trim(),
        body: data.message.trim(),
      });
      toast("Message sent", {
        description: "Thanks for reaching out. We'll get back to you soon.",
        variant: "success",
      });
      reset();
    } catch (e: any) {
      toast("Failed to send message", {
        description: e?.message || "Please try again.",
        variant: "error",
      });
    }
  }

  return (
    <main className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)]">
      {/* Hero */}
      <section className="relative bg-[var(--color-background)] py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--color-background)]/30 pointer-events-none" />
        <FadeIn className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-gold tracking-[0.2em]  text-xs font-medium mb-4">
            Get in Touch
          </p>
          <h1 className="text-fluid-h2 md:text-fluid-display font-serif text-[var(--color-foreground)] mb-5 leading-tight">
            Contact Us
          </h1>
          <p className="text-[var(--color-cream-dark)]/70 text-fluid-body font-light leading-relaxed max-w-2xl mx-auto font-poppins">
            We&apos;d love to hear from you. Whether you have a question about
            our collections, need help with an order, or want to commission a
            custom piece, our team is here to help.
          </p>
        </FadeIn>
      </section>

      {/* Contact Form + Info */}
      <section className="max-w-7xl mx-auto px-6 py-20 md:py-28">
        <div className="grid md:grid-cols-5 gap-16 md:gap-20">
          {/* Form */}
          <FadeIn direction="left" className="md:col-span-3">
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
              <div>
                <label
                  htmlFor="email"
                  className="block text-gold tracking-[0.2em]  text-xs font-medium mb-2 font-poppins"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className="w-full h-12 px-4 border border-[var(--color-border-subtle)] rounded-sm text-sm font-poppins focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-[var(--color-background)] bg-[var(--color-surface-elevated)] text-[var(--color-foreground)] placeholder:text-[var(--color-cream-dark)]/40 transition-shadow"
                  placeholder="your@email.com"
                  {...register("email", {
                    required: "Email is required",
                    pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email" },
                  })}
                />
                {errors.email && (
                  <p className="text-red-600 text-xs mt-1.5 font-poppins">{errors.email.message}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="subject"
                  className="block text-gold tracking-[0.2em]  text-xs font-medium mb-2 font-poppins"
                >
                  Subject
                </label>
                <input
                  id="subject"
                  type="text"
                  className="w-full h-12 px-4 border border-[var(--color-border-subtle)] rounded-sm text-sm font-poppins focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-[var(--color-background)] bg-[var(--color-surface-elevated)] text-[var(--color-foreground)] placeholder:text-[var(--color-cream-dark)]/40 transition-shadow"
                  placeholder="How can we help?"
                  {...register("subject", { required: "Subject is required" })}
                />
                {errors.subject && (
                  <p className="text-red-600 text-xs mt-1.5 font-poppins">{errors.subject.message}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-gold tracking-[0.2em]  text-xs font-medium mb-2 font-poppins"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  className="w-full px-4 py-3 border border-[var(--color-border-subtle)] rounded-sm text-sm font-poppins focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-[var(--color-background)] bg-[var(--color-surface-elevated)] text-[var(--color-foreground)] placeholder:text-[var(--color-cream-dark)]/40 transition-shadow resize-none"
                  placeholder="Tell us more..."
                  {...register("message", {
                    required: "Message is required",
                    minLength: { value: 10, message: "Message must be at least 10 characters" },
                  })}
                />
                {errors.message && (
                  <p className="text-red-600 text-xs mt-1.5 font-poppins">{errors.message.message}</p>
                )}
              </div>
              <Button
                type="submit"
                size="lg"
                variant="default"
                className="w-full"
                disabled={isSubmitting}
              >
                <span className="flex items-center justify-center gap-2">
                  {isSubmitting ? "Sending..." : "Send Message"}
                  <Send
                    size={14}
                    className="group-hover:translate-x-0.5 transition-transform"
                  />
                </span>
              </Button>
            </form>
          </FadeIn>

          {/* Info */}
          <FadeIn direction="right" className="md:col-span-2 space-y-10">
            <div className="flex items-start gap-4">
              <MapPin size={18} className="text-gold mt-0.5 shrink-0" />
              <div>
                <h3 className="text-fluid-small font-medium tracking-wider text-[var(--color-foreground)] mb-1.5">
                  Visit Our Studio
                </h3>
                <p className="text-[var(--color-cream-dark)]/70 text-sm leading-relaxed font-poppins">
                  Majnu ka tilla, Delhi
                  <br />
                  India
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Mail size={18} className="text-gold mt-0.5 shrink-0" />
              <div>
                <h3 className="text-sm font-medium tracking-wider  text-[var(--color-foreground)] mb-1.5">
                  Email
                </h3>
                <a
                  href="mailto:ratnacraft@gmail.com"
                  className="text-[var(--color-cream-dark)]/70 text-sm hover:text-gold transition-colors font-poppins"
                >
                  ratnacraft@gmail.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Phone size={18} className="text-gold mt-0.5 shrink-0" />
              <div>
                <h3 className="text-sm font-medium tracking-wider  text-[var(--color-foreground)] mb-1.5">
                  Phone
                </h3>
                <p className="flex items-center gap-4">
                <a
                  href="tel:+91 98714 82162"
                  className="text-[var(--color-cream-dark)]/70 text-sm hover:text-gold transition-colors font-poppins"
                >
                  +91 98714 82162
                </a>
                <a
                  href="tel:+91 88603 39072"
                  className="text-[var(--color-cream-dark)]/70 text-sm hover:text-gold transition-colors font-poppins"
                >
                  +91 88603 39072
                </a>
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Clock size={18} className="text-gold mt-0.5 shrink-0" />
              <div>
                <h3 className="text-sm font-medium tracking-wider  text-[var(--color-foreground)] mb-1.5">
                  Business Hours
                </h3>
                <p className="text-[var(--color-cream-dark)]/70 text-sm leading-relaxed font-poppins">
                  Monday – Saturday: 10:00 AM – 7:00 PM IST
                  <br />
                  Sunday: Closed
                </p>
              </div>
            </div>

            {/* Social */}
            <div className="pt-4 border-t border-[rgba(201,168,76,0.1)]">
              <h3 className="text-sm font-medium tracking-wider  text-[var(--color-foreground)] mb-4">
                Follow Us
              </h3>
              <div className="flex gap-4">
                <a
                  href="https://www.instagram.com/ratna_treasure_handicraft/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-[rgba(201,168,76,0.2)] flex items-center justify-center text-gold-muted hover:border-gold hover:text-gold transition-all"
                  aria-label="Instagram"
                >
                  <Instagram size={16} />
                </a>
                <a
                  href="https://www.facebook.com/p/Ratna-Treasure-Handicraft-100086415617036/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-[rgba(201,168,76,0.2)] flex items-center justify-center text-gold-muted hover:border-gold hover:text-gold transition-all"
                  aria-label="Facebook"
                >
                  <Facebook size={16} />
                </a>
                <a
                  href="mailto:ratnacraft@gmail.com"
                  className="w-10 h-10 rounded-full border border-[rgba(201,168,76,0.2)] flex items-center justify-center text-gold-muted hover:border-gold hover:text-gold transition-all"
                  aria-label="Twitter"
                >
                  <Mail size={16} />
                </a>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Map Placeholder */}
      <FadeIn direction="up">
        <section className="mx-auto max-w-7xl px-6 pb-20 md:pb-28">
          <div className="relative h-72 w-full overflow-hidden rounded-sm border border-[var(--color-border-subtle)] md:h-100">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3500.578652077156!2d77.2279346!3d28.7010505!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfdc599fdc851%3A0x6d32bfae6d95c5d!2sRatna%20Treasure%20Handicraft!5e0!3m2!1sen!2sin!4v1710000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              title="Ratna Treasure  location"
            />

            {/* Optional overlay */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        </section>
      </FadeIn>

      {/* FAQ */}
      <section className="bg-[var(--color-background)] py-20 md:py-28">
        <FadeIn className="max-w-3xl mx-auto px-6">
          <p className="text-gold tracking-[0.2em]  text-xs font-medium mb-3 text-center">
            Have Questions?
          </p>
          <h2 className="text-fluid-h2 md:text-fluid-display font-serif text-[var(--color-foreground)] mb-12 text-center">
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
                    <span className="text-sm font-medium text-[var(--color-foreground)] pr-4">
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
                      openFaq === i
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-6 pb-4 text-sm text-[var(--color-cream-dark)]/70 leading-relaxed font-poppins">
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

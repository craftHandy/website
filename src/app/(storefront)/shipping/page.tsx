import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping & Returns",
  description: "Learn about Ratnagiri's shipping policies and hassle-free returns.",
};

export default function ShippingPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <p className="text-gold tracking-[0.2em]  text-xs font-medium mb-3">
          Shipping & Returns
        </p>
        <h1 className="text-3xl md:text-4xl font-serif text-cream mb-8">
          Delivery & Returns Policy
        </h1>

        <div className="prose prose-neutral max-w-none text-cream-dark/70 space-y-8">
          <section>
            <h2 className="text-xl font-serif text-cream mb-3">Shipping</h2>
            <div className="space-y-3 text-sm leading-relaxed">
              <div className="flex justify-between py-3 border-b border-[rgba(201,168,76,0.1)]">
                <span>Standard Delivery</span>
                <span className="text-gold-muted">5–7 business days</span>
              </div>
              <div className="flex justify-between py-3 border-b border-[rgba(201,168,76,0.1)]">
                <span>Express Delivery</span>
                <span className="text-gold-muted">2–3 business days</span>
              </div>
              <div className="flex justify-between py-3 border-b border-[rgba(201,168,76,0.1)]">
                <span>Free Shipping</span>
                <span className="text-gold-muted">On orders above ₹25,000</span>
              </div>
              <div className="flex justify-between py-3 border-b border-[rgba(201,168,76,0.1)]">
                <span>Standard Shipping Fee</span>
                <span className="text-gold-muted">₹499</span>
              </div>
            </div>
            <p className="mt-4 text-sm text-gold-muted">
              All jewelry is carefully packaged in our signature Ratnagiri box with full insurance coverage during transit.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif text-cream mb-3">Returns & Exchanges</h2>
            <div className="space-y-3 text-sm leading-relaxed">
              <p>We want you to love every piece you receive. If for any reason you&apos;re not completely satisfied:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Returns are accepted within 15 days of delivery</li>
                <li>Jewelry must be unworn, in its original condition and packaging</li>
                <li>Custom or personalized orders cannot be returned</li>
                <li>Refunds are processed within 7–10 business days after we receive the return</li>
                <li>Exchange requests are processed within 3–5 business days</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-serif text-cream mb-3">International Shipping</h2>
            <p className="text-sm leading-relaxed">
              We ship worldwide. International delivery typically takes 7–14 business days depending on your location. Customs duties and taxes may apply and are the responsibility of the recipient.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

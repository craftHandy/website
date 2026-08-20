import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Ratnagiri's terms and conditions for using our website and purchasing our jewelry.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <p className="text-gold tracking-[0.2em]  text-xs font-medium mb-3">
          Legal
        </p>
        <h1 className="text-3xl md:text-4xl font-serif text-cream mb-8">
          Terms of Service
        </h1>
        <p className="text-sm text-gold-muted mb-10">Last updated: January 2025</p>

        <div className="space-y-8 text-sm text-cream-dark/70 leading-relaxed">
          <section>
            <h2 className="text-lg font-serif text-cream mb-3">1. Acceptance of Terms</h2>
            <p>By accessing and using the Ratnagiri website, you accept and agree to be bound by these terms and conditions. If you do not agree, please do not use our website.</p>
          </section>

          <section>
            <h2 className="text-lg font-serif text-cream mb-3">2. Products & Pricing</h2>
            <p>All jewelry is handcrafted and may have slight variations from images shown. Prices are listed in Indian Rupees (INR) and include applicable taxes. We reserve the right to modify prices without prior notice, though confirmed orders will not be affected.</p>
          </section>

          <section>
            <h2 className="text-lg font-serif text-cream mb-3">3. Orders & Payment</h2>
            <p>Orders are confirmed upon successful payment. We accept major credit and debit cards through our secure payment gateway. All transactions are processed in INR. Custom or pre-order items may require advance payment.</p>
          </section>

          <section>
            <h2 className="text-lg font-serif text-cream mb-3">4. Shipping & Delivery</h2>
            <p>Delivery timelines are estimates and may vary. We ship across India with full insurance. International shipping is available to select countries. Risk of loss transfers to the buyer upon handoff to the shipping carrier.</p>
          </section>

          <section>
            <h2 className="text-lg font-serif text-cream mb-3">5. Returns & Refunds</h2>
            <p>Returns are accepted within 15 days of delivery for unworn items in original packaging. Custom, personalized, or engraved items cannot be returned. Refunds are processed to the original payment method within 7–10 business days.</p>
          </section>

          <section>
            <h2 className="text-lg font-serif text-cream mb-3">6. Intellectual Property</h2>
            <p>All content, images, designs, and trademarks on this website are the property of Ratnagiri. Any unauthorized reproduction, distribution, or use is strictly prohibited.</p>
          </section>

          <section>
            <h2 className="text-lg font-serif text-cream mb-3">7. Limitation of Liability</h2>
            <p>Ratnagiri shall not be held liable for any indirect, incidental, or consequential damages arising from the use of our website or products. Our total liability shall not exceed the purchase price of the product in question.</p>
          </section>

          <section>
            <h2 className="text-lg font-serif text-cream mb-3">8. Governing Law</h2>
            <p>These terms are governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Jaipur, Rajasthan.</p>
          </section>

          <section>
            <h2 className="text-lg font-serif text-cream mb-3">9. Contact</h2>
            <p>For questions about these terms, contact us at <span className="text-gold">hello@ratnagiri.com</span>.</p>
          </section>
        </div>
      </div>
    </main>
  );
}

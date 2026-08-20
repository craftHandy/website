import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Ratnagiri's privacy policy — how we protect and handle your personal information.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <p className="text-gold tracking-[0.2em]  text-xs font-medium mb-3">
          Legal
        </p>
        <h1 className="text-3xl md:text-4xl font-serif text-cream mb-8">
          Privacy Policy
        </h1>
        <p className="text-sm text-gold-muted mb-10">Last updated: January 2025</p>

        <div className="space-y-8 text-sm text-cream-dark/70 leading-relaxed">
          <section>
            <h2 className="text-lg font-serif text-cream mb-3">1. Information We Collect</h2>
            <p className="mb-3">We collect information you provide directly to us, including:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Personal information (name, email, phone number, shipping address) when you place an order</li>
              <li>Payment information processed securely through our payment providers</li>
              <li>Communication preferences and any messages you send us</li>
              <li>Browsing data and usage patterns through cookies and analytics</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-serif text-cream mb-3">2. How We Use Your Information</h2>
            <p className="mb-3">We use the information we collect to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Process and fulfill your orders</li>
              <li>Send order confirmations and shipping updates</li>
              <li>Provide customer support</li>
              <li>Send marketing communications (with your consent)</li>
              <li>Improve our website and product offerings</li>
              <li>Detect and prevent fraud</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-serif text-cream mb-3">3. Information Sharing</h2>
            <p>We do not sell or rent your personal information to third parties. We may share information with trusted service providers who assist in operating our website and delivering orders, subject to confidentiality obligations.</p>
          </section>

          <section>
            <h2 className="text-lg font-serif text-cream mb-3">4. Data Security</h2>
            <p>We implement reasonable security measures to protect your personal information. All payment transactions are encrypted and processed through secure, PCI-compliant payment gateways.</p>
          </section>

          <section>
            <h2 className="text-lg font-serif text-cream mb-3">5. Cookies</h2>
            <p>We use cookies and similar tracking technologies to enhance your browsing experience, analyze website traffic, and personalize content. You can manage cookie preferences through your browser settings.</p>
          </section>

          <section>
            <h2 className="text-lg font-serif text-cream mb-3">6. Your Rights</h2>
            <p>You have the right to access, correct, or delete your personal information. You may also opt out of marketing communications at any time. To exercise these rights, contact us at <span className="text-gold">hello@ratnagiri.com</span>.</p>
          </section>

          <section>
            <h2 className="text-lg font-serif text-cream mb-3">7. Contact</h2>
            <p>For any questions about this privacy policy, please contact us at <span className="text-gold">hello@ratnagiri.com</span>.</p>
          </section>
        </div>
      </div>
    </main>
  );
}

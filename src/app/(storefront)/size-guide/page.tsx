import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Size Guide",
  description: "Find your perfect fit with our comprehensive Indian jewelry size guide.",
};

export default function SizeGuidePage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <p className="text-gold tracking-[0.2em]  text-xs font-medium mb-3">
          Size Guide
        </p>
        <h1 className="text-3xl md:text-4xl font-serif text-cream mb-8">
          Find Your Perfect Fit
        </h1>

        <div className="space-y-10 text-cream-dark/70">
          <section>
            <h2 className="text-xl font-serif text-cream mb-4">Ring Size Guide</h2>
            <p className="text-sm leading-relaxed mb-4">
              Measure the circumference of your finger with a thin strip of paper or string. Use the chart below to find your size.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-[rgba(201,168,76,0.2)] bg-[#141414]">
                    <th className="px-4 py-3 text-left text-xs tracking-wider  text-gold-muted">Size</th>
                    <th className="px-4 py-3 text-left text-xs tracking-wider  text-gold-muted">Circumference (mm)</th>
                    <th className="px-4 py-3 text-left text-xs tracking-wider  text-gold-muted">Diameter (mm)</th>
                    <th className="px-4 py-3 text-left text-xs tracking-wider  text-gold-muted">US Size</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(201,168,76,0.1)]">
                  {[
                    ["Small", "49.3", "15.7", "5"],
                    ["Medium", "51.8", "16.5", "6"],
                    ["Regular", "54.4", "17.3", "7"],
                    ["Large", "56.9", "18.1", "8"],
                    ["Extra Large", "59.5", "18.9", "9"],
                  ].map(([size, circ, dia, us]) => (
                    <tr key={size} className="border-b border-[rgba(201,168,76,0.1)]">
                      <td className="px-4 py-3 font-medium text-cream">{size}</td>
                      <td className="px-4 py-3">{circ}</td>
                      <td className="px-4 py-3">{dia}</td>
                      <td className="px-4 py-3">{us}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-serif text-cream mb-4">Necklace Length Guide</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-[rgba(201,168,76,0.2)] bg-[#141414]">
                    <th className="px-4 py-3 text-left text-xs tracking-wider  text-gold-muted">Style</th>
                    <th className="px-4 py-3 text-left text-xs tracking-wider  text-gold-muted">Length (inches)</th>
                    <th className="px-4 py-3 text-left text-xs tracking-wider  text-gold-muted">Length (cm)</th>
                    <th className="px-4 py-3 text-left text-xs tracking-wider  text-gold-muted">Sits At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(201,168,76,0.1)]">
                  {[
                    ["Choker", "14–16", "36–41", "Base of neck"],
                    ["Princess", "18–20", "46–51", "Just below collarbone"],
                    ["Matinee", "22–24", "56–61", "Above bust"],
                    ["Opera", "28–34", "71–86", "Bustline / can be doubled"],
                    ["Rope", "36+", "91+", "Below bust / versatile"],
                  ].map(([style, inches, cm, sits]) => (
                    <tr key={style} className="border-b border-[rgba(201,168,76,0.1)]">
                      <td className="px-4 py-3 font-medium text-cream">{style}</td>
                      <td className="px-4 py-3">{inches}</td>
                      <td className="px-4 py-3">{cm}</td>
                      <td className="px-4 py-3">{sits}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-serif text-cream mb-4">Bangle Size Guide</h2>
            <p className="text-sm leading-relaxed mb-4">
              Measure your hand circumference by bringing your thumb and little finger together, then measure around the widest part of your hand.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-[rgba(201,168,76,0.2)] bg-[#141414]">
                    <th className="px-4 py-3 text-left text-xs tracking-wider  text-gold-muted">Size</th>
                    <th className="px-4 py-3 text-left text-xs tracking-wider  text-gold-muted">Inner Diameter (mm)</th>
                    <th className="px-4 py-3 text-left text-xs tracking-wider  text-gold-muted">Hand Circumference (mm)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(201,168,76,0.1)]">
                  {[
                    ["2.4 (Small)", "60.5", "190–200"],
                    ["2.6 (Medium)", "66", "200–210"],
                    ["2.8 (Regular)", "71.5", "210–220"],
                    ["2.10 (Large)", "76.5", "220–230"],
                  ].map(([size, dia, circ]) => (
                    <tr key={size} className="border-b border-[rgba(201,168,76,0.1)]">
                      <td className="px-4 py-3 font-medium text-cream">{size}</td>
                      <td className="px-4 py-3">{dia}</td>
                      <td className="px-4 py-3">{circ}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-serif text-cream mb-4">Need Help?</h2>
            <p className="text-sm leading-relaxed">
              If you&apos;re unsure about sizing, our team is happy to help. Contact us at{" "}
              <span className="text-gold">hello@ratnagiri.com</span> and we&apos;ll guide you to the perfect fit.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

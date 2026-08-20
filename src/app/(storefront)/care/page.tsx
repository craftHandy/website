import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jewelry Care",
  description: "Learn how to care for and preserve your handcrafted Indian jewelry.",
};

export default function CarePage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <p className="text-gold tracking-[0.2em]  text-xs font-medium mb-3">
          Preserve Your Pieces
        </p>
        <h1 className="text-3xl md:text-4xl font-serif text-cream mb-8">
          Jewelry Care Guide
        </h1>

        <div className="space-y-10 text-cream-dark/70">
          <section>
            <h2 className="text-xl font-serif text-cream mb-4">General Care Tips</h2>
            <ul className="space-y-3 text-sm leading-relaxed list-disc pl-5">
              <li>Store each piece separately in a soft pouch or lined jewelry box to prevent scratching</li>
              <li>Put on jewelry after applying perfume, hairspray, and cosmetics</li>
              <li>Remove jewelry before swimming, bathing, or exercising</li>
              <li>Avoid exposing jewelry to harsh chemicals, cleaning agents, or chlorinated water</li>
              <li>Wear your silver jewelry regularly — the natural oils in your skin help prevent tarnish</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-serif text-cream mb-4">Temple Jewelry</h2>
            <p className="text-sm leading-relaxed mb-3">
              Temple jewelry with gold plating requires gentle care. Wipe with a soft, dry cloth after each wear. Avoid contact with water and store in an airtight pouch. The gold plating may naturally wear over time — this is normal and part of the piece&apos;s evolving character.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif text-cream mb-4">Kundan & Jadau</h2>
            <p className="text-sm leading-relaxed mb-3">
              Kundan and Jadau pieces are delicate by nature. Handle with care and avoid direct pressure on the stone settings. Never use liquid cleaners or ultrasonic machines on Kundan jewelry. Clean gently with a soft brush if needed, and always store flat in its original packaging.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif text-cream mb-4">Silver Jewelry</h2>
            <p className="text-sm leading-relaxed mb-3">
              Sterling silver naturally develops a patina over time. To restore its shine, polish gently with a silver polishing cloth. For oxidized silver pieces, avoid polishing as the dark patina is intentional and part of the design. Store silver in anti-tarnish pouches.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif text-cream mb-4">Gemstone Jewelry</h2>
            <p className="text-sm leading-relaxed mb-3">
              Each gemstone has unique care requirements. As a general rule, avoid sudden temperature changes, harsh chemicals, and ultrasonic cleaners. Pearls and opals are especially sensitive — wipe them with a soft, damp cloth and let them dry flat. Store gemstone pieces separately to prevent scratching.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif text-cream mb-4">Professional Cleaning</h2>
            <p className="text-sm leading-relaxed">
              For annual maintenance or deep cleaning, we recommend professional jewelry cleaning. Contact us at{" "}
              <span className="text-gold">hello@ratnagiri.com</span> to schedule a professional cleaning for your Ratnagiri pieces.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function OrderSuccessPage() {
  return (
    <main className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)] flex items-center justify-center px-6">
      <div className="max-w-lg text-center">
        <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-gold/10 flex items-center justify-center border border-gold/20">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gold"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <p className="text-gold tracking-[0.3em]  text-xs font-medium mb-4">
          Order Confirmed
        </p>
        <h1 className="text-3xl md:text-4xl font-serif text-[var(--color-foreground)] mb-4">
          Thank You
        </h1>
        <p className="text-[var(--color-cream-dark)]/70 mb-2 leading-relaxed">
          Your order has been placed successfully. You will receive a confirmation email shortly with your order details and tracking information.
        </p>
        <p className="text-gold-muted text-sm mb-10">
          Each piece will be carefully crafted and packaged in our signature Ratnagiri box before it begins its journey to you.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" variant="default" className="px-8">
            <Link href="/jewelry">Continue Shopping</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="px-8">
            <Link href="/stories">Read Our Stories</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)] flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <p className="text-gold tracking-[0.2em]  text-xs font-medium mb-3">
          Page Not Found
        </p>
        <h1 className="text-4xl md:text-5xl font-serif text-[var(--color-foreground)] mb-4">
          404
        </h1>
        <p className="text-[var(--color-cream-dark)] mb-8 leading-relaxed">
          {`The page you're looking for doesn't exist or has been moved. Let's get you back on track.`}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild className="bg-gold hover:bg-gold-dark text-[#0a0a0a]">
            <Link href="/">Return Home</Link>
          </Button>
          <Button asChild variant="outline" className="border-gold text-gold hover:bg-gold hover:text-[#0a0a0a]">
            <Link href="/jewelry">Browse Jewelry</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
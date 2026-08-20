import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <p className="text-[#C9A84C] tracking-[0.2em]  text-xs font-medium mb-3">
          Page Not Found
        </p>
        <h1 className="text-4xl md:text-5xl font-serif text-neutral-900 mb-4">
          404
        </h1>
        <p className="text-neutral-600 mb-8 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you back on track.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild className="bg-[#C9A84C] hover:bg-[#B8973A] text-white">
            <Link href="/">Return Home</Link>
          </Button>
          <Button asChild variant="outline" className="border-[#C9A84C] text-[#C9A84C] hover:bg-[#C9A84C] hover:text-white">
            <Link href="/jewelry">Browse Jewelry</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
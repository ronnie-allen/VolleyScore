import Link from "next/link";
import { Volleyball } from "lucide-react";
import { DataTransfer } from "@/components/layout/data-transfer";
import { NavLinks } from "@/components/layout/nav-links";

export function Header() {
  return (
    <header className="relative border-b border-border bg-[hsl(226_45%_7%)]">
      {/* Orange ticker stripe */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-primary via-amber-400 to-transparent"
      />
      <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-3 shrink-0 group" aria-label="VolleyTracker home">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_0_24px_hsl(20_100%_56%/0.45)] transition-transform group-hover:scale-105">
            <Volleyball className="h-6 w-6" strokeWidth={2.25} />
          </span>
          <span className="section-title text-2xl sm:text-3xl leading-none text-foreground">
            Volley<span className="text-primary">Tracker</span>
          </span>
        </Link>
        <div className="flex items-center gap-2 sm:gap-4">
          <NavLinks />
          <DataTransfer />
        </div>
      </div>
    </header>
  );
}

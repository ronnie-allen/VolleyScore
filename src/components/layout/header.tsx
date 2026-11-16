import Link from "next/link";
import { Volleyball } from "lucide-react";
import { DataTransfer } from "@/components/layout/data-transfer";
import { NavLinks } from "@/components/layout/nav-links";

export function Header() {
  return (
    <header className="bg-primary text-primary-foreground py-3 shadow-md">
      <div className="container mx-auto flex items-center justify-between gap-4 px-4">
        <Link href="/" className="flex items-center gap-3 shrink-0" aria-label="VolleyTracker home">
          <Volleyball className="h-7 w-7" />
          <span className="text-xl sm:text-2xl font-bold">VolleyTracker</span>
        </Link>
        <div className="flex items-center gap-2 sm:gap-4">
          <NavLinks />
          <DataTransfer />
        </div>
      </div>
    </header>
  );
}

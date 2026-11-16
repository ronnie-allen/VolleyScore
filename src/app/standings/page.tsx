import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { StandingsTable } from "@/components/standings/standings-table";

export const metadata: Metadata = {
  title: "Standings",
  description: "Aggregate volleyball team standings with win percentage and set ratio.",
};

export default function StandingsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 container mx-auto p-4 md:p-8">
        <StandingsTable />
      </main>
    </div>
  );
}

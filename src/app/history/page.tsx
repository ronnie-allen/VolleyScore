import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { HistoryView } from "@/components/history/history-view";

export const metadata: Metadata = {
  title: "Match History",
  description: "Review past volleyball match results recorded in VolleyTracker.",
};

export default function HistoryPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 container mx-auto p-4 md:p-8">
        <HistoryView />
      </main>
    </div>
  );
}

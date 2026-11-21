import { Header } from "@/components/layout/header";
import { AddTeamForm } from "@/components/teams/add-team-form";
import { TeamList } from "@/components/teams/team-list";
import { Scoreboard } from "@/components/scoreboard/scoreboard";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 flex flex-col gap-6">
          <section
            aria-labelledby="add-team-heading"
            className="court-texture rounded-xl border border-border p-5 shadow-[0_18px_50px_-24px_rgb(0_0_0/0.8)]"
          >
            <h2 id="add-team-heading" className="section-title text-xl text-foreground mb-4">
              <span className="text-primary">New</span> Team
            </h2>
            <AddTeamForm />
          </section>

          <section
            aria-labelledby="rosters-heading"
            className="court-texture rounded-xl border border-border p-5 flex-1 shadow-[0_18px_50px_-24px_rgb(0_0_0/0.8)]"
          >
            <h2 id="rosters-heading" className="section-title text-xl text-foreground mb-4">
              Team <span className="text-primary">Rosters</span>
            </h2>
            <TeamList />
          </section>
        </div>

        <div className="lg:col-span-8">
          <Scoreboard />
        </div>
      </main>
    </div>
  );
}

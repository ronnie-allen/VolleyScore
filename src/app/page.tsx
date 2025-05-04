import { Header } from "@/components/layout/header";
import { AddTeamForm } from "@/components/teams/add-team-form";
import { TeamList } from "@/components/teams/team-list";
import { Scoreboard } from "@/components/scoreboard/scoreboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 container mx-auto p-4 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 flex flex-col gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Add New Team</CardTitle>
            </CardHeader>
            <CardContent>
              <AddTeamForm />
            </CardContent>
          </Card>
          <Card className="flex-1">
            <CardHeader>
              <CardTitle>Teams</CardTitle>
            </CardHeader>
            <CardContent>
              <TeamList />
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-2">
           <Scoreboard />
        </div>
      </main>
    </div>
  );
}
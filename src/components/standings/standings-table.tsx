"use client";

import { useMemo } from "react";
import { Trophy, Users } from "lucide-react";
import { useScoreboardStore } from "@/store/scoreboard-store";
import { useHydrated } from "@/hooks/use-hydrated";
import { computeStandings } from "@/lib/scoreboard";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function StandingsTable() {
  const hydrated = useHydrated();
  const teams = useScoreboardStore((state) => state.teams);
  const scores = useScoreboardStore((state) => state.scores);

  const standings = useMemo(() => computeStandings(teams, scores), [teams, scores]);

  if (!hydrated) {
    return <p className="text-muted-foreground text-center mt-8">Loading standings…</p>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Standings</CardTitle>
        <CardDescription>
          Ranked by win percentage, then set ratio. Updates automatically as you record scores.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {standings.length === 0 ? (
          <p className="text-muted-foreground text-center mt-4">
            No teams yet. Add teams on the scoreboard to see standings.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-14 text-center">Rank</TableHead>
                <TableHead>Team</TableHead>
                <TableHead className="text-center">Matches</TableHead>
                <TableHead className="text-center">Games W-L</TableHead>
                <TableHead className="text-center">Win %</TableHead>
                <TableHead className="text-center">Sets W-L</TableHead>
                <TableHead className="text-center">Set Ratio</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {standings.map((entry, index) => {
                const isLeader = index === 0 && entry.matchesPlayed > 0;
                return (
                  <TableRow key={entry.team.id} className={cn(isLeader && "bg-primary/10")}>
                    <TableCell className="text-center font-mono">
                      <span className="inline-flex items-center gap-1">
                        {isLeader && <Trophy className="h-4 w-4 text-primary" aria-hidden="true" />}
                        {index + 1}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium">
                      <span className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        {entry.team.name}
                      </span>
                    </TableCell>
                    <TableCell className="text-center font-mono">{entry.matchesPlayed}</TableCell>
                    <TableCell className="text-center font-mono">
                      {entry.gamesWon}-{entry.gamesLost}
                    </TableCell>
                    <TableCell className="text-center font-mono">
                      {(entry.winPct * 100).toFixed(1)}%
                    </TableCell>
                    <TableCell className="text-center font-mono">
                      {entry.setsWon}-{entry.setsLost}
                    </TableCell>
                    <TableCell className="text-center font-mono">{entry.setRatio.toFixed(2)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

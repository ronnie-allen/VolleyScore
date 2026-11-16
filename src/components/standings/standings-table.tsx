"use client";

import { useMemo } from "react";
import { Trophy, Users } from "lucide-react";
import { useScoreboardStore } from "@/store/scoreboard-store";
import { useHydrated } from "@/hooks/use-hydrated";
import { computeStandings } from "@/lib/scoreboard";
import { cn } from "@/lib/utils";
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
    <section aria-label="Standings" className="matchup-board rounded-xl overflow-hidden">
      <header className="border-b border-border px-6 pt-5 pb-4">
        <p className="text-[11px] uppercase tracking-[0.25em] text-primary font-semibold">League Table</p>
        <h1 className="section-title text-3xl leading-none text-foreground mt-1">Standings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Ranked by win percentage, then set ratio. Updates live as scores are recorded.
        </p>
      </header>
      <div className="px-6 py-5">
        {standings.length === 0 ? (
          <p className="text-muted-foreground text-center mt-4">
            No teams yet. Add teams on the scoreboard to see standings.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border hover:bg-transparent">
                <TableHead className="w-20 text-center text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Rank</TableHead>
                <TableHead className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Team</TableHead>
                <TableHead className="text-center text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Matches</TableHead>
                <TableHead className="text-center text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Games W-L</TableHead>
                <TableHead className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground w-44">Win %</TableHead>
                <TableHead className="text-center text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Sets W-L</TableHead>
                <TableHead className="text-center text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Set Ratio</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {standings.map((entry, index) => {
                const isLeader = index === 0 && entry.matchesPlayed > 0;
                return (
                  <TableRow
                    key={entry.team.id}
                    className={cn(
                      "matchup-row border-b border-border/60",
                      isLeader && "leader-glow"
                    )}
                  >
                    <TableCell className="text-center py-4">
                      <span className="inline-flex flex-col items-center gap-0.5">
                        <span className="num text-xl text-foreground">{index + 1}</span>
                        {isLeader && (
                          <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-[0.2em] text-primary font-bold">
                            <Trophy className="h-3 w-3" aria-hidden="true" /> Leader
                          </span>
                        )}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium py-4">
                      <span className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-primary" />
                        <span className="section-title not-italic text-lg text-foreground">{entry.team.name}</span>
                      </span>
                    </TableCell>
                    <TableCell className="text-center num text-lg">{entry.matchesPlayed}</TableCell>
                    <TableCell className="text-center num text-lg">
                      {entry.gamesWon}-{entry.gamesLost}
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-2">
                        <div
                          className="winbar-track h-1.5 w-full rounded-full overflow-hidden"
                          role="progressbar"
                          aria-valuenow={Math.round(entry.winPct * 100)}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-label={`Win percentage ${(entry.winPct * 100).toFixed(1)}%`}
                        >
                          <div className="winbar-fill h-full rounded-full" style={{ width: `${entry.winPct * 100}%` }} />
                        </div>
                        <span className="num text-sm w-12 text-right text-foreground">{(entry.winPct * 100).toFixed(0)}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center num text-lg">
                      {entry.setsWon}-{entry.setsLost}
                    </TableCell>
                    <TableCell className="text-center num text-lg">{entry.setRatio.toFixed(2)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>
    </section>
  );
}

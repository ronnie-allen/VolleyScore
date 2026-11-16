"use client";

import { useMemo, useState } from "react";
import { useScoreboardStore } from "@/store/scoreboard-store";
import { useHydrated } from "@/hooks/use-hydrated";
import { collectScoreDates } from "@/lib/scoreboard";
import { formatISODateForDisplay } from "@/lib/date";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users } from "lucide-react";

const ALL_TEAMS = "all";

export function HistoryView() {
  const hydrated = useHydrated();
  const teams = useScoreboardStore((state) => state.teams);
  const scores = useScoreboardStore((state) => state.scores);
  const [teamFilter, setTeamFilter] = useState<string>(ALL_TEAMS);

  const dates = useMemo(() => collectScoreDates(scores), [scores]);

  const visibleDates = useMemo(() => {
    if (teamFilter === ALL_TEAMS) return dates;
    const meaningful = new Set(
      scores
        .filter(
          (s) =>
            s.teamId === teamFilter &&
            (s.gamesWon > 0 || s.gamesLost > 0 || s.setsWon > 0 || s.setsLost > 0)
        )
        .map((s) => s.date)
    );
    return dates.filter((d) => meaningful.has(d));
  }, [dates, scores, teamFilter]);

  const scoreLookup = useMemo(() => {
    const map = new Map<string, (typeof scores)[number]>();
    for (const score of scores) map.set(`${score.date}:${score.teamId}`, score);
    return map;
  }, [scores]);

  const visibleTeams = useMemo(
    () => (teamFilter === ALL_TEAMS ? teams : teams.filter((t) => t.id === teamFilter)),
    [teams, teamFilter]
  );

  if (!hydrated) {
    return <p className="text-muted-foreground text-center mt-8">Loading history…</p>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-2xl">Match History</CardTitle>
            <CardDescription>All recorded match days, most recent first.</CardDescription>
          </div>
          <Select value={teamFilter} onValueChange={setTeamFilter}>
            <SelectTrigger className="w-full sm:w-56" aria-label="Filter by team">
              <SelectValue placeholder="Filter by team" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_TEAMS}>All teams</SelectItem>
              {teams.map((team) => (
                <SelectItem key={team.id} value={team.id}>
                  {team.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {visibleDates.length === 0 ? (
          <p className="text-muted-foreground text-center mt-4">
            No matches recorded yet. Scores you save on the scoreboard will appear here.
          </p>
        ) : (
          <ScrollArea className="max-h-[70vh]">
            <div className="space-y-6">
              {visibleDates.map((date) => (
                <section key={date} aria-label={`Matches on ${formatISODateForDisplay(date)}`}>
                  <h2 className="text-lg font-semibold mb-2">{formatISODateForDisplay(date)}</h2>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Team</TableHead>
                        <TableHead className="text-center">Games W</TableHead>
                        <TableHead className="text-center">Games L</TableHead>
                        <TableHead className="text-center">Sets W</TableHead>
                        <TableHead className="text-center">Sets L</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {visibleTeams.map((team) => {
                        const score = scoreLookup.get(`${date}:${team.id}`);
                        const hasData =
                          score &&
                          (score.gamesWon > 0 || score.gamesLost > 0 || score.setsWon > 0 || score.setsLost > 0);
                        if (!hasData) return null;
                        return (
                          <TableRow key={team.id}>
                            <TableCell className="font-medium">
                              <span className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                {team.name}
                              </span>
                            </TableCell>
                            <TableCell className="text-center font-mono">{score.gamesWon}</TableCell>
                            <TableCell className="text-center font-mono">{score.gamesLost}</TableCell>
                            <TableCell className="text-center font-mono">{score.setsWon}</TableCell>
                            <TableCell className="text-center font-mono">{score.setsLost}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </section>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}

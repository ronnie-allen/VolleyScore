"use client";

import { useMemo, useState } from "react";
import { useScoreboardStore } from "@/store/scoreboard-store";
import { useHydrated } from "@/hooks/use-hydrated";
import { collectScoreDates } from "@/lib/scoreboard";
import { formatISODateForDisplay } from "@/lib/date";
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
    <section aria-label="Match history" className="matchup-board rounded-xl overflow-hidden">
      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-border px-6 pt-5 pb-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.25em] text-primary font-semibold">Archive</p>
          <h1 className="section-title text-3xl leading-none text-foreground mt-1">Match History</h1>
          <p className="text-sm text-muted-foreground mt-1">All recorded match days, most recent first.</p>
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
      </header>

      <div className="px-6 py-5">
        {visibleDates.length === 0 ? (
          <p className="text-muted-foreground text-center mt-4">
            No matches recorded yet. Scores you save on the scoreboard will appear here.
          </p>
        ) : (
          <ScrollArea className="max-h-[70vh]">
            <div className="space-y-6">
              {visibleDates.map((date) => (
                <section key={date} aria-label={`Matches on ${formatISODateForDisplay(date)}`}>
                  <h2 className="num text-sm uppercase tracking-[0.2em] text-primary mb-2 border-l-2 border-primary pl-3">
                    {formatISODateForDisplay(date)}
                  </h2>
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b border-border hover:bg-transparent">
                        <TableHead className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Team</TableHead>
                        <TableHead className="text-center text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Games W</TableHead>
                        <TableHead className="text-center text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Games L</TableHead>
                        <TableHead className="text-center text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Sets W</TableHead>
                        <TableHead className="text-center text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Sets L</TableHead>
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
                          <TableRow key={team.id} className="matchup-row border-b border-border/60">
                            <TableCell className="font-medium py-3">
                              <span className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-primary" />
                                <span className="section-title not-italic text-base">{team.name}</span>
                              </span>
                            </TableCell>
                            <TableCell className="text-center num text-base">{score.gamesWon}</TableCell>
                            <TableCell className="text-center num text-base">{score.gamesLost}</TableCell>
                            <TableCell className="text-center num text-base">{score.setsWon}</TableCell>
                            <TableCell className="text-center num text-base">{score.setsLost}</TableCell>
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
      </div>
    </section>
  );
}

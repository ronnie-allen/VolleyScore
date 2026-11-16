"use client";

import React from 'react';
import type { DailyScoreRow, ScoreField } from '@/types';
import { useScoreboardStore } from '@/store/scoreboard-store';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Minus, Plus, Users } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ScoreboardTableProps {
  rows: DailyScoreRow[];
  date: string; // YYYY-MM-DD
}

const FIELD_LABELS: Record<ScoreField, string> = {
  gamesWon: 'games won',
  gamesLost: 'games lost',
  setsWon: 'sets won',
  setsLost: 'sets lost',
};

const COLUMN_HEADERS: Record<ScoreField, string> = {
  gamesWon: 'Games W',
  gamesLost: 'Games L',
  setsWon: 'Sets W',
  setsLost: 'Sets L',
};

function ScoreCounter({
  teamName,
  field,
  value,
  onChange,
}: {
  teamName: string;
  field: ScoreField;
  value: number;
  onChange: (field: ScoreField, delta: number) => void;
}) {
  const label = FIELD_LABELS[field];
  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onChange(field, -1)}
        disabled={value <= 0}
        aria-label={`Decrease ${label} for ${teamName}`}
        className="counter-pad h-8 w-8 rounded-md text-muted-foreground disabled:opacity-25"
      >
        <Minus className="h-4 w-4" strokeWidth={2.5} />
      </Button>
      <span
        className="num text-2xl w-9 text-center text-foreground"
        aria-live="polite"
      >
        {value}
      </span>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onChange(field, 1)}
        aria-label={`Increase ${label} for ${teamName}`}
        className="counter-pad h-8 w-8 rounded-md text-primary hover:text-primary"
      >
        <Plus className="h-4 w-4" strokeWidth={2.5} />
      </Button>
    </div>
  );
}

export function ScoreboardTable({ rows, date }: ScoreboardTableProps) {
  const updateScore = useScoreboardStore((state) => state.updateScore);

  const handleScoreChange = (teamId: string, field: ScoreField, delta: number) => {
    const row = rows.find((r) => r.team.id === teamId);
    const currentValue = row?.score?.[field] ?? 0;
    updateScore(teamId, date, { [field]: Math.max(0, currentValue + delta) });
  };

   if (!rows || rows.length === 0) {
      return <p className="text-muted-foreground text-center mt-10 px-6">No teams available for this date. Add a roster on the left and the matchup board lights up.</p>;
   }

  return (
     <ScrollArea className="h-full">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-border hover:bg-transparent">
            <TableHead className="w-[220px] text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Team</TableHead>
            {(['gamesWon', 'gamesLost', 'setsWon', 'setsLost'] as ScoreField[]).map((field) => (
              <TableHead key={field} className="text-center text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                {COLUMN_HEADERS[field]}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map(({ team, score }, index) => (
            <TableRow
              key={team.id}
              className="matchup-row border-b border-border/60"
              data-row-index={index}
            >
              <TableCell className="font-medium py-4">
                <span className="flex items-center gap-3">
                  <span className="num text-xs text-muted-foreground/70 w-5">{String(index + 1).padStart(2, '0')}</span>
                  <span className="flex h-9 w-9 items-center justify-center rounded-md bg-gradient-to-b from-primary/25 to-primary/5 text-primary">
                    <Users className="h-5 w-5" />
                  </span>
                  <span className="section-title not-italic text-lg text-foreground">{team.name}</span>
                </span>
              </TableCell>
              {(['gamesWon', 'gamesLost', 'setsWon', 'setsLost'] as ScoreField[]).map((field) => (
                <TableCell key={field} className="text-center py-4">
                  <ScoreCounter
                    teamName={team.name}
                    field={field}
                    value={score?.[field] ?? 0}
                    onChange={(f, delta) => handleScoreChange(team.id, f, delta)}
                  />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
     </ScrollArea>
  );
}

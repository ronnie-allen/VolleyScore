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
import { MinusCircle, PlusCircle, Users } from 'lucide-react';
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
        variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground score-update-animation"
        onClick={() => onChange(field, -1)}
        disabled={value <= 0}
        aria-label={`Decrease ${label} for ${teamName}`}
      >
        <MinusCircle className="h-4 w-4" />
      </Button>
      <span className="font-mono w-6 text-center" aria-live="polite">{value}</span>
      <Button
        variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground score-update-animation"
        onClick={() => onChange(field, 1)}
        aria-label={`Increase ${label} for ${teamName}`}
      >
        <PlusCircle className="h-4 w-4" />
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
      return <p className="text-muted-foreground text-center mt-8">No teams available for this date. Add teams or select a different date.</p>;
   }

  return (
     <ScrollArea className="h-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Team</TableHead>
            <TableHead className="text-center">Games Won</TableHead>
            <TableHead className="text-center">Games Lost</TableHead>
            <TableHead className="text-center">Sets Won</TableHead>
            <TableHead className="text-center">Sets Lost</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map(({ team, score }) => (
            <TableRow key={team.id} className="hover:bg-muted/50">
              <TableCell className="font-medium">
                <span className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  {team.name}
                </span>
              </TableCell>
              {(['gamesWon', 'gamesLost', 'setsWon', 'setsLost'] as ScoreField[]).map((field) => (
                <TableCell key={field} className="text-center">
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

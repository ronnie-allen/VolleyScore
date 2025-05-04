"use client";

import React from 'react';
import type { DailyScore } from '@/types';
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
  scores: DailyScore[];
  date: string; // YYYY-MM-DD
}

export function ScoreboardTable({ scores, date }: ScoreboardTableProps) {
  const updateScore = useScoreboardStore((state) => state.updateScore);

  const handleScoreChange = (teamId: string, field: keyof Omit<DailyScore, 'id' | 'scoreId' | 'name' | 'members' | 'teamId' | 'date'>, delta: number) => {
    const currentScore = scores.find(s => s.id === teamId); // Find by team ID here
    if (!currentScore) return;

    const currentFieldValue = currentScore[field];
    const newValue = Math.max(0, currentFieldValue + delta); // Ensure score doesn't go below 0

    updateScore(teamId, date, { [field]: newValue });
  };

   if (!scores || scores.length === 0) {
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
          {scores.map((score) => (
            <TableRow key={score.id} className="hover:bg-muted/50">
              <TableCell className="font-medium flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                {score.name}
              </TableCell>
              {/* Games Won */}
              <TableCell className="text-center">
                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground score-update-animation"
                    onClick={() => handleScoreChange(score.id, 'gamesWon', -1)}
                    disabled={score.gamesWon <= 0}
                    aria-label={`Decrease games won for ${score.name}`}
                  >
                    <MinusCircle className="h-4 w-4" />
                  </Button>
                  <span className="font-mono w-6 text-center">{score.gamesWon}</span>
                  <Button
                    variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground score-update-animation"
                    onClick={() => handleScoreChange(score.id, 'gamesWon', 1)}
                    aria-label={`Increase games won for ${score.name}`}
                 >
                    <PlusCircle className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
              {/* Games Lost */}
              <TableCell className="text-center">
                 <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground score-update-animation"
                    onClick={() => handleScoreChange(score.id, 'gamesLost', -1)}
                    disabled={score.gamesLost <= 0}
                    aria-label={`Decrease games lost for ${score.name}`}
                 >
                    <MinusCircle className="h-4 w-4" />
                  </Button>
                  <span className="font-mono w-6 text-center">{score.gamesLost}</span>
                  <Button
                    variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground score-update-animation"
                    onClick={() => handleScoreChange(score.id, 'gamesLost', 1)}
                     aria-label={`Increase games lost for ${score.name}`}
                 >
                    <PlusCircle className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
               {/* Sets Won */}
              <TableCell className="text-center">
                <div className="flex items-center justify-center gap-2">
                   <Button
                    variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground score-update-animation"
                    onClick={() => handleScoreChange(score.id, 'setsWon', -1)}
                    disabled={score.setsWon <= 0}
                    aria-label={`Decrease sets won for ${score.name}`}
                 >
                    <MinusCircle className="h-4 w-4" />
                  </Button>
                  <span className="font-mono w-6 text-center">{score.setsWon}</span>
                   <Button
                    variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground score-update-animation"
                    onClick={() => handleScoreChange(score.id, 'setsWon', 1)}
                    aria-label={`Increase sets won for ${score.name}`}
                 >
                    <PlusCircle className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
              {/* Sets Lost */}
              <TableCell className="text-center">
                 <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground score-update-animation"
                    onClick={() => handleScoreChange(score.id, 'setsLost', -1)}
                    disabled={score.setsLost <= 0}
                    aria-label={`Decrease sets lost for ${score.name}`}
                 >
                    <MinusCircle className="h-4 w-4" />
                  </Button>
                  <span className="font-mono w-6 text-center">{score.setsLost}</span>
                   <Button
                    variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground score-update-animation"
                    onClick={() => handleScoreChange(score.id, 'setsLost', 1)}
                     aria-label={`Increase sets lost for ${score.name}`}
                 >
                    <PlusCircle className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
     </ScrollArea>
  );
}
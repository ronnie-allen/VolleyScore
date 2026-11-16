"use client";

import React, { useMemo } from 'react';
import { useScoreboardStore } from '@/store/scoreboard-store';
import { DatePicker } from '@/components/scoreboard/date-picker';
import { ScoreboardTable } from '@/components/scoreboard/scoreboard-table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useHydrated } from '@/hooks/use-hydrated';
import { buildDailyRows } from '@/lib/scoreboard';
import { formatISODateForDisplay, parseISODateLocal } from '@/lib/date';

export function Scoreboard() {
  const hydrated = useHydrated();
  const teams = useScoreboardStore((state) => state.teams);
  const scores = useScoreboardStore((state) => state.scores);
  const selectedDate = useScoreboardStore((state) => state.selectedDate);
  const setSelectedDate = useScoreboardStore((state) => state.setSelectedDate);

  const rows = useMemo(
    () => buildDailyRows(teams, scores, selectedDate),
    [teams, scores, selectedDate]
  );

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  const formattedDate = selectedDate ? formatISODateForDisplay(selectedDate) : 'Select a date';

  return (
    <Card className="h-full flex flex-col">
        <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <CardTitle className="text-2xl">Scoreboard</CardTitle>
                    <CardDescription>Scores for {formattedDate}</CardDescription>
                </div>
                <DatePicker
                    selectedDate={selectedDate ? parseISODateLocal(selectedDate) : undefined}
                    onDateSelect={handleDateSelect}
                />
            </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden">
             {hydrated ? (
               <ScoreboardTable rows={rows} date={selectedDate} />
             ) : (
               <p className="text-muted-foreground text-center mt-8">Loading scoreboard…</p>
             )}
        </CardContent>
    </Card>
  );
}

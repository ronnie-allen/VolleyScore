"use client";

import React, { useMemo } from 'react';
import { useScoreboardStore } from '@/store/scoreboard-store';
import { DatePicker } from '@/components/scoreboard/date-picker';
import { ScoreboardTable } from '@/components/scoreboard/scoreboard-table';
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
    <section
      aria-label={`Matchup board for ${formattedDate}`}
      className="matchup-board h-full flex flex-col rounded-xl overflow-hidden"
    >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border px-6 pt-5 pb-4">
            <div>
                <p className="text-[11px] uppercase tracking-[0.25em] text-primary font-semibold">Matchup Board</p>
                <h1 className="section-title text-3xl leading-none mt-1 text-foreground">
                  Scoreboard
                </h1>
                <p className="text-sm text-muted-foreground mt-1">{formattedDate}</p>
            </div>
            <DatePicker
                selectedDate={selectedDate ? parseISODateLocal(selectedDate) : undefined}
                onDateSelect={handleDateSelect}
            />
        </div>
        <div className="flex-1 overflow-hidden">
             {hydrated ? (
               <ScoreboardTable rows={rows} date={selectedDate} />
             ) : (
               <p className="text-muted-foreground text-center mt-10">Loading scoreboard…</p>
             )}
        </div>
    </section>
  );
}

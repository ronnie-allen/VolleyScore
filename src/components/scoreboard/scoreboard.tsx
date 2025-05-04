"use client";

import React from 'react';
import { useScoreboardStore } from '@/store/scoreboard-store';
import { DatePicker } from '@/components/scoreboard/date-picker';
import { ScoreboardTable } from '@/components/scoreboard/scoreboard-table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { format } from 'date-fns';

export function Scoreboard() {
  const selectedDate = useScoreboardStore((state) => state.selectedDate);
  const setSelectedDate = useScoreboardStore((state) => state.setSelectedDate);
  const scoresForSelectedDate = useScoreboardStore((state) => state.getScoresForDate(state.selectedDate));

  // Handle date selection from DatePicker
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  // Format date for display
  const formattedDate = selectedDate ? format(new Date(selectedDate), 'PPP') : 'Select a date'; // e.g., Oct 26, 2023

  return (
    <Card className="h-full flex flex-col">
        <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <CardTitle className="text-2xl">Scoreboard</CardTitle>
                    <CardDescription>Scores for {formattedDate}</CardDescription>
                </div>
                <DatePicker
                    selectedDate={selectedDate ? new Date(selectedDate) : undefined}
                    onDateSelect={handleDateSelect}
                />
            </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden">
             <ScoreboardTable scores={scoresForSelectedDate} date={selectedDate} />
        </CardContent>
    </Card>
  );
}
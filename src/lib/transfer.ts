import { z } from 'zod';
import type { ExportData, Score, Team } from '@/types';
import { isValidISODate } from '@/lib/date';
import { SCORE_FIELDS } from '@/lib/scoreboard';
import { STORAGE_VERSION } from '@/store/scoreboard-store';

const teamSchema = z.object({
  id: z.string().min(1).max(100),
  name: z.string().trim().min(1).max(100),
  members: z.array(z.string().trim().max(100)).max(100).default([]),
});

const scoreSchema = z.object({
  id: z.string().min(1).max(100),
  teamId: z.string().min(1).max(100),
  date: z.string().refine(isValidISODate, 'date must be YYYY-MM-DD'),
  gamesWon: z.number().int().min(0).max(9999),
  gamesLost: z.number().int().min(0).max(9999),
  setsWon: z.number().int().min(0).max(9999),
  setsLost: z.number().int().min(0).max(9999),
});

const exportSchema = z.object({
  version: z.number().int().optional(),
  exportedAt: z.string().optional(),
  teams: z.array(teamSchema).max(1000),
  scores: z.array(scoreSchema).max(100000),
});

export interface ImportResult {
  teams: Team[];
  scores: Score[];
}

// Parse and validate an export payload. Throws with a human-readable message on failure.
export function parseExportData(raw: unknown): ImportResult {
  const parsed = exportSchema.parse(raw);

  const teamIds = new Set<string>();
  for (const team of parsed.teams) {
    if (teamIds.has(team.id)) throw new Error(`Duplicate team id in import: ${team.id}`);
    teamIds.add(team.id);
  }

  // Drop scores that reference unknown teams and duplicate score ids.
  const validScores = parsed.scores.filter((score) => teamIds.has(score.teamId));

  const scoreIds = new Set<string>();
  const deduped = validScores.filter((score) => {
    if (scoreIds.has(score.id)) return false;
    scoreIds.add(score.id);
    return true;
  });

  return {
    teams: parsed.teams.map((t) => ({ ...t, members: t.members ?? [] })),
    scores: deduped.filter((s) => SCORE_FIELDS.every((f) => Number.isFinite(s[f]))),
  };
}

export function buildExportData(teams: Team[], scores: Score[]): ExportData {
  return {
    version: STORAGE_VERSION,
    exportedAt: new Date().toISOString(),
    teams,
    scores,
  };
}

export function serializeExportData(teams: Team[], scores: Score[]): string {
  return JSON.stringify(buildExportData(teams, scores), null, 2);
}

import { describe, expect, it } from 'vitest';
import {
  formatISODateForDisplay,
  isValidISODate,
  parseISODateLocal,
  toISODateLocal,
  todayISODate,
} from '@/lib/date';

describe('toISODateLocal', () => {
  it('formats using the local calendar date', () => {
    expect(toISODateLocal(new Date(2026, 0, 5))).toBe('2026-01-05');
    expect(toISODateLocal(new Date(2026, 10, 16))).toBe('2026-11-16');
  });
});

describe('parseISODateLocal', () => {
  it('parses YYYY-MM-DD as a local date', () => {
    const d = parseISODateLocal('2026-11-16');
    expect(d.getFullYear()).toBe(2026);
    expect(d.getMonth()).toBe(10);
    expect(d.getDate()).toBe(16);
  });

  it('round-trips with toISODateLocal', () => {
    expect(toISODateLocal(parseISODateLocal('2024-02-29'))).toBe('2024-02-29');
  });
});

describe('isValidISODate', () => {
  it('accepts valid dates', () => {
    expect(isValidISODate('2026-11-16')).toBe(true);
    expect(isValidISODate('2024-02-29')).toBe(true);
  });

  it('rejects malformed or impossible dates', () => {
    expect(isValidISODate('2026-13-01')).toBe(false);
    expect(isValidISODate('2026-02-30')).toBe(false);
    expect(isValidISODate('11/16/2026')).toBe(false);
    expect(isValidISODate('2026-1-5')).toBe(false);
    expect(isValidISODate('')).toBe(false);
    expect(isValidISODate(123)).toBe(false);
    expect(isValidISODate(undefined)).toBe(false);
  });
});

describe('todayISODate', () => {
  it('returns a valid ISO date string', () => {
    expect(isValidISODate(todayISODate())).toBe(true);
  });
});

describe('formatISODateForDisplay', () => {
  it('renders a human readable date', () => {
    expect(formatISODateForDisplay('2026-11-16')).toBe('November 16th, 2026');
  });
});

import { format } from 'date-fns';

// Format a Date as YYYY-MM-DD using its *local* calendar date.
export function toISODateLocal(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// Parse a YYYY-MM-DD string as a local calendar date (not UTC).
export function parseISODateLocal(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

export function todayISODate(): string {
  return toISODateLocal(new Date());
}

export function isValidISODate(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = parseISODateLocal(value);
  return !Number.isNaN(parsed.getTime()) && toISODateLocal(parsed) === value;
}

export function formatISODateForDisplay(iso: string): string {
  return format(parseISODateLocal(iso), 'PPP');
}

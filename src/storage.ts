import type { RepairCase } from './types';
import { SAMPLE_CASES, STORAGE_KEY, STORAGE_SEEDED_KEY } from './data';

// ── Seed on first launch ─────────────────────────────────────────────────────

export function seedIfNeeded(): void {
  const seeded = localStorage.getItem(STORAGE_SEEDED_KEY);
  if (!seeded) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_CASES));
    localStorage.setItem(STORAGE_SEEDED_KEY, 'true');
  }
}

// Auto-seed immediately so data is available before first render
seedIfNeeded();

// ── CRUD ─────────────────────────────────────────────────────────────────────

export function getAllCases(): RepairCase[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as RepairCase[];
  } catch {
    return [];
  }
}

export function saveCase(newCase: RepairCase): void {
  const cases = getAllCases();
  cases.unshift(newCase);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cases));
}

export function clearAllData(): void {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(STORAGE_SEEDED_KEY);
  seedIfNeeded();
}

// ── ID generator ─────────────────────────────────────────────────────────────

export function generateId(): string {
  return 'case_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

// ── Recent cases (last 4) ─────────────────────────────────────────────────────

export function getRecentCases(count = 4): RepairCase[] {
  const cases = getAllCases();
  return cases.slice(0, count);
}

// ── Simple local search (fallback / demo mode) ────────────────────────────────

export function localSearch(query: string): RepairCase[] {
  const cases = getAllCases();
  const q = query.toLowerCase();
  const tokens = q.split(/\s+/).filter(t => t.length > 2);

  const scored = cases.map(c => {
    const haystack = [c.brand, c.model, c.category, c.symptoms, c.solution, c.steps]
      .join(' ')
      .toLowerCase();
    const score = tokens.reduce((acc, t) => acc + (haystack.includes(t) ? 1 : 0), 0);
    return { c, score };
  });

  return scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(s => s.c);
}

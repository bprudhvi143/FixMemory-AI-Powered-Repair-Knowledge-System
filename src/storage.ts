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

// ── In-Memory Cache for ORA cases ───────────────────────────────────────────
let cachedOraCases: RepairCase[] = [];

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

// ── Fetch ORA cases from Backend ────────────────────────────────────────────

export async function fetchOraCases(): Promise<RepairCase[]> {
  try {
    const res = await fetch('/api/cases/ora?limit=500');
    if (!res.ok) return cachedOraCases;
    const data = await res.json();
    if (data && Array.isArray(data.cases)) {
      cachedOraCases = data.cases.map((c: any) => ({
        id: c.id,
        brand: c.brand,
        model: c.model || null,
        category: c.device_category || 'Computer',
        device_category: c.device_category,
        symptoms: c.symptoms,
        steps: c.troubleshooting_steps || null,
        solution: c.final_solution || null,
        sourceType: 'ora_public_dataset',
        verificationStatus: c.verification_status || 'not_independently_verified',
        createdAt: c.import_timestamp || c.created_at || new Date().toISOString(),
        externalSourceId: c.external_source_id,
        repairStatus: c.repair_status,
        repairStatusRaw: c.repair_status_raw,
        repairBarrier: c.repair_barrier,
        country: c.country,
        eventDate: c.event_date,
        sourceProvider: c.source_provider,
        datasetRelease: c.dataset_release || 'Open Repair Alliance Open Data',
        license: c.license || 'CC BY-SA 4.0',
      }));
    }
    return cachedOraCases;
  } catch (err) {
    console.warn('Could not fetch ORA cases from backend:', err);
    return cachedOraCases;
  }
}

export async function getAllCasesWithOra(): Promise<RepairCase[]> {
  const localCases = getAllCases();
  const oraCases = await fetchOraCases();
  return [...localCases, ...oraCases];
}

// ── Simple local search (fallback / demo mode) ────────────────────────────────

export function localSearch(query: string, externalCases: RepairCase[] = []): RepairCase[] {
  const local = getAllCases();
  const allCases = [...local, ...(externalCases.length ? externalCases : cachedOraCases)];

  const q = query.toLowerCase();
  const tokens = q.split(/\s+/).filter(t => t.length > 2);

  const scored = allCases.map(c => {
    const haystack = [
      c.brand,
      c.model,
      c.category,
      c.device_category,
      c.symptoms,
      c.solution,
      c.steps,
      c.repairStatus,
      c.country,
    ]
      .filter(Boolean)
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

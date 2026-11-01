import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const LOCAL_ORA_FILE = path.join(DATA_DIR, 'ora_cases.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// ── Supabase Configuration ──────────────────────────────────────────────────
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_KEY);

let supabaseClient = null;
if (isSupabaseConfigured) {
  try {
    supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);
    console.log('⚡ Connected to Supabase PostgreSQL');
  } catch (err) {
    console.warn('⚠️ Failed to initialize Supabase client:', err.message);
  }
} else {
  console.log('ℹ️ Supabase credentials not found — using Local Test Mode for ORA records.');
}

// ── Local Test Store Helpers ────────────────────────────────────────────────
function readLocalOraCases() {
  if (!fs.existsSync(LOCAL_ORA_FILE)) {
    return [];
  }
  try {
    const raw = fs.readFileSync(LOCAL_ORA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading local ORA file:', err);
    return [];
  }
}

function writeLocalOraCases(cases) {
  fs.writeFileSync(LOCAL_ORA_FILE, JSON.stringify(cases, null, 2), 'utf-8');
}

// ── Database Operations ─────────────────────────────────────────────────────

/**
 * Get storage metadata / mode
 */
export function getStorageMode() {
  return {
    mode: isSupabaseConfigured ? 'supabase_postgresql' : 'local_test_mode',
    isSupabaseConfigured,
    localFilePath: !isSupabaseConfigured ? LOCAL_ORA_FILE : null,
  };
}

/**
 * Fetch all ORA records from storage
 */
export async function getOraCases(filters = {}) {
  const { category, country, brand, limit = 500, offset = 0 } = filters;

  if (isSupabaseConfigured && supabaseClient) {
    let query = supabaseClient
      .from('repair_cases')
      .select('*')
      .eq('source_type', 'ora_public_dataset');

    if (category) query = query.ilike('device_category', `%${category}%`);
    if (country && country !== 'all') query = query.eq('country', country);
    if (brand) query = query.ilike('brand', `%${brand}%`);

    query = query.range(offset, offset + limit - 1).order('created_at', { ascending: false });

    const { data, error } = await query;
    if (error) {
      console.error('Supabase query error:', error);
      throw error;
    }
    return data || [];
  }

  // Fallback: Local Test Mode
  let cases = readLocalOraCases();

  if (category) {
    const catLower = category.toLowerCase();
    cases = cases.filter(c => (c.device_category || '').toLowerCase().includes(catLower));
  }
  if (country && country !== 'all') {
    cases = cases.filter(c => (c.country || '').toUpperCase() === country.toUpperCase());
  }
  if (brand) {
    const bLower = brand.toLowerCase();
    cases = cases.filter(c => (c.brand || '').toLowerCase().includes(bLower));
  }

  return cases.slice(offset, offset + limit);
}

/**
 * Get count of ORA records
 */
export async function getOraCount() {
  if (isSupabaseConfigured && supabaseClient) {
    const { count, error } = await supabaseClient
      .from('repair_cases')
      .select('*', { count: 'exact', head: true })
      .eq('source_type', 'ora_public_dataset');
    if (error) throw error;
    return count || 0;
  }
  return readLocalOraCases().length;
}

/**
 * Check if external source IDs already exist
 */
export async function checkExistingOraIds(externalIds = []) {
  if (!externalIds.length) return new Set();

  if (isSupabaseConfigured && supabaseClient) {
    const { data, error } = await supabaseClient
      .from('repair_cases')
      .select('external_source_id')
      .eq('source_type', 'ora_public_dataset')
      .in('external_source_id', externalIds);

    if (error) {
      console.error('Error checking existing IDs in Supabase:', error);
      throw error;
    }
    return new Set(data.map(d => String(d.external_source_id)));
  }

  const existing = readLocalOraCases();
  const existingSet = new Set(existing.map(c => String(c.external_source_id)));
  return new Set(externalIds.filter(id => existingSet.has(String(id))));
}

/**
 * Insert batch of ORA records (skipping duplicates)
 */
export async function insertOraBatch(records = []) {
  if (!records.length) return { inserted: 0, duplicates: 0 };

  if (isSupabaseConfigured && supabaseClient) {
    // Supabase upsert / ignore duplicates via unique constraint
    const { data, error } = await supabaseClient
      .from('repair_cases')
      .upsert(records, { onConflict: 'source_type,external_source_id', ignoreDuplicates: true })
      .select('id');

    if (error) {
      console.error('Supabase insert error:', error);
      throw error;
    }
    return { inserted: data ? data.length : records.length, duplicates: 0 };
  }

  // Local Test Mode: Deduplicate and append
  const existing = readLocalOraCases();
  const existingMap = new Map();
  for (const c of existing) {
    existingMap.set(String(c.external_source_id), c);
  }

  let insertedCount = 0;
  let dupCount = 0;

  for (const r of records) {
    const idKey = String(r.external_source_id);
    if (existingMap.has(idKey)) {
      dupCount++;
    } else {
      existingMap.set(idKey, r);
      insertedCount++;
    }
  }

  writeLocalOraCases(Array.from(existingMap.values()));
  return { inserted: insertedCount, duplicates: dupCount };
}

/**
 * Clear local ORA test records
 */
export function clearLocalOraData() {
  if (fs.existsSync(LOCAL_ORA_FILE)) {
    fs.unlinkSync(LOCAL_ORA_FILE);
  }
}


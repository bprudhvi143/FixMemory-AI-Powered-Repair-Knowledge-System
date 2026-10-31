// ── Data Types ─────────────────────────────────────────────────────────────

export type SourceType = 'sample' | 'technician';

export type ProblemCategory =
  | 'Power / Boot'
  | 'Overheating'
  | 'Display'
  | 'Keyboard / Input'
  | 'Wi-Fi / Network'
  | 'Storage / OS'
  | 'Battery'
  | 'USB / Ports'
  | 'Audio'
  | 'Other';

export interface RepairCase {
  id: string;
  brand: string;
  model: string;
  category: ProblemCategory;
  symptoms: string;
  steps: string;
  solution: string;
  sourceType: SourceType;
  createdAt: string; // ISO date string
}

// ── AI Result Types ─────────────────────────────────────────────────────────

export interface AIMatch {
  case_id: string;
  device_model: string;
  symptoms: string;
  solution: string;
  relevance_reason: string;
}

export interface AIResult {
  problem_summary: string;
  possible_causes: string[];
  matches: AIMatch[];
  no_match: boolean;
  additional_information_needed: string[];
}

// ── Language Types ──────────────────────────────────────────────────────────

export type Language = 'en' | 'te';

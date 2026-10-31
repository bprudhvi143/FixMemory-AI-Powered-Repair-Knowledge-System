// ── Data Types ─────────────────────────────────────────────────────────────

export type SourceType = 'sample' | 'technician' | 'ora_public_dataset';

export type VerificationStatus =
  | 'sample'
  | 'technician_submitted'
  | 'verified'
  | 'not_independently_verified';

export type RepairStatus = 'Fixed' | 'Repairable' | 'End of life' | 'Unknown';

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
  | 'Laptop'
  | 'Desktop computer'
  | 'Other';

export interface RepairCase {
  id: string;
  brand: string;
  model?: string | null;
  category: ProblemCategory | string;
  device_category?: string;
  symptoms: string;
  steps?: string | null;
  solution?: string | null;
  sourceType: SourceType;
  verificationStatus?: VerificationStatus;
  createdAt: string; // ISO date string

  // Open Repair Alliance (ORDS) specific fields
  externalSourceId?: string | null;
  repairStatus?: RepairStatus | string;
  repairStatusRaw?: string;
  repairBarrier?: string | null;
  country?: string | null;
  eventDate?: string | null;
  sourceProvider?: string | null;
  datasetRelease?: string;
  license?: string;
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

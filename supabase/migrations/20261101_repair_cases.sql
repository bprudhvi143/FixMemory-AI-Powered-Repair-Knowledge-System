-- Migration: 20261101_repair_cases.sql
-- FixMemory schema for repair cases supporting Sample, Technician, and Open Repair Alliance (ORA) datasets.

CREATE TABLE IF NOT EXISTS repair_cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_source_id TEXT,
  source_type TEXT NOT NULL CHECK (source_type IN ('sample', 'technician', 'ora_public_dataset')),
  verification_status TEXT NOT NULL DEFAULT 'not_independently_verified'
    CHECK (verification_status IN ('sample', 'technician_submitted', 'verified', 'not_independently_verified')),
  
  -- Normalised Device and Repair Details
  brand TEXT NOT NULL,
  model TEXT, -- May be null for ORA records
  device_category TEXT NOT NULL,
  symptoms TEXT NOT NULL,
  troubleshooting_steps TEXT, -- May be null for ORA records
  final_solution TEXT, -- May be null for ORA records
  
  -- Open Repair Data Standard (ORDS) Fields
  repair_status TEXT, -- 'Fixed', 'Repairable', 'End of life', 'Unknown'
  repair_status_raw TEXT, -- Original code: '1', '2', '3', '0'
  repair_barrier TEXT, -- Barrier if end of life
  country TEXT, -- ISO country code (e.g. 'IN', 'GB', 'US')
  event_date DATE,
  source_provider TEXT, -- Community group / partner
  
  -- Dataset Provenance & Licensing
  dataset_release TEXT DEFAULT 'Open Repair Alliance Open Data',
  license TEXT DEFAULT 'CC BY-SA 4.0',
  dataset_source_url TEXT DEFAULT 'https://openrepair.org/open-data/downloads/',
  import_timestamp TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  -- Unique constraint to prevent duplicate imports for external sources
  CONSTRAINT unique_source_external_id UNIQUE (source_type, external_source_id)
);

-- Indexes for efficient symptom search and filtering
CREATE INDEX IF NOT EXISTS idx_repair_cases_source_type ON repair_cases(source_type);
CREATE INDEX IF NOT EXISTS idx_repair_cases_device_category ON repair_cases(device_category);
CREATE INDEX IF NOT EXISTS idx_repair_cases_brand ON repair_cases(brand);
CREATE INDEX IF NOT EXISTS idx_repair_cases_country ON repair_cases(country);
CREATE INDEX IF NOT EXISTS idx_repair_cases_repair_status ON repair_cases(repair_status);

-- Comments for documentation and data trust
COMMENT ON TABLE repair_cases IS 'Consolidated repair repository storing technician fixes and Open Repair Alliance records.';
COMMENT ON COLUMN repair_cases.verification_status IS 'Specifies whether the case is verified, technician-submitted, sample, or not independently verified.';
COMMENT ON COLUMN repair_cases.repair_status IS 'Normalised repair outcome (Fixed, Repairable, End of life, Unknown).';


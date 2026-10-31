import { parse } from 'csv-parse';
import fs from 'fs';
import crypto from 'crypto';
import { checkExistingOraIds, insertOraBatch } from './db.js';

// ── Status Normalisation ────────────────────────────────────────────────────
export function mapRepairStatus(rawStatus) {
  const str = String(rawStatus ?? '').trim();
  switch (str) {
    case '1':
    case 'Fixed':
    case 'fixed':
      return { status: 'Fixed', raw: str };
    case '2':
    case 'Repairable':
    case 'repairable':
      return { status: 'Repairable', raw: str };
    case '3':
    case 'End of life':
    case 'end of life':
    case 'EOL':
      return { status: 'End of life', raw: str };
    case '0':
    case 'Unknown':
    case '':
    default:
      return { status: 'Unknown', raw: str || '0' };
  }
}

// ── Header Normalisation ────────────────────────────────────────────────────
function normaliseHeader(header) {
  return String(header || '')
    .trim()
    .toLowerCase()
    .replace(/[\s\-_]+/g, '_');
}

// ── Category Matching ───────────────────────────────────────────────────────
export function matchesDeviceCategory(categoryStr, targetCategories = ['laptop', 'desktop']) {
  if (!categoryStr) return false;
  const c = categoryStr.toLowerCase();

  const isLaptop =
    c.includes('laptop') ||
    c.includes('notebook') ||
    c.includes('chromebook') ||
    c.includes('macbook') ||
    c.includes('portable computer');

  const isDesktop =
    c.includes('desktop') ||
    c.includes('desktop computer') ||
    c.includes('tower pc') ||
    c.includes('all-in-one');

  const allowed = targetCategories.map(t => t.toLowerCase().replace(/[^a-z]/g, ''));

  if (allowed.includes('all') || allowed.length === 0) {
    return isLaptop || isDesktop;
  }
  if (allowed.some(a => a.includes('laptop')) && isLaptop) return true;
  if (allowed.some(a => a.includes('desktop')) && isDesktop) return true;

  return false;
}

// ── Header Mapping ──────────────────────────────────────────────────────────
function findColumnKey(headers, aliases) {
  for (const alias of aliases) {
    const found = headers.find(h => h.norm === alias);
    if (found) return found.original;
  }
  return null;
}

export function detectColumnMapping(rawHeaders) {
  const headers = rawHeaders.map(h => ({ original: h, norm: normaliseHeader(h) }));

  const idCol = findColumnKey(headers, ['id', 'case_id', 'external_source_id', 'partner_product_id', 'record_id']);
  const categoryCol = findColumnKey(headers, ['product_category', 'category', 'product_type', 'device_category', 'product']);
  const brandCol = findColumnKey(headers, ['brand', 'manufacturer', 'make']);
  const problemCol = findColumnKey(headers, ['problem', 'symptoms', 'fault', 'issue_description', 'problem_description', 'defect']);
  const statusCol = findColumnKey(headers, ['repair_status', 'status', 'outcome', 'result', 'repair_result']);
  const barrierCol = findColumnKey(headers, ['repair_barrier_if_end_of_life', 'repair_barrier', 'barrier', 'reason_eol']);
  const countryCol = findColumnKey(headers, ['country', 'country_code', 'nation']);
  const dateCol = findColumnKey(headers, ['event_date', 'date', 'repair_date', 'timestamp']);
  const providerCol = findColumnKey(headers, ['data_provider', 'provider', 'partner', 'partner_name', 'group']);

  return {
    idCol,
    categoryCol,
    brandCol,
    problemCol,
    statusCol,
    barrierCol,
    countryCol,
    dateCol,
    providerCol,
  };
}

// ── Preview CSV ─────────────────────────────────────────────────────────────
/**
 * Streams the CSV file, counts statistics, and returns the first 10 valid preview rows.
 */
export async function previewOraCsv(filePath, options = {}) {
  const {
    categories = ['laptop', 'desktop'],
    country = 'all',
  } = options;

  let totalRows = 0;
  let filteredRows = 0;
  let invalidRows = 0;
  let duplicateCount = 0;

  const previewItems = [];
  const candidateIds = new Set();
  const fileSeenIds = new Set();

  return new Promise((resolve, reject) => {
    let headersDetected = false;
    let mapping = null;

    const parser = parse({
      columns: true,
      skip_empty_lines: true,
      relax_column_count: true,
      trim: true,
    });

    fs.createReadStream(filePath)
      .pipe(parser)
      .on('data', (record) => {
        totalRows++;

        if (!headersDetected) {
          headersDetected = true;
          mapping = detectColumnMapping(Object.keys(record));
        }

        const rawId = mapping.idCol ? record[mapping.idCol] : null;
        const rawCategory = mapping.categoryCol ? record[mapping.categoryCol] : null;
        const rawBrand = mapping.brandCol ? record[mapping.brandCol] : null;
        const rawProblem = mapping.problemCol ? record[mapping.problemCol] : null;
        const rawStatus = mapping.statusCol ? record[mapping.statusCol] : null;
        const rawBarrier = mapping.barrierCol ? record[mapping.barrierCol] : null;
        const rawCountry = mapping.countryCol ? record[mapping.countryCol] : null;
        const rawDate = mapping.dateCol ? record[mapping.dateCol] : null;
        const rawProvider = mapping.providerCol ? record[mapping.providerCol] : null;

        // Validation: Required fields
        if (!rawId || !rawCategory || !rawBrand || !rawProblem) {
          invalidRows++;
          return;
        }

        // Category filter
        if (!matchesDeviceCategory(rawCategory, categories)) {
          return;
        }

        // Country filter
        if (country && country.toLowerCase() !== 'all') {
          if ((rawCountry || '').toUpperCase() !== country.toUpperCase()) {
            return;
          }
        }

        const idStr = String(rawId).trim();

        // In-file duplicate check
        if (fileSeenIds.has(idStr)) {
          duplicateCount++;
          return;
        }
        fileSeenIds.add(idStr);
        candidateIds.add(idStr);
        filteredRows++;

        // Collect preview of first 10 records
        if (previewItems.length < 10) {
          const mappedStatus = mapRepairStatus(rawStatus);
          previewItems.push({
            external_source_id: idStr,
            device_category: rawCategory,
            brand: rawBrand,
            symptoms: rawProblem,
            model: null,
            troubleshooting_steps: null,
            root_cause: null,
            final_solution: null,
            repair_status: mappedStatus.status,
            repair_status_raw: mappedStatus.raw,
            repair_barrier: rawBarrier || null,
            country: (rawCountry || '').toUpperCase() || null,
            event_date: rawDate || null,
            source_provider: rawProvider || null,
            source_type: 'ora_public_dataset',
            verification_status: 'not_independently_verified',
            dataset_release: 'Open Repair Alliance Open Data',
            license: 'CC BY-SA 4.0',
          });
        }
      })
      .on('end', async () => {
        try {
          // Check for existing duplicates in storage
          const existingInDb = await checkExistingOraIds(Array.from(candidateIds));
          const dbDuplicates = existingInDb.size;

          resolve({
            totalRows,
            filteredRows,
            invalidRows,
            duplicateRows: duplicateCount + dbDuplicates,
            preview: previewItems,
            columnMapping: mapping,
          });
        } catch (err) {
          reject(err);
        }
      })
      .on('error', (err) => {
        reject(err);
      });
  });
}

// ── Import CSV ──────────────────────────────────────────────────────────────
/**
 * Streams the CSV, filters records, maps fields strictly, and batch-inserts into storage.
 */
export async function importOraCsv(filePath, options = {}) {
  const {
    categories = ['laptop', 'desktop'],
    country = 'all',
    maxRecords = null, // for testing: e.g. 20, 100, 500
  } = options;

  let totalRows = 0;
  let filteredRows = 0;
  let invalidRows = 0;
  let duplicateCount = 0;
  let totalInserted = 0;

  const BATCH_SIZE = 100;
  let currentBatch = [];
  const fileSeenIds = new Set();

  return new Promise((resolve, reject) => {
    let headersDetected = false;
    let mapping = null;
    let isStreamPaused = false;

    const parser = parse({
      columns: true,
      skip_empty_lines: true,
      relax_column_count: true,
      trim: true,
    });

    const stream = fs.createReadStream(filePath).pipe(parser);

    async function flushBatch() {
      if (!currentBatch.length) return;
      const batchToInsert = [...currentBatch];
      currentBatch = [];

      try {
        const result = await insertOraBatch(batchToInsert);
        totalInserted += result.inserted;
        duplicateCount += result.duplicates;
      } catch (err) {
        console.error('Batch insert error:', err);
      }
    }

    stream.on('data', async (record) => {
      totalRows++;

      if (!headersDetected) {
        headersDetected = true;
        mapping = detectColumnMapping(Object.keys(record));
      }

      if (maxRecords && totalInserted + currentBatch.length >= maxRecords) {
        stream.destroy();
        return;
      }

      const rawId = mapping.idCol ? record[mapping.idCol] : null;
      const rawCategory = mapping.categoryCol ? record[mapping.categoryCol] : null;
      const rawBrand = mapping.brandCol ? record[mapping.brandCol] : null;
      const rawProblem = mapping.problemCol ? record[mapping.problemCol] : null;
      const rawStatus = mapping.statusCol ? record[mapping.statusCol] : null;
      const rawBarrier = mapping.barrierCol ? record[mapping.barrierCol] : null;
      const rawCountry = mapping.countryCol ? record[mapping.countryCol] : null;
      const rawDate = mapping.dateCol ? record[mapping.dateCol] : null;
      const rawProvider = mapping.providerCol ? record[mapping.providerCol] : null;

      if (!rawId || !rawCategory || !rawBrand || !rawProblem) {
        invalidRows++;
        return;
      }

      if (!matchesDeviceCategory(rawCategory, categories)) {
        return;
      }

      if (country && country.toLowerCase() !== 'all') {
        if ((rawCountry || '').toUpperCase() !== country.toUpperCase()) {
          return;
        }
      }

      const idStr = String(rawId).trim();
      if (fileSeenIds.has(idStr)) {
        duplicateCount++;
        return;
      }
      fileSeenIds.add(idStr);
      filteredRows++;

      const mappedStatus = mapRepairStatus(rawStatus);

      // Section 3: Data Mapping with null for unavailable fields
      const normalCase = {
        id: `ora_${idStr}`,
        external_source_id: idStr,
        source_type: 'ora_public_dataset',
        verification_status: 'not_independently_verified',
        brand: String(rawBrand).trim(),
        model: null, // unavailable in ORA
        device_category: String(rawCategory).trim(),
        symptoms: String(rawProblem).trim(),
        troubleshooting_steps: null, // unavailable in ORA
        root_cause: null, // unavailable in ORA
        final_solution: null, // unavailable in ORA
        repair_status: mappedStatus.status,
        repair_status_raw: mappedStatus.raw,
        repair_barrier: rawBarrier ? String(rawBarrier).trim() : null,
        country: rawCountry ? String(rawCountry).trim().toUpperCase() : null,
        event_date: rawDate ? String(rawDate).trim() : null,
        source_provider: rawProvider ? String(rawProvider).trim() : null,
        dataset_release: 'Open Repair Alliance Open Data',
        license: 'CC BY-SA 4.0',
        import_timestamp: new Date().toISOString(),
      };

      currentBatch.push(normalCase);

      if (currentBatch.length >= BATCH_SIZE) {
        stream.pause();
        isStreamPaused = true;
        await flushBatch();
        if (isStreamPaused) {
          stream.resume();
          isStreamPaused = false;
        }
      }
    });

    stream.on('close', async () => {
      await flushBatch();
      resolve({
        totalRows,
        filteredRows,
        invalidRows,
        duplicateRows: duplicateCount,
        insertedCount: totalInserted,
      });
    });

    stream.on('end', async () => {
      await flushBatch();
      resolve({
        totalRows,
        filteredRows,
        invalidRows,
        duplicateRows: duplicateCount,
        insertedCount: totalInserted,
      });
    });

    stream.on('error', (err) => {
      reject(err);
    });
  });
}

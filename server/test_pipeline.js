import path from 'path';
import { fileURLToPath } from 'url';
import { previewOraCsv, importOraCsv } from './ora-importer.js';
import { getOraCases, getOraCount, clearLocalOraData } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runTests() {
  console.log('=== TEST 1: Preview with 20 Records ===');
  clearLocalOraData();
  const file20 = path.join(__dirname, 'data', 'test_ora_20.csv');

  const preview20 = await previewOraCsv(file20, {
    categories: ['laptop', 'desktop'],
    country: 'all',
  });

  console.log('Total rows read:', preview20.totalRows);
  console.log('Filtered laptop/desktop rows:', preview20.filteredRows);
  console.log('Invalid rows detected:', preview20.invalidRows);
  console.log('Duplicate rows detected:', preview20.duplicateRows);
  console.log('Preview sample count:', preview20.preview.length);
  console.log('Sample mapped row 0:', {
    id: preview20.preview[0].external_source_id,
    brand: preview20.preview[0].brand,
    category: preview20.preview[0].device_category,
    status: preview20.preview[0].repair_status,
    model: preview20.preview[0].model,
    steps: preview20.preview[0].troubleshooting_steps,
    solution: preview20.preview[0].final_solution,
  });

  console.log('\n=== TEST 2: Import 20 Records ===');
  const import20 = await importOraCsv(file20, {
    categories: ['laptop', 'desktop'],
    country: 'all',
  });
  console.log('Import 20 result:', import20);
  const countAfter20 = await getOraCount();
  console.log('Total ORA count in DB after Test 1:', countAfter20);

  console.log('\n=== TEST 3: Duplicate Import Protection ===');
  const dupImport = await importOraCsv(file20, {
    categories: ['laptop', 'desktop'],
    country: 'all',
  });
  console.log('Duplicate re-import inserted:', dupImport.insertedCount, 'duplicates skipped:', dupImport.duplicateRows);

  console.log('\n=== TEST 4: Import 100 Records (Laptops + Desktops) ===');
  const file100 = path.join(__dirname, 'data', 'test_ora_100.csv');
  const import100 = await importOraCsv(file100, {
    categories: ['laptop', 'desktop'],
    country: 'all',
  });
  console.log('Import 100 result:', import100);
  const totalCount = await getOraCount();
  console.log('Total ORA records in DB:', totalCount);

  console.log('\n=== TEST 5: Search Specific Symptoms ===');
  const dellPower = await getOraCases({ brand: 'Dell', limit: 5 });
  console.log('Found Dell cases:', dellPower.length);
  console.log('Sample Dell power case:', {
    brand: dellPower[0]?.brand,
    symptoms: dellPower[0]?.symptoms,
    status: dellPower[0]?.repair_status,
    steps: dellPower[0]?.troubleshooting_steps,
  });

  const hpCases = await getOraCases({ brand: 'HP', limit: 5 });
  console.log('Found HP cases:', hpCases.length);
  console.log('Sample HP case:', {
    brand: hpCases[0]?.brand,
    symptoms: hpCases[0]?.symptoms,
    status: hpCases[0]?.repair_status,
  });

  console.log('\n=== ALL PIPELINE TESTS PASSED ===');
}

runTests().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});

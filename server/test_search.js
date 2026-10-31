async function testSearch(query) {
  console.log(`\n========================================`);
  console.log(`🔍 SEARCH TEST: "${query}"`);
  console.log(`========================================`);

  const res = await fetch('http://localhost:3001/api/match', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, cases: [] }),
  });

  const data = await res.json();
  if (res.status === 503) {
    console.log(`ℹ️ API returned 503 (Gemini key not configured — fallback to local topCases)`);
    console.log(`Top matching cases returned (${data.topCases?.length || 0}):`);
    data.topCases?.slice(0, 3).forEach((c, idx) => {
      console.log(`  [Match ${idx + 1}] Brand: ${c.brand} | Category: ${c.category} | Source: ${c.sourceType}`);
      console.log(`    Symptoms: ${c.symptoms}`);
      console.log(`    Outcome: ${c.repairStatus || 'N/A'} | Steps: ${c.steps || 'null (not recorded)'}`);
    });
  } else if (res.ok) {
    console.log('Gemini Analysis summary:', data.problem_summary);
    console.log('Matches found:', data.matches?.length);
    data.matches?.slice(0, 3).forEach((m, idx) => {
      console.log(`  [Match ${idx + 1}] Device: ${m.device_model}`);
      console.log(`    Symptoms: ${m.symptoms}`);
      console.log(`    Solution/Outcome: ${m.solution}`);
      console.log(`    Why: ${m.relevance_reason}`);
    });
  } else {
    console.error('Search error:', data);
  }
}

async function main() {
  await testSearch('Dell laptop power problems');
  await testSearch('HP laptop overheating');
  await testSearch('Laptop battery problems');
}

main().catch(console.error);

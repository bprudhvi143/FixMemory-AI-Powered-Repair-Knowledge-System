import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import multer from 'multer';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { previewOraCsv, importOraCsv } from './ora-importer.js';
import { getOraCases, getOraCount, getStorageMode, clearLocalOraData } from './db.js';

config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json({ limit: '5mb' }));

const PORT = process.env.PORT || 3001;
const API_KEY = process.env.GEMINI_API_KEY;

// ── File Upload Configuration ───────────────────────────────────────────────
const UPLOADS_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || '.csv';
    cb(null, `ora_upload_${Date.now()}_${Math.random().toString(36).substring(2, 8)}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit for large datasets
});

// ── System prompt for Gemini ────────────────────────────────────────────────
const SYSTEM_INSTRUCTION = `You are FixMemory, an AI repair case matching assistant for professional computer and laptop repair technicians.

Your task is to analyse the user's reported symptoms and compare them ONLY against the historical repair cases supplied to you.

Identify the most relevant cases based on device model, brand, symptoms and repair history.

IMPORTANT RULES REGARDING DATA TRUST:
1. Some records originate from the Open Repair Alliance public dataset (source_type: "ora_public_dataset"). These records document real-world repair attempts and record outcomes (e.g. repair_status: Fixed, Repairable, or End of life), but DO NOT contain detailed step-by-step troubleshooting steps or root causes.
2. You MUST NEVER invent or hallucinate troubleshooting steps, root causes, or component repairs for Open Repair Alliance records.
3. You MUST NEVER claim an Open Repair Alliance record contains a confirmed solution when it does not.
4. If an ORA record matches, report its repair outcome honestly (e.g. "Outcome: Fixed (no detailed component steps documented in ORA dataset)").
5. For technician-verified cases (source_type: "technician" or "sample"), use the documented solution and steps.
6. Do not invent repair cases, solutions, technical specifications or references.
7. Do not claim that a repair will definitely work.
8. If no sufficiently relevant case exists, return no matches and explain that more information is needed.
9. Clearly distinguish historical repair solutions from possible causes.
10. Use simple English that a repair technician can understand.
11. Return valid JSON using the requested schema. Only return JSON — no markdown, no explanation outside the JSON.`;

// ── Admin: ORA CSV Preview ──────────────────────────────────────────────────
app.post('/api/admin/ora/preview', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No CSV file uploaded.' });
  }

  const filePath = req.file.path;
  try {
    let categories = ['laptop', 'desktop'];
    if (req.body.categories) {
      try {
        categories = typeof req.body.categories === 'string' ? JSON.parse(req.body.categories) : req.body.categories;
        if (!Array.isArray(categories)) categories = [String(categories)];
      } catch {
        categories = String(req.body.categories).replace(/[\[\]"']/g, '').split(',').map(s => s.trim()).filter(Boolean);
      }
    }
    const country = req.body.country || 'all';

    const previewResult = await previewOraCsv(filePath, { categories, country });

    // Clean up uploaded file after preview
    fs.unlink(filePath, () => {});

    return res.json({
      success: true,
      storage: getStorageMode(),
      ...previewResult,
    });
  } catch (err) {
    console.error('Preview error:', err);
    if (fs.existsSync(filePath)) fs.unlink(filePath, () => {});
    return res.status(500).json({ error: 'Failed to parse CSV preview: ' + err.message });
  }
});

// ── Admin: ORA CSV Import ───────────────────────────────────────────────────
app.post('/api/admin/ora/import', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No CSV file uploaded.' });
  }

  const filePath = req.file.path;
  try {
    let categories = ['laptop', 'desktop'];
    if (req.body.categories) {
      try {
        categories = typeof req.body.categories === 'string' ? JSON.parse(req.body.categories) : req.body.categories;
        if (!Array.isArray(categories)) categories = [String(categories)];
      } catch {
        categories = String(req.body.categories).replace(/[\[\]"']/g, '').split(',').map(s => s.trim()).filter(Boolean);
      }
    }
    const country = req.body.country || 'all';
    const maxRecords = req.body.maxRecords ? parseInt(req.body.maxRecords, 10) : null;

    console.log(`Starting ORA import with filters: categories=${categories.join(',')}, country=${country}, max=${maxRecords || 'all'}`);

    const importResult = await importOraCsv(filePath, {
      categories,
      country,
      maxRecords,
    });

    // Clean up uploaded file
    fs.unlink(filePath, () => {});

    const totalInStore = await getOraCount();

    return res.json({
      success: true,
      storage: getStorageMode(),
      totalInDatabase: totalInStore,
      ...importResult,
    });
  } catch (err) {
    console.error('Import error:', err);
    if (fs.existsSync(filePath)) fs.unlink(filePath, () => {});
    return res.status(500).json({ error: 'Failed to import CSV: ' + err.message });
  }
});

// ── Admin: Storage Status & Counts ──────────────────────────────────────────
app.get('/api/admin/ora/stats', async (_req, res) => {
  try {
    const count = await getOraCount();
    const storageInfo = getStorageMode();
    return res.json({
      count,
      storage: storageInfo,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// ── Admin: Reset local ORA data (test mode) ─────────────────────────────────
app.post('/api/admin/ora/clear', async (_req, res) => {
  try {
    clearLocalOraData();
    return res.json({ success: true, message: 'Local ORA test records cleared.' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// ── Public: Query ORA Cases ─────────────────────────────────────────────────
app.get('/api/cases/ora', async (req, res) => {
  try {
    const { category, country, brand, limit = 100 } = req.query;
    const cases = await getOraCases({
      category: category ? String(category) : undefined,
      country: country ? String(country) : undefined,
      brand: brand ? String(brand) : undefined,
      limit: parseInt(String(limit), 10) || 100,
    });
    return res.json({ count: cases.length, cases });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// ── POST /api/match (AI Matching & Hybrid Search) ───────────────────────────
app.post('/api/match', async (req, res) => {
  const { query, cases = [] } = req.body;

  if (!query) {
    return res.status(400).json({ error: 'Invalid request. Provide query.' });
  }

  // Fetch relevant ORA cases from backend storage to merge with frontend cases
  let oraCandidates = [];
  try {
    const oraRecords = await getOraCases({ limit: 500 });
    oraCandidates = oraRecords.map(o => ({
      id: o.id,
      brand: o.brand,
      model: o.model || `${o.brand} (${o.device_category || 'Computer'})`,
      category: o.device_category || 'Computer',
      symptoms: o.symptoms,
      steps: o.troubleshooting_steps || null,
      solution: o.final_solution || (o.repair_status ? `Repair outcome: ${o.repair_status} (Open Repair Alliance record)` : null),
      sourceType: 'ora_public_dataset',
      repairStatus: o.repair_status,
      repairBarrier: o.repair_barrier,
      country: o.country,
      eventDate: o.event_date,
      sourceProvider: o.source_provider,
      verificationStatus: o.verification_status || 'not_independently_verified',
      createdAt: o.import_timestamp || o.created_at || new Date().toISOString(),
    }));
  } catch (e) {
    console.warn('Could not load ORA records for match:', e.message);
  }

  // Combine and score cases to send ONLY the most relevant (top 15) to Gemini
  const allAvailable = [...cases, ...oraCandidates];
  const qTokens = query.toLowerCase().split(/\s+/).filter(t => t.length > 2);

  const scored = allAvailable.map(c => {
    const text = [
      c.brand,
      c.model,
      c.category,
      c.device_category,
      c.symptoms,
      c.solution,
      c.repairStatus,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    let score = 0;
    for (const t of qTokens) {
      if (text.includes(t)) score += 1;
    }
    return { c, score };
  });

  // Top 15 relevant records
  const topCases = scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 15)
    .map(s => s.c);

  // If no API key, return 503 so client uses demo matching with topCases
  if (!API_KEY) {
    return res.status(503).json({
      error: 'Gemini API key not configured.',
      topCases,
    });
  }

  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: SYSTEM_INSTRUCTION,
    });

    const casesJson = JSON.stringify(
      topCases.map(c => ({
        id: c.id,
        brand: c.brand,
        model: c.model || 'Unspecified Model',
        category: c.category || c.device_category,
        symptoms: c.symptoms,
        steps: c.steps || 'Not recorded',
        solution: c.solution || (c.repairStatus ? `Repair Status: ${c.repairStatus}` : 'Not recorded'),
        source_type: c.sourceType,
      })),
      null,
      2
    );

    const prompt = `
The technician reports the following problem:
"${query}"

Here are the retrieved repair records from our database:
${casesJson}

Respond with a JSON object using this exact schema:
{
  "problem_summary": "Short description of the reported problem",
  "possible_causes": ["Possible cause 1", "Possible cause 2"],
  "matches": [
    {
      "case_id": "case_001",
      "device_model": "HP Pavilion G4",
      "symptoms": "Overheating and sudden shutdown",
      "solution": "Cleaned cooling fan and applied new thermal paste",
      "relevance_reason": "Both cases involve overheating and shutdown"
    }
  ],
  "no_match": false,
  "additional_information_needed": []
}

Remember: If matching an Open Repair Alliance record, clearly indicate its repair outcome without claiming detailed repair steps exist.
Return only valid JSON, no markdown code fences.
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const cleaned = text.replace(/^```json\s*/i, '').replace(/```$/i, '').trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      return res.status(500).json({ error: 'Gemini returned invalid JSON.' });
    }

    if (
      typeof parsed.problem_summary !== 'string' ||
      !Array.isArray(parsed.possible_causes) ||
      !Array.isArray(parsed.matches) ||
      typeof parsed.no_match !== 'boolean'
    ) {
      return res.status(500).json({ error: 'Gemini response does not match expected schema.' });
    }

    const validIds = new Set(topCases.map(c => c.id));
    parsed.matches = parsed.matches.filter(m => validIds.has(m.case_id));

    return res.json({
      ...parsed,
      available_records_used: topCases,
    });
  } catch (err) {
    console.error('Gemini error:', err);
    return res.status(500).json({ error: 'Gemini API call failed.' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ FixMemory API server running on http://localhost:${PORT}`);
  const storageInfo = getStorageMode();
  console.log(`📦 Storage mode: ${storageInfo.mode}`);
  if (!API_KEY) {
    console.warn('⚠️  GEMINI_API_KEY not set — Gemini features disabled, demo mode will be used.');
  }
});

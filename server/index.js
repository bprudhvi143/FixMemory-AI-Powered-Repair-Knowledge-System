import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));

const PORT = process.env.PORT || 3001;
const API_KEY = process.env.GEMINI_API_KEY;

// ── System prompt ─────────────────────────────────────────────────────────────

const SYSTEM_INSTRUCTION = `You are FixMemory, an AI repair case matching assistant for professional computer and laptop repair technicians.

Your task is to analyse the user's reported symptoms and compare them ONLY against the historical repair cases supplied to you.

Identify the most relevant cases based on device model, brand, symptoms and repair history.

Do not invent repair cases, solutions, technical specifications or references.

Do not claim that a repair will definitely work.

If no sufficiently relevant case exists, return no matches and explain that more information is needed.

Clearly distinguish historical repair solutions from possible causes.

Use simple English that a repair technician can understand.

Return valid JSON using the requested schema. Only return JSON — no markdown, no explanation outside the JSON.`;

// ── POST /api/match ────────────────────────────────────────────────────────────

app.post('/api/match', async (req, res) => {
  const { query, cases } = req.body;

  if (!query || !Array.isArray(cases)) {
    return res.status(400).json({ error: 'Invalid request. Provide query and cases.' });
  }

  if (!API_KEY) {
    return res.status(503).json({ error: 'Gemini API key not configured.' });
  }

  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: SYSTEM_INSTRUCTION,
    });

    const casesJson = JSON.stringify(
      cases.map(c => ({
        id: c.id,
        brand: c.brand,
        model: c.model,
        category: c.category,
        symptoms: c.symptoms,
        steps: c.steps,
        solution: c.solution,
      })),
      null,
      2
    );

    const prompt = `
The technician reports the following problem:
"${query}"

Here are all available repair cases in the database:
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

Only include cases that are genuinely relevant. Do not include all cases.
Return only valid JSON, no markdown code fences.
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    // Strip markdown fences if present
    const cleaned = text.replace(/^```json\s*/i, '').replace(/```$/i, '').trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      return res.status(500).json({ error: 'Gemini returned invalid JSON.' });
    }

    // Validate shape
    if (
      typeof parsed.problem_summary !== 'string' ||
      !Array.isArray(parsed.possible_causes) ||
      !Array.isArray(parsed.matches) ||
      typeof parsed.no_match !== 'boolean'
    ) {
      return res.status(500).json({ error: 'Gemini response does not match expected schema.' });
    }

    // Only allow matches whose case IDs exist in the supplied cases
    const validIds = new Set(cases.map(c => c.id));
    parsed.matches = parsed.matches.filter(m => validIds.has(m.case_id));

    return res.json(parsed);
  } catch (err) {
    console.error('Gemini error:', err);
    return res.status(500).json({ error: 'Gemini API call failed.' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ FixMemory API server running on http://localhost:${PORT}`);
  if (!API_KEY) {
    console.warn('⚠️  GEMINI_API_KEY not set — Gemini features disabled, demo mode will be used.');
  }
});

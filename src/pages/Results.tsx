import { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw, AlertCircle } from 'lucide-react';
import { useLang } from '../App';
import { t } from '../i18n';
import { getAllCases, localSearch } from '../storage';
import type { AIResult, RepairCase } from '../types';
import AIResults from '../components/AIResults';

type SearchState = 'loading' | 'success' | 'error' | 'idle';

export default function Results() {
  const { lang } = useLang();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const query = params.get('q') ?? '';

  const [state, setState] = useState<SearchState>('idle');
  const [result, setResult] = useState<AIResult | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const allCases = getAllCases();

  const runSearch = async () => {
    if (!query.trim()) return;
    setState('loading');
    setResult(null);

    try {
      const response = await fetch('/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, cases: allCases }),
      });

      if (!response.ok) throw new Error('API error');
      const data = await response.json() as AIResult;
      setResult(data);
      setIsDemo(false);
      setState('success');
    } catch {
      // Fall back to local demo search
      try {
        const matched = localSearch(query);
        const demoResult: AIResult = buildDemoResult(query, matched);
        setResult(demoResult);
        setIsDemo(true);
        setState('success');
      } catch {
        setState('error');
      }
    }
  };

  useEffect(() => {
    if (query) runSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* Back */}
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600 mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        {t(lang, 'results_back')}
      </Link>

      {/* Loading */}
      {state === 'loading' && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="relative w-14 h-14 mb-5">
            <div className="absolute inset-0 rounded-full border-4 border-blue-100" />
            <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
          </div>
          <p className="text-slate-700 font-semibold">{t(lang, 'results_loading')}</p>
          <p className="text-slate-400 text-sm mt-1 max-w-xs">
            Analysing symptoms against {allCases.length} repair records...
          </p>
        </div>
      )}

      {/* Error */}
      {state === 'error' && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mb-5">
            <AlertCircle className="w-7 h-7 text-red-500" />
          </div>
          <p className="text-slate-800 font-semibold mb-1">{t(lang, 'results_error')}</p>
          <p className="text-slate-500 text-sm mb-6">Check your connection and try again.</p>
          <button
            onClick={runSearch}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            {t(lang, 'results_retry')}
          </button>
        </div>
      )}

      {/* Results */}
      {state === 'success' && result && (
        <>
          <AIResults
            result={result}
            cases={allCases}
            query={query}
            isDemo={isDemo}
          />

          {/* Log case CTA if no match */}
          {(result.no_match || result.matches.length === 0) && (
            <div className="mt-8 text-center">
              <p className="text-slate-600 text-sm mb-3">{t(lang, 'results_none')}</p>
              <Link
                to={`/log`}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors text-sm"
              >
                {t(lang, 'results_log_cta')}
              </Link>
            </div>
          )}
        </>
      )}

      {/* Empty query */}
      {!query && (
        <div className="text-center py-20">
          <p className="text-slate-500 mb-4">No search query provided.</p>
          <Link to="/" className="text-blue-600 font-semibold hover:underline">
            {t(lang, 'results_back')}
          </Link>
        </div>
      )}
    </div>
  );
}

// ── Demo fallback builder ─────────────────────────────────────────────────────

function buildDemoResult(query: string, matched: RepairCase[]): AIResult {
  const causes: string[] = [];
  const q = query.toLowerCase();

  if (q.includes('heat') || q.includes('shut') || q.includes('overheat') || q.includes('hot')) {
    causes.push('Cooling system blockage due to accumulated dust on fan or heatsink');
    causes.push('Degraded thermal paste between CPU/GPU and heatsink');
  }
  if (q.includes('screen') || q.includes('flicker') || q.includes('display') || q.includes('blank')) {
    causes.push('Loose or damaged display cable connection');
    causes.push('GPU driver issue or outdated firmware');
  }
  if (q.includes('power') || q.includes('boot') || q.includes('start') || q.includes('turn on')) {
    causes.push('Faulty DC power jack or charging circuit');
    causes.push('Discharged or failed CMOS battery');
  }
  if (q.includes('wifi') || q.includes('network') || q.includes('internet') || q.includes('disconnect')) {
    causes.push('Outdated or corrupt Wi-Fi driver');
    causes.push('Failing Wi-Fi card hardware');
  }
  if (q.includes('battery') || q.includes('drain')) {
    causes.push('Battery wear causing reduced capacity');
    causes.push('Background processes consuming excessive power');
  }
  if (causes.length === 0) {
    causes.push('Insufficient information — describe symptoms more specifically for better results');
  }

  return {
    problem_summary: `Local analysis of: "${query}"`,
    possible_causes: causes,
    matches: matched.map(c => ({
      case_id: c.id,
      device_model: `${c.brand} ${c.model}`,
      symptoms: c.symptoms,
      solution: c.solution,
      relevance_reason: `Keyword similarity found in symptoms or solution description`,
    })),
    no_match: matched.length === 0,
    additional_information_needed:
      matched.length === 0
        ? ['Device brand and model', 'Specific error codes or messages', 'When the problem started']
        : [],
  };
}

import { Lightbulb, AlertCircle, RefreshCw, Info } from 'lucide-react';
import type { AIResult, RepairCase } from '../types';
import RepairCaseCard from './RepairCaseCard';
import { useLang } from '../App';
import { t } from '../i18n';

interface Props {
  result: AIResult;
  cases: RepairCase[];
  query: string;
  isDemo: boolean;
}

export default function AIResults({ result, cases, query, isDemo }: Props) {
  const { lang } = useLang();

  // Map matched case IDs to full case objects
  const matchedCases = result.matches
    .map(m => {
      const found = cases.find(c => c.id === m.case_id);
      return found ? { match: m, repairCase: found } : null;
    })
    .filter(Boolean) as { match: (typeof result.matches)[0]; repairCase: RepairCase }[];

  return (
    <div className="space-y-8">
      {/* Search summary */}
      <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">
              {t(lang, 'results_query')}
            </p>
            <p className="text-slate-800 font-medium text-sm">{query}</p>
            {result.problem_summary && (
              <p className="text-slate-600 text-sm mt-1.5">{result.problem_summary}</p>
            )}
          </div>
          {isDemo && (
            <span className="shrink-0 inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
              <Info className="w-3 h-3" />
              {t(lang, 'results_demo_badge')}
            </span>
          )}
        </div>
      </div>

      {/* Possible causes */}
      {result.possible_causes.length > 0 && (
        <section>
          <h2 className="flex items-center gap-2 text-base font-bold text-slate-900 mb-4">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            {t(lang, 'results_causes')}
          </h2>
          <ul className="space-y-2">
            {result.possible_causes.map((cause, i) => (
              <li key={i} className="flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-lg p-4">
                <span className="shrink-0 w-5 h-5 rounded-full bg-amber-200 text-amber-800 text-xs font-bold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                <p className="text-slate-800 text-sm">{cause}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Matched cases */}
      <section>
        <h2 className="flex items-center gap-2 text-base font-bold text-slate-900 mb-4">
          <span className="text-blue-600">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </span>
          {t(lang, 'results_matches')}
          <span className="ml-1 text-sm font-normal text-slate-500">
            ({matchedCases.length} {t(lang, 'results_found')})
          </span>
        </h2>

        {matchedCases.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {matchedCases.map(({ match, repairCase }) => (
              <RepairCaseCard
                key={repairCase.id}
                repairCase={repairCase}
                relevanceReason={match.relevance_reason}
              />
            ))}
          </div>
        ) : (
          <NoResults />
        )}
      </section>

      {/* Additional info needed */}
      {result.additional_information_needed.length > 0 && (
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-slate-700 mb-1">More information needed:</p>
              <ul className="text-sm text-slate-600 space-y-1">
                {result.additional_information_needed.map((item, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-slate-400">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function NoResults() {
  const { lang } = useLang();
  return (
    <div className="text-center py-12 bg-slate-50 rounded-xl border border-slate-200">
      <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-3">
        <RefreshCw className="w-6 h-6 text-slate-400" />
      </div>
      <p className="text-slate-700 font-semibold mb-1">{t(lang, 'results_none')}</p>
      <p className="text-slate-500 text-sm">Try a different search or log this as a new case.</p>
    </div>
  );
}

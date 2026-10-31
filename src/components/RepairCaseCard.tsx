import { useState } from 'react';
import type { RepairCase } from '../types';
import { Calendar, Cpu, CheckCircle, FlaskConical, Wrench, X, ExternalLink, Sparkles } from 'lucide-react';
import { useLang } from '../App';
import { t } from '../i18n';

interface Props {
  repairCase: RepairCase;
  relevanceReason?: string;
  compact?: boolean;
}

export default function RepairCaseCard({ repairCase, relevanceReason, compact = false }: Props) {
  const { lang } = useLang();
  const [isOpen, setIsOpen] = useState(false);
  const isSample = repairCase.sourceType === 'sample';
  const dateStr = new Date(repairCase.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <>
      <article className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-200 flex flex-col justify-between overflow-hidden">
        {/* Card header strip */}
        <div className="h-1 bg-blue-600" />

        <div className="p-5 flex-1 flex flex-col">
          {/* Top row: device + source badge */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                <Cpu className="w-4 h-4 text-blue-600" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-slate-900 text-sm truncate">
                  {repairCase.brand} {repairCase.model}
                </p>
                <p className="text-xs text-slate-500 truncate">{repairCase.category}</p>
              </div>
            </div>

            <span
              className={`shrink-0 inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
                isSample
                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                  : 'bg-green-50 text-green-700 border border-green-200'
              }`}
            >
              {isSample ? (
                <FlaskConical className="w-3 h-3" />
              ) : (
                <CheckCircle className="w-3 h-3" />
              )}
              {isSample ? t(lang, 'card_source_sample') : t(lang, 'card_source_tech')}
            </span>
          </div>

          {/* Symptoms */}
          <div className="mb-3">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
              {t(lang, 'log_symptoms')}
            </p>
            <p className="text-slate-600 text-sm leading-relaxed line-clamp-2">
              {repairCase.symptoms}
            </p>
          </div>

          {/* Steps Taken (Screen 3 requirement & valuable context) */}
          {repairCase.steps && (
            <div className="mb-3">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1 flex items-center gap-1">
                <Wrench className="w-3 h-3 text-slate-400" />
                {t(lang, 'card_steps')}
              </p>
              <p className="text-slate-600 text-xs leading-relaxed line-clamp-2 italic bg-slate-50/70 p-2 rounded border border-slate-100">
                {repairCase.steps}
              </p>
            </div>
          )}

          {/* Solution */}
          <div className="bg-blue-50/50 rounded-lg p-3 mb-3 border border-blue-100/60 mt-auto">
            <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5 text-blue-600" />
              {t(lang, 'card_solution')}
            </p>
            <p className="text-sm text-slate-800 font-medium leading-relaxed line-clamp-2">
              {repairCase.solution}
            </p>
          </div>

          {/* Relevance reason (Results page) */}
          {relevanceReason && (
            <div className="bg-amber-50/70 rounded-lg px-3 py-2 mb-3 border border-amber-200/60">
              <p className="text-xs font-bold text-amber-800 mb-0.5 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-600" />
                {t(lang, 'results_why')}
              </p>
              <p className="text-xs text-amber-900 leading-snug">{relevanceReason}</p>
            </div>
          )}

          {/* Bottom row: Date & Open Case Button */}
          <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-100 mt-2">
            {!compact ? (
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{dateStr}</span>
              </div>
            ) : <span />}

            <button
              onClick={() => setIsOpen(true)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
            >
              <span>{t(lang, 'card_open_case')}</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      </article>

      {/* Case Details Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-start justify-between bg-slate-50/80">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded">
                    {repairCase.category}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                      isSample
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-green-50 text-green-700 border border-green-200'
                    }`}
                  >
                    {isSample ? t(lang, 'card_source_sample') : t(lang, 'card_source_tech')}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  {repairCase.brand} {repairCase.model}
                </h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-200/70 hover:bg-slate-300 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-sm">
              {/* Relevance Reason if matched */}
              {relevanceReason && (
                <div className="bg-amber-50 rounded-xl p-3.5 border border-amber-200">
                  <p className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    {t(lang, 'results_why')}
                  </p>
                  <p className="text-amber-900 text-xs sm:text-sm font-medium">{relevanceReason}</p>
                </div>
              )}

              {/* Symptoms */}
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                  {t(lang, 'log_symptoms')}
                </h4>
                <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 text-slate-800 leading-relaxed whitespace-pre-wrap">
                  {repairCase.symptoms}
                </div>
              </div>

              {/* Troubleshooting Steps */}
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                  <Wrench className="w-3.5 h-3.5 text-slate-400" />
                  {t(lang, 'card_steps')}
                </h4>
                <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {repairCase.steps || 'No troubleshooting steps documented.'}
                </div>
              </div>

              {/* Final Solution */}
              <div>
                <h4 className="text-xs font-bold text-blue-700 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  {t(lang, 'card_solution')}
                </h4>
                <div className="bg-blue-50/70 rounded-xl p-3.5 border border-blue-200 text-slate-900 font-semibold leading-relaxed whitespace-pre-wrap">
                  {repairCase.solution}
                </div>
              </div>

              {/* Metadata */}
              <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100 gap-2">
                <span>{t(lang, 'card_case_id')}: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 font-mono">{repairCase.id}</code></span>
                <span>{dateStr}</span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button
                onClick={() => setIsOpen(false)}
                className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-xl text-sm transition-colors cursor-pointer"
              >
                {t(lang, 'card_close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

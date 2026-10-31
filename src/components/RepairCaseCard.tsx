import { useState } from 'react';
import type { RepairCase } from '../types';
import {
  Calendar,
  Cpu,
  CheckCircle,
  FlaskConical,
  Wrench,
  X,
  ExternalLink,
  Sparkles,
  Database,
  Globe,
  AlertTriangle,
  Info,
} from 'lucide-react';
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
  const isOra = repairCase.sourceType === 'ora_public_dataset';

  const dateStr = repairCase.eventDate || new Date(repairCase.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const getStatusBadge = (status?: string) => {
    switch ((status || '').toLowerCase()) {
      case 'fixed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'repairable':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'end of life':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <>
      <article className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-200 flex flex-col justify-between overflow-hidden">
        {/* Card header strip */}
        <div className={`h-1 ${isOra ? 'bg-indigo-600' : 'bg-blue-600'}`} />

        <div className="p-5 flex-1 flex flex-col">
          {/* Top row: device + source badge */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-2 min-w-0">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  isOra ? 'bg-indigo-50 text-indigo-600' : 'bg-blue-50 text-blue-600'
                }`}
              >
                {isOra ? <Database className="w-4 h-4" /> : <Cpu className="w-4 h-4" />}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-slate-900 text-sm truncate">
                  {repairCase.brand} {repairCase.model || repairCase.category || 'Computer'}
                </p>
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <span className="truncate">{repairCase.category}</span>
                  {repairCase.country && (
                    <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded">
                      <Globe className="w-2.5 h-2.5" />
                      {repairCase.country}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Source Badge */}
            <span
              className={`shrink-0 inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
                isOra
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                  : isSample
                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                  : 'bg-green-50 text-green-700 border border-green-200'
              }`}
            >
              {isOra ? (
                <Database className="w-3 h-3" />
              ) : isSample ? (
                <FlaskConical className="w-3 h-3" />
              ) : (
                <CheckCircle className="w-3 h-3" />
              )}
              {isOra
                ? t(lang, 'card_source_ora')
                : isSample
                ? t(lang, 'card_source_sample')
                : t(lang, 'card_source_tech')}
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

          {/* ORA Specific Details OR Technician Steps */}
          {isOra ? (
            <div className="bg-slate-50/80 rounded-lg p-3 mb-3 border border-slate-200/60 mt-auto">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                  {t(lang, 'card_repair_status')}:
                </span>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(
                    repairCase.repairStatus
                  )}`}
                >
                  {repairCase.repairStatus || 'Unknown'}
                </span>
              </div>
              {repairCase.repairBarrier && (
                <p className="text-xs text-rose-700 bg-rose-50/60 p-1.5 rounded border border-rose-100 flex items-start gap-1 mb-1.5">
                  <AlertTriangle className="w-3 h-3 shrink-0 mt-0.5" />
                  <span>
                    <strong className="font-semibold">{t(lang, 'card_repair_barrier')}:</strong>{' '}
                    {repairCase.repairBarrier}
                  </span>
                </p>
              )}
              <p className="text-[11px] text-slate-400 italic flex items-center gap-1">
                <Info className="w-3 h-3 shrink-0" />
                {t(lang, 'card_ora_note')}
              </p>
            </div>
          ) : (
            <>
              {/* Steps Taken */}
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
            </>
          )}

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
            ) : (
              <span />
            )}

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
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded">
                    {repairCase.category}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                      isOra
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                        : isSample
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-green-50 text-green-700 border border-green-200'
                    }`}
                  >
                    {isOra
                      ? t(lang, 'card_source_ora')
                      : isSample
                      ? t(lang, 'card_source_sample')
                      : t(lang, 'card_source_tech')}
                  </span>
                  {repairCase.country && (
                    <span className="text-xs font-semibold bg-slate-200 text-slate-700 px-2 py-0.5 rounded">
                      {repairCase.country}
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  {repairCase.brand} {repairCase.model || ''}
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

              {/* ORA-Specific Breakdown */}
              {isOra ? (
                <>
                  <div>
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                      {t(lang, 'card_repair_status')}
                    </h4>
                    <div className="bg-indigo-50/50 rounded-xl p-3.5 border border-indigo-100 flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-800">
                        Historical repair event outcome:
                      </span>
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full border ${getStatusBadge(
                          repairCase.repairStatus
                        )}`}
                      >
                        {repairCase.repairStatus || 'Unknown'}
                      </span>
                    </div>
                  </div>

                  {repairCase.repairBarrier && (
                    <div>
                      <h4 className="text-xs font-bold text-rose-600 uppercase tracking-wide mb-1.5">
                        {t(lang, 'card_repair_barrier')}
                      </h4>
                      <div className="bg-rose-50 rounded-xl p-3.5 border border-rose-200 text-rose-900 font-medium">
                        {repairCase.repairBarrier}
                      </div>
                    </div>
                  )}

                  <div className="bg-amber-50/60 rounded-xl p-3.5 border border-amber-200/70 text-amber-900 text-xs leading-relaxed flex items-start gap-2">
                    <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-semibold">Open Repair Alliance Notice:</strong>{' '}
                      {t(lang, 'card_ora_note')} Provenance and repair outcome are preserved under CC BY-SA 4.0.
                    </div>
                  </div>
                </>
              ) : (
                <>
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
                </>
              )}

              {/* Metadata */}
              <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100 gap-2">
                <span>
                  {t(lang, 'card_case_id')}:{' '}
                  <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 font-mono">
                    {repairCase.id}
                  </code>
                </span>
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

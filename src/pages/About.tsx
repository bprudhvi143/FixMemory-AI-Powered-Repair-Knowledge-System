import { useState } from 'react';
import { Shield, Zap, Users, BookOpen, Trash2, AlertTriangle, Database, ExternalLink } from 'lucide-react';
import { useLang } from '../App';
import { t } from '../i18n';
import StatsStrip from '../components/StatsStrip';
import { clearAllData } from '../storage';

export default function About() {
  const { lang } = useLang();
  const [showConfirm, setShowConfirm] = useState(false);
  const [cleared, setCleared] = useState(false);

  const handleClear = () => {
    clearAllData();
    setCleared(true);
    setShowConfirm(false);
    setTimeout(() => setCleared(false), 3000);
  };

  const sections = [
    {
      icon: <BookOpen className="w-6 h-6 text-blue-600" />,
      title: t(lang, 'about_what_title'),
      body: t(lang, 'about_what_body'),
    },
    {
      icon: <AlertTriangle className="w-6 h-6 text-amber-500" />,
      title: t(lang, 'about_problem_title'),
      body: t(lang, 'about_problem_body'),
    },
    {
      icon: <Zap className="w-6 h-6 text-blue-600" />,
      title: t(lang, 'about_solution_title'),
      body: t(lang, 'about_solution_body'),
    },
    {
      icon: <Shield className="w-6 h-6 text-blue-600" />,
      title: t(lang, 'about_diff_title'),
      body: t(lang, 'about_diff_body'),
    },
    {
      icon: <Users className="w-6 h-6 text-blue-600" />,
      title: t(lang, 'about_team_title'),
      body: t(lang, 'about_team_body'),
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      {/* Hero */}
      <div className="text-center mb-14">
        <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-5">
          Team Eleven
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3">
          {t(lang, 'about_headline')}
        </h1>
        <p className="text-slate-600">{t(lang, 'about_sub')}</p>
      </div>

      {/* About sections */}
      <div className="space-y-6 mb-14">
        {sections.map(s => (
          <div
            key={s.title}
            className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                {s.icon}
              </div>
              <div>
                <h2 className="font-bold text-slate-900 mb-1.5">{s.title}</h2>
                <p className="text-slate-600 text-sm leading-relaxed">{s.body}</p>
              </div>
            </div>
          </div>
        ))}

        {/* Section 8: Open Repair Alliance Licensing & Provenance */}
        <div className="bg-gradient-to-r from-indigo-50/50 to-blue-50/50 rounded-xl border border-indigo-100 p-6">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 bg-indigo-100/70 rounded-xl flex items-center justify-center shrink-0">
              <Database className="w-6 h-6 text-indigo-700" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="font-bold text-slate-900">{t(lang, 'about_ora_title')}</h2>
                <span className="text-[11px] font-semibold bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">
                  CC BY-SA 4.0
                </span>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed mb-3">
                {t(lang, 'about_ora_body')}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-indigo-700">
                <a
                  href="https://openrepair.org/open-data/downloads/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 hover:underline"
                >
                  <span>Open Repair Alliance Downloads</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <a
                  href="https://creativecommons.org/licenses/by-sa/4.0/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-800 hover:underline"
                >
                  <span>License: CC BY-SA 4.0</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-14">
        <StatsStrip />
      </div>

      {/* Clear data */}
      <div className="bg-slate-50 rounded-xl border border-slate-200 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-bold text-slate-800 mb-1">{t(lang, 'clear_data')}</h3>
            <p className="text-sm text-slate-500">
              Removes all your submitted cases and restores sample records.
            </p>
          </div>
          <button
            onClick={() => setShowConfirm(true)}
            className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            {t(lang, 'clear_data')}
          </button>
        </div>

        {cleared && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700 font-medium">
            ✓ Data cleared. Sample records restored.
          </div>
        )}
      </div>

      {/* Confirm modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl shadow-2xl p-7 max-w-sm w-full">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 text-center mb-1">
              {t(lang, 'clear_confirm')}
            </h3>
            <p className="text-slate-600 text-sm text-center mb-6">
              {t(lang, 'clear_confirm_msg')}
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleClear}
                className="w-full py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors text-sm"
              >
                {t(lang, 'clear_ok')}
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="w-full py-3 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-colors text-sm"
              >
                {t(lang, 'clear_cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

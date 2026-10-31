import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Lightbulb, Users } from 'lucide-react';
import { useLang } from '../App';
import { t } from '../i18n';
import SearchBar from '../components/SearchBar';
import RepairCaseCard from '../components/RepairCaseCard';
import { getRecentCases } from '../storage';

export default function Home() {
  const { lang } = useLang();
  const [recentCases, setRecentCases] = useState(getRecentCases(4));

  // Refresh recent cases on mount (handles the case where seed ran just before)
  useEffect(() => {
    setRecentCases(getRecentCases(4));
  }, []);

  const whyCards = [
    {
      icon: <Users className="w-6 h-6 text-blue-600" />,
      title: t(lang, 'why1_title'),
      body: t(lang, 'why1_body'),
    },
    {
      icon: <BookOpen className="w-6 h-6 text-blue-600" />,
      title: t(lang, 'why2_title'),
      body: t(lang, 'why2_body'),
    },
    {
      icon: <Lightbulb className="w-6 h-6 text-blue-600" />,
      title: t(lang, 'why3_title'),
      body: t(lang, 'why3_body'),
    },
  ];

  return (
    <div className="min-h-screen">
      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-b from-blue-50 to-white pt-16 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Tag */}
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            AI-Powered Repair Knowledge
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight tracking-tight mb-5">
            {t(lang, 'hero_headline')}
          </h1>

          {/* Sub */}
          <p className="text-lg text-slate-600 max-w-xl mx-auto mb-10 leading-relaxed">
            {t(lang, 'hero_sub')}
          </p>

          {/* Search bar */}
          <SearchBar />

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
            <Link
              to="/log"
              className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-blue-200 text-blue-700 font-semibold rounded-xl hover:bg-blue-50 hover:border-blue-400 transition-all text-sm"
            >
              {t(lang, 'hero_log_cta')}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 pb-10">
        {/* ── Recent Cases ─────────────────────────────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">{t(lang, 'recent_title')}</h2>
            <Link
              to="/log"
              className="text-sm text-blue-600 font-semibold hover:underline flex items-center gap-1"
            >
              {t(lang, 'hero_log_cta')}
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentCases.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {recentCases.map(c => (
                <RepairCaseCard key={c.id} repairCase={c} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-slate-50 rounded-xl border border-dashed border-slate-300">
              <p className="text-slate-500 font-medium">{t(lang, 'card_no_recent')}</p>
            </div>
          )}
        </section>

        {/* ── Why FixMemory ─────────────────────────────────────────────── */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">{t(lang, 'why_title')}</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {whyCards.map(card => (
              <div
                key={card.title}
                className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md hover:border-blue-200 transition-all"
              >
                <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                  {card.icon}
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{card.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{card.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Bottom CTA strip ──────────────────────────────────────────── */}
        <section className="bg-blue-600 rounded-2xl p-8 sm:p-12 text-center text-white">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">Start fixing smarter today</h2>
          <p className="text-blue-100 mb-8 max-w-md mx-auto text-sm">
            Search from 10+ documented repair cases or log your own to grow the knowledge base.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/log"
              className="px-6 py-3 bg-white text-blue-700 font-bold rounded-xl hover:bg-blue-50 transition-colors text-sm"
            >
              {t(lang, 'hero_log_cta')}
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

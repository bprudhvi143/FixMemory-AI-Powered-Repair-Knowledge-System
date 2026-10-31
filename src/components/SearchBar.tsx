import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Sparkles } from 'lucide-react';
import { useLang } from '../App';
import { t } from '../i18n';
import { SEARCH_SUGGESTIONS } from '../data';

export default function SearchBar() {
  const { lang } = useLang();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    navigate(`/results?q=${encodeURIComponent(q)}`);
  };

  const handleSuggestion = (s: string) => {
    setQuery(s);
    navigate(`/results?q=${encodeURIComponent(s)}`);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />
          <input
            id="search-input"
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={t(lang, 'hero_placeholder')}
            className="w-full pl-12 pr-36 py-4 text-base rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none shadow-sm text-slate-800 placeholder-slate-400 bg-white"
            aria-label="Search repair cases"
          />
          <button
            type="submit"
            className="absolute right-2 flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 active:scale-95 transition-all shadow-sm"
          >
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:inline">{t(lang, 'hero_cta')}</span>
            <span className="sm:hidden">Go</span>
          </button>
        </div>
      </form>

      {/* Suggestions */}
      <div className="mt-4">
        <p className="text-xs font-medium text-slate-500 mb-2">{t(lang, 'hero_suggestions_label')}</p>
        <div className="flex flex-wrap gap-2">
          {SEARCH_SUGGESTIONS.map(s => (
            <button
              key={s}
              onClick={() => handleSuggestion(s)}
              className="text-xs px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-100 hover:border-blue-300 transition-colors text-left"
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

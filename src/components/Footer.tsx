import { Link } from 'react-router-dom';
import { Wrench } from 'lucide-react';
import { useLang } from '../App';
import { t } from '../i18n';

export default function Footer() {
  const { lang } = useLang();
  return (
    <footer className="bg-slate-50 border-t border-slate-200 mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-600 rounded-md flex items-center justify-center">
              <Wrench className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-slate-800">FixMemory</span>
          </div>

          {/* Links */}
          <nav className="flex items-center gap-6 text-sm text-slate-500">
            <Link to="/" className="hover:text-blue-600 transition-colors">{t(lang, 'nav_home')}</Link>
            <Link to="/log" className="hover:text-blue-600 transition-colors">{t(lang, 'nav_log')}</Link>
            <Link to="/about" className="hover:text-blue-600 transition-colors">{t(lang, 'footer_about')}</Link>
          </nav>

          {/* Copy */}
          <p className="text-xs text-slate-400">{t(lang, 'footer_copy')}</p>
        </div>
      </div>
    </footer>
  );
}

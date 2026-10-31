import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, Wrench } from 'lucide-react';
import { useLang } from '../App';
import { t } from '../i18n';

export default function Navbar() {
  const { lang, toggleLang } = useLang();
  const [open, setOpen] = useState(false);

  const navItems = [
    { to: '/', label: t(lang, 'nav_home') },
    { to: '/log', label: t(lang, 'nav_log') },
    { to: '/about', label: t(lang, 'nav_about') },
  ];

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors ${
      isActive
        ? 'text-blue-600'
        : 'text-slate-600 hover:text-blue-600'
    }`;

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-700 transition-colors">
              <Wrench className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-navy-900" style={{ color: '#172554' }}>
              FixMemory
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map(item => (
              <NavLink key={item.to} to={item.to} end={item.to === '/'} className={linkClass}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-3">
            {/* Language toggle */}
            <button
              onClick={toggleLang}
              className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border border-blue-200 text-blue-600 hover:bg-blue-50 transition-colors"
              aria-label="Toggle language"
            >
              🌐 {t(lang, 'nav_lang')}
            </button>

            {/* Log Case CTA */}
            <Link
              to="/log"
              className="hidden md:flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              {t(lang, 'nav_log')}
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label={open ? 'Close menu' : 'Open menu'}
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden bg-white border-t border-slate-100 px-4 pb-4 pt-2 space-y-1">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-blue-50 text-blue-600' : 'text-slate-700 hover:bg-slate-50'
                }`
              }
              onClick={() => setOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => { toggleLang(); setOpen(false); }}
              className="text-xs font-semibold px-3 py-1.5 rounded-full border border-blue-200 text-blue-600 hover:bg-blue-50 transition-colors"
            >
              🌐 {t(lang, 'nav_lang')}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

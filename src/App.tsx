import { Routes, Route } from 'react-router-dom';
import { useState, createContext, useContext } from 'react';
import type { Language } from './types';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import LogCase from './pages/LogCase';
import Results from './pages/Results';
import About from './pages/About';
import AdminImport from './pages/AdminImport';

// ── Language Context ─────────────────────────────────────────────────────────

interface LangCtx {
  lang: Language;
  toggleLang: () => void;
}

export const LangContext = createContext<LangCtx>({ lang: 'en', toggleLang: () => {} });
export const useLang = () => useContext(LangContext);

// ── App ───────────────────────────────────────────────────────────────────────

export default function App() {
  const [lang, setLang] = useState<Language>('en');

  const toggleLang = () => setLang(l => (l === 'en' ? 'te' : 'en'));

  return (
    <LangContext.Provider value={{ lang, toggleLang }}>
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/log" element={<LogCase />} />
            <Route path="/results" element={<Results />} />
            <Route path="/about" element={<About />} />
            {/* Admin only route - not exposed in general technician navigation */}
            <Route path="/admin/import" element={<AdminImport />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </LangContext.Provider>
  );
}

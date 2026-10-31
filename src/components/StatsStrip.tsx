import { BarChart3, Users, TrendingDown } from 'lucide-react';
import { useLang } from '../App';
import { t } from '../i18n';
import { getAllCases } from '../storage';

export default function StatsStrip() {
  const { lang } = useLang();
  const cases = getAllCases();
  const total = cases.length;
  const techSubmitted = cases.filter(c => c.sourceType === 'technician').length;

  const stats = [
    {
      icon: <Users className="w-5 h-5 text-blue-600" />,
      label: t(lang, 'stats_users'),
      value: 'Demo',
    },
    {
      icon: <BarChart3 className="w-5 h-5 text-blue-600" />,
      label: t(lang, 'stats_cases'),
      value: `${total} (${techSubmitted} submitted)`,
    },
    {
      icon: <TrendingDown className="w-5 h-5 text-blue-600" />,
      label: t(lang, 'stats_churn'),
      value: 'Not tracked',
    },
  ];

  return (
    <div className="bg-blue-600 rounded-2xl p-6 text-white">
      <div className="flex items-center gap-2 mb-5">
        <span className="text-xs font-bold uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full">
          {t(lang, 'stats_demo')}
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {stats.map(s => (
          <div key={s.label} className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
              {s.icon}
            </div>
            <div>
              <p className="text-2xl font-bold leading-tight">{s.value}</p>
              <p className="text-blue-100 text-xs font-medium mt-0.5">{s.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

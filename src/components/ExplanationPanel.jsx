import { useTheme } from '../context/ThemeContext';

/**
 * explanations: Array<{ icon: string, text: string }>
 */
export default function ExplanationPanel({ explanations, verdict }) {
  const { isDark } = useTheme();

  const accentMap = {
    Reliable: isDark ? 'from-emerald-500/10 to-teal-500/5 border-emerald-500/20' : 'from-emerald-50 to-teal-50 border-emerald-200',
    Misleading: isDark ? 'from-red-500/10 to-rose-500/5 border-red-500/20' : 'from-red-50 to-rose-50 border-red-200',
    Uncertain: isDark ? 'from-amber-500/10 to-yellow-500/5 border-amber-500/20' : 'from-amber-50 to-yellow-50 border-amber-200',
  };

  return (
    <div
      className={`rounded-2xl p-6 border bg-gradient-to-br fade-in-up ${accentMap[verdict] || accentMap.Uncertain}`}
      style={{ animationDelay: '0.25s' }}
    >
      <div className="flex items-center gap-2 mb-5">
        <div className="w-1.5 h-5 bg-gradient-to-b from-indigo-500 to-violet-500 rounded-full" />
        <h3 className={`text-base font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Analysis Explanation
        </h3>
      </div>

      <ul className="space-y-3">
        {explanations.map((exp, i) => {
          const text = typeof exp === 'string' ? exp : exp.text;
          const icon = typeof exp === 'string' ? '💡' : (exp.icon || '💡');
          return (
          <li
            key={i}
            className={`flex items-start gap-3 p-3 rounded-xl transition-all fade-in-up ${
              isDark ? 'bg-white/4 hover:bg-white/7' : 'bg-white/70 hover:bg-white'
            }`}
            style={{ animationDelay: `${0.3 + i * 0.07}s` }}
          >
            <span className="text-lg flex-shrink-0 mt-0.5">{icon}</span>
            <span className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              {text}
            </span>
          </li>
        )})}
      </ul>
    </div>
  );
}

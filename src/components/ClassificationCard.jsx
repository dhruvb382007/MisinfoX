import { useTheme } from '../context/ThemeContext';

/**
 * Verdict: 'Reliable' | 'Misleading' | 'Uncertain'
 * confidence: 0–100 number
 */
export default function ClassificationCard({ verdict, confidence }) {
  const { isDark } = useTheme();

  const config = {
    Reliable: {
      color: 'emerald',
      icon: '✅',
      glow: 'glow-reliable',
      bar: 'from-emerald-500 to-teal-400',
      badge: isDark ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' : 'bg-emerald-50 text-emerald-700 border-emerald-200',
      ring: isDark ? 'ring-emerald-500/20' : 'ring-emerald-200',
    },
    Misleading: {
      color: 'red',
      icon: '🚨',
      glow: 'glow-misleading',
      bar: 'from-red-500 to-rose-400',
      badge: isDark ? 'bg-red-500/15 text-red-400 border-red-500/30' : 'bg-red-50 text-red-700 border-red-200',
      ring: isDark ? 'ring-red-500/20' : 'ring-red-200',
    },
    Uncertain: {
      color: 'amber',
      icon: '⚠️',
      glow: 'glow-uncertain',
      bar: 'from-amber-500 to-yellow-400',
      badge: isDark ? 'bg-amber-500/15 text-amber-400 border-amber-500/30' : 'bg-amber-50 text-amber-700 border-amber-200',
      ring: isDark ? 'ring-amber-500/20' : 'ring-amber-200',
    },
  };

  const c = config[verdict] || config.Uncertain;

  return (
    <div
      className={`glass rounded-2xl p-6 ring-1 ${c.ring} ${c.glow} fade-in-up`}
      style={{ animationDelay: '0.05s' }}
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className={`text-xs font-semibold uppercase tracking-widest mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            Classification
          </p>
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">{c.icon}</span>
            <h2 className={`text-2xl font-bold font-[Space_Grotesk,sans-serif] ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {verdict}
            </h2>
          </div>
        </div>
        <span className={`px-3 py-1.5 text-sm font-semibold rounded-full border ${c.badge}`}>
          {confidence}% confidence
        </span>
      </div>

      {/* Confidence bar */}
      <div className="space-y-2">
        <div className={`w-full h-2.5 rounded-full ${isDark ? 'bg-white/8' : 'bg-slate-200'} overflow-hidden`}>
          <div
            className={`h-full rounded-full bg-gradient-to-r ${c.bar} transition-all duration-1000 ease-out`}
            style={{ width: `${confidence}%` }}
          />
        </div>
        <div className="flex justify-between">
          <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>0%</span>
          <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>100%</span>
        </div>
      </div>
    </div>
  );
}

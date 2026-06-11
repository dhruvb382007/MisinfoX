import { useTheme } from '../context/ThemeContext';

export default function LoadingOverlay() {
  const { isDark } = useTheme();

  return (
    <div className={`rounded-2xl p-10 flex flex-col items-center justify-center gap-6 ${isDark ? 'bg-white/3' : 'bg-slate-50'}`}>
      {/* Spinner rings */}
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full border-2 border-indigo-500/20" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-indigo-500 animate-spin" />
        <div className="absolute inset-2 rounded-full border-2 border-transparent border-t-violet-500 animate-spin" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }} />
        <div className="absolute inset-4 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
          <span className="text-white text-xl">🔍</span>
        </div>
      </div>

      {/* Progress steps */}
      <div className="w-full max-w-xs space-y-2.5">
        {[
          { label: 'Parsing content structure…', delay: '0s' },
          { label: 'Running NLP analysis…', delay: '0.7s' },
          { label: 'Cross-referencing sources…', delay: '1.4s' },
          { label: 'Generating report…', delay: '2.1s' },
        ].map(({ label, delay }) => (
          <div key={label} className="flex items-center gap-3 opacity-0" style={{ animation: `fadeInUp 0.4s ease forwards ${delay}` }}>
            <div className="w-4 h-4 rounded-full shimmer" style={{ background: 'linear-gradient(90deg, rgba(99,102,241,0.3) 25%, rgba(99,102,241,0.6) 50%, rgba(99,102,241,0.3) 75%)', backgroundSize: '200% 100%', animation: `shimmer 1.8s infinite ${delay}` }} />
            <div className={`flex-1 h-2 rounded-full shimmer ${isDark ? 'bg-white/10' : 'bg-slate-200'}`} style={{ width: '100%' }} />
            <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{label}</span>
          </div>
        ))}
      </div>

      <p className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
        Analyzing content with AI…
      </p>
    </div>
  );
}

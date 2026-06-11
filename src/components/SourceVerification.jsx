import { useTheme } from '../context/ThemeContext';
import { ExternalLink, CheckCircle2, XCircle, HelpCircle } from 'lucide-react';

/**
 * sources: { trusted: boolean|null, message: string, items: Array<{ name, url, status, match }> }
 */
export default function SourceVerification({ sources }) {
  const { isDark } = useTheme();

  // Handle ML API returning an array directly
  const items = Array.isArray(sources) ? sources : (sources?.items || []);
  
  let trusted = null;
  let message = "Sources present mixed credibility";
  
  if (Array.isArray(sources)) {
      const avgCred = items.reduce((acc, curr) => acc + (curr.credibility || 0), 0) / (items.length || 1);
      const isVerified = items.some(s => s.status === 'verified');
      if (avgCred > 70 || isVerified) {
          trusted = true;
          message = "Supported by reliable fact-checkers";
      } else if (avgCred < 40) {
          trusted = false;
          message = "Contradicts established fact-checks";
      }
  } else if (sources) {
      trusted = sources.trusted ?? null;
      message = sources.message || message;
  }

  const statusIcon = {
    verified: <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0" />,
    disputed: <XCircle size={14} className="text-red-400 flex-shrink-0" />,
    checked: <XCircle size={14} className="text-red-400 flex-shrink-0" />,
    unverified: <HelpCircle size={14} className="text-amber-400 flex-shrink-0" />,
    partial: <HelpCircle size={14} className="text-amber-400 flex-shrink-0" />,
  };

  const bannerStyles = {
    true: isDark
      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
      : 'bg-emerald-50 border-emerald-200 text-emerald-700',
    false: isDark
      ? 'bg-red-500/10 border-red-500/30 text-red-400'
      : 'bg-red-50 border-red-200 text-red-700',
    null: isDark
      ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
      : 'bg-amber-50 border-amber-200 text-amber-700',
  };

  const bannerIcon = {
    true: '🛡️',
    false: '🚫',
    null: '⚠️',
  };

  const key = String(trusted);

  return (
    <div
      className={`glass rounded-2xl p-6 fade-in-up`}
      style={{ animationDelay: '0.35s' }}
    >
      <div className="flex items-center gap-2 mb-5">
        <div className="w-1.5 h-5 bg-gradient-to-b from-indigo-500 to-violet-500 rounded-full" />
        <h3 className={`text-base font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Source Verification
        </h3>
      </div>

      {/* Banner */}
      <div className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border mb-5 ${bannerStyles[key]}`}>
        <span className="text-xl">{bannerIcon[key]}</span>
        <span className="text-sm font-medium">{message}</span>
      </div>

      {/* Source list */}
      <div className="space-y-2.5">
        {items.map((source) => (
          <div
            key={source.name}
            className={`flex items-center justify-between p-3.5 rounded-xl transition-all ${
              isDark ? 'bg-white/4 hover:bg-white/7' : 'bg-slate-50 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {statusIcon[source.status]}
              <div>
                <span className={`text-sm font-medium ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                  {source.name}
                </span>
                <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{source.match}</p>
              </div>
            </div>
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg transition-colors ${
                isDark
                  ? 'text-indigo-400 hover:bg-indigo-500/15'
                  : 'text-indigo-600 hover:bg-indigo-50'
              }`}
            >
              Visit <ExternalLink size={11} />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

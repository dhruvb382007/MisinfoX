import { useTheme } from '../context/ThemeContext';
import { useMemo } from 'react';

/**
 * highlights: Array<{ id?, text, type: 'suspicious' | 'verified' | 'neutral' }>
 */
export default function HighlightedText({ highlights, fullText }) {
  const { isDark } = useTheme();

  const segments = useMemo(() => {
    if (!fullText) return [];
    if (!highlights || highlights.length === 0) {
      return [{ id: '0', text: fullText, type: 'neutral' }];
    }
    
    // Sort words longest first to prevent partial overlaps
    const sorted = [...highlights].sort((a,b) => (b.text?.length || 0) - (a.text?.length || 0)).filter(h => h.text);
    if (sorted.length === 0) return [{ id: '0', text: fullText, type: 'neutral' }];
    
    // Escape regex strings
    const patternStr = sorted.map(h => h.text.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')).join('|');
    const regex = new RegExp(`(${patternStr})`, 'gi');
    
    const parts = fullText.split(regex);
    return parts.map((part, i) => {
      if (!part) return null;
      const match = sorted.find(h => h.text.toLowerCase() === part.toLowerCase());
      return {
        id: i,
        text: part,
        type: match ? match.type : 'neutral'
      };
    }).filter(Boolean);
  }, [fullText, highlights]);

  const typeStyles = {
    suspicious: isDark
      ? 'bg-red-500/20 text-red-300 border-b-2 border-red-500/60 rounded-sm'
      : 'bg-red-100 text-red-800 border-b-2 border-red-400 rounded-sm',
    verified: isDark
      ? 'bg-emerald-500/15 text-emerald-300 border-b-2 border-emerald-500/60 rounded-sm'
      : 'bg-emerald-100 text-emerald-800 border-b-2 border-emerald-400 rounded-sm',
    neutral: isDark ? 'text-slate-300' : 'text-slate-700',
  };

  return (
    <div
      className={`glass rounded-2xl p-6 fade-in-up`}
      style={{ animationDelay: '0.15s' }}
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1.5 h-5 bg-gradient-to-b from-indigo-500 to-violet-500 rounded-full" />
        <h3 className={`text-base font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Highlighted Text View
        </h3>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-5">
        {[
          { type: 'suspicious', label: 'Suspicious phrase', color: isDark ? 'bg-red-500/20 border-red-500/60' : 'bg-red-100 border-red-400' },
          { type: 'verified', label: 'Verified / Neutral', color: isDark ? 'bg-emerald-500/15 border-emerald-500/60' : 'bg-emerald-100 border-emerald-400' },
        ].map(({ label, color }) => (
          <div key={label} className="flex items-center gap-2">
            <span className={`w-4 h-3 rounded-sm border-b-2 ${color}`} />
            <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{label}</span>
          </div>
        ))}
      </div>

      {/* Highlighted text block */}
      <div className={`rounded-xl p-5 text-sm leading-7 tracking-wide ${isDark ? 'bg-white/3' : 'bg-slate-50'}`}>
        {segments.map((segment) => (
          <span key={segment.id} className={`${typeStyles[segment.type] || typeStyles.neutral} ${segment.type !== 'neutral' ? 'px-0.5' : ''}`}>
            {segment.text}
          </span>
        ))}
      </div>
    </div>
  );
}

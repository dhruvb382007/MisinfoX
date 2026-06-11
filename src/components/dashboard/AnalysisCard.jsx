// src/components/dashboard/AnalysisCard.jsx
import { motion } from 'framer-motion';
import { Trash2, RefreshCw, ShieldCheck, AlertTriangle, HelpCircle, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';

function timeAgo(ts) {
  const diff = Date.now() - new Date(ts).getTime();
  const m = Math.floor(diff / 60000);
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(diff / 86400000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  if (h < 24) return `${h}h ago`;
  if (d < 7) return `${d}d ago`;
  return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const VERDICT_STYLES = {
  Reliable:   { cls: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25', bar: 'bg-emerald-400', icon: ShieldCheck },
  Misleading: { cls: 'text-red-400 bg-red-500/10 border-red-500/25',             bar: 'bg-red-400',     icon: AlertTriangle },
  Uncertain:  { cls: 'text-amber-400 bg-amber-500/10 border-amber-500/25',        bar: 'bg-amber-400',   icon: HelpCircle },
};

export default function AnalysisCard({ item, index, onDelete }) {
  const navigate = useNavigate();
  const s = VERDICT_STYLES[item.verdict] ?? VERDICT_STYLES.Uncertain;
  const Icon = s.icon;

  const handleDelete = async (e) => {
    e.stopPropagation();
    try { await api.delete(`/user/history/${item.id}`); } catch (_) {}
    onDelete?.(item.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.35 }}
      whileHover={{ y: -1 }}
      className="group relative rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.10] transition-all duration-200 p-4 cursor-default"
    >
      {/* Verdict + time row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg border flex-shrink-0 ${s.cls}`}>
          <Icon size={11} />
          {item.verdict}
        </span>
        <span className="text-xs text-white/25 font-cabin flex-shrink-0 mt-0.5">{timeAgo(item.ts)}</span>
      </div>

      {/* Claim text */}
      <p className="text-sm text-white/70 font-cabin leading-relaxed line-clamp-2 mb-3">
        {item.text}
      </p>

      {/* Confidence bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] text-white/30 font-cabin">Confidence</span>
          <span className="text-[11px] font-semibold text-white/50">{item.confidence}%</span>
        </div>
        <div className="h-1 w-full rounded-full bg-white/[0.06] overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${item.confidence}%` }}
            transition={{ delay: index * 0.05 + 0.2, duration: 0.6, ease: 'easeOut' }}
            className={`h-full rounded-full ${s.bar} opacity-70`}
          />
        </div>
      </div>

      {/* Actions — appear on hover */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/analyzer')}
          className="flex items-center gap-1 text-[11px] text-indigo-400/0 group-hover:text-indigo-400 transition-colors duration-200 font-cabin"
        >
          Re-analyze <ChevronRight size={11} />
        </button>
        <button
          onClick={handleDelete}
          className="p-1.5 text-white/0 group-hover:text-white/30 hover:!text-red-400 transition-colors duration-200 rounded-lg hover:bg-red-500/10"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </motion.div>
  );
}

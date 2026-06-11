// src/components/dashboard/MisinfoCategories.jsx
import { motion } from 'framer-motion';
import { Flag, Cpu, Heart, TrendingUp } from 'lucide-react';
import InsightCard from './InsightCard';

const CATS = [
  { label: 'Politics',    icon: Flag,       color: 'from-red-500 to-rose-500',       keywords: ['election','government','president','senate','vote','political','democrat','republican','congress'] },
  { label: 'Technology',  icon: Cpu,        color: 'from-blue-500 to-cyan-500',      keywords: ['ai','tech','software','app','data','algorithm','hack','cyber','robot','digital'] },
  { label: 'Health',      icon: Heart,      color: 'from-emerald-500 to-teal-500',   keywords: ['vaccine','virus','covid','drug','medicine','health','disease','hospital','cancer','cure'] },
  { label: 'Finance',     icon: TrendingUp, color: 'from-amber-500 to-orange-500',   keywords: ['crypto','bitcoin','stock','market','bank','economy','inflation','invest','scam','fraud'] },
];

function deriveShares(history) {
  const counts = { Politics: 1, Technology: 1, Health: 1, Finance: 1 };
  history.forEach(h => {
    const text = (h.text || '').toLowerCase();
    CATS.forEach(c => {
      if (c.keywords.some(kw => text.includes(kw))) counts[c.label]++;
    });
  });
  const total = Object.values(counts).reduce((s, v) => s + v, 0);
  return Object.fromEntries(Object.entries(counts).map(([k, v]) => [k, Math.round((v / total) * 100)]));
}

export default function MisinfoCategories({ history }) {
  const shares = deriveShares(history);
  const sorted = [...CATS].sort((a, b) => shares[b.label] - shares[a.label]);

  return (
    <InsightCard title="Top Misinformation Categories" icon={Flag} iconGradient="from-rose-500 to-pink-500" delay={0.5}>
      <div className="space-y-3">
        {sorted.map((cat, i) => (
          <div key={cat.label}>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <div className={`w-5 h-5 rounded-md bg-gradient-to-br ${cat.color} flex items-center justify-center`}>
                  <cat.icon size={10} className="text-white" />
                </div>
                <span className="text-xs text-white/60 font-cabin">{cat.label}</span>
              </div>
              <span className="text-xs font-semibold text-white/50">{shares[cat.label]}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-white/[0.05] overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${shares[cat.label]}%` }}
                transition={{ delay: 0.5 + i * 0.08, duration: 0.7, ease: 'easeOut' }}
                className={`h-full rounded-full bg-gradient-to-r ${cat.color} opacity-80`}
              />
            </div>
          </div>
        ))}
      </div>
    </InsightCard>
  );
}

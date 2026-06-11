// src/components/dashboard/StatsCard.jsx
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { SparklineChart } from './SparklineChart';

function AnimatedCounter({ target, duration = 1200 }) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (target === 0) { setValue(0); return; }
    const start = performance.now();
    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration]);
  return value;
}

export default function StatsCard({ icon: Icon, title, value, suffix = '', trend, trendLabel, gradient, sparkData, delay = 0 }) {
  const isUp = trend > 0;
  const isNeutral = trend === 0 || trend === undefined;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.03] backdrop-blur-xl p-5 group cursor-default"
    >
      {/* Subtle gradient top border on hover */}
      <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
      {/* Background glow */}
      <div className={`absolute -top-8 -right-8 w-24 h-24 rounded-full bg-gradient-to-br ${gradient} opacity-[0.06] blur-2xl group-hover:opacity-10 transition-opacity duration-500`} />

      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg flex-shrink-0`}>
            <Icon size={18} className="text-white" />
          </div>
          {!isNeutral && (
            <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg ${isUp ? 'text-emerald-400 bg-emerald-500/10' : 'text-red-400 bg-red-500/10'}`}>
              {isUp ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
              {Math.abs(trend)}%
            </div>
          )}
        </div>

        {/* Value */}
        <div className="mb-1">
          <span className="text-3xl font-bold text-white tracking-tight">
            <AnimatedCounter target={typeof value === 'number' ? value : 0} />
          </span>
          {suffix && <span className="text-lg font-semibold text-white/60 ml-0.5">{suffix}</span>}
        </div>

        {/* Label */}
        <p className="text-sm text-white/40 font-cabin mb-3">{title}</p>

        {/* Trend label + sparkline */}
        <div className="flex items-end justify-between gap-2">
          {trendLabel && (
            <p className="text-xs text-white/25 font-cabin flex items-center gap-1">
              {isNeutral ? <Minus size={10} className="text-white/20" /> : isUp ? <TrendingUp size={10} className="text-emerald-400" /> : <TrendingDown size={10} className="text-red-400" />}
              {trendLabel}
            </p>
          )}
          {sparkData && <SparklineChart data={sparkData} gradient={gradient} />}
        </div>
      </div>
    </motion.div>
  );
}

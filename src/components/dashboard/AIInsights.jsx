// src/components/dashboard/AIInsights.jsx
import { motion } from 'framer-motion';
import { Sparkles, Brain, Target, Flame } from 'lucide-react';
import InsightCard from './InsightCard';

function deriveInsights(history) {
  if (!history.length) return [];
  
  const total = history.length;
  const reliable = history.filter(h => h.verdict === 'Reliable').length;
  const misleading = history.filter(h => h.verdict === 'Misleading').length;
  const avgConf = Math.round(history.reduce((s, h) => s + (h.confidence || 0), 0) / total);

  // Last 7 days
  const cutoff = Date.now() - 7 * 86400000;
  const recentCount = history.filter(h => new Date(h.ts).getTime() > cutoff).length;

  const insights = [];

  if (misleading > 0) {
    insights.push({
      icon: Flame,
      color: 'text-red-400',
      bg: 'bg-red-500/10',
      text: `${misleading} misleading claim${misleading > 1 ? 's' : ''} detected — stay vigilant.`,
    });
  }
  insights.push({
    icon: Target,
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10',
    text: `Average confidence this week: ${avgConf}%`,
  });
  if (reliable > 0) {
    insights.push({
      icon: Brain,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      text: `${Math.round((reliable / total) * 100)}% of your analyses were reliable sources.`,
    });
  }
  insights.push({
    icon: Sparkles,
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
    text: `${recentCount} claim${recentCount !== 1 ? 's' : ''} analyzed in the last 7 days.`,
  });

  return insights.slice(0, 3);
}

export default function AIInsights({ history }) {
  const insights = deriveInsights(history);

  return (
    <InsightCard title="AI Insights" icon={Brain} iconGradient="from-violet-500 to-purple-600" delay={0.5}>
      {insights.length === 0 ? (
        <p className="text-xs text-white/30 font-cabin">Analyze some claims to generate insights.</p>
      ) : (
        <div className="space-y-2.5">
          {insights.map((ins, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className={`flex items-start gap-2.5 p-2.5 rounded-xl ${ins.bg}`}
            >
              <ins.icon size={13} className={`${ins.color} flex-shrink-0 mt-0.5`} />
              <p className="text-xs text-white/60 font-cabin leading-relaxed">{ins.text}</p>
            </motion.div>
          ))}
        </div>
      )}
    </InsightCard>
  );
}

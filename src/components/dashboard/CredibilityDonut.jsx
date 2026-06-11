// src/components/dashboard/CredibilityDonut.jsx
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = { Reliable: '#10b981', Misleading: '#ef4444', Uncertain: '#f59e0b' };
const GLOW = { Reliable: 'text-emerald-400', Misleading: 'text-red-400', Uncertain: 'text-amber-400' };

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="bg-[#1a1127] border border-white/10 rounded-xl px-3 py-2 text-xs shadow-xl">
      <div className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.payload.fill }} />
        <span className="text-white font-semibold">{d.name}</span>
      </div>
      <p className="text-white/50 font-cabin mt-0.5">{d.value} analyses ({d.payload.pct}%)</p>
    </div>
  );
};

export default function CredibilityDonut({ data }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const chartData = data.map(d => ({
    ...d,
    fill: COLORS[d.name] || '#6366f1',
    pct: total ? Math.round((d.value / total) * 100) : 0,
  }));

  const dominant = chartData.reduce((a, b) => (a.value >= b.value ? a : b), chartData[0] || {});

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      className="rounded-2xl border border-white/[0.07] bg-white/[0.03] backdrop-blur-xl p-5"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1.5 h-5 rounded-full bg-gradient-to-b from-indigo-500 to-violet-500" />
        <h3 className="text-sm font-semibold text-white">Credibility Distribution</h3>
      </div>

      <div className="flex items-center gap-4">
        {/* Donut */}
        <div className="relative flex-shrink-0" style={{ width: 90, height: 90 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData.length ? chartData : [{ name: 'Empty', value: 1, fill: 'rgba(255,255,255,0.05)' }]}
                cx="50%" cy="50%"
                innerRadius={28} outerRadius={42}
                strokeWidth={0}
                dataKey="value"
                isAnimationActive
                animationDuration={700}
              >
                {chartData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          {dominant?.name && (
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className={`text-[10px] font-bold ${GLOW[dominant.name] || 'text-white'}`}>
                {dominant.pct}%
              </span>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-2 flex-1 min-w-0">
          {chartData.map(d => (
            <div key={d.name} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: d.fill }} />
                <span className="text-xs text-white/50 font-cabin truncate">{d.name}</span>
              </div>
              <span className="text-xs font-semibold text-white/70 flex-shrink-0">{d.value}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

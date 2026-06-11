// src/components/dashboard/ActivityChart.jsx
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1a1127] border border-white/10 rounded-xl px-3 py-2 text-xs shadow-xl">
      <p className="text-white/50 font-cabin mb-0.5">{label}</p>
      <p className="text-white font-semibold">{payload[0].value} analyses</p>
    </div>
  );
};

export default function ActivityChart({ data }) {
  const maxVal = Math.max(...(data.map(d => d.count)), 1);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="rounded-2xl border border-white/[0.07] bg-white/[0.03] backdrop-blur-xl p-5"
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-5 rounded-full bg-gradient-to-b from-indigo-500 to-violet-500" />
          <h3 className="text-sm font-semibold text-white">Fact-Check Activity</h3>
        </div>
        <span className="text-xs text-white/30 font-cabin">Last 7 days</span>
      </div>
      <div style={{ height: 120 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barSize={14}>
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11, fontFamily: 'Cabin, sans-serif' }}
            />
            <YAxis hide domain={[0, maxVal + 1]} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)', radius: 6 }} />
            <Bar dataKey="count" radius={[6, 6, 2, 2]} isAnimationActive animationDuration={700}>
              {data.map((entry, i) => (
                <Cell
                  key={i}
                  fill={entry.count > 0 ? 'url(#activityGrad)' : 'rgba(255,255,255,0.04)'}
                />
              ))}
            </Bar>
            <defs>
              <linearGradient id="activityGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.6} />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

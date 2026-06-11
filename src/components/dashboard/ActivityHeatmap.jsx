// src/components/dashboard/ActivityHeatmap.jsx
import { motion } from 'framer-motion';
import InsightCard from './InsightCard';
import { CalendarDays } from 'lucide-react';

function buildHeatmapGrid(history) {
  // Build 7 weeks × 7 days grid (49 cells, Sun=0 .. Sat=6)
  const today = new Date();
  const cells = [];
  for (let week = 6; week >= 0; week--) {
    for (let day = 6; day >= 0; day--) {
      const d = new Date(today);
      d.setDate(today.getDate() - week * 7 - day);
      d.setHours(0, 0, 0, 0);
      const key = d.toDateString();
      const count = history.filter(h => new Date(h.ts).toDateString() === key).length;
      cells.push({ date: d, count, key });
    }
  }
  return cells;
}

const DOW = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

function cellColor(count) {
  if (count === 0) return 'bg-white/[0.04]';
  if (count === 1) return 'bg-indigo-500/30';
  if (count === 2) return 'bg-indigo-500/50';
  if (count <= 4)  return 'bg-indigo-500/70';
  return 'bg-indigo-500';
}

export default function ActivityHeatmap({ history }) {
  const cells = buildHeatmapGrid(history);

  return (
    <InsightCard title="Activity Heatmap" icon={CalendarDays} iconGradient="from-sky-500 to-indigo-600" delay={0.55}>
      <div className="overflow-x-auto">
        <div className="flex gap-1 min-w-[220px]">
          {/* Day labels column */}
          <div className="flex flex-col gap-1 mr-1">
            {DOW.map((d, i) => (
              <div key={i} className="w-3 h-3 flex items-center justify-center">
                <span className="text-[8px] text-white/20 font-cabin">{i % 2 === 0 ? d : ''}</span>
              </div>
            ))}
          </div>
          {/* 7 weeks */}
          {Array.from({ length: 7 }, (_, week) => (
            <div key={week} className="flex flex-col gap-1">
              {cells.slice(week * 7, week * 7 + 7).map((cell, i) => (
                <motion.div
                  key={cell.key}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: (week * 7 + i) * 0.005 + 0.55, duration: 0.2 }}
                  title={`${cell.date.toLocaleDateString()}: ${cell.count} analyses`}
                  className={`w-3 h-3 rounded-sm transition-colors duration-200 cursor-default ${cellColor(cell.count)}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-1.5 mt-3">
        <span className="text-[10px] text-white/20 font-cabin">Less</span>
        {[0, 1, 2, 3, 4].map(v => (
          <div key={v} className={`w-2.5 h-2.5 rounded-sm ${cellColor(v)}`} />
        ))}
        <span className="text-[10px] text-white/20 font-cabin">More</span>
      </div>
    </InsightCard>
  );
}

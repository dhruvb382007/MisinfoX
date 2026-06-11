// src/components/dashboard/QuickActions.jsx
import { motion } from 'framer-motion';
import { Zap, Settings, Download, History } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import InsightCard from './InsightCard';

const ACTIONS = [
  {
    icon: Zap,
    label: 'Analyze Claim',
    desc: 'Fact-check new text',
    href: '/analyzer',
    gradient: 'from-indigo-500 to-violet-600',
    hover: 'hover:border-indigo-500/30 hover:bg-indigo-500/5',
  },
  {
    icon: Settings,
    label: 'API Key',
    desc: 'Manage Gemini key',
    href: '/settings',
    gradient: 'from-violet-500 to-purple-600',
    hover: 'hover:border-violet-500/30 hover:bg-violet-500/5',
  },
  {
    icon: Download,
    label: 'Export Data',
    desc: 'Download history CSV',
    href: null,
    gradient: 'from-teal-500 to-emerald-600',
    hover: 'hover:border-teal-500/30 hover:bg-teal-500/5',
    action: 'export',
  },
  {
    icon: History,
    label: 'View All',
    desc: 'Full history log',
    href: null,
    gradient: 'from-amber-500 to-orange-500',
    hover: 'hover:border-amber-500/30 hover:bg-amber-500/5',
    action: 'scroll',
  },
];

export default function QuickActions({ onExport }) {
  const navigate = useNavigate();

  const handleClick = (action) => {
    if (action.href) { navigate(action.href); return; }
    if (action.action === 'export') { onExport?.(); }
    if (action.action === 'scroll') {
      document.getElementById('analysis-history')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <InsightCard title="Quick Actions" icon={Zap} delay={0.6}>
      <div className="grid grid-cols-2 gap-2">
        {ACTIONS.map((a, i) => (
          <motion.button
            key={a.label}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleClick(a)}
            className={`flex flex-col items-start gap-2 p-3 rounded-xl border border-white/[0.07] transition-all duration-200 text-left ${a.hover}`}
          >
            <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${a.gradient} flex items-center justify-center`}>
              <a.icon size={13} className="text-white" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white/80">{a.label}</p>
              <p className="text-[11px] text-white/30 font-cabin">{a.desc}</p>
            </div>
          </motion.button>
        ))}
      </div>
    </InsightCard>
  );
}

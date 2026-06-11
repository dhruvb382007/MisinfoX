// src/components/dashboard/InsightCard.jsx
import { motion } from 'framer-motion';

export default function InsightCard({ title, icon: Icon, iconGradient = 'from-indigo-500 to-violet-500', children, delay = 0, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className={`rounded-2xl border border-white/[0.07] bg-white/[0.03] backdrop-blur-xl p-5 ${className}`}
    >
      <div className="flex items-center gap-2.5 mb-4">
        {Icon && (
          <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${iconGradient} flex items-center justify-center flex-shrink-0`}>
            <Icon size={14} className="text-white" />
          </div>
        )}
        <h3 className="text-sm font-semibold text-white">{title}</h3>
      </div>
      {children}
    </motion.div>
  );
}

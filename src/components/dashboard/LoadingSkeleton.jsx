// src/components/dashboard/LoadingSkeleton.jsx
import { motion } from 'framer-motion';

function Bone({ className }) {
  return (
    <motion.div
      className={`bg-white/[0.05] rounded-lg overflow-hidden relative ${className}`}
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}

export default function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Bone className="h-8 w-48" />
          <Bone className="h-4 w-32" />
        </div>
        <Bone className="h-10 w-36 rounded-full" />
      </div>

      {/* Stats grid skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-2xl border border-white/[0.05] p-5 space-y-4">
            <div className="flex justify-between">
              <Bone className="w-10 h-10 rounded-xl" />
              <Bone className="w-14 h-6 rounded-lg" />
            </div>
            <Bone className="h-8 w-20" />
            <Bone className="h-4 w-28" />
          </div>
        ))}
      </div>

      {/* Content grid skeleton */}
      <div className="grid lg:grid-cols-[1fr,340px] gap-5">
        <div className="rounded-2xl border border-white/[0.05] p-5 space-y-3">
          <Bone className="h-5 w-36" />
          <Bone className="h-10 w-full rounded-xl" />
          {[...Array(4)].map((_, i) => (
            <Bone key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-2xl border border-white/[0.05] p-5 space-y-3">
              <Bone className="h-5 w-32" />
              <Bone className="h-28 w-full rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

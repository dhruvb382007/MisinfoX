/**
 * GradientButton — adapted from gradient-menu pill style.
 * Always shows text (CTA-style), with gradient bg + glow behind.
 *
 * Props:
 *  - children: button label
 *  - onClick: click handler
 *  - gradientFrom: CSS color string (default indigo)
 *  - gradientTo: CSS color string (default violet)
 *  - variant: 'solid' | 'ghost'  (ghost = transparent with gradient on hover)
 *  - icon: optional lucide icon component
 *  - className: extra classes
 */
export default function GradientButton({
  children,
  onClick,
  gradientFrom = '#6366f1',
  gradientTo = '#8b5cf6',
  variant = 'solid',
  icon: Icon,
  className = '',
  id,
}) {
  const gradientStyle = {
    '--gf': gradientFrom,
    '--gt': gradientTo,
  };

  if (variant === 'ghost') {
    return (
      <button
        id={id}
        onClick={onClick}
        style={gradientStyle}
        className={`group relative inline-flex items-center justify-center gap-2.5
          px-8 py-3.5 rounded-full font-cabin font-medium text-base
          border border-white/15 bg-white/5 text-white/70
          hover:text-white hover:border-[var(--gf)]/50
          transition-all duration-400 cursor-pointer overflow-visible
          ${className}`}
      >
        {/* Ghost: gradient bg fades in on hover */}
        <span
          className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100
            transition-opacity duration-400"
          style={{ background: `linear-gradient(45deg, var(--gf), var(--gt))` }}
        />
        {/* Glow behind */}
        <span
          className="absolute top-[8px] inset-x-0 h-full rounded-full -z-10
            opacity-0 group-hover:opacity-40 blur-[14px]
            transition-opacity duration-400"
          style={{ background: `linear-gradient(45deg, var(--gf), var(--gt))` }}
        />
        {Icon && (
          <Icon
            size={16}
            className="relative z-10 transition-transform duration-300 group-hover:scale-110"
          />
        )}
        <span className="relative z-10">{children}</span>
      </button>
    );
  }

  // ── Solid variant ────────────────────────────────────────────────────────────
  return (
    <button
      id={id}
      onClick={onClick}
      style={gradientStyle}
      className={`group relative inline-flex items-center justify-center gap-2.5
        px-8 py-3.5 rounded-full font-cabin font-semibold text-base text-white
        transition-all duration-300 cursor-pointer overflow-visible
        hover:brightness-110 active:scale-95
        ${className}`}
    >
      {/* Gradient background (always on) */}
      <span
        className="absolute inset-0 rounded-full"
        style={{ background: `linear-gradient(45deg, var(--gf), var(--gt))` }}
      />
      {/* Glow behind — enhances on hover */}
      <span
        className="absolute top-[10px] inset-x-0 h-full rounded-full -z-10 blur-[16px]
          opacity-50 group-hover:opacity-80 transition-opacity duration-400"
        style={{ background: `linear-gradient(45deg, var(--gf), var(--gt))` }}
      />
      {Icon && (
        <Icon
          size={16}
          className="relative z-10 transition-transform duration-300 group-hover:translate-x-0.5"
        />
      )}
      <span className="relative z-10">{children}</span>
    </button>
  );
}

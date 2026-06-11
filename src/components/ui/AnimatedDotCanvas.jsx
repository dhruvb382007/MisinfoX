import { useEffect, useRef } from 'react';

/**
 * Animated dot-matrix background using Canvas 2D API.
 * Dots reveal from center outward, then continuously flicker.
 *
 * Props:
 *  - colors: array of [r,g,b] arrays  e.g. [[255,255,255]]
 *  - dotSize: number (default 2.5)
 *  - gridSize: spacing in px (default 22)
 *  - speed: flicker speed multiplier (default 1)
 *  - className: extra classes for the wrapper div
 *  - showGradient: boolean (default true) - radial vignette over canvas
 */
export default function AnimatedDotCanvas({
  colors = [[255, 255, 255]],
  dotSize = 2.5,
  gridSize = 22,
  speed = 1,
  className = '',
  showGradient = true,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // ── Seeded random per grid cell ───────────────────────────────────────
    const cellRnd = (col, row, offset = 0) => {
      const x = Math.sin(col * 127.1 + row * 311.7 + offset) * 43758.5453;
      return x - Math.floor(x);
    };

    // ── Resize to fill parent ─────────────────────────────────────────────
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let rafId;
    const startTime = performance.now();

    // Pre-compute per-cell data (recalculate on resize via resize flag)
    let cellData = [];
    let lastW = 0, lastH = 0;

    const buildCells = (w, h) => {
      cellData = [];
      const cols = Math.ceil(w / gridSize) + 1;
      const rows = Math.ceil(h / gridSize) + 1;
      const cx = cols / 2;
      const cy = rows / 2;
      const maxDist = Math.sqrt(cx * cx + cy * cy);

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * gridSize;
          const y = r * gridSize;
          const dx = c - cx;
          const dy = r - cy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const normDist = dist / maxDist;

          const seed = cellRnd(c, r);
          const colorIdx = Math.floor(cellRnd(c, r, 99) * colors.length);
          const introDelay = normDist * 1.2 + seed * 0.4; // seconds
          const flickSpeed = (0.4 + seed * 1.2) * speed;
          const flickPhase = seed * Math.PI * 6.28;
          const baseOpacity = 0.07 + seed * 0.18;

          cellData.push({ x, y, seed, colorIdx, introDelay, flickSpeed, flickPhase, baseOpacity });
        }
      }
    };

    const draw = (now) => {
      rafId = requestAnimationFrame(draw);
      const t = (now - startTime) / 1000; // seconds elapsed

      const lw = canvas.offsetWidth;
      const lh = canvas.offsetHeight;
      if (lw !== lastW || lh !== lastH) {
        buildCells(lw, lh);
        lastW = lw;
        lastH = lh;
      }
      if (!cellData.length) return;

      ctx.clearRect(0, 0, lw, lh);

      for (const cell of cellData) {
        // Intro reveal: opacity ramps from 0 → base when t passes introDelay
        const revealed = Math.min(1, Math.max(0, (t - cell.introDelay) / 0.3));

        // Continuous flicker after reveal
        const flicker = Math.sin(t * cell.flickSpeed * Math.PI * 2 + cell.flickPhase);
        const flickerBoost = ((flicker + 1) / 2) * 0.22;

        const opacity = revealed * (cell.baseOpacity + flickerBoost);
        if (opacity < 0.005) continue;

        const [r, g, b] = colors[cell.colorIdx];
        ctx.beginPath();
        ctx.arc(cell.x, cell.y, dotSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${opacity.toFixed(3)})`;
        ctx.fill();
      }
    };

    rafId = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, [colors, dotSize, gridSize, speed]);

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <canvas ref={canvasRef} className="w-full h-full" style={{ display: 'block' }} />
      {showGradient && (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_65%_65%_at_50%_50%,_rgba(0,0,0,0.82)_0%,_rgba(0,0,0,0.35)_60%,_transparent_100%)]" />
      )}
    </div>
  );
}

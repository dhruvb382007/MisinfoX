import { useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

/**
 * propagation: { nodes: [...], edges: [...] }
 */
export default function PropagationGraph({ propagation }) {
  const { isDark } = useTheme();
  const canvasRef = useRef(null);

  const nodeTypeColor = {
    origin: { fill: '#6366f1', stroke: '#a5b4fc', label: '#fff' },
    social: { fill: '#0ea5e9', stroke: '#7dd3fc', label: '#fff' },
    messenger: { fill: '#10b981', stroke: '#6ee7b7', label: '#fff' },
    media: { fill: '#f59e0b', stroke: '#fcd34d', label: '#fff' },
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !propagation) return;
    const ctx = canvas.getContext('2d');
    const { nodes, edges } = propagation;

    // Scale canvas for high-DPI screens
    const W = canvas.offsetWidth;
    const H = canvas.offsetHeight;
    canvas.width = W * window.devicePixelRatio;
    canvas.height = H * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // API returns x and y coordinates as percentages (0-100)
    // We want to map these to the canvas dimensions, leaving some padding (10%)
    const paddingX = W * 0.1;
    const paddingY = H * 0.1;
    const useW = W - paddingX * 2;
    const useH = H - paddingY * 2;

    const scaled = nodes.map((n) => ({
      ...n,
      sx: paddingX + (n.x / 100) * useW,
      sy: paddingY + (n.y / 100) * useH,
    }));
    const nodeMap = Object.fromEntries(scaled.map((n) => [n.id, n]));

    const draw = (t) => {
      ctx.clearRect(0, 0, W, H);

      // Draw edges
      edges.forEach(({ from, to }) => {
        const a = nodeMap[from];
        const b = nodeMap[to];
        if (!a || !b) return;

        const gradient = ctx.createLinearGradient(a.sx, a.sy, b.sx, b.sy);
        gradient.addColorStop(0, 'rgba(99,102,241,0.5)');
        gradient.addColorStop(1, 'rgba(99,102,241,0.1)');
        ctx.beginPath();
        ctx.moveTo(a.sx, a.sy);
        ctx.lineTo(b.sx, b.sy);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.5;
        ctx.setLineDash([5, 5]);
        ctx.lineDashOffset = -t * 0.015;
        ctx.stroke();
        ctx.setLineDash([]);

        // Arrow
        const angle = Math.atan2(b.sy - a.sy, b.sx - a.sx);
        const arrowLen = 8;
        const mx = (a.sx + b.sx) / 2;
        const my = (a.sy + b.sy) / 2;
        ctx.beginPath();
        ctx.moveTo(mx, my);
        ctx.lineTo(mx - arrowLen * Math.cos(angle - 0.4), my - arrowLen * Math.sin(angle - 0.4));
        ctx.lineTo(mx - arrowLen * Math.cos(angle + 0.4), my - arrowLen * Math.sin(angle + 0.4));
        ctx.closePath();
        ctx.fillStyle = 'rgba(99,102,241,0.6)';
        ctx.fill();
      });

      // Draw nodes
      scaled.forEach((node) => {
        // Handle variations in API text types (source vs origin, news vs media)
        const typeKey = node.type === 'source' ? 'origin' : 
                        node.type === 'news' ? 'media' : 
                        node.type === 'blog' ? 'media' : node.type;
        const colors = nodeTypeColor[typeKey] || { fill: '#94a3b8', stroke: '#cbd5e1', label: '#fff' };
        
        const pulse = Math.sin(t * 0.002 + node.sx) * 2;
        const baseSize = node.size || (node.id === 'origin' ? 14 : 8);
        const r = Math.max(1, baseSize + (node.id === 'origin' ? Math.abs(pulse) : 0));

        // Glow
        const glow = ctx.createRadialGradient(node.sx, node.sy, 0, node.sx, node.sy, r * 2.5);
        glow.addColorStop(0, colors.fill + '55');
        glow.addColorStop(1, colors.fill + '00');
        ctx.beginPath();
        ctx.arc(node.sx, node.sy, r * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        // Circle
        ctx.beginPath();
        ctx.arc(node.sx, node.sy, r, 0, Math.PI * 2);
        ctx.fillStyle = colors.fill;
        ctx.fill();
        ctx.strokeStyle = colors.stroke;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Label
        ctx.font = `${node.type === 'origin' ? 'bold ' : ''}11px Inter, sans-serif`;
        ctx.fillStyle = isDark ? '#cbd5e1' : '#334155';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(node.label, node.sx, node.sy + r + 6);
      });
    };

    let raf;
    let t = 0;
    const animate = () => {
      t++;
      draw(t);
      raf = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(raf);
  }, [propagation, isDark]);

  const legendItems = [
    { color: '#6366f1', label: 'Origin Post' },
    { color: '#0ea5e9', label: 'Social Platform' },
    { color: '#10b981', label: 'Messaging App' },
    { color: '#f59e0b', label: 'Media / Blog' },
  ];

  return (
    <div
      className={`glass rounded-2xl p-6 fade-in-up`}
      style={{ animationDelay: '0.45s' }}
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-5 bg-gradient-to-b from-indigo-500 to-violet-500 rounded-full" />
          <h3 className={`text-base font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Propagation Map
          </h3>
        </div>
        <span className={`text-xs px-2.5 py-1 rounded-full ${isDark ? 'bg-white/5 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
          Simulated spread
        </span>
      </div>

      {/* Canvas */}
      <div className={`relative rounded-xl overflow-hidden ${isDark ? 'bg-white/2' : 'bg-slate-50'}`} style={{ height: '280px' }}>
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4">
        {legendItems.map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
            <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// src/components/dashboard/SparklineChart.jsx
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';

export function SparklineChart({ data, gradient }) {
  if (!data || data.length === 0) return null;
  const chartData = data.map((v, i) => ({ i, v }));
  // Pick stroke color from gradient string
  const color = gradient.includes('indigo') ? '#818cf8'
    : gradient.includes('emerald') ? '#34d399'
    : gradient.includes('rose') || gradient.includes('red') ? '#f87171'
    : gradient.includes('amber') ? '#fbbf24'
    : '#818cf8';

  return (
    <div style={{ width: 72, height: 32, flexShrink: 0 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <Line
            type="monotone"
            dataKey="v"
            stroke={color}
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={true}
            animationDuration={800}
          />
          <Tooltip
            content={({ active, payload }) =>
              active && payload?.[0] ? (
                <div className="bg-black/90 text-white text-[10px] px-1.5 py-1 rounded-md border border-white/10">
                  {payload[0].value}
                </div>
              ) : null
            }
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

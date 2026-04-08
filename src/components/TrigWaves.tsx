
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { AngleInfo } from '@/src/lib/math';

interface TrigWavesProps {
  info: AngleInfo;
  showSine: boolean;
  showCosine: boolean;
  showTangent: boolean;
}

export const TrigWaves: React.FC<TrigWavesProps> = ({
  info,
  showSine,
  showCosine,
  showTangent
}) => {
  // Generate data for one full period (0 to 360)
  const data = Array.from({ length: 73 }, (_, i) => {
    const deg = i * 5;
    const rad = (deg * Math.PI) / 180;
    const tan = Math.tan(rad);
    return {
      deg,
      sin: Math.sin(rad),
      cos: Math.cos(rad),
      tan: Math.abs(tan) > 5 ? null : tan, // Handle asymptotes
    };
  });

  return (
    <div className="w-full h-64 bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Function Waves</h3>
        <div className="flex gap-3 text-[10px] font-bold uppercase">
          {showSine && <span className="text-green-600">Sine</span>}
          {showCosine && <span className="text-red-600">Cosine</span>}
          {showTangent && <span className="text-amber-600">Tangent</span>}
        </div>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="deg" 
            ticks={[0, 90, 180, 270, 360]} 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: '#94a3b8' }}
          />
          <YAxis 
            domain={[-1.2, 1.2]} 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: '#94a3b8' }}
          />
          
          {/* Current Angle Indicator */}
          <ReferenceLine x={info.degrees} stroke="#3b82f6" strokeDasharray="3 3" />
          
          {showSine && (
            <Line
              type="monotone"
              dataKey="sin"
              stroke="#22c55e"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          )}
          {showCosine && (
            <Line
              type="monotone"
              dataKey="cos"
              stroke="#ef4444"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          )}
          {showTangent && (
            <Line
              type="monotone"
              dataKey="tan"
              stroke="#f59e0b"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          )}

          {/* Current Value Dots */}
          {showSine && (
            <ReferenceLine 
              segment={[{ x: info.degrees, y: 0 }, { x: info.degrees, y: Math.sin(info.radiansVal) }]} 
              stroke="#22c55e" 
              strokeWidth={4}
              strokeLinecap="round"
            />
          )}
          {showCosine && (
            <ReferenceLine 
              segment={[{ x: info.degrees, y: 0 }, { x: info.degrees, y: Math.cos(info.radiansVal) }]} 
              stroke="#ef4444" 
              strokeWidth={4}
              strokeLinecap="round"
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

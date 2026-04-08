
import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'motion/react';
import { getAngleInfo, getClosestStandardAngle, AngleInfo } from '@/src/lib/math';
import { cn } from '@/lib/utils';

interface UnitCircleProps {
  angle: number;
  setAngle: (angle: number) => void;
  snapMode: boolean;
  activeQuadrant: number | null; // null means all
  showValues: boolean; // For student mode
}

export const UnitCircle: React.FC<UnitCircleProps> = ({
  angle,
  setAngle,
  snapMode,
  activeQuadrant,
  showValues
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const info = getAngleInfo(angle);
  
  const size = 400;
  const center = size / 2;
  const radius = 150;

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!svgRef.current) return;
    
    const rect = svgRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const x = clientX - rect.left - center;
    const y = clientY - rect.top - center;
    
    let newAngle = (Math.atan2(-y, x) * 180) / Math.PI;
    if (newAngle < 0) newAngle += 360;
    
    if (snapMode) {
      newAngle = getClosestStandardAngle(newAngle);
    }
    
    setAngle(newAngle);
  };

  const [isDragging, setIsDragging] = useState(false);

  const pointX = center + radius * Math.cos((angle * Math.PI) / 180);
  const pointY = center - radius * Math.sin((angle * Math.PI) / 180);

  // Triangle points
  const originX = center;
  const originY = center;
  const legX = pointX;
  const legY = center;

  const isInActiveQuadrant = (deg: number) => {
    if (activeQuadrant === null) return true;
    const q = getAngleInfo(deg).quadrant;
    return q === activeQuadrant;
  };

  return (
    <div className="flex flex-col bg-white rounded-xl shadow-inner border border-slate-200 overflow-hidden">
      {/* Info Bar */}
      {showValues && (
        <div className="grid grid-cols-2 gap-px bg-slate-200 border-b border-slate-200">
          <div className="bg-white p-3 space-y-1">
            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Exact Coordinates</div>
            <div className="text-lg font-bold text-slate-900 leading-none">
              ({info.exact.x}, {info.exact.y})
            </div>
            <div className="flex gap-3 text-xs">
              <span className="text-blue-600 font-medium">{info.degrees}°</span>
              <span className="text-indigo-600 font-medium">{info.radians} rad</span>
            </div>
          </div>
          
          <div className="bg-white p-3 space-y-1">
            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Decimal Values</div>
            <div className="text-sm font-bold text-slate-900">
              x: {info.exact.xVal.toFixed(4)}
            </div>
            <div className="text-sm font-bold text-slate-900">
              y: {info.exact.yVal.toFixed(4)}
            </div>
          </div>
        </div>
      )}

      <div className="relative flex items-center justify-center p-4">
        <svg
          ref={svgRef}
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="cursor-crosshair touch-none select-none"
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
          onMouseMove={(e) => isDragging && handleMouseMove(e)}
          onTouchStart={() => setIsDragging(true)}
          onTouchEnd={() => setIsDragging(false)}
          onTouchMove={(e) => isDragging && handleMouseMove(e)}
        >
          {/* Background Grid */}
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f1f5f9" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Quadrant Masks */}
          {activeQuadrant !== null && (
            <rect
              width={size}
              height={size}
              fill="rgba(255,255,255,0.85)"
              className="transition-opacity duration-300"
            />
          )}

          {/* Axes */}
          <line x1="0" y1={center} x2={size} y2={center} stroke="#cbd5e1" strokeWidth="1" />
          <line x1={center} y1="0" x2={center} y2={size} stroke="#cbd5e1" strokeWidth="1" />

          {/* Circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="#94a3b8"
            strokeWidth="2"
            strokeDasharray="4 4"
            className={cn(activeQuadrant !== null && "opacity-20")}
          />

          {/* Active Quadrant Highlight */}
          {activeQuadrant !== null && (
            <rect
              x={activeQuadrant === 1 || activeQuadrant === 4 ? center : center - radius}
              y={activeQuadrant === 1 || activeQuadrant === 2 ? center - radius : center}
              width={radius}
              height={radius}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2"
              className="opacity-50"
            />
          )}

          {/* The Triangle */}
          <motion.g initial={false}>
            {/* Hypotenuse */}
            <line
              x1={originX}
              y1={originY}
              x2={pointX}
              y2={pointY}
              stroke="#64748b"
              strokeWidth="3"
            />
            {/* X-leg (Cosine) */}
            <line
              x1={originX}
              y1={originY}
              x2={legX}
              y2={legY}
              stroke="#ef4444"
              strokeWidth="3"
              strokeLinecap="round"
            />
            {/* Y-leg (Sine) */}
            <line
              x1={legX}
              y1={legY}
              x2={pointX}
              y2={pointY}
              stroke="#22c55e"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </motion.g>

          {/* Angle Arc */}
          <path
            d={`M ${center + 30} ${center} A 30 30 0 ${angle > 180 ? 1 : 0} 0 ${
              center + 30 * Math.cos((angle * Math.PI) / 180)
            } ${center - 30 * Math.sin((angle * Math.PI) / 180)}`}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
          />

          {/* Draggable Point */}
          <motion.circle
            cx={pointX}
            cy={pointY}
            r="8"
            fill="#3b82f6"
            stroke="white"
            strokeWidth="2"
            className="cursor-grab active:cursor-grabbing shadow-lg"
            whileHover={{ scale: 1.2 }}
          />

          {/* Labels */}
          <text x={size - 20} y={center - 5} fontSize="12" fill="#94a3b8" textAnchor="end">x (cos)</text>
          <text x={center + 5} y="20" fontSize="12" fill="#94a3b8">y (sin)</text>
          
          {/* Quadrant Indicators */}
          <text x={center + radius/2} y={center - radius/2} fontSize="20" fontWeight="bold" fill="#e2e8f0" textAnchor="middle">I</text>
          <text x={center - radius/2} y={center - radius/2} fontSize="20" fontWeight="bold" fill="#e2e8f0" textAnchor="middle">II</text>
          <text x={center - radius/2} y={center + radius/2} fontSize="20" fontWeight="bold" fill="#e2e8f0" textAnchor="middle">III</text>
          <text x={center + radius/2} y={center + radius/2} fontSize="20" fontWeight="bold" fill="#e2e8f0" textAnchor="middle">IV</text>
        </svg>
      </div>
    </div>
  );
};

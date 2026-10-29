'use client';

import React, { useState, useRef } from 'react';
import { ChartPoint, CalculationMode } from '@/types/distributions';

interface DistributionChartProps {
  points: ChartPoint[];
  isDiscrete: boolean;
  mode: CalculationMode;
  xMin: number;
  xMax: number;
  yMax: number;
  xVal?: number;
  x1Val?: number;
  x2Val?: number;
  inverseX?: number;
  title?: string;
}

export const DistributionChart: React.FC<DistributionChartProps> = ({
  points,
  isDiscrete,
  mode,
  xMin,
  xMax,
  yMax,
  xVal,
  x1Val,
  x2Val,
  inverseX,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; px: number; py: number } | null>(null);

  // SVG coordinate system
  const width = 800;
  const height = 380;
  const padLeft = 65;
  const padRight = 35;
  const padTop = 30;
  const padBottom = 55;

  const plotW = width - padLeft - padRight;
  const plotH = height - padTop - padBottom;

  const scaleX = (val: number) => {
    if (xMax === xMin) return padLeft + plotW / 2;
    return padLeft + ((val - xMin) / (xMax - xMin)) * plotW;
  };

  const scaleY = (val: number) => {
    if (yMax <= 0) return height - padBottom;
    return height - padBottom - (val / yMax) * plotH;
  };

  // Generate continuous path and shaded polygon
  let linePath = '';
  const shadedSegments: string[] = [];

  if (!isDiscrete && points.length > 0) {
    linePath = `M ${scaleX(points[0].x).toFixed(1)} ${scaleY(points[0].y).toFixed(1)}`;
    for (let i = 1; i < points.length; i++) {
      linePath += ` L ${scaleX(points[i].x).toFixed(1)} ${scaleY(points[i].y).toFixed(1)}`;
    }

    // Shaded areas (can have multiple if mode === 'outside')
    let currentShaded: ChartPoint[] = [];
    points.forEach((pt, index) => {
      if (pt.isShaded) {
        currentShaded.push(pt);
      } else if (currentShaded.length > 0) {
        // Close polygon
        const pFirst = currentShaded[0];
        const pLast = currentShaded[currentShaded.length - 1];
        let poly = `M ${scaleX(pFirst.x).toFixed(1)} ${scaleY(0).toFixed(1)}`;
        poly += ` L ${scaleX(pFirst.x).toFixed(1)} ${scaleY(pFirst.y).toFixed(1)}`;
        for (let j = 1; j < currentShaded.length; j++) {
          poly += ` L ${scaleX(currentShaded[j].x).toFixed(1)} ${scaleY(currentShaded[j].y).toFixed(1)}`;
        }
        poly += ` L ${scaleX(pLast.x).toFixed(1)} ${scaleY(0).toFixed(1)} Z`;
        shadedSegments.push(poly);
        currentShaded = [];
      }

      if (index === points.length - 1 && currentShaded.length > 0) {
        const pFirst = currentShaded[0];
        const pLast = currentShaded[currentShaded.length - 1];
        let poly = `M ${scaleX(pFirst.x).toFixed(1)} ${scaleY(0).toFixed(1)}`;
        poly += ` L ${scaleX(pFirst.x).toFixed(1)} ${scaleY(pFirst.y).toFixed(1)}`;
        for (let j = 1; j < currentShaded.length; j++) {
          poly += ` L ${scaleX(currentShaded[j].x).toFixed(1)} ${scaleY(currentShaded[j].y).toFixed(1)}`;
        }
        poly += ` L ${scaleX(pLast.x).toFixed(1)} ${scaleY(0).toFixed(1)} Z`;
        shadedSegments.push(poly);
      }
    });
  }

  // Generate X axis ticks
  const numXTicks = 7;
  const xTicks: number[] = [];
  const xRange = xMax - xMin;
  const xStep = xRange / (numXTicks - 1);
  for (let i = 0; i < numXTicks; i++) {
    const val = xMin + i * xStep;
    xTicks.push(isDiscrete ? Math.round(val) : Number(val.toFixed(2)));
  }

  // Generate Y axis ticks
  const numYTicks = 5;
  const yTicks: number[] = [];
  for (let i = 0; i <= numYTicks; i++) {
    yTicks.push(Number(((yMax / numYTicks) * i).toFixed(3)));
  }

  // Mouse move handler for hover tooltip
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current || points.length === 0) return;
    const rect = svgRef.current.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * width;

    if (mouseX < padLeft || mouseX > width - padRight) {
      setHoveredPoint(null);
      return;
    }

    // Find closest point
    let closest = points[0];
    let minDiff = Math.abs(scaleX(points[0].x) - mouseX);

    for (let i = 1; i < points.length; i++) {
      const diff = Math.abs(scaleX(points[i].x) - mouseX);
      if (diff < minDiff) {
        minDiff = diff;
        closest = points[i];
      }
    }

    setHoveredPoint({
      x: closest.x,
      y: closest.y,
      px: scaleX(closest.x),
      py: scaleY(closest.y),
    });
  };

  const handleMouseLeave = () => {
    setHoveredPoint(null);
  };

  // Markers
  const activeMarkers: { val: number; label: string; color: string }[] = [];
  if (mode === 'inverse' && inverseX !== undefined) {
    activeMarkers.push({ val: inverseX, label: `x* = ${inverseX.toFixed(3)}`, color: '#ec4899' });
  } else if (mode === 'left' || mode === 'right' || mode === 'exact') {
    if (xVal !== undefined) {
      activeMarkers.push({
        val: xVal,
        label: isDiscrete ? `k = ${Math.round(xVal)}` : `x = ${xVal.toFixed(3)}`,
        color: '#6366f1',
      });
    }
  } else if (mode === 'between' || mode === 'outside') {
    if (x1Val !== undefined) {
      activeMarkers.push({
        val: x1Val,
        label: isDiscrete ? `k₁ = ${Math.round(x1Val)}` : `x₁ = ${x1Val.toFixed(3)}`,
        color: '#3b82f6',
      });
    }
    if (x2Val !== undefined) {
      activeMarkers.push({
        val: x2Val,
        label: isDiscrete ? `k₂ = ${Math.round(x2Val)}` : `x₂ = ${x2Val.toFixed(3)}`,
        color: '#10b981',
      });
    }
  }

  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-neutral-900/90 border border-neutral-800 shadow-2xl p-2 sm:p-4 backdrop-blur-md">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto select-none cursor-crosshair"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
          </linearGradient>

          <linearGradient id="curveGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="50%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#c084fc" />
          </linearGradient>

          <linearGradient id="barActiveGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.8" />
          </linearGradient>

          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Subtle Horizontal Grid lines */}
        {yTicks.map((tick, i) => {
          const yPos = scaleY(tick);
          return (
            <g key={`y-${i}`}>
              <line
                x1={padLeft}
                y1={yPos}
                x2={width - padRight}
                y2={yPos}
                stroke="#262626"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
              <text
                x={padLeft - 10}
                y={yPos + 4}
                textAnchor="end"
                className="fill-neutral-400 text-[11px] font-mono"
              >
                {tick}
              </text>
            </g>
          );
        })}

        {/* X Axis line */}
        <line
          x1={padLeft}
          y1={height - padBottom}
          x2={width - padRight}
          y2={height - padBottom}
          stroke="#525252"
          strokeWidth="1.5"
        />

        {/* X Axis ticks and labels */}
        {xTicks.map((tick, i) => {
          const xPos = scaleX(tick);
          return (
            <g key={`x-${i}`}>
              <line
                x1={xPos}
                y1={height - padBottom}
                x2={xPos}
                y2={height - padBottom + 6}
                stroke="#525252"
                strokeWidth="1.5"
              />
              <text
                x={xPos}
                y={height - padBottom + 20}
                textAnchor="middle"
                className="fill-neutral-400 text-[11px] font-mono"
              >
                {tick}
              </text>
            </g>
          );
        })}

        {/* Axis Titles */}
        <text
          x={padLeft + plotW / 2}
          y={height - 10}
          textAnchor="middle"
          className="fill-neutral-400 text-xs font-semibold tracking-wider uppercase"
        >
          {isDiscrete ? 'Valores Discretos (k)' : 'Variable Aleatoria (x)'}
        </text>

        <text
          x={18}
          y={padTop + plotH / 2}
          textAnchor="middle"
          transform={`rotate(-90 18 ${padTop + plotH / 2})`}
          className="fill-neutral-400 text-xs font-semibold tracking-wider uppercase"
        >
          {isDiscrete ? 'P(X = k)' : 'Densidad f(x)'}
        </text>

        {/* Continuous: Shaded Areas */}
        {!isDiscrete &&
          shadedSegments.map((segment, idx) => (
            <path
              key={`shaded-${idx}`}
              d={segment}
              fill="url(#areaGradient)"
              className="transition-all duration-300"
            />
          ))}

        {/* Continuous: Curve Outline */}
        {!isDiscrete && linePath && (
          <path
            d={linePath}
            fill="none"
            stroke="url(#curveGradient)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#glow)"
          />
        )}

        {/* Discrete: Bars */}
        {isDiscrete &&
          points.map((pt, i) => {
            const barWidth = Math.max(
              4,
              Math.min(28, (plotW / points.length) * 0.65)
            );
            const xPos = scaleX(pt.x) - barWidth / 2;
            const yPos = scaleY(pt.y);
            const barHeight = height - padBottom - yPos;

            return (
              <g key={`bar-${i}`} className="transition-all duration-200">
                <rect
                  x={xPos}
                  y={yPos}
                  width={barWidth}
                  height={Math.max(1, barHeight)}
                  rx={2}
                  fill={pt.isShaded ? 'url(#barActiveGrad)' : '#334155'}
                  opacity={pt.isShaded ? 1 : 0.35}
                  stroke={pt.isShaded ? '#93c5fd' : '#475569'}
                  strokeWidth={pt.isShaded ? 1.5 : 0.5}
                  className="cursor-pointer hover:opacity-100 transition-opacity"
                />
                {/* Pin head on top */}
                <circle
                  cx={scaleX(pt.x)}
                  cy={yPos}
                  r={barWidth > 12 ? 3 : 2}
                  fill={pt.isShaded ? '#60a5fa' : '#64748b'}
                />
              </g>
            );
          })}

        {/* Active Markers (Cutoff boundaries) */}
        {activeMarkers.map((marker, idx) => {
          const markerX = scaleX(marker.val);
          if (markerX < padLeft - 5 || markerX > width - padRight + 5) return null;
          return (
            <g key={`marker-${idx}`} className="transition-all duration-200">
              {/* Vertical line */}
              <line
                x1={markerX}
                y1={padTop}
                x2={markerX}
                y2={height - padBottom}
                stroke={marker.color}
                strokeWidth="2"
                strokeDasharray="5 3"
              />
              {/* Badge label pill on bottom */}
              <rect
                x={markerX - 35}
                y={height - padBottom + 26}
                width={70}
                height={20}
                rx={10}
                fill="#18181b"
                stroke={marker.color}
                strokeWidth="1.5"
              />
              <text
                x={markerX}
                y={height - padBottom + 39}
                textAnchor="middle"
                className="fill-white font-mono text-[10px] font-bold"
              >
                {marker.label}
              </text>
            </g>
          );
        })}

        {/* Hover Crosshair and Dot */}
        {hoveredPoint && (
          <g>
            <line
              x1={hoveredPoint.px}
              y1={padTop}
              x2={hoveredPoint.px}
              y2={height - padBottom}
              stroke="#a855f7"
              strokeWidth="1"
              strokeDasharray="3 3"
            />
            <circle
              cx={hoveredPoint.px}
              cy={hoveredPoint.py}
              r={5}
              fill="#c084fc"
              stroke="#ffffff"
              strokeWidth="2"
              filter="url(#glow)"
            />
          </g>
        )}
      </svg>

      {/* Floating Hover Tooltip Box */}
      {hoveredPoint && (
        <div
          className="absolute pointer-events-none z-20 px-3 py-1.5 rounded-lg bg-neutral-950/95 border border-purple-500/50 shadow-xl text-xs backdrop-blur-sm"
          style={{
            left: `${Math.min(85, Math.max(15, (hoveredPoint.px / width) * 100))}%`,
            top: '20px',
            transform: 'translateX(-50%)',
          }}
        >
          <div className="font-semibold text-purple-300">
            {isDiscrete ? `k = ${hoveredPoint.x}` : `x = ${hoveredPoint.x.toFixed(3)}`}
          </div>
          <div className="text-neutral-300 font-mono">
            {isDiscrete ? `P(X = k) = ` : `f(x) = `}
            <span className="text-emerald-400 font-bold">{hoveredPoint.y.toFixed(5)}</span>
          </div>
        </div>
      )}
    </div>
  );
};

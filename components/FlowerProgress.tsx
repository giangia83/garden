import React, { useState, useEffect, useRef } from 'react';
import { ThemeColor, Shape } from '../types';
import { THEMES } from '../constants';

interface ShapeProgressProps {
  progress: number; // 0 to 1
  shape: Shape;
  themeColor: ThemeColor;
  isGoalReached?: boolean;
}

const SHAPE_PATHS: Record<Shape, string> = {
  flower: "M 75 25 Q 65 5, 50 5 Q 35 5, 25 25 Q 5 35, 5 50 Q 5 65, 25 75 Q 35 95, 50 95 Q 65 95, 75 75 Q 95 65, 95 50 Q 95 35, 75 25 Z",
  circle: "M 50, 95 A 45,45 0 1,1 50, 5 A 45,45 0 1,1 50, 95",
  heart: "M 50,90 L 10,50 A 20,20 0 1,1 50,30 A 20,20 0 1,1 90,50 Z"
};

const ShapeProgress: React.FC<ShapeProgressProps> = ({ progress, shape, themeColor, isGoalReached = false }) => {
  const pathRef = useRef<SVGPathElement>(null);
  const [pathLength, setPathLength] = useState(0);

  const shapePathData = SHAPE_PATHS[shape] || SHAPE_PATHS.flower;
  const theme = THEMES[themeColor] || THEMES.blue;

  useEffect(() => {
    if (pathRef.current) {
      const length = pathRef.current.getTotalLength();
      setPathLength(length);
    }
  }, [shape]); // Recalculate length if the shape changes

  const dashOffset = pathLength * (1 - Math.max(0, Math.min(1, progress)));

  return (
    <svg 
      viewBox="0 0 100 100" 
      className="w-full h-full"
      aria-label={`Progreso del servicio: ${(progress * 100).toFixed(0)}%`}
      role="img"
    >
      <style>
        {`
          @keyframes celebratePulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
          .celebrate {
            animation: celebratePulse 1.5s ease-in-out infinite;
          }
        `}
      </style>
      <defs>
        {Object.values(THEMES).map(t => (
           <linearGradient key={t.name} id={`shapeGradient-${t.name}`} x1="0%" y1="0%" x2="100%" y2="100%">
             <stop offset="0%" stopColor={t.gradientFromColor} /> 
             <stop offset="100%" stopColor={t.gradientToColor} />
           </linearGradient>
        ))}
      </defs>
      
      {/* Background track */}
      <path
        d={shapePathData}
        fill="none"
        stroke="#e2e8f0"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Progress path */}
      <path
        ref={pathRef}
        d={shapePathData}
        fill="none"
        stroke={`url(#shapeGradient-${theme.name})`}
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={pathLength}
        strokeDashoffset={dashOffset}
        className={isGoalReached ? 'celebrate' : ''}
        style={{ 
          transition: 'stroke-dashoffset 0.5s ease-out',
          transformOrigin: '50% 50%', // Animate from the center
        }}
      />
    </svg>
  );
};

export default ShapeProgress;
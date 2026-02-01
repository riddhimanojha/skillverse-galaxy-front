import { useEffect, useState, useMemo, useRef } from "react";
import { seededRandom, generateBreathingOpacity } from "@/utils/noiseGenerator";

interface AnimatedEdgeProps {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
  riskWeight: number;
  isNew?: boolean;
}

// Generate smooth bezier curve control points for organic curvature
const generateCurvePoints = (
  x1: number, y1: number, 
  x2: number, y2: number, 
  seed: number
): string => {
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;
  
  // Perpendicular offset for curve tension
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  
  // Normalize and create perpendicular
  const perpX = -dy / len;
  const perpY = dx / len;
  
  // Curve intensity based on seeded random (-8 to +8 percent)
  const curveIntensity = (seededRandom(seed) - 0.5) * 16;
  
  const ctrlX = midX + perpX * curveIntensity;
  const ctrlY = midY + perpY * curveIntensity;
  
  return `M ${x1} ${y1} Q ${ctrlX} ${ctrlY} ${x2} ${y2}`;
};

export const AnimatedEdge = ({ 
  id, 
  x1, y1, 
  x2, y2, 
  color, 
  riskWeight,
  isNew = false 
}: AnimatedEdgeProps) => {
  const [drawProgress, setDrawProgress] = useState(isNew ? 0 : 1);
  const [breathOpacity, setBreathOpacity] = useState(0.5);
  const pathRef = useRef<SVGPathElement>(null);
  const startTimeRef = useRef<number>(0);
  
  // Generate unique seed from id
  const seed = useMemo(() => 
    id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0),
    [id]
  );
  
  // Edge animation duration (randomized 800-1400ms)
  const drawDuration = useMemo(() => 
    800 + seededRandom(seed * 200) * 600,
    [seed]
  );
  
  // Edge thickness based on risk weight (±1px)
  const strokeWidth = useMemo(() => {
    const base = 1.5;
    const riskOffset = (riskWeight / 10) * 1;
    return base + riskOffset;
  }, [riskWeight]);
  
  // Desaturate color by ~15%
  const desaturatedColor = useMemo(() => {
    // Parse HSL from hex or use as-is
    // For simplicity, reduce opacity instead of actual desaturation
    return color;
  }, [color]);
  
  // Generate curved path
  const curvePath = useMemo(() => 
    generateCurvePoints(x1, y1, x2, y2, seed),
    [x1, y1, x2, y2, seed]
  );
  
  // "Laser in slow motion" draw animation for new edges
  useEffect(() => {
    if (isNew && pathRef.current) {
      startTimeRef.current = Date.now();
      
      const animate = () => {
        const elapsed = Date.now() - startTimeRef.current;
        const progress = Math.min(1, elapsed / drawDuration);
        
        // Ease-out cubic for smooth deceleration
        const eased = 1 - Math.pow(1 - progress, 3);
        setDrawProgress(eased);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      requestAnimationFrame(animate);
    }
  }, [isNew, drawDuration]);
  
  // Subtle breathing opacity animation
  useEffect(() => {
    let animationFrame: number;
    const startTime = Date.now() + seed * 50;
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const opacity = generateBreathingOpacity(seed, elapsed, 0.5, 0.12);
      setBreathOpacity(opacity);
      animationFrame = requestAnimationFrame(animate);
    };
    
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [seed]);
  
  // Calculate path length for stroke-dasharray animation
  const pathLength = useMemo(() => {
    if (pathRef.current) {
      return pathRef.current.getTotalLength();
    }
    // Approximate for initial render
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy) * 1.1; // Slight curve compensation
  }, [x1, y1, x2, y2]);
  
  return (
    <g>
      {/* Soft outer halo */}
      <path
        d={curvePath}
        fill="none"
        stroke={desaturatedColor}
        strokeWidth={strokeWidth + 4}
        strokeLinecap="round"
        opacity={breathOpacity * 0.15 * drawProgress}
        style={{ filter: 'blur(4px)' }}
      />
      
      {/* Inner glow core */}
      <path
        d={curvePath}
        fill="none"
        stroke={desaturatedColor}
        strokeWidth={strokeWidth + 1.5}
        strokeLinecap="round"
        opacity={breathOpacity * 0.3 * drawProgress}
        style={{ filter: 'blur(2px)' }}
      />
      
      {/* Main edge with gradient */}
      <path
        ref={pathRef}
        d={curvePath}
        fill="none"
        stroke={`url(#edge-gradient-${id})`}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={pathLength}
        strokeDashoffset={pathLength * (1 - drawProgress)}
        opacity={breathOpacity * 0.85}
      />
      
      {/* Gradient definition */}
      <defs>
        <linearGradient
          id={`edge-gradient-${id}`}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="0%"
        >
          <stop offset="0%" stopColor={desaturatedColor} stopOpacity="0.3" />
          <stop offset="50%" stopColor={desaturatedColor} stopOpacity="0.7" />
          <stop offset="100%" stopColor={desaturatedColor} stopOpacity="0.3" />
        </linearGradient>
      </defs>
    </g>
  );
};

import { useEffect, useState, useMemo, useRef } from "react";
import { seededRandom } from "@/utils/noiseGenerator";

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

// Desaturate color by reducing saturation 20-30%
const desaturateColor = (hex: string, amount: number = 0.25): string => {
  // Convert hex to RGB
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  
  // Convert to HSL
  const max = Math.max(r, g, b) / 255;
  const min = Math.min(r, g, b) / 255;
  const l = (max + min) / 2;
  
  let h = 0, s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    const rNorm = r / 255;
    const gNorm = g / 255;
    const bNorm = b / 255;
    
    if (max === rNorm) h = ((gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0)) / 6;
    else if (max === gNorm) h = ((bNorm - rNorm) / d + 2) / 6;
    else h = ((rNorm - gNorm) / d + 4) / 6;
  }
  
  // Reduce saturation
  s = s * (1 - amount);
  
  // Convert back to RGB
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };
  
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  
  const rOut = Math.round(hue2rgb(p, q, h + 1/3) * 255);
  const gOut = Math.round(hue2rgb(p, q, h) * 255);
  const bOut = Math.round(hue2rgb(p, q, h - 1/3) * 255);
  
  return `rgb(${rOut}, ${gOut}, ${bOut})`;
};

// Generate smooth bezier curve control points for organic curvature
const generateCurvePoints = (
  x1: number, y1: number, 
  x2: number, y2: number, 
  seed: number
): string => {
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;
  
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  
  if (len === 0) return `M ${x1} ${y1} L ${x2} ${y2}`;
  
  const perpX = -dy / len;
  const perpY = dx / len;
  
  // Subtle curve intensity
  const curveIntensity = (seededRandom(seed) - 0.5) * 10;
  
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
  const pathRef = useRef<SVGPathElement>(null);
  const [pathLength, setPathLength] = useState(0);
  
  // Generate unique seed from id
  const seed = useMemo(() => 
    id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0),
    [id]
  );
  
  // Edge animation duration (randomized 900-1600ms)
  const drawDuration = useMemo(() => 
    900 + seededRandom(seed * 200) * 700,
    [seed]
  );
  
  // Edge thickness: 0.6-0.9px base, ±0.2px for risk (max 1.1px)
  const strokeWidth = useMemo(() => {
    const base = 0.6 + seededRandom(seed * 300) * 0.3; // 0.6-0.9px
    const riskOffset = ((riskWeight - 5) / 10) * 0.2; // ±0.2px based on risk
    return Math.min(1.1, Math.max(0.5, base + riskOffset));
  }, [riskWeight, seed]);
  
  // Desaturate color by 20-30%
  const desaturatedColor = useMemo(() => {
    const desatAmount = 0.2 + seededRandom(seed * 400) * 0.1;
    return desaturateColor(color, desatAmount);
  }, [color, seed]);
  
  // Generate curved path
  const curvePath = useMemo(() => 
    generateCurvePoints(x1, y1, x2, y2, seed),
    [x1, y1, x2, y2, seed]
  );
  
  // Measure path length after render
  useEffect(() => {
    if (pathRef.current) {
      setPathLength(pathRef.current.getTotalLength());
    }
  }, [curvePath]);
  
  // Slow laser draw animation with traveling head
  useEffect(() => {
    if (!isNew) return;
    
    const startTime = Date.now();
    let animationFrame: number;
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(1, elapsed / drawDuration);
      
      // Ease-out cubic for smooth deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      setDrawProgress(eased);
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [isNew, drawDuration]);
  
  // Head highlight position (percentage along path)
  const headPosition = drawProgress;
  const headVisible = isNew && drawProgress > 0 && drawProgress < 1;
  
  return (
    <g>
      {/* Faint inner light core - max 8% opacity */}
      <path
        d={curvePath}
        fill="none"
        stroke={desaturatedColor}
        strokeWidth={strokeWidth + 0.8}
        strokeLinecap="round"
        opacity={0.06 * drawProgress}
        style={{ filter: 'blur(1px)' }}
      />
      
      {/* Main razor-thin edge */}
      <path
        ref={pathRef}
        d={curvePath}
        fill="none"
        stroke={desaturatedColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={pathLength || 1000}
        strokeDashoffset={(pathLength || 1000) * (1 - drawProgress)}
        opacity={0.65}
      />
      
      {/* Traveling head highlight during draw animation */}
      {headVisible && pathLength > 0 && (
        <>
          {/* Subtle head glow */}
          <circle
            cx={0}
            cy={0}
            r={1.5}
            fill={desaturatedColor}
            opacity={0.4}
            style={{ filter: 'blur(1.5px)' }}
          >
            <animateMotion
              dur={`${drawDuration}ms`}
              fill="freeze"
              keyPoints="0;1"
              keyTimes="0;1"
              calcMode="spline"
              keySplines="0.33 0 0.67 1"
            >
              <mpath href={`#path-${id}`} />
            </animateMotion>
          </circle>
          
          {/* Bright head point */}
          <circle
            cx={0}
            cy={0}
            r={0.6}
            fill="white"
            opacity={0.7}
          >
            <animateMotion
              dur={`${drawDuration}ms`}
              fill="freeze"
              keyPoints="0;1"
              keyTimes="0;1"
              calcMode="spline"
              keySplines="0.33 0 0.67 1"
            >
              <mpath href={`#path-${id}`} />
            </animateMotion>
          </circle>
        </>
      )}
      
      {/* Hidden path for animateMotion reference */}
      <path
        id={`path-${id}`}
        d={curvePath}
        fill="none"
        stroke="none"
      />
    </g>
  );
};

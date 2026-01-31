import { useMemo } from "react";
import { SecurityNode } from "@/types/securityNode";

interface ThreatConstellationLinesProps {
  nodes: SecurityNode[];
  nodePositions: { id: string; x: number; y: number }[];
}

export const ThreatConstellationLines = ({ nodes, nodePositions }: ThreatConstellationLinesProps) => {
  const lines = useMemo(() => {
    const result: Array<{ 
      x1: number; 
      y1: number; 
      x2: number; 
      y2: number; 
      hasInfluence: boolean; // Connected to a vulnerable node
    }> = [];
    
    // Create constellation connections (sequential)
    for (let i = 0; i < nodePositions.length - 1; i++) {
      const current = nodePositions[i];
      const next = nodePositions[i + 1];
      
      const currentNode = nodes.find(n => n.id === current.id);
      const nextNode = nodes.find(n => n.id === next.id);
      
      // Line has "influence" if either connected node is vulnerable
      const hasInfluence = currentNode?.is_vulnerable || nextNode?.is_vulnerable;
      
      result.push({
        x1: current.x,
        y1: current.y,
        x2: next.x,
        y2: next.y,
        hasInfluence: hasInfluence || false,
      });
    }
    
    // Add cross-connections for visual interest
    if (nodePositions.length >= 4) {
      const n0 = nodePositions[0];
      const n3 = nodePositions[3];
      const node0 = nodes.find(n => n.id === n0.id);
      const node3 = nodes.find(n => n.id === n3.id);
      result.push({
        x1: n0.x,
        y1: n0.y,
        x2: n3.x,
        y2: n3.y,
        hasInfluence: node0?.is_vulnerable || node3?.is_vulnerable || false,
      });
    }
    
    if (nodePositions.length >= 5) {
      const n1 = nodePositions[1];
      const n4 = nodePositions[4];
      const node1 = nodes.find(n => n.id === n1.id);
      const node4 = nodes.find(n => n.id === n4.id);
      result.push({
        x1: n1.x,
        y1: n1.y,
        x2: n4.x,
        y2: n4.y,
        hasInfluence: node1?.is_vulnerable || node4?.is_vulnerable || false,
      });
    }
    
    return result;
  }, [nodes, nodePositions]);

  // Generate smooth curved path between two points
  const getCurvedPath = (x1: number, y1: number, x2: number, y2: number) => {
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;
    // Add curvature perpendicular to the line
    const dx = x2 - x1;
    const dy = y2 - y1;
    const curveOffset = 0.08; // Subtle curve
    const controlX = midX - dy * curveOffset;
    const controlY = midY + dx * curveOffset;
    
    return `M ${x1} ${y1} Q ${controlX} ${controlY} ${x2} ${y2}`;
  };
  
  return (
    <svg 
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <defs>
        {/* Default line gradient - subtle purple */}
        <linearGradient id="defaultLineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="hsl(270, 80%, 60%)" stopOpacity="0.2" />
          <stop offset="50%" stopColor="hsl(270, 80%, 70%)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="hsl(270, 80%, 60%)" stopOpacity="0.2" />
        </linearGradient>
        
        {/* Influence line gradient - brighter purple */}
        <linearGradient id="influenceLineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="hsl(280, 90%, 65%)" stopOpacity="0.5" />
          <stop offset="50%" stopColor="hsl(280, 100%, 75%)" stopOpacity="0.8" />
          <stop offset="100%" stopColor="hsl(280, 90%, 65%)" stopOpacity="0.5" />
        </linearGradient>
        
        {/* Subtle glow filter */}
        <filter id="subtleGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="0.3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        
        {/* Strong glow for influenced lines */}
        <filter id="influenceGlow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="0.5" result="blur1" />
          <feGaussianBlur in="SourceGraphic" stdDeviation="0.8" result="blur2" />
          <feMerge>
            <feMergeNode in="blur2" />
            <feMergeNode in="blur1" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      
      {/* Render lines */}
      {lines.map((line, index) => (
        <g key={index}>
          {/* Glow layer for influenced lines */}
          {line.hasInfluence && (
            <path
              d={getCurvedPath(line.x1, line.y1, line.x2, line.y2)}
              fill="none"
              stroke="hsl(280, 100%, 70%)"
              strokeWidth="0.8"
              strokeOpacity="0.4"
              strokeLinecap="round"
              className="animate-pulse"
              style={{ filter: "url(#influenceGlow)" }}
            />
          )}
          
          {/* Main curved line */}
          <path
            d={getCurvedPath(line.x1, line.y1, line.x2, line.y2)}
            fill="none"
            stroke={line.hasInfluence ? "url(#influenceLineGradient)" : "url(#defaultLineGradient)"}
            strokeWidth={line.hasInfluence ? 0.4 : 0.25}
            strokeLinecap="round"
            className={line.hasInfluence ? "animate-pulse" : ""}
            style={{ 
              filter: line.hasInfluence ? "url(#influenceGlow)" : "url(#subtleGlow)",
              animationDuration: line.hasInfluence ? "2s" : undefined,
            }}
          />
        </g>
      ))}
    </svg>
  );
};

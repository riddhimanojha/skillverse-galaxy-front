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
      threatened: boolean;
    }> = [];
    
    // Create constellation connections (sequential for now)
    for (let i = 0; i < nodePositions.length - 1; i++) {
      const current = nodePositions[i];
      const next = nodePositions[i + 1];
      
      const currentNode = nodes.find(n => n.id === current.id);
      const nextNode = nodes.find(n => n.id === next.id);
      
      const isThreatened = currentNode?.is_vulnerable || nextNode?.is_vulnerable;
      
      result.push({
        x1: current.x,
        y1: current.y,
        x2: next.x,
        y2: next.y,
        threatened: isThreatened || false,
      });
    }
    
    // Add some cross-connections for visual interest
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
        threatened: node0?.is_vulnerable || node3?.is_vulnerable || false,
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
        threatened: node1?.is_vulnerable || node4?.is_vulnerable || false,
      });
    }
    
    return result;
  }, [nodes, nodePositions]);
  
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
      <defs>
        <linearGradient id="secureGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="hsl(160, 100%, 50%)" stopOpacity="0.3" />
          <stop offset="50%" stopColor="hsl(180, 100%, 50%)" stopOpacity="0.5" />
          <stop offset="100%" stopColor="hsl(160, 100%, 50%)" stopOpacity="0.3" />
        </linearGradient>
        <linearGradient id="threatGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="hsl(0, 100%, 55%)" stopOpacity="0.5" />
          <stop offset="50%" stopColor="hsl(0, 100%, 65%)" stopOpacity="0.9" />
          <stop offset="100%" stopColor="hsl(0, 100%, 55%)" stopOpacity="0.5" />
        </linearGradient>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      
      {lines.map((line, index) => (
        <g key={index}>
          {/* Glow layer */}
          {line.threatened && (
            <line
              x1={`${line.x1}%`}
              y1={`${line.y1}%`}
              x2={`${line.x2}%`}
              y2={`${line.y2}%`}
              stroke="hsl(0, 100%, 55%)"
              strokeWidth="6"
              strokeOpacity="0.3"
              style={{ filter: "blur(4px)" }}
            />
          )}
          {/* Main line */}
          <line
            x1={`${line.x1}%`}
            y1={`${line.y1}%`}
            x2={`${line.x2}%`}
            y2={`${line.y2}%`}
            stroke={line.threatened ? "url(#threatGradient)" : "url(#secureGradient)"}
            strokeWidth={line.threatened ? "2.5" : "1.5"}
            strokeDasharray={line.threatened ? "none" : "8,4"}
            className={line.threatened ? "animate-pulse" : ""}
            style={{ filter: "url(#glow)" }}
          />
        </g>
      ))}
    </svg>
  );
};

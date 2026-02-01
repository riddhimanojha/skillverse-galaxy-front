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
      {lines.map((line, index) => (
        <line
          key={index}
          x1={`${line.x1}%`}
          y1={`${line.y1}%`}
          x2={`${line.x2}%`}
          y2={`${line.y2}%`}
          stroke="hsl(280, 60%, 50%)"
          strokeWidth="1.5"
          strokeOpacity="0.6"
        />
      ))}
    </svg>
  );
};

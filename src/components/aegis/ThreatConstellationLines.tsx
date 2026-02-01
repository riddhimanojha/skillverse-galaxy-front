import { useMemo } from "react";
import { SecurityNode } from "@/types/securityNode";

interface ThreatConstellationLinesProps {
  nodes: SecurityNode[];
  nodePositions: { id: string; x: number; y: number }[];
}

export const ThreatConstellationLines = ({ nodes, nodePositions }: ThreatConstellationLinesProps) => {
  // Determine line color based on severity of connected nodes
  const getLineColor = (node1: SecurityNode | undefined, node2: SecurityNode | undefined): string => {
    const isVuln1 = node1?.is_vulnerable;
    const isVuln2 = node2?.is_vulnerable;
    
    // If neither is vulnerable, green (secured)
    if (!isVuln1 && !isVuln2) {
      return 'hsl(145, 70%, 45%)'; // Green
    }
    
    // Check for critical severity
    const hasCritical = 
      (isVuln1 && node1?.severity === 'Critical') || 
      (isVuln2 && node2?.severity === 'Critical');
    
    if (hasCritical) {
      return 'hsl(0, 85%, 55%)'; // Red for critical
    }
    
    // High or Medium severity → orange
    return 'hsl(30, 90%, 55%)'; // Orange
  };

  const lines = useMemo(() => {
    const result: Array<{ 
      x1: number; 
      y1: number; 
      x2: number; 
      y2: number; 
      color: string;
    }> = [];
    
    // Create constellation connections (sequential for now)
    for (let i = 0; i < nodePositions.length - 1; i++) {
      const current = nodePositions[i];
      const next = nodePositions[i + 1];
      
      const currentNode = nodes.find(n => n.id === current.id);
      const nextNode = nodes.find(n => n.id === next.id);
      
      result.push({
        x1: current.x,
        y1: current.y,
        x2: next.x,
        y2: next.y,
        color: getLineColor(currentNode, nextNode),
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
        color: getLineColor(node0, node3),
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
        color: getLineColor(node1, node4),
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
          stroke={line.color}
          strokeWidth="2"
          strokeOpacity="0.7"
        />
      ))}
    </svg>
  );
};

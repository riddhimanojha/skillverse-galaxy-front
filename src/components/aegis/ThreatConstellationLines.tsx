import { useMemo } from "react";
import { SecurityNode } from "@/types/securityNode";

interface ThreatConstellationLinesProps {
  nodes: SecurityNode[];
  nodePositions: { id: string; x: number; y: number }[];
}

export const ThreatConstellationLines = ({ nodes, nodePositions }: ThreatConstellationLinesProps) => {
  // Build a map of node index to whether it's "infected" (affected by upstream vulnerability)
  // Propagation: if any node before this one in the chain is vulnerable, this path is at risk
  const getInfectionState = useMemo(() => {
    const infectedMap = new Map<string, { infected: boolean; maxSeverity: 'Critical' | 'High' | 'Medium' | null }>();
    
    let hasUpstreamVuln = false;
    let maxUpstreamSeverity: 'Critical' | 'High' | 'Medium' | null = null;
    
    // Walk through nodes sequentially - vulnerabilities propagate downstream
    for (const pos of nodePositions) {
      const node = nodes.find(n => n.id === pos.id);
      
      if (node?.is_vulnerable) {
        hasUpstreamVuln = true;
        // Track the highest severity seen so far
        if (node.severity === 'Critical') {
          maxUpstreamSeverity = 'Critical';
        } else if (node.severity === 'High' && maxUpstreamSeverity !== 'Critical') {
          maxUpstreamSeverity = 'High';
        } else if (node.severity === 'Medium' && !maxUpstreamSeverity) {
          maxUpstreamSeverity = 'Medium';
        }
      }
      
      infectedMap.set(pos.id, { 
        infected: hasUpstreamVuln, 
        maxSeverity: maxUpstreamSeverity 
      });
    }
    
    return infectedMap;
  }, [nodes, nodePositions]);

  // Determine line color based on propagation logic
  const getLineColor = (
    node1Id: string, 
    node2Id: string,
    node1: SecurityNode | undefined, 
    node2: SecurityNode | undefined
  ): string => {
    const state1 = getInfectionState.get(node1Id);
    const state2 = getInfectionState.get(node2Id);
    
    // If neither node is infected (no upstream vulnerabilities affect them), green
    if (!state1?.infected && !state2?.infected && !node1?.is_vulnerable && !node2?.is_vulnerable) {
      return 'hsl(145, 70%, 45%)'; // Green - fully secure path
    }
    
    // Determine the highest severity in this connection
    const severities = [
      node1?.is_vulnerable ? node1.severity : null,
      node2?.is_vulnerable ? node2.severity : null,
      state1?.maxSeverity,
      state2?.maxSeverity
    ].filter(Boolean);
    
    if (severities.includes('Critical')) {
      return 'hsl(0, 85%, 55%)'; // Red for critical
    }
    
    if (severities.includes('High')) {
      return 'hsl(30, 90%, 55%)'; // Orange for high
    }
    
    // Medium or infected by medium
    return 'hsl(45, 90%, 55%)'; // Yellow-orange for medium
  };

  const lines = useMemo(() => {
    const result: Array<{ 
      x1: number; 
      y1: number; 
      x2: number; 
      y2: number; 
      color: string;
    }> = [];
    
    // Create constellation connections (sequential - propagation flows through)
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
        color: getLineColor(current.id, next.id, currentNode, nextNode),
      });
    }
    
    // Cross-connections also follow propagation
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
        color: getLineColor(n0.id, n3.id, node0, node3),
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
        color: getLineColor(n1.id, n4.id, node1, node4),
      });
    }
    
    return result;
  }, [nodes, nodePositions, getInfectionState]);
  
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

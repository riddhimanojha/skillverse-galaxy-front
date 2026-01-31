import { useMemo } from "react";
import { SecurityNode } from "@/types/securityNode";
import { ThreatStar } from "./ThreatStar";
import { ThreatConstellationLines } from "./ThreatConstellationLines";

interface ThreatGalaxyProps {
  nodes: SecurityNode[];
  onNodeClick: (node: SecurityNode) => void;
}

// Predefined positions for a constellation pattern
const getNodePositions = (nodeCount: number) => {
  const positions = [
    { x: 25, y: 35 },
    { x: 45, y: 25 },
    { x: 65, y: 40 },
    { x: 35, y: 55 },
    { x: 55, y: 65 },
    { x: 75, y: 55 },
  ];
  return positions.slice(0, nodeCount);
};

// Build adjacency map for connections
const buildConnections = (nodeCount: number) => {
  const connections: Map<number, number[]> = new Map();
  
  // Sequential connections
  for (let i = 0; i < nodeCount - 1; i++) {
    if (!connections.has(i)) connections.set(i, []);
    if (!connections.has(i + 1)) connections.set(i + 1, []);
    connections.get(i)!.push(i + 1);
    connections.get(i + 1)!.push(i);
  }
  
  // Cross-connections
  if (nodeCount >= 4) {
    connections.get(0)!.push(3);
    connections.get(3)!.push(0);
  }
  if (nodeCount >= 5) {
    connections.get(1)!.push(4);
    connections.get(4)!.push(1);
  }
  
  return connections;
};

export const ThreatGalaxy = ({ nodes, onNodeClick }: ThreatGalaxyProps) => {
  const positions = getNodePositions(nodes.length);
  
  const nodePositions = nodes.map((node, index) => ({
    id: node.id,
    x: positions[index]?.x || 50,
    y: positions[index]?.y || 50,
  }));

  // Determine which nodes have a connected threat (for dependency influence)
  const nodesWithConnectedThreats = useMemo(() => {
    const connections = buildConnections(nodes.length);
    const result = new Set<string>();
    
    nodes.forEach((node, index) => {
      if (node.is_vulnerable) {
        // Mark all connected nodes as having a connected threat
        const connectedIndices = connections.get(index) || [];
        connectedIndices.forEach(connectedIndex => {
          const connectedNode = nodes[connectedIndex];
          if (connectedNode && !connectedNode.is_vulnerable) {
            result.add(connectedNode.id);
          }
        });
      }
    });
    
    return result;
  }, [nodes]);

  return (
    <div className="relative w-full h-full">
      {/* Constellation lines */}
      <ThreatConstellationLines nodes={nodes} nodePositions={nodePositions} />
      
      {/* Stars */}
      {nodes.map((node, index) => (
        <ThreatStar
          key={node.id}
          node={node}
          x={nodePositions[index]?.x || 50}
          y={nodePositions[index]?.y || 50}
          onClick={() => onNodeClick(node)}
          hasConnectedThreat={nodesWithConnectedThreats.has(node.id)}
        />
      ))}
    </div>
  );
};

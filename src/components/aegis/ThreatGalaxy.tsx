import { SecurityNode } from "@/types/securityNode";
import { FileRelationship } from "@/types/fileRelationship";
import { ThreatStar } from "./ThreatStar";
import { ThreatConstellationLines } from "./ThreatConstellationLines";

interface ThreatGalaxyProps {
  nodes: SecurityNode[];
  relationships: FileRelationship[];
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

export const ThreatGalaxy = ({ nodes, relationships, onNodeClick }: ThreatGalaxyProps) => {
  const positions = getNodePositions(nodes.length);
  
  const nodePositions = nodes.map((node, index) => ({
    id: node.id,
    x: positions[index]?.x || 50,
    y: positions[index]?.y || 50,
  }));

  return (
    <div className="relative w-full h-full">
      {/* Constellation lines from file_relationships */}
      <ThreatConstellationLines 
        nodes={nodes} 
        nodePositions={nodePositions} 
        relationships={relationships}
      />
      
      {/* Stars */}
      {nodes.map((node, index) => (
        <ThreatStar
          key={node.id}
          node={node}
          x={nodePositions[index]?.x || 50}
          y={nodePositions[index]?.y || 50}
          onClick={() => onNodeClick(node)}
        />
      ))}
    </div>
  );
};

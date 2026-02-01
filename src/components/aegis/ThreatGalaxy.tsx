import { SecurityNode } from "@/types/securityNode";
import { FileRelationship } from "@/types/fileRelationship";
import { ThreatStar } from "./ThreatStar";
import { ThreatConstellationLines } from "./ThreatConstellationLines";

interface ThreatGalaxyProps {
  nodes: SecurityNode[];
  relationships: FileRelationship[];
  onNodeClick: (node: SecurityNode) => void;
}

// Generate seeded random positions for consistent layout
const getNodePositions = (nodes: SecurityNode[]) => {
  return nodes.map((node, index) => {
    // Use node id as seed for consistent positions
    const seed = node.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const random1 = ((seed * 9301 + 49297) % 233280) / 233280;
    const random2 = ((seed * 49297 + 9301) % 233280) / 233280;
    
    // Keep nodes within 15-85% range to avoid edges
    const x = 15 + random1 * 70;
    const y = 20 + random2 * 60;
    
    return { x, y };
  });
};

export const ThreatGalaxy = ({ nodes, relationships, onNodeClick }: ThreatGalaxyProps) => {
  const positions = getNodePositions(nodes);
  
  const nodePositions = nodes.map((node, index) => ({
    id: node.id,
    x: positions[index]?.x ?? 50,
    y: positions[index]?.y ?? 50,
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

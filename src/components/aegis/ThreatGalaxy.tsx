import { SecurityNode } from "@/types/securityNode";
import { FileRelationship } from "@/types/fileRelationship";
import { ThreatStar } from "./ThreatStar";
import { ThreatConstellationLines } from "./ThreatConstellationLines";

interface ThreatGalaxyProps {
  nodes: SecurityNode[];
  relationships: FileRelationship[];
  onNodeClick: (node: SecurityNode) => void;
}

// Constellation-inspired layout patterns
const constellationPatterns = [
  // Orion-like pattern
  [
    { x: 50, y: 15 },   // Head star
    { x: 35, y: 30 },   // Left shoulder
    { x: 65, y: 30 },   // Right shoulder
    { x: 50, y: 45 },   // Belt center
    { x: 40, y: 45 },   // Belt left
    { x: 60, y: 45 },   // Belt right
    { x: 30, y: 65 },   // Left foot
    { x: 70, y: 65 },   // Right foot
    { x: 25, y: 20 },   // Bow top
    { x: 20, y: 40 },   // Bow middle
    { x: 25, y: 55 },   // Bow bottom
    { x: 75, y: 25 },   // Shield top
    { x: 80, y: 50 },   // Shield bottom
    { x: 50, y: 75 },   // Sword tip
    { x: 45, y: 60 },   // Extra
    { x: 55, y: 60 },   // Extra
  ],
  // Big Dipper-like pattern
  [
    { x: 20, y: 30 },
    { x: 30, y: 25 },
    { x: 40, y: 28 },
    { x: 50, y: 35 },
    { x: 55, y: 50 },
    { x: 65, y: 55 },
    { x: 75, y: 50 },
    { x: 70, y: 40 },
    { x: 60, y: 38 },
    { x: 45, y: 55 },
    { x: 35, y: 60 },
    { x: 25, y: 65 },
    { x: 80, y: 65 },
    { x: 85, y: 35 },
    { x: 15, y: 45 },
    { x: 50, y: 70 },
  ],
];

// Generate constellation positions with slight randomization for organic feel
const getNodePositions = (nodes: SecurityNode[]) => {
  const pattern = constellationPatterns[0]; // Use Orion-like pattern
  
  return nodes.map((node, index) => {
    // Use predefined position or generate one based on pattern
    const basePos = pattern[index % pattern.length];
    
    // Add slight variation using node id as seed for consistency
    const seed = node.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const offsetX = ((seed % 100) / 100 - 0.5) * 8; // ±4% variation
    const offsetY = (((seed * 7) % 100) / 100 - 0.5) * 8;
    
    // If we have more nodes than pattern positions, spiral outward
    if (index >= pattern.length) {
      const angle = (index * 137.5 * Math.PI) / 180; // Golden angle
      const radius = 15 + (index - pattern.length) * 5;
      return {
        x: 50 + Math.cos(angle) * radius,
        y: 45 + Math.sin(angle) * radius * 0.6,
      };
    }
    
    return {
      x: Math.max(10, Math.min(90, basePos.x + offsetX)),
      y: Math.max(10, Math.min(85, basePos.y + offsetY)),
    };
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

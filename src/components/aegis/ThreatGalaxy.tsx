import { SecurityNode } from "@/types/securityNode";
import { FileRelationship } from "@/types/fileRelationship";
import { ThreatStar } from "./ThreatStar";
import { useMemo } from "react";

interface ThreatGalaxyProps {
  nodes: SecurityNode[];
  relationships: FileRelationship[];
  onNodeClick: (node: SecurityNode) => void;
}

const constellationPatterns = [
  [
    { x: 50, y: 15 },
    { x: 35, y: 30 },
    { x: 65, y: 30 },
    { x: 50, y: 45 },
    { x: 40, y: 45 },
    { x: 60, y: 45 },
    { x: 30, y: 65 },
    { x: 70, y: 65 },
    { x: 25, y: 20 },
    { x: 20, y: 40 },
    { x: 25, y: 55 },
    { x: 75, y: 25 },
    { x: 80, y: 50 },
    { x: 50, y: 75 },
    { x: 45, y: 60 },
    { x: 55, y: 60 },
  ],
];

const getNodePositions = (nodes: SecurityNode[]) => {
  const pattern = constellationPatterns[0];
  
  return nodes.map((node, index) => {
    const basePos = pattern[index % pattern.length];
    const seed = node.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const offsetX = ((seed % 100) / 100 - 0.5) * 8;
    const offsetY = (((seed * 7) % 100) / 100 - 0.5) * 8;
    
    if (index >= pattern.length) {
      const angle = (index * 137.5 * Math.PI) / 180;
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

const getEdgeColor = (riskWeight: number | null, isVulnerable: boolean) => {
  if (!isVulnerable) return 'hsl(160, 35%, 45%)';
  const weight = riskWeight ?? 5;
  if (weight >= 7) return 'hsl(355, 45%, 40%)';
  if (weight >= 4) return 'hsl(35, 50%, 45%)';
  return 'hsl(185, 40%, 45%)';
};

export const ThreatGalaxy = ({ nodes, relationships, onNodeClick }: ThreatGalaxyProps) => {
  const positions = getNodePositions(nodes);
  
  const nodePositions = useMemo(() => 
    nodes.map((node, index) => ({
      id: node.id,
      x: positions[index]?.x ?? 50,
      y: positions[index]?.y ?? 50,
    })), [nodes, positions]
  );

  const edges = useMemo(() => {
    return relationships.map((rel, index) => {
      const fromNode = nodes.find(n => n.file_name === rel.from_file);
      const toNode = nodes.find(n => n.file_name === rel.to_file);
      
      if (!fromNode || !toNode) return null;
      
      const fromPos = nodePositions.find(p => p.id === fromNode.id);
      const toPos = nodePositions.find(p => p.id === toNode.id);
      
      if (!fromPos || !toPos) return null;
      
      return {
        id: `edge-${index}`,
        x1: fromPos.x,
        y1: fromPos.y,
        x2: toPos.x,
        y2: toPos.y,
        color: getEdgeColor(fromNode.risk_weight, fromNode.is_vulnerable),
        delay: index * 0.08, // Stagger edges
      };
    }).filter(Boolean);
  }, [relationships, nodes, nodePositions]);

  return (
    <div className="relative w-full h-full">
      {/* Entrance animation styles */}
      <style>{`
        @keyframes edgeFadeIn {
          0% { opacity: 0; stroke-dashoffset: 100; }
          100% { opacity: 1; stroke-dashoffset: 0; }
        }
        .edge-line {
          stroke-dasharray: 100;
          stroke-dashoffset: 100;
          animation: edgeFadeIn 0.8s ease-out forwards;
        }
        .edge-glow {
          stroke-dasharray: 100;
          stroke-dashoffset: 100;
          animation: edgeFadeIn 0.8s ease-out forwards;
        }
      `}</style>

      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ overflow: 'visible' }}
      >
        {edges.map((edge) => edge && (
          <g key={edge.id}>
            {/* Soft glow layer */}
            <line
              className="edge-glow"
              x1={`${edge.x1}%`}
              y1={`${edge.y1}%`}
              x2={`${edge.x2}%`}
              y2={`${edge.y2}%`}
              stroke={edge.color}
              strokeWidth="4"
              strokeLinecap="round"
              style={{ 
                animationDelay: `${edge.delay + 0.3}s`,
                opacity: 0.15,
              }}
              pathLength="100"
            />
            {/* Core line */}
            <line
              className="edge-line"
              x1={`${edge.x1}%`}
              y1={`${edge.y1}%`}
              x2={`${edge.x2}%`}
              y2={`${edge.y2}%`}
              stroke={edge.color}
              strokeWidth="1.5"
              strokeLinecap="round"
              style={{ 
                animationDelay: `${edge.delay + 0.3}s`,
                opacity: 0.7,
              }}
              pathLength="100"
            />
          </g>
        ))}
      </svg>
      
      {/* Stars with staggered entrance */}
      {nodes.map((node, index) => (
        <ThreatStar
          key={node.id}
          node={node}
          x={nodePositions[index]?.x || 50}
          y={nodePositions[index]?.y || 50}
          onClick={() => onNodeClick(node)}
          entranceDelay={index * 0.06}
        />
      ))}
    </div>
  );
};

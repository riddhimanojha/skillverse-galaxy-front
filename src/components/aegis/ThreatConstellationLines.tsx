import { useMemo } from "react";
import { SecurityNode } from "@/types/securityNode";
import { FileRelationship } from "@/types/fileRelationship";

interface ThreatConstellationLinesProps {
  nodes: SecurityNode[];
  nodePositions: { id: string; x: number; y: number }[];
  relationships: FileRelationship[];
}

export const ThreatConstellationLines = ({ 
  nodes, 
  nodePositions, 
  relationships 
}: ThreatConstellationLinesProps) => {
  
  // Build a map of file_name to node for quick lookup
  const fileToNode = useMemo(() => {
    const map = new Map<string, SecurityNode>();
    nodes.forEach(node => {
      if (node.file_name) {
        map.set(node.file_name, node);
      }
    });
    return map;
  }, [nodes]);

  // Build a map of node id to position
  const nodeIdToPosition = useMemo(() => {
    const map = new Map<string, { x: number; y: number }>();
    nodePositions.forEach(pos => {
      map.set(pos.id, { x: pos.x, y: pos.y });
    });
    return map;
  }, [nodePositions]);

  // Get edge color based on risk_weight of the originating node
  const getEdgeColor = (riskWeight: number | null, isVulnerable: boolean): string => {
    if (!isVulnerable) {
      return '#7FB7D6'; // Muted sky blue - secure
    }
    
    // Use risk_weight to determine color intensity
    const weight = riskWeight ?? 50; // Default to medium if null
    
    if (weight >= 80) {
      return '#E03E84'; // Magenta - critical
    } else if (weight >= 50) {
      return '#9A2E4A'; // Lighter crimson - high
    } else if (weight >= 25) {
      return '#7A1E3A'; // Deep crimson - medium
    }
    return '#5A1530'; // Darker crimson - low risk
  };

  // Build lines from actual file_relationships
  const lines = useMemo(() => {
    const result: Array<{ 
      x1: number; 
      y1: number; 
      x2: number; 
      y2: number; 
      color: string;
      relation: string;
    }> = [];
    
    relationships.forEach(rel => {
      const fromNode = fileToNode.get(rel.from_file);
      const toNode = fileToNode.get(rel.to_file);
      
      // Only draw if both nodes exist in our current nodes list
      if (fromNode && toNode) {
        const fromPos = nodeIdToPosition.get(fromNode.id);
        const toPos = nodeIdToPosition.get(toNode.id);
        
        if (fromPos && toPos) {
          // Use the originating node's risk_weight for edge color
          const color = getEdgeColor(fromNode.risk_weight, fromNode.is_vulnerable);
          
          result.push({
            x1: fromPos.x,
            y1: fromPos.y,
            x2: toPos.x,
            y2: toPos.y,
            color,
            relation: rel.relation,
          });
        }
      }
    });
    
    return result;
  }, [relationships, fileToNode, nodeIdToPosition]);
  
  // Node size offset (stars are centered with translate(-50%, -50%))
  // Lines already use same % coordinates, but SVG elements don't auto-center
  // We need to adjust the SVG viewport to match the positioned stars
  
  return (
    <svg 
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
      style={{ overflow: 'visible' }}
    >
      <defs>
        {lines.map((line, index) => (
          <linearGradient
            key={`gradient-${index}`}
            id={`line-gradient-${index}`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor={line.color} stopOpacity="0.8" />
            <stop offset="50%" stopColor={line.color} stopOpacity="0.5" />
            <stop offset="100%" stopColor={line.color} stopOpacity="0.8" />
          </linearGradient>
        ))}
      </defs>
      {lines.map((line, index) => (
        <line
          key={index}
          x1={`${line.x1}%`}
          y1={`${line.y1}%`}
          x2={`${line.x2}%`}
          y2={`${line.y2}%`}
          stroke={`url(#line-gradient-${index})`}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
};

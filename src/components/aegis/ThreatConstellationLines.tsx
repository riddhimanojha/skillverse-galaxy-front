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

  // Get edge color - darkened, desaturated versions of risk color
  const getEdgeColor = (riskWeight: number | null, isVulnerable: boolean): { main: string; highlight: string } => {
    if (!isVulnerable) {
      return {
        main: 'hsl(160, 25%, 22%)',      // Muted dark green
        highlight: 'hsl(160, 30%, 28%)', // Subtle lighter center
      };
    }
    
    const weight = riskWeight ?? 5;
    
    if (weight < 3) {
      return {
        main: 'hsl(45, 30%, 25%)',       // Dark muted golden
        highlight: 'hsl(45, 35%, 32%)',
      };
    } else if (weight < 7) {
      return {
        main: 'hsl(25, 30%, 23%)',       // Dark muted orange
        highlight: 'hsl(25, 35%, 30%)',
      };
    }
    return {
      main: 'hsl(0, 28%, 22%)',          // Dark muted red
      highlight: 'hsl(0, 32%, 28%)',
    };
  };

  // Build lines from actual file_relationships
  const lines = useMemo(() => {
    const result: Array<{ 
      x1: number; 
      y1: number; 
      x2: number; 
      y2: number; 
      mainColor: string;
      highlightColor: string;
      relation: string;
      id: string;
    }> = [];
    
    relationships.forEach((rel, idx) => {
      const fromNode = fileToNode.get(rel.from_file);
      const toNode = fileToNode.get(rel.to_file);
      
      // Only draw if both nodes exist in our current nodes list
      if (fromNode && toNode) {
        const fromPos = nodeIdToPosition.get(fromNode.id);
        const toPos = nodeIdToPosition.get(toNode.id);
        
        if (fromPos && toPos) {
          // Use the originating node's risk_weight for edge color
          const colors = getEdgeColor(fromNode.risk_weight, fromNode.is_vulnerable);
          
          result.push({
            x1: fromPos.x,
            y1: fromPos.y,
            x2: toPos.x,
            y2: toPos.y,
            mainColor: colors.main,
            highlightColor: colors.highlight,
            relation: rel.relation,
            id: `edge-${idx}`,
          });
        }
      }
    });
    
    return result;
  }, [relationships, fileToNode, nodeIdToPosition]);
  
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
      <defs>
        {lines.map((line) => (
          <linearGradient
            key={`grad-${line.id}`}
            id={`gradient-${line.id}`}
            x1={`${line.x1}%`}
            y1={`${line.y1}%`}
            x2={`${line.x2}%`}
            y2={`${line.y2}%`}
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor={line.mainColor} />
            <stop offset="50%" stopColor={line.highlightColor} />
            <stop offset="100%" stopColor={line.mainColor} />
          </linearGradient>
        ))}
      </defs>
      {lines.map((line) => (
        <line
          key={line.id}
          x1={`${line.x1}%`}
          y1={`${line.y1}%`}
          x2={`${line.x2}%`}
          y2={`${line.y2}%`}
          stroke={`url(#gradient-${line.id})`}
          strokeWidth="1.25"
          strokeOpacity="0.55"
          className="transition-opacity duration-300 hover:opacity-80"
        />
      ))}
    </svg>
  );
};

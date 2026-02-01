import { SecurityNode } from "@/types/securityNode";
import { FileRelationship } from "@/types/fileRelationship";
import { ThreatStar } from "./ThreatStar";
import { useMemo } from "react";

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
];

// Generate constellation positions with slight randomization for organic feel
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

// Eye-safe color palette - desaturated, darkened
const getEdgeColor = (riskWeight: number | null, isVulnerable: boolean) => {
  if (!isVulnerable) {
    // Light mint green - calm, low-saturation
    return {
      stroke: 'hsl(160, 35%, 45%)',
      glow: 'hsl(160, 30%, 40%)',
    };
  }
  
  const weight = riskWeight ?? 5;
  
  if (weight >= 7) {
    // High-risk: muted deep red - warm and dark
    return {
      stroke: 'hsl(355, 45%, 40%)',
      glow: 'hsl(355, 40%, 35%)',
    };
  } else if (weight >= 4) {
    // Medium: amber / soft orange
    return {
      stroke: 'hsl(35, 50%, 45%)',
      glow: 'hsl(35, 45%, 40%)',
    };
  }
  // Low: cool cyan / teal
  return {
    stroke: 'hsl(185, 40%, 45%)',
    glow: 'hsl(185, 35%, 40%)',
  };
};

export const ThreatGalaxy = ({ nodes, relationships, onNodeClick }: ThreatGalaxyProps) => {
  const positions = getNodePositions(nodes);
  
  const nodePositions = nodes.map((node, index) => ({
    id: node.id,
    x: positions[index]?.x ?? 50,
    y: positions[index]?.y ?? 50,
  }));

  // Build edge data with colors and animation delays
  const edges = useMemo(() => {
    return relationships.map((rel, index) => {
      const fromNode = nodes.find(n => n.file_name === rel.from_file);
      const toNode = nodes.find(n => n.file_name === rel.to_file);
      
      if (!fromNode || !toNode) return null;
      
      const fromPos = nodePositions.find(p => p.id === fromNode.id);
      const toPos = nodePositions.find(p => p.id === toNode.id);
      
      if (!fromPos || !toPos) return null;
      
      const colors = getEdgeColor(fromNode.risk_weight, fromNode.is_vulnerable);
      const delay = index * 0.15; // Stagger animations
      
      // Calculate line length for animation
      const dx = (toPos.x - fromPos.x);
      const dy = (toPos.y - fromPos.y);
      const length = Math.sqrt(dx * dx + dy * dy);
      
      return {
        id: `edge-${index}`,
        x1: fromPos.x,
        y1: fromPos.y,
        x2: toPos.x,
        y2: toPos.y,
        colors,
        delay,
        length,
      };
    }).filter(Boolean);
  }, [relationships, nodes, nodePositions]);

  return (
    <div className="relative w-full h-full">
      {/* SVG for edges with soft glow filters */}
      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
        style={{ overflow: 'visible' }}
      >
        <defs>
          {/* Soft glow filter - diffuse, ambient light feel */}
          <filter id="soft-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          
          {/* Even softer outer glow for ambient effect */}
          <filter id="ambient-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
            <feComponentTransfer in="blur">
              <feFuncA type="linear" slope="0.25" />
            </feComponentTransfer>
          </filter>

          {/* Gradient for energy flow animation */}
          {edges.map((edge, i) => edge && (
            <linearGradient
              key={`gradient-${i}`}
              id={`energy-gradient-${i}`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor={edge.colors.stroke} stopOpacity="0.15" />
              <stop offset="40%" stopColor={edge.colors.stroke} stopOpacity="0.5">
                <animate
                  attributeName="offset"
                  values="0;0.6;1;0"
                  dur="4s"
                  repeatCount="indefinite"
                  begin={`${edge.delay + 1.5}s`}
                />
              </stop>
              <stop offset="50%" stopColor={edge.colors.glow} stopOpacity="0.7">
                <animate
                  attributeName="offset"
                  values="0.1;0.7;1.1;0.1"
                  dur="4s"
                  repeatCount="indefinite"
                  begin={`${edge.delay + 1.5}s`}
                />
              </stop>
              <stop offset="60%" stopColor={edge.colors.stroke} stopOpacity="0.5">
                <animate
                  attributeName="offset"
                  values="0.2;0.8;1.2;0.2"
                  dur="4s"
                  repeatCount="indefinite"
                  begin={`${edge.delay + 1.5}s`}
                />
              </stop>
              <stop offset="100%" stopColor={edge.colors.stroke} stopOpacity="0.15" />
            </linearGradient>
          ))}
        </defs>
        
        {/* Render edges with layered glow effect */}
        {edges.map((edge, index) => edge && (
          <g key={edge.id}>
            {/* Ambient outer glow layer - very soft */}
            <line
              x1={`${edge.x1}%`}
              y1={`${edge.y1}%`}
              x2={`${edge.x2}%`}
              y2={`${edge.y2}%`}
              stroke={edge.colors.glow}
              strokeWidth="6"
              strokeLinecap="round"
              opacity="0.12"
              filter="url(#ambient-glow)"
              style={{
                strokeDasharray: `${edge.length * 10}`,
                strokeDashoffset: `${edge.length * 10}`,
                animation: `drawLine 1.4s ease-out ${edge.delay}s forwards`,
              }}
            />
            
            {/* Inner glow layer */}
            <line
              x1={`${edge.x1}%`}
              y1={`${edge.y1}%`}
              x2={`${edge.x2}%`}
              y2={`${edge.y2}%`}
              stroke={edge.colors.glow}
              strokeWidth="3"
              strokeLinecap="round"
              opacity="0.2"
              filter="url(#soft-glow)"
              style={{
                strokeDasharray: `${edge.length * 10}`,
                strokeDashoffset: `${edge.length * 10}`,
                animation: `drawLine 1.4s ease-out ${edge.delay}s forwards`,
              }}
            />
            
            {/* Main line with energy flow gradient */}
            <line
              x1={`${edge.x1}%`}
              y1={`${edge.y1}%`}
              x2={`${edge.x2}%`}
              y2={`${edge.y2}%`}
              stroke={`url(#energy-gradient-${index})`}
              strokeWidth="1.6"
              strokeLinecap="round"
              style={{
                strokeDasharray: `${edge.length * 10}`,
                strokeDashoffset: `${edge.length * 10}`,
                animation: `drawLine 1.4s ease-out ${edge.delay}s forwards`,
              }}
            />
            
            {/* Core solid line */}
            <line
              x1={`${edge.x1}%`}
              y1={`${edge.y1}%`}
              x2={`${edge.x2}%`}
              y2={`${edge.y2}%`}
              stroke={edge.colors.stroke}
              strokeWidth="1.4"
              strokeLinecap="round"
              opacity="0.6"
              style={{
                strokeDasharray: `${edge.length * 10}`,
                strokeDashoffset: `${edge.length * 10}`,
                animation: `drawLine 1.4s ease-out ${edge.delay}s forwards`,
              }}
            />
          </g>
        ))}
      </svg>
      
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
      
      {/* CSS for draw animation */}
      <style>{`
        @keyframes drawLine {
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </div>
  );
};

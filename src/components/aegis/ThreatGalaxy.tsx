import { useState, useEffect, useMemo, useRef } from "react";
import { SecurityNode } from "@/types/securityNode";
import { FileRelationship } from "@/types/fileRelationship";
import { ThreatStar } from "./ThreatStar";
import { AnimatedEdge } from "./AnimatedEdge";
import { seededRandom, generateNoiseDrift } from "@/utils/noiseGenerator";

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

// Get edge color based on risk_weight
const getEdgeColor = (riskWeight: number | null, isVulnerable: boolean): string => {
  if (!isVulnerable) {
    return '#7FB7D6'; // Muted sky blue - secure
  }
  
  const weight = riskWeight ?? 5;
  
  if (weight >= 7) {
    return '#E03E84'; // Magenta - critical
  } else if (weight >= 4) {
    return '#9A2E4A'; // Lighter crimson - high
  }
  return '#7A1E3A'; // Deep crimson - medium/low
};

export const ThreatGalaxy = ({ nodes, relationships, onNodeClick }: ThreatGalaxyProps) => {
  // Track which nodes/edges are "new" for entry animations
  const prevNodeIdsRef = useRef<Set<string>>(new Set());
  const prevEdgeIdsRef = useRef<Set<string>>(new Set());
  const [newNodeIds, setNewNodeIds] = useState<Set<string>>(new Set());
  const [newEdgeIds, setNewEdgeIds] = useState<Set<string>>(new Set());
  
  // Live drift positions for edges to follow
  const [nodeDriftPositions, setNodeDriftPositions] = useState<Map<string, { x: number; y: number }>>(new Map());
  
  const positions = useMemo(() => getNodePositions(nodes), [nodes]);
  
  const nodePositions = useMemo(() => nodes.map((node, index) => ({
    id: node.id,
    x: positions[index]?.x ?? 50,
    y: positions[index]?.y ?? 50,
  })), [nodes, positions]);

  // Detect new nodes for entry animation
  useEffect(() => {
    const currentIds = new Set(nodes.map(n => n.id));
    const previousIds = prevNodeIdsRef.current;
    
    const newIds = new Set<string>();
    currentIds.forEach(id => {
      if (!previousIds.has(id)) {
        newIds.add(id);
      }
    });
    
    if (newIds.size > 0) {
      setNewNodeIds(newIds);
      
      // Clear "new" status after animation completes
      setTimeout(() => {
        setNewNodeIds(new Set());
      }, 1000);
    }
    
    prevNodeIdsRef.current = currentIds;
  }, [nodes]);

  // Detect new edges for entry animation
  useEffect(() => {
    const currentEdgeIds = new Set(relationships.map(r => `${r.from_file}-${r.to_file}`));
    const previousEdgeIds = prevEdgeIdsRef.current;
    
    const newIds = new Set<string>();
    currentEdgeIds.forEach(id => {
      if (!previousEdgeIds.has(id)) {
        newIds.add(id);
      }
    });
    
    if (newIds.size > 0) {
      setNewEdgeIds(newIds);
      
      // Clear "new" status after animation completes
      setTimeout(() => {
        setNewEdgeIds(new Set());
      }, 1800);
    }
    
    prevEdgeIdsRef.current = currentEdgeIds;
  }, [relationships]);

  // Animate node drift positions for edges to follow
  useEffect(() => {
    let animationFrame: number;
    const startTimes = new Map<string, number>();
    
    nodes.forEach(node => {
      const seed = node.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      startTimes.set(node.id, Date.now() + seed * 100);
    });
    
    const animate = () => {
      const newPositions = new Map<string, { x: number; y: number }>();
      
      nodes.forEach(node => {
        const seed = node.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const startTime = startTimes.get(node.id) ?? Date.now();
        const elapsed = Date.now() - startTime;
        const maxDrift = 1 + seededRandom(seed * 50) * 3;
        const drift = generateNoiseDrift(seed, elapsed, maxDrift);
        newPositions.set(node.id, drift);
      });
      
      setNodeDriftPositions(newPositions);
      animationFrame = requestAnimationFrame(animate);
    };
    
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [nodes]);

  // Build edge data with animated positions
  const edges = useMemo(() => {
    return relationships.map(rel => {
      const fromNode = nodes.find(n => n.file_name === rel.from_file);
      const toNode = nodes.find(n => n.file_name === rel.to_file);
      
      if (!fromNode || !toNode) return null;
      
      const fromPos = nodePositions.find(p => p.id === fromNode.id);
      const toPos = nodePositions.find(p => p.id === toNode.id);
      
      if (!fromPos || !toPos) return null;
      
      const fromDrift = nodeDriftPositions.get(fromNode.id) ?? { x: 0, y: 0 };
      const toDrift = nodeDriftPositions.get(toNode.id) ?? { x: 0, y: 0 };
      
      const edgeId = `${rel.from_file}-${rel.to_file}`;
      const color = getEdgeColor(fromNode.risk_weight, fromNode.is_vulnerable);
      
      return {
        id: edgeId,
        x1: fromPos.x + fromDrift.x * 0.08, // Convert px to % (rough approximation)
        y1: fromPos.y + fromDrift.y * 0.08,
        x2: toPos.x + toDrift.x * 0.08,
        y2: toPos.y + toDrift.y * 0.08,
        color,
        riskWeight: fromNode.risk_weight ?? 5,
        isNew: newEdgeIds.has(edgeId),
      };
    }).filter(Boolean);
  }, [relationships, nodes, nodePositions, nodeDriftPositions, newEdgeIds]);

  // Empty state - just show galaxy background
  if (nodes.length === 0) {
    return (
      <div className="relative w-full h-full">
        {/* Empty - galaxy background shows through */}
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {/* Animated curved edges */}
      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ overflow: 'visible' }}
      >
        {edges.map((edge) => edge && (
          <AnimatedEdge
            key={edge.id}
            id={edge.id}
            x1={edge.x1}
            y1={edge.y1}
            x2={edge.x2}
            y2={edge.y2}
            color={edge.color}
            riskWeight={edge.riskWeight}
            isNew={edge.isNew}
          />
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
          isNew={newNodeIds.has(node.id)}
        />
      ))}
    </div>
  );
};

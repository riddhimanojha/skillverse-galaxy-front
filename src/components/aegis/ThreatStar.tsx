import { useState, useEffect } from "react";
import { SecurityNode } from "@/types/securityNode";

interface ThreatStarProps {
  node: SecurityNode;
  x: number;
  y: number;
  onClick: () => void;
}

export const ThreatStar = ({ node, x, y, onClick }: ThreatStarProps) => {
  const [ripple, setRipple] = useState(false);
  const [hover, setHover] = useState(false);

  const isVulnerable = node.is_vulnerable;

  useEffect(() => {
    if (!isVulnerable) {
      setRipple(true);
      const timer = setTimeout(() => setRipple(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isVulnerable]);

  // Core color - muted for cinematic feel, used for rim/accent
  const getRiskColor = () => {
    if (!isVulnerable) return 'hsl(160, 60%, 45%)'; // Secure muted teal
    
    const weight = node.risk_weight ?? 5;
    
    if (weight < 3) return 'hsl(45, 55%, 50%)';   // Muted gold
    if (weight < 7) return 'hsl(25, 50%, 48%)';   // Muted amber
    return 'hsl(0, 50%, 50%)';                     // Muted rose
  };

  // Darker core color for the node fill
  const getCoreColor = () => {
    if (!isVulnerable) return 'hsl(160, 40%, 20%)';
    
    const weight = node.risk_weight ?? 5;
    
    if (weight < 3) return 'hsl(45, 30%, 18%)';
    if (weight < 7) return 'hsl(25, 30%, 16%)';
    return 'hsl(0, 30%, 15%)';
  };

  return (
    <div
      className="absolute duration-300 ease-out cursor-pointer"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: hover 
          ? "translate(-50%, -50%) scale(1.4)" 
          : "translate(-50%, -50%) scale(1)",
        transition: "all 0.25s ease-out",
        zIndex: hover ? 20 : 10,
      }}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* Subtle outer rim glow - refined, not overpowering */}
      <div
        className={`absolute inset-0 rounded-full transition-all duration-500 ${
          isVulnerable ? "animate-pulse" : ""
        }`}
        style={{
          width: hover ? "32px" : "28px",
          height: hover ? "32px" : "28px",
          margin: hover ? "-11px" : "-9px",
          border: `1.5px solid ${getRiskColor()}`,
          opacity: isVulnerable ? 0.6 : 0.4,
          boxShadow: `0 0 12px ${getRiskColor()}40`,
        }}
      />
      
      {/* Core star - dark fill with colored rim accent */}
      <div
        className="relative rounded-full transition-all duration-500"
        style={{
          width: isVulnerable ? "14px" : "10px",
          height: isVulnerable ? "14px" : "10px",
          backgroundColor: getCoreColor(),
          border: `1.5px solid ${getRiskColor()}`,
          boxShadow: hover 
            ? `0 0 16px ${getRiskColor()}60, inset 0 0 4px ${getRiskColor()}30`
            : `0 0 8px ${getRiskColor()}40, inset 0 0 2px ${getRiskColor()}20`,
        }}
      />

      {/* Hover tooltip */}
      {hover && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-5 px-4 py-3 glass-panel rounded-xl text-sm whitespace-nowrap animate-fade-in z-50">
          <div className={`font-bold ${isVulnerable ? 'text-red-400' : 'text-green-400'}`}>
            {isVulnerable ? '🚨 ' : '🛡️ '}{node.category_name}
          </div>
          {isVulnerable ? (
            <>
              {node.file_name && (
                <div className="text-xs text-cyan-400 font-mono mt-1">
                  📄 {node.file_name}{node.line_no ? `:${node.line_no}` : ''}
                </div>
              )}
              <div className="flex items-center gap-2 mt-1.5">
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                  node.severity === 'Critical' 
                    ? 'bg-red-500/30 text-red-300' 
                    : node.severity === 'High'
                    ? 'bg-orange-500/30 text-orange-300'
                    : 'bg-yellow-500/30 text-yellow-300'
                }`}>
                  {node.severity}
                </span>
              </div>
              <div className="text-xs text-muted-foreground mt-1.5">Click to inspect</div>
            </>
          ) : (
            <div className="text-xs text-green-400/80 mt-1">
              ✓ No action needed
            </div>
          )}
        </div>
      )}
    </div>
  );
};

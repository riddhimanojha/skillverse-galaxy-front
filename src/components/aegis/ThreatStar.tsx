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

  // Risk color - desaturated, muted tones
  const getRiskColor = () => {
    if (!isVulnerable) return 'hsl(160, 40%, 35%)'; // Muted secure green
    
    const weight = node.risk_weight ?? 5;
    
    if (weight < 3) return 'hsl(45, 50%, 45%)';   // Muted golden
    if (weight < 7) return 'hsl(25, 50%, 42%)';   // Muted orange
    return 'hsl(0, 45%, 40%)';                     // Muted red
  };

  // Aura color - slightly more saturated for glow
  const getAuraColor = () => {
    if (!isVulnerable) return 'hsl(160, 45%, 30%)';
    
    const weight = node.risk_weight ?? 5;
    
    if (weight < 3) return 'hsl(45, 55%, 40%)';
    if (weight < 7) return 'hsl(25, 55%, 38%)';
    return 'hsl(0, 50%, 35%)';
  };

  return (
    <div
      className="absolute cursor-pointer"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: hover 
          ? "translate(-50%, -50%) scale(1.08)" 
          : "translate(-50%, -50%) scale(1)",
        transition: "transform 0.4s ease-out, opacity 0.3s ease",
        zIndex: hover ? 20 : 10,
      }}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* Secure ripple - subtle */}
      {ripple && !isVulnerable && (
        <div 
          className="absolute rounded-full animate-ping" 
          style={{ 
            width: "40px", 
            height: "40px", 
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: getAuraColor(),
            opacity: 0.2,
          }}
        />
      )}

      {/* Vulnerable pulse - aura only, subtle */}
      {isVulnerable && (
        <div 
          className="absolute rounded-full"
          style={{ 
            width: "36px", 
            height: "36px", 
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: getAuraColor(),
            opacity: 0.25,
            animation: "pulse-aura 2.5s ease-in-out infinite",
          }} 
        />
      )}
      
      {/* Outer aura - soft glow, risk-tinted */}
      <div
        className="absolute rounded-full transition-all duration-500"
        style={{
          width: hover ? "32px" : "28px",
          height: hover ? "32px" : "28px",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: getAuraColor(),
          opacity: hover ? 0.4 : 0.25,
          filter: `blur(${hover ? "10px" : "12px"})`,
        }}
      />
      
      {/* Dark core with risk-colored rim */}
      <div
        className="relative rounded-full transition-all duration-400"
        style={{
          width: "10px",
          height: "10px",
          backgroundColor: "hsl(254, 30%, 8%)", // Near-black core
          border: `1.5px solid ${getRiskColor()}`,
          boxShadow: hover 
            ? `0 0 8px ${getAuraColor()}, inset 0 0 3px ${getRiskColor()}`
            : `0 0 4px ${getAuraColor()}`,
        }}
      />

      {/* Hover tooltip */}
      {hover && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-5 px-4 py-3 glass-panel rounded-xl text-sm whitespace-nowrap animate-fade-in z-50">
          <div className={`font-bold ${isVulnerable ? 'text-red-400/80' : 'text-green-400/80'}`}>
            {isVulnerable ? '🚨 ' : '🛡️ '}{node.category_name}
          </div>
          {isVulnerable ? (
            <>
              {node.file_name && (
                <div className="text-xs text-cyan-400/70 font-mono mt-1">
                  📄 {node.file_name}{node.line_no ? `:${node.line_no}` : ''}
                </div>
              )}
              <div className="flex items-center gap-2 mt-1.5">
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                  node.severity === 'Critical' 
                    ? 'bg-red-500/20 text-red-300/80' 
                    : node.severity === 'High'
                    ? 'bg-orange-500/20 text-orange-300/80'
                    : 'bg-yellow-500/20 text-yellow-300/80'
                }`}>
                  {node.severity}
                </span>
              </div>
              <div className="text-xs text-muted-foreground mt-1.5">Click to inspect</div>
            </>
          ) : (
            <div className="text-xs text-green-400/60 mt-1">
              ✓ No action needed
            </div>
          )}
        </div>
      )}
    </div>
  );
};

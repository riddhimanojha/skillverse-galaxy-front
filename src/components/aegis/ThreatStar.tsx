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

  const getSeverityColor = () => {
    if (!isVulnerable) return 'hsl(160, 100%, 50%)'; // Secure green
    switch (node.severity) {
      case 'Critical': return 'hsl(0, 100%, 55%)';
      case 'High': return 'hsl(25, 100%, 55%)';
      case 'Medium': return 'hsl(45, 100%, 55%)';
      default: return 'hsl(0, 100%, 55%)';
    }
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
      {/* Secure ripple effect */}
      {ripple && !isVulnerable && (
        <div 
          className="absolute inset-0 rounded-full animate-ping opacity-60" 
          style={{ 
            width: "50px", 
            height: "50px", 
            margin: "-20px",
            backgroundColor: "hsl(160, 100%, 50%)" 
          }} 
        />
      )}

      {/* Vulnerability pulse effect */}
      {isVulnerable && (
        <div 
          className="absolute inset-0 rounded-full animate-ping" 
          style={{ 
            width: "45px", 
            height: "45px", 
            margin: "-18px",
            backgroundColor: getSeverityColor(),
            opacity: 0.35,
          }} 
        />
      )}
      
      {/* Pulsing glow aura */}
      <div
        className={`absolute inset-0 rounded-full blur-2xl transition-all duration-700 ${
          isVulnerable ? "animate-pulse" : ""
        }`}
        style={{
          width: hover ? "60px" : "50px",
          height: hover ? "60px" : "50px",
          margin: hover ? "-25px" : "-20px",
          backgroundColor: getSeverityColor(),
          opacity: isVulnerable ? 0.8 : 0.5,
        }}
      />
      
      {/* Core star */}
      <div
        className="relative rounded-full transition-all duration-500"
        style={{
          width: isVulnerable ? "16px" : "12px",
          height: isVulnerable ? "16px" : "12px",
          backgroundColor: getSeverityColor(),
          boxShadow: isVulnerable
            ? `0 0 40px ${getSeverityColor()}, 0 0 60px ${getSeverityColor()}, inset 0 0 10px rgba(255,255,255,0.3)`
            : `0 0 20px ${getSeverityColor()}, inset 0 0 8px rgba(255,255,255,0.5)`,
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

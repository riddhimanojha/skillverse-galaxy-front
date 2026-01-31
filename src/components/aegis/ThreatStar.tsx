import { useState, useEffect } from "react";
import { SecurityNode } from "@/types/securityNode";

interface ThreatStarProps {
  node: SecurityNode;
  x: number;
  y: number;
  onClick: () => void;
  hasConnectedThreat?: boolean; // Connected to a vulnerable node
}

export const ThreatStar = ({ node, x, y, onClick, hasConnectedThreat = false }: ThreatStarProps) => {
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

  // Purple influence color for connected threat warning
  const influenceColor = 'hsl(280, 80%, 60%)';

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
      {/* Connected threat warning halo (purple) - only for non-vulnerable stars */}
      {hasConnectedThreat && !isVulnerable && (
        <div 
          className="absolute inset-0 rounded-full animate-pulse" 
          style={{ 
            width: "45px", 
            height: "45px", 
            margin: "-17px",
            border: `1.5px solid ${influenceColor}`,
            backgroundColor: 'transparent',
            boxShadow: `0 0 15px ${influenceColor}, 0 0 30px rgba(168, 85, 247, 0.3)`,
            opacity: 0.6,
            animationDuration: "2.5s",
          }} 
        />
      )}

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

      {/* Vulnerability pulse effect (RED - only for directly vulnerable) */}
      {isVulnerable && (
        <>
          <div 
            className="absolute inset-0 rounded-full animate-ping" 
            style={{ 
              width: "70px", 
              height: "70px", 
              margin: "-30px",
              backgroundColor: getSeverityColor(),
              opacity: 0.4,
            }} 
          />
          <div 
            className="absolute inset-0 rounded-full animate-pulse" 
            style={{ 
              width: "55px", 
              height: "55px", 
              margin: "-22px",
              border: `2px solid ${getSeverityColor()}`,
              backgroundColor: 'transparent',
              boxShadow: `0 0 30px ${getSeverityColor()}, inset 0 0 20px rgba(0,0,0,0.5)`,
            }} 
          />
        </>
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
          <div className={`font-bold ${isVulnerable ? 'text-red-400' : hasConnectedThreat ? 'text-purple-400' : 'text-green-400'}`}>
            {isVulnerable ? '🚨 ' : hasConnectedThreat ? '⚠️ ' : '🛡️ '}{node.category_name}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className={`px-2 py-0.5 rounded text-xs font-bold ${
              isVulnerable 
                ? node.severity === 'Critical' 
                  ? 'bg-red-500/30 text-red-300' 
                  : node.severity === 'High'
                  ? 'bg-orange-500/30 text-orange-300'
                  : 'bg-yellow-500/30 text-yellow-300'
                : hasConnectedThreat
                ? 'bg-purple-500/30 text-purple-300'
                : 'bg-green-500/30 text-green-300'
            }`}>
              {isVulnerable ? node.severity : hasConnectedThreat ? 'At Risk' : 'Secure'}
            </span>
          </div>
          {isVulnerable && (
            <div className="text-xs text-muted-foreground mt-1">Click to view fix</div>
          )}
          {hasConnectedThreat && !isVulnerable && (
            <div className="text-xs text-purple-300/70 mt-1">Connected to vulnerability</div>
          )}
        </div>
      )}
    </div>
  );
};

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

  const getRiskColor = () => {
    if (!isVulnerable) return 'hsl(160, 100%, 50%)'; // Secure green
    
    const weight = node.risk_weight ?? 5;
    
    if (weight < 3) return 'hsl(45, 90%, 55%)';   // Golden
    if (weight < 7) return 'hsl(25, 90%, 55%)';   // Orange
    return 'hsl(0, 85%, 55%)';                     // Red
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
            backgroundColor: getRiskColor() 
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
            backgroundColor: getRiskColor(),
            opacity: 0.4,
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
          backgroundColor: getRiskColor(),
          opacity: isVulnerable ? 0.75 : 0.5,
        }}
      />
      
      {/* Core star */}
      <div
        className="relative rounded-full transition-all duration-500"
        style={{
          width: isVulnerable ? "16px" : "12px",
          height: isVulnerable ? "16px" : "12px",
          backgroundColor: getRiskColor(),
          boxShadow: isVulnerable
            ? `0 0 40px ${getRiskColor()}, 0 0 60px ${getRiskColor()}, inset 0 0 10px rgba(255,255,255,0.3)`
            : `0 0 20px ${getRiskColor()}, inset 0 0 8px rgba(255,255,255,0.5)`,
        }}
      />

      {/* Persistent file name label */}
      {node.file_name && (
        <div 
          className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none"
          style={{
            top: 'calc(100% + 10px)',
            fontSize: '11px',
            fontWeight: 500,
            color: 'rgba(255, 255, 255, 0.6)',
            letterSpacing: '0.01em',
          }}
        >
          {node.file_name}
        </div>
      )}

      {/* Hover tooltip with problem/solution */}
      {hover && (
        <div 
          className="absolute left-1/2 -translate-x-1/2 mt-8 w-72 glass-panel rounded-xl animate-fade-in z-50 overflow-hidden"
          style={{ top: '100%' }}
        >
          {/* Header */}
          <div className={`px-4 py-2.5 ${isVulnerable ? 'bg-red-500/10' : 'bg-green-500/10'}`}>
            <div className={`font-bold text-sm ${isVulnerable ? 'text-red-400' : 'text-green-400'}`}>
              {isVulnerable ? '🚨 ' : '🛡️ '}{node.category_name}
            </div>
            {node.file_name && (
              <div className="text-xs text-cyan-400 font-mono mt-0.5">
                📄 {node.file_name}{node.line_no ? `:${node.line_no}` : ''}
              </div>
            )}
            {isVulnerable && (
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
                <span className="text-xs text-muted-foreground">
                  Risk: {node.risk_weight ?? 5}/10
                </span>
              </div>
            )}
          </div>
          
          {isVulnerable ? (
            <div className="p-3 space-y-3">
              {/* Problem Section */}
              {node.file_content && (
                <div className="space-y-1.5">
                  <div className="text-xs font-semibold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                    <span>⚠️</span> Problem
                  </div>
                  <div className="bg-red-950/30 border border-red-500/20 rounded-lg p-2 overflow-hidden">
                    <pre className="text-xs text-red-300/90 font-mono whitespace-pre-wrap overflow-x-auto max-h-20">
                      {node.file_content.length > 150 
                        ? node.file_content.substring(0, 150) + '...' 
                        : node.file_content}
                    </pre>
                  </div>
                </div>
              )}
              
              {/* Solution Section */}
              <div className="space-y-1.5">
                <div className="text-xs font-semibold text-green-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span>✅</span> Solution
                </div>
                <div className="bg-green-950/30 border border-green-500/20 rounded-lg p-2 overflow-hidden">
                  <pre className="text-xs text-green-300/90 font-mono whitespace-pre-wrap overflow-x-auto max-h-20">
                    {(node.fix_code || node.occam_fix).length > 150 
                      ? (node.fix_code || node.occam_fix).substring(0, 150) + '...' 
                      : (node.fix_code || node.occam_fix)}
                  </pre>
                </div>
              </div>
              
              <div className="text-xs text-center text-muted-foreground pt-1 border-t border-border/30">
                Click to view full details
              </div>
            </div>
          ) : (
            <div className="p-3 text-center">
              <div className="text-green-400/80 text-sm">✓ This node is secured</div>
              <div className="text-xs text-muted-foreground mt-1">No action needed</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

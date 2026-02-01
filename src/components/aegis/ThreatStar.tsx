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
  
  // Generate unique animation parameters based on node id for organic variation
  const seed = node.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const animationDuration = 8 + (seed % 6); // 8-14 seconds
  const animationDelay = (seed % 4); // 0-4 seconds delay
  const driftAngle = (seed * 137.5) % 360; // Unique drift direction

  useEffect(() => {
    if (!isVulnerable) {
      setRipple(true);
      const timer = setTimeout(() => setRipple(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isVulnerable]);

  const getRiskColor = () => {
    if (!isVulnerable) return '#7FB7D6'; // Muted sky blue - secure
    
    const weight = node.risk_weight ?? 5;
    
    if (weight < 3) return '#7A1E3A';    // Deep crimson - low risk
    if (weight < 7) return '#9A2E4A';    // Lighter crimson - medium risk
    return '#E03E84';                     // Magenta - high/critical risk
  };

  // CSS keyframes for ambient drift - applied to inner content
  const driftKeyframes = `
    @keyframes drift-${seed} {
      0%, 100% { transform: translate(0px, 0px); }
      25% { transform: translate(${Math.cos(driftAngle * Math.PI / 180) * 2}px, ${Math.sin(driftAngle * Math.PI / 180) * 1.5}px); }
      50% { transform: translate(${Math.cos((driftAngle + 90) * Math.PI / 180) * 1.5}px, ${Math.sin((driftAngle + 90) * Math.PI / 180) * 2}px); }
      75% { transform: translate(${Math.cos((driftAngle + 180) * Math.PI / 180) * 2}px, ${Math.sin((driftAngle + 180) * Math.PI / 180) * 1}px); }
    }
  `;

  return (
    <div
      className="absolute cursor-pointer"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: "translate(-50%, -50%)",
        zIndex: hover ? 20 : 10,
      }}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* Inject unique drift keyframes */}
      <style>{driftKeyframes}</style>
      
      {/* Ambient drift wrapper for visual elements - scale applied here only */}
      <div
        style={{
          animation: `drift-${seed} ${animationDuration}s ease-in-out ${animationDelay}s infinite`,
          transform: hover ? "scale(1.4)" : "scale(1)",
          transition: "transform 0.25s ease-out",
        }}
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
      </div>

      {/* Persistent file name label - muted sky blue */}
      {node.file_name && (
        <div 
          className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none"
          style={{
            top: 'calc(100% + 10px)',
            fontSize: '11px',
            fontWeight: 500,
            color: 'rgba(127, 183, 214, 0.7)',
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
          <div className={`px-4 py-2.5 ${isVulnerable ? 'bg-[#7A1E3A]/10' : 'bg-[#7FB7D6]/10'}`}>
            <div className={`font-bold text-sm ${isVulnerable ? 'text-[#E03E84]' : 'text-[#7FB7D6]'}`}>
              {isVulnerable ? '🚨 ' : '🛡️ '}{node.category_name}
            </div>
            {node.file_name && (
              <div className="text-xs font-mono mt-0.5" style={{ color: 'rgba(127, 183, 214, 0.8)' }}>
                📄 {node.file_name}{node.line_no ? `:${node.line_no}` : ''}
              </div>
            )}
            {isVulnerable && (
              <div className="flex items-center gap-2 mt-1.5">
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                  node.severity === 'Critical' 
                    ? 'bg-[#E03E84]/30 text-[#E03E84]' 
                    : node.severity === 'High'
                    ? 'bg-[#9A2E4A]/30 text-[#9A2E4A]'
                    : 'bg-[#7A1E3A]/30 text-[#7A1E3A]'
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
                  <div className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5" style={{ color: '#E03E84' }}>
                    <span>⚠️</span> Problem
                  </div>
                  <div className="rounded-lg p-2 overflow-hidden" style={{ background: 'rgba(122, 30, 58, 0.15)', border: '1px solid rgba(122, 30, 58, 0.25)' }}>
                    <pre className="text-xs font-mono whitespace-pre-wrap overflow-x-auto max-h-20" style={{ color: 'rgba(224, 62, 132, 0.85)' }}>
                      {node.file_content.length > 150 
                        ? node.file_content.substring(0, 150) + '...' 
                        : node.file_content}
                    </pre>
                  </div>
                </div>
              )}
              
              {/* Solution Section */}
              <div className="space-y-1.5">
                <div className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5" style={{ color: '#7FB7D6' }}>
                  <span>✅</span> Solution
                </div>
                <div className="rounded-lg p-2 overflow-hidden" style={{ background: 'rgba(127, 183, 214, 0.1)', border: '1px solid rgba(127, 183, 214, 0.2)' }}>
                  <pre className="text-xs font-mono whitespace-pre-wrap overflow-x-auto max-h-20" style={{ color: 'rgba(127, 183, 214, 0.85)' }}>
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
              <div className="text-sm" style={{ color: 'rgba(127, 183, 214, 0.8)' }}>✓ This node is secured</div>
              <div className="text-xs text-muted-foreground mt-1">No action needed</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

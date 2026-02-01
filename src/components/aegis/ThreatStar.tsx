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

      {/* Persistent file name label - refined styling */}
      {node.file_name && (
        <div 
          className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none"
          style={{
            top: 'calc(100% + 12px)',
            fontSize: '10px',
            fontWeight: 500,
            fontFamily: "'JetBrains Mono', monospace",
            color: 'rgba(127, 183, 214, 0.55)',
            letterSpacing: '0.02em',
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
          }}
        >
          {node.file_name}
        </div>
      )}

      {/* Hover tooltip with problem/solution - refined glass effect */}
      {hover && (
        <div 
          className="absolute left-1/2 -translate-x-1/2 mt-10 w-80 rounded-2xl animate-fade-in z-50 overflow-hidden"
          style={{ 
            top: '100%',
            background: 'rgba(18, 8, 12, 0.92)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(122, 30, 58, 0.2)',
            boxShadow: '0 16px 48px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 248, 240, 0.03)',
          }}
        >
          {/* Header */}
          <div 
            className="px-4 py-3"
            style={{
              background: isVulnerable ? 'rgba(122, 30, 58, 0.12)' : 'rgba(127, 183, 214, 0.08)',
              borderBottom: `1px solid ${isVulnerable ? 'rgba(122, 30, 58, 0.15)' : 'rgba(127, 183, 214, 0.1)'}`,
            }}
          >
            <div 
              className="font-semibold text-sm"
              style={{ color: isVulnerable ? '#E03E84' : '#7FB7D6' }}
            >
              {node.category_name}
            </div>
            {node.file_name && (
              <div 
                className="text-xs mt-1"
                style={{ 
                  fontFamily: "'JetBrains Mono', monospace",
                  color: 'rgba(127, 183, 214, 0.6)',
                }}
              >
                {node.file_name}{node.line_no ? `:${node.line_no}` : ''}
              </div>
            )}
            {isVulnerable && (
              <div className="flex items-center gap-2 mt-2">
                <span 
                  className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide"
                  style={{
                    background: node.severity === 'Critical' 
                      ? 'rgba(224, 62, 132, 0.2)' 
                      : node.severity === 'High'
                      ? 'rgba(154, 46, 74, 0.2)'
                      : 'rgba(122, 30, 58, 0.2)',
                    color: node.severity === 'Critical' 
                      ? '#E03E84' 
                      : node.severity === 'High'
                      ? '#9A2E4A'
                      : '#7A1E3A',
                    border: `1px solid ${node.severity === 'Critical' 
                      ? 'rgba(224, 62, 132, 0.3)' 
                      : node.severity === 'High'
                      ? 'rgba(154, 46, 74, 0.3)'
                      : 'rgba(122, 30, 58, 0.3)'}`,
                  }}
                >
                  {node.severity}
                </span>
                <span 
                  className="text-[10px]"
                  style={{ color: 'rgba(255, 248, 240, 0.4)' }}
                >
                  Risk {node.risk_weight ?? 5}/10
                </span>
              </div>
            )}
          </div>
          
          {isVulnerable ? (
            <div className="p-4 space-y-3">
              {/* Problem Section */}
              {node.file_content && (
                <div className="space-y-2">
                  <div 
                    className="text-[10px] font-semibold uppercase tracking-widest"
                    style={{ color: 'rgba(224, 62, 132, 0.7)' }}
                  >
                    Problem
                  </div>
                  <div 
                    className="rounded-lg p-2.5 overflow-hidden"
                    style={{ 
                      background: 'rgba(122, 30, 58, 0.1)', 
                      border: '1px solid rgba(122, 30, 58, 0.15)',
                    }}
                  >
                    <pre 
                      className="text-[11px] whitespace-pre-wrap overflow-x-auto max-h-16"
                      style={{ 
                        fontFamily: "'JetBrains Mono', monospace",
                        color: 'rgba(224, 62, 132, 0.8)',
                      }}
                    >
                      {node.file_content.length > 120 
                        ? node.file_content.substring(0, 120) + '...' 
                        : node.file_content}
                    </pre>
                  </div>
                </div>
              )}
              
              {/* Solution Section */}
              <div className="space-y-2">
                <div 
                  className="text-[10px] font-semibold uppercase tracking-widest"
                  style={{ color: 'rgba(127, 183, 214, 0.7)' }}
                >
                  Solution
                </div>
                <div 
                  className="rounded-lg p-2.5 overflow-hidden"
                  style={{ 
                    background: 'rgba(127, 183, 214, 0.06)', 
                    border: '1px solid rgba(127, 183, 214, 0.12)',
                  }}
                >
                  <pre 
                    className="text-[11px] whitespace-pre-wrap overflow-x-auto max-h-16"
                    style={{ 
                      fontFamily: "'JetBrains Mono', monospace",
                      color: 'rgba(127, 183, 214, 0.8)',
                    }}
                  >
                    {(node.fix_code || node.occam_fix).length > 120 
                      ? (node.fix_code || node.occam_fix).substring(0, 120) + '...' 
                      : (node.fix_code || node.occam_fix)}
                  </pre>
                </div>
              </div>
              
              <div 
                className="text-[10px] text-center pt-2"
                style={{ 
                  color: 'rgba(255, 248, 240, 0.35)',
                  borderTop: '1px solid rgba(122, 30, 58, 0.1)',
                }}
              >
                Click for details
              </div>
            </div>
          ) : (
            <div className="p-4 text-center">
              <div 
                className="text-sm font-medium"
                style={{ color: 'rgba(127, 183, 214, 0.8)' }}
              >
                Secured
              </div>
              <div 
                className="text-[11px] mt-1"
                style={{ color: 'rgba(255, 248, 240, 0.35)' }}
              >
                No action needed
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

import { useState, memo } from "react";
import { SecurityNode } from "@/types/securityNode";

interface ThreatStarProps {
  node: SecurityNode;
  x: number;
  y: number;
  onClick: () => void;
  entranceDelay?: number;
}

const getRiskColor = (isVulnerable: boolean, riskWeight: number | null) => {
  if (!isVulnerable) return '#7FB7D6';
  const weight = riskWeight ?? 5;
  if (weight < 3) return '#7A1E3A';
  if (weight < 7) return '#9A2E4A';
  return '#E03E84';
};

export const ThreatStar = memo(({ node, x, y, onClick, entranceDelay = 0 }: ThreatStarProps) => {
  const [hover, setHover] = useState(false);
  const isVulnerable = node.is_vulnerable;
  const color = getRiskColor(isVulnerable, node.risk_weight);

  return (
    <div
      className="absolute cursor-pointer"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: "translate(-50%, -50%)",
        zIndex: hover ? 20 : 10,
        opacity: 0,
        animation: `starEntrance 0.6s ease-out ${entranceDelay}s forwards`,
      }}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* Keyframes for smooth entrance */}
      <style>{`
        @keyframes starEntrance {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.3);
          }
          60% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.1);
          }
          100% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }
        @keyframes glowPulse {
          0%, 100% { opacity: 0.15; transform: scale(1); }
          50% { opacity: 0.25; transform: scale(1.1); }
        }
      `}</style>

      <div
        className="transition-transform duration-200"
        style={{
          transform: hover ? "scale(1.4)" : "scale(1)",
          willChange: 'transform',
        }}
      >
        {/* Glow aura */}
        <div
          className="absolute rounded-full"
          style={{
            width: "40px",
            height: "40px",
            margin: "-16px",
            backgroundColor: color,
            opacity: isVulnerable ? 0.25 : 0.15,
            filter: 'blur(8px)',
            animation: isVulnerable ? 'glowPulse 3s ease-in-out infinite' : 'none',
          }}
        />
        
        {/* Core star */}
        <div
          className="relative rounded-full"
          style={{
            width: isVulnerable ? "14px" : "10px",
            height: isVulnerable ? "14px" : "10px",
            backgroundColor: color,
            boxShadow: `0 0 12px ${color}`,
          }}
        />
      </div>

      {/* File name label */}
      {node.file_name && (
        <div 
          className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none"
          style={{
            top: 'calc(100% + 10px)',
            fontSize: '10px',
            fontWeight: 500,
            fontFamily: "monospace",
            color: 'rgba(127, 183, 214, 0.5)',
          }}
        >
          {node.file_name}
        </div>
      )}

      {/* Hover tooltip */}
      {hover && (
        <div 
          className="absolute left-1/2 -translate-x-1/2 mt-8 w-72 rounded-xl z-50 overflow-hidden animate-fade-in"
          style={{ 
            top: '100%',
            background: 'rgba(18, 8, 12, 0.95)',
            border: '1px solid rgba(122, 30, 58, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
          }}
        >
          <div 
            className="px-3 py-2"
            style={{
              background: isVulnerable ? 'rgba(122, 30, 58, 0.1)' : 'rgba(127, 183, 214, 0.08)',
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
                className="text-xs mt-0.5"
                style={{ fontFamily: "monospace", color: 'rgba(127, 183, 214, 0.6)' }}
              >
                {node.file_name}{node.line_no ? `:${node.line_no}` : ''}
              </div>
            )}
            {isVulnerable && (
              <div className="flex items-center gap-2 mt-1.5">
                <span 
                  className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase"
                  style={{ background: 'rgba(224, 62, 132, 0.2)', color: '#E03E84' }}
                >
                  {node.severity}
                </span>
                <span className="text-[10px]" style={{ color: 'rgba(255, 248, 240, 0.4)' }}>
                  Risk {node.risk_weight ?? 5}/10
                </span>
              </div>
            )}
          </div>
          
          {isVulnerable ? (
            <div className="p-3 space-y-2">
              {node.file_content && (
                <div>
                  <div className="text-[10px] font-semibold uppercase" style={{ color: 'rgba(224, 62, 132, 0.7)' }}>
                    Problem
                  </div>
                  <pre 
                    className="text-[11px] mt-1 p-2 rounded overflow-hidden max-h-14"
                    style={{ 
                      fontFamily: "monospace",
                      color: 'rgba(224, 62, 132, 0.8)',
                      background: 'rgba(122, 30, 58, 0.1)',
                    }}
                  >
                    {node.file_content.length > 100 ? node.file_content.substring(0, 100) + '...' : node.file_content}
                  </pre>
                </div>
              )}
              
              <div>
                <div className="text-[10px] font-semibold uppercase" style={{ color: 'rgba(127, 183, 214, 0.7)' }}>
                  Solution
                </div>
                <pre 
                  className="text-[11px] mt-1 p-2 rounded overflow-hidden max-h-14"
                  style={{ 
                    fontFamily: "monospace",
                    color: 'rgba(127, 183, 214, 0.8)',
                    background: 'rgba(127, 183, 214, 0.06)',
                  }}
                >
                  {(node.fix_code || node.occam_fix).length > 100 
                    ? (node.fix_code || node.occam_fix).substring(0, 100) + '...' 
                    : (node.fix_code || node.occam_fix)}
                </pre>
              </div>
              
              <div className="text-[10px] text-center pt-1" style={{ color: 'rgba(255, 248, 240, 0.3)' }}>
                Click for details
              </div>
            </div>
          ) : (
            <div className="p-3 text-center">
              <div className="text-sm" style={{ color: 'rgba(127, 183, 214, 0.8)' }}>Secured</div>
              <div className="text-[11px]" style={{ color: 'rgba(255, 248, 240, 0.3)' }}>No action needed</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

ThreatStar.displayName = 'ThreatStar';

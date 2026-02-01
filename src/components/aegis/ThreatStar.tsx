import { useState, useEffect, useMemo, useRef } from "react";
import { SecurityNode } from "@/types/securityNode";
import { generateNoiseDrift, seededRandom } from "@/utils/noiseGenerator";

interface ThreatStarProps {
  node: SecurityNode;
  x: number;
  y: number;
  onClick: () => void;
  isNew?: boolean;
}

export const ThreatStar = ({ node, x, y, onClick, isNew = false }: ThreatStarProps) => {
  const [ripple, setRipple] = useState(false);
  const [hover, setHover] = useState(false);
  const [noiseOffset, setNoiseOffset] = useState({ x: 0, y: 0 });
  const [entryState, setEntryState] = useState<'entering' | 'entered'>('entered');
  const [glowBloom, setGlowBloom] = useState(0);
  const startTimeRef = useRef<number>(0);

  const isVulnerable = node.is_vulnerable;
  
  // Generate unique seed based on node id for consistent per-node randomness
  const seed = useMemo(() => 
    node.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0),
    [node.id]
  );

  // Entry animation duration (randomized per node)
  const entryDuration = useMemo(() => 
    400 + seededRandom(seed * 100) * 300, // 400-700ms
    [seed]
  );

  // Cinematic entry animation for new nodes
  useEffect(() => {
    if (isNew) {
      setEntryState('entering');
      setGlowBloom(1);
      
      // Fade in the glow bloom
      const bloomTimer = setTimeout(() => {
        setGlowBloom(0);
      }, entryDuration * 0.6);
      
      // Complete entry
      const entryTimer = setTimeout(() => {
        setEntryState('entered');
      }, entryDuration);
      
      return () => {
        clearTimeout(bloomTimer);
        clearTimeout(entryTimer);
      };
    }
  }, [isNew, entryDuration]);

  // Organic Perlin-based micro-drift animation
  useEffect(() => {
    let animationFrame: number;
    startTimeRef.current = Date.now() + seed * 100; // Offset start time per node
    
    const animate = () => {
      const elapsed = Date.now() - startTimeRef.current;
      // Max drift varies per node (1-4px)
      const maxDrift = 1 + seededRandom(seed * 50) * 3;
      const offset = generateNoiseDrift(seed, elapsed, maxDrift);
      setNoiseOffset(offset);
      animationFrame = requestAnimationFrame(animate);
    };
    
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [seed]);

  // Secure ripple effect
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
  
  // Per-node glow variance based on risk
  const glowVariance = useMemo(() => {
    const weight = node.risk_weight ?? 5;
    const baseBlur = isVulnerable ? 22 + (weight / 10) * 8 : 18;
    const baseOpacity = isVulnerable ? 0.45 + (weight / 10) * 0.2 : 0.3;
    
    return {
      blur: baseBlur + seededRandom(seed * 10) * 6,
      opacity: baseOpacity + seededRandom(seed * 11) * 0.1,
    };
  }, [seed, isVulnerable, node.risk_weight]);

  // Entry animation styles
  const entryStyles = useMemo(() => {
    if (entryState === 'entering') {
      return {
        opacity: 0,
        transform: 'scale(0.85)',
      };
    }
    return {
      opacity: 1,
      transform: 'scale(1)',
    };
  }, [entryState]);

  return (
    <div
      className="absolute cursor-pointer"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: "translate(-50%, -50%)",
        zIndex: hover ? 20 : 10,
        ...entryStyles,
        transition: `opacity ${entryDuration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94), transform ${entryDuration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
      }}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* Organic drift wrapper - Perlin-like motion applied via noiseOffset */}
      <div
        style={{
          transform: `translate(${noiseOffset.x}px, ${noiseOffset.y}px) scale(${hover ? 1.3 : 1})`,
          transition: "transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        }}
      >
        {/* Entry bloom effect - peaks briefly then settles */}
        {glowBloom > 0 && (
          <div 
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{ 
              width: "80px", 
              height: "80px", 
              margin: "-36px",
              background: `radial-gradient(circle, ${getRiskColor()} 0%, transparent 70%)`,
              opacity: glowBloom * 0.6,
              filter: 'blur(15px)',
              transition: `opacity ${entryDuration * 0.5}ms ease-out`,
            }}
          />
        )}

        {/* Secure ripple effect */}
        {ripple && !isVulnerable && (
          <div 
            className="absolute inset-0 rounded-full animate-ping pointer-events-none" 
            style={{ 
              width: "45px", 
              height: "45px", 
              margin: "-18px",
              backgroundColor: getRiskColor(),
              opacity: 0.4,
            }}
          />
        )}

        {/* Vulnerability pulse effect - subtle, not flashy */}
        {isVulnerable && entryState === 'entered' && (
          <div 
            className="absolute inset-0 rounded-full animate-pulse pointer-events-none" 
            style={{ 
              width: "40px", 
              height: "40px", 
              margin: "-16px",
              backgroundColor: getRiskColor(),
              opacity: 0.25,
              filter: 'blur(10px)',
            }} 
          />
        )}
        
        {/* Soft glow aura with per-node variance */}
        <div
          className="absolute inset-0 rounded-full transition-all duration-700 pointer-events-none"
          style={{
            width: hover ? "55px" : "45px",
            height: hover ? "55px" : "45px",
            margin: hover ? "-22px" : "-18px",
            backgroundColor: getRiskColor(),
            opacity: glowVariance.opacity,
            filter: `blur(${glowVariance.blur}px)`,
          }}
        />
        
        {/* Core star with soft inner glow */}
        <div
          className="relative rounded-full transition-all duration-500"
          style={{
            width: isVulnerable ? "14px" : "10px",
            height: isVulnerable ? "14px" : "10px",
            backgroundColor: getRiskColor(),
            boxShadow: `
              0 0 ${isVulnerable ? 25 : 15}px ${getRiskColor()},
              inset 0 0 ${isVulnerable ? 6 : 4}px rgba(255,255,255,0.4)
            `,
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

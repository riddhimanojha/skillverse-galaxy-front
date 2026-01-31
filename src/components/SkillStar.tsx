import { useState, useEffect } from "react";
import { Vulnerability } from "@/types/vulnerability";

interface Skill {
  id: string;
  name: string;
  completed: boolean;
  unlocked: boolean;
  x: number;
  y: number;
}

interface SkillStarProps {
  skill: Skill;
  onClick: () => void;
  vulnerability?: Vulnerability | null;
}

export const SkillStar = ({ skill, onClick, vulnerability }: SkillStarProps) => {
  const [ripple, setRipple] = useState(false);
  const [hover, setHover] = useState(false);

  const isVulnerable = vulnerability && vulnerability.status === 'vulnerable';

  useEffect(() => {
    if (skill.completed && !isVulnerable) {
      setRipple(true);
      const timer = setTimeout(() => setRipple(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [skill.completed, isVulnerable]);

  const getGlowClass = () => {
    if (isVulnerable) return "skill-glow-vulnerable";
    if (skill.completed) return "skill-glow-completed";
    if (skill.unlocked) return "skill-glow-unlocked";
    return "skill-glow-locked";
  };

  const getStarColor = () => {
    if (isVulnerable) return "hsl(var(--threat-red))";
    if (skill.completed) return "hsl(var(--glow-completed))";
    if (skill.unlocked) return "hsl(var(--glow-unlocked))";
    return "hsl(var(--glow-locked))";
  };

  return (
    <div
      className={`absolute duration-300 ease-out ${
        skill.unlocked || isVulnerable ? "cursor-pointer" : "opacity-40 cursor-not-allowed"
      }`}
      style={{
        left: `${skill.x}%`,
        top: `${skill.y}%`,
        transform: hover && (skill.unlocked || isVulnerable)
          ? "translate(-50%, -50%) scale(1.5)" 
          : "translate(-50%, -50%) scale(1)",
        filter: hover && (skill.unlocked || isVulnerable)
          ? isVulnerable 
            ? "drop-shadow(0 0 20px rgba(255, 50, 50, 1))" 
            : "drop-shadow(0 0 12px rgba(180, 90, 255, 0.9))" 
          : "none",
        transition: "all 0.25s ease-out",
      }}
      onClick={() => (skill.unlocked || isVulnerable) && onClick()}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* Completion ripple effect */}
      {ripple && !isVulnerable && (
        <div className="absolute inset-0 rounded-full animate-ping opacity-60" 
          style={{ 
            width: "40px", 
            height: "40px", 
            margin: "-15px",
            backgroundColor: "hsl(var(--glow-completed))" 
          }} 
        />
      )}

      {/* Vulnerability pulse effect */}
      {isVulnerable && (
        <>
          <div 
            className="absolute inset-0 rounded-full animate-ping opacity-40" 
            style={{ 
              width: "60px", 
              height: "60px", 
              margin: "-25px",
              backgroundColor: "hsl(var(--threat-red))" 
            }} 
          />
          <div 
            className="absolute inset-0 rounded-full black-hole-glow" 
            style={{ 
              width: "50px", 
              height: "50px", 
              margin: "-20px",
              backgroundColor: "transparent",
              border: "2px solid hsl(var(--threat-red))"
            }} 
          />
        </>
      )}
      
      {/* Pulsing glow aura */}
      <div
        className={`absolute inset-0 rounded-full blur-2xl transition-all duration-700 ${
          skill.completed || skill.unlocked || isVulnerable ? "animate-pulse" : ""
        }`}
        style={{
          width: hover ? "50px" : "40px",
          height: hover ? "50px" : "40px",
          margin: hover ? "-20px" : "-15px",
          backgroundColor: getStarColor(),
          opacity: isVulnerable ? 1 : skill.completed ? 0.9 : skill.unlocked ? 0.7 : 0.3,
        }}
      />
      
      {/* Core star */}
      <div
        className={`relative rounded-full transition-all duration-500 ${getGlowClass()}`}
        style={{
          width: isVulnerable ? "14px" : hover ? "10px" : "8px",
          height: isVulnerable ? "14px" : hover ? "10px" : "8px",
          backgroundColor: getStarColor(),
          boxShadow: isVulnerable
            ? "0 0 40px hsl(var(--threat-red)), inset 0 0 15px rgba(0,0,0,0.8)"
            : skill.completed
            ? "0 0 25px hsl(var(--glow-completed)), inset 0 0 12px rgba(255,255,255,0.6)"
            : skill.unlocked
            ? "0 0 20px hsl(var(--glow-unlocked)), inset 0 0 8px rgba(255,255,255,0.4)"
            : "0 0 8px hsl(var(--glow-locked))",
        }}
      />

      {/* Hover tooltip */}
      {(skill.unlocked || isVulnerable) && hover && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 px-4 py-2 glass-panel rounded-xl text-sm whitespace-nowrap animate-fade-in z-50">
          <div className={`font-bold ${isVulnerable ? 'text-red-400' : 'text-foreground cosmic-glow'}`}>
            {isVulnerable ? '🚨 ' : ''}{skill.name}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {isVulnerable 
              ? `Threat: ${vulnerability?.category}` 
              : skill.completed 
              ? "✨ Mastered" 
              : "Click to explore"
            }
          </div>
        </div>
      )}
    </div>
  );
};

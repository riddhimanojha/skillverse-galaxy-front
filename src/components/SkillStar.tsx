import { useState, useEffect } from "react";

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
}

export const SkillStar = ({ skill, onClick }: SkillStarProps) => {
  const [ripple, setRipple] = useState(false);

  useEffect(() => {
    if (skill.completed) {
      setRipple(true);
      const timer = setTimeout(() => setRipple(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [skill.completed]);

  const getGlowClass = () => {
    if (skill.completed) return "skill-glow-completed";
    if (skill.unlocked) return "skill-glow-unlocked";
    return "skill-glow-locked";
  };

  const getPulseAnimation = () => {
    if (skill.completed) return "animate-pulse";
    if (skill.unlocked) return "animate-pulse";
    return "";
  };

  return (
    <div
      className={`absolute cursor-pointer group transition-all duration-300 ${
        skill.unlocked ? "hover:scale-150" : "opacity-50 cursor-not-allowed"
      }`}
      style={{
        left: `${skill.x}%`,
        top: `${skill.y}%`,
        transform: "translate(-50%, -50%)",
      }}
      onClick={() => skill.unlocked && onClick()}
    >
      {/* Ripple effect for completed */}
      {ripple && (
        <div className="absolute inset-0 rounded-full animate-ping bg-primary opacity-75" style={{ width: "30px", height: "30px", margin: "-10px" }} />
      )}
      
      {/* Glow aura */}
      <div
        className={`absolute inset-0 rounded-full blur-xl transition-all duration-700 ${getPulseAnimation()}`}
        style={{
          width: "40px",
          height: "40px",
          margin: "-15px",
          backgroundColor: skill.completed
            ? "hsl(var(--glow-completed))"
            : skill.unlocked
            ? "hsl(var(--glow-unlocked))"
            : "hsl(var(--glow-locked))",
          opacity: skill.completed ? 0.8 : skill.unlocked ? 0.6 : 0.3,
        }}
      />
      
      {/* Star/Planet shape */}
      <div
        className={`relative w-6 h-6 rounded-full transition-all duration-300 ${getGlowClass()} ${getPulseAnimation()}`}
        style={{
          backgroundColor: skill.completed
            ? "hsl(var(--glow-completed))"
            : skill.unlocked
            ? "hsl(var(--glow-unlocked))"
            : "hsl(var(--glow-locked))",
          boxShadow: skill.completed
            ? "0 0 20px hsl(var(--glow-completed)), inset 0 0 10px rgba(255,255,255,0.5)"
            : skill.unlocked
            ? "0 0 15px hsl(var(--glow-unlocked))"
            : "0 0 5px hsl(var(--glow-locked))",
        }}
      />

      {/* Tooltip on hover */}
      {skill.unlocked && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-2 glass-panel rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
          <div className="font-semibold text-foreground">{skill.name}</div>
          <div className="text-xs text-muted-foreground">
            {skill.completed ? "✓ Completed" : "Click to view"}
          </div>
        </div>
      )}
    </div>
  );
};

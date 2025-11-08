import { useState, useEffect } from "react";

interface Skill {
  id: string;
  name: string;
  learned: boolean;
  x: number;
  y: number;
}

interface SkillStarProps {
  skill: Skill;
  onClick: () => void;
  isHighlighted?: boolean;
}

export const SkillStar = ({ skill, onClick, isHighlighted }: SkillStarProps) => {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (skill.learned) {
      setPulse(true);
      const timer = setTimeout(() => setPulse(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [skill.learned]);

  return (
    <div
      className="absolute cursor-pointer group transition-transform duration-200 hover:scale-125"
      style={{
        left: `${skill.x}%`,
        top: `${skill.y}%`,
        transform: "translate(-50%, -50%)",
      }}
      onClick={onClick}
    >
      {/* Glow effect */}
      <div
        className={`absolute inset-0 rounded-full blur-md transition-all duration-500 ${
          skill.learned
            ? "bg-primary opacity-60"
            : "bg-secondary opacity-30"
        } ${pulse ? "animate-ping" : ""} ${
          isHighlighted ? "scale-150 opacity-80" : ""
        }`}
        style={{
          width: "20px",
          height: "20px",
          margin: "-5px",
        }}
      />
      
      {/* Star shape */}
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        className={`relative transition-all duration-300 ${
          skill.learned ? "fill-primary" : "fill-secondary"
        } ${isHighlighted ? "scale-125" : ""}`}
      >
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
      </svg>

      {/* Tooltip on hover */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-card border border-border rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        {skill.name}
      </div>
    </div>
  );
};

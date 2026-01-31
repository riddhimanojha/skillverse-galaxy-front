import { useMemo } from "react";
import { Skill } from "@/utils/skillGraph";
import { Vulnerability } from "@/types/vulnerability";

interface ConstellationLinesProps {
  skills: Skill[];
  vulnerabilities?: Vulnerability[];
}

export const ConstellationLines = ({ skills, vulnerabilities = [] }: ConstellationLinesProps) => {
  // Create a map of skill id to vulnerability status
  const vulnerableSkillIds = useMemo(() => {
    const ids = new Set<string>();
    vulnerabilities.forEach(v => {
      if (v.status === 'vulnerable') {
        // Map file paths to skill ids (simple mapping based on category/name)
        const category = v.category.toLowerCase();
        skills.forEach(skill => {
          if (skill.name.toLowerCase().includes(category) || 
              category.includes(skill.name.toLowerCase()) ||
              v.file_path.toLowerCase().includes(skill.id)) {
            ids.add(skill.id);
          }
        });
      }
    });
    return ids;
  }, [skills, vulnerabilities]);

  // Check if a category has any vulnerabilities
  const categoryHasVulnerability = useMemo(() => {
    const categoryMap = new Map<string, boolean>();
    vulnerabilities.forEach(v => {
      if (v.status === 'vulnerable') {
        categoryMap.set(v.category.toLowerCase(), true);
      }
    });
    return categoryMap;
  }, [vulnerabilities]);

  const lines = useMemo(() => {
    const result: Array<{ 
      x1: number; 
      y1: number; 
      x2: number; 
      y2: number; 
      active: boolean;
      threatened: boolean;
    }> = [];
    
    skills.forEach((skill) => {
      if (skill.unlocks && skill.unlocks.length > 0) {
        skill.unlocks.forEach((unlockId) => {
          const targetSkill = skills.find((s) => s.id === unlockId.toLowerCase());
          if (targetSkill) {
            // Check if either skill in the connection is vulnerable
            const isSourceVulnerable = vulnerableSkillIds.has(skill.id);
            const isTargetVulnerable = vulnerableSkillIds.has(targetSkill.id);
            
            result.push({
              x1: skill.x,
              y1: skill.y,
              x2: targetSkill.x,
              y2: targetSkill.y,
              active: skill.completed && targetSkill.unlocked,
              threatened: isSourceVulnerable || isTargetVulnerable,
            });
          }
        });
      }
    });
    
    return result;
  }, [skills, vulnerableSkillIds]);
  
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
      <defs>
        <linearGradient id="lineGradientActive" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.6" />
          <stop offset="100%" stopColor="hsl(var(--secondary))" stopOpacity="0.6" />
        </linearGradient>
        <linearGradient id="lineGradientInactive" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="hsl(var(--muted))" stopOpacity="0.2" />
          <stop offset="100%" stopColor="hsl(var(--muted))" stopOpacity="0.1" />
        </linearGradient>
        <linearGradient id="lineGradientThreat" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="hsl(var(--threat-red))" stopOpacity="0.9" />
          <stop offset="50%" stopColor="hsl(var(--threat-red))" stopOpacity="0.5" />
          <stop offset="100%" stopColor="hsl(var(--threat-red))" stopOpacity="0.9" />
        </linearGradient>
        <filter id="threatGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      
      {lines.map((line, index) => (
        <g key={index}>
          {/* Base line */}
          <line
            x1={`${line.x1}%`}
            y1={`${line.y1}%`}
            x2={`${line.x2}%`}
            y2={`${line.y2}%`}
            stroke={
              line.threatened 
                ? "url(#lineGradientThreat)" 
                : line.active 
                ? "url(#lineGradientActive)" 
                : "url(#lineGradientInactive)"
            }
            strokeWidth={line.threatened ? "3" : line.active ? "2" : "1"}
            strokeDasharray={line.active || line.threatened ? "none" : "5,5"}
            className={line.threatened ? "threat-line" : line.active ? "animate-pulse" : ""}
            style={{
              filter: line.threatened 
                ? "url(#threatGlow)" 
                : line.active 
                ? "drop-shadow(0 0 8px hsl(var(--primary) / 0.5))" 
                : "none",
            }}
          />
          {/* Threat contagion glow overlay */}
          {line.threatened && (
            <line
              x1={`${line.x1}%`}
              y1={`${line.y1}%`}
              x2={`${line.x2}%`}
              y2={`${line.y2}%`}
              stroke="hsl(var(--threat-red))"
              strokeWidth="6"
              strokeOpacity="0.3"
              style={{ filter: "blur(4px)" }}
            />
          )}
        </g>
      ))}
    </svg>
  );
};

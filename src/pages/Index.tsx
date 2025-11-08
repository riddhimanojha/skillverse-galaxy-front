import { useState, useEffect } from "react";
import { ThreeGalaxy } from "@/components/ThreeGalaxy";
import { SkillStar } from "@/components/SkillStar";
import { SkillPanel } from "@/components/SkillPanel";
import { CosmicLogo } from "@/components/CosmicLogo";
import { toast } from "sonner";
import { Skill, buildSkillsFromStorage, saveProgress } from "@/utils/skillGraph";

const Index = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });

  // Load skills from localStorage on mount
  useEffect(() => {
    const loadedSkills = buildSkillsFromStorage();
    setSkills(loadedSkills);
  }, []);

  // Mouse tracking for parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Handle skill completion
  const handleComplete = (skillId: string) => {
    const completedIds = new Set(skills.filter((s) => s.completed).map((s) => s.id));
    completedIds.add(skillId);
    saveProgress(completedIds);
    
    const updatedSkills = buildSkillsFromStorage();
    setSkills(updatedSkills);
    
    const updatedSkill = updatedSkills.find((s) => s.id === skillId);
    if (updatedSkill) {
      setSelectedSkill(updatedSkill);
    }
    
    toast.success("Skill completed! 🎉", {
      description: "New skills may have been unlocked!",
    });
  };

  // Handle skill skip
  const handleSkip = (skillId: string) => {
    handleComplete(skillId);
    toast.info("Skill marked as known", {
      description: "Moving on to the next challenge!",
    });
  };

  // Keyboard accessibility
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedSkill) {
        setSelectedSkill(null);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [selectedSkill]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Three.js Galaxy Background */}
      <ThreeGalaxy mousePosition={mousePosition} />

      {/* Cosmic Logo */}
      <CosmicLogo />

      {/* Stats Panel */}
      <div className="fixed bottom-8 left-8 z-50 glass-panel rounded-2xl p-6 min-w-[200px]">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Completed</span>
            <span className="font-bold text-2xl text-primary cosmic-glow">
              {skills.filter((s) => s.completed).length}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Unlocked</span>
            <span className="font-bold text-xl text-secondary">
              {skills.filter((s) => s.unlocked).length}
            </span>
          </div>
          <div className="h-px bg-border/50" />
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total</span>
            <span className="font-bold text-foreground">{skills.length}</span>
          </div>
        </div>
      </div>

      {/* Skill Stars/Nodes */}
      <div className="relative w-full h-screen">
        {skills.map((skill) => (
          <SkillStar
            key={skill.id}
            skill={skill}
            onClick={() => setSelectedSkill(skill)}
          />
        ))}
      </div>

      {/* Course Detail Panel */}
      <SkillPanel
        skill={selectedSkill}
        onClose={() => setSelectedSkill(null)}
        onComplete={handleComplete}
        onSkip={handleSkip}
      />
    </div>
  );
};

export default Index;

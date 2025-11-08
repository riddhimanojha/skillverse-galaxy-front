import { useState, useEffect } from "react";
import { ThreeGalaxyCanvas } from "@/components/galaxy/ThreeGalaxyCanvas";
import { SkillStar } from "@/components/SkillStar";
import { SkillPanel } from "@/components/SkillPanel";
import { CosmicLogo } from "@/components/CosmicLogo";
import { Navigation } from "@/components/Navigation";
import { ConstellationLines } from "@/components/ConstellationLines";
import { ShootingStars } from "@/components/ShootingStars";
import { toast } from "sonner";
import { Skill, buildSkillsFromStorage, saveProgress } from "@/utils/skillGraph";
import { completeSkill, getProgress } from "@/utils/progressSystem";

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
    
    // Update progress system (XP, streak, etc.)
    const newProgress = completeSkill(skillId);
    
    const updatedSkills = buildSkillsFromStorage();
    setSkills(updatedSkills);
    
    const updatedSkill = updatedSkills.find((s) => s.id === skillId);
    if (updatedSkill) {
      setSelectedSkill(updatedSkill);
    }
    
    toast.success(`Skill completed! +100 XP 🎉`, {
      description: `Level ${newProgress.level} • ${newProgress.streak} day streak 🔥`,
    });
  };

  // Handle skill skip
  const handleSkip = (skillId: string) => {
    handleComplete(skillId);
    toast.info("Skill marked as known", {
      description: "Moving on to the next challenge!",
    });
  };

  // Handle skill unmaster
  const handleUnmaster = (skillId: string) => {
    const completedIds = new Set(skills.filter((s) => s.completed).map((s) => s.id));
    completedIds.delete(skillId);
    saveProgress(completedIds);
    
    const updatedSkills = buildSkillsFromStorage();
    setSkills(updatedSkills);
    setSelectedSkill(null);
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
      {/* React Three Fiber Galaxy Background */}
      <ThreeGalaxyCanvas mousePosition={mousePosition} />
      
      {/* Shooting Stars Effect */}
      <ShootingStars />

      {/* Cosmic Logo */}
      <CosmicLogo />
      
      {/* Navigation */}
      <Navigation />

      {/* Stats Panel - Glassmorphism */}
      <div className="fixed bottom-8 left-8 z-50 glass-panel rounded-2xl p-6 min-w-[220px] animate-fade-in border border-primary/20">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground uppercase tracking-wider">Mastered</span>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
              <span className="font-bold text-3xl text-primary cosmic-glow">
                {skills.filter((s) => s.completed).length}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground uppercase tracking-wider">Unlocked</span>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-secondary" />
              <span className="font-bold text-2xl text-secondary">
                {skills.filter((s) => s.unlocked).length}
              </span>
            </div>
          </div>
          <div className="h-px bg-gradient-to-r from-primary via-accent to-transparent opacity-30" />
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground uppercase tracking-wider">Total Skills</span>
            <span className="font-bold text-xl text-foreground">{skills.length}</span>
          </div>
        </div>
      </div>

      {/* Skill Stars/Nodes with Constellation Lines */}
      <div className="relative w-full h-screen">
        <ConstellationLines skills={skills} />
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
        onUnmaster={handleUnmaster}
      />
    </div>
  );
};

export default Index;

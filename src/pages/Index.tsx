import { useState, useEffect } from "react";
import { ThreeGalaxyCanvas } from "@/components/galaxy/ThreeGalaxyCanvas";
import { SkillStar } from "@/components/SkillStar";
import { SkillPanel } from "@/components/SkillPanel";
import { CosmicLogo } from "@/components/CosmicLogo";
import { Navigation } from "@/components/Navigation";
import { ConstellationLines } from "@/components/ConstellationLines";
import { ShootingStars } from "@/components/ShootingStars";
import { SearchLearningPath } from "@/components/SearchLearningPath";
import { toast } from "sonner";
import { Skill, buildSkillsFromStorage, initialSkills } from "@/utils/skillGraph";
import { completeSkill, unmasterSkill } from "@/utils/progressSystem";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";

const Index = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const [showWelcome, setShowWelcome] = useState(true);
  const [filteredSkillIds, setFilteredSkillIds] = useState<string[] | null>(null);

  // Load skills from localStorage on mount and check welcome screen
  useEffect(() => {
    const loadedSkills = buildSkillsFromStorage();
    setSkills(loadedSkills);
    
    // Check if user has seen welcome screen before
    const checkWelcomeScreen = () => {
      const hasSeenWelcome = localStorage.getItem('skillverse_seen_welcome');
      if (!hasSeenWelcome) {
        setShowWelcome(true);
      }
    };
    
    checkWelcomeScreen();

    // Listen for skills updates from other components
    const handleSkillsUpdate = () => {
      setSkills(buildSkillsFromStorage());
      checkWelcomeScreen(); // Also recheck welcome screen
    };

    window.addEventListener('skillsUpdated', handleSkillsUpdate);
    return () => window.removeEventListener('skillsUpdated', handleSkillsUpdate);
  }, []);

  const handleSearchSubmit = (skillIds: string[]) => {
    setFilteredSkillIds(skillIds);
    setShowWelcome(false);
    localStorage.setItem('skillverse_seen_welcome', 'true');
  };

  const handleSkipWelcome = () => {
    setShowWelcome(false);
    setFilteredSkillIds(null);
    localStorage.setItem('skillverse_seen_welcome', 'true');
  };

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
    // Update progress system (XP, streak, etc.) - this also marks skill as completed
    const newProgress = completeSkill(skillId);
    
    // Reload all skills with updated completion status
    const updatedSkills = buildSkillsFromStorage();
    setSkills(updatedSkills);
    
    // Close the panel and return to galaxy view
    setSelectedSkill(null);
    
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
    unmasterSkill(skillId);
    
    const updatedSkills = buildSkillsFromStorage();
    setSkills(updatedSkills);
    setSelectedSkill(null);
  };

  // Complete all skills at once (developer feature)
  const handleCompleteAll = () => {
    let completedCount = 0;
    
    // Complete ALL skills, including locked ones
    initialSkills.forEach((skill) => {
      completeSkill(skill.id);
      completedCount++;
    });
    
    const updatedSkills = buildSkillsFromStorage();
    setSkills(updatedSkills);
    
    // Dispatch custom event to update other components
    window.dispatchEvent(new CustomEvent('skillsUpdated'));
    
    // Show congratulations and reset to welcome screen
    toast.success(`🎉 Congratulations! All ${completedCount} skills completed!`, {
      description: "You've mastered everything. Ready for a new learning path?",
      duration: 5000,
    });
    
    // After a delay, show welcome screen again
    setTimeout(() => {
      setShowWelcome(true);
      setFilteredSkillIds(null);
      localStorage.removeItem('skillverse_seen_welcome');
    }, 3000);
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

  const displayedSkills = filteredSkillIds 
    ? skills.filter(s => filteredSkillIds.includes(s.id))
    : skills;

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* React Three Fiber Galaxy Background */}
      <ThreeGalaxyCanvas mousePosition={mousePosition} />
      
      {/* Shooting Stars Effect */}
      <ShootingStars />

      {/* Welcome Screen */}
      {showWelcome && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-xl animate-fade-in">
          <div className="max-w-3xl w-full px-8 space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-6xl font-bold cosmic-glow">
                Welcome to Skillverse
              </h1>
              <p className="text-2xl text-muted-foreground">
                Your journey through the cosmos of knowledge begins here
              </p>
            </div>
            
            <div className="space-y-4">
              <SearchLearningPath onSubmit={handleSearchSubmit} />
              <div className="text-center">
                <button
                  onClick={handleSkipWelcome}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors underline"
                >
                  Skip and explore all skills
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
          
          {/* Developer Complete All Button */}
          <div className="h-px bg-gradient-to-r from-primary via-accent to-transparent opacity-30" />
          <Button
            onClick={handleCompleteAll}
            className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-bold py-2 text-sm shadow-lg shadow-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/50"
            size="sm"
          >
            <Zap className="w-4 h-4 mr-2" />
            Complete All
          </Button>
        </div>
      </div>

      {/* Skill Stars/Nodes with Constellation Lines */}
      <div className="relative w-full h-screen">
        <ConstellationLines skills={displayedSkills} />
        {displayedSkills.map((skill) => (
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

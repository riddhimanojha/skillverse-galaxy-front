import { useState, useEffect, useRef } from "react";
import { ThreeGalaxyCanvas } from "@/components/galaxy/ThreeGalaxyCanvas";
import { SkillStar } from "@/components/SkillStar";
import { SkillPanel } from "@/components/SkillPanel";
import { CosmicLogo } from "@/components/CosmicLogo";
import { Navigation } from "@/components/Navigation";
import { ConstellationLines } from "@/components/ConstellationLines";
import { ShootingStars } from "@/components/ShootingStars";
import { SearchLearningPath } from "@/components/SearchLearningPath";
import { AIChat, AIChatHandle } from "@/components/AIChat";
import { DashboardButton } from "@/components/DashboardButton";
import { DashboardPanel } from "@/components/DashboardPanel";
import { CompleteModal } from "@/components/CompleteModal";
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
  const [showDashboard, setShowDashboard] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const chatRef = useRef<AIChatHandle>(null);

  // Load skills from localStorage on mount
  useEffect(() => {
    const loadedSkills = buildSkillsFromStorage();
    setSkills(loadedSkills);
    
    // Check if user has seen welcome screen before
    const hasSeenWelcome = localStorage.getItem('skillverse_seen_welcome');
    if (hasSeenWelcome) {
      setShowWelcome(false);
    }

    // Listen for skills updates from other components
    const handleSkillsUpdate = () => {
      setSkills(buildSkillsFromStorage());
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

  // Complete all skills at once
  const handleCompleteAll = () => {
    let completedCount = 0;
    initialSkills.forEach((skill) => {
      const currentSkill = skills.find(s => s.id === skill.id);
      if (currentSkill && !currentSkill.completed) {
        completeSkill(skill.id);
        completedCount++;
      }
    });
    
    const updatedSkills = buildSkillsFromStorage();
    setSkills(updatedSkills);
    
    // Dispatch custom event to update other components
    window.dispatchEvent(new CustomEvent('skillsUpdated'));
    
    // Show completion modal
    setShowCompleteModal(true);
  };

  const handleModalBackToChat = () => {
    setShowCompleteModal(false);
    chatRef.current?.focus();
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
    <div className="relative min-h-screen overflow-hidden flex">
      {/* React Three Fiber Galaxy Background */}
      <ThreeGalaxyCanvas mousePosition={mousePosition} />
      
      {/* Shooting Stars Effect */}
      <ShootingStars />
      
      {/* Main Content Area - Constellation */}
      <div className="flex-1 relative constellation-container">

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

        {/* Complete All Button - Top Right */}
        {skills.some(s => !s.completed) && (
          <div className="absolute top-8 right-8 z-40">
            <Button
              onClick={handleCompleteAll}
              className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-bold px-6 py-3 text-sm shadow-2xl shadow-primary/50 transition-all duration-300 hover:shadow-xl hover:scale-105"
            >
              <Zap className="w-4 h-4 mr-2" />
              Complete All
            </Button>
          </div>
        )}

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

      {/* AI Chat - Right Side */}
      <div className="w-[400px] h-screen p-4 relative z-50">
        <AIChat ref={chatRef} />
      </div>

      {/* Dashboard Button - Bottom Right */}
      <DashboardButton onClick={() => setShowDashboard(true)} />

      {/* Dashboard Panel Overlay */}
      <DashboardPanel
        isOpen={showDashboard}
        onClose={() => setShowDashboard(false)}
        completed={skills.filter((s) => s.completed).length}
        unlocked={skills.filter((s) => s.unlocked).length}
        total={skills.length}
      />

      {/* Complete Modal */}
      <CompleteModal
        isOpen={showCompleteModal}
        onClose={() => setShowCompleteModal(false)}
        onBackToChat={handleModalBackToChat}
        skills={skills}
      />
    </div>
  );
};

export default Index;

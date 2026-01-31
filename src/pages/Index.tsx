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
import { OccamFixPanel } from "@/components/OccamFixPanel";
import { HacktronBadge } from "@/components/HacktronBadge";
import { useVulnerabilities } from "@/hooks/useVulnerabilities";
import { Vulnerability } from "@/types/vulnerability";
import { Shield, AlertTriangle } from "lucide-react";

const Index = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [selectedVulnerability, setSelectedVulnerability] = useState<Vulnerability | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const [showWelcome, setShowWelcome] = useState(true);
  const [filteredSkillIds, setFilteredSkillIds] = useState<string[] | null>(null);

  const { 
    vulnerabilities, 
    loading: vulnLoading, 
    patchVulnerability,
    getActiveVulnerabilities 
  } = useVulnerabilities();

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
    const newProgress = completeSkill(skillId);
    const updatedSkills = buildSkillsFromStorage();
    setSkills(updatedSkills);
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

  // Get vulnerability for a skill (simple file path matching)
  const getVulnerabilityForSkill = (skill: Skill): Vulnerability | null => {
    return vulnerabilities.find(v => 
      v.status === 'vulnerable' && (
        v.file_path.toLowerCase().includes(skill.id.toLowerCase()) ||
        v.category.toLowerCase().includes(skill.id.toLowerCase()) ||
        skill.name.toLowerCase().includes(v.category.toLowerCase())
      )
    ) || null;
  };

  // Handle star click - check for vulnerability first
  const handleStarClick = (skill: Skill) => {
    const vuln = getVulnerabilityForSkill(skill);
    if (vuln) {
      setSelectedVulnerability(vuln);
      setSelectedSkill(null);
    } else {
      setSelectedSkill(skill);
      setSelectedVulnerability(null);
    }
  };

  // Keyboard accessibility
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedSkill(null);
        setSelectedVulnerability(null);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  const displayedSkills = filteredSkillIds 
    ? skills.filter(s => filteredSkillIds.includes(s.id))
    : skills;

  const activeThreats = getActiveVulnerabilities();

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
                Real-Time Security Threat Map • Powered by Hacktron
              </p>
            </div>
            
            <div className="space-y-4">
              <SearchLearningPath onSubmit={handleSearchSubmit} />
              <div className="text-center">
                <button
                  onClick={handleSkipWelcome}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors underline"
                >
                  Skip and explore threat map
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

      {/* Left Side - Threat Dashboard */}
      <div className="fixed bottom-6 left-6 z-50 animate-fade-in">
        <div className="glass-panel rounded-2xl p-5 w-72 border border-primary/20">
          <div className="space-y-3">
            {/* Threat Counter */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-red-400" />
                Active Threats
              </span>
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${activeThreats.length > 0 ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`} />
                <span className={`font-bold text-2xl ${activeThreats.length > 0 ? 'text-red-400' : 'text-green-400'}`}>
                  {activeThreats.length}
                </span>
              </div>
            </div>
            
            {/* Secured Counter */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                <Shield className="w-3 h-3 text-green-400" />
                Secured
              </span>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                <span className="font-bold text-xl text-green-400">
                  {vulnerabilities.filter(v => v.status === 'fixed').length}
                </span>
              </div>
            </div>
            
            <div className="h-px bg-gradient-to-r from-primary via-accent to-transparent opacity-30" />
            
            {/* Mastered Skills */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Mastered</span>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                <span className="font-bold text-2xl text-primary cosmic-glow">
                  {skills.filter((s) => s.completed).length}
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Total Skills</span>
              <span className="font-bold text-lg text-foreground">{skills.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Occam Fix Panel */}
      {selectedVulnerability && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
          <OccamFixPanel
            vulnerability={selectedVulnerability}
            onPatch={patchVulnerability}
            onClose={() => setSelectedVulnerability(null)}
          />
        </div>
      )}

      {/* Hacktron Badge */}
      <HacktronBadge />

      {/* Skill Stars/Nodes with Constellation Lines */}
      <div className="relative w-full h-screen">
        <ConstellationLines skills={displayedSkills} vulnerabilities={vulnerabilities} />
        {displayedSkills.map((skill) => (
          <SkillStar
            key={skill.id}
            skill={skill}
            onClick={() => handleStarClick(skill)}
            vulnerability={getVulnerabilityForSkill(skill)}
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

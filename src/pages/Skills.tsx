import { useState, useEffect } from "react";
import { Skill, buildSkillsFromStorage } from "@/utils/skillGraph";
import { Navigation } from "@/components/Navigation";
import { CosmicLogo } from "@/components/CosmicLogo";
import { ShootingStars } from "@/components/ShootingStars";
import { AIChatPanel } from "@/components/AIChatPanel";
import { CheckCircle2, Lock, Unlock, Code, Server, Wrench, Layers } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Skills = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  
  useEffect(() => {
    setSkills(buildSkillsFromStorage());
  }, []);
  
  // Categorize skills
  const categories = {
    frontend: ["HTML", "CSS", "Sass", "Tailwind", "React", "Next.js"],
    backend: ["Node.js", "Express", "MongoDB", "Python", "Django", "FastAPI"],
    tools: ["JavaScript", "TypeScript", "Git", "Docker"],
  };
  
  const getSkillsByCategory = (category: keyof typeof categories) => {
    return skills.filter((skill) => categories[category].includes(skill.name));
  };
  
  const getStatusIcon = (skill: Skill) => {
    if (skill.completed) return <CheckCircle2 className="w-5 h-5 text-primary" />;
    if (skill.unlocked) return <Unlock className="w-5 h-5 text-secondary" />;
    return <Lock className="w-5 h-5 text-muted-foreground" />;
  };
  
  const getStatusBadge = (skill: Skill) => {
    if (skill.completed) {
      return <Badge className="bg-primary/20 text-primary border-primary/30 shadow-sm shadow-primary/50">Mastered</Badge>;
    }
    if (skill.unlocked) {
      return <Badge className="bg-secondary/20 text-secondary border-secondary/30 shadow-sm shadow-secondary/50">Available</Badge>;
    }
    return <Badge variant="outline" className="text-muted-foreground border-muted">Locked</Badge>;
  };
  
  const SkillCard = ({ skill, index }: { skill: Skill; index: number }) => (
    <Card
      className="planet-card"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <CardHeader>
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-3">
            {getStatusIcon(skill)}
            <CardTitle className="text-xl font-bold">{skill.name}</CardTitle>
          </div>
          {getStatusBadge(skill)}
        </div>
        <CardDescription className="text-foreground/80 leading-relaxed">
          {skill.description}
        </CardDescription>
      </CardHeader>
      
      {skill.unlocks && skill.unlocks.length > 0 && (
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm font-semibold text-secondary uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4" />
              Unlocks:
            </p>
            <div className="flex flex-wrap gap-2">
              {skill.unlocks.map((unlock) => (
                <Badge
                  key={unlock}
                  variant="outline"
                  className="text-xs border-secondary/30 text-secondary hover:bg-secondary/10 transition-colors"
                >
                  {unlock}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
  
  return (
    <div className="min-h-screen bg-background relative overflow-y-auto">
      <div className="fixed inset-0 bg-nebula-gradient -z-10" />
      <ShootingStars />
      
      <CosmicLogo />
      <Navigation />
      
      <div className="container mx-auto px-4 pt-32 pb-16 max-w-7xl">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-6xl font-bold mb-4">
            <span className="gradient-text">Skill Constellation</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore the vast universe of technologies. Each skill is a star in your learning constellation.
          </p>
        </div>
        
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4 mb-8 glass-panel h-14">
            <TabsTrigger value="all" className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary data-[state=active]:to-accent">
              <Layers className="w-4 h-4 mr-2" />
              All Skills
            </TabsTrigger>
            <TabsTrigger value="frontend" className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary data-[state=active]:to-accent">
              <Code className="w-4 h-4 mr-2" />
              Frontend
            </TabsTrigger>
            <TabsTrigger value="backend" className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary data-[state=active]:to-accent">
              <Server className="w-4 h-4 mr-2" />
              Backend
            </TabsTrigger>
            <TabsTrigger value="tools" className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary data-[state=active]:to-accent">
              <Wrench className="w-4 h-4 mr-2" />
              Tools
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {skills.map((skill, index) => (
                <SkillCard key={skill.id} skill={skill} index={index} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="frontend" className="animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getSkillsByCategory("frontend").map((skill, index) => (
                <SkillCard key={skill.id} skill={skill} index={index} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="backend" className="animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getSkillsByCategory("backend").map((skill, index) => (
                <SkillCard key={skill.id} skill={skill} index={index} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tools" className="animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getSkillsByCategory("tools").map((skill, index) => (
                <SkillCard key={skill.id} skill={skill} index={index} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <AIChatPanel />
    </div>
  );
};

export default Skills;

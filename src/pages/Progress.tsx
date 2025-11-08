import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { CosmicLogo } from "@/components/CosmicLogo";
import { ShootingStars } from "@/components/ShootingStars";
import { AIChatPanel } from "@/components/AIChatPanel";
import { getProgress, getAchievementInfo, getXPForNextLevel } from "@/utils/progressSystem";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress as ProgressBar } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Flame, Trophy, Zap, TrendingUp, Star } from "lucide-react";

const Progress = () => {
  const [progress, setProgress] = useState(getProgress());
  
  useEffect(() => {
    setProgress(getProgress());
  }, []);
  
  const xpForNextLevel = getXPForNextLevel(progress.xp);
  const currentLevelXP = progress.xp % 500;
  const progressPercent = (currentLevelXP / 500) * 100;
  
  return (
    <div className="min-h-screen bg-background relative overflow-y-auto">
      <div className="fixed inset-0 bg-nebula-gradient -z-10" />
      <ShootingStars />
      
      <CosmicLogo />
      <Navigation />
      
      <div className="container mx-auto px-4 pt-32 pb-16 max-w-6xl">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-6xl font-bold mb-4">
            <span className="gradient-text">Progress Dashboard</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Your journey through the Skillverse is tracked here. Every skill mastered brings you closer to becoming a master developer.
          </p>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-fade-in">
          <Card className="planet-card group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 text-primary">
                <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Zap className="w-5 h-5" />
                </div>
                <CardTitle className="text-sm font-medium uppercase tracking-wider">
                  Level
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-5xl font-bold cosmic-glow mb-2">{progress.level}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Star className="w-3 h-3" />
                {xpForNextLevel} XP to next
              </p>
            </CardContent>
          </Card>
          
          <Card className="planet-card group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 text-secondary">
                <div className="p-2 rounded-lg bg-secondary/10 group-hover:bg-secondary/20 transition-colors">
                  <Flame className="w-5 h-5" />
                </div>
                <CardTitle className="text-sm font-medium uppercase tracking-wider">
                  Streak
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-5xl font-bold cosmic-glow-secondary mb-2">{progress.streak}</div>
              <p className="text-xs text-muted-foreground">Days in a row 🔥</p>
            </CardContent>
          </Card>
          
          <Card className="planet-card group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 text-accent">
                <div className="p-2 rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <CardTitle className="text-sm font-medium uppercase tracking-wider">
                  Total XP
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-5xl font-bold text-accent mb-2">{progress.xp}</div>
              <p className="text-xs text-muted-foreground">Experience earned</p>
            </CardContent>
          </Card>
          
          <Card className="planet-card group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-foreground/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 text-foreground">
                <div className="p-2 rounded-lg bg-foreground/5 group-hover:bg-foreground/10 transition-colors">
                  <Trophy className="w-5 h-5" />
                </div>
                <CardTitle className="text-sm font-medium uppercase tracking-wider">
                  Skills
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-5xl font-bold mb-2">{progress.totalSkillsCompleted}</div>
              <p className="text-xs text-muted-foreground">Mastered ⭐</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Level Progress */}
        <Card className="glass-panel border-primary/20 mb-8 animate-fade-in relative overflow-hidden" style={{ animationDelay: "200ms" }}>
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5" />
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="p-2 rounded-lg bg-primary/10">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              Level {progress.level} Progress
            </CardTitle>
            <CardDescription className="text-base mt-2">
              {currentLevelXP} / 500 XP • {Math.round(progressPercent)}% Complete
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <ProgressBar value={progressPercent} className="h-4" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" 
                   style={{ width: `${progressPercent}%` }} />
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Current Level</span>
              <span className="text-primary font-semibold">Next: Level {progress.level + 1}</span>
            </div>
          </CardContent>
        </Card>
        
        {/* Achievements */}
        <Card className="glass-panel border-accent/20 animate-fade-in relative overflow-hidden" style={{ animationDelay: "400ms" }}>
          <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent" />
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="p-2 rounded-lg bg-accent/10">
                <Trophy className="w-6 h-6 text-accent" />
              </div>
              Achievement Gallery
            </CardTitle>
            <CardDescription className="text-base mt-2">
              {progress.achievements.length > 0
                ? `${progress.achievements.length} milestone${progress.achievements.length > 1 ? 's' : ''} unlocked in your journey`
                : "Begin your journey to unlock achievements"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {progress.achievements.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {progress.achievements.map((achievementId, index) => {
                  const achievement = getAchievementInfo(achievementId);
                  return (
                    <div
                      key={achievementId}
                      className="planet-card group p-5 animate-fade-in"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-start gap-4">
                        <div className="text-5xl group-hover:scale-110 transition-transform float-animation">
                          {achievement.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-lg text-foreground mb-1">
                            {achievement.name}
                          </h4>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {achievement.description}
                          </p>
                          <Badge className="mt-3 bg-accent/20 text-accent border-accent/30">
                            Earned
                          </Badge>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <div className="relative inline-block mb-4">
                  <Trophy className="w-16 h-16 mx-auto opacity-30" />
                  <div className="absolute inset-0 bg-accent/20 blur-xl" />
                </div>
                <p className="text-lg">Your achievement gallery awaits</p>
                <p className="text-sm mt-2">Complete skills to unlock your first achievement</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <AIChatPanel />
    </div>
  );
};

export default Progress;

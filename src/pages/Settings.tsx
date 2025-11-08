import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { CosmicLogo } from "@/components/CosmicLogo";
import { ShootingStars } from "@/components/ShootingStars";
import { AIChatPanel } from "@/components/AIChatPanel";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Palette, Sparkles, Trash2, Download, Volume2 } from "lucide-react";

const Settings = () => {
  const [galaxyDensity, setGalaxyDensity] = useState(50);
  const [showShootingStars, setShowShootingStars] = useState(true);
  const [enableAnimations, setEnableAnimations] = useState(true);
  const [soundEffects, setSoundEffects] = useState(false);
  
  const handleResetProgress = () => {
    if (confirm("Are you sure you want to reset all progress? This cannot be undone.")) {
      localStorage.removeItem("skillverse_completed");
      localStorage.removeItem("skillverse_progress");
      toast.success("Progress reset successfully");
      setTimeout(() => window.location.reload(), 1000);
    }
  };
  
  const handleExportData = () => {
    const data = {
      completed: localStorage.getItem("skillverse_completed"),
      progress: localStorage.getItem("skillverse_progress"),
      exportDate: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `skillverse-backup-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success("Data exported successfully");
  };
  
  return (
    <div className="min-h-screen bg-background relative overflow-y-auto">
      <div className="fixed inset-0 bg-nebula-gradient -z-10" />
      <ShootingStars />
      
      <CosmicLogo />
      <Navigation />
      
      <div className="container mx-auto px-4 pt-32 pb-16 max-w-4xl">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-6xl font-bold mb-4">
            <span className="gradient-text">Mission Control</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Fine-tune your journey through the cosmos. Customize every aspect of your Skillverse experience.
          </p>
        </div>
        
        {/* Visual Settings */}
        <Card className="planet-card mb-6 animate-fade-in border-primary/20">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Palette className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">Visual Experience</CardTitle>
                <CardDescription className="mt-1">
                  Craft your perfect cosmic atmosphere
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4 p-4 rounded-xl bg-gradient-to-br from-primary/5 to-transparent border border-primary/10">
              <div className="flex items-center justify-between">
                <Label htmlFor="galaxy-density" className="text-sm font-semibold">
                  Galaxy Density
                </Label>
                <span className="text-sm font-bold text-primary">{galaxyDensity}%</span>
              </div>
              <Slider
                id="galaxy-density"
                value={[galaxyDensity]}
                onValueChange={(value) => setGalaxyDensity(value[0])}
                max={100}
                step={1}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground leading-relaxed">
                Control the density of stars in your background galaxy. Higher values create a richer cosmic atmosphere.
              </p>
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-xl border border-border/30 hover:border-primary/30 transition-colors">
              <div className="space-y-1 flex-1">
                <Label htmlFor="shooting-stars" className="text-sm font-semibold cursor-pointer">
                  Shooting Stars
                </Label>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Animated meteor trails across the cosmos
                </p>
              </div>
              <Switch
                id="shooting-stars"
                checked={showShootingStars}
                onCheckedChange={setShowShootingStars}
              />
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-xl border border-border/30 hover:border-primary/30 transition-colors">
              <div className="space-y-1 flex-1">
                <Label htmlFor="animations" className="text-sm font-semibold cursor-pointer">
                  Smooth Animations
                </Label>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Enhanced transitions and visual effects
                </p>
              </div>
              <Switch
                id="animations"
                checked={enableAnimations}
                onCheckedChange={setEnableAnimations}
              />
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-xl border border-border/30 hover:border-secondary/30 transition-colors">
              <div className="space-y-1 flex-1">
                <Label htmlFor="sound-effects" className="text-sm font-semibold cursor-pointer flex items-center gap-2">
                  <Volume2 className="w-4 h-4" />
                  Sound Effects
                </Label>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Cosmic audio feedback for interactions
                </p>
              </div>
              <Switch
                id="sound-effects"
                checked={soundEffects}
                onCheckedChange={setSoundEffects}
              />
            </div>
          </CardContent>
        </Card>
        
        {/* Data Management */}
        <Card className="planet-card animate-fade-in border-secondary/20" style={{ animationDelay: "200ms" }}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-secondary/10">
                <Sparkles className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <CardTitle className="text-xl">Data Command Center</CardTitle>
                <CardDescription className="mt-1">
                  Manage your learning journey data
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={handleExportData}
              variant="outline"
              className="w-full justify-start h-14 border-secondary/30 text-secondary hover:bg-secondary/10 hover:border-secondary/50 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-secondary/10 group-hover:bg-secondary/20 transition-colors">
                  <Download className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="font-semibold">Export Progress</div>
                  <div className="text-xs text-muted-foreground">Download your data as JSON</div>
                </div>
              </div>
            </Button>
            
            <Button
              onClick={handleResetProgress}
              variant="outline"
              className="w-full justify-start h-14 border-destructive/30 text-destructive hover:bg-destructive/10 hover:border-destructive/50 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-destructive/10 group-hover:bg-destructive/20 transition-colors">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="font-semibold">Reset Progress</div>
                  <div className="text-xs text-muted-foreground">Clear all data and start fresh</div>
                </div>
              </div>
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <AIChatPanel />
    </div>
  );
};

export default Settings;

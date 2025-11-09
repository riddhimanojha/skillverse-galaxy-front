import { Link } from "react-router-dom";
import { LayoutDashboard } from "lucide-react";
import { Button } from "./ui/button";

export const CosmicLogo = () => {
  return (
    <div className="fixed top-8 left-8 z-50 animate-fade-in space-y-3">
      <div>
        <h1 className="text-4xl font-bold text-foreground tracking-wider">
          <span className="cosmic-glow">Skill</span>
          <span className="text-primary cosmic-glow">Verse</span>
        </h1>
        <div className="h-0.5 w-32 bg-gradient-to-r from-primary via-accent to-transparent mt-2 animate-pulse" />
      </div>
      
      <Link to="/dashboard">
        <Button 
          variant="outline" 
          size="sm"
          className="w-full border-primary/30 text-primary hover:bg-primary/10"
        >
          <LayoutDashboard className="w-4 h-4 mr-2" />
          Dashboard
        </Button>
      </Link>
    </div>
  );
};

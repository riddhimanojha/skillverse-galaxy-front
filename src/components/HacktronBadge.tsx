import { Shield, Lock } from "lucide-react";

export const HacktronBadge = () => {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 animate-fade-in">
      <div className="glass-panel rounded-full px-4 py-2 flex items-center gap-2 border border-primary/30 hover:border-primary/50 transition-all duration-300">
        <div className="relative">
          <Shield className="w-4 h-4 text-primary" />
          <Lock className="w-2 h-2 text-primary absolute -bottom-0.5 -right-0.5" />
        </div>
        <span className="text-xs font-medium text-muted-foreground">
          Secured by <span className="text-primary font-bold">Hacktron</span>
        </span>
      </div>
    </div>
  );
};

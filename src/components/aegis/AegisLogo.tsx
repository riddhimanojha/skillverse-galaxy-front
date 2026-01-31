import { Shield } from "lucide-react";

export const AegisLogo = () => {
  return (
    <div className="fixed top-6 left-6 z-50">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center backdrop-blur-sm border border-primary/30">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse border-2 border-background" />
        </div>
        <div>
          <h1 className="text-xl font-bold">
            <span className="text-primary">Orion</span>
          </h1>
          <p className="text-xs text-muted-foreground">Security Constellation</p>
        </div>
      </div>
    </div>
  );
};

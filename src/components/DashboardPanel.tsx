import { X, Trophy, Unlock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardPanelProps {
  isOpen: boolean;
  onClose: () => void;
  completed: number;
  unlocked: number;
  total: number;
}

export const DashboardPanel = ({
  isOpen,
  onClose,
  completed,
  unlocked,
  total,
}: DashboardPanelProps) => {
  if (!isOpen) return null;

  const completionPercentage = Math.round((completed / total) * 100);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-xl z-[60] animate-fade-in"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[70] w-full max-w-md animate-scale-in">
        <div className="glass-panel rounded-3xl p-8 border-2 border-primary/30 shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold cosmic-glow">Dashboard</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="hover:bg-primary/20 rounded-full"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Stats */}
          <div className="space-y-6">
            {/* Completed */}
            <div className="glass-panel rounded-2xl p-6 border border-primary/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/50">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground uppercase tracking-wider">
                      Mastered
                    </div>
                    <div className="text-3xl font-bold text-primary cosmic-glow">
                      {completed}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-primary/20">{completionPercentage}%</div>
                </div>
              </div>
            </div>

            {/* Unlocked */}
            <div className="glass-panel rounded-2xl p-6 border border-secondary/20">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center shadow-lg shadow-secondary/50">
                  <Unlock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground uppercase tracking-wider">
                    Unlocked
                  </div>
                  <div className="text-3xl font-bold text-secondary">{unlocked}</div>
                </div>
              </div>
            </div>

            {/* Total */}
            <div className="glass-panel rounded-2xl p-6 border border-accent/20">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center shadow-lg shadow-accent/50">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground uppercase tracking-wider">
                    Total Skills
                  </div>
                  <div className="text-3xl font-bold text-foreground">{total}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-8">
            <div className="h-3 bg-muted/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary via-accent to-secondary rounded-full transition-all duration-1000 shadow-lg shadow-primary/50"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

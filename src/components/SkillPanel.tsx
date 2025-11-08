import { X } from "lucide-react";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";

interface Skill {
  id: string;
  name: string;
  description: string;
  learned: boolean;
  connectors?: string[];
}

interface SkillPanelProps {
  skill: Skill | null;
  onClose: () => void;
  onMarkLearned: (skillId: string) => void;
}

export const SkillPanel = ({ skill, onClose, onMarkLearned }: SkillPanelProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (skill) {
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
    }
  }, [skill]);

  if (!skill) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 z-40 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`fixed right-0 top-0 h-full w-full md:w-96 bg-card border-l border-border shadow-2xl z-50 transition-transform duration-300 ${
          isVisible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-foreground mb-1">{skill.name}</h2>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    skill.learned
                      ? "bg-primary/20 text-primary"
                      : "bg-secondary/20 text-secondary"
                  }`}
                >
                  {skill.learned ? "✓ Learned" : "Not Learned"}
                </span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Description
              </h3>
              <p className="text-foreground leading-relaxed">{skill.description}</p>
            </div>

            {skill.connectors && skill.connectors.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                  Suggested Connections
                </h3>
                <div className="space-y-2">
                  {skill.connectors.map((connector, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg border border-border/50"
                    >
                      <div className="flex-shrink-0 w-2 h-2 rounded-full bg-accent" />
                      <span className="text-sm text-foreground">{connector}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="pt-6 border-t border-border">
            {!skill.learned ? (
              <Button
                onClick={() => onMarkLearned(skill.id)}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              >
                Mark as Learned
              </Button>
            ) : (
              <div className="text-center text-muted-foreground text-sm">
                <span className="inline-flex items-center gap-2">
                  <span className="text-2xl">🎉</span>
                  You've mastered this skill!
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

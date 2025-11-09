import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Sparkles, Download } from "lucide-react";
import html2canvas from "html2canvas";
import { Skill } from "@/utils/skillGraph";

interface CompleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBackToChat: () => void;
  skills: Skill[];
  courseName?: string;
}

export const CompleteModal = ({
  isOpen,
  onClose,
  onBackToChat,
  skills,
  courseName = "All Courses",
}: CompleteModalProps) => {
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const constellationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Capture screenshot of constellation
      const captureScreenshot = async () => {
        try {
          // Find the constellation container
          const constellationElement = document.querySelector(".constellation-container") as HTMLElement;
          if (constellationElement) {
            const canvas = await html2canvas(constellationElement, {
              backgroundColor: "transparent",
              scale: 1,
              logging: false,
            });
            setScreenshot(canvas.toDataURL("image/png"));
          }
        } catch (error) {
          console.error("Failed to capture screenshot:", error);
          setScreenshot(null);
        }
      };

      setTimeout(captureScreenshot, 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const completedSkills = skills.filter((s) => s.completed);
  const skillsByCategory = completedSkills.reduce((acc, skill) => {
    const category = skill.category || "Other";
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  const handleDownloadScreenshot = () => {
    if (screenshot) {
      const link = document.createElement("a");
      link.download = `skillverse-completion-${Date.now()}.png`;
      link.href = screenshot;
      link.click();
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-background/95 backdrop-blur-xl z-[80] animate-fade-in" />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[90] w-full max-w-3xl max-h-[90vh] overflow-y-auto custom-scrollbar animate-scale-in">
        <div className="glass-panel rounded-3xl p-8 border-2 border-primary/30 shadow-2xl m-4">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary via-accent to-secondary flex items-center justify-center shadow-2xl shadow-primary/50 animate-pulse">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-4xl font-bold cosmic-glow">Congratulations! 🎉</h2>
                <p className="text-muted-foreground mt-1">
                  You've completed <span className="text-primary font-bold">{courseName}</span>
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="hover:bg-primary/20 rounded-full"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Screenshot */}
          {screenshot && (
            <div className="mb-6 relative group">
              <div className="relative rounded-2xl overflow-hidden border-2 border-primary/30 shadow-2xl">
                <img
                  src={screenshot}
                  alt="Your learning constellation"
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                  <Button
                    onClick={handleDownloadScreenshot}
                    className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Constellation
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Skills Summary */}
          <div className="space-y-4 mb-6">
            <h3 className="text-xl font-bold text-foreground">Skills Mastered:</h3>
            <div className="grid gap-4">
              {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
                <div key={category} className="glass-panel rounded-xl p-4 border border-primary/20">
                  <h4 className="text-lg font-semibold text-primary mb-2">{category}</h4>
                  <ul className="space-y-2">
                    {categorySkills.map((skill) => (
                      <li key={skill.id} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="text-accent mt-0.5">✨</span>
                        <div>
                          <div className="font-medium text-foreground">{skill.name}</div>
                          {skill.resources && skill.resources.length > 0 && (
                            <div className="text-xs text-muted-foreground">
                              {skill.resources.length} resource{skill.resources.length > 1 ? "s" : ""} completed
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Total Stats */}
          <div className="glass-panel rounded-xl p-6 border border-primary/20 mb-6 bg-gradient-to-br from-primary/10 to-accent/10">
            <div className="flex items-center justify-between">
              <div className="text-center flex-1">
                <div className="text-4xl font-bold cosmic-glow">{completedSkills.length}</div>
                <div className="text-sm text-muted-foreground uppercase tracking-wider mt-1">
                  Skills Mastered
                </div>
              </div>
              <div className="w-px h-12 bg-gradient-to-b from-transparent via-primary/30 to-transparent" />
              <div className="text-center flex-1">
                <div className="text-4xl font-bold text-primary">{skills.length}</div>
                <div className="text-sm text-muted-foreground uppercase tracking-wider mt-1">
                  Total Skills
                </div>
              </div>
              <div className="w-px h-12 bg-gradient-to-b from-transparent via-primary/30 to-transparent" />
              <div className="text-center flex-1">
                <div className="text-4xl font-bold text-accent">100%</div>
                <div className="text-sm text-muted-foreground uppercase tracking-wider mt-1">
                  Complete
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              onClick={onBackToChat}
              className="flex-1 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-bold py-6 text-lg shadow-xl shadow-primary/30"
            >
              Back to Chat
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="px-8 py-6 text-lg border-primary/30 hover:bg-primary/10"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

/**
 * CompleteModal - Celebration modal shown after completing all skills
 * Features:
 * - Captures constellation screenshot using html2canvas
 * - Shows completed skills and resources
 * - "Back to chat" button that focuses chat input
 */

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Sparkles, X } from "lucide-react";
import html2canvas from "html2canvas";
import { Skill } from "@/utils/skillGraph";

interface CompleteModalProps {
  open: boolean;
  onClose: () => void;
  onBackToChat: () => void;
  skills: Skill[];
  courseName?: string;
}

export function CompleteModal({ 
  open, 
  onClose, 
  onBackToChat, 
  skills,
  courseName = "All Courses"
}: CompleteModalProps) {
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!open) {
      setScreenshot(null);
      setLoading(true);
      return;
    }

    // Capture screenshot of the constellation
    const captureScreenshot = async () => {
      try {
        // Wait a bit for animations to settle
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Find the canvas or constellation container
        const canvas = document.querySelector('canvas');
        if (canvas) {
          const dataUrl = canvas.toDataURL('image/png');
          setScreenshot(dataUrl);
        } else {
          // Fallback: capture the whole viewport
          const element = document.body;
          const canvas = await html2canvas(element, {
            backgroundColor: 'rgba(0,0,0,0)',
            scale: 0.5, // Reduce quality for performance
          });
          setScreenshot(canvas.toDataURL('image/png'));
        }
      } catch (error) {
        console.error('Screenshot capture failed:', error);
        // Use placeholder
        setScreenshot(null);
      } finally {
        setLoading(false);
      }
    };

    captureScreenshot();
  }, [open]);

  const completedSkills = skills.filter(s => s.completed);
  const skillsByCategory = completedSkills.reduce((acc, skill) => {
    // Simple categorization based on skill dependencies
    const category = skill.requires?.length === 0 ? "Foundation" : "Advanced";
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-background/95 backdrop-blur-xl border-2 border-primary/30">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold cosmic-glow flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-primary animate-pulse" />
            Congratulations! 🎉
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <p className="text-xl text-muted-foreground">
            You've completed <span className="text-primary font-bold">{courseName}</span>!
          </p>

          {/* Screenshot Section */}
          <div className="rounded-lg overflow-hidden border border-primary/20 bg-background/50">
            {loading ? (
              <div className="h-64 flex items-center justify-center">
                <div className="animate-pulse text-muted-foreground">Capturing your constellation...</div>
              </div>
            ) : screenshot ? (
              <img 
                src={screenshot} 
                alt="Your completed constellation" 
                className="w-full h-auto"
              />
            ) : (
              <div className="h-64 flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
                <svg className="w-32 h-32 text-primary/50" viewBox="0 0 100 100" fill="none">
                  <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="2" />
                  <circle cx="50" cy="50" r="5" fill="currentColor" />
                  <circle cx="30" cy="30" r="3" fill="currentColor" />
                  <circle cx="70" cy="30" r="3" fill="currentColor" />
                  <circle cx="30" cy="70" r="3" fill="currentColor" />
                  <circle cx="70" cy="70" r="3" fill="currentColor" />
                  <line x1="50" y1="50" x2="30" y2="30" stroke="currentColor" strokeWidth="1" />
                  <line x1="50" y1="50" x2="70" y2="30" stroke="currentColor" strokeWidth="1" />
                  <line x1="50" y1="50" x2="30" y2="70" stroke="currentColor" strokeWidth="1" />
                  <line x1="50" y1="50" x2="70" y2="70" stroke="currentColor" strokeWidth="1" />
                </svg>
              </div>
            )}
          </div>

          {/* Skills Summary */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Skills Mastered ({completedSkills.length})</h3>
            
            {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
              <div key={category} className="glass-panel rounded-lg p-4">
                <h4 className="font-semibold text-lg mb-2 text-primary">{category}</h4>
                <ul className="grid grid-cols-2 gap-2">
                  {categorySkills.map(skill => (
                    <li key={skill.id} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      <span className="text-sm">{skill.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={onBackToChat}
              className="flex-1 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-bold py-3 text-lg shadow-lg shadow-primary/30"
            >
              Back to Chat
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="px-6"
            >
              <X className="w-4 h-4 mr-2" />
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

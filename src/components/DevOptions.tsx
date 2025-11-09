/**
 * DevOptions - Developer controls for scene configuration
 * Provides sliders for star count, nebula intensity, and screenshot capture
 */

import { useState } from "react";
import { Button } from "./ui/button";
import { Settings, Camera } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";

interface DevOptionsProps {
  starCount: number;
  onStarCountChange: (count: number) => void;
  nebulaIntensity: number;
  onNebulaIntensityChange: (intensity: number) => void;
  onCaptureScreenshot: () => void;
}

export function DevOptions({
  starCount,
  onStarCountChange,
  nebulaIntensity,
  onNebulaIntensityChange,
  onCaptureScreenshot,
}: DevOptionsProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-muted-foreground hover:text-foreground"
        >
          <Settings className="w-4 h-4 mr-2" />
          Dev Options
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-4 pt-4">
        <div className="space-y-2">
          <label className="text-xs text-muted-foreground uppercase tracking-wider">
            Star Count: {starCount}
          </label>
          <input
            type="range"
            min="100"
            max="1000"
            step="50"
            value={starCount}
            onChange={(e) => onStarCountChange(Number(e.target.value))}
            className="w-full h-2 bg-background/50 rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs text-muted-foreground uppercase tracking-wider">
            Nebula Intensity: {nebulaIntensity.toFixed(1)}
          </label>
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={nebulaIntensity}
            onChange={(e) => onNebulaIntensityChange(Number(e.target.value))}
            className="w-full h-2 bg-background/50 rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </div>

        <Button
          onClick={onCaptureScreenshot}
          size="sm"
          variant="outline"
          className="w-full"
        >
          <Camera className="w-4 h-4 mr-2" />
          Capture Screenshot
        </Button>
      </CollapsibleContent>
    </Collapsible>
  );
}

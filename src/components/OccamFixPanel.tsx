import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shield, AlertTriangle, Check, FileCode, Copy } from "lucide-react";
import { Vulnerability } from "@/types/vulnerability";
import { toast } from "sonner";

interface OccamFixPanelProps {
  vulnerability: Vulnerability | null;
  onPatch: (id: string) => Promise<boolean>;
  onClose: () => void;
}

export const OccamFixPanel = ({ vulnerability, onPatch, onClose }: OccamFixPanelProps) => {
  const [patching, setPatching] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!vulnerability) return null;

  const handlePatch = async () => {
    setPatching(true);
    const success = await onPatch(vulnerability.id);
    setPatching(false);
    if (success) {
      onClose();
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(vulnerability.fix_code);
    setCopied(true);
    toast.success("Fix code copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'authentication': return 'text-orange-400';
      case 'injection': return 'text-red-400';
      case 'data': return 'text-yellow-400';
      case 'logic': return 'text-purple-400';
      default: return 'text-red-400';
    }
  };

  const getCategoryIcon = (category: string) => {
    return <AlertTriangle className="w-4 h-4" />;
  };

  return (
    <Card className="glass-panel border-red-500/40 w-full max-w-md animate-fade-in">
      <div className="p-4 border-b border-red-500/30 flex items-center gap-3">
        <div className="p-2 rounded-lg bg-red-500/20">
          <Shield className="w-5 h-5 text-red-400" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-red-400 flex items-center gap-2">
            {getCategoryIcon(vulnerability.category)}
            <span className={getCategoryColor(vulnerability.category)}>
              {vulnerability.category} Threat
            </span>
          </h3>
          <p className="text-xs text-muted-foreground">Detected by Hacktron</p>
        </div>
      </div>
      
      <ScrollArea className="max-h-80 p-4">
        <div className="space-y-4">
          {/* File Path */}
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1">
              <FileCode className="w-3 h-3" />
              Vulnerable File
            </label>
            <div className="code-block text-sm text-red-300">
              {vulnerability.file_path}
            </div>
          </div>
          
          {/* Description */}
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground uppercase tracking-wider">
              Threat Description
            </label>
            <p className="text-sm text-foreground/90 leading-relaxed">
              {vulnerability.description}
            </p>
          </div>
          
          {/* Occam's Razor Fix */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                <span className="text-primary">⚔️</span>
                Occam's Razor Fix
              </label>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="h-6 px-2 text-xs"
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            </div>
            <pre className="code-block text-sm text-green-300 whitespace-pre-wrap">
              {vulnerability.fix_code}
            </pre>
          </div>
        </div>
      </ScrollArea>
      
      <div className="p-4 border-t border-primary/20 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onClose}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          onClick={handlePatch}
          disabled={patching || vulnerability.status === 'fixed'}
          size="sm"
          className="flex-1 bg-green-600 hover:bg-green-700 text-white"
        >
          {patching ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
              Patching...
            </>
          ) : vulnerability.status === 'fixed' ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Patched
            </>
          ) : (
            <>
              <Shield className="w-4 h-4 mr-2" />
              Apply Patch
            </>
          )}
        </Button>
      </div>
    </Card>
  );
};

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shield, AlertTriangle, Copy, Check, Rocket, X } from "lucide-react";
import { SecurityNode } from "@/types/securityNode";
import { toast } from "sonner";

interface OccamAgentProps {
  selectedNode: SecurityNode | null;
  onDeployPatch: (id: string) => Promise<boolean>;
  onClose: () => void;
}

export const OccamAgent = ({ selectedNode, onDeployPatch, onClose }: OccamAgentProps) => {
  const [deploying, setDeploying] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!selectedNode) {
    return (
      <Card className="glass-panel border-primary/20 w-80">
        <div className="p-4 border-b border-primary/20 flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          <h3 className="font-bold">Occam Agent</h3>
        </div>
        <div className="p-6 text-center text-muted-foreground">
          <Shield className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">Click a threat star to view its Occam Fix</p>
        </div>
      </Card>
    );
  }

  const handleCopy = async () => {
    // Extract just the fixed code
    const fixedPart = selectedNode.occam_fix.split('// ✅')[1] || selectedNode.occam_fix;
    await navigator.clipboard.writeText(fixedPart.trim());
    setCopied(true);
    toast.success("Fix copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDeploy = async () => {
    setDeploying(true);
    const success = await onDeployPatch(selectedNode.id);
    setDeploying(false);
    if (success) {
      onClose();
    }
  };

  const getSeverityStyles = () => {
    switch (selectedNode.severity) {
      case 'Critical':
        return 'bg-red-500/20 text-red-400 border-red-500/40';
      case 'High':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/40';
      case 'Medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40';
      default:
        return 'bg-blue-500/20 text-blue-400 border-blue-500/40';
    }
  };

  return (
    <Card className={`glass-panel w-80 transition-all duration-300 ${
      selectedNode.is_vulnerable ? 'border-red-500/40' : 'border-green-500/40'
    }`}>
      {/* Header */}
      <div className={`p-4 border-b flex items-center justify-between ${
        selectedNode.is_vulnerable ? 'border-red-500/30' : 'border-green-500/30'
      }`}>
        <div className="flex items-center gap-2">
          {selectedNode.is_vulnerable ? (
            <AlertTriangle className="w-5 h-5 text-red-400" />
          ) : (
            <Shield className="w-5 h-5 text-green-400" />
          )}
          <h3 className="font-bold text-sm">Occam Agent</h3>
        </div>
        <button 
          onClick={onClose}
          className="p-1 rounded hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>
      
      <ScrollArea className="max-h-96">
        <div className="p-4 space-y-4">
          {/* Category and Severity */}
          <div className="space-y-2">
            <h4 className={`font-bold text-lg ${
              selectedNode.is_vulnerable ? 'text-red-400' : 'text-green-400'
            }`}>
              {selectedNode.category_name}
            </h4>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getSeverityStyles()}`}>
                {selectedNode.severity}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                selectedNode.is_vulnerable 
                  ? 'bg-red-500/20 text-red-300' 
                  : 'bg-green-500/20 text-green-300'
              }`}>
                {selectedNode.is_vulnerable ? 'VULNERABLE' : 'SECURE'}
              </span>
            </div>
          </div>

          {/* Occam Fix Code Block */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">
                Occam Fix
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="h-6 px-2 text-xs"
              >
                {copied ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            </div>
            <pre className="bg-background/80 rounded-lg p-3 overflow-x-auto border border-border/50 text-xs">
              <code className="font-mono whitespace-pre-wrap">
                {selectedNode.occam_fix.split('\n').map((line, i) => {
                  const isVulnerable = line.includes('❌');
                  const isSecure = line.includes('✅');
                  const isComment = line.trim().startsWith('//');
                  
                  return (
                    <div key={i} className={`
                      ${isVulnerable ? 'text-red-400' : ''}
                      ${isSecure ? 'text-green-400' : ''}
                      ${isComment && !isVulnerable && !isSecure ? 'text-muted-foreground' : ''}
                      ${!isComment && !isVulnerable && !isSecure ? 'text-cyan-400' : ''}
                    `}>
                      {line}
                    </div>
                  );
                })}
              </code>
            </pre>
          </div>
        </div>
      </ScrollArea>

      {/* Deploy Button */}
      <div className="p-4 border-t border-border/30">
        <Button
          onClick={handleDeploy}
          disabled={deploying || !selectedNode.is_vulnerable}
          className={`w-full font-bold ${
            selectedNode.is_vulnerable 
              ? 'bg-green-600 hover:bg-green-700 text-white' 
              : 'bg-green-600/30 text-green-300/50'
          }`}
        >
          {deploying ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
              Deploying...
            </>
          ) : !selectedNode.is_vulnerable ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Already Secured
            </>
          ) : (
            <>
              <Rocket className="w-4 h-4 mr-2" />
              Deploy Patch
            </>
          )}
        </Button>
      </div>
    </Card>
  );
};

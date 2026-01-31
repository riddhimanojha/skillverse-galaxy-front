import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, Copy, Check, X, FileCode, Bug, Shield } from "lucide-react";
import { SecurityNode } from "@/types/securityNode";
import { toast } from "sonner";

interface InspectorPanelProps {
  selectedNode: SecurityNode | null;
  onDeployPatch: (id: string) => Promise<boolean>;
  onClose: () => void;
}

export const OccamAgent = ({ selectedNode, onDeployPatch, onClose }: InspectorPanelProps) => {
  const [deploying, setDeploying] = useState(false);
  const [copiedFix, setCopiedFix] = useState(false);
  const [copiedVuln, setCopiedVuln] = useState(false);

  if (!selectedNode) {
    return null;
  }

  const handleCopyFix = async () => {
    const fixedPart = selectedNode.occam_fix.split('// ✅')[1] || selectedNode.occam_fix;
    await navigator.clipboard.writeText(fixedPart.trim());
    setCopiedFix(true);
    toast.success("Fix copied to clipboard");
    setTimeout(() => setCopiedFix(false), 2000);
  };

  const handleCopyVuln = async () => {
    if (selectedNode.file_content) {
      await navigator.clipboard.writeText(selectedNode.file_content);
      setCopiedVuln(true);
      toast.success("Vulnerable code copied");
      setTimeout(() => setCopiedVuln(false), 2000);
    }
  };

  const handleApplyFix = async () => {
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

  const renderCodeBlock = (code: string, type: 'vulnerable' | 'fix') => {
    return code.split('\n').map((line, i) => {
      const isVulnerable = line.includes('❌');
      const isSecure = line.includes('✅');
      const isComment = line.trim().startsWith('//') || line.trim().startsWith('#');
      const isKeyword = /\b(def|return|if|else|import|from|class|function|const|let|var|async|await)\b/.test(line);
      
      let className = 'text-foreground/80';
      if (type === 'vulnerable') {
        className = 'text-red-300/90';
      } else if (isVulnerable) {
        className = 'text-red-400 line-through opacity-60';
      } else if (isSecure) {
        className = 'text-green-400 font-medium';
      } else if (isComment) {
        className = 'text-muted-foreground italic';
      } else if (isKeyword) {
        className = 'text-purple-400';
      } else {
        className = 'text-cyan-400';
      }
      
      return (
        <div key={i} className={className}>
          <span className="text-muted-foreground/40 select-none mr-3 text-right inline-block w-4">
            {i + 1}
          </span>
          {line}
        </div>
      );
    });
  };

  return (
    <Card className={`glass-panel w-96 transition-all duration-300 ${
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
          <h3 className="font-bold text-sm">Inspector</h3>
        </div>
        <button 
          onClick={onClose}
          className="p-1 rounded hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>
      
      <ScrollArea className="max-h-[28rem]">
        <div className="p-4 space-y-4">
          {/* Vulnerability Name */}
          <h4 className={`font-bold text-lg ${
            selectedNode.is_vulnerable ? 'text-red-400' : 'text-green-400'
          }`}>
            {selectedNode.category_name}
          </h4>
          
          {/* Severity Badge */}
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

          {/* Affected File Name */}
          {selectedNode.file_name && (
            <div className="flex items-center gap-2 text-sm">
              <FileCode className="w-4 h-4 text-cyan-400" />
              <span className="font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">
                {selectedNode.file_name}
                {selectedNode.line_no && (
                  <span className="text-muted-foreground">:{selectedNode.line_no}</span>
                )}
              </span>
            </div>
          )}

          {/* Vulnerable Code Block */}
          {selectedNode.file_content && selectedNode.is_vulnerable && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bug className="w-4 h-4 text-red-400" />
                  <span className="text-xs text-red-400 uppercase tracking-wider font-semibold">
                    Vulnerable Code
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyVuln}
                  className="h-6 px-2 text-xs hover:bg-red-500/20"
                >
                  {copiedVuln ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                  {copiedVuln ? 'Copied!' : 'Copy'}
                </Button>
              </div>
              <div className="bg-red-950/30 rounded-lg border border-red-500/30 overflow-hidden">
                <ScrollArea className="max-h-32">
                  <pre className="p-3 text-xs overflow-x-auto">
                    <code className="font-mono">
                      {renderCodeBlock(selectedNode.file_content, 'vulnerable')}
                    </code>
                  </pre>
                </ScrollArea>
              </div>
            </div>
          )}

          {/* Recommended Fix */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-400" />
                <span className="text-xs text-green-400 uppercase tracking-wider font-semibold">
                  Recommended Fix
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyFix}
                className="h-6 px-2 text-xs hover:bg-green-500/20"
              >
                {copiedFix ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                {copiedFix ? 'Copied!' : 'Copy'}
              </Button>
            </div>
            <div className="bg-green-950/20 rounded-lg border border-green-500/30 overflow-hidden">
              <ScrollArea className="max-h-40">
                <pre className="p-3 text-xs overflow-x-auto">
                  <code className="font-mono">
                    {renderCodeBlock(selectedNode.occam_fix, 'fix')}
                  </code>
                </pre>
              </ScrollArea>
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Apply Fix Button */}
      <div className="p-4 border-t border-border/30">
        <Button
          onClick={handleApplyFix}
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
              Applying...
            </>
          ) : !selectedNode.is_vulnerable ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Secured
            </>
          ) : (
            'Apply Fix'
          )}
        </Button>
      </div>
    </Card>
  );
};

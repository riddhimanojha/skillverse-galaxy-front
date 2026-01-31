import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { AlertTriangle, Copy, Check, FileCode, Bug, Shield } from "lucide-react";
import { SecurityNode } from "@/types/securityNode";
import { toast } from "sonner";

interface InspectorPanelProps {
  selectedNode: SecurityNode | null;
  onDeployPatch: (id: string) => Promise<boolean>;
  onClose: () => void;
}

export const InspectorPanel = ({ selectedNode, onDeployPatch, onClose }: InspectorPanelProps) => {
  const [deploying, setDeploying] = useState(false);
  const [copiedFix, setCopiedFix] = useState(false);
  const [copiedVuln, setCopiedVuln] = useState(false);

  const handleCopyFix = async () => {
    if (!selectedNode) return;
    const fixedPart = selectedNode.occam_fix.split('// ✅')[1] || selectedNode.occam_fix;
    await navigator.clipboard.writeText(fixedPart.trim());
    setCopiedFix(true);
    toast.success("Fix copied to clipboard");
    setTimeout(() => setCopiedFix(false), 2000);
  };

  const handleCopyVuln = async () => {
    if (selectedNode?.file_content) {
      await navigator.clipboard.writeText(selectedNode.file_content);
      setCopiedVuln(true);
      toast.success("Vulnerable code copied");
      setTimeout(() => setCopiedVuln(false), 2000);
    }
  };

  const handleApplyFix = async () => {
    if (!selectedNode) return;
    setDeploying(true);
    const success = await onDeployPatch(selectedNode.id);
    setDeploying(false);
    if (success) {
      onClose();
    }
  };

  const getSeverityStyles = () => {
    if (!selectedNode) return '';
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
          <span className="text-muted-foreground/40 select-none mr-4 text-right inline-block w-6">
            {i + 1}
          </span>
          {line}
        </div>
      );
    });
  };

  return (
    <Sheet open={!!selectedNode} onOpenChange={(open) => !open && onClose()}>
      <SheetContent 
        side="right" 
        className="glass-panel border-l border-primary/20 p-0 overflow-hidden"
      >
        {selectedNode && (
          <div className="flex flex-col h-full">
            {/* Header */}
            <SheetHeader className={`p-6 border-b ${
              selectedNode.is_vulnerable ? 'border-red-500/30 bg-red-500/5' : 'border-green-500/30 bg-green-500/5'
            }`}>
              <div className="flex items-center gap-3">
                {selectedNode.is_vulnerable ? (
                  <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-green-400" />
                  </div>
                )}
                <div>
                  <SheetTitle className={`text-xl ${
                    selectedNode.is_vulnerable ? 'text-red-400' : 'text-green-400'
                  }`}>
                    {selectedNode.category_name}
                  </SheetTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getSeverityStyles()}`}>
                      {selectedNode.severity}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      selectedNode.is_vulnerable 
                        ? 'bg-red-500/20 text-red-300' 
                        : 'bg-green-500/20 text-green-300'
                    }`}>
                      {selectedNode.is_vulnerable ? 'VULNERABLE' : 'SECURE'}
                    </span>
                  </div>
                </div>
              </div>
            </SheetHeader>

            {/* Content */}
            <ScrollArea className="flex-1">
              <div className="p-6 space-y-6">
                {/* Affected File */}
                {selectedNode.file_name && (
                  <div className="space-y-2">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                      Affected File
                    </span>
                    <div className="flex items-center gap-2">
                      <FileCode className="w-4 h-4 text-cyan-400" />
                      <code className="font-mono text-sm text-cyan-400 bg-cyan-500/10 px-3 py-1.5 rounded-lg">
                        {selectedNode.file_name}
                        {selectedNode.line_no && (
                          <span className="text-muted-foreground">:{selectedNode.line_no}</span>
                        )}
                      </code>
                    </div>
                  </div>
                )}

                {/* Vulnerable Code */}
                {selectedNode.file_content && selectedNode.is_vulnerable && (
                  <div className="space-y-3">
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
                        className="h-7 px-3 text-xs hover:bg-red-500/20 text-muted-foreground hover:text-red-400"
                      >
                        {copiedVuln ? <Check className="w-3 h-3 mr-1.5" /> : <Copy className="w-3 h-3 mr-1.5" />}
                        {copiedVuln ? 'Copied' : 'Copy'}
                      </Button>
                    </div>
                    <div className="bg-red-950/40 rounded-xl border border-red-500/30 overflow-hidden">
                      <pre className="p-4 text-sm overflow-x-auto">
                        <code className="font-mono">
                          {renderCodeBlock(selectedNode.file_content, 'vulnerable')}
                        </code>
                      </pre>
                    </div>
                  </div>
                )}

                {/* Recommended Fix */}
                <div className="space-y-3">
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
                      className="h-7 px-3 text-xs hover:bg-green-500/20 text-muted-foreground hover:text-green-400"
                    >
                      {copiedFix ? <Check className="w-3 h-3 mr-1.5" /> : <Copy className="w-3 h-3 mr-1.5" />}
                      {copiedFix ? 'Copied' : 'Copy'}
                    </Button>
                  </div>
                  <div className="bg-green-950/30 rounded-xl border border-green-500/30 overflow-hidden">
                    <pre className="p-4 text-sm overflow-x-auto">
                      <code className="font-mono">
                        {renderCodeBlock(selectedNode.occam_fix, 'fix')}
                      </code>
                    </pre>
                  </div>
                </div>
              </div>
            </ScrollArea>

            {/* Footer */}
            <div className="p-6 border-t border-border/30 bg-background/50 backdrop-blur-sm">
              <Button
                onClick={handleApplyFix}
                disabled={deploying || !selectedNode.is_vulnerable}
                size="lg"
                className={`w-full font-bold text-base ${
                  selectedNode.is_vulnerable 
                    ? 'bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-500/20' 
                    : 'bg-green-600/30 text-green-300/50 cursor-not-allowed'
                }`}
              >
                {deploying ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Applying Fix...
                  </>
                ) : !selectedNode.is_vulnerable ? (
                  <>
                    <Check className="w-5 h-5 mr-2" />
                    Already Secured
                  </>
                ) : (
                  'Apply Fix'
                )}
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

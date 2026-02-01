import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
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
    const codeToUse = selectedNode.fix_code || selectedNode.occam_fix;
    await navigator.clipboard.writeText(codeToUse.trim());
    setCopiedFix(true);
    toast.success("Fix code copied to clipboard");
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
    if (!selectedNode) return "";
    switch (selectedNode.severity) {
      case "Critical":
        return "bg-[#E03E84]/20 text-[#E03E84] border-[#E03E84]/40";
      case "High":
        return "bg-[#9A2E4A]/20 text-[#9A2E4A] border-[#9A2E4A]/40";
      case "Medium":
        return "bg-[#7A1E3A]/20 text-[#7A1E3A] border-[#7A1E3A]/40";
      default:
        return "bg-[#7FB7D6]/20 text-[#7FB7D6] border-[#7FB7D6]/40";
    }
  };

  const renderCodeBlock = (code: string, type: "vulnerable" | "fix") => {
    return code.split("\n").map((line, i) => {
      const isVulnerable = line.includes("❌");
      const isSecure = line.includes("✅");
      const isComment = line.trim().startsWith("//") || line.trim().startsWith("#");
      const isKeyword = /\b(def|return|if|else|import|from|class|function|const|let|var|async|await)\b/.test(line);

      let className = "text-foreground/80";
      if (type === "vulnerable") {
        className = "text-[#E03E84]/90";
      } else if (isVulnerable) {
        className = "text-[#E03E84] line-through opacity-60";
      } else if (isSecure) {
        className = "text-[#7FB7D6] font-medium";
      } else if (isComment) {
        className = "text-muted-foreground italic";
      } else if (isKeyword) {
        className = "text-[#9A2E4A]";
      } else {
        className = "text-[#7FB7D6]";
      }

      return (
        <div key={i} className={className}>
          <span className="text-muted-foreground/40 select-none mr-4 text-right inline-block w-6">{i + 1}</span>
          {line}
        </div>
      );
    });
  };

  return (
    <Sheet open={!!selectedNode} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="right"
        className="glass-panel border-l border-primary/20 p-0 w-[400px] max-w-[90vw] h-screen overflow-hidden fixed right-0 top-0"
      >
        {selectedNode && (
          <div className="flex flex-col h-full">
            {/* Header */}
            <SheetHeader
              className={`p-6 border-b ${
                selectedNode.is_vulnerable ? "border-[#7A1E3A]/30 bg-[#7A1E3A]/5" : "border-[#7FB7D6]/30 bg-[#7FB7D6]/5"
              }`}
            >
              <div className="flex items-center gap-3">
                {selectedNode.is_vulnerable ? (
                  <div className="w-10 h-10 rounded-xl bg-[#7A1E3A]/20 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-[#E03E84]" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-[#7FB7D6]/20 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-[#7FB7D6]" />
                  </div>
                )}
                <div>
                  <SheetTitle className={`text-xl ${selectedNode.is_vulnerable ? "text-[#E03E84]" : "text-[#7FB7D6]"}`}>
                    {selectedNode.category_name}
                  </SheetTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getSeverityStyles()}`}>
                      {selectedNode.severity}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        selectedNode.is_vulnerable ? "bg-[#7A1E3A]/20 text-[#E03E84]" : "bg-[#7FB7D6]/20 text-[#7FB7D6]"
                      }`}
                    >
                      {selectedNode.is_vulnerable ? "VULNERABLE" : "SECURE"}
                    </span>
                  </div>
                </div>
              </div>
            </SheetHeader>

            {/* Content */}
            <ScrollArea className="flex-1">
              <div className="p-6 space-y-6">
                {/* Show different content based on vulnerability status */}
                {selectedNode.is_vulnerable ? (
                  <>
                    {/* Affected File */}
                    {selectedNode.file_name && (
                      <div className="space-y-2">
                        <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                          Affected File
                        </span>
                        <div className="flex items-center gap-2">
                          <FileCode className="w-4 h-4 text-[#7FB7D6]" />
                          <code className="font-mono text-sm text-[#7FB7D6] bg-[#7FB7D6]/10 px-3 py-1.5 rounded-lg">
                            {selectedNode.file_name}
                            {selectedNode.line_no && <span className="text-muted-foreground">:{selectedNode.line_no}</span>}
                          </code>
                        </div>
                      </div>
                    )}

                    {/* Vulnerable Code */}
                    {selectedNode.file_content && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Bug className="w-4 h-4 text-[#E03E84]" />
                            <span className="text-xs text-[#E03E84] uppercase tracking-wider font-semibold">
                              Vulnerable Code
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleCopyVuln}
                            className="h-7 px-3 text-xs hover:bg-[#7A1E3A]/20 text-muted-foreground hover:text-[#E03E84]"
                          >
                            {copiedVuln ? <Check className="w-3 h-3 mr-1.5" /> : <Copy className="w-3 h-3 mr-1.5" />}
                            {copiedVuln ? "Copied" : "Copy"}
                          </Button>
                        </div>
                        <div className="bg-[#1A0A10] rounded-xl border border-[#7A1E3A]/30 overflow-hidden">
                          <pre className="p-4 overflow-x-auto max-w-full">
                            <code className="font-mono text-sm break-all whitespace-pre-wrap">{renderCodeBlock(selectedNode.file_content, "vulnerable")}</code>
                          </pre>
                        </div>
                      </div>
                    )}

                    {/* Fixed Code Preview */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-[#7FB7D6]" />
                          <span className="text-xs text-[#7FB7D6] uppercase tracking-wider font-semibold">
                            Recommended Fix
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleCopyFix}
                          className="h-7 px-3 text-xs hover:bg-[#7FB7D6]/20 text-muted-foreground hover:text-[#7FB7D6]"
                        >
                          {copiedFix ? <Check className="w-3 h-3 mr-1.5" /> : <Copy className="w-3 h-3 mr-1.5" />}
                          {copiedFix ? "Copied" : "Copy"}
                        </Button>
                      </div>
                      <div className="bg-[#0A1015] rounded-xl border border-[#7FB7D6]/30 overflow-hidden">
                        <pre className="p-4 overflow-x-auto max-w-full">
                          <code className="font-mono text-sm break-all whitespace-pre-wrap">
                            {renderCodeBlock(selectedNode.fix_code || selectedNode.occam_fix, "fix")}
                          </code>
                        </pre>
                      </div>
                    </div>
                  </>
                ) : (
                  /* Already Secured - No Fix Needed */
                  <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                    <div className="w-20 h-20 rounded-full bg-[#7FB7D6]/20 flex items-center justify-center">
                      <Shield className="w-10 h-10 text-[#7FB7D6]" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-[#7FB7D6]">Already Secured</h3>
                      <p className="text-muted-foreground text-sm max-w-xs">
                        This node has been patched and no longer requires any action. The vulnerability has been resolved.
                      </p>
                    </div>
                    {selectedNode.file_name && (
                      <div className="flex items-center gap-2 mt-4 bg-[#7FB7D6]/10 px-4 py-2 rounded-lg">
                        <FileCode className="w-4 h-4 text-[#7FB7D6]" />
                        <code className="font-mono text-sm text-[#7FB7D6]">
                          {selectedNode.file_name}
                        </code>
                      </div>
                    )}
                  </div>
                )}
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
                    ? "bg-[#7FB7D6] hover:bg-[#8FC7E6] text-[#12080C] shadow-lg shadow-[#7FB7D6]/20"
                    : "bg-[#7FB7D6]/30 text-[#7FB7D6]/50 cursor-not-allowed"
                }`}
              >
                {deploying ? (
                  <>
                    <div className="w-5 h-5 border-2 border-[#12080C]/30 border-t-[#12080C] rounded-full animate-spin mr-2" />
                    Applying Fix...
                  </>
                ) : !selectedNode.is_vulnerable ? (
                  <>
                    <Check className="w-5 h-5 mr-2" />
                    Already Secured
                  </>
                ) : (
                  "Apply Fix"
                )}
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

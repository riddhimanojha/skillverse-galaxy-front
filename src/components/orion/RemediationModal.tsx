import { useState } from "react";
import { X, Copy, Check, Shield, AlertTriangle } from "lucide-react";
import { Finding } from "@/types/finding";
import { Button } from "@/components/ui/button";

interface RemediationModalProps {
  finding: Finding | null;
  onClose: () => void;
  onApplyFix: (id: string) => Promise<boolean>;
}

export const RemediationModal = ({ finding, onClose, onApplyFix }: RemediationModalProps) => {
  const [copied, setCopied] = useState(false);
  const [applying, setApplying] = useState(false);

  if (!finding) return null;

  const handleCopy = async () => {
    // Extract just the fixed code portion
    const fixedCode = finding.remediation_code.split('// ✅ Fixed')[1] || finding.remediation_code;
    await navigator.clipboard.writeText(fixedCode.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApplyFix = async () => {
    setApplying(true);
    const success = await onApplyFix(finding.id);
    setApplying(false);
    if (success) {
      onClose();
    }
  };

  const getSeverityBadge = () => {
    const colors = {
      critical: 'bg-red-500/20 text-red-400 border-red-500/40',
      high: 'bg-orange-500/20 text-orange-400 border-orange-500/40',
      medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40',
      low: 'bg-blue-500/20 text-blue-400 border-blue-500/40',
    };
    return colors[finding.severity] || colors.medium;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-[#0f1535] border border-[#ff2563]/30 rounded-2xl shadow-[0_0_60px_rgba(255,37,99,0.3)] animate-scale-in overflow-hidden">
        {/* Red glow accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#ff2563] to-transparent" />

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#ff2563]/20">
              <AlertTriangle className="w-5 h-5 text-[#ff2563]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">{finding.category}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getSeverityBadge()}`}>
                  {finding.severity.toUpperCase()}
                </span>
                <span className="text-xs text-white/40">Threat Detected</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5 text-white/60" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Code block */}
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-white/40 uppercase tracking-wider">Occam's Razor Fix</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="h-7 px-2 text-xs text-white/60 hover:text-white"
              >
                {copied ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            </div>
            <pre className="bg-[#0a0e27] rounded-xl p-4 overflow-x-auto border border-white/10">
              <code className="text-sm font-mono whitespace-pre-wrap">
                {finding.remediation_code.split('\n').map((line, i) => {
                  const isVulnerable = line.includes('❌');
                  const isFixed = line.includes('✅');
                  const isComment = line.trim().startsWith('//');
                  
                  return (
                    <div key={i} className={`
                      ${isVulnerable ? 'text-[#ff2563]' : ''}
                      ${isFixed ? 'text-[#00d994]' : ''}
                      ${isComment && !isVulnerable && !isFixed ? 'text-white/40' : ''}
                      ${!isComment && !isVulnerable && !isFixed ? 'text-[#00d9ff]' : ''}
                    `}>
                      {line}
                    </div>
                  );
                })}
              </code>
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-5 border-t border-white/10 bg-[#0a0e27]/50">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 border-white/20 text-white hover:bg-white/10"
          >
            Cancel
          </Button>
          <Button
            onClick={handleApplyFix}
            disabled={applying || !finding.is_vulnerable}
            className={`flex-1 font-bold ${
              finding.is_vulnerable 
                ? 'bg-[#00d994] hover:bg-[#00d994]/80 text-black' 
                : 'bg-[#00d994]/50 text-black/50'
            }`}
          >
            {applying ? (
              <>
                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin mr-2" />
                Applying...
              </>
            ) : !finding.is_vulnerable ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Already Fixed
              </>
            ) : (
              <>
                <Shield className="w-4 h-4 mr-2" />
                Apply Fix
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

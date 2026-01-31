import { useState } from "react";
import { SecurityConstellation } from "@/components/orion/SecurityConstellation";
import { RemediationModal } from "@/components/orion/RemediationModal";
import { SummaryPanel } from "@/components/orion/SummaryPanel";
import { OrionBadge } from "@/components/orion/OrionBadge";
import { StarField } from "@/components/orion/StarField";
import { useFindings } from "@/hooks/useFindings";
import { Finding } from "@/types/finding";
import { Loader2, Wifi, WifiOff } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const { 
    findings, 
    loading, 
    connectionStatus, 
    applyFix, 
    getStats 
  } = useFindings();
  
  const [selectedFinding, setSelectedFinding] = useState<Finding | null>(null);

  const stats = getStats();

  const handleStarClick = (finding: Finding) => {
    if (finding.is_vulnerable) {
      setSelectedFinding(finding);
    }
  };

  const handleRunScan = () => {
    toast.info("🔍 Scan triggered via Hacktron CLI", {
      description: "Run 'hacktron scan' in your terminal",
      duration: 4000,
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0e27] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-[#00d9ff] animate-spin mx-auto" />
          <p className="text-white/60 text-sm">Connecting to security database...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0e27] relative overflow-hidden">
      {/* Animated star field background */}
      <StarField />

      {/* Gradient overlays */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#0a0e27] via-transparent to-[#0a0e27] pointer-events-none z-[1]" />
      <div className="fixed inset-0 bg-gradient-radial from-transparent via-transparent to-[#0a0e27] pointer-events-none z-[1]" />

      {/* Connection status indicator */}
      <div className="fixed top-4 right-4 z-50">
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
          connectionStatus === 'connected' 
            ? 'bg-[#00d994]/20 text-[#00d994] border border-[#00d994]/30' 
            : connectionStatus === 'connecting'
            ? 'bg-[#00d9ff]/20 text-[#00d9ff] border border-[#00d9ff]/30'
            : 'bg-[#ff2563]/20 text-[#ff2563] border border-[#ff2563]/30'
        }`}>
          {connectionStatus === 'connected' ? (
            <>
              <Wifi className="w-3 h-3" />
              <span>Live</span>
            </>
          ) : connectionStatus === 'connecting' ? (
            <>
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>Connecting...</span>
            </>
          ) : (
            <>
              <WifiOff className="w-3 h-3" />
              <span>Disconnected</span>
            </>
          )}
        </div>
      </div>

      {/* Main constellation */}
      <div className="relative z-10 pt-16">
        <SecurityConstellation 
          findings={findings} 
          onStarClick={handleStarClick} 
        />
      </div>

      {/* Summary panel */}
      <SummaryPanel
        totalVulnerabilities={stats.total}
        criticalIssues={stats.critical}
        lastScan={stats.lastScan}
        onRunScan={handleRunScan}
      />

      {/* Orion badge */}
      <OrionBadge />

      {/* Remediation modal */}
      <RemediationModal
        finding={selectedFinding}
        onClose={() => setSelectedFinding(null)}
        onApplyFix={applyFix}
      />
    </div>
  );
};

export default Index;

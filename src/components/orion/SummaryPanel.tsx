import { AlertTriangle, Shield, Clock, Radar } from "lucide-react";

interface SummaryPanelProps {
  totalVulnerabilities: number;
  criticalIssues: number;
  lastScan: Date | null;
  onRunScan?: () => void;
}

export const SummaryPanel = ({ 
  totalVulnerabilities, 
  criticalIssues, 
  lastScan,
  onRunScan 
}: SummaryPanelProps) => {
  const formatTime = (date: Date | null) => {
    if (!date) return 'Never';
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <div className="bg-[rgba(15,21,53,0.8)] backdrop-blur-xl border border-white/10 rounded-2xl p-5 w-64 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
        <h3 className="text-xs text-white/40 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Radar className="w-3 h-3" />
          Threat Summary
        </h3>
        
        <div className="space-y-3">
          {/* Total Vulnerabilities */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className={`w-4 h-4 ${totalVulnerabilities > 0 ? 'text-[#ff2563]' : 'text-white/40'}`} />
              <span className="text-sm text-white/70">Total Threats</span>
            </div>
            <span className={`text-xl font-bold ${totalVulnerabilities > 0 ? 'text-[#ff2563]' : 'text-[#00d994]'}`}>
              {totalVulnerabilities}
            </span>
          </div>

          {/* Critical Issues */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className={`w-4 h-4 ${criticalIssues > 0 ? 'text-red-500' : 'text-white/40'}`} />
              <span className="text-sm text-white/70">Critical</span>
            </div>
            <span className={`text-xl font-bold ${criticalIssues > 0 ? 'text-red-500' : 'text-[#00d994]'}`}>
              {criticalIssues}
            </span>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          {/* Last Scan */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-white/40" />
              <span className="text-sm text-white/70">Last Scan</span>
            </div>
            <span className="text-sm text-[#00d9ff]">
              {formatTime(lastScan)}
            </span>
          </div>

          {/* Run Scan Button */}
          <button
            onClick={onRunScan}
            className="w-full mt-2 py-2 px-4 bg-[#00d9ff]/10 hover:bg-[#00d9ff]/20 border border-[#00d9ff]/30 rounded-lg text-[#00d9ff] text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Radar className="w-4 h-4" />
            Run Scan
          </button>
        </div>
      </div>
    </div>
  );
};

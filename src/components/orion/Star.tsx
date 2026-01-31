import { Lock, Database, Shield } from "lucide-react";
import { Finding } from "@/types/finding";

interface StarProps {
  finding: Finding;
  onClick: () => void;
}

export const Star = ({ finding, onClick }: StarProps) => {
  const isVulnerable = finding.is_vulnerable;

  const getIcon = () => {
    switch (finding.category) {
      case 'Authentication':
        return <Lock className="w-10 h-10" />;
      case 'Database':
        return <Database className="w-10 h-10" />;
      case 'API Security':
        return <Shield className="w-10 h-10" />;
      default:
        return <Shield className="w-10 h-10" />;
    }
  };

  const getSeverityColor = () => {
    switch (finding.severity) {
      case 'critical':
        return 'text-red-400';
      case 'high':
        return 'text-orange-400';
      case 'medium':
        return 'text-yellow-400';
      default:
        return 'text-blue-400';
    }
  };

  // Calculate risk score based on vulnerability state
  const riskScore = isVulnerable ? (finding.severity === 'critical' ? 95 : finding.severity === 'high' ? 75 : 50) : 0;

  return (
    <button
      onClick={onClick}
      className={`
        relative group cursor-pointer transition-all duration-500 ease-out
        ${isVulnerable ? 'scale-105' : 'hover:scale-105'}
      `}
    >
      {/* Outer glow ring */}
      <div
        className={`
          absolute inset-0 rounded-full blur-xl transition-all duration-500
          ${isVulnerable 
            ? 'bg-[#ff2563] opacity-60 animate-pulse-glow' 
            : 'bg-[#00d9ff] opacity-30 group-hover:opacity-50'
          }
        `}
        style={{
          width: '200px',
          height: '200px',
          margin: '-20px',
        }}
      />

      {/* Glass card container */}
      <div
        className={`
          relative w-40 h-48 rounded-2xl p-5 flex flex-col items-center justify-between
          backdrop-blur-xl border transition-all duration-500
          ${isVulnerable 
            ? 'bg-[rgba(255,37,99,0.15)] border-[#ff2563]/50 shadow-[0_0_40px_rgba(255,37,99,0.4)]' 
            : 'bg-[rgba(15,21,53,0.6)] border-white/10 shadow-[0_0_20px_rgba(0,217,255,0.2)]'
          }
          hover:border-opacity-80
        `}
      >
        {/* Icon container with glow */}
        <div
          className={`
            relative p-4 rounded-full transition-all duration-500
            ${isVulnerable 
              ? 'text-[#ff2563] bg-[#ff2563]/20' 
              : 'text-[#00d9ff] bg-[#00d9ff]/10'
            }
          `}
        >
          {/* Pulsing ring for vulnerable state */}
          {isVulnerable && (
            <>
              <div className="absolute inset-0 rounded-full bg-[#ff2563]/30 animate-ping" />
              <div className="absolute inset-0 rounded-full bg-[#ff2563]/20 animate-pulse" />
            </>
          )}
          {getIcon()}
        </div>

        {/* Category name */}
        <h3 className="text-white font-bold text-center text-sm leading-tight">
          {finding.category}
        </h3>

        {/* Status badge */}
        <div
          className={`
            px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
            transition-all duration-500
            ${isVulnerable 
              ? 'bg-[#ff2563] text-white animate-pulse' 
              : 'bg-[#00d9ff]/20 text-[#00d9ff] border border-[#00d9ff]/30'
            }
          `}
        >
          {isVulnerable ? 'VULNERABLE' : 'CLEAN'}
        </div>

        {/* Risk score */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/50">Risk:</span>
          <span className={`text-lg font-bold ${isVulnerable ? 'text-[#ff2563]' : 'text-[#00d9ff]'}`}>
            {riskScore}
          </span>
        </div>
      </div>

      {/* Click indicator for vulnerable stars */}
      {isVulnerable && (
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-[#ff2563]/80 animate-bounce">
          Click to fix
        </div>
      )}
    </button>
  );
};

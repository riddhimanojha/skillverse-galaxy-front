import { AlertTriangle, Shield, Activity, Clock } from "lucide-react";

interface ThreatDashboardProps {
  activeThreats: number;
  criticalThreats: number;
  highThreats: number;
  securedNodes: number;
  total: number;
}

export const ThreatDashboard = ({ 
  activeThreats, 
  criticalThreats, 
  highThreats, 
  securedNodes,
  total 
}: ThreatDashboardProps) => {
  return (
    <div className="fixed bottom-6 left-6 z-40 animate-fade-in">
      <div className="glass-panel rounded-2xl p-5 w-72">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-4 h-4 text-primary" />
          <span className="text-xs text-muted-foreground uppercase tracking-wider">
            Threat Monitor
          </span>
        </div>
        
        <div className="space-y-3">
          {/* Active Threats - Big Counter */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className={`w-5 h-5 ${activeThreats > 0 ? 'text-red-400' : 'text-green-400'}`} />
              <span className="text-sm font-medium">Active Threats</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2.5 h-2.5 rounded-full ${activeThreats > 0 ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`} />
              <span className={`text-3xl font-bold ${activeThreats > 0 ? 'text-red-400' : 'text-green-400'}`}>
                {activeThreats}
              </span>
            </div>
          </div>

          {/* Breakdown */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border/30">
            <div className="text-center">
              <div className="text-lg font-bold text-red-400">{criticalThreats}</div>
              <div className="text-xs text-muted-foreground">Critical</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-orange-400">{highThreats}</div>
              <div className="text-xs text-muted-foreground">High</div>
            </div>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

          {/* Secured */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-400" />
              <span className="text-sm text-muted-foreground">Secured</span>
            </div>
            <span className="text-xl font-bold text-green-400">{securedNodes}</span>
          </div>

          {/* Total */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Total Nodes</span>
            <span className="text-sm font-medium text-foreground">{total}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

import { useSecurityNodes } from "@/hooks/useSecurityNodes";
import { AegisLogo } from "@/components/aegis/AegisLogo";
import { AegisNavigation } from "@/components/aegis/AegisNavigation";
import { ShootingStars } from "@/components/ShootingStars";
import { ActivityLog } from "@/components/aegis/ActivityLog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Shield, Activity, TrendingUp, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Dashboard = () => {
  const { nodes, getStats } = useSecurityNodes();
  const stats = getStats();

  return (
    <div className="min-h-screen bg-background relative overflow-y-auto">
      <div className="fixed inset-0 bg-nebula-gradient -z-10" />
      <ShootingStars />
      
      <AegisLogo />
      <AegisNavigation />
      
      <div className="container mx-auto px-4 pt-32 pb-16 max-w-6xl">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl font-bold mb-4">
            <span className="cosmic-glow">Command Center</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Real-time security monitoring dashboard
          </p>
        </div>

        {/* Big Counter */}
        <div className="mb-8">
          <Card className={`glass-panel border-2 ${stats.activeThreats > 0 ? 'border-red-500/50' : 'border-green-500/50'}`}>
            <CardContent className="p-8 text-center">
              <div className={`text-8xl font-bold mb-2 ${stats.activeThreats > 0 ? 'text-red-400' : 'text-green-400'}`}>
                {stats.activeThreats}
              </div>
              <div className="flex items-center justify-center gap-2 text-xl">
                <AlertTriangle className={`w-6 h-6 ${stats.activeThreats > 0 ? 'text-red-400' : 'text-green-400'}`} />
                <span className="text-muted-foreground">Active Threats</span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="glass-panel border-red-500/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                Critical
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-red-400">{stats.criticalThreats}</div>
            </CardContent>
          </Card>

          <Card className="glass-panel border-orange-500/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-orange-400" />
                High
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-orange-400">{stats.highThreats}</div>
            </CardContent>
          </Card>

          <Card className="glass-panel border-green-500/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-400" />
                Secured
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-green-400">{stats.securedNodes}</div>
            </CardContent>
          </Card>

          <Card className="glass-panel border-primary/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" />
                Total Nodes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary">{stats.total}</div>
            </CardContent>
          </Card>
        </div>

        {/* Two Column Layout: Nodes + Activity Log */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Node List */}
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Security Nodes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {nodes.map((node) => (
                  <div 
                    key={node.id}
                    className={`flex items-center justify-between p-4 rounded-lg border ${
                      node.is_vulnerable 
                        ? 'bg-red-500/10 border-red-500/30' 
                        : 'bg-green-500/10 border-green-500/30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {node.is_vulnerable ? (
                        <AlertTriangle className="w-5 h-5 text-red-400" />
                      ) : (
                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                      )}
                      <div>
                        <div className="font-medium">{node.category_name}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(node.created_at).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`${
                        node.severity === 'Critical' ? 'bg-red-500/20 text-red-400 border-red-500/40' :
                        node.severity === 'High' ? 'bg-orange-500/20 text-orange-400 border-orange-500/40' :
                        'bg-yellow-500/20 text-yellow-400 border-yellow-500/40'
                      }`}>
                        {node.severity}
                      </Badge>
                      <Badge className={`${
                        node.is_vulnerable 
                          ? 'bg-red-500/20 text-red-300' 
                          : 'bg-green-500/20 text-green-300'
                      }`}>
                        {node.is_vulnerable ? 'VULNERABLE' : 'SECURE'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Activity Log */}
          <ActivityLog nodes={nodes} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

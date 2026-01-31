import { useSecurityNodes } from "@/hooks/useSecurityNodes";
import { AegisLogo } from "@/components/aegis/AegisLogo";
import { AegisNavigation } from "@/components/aegis/AegisNavigation";
import { ShootingStars } from "@/components/ShootingStars";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Shield, CheckCircle2, Copy, Rocket } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const Skills = () => {
  const { nodes, deployPatch } = useSecurityNodes();
  const [deployingId, setDeployingId] = useState<string | null>(null);

  const handleCopy = async (code: string) => {
    await navigator.clipboard.writeText(code);
    toast.success("Code copied to clipboard");
  };

  const handleDeploy = async (id: string) => {
    setDeployingId(id);
    await deployPatch(id);
    setDeployingId(null);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-y-auto">
      <div className="fixed inset-0 bg-nebula-gradient -z-10" />
      <ShootingStars />
      
      <AegisLogo />
      <AegisNavigation />
      
      <div className="container mx-auto px-4 pt-32 pb-16 max-w-6xl">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl font-bold mb-4">
            <span className="cosmic-glow">Live Audits</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Real-time security audit results with Occam fixes
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
          {nodes.map((node) => (
            <Card
              key={node.id}
              className={`glass-panel transition-all duration-300 hover:scale-[1.02] ${
                node.is_vulnerable 
                  ? 'border-red-500/40 hover:border-red-500/60' 
                  : 'border-green-500/40 hover:border-green-500/60'
              }`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {node.is_vulnerable ? (
                      <div className="p-2 rounded-lg bg-red-500/20">
                        <AlertTriangle className="w-5 h-5 text-red-400" />
                      </div>
                    ) : (
                      <div className="p-2 rounded-lg bg-green-500/20">
                        <Shield className="w-5 h-5 text-green-400" />
                      </div>
                    )}
                    <div>
                      <CardTitle className="text-lg">{node.category_name}</CardTitle>
                      <CardDescription className="text-xs mt-1">
                        Last scanned: {new Date(node.created_at).toLocaleString()}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-2">
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
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Code Block */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">
                      Occam Fix
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(node.occam_fix)}
                      className="h-6 px-2 text-xs"
                    >
                      <Copy className="w-3 h-3 mr-1" />
                      Copy
                    </Button>
                  </div>
                  <pre className="bg-background/80 rounded-lg p-3 overflow-x-auto border border-border/50 text-xs max-h-40">
                    <code className="font-mono whitespace-pre-wrap">
                      {node.occam_fix.split('\n').map((line, i) => (
                        <div key={i} className={`
                          ${line.includes('❌') ? 'text-red-400' : ''}
                          ${line.includes('✅') ? 'text-green-400' : ''}
                          ${line.trim().startsWith('//') && !line.includes('❌') && !line.includes('✅') ? 'text-muted-foreground' : ''}
                          ${!line.trim().startsWith('//') && !line.includes('❌') && !line.includes('✅') ? 'text-cyan-400' : ''}
                        `}>
                          {line}
                        </div>
                      ))}
                    </code>
                  </pre>
                </div>

                {/* Deploy Button */}
                <Button
                  onClick={() => handleDeploy(node.id)}
                  disabled={deployingId === node.id || !node.is_vulnerable}
                  className={`w-full ${
                    node.is_vulnerable 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-green-600/30'
                  }`}
                >
                  {deployingId === node.id ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Deploying...
                    </>
                  ) : !node.is_vulnerable ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Secured
                    </>
                  ) : (
                    <>
                      <Rocket className="w-4 h-4 mr-2" />
                      Deploy Patch
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Skills;

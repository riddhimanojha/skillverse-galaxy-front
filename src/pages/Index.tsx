import { useState, useEffect } from "react";
import { ThreeGalaxyCanvas } from "@/components/galaxy/ThreeGalaxyCanvas";
import { ShootingStars } from "@/components/ShootingStars";
import { AegisLogo } from "@/components/aegis/AegisLogo";
import { AegisNavigation } from "@/components/aegis/AegisNavigation";
import { ThreatGalaxy } from "@/components/aegis/ThreatGalaxy";
import { OccamAgent } from "@/components/aegis/OccamAgent";
import { ThreatDashboard } from "@/components/aegis/ThreatDashboard";
import { useSecurityNodes } from "@/hooks/useSecurityNodes";
import { SecurityNode } from "@/types/securityNode";
import { Loader2 } from "lucide-react";

const Index = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const [selectedNode, setSelectedNode] = useState<SecurityNode | null>(null);

  const { nodes, loading, deployPatch, getStats } = useSecurityNodes();
  const stats = getStats();

  // Mouse tracking for parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Keyboard accessibility
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedNode(null);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  const handleNodeClick = (node: SecurityNode) => {
    setSelectedNode(node);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4 animate-fade-in">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto" />
          <p className="text-muted-foreground text-sm">Initializing Aegis Nebula...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Galaxy Background */}
      <ThreeGalaxyCanvas mousePosition={mousePosition} />
      
      {/* Shooting Stars */}
      <ShootingStars />

      {/* Branding */}
      <AegisLogo />
      
      {/* Navigation */}
      <AegisNavigation />

      {/* Threat Dashboard - Bottom Left */}
      <ThreatDashboard 
        activeThreats={stats.activeThreats}
        criticalThreats={stats.criticalThreats}
        highThreats={stats.highThreats}
        securedNodes={stats.securedNodes}
        total={stats.total}
      />

      {/* Occam Agent Sidebar - Bottom Right */}
      <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
        <OccamAgent
          selectedNode={selectedNode}
          onDeployPatch={deployPatch}
          onClose={() => setSelectedNode(null)}
        />
      </div>

      {/* Threat Galaxy - Stars/Nodes */}
      <div className="relative w-full h-screen pt-20">
        <ThreatGalaxy 
          nodes={nodes} 
          onNodeClick={handleNodeClick}
        />
      </div>
    </div>
  );
};

export default Index;

/**
 * ThreeGalaxyCanvas - Main R3F Canvas wrapper
 * Sets up the Three.js scene with optimized settings
 */

import { Canvas } from "@react-three/fiber";
import { GalaxyBackground } from "./GalaxyBackground";

interface ThreeGalaxyCanvasProps {
  mousePosition: { x: number; y: number };
}

export const ThreeGalaxyCanvas = ({ mousePosition }: ThreeGalaxyCanvasProps) => {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 65 }}
        gl={{
          antialias: false, // Disabled for performance
          alpha: true,
          powerPreference: "high-performance",
        }}
        dpr={[1, 1.5]} // Cap pixel ratio for performance
        style={{
          background: "radial-gradient(ellipse at center, hsl(270, 50%, 8%) 0%, hsl(260, 60%, 3%) 50%, hsl(250, 70%, 2%) 100%)",
        }}
      >
        <GalaxyBackground mousePosition={mousePosition} starCount={8000} />
      </Canvas>
    </div>
  );
};

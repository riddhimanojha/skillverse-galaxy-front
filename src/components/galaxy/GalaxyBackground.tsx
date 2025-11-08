/**
 * GalaxyBackground - React Three Fiber galaxy scene
 * High-performance cosmic background with stars and nebula
 */

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { NebulaMaterial } from "./NebulaShader";

interface GalaxyBackgroundProps {
  mousePosition: { x: number; y: number };
  starCount?: number;
}

export const GalaxyBackground = ({ 
  mousePosition, 
  starCount = 8000 
}: GalaxyBackgroundProps) => {
  const nebulaRef = useRef<NebulaMaterial>(null);
  const starsRef = useRef<THREE.Points>(null);
  const galaxyGroupRef = useRef<THREE.Group>(null);

  // Smooth mouse tracking
  const smoothMouse = useRef({ x: 0, y: 0 });

  // Create nebula material instance
  const nebulaMaterial = useMemo(() => new NebulaMaterial(), []);

  // Create star geometry with colors (memoized)
  const { starGeometry, starMaterial } = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    
    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3;
      
      // Spherical distribution
      const radius = 20 + Math.random() * 30;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi) - 25;
      
      // Color mix: purple/cyan/white
      const choice = Math.random();
      if (choice < 0.5) {
        // Purple stars
        colors[i3] = 0.7 + Math.random() * 0.3;
        colors[i3 + 1] = 0.5 + Math.random() * 0.3;
        colors[i3 + 2] = 1;
      } else if (choice < 0.8) {
        // Cyan stars
        colors[i3] = 0.4 + Math.random() * 0.2;
        colors[i3 + 1] = 0.7 + Math.random() * 0.3;
        colors[i3 + 2] = 1;
      } else {
        // White stars
        colors[i3] = 1;
        colors[i3 + 1] = 1;
        colors[i3 + 2] = 1;
      }
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
      size: 0.03,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });
    
    return { starGeometry: geometry, starMaterial: material };
  }, [starCount]);

  // Animation loop
  useFrame((state, delta) => {
    // Update nebula shader time
    if (nebulaRef.current) {
      nebulaRef.current.uniforms.time.value += delta * 0.3;
    }

    // Smooth mouse interpolation (lerp)
    smoothMouse.current.x += (mousePosition.x - 0.5 - smoothMouse.current.x) * 0.03;
    smoothMouse.current.y += (mousePosition.y - 0.5 - smoothMouse.current.y) * 0.03;

    // Gentle parallax effect on entire galaxy
    if (galaxyGroupRef.current) {
      galaxyGroupRef.current.rotation.y += delta * 0.02; // Slow rotation
      galaxyGroupRef.current.rotation.x = smoothMouse.current.y * 0.15;
      galaxyGroupRef.current.position.x = smoothMouse.current.x * 2;
      galaxyGroupRef.current.position.y = -smoothMouse.current.y * 2;
    }

    // Subtle star drift
    if (starsRef.current) {
      starsRef.current.rotation.y += delta * 0.015;
      starsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
    }
  });

  return (
    <group ref={galaxyGroupRef}>
      {/* Nebula sphere with custom shader */}
      <mesh>
        <sphereGeometry args={[40, 32, 32]} />
        <primitive ref={nebulaRef} object={nebulaMaterial} attach="material" />
      </mesh>

      {/* Star field */}
      <points ref={starsRef} geometry={starGeometry} material={starMaterial} />

      {/* Ambient cosmic lighting */}
      <ambientLight intensity={0.3} color="#6b46c1" />
      <pointLight position={[10, 10, 10]} intensity={2} color="#9333ea" distance={50} />
      <pointLight position={[-10, -10, 5]} intensity={1.5} color="#3b82f6" distance={40} />
    </group>
  );
};

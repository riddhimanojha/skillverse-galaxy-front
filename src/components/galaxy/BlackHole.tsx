/**
 * BlackHole - Shader-based black hole effect
 * Creates a swirling gravitational distortion effect
 */

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface BlackHoleProps {
  position: [number, number, number];
  size?: number;
}

export const BlackHole = ({ position, size = 0.5 }: BlackHoleProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = state.clock.elapsedTime;
    }
    if (meshRef.current) {
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.1;
    }
  });

  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform float time;
    varying vec2 vUv;
    
    void main() {
      vec2 center = vec2(0.5, 0.5);
      vec2 pos = vUv - center;
      float dist = length(pos);
      float angle = atan(pos.y, pos.x) + time * 0.2;
      
      // Create swirling effect
      float spiral = sin(dist * 15.0 - angle * 5.0 + time);
      float ring = smoothstep(0.0, 0.3, dist) * smoothstep(0.5, 0.3, dist);
      
      // Purple/magenta colors
      vec3 color1 = vec3(0.5, 0.0, 0.8); // Purple
      vec3 color2 = vec3(0.8, 0.0, 0.5); // Magenta
      vec3 color = mix(color1, color2, spiral * 0.5 + 0.5);
      
      // Black hole center
      float center_mask = 1.0 - smoothstep(0.0, 0.15, dist);
      color = mix(color, vec3(0.0), center_mask);
      
      // Apply ring and fade out edges
      float alpha = ring * (1.0 - center_mask) * 0.6;
      
      gl_FragColor = vec4(color, alpha);
    }
  `;

  return (
    <mesh ref={meshRef} position={position}>
      <planeGeometry args={[size * 2, size * 2, 1, 1]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          time: { value: 0 },
        }}
        transparent
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
};

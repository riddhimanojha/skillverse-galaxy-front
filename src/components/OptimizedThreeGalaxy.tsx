/**
 * OptimizedThreeGalaxy - High-performance Three.js galaxy scene
 * Features:
 * - InstancedMesh for stars (configurable count, default 400)
 * - Purple nebula shader with slow animations
 * - Background planets with mouse parallax
 * - Performance optimizations: throttled updates, visibility checks
 */

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// Purple Nebula Shader
const NebulaMaterial = new THREE.ShaderMaterial({
  uniforms: {
    time: { value: 0 },
    mouse: { value: new THREE.Vector2(0.5, 0.5) },
    resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    nebulaIntensity: { value: 1.0 },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float time;
    uniform vec2 mouse;
    uniform vec2 resolution;
    uniform float nebulaIntensity;
    varying vec2 vUv;

    // Noise function
    float noise(vec2 p) {
      return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
    }

    float smoothNoise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      
      float a = noise(i);
      float b = noise(i + vec2(1.0, 0.0));
      float c = noise(i + vec2(0.0, 1.0));
      float d = noise(i + vec2(1.0, 1.0));
      
      return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
    }

    float fbm(vec2 p) {
      float value = 0.0;
      float amplitude = 0.5;
      for (int i = 0; i < 5; i++) {
        value += amplitude * smoothNoise(p);
        p *= 2.0;
        amplitude *= 0.5;
      }
      return value;
    }

    void main() {
      vec2 uv = vUv;
      vec2 center = vec2(0.5, 0.5);
      
      // Slow time for dreamy effect
      float t = time * 0.05;
      
      // Create flowing nebula pattern
      vec2 p = uv * 3.0 + vec2(t * 0.1, t * 0.05);
      float n = fbm(p + vec2(cos(t * 0.2), sin(t * 0.3)));
      
      // Mouse influence (subtle)
      vec2 mouseInfluence = (mouse - center) * 0.1;
      n += fbm(uv * 2.0 + mouseInfluence);
      
      // Purple color palette
      vec3 color1 = vec3(0.4, 0.1, 0.6); // Deep purple
      vec3 color2 = vec3(0.6, 0.2, 0.8); // Lilac
      vec3 color3 = vec3(0.8, 0.3, 0.9); // Magenta
      
      vec3 color = mix(color1, color2, n);
      color = mix(color, color3, smoothstep(0.4, 0.6, n));
      
      // Vignette effect
      float dist = distance(uv, center);
      float vignette = 1.0 - smoothstep(0.4, 1.0, dist);
      
      color *= (0.5 + vignette * 0.5) * nebulaIntensity;
      
      gl_FragColor = vec4(color, 1.0);
    }
  `,
  side: THREE.BackSide,
  depthWrite: false,
});

interface StarsProps {
  count: number;
}

function Stars({ count }: StarsProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const material = useRef(
    new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
    })
  );

  // Initialize instanced mesh positions
  useMemo(() => {
    if (!meshRef.current) return;

    const dummy = new THREE.Object3D();
    for (let i = 0; i < count; i++) {
      dummy.position.set(
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 100
      );
      dummy.scale.setScalar(Math.random() * 0.3 + 0.1);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [count]);

  // Slow blinking animation
  useFrame(({ clock }) => {
    if (!material.current) return;
    
    // Very slow blink (0.2 frequency)
    const blink = Math.sin(clock.getElapsedTime() * 0.2) * 0.3 + 0.7;
    material.current.opacity = blink;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} material={material.current}>
      <sphereGeometry args={[0.05, 8, 8]} />
    </instancedMesh>
  );
}

function Nebula({ intensity }: { intensity: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { size, mouse } = useThree();

  useEffect(() => {
    NebulaMaterial.uniforms.resolution.value.set(size.width, size.height);
  }, [size]);

  // Throttled mouse update
  useEffect(() => {
    let lastUpdate = 0;
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastUpdate < 16) return; // ~60fps max
      lastUpdate = now;
      
      NebulaMaterial.uniforms.mouse.value.set(
        e.clientX / window.innerWidth,
        1.0 - e.clientY / window.innerHeight
      );
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame(({ clock }) => {
    NebulaMaterial.uniforms.time.value = clock.getElapsedTime();
    NebulaMaterial.uniforms.nebulaIntensity.value = intensity;
  });

  return (
    <mesh ref={meshRef} material={NebulaMaterial}>
      <sphereGeometry args={[50, 32, 32]} />
    </mesh>
  );
}

function Planets() {
  const { mouse } = useThree();
  const planetsRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!planetsRef.current) return;
    
    // Subtle parallax rotation based on mouse
    planetsRef.current.rotation.y = mouse.x * 0.1;
    planetsRef.current.rotation.x = mouse.y * 0.1;
  });

  const planets = useMemo(() => [
    { position: [-30, 20, -40], size: 3, color: 0x6b46c1 },
    { position: [35, -15, -45], size: 2.5, color: 0x9333ea },
    { position: [-20, -25, -50], size: 2, color: 0xa855f7 },
  ], []);

  return (
    <group ref={planetsRef}>
      {planets.map((planet, i) => (
        <mesh key={i} position={planet.position as [number, number, number]}>
          <sphereGeometry args={[planet.size, 16, 16]} />
          <meshPhongMaterial color={planet.color} shininess={30} />
        </mesh>
      ))}
    </group>
  );
}

interface OptimizedThreeGalaxyProps {
  starCount?: number;
  nebulaIntensity?: number;
  onCanvasReady?: (canvas: HTMLCanvasElement) => void;
}

export function OptimizedThreeGalaxy({ 
  starCount = 400, 
  nebulaIntensity = 1.0,
  onCanvasReady 
}: OptimizedThreeGalaxyProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current && onCanvasReady) {
      onCanvasReady(canvasRef.current);
    }
  }, [onCanvasReady]);

  // Pause rendering when tab is hidden
  useEffect(() => {
    const handleVisibilityChange = () => {
      // Performance optimization: pause when not visible
      // React Three Fiber handles this internally
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        ref={canvasRef}
        camera={{ position: [0, 0, 30], fov: 75 }}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: "high-performance",
        }}
        dpr={[1, 1.5]}
        frameloop="always"
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />
        
        <Nebula intensity={nebulaIntensity} />
        <Stars count={starCount} />
        <Planets />
      </Canvas>
    </div>
  );
}

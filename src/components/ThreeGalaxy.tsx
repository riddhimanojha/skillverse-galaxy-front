/**
 * ============================================
 * ThreeGalaxy - High-Performance Galaxy Background
 * ============================================
 * 
 * A self-contained React component that renders a beautiful, performant
 * galaxy background using three.js with optimized rendering techniques.
 * 
 * FEATURES:
 * - Ref-based animation (no setState in animation loop)
 * - Points system for efficient star rendering
 * - Smooth mouse parallax with linear interpolation
 * - Low-poly planets with subtle rotation
 * - Automatic pause when tab is hidden
 * - Responsive resize handling
 * - Mobile-optimized (capped DPR, reduced star count)
 * 
 * INSTALLATION:
 * npm install three
 * npm install @types/three (for TypeScript)
 * 
 * USAGE:
 * import { ThreeGalaxy } from './components/ThreeGalaxy';
 * 
 * <ThreeGalaxy
 *   mousePosition={{ x: 0.5, y: 0.5 }}
 *   starCount={800}
 *   maxStarSize={0.06}
 *   planetConfigs={[
 *     { color: 0x6b46c1, radius: 1.2, position: [-6, 3, -12] },
 *     { color: 0x3b82f6, radius: 1.8, position: [8, -4, -18] },
 *   ]}
 * />
 */

import { useEffect, useRef } from "react";
import * as THREE from "three";

// ============================================
// TYPES
// ============================================

interface PlanetConfig {
  color: number;
  radius: number;
  position: [number, number, number];
  rimColor?: number;
}

interface ThreeGalaxyProps {
  mousePosition: { x: number; y: number };
  starCount?: number;
  maxStarSize?: number;
  planetConfigs?: PlanetConfig[];
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Linear interpolation for smooth animations
 */
const lerp = (start: number, end: number, factor: number): number => {
  return start + (end - start) * factor;
};

/**
 * Mobile device detection for performance optimization
 */
const isMobileDevice = (): boolean => {
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768;
};

// ============================================
// DEFAULT CONFIGURATIONS
// ============================================

const DEFAULT_STAR_COUNT = 800;
const DEFAULT_MAX_STAR_SIZE = 0.06;
const DEFAULT_PLANETS: PlanetConfig[] = [
  { color: 0x6b46c1, radius: 1.2, position: [-6, 3, -12], rimColor: 0x9333ea },
  { color: 0x3b82f6, radius: 1.8, position: [8, -4, -18], rimColor: 0x60a5fa },
  { color: 0x8b5cf6, radius: 0.9, position: [-4, -5, -15], rimColor: 0xa78bfa },
];

// ============================================
// MAIN COMPONENT
// ============================================

export const ThreeGalaxy = ({
  mousePosition,
  starCount = DEFAULT_STAR_COUNT,
  maxStarSize = DEFAULT_MAX_STAR_SIZE,
  planetConfigs = DEFAULT_PLANETS,
}: ThreeGalaxyProps) => {
  // ============================================
  // REFS (No state updates in animation loop!)
  // ============================================
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const starsRef = useRef<THREE.Points | null>(null);
  const planetsRef = useRef<THREE.Mesh[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  
  // Smooth mouse tracking (lerped)
  const smoothMouseRef = useRef({ x: 0.5, y: 0.5 });
  
  // Performance flag
  const isMobile = useRef(isMobileDevice());

  // ============================================
  // SETUP & ANIMATION
  // ============================================
  useEffect(() => {
    if (!containerRef.current) return;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.fog = new THREE.Fog(0x0a0520, 15, 60);

    // Camera
    const camera = new THREE.PerspectiveCamera(
      65,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 5);
    cameraRef.current = camera;

    // Renderer (performance optimized)
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false, // Disabled for performance
      powerPreference: "high-performance",
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    // Cap pixel ratio to 1.5 for performance (key optimization!)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Adjust star count for mobile
    const effectiveStarCount = isMobile.current ? Math.min(starCount, 400) : starCount;

    // ============================================
    // STARFIELD (Points System)
    // ============================================
    const starGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(effectiveStarCount * 3);
    const colors = new Float32Array(effectiveStarCount * 3);
    const sizes = new Float32Array(effectiveStarCount);

    // Generate stars in spherical distribution
    for (let i = 0; i < effectiveStarCount; i++) {
      const i3 = i * 3;
      
      // Spherical positioning for natural spread
      const radius = 10 + Math.random() * 20;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi) - 15;

      // Cosmic color palette
      const colorChoice = Math.random();
      if (colorChoice < 0.4) {
        // Purple-tinted stars
        colors[i3] = 0.75 + Math.random() * 0.25;
        colors[i3 + 1] = 0.55 + Math.random() * 0.2;
        colors[i3 + 2] = 1;
      } else if (colorChoice < 0.7) {
        // Cyan-tinted stars
        colors[i3] = 0.4 + Math.random() * 0.2;
        colors[i3 + 1] = 0.75 + Math.random() * 0.25;
        colors[i3 + 2] = 1;
      } else {
        // White stars
        colors[i3] = 1;
        colors[i3 + 1] = 1;
        colors[i3 + 2] = 1;
      }

      // Variable sizes
      sizes[i] = Math.random() * maxStarSize;
    }

    starGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    starGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    starGeometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

    const starMaterial = new THREE.PointsMaterial({
      size: maxStarSize,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true, // Stars get smaller with distance
    });

    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);
    starsRef.current = stars;

    // ============================================
    // PLANETS (Low-poly spheres)
    // ============================================
    planetConfigs.forEach((config) => {
      const segments = isMobile.current ? 16 : 24; // Low-poly for performance
      const geometry = new THREE.SphereGeometry(config.radius, segments, segments);
      
      // Simple gradient-like material (no textures)
      const material = new THREE.MeshPhongMaterial({
        color: config.color,
        emissive: config.color,
        emissiveIntensity: 0.15,
        shininess: 8,
        flatShading: false,
      });

      const planet = new THREE.Mesh(geometry, material);
      planet.position.set(...config.position);

      // Optional rim glow
      if (config.rimColor) {
        const rimGeometry = new THREE.SphereGeometry(config.radius * 1.04, segments, segments);
        const rimMaterial = new THREE.MeshBasicMaterial({
          color: config.rimColor,
          transparent: true,
          opacity: 0.12,
          side: THREE.BackSide,
          blending: THREE.AdditiveBlending,
        });
        const rim = new THREE.Mesh(rimGeometry, rimMaterial);
        planet.add(rim);
      }

      scene.add(planet);
      planetsRef.current.push(planet);
    });

    // ============================================
    // LIGHTING
    // ============================================
    const ambientLight = new THREE.AmbientLight(0x4c1d95, 0.4);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x9333ea, 2.5, 50);
    pointLight1.position.set(8, 8, 8);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x3b82f6, 2, 45);
    pointLight2.position.set(-8, -6, 6);
    scene.add(pointLight2);

    // ============================================
    // ANIMATION LOOP (Ref-based, no setState!)
    // ============================================
    let time = 0;
    let lastTime = 0;

    const animate = (currentTime: number) => {
      // Pause when tab is hidden (CPU optimization)
      if (document.visibilityState === "hidden") {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      animationFrameRef.current = requestAnimationFrame(animate);
      
      // Delta time for frame-rate independence
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;
      time += deltaTime * 0.0005;

      // Smooth mouse tracking with lerp (key for buttery parallax!)
      smoothMouseRef.current.x = lerp(smoothMouseRef.current.x, mousePosition.x, 0.05);
      smoothMouseRef.current.y = lerp(smoothMouseRef.current.y, mousePosition.y, 0.05);

      // Camera parallax (subtle movement)
      const targetX = (smoothMouseRef.current.x - 0.5) * 1.2;
      const targetY = -(smoothMouseRef.current.y - 0.5) * 1.2;
      camera.position.x = lerp(camera.position.x, targetX, 0.08);
      camera.position.y = lerp(camera.position.y, targetY, 0.08);
      camera.lookAt(0, 0, 0);

      // Slow starfield drift
      if (starsRef.current) {
        starsRef.current.rotation.y = time * 0.03;
        starsRef.current.rotation.x = Math.sin(time * 0.1) * 0.05;
        
        // Subtle twinkle (update sizes periodically)
        const sizes = starsRef.current.geometry.attributes.size.array as Float32Array;
        for (let i = 0; i < sizes.length; i += 10) { // Update every 10th star for performance
          sizes[i] += Math.sin(time * 3 + i * 0.1) * 0.0008;
        }
        starsRef.current.geometry.attributes.size.needsUpdate = true;
      }

      // Planet rotation (very slow)
      planetsRef.current.forEach((planet, index) => {
        planet.rotation.y = time * 0.08 * (1 + index * 0.2);
        planet.rotation.x = time * 0.03;
        
        // Subtle parallax for planets
        const parallaxFactor = 0.15 * (index + 1);
        planet.position.x += ((smoothMouseRef.current.x - 0.5) * parallaxFactor - planet.position.x) * 0.02;
        planet.position.y += (-(smoothMouseRef.current.y - 0.5) * parallaxFactor - planet.position.y) * 0.02;
      });

      // Render
      renderer.render(scene, camera);
    };
    
    animationFrameRef.current = requestAnimationFrame(animate);

    // ============================================
    // RESIZE HANDLER
    // ============================================
    const handleResize = () => {
      if (!camera || !renderer) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    };
    window.addEventListener("resize", handleResize);

    // ============================================
    // CLEANUP (Critical for no memory leaks!)
    // ============================================
    return () => {
      // Cancel animation frame
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      // Remove resize listener
      window.removeEventListener("resize", handleResize);
      
      // Dispose star geometry and material
      if (starsRef.current) {
        starsRef.current.geometry.dispose();
        (starsRef.current.material as THREE.Material).dispose();
      }
      
      // Dispose planet geometries and materials
      planetsRef.current.forEach((planet) => {
        planet.geometry.dispose();
        (planet.material as THREE.Material).dispose();
        // Dispose rim meshes
        planet.children.forEach((child) => {
          if (child instanceof THREE.Mesh) {
            child.geometry.dispose();
            (child.material as THREE.Material).dispose();
          }
        });
      });

      // Remove canvas
      if (containerRef.current && renderer.domElement.parentNode) {
        containerRef.current.removeChild(renderer.domElement);
      }
      
      // Dispose renderer
      renderer.dispose();
    };
  }, [mousePosition, starCount, maxStarSize, planetConfigs]);

  // ============================================
  // RENDER
  // ============================================
  return (
    <div
      ref={containerRef}
      className="fixed inset-0 -z-10"
      style={{
        background: "radial-gradient(ellipse at center, hsl(260, 50%, 8%) 0%, hsl(250, 60%, 3%) 50%, hsl(240, 70%, 2%) 100%)",
      }}
    />
  );
};

/**
 * ============================================
 * PERFORMANCE TIPS
 * ============================================
 * 
 * 1. Star Count: Keep between 400-1000 for best balance
 * 2. DPR Cap: Limiting to 1.5 saves significant GPU cost
 * 3. Antialiasing: Disabled by default (enable only if needed)
 * 4. Mobile: Auto-reduces star count and detail
 * 5. Visibility: Animation pauses when tab is hidden
 * 6. Lerp: Smooth interpolation prevents janky movement
 * 7. BufferGeometry: Using Points for minimal draw calls
 * 
 * CUSTOMIZATION EXAMPLE:
 * 
 * <ThreeGalaxy
 *   mousePosition={{ x: mouseX, y: mouseY }}
 *   starCount={1000}
 *   maxStarSize={0.08}
 *   planetConfigs={[
 *     { color: 0xff0066, radius: 2, position: [10, 5, -20], rimColor: 0xff66aa },
 *     { color: 0x00ff99, radius: 1.5, position: [-8, -3, -15] },
 *   ]}
 * />
 */

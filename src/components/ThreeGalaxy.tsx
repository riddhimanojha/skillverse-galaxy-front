import { useEffect, useRef } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

interface ThreeGalaxyProps {
  mousePosition: { x: number; y: number };
}

// Mobile detection for performance optimization
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768;

export const ThreeGalaxy = ({ mousePosition }: ThreeGalaxyProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const composerRef = useRef<EffectComposer>();
  const starLayersRef = useRef<THREE.Points[]>([]);
  const planetsRef = useRef<THREE.Mesh[]>([]);
  const targetCameraPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    // ============================================
    // SCENE SETUP
    // ============================================
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.fog = new THREE.Fog(0x0a0520, 10, 50);

    // ============================================
    // CAMERA SETUP
    // ============================================
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.z = 5;
    cameraRef.current = camera;

    // ============================================
    // RENDERER SETUP (Optimized)
    // ============================================
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !isMobile, // Disable AA on mobile for FPS
      powerPreference: "high-performance",
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1 : 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // ============================================
    // POST-PROCESSING (Bloom Effect)
    // ============================================
    let composer: EffectComposer | null = null;
    if (!isMobile) {
      composer = new EffectComposer(renderer);
      composerRef.current = composer;

      const renderPass = new RenderPass(scene, camera);
      composer.addPass(renderPass);

      const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        0.6, // Strength
        0.4, // Radius
        0.85 // Threshold
      );
      composer.addPass(bloomPass);
    }

    // ============================================
    // MULTI-LAYER STARFIELD (Optimized)
    // ============================================
    const createStarLayer = (count: number, size: number, speed: number, depth: number) => {
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);
      const sizes = new Float32Array(count);

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        
        // Spherical distribution for more natural look
        const radius = depth + Math.random() * depth * 0.5;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);

        positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i3 + 2] = radius * Math.cos(phi) - depth;

        // Star colors (cosmic palette)
        const colorChoice = Math.random();
        if (colorChoice < 0.4) {
          // Purple stars
          colors[i3] = 0.8 + Math.random() * 0.2;
          colors[i3 + 1] = 0.6 + Math.random() * 0.2;
          colors[i3 + 2] = 1;
        } else if (colorChoice < 0.7) {
          // Cyan stars
          colors[i3] = 0.4 + Math.random() * 0.2;
          colors[i3 + 1] = 0.8 + Math.random() * 0.2;
          colors[i3 + 2] = 1;
        } else {
          // White stars
          colors[i3] = 1;
          colors[i3 + 1] = 1;
          colors[i3 + 2] = 1;
        }

        // Variable sizes for twinkle effect
        sizes[i] = size * (0.5 + Math.random() * 0.5);
      }

      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
      geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

      const material = new THREE.PointsMaterial({
        size: size,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        sizeAttenuation: true,
      });

      const stars = new THREE.Points(geometry, material);
      stars.userData = { speed, originalPositions: positions.slice() };
      scene.add(stars);
      starLayersRef.current.push(stars);

      return stars;
    };

    // Create 3 star layers with different depths and speeds
    const starCount = isMobile ? 1500 : 4000;
    createStarLayer(starCount, 0.03, 0.0002, 15); // Far layer
    createStarLayer(starCount * 0.6, 0.05, 0.0005, 10); // Mid layer
    createStarLayer(starCount * 0.3, 0.08, 0.001, 5); // Near layer

    // ============================================
    // PLANETS WITH RIM LIGHTING
    // ============================================
    const createPlanet = (radius: number, color: number, position: THREE.Vector3, rimColor: number) => {
      const geometry = new THREE.SphereGeometry(radius, isMobile ? 16 : 32, isMobile ? 16 : 32);
      
      // Main material
      const material = new THREE.MeshPhongMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: 0.2,
        shininess: 10,
        flatShading: false,
      });

      const planet = new THREE.Mesh(geometry, material);
      planet.position.copy(position);

      // Add subtle rim light effect with a second mesh
      const rimGeometry = new THREE.SphereGeometry(radius * 1.05, isMobile ? 16 : 32, isMobile ? 16 : 32);
      const rimMaterial = new THREE.MeshBasicMaterial({
        color: rimColor,
        transparent: true,
        opacity: 0.15,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
      });
      const rim = new THREE.Mesh(rimGeometry, rimMaterial);
      planet.add(rim);

      scene.add(planet);
      planetsRef.current.push(planet);

      return planet;
    };

    createPlanet(1.2, 0x6b46c1, new THREE.Vector3(-6, 3, -12), 0x9333ea);
    createPlanet(1.8, 0x3b82f6, new THREE.Vector3(8, -4, -18), 0x60a5fa);
    createPlanet(0.9, 0x8b5cf6, new THREE.Vector3(-4, -5, -15), 0xa78bfa);

    // ============================================
    // LIGHTING
    // ============================================
    const ambientLight = new THREE.AmbientLight(0x4c1d95, 0.3);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x9333ea, 3, 50);
    pointLight1.position.set(10, 10, 10);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x3b82f6, 2, 40);
    pointLight2.position.set(-10, -5, 5);
    scene.add(pointLight2);

    // ============================================
    // ANIMATION LOOP (Optimized for 60 FPS)
    // ============================================
    let time = 0;
    let frameCount = 0;

    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;
      frameCount++;

      // Smooth camera parallax (lerp for buttery movement)
      targetCameraPos.current.x = (mousePosition.x - 0.5) * 1.5;
      targetCameraPos.current.y = -(mousePosition.y - 0.5) * 1.5;

      camera.position.x += (targetCameraPos.current.x - camera.position.x) * 0.03;
      camera.position.y += (targetCameraPos.current.y - camera.position.y) * 0.03;
      camera.lookAt(0, 0, 0);

      // Animate star layers with parallax drift
      starLayersRef.current.forEach((starLayer, index) => {
        const speed = starLayer.userData.speed;
        starLayer.rotation.y += speed * (index + 1);
        starLayer.rotation.x = Math.sin(time * 0.0003) * 0.1;

        // Subtle twinkle effect (only every 3 frames for performance)
        if (frameCount % 3 === 0) {
          const sizes = starLayer.geometry.attributes.size.array as Float32Array;
          for (let i = 0; i < sizes.length; i++) {
            sizes[i] += Math.sin(time * 2 + i) * 0.001;
          }
          starLayer.geometry.attributes.size.needsUpdate = true;
        }
      });

      // Slow planet rotation
      planetsRef.current.forEach((planet, index) => {
        planet.rotation.y = time * 0.05 * (1 + index * 0.3);
        planet.rotation.x = time * 0.02;
      });

      // Render with or without post-processing
      if (composer) {
        composer.render();
      } else {
        renderer.render(scene, camera);
      }
    };
    animate();

    // ============================================
    // RESPONSIVE RESIZE
    // ============================================
    const handleResize = () => {
      if (!camera || !renderer) return;
      
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      
      if (composer) {
        composer.setSize(window.innerWidth, window.innerHeight);
      }
    };
    window.addEventListener("resize", handleResize);

    // ============================================
    // CLEANUP
    // ============================================
    return () => {
      window.removeEventListener("resize", handleResize);
      
      // Dispose geometries and materials
      starLayersRef.current.forEach((stars) => {
        stars.geometry.dispose();
        (stars.material as THREE.Material).dispose();
      });
      
      planetsRef.current.forEach((planet) => {
        planet.geometry.dispose();
        (planet.material as THREE.Material).dispose();
        planet.children.forEach((child) => {
          if (child instanceof THREE.Mesh) {
            child.geometry.dispose();
            (child.material as THREE.Material).dispose();
          }
        });
      });

      if (containerRef.current && renderer.domElement.parentNode) {
        containerRef.current.removeChild(renderer.domElement);
      }
      
      renderer.dispose();
      composer?.dispose();
    };
  }, [mousePosition]);

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

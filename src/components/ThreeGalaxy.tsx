import { useEffect, useRef } from "react";
import * as THREE from "three";

interface ThreeGalaxyProps {
  mousePosition: { x: number; y: number };
}

export const ThreeGalaxy = ({ mousePosition }: ThreeGalaxyProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const starsRef = useRef<THREE.Points>();
  const planetsRef = useRef<THREE.Mesh[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Nebula background gradient (using fog)
    scene.fog = new THREE.FogExp2(0x1a0a2e, 0.05);

    // Starfield particles
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 3000;
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 50;
      positions[i + 1] = (Math.random() - 0.5) * 50;
      positions[i + 2] = (Math.random() - 0.5) * 50;

      // Cosmic color palette
      const colorChoice = Math.random();
      if (colorChoice < 0.5) {
        // Purple-ish
        colors[i] = 0.7 + Math.random() * 0.3;
        colors[i + 1] = 0.5 + Math.random() * 0.3;
        colors[i + 2] = 1;
      } else if (colorChoice < 0.8) {
        // Cyan-ish
        colors[i] = 0.3 + Math.random() * 0.3;
        colors[i + 1] = 0.7 + Math.random() * 0.3;
        colors[i + 2] = 1;
      } else {
        // White
        colors[i] = 1;
        colors[i + 1] = 1;
        colors[i + 2] = 1;
      }
    }

    starGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    starGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const starMaterial = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });

    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);
    starsRef.current = stars;

    // Floating planets
    const planetData = [
      { radius: 0.8, color: 0x6b46c1, x: -3, y: 2, z: -5 },
      { radius: 1.2, color: 0x4299e1, x: 4, y: -2, z: -8 },
      { radius: 0.6, color: 0x9333ea, x: -2, y: -3, z: -6 },
    ];

    planetData.forEach((data) => {
      const geometry = new THREE.SphereGeometry(data.radius, 32, 32);
      const material = new THREE.MeshStandardMaterial({
        color: data.color,
        emissive: data.color,
        emissiveIntensity: 0.3,
        roughness: 0.5,
        metalness: 0.5,
      });
      const planet = new THREE.Mesh(geometry, material);
      planet.position.set(data.x, data.y, data.z);
      scene.add(planet);
      planetsRef.current.push(planet);
    });

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x6b46c1, 0.5);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x9333ea, 2, 100);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x4299e1, 1.5, 100);
    pointLight2.position.set(-5, -5, -5);
    scene.add(pointLight2);

    // Animation
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.001;

      // Rotate starfield slowly
      if (starsRef.current) {
        starsRef.current.rotation.y = time * 0.5;
        starsRef.current.rotation.x = time * 0.3;
      }

      // Rotate planets
      planetsRef.current.forEach((planet, index) => {
        planet.rotation.y = time * (1 + index * 0.5);
        planet.rotation.x = time * 0.3;
      });

      // Parallax camera movement
      if (cameraRef.current) {
        const targetX = (mousePosition.x - 0.5) * 2;
        const targetY = (mousePosition.y - 0.5) * 2;
        cameraRef.current.position.x += (targetX - cameraRef.current.position.x) * 0.05;
        cameraRef.current.position.y += (-targetY - cameraRef.current.position.y) * 0.05;
        cameraRef.current.lookAt(scene.position);
      }

      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return;
      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (containerRef.current && rendererRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      rendererRef.current?.dispose();
    };
  }, [mousePosition]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 -z-10"
      style={{
        background: "linear-gradient(180deg, hsl(var(--nebula-start)), hsl(var(--nebula-mid)), hsl(var(--nebula-end)))",
      }}
    />
  );
};

import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  size: number;
  twinkleSpeed: number;
  twinkleOffset: number;
}

interface Planet {
  x: number;
  y: number;
  radius: number;
  color: string;
  speed: number;
}

interface GalaxyCanvasProps {
  mousePosition: { x: number; y: number };
}

export const GalaxyCanvas = ({ mousePosition }: GalaxyCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const planetsRef = useRef<Planet[]>([]);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Initialize background stars (not skill stars)
    if (starsRef.current.length === 0) {
      for (let i = 0; i < 200; i++) {
        starsRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 1.5 + 0.5,
          twinkleSpeed: Math.random() * 0.02 + 0.01,
          twinkleOffset: Math.random() * Math.PI * 2,
        });
      }
    }

    // Initialize planets
    if (planetsRef.current.length === 0) {
      const planetColors = [
        "rgba(100, 120, 200, 0.3)",
        "rgba(200, 100, 150, 0.3)",
        "rgba(150, 200, 100, 0.3)",
        "rgba(200, 180, 100, 0.3)",
      ];
      
      for (let i = 0; i < 4; i++) {
        planetsRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 40 + 30,
          color: planetColors[i],
          speed: Math.random() * 0.3 + 0.1,
        });
      }
    }

    // Animation loop
    let time = 0;
    const animate = () => {
      time += 0.01;
      
      // Clear canvas with gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, "hsl(240, 30%, 3%)");
      gradient.addColorStop(1, "hsl(270, 25%, 8%)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Calculate parallax offsets
      const parallaxX = (mousePosition.x - 0.5) * 50;
      const parallaxY = (mousePosition.y - 0.5) * 50;

      // Draw planets with parallax
      planetsRef.current.forEach((planet, index) => {
        const parallaxFactor = (index + 1) * 0.3;
        const offsetX = parallaxX * parallaxFactor;
        const offsetY = parallaxY * parallaxFactor;

        ctx.save();
        ctx.globalAlpha = 0.6;
        
        // Planet with gradient
        const planetGradient = ctx.createRadialGradient(
          planet.x + offsetX,
          planet.y + offsetY,
          0,
          planet.x + offsetX,
          planet.y + offsetY,
          planet.radius
        );
        planetGradient.addColorStop(0, planet.color.replace("0.3", "0.5"));
        planetGradient.addColorStop(1, planet.color.replace("0.3", "0"));
        
        ctx.fillStyle = planetGradient;
        ctx.beginPath();
        ctx.arc(planet.x + offsetX, planet.y + offsetY, planet.radius, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
      });

      // Draw background stars with twinkle
      starsRef.current.forEach((star) => {
        const alpha = 0.5 + Math.sin(time * star.twinkleSpeed + star.twinkleOffset) * 0.5;
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [mousePosition]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10"
      style={{ background: "hsl(var(--background))" }}
    />
  );
};

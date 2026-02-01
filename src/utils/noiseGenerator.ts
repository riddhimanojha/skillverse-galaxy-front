// Simplex-inspired noise generator for smooth, organic motion
// Produces non-repeating, non-looping, asynchronous offsets per node

// Permutation table for noise generation
const PERM = new Uint8Array(512);
const GRAD = [
  [1, 1], [-1, 1], [1, -1], [-1, -1],
  [1, 0], [-1, 0], [0, 1], [0, -1]
];

// Initialize permutation table
(function initPerm() {
  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i++) p[i] = i;
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [p[i], p[j]] = [p[j], p[i]];
  }
  for (let i = 0; i < 512; i++) PERM[i] = p[i & 255];
})();

// 2D Simplex-like noise
function noise2D(x: number, y: number): number {
  const F2 = 0.5 * (Math.sqrt(3) - 1);
  const G2 = (3 - Math.sqrt(3)) / 6;
  
  const s = (x + y) * F2;
  const i = Math.floor(x + s);
  const j = Math.floor(y + s);
  
  const t = (i + j) * G2;
  const X0 = i - t;
  const Y0 = j - t;
  const x0 = x - X0;
  const y0 = y - Y0;
  
  const i1 = x0 > y0 ? 1 : 0;
  const j1 = x0 > y0 ? 0 : 1;
  
  const x1 = x0 - i1 + G2;
  const y1 = y0 - j1 + G2;
  const x2 = x0 - 1 + 2 * G2;
  const y2 = y0 - 1 + 2 * G2;
  
  const ii = i & 255;
  const jj = j & 255;
  
  const g0 = GRAD[PERM[ii + PERM[jj]] % 8];
  const g1 = GRAD[PERM[ii + i1 + PERM[jj + j1]] % 8];
  const g2 = GRAD[PERM[ii + 1 + PERM[jj + 1]] % 8];
  
  let n0 = 0, n1 = 0, n2 = 0;
  
  let t0 = 0.5 - x0 * x0 - y0 * y0;
  if (t0 >= 0) {
    t0 *= t0;
    n0 = t0 * t0 * (g0[0] * x0 + g0[1] * y0);
  }
  
  let t1 = 0.5 - x1 * x1 - y1 * y1;
  if (t1 >= 0) {
    t1 *= t1;
    n1 = t1 * t1 * (g1[0] * x1 + g1[1] * y1);
  }
  
  let t2 = 0.5 - x2 * x2 - y2 * y2;
  if (t2 >= 0) {
    t2 *= t2;
    n2 = t2 * t2 * (g2[0] * x2 + g2[1] * y2);
  }
  
  return 70 * (n0 + n1 + n2);
}

// Seeded random for consistent per-node values
export const seededRandom = (seed: number): number => {
  const x = Math.sin(seed * 12.9898 + seed * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

// Generate smooth noise-based drift offset
export const generateNoiseDrift = (
  seed: number, 
  time: number, 
  maxDrift: number = 4
): { x: number; y: number } => {
  // Use seed to create unique frequency and phase offsets
  const freqX = 0.00015 + seededRandom(seed) * 0.00008;
  const freqY = 0.00018 + seededRandom(seed * 2) * 0.00007;
  const phaseX = seededRandom(seed * 3) * 1000;
  const phaseY = seededRandom(seed * 4) * 1000;
  
  // Layer multiple octaves for organic feel
  const oct1 = noise2D(time * freqX + phaseX, seed * 0.1) * 0.6;
  const oct2 = noise2D(time * freqX * 2.3 + phaseX + 100, seed * 0.2) * 0.3;
  const oct3 = noise2D(time * freqX * 4.7 + phaseX + 200, seed * 0.3) * 0.1;
  
  const oct1y = noise2D(seed * 0.1, time * freqY + phaseY) * 0.6;
  const oct2y = noise2D(seed * 0.2, time * freqY * 2.1 + phaseY + 100) * 0.3;
  const oct3y = noise2D(seed * 0.3, time * freqY * 5.2 + phaseY + 200) * 0.1;
  
  const x = (oct1 + oct2 + oct3) * maxDrift;
  const y = (oct1y + oct2y + oct3y) * maxDrift;
  
  return { 
    x: Math.max(-maxDrift, Math.min(maxDrift, x)), 
    y: Math.max(-maxDrift, Math.min(maxDrift, y)) 
  };
};

// Generate breathing opacity for edges (slow, irregular)
export const generateBreathingOpacity = (
  seed: number, 
  time: number, 
  baseOpacity: number = 0.5,
  variance: number = 0.15
): number => {
  const freq = 0.0002 + seededRandom(seed * 5) * 0.00015;
  const phase = seededRandom(seed * 6) * 1000;
  
  const breath = noise2D(time * freq + phase, seed * 0.05);
  return baseOpacity + breath * variance;
};

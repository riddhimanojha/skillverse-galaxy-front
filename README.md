# SkillVerse - Galaxy Learning Platform

A demo-ready React frontend featuring an interactive 3D galaxy visualization for skill learning paths. Built with React Three Fiber, Three.js, and optimized for performance.

## Features

- **Optimized 3D Galaxy Scene**: Uses instancedMesh for efficient star rendering (configurable 100-1000 stars)
- **Purple Nebula Shader**: Custom GLSL shader with slow, dreamy animations
- **Background Planets**: Parallax-enabled planets that react to mouse movement
- **AI Chat Interface**: Interactive demo chat component
- **Skill Constellation**: Visual skill tree with unlockable nodes
- **Complete All + Screenshot**: Captures constellation state using html2canvas
- **Performance Optimized**: Throttled updates, visibility checks, memoization
- **LocalStorage Persistence**: All progress saved client-side

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Architecture

### Performance Optimizations

1. **InstancedMesh for Stars**: Renders hundreds of stars in a single draw call
2. **Slow Animation Frequency**: Star blink uses `sin(time * 0.2)` for low CPU usage
3. **Throttled Mouse Updates**: Limited to ~60fps max
4. **Visibility Checks**: Pauses rendering when tab is hidden (via React Three Fiber)
5. **Memoization**: React components memoized to prevent unnecessary re-renders
6. **Low-Poly Planets**: Simple spheres with basic phong shading

### Key Components

- **OptimizedThreeGalaxy**: Main Three.js scene with stars, nebula, planets
- **AIChat**: Focusable chat interface with demo messages
- **CompleteModal**: Celebration modal with constellation screenshot
- **Dashboard**: Stats panel with dev options (star count, nebula intensity)
- **DevOptions**: Configurable scene parameters with sliders

### Shader Details

The purple nebula shader uses:
- Fractal Brownian Motion (fbm) for organic patterns
- Three purple color stops (deep purple → lilac → magenta)
- Mouse-influenced noise displacement
- Vignette effect for depth
- Configurable intensity uniform

### Backend Integration Points

For production deployment, replace localStorage calls with API endpoints:

```typescript
// In src/utils/skillGraph.ts
export const saveProgress = async (completedSkills: Set<string>) => {
  // TODO: Replace with backend call
  // await fetch('/api/saveProgress', {
  //   method: 'POST',
  //   body: JSON.stringify({ skills: [...completedSkills] })
  // });
  localStorage.setItem("skillverse_completed", JSON.stringify([...completedSkills]));
};
```

## Configuration

### Adjusting Star Count

Default: 400 stars. Adjustable via Dev Options panel (100-1000).

```tsx
<OptimizedThreeGalaxy starCount={400} />
```

### Nebula Intensity

Default: 1.0. Adjustable via Dev Options (0-2.0).

```tsx
<OptimizedThreeGalaxy nebulaIntensity={1.0} />
```

### Skill Graph

Edit `src/utils/skillGraph.ts` to customize the skill tree structure.

## Accessibility

- Escape key closes panels
- Focusable buttons and inputs
- ARIA labels on interactive elements
- Keyboard navigation support
- "Back to chat" button focuses chat input

## Technologies

- React 18
- React Three Fiber (@react-three/fiber v8.18)
- Three.js
- html2canvas
- Tailwind CSS
- TypeScript

## License

MIT

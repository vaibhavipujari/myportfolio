/**
 * Centralized Three.js wrapper to prevent multiple instances
 * All Three.js imports MUST go through this file
 * 
 * IMPORTANT: Do NOT import @react-three/fiber or @react-three/drei anywhere else!
 * 
 * This file is the SINGLE source of truth for all Three.js related imports.
 * The vite.config.ts dedupes Three.js modules during build.
 */
import { Suspense } from 'react';

// SINGLE import of @react-three/fiber - do not import elsewhere
import { Canvas, useFrame, useThree } from '@react-three/fiber';

// SINGLE import of @react-three/drei - do not import elsewhere  
import { 
  OrbitControls, 
  PerspectiveCamera, 
  MeshDistortMaterial, 
  Sphere, 
  Box, 
  Points 
} from '@react-three/drei';

// Re-export everything from this single location
export { 
  Suspense,
  useFrame, 
  useThree,
  OrbitControls, 
  PerspectiveCamera, 
  MeshDistortMaterial, 
  Sphere, 
  Box, 
  Points 
};

/**
 * ThreeCanvas wrapper component
 * 
 * Use this instead of importing Canvas directly.
 * This ensures all Three.js usage goes through a single instance.
 * 
 * @example
 * <ThreeCanvas>
 *   <PerspectiveCamera />
 *   <YourScene />
 * </ThreeCanvas>
 */
export function ThreeCanvas({ 
  children, 
  className = '' 
}: { 
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Canvas 
      dpr={[1, 2]} 
      className={className}
      gl={{ 
        antialias: true,
        alpha: true 
      }}
    >
      <Suspense fallback={null}>
        {children}
      </Suspense>
    </Canvas>
  );
}

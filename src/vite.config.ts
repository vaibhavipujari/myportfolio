import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    // Deduplicate Three.js to prevent multiple instances
    dedupe: ['three', '@react-three/fiber', '@react-three/drei', 'react', 'react-dom'],
    alias: {
      // Ensure single instance of Three.js
      'three': 'three',
      '@react-three/fiber': '@react-three/fiber',
      '@react-three/drei': '@react-three/drei'
    }
  },
  optimizeDeps: {
    // Pre-bundle Three.js dependencies
    include: ['three', '@react-three/fiber', '@react-three/drei'],
    // Force optimization even in dev
    force: true,
    // Dedupe during optimization
    exclude: []
  },
  build: {
    // Rollup options for production builds
    rollupOptions: {
      output: {
        // Ensure Three.js goes into a single chunk
        manualChunks: {
          'three-vendor': ['three', '@react-three/fiber', '@react-three/drei']
        }
      }
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000
  }
});

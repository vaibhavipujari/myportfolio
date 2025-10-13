import { useState, useEffect } from 'react';

// Check WebGL support synchronously
function checkWebGLSupport(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (gl && gl instanceof WebGLRenderingContext) {
      const loseContext = gl.getExtension('WEBGL_lose_context');
      if (loseContext) {
        loseContext.loseContext();
      }
      return true;
    }
    return false;
  } catch (e) {
    return false;
  }
}

export function useWebGLSupport() {
  // Initialize with actual check to avoid rendering Canvas before detection
  const [isSupported, setIsSupported] = useState<boolean>(() => checkWebGLSupport());

  useEffect(() => {
    // Verify again after mount in case initial check failed
    const supported = checkWebGLSupport();
    if (supported !== isSupported) {
      setIsSupported(supported);
    }
  }, [isSupported]);

  return isSupported;
}

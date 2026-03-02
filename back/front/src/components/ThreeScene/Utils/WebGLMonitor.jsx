import React from 'react';
import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { isDevelopmentMode } from '@/utils/constants';

export function WebGLMonitor() {
  const { gl } = useThree();

  useEffect(() => {
    function handleContextLost(event) {
      event.preventDefault();
      console.error('WebGL context lost');
    }

    function handleContextRestored() {
      if (isDevelopmentMode) {
        console.log('WebGL context restored');
      }
    }

    const canvas = gl.domElement;
    canvas.addEventListener('webglcontextlost', handleContextLost);
    canvas.addEventListener('webglcontextrestored', handleContextRestored);

    return () => {
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      canvas.removeEventListener('webglcontextrestored', handleContextRestored);
    };
  }, [gl]);

  return null;
}

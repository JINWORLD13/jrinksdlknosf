import React from 'react';
import { Stars } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';

export default function SpinningStar(props) {
  const startRef = useRef(null);
  // useFrame은 React Three Fiber에서 Three.js의 렌더 루프에 연결되어 있으며, 명시적으로 중지하지 않으면 참조된 객체(startRef.current)가 메모리에 남아 있을 수 있습니다.
  const isAnimating = useRef(true); // 애니메이션 상태 관리

  useFrame((state, delta) => {
    if (isAnimating.current && startRef.current) {
      startRef.current.rotation.x += 0.0005 * delta;
      startRef.current.rotation.y += 0.005 * delta;
    }
  });

  useEffect(() => {
    return () => {
      isAnimating.current = false;
      if (startRef.current) {
        startRef.current.geometry?.dispose(); // BufferGeometry 해제
        startRef.current.material?.dispose(); // Material 해제
        if (startRef.current.material) {
          if (Array.isArray(startRef.current.material)) {
            startRef.current.material.forEach(mat => mat.dispose());
          } else {
            startRef.current.material.dispose();
          }
        }
        startRef.current = null; // 참조 제거
      }
    };
  }, []);

  const { scene } = useThree();
  useEffect(() => {
    return () => {
      scene.traverse(object => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(mat => mat.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
    };
  }, [scene]);

  return (
    <Stars
      ref={startRef}
      radius={1}
      depth={5}
      count={1000}
      factor={0.6}
      saturation={1}
      fade
      speed={0.5}
      visible={props?.visible}
    />
  );
}

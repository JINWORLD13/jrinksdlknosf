import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * 향상된 별 필드 파티클 효과
 * - 5000개의 별
 * - 다양한 색상: 흰색(60%), 푸른색(25%), 노란색(15%)
 * - 개별 반짝임: 각 별이 자체 속도로 반짝입니다
 * - 깊이감: 거리에 따라 크기가 조정되어 3D 공간감 제공
 * - 커스텀 셰이더: GLSL 셰이더로 부드러운 원형 파티클과 반짝임 효과
 * - 부드러운 회전: 느린 속도로 전체가 회전합니다
 */
export function EnhancedStarField({ count = 1500 }) {
  const pointsRef = useRef();
  const shaderMaterialRef = useRef();

  // 별 파티클 생성
  const [positions, colors, sizes, speeds] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const speeds = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // 구형 분포로 별 배치 - 좁은 범위에 밀집 배치
      const radius = Math.random() * 50 + 50; // 좁은 범위 (50-100)
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi) - 25; // 적절한 깊이

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // 색상 변화: 흰색(60%), 푸른색(25%), 노란색(15%)
      const colorType = Math.random();
      if (colorType < 0.6) {
        // 흰색 별 (60%)
        colors[i * 3] = 1;
        colors[i * 3 + 1] = 1;
        colors[i * 3 + 2] = 1;
      } else if (colorType < 0.85) {
        // 푸른색 별 (25%)
        colors[i * 3] = 0.6;
        colors[i * 3 + 1] = 0.8;
        colors[i * 3 + 2] = 1;
      } else {
        // 노란색 별 (15%)
        colors[i * 3] = 1;
        colors[i * 3 + 1] = 0.9;
        colors[i * 3 + 2] = 0.6;
      }

      // 크기 (거리에 따라 작아짐) - 밀집감을 위한 크기 조정
      sizes[i] = (Math.random() * 4 + 1.5) * (1 - radius / 100);

      // 반짝임 속도 (각 별마다 다름) - 개별 반짝임 (속도 증가)
      speeds[i] = Math.random() * 1.5 + 1.0;
    }

    return [positions, colors, sizes, speeds];
  }, [count]);

  // 커스텀 셰이더로 반짝임 효과
  const vertexShader = `
    attribute float size;
    attribute float speed;
    varying vec3 vColor;
    uniform float time;
    
    void main() {
      vColor = color;
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      
      // 반짝임 효과 - 각 별이 자체 속도로 반짝임 (크기 변화 100%까지)
      float twinkle = sin(time * speed + position.x * 10.0) * 0.5 + 0.5;
      float finalSize = size * (0.5 + twinkle * 1.0);
      
      gl_PointSize = finalSize * (500.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `;

  const fragmentShader = `
    varying vec3 vColor;
    uniform float time;
    
    void main() {
      // 원형 파티클 (부드러운 가장자리)
      vec2 center = gl_PointCoord - vec2(0.5);
      float dist = length(center);
      
      if (dist > 0.5) discard;
      
      float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
      alpha = alpha * alpha; // 더 부드러운 가장자리
      
      // 밝기 반짝임 추가
      float brightness = 0.6 + sin(time * 2.0) * 0.4;
      
      gl_FragColor = vec4(vColor * brightness, alpha);
    }
  `;

  // 애니메이션
  useFrame(state => {
    if (pointsRef.current) {
      // 부드러운 회전 - 느린 속도로 전체가 회전
      pointsRef.current.rotation.x += 0.0001;
      pointsRef.current.rotation.y += 0.0002;
    }

    // 셰이더 시간 업데이트
    if (shaderMaterialRef.current) {
      shaderMaterialRef.current.uniforms.time.value =
        state.clock.getElapsedTime();
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={count}
          array={sizes}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-speed"
          count={count}
          array={speeds}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={shaderMaterialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexColors
        uniforms={{
          time: { value: 0 },
        }}
      />
    </points>
  );
}

export default EnhancedStarField;

import React, { useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { MathUtils } from 'three';
//! 부드러운 전환 (해석 요청 시 줌아웃이 매끄럽게 이동)
//! 사용법 : <Canvas> 태그 내에서 <CameraController isWaiting={answerForm.isWaiting} />
const TARGET_FOV = 30;
const LERP_SPEED = 4;
export const CameraController = ({ isWaiting }) => {
  const { camera } = useThree();
  const targetZ = useRef(isWaiting ? 5 : 3);
  const targetFov = useRef(TARGET_FOV);

  useFrame((_, delta) => {
    targetZ.current = isWaiting ? 5 : 3;
    targetFov.current = TARGET_FOV;
    const t = 1 - Math.exp(-LERP_SPEED * Math.min(delta, 0.1));
    camera.position.x = MathUtils.lerp(camera.position.x, 0, t);
    camera.position.y = MathUtils.lerp(camera.position.y, 1.7, t);
    camera.position.z = MathUtils.lerp(camera.position.z, targetZ.current, t);
    camera.fov = MathUtils.lerp(camera.fov, targetFov.current, t);
    camera.updateProjectionMatrix();
  });

  return null;
};

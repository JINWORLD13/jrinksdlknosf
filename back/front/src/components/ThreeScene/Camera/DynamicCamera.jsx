import React from 'react';

import { useFrame, useThree, extend } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import { PerspectiveCamera } from 'three';
import { MathUtils, Vector3 } from 'three';
extend({ PerspectiveCamera: PerspectiveCamera });
//! 부드러운 전환
//! 사용법 : <Canvas> 태그 내에서 <DynamicCamera isWaiting={answerForm.isWaiting} />
//~ x축이 빨간색, y축이 연두색, z축이 파란색
const DEFAULT_LOOK_AHEAD_DISTANCE = 5;
export const DynamicCamera = ({
  isWaiting = false,
  isAnswered = false,
  answer,
  isReadyToShowDurumagi = false,
  isDoneAnimationOfBackground,
  selectedTarotMode,
  isVoucherModeOn,
  enableOrbitControls = false, // OrbitControls 활성화 여부
  targetPositionWhenMagicCircleVisible = [0, 1.2, 5.2],
  targetPositionWhenMagicCircleInvisible = [0, 1.7, 3],
  lookAtPositionWhenMagicCircleVisible = [0, 1.25, 1],
  lookAtPositionWhenMagicCircleInvisible = [0, 1.5, 1],
}) => {
  const { camera } = useThree();
  const targetPositionRef = useRef(new Vector3());
  const targetFovRef = useRef(30);
  const lookAtVecRef = useRef(new Vector3());
  const targetLookAtVecRef = useRef(new Vector3());
  const isStableRef = useRef(false);
  const _dir = useRef(new Vector3()).current;
  const prevEnableOrbitControlsRef = useRef(enableOrbitControls);
  const prevFovRef = useRef(30);
  const [isMagicCircleVisible, setMagicCircleVisible] = useState(true);
  const notInitialAdsMode = !(
    selectedTarotMode === 2 &&
    !isVoucherModeOn &&
    !isWaiting &&
    isAnswered &&
    !isReadyToShowDurumagi &&
    !isDoneAnimationOfBackground &&
    answer?.length === 0
  );

  useEffect(() => {
    setMagicCircleVisible(prev => {
      if (!notInitialAdsMode) return prev;
      return isWaiting || (isAnswered && !isReadyToShowDurumagi);
    });
    // isWaiting 상태가 변경될 때마다 목표 위치 업데이트
    const targetPosition = isMagicCircleVisible
      ? targetPositionWhenMagicCircleVisible
      : targetPositionWhenMagicCircleInvisible;
    targetPositionRef.current.set(...targetPosition);
    // 목표가 변경되었으므로 안정화 플래그 리셋
    isStableRef.current = false;
  }, [isMagicCircleVisible, isWaiting, isAnswered, isReadyToShowDurumagi]); //! isMagicCircleVisible 값이 바뀌면 반응하도록 의존성 설정 => useFrame 내부도 내용이 바뀌니 다시 호출(?).

  // OrbitControls가 꺼질 때(해석 요청 등) 현재 카메라 시선에서 부드럽게 전환되도록 lookAtVec 동기화
  useEffect(() => {
    if (prevEnableOrbitControlsRef.current && !enableOrbitControls) {
      // Orbit → 고정 카메라로 바뀌는 순간: 현재 카메라가 보는 지점을 lookAtVec에 반영해 lerp가 자연스럽게 시작되도록 함
      _dir.set(0, 0, -1).applyQuaternion(camera.quaternion);
      lookAtVecRef.current.copy(camera.position).addScaledVector(_dir, DEFAULT_LOOK_AHEAD_DISTANCE);
    }
    prevEnableOrbitControlsRef.current = enableOrbitControls;
  }, [enableOrbitControls, camera]);

  // OrbitControls가 활성화될 때 카메라를 올바른 위치로 초기화
  useEffect(() => {
    if (enableOrbitControls) {
      const targetPosition = isMagicCircleVisible
        ? targetPositionWhenMagicCircleVisible
        : targetPositionWhenMagicCircleInvisible;
      camera.position.set(...targetPosition);
      camera.fov = targetFovRef.current;
      camera.updateProjectionMatrix();
      const lookAtPosition = isMagicCircleVisible
        ? lookAtPositionWhenMagicCircleVisible
        : lookAtPositionWhenMagicCircleInvisible;
      lookAtVecRef.current.set(...lookAtPosition);
      camera.lookAt(lookAtVecRef.current);
    }
  }, [enableOrbitControls, isMagicCircleVisible]);

  // 프레임 독립 보간: 값이 작을수록 느리고 부드럽게 전환
  const LERP_SPEED = 2;
  const MAX_DELTA = 0.1;
  // frameloop 'never'→'always' 전환 시(제너럴→맞춤리딩 등) 첫 delta가 커져 확 튀는 것 방지
  const RESUME_DELTA_CAP = 0.02;
  useFrame((_, delta) => {
    // OrbitControls가 활성화되면 DynamicCamera 애니메이션 비활성화
    if (enableOrbitControls) {
      return;
    }

    const safeDelta =
      delta > 0.2 ? RESUME_DELTA_CAP : Math.min(delta, MAX_DELTA);
    const t = 1 - Math.exp(-LERP_SPEED * safeDelta);

    // 카메라가 목표 위치와 FOV에 거의 도달했는지 확인
    const positionDistance = camera.position.distanceTo(
      targetPositionRef.current
    );
    const fovDifference = Math.abs(camera.fov - targetFovRef.current);

    // 목표에 도달했으면 업데이트 중지 (렌더링 결과 동일, 성능 개선)
    if (positionDistance < 0.001 && fovDifference < 0.001) {
      if (!isStableRef.current) {
        // 한 번만 목표값으로 정확히 설정
        camera.position.copy(targetPositionRef.current);
        camera.fov = targetFovRef.current;
        camera.updateProjectionMatrix();

        // 목표 방향으로 lookAt 설정 (한 번만)
        const lookAtPosition = isMagicCircleVisible
          ? lookAtPositionWhenMagicCircleVisible
          : lookAtPositionWhenMagicCircleInvisible;
        targetLookAtVecRef.current.set(...lookAtPosition);
        lookAtVecRef.current.copy(targetLookAtVecRef.current);
        camera.lookAt(lookAtVecRef.current);

        isStableRef.current = true;
      }
      return;
    }

    // 목표가 변경되었으면 안정화 플래그 리셋
    if (
      isStableRef.current &&
      (positionDistance > 0.01 || fovDifference > 0.01)
    ) {
      isStableRef.current = false;
    }

    // 매 프레임 카메라 위치·FOV·시선을 부드럽게 보간 (해석 요청 중 줌아웃이 매끄럽게 이동)
    camera.position.lerp(targetPositionRef.current, t);

    const newFov = MathUtils.lerp(camera.fov, targetFovRef.current, t);
    if (Math.abs(newFov - prevFovRef.current) > 0.001) {
      camera.fov = newFov;
      prevFovRef.current = newFov;
      camera.updateProjectionMatrix();
    } else {
      camera.fov = newFov;
    }

    const lookAtPosition = isMagicCircleVisible
      ? lookAtPositionWhenMagicCircleVisible
      : lookAtPositionWhenMagicCircleInvisible;
    targetLookAtVecRef.current.set(...lookAtPosition);
    lookAtVecRef.current.lerp(targetLookAtVecRef.current, t);
    camera.lookAt(lookAtVecRef.current);
  });

  // useFrame(limitFPS((state, delta) => {}));

  return null;
};

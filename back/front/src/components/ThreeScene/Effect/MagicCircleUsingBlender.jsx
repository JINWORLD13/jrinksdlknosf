import React, {
  useRef,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';

// 이징 함수
function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

const MagicCircleUsingBlender = React.memo(function MagicCircleUsingBlender({
  initialPosition = [0.005, 1.3, 0.7],
  targetPosition = [0, 1.3, 0.7],
  scale = [0.5, 0.5, 0.5],
  color = new THREE.Color(`hsl(${(1 / 10) * 360}, 100%, 50%)`),
  rotateSpeed = 0.01 + 1 * 0.005,
  initialRotationAxis = new THREE.Vector3(1, 1, 1).normalize(),
  orbitAxis = new THREE.Vector3(1, 1, 1).normalize(),
  orbitSpeed = 0.5,
  expansionSpeed = 0.5,
  transitionDuration = 2,
  visible,
}) {
  const gltfResult = useGLTF('/assets/model/magic-circle/magicCircle.gltf');
  const { scene } = useMemo(() => gltfResult, [gltfResult]);
  const ref = useRef();
  const [position, setPosition] = useState(initialPosition);
  const [expanding, setExpanding] = useState(false);
  const [orbiting, setOrbiting] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [intensity, setIntensity] = useState(1);
  const [orbitAngle, setOrbitAngle] = useState(0);
  const [expansionProgress, setExpansionProgress] = useState(0);
  const [transitionProgress, setTransitionProgress] = useState(0);
  const [opacity, setOpacity] = useState(0);
  const [currentScale, setCurrentScale] = useState(scale.map(s => s * 0.5));
  const rotationRef = useRef(new THREE.Euler(0, 0, 0));
  const [preExpansionRotateSpeed, setPreExpansionRotateSpeed] = useState(
    rotateSpeed * 300
  );
  const lastExpandedPosition = useRef(initialPosition);

  // 이전 위치를 저장하기 위한 ref
  const previousPositionRef = useRef(initialPosition);
  // orbiting 시작 시의 위치를 저장
  const orbitStartPositionRef = useRef(null);

  const resetAnimation = useCallback(() => {
    setPosition(initialPosition);
    setExpanding(false);
    setOrbiting(false);
    setTransitioning(false);
    setIntensity(1);
    setOrbitAngle(0);
    setExpansionProgress(0);
    setTransitionProgress(0);
    setOpacity(0);
    rotationRef.current.set(0, 0, 0);
    setPreExpansionRotateSpeed(rotateSpeed * 300);
    lastExpandedPosition.current = initialPosition;
  }, [initialPosition, rotateSpeed]);

  useEffect(() => {
    if (visible) {
      resetAnimation();
      const timeout = setTimeout(() => {
        setExpanding(true);
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [visible]);

  const calculateOrbitPosition = useCallback(
    angle => {
      const orbitRadius = new THREE.Vector3(...targetPosition)
        .sub(new THREE.Vector3(...initialPosition))
        .length();
      return new THREE.Vector3(...initialPosition).add(
        new THREE.Vector3().setFromSphericalCoords(
          orbitRadius,
          orbitAxis.y * Math.PI + angle,
          orbitAxis.x * Math.PI * 2
        )
      );
    },
    [initialPosition, targetPosition, orbitAxis]
  );

  useFrame((state, delta) => {
    if (!visible) return;

    if (opacity < 1) {
      setOpacity(prev => Math.min(prev + delta, 0.5));
    }

    if (!expanding && !orbiting && !transitioning) {
      rotationRef.current.x +=
        preExpansionRotateSpeed * initialRotationAxis.x * delta;
      rotationRef.current.y +=
        preExpansionRotateSpeed * initialRotationAxis.y * delta;
      rotationRef.current.z +=
        preExpansionRotateSpeed * initialRotationAxis.z * delta;
      ref.current.setRotationFromEuler(rotationRef.current);
    } else if (expanding && !orbiting && !transitioning) {
      setExpansionProgress(prev => {
        const newProgress = prev + delta * expansionSpeed;
        if (newProgress >= 1) {
          lastExpandedPosition.current = position;
          // 확장 완료 후 잠시 대기
          if (!ref.current.waitTimer) {
            ref.current.waitTimer = setTimeout(() => {
              setTransitioning(true);
              ref.current.waitTimer = null;
            }, 500);
          }
          return 1;
        }
        return newProgress;
      });

      const easedProgress = easeOutCubic(expansionProgress);
      const newPosition = [
        THREE.MathUtils.lerp(
          initialPosition[0],
          targetPosition[0],
          easedProgress
        ),
        THREE.MathUtils.lerp(
          initialPosition[1],
          targetPosition[1],
          easedProgress
        ),
        THREE.MathUtils.lerp(
          initialPosition[2],
          targetPosition[2],
          easedProgress
        ),
      ];
      setPosition(newPosition);

      const newScale = scale.map(s => s * (0.1 + 0.9 * easedProgress));
      setCurrentScale(newScale);
    } else if (transitioning) {
      setTransitionProgress(prev => {
        const newProgress = prev + delta / (transitionDuration * 0.5);
        if (newProgress >= 1) {
          setTransitioning(false);
          setOrbiting(true);
          // orbit 시작 시의 위치 저장
          orbitStartPositionRef.current = new THREE.Vector3(...position);
          return 0;
        }
        return newProgress;
      });

      const easedTransition = easeInOutCubic(transitionProgress);
      const orbitStartPosition = calculateOrbitPosition(0);

      const transitionPosition = new THREE.Vector3(
        ...lastExpandedPosition.current
      ).lerp(orbitStartPosition, easedTransition);

      previousPositionRef.current = position;
      setPosition(transitionPosition.toArray());

      const lookAtPosition = new THREE.Vector3(...initialPosition);
      ref.current.lookAt(lookAtPosition);
    } else if (orbiting) {
      setTransitionProgress(prev => {
        const newProgress = prev + delta / transitionDuration;
        return newProgress >= 1 ? 1 : newProgress;
      });

      const easedTransition = easeInOutCubic(transitionProgress);

      // orbit 각도 업데이트
      setOrbitAngle(prev => prev + orbitSpeed * delta);

      // 목표 orbit 위치 계산
      const targetOrbitPosition = calculateOrbitPosition(orbitAngle);

      // 시작 위치에서 목표 위치로 부드럽게 보간
      let finalPosition;
      if (orbitStartPositionRef.current) {
        // orbit 시작 후 첫 프레임에서는 이전 위치에서 시작
        const startPos = orbitStartPositionRef.current;
        finalPosition = startPos.clone().lerp(
          new THREE.Vector3(...targetOrbitPosition),
          delta * 2 // 보간 속도 조절
        );
        // 다음 프레임을 위해 현재 위치 업데이트
        orbitStartPositionRef.current = finalPosition.clone();
      } else {
        finalPosition = new THREE.Vector3(...targetOrbitPosition);
      }

      previousPositionRef.current = position;
      setPosition(finalPosition.toArray());

      const lookAtPosition = new THREE.Vector3(...initialPosition);
      ref.current.lookAt(lookAtPosition);
    }

    setIntensity(Math.abs(Math.sin(state.clock.getElapsedTime())) * 2);
  });

  if (!visible) return null;

  return (
    <primitive
      ref={ref}
      object={scene.clone()}
      position={position}
      scale={currentScale}
    >
      <meshBasicMaterial
        color={color}
        transparent
        opacity={Math.min(opacity * 2, 1)}
        side={THREE.DoubleSide}
        depthWrite={false}
        emissive={color}
        emissiveIntensity={0.8}
        toneMapped={false}
      />
    </primitive>
  );
});

export function MagicCircleUsingBlenderGroup({
  position = [0.005, 1.25, 0],
  visible = true,
}) {
  const circles = useMemo(() => {
    const circleCount = 4; // 마법진 수

    return Array.from({ length: circleCount }, (_, i) => {
      const angle = (i / circleCount) * Math.PI * 2;
      const randomAxis = new THREE.Vector3(
        Math.random() - 0.5,
        Math.random() - 0.5,
        Math.random() - 0.5
      ).normalize();

      const rotationSize = 2.5; // 확장 및 공전 반경
      const targetPosition = [
        position[0] + Math.cos(angle) * 0.35 * rotationSize,
        position[1] + Math.sin(angle) * 0.35 * rotationSize,
        position[2] + (0.01 * rotationSize - 0.35), // Z축 변화 범위
      ];

      const color = new THREE.Color(
        `hsl(${(i / circleCount) * 360}, 100%, 70%)`
      );
      const rotateSpeed = 0.01 + i * 0.05; // 회전 속도
      const orbitSpeed = 0.1 + Math.random() * 0.01; // 공전 속도
      const expansionSpeed = 0.3 + Math.random() * 5;
      const circleSize = [1, 1, 1].map(value => value * 0.9);

      return (
        <MagicCircleUsingBlender
          key={i}
          initialPosition={position}
          targetPosition={targetPosition}
          scale={circleSize}
          color={color}
          rotateSpeed={rotateSpeed}
          initialRotationAxis={randomAxis}
          orbitAxis={randomAxis}
          orbitSpeed={orbitSpeed}
          expansionSpeed={expansionSpeed}
          visible={visible}
        />
      );
    });
  }, [position, visible]);

  return <group visible={visible}>{circles}</group>;
}
useGLTF.preload('/assets/model/magic-circle/magicCircle.gltf');
// 사용 예시:
// <MagicCircleGroup position={[0, 0, 0]} visible={true} />

//! 새로고친 거

//   useRef,
//   useState,
//   useEffect,
//   useMemo,
//   useCallback,

// // 이징 함수


//   visible,
//     rotateSpeed * 300
//   // 이전 위치를 저장하기 위한 ref
//   // orbiting 시작 시의 위치를 저장











//         ...lastExpandedPosition.current
//       ).lerp(orbitStartPosition, easedTransition);



//       // const easedTransition = easeInOutCubic(transitionProgress);

//       // orbit 각도 업데이트
//       setOrbitAngle(prev => prev + orbitSpeed * delta);

//       // 목표 orbit 위치 계산





//   if (!clonedScene || !visible) return null;






//     };
//   }, [scene]);







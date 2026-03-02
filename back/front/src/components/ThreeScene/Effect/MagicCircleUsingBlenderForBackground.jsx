import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useFrame, useThree, extend } from '@react-three/fiber';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
extend({ EffectComposer, Bloom });

import { limitFPS } from '../Utils/limitFPS.jsx';

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

const MagicCircleUsingBlender = React.forwardRef(({ count, ...props }, ref) => {
  const { scene, nodes, materials } = useGLTF(
    '/assets/model/magic-circle/magicCircle.gltf'
  );
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (scene && nodes && materials) {
      setIsLoaded(true);
    }
  }, [scene, nodes, materials]);

  if (!isLoaded) {
    return null;
  }

  const firstMesh = scene.children.find(child => child.isMesh);

  if (!firstMesh) {
    console.error('No mesh found in the GLTF model');
    return null;
  }

  return (
    <group ref={ref}>
      {Array.from({ length: count }, (_, index) => (
        <mesh
          key={index}
          geometry={firstMesh.geometry}
          material={firstMesh.material.clone()}
          {...props}
        />
      ))}
    </group>
  );
});

const MagicCircleWithGlowUsingBlender = React.memo(
  function MagicCircleWithGlowUsingBlender({
    initialPosition = [0.005, 1.3, 0],
    targetPosition = [0, 1.3, 0],
    initialScale = 0.15,
    expandedScale = 0.5,
    color = new THREE.Color(`hsl(${(1 / 10) * 360}, 100%, 50%)`),
    rotateSpeed = 0.01 + 1 * 0.005,
    initialRotationAxis = new THREE.Vector3(1, 1, 1).normalize(),
    expansionSpeed = 0.5,
    index,
    startExpansion,
  }) {
    const ref = useRef();
    const gltfResult = useGLTF('/assets/model/magic-circle/magicCircle.gltf');
    const { scene } = useMemo(() => gltfResult, [gltfResult]);
    const [position, setPosition] = useState(initialPosition);
    const [expanding, setExpanding] = useState(false);
    const [orbiting, setOrbiting] = useState(false);
    const [intensity, setIntensity] = useState(1);
    const [expansionProgress, setExpansionProgress] = useState(0);
    const [opacity, setOpacity] = useState(0);
    const [currentScale, setCurrentScale] = useState(initialScale);
    const rotationRef = useRef(new THREE.Euler(0, 0, 0));
    const [preExpansionRotateSpeed] = useState(rotateSpeed * 300);
    const rotationAngle = useRef(0);
    const { camera } = useThree();
    
    // 재사용을 위한 ref들 (렌더링 결과 동일, 성능 개선)
    const cameraDirectionRef = useRef(new THREE.Vector3(0, 0, -1));
    const rotationMatrixRef = useRef(new THREE.Matrix4());
    const rotationZRef = useRef(new THREE.Matrix4());
    const tempVectorRef = useRef(new THREE.Vector3());

    useEffect(() => {
      if (startExpansion) {
        setExpanding(true);
      }
    }, [startExpansion]);

    useFrame((state, delta) => {
      if (opacity < 1) {
        setOpacity(prev => Math.min(prev + delta, 0.5));
      }

      if (!expanding && !orbiting) {
        rotationRef.current.x +=
          preExpansionRotateSpeed * initialRotationAxis.x * delta;
        rotationRef.current.y +=
          preExpansionRotateSpeed * initialRotationAxis.y * delta;
        rotationRef.current.z +=
          preExpansionRotateSpeed * initialRotationAxis.z * delta;
        if (ref.current) {
          ref.current.rotation.copy(rotationRef.current);
        }
      } else {
        setExpansionProgress(prev => {
          const newProgress = prev + delta * expansionSpeed;
          return newProgress >= 1 ? 1 : newProgress;
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
          initialPosition[2],
        ];
        setPosition(newPosition);

        const newScale = THREE.MathUtils.lerp(
          initialScale,
          expandedScale,
          easedProgress
        );
        setCurrentScale(newScale);

        if (expansionProgress >= 1 && !orbiting) {
          setOrbiting(true);
        }

        if (ref.current) {
          // Vector3와 Matrix4 재사용 (렌더링 결과 동일, 성능 개선)
          cameraDirectionRef.current.set(0, 0, -1);
          cameraDirectionRef.current.applyQuaternion(camera.quaternion);

          rotationMatrixRef.current.lookAt(
            tempVectorRef.current.set(0, 0, 0),
            cameraDirectionRef.current,
            camera.up
          );

          // Y축 기준 90도 회전 적용 (Math.PI/2 라디안 = 90도)
          rotationZRef.current.makeRotationZ(Math.PI / 2);
          rotationMatrixRef.current.multiply(rotationZRef.current);

          if (orbiting) {
            rotationAngle.current += rotateSpeed * delta;
            rotationZRef.current.makeRotationZ(rotationAngle.current);
            rotationMatrixRef.current.multiply(rotationZRef.current);
          }

          ref.current.quaternion.setFromRotationMatrix(rotationMatrixRef.current);
        }
      }

      // time 재사용 (렌더링 결과 동일, 성능 개선)
      const elapsedTime = state.clock.getElapsedTime();
      setIntensity(Math.abs(Math.sin(elapsedTime)) * 2);
    });

    const clonedScene = useMemo(() => {
      const clone = scene.clone();
      clone.traverse(child => {
        if (child.isMesh) {
          const mat = child.material.clone();
          mat.color = color;
          mat.transparent = true;
          mat.opacity = opacity;
          mat.emissive = color.clone();
          mat.emissiveIntensity = 0.8;
          mat.toneMapped = false;
          child.material = mat;
        }
      });
      return clone;
    }, [scene, color, opacity]);

    return (
      <primitive
        ref={ref}
        object={clonedScene}
        position={position}
        scale={[currentScale, currentScale, currentScale]}
      />
    );
  }
);

export function MagicCircleGroupUsingBlenderForBackground({
  position = [0.005, 1.25, 0],
  setDoneAnimationOfBackground,
  visible,
  ...props
}) {
  const [key, setKey] = useState(0);
  const [startExpansion, setStartExpansion] = useState(false);
  const 궤적 = '원';
  const circleCount = 8;
  const spreadRadius = 1;
  const zRange = 0;

  useEffect(() => {
    if (visible) {
      setKey(prevKey => prevKey + 1);

      const expansionTimeout = setTimeout(() => {
        setStartExpansion(true);
      }, 3000);

      const DoneAnimationOfBackgroundtime = setTimeout(() => {
        setDoneAnimationOfBackground(true);
      }, 6000);

      return () => {
        clearTimeout(expansionTimeout);
        clearTimeout(DoneAnimationOfBackgroundtime);
      };
    } else if (!visible) {
      setStartExpansion(false);
    }
  }, [visible]);

  const circles = useMemo(() => {
    const circleArray = [];
    for (let i = 0; i < circleCount; i++) {
      let angle;
      let randomAxis;
      let targetPosition;
      if (궤적 === '원') {
        angle = (i / circleCount) * Math.PI * 2;
        randomAxis = new THREE.Vector3(
          Math.random() - 0.5,
          Math.random() - 0.5,
          Math.random() - 0.5
        ).normalize();
        targetPosition = [
          position[0] + Math.cos(angle) * spreadRadius,
          position[1] + Math.sin(angle) * spreadRadius,
          position[2] + (Math.random() - 0.5) * zRange,
        ];
      } else if (궤적 === '반원') {
        angle = (i / (circleCount - 1)) * Math.PI;
        randomAxis = new THREE.Vector3(
          Math.random() - 0.5,
          Math.random() - 0.5,
          Math.random() - 0.5
        ).normalize();
        targetPosition = [
          position[0] + Math.cos(angle) * spreadRadius,
          position[1] + Math.sin(angle) * spreadRadius,
          position[2] + (Math.random() - 0.5) * zRange,
        ];
      }

      let color;
      if (i === 6) {
        color = new THREE.Color(`hsl(${(i / circleCount) * 360}, 100%, 80%)`);
      } else if (i === 5) {
        color = new THREE.Color(`hsl(${(i / circleCount) * 360}, 100%, 80%)`);
      } else {
        color = new THREE.Color(`hsl(${(i / circleCount) * 360}, 100%, 70%)`);
      }
      const rotateSpeed = 0.1 + i * 0.09;
      const expansionSpeed = 1.5 + Math.random() * 0.1;

      circleArray.push(
        <MagicCircleWithGlowUsingBlender
          key={`${i}-${key}`}
          initialPosition={position}
          targetPosition={targetPosition}
          color={color}
          rotateSpeed={rotateSpeed}
          initialRotationAxis={randomAxis}
          expansionSpeed={expansionSpeed}
          index={i}
          initialScale={0.4}
          expandedScale={1}
          startExpansion={startExpansion}
          renderOrder={circleCount - i}
          {...props}
        />
      );
    }
    return circleArray;
  }, [
    circleCount,
    position,
    spreadRadius,
    zRange,
    key,
    props,
    궤적,
    startExpansion,
  ]);

  return visible ? (
    <>
      <group visible={visible}>{circles}</group>
      <EffectComposer>
        <Bloom
          intensity={0.9}
          luminanceThreshold={0.01}
          luminanceSmoothing={0.5}
          height={300}
        />
      </EffectComposer>
    </>
  ) : null;
}

useGLTF.preload('/assets/model/magic-circle/magicCircle.gltf');

//! 새로 고친거



//     index,
//     startExpansion,






//           initialScale,
//           expandedScale,
//           easedProgress
//         );
//         setCurrentScale(newScale);





//           rotationMatrix.multiply(rotationZ);










//   setDoneAnimationOfBackground,
//   visible,
//   ...props













// useGLTF.preload('/assets/model/magic-circle/magicCircle.gltf');

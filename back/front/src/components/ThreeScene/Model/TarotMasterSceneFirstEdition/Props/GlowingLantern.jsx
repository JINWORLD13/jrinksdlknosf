import React, { useState, useEffect, useMemo, useRef, memo } from 'react';

import { Sparkles, Shadow, Billboard } from '@react-three/drei';
import { LayerMaterial, Depth } from 'lamina';
import { extend, useFrame, useThree } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import {
  CustomBlending,
  AddEquation,
  SrcAlphaFactor,
  DstAlphaFactor,
} from 'three';
extend({ EffectComposer, Bloom });

export default memo(function GlowingLantern({
  size = 1,
  amount = 50,
  color = 'white',
  emissive,
  glow,
  setLightOn,
  visible,
  ...props
}) {
  const [isAmbientLightOn, setIsAmbientLightOn] = useState(true);
  const [isLighted, setIsLighted] = useState(true);
  const meshRefs = useRef([]); // 메쉬 참조
  const composerRef = useRef(); // EffectComposer 참조
  const { scene } = useThree();

  const switchAmbientLight = () => {
    if (isAmbientLightOn) {
      setIsAmbientLightOn(false);
      setLightOn(isLighted);
    } else {
      setIsAmbientLightOn(true);
      setLightOn(true);
    }
  };

  useEffect(() => {
    return () => {
      // 메쉬와 관련 리소스 정리
      meshRefs.current.forEach(mesh => {
        if (mesh) {
          mesh.geometry.dispose();
          mesh.material.dispose();
          scene.remove(mesh);
        }
      });
      meshRefs.current = [];

      // EffectComposer 정리
      if (composerRef.current) {
        composerRef.current.dispose();
        composerRef.current = null;
      }

    };
  }, [scene]);

  return (
    <>
      {isLighted === true ? (
        <>
          {/* <Glow
            scale={size * 8.5}
            near={3}
            color={glow || emissive || color}
            position={[0.8, 1, 1]}
          /> */}
          <Glow
            scale={size * 8.5 * 1.5}
            near={3}
            color={glow || emissive || color}
            position={[0.37, 1, 1.7]}
            // visible={visible}
          />
          <ambientLight intensity={2} />
        </>
      ) : null}
      {isLighted === false ? (
        <>
          <ambientLight
            intensity={`${isAmbientLightOn === true ? 2 : 0}`}
            // visible={visible}
          />
        </>
      ) : null}
      <mesh
        {...props}
        onClick={e => {
          e.stopPropagation();
          switchAmbientLight();
        }}
        // visible={visible}
      >
        <cylinderGeometry
          args={[0.03, 0.03, 0.15]} // CylinderGeometry 클래스의 생성자의 매개변수대 순으로 쓰되 특정 속성에 대한 값이 필요 없다면 해당 위치에 undefined를 전달하거나 생략ok
        />
        <meshPhysicalMaterial
          roughness={0}
          color={color}
          emissive={emissive || color}
          envMapIntensity={0.2}
        />
        <EffectComposer>
          <Bloom
            intensity={0.07}
            luminanceThreshold={0.01}
            luminanceSmoothing={0.5}
            height={300}
          />
        </EffectComposer>
      </mesh>
      <mesh
        position={[0.23, 1.019, 0.7]}
        onClick={e => {
          e.stopPropagation();
          if (isLighted === true) {
            setIsLighted(false);
            if (isAmbientLightOn === true) {
              setLightOn(true);
            } else {
              setLightOn(false);
            }
          } else {
            setIsLighted(true);
            setLightOn(true);
          }
        }}
        // visible={visible}
      >
        {/* <mesh
        position={[0.5, 1.019, 0.7]}
        onClick={e => {
          e.stopPropagation;
          if (isLighted === true) {
            setIsLighted(false);
          } else {
            setIsLighted(true);
          }
        }}
      > */}
        <cylinderGeometry
          args={[0.03, 0.03, 0.07]} // CylinderGeometry 클래스의 생성자의 매개변수대 순으로 쓰되 특정 속성에 대한 값이 필요 없다면 해당 위치에 undefined를 전달하거나 생략ok
          // visible={visible}
        />
        <meshPhysicalMaterial roughness={0} color={'gray'} />
        {isAmbientLightOn === true || isLighted === true ? (
          <Shadow
            rotation={[-Math.PI / 2, 0, 0]}
            scale={size * 2}
            position={[0, -0.035, 0]}
            color={emissive}
            opacity={0.5}
            // visible={visible}
          />
        ) : (
          <Shadow
            rotation={[-Math.PI / 2, 0, 0]}
            scale={size}
            position={[0, -0.035, 0]}
            color={emissive}
            opacity={0.5}
            // visible={visible}
          />
        )}
      </mesh>
    </>
  );
});

const Glow = ({
  color,
  scale = 0.1,
  near = -2,
  far = 1.4,
  position,
  visible,
}) => (
  <Billboard position={position}>
    <mesh>
      <circleGeometry args={[1 * scale, 150]} />
      <LayerMaterial
        transparent
        depthWrite={false}
        blending={CustomBlending}
        blendEquation={AddEquation}
        blendSrc={SrcAlphaFactor}
        blendDst={DstAlphaFactor}
      >
        <Depth
          colorA={color}
          colorB="black"
          alpha={1}
          mode="normal"
          near={near * scale}
          far={far * scale}
          origin={[0, 0, 0]}
        />
        <Depth
          colorA={color}
          colorB="black"
          alpha={0.5}
          mode="add"
          near={-40 * scale}
          far={far * 1.2 * scale}
          origin={[0, 0, 0]}
        />
        <Depth
          colorA={color}
          colorB="black"
          alpha={1}
          mode="add"
          near={-15 * scale}
          far={far * 0.7 * scale}
          origin={[0, 0, 0]}
        />
        <Depth
          colorA={color}
          colorB="black"
          alpha={1}
          mode="add"
          near={-10 * scale}
          far={far * 0.68 * scale}
          origin={[0, 0, 0]}
        />
      </LayerMaterial>
    </mesh>
  </Billboard>
);



